"use client";

import Link from "next/link";
import { FileText, BarChart3, TrendingUp, ArrowRight, ChevronRight, Plus } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RecentReport {
  id: string;
  label: string;
  href: string;
  icon: "pl" | "cashflow" | "balance";
}

export interface QuickLinksCardProps {
  recentReports?: RecentReport[];
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_RECENT: RecentReport[] = [
  { id: "1", label: "Profit & Loss Dashboard",    href: "/reporting", icon: "pl" },
  { id: "2", label: "Cash Flow Statement",         href: "/reporting", icon: "cashflow" },
  { id: "3", label: "Balance Sheet Summary",       href: "/reporting", icon: "balance" },
];

const ICON_MAP: Record<RecentReport["icon"], React.ElementType> = {
  pl:       FileText,
  cashflow: TrendingUp,
  balance:  BarChart3,
};

const COLOR_MAP: Record<RecentReport["icon"], string> = {
  pl:       "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
  cashflow: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
  balance:  "text-violet-500 bg-violet-50 dark:bg-violet-500/10",
};

// ── Guided action card ────────────────────────────────────────────────────────

function GuidedCard({
  label,
  href,
  subLinks,
}: {
  label: string;
  href: string;
  subLinks?: { label: string; href: string }[];
}) {
  return (
    <div className="border border-[#e5e5e5] dark:border-white/8 rounded-xl p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-foreground">{label}</span>
        <Link href={href} className="text-emerald-600 hover:text-emerald-500 transition-colors">
          <Plus className="w-3.5 h-3.5" />
        </Link>
      </div>
      {subLinks && subLinks.length > 0 && (
        <div className="space-y-1 mt-2 pl-1">
          {subLinks.map((sl) => (
            <Link
              key={sl.label}
              href={sl.href}
              className="flex items-center gap-1 text-xs text-foreground/50 hover:text-emerald-600 transition-colors"
            >
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              {sl.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function QuickLinksCard({ recentReports = MOCK_RECENT }: QuickLinksCardProps) {
  return (
    <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl p-4 shadow-sm flex flex-col gap-4">
      {/* Header */}
      <div>
        <h2 className="text-sm font-semibold text-foreground">Quick links</h2>
        <p className="text-xs text-foreground/40 mt-0.5">
          Access recent reports and forecasts or budgets
        </p>
      </div>

      {/* Recent reports */}
      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 mb-2">
          Recently used
        </p>
        {recentReports.length === 0 ? (
          <p className="text-xs text-foreground/30 py-2">No recent reports yet.</p>
        ) : (
          recentReports.map((r) => {
            const Icon = ICON_MAP[r.icon];
            return (
              <Link
                key={r.id}
                href={r.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-foreground/[0.03] transition-colors group"
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${COLOR_MAP[r.icon]}`}>
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span className="flex-1 text-xs font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                  {r.label}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-foreground/20 group-hover:text-foreground/50 transition-colors" />
              </Link>
            );
          })
        )}
      </div>

      {/* Guided flows */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 mb-2">
          Guided jobs to be done
        </p>
        <div className="space-y-2">
          <GuidedCard
            label="Create a report or dashboard"
            href="/reporting"
          />
          <GuidedCard
            label="Create a 1 year P&L only"
            href="/forecasting"
          />
          <GuidedCard
            label="Create a 3 year cash flow forecast"
            href="/forecasting"
            subLinks={[
              { label: "Traditional 3 year cash flow",         href: "/forecasting" },
              { label: "3 year cash flow with due invoices",   href: "/forecasting" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
