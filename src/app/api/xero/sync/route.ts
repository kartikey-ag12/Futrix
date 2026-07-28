import { NextResponse } from "next/server";
import { XeroClient } from "xero-node";
import { cookies } from "next/headers";

// ─── Xero client singleton ────────────────────────────────────────────────────
const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID || "",
  clientSecret: process.env.XERO_CLIENT_SECRET || "",
  redirectUris: [process.env.XERO_REDIRECT_URI || "http://localhost:3000/api/xero/callback"],
  scopes: "openid profile email accounting.invoices accounting.settings.read offline_access".split(" "),
});

// ─── Silently refresh access token using refresh_token ───────────────────────
async function getValidTokens(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const accessToken = cookieStore.get("xero_access_token")?.value;
  const refreshToken = cookieStore.get("xero_refresh_token")?.value;
  const tenantId = cookieStore.get("xero_tenant_id")?.value;

  if (!tenantId) return null;

  // Set current token set and try to refresh
  try {
    xero.setTokenSet({
      access_token: accessToken || "",
      refresh_token: refreshToken || "",
    });

    // refreshToken() returns a new token set automatically
    if (refreshToken) {
      const newTokenSet = await xero.refreshToken();
      // Persist refreshed tokens back to cookies
      cookieStore.set("xero_access_token", newTokenSet.access_token || "", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      if (newTokenSet.refresh_token) {
        cookieStore.set("xero_refresh_token", newTokenSet.refresh_token, {
          path: "/",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 60, // 60 days
        });
      }
      return { accessToken: newTokenSet.access_token, tenantId };
    }
  } catch (refreshErr) {
    console.warn("[Xero Sync] Token refresh failed, using existing token:", refreshErr);
    // Fall through to use the existing access token
  }

  return { accessToken, tenantId };
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    const tokens = await getValidTokens(cookieStore);

    if (!tokens?.accessToken || !tokens?.tenantId) {
      return NextResponse.json({ error: "Not authenticated with Xero" }, { status: 401 });
    }

    const { accessToken, tenantId } = tokens;
    xero.setTokenSet({ access_token: accessToken });

    // ── 1. Organisation name ─────────────────────────────────────────────────
    let orgName = "Xero Organisation";
    try {
      const orgResponse = await xero.accountingApi.getOrganisations(tenantId);
      orgName = orgResponse.body.organisations?.[0]?.name || orgName;
    } catch (e) {
      console.warn("[Xero Sync] Could not fetch organisation name:", e);
    }

    // ── 2. Fetch ALL invoices with pagination ────────────────────────────────
    // Xero returns max 100 per page; fetch multiple pages until exhausted.
    const allInvoices: any[] = [];
    let page = 1;
    const pageSize = 100;

    while (true) {
      const res = await xero.accountingApi.getInvoices(
        tenantId,
        undefined, // ifModifiedSince
        undefined, // where
        undefined, // order
        undefined, // IDs
        undefined, // InvoiceNumbers
        undefined, // ContactIDs
        ["DRAFT", "SUBMITTED", "AUTHORISED", "PAID", "VOIDED", "DELETED"], // Statuses
        page,
        false,     // includeArchived
        false,     // createdByMyApp
        4,         // unitdp (4 decimal places)
        false      // summaryOnly – we need line item detail
      );

      const pageInvoices = res.body.invoices || [];
      allInvoices.push(...pageInvoices);

      // If fewer than pageSize returned, we've reached the last page
      if (pageInvoices.length < pageSize) break;
      page++;

      // Safety cap at 10 pages (1000 invoices) to avoid timeout
      if (page > 10) break;
    }

    console.log(`[Xero Sync] Fetched ${allInvoices.length} invoices (${page} page(s)) from ${orgName}`);

    // ── 3. Compute financial metrics ─────────────────────────────────────────
    let totalRevenue = 0;
    let totalExpenses = 0;
    const incomeItemsMap: Record<string, number> = {};
    const expenseCategoriesMap: Record<string, number> = {};

    // Monthly revenue/expense for cash-flow chart (last 12 months)
    const monthlyMap: Record<string, { revenue: number; expenses: number }> = {};

    allInvoices.forEach((inv: any) => {
      const type = inv.type; // SDK normalises to camelCase
      const total = Number(inv.total ?? 0);
      const status = inv.status;

      // Skip voided/deleted from financial totals
      if (status === "VOIDED" || status === "DELETED") return;

      // Category from first line item account code or description
      const lineItem = inv.lineItems?.[0];
      const category =
        lineItem?.accountCode ||
        lineItem?.description?.substring(0, 35) ||
        inv.contact?.name?.substring(0, 35) ||
        "General";

      // Monthly bucket (YYYY-MM)
      const dateStr = inv.date
        ? new Date(inv.date).toISOString().substring(0, 7)
        : new Date().toISOString().substring(0, 7);

      if (!monthlyMap[dateStr]) monthlyMap[dateStr] = { revenue: 0, expenses: 0 };

      if (type === "ACCREC") {
        totalRevenue += total;
        incomeItemsMap[category] = (incomeItemsMap[category] || 0) + total;
        monthlyMap[dateStr].revenue += total;
      } else if (type === "ACCPAY") {
        totalExpenses += total;
        expenseCategoriesMap[category] = (expenseCategoriesMap[category] || 0) + total;
        monthlyMap[dateStr].expenses += total;
      }
    });

    const netProfit = totalRevenue - totalExpenses;

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

    // ── 4. Build sorted monthly cash-flow array ──────────────────────────────
    const cashFlow = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-12) // last 12 months
      .map(([month, vals]) => ({
        month,
        revenue: vals.revenue,
        expenses: vals.expenses,
        profit: vals.revenue - vals.expenses,
      }));

    // ── 5. Build transactions list ───────────────────────────────────────────
    const transactions = allInvoices
      .filter((inv: any) => inv.status !== "VOIDED" && inv.status !== "DELETED")
      .map((inv: any, idx: number) => {
        const type = inv.type === "ACCREC" ? "revenue" : "expense";
        const amt = Number(inv.total ?? 0);
        const contactName = inv.contact?.name || "Xero Contact";
        const invoiceNo = inv.invoiceNumber || `INV-${idx + 1}`;
        const status = inv.status;

        return {
          id: inv.invoiceID || `xero-${idx}`,
          date: inv.date
            ? new Date(inv.date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          description: `${contactName} — ${invoiceNo}`,
          account: type === "revenue" ? "Sales Revenue" : "Operating Expenses",
          amount: type === "revenue" ? amt : -amt,
          type,
          status:
            status === "PAID" || status === "AUTHORISED" ? "cleared" : "pending",
          invoiceNumber: invoiceNo,
          contact: contactName,
          currency: inv.currencyCode || "USD",
          xeroStatus: status,
        };
      });

    return NextResponse.json({
      status: "success",
      message: `Successfully synced with Xero org: ${orgName}`,
      records_synced: allInvoices.length,
      metrics: {
        totalRevenue,
        totalExpenses,
        netProfit,
        healthScore: netProfit > 0 ? Math.min(99, Math.round(70 + (netProfit / totalRevenue) * 30)) : 50,
        incomeItems,
        expenseCategories,
        cashFlow,
      },
      transactions,
    });
  } catch (error: any) {
    console.error("[Xero Sync] Error:", error?.response?.body || error?.message || error);
    const detail =
      error?.response?.body?.Detail ||
      error?.response?.body?.Title ||
      error?.message ||
      "Failed to sync with Xero";
    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
