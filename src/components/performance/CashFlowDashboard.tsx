"use client";

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
} from "recharts";
import { useFinancial } from "@/context/FinancialContext";
import { CashFlowChart } from "./CashFlowChart";

// ── Mock Data ─────────────────────────────────────────────────────────────────

const BANK_DATA = [
  { month: "Jan", actual: 120000, prior: 95000 },
  { month: "Feb", actual: 125000, prior: 98000 },
  { month: "Mar", actual: 110000, prior: 102000 },
  { month: "Apr", actual: 140000, prior: 110000 },
  { month: "May", actual: 145000, prior: 108000 },
  { month: "Jun", actual: 130000, prior: 115000 },
  { month: "Jul", actual: 155000, prior: 125000 },
  { month: "Aug", actual: 160000, prior: 130000 },
  { month: "Sep", actual: 175000, prior: 135000 },
  { month: "Oct", actual: 180000, prior: 140000 },
  { month: "Nov", actual: 190000, prior: 145000 },
  { month: "Dec", actual: 210500, prior: 150000 },
];

const INVOICE_CHART_DATA = [
  { name: "Unpaid", value: 45000, fill: "#10b981" },
  { name: "Avg Rev", value: 38000, fill: "#9ca3af" },
];

const BILLS_CHART_DATA = [
  { name: "Unpaid", value: 12500, fill: "#f43f5e" },
  { name: "Avg Cost", value: 15000, fill: "#9ca3af" },
];

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────────

interface TooltipInternalProps {
  active?: boolean;
  label?: string;
  payload?: Array<{ dataKey?: string | number; value?: string | number; name?: string; color?: string }>;
}

function CustomTooltip({ active, payload, label }: TooltipInternalProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#222] text-white text-sm px-3 py-2 rounded shadow-xl border border-white/10 pointer-events-none">
      <p className="font-semibold mb-1 text-white/70">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mt-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="opacity-80">{p.name}:</span>
          <span className="font-mediumtabular-nums">{formatCurrency(Number(p.value))}</span>
        </div>
      ))}
    </div>
  );
}

// ── Components ────────────────────────────────────────────────────────────────

export function CashFlowDashboard() {
  const { metrics } = useFinancial();

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Cash Flow Dashboard</h1>
        
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors">
          Edit in reporting
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Cash in the bank */}
      <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl p-5 shadow-sm flex flex-col lg:flex-row gap-8">
        <div className="flex-1 flex flex-col min-w-0">
          <h2 className="text-base font-semibold text-foreground mb-1">Cash in the bank</h2>
          <p className="text-xs text-foreground/50 mb-6">Last 12 months vs prior 12 months</p>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={BANK_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPrior" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-foreground/5" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "currentColor" }} 
                  className="text-foreground/40"
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: "currentColor" }} 
                  className="text-foreground/40"
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <Tooltip content={(props: any) => <CustomTooltip {...props} />} cursor={{ stroke: "rgba(0,0,0,0.1)", strokeWidth: 1, strokeDasharray: "4 4" }} />
                <Area type="monotone" name="Prior year actuals" dataKey="prior" stroke="#94a3b8" strokeDasharray="4 4" fillOpacity={1} fill="url(#colorPrior)" />
                <Area type="monotone" name="Actual data" dataKey="actual" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-emerald-500 rounded-full" />
              <span className="text-xs text-foreground/60">Actual data — Bank Accounts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 bg-slate-400 rounded-full border border-slate-400 border-dashed bg-transparent" />
              <span className="text-xs text-foreground/60">Prior year actuals — Bank Accounts</span>
            </div>
          </div>
        </div>

        {/* Big Stat Callout */}
        <div className="lg:w-[300px] flex-shrink-0 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-[#e5e5e5] dark:border-white/8 pt-6 lg:pt-0 lg:pl-8">
          <h3 className="text-sm font-medium text-foreground/60 mb-2">Current cash in bank</h3>
          <div className="text-4xl font-bold text-foreground mb-1 tabular-nums">
            {formatCurrency(BANK_DATA[BANK_DATA.length - 1].actual)}
          </div>
          <p className="text-xs text-emerald-600 font-medium">+15.4% vs prior month</p>
        </div>
      </div>

      {/* Two columns: Invoices and Bills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Cash in from invoices */}
        <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl p-5 shadow-sm flex flex-col">
          <h2 className="text-base font-semibold text-foreground mb-1">Cash in from invoices</h2>
          <p className="text-xs text-foreground/50 mb-6">Last month and the prior 11</p>
          
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="flex-1 w-full space-y-4">
              <div>
                <p className="text-xs text-foreground/60 mb-1">Unpaid invoices as of today</p>
                <p className="text-xl font-bold text-foreground tabular-nums">{formatCurrency(45000)}</p>
              </div>
              <div>
                <p className="text-xs text-foreground/60 mb-1">Of this is late</p>
                <p className="text-lg font-semibold text-rose-500 tabular-nums">{formatCurrency(12500)}</p>
              </div>
              <div>
                <p className="text-xs text-foreground/60 mb-1">Predicted to come in (7 days)</p>
                <p className="text-lg font-semibold text-emerald-500 tabular-nums">{formatCurrency(8200)}</p>
              </div>
              <div>
                <p className="text-xs text-foreground/60 mb-1">Average age of invoices</p>
                <p className="text-lg font-semibold text-foreground tabular-nums">18 days</p>
              </div>
            </div>

            <div className="w-full sm:w-[150px] h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={INVOICE_CHART_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "currentColor" }} className="text-foreground/50" />
                  <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px" }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Cash out from bills */}
        <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl p-5 shadow-sm flex flex-col">
          <h2 className="text-base font-semibold text-foreground mb-1">Cash out from bills</h2>
          <p className="text-xs text-foreground/50 mb-6">Last month and the prior 11</p>
          
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="flex-1 w-full space-y-4">
              <div>
                <p className="text-xs text-foreground/60 mb-1">Unpaid bills as of today</p>
                <p className="text-xl font-bold text-foreground tabular-nums">{formatCurrency(12500)}</p>
              </div>
              <div>
                <p className="text-xs text-foreground/60 mb-1">Of this is late</p>
                <p className="text-lg font-semibold text-rose-500 tabular-nums">{formatCurrency(400)}</p>
              </div>
              <div>
                <p className="text-xs text-foreground/60 mb-1">Predicted to go out (7 days)</p>
                <p className="text-lg font-semibold text-rose-500 tabular-nums">{formatCurrency(2100)}</p>
              </div>
              <div>
                <p className="text-xs text-foreground/60 mb-1">Average age of bills</p>
                <p className="text-lg font-semibold text-foreground tabular-nums">12 days</p>
              </div>
            </div>

            <div className="w-full sm:w-[150px] h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BILLS_CHART_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "currentColor" }} className="text-foreground/50" />
                  <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px" }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
      
      {/* ── Cash Flow Projection ── */}
      <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl p-5 shadow-sm flex flex-col mt-2">
        <h2 className="text-base font-semibold text-foreground mb-1">9-Month Cash Flow Projection</h2>
        <p className="text-xs text-foreground/50 mb-6">Based on current revenue and expense trajectory</p>
        <CashFlowChart totalRevenue={metrics.totalRevenue} totalExpenses={metrics.totalExpenses} />
      </div>
    </div>
  );
}
