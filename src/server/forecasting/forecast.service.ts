import { prisma } from "@/lib/prisma";
import { XeroClient } from "xero-node";

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID || '',
  clientSecret: process.env.XERO_CLIENT_SECRET || '',
  redirectUris: [process.env.XERO_REDIRECT_URI || 'http://localhost:3000/api/xero/callback'],
  scopes: 'openid profile email accounting.invoices accounting.settings.read offline_access'.split(' '),
});

// A simple structure for monthly amounts
type MonthlyData = Record<string, number>;

export class ForecastService {
  /**
   * Initializes Xero and handles token refresh if necessary
   */
  static async initXero(workspaceId: string) {
    let integration = await prisma.integration.findUnique({
      where: { workspaceId_provider: { workspaceId, provider: 'xero' } },
    });

    if (!integration?.accessToken || !integration?.tenantId) {
      return null;
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
        return null;
      }
    }

    xero.setTokenSet({ access_token: integration.accessToken! });
    return integration.tenantId;
  }

  static async generateForecastData(
    workspaceId: string, 
    months: string[], 
    overrides: any = {}, 
    method: "scratch" | "last-year" | "auto" = "auto"
  ) {
    const tenantId = await this.initXero(workspaceId);

    let accounts: any[] = [];
    let invoices: any[] = [];

    if (tenantId) {
      try {
        const [accRes, invRes] = await Promise.all([
          xero.accountingApi.getAccounts(tenantId),
          xero.accountingApi.getInvoices(tenantId)
        ]);
        accounts = accRes.body.accounts || [];
        invoices = invRes.body.invoices || [];
      } catch (e) {
        console.error("Failed to fetch Xero data for forecast", e);
      }
    }

    // Historical monthly aggregations
    // Keyed by account code, then month string like 'YYYY-MM'
    const histData: Record<string, Record<string, number>> = {};
    
    // Unpaid invoices / bills
    let totalUnpaidInvoices = 0;
    let totalUnpaidBills = 0;

    invoices.forEach((inv: any) => {
      const date = inv.date || inv.DateString ? new Date(inv.date || inv.DateString) : null;
      if (!date) return;
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

      const type = inv.type || inv.Type;
      const status = inv.status || inv.Status;
      const amountDue = inv.amountDue || inv.AmountDue || 0;

      if (status === 'AUTHORISED' && amountDue > 0) {
        if (type === 'ACCREC') totalUnpaidInvoices += amountDue;
        if (type === 'ACCPAY') totalUnpaidBills += amountDue;
      }

      const lineItems = inv.lineItems || inv.LineItems || [];
      lineItems.forEach((item: any) => {
        const code = item.accountCode;
        if (!code) return;
        if (!histData[code]) histData[code] = {};
        histData[code][monthKey] = (histData[code][monthKey] || 0) + (item.lineAmount || 0);
      });
    });

    const now = new Date();
    const trailingMonths: string[] = [];
    for (let i = 1; i <= 3; i++) {
      let d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      trailingMonths.push(`${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`);
    }

    const calculateAutoBaseline = (code: string) => {
      if (!histData[code]) return 0;
      let sum = 0;
      let count = 0;
      for (const tm of trailingMonths) {
        if (histData[code][tm] !== undefined) {
          sum += histData[code][tm];
          count++;
        }
      }
      return count > 0 ? sum / count : 0;
    };

    const parseMonthString = (mStr: string) => {
      // mStr like "AUG 26"
      const parts = mStr.split(" ");
      const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      const m = monthNames.indexOf(parts[0].toUpperCase());
      const y = parseInt(parts[1]) + 2000;
      return new Date(y, m, 1);
    };

    const getHistoricalValueForMonth = (code: string, monthDate: Date) => {
      if (!histData[code]) return 0;
      // Get same month from exactly 1 year ago
      const lastYearKey = `${monthDate.getFullYear() - 1}-${(monthDate.getMonth() + 1).toString().padStart(2, '0')}`;
      return histData[code][lastYearKey] || 0;
    };

    // Account Grouping logic (reusing same patterns as chart of accounts)
    const accountGroups = await prisma.accountGroup.findMany({ where: { workspaceId } });
    const getGroupedAccounts = (groupName: string, classFilters: string[]) => {
      const customGroup = accountGroups.find(g => g.name === groupName);
      if (customGroup) {
        return accounts.filter(a => customGroup.accountIds.includes(a.accountID || ''));
      }
      return accounts.filter(a => classFilters.includes(a._class || '') || classFilters.includes(a.type || ''));
    };

    // Helper to generate the 12 month array based on baseline and overrides
    const generateMonths = (code: string, isUnpaid: boolean = false, unpaidVal: number = 0) => {
      const autoBaseline = isUnpaid ? 0 : calculateAutoBaseline(code);

      return months.map((mStr, idx) => {
        let val = 0;
        if (isUnpaid) {
          val = idx === 0 ? unpaidVal : 0;
        } else {
          if (method === "auto") {
            val = autoBaseline;
          } else if (method === "last-year") {
            const mDate = parseMonthString(mStr);
            val = getHistoricalValueForMonth(code, mDate);
          } else {
            val = 0;
          }
        }

        // Check for manual overrides in Forecast JSON
        if (overrides[code] && overrides[code][mStr] !== undefined) {
          val = overrides[code][mStr];
        }
        return val;
      });
    };

    // Aggregate monthly arrays
    const sumMonthlyArrays = (arrays: number[][]) => {
      const result = new Array(months.length).fill(0);
      arrays.forEach(arr => {
        arr.forEach((v, i) => result[i] += v);
      });
      return result;
    };

    // --- Build Sections ---
    const salesAccs = accounts.filter(a => a._class === 'REVENUE' && ['SALES', 'REVENUE'].includes(a.type || ''));
    const otherRevAccs = accounts.filter(a => a._class === 'REVENUE' && !['SALES', 'REVENUE'].includes(a.type || ''));
    const costAccs = accounts.filter(a => ['DIRECTCOSTS'].includes(a.type || ''));
    const expenseAccs = getGroupedAccounts("Expenses", ['EXPENSE', 'OVERHEADS']);
    const assetAccs = getGroupedAccounts("Current Assets", ['ASSET', 'CURRENT', 'BANK', 'FIXED']);
    const liabilityAccs = getGroupedAccounts("Current Liabilities", ['LIABILITY', 'CURRENT', 'TERMLIAB']);

    const buildChildren = (accs: any[]) => {
      return accs.map(a => ({
        id: a.accountID,
        code: a.code,
        name: a.name,
        daysToPay: 0,
        months: generateMonths(a.code || '')
      }));
    };

    const salesChildren = [
      ...buildChildren(salesAccs),
      { id: "unpaid-inv", code: "unpaid-inv", name: "Unpaid invoices", daysToPay: 0, months: generateMonths("unpaid-inv", true, totalUnpaidInvoices), highlight: true }
    ];
    const salesTotals = sumMonthlyArrays(salesChildren.map(c => c.months));

    const otherRevChildren = buildChildren(otherRevAccs);
    const otherRevTotals = sumMonthlyArrays(otherRevChildren.map(c => c.months));

    const costsChildren = [
      ...buildChildren(costAccs),
      { id: "unpaid-bills", code: "unpaid-bills", name: "Unpaid bills", daysToPay: 0, months: generateMonths("unpaid-bills", true, totalUnpaidBills), highlight: true }
    ];
    const costsTotals = sumMonthlyArrays(costsChildren.map(c => c.months));

    const expenseChildren = buildChildren(expenseAccs);
    const expenseTotals = sumMonthlyArrays(expenseChildren.map(c => c.months));

    const assetsChildren = buildChildren(assetAccs);
    const assetsTotals = sumMonthlyArrays(assetsChildren.map(c => c.months));

    const liabilityChildren = buildChildren(liabilityAccs);
    const liabilityTotals = sumMonthlyArrays(liabilityChildren.map(c => c.months));

    // Summary Rows
    const plTotals = months.map((_, i) => salesTotals[i] + otherRevTotals[i] - costsTotals[i] - expenseTotals[i]);
    const bsTotals = months.map((_, i) => assetsTotals[i] - liabilityTotals[i]);
    
    // Cash Flow - Net movement
    const cashFlowNet = months.map((_, i) => salesTotals[i] + otherRevTotals[i] - costsTotals[i] - expenseTotals[i]);
    
    // Bank accounts for opening balance
    const bankAccounts = accounts.filter(a => a.type === 'BANK');
    let openingBankBalance = 0;
    bankAccounts.forEach(ba => {
      const code = ba.code || '';
      if (histData[code]) {
        openingBankBalance += Object.values(histData[code]).reduce((a, b) => a + b, 0);
      }
    });

    const cashPosition = [];
    let currentBalance = openingBankBalance;
    for (let i = 0; i < months.length; i++) {
      currentBalance += cashFlowNet[i];
      cashPosition.push(currentBalance);
    }

    return {
      months,
      cashPosition,
      tabs: {
        "invoices": {
          summary: salesTotals,
          groups: [
            { id: "sales-grp", name: "Sales", months: salesTotals, children: salesChildren }
          ]
        },
        "sales": {
          summary: salesTotals,
          groups: [
            { id: "sales-grp", name: "Sales", months: salesTotals, children: salesChildren }
          ]
        },
        "costs": {
          summary: costsTotals,
          groups: [
            { id: "costs-grp", name: "Costs", months: costsTotals, children: costsChildren }
          ]
        },
        "expenses": {
          summary: expenseTotals,
          groups: [
            { id: "exp-grp", name: "Expenses", months: expenseTotals, children: expenseChildren }
          ]
        },
        "other-pl": {
          summary: otherRevTotals,
          groups: [
            { id: "other-grp", name: "Other Income", months: otherRevTotals, children: otherRevChildren }
          ]
        },
        "assets": {
          summary: assetsTotals,
          groups: [
            { id: "asset-grp", name: "Current Assets", months: assetsTotals, children: assetsChildren }
          ]
        },
        "liabilities": {
          summary: liabilityTotals,
          groups: [
            { id: "liab-grp", name: "Current Liabilities", months: liabilityTotals, children: liabilityChildren }
          ]
        },
        "profit-loss": {
          summary: plTotals,
          groups: [
            { id: "pl-grp", name: "Profit & Loss", months: plTotals, children: [] }
          ]
        },
        "balance-sheet": {
          summary: bsTotals,
          groups: [
            { id: "bs-grp", name: "Balance Sheet", months: bsTotals, children: [] }
          ]
        },
        "cash-flow-statement": {
          summary: cashFlowNet,
          groups: [
            { id: "cf-grp", name: "Cash Flow Statement", months: cashFlowNet, children: [] }
          ]
        }
      }
    };
  }

  static async getForecastData(forecastId: string, workspaceId: string) {
    const forecast = await prisma.forecast.findUnique({
      where: { id: forecastId }
    });

    if (!forecast) throw new Error("Forecast not found");

    const dataObj = forecast.data as any;
    let months = dataObj?.months;
    if (!months) {
      months = [
        "AUG 26", "SEP 26", "OCT 26", "NOV 26", "DEC 26", 
        "JAN 27", "FEB 27", "MAR 27", "APR 27", "MAY 27", "JUN 27", "JUL 27"
      ];
    }

    const overrides = dataObj?.overrides || {};
    // For an existing forecast we default to 'auto' or 'scratch' depending on if we have base data
    // But realistically it just builds from overrides + base method logic.
    // Let's assume 'auto' is fallback. The overrides will override any auto baseline anyway if they saved it.
    const method = dataObj?.method || "auto";

    return this.generateForecastData(workspaceId, months, overrides, method);
  }
}
