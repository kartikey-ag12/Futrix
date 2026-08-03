"use client";

import { useState } from "react";
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
  
  const hasForecasts = forecasts.length > 0;
  
  // For the actual chart, if a forecast is selected, we'd use its data.
  // For now, if we pass test data, we'll render it here.
  const activeForecast = forecasts.find(f => f.id === selectedDataset) || forecasts[0];
  const chartData = activeForecast?.data || [];

  return (
    <div className="w-full flex flex-col gap-4 mt-8">
      <h2 className="text-base font-semibold text-foreground mb-1">Forecast performance comparison</h2>
      
      {/* Controls Row */}
      <div className="flex flex-wrap items-center gap-4">
        
        {/* Dataset selector */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[280px]">
          <label className="text-xs font-medium text-foreground/70">Choose the datasets to compare</label>
          <div className={clsx(
            "flex items-center justify-between px-3 py-2.5 border rounded-lg text-sm bg-white dark:bg-[#111]",
            hasForecasts ? "border-[#e5e5e5] dark:border-white/10 cursor-pointer hover:border-emerald-500/50" : "border-transparent bg-foreground/5 cursor-not-allowed opacity-60"
          )}>
            <span className="truncate">
              {hasForecasts 
                ? (selectedDataset ? forecasts.find(f => f.id === selectedDataset)?.name : "Select a forecast...") 
                : "Please create an initial budget or fore..."}
            </span>
            <ChevronDown className="w-4 h-4 text-foreground/50 flex-shrink-0" />
          </div>
        </div>

        {/* Metric */}
        <div className="flex flex-col gap-1.5 w-[160px]">
          <label className="text-xs font-medium text-foreground/70">Comparison metric</label>
          <div className="flex items-center justify-between px-3 py-2.5 border border-[#e5e5e5] dark:border-white/10 rounded-lg text-sm bg-white dark:bg-[#111] cursor-pointer hover:border-emerald-500/50">
            <span>{metric}</span>
            <ChevronDown className="w-4 h-4 text-foreground/50" />
          </div>
        </div>

        {/* From Date */}
        <div className="flex flex-col gap-1.5 w-[160px]">
          <label className="text-xs font-medium text-foreground/70">From date</label>
          <div className="flex items-center justify-between px-3 py-2.5 border border-[#e5e5e5] dark:border-white/10 rounded-lg text-sm bg-white dark:bg-[#111] cursor-pointer hover:border-emerald-500/50">
            <span>{new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
            <Calendar className="w-4 h-4 text-foreground/50" />
          </div>
        </div>

        {/* Data Shown */}
        <div className="flex flex-col gap-1.5 w-[140px]">
          <label className="text-xs font-medium text-foreground/70">Data shown</label>
          <div className="flex items-center justify-between px-3 py-2.5 border border-[#e5e5e5] dark:border-white/10 rounded-lg text-sm bg-white dark:bg-[#111] cursor-pointer hover:border-emerald-500/50">
            <span>{dataShown}</span>
            <ChevronDown className="w-4 h-4 text-foreground/50" />
          </div>
        </div>

      </div>

      {/* Chart / Empty State Panel */}
      <div className="w-full bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl shadow-sm mt-2 flex flex-col min-h-[400px]">
        {hasForecasts ? (
          // Populated Chart State
          <div className="flex-1 p-6 flex flex-col">
            <h3 className="text-sm font-semibold mb-6">{metric} Comparison</h3>
            <div className="flex-1 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-foreground/5" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "currentColor" }} className="text-foreground/40" dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "currentColor" }} className="text-foreground/40" tickFormatter={(val) => `$${val / 1000}k`} />
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <Tooltip content={(props: any) => <CustomTooltip {...props} />} cursor={{ stroke: "rgba(0,0,0,0.1)", strokeWidth: 1, strokeDasharray: "4 4" }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: "12px", opacity: 0.8 }} />
                  <Line type="monotone" name="Actual" dataKey="actual" stroke="#10b981" strokeWidth={2} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" name="Forecast Target" dataKey="target" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, strokeWidth: 2 }} />
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
