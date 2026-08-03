"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MonthlyPerformanceData {
  month: string;       // e.g. "Aug 24"
  bank: number;
  sales: number;
  costOfSales: number;
  expenses: number;
}

// ── Mock data — Phase 6 wires to real Xero-derived metrics ────────────────────

export const MOCK_PERFORMANCE_DATA: MonthlyPerformanceData[] = [
  { month: "Aug 23", bank: 42000, sales: 38000, costOfSales: 14000, expenses: 9000 },
  { month: "Sep 23", bank: 47000, sales: 42000, costOfSales: 16000, expenses: 10500 },
  { month: "Oct 23", bank: 39000, sales: 35000, costOfSales: 13000, expenses: 8800 },
  { month: "Nov 23", bank: 53000, sales: 48000, costOfSales: 18000, expenses: 11200 },
  { month: "Dec 23", bank: 61000, sales: 55000, costOfSales: 20000, expenses: 13000 },
  { month: "Jan 24", bank: 44000, sales: 40000, costOfSales: 15000, expenses: 9500 },
  { month: "Feb 24", bank: 48000, sales: 43000, costOfSales: 16500, expenses: 10000 },
  { month: "Mar 24", bank: 56000, sales: 50000, costOfSales: 19000, expenses: 12000 },
  { month: "Apr 24", bank: 52000, sales: 46000, costOfSales: 17000, expenses: 11000 },
  { month: "May 24", bank: 59000, sales: 53000, costOfSales: 20000, expenses: 12500 },
  { month: "Jun 24", bank: 64000, sales: 58000, costOfSales: 22000, expenses: 13800 },
  { month: "Jul 24", bank: 70000, sales: 62000, costOfSales: 23000, expenses: 14500 },
];

// ── Colour palette ─────────────────────────────────────────────────────────────

const COLORS = {
  bank:       "#10b981", // emerald
  sales:      "#3b82f6", // blue
  costOfSales:"#f43f5e", // rose/red
  expenses:   "#f97316", // orange
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDollar(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000)     return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toLocaleString()}`;
}

function formatFull(value: number): string {
  return `$${value.toLocaleString()}`;
}

// ── Custom tooltip ─────────────────────────────────────────────────────────────

interface TooltipInternalProps {
  active?: boolean;
  label?: string;
  payload?: Array<{ dataKey?: string | number; value?: string | number; name?: string }>;
}

function CustomTooltip({ active, payload, label }: TooltipInternalProps) {
  if (!active || !payload?.length) return null;

  const map: Record<string, number> = {};
  (payload ?? []).forEach((p) => {
    if (p.dataKey !== undefined && p.value !== undefined) {
      map[String(p.dataKey)] = Number(p.value);
    }
  });

  const rows = [
    { key: "bank",       label: "Bank",          color: COLORS.bank },
    { key: "sales",      label: "Sales",         color: COLORS.sales },
    { key: "costOfSales",label: "Cost of Sales", color: COLORS.costOfSales },
    { key: "expenses",   label: "Expenses",      color: COLORS.expenses },
  ];

  return (
    <div className="bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl px-4 py-3 text-sm min-w-[190px]">
      <p className="text-white/50 text-xs font-semibold mb-2 uppercase tracking-wider">{label}</p>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.key} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: r.color }} />
              <span className="text-white/70">{r.label}</span>
            </div>
            <span className="font-semibold text-white tabular-nums">
              {map[r.key] !== undefined ? formatFull(map[r.key]) : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Custom legend ─────────────────────────────────────────────────────────────

function CustomLegend() {
  const items = [
    { label: "Bank",          color: COLORS.bank,        type: "line" },
    { label: "Sales",         color: COLORS.sales,       type: "bar" },
    { label: "Cost of Sales", color: COLORS.costOfSales, type: "bar" },
    { label: "Expenses",      color: COLORS.expenses,    type: "bar" },
  ];
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-3">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          {item.type === "line" ? (
            <svg width="18" height="10" aria-hidden="true">
              <line x1="0" y1="5" x2="18" y2="5" stroke={item.color} strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="9" cy="5" r="3" fill={item.color} />
            </svg>
          ) : (
            <span className="w-3 h-3 rounded-sm" style={{ background: item.color }} />
          )}
          <span className="text-xs text-foreground/60">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

interface PerformanceChartCardProps {
  data?: MonthlyPerformanceData[];
}

export function PerformanceChartCard({ data = MOCK_PERFORMANCE_DATA }: PerformanceChartCardProps) {
  return (
    <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-foreground mb-4">
        Last 12 months performance
      </h2>

      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          barCategoryGap="25%"
          barGap={2}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-[#e5e5e5] dark:text-white/8"
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "currentColor" }}
            className="text-foreground/40"
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={formatDollar}
            tick={{ fontSize: 11, fill: "currentColor" }}
            className="text-foreground/40"
            axisLine={false}
            tickLine={false}
            width={52}
          />
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <Tooltip content={(props: any) => <CustomTooltip {...props} />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
          <Legend content={<CustomLegend />} />

          {/* Grouped bars */}
          <Bar dataKey="sales"       fill={COLORS.sales}       radius={[3,3,0,0]} maxBarSize={18} name="Sales" />
          <Bar dataKey="costOfSales" fill={COLORS.costOfSales} radius={[3,3,0,0]} maxBarSize={18} name="Cost of Sales" />
          <Bar dataKey="expenses"    fill={COLORS.expenses}    radius={[3,3,0,0]} maxBarSize={18} name="Expenses" />

          {/* Bank line on top */}
          <Line
            type="monotone"
            dataKey="bank"
            stroke={COLORS.bank}
            strokeWidth={2.5}
            dot={{ r: 3, fill: COLORS.bank, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: COLORS.bank, strokeWidth: 0 }}
            name="Bank"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
