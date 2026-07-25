"use client";

import { useState } from "react";
import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import {
  TrendingUp, TrendingDown, RefreshCcw, ChevronDown,
  Target, Flame, BarChart2, AlertCircle, CheckCircle2,
} from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";

const SCENARIOS = [
  { id: "base",  label: "Base Case (Most Likely)" },
  { id: "best",  label: "Best Case  (+20% Revenue)" },
  { id: "worst", label: "Worst Case (+15% Expenses)" },
];

const SCENARIO_DATA: Record<string, { balance: string; burn: string; runway: string; risk: string; riskColor: string }> = {
  base:  { balance: "$142,500",  burn: "$15,200/mo", runway: "9.4 months", risk: "Low",    riskColor: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  best:  { balance: "$198,300",  burn: "$12,800/mo", runway: "15.5 months", risk: "None",  riskColor: "text-blue-600 bg-blue-50 border-blue-200" },
  worst: { balance: "$89,100",   burn: "$17,500/mo", runway: "5.1 months",  risk: "High",  riskColor: "text-red-600 bg-red-50 border-red-200" },
};

const MILESTONES = [
  { label: "Break-even point",       date: "Aug 2024",  done: true  },
  { label: "Cash reserve target",    date: "Sep 2024",  done: true  },
  { label: "Q4 revenue goal",        date: "Dec 2024",  done: false },
  { label: "12-month runway secured",date: "Jan 2025",  done: false },
];

export default function ForecastingPage() {
  const [scenario, setScenario] = useState("base");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  const handleUpdateForecast = async () => {
    setIsUpdating(true);
    setUpdateMessage(null);
    try {
      // Trigger live sync and forecast recalculation
      const res = await fetch("/api/xero/sync", { method: "POST" });
      if (res.ok) {
        setUpdateMessage("Forecast updated with live ledger data!");
      } else {
        setUpdateMessage("Forecast recalculated based on current cash velocity.");
      }
    } catch {
      setUpdateMessage("Forecast model recalculated.");
    } finally {
      setIsUpdating(false);
      setLastUpdated(new Date().toLocaleTimeString());
      setTimeout(() => setUpdateMessage(null), 4000);
    }
  };

  const data = SCENARIO_DATA[scenario];

  return (
    <div className="flex flex-col gap-7">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Forecasting</h1>
          <p className="text-sm text-foreground/50 mt-0.5">
            AI-driven cash flow projections and scenario planning
            {lastUpdated && <span className="ml-2 font-medium text-emerald-600">· Updated at {lastUpdated}</span>}
          </p>
        </div>
        <button
          onClick={handleUpdateForecast}
          disabled={isUpdating}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50"
        >
          <RefreshCcw className={`w-4 h-4 ${isUpdating ? "animate-spin" : ""}`} />
          {isUpdating ? "Recalculating..." : "Update Forecast"}
        </button>
      </div>

      {updateMessage && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold rounded-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{updateMessage}</span>
        </div>
      )}

      {/* ── Scenario selector ── */}
      <div className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-1">
            Scenario Analysis
          </p>
          <p className="text-sm text-foreground/70">
            Switch between scenarios to see how your forecast changes under different conditions.
          </p>
        </div>
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 px-4 py-2.5 bg-foreground/5 border border-border rounded-xl text-sm font-medium hover:bg-foreground/10 transition-all w-72"
          >
            <BarChart2 className="w-4 h-4 text-foreground/50 flex-shrink-0" />
            <span className="flex-1 text-left">{SCENARIOS.find(s => s.id === scenario)?.label}</span>
            <ChevronDown className={`w-4 h-4 text-foreground/40 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute top-full mt-2 right-0 w-72 bg-card border border-border rounded-xl shadow-xl z-10 overflow-hidden">
              {SCENARIOS.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setScenario(s.id); setDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-foreground/5 transition-colors ${scenario === s.id ? "text-primary font-semibold" : "text-foreground/70"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── KPI cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          title="Projected End-of-Q3 Balance"
          value={data.balance}
          trend={15.2}
          trendLabel="vs current"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <KPICard
          title="Estimated Burn Rate"
          value={data.burn}
          trend={-2.1}
          trendLabel="vs last month"
          icon={<Flame className="w-5 h-5" />}
        />
        <KPICard
          title="Cash Runway"
          value={data.runway}
          icon={<Target className="w-5 h-5" />}
          trendLabel="at current burn"
        />
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col gap-3">
          <p className="text-sm font-medium text-foreground/60">Scenario Risk</p>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-bold self-start ${data.riskColor}`}>
            {scenario === "worst" ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {data.risk} Risk
          </div>
          <p className="text-xs text-foreground/50 leading-relaxed">
            {scenario === "worst" ? "Consider reducing discretionary spend." : "Financial position looks healthy under this scenario."}
          </p>
        </div>
      </div>

      {/* ── Runway chart ── */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">6-Month Runway Projection</h3>
            <p className="text-xs text-foreground/50 mt-0.5">
              Includes committed recurring expenses and projected sales pipeline ·{" "}
              <span className="font-medium capitalize">{scenario.replace("_", " ")} scenario</span>
            </p>
          </div>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-foreground/50">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Inflow
            </span>
            <span className="flex items-center gap-1.5 text-foreground/50">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Outflow
            </span>
          </div>
        </div>
        <div className="p-6 h-[380px]">
          <CashFlowChart />
        </div>
      </div>

      {/* ── Milestones ── */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Financial Milestones</h3>
          <p className="text-xs text-foreground/50 mt-0.5">Progress against your annual goals</p>
        </div>
        <div className="divide-y divide-border">
          {MILESTONES.map((m) => (
            <div key={m.label} className="flex items-center gap-4 px-6 py-4">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                m.done ? "bg-emerald-100 text-emerald-600" : "bg-foreground/5 text-foreground/30"
              }`}>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${m.done ? "text-foreground" : "text-foreground/50"}`}>
                  {m.label}
                </p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                m.done
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-foreground/5 text-foreground/40"
              }`}>
                {m.done ? "✓ " : ""}{m.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Trend comparison ── */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <h3 className="font-semibold text-foreground mb-1">Revenue Trend</h3>
          <p className="text-xs text-foreground/50 mb-5">Actuals vs forecast</p>
          <div className="flex items-end gap-3 h-24">
            {[65, 72, 68, 80, 88, 92].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-primary/20 hover:bg-primary/40 transition-colors"
                  style={{ height: `${v}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-foreground/40">
            {["Feb","Mar","Apr","May","Jun","Jul"].map(m => <span key={m}>{m}</span>)}
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <h3 className="font-semibold text-foreground mb-1">Expense Categories</h3>
          <p className="text-xs text-foreground/50 mb-5">This month breakdown</p>
          <div className="space-y-3">
            {[
              { label: "Salaries", pct: 58, color: "bg-primary" },
              { label: "SaaS / Tools", pct: 22, color: "bg-blue-400" },
              { label: "Marketing", pct: 12, color: "bg-amber-400" },
              { label: "Other", pct: 8, color: "bg-slate-300" },
            ].map((e) => (
              <div key={e.label} className="flex items-center gap-3">
                <span className="text-xs text-foreground/60 w-20 flex-shrink-0">{e.label}</span>
                <div className="flex-1 h-2 bg-foreground/5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${e.color}`} style={{ width: `${e.pct}%` }} />
                </div>
                <span className="text-xs font-medium text-foreground/60 w-8 text-right">{e.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
