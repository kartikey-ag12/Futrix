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
      return NextResponse.json({ accounts: [] });
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
    
    // Fetch Chart of Accounts and Invoices
    const [accountsResponse, invoicesResponse] = await Promise.all([
      xero.accountingApi.getAccounts(integration.tenantId!),
      xero.accountingApi.getInvoices(integration.tenantId!)
    ]);
    const accounts = accountsResponse.body.accounts || [];
    const invoices = invoicesResponse.body.invoices || [];

    // Calculate YTD amounts and Days to Pay per account
    const accountYtd: Record<string, number> = {};
    const accountInvoiceCounts: Record<string, number> = {};
    const accountDaysToPaySum: Record<string, number> = {};

    invoices.forEach((inv: any) => {
      const type = inv.type || inv.Type;
      const date = inv.date || inv.DateString ? new Date(inv.date || inv.DateString) : null;
      const dueDate = inv.dueDate || inv.DueDateString ? new Date(inv.dueDate || inv.DueDateString) : null;
      const fullyPaidOnDate = inv.fullyPaidOnDate ? new Date(inv.fullyPaidOnDate) : null;
      
      const lineItems = inv.lineItems || inv.LineItems || [];
      
      let daysToPay = 0;
      let hasDaysToPay = false;
      if (date && fullyPaidOnDate) {
        daysToPay = Math.max(0, Math.floor((fullyPaidOnDate.getTime() - date.getTime()) / (1000 * 3600 * 24)));
        hasDaysToPay = true;
      } else if (date && dueDate) {
        // Fallback to due date difference if not fully paid yet, just as a proxy metric
        daysToPay = Math.max(0, Math.floor((dueDate.getTime() - date.getTime()) / (1000 * 3600 * 24)));
        hasDaysToPay = true;
      }

      lineItems.forEach((item: any) => {
        const code = item.accountCode;
        if (!code) return;

        const amount = item.lineAmount || 0;
        accountYtd[code] = (accountYtd[code] || 0) + amount;

        if (hasDaysToPay) {
          accountDaysToPaySum[code] = (accountDaysToPaySum[code] || 0) + daysToPay;
          accountInvoiceCounts[code] = (accountInvoiceCounts[code] || 0) + 1;
        }
      });
    });

    const formattedAccounts = accounts.map(acc => {
      const ytd = accountYtd[acc.code || ''] || 0;
      const invoiceCount = accountInvoiceCounts[acc.code || ''] || 0;
      const daysToPay = invoiceCount > 0 ? Math.round(accountDaysToPaySum[acc.code || ''] / invoiceCount) : null;

      return {
        id: acc.accountID,
        code: acc.code,
        name: acc.name,
        type: acc.type,
        class: acc._class,
        status: acc.status,
        balance: ytd, // Using calculated YTD as balance
        daysToPay
      };
    });

    // Fetch AccountGroups for this workspace
    const accountGroups = await prisma.accountGroup.findMany({
      where: { workspaceId }
    });

    return NextResponse.json({ 
      accounts: formattedAccounts, 
      accountGroups,
      lastSync: new Date().toISOString()
    });
  } catch (error) {
    console.error("Failed to fetch Chart of Accounts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
