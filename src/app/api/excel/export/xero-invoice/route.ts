import { NextResponse } from "next/server";
import { XeroClient } from "xero-node";
import { cookies } from "next/headers";
import { ExcelService, XeroInvoiceData } from "@/server/excel/excel.service";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID || '',
  clientSecret: process.env.XERO_CLIENT_SECRET || '',
  redirectUris: [process.env.XERO_REDIRECT_URI || 'http://localhost:3000/api/xero/callback'],
  scopes: 'openid profile email accounting.invoices accounting.settings.read offline_access'.split(' '),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get("invoiceId");

    if (!invoiceId) {
      return NextResponse.json({ error: "Missing invoiceId" }, { status: 400 });
    }

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

    if (isExpired && integration.refreshToken) {
      try {
        xero.setTokenSet({
          access_token: integration.accessToken,
          refresh_token: integration.refreshToken,
        });
        const newTokenSet = await xero.refreshToken();
        
        integration = await prisma.integration.update({
          where: { id: integration.id },
          data: {
            accessToken: newTokenSet.access_token!,
            refreshToken: newTokenSet.refresh_token,
            expiresAt: newTokenSet.expires_in ? nowSeconds + newTokenSet.expires_in : null,
          },
        });
      } catch (err) {
        console.error("Failed to refresh Xero token for excel export:", err);
        return NextResponse.json({ error: "Xero session expired. Please reconnect." }, { status: 401 });
      }
    }

    xero.setTokenSet({ access_token: integration.accessToken });

    // Fetch the full invoice details from Xero
    const response = await xero.accountingApi.getInvoice(integration.tenantId, invoiceId);
    const invoice = response.body.invoices?.[0];

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found in Xero" }, { status: 404 });
    }

    // Generate a professional Excel invoice
    const buffer = await ExcelService.generateProfessionalXeroInvoice(invoice as unknown as XeroInvoiceData);

    const contactName = invoice.contact?.name || "Unknown";
    const invoiceNumber = invoice.invoiceNumber || invoiceId.substring(0, 8);
    const safeContactName = contactName.replace(/[\s\W]+/g, '_');

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="invoice_${safeContactName}_${invoiceNumber}.xlsx"`,
      },
    });
  } catch (error: any) {
    console.error("Xero Excel export error:", error);
    const xeroError = error.response?.body?.Elements?.[0]?.ValidationErrors?.[0]?.Message 
                   || error.message 
                   || "Failed to export Xero invoice";
                   
    return NextResponse.json({ error: xeroError }, { status: 500 });
  }
}
