import { NextResponse } from "next/server";
import { XeroClient } from "xero-node";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID || '',
  clientSecret: process.env.XERO_CLIENT_SECRET || '',
  redirectUris: [process.env.XERO_REDIRECT_URI || 'https://futrix-lake.vercel.app/api/xero/callback'],
  scopes: 'openid profile email accounting.invoices accounting.settings.read offline_access'.split(' '),
});

export async function POST(req: Request) {
  try {
    // ── 1. Authenticate the calling user ─────────────────────────────────────
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('futrix_access_token')?.value;
    const refreshToken = cookieStore.get('futrix_refresh_token')?.value;

    let jwtPayload = null;

    if (jwtToken) {
      jwtPayload = await verifyAccessToken(jwtToken);
    }
    
    if (!jwtPayload && refreshToken) {
      const { verifyRefreshToken } = await import("@/lib/auth/jwt");
      jwtPayload = await verifyRefreshToken(refreshToken);
    }

    if (!jwtPayload?.userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // ── 2. Find the user's workspace ─────────────────────────────────────────
    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: jwtPayload.userId },
      orderBy: { role: 'asc' },
      select: { workspaceId: true },
    });

    if (!membership) {
      return NextResponse.json({ error: "No workspace found for this user" }, { status: 404 });
    }

    const workspaceId = membership.workspaceId;

    // ── 3. Fetch Integration record from DB (NOT cookies) ────────────────────
    let integration = await prisma.integration.findUnique({
      where: { workspaceId_provider: { workspaceId, provider: 'xero' } },
    });

    if (!integration?.accessToken || !integration?.tenantId) {
      return buildSyncResponse([], undefined, null);
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
        const newExpiry = newTokenSet.expires_at
          ? Number(newTokenSet.expires_at)
          : Math.floor(Date.now() / 1000) + 1800;

        // Persist refreshed tokens back to DB
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
        // Proceed with existing token; Xero API will 401 if truly expired
      }
    }

    // ── 5. Call Xero API with workspace-scoped tokens ────────────────────────
    xero.setTokenSet({ access_token: integration.accessToken! });
    const tenantId = integration.tenantId!;

    // Fetch org details AND invoices in parallel
    const [orgResponse, invoicesResponse, pnlResponse] = await Promise.all([
      xero.accountingApi.getOrganisations(tenantId),
      xero.accountingApi.getInvoices(tenantId),
      xero.accountingApi.getReportProfitAndLoss(tenantId).catch(err => {
        console.warn("Could not fetch P&L report, falling back to invoice calculation", err.message);
        return null;
      })
    ]);

    const orgName = orgResponse.body.organisations?.[0]?.name;
    let invoices = invoicesResponse.body.invoices || [];
    const pnlReport = pnlResponse?.body?.reports?.[0];

    // Removed demo invoice injection for empty accounts

    return buildSyncResponse(invoices, orgName, pnlReport);
  } catch (error) {
    console.error("Xero sync error:", error);
    return NextResponse.json({ error: "Failed to sync with Xero" }, { status: 500 });
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

// serveDemoData removed for production purity

function buildSyncResponse(invoices: any[], orgName: string | undefined, pnlReport?: any) {
  let totalRevenue = 0;
  let totalExpenses = 0;
  const incomeItemsMap: Record<string, number> = {};
  const expenseCategoriesMap: Record<string, number> = {};
  const contactsMap: Record<string, any> = {};

  invoices.forEach((inv: any) => {
    const status = inv.status || inv.Status;
    if (['DRAFT', 'DELETED', 'VOIDED'].includes(status?.toUpperCase())) {
      return; // Skip invalid invoices for calculations
    }

    const type = inv.type || inv.Type;
    const total = inv.total || inv.Total || 0;
    const amountDue = inv.amountDue || inv.AmountDue || 0;
    const lineItem = inv.lineItems?.[0] || inv.LineItems?.[0];
    const category = lineItem?.accountCode || lineItem?.description || "General";
    
    const contactName = inv.Contact?.Name || inv.contact?.name || "Unknown";
    const contactType = type === 'ACCREC' ? 'Customer' : 'Supplier';

    if (!contactsMap[contactName]) {
      contactsMap[contactName] = {
        id: contactName,
        type: contactType,
        contact: contactName,
        totalDue: 0,
        totalOverdue: 0,
        totalInvoiced: 0,
        invoicesDue: 0,
        averageSale: 0,
        daysToPay: contactType === 'Customer' ? 30 : 14,
        dependence: 0,
        lastActivity: inv.DateString ? inv.DateString.split('T')[0] : new Date().toISOString().split('T')[0],
      };
    }

    contactsMap[contactName].totalInvoiced += total;
    if (amountDue > 0) {
      contactsMap[contactName].totalDue += amountDue;
      contactsMap[contactName].invoicesDue += 1;
      const dueDate = inv.DueDateString ? new Date(inv.DueDateString) : null;
      if (dueDate && dueDate < new Date()) {
        contactsMap[contactName].totalOverdue += amountDue;
      }
    }

    if (type === 'ACCREC') {
      totalRevenue += total;
      incomeItemsMap[category] = (incomeItemsMap[category] || 0) + total;
    } else if (type === 'ACCPAY') {
      totalExpenses += total;
      expenseCategoriesMap[category] = (expenseCategoriesMap[category] || 0) + total;
    }
  });

  const contacts = Object.values(contactsMap).map((c: any) => {
    c.averageSale = c.invoicesDue > 0 ? (c.totalInvoiced / c.invoicesDue) : c.totalInvoiced;
    c.dependence = totalRevenue > 0 && c.type === 'Customer' ? Math.round((c.totalInvoiced / totalRevenue) * 100) : 
                   (totalExpenses > 0 && c.type === 'Supplier' ? Math.round((c.totalInvoiced / totalExpenses) * 100) : 0);
    return c;
  });

  // Extract from P&L report if available, else use invoice fallback
  let netProfit = totalRevenue - totalExpenses;
  if (pnlReport && pnlReport.rows) {
    let pnlRevenue = 0;
    let pnlExpenses = 0;
    let pnlNetProfit = 0;

    pnlReport.rows.forEach((row: any) => {
      if (row.rowType === 'Section') {
        if (row.title === 'Operating Income' || row.title === 'Trading Income' || row.title === 'Revenue') {
          pnlRevenue = row.rows?.find((r: any) => r.rowType === 'SummaryRow')?.cells?.[0]?.value || pnlRevenue;
        }
        if (row.title === 'Operating Expenses' || row.title === 'Expenses') {
          pnlExpenses = row.rows?.find((r: any) => r.rowType === 'SummaryRow')?.cells?.[0]?.value || pnlExpenses;
        }
        if (row.title === 'Net Profit' || row.title === 'Net Income') {
          pnlNetProfit = row.rows?.find((r: any) => r.rowType === 'SummaryRow')?.cells?.[0]?.value || pnlNetProfit;
        }
      }
    });

    if (pnlRevenue > 0 || pnlExpenses > 0) {
      totalRevenue = pnlRevenue;
      totalExpenses = pnlExpenses;
      netProfit = pnlNetProfit !== 0 ? pnlNetProfit : (totalRevenue - totalExpenses);
    }
  }

  const incomeItems = Object.entries(incomeItemsMap).map(([label, amount], i) => ({
    code: `REV-${i + 1}`,
    label: label.substring(0, 35),
    category: "Operating Revenue",
    amount,
    pct: totalRevenue > 0 ? ((amount / totalRevenue) * 100).toFixed(1) + "%" : "0%",
  }));

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#ef4444", "#14b8a6"];
  const expenseCategories = Object.entries(expenseCategoriesMap).map(([label, amount], i) => ({
    id: `exp-${i}`,
    label: label.substring(0, 35),
    chartLabel: label.substring(0, 15),
    dept: "Operations",
    amount,
    color: COLORS[i % COLORS.length],
    pct: totalExpenses > 0 ? Number(((amount / totalExpenses) * 100).toFixed(1)) : 0,
    desc: `Expenses from ${label}`,
  }));

  const transactions = invoices.map((inv: any, idx: number) => {
    const type = (inv.type || inv.Type) === 'ACCREC' ? 'revenue' : 'expense';
    const amt = inv.total || inv.Total || 0;
    return {
      id: `xero-${idx}`,
      date: inv.DateString ? inv.DateString.split('T')[0] : new Date().toISOString().split('T')[0],
      description: `${inv.Contact?.Name || 'Xero Client'} — ${inv.InvoiceNumber || 'INV'}`,
      account: type === 'revenue' ? 'Sales Revenue' : 'Operating Expenses',
      amount: type === 'revenue' ? amt : -amt,
      type,
      status: (inv.Status || inv.status) === 'PAID' || (inv.Status || inv.status) === 'AUTHORISED' ? 'cleared' : 'pending',
    };
  });

  return NextResponse.json({
    status: "success",
    message: `Successfully synced with Xero org: ${orgName || 'Unknown'}`,
    records_synced: invoices.length,
    metrics: { totalRevenue, totalExpenses, netProfit, healthScore: 92, incomeItems, expenseCategories },
    transactions,
    contacts,
  });
}
