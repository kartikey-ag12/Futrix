"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { KPICard } from "@/components/dashboard/KPICard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import { CreateInvoiceModal } from "@/components/dashboard/CreateInvoiceModal";
import {
  DollarSign, TrendingUp, TrendingDown, Activity,
  RefreshCcw, Plus, Zap, ArrowUpRight, AlertTriangle, Lightbulb,
  Sparkles, CheckCircle2, Star, Shield, Lock, Layers,
  Building, Quote, ChevronRight, ChevronLeft
} from "lucide-react";

type InsightItem = {
  type: string;
  title: string;
  description: string;
};

const LOGO_PARTNERS = [
  { name: "Xero Verified Partner", icon: "X", color: "text-[#1AB4D7]" },
  { name: "Trustpilot 4.9/5 Rating", icon: "★", color: "text-emerald-500" },
  { name: "QuickBooks Online Sync", icon: "QB", color: "text-emerald-600" },
  { name: "Sage Integration", icon: "S", color: "text-green-500" },
  { name: "TallyPrime Enterprise", icon: "T", color: "text-orange-500" },
  { name: "SOC-2 Type II Certified", icon: "🔒", color: "text-slate-400" },
];

const REVIEWS = [
  {
    quote: "Futrix transformed how we present financials to our board. What used to take a full day in spreadsheets now takes under 20 minutes.",
    author: "Rachel Osei",
    role: "CFO, Greenpath Ventures",
    rating: 5,
    verified: true,
  },
  {
    quote: "The daily cash flow forecasting caught a potential deficit six weeks out. We had time to act. It literally saved us from a cash crunch.",
    author: "Daniel Fitzpatrick",
    role: "Finance Director, Apex Retail",
    rating: 5,
    verified: true,
  },
  {
    quote: "Our accountants now spend time advising clients instead of manually copying data. Futrix is the platform that made that transition possible.",
    author: "Mei Lin",
    role: "Partner, Horizon Advisory",
    rating: 5,
    verified: true,
  },
  {
    quote: "The Xero live integration synced 3 years of invoice ledgers in seconds. Our month-end reporting time has been cut by 70%.",
    author: "Marcus Vance",
    role: "Group Controller, Vance & Co",
    rating: 5,
    verified: true,
  },
  {
    quote: "Scenario planning in Futrix allowed us to model our hiring plan safely before committing to Q4 headcount.",
    author: "Elena Rostova",
    role: "VP of Finance, TechScale Global",
    rating: 5,
    verified: true,
  },
];

