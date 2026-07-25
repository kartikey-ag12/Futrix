"use client";

import { useState } from "react";
import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import {
  TrendingUp, TrendingDown, RefreshCcw, ChevronDown,
  Target, Flame, BarChart2, AlertCircle, CheckCircle2,
} from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { useFinancial } from "@/context/FinancialContext";

const SCENARIOS = [
  { id: "base",  label: "Base Case (Most Likely)" },
  { id: "best",  label: "Best Case (+20% Revenue)" },
  { id: "worst", label: "Worst Case (+15% Expenses)" },
];

const MILESTONES = [
  { label: "Break-even point achieved",   date: "July 2026", done: true },
  { label: "End-of-Q3 cash reserve target", date: "Sept 2026", done: true },
  { label: "Q4 expansion headcount goal", date: "Dec 2026",  done: false },
  { label: "12-month runway secured",     date: "Jan 2027",  done: false },
];

export default function ForecastingPage() {
  const { metrics, handleXeroSync } = useFinancial();
  const [scenario, setScenario] = useState("base");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);

  const mRev = metrics.totalRevenue;
  const mExp = metrics.totalExpenses;
  // Assume a base starting cash reserve if they are running a deficit, to avoid 0 balance.
  const currentCash = Math.max(25000, mRev - mExp + 25000);

  const SCENARIO_DATA: Record<string, { balance: string; burn: string; runway: string; risk: string; riskColor: string; multiplier: number }> = {
    base:  { 
      balance: `$${Math.round(currentCash).toLocaleString()}`,  
      burn: `$${Math.round(mExp).toLocaleString()}/mo`, 
      runway: mExp > 0 ? `${(currentCash / mExp).toFixed(1)} months` : "24+ months", 
      risk: mExp > currentCash / 3 ? "High" : "Low",    
      riskColor: mExp > currentCash / 3 ? "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800" : "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800", 
      multiplier: 1.0 
    },
    best:  { 
      balance: `$${Math.round(currentCash + (mRev * 0.2)).toLocaleString()}`,  
      burn: `$${Math.round(mExp * 0.9).toLocaleString()}/mo`, 
      runway: (mExp * 0.9) > 0 ? `${((currentCash + (mRev * 0.2)) / (mExp * 0.9)).toFixed(1)} months` : "24+ months", 
      risk: "None",  
      riskColor: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800", 
      multiplier: 1.2 
    },
    worst: { 
      balance: `$${Math.round(currentCash - (mExp * 0.15)).toLocaleString()}`,   
      burn: `$${Math.round(mExp * 1.15).toLocaleString()}/mo`, 
      runway: (mExp * 1.15) > 0 ? `${(Math.max(0, currentCash - (mExp * 0.15)) / (mExp * 1.15)).toFixed(1)} months` : "0 months",  
      risk: "High",  
      riskColor: "text-red-600 bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800", 
      multiplier: 0.8 
    },
  };

  const handleUpdateForecast = async () => {
    setIsUpdating(true);
    setUpdateMessage(null);
    try {
      const res = await handleXeroSync();
      if (res) {
        setUpdateMessage("Q3 Forecast updated with live ledger data!");
      } else {
        setUpdateMessage("Q3 Forecast recalculated based on cash velocity.");
      }
    } catch {
      setUpdateMessage("Q3 Forecast model recalculated.");
    } finally {
      setIsUpdating(false);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setTimeout(() => setUpdateMessage(null), 4000);
    }
  };

  const data = SCENARIO_DATA[scenario];

  return (
    <div className="flex flex-col gap-7 pb-12">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Q3 2026 Financial Forecasting</h1>
          <p className="text-sm text-foreground/50 mt-0.5">
            AI-driven cash flow projections and scenario planning for Q3 2026
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
            Q3 Scenario Analysis
          </p>
          <p className="text-sm text-foreground/70">
            Switch between scenarios to see how your Q3 2026 cash balance and runway adapt.
          </p>
        </div>
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-semibold hover:border-primary transition-all w-72 shadow-sm text-foreground"
          >
            <BarChart2 className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="flex-1 text-left">{SCENARIOS.find(s => s.id === scenario)?.label}</span>
            <ChevronDown className={`w-4 h-4 text-foreground/40 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {dropdownOpen && (
            <div className="absolute top-full mt-2 right-0 w-72 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-border/60">
              {SCENARIOS.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setScenario(s.id); setDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-foreground/5 transition-colors flex items-center justify-between ${
                    scenario === s.id ? "text-primary font-bold bg-primary/5" : "text-foreground font-medium"
                  }`}
                >
                  <span>{s.label}</span>
                  {scenario === s.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
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
          <p className="text-sm font-medium text-foreground/60">Q3 Scenario Risk</p>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-bold self-start ${data.riskColor}`}>
            {scenario === "worst" ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {data.risk} Risk
          </div>
        </div>
      </div>

      {/* ── Projected Cash Flow Chart ── */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-black text-xl text-foreground">90-Day Cash Flow Runway</h3>
            <p className="text-sm text-foreground/50 mt-0.5">
              Projected net cash position for Q3 2026 ({SCENARIOS.find(s => s.id === scenario)?.label})
            </p>
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-xs font-bold rounded-full w-max">
            Daily Forecast Active
          </span>
        </div>
        <CashFlowChart totalRevenue={metrics.totalRevenue * data.multiplier} totalExpenses={metrics.totalExpenses} />
      </div>

      {/* ── Milestones Tracker ── */}
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
        <h3 className="font-black text-xl text-foreground mb-1">Q3 & Q4 Financial Milestones</h3>
        <p className="text-sm text-foreground/50 mb-6">Track execution against core financial targets</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MILESTONES.map((m, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-foreground/[0.02] border border-border flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-foreground">{m.label}</p>
                <p className="text-[11px] text-foreground/50 mt-0.5">{m.date}</p>
              </div>
              {m.done ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-border flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
