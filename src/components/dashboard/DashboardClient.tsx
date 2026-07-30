"use client";

import { useState, useEffect, useTransition, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { useFinancial } from "@/context/FinancialContext";
import { KPICard } from "@/components/dashboard/KPICard";
import { RefreshCcw } from "lucide-react";
import { DollarSign } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { TrendingDown } from "lucide-react";
import { Activity } from "lucide-react";
import { Sparkles } from "lucide-react";
import { AlertTriangle } from "lucide-react";
import { Lightbulb } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { Plus } from "lucide-react";
import { Zap } from "lucide-react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// Defer recharts (largest bundle contributor) — only loaded after hydration
const RevenueChart = dynamic(
  () => import("./RevenueChart").then((m) => ({ default: m.RevenueChart })),
  { ssr: false, loading: () => <div className="chart-skeleton" /> }
);
const CashFlowChart = dynamic(
  () => import("./CashFlowChart").then((m) => ({ default: m.CashFlowChart })),
  { ssr: false, loading: () => <div className="chart-skeleton" /> }
);
// Modal only fetched when the user actually opens it
const CreateInvoiceModal = dynamic(
  () => import("./CreateInvoiceModal").then((m) => ({ default: m.CreateInvoiceModal })),
  { ssr: false }
);

// ── Module-scope formatter (one instance for the lifetime of the module) ──
const _fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const fmt = (n: number) => _fmt.format(n);

type InsightItem = { type: string; title: string; description: string };

const DEFAULT_INSIGHTS: InsightItem[] = [
  {
    type: "warning",
    title: "Cash Flow Alert",
    description:
      "Based on historical trends, you're projected to have a cash deficit of $4,500 in mid-August. Consider delaying the upcoming software purchase.",
  },
  {
    type: "suggestion",
    title: "Expense Optimisation",
    description:
      "Your SaaS subscriptions have increased by 15% this quarter. Reviewing inactive accounts could save up to $850/month.",
  },
];

export default function DashboardClient() {
  const { metrics, isSyncing, orgName, lastSynced, handleXeroSync } = useFinancial();

  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiSource, setAiSource] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<InsightItem[]>(DEFAULT_INSIGHTS);
  const [, startTransition] = useTransition();

  // ── AI Insights — non-blocking via startTransition ─────────────────────────
  const fetchAiInsights = useCallback(
    async (currentMetrics = metrics) => {
      setIsGeneratingAi(true);
      try {
        const res = await fetch("/api/ai/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            totalRevenue: currentMetrics.totalRevenue,
            totalExpenses: currentMetrics.totalExpenses,
            netProfit: currentMetrics.netProfit,
            healthScore: currentMetrics.healthScore,
            companyName: orgName || "Acme Corp",
          }),
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data.insights) && data.insights.length > 0) {
          startTransition(() => {
            setAiInsights(data.insights);
            setAiSource(data.source === "openai_live" ? "OpenAI GPT-4o" : "Futrix Engine");
          });
        }
      } catch {
        // Silently fail — default insights remain displayed
      } finally {
        setIsGeneratingAi(false);
      }
    },
    [orgName, startTransition, metrics]
  );

  // ── Xero sync — AI insights fired AFTER Xero completes, not simultaneously ─
  const handleSync = useCallback(async () => {
    const newMetrics = await handleXeroSync();
    // Only fetch AI after Xero data is ready — avoids 3 concurrent requests on mount
    if (newMetrics) {
      fetchAiInsights(newMetrics);
    }
  }, [handleXeroSync, fetchAiInsights]);

  // Mount: run Xero sync first; AI follows when data is ready
  useEffect(() => {
    handleSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-foreground/50 mt-0.5">
            {orgName ? (
              <>
                Connected to{" "}
                <span className="font-semibold text-emerald-600">{orgName}</span>
              </>
            ) : (
              "Live financial overview for this month"
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastSynced && (
            <span className="text-xs text-foreground/40 hidden sm:block">
              Synced at {lastSynced}
            </span>
          )}
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-border rounded-xl text-sm font-semibold hover:bg-foreground/10 transition-all disabled:opacity-50 text-foreground"
          >
            <RefreshCcw className={`w-4 h-4 ${isSyncing ? "animate-spin" : "text-foreground/60"}`} />
            {isSyncing ? "Syncing…" : "Sync"}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-xl text-sm font-semibold hover:bg-foreground/90 transition-all shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </button>
        </div>
      </div>

      {/* ── Integration banners ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-[#1AB4D7]/10 to-transparent border border-[#1AB4D7]/20 rounded-2xl">
          <div className="w-9 h-9 rounded-xl bg-[#1AB4D7]/15 border border-[#1AB4D7]/30 flex items-center justify-center flex-shrink-0">
            <span className="text-[#1AB4D7] font-black text-base">X</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {orgName ? `Xero — ${orgName}` : "Xero Accounting"}
            </p>
            <p className="text-xs text-foreground/50 truncate">
              {orgName ? "Invoices & bills synced automatically" : "Connect Xero for live cloud sync"}
            </p>
          </div>
          <div className="flex-shrink-0">
            {orgName ? (
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 text-xs font-bold rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            ) : (
              <Link
                href="/integrations/xero"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1AB4D7] text-white text-xs font-semibold rounded-lg hover:bg-[#1AB4D7]/90 transition-colors"
              >
                <Zap className="w-3.5 h-3.5" /> Connect
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/20 rounded-2xl">
          <div className="w-9 h-9 rounded-xl bg-green-500/15 border border-green-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-green-500 font-black text-base">E</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Excel Import / Export</p>
            <p className="text-xs text-foreground/50 truncate">Upload spreadsheets & sync to Xero</p>
          </div>
          <Link
            href="/excel-tools"
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            Manage Excel
          </Link>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-foreground/50 uppercase tracking-wider mb-4">
          This Month&apos;s Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <KPICard title="Total Revenue" value={fmt(metrics.totalRevenue)} trend={12.5} trendLabel="vs last month" icon={<DollarSign className="w-5 h-5" />} />
          <KPICard title="Total Expenses" value={fmt(metrics.totalExpenses)} trend={-4.5} trendLabel="vs last month" icon={<TrendingDown className="w-5 h-5" />} />
          <KPICard title="Net Profit" value={fmt(metrics.netProfit)} trend={8.2} trendLabel="vs last month" icon={<TrendingUp className="w-5 h-5" />} />
          <KPICard title="Health Score" value={`${metrics.healthScore}/100`} trend={2.4} trendLabel="stable" icon={<Activity className="w-5 h-5" />} />
        </div>
      </div>

      {/* ── Charts (lazy) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-foreground">Revenue Trend</h3>
              <p className="text-xs text-foreground/50 mt-0.5">Monthly revenue over time</p>
            </div>
            <Link href="/transactions" className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
              View all <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <RevenueChart totalRevenue={metrics.totalRevenue} totalExpenses={metrics.totalExpenses} />
        </div>
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-foreground">Cash Flow</h3>
              <p className="text-xs text-foreground/50 mt-0.5">Inflows vs outflows</p>
            </div>
            <Link href="/forecasting" className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
              Forecast <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <CashFlowChart totalRevenue={metrics.totalRevenue} totalExpenses={metrics.totalExpenses} />
        </div>
      </div>

      {/* ── AI Insights ── */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-premium hover:border-foreground/10 transition-all duration-300">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center text-violet-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground text-sm">AI Financial Insights</h3>
                {aiSource && (
                  <span className="px-2 py-0.5 bg-violet-500/10 text-violet-600 text-[10px] font-bold rounded-full">{aiSource}</span>
                )}
              </div>
              <p className="text-xs text-foreground/50">Real-time LLM financial analysis & risk detector</p>
            </div>
          </div>
          <button
            onClick={() => fetchAiInsights()}
            disabled={isGeneratingAi}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-foreground text-background rounded-xl text-xs font-semibold hover:bg-foreground/90 transition-all shadow-sm disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? "animate-spin" : ""}`} />
            {isGeneratingAi ? "Analyzing..." : "Run AI Analysis"}
          </button>
        </div>
        <div className="p-5 grid sm:grid-cols-3 gap-4">
          {aiInsights.map((insight, idx) => {
            const isWarning = insight.type === "warning";
            const isSuggestion = insight.type === "suggestion";
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex flex-col gap-2 ${
                  isWarning ? "bg-amber-500/8 border-amber-500/20" :
                  isSuggestion ? "bg-blue-500/8 border-blue-500/20" :
                  "bg-emerald-500/8 border-emerald-500/20"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isWarning ? <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" /> :
                   isSuggestion ? <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0" /> :
                   <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                  <h4 className="font-bold text-foreground text-sm leading-tight">{insight.title}</h4>
                </div>
                <p className="text-xs text-foreground/70 leading-relaxed">{insight.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal — only rendered (and fetched) when open */}
      {isModalOpen && (
        <CreateInvoiceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSync}
        />
      )}
    </>
  );
}
