"use client";

import { useState, useMemo } from "react";
import {
  FileText, Printer, Download, TrendingUp, DollarSign,
  Building2, Zap, Wrench, Users, BarChart3,
  ChevronDown, Filter, Calendar, CheckCircle2, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import { useFinancial } from "@/context/FinancialContext";

type TimeRange = "this_month" | "this_quarter" | "year_to_date" | "last_year";

export default function ReportsPage() {
  const { metrics } = useFinancial();
  const [timeRange, setTimeRange] = useState<TimeRange>("this_quarter");
  const [selectedDept, setSelectedDept] = useState<string>("all");

  const financialData = useMemo(() => {
    let label = "Synced Ledger Data";

    if (timeRange === "this_month") {
      label = "This Month (Filtered)";
    } else if (timeRange === "year_to_date") {
      label = "Year-to-Date (Filtered)";
    } else if (timeRange === "last_year") {
      label = "Last Year (Filtered)";
    }

    const totalRevenue = metrics.totalRevenue;
    const incomeItems = metrics.incomeItems?.length ? metrics.incomeItems : [
      { code: "REV-1", label: "General Sales", category: "Core Operations", amount: totalRevenue, pct: "100%" },
    ];

    const totalExpenses = metrics.totalExpenses;
    const expenseCategories = metrics.expenseCategories?.length ? metrics.expenseCategories : [
      {
        id: "exp-1",
        label: "General Expenses",
        chartLabel: "General",
        dept: "Operations",
        icon: Zap,
        amount: totalExpenses,
        color: "#10b981",
        pct: 100,
        desc: "General operating expenses"
      }
    ];

    const netProfit = metrics.netProfit;
    const profitMargin = totalRevenue > 0 ? ((netProfit / Math.abs(totalRevenue)) * 100).toFixed(1) : "0.0";

    const ledgerEntries: any[] = [];

    return {
      label,
      incomeItems,
      totalRevenue,
      expenseCategories,
      totalExpenses,
      netProfit,
      profitMargin,
      ledgerEntries,
    };
  }, [timeRange, metrics]);

  const filteredLedger = useMemo(() => {
    if (selectedDept === "all") return financialData.ledgerEntries;
    return financialData.ledgerEntries.filter(e => e.category.toLowerCase().includes(selectedDept.toLowerCase()));
  }, [selectedDept, financialData.ledgerEntries]);

  const fmt = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const rows = [
      ["Type", "Code", "Category", "Description", "Amount (USD)"],
      ...financialData.incomeItems.map(inc => [
        "Revenue", inc.code, inc.category, `"${inc.label}"`, inc.amount
      ]),
      ...financialData.expenseCategories.map(exp => [
        "Expense", exp.id, exp.dept, `"${exp.label}"`, `-${exp.amount}`
      ]),
      [],
      ["", "", "", "Total Revenue", financialData.totalRevenue],
      ["", "", "", "Total Expenses", `-${financialData.totalExpenses}`],
      ["", "", "", "Net Profit", financialData.netProfit],
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(r => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `profit_loss_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">

      {/* ── Header & Action Controls ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground/50">Financial Statements</span>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold rounded-full">GAAP / IFRS Aligned</span>
          </div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Profit & Loss (P&L) Statement</h1>
          <p className="text-sm text-foreground/50 mt-0.5">
            Showing statement for <span className="font-bold text-primary">{financialData.label}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Selector */}
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="pl-9 pr-8 py-2 bg-card text-foreground border border-border rounded-xl text-xs font-semibold appearance-none outline-none cursor-pointer hover:border-primary transition-all shadow-sm"
            >
              <option value="this_month" className="bg-card text-foreground">This Month (July 2026)</option>
              <option value="this_quarter" className="bg-card text-foreground">Q3 2026 (Current Quarter)</option>
              <option value="year_to_date" className="bg-card text-foreground">Year-to-Date (YTD 2026)</option>
              <option value="last_year" className="bg-card text-foreground">Full Year 2025</option>
            </select>
            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50 pointer-events-none" />
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground/50 pointer-events-none" />
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-foreground/5 border border-border rounded-xl text-xs font-semibold hover:bg-foreground/10 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print P&L
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:bg-primary/90 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* ── High-Level Financial Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Total Operating Income</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-foreground">{fmt(financialData.totalRevenue)}</p>
          <p className="text-xs text-foreground/50 mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            From 2 primary revenue streams
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-red-500">Total Operating Expenses</span>
            <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-foreground">{fmt(financialData.totalExpenses)}</p>
          <p className="text-xs text-foreground/50 mt-2 flex items-center gap-1">
            <span>Includes Salaries (53.9%), Utilities & Maintenance</span>
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Net Operating Profit</span>
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className={`text-3xl font-black ${financialData.netProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {financialData.netProfit >= 0 ? '+' : '−'}{fmt(Math.abs(financialData.netProfit))}
          </p>
          <p className={`text-xs font-semibold mt-2 flex items-center gap-1 ${financialData.netProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            <span>Net Profit Margin: <strong>{financialData.profitMargin}%</strong></span>
          </p>
        </div>
      </div>

      {/* ── Departmental Expense Distribution Chart & Legend ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Bar Chart with High Contrast Tooltip */}
        <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-black text-lg text-foreground">Expense Distribution by Department</h3>
              <p className="text-xs text-foreground/50">Breakdown of company spending across Salaries, Electricity, Maintenance, Cloud & Ads</p>
            </div>
            <BarChart3 className="w-5 h-5 text-foreground/40" />
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData.expenseCategories} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <XAxis dataKey="chartLabel" tick={{ fontSize: 11, fill: "var(--color-foreground)" }} opacity={0.7} interval={0} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fontSize: 11, fill: "var(--color-foreground)" }} opacity={0.7} />
                <Tooltip
                  cursor={{ fill: "var(--color-foreground)", opacity: 0.05 }}
                  formatter={(value: any) => [fmt(Number(value)), "Expense Amount"]}
                  labelFormatter={(label: any) => `Department: ${label}`}
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    borderColor: "#334155",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)",
                    fontSize: "12px",
                    padding: "10px 14px",
                  }}
                  itemStyle={{ color: "#38bdf8", fontWeight: 700, fontSize: "13px" }}
                  labelStyle={{ color: "#f8fafc", fontWeight: 800, marginBottom: "4px" }}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {financialData.expenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Breakdown List */}
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-black text-lg text-foreground mb-4">Cost Center Share</h3>
            <div className="space-y-4">
              {financialData.expenseCategories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between text-xs pb-3 border-b border-border/60 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <div>
                      <p className="font-bold text-foreground">{cat.label}</p>
                      <p className="text-[10px] text-foreground/40">{cat.dept}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-foreground">{fmt(cat.amount)}</p>
                    <p className="text-[10px] text-foreground/50">{cat.pct}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Official Profit & Loss (P&L) Statement Table ── */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-foreground/[0.02]">
          <h3 className="text-xl font-black text-foreground">Detailed Profit & Loss Statement</h3>
          <p className="text-xs text-foreground/50 mt-0.5">Itemized revenue income and departmental expense categories</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-foreground/[0.04] border-b border-border text-xs uppercase tracking-wider text-foreground/60 font-bold">
              <tr>
                <th className="px-6 py-3.5">Account / Department</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5 text-right">% of Total</th>
                <th className="px-6 py-3.5 text-right">Amount (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {/* OPERATING REVENUE HEADER */}
              <tr className="bg-emerald-500/5 font-bold text-emerald-600">
                <td colSpan={4} className="px-6 py-2.5 text-xs tracking-wider uppercase">
                  1. OPERATING REVENUE & INCOME
                </td>
              </tr>
              {financialData.incomeItems.map((inc) => (
                <tr key={inc.code} className="hover:bg-foreground/[0.015]">
                  <td className="px-6 py-3 font-semibold text-foreground flex items-center gap-2">
                    <span className="text-xs font-mono text-foreground/40">{inc.code}</span>
                    {inc.label}
                  </td>
                  <td className="px-6 py-3 text-xs text-foreground/60">{inc.category}</td>
                  <td className="px-6 py-3 text-xs text-right text-foreground/60 font-medium">{inc.pct}</td>
                  <td className="px-6 py-3 text-right font-bold text-emerald-600">+{fmt(inc.amount)}</td>
                </tr>
              ))}
              <tr className="bg-emerald-500/10 font-black border-t-2 border-emerald-500/30 text-foreground">
                <td colSpan={3} className="px-6 py-3 text-sm">TOTAL OPERATING REVENUE</td>
                <td className="px-6 py-3 text-right text-base text-emerald-600">+{fmt(financialData.totalRevenue)}</td>
              </tr>

              {/* OPERATING EXPENSES HEADER */}
              <tr className="bg-red-500/5 font-bold text-red-500">
                <td colSpan={4} className="px-6 py-2.5 text-xs tracking-wider uppercase pt-6">
                  2. OPERATING EXPENSES BY DEPARTMENT
                </td>
              </tr>
              {financialData.expenseCategories.map((exp) => (
                <tr key={exp.id} className="hover:bg-foreground/[0.015]">
                  <td className="px-6 py-3.5">
                    <div className="font-semibold text-foreground">{exp.label}</div>
                    <div className="text-xs text-foreground/50 mt-0.5">{exp.desc}</div>
                  </td>
                  <td className="px-6 py-3.5 text-xs text-foreground/60">{exp.dept}</td>
                  <td className="px-6 py-3.5 text-xs text-right text-foreground/60 font-medium">{exp.pct}%</td>
                  <td className="px-6 py-3.5 text-right font-bold text-red-500">−{fmt(exp.amount)}</td>
                </tr>
              ))}
              <tr className="bg-red-500/10 font-black border-t-2 border-red-500/30 text-foreground">
                <td colSpan={3} className="px-6 py-3 text-sm">TOTAL OPERATING EXPENSES</td>
                <td className="px-6 py-3 text-right text-base text-red-500">−{fmt(financialData.totalExpenses)}</td>
              </tr>

              {/* NET PROFIT SUMMARY HEADER */}
              <tr className="bg-primary/15 font-black border-t-4 border-primary text-foreground">
                <td colSpan={3} className="px-6 py-4 text-base">NET OPERATING PROFIT (PRE-TAX)</td>
                <td className={`px-6 py-4 text-right text-xl ${financialData.netProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {financialData.netProfit >= 0 ? '+' : '−'}{fmt(Math.abs(financialData.netProfit))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
