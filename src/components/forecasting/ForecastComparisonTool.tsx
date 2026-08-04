"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Calendar, Route } from "lucide-react";
import { useForecasts } from "@/hooks/useForecasts";
import clsx from "clsx";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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
          <span className="font-medium tabular-nums">${Number(p.value).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export function ForecastComparisonTool() {
  const { forecasts } = useForecasts();
  
  // Controls state
  const [selectedDataset, setSelectedDataset] = useState<string>("");
  const [metric, setMetric] = useState("Sales");
  const [dataShown, setDataShown] = useState("Months");
  
  const [datasetDropdownOpen, setDatasetDropdownOpen] = useState(false);
  const [metricDropdownOpen, setMetricDropdownOpen] = useState(false);
  const [dataShownDropdownOpen, setDataShownDropdownOpen] = useState(false);

  const hasForecasts = forecasts.length > 0;
  
  // Set default selection if not set
  useEffect(() => {
    if (hasForecasts && !selectedDataset) {
      setSelectedDataset(forecasts[0].id);
    }
  }, [hasForecasts, selectedDataset, forecasts]);

  const activeForecast = forecasts.find(f => f.id === selectedDataset) || forecasts[0];
  
  // Dummy data matching exactly the screenshot provided by user
  const fallbackDummyData = [
    { month: "Aug 26", actual: 720 },
    { month: "Sept 26", actual: 0 },
    { month: "Oct 26", actual: 0 },
    { month: "Nov 26", actual: 85 },
    { month: "Dec 26", actual: 0 },
    { month: "Jan 27", actual: 0 },
    { month: "Feb 27", actual: 0 },
    { month: "Mar 27", actual: 0 },
    { month: "Apr 27", actual: 0 },
    { month: "May 27", actual: 0 },
    { month: "Jun 27", actual: 0 },
    { month: "Jul 27", actual: 0 },
    { month: "Aug 27", actual: 0 },
  ];

  const chartData = activeForecast?.data?.length ? activeForecast.data : fallbackDummyData;

  return (
    <div className="w-full flex flex-col gap-4 mt-8">
      <h2 className="text-base font-bold text-foreground mb-4">Forecast performance comparison</h2>
      
      {/* Controls Row */}
      <div className="flex flex-wrap items-center gap-4 relative">
        
        {/* Dataset selector */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[280px] relative">
          <label className="text-sm font-semibold text-foreground">Choose the datasets to compare</label>
          <div 
            className={clsx(
              "flex items-center justify-between px-2 py-1 border rounded-lg text-sm bg-white dark:bg-[#111]",
              hasForecasts ? "border-[#e5e5e5] dark:border-white/10 cursor-pointer" : "border-transparent bg-foreground/5 cursor-not-allowed opacity-60"
            )}
            onClick={() => hasForecasts && setDatasetDropdownOpen(!datasetDropdownOpen)}
          >
            <div className="flex items-center gap-2">
              {hasForecasts && selectedDataset ? (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-emerald-500 rounded text-xs font-semibold text-emerald-800">
                  {forecasts.find(f => f.id === selectedDataset)?.name}
                  <span 
                    className="text-emerald-500 ml-1 cursor-pointer hover:text-emerald-700"
                    onClick={(e) => { e.stopPropagation(); setSelectedDataset(""); }}
                  >
                    X
                  </span>
                </div>
              ) : (
                <span className="text-foreground/60 px-2 py-1">Please select...</span>
              )}
            </div>
            <ChevronDown className="w-4 h-4 text-foreground/80 mr-2" />
          </div>
          {datasetDropdownOpen && hasForecasts && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-white/10 rounded-md shadow-xl z-50 py-1">
              {forecasts.map(f => (
                <div 
                  key={f.id} 
                  className="px-4 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer text-sm"
                  onClick={() => { setSelectedDataset(f.id); setDatasetDropdownOpen(false); }}
                >
                  {f.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Metric */}
        <div className="flex flex-col gap-1.5 w-[160px] relative">
          <label className="text-sm font-semibold text-foreground">Comparison metric</label>
          <div 
            className="flex items-center justify-between px-3 py-2 border border-[#e5e5e5] dark:border-white/10 rounded-lg text-sm bg-white dark:bg-[#111] cursor-pointer"
            onClick={() => setMetricDropdownOpen(!metricDropdownOpen)}
          >
            <span>{metric}</span>
            <ChevronDown className="w-4 h-4 text-foreground/80" />
          </div>
          {metricDropdownOpen && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-white/10 rounded-md shadow-xl z-50 py-1">
              {["Net cash flow", "Sales", "Expenses"].map(m => (
                <div 
                  key={m} 
                  className="px-4 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer text-sm"
                  onClick={() => { setMetric(m); setMetricDropdownOpen(false); }}
                >
                  {m}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* From Date */}
        <div className="flex flex-col gap-1.5 w-[160px]">
          <label className="text-sm font-semibold text-foreground">From date</label>
          <div className="flex items-center justify-between px-3 py-2 border border-[#e5e5e5] dark:border-white/10 rounded-lg text-sm bg-white dark:bg-[#111] cursor-pointer">
            <span>04/08/2026</span>
            <Calendar className="w-4 h-4 text-foreground/80" />
          </div>
        </div>

        {/* Data Shown */}
        <div className="flex flex-col gap-1.5 w-[140px] relative">
          <label className="text-sm font-semibold text-foreground">Data shown</label>
          <div 
            className="flex items-center justify-between px-3 py-2 border border-[#e5e5e5] dark:border-white/10 rounded-lg text-sm bg-white dark:bg-[#111] cursor-pointer"
            onClick={() => setDataShownDropdownOpen(!dataShownDropdownOpen)}
          >
            <span>{dataShown}</span>
            <ChevronDown className="w-4 h-4 text-foreground/80" />
          </div>
          {dataShownDropdownOpen && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-white/10 rounded-md shadow-xl z-50 py-1">
              {["Months", "Quarters", "Years"].map(d => (
                <div 
                  key={d} 
                  className="px-4 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer text-sm"
                  onClick={() => { setDataShown(d); setDataShownDropdownOpen(false); }}
                >
                  {d}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Chart / Empty State Panel */}
      <div className="w-full bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-sm shadow-sm mt-6 flex flex-col min-h-[400px]">
        {hasForecasts ? (
          // Populated Chart State
          <div className="flex-1 p-6 flex flex-col">
            <h3 className="text-lg font-bold mb-4">{metric}</h3>
            
            {/* Custom Legend */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-2.5 bg-emerald-400 rounded-full"></div>
              <span className="text-sm font-semibold text-foreground/80">{forecasts.find(f => f.id === selectedDataset)?.name || "My first forecast"}</span>
            </div>

            <div className="w-full h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                  <XAxis dataKey="month" axisLine={{ stroke: '#e5e5e5' }} tickLine={false} tick={{ fontSize: 12, fill: "#888" }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#888" }} />
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <Tooltip content={(props: any) => <CustomTooltip {...props} />} cursor={{ stroke: "rgba(0,0,0,0.1)", strokeWidth: 1, strokeDasharray: "4 4" }} />
                  <Line type="linear" name="Actual" dataKey="actual" stroke="#34d399" strokeWidth={2} dot={{ r: 4, fill: "#34d399", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          // Empty State
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="w-32 h-32 mb-6 relative">
              {/* Abstract Signpost / Pathway Graphic */}
              <div className="absolute inset-0 bg-emerald-500/5 rounded-full flex items-center justify-center">
                <div className="relative">
                  <Route className="w-16 h-16 text-emerald-500" strokeWidth={1.5} />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-foreground mb-2">No forecasts available</h3>
            <p className="text-sm text-foreground/60 max-w-sm leading-relaxed">
              Create an initial budget, forecast, or scenario above to start comparing performance metrics and mapping your financial future.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
