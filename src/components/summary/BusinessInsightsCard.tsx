"use client";

import Link from "next/link";
import { Share2, TrendingUp, TrendingDown, Minus } from "lucide-react";

// ── Types & mock data ─────────────────────────────────────────────────────────

export interface InsightsMetrics {
  // Performance to prior period
  sales: number;        salesDelta: number;     // % change
  costs: number;        costsDelta: number;
  expenses: number;     expensesDelta: number;
  netProfit: number;    netProfitDelta: number;
  availableCash: number;
  healthScore?: number;
  // Customers & Suppliers
  cashImpact: number;
  avgDaysCustomerPay: number;
  avgDaysSupplierPay: number;
  dueInvoices: number;
  dueBills: number;
}

export const MOCK_INSIGHTS: InsightsMetrics = {
  sales:             62000, salesDelta:        8.4,
  costs:             23000, costsDelta:        -3.2,
  expenses:          14500, expensesDelta:      2.1,
  netProfit:         24500, netProfitDelta:    12.6,
  availableCash:     70000,
  cashImpact:        18200,
  avgDaysCustomerPay: 28,
  avgDaysSupplierPay: 35,
  dueInvoices:        9400,
  dueBills:           5200,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(value: number): string {
  return `$${Math.abs(value).toLocaleString()}`;
}

function DeltaIndicator({ delta }: { delta: number }) {
  if (delta === 0) return <Minus className="w-3.5 h-3.5 text-foreground/40" />;
  if (delta > 0)
    return (
      <span className="flex items-center gap-0.5 text-emerald-600 text-xs font-medium">
        <TrendingUp className="w-3.5 h-3.5" />
        {delta.toFixed(1)}%
      </span>
    );
  return (
    <span className="flex items-center gap-0.5 text-red-500 text-xs font-medium">
      <TrendingDown className="w-3.5 h-3.5" />
      {Math.abs(delta).toFixed(1)}%
    </span>
  );
}

function MetricRow({
  label,
  value,
  delta,
  prefix = "$",
}: {
  label: string;
  value: number;
  delta?: number;
  prefix?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-foreground/60">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold tabular-nums text-foreground">
          {prefix}{Math.abs(value).toLocaleString()}
        </span>
        {delta !== undefined && <DeltaIndicator delta={delta} />}
      </div>
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 mb-1 mt-3 pt-3 border-t border-[#e5e5e5] dark:border-white/8 first:mt-0 first:pt-0 first:border-t-0">
      {children}
    </p>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

interface BusinessInsightsCardProps {
  companyName: string;
  metrics?: InsightsMetrics;
  hasForecasts?: boolean;
}

export function BusinessInsightsCard({
  companyName,
  metrics = MOCK_INSIGHTS,
  hasForecasts = false,
}: BusinessInsightsCardProps) {
  return (
    <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl p-4 shadow-sm flex flex-col">
      {/* Card header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground leading-snug">
            Current business insights
          </h2>
          <p className="text-xs text-foreground/40 mt-0.5 truncate">
            This month so far for{" "}
            <span className="font-medium text-foreground/60">{companyName}</span>
          </p>
        </div>
        <button
          aria-label="Share insights"
          className="p-1.5 rounded-lg text-foreground/30 hover:text-foreground/60 hover:bg-foreground/5 transition-colors flex-shrink-0"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Performance to prior period ── */}
      <SectionHeader>Performance to the prior period's total</SectionHeader>
      <MetricRow label="Sales"        value={metrics.sales}     delta={metrics.salesDelta} />
      <MetricRow label="Costs"        value={metrics.costs}     delta={metrics.costsDelta} />
      <MetricRow label="Expenses"     value={metrics.expenses}  delta={metrics.expensesDelta} />
      <MetricRow label="Net profit"   value={metrics.netProfit} delta={metrics.netProfitDelta} />
      <div className="flex items-center justify-between py-1.5">
        <span className="text-xs text-foreground/60">Available cash in the bank</span>
        <span className="text-xs font-semibold tabular-nums text-emerald-600">
          ${metrics.availableCash.toLocaleString()}
        </span>
      </div>
      {metrics.healthScore !== undefined && (
        <div className="flex items-center justify-between py-1.5 border-t border-[#e5e5e5] dark:border-white/8 mt-1.5 pt-2">
          <span className="text-xs text-foreground/60 font-medium">Futrix Health Score</span>
          <span className="text-xs font-bold tabular-nums text-foreground bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full">
            {metrics.healthScore}/100
          </span>
        </div>
      )}

      {/* ── Performance to targets ── */}
      <SectionHeader>Performance to targets</SectionHeader>
      {hasForecasts ? (
        <>
          <MetricRow label="Sales target"    value={0} />
          <MetricRow label="Expense target"  value={0} />
        </>
      ) : (
        <div className="py-2">
          <p className="text-xs text-foreground/40 leading-relaxed">
            No forecast yet.{" "}
            <Link href="/forecasting" className="text-emerald-600 hover:underline font-medium">
              Create a forecast now
            </Link>{" "}
            to track performance to targets.
          </p>
          {["Sales", "Costs", "Expenses", "Net profit"].map((l) => (
            <div key={l} className="flex items-center justify-between py-1">
              <span className="text-xs text-foreground/40">{l}</span>
              <span className="text-xs text-foreground/30 tabular-nums">$—</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Customers & Suppliers ── */}
      <SectionHeader>Customers &amp; Suppliers — on last sync</SectionHeader>
      <MetricRow label="Cash impact if paid on time"       value={metrics.cashImpact}           />
      <div className="flex items-center justify-between py-1.5">
        <span className="text-xs text-foreground/60">Avg. days customers pay</span>
        <span className="text-xs font-semibold tabular-nums text-foreground">
          {metrics.avgDaysCustomerPay} days
        </span>
      </div>
      <div className="flex items-center justify-between py-1.5">
        <span className="text-xs text-foreground/60">Avg. days you pay suppliers</span>
        <span className="text-xs font-semibold tabular-nums text-foreground">
          {metrics.avgDaysSupplierPay} days
        </span>
      </div>
      <MetricRow label="Due invoices total"  value={metrics.dueInvoices} />
      <MetricRow label="Due bills total"     value={metrics.dueBills} />
    </div>
  );
}