const ABOUT_PILLARS = [
  {
    icon: RefreshCcw,
    title: "100% Automated Data Sync",
    desc: "Connect Xero or Tally and eliminate manual data entry. Your invoices, bills, and bank ledgers stay synced every hour automatically.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: TrendingUp,
    title: "90-Day Rolling Forecasts",
    desc: "Predict cash inflows and outflows out to 90 days. Models P&L, Balance Sheet, and daily cash balances based on actual customer payment velocity.",
    color: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Layers,
    title: "Multi-Currency Consolidations",
    desc: "Merge multiple business entities and international currencies in seconds. Get unified group reporting with intercompany elimination.",
    color: "text-violet-500",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    desc: "Your data is encrypted end-to-end. Official OAuth2 protocol authorization ensures we never see or store your accounting password.",
    color: "text-amber-500",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
];

export default function Dashboard() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<string | null>(null);

  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  const handleNextReview = () => {
    setActiveReviewIndex((prev) => (prev + 1) % REVIEWS.length);
  };

  const handlePrevReview = () => {
    setActiveReviewIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);
  };

  const [metrics, setMetrics] = useState({
    totalRevenue: 45231.89,
    totalExpenses: 23194.00,
    netProfit: 22037.89,
    healthScore: 92,
  });
  const [orgName, setOrgName] = useState<string | null>(null);

  const [aiInsights, setAiInsights] = useState<InsightItem[]>([
    {
      type: "warning",
      title: "Cash Flow Alert",
      description: "Based on historical trends, you're projected to have a cash deficit of $4,500 in mid-August. Consider delaying the upcoming software purchase.",
    },
    {
      type: "suggestion",
      title: "Expense Optimisation",
      description: "Your SaaS subscriptions have increased by 15% this quarter. Reviewing inactive accounts could save up to $850/month.",
    },
  ]);

  const handleFetchAiInsights = async (currentMetrics = metrics) => {
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
      if (res.ok && data.insights && Array.isArray(data.insights)) {
        setAiInsights(data.insights);
        setAiSource(data.source === "openai_live" ? "OpenAI GPT-4o" : "Futrix Financial Engine");
      }
    } catch (err) {
      console.error("AI Insights fetch error:", err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/xero/sync', { method: 'POST' });
      const data = await response.json();
      if (response.ok && data.metrics) {
        setMetrics(data.metrics);
        if (data.message?.includes("org:")) setOrgName(data.message.split("org: ")[1]);
        handleFetchAiInsights(data.metrics);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
      setLastSynced(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    handleSync();
  }, []);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  return (
    <div className="flex flex-col gap-8 pb-12">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-foreground/50 mt-0.5">
            {orgName ? (
              <>Connected to <span className="font-semibold text-emerald-600">{orgName}</span></>
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
            className="flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-border rounded-xl text-sm font-medium hover:bg-foreground/10 transition-all disabled:opacity-50"
          >
            <RefreshCcw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-primary' : 'text-foreground/60'}`} />
            {isSyncing ? "Syncing…" : "Sync"}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md hover:shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </button>
        </div>
      </div>

      {/* ── Xero connection banner ── */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-emerald-500/8 to-transparent border border-emerald-500/20 rounded-2xl">
        <div className="w-8 h-8 rounded-lg bg-[#1AB4D7]/10 border border-[#1AB4D7]/20 flex items-center justify-center flex-shrink-0">
          <span className="text-[#1AB4D7] font-black text-sm">X</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {orgName ? `Xero — ${orgName}` : "Connect Xero to see live data"}
          </p>
          <p className="text-xs text-foreground/50 truncate">
            {orgName ? "Invoices, bills, and transactions synced automatically" : "Connect your accounting software to enable auto-sync"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {orgName ? (
            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 text-xs font-bold rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          ) : (
            <Link href="/integrations/xero" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1AB4D7] text-white text-xs font-semibold rounded-lg hover:bg-[#1AB4D7]/90 transition-colors">
              <Zap className="w-3.5 h-3.5" /> Connect
            </Link>
          )}
        </div>
      </div>

      {/* ── KPI cards ── */}
      <div>
        <h2 className="text-sm font-semibold text-foreground/50 uppercase tracking-wider mb-4">
          This Month&apos;s Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <KPICard title="Total Revenue"    value={fmt(metrics.totalRevenue)}  trend={12.5} trendLabel="vs last month" icon={<DollarSign className="w-5 h-5" />} />
          <KPICard title="Total Expenses"   value={fmt(metrics.totalExpenses)} trend={-4.5} trendLabel="vs last month" icon={<TrendingDown className="w-5 h-5" />} />
          <KPICard title="Net Profit"       value={fmt(metrics.netProfit)}     trend={8.2}  trendLabel="vs last month" icon={<TrendingUp className="w-5 h-5" />} />
          <KPICard title="Health Score"     value={`${metrics.healthScore}/100`} trend={2.4} trendLabel="stable"      icon={<Activity className="w-5 h-5" />} />
        </div>
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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

      {/* ── AI insights ── */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center text-violet-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground text-sm">AI Financial Insights</h3>
                {aiSource && (
                  <span className="px-2 py-0.5 bg-violet-500/10 text-violet-600 text-[10px] font-bold rounded-full">
                    {aiSource}
                  </span>
                )}
              </div>
              <p className="text-xs text-foreground/50">Real-time LLM financial analysis & risk detector</p>
            </div>
          </div>

          <button
            onClick={() => handleFetchAiInsights()}
            disabled={isGeneratingAi}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-violet-600 text-white rounded-xl text-xs font-semibold hover:bg-violet-700 transition-all shadow-sm disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? "animate-spin" : ""}`} />
            {isGeneratingAi ? "Analyzing Data..." : "Run AI Analysis"}
          </button>
        </div>

        <div className="p-5 grid sm:grid-cols-3 gap-4">
          {aiInsights.map((insight, idx) => {
            const isWarning = insight.type === "warning";
            const isSuggestion = insight.type === "suggestion";
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex flex-col justify-between ${
                  isWarning
                    ? "bg-amber-500/8 border-amber-500/20"
                    : isSuggestion
                    ? "bg-blue-500/8 border-blue-500/20"
                    : "bg-emerald-500/8 border-emerald-500/20"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {isWarning ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    ) : isSuggestion ? (
                      <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    )}
                    <h4 className="font-bold text-foreground text-sm leading-tight">{insight.title}</h4>
                  </div>
                  <p className="text-xs text-foreground/70 leading-relaxed">{insight.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Futrli-Style Infinite Scrolling Partner Marquee ── */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-4 overflow-hidden">
        <div className="flex items-center gap-3 mb-3 px-2">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground/40">Verified Partners & Integrations</span>
          <div className="h-px bg-border flex-1" />
        </div>
        <div className="relative w-full overflow-hidden mask-fade">
          <div className="animate-marquee flex items-center gap-8 py-2">
            {[...LOGO_PARTNERS, ...LOGO_PARTNERS].map((partner, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-4 py-2 bg-foreground/5 border border-border rounded-xl flex-shrink-0"
              >
                <div className={`w-6 h-6 rounded-lg bg-card border border-border flex items-center justify-center font-black text-xs ${partner.color}`}>
                  {partner.icon}
                </div>
                <span className="text-xs font-semibold text-foreground/80 whitespace-nowrap">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── About Futrix Platform Section (Futrli-inspired) ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mb-8">
          <span className="inline-block px-3.5 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
            About Futrix Engine
          </span>
          <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-3">
            Built for modern finance teams who demand clarity, not chaos
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Futrix brings your accounting data, cash flow forecasting, board reporting, and AI-powered advice under one intelligent roof — keeping you in command of your business growth.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ABOUT_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className={`p-5 rounded-2xl border ${pillar.bg} bg-slate-900/60 backdrop-blur-sm hover:border-emerald-500/40 transition-all`}
              >
                <div className={`w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4 ${pillar.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-white mb-1.5">{pillar.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Customer & Site Reviews Section (Single-Review Carousel Slider) ── */}
      <div className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-sm">
        {/* Rating Header & Navigation Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wide text-foreground/50">Customer Satisfaction</span>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold rounded-full">Trustpilot Verified</span>
            </div>
            <h3 className="text-xl font-black text-foreground">Why 2,400+ Finance Leaders Choose Futrix</h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 px-4 py-2 bg-foreground/5 rounded-2xl border border-border">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-xs font-bold text-foreground">
                4.9 / 5 <span className="text-foreground/40 font-normal hidden sm:inline">from 320+ reviews</span>
              </div>
            </div>

            {/* Slider Arrow Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevReview}
                className="w-10 h-10 rounded-xl bg-foreground/5 border border-border flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-all active:scale-95"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextReview}
                className="w-10 h-10 rounded-xl bg-foreground/5 border border-border flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-all active:scale-95"
                aria-label="Next review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Single Testimonial Card */}
        {(() => {
          const currentRev = REVIEWS[activeReviewIndex];
          return (
            <div className="bg-gradient-to-br from-foreground/[0.03] to-foreground/[0.01] border border-border/80 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden transition-all duration-300">
              <Quote className="w-12 h-12 text-emerald-500/15 absolute right-6 top-6 pointer-events-none" />

              <div className="mb-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(currentRev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs text-foreground/40 font-medium ml-2">Verified Review</span>
                </div>

                <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed italic">
                  &ldquo;{currentRev.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-sm flex items-center justify-center shadow-sm flex-shrink-0">
                    {currentRev.author[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-foreground">{currentRev.author}</p>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-xs text-foreground/50">{currentRev.role}</p>
                  </div>
                </div>

                {/* Dot Position Indicators */}
                <div className="flex items-center gap-1.5">
                  {REVIEWS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveReviewIndex(i)}
                      className={`h-2 rounded-full transition-all ${
                        activeReviewIndex === i
                          ? "w-6 bg-emerald-500"
                          : "w-2 bg-foreground/20 hover:bg-foreground/40"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      <CreateInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => { handleSync(); }}
      />
    </div>
  );
}
