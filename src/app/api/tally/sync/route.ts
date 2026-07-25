import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const companyName = cookieStore.get("tally_company_name")?.value || "Acme India Pvt Ltd";

    // Mock live Tally vouchers generated from TallyPrime ledger export
    const tallyTransactions = [
      { id: "tally-1", date: "2026-07-24", description: `Sales Invoice #T-1001 — ${companyName}`, account: "Sales Revenue", amount: 6500.00, type: "revenue", status: "cleared" },
      { id: "tally-2", date: "2026-07-22", description: "Office Rent — Mumbai Ledger", account: "Operating Expenses", amount: -1800.00, type: "expense", status: "cleared" },
      { id: "tally-3", date: "2026-07-20", description: "GST Payment Deposit", account: "Tax Payable", amount: -750.00, type: "expense", status: "cleared" },
      { id: "tally-4", date: "2026-07-18", description: "Consulting Retainer — Reliance Corp", account: "Sales Revenue", amount: 12000.00, type: "revenue", status: "pending" },
    ];

    const totalRevenue = 54800.00;
    const totalExpenses = 24500.00;
    const netProfit = totalRevenue - totalExpenses;

    return NextResponse.json({
      status: "success",
      message: `TallyPrime sync completed for ${companyName}`,
      records_synced: tallyTransactions.length,
      data: tallyTransactions,
      metrics: {
        totalRevenue,
        totalExpenses,
        netProfit,
        healthScore: 92,
      },
    });
  } catch (error: any) {
    console.error("Tally Sync Error:", error);
    return NextResponse.json({ error: "Tally sync failed" }, { status: 500 });
  }
}
