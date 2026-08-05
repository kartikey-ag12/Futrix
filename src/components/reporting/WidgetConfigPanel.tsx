"use client";

import { X } from "lucide-react";
import { WidgetConfig } from "@/hooks/useTemplates";

interface WidgetConfigPanelProps {
  config: WidgetConfig;
  onChange: (newConfig: WidgetConfig) => void;
  onClose: () => void;
}

export function WidgetConfigPanel({ config, onChange, onClose }: WidgetConfigPanelProps) {
  const handleChange = (field: keyof WidgetConfig, value: string) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="absolute top-0 right-0 h-full w-[320px] bg-white dark:bg-[#1a1a1a] border-l border-[#e5e5e5] dark:border-white/10 shadow-xl z-20 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between p-4 border-b border-[#e5e5e5] dark:border-white/10">
        <h3 className="font-semibold text-foreground">Configure Widget</h3>
        <button onClick={onClose} className="text-foreground/50 hover:text-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Title</label>
          <input
            type="text"
            value={config.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Click here to edit your title"
            className="w-full px-3 py-2 border border-[#e5e5e5] dark:border-white/20 rounded-md bg-transparent text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Subtitle</label>
          <input
            type="text"
            value={config.subtitle || ""}
            onChange={(e) => handleChange("subtitle", e.target.value)}
            placeholder="Click here to edit sub-title"
            className="w-full px-3 py-2 border border-[#e5e5e5] dark:border-white/20 rounded-md bg-transparent text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Chart Type</label>
          <select
            value={config.chartType}
            onChange={(e) => handleChange("chartType", e.target.value)}
            className="w-full px-3 py-2 border border-[#e5e5e5] dark:border-white/20 rounded-md bg-white dark:bg-[#222] text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="bar-vertical">Vertical Bar</option>
            <option value="bar-horizontal">Horizontal Bar</option>
            <option value="pie">Pie Chart</option>
            <option value="table">Table</option>
            <option value="scoreboard">Scorecard</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Dataset</label>
          <select
            value={config.dataset}
            onChange={(e) => handleChange("dataset", e.target.value)}
            className="w-full px-3 py-2 border border-[#e5e5e5] dark:border-white/20 rounded-md bg-white dark:bg-[#222] text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="cash-out">Cash out from bills</option>
            <option value="cash-in">Cash in from invoices</option>
            <option value="top-expenses">Top cost & expense accounts</option>
            <option value="top-sales">Top sales accounts</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Date Range</label>
          <select
            value={config.dateRange}
            onChange={(e) => handleChange("dateRange", e.target.value)}
            className="w-full px-3 py-2 border border-[#e5e5e5] dark:border-white/20 rounded-md bg-white dark:bg-[#222] text-sm focus:outline-none focus:border-emerald-500"
          >
            <option value="this-month">This month</option>
            <option value="last-month">Last month</option>
            <option value="this-quarter">This quarter</option>
            <option value="this-year">This financial year</option>
            <option value="last-12-months">Last 12 months</option>
          </select>
        </div>
      </div>
    </div>
  );
}
