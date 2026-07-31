import { NextResponse } from "next/server";
import { XeroClient, Invoice } from "xero-node";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID || '',
  clientSecret: process.env.XERO_CLIENT_SECRET || '',
  redirectUris: [process.env.XERO_REDIRECT_URI || 'http://localhost:3000/api/xero/callback'],
  scopes: 'openid profile email accounting.invoices accounting.settings.read offline_access'.split(' '),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contactName, description, amount, date } = body;

    // ── 1. Authenticate the calling user ─────────────────────────────────────
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('futrix_access_token')?.value;

    if (!jwtToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const jwtPayload = await verifyAccessToken(jwtToken);
    if (!jwtPayload?.userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // ── 2. Find the user's workspace ─────────────────────────────────────────
    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: jwtPayload.userId },
      orderBy: { role: 'asc' },
      select: { workspaceId: true },
    });

    if (!membership) {
      return NextResponse.json({ error: "No workspace found" }, { status: 404 });
    }

    const workspaceId = membership.workspaceId;

    // ── 3. Fetch Integration record from DB ──────────────────────────────────
    let integration = await prisma.integration.findUnique({
      where: { workspaceId_provider: { workspaceId, provider: 'xero' } },
    });

    if (!integration?.accessToken || !integration?.tenantId) {
      return NextResponse.json({ error: "Not authenticated with Xero" }, { status: 401 });
    }

    // ── 4. Refresh token if expired ──────────────────────────────────────────
    const nowSeconds = Math.floor(Date.now() / 1000);
    const isExpired = integration.expiresAt ? integration.expiresAt <= nowSeconds : true;

    await xero.initialize(); // REQUIRED for xero-node before calling refreshToken()

    if (isExpired && integration.refreshToken) {
      try {
        xero.setTokenSet({
          access_token: integration.accessToken,
          refresh_token: integration.refreshToken,
        });
        const newTokenSet = await xero.refreshToken();
        
        // Update DB
        integration = await prisma.integration.update({
          where: { id: integration.id },
          data: {
            accessToken: newTokenSet.access_token!,
            refreshToken: newTokenSet.refresh_token,
            expiresAt: newTokenSet.expires_in ? nowSeconds + newTokenSet.expires_in : null,
          },
        });
      } catch (err) {
        console.error("Failed to refresh Xero token for invoice:", err);
        return NextResponse.json({ error: "Xero session expired. Please reconnect." }, { status: 401 });
      }
    }

    xero.setTokenSet({ access_token: integration.accessToken });

    // Step 5: Create Invoice
    const newInvoice: Invoice = {
      type: Invoice.TypeEnum.ACCREC,
      contact: { name: contactName },
      date: date || new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
      lineItems: [
        {
          description: description,
          quantity: 1,
          unitAmount: parseFloat(amount),
          accountCode: "200" // Standard Revenue Account code in Xero Demo Company
        }
      ],
      status: Invoice.StatusEnum.DRAFT
    };

    const invoices = { invoices: [newInvoice] };
    const response = await xero.accountingApi.createInvoices(integration.tenantId, invoices);
    
    return NextResponse.json({
      status: "success",
      message: "Invoice created successfully in Xero",
      data: response.body.invoices?.[0]
    });

  } catch (error: any) {
    console.error("Xero create invoice error:", error);
    const xeroError = error.response?.body?.Elements?.[0]?.ValidationErrors?.[0]?.Message 
                   || error.body?.Elements?.[0]?.ValidationErrors?.[0]?.Message 
                   || error.message 
                   || "Failed to create invoice in Xero";
                   
    return NextResponse.json({ error: xeroError }, { status: 500 });
  }
}
