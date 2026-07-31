import { NextResponse } from "next/server";
import { ExcelService } from "@/server/excel/excel.service";
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
    // 1. Authenticate the calling user
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('futrix_access_token')?.value;

    if (!jwtToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const jwtPayload = await verifyAccessToken(jwtToken);
    if (!jwtPayload?.userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // 2. Find the user's workspace
    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: jwtPayload.userId },
      orderBy: { role: 'asc' },
      select: { workspaceId: true },
    });

    if (!membership) {
      return NextResponse.json({ error: "No workspace found" }, { status: 404 });
    }

    const workspaceId = membership.workspaceId;

    // 3. Fetch Integration record from DB
    let integration = await prisma.integration.findUnique({
      where: { workspaceId_provider: { workspaceId, provider: 'xero' } },
    });

    if (!integration?.accessToken || !integration?.tenantId) {
      return NextResponse.json({ error: "Not authenticated with Xero" }, { status: 401 });
    }

    // 4. Refresh token if expired
    const nowSeconds = Math.floor(Date.now() / 1000);
    const isExpired = integration.expiresAt ? integration.expiresAt <= nowSeconds : true;

    await xero.initialize();

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
        console.error("Failed to refresh Xero token for excel import:", err);
        return NextResponse.json({ error: "Xero session expired. Please reconnect." }, { status: 401 });
      }
    }

    xero.setTokenSet({ access_token: integration.accessToken });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse Excel file
    const invoicesData = await ExcelService.parseInvoicesExcel(buffer);

    if (invoicesData.length === 0) {
      return NextResponse.json({ error: "No valid invoices found in Excel file" }, { status: 400 });
    }

    // Prepare for Xero
    const xeroInvoices: Invoice[] = invoicesData.map(inv => ({
      type: Invoice.TypeEnum.ACCREC,
      contact: {
        name: inv.contactName
      },
      date: inv.date,
      dueDate: inv.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lineItems: [
        {
          description: inv.description,
          quantity: 1,
          unitAmount: inv.amount,
          accountCode: "200"
        }
      ],
      status: Invoice.StatusEnum.DRAFT
    }));

    // Send to Xero
    const response = await xero.accountingApi.createInvoices(integration.tenantId, { invoices: xeroInvoices });

    return NextResponse.json({
      status: "success",
      message: `Successfully imported ${response.body.invoices?.length || 0} invoices to Xero.`,
      count: response.body.invoices?.length || 0
    });

  } catch (error: any) {
    console.error("Excel import error:", error);
    const errorMessage = error.response?.body?.Elements?.[0]?.ValidationErrors?.[0]?.Message 
                   || error.body?.Elements?.[0]?.ValidationErrors?.[0]?.Message 
                   || error.message 
                   || "Failed to import invoices from Excel";
                   
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
