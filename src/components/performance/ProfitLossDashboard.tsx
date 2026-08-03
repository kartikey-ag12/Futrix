"use client";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

// ── Mock Data ─────────────────────────────────────────────────────────────────

const TOP_SALES = [
  { name: "Product Sales", amount: 145000, percentage: 65, fill: "#10b981" },
  { name: "Consulting", amount: 55000, percentage: 25, fill: "#34d399" },
  { name: "Support Plans", amount: 22300, percentage: 10, fill: "#6ee7b7" },
];

const TOP_COSTS = [
  { name: "Server Infrastructure", amount: 35000, percentage: 40, fill: "#f43f5e" },
  { name: "Software Subscriptions", amount: 28000, percentage: 32, fill: "#fb7185" },
  { name: "Office Rent", amount: 24500, percentage: 28, fill: "#fda4af" },
];

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
}

// ── Components ────────────────────────────────────────────────────────────────

export function ProfitLossDashboard() {
  return (
    <div className="w-full flex flex-col gap-5">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Profit & Loss Dashboard</h1>
        
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors">
          Edit in reporting
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <h2 className="text-base font-semibold text-foreground mt-2">Top performers</h2>
      
      {/* Top performers: Sales & Costs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Top sales accounts */}
        <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-foreground mb-1">Top sales accounts</h3>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-[#e5e5e5] dark:border-white/10 rounded-lg text-xs font-medium hover:bg-foreground/5 transition-colors">
              <span>This financial year</span>
              <ChevronDown className="w-3 h-3 text-foreground/50" />
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[300px]">
                <thead>
                  <tr className="border-b border-[#e5e5e5] dark:border-white/8">
                    <th className="py-2 text-xs font-semibold text-foreground/60">Name</th>
                    <th className="py-2 px-3 text-xs font-semibold text-foreground/60 text-right">Amount</th>
                    <th className="py-2 pl-3 text-xs font-semibold text-foreground/60 text-right">% of Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_SALES.map((item) => (
                    <tr key={item.name} className="border-b border-[#e5e5e5] dark:border-white/4 last:border-0">
                      <td className="py-2.5 text-sm font-medium text-foreground">{item.name}</td>
                      <td className="py-2.5 px-3 text-sm tabular-nums text-right">{formatCurrency(item.amount)}</td>
                      <td className="py-2.5 pl-3 text-sm tabular-nums text-right">{item.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="w-full sm:w-[120px] h-[140px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TOP_SALES} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" hide />
                  <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px" }} />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top cost & expense accounts */}
        <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-foreground mb-1">Top cost & expense accounts</h3>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-[#e5e5e5] dark:border-white/10 rounded-lg text-xs font-medium hover:bg-foreground/5 transition-colors">
              <span>This financial year</span>
              <ChevronDown className="w-3 h-3 text-foreground/50" />
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[300px]">
                <thead>
                  <tr className="border-b border-[#e5e5e5] dark:border-white/8">
                    <th className="py-2 text-xs font-semibold text-foreground/60">Name</th>
                    <th className="py-2 px-3 text-xs font-semibold text-foreground/60 text-right">Amount</th>
                    <th className="py-2 pl-3 text-xs font-semibold text-foreground/60 text-right">% of Costs</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_COSTS.map((item) => (
                    <tr key={item.name} className="border-b border-[#e5e5e5] dark:border-white/4 last:border-0">
                      <td className="py-2.5 text-sm font-medium text-foreground">{item.name}</td>
                      <td className="py-2.5 px-3 text-sm tabular-nums text-right">{formatCurrency(item.amount)}</td>
                      <td className="py-2.5 pl-3 text-sm tabular-nums text-right">{item.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="w-full sm:w-[120px] h-[140px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={TOP_COSTS} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" hide />
                  <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px" }} />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* P&L Trend Container (Stubbed for future chart) */}
      <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl p-5 shadow-sm flex flex-col mt-2">
        <h2 className="text-base font-semibold text-foreground mb-1">Profit & Loss</h2>
        <p className="text-xs text-foreground/50 mb-6">Last month and the prior 11</p>
        
        <div className="w-full h-[300px] rounded-lg border border-dashed border-[#e5e5e5] dark:border-white/10 flex items-center justify-center bg-foreground/[0.01]">
          <p className="text-sm text-foreground/40 font-medium">Monthly P&L trend chart will appear here</p>
        </div>
      </div>

    </div>
  );
}
