import { NextResponse } from "next/server";
import { XeroClient } from "xero-node";
import { cookies } from "next/headers";
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
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('futrix_access_token')?.value;

    if (!jwtToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const jwtPayload = await verifyAccessToken(jwtToken);
    if (!jwtPayload?.userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: jwtPayload.userId },
      orderBy: { role: 'asc' },
      select: { workspaceId: true },
    });

    if (!membership) {
      return NextResponse.json({ error: "No workspace found" }, { status: 404 });
    }

    const workspaceId = membership.workspaceId;

    let integration = await prisma.integration.findUnique({
      where: { workspaceId_provider: { workspaceId, provider: 'xero' } },
    });

    if (!integration?.accessToken || !integration?.tenantId) {
      return NextResponse.json({ invoices: [] });
    }

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
        const newExpiry = newTokenSet.expires_at
          ? Number(newTokenSet.expires_at)
          : Math.floor(Date.now() / 1000) + 1800;

        integration = await prisma.integration.update({
          where: { workspaceId_provider: { workspaceId, provider: 'xero' } },
          data: {
            accessToken: newTokenSet.access_token ?? integration.accessToken,
            refreshToken: newTokenSet.refresh_token ?? integration.refreshToken,
            expiresAt: newExpiry,
          },
        });
      } catch (refreshErr) {
        console.error("Xero token refresh failed:", refreshErr);
      }
    }

    xero.setTokenSet({ access_token: integration.accessToken! });

    // Fetch invoices with Status=AUTHORISED
    // The Xero API allows filtering via the `where` parameter in getInvoices
    const invoicesResponse = await xero.accountingApi.getInvoices(
      integration.tenantId!,
      undefined,
      'Status=="AUTHORISED"'
    );
    
    let rawInvoices = invoicesResponse.body.invoices || [];

    // Filter to only those that actually have an amount due
    rawInvoices = rawInvoices.filter((inv: any) => inv.amountDue > 0);

    const formattedInvoices = rawInvoices.map((inv: any) => {
      const type = inv.type === 'ACCREC' ? 'Invoice' : 'Bill';
      const contact = inv.contact?.name || 'Unknown';
      const amount = inv.total || 0;
      const amountDue = inv.amountDue || 0;
      const date = inv.dateString ? inv.dateString.split('T')[0] : '';
      const dueDate = inv.dueDateString ? inv.dueDateString.split('T')[0] : '';
      const reference = inv.reference || '';
      
      let isOverdue = false;
      let daysDiff = 0;

      if (dueDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const parsedDue = new Date(dueDate);
        parsedDue.setHours(0, 0, 0, 0);
        
        const diffTime = parsedDue.getTime() - today.getTime();
        daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        isOverdue = daysDiff < 0;
      }

      return {
        id: inv.invoiceID,
        type,
        contact,
        amount,
        amountDue,
        date,
        dueDate,
        reference,
        isOverdue,
        daysDiff
      };
    });

    // Sort so overdue/closest due are at the top
    formattedInvoices.sort((a, b) => a.daysDiff - b.daysDiff);

    return NextResponse.json({ invoices: formattedInvoices });
  } catch (error) {
    console.error("Failed to fetch due invoices:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
