"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import clsx from "clsx";

// ── Mock Data ─────────────────────────────────────────────────────────────────

const RATIOS = [
  { name: "Cash Ratio", value: 1.2 },
  { name: "Current Ratio", value: 2.4 },
  { name: "Quick Ratio", value: 1.8 },
  { name: "Debt to Equity Ratio", value: 0.8 },
  { name: "Capital Turnover Ratio", value: 3.2 },
  { name: "Return on assets ratio", value: 12.5, isPercent: true },
];

const RATIO_TREND_DATA = [
  { month: "Jan", value: 0.8 },
  { month: "Feb", value: 0.9 },
  { month: "Mar", value: 1.0 },
  { month: "Apr", value: 1.1 },
  { month: "May", value: 1.0 },
  { month: "Jun", value: 1.2 },
  { month: "Jul", value: 1.3 },
  { month: "Aug", value: 1.1 },
  { month: "Sep", value: 1.2 },
  { month: "Oct", value: 1.4 },
  { month: "Nov", value: 1.3 },
  { month: "Dec", value: 1.2 },
];

const PROPORTION_DATA = [
  { name: "Current Assets", value: 400, color: "#10b981" },
  { name: "Non-current Assets", value: 300, color: "#34d399" },
  { name: "Current Liabilities", value: 200, color: "#f43f5e" },
  { name: "Non-current Liabilities", value: 100, color: "#fb7185" },
  { name: "Equity", value: 250, color: "#3b82f6" },
];

const LIQUIDITY_DATA = [
  { month: "Jan", cash: 120000 },
  { month: "Feb", cash: 125000 },
  { month: "Mar", cash: 110000 },
  { month: "Apr", cash: 140000 },
  { month: "May", cash: 145000 },
  { month: "Jun", cash: 130000 },
  { month: "Jul", cash: 155000 },
  { month: "Aug", cash: 160000 },
  { month: "Sep", cash: 175000 },
  { month: "Oct", cash: 180000 },
  { month: "Nov", cash: 190000 },
  { month: "Dec", cash: 210500 },
];

// ── Components ────────────────────────────────────────────────────────────────

export function BalanceSheetDashboard({ isBuilderMode }: { isBuilderMode?: boolean }) {
  return (
    <div className="w-full flex flex-col gap-5">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Balance Sheet Dashboard</h1>
        
        {!isBuilderMode && (
          <Link href="/reporting/builder?templateId=futrix-bs-dash" className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors">
            Edit in reporting
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Ratios */}
      <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl p-5 shadow-sm flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-[250px] flex-shrink-0 flex flex-col gap-3">
          <div>
            <h2 className="text-base font-semibold text-foreground mb-1">Ratios</h2>
            <p className="text-xs text-foreground/50 mb-4">Last month and the prior 11</p>
          </div>
          
          <div className="flex flex-col gap-2">
            {RATIOS.map((ratio, idx) => (
              <div 
                key={ratio.name} 
                className={clsx(
                  "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors",
                  idx === 0 ? "bg-emerald-500/10" : "hover:bg-foreground/5"
                )}
              >
                <span className={clsx("text-sm", idx === 0 ? "text-emerald-700 dark:text-emerald-500 font-medium" : "text-foreground/70")}>
                  {ratio.name}
                </span>
                <span className={clsx("font-bold tabular-nums", idx === 0 ? "text-emerald-700 dark:text-emerald-500" : "text-foreground")}>
                  {ratio.value}{ratio.isPercent ? "%" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col border-t lg:border-t-0 lg:border-l border-[#e5e5e5] dark:border-white/8 pt-6 lg:pt-0 lg:pl-8">
          <h3 className="text-sm font-semibold text-foreground mb-4">Cash Ratio Trend</h3>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RATIO_TREND_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-foreground/5" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "currentColor" }} className="text-foreground/40" dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "currentColor" }} className="text-foreground/40" />
                <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px" }} />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 bg-foreground/[0.02] border border-foreground/5 p-4 rounded-lg">
            <p className="text-sm text-foreground/70 leading-relaxed">
              <strong>Cash Ratio</strong> measures a company's ability to pay off its short-term liabilities with cash and cash equivalents. A ratio greater than 1 indicates the company has more cash on hand than current debts.
            </p>
          </div>
        </div>
      </div>

      {/* Two columns: Proportion and Liquidity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Balance sheet proportion */}
        <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl p-5 shadow-sm flex flex-col">
          <h2 className="text-base font-semibold text-foreground mb-1">Balance sheet proportion</h2>
          <p className="text-xs text-foreground/50 mb-6">Last month</p>
          
          <div className="flex-1 min-h-[250px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PROPORTION_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {PROPORTION_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <div className="absolute left-0 bottom-0 top-0 flex flex-col justify-center gap-3">
              {PROPORTION_DATA.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
                  <span className="text-xs text-foreground/70">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cash Liquidity */}
        <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl p-5 shadow-sm flex flex-col">
          <h2 className="text-base font-semibold text-foreground mb-1">Cash Liquidity</h2>
          <p className="text-xs text-foreground/50 mb-6">Last month and the prior 11</p>
          
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={LIQUIDITY_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLiquidity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-foreground/5" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "currentColor" }} className="text-foreground/40" dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "currentColor" }} className="text-foreground/40" tickFormatter={(val) => `$${val / 1000}k`} />
                <Tooltip cursor={{ stroke: "rgba(0,0,0,0.1)", strokeWidth: 1, strokeDasharray: "4 4" }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px" }} />
                <Area type="monotone" name="Cash" dataKey="cash" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorLiquidity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
