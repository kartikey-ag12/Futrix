"use client";

import { useState } from "react";
import { ChevronDown, Settings, HelpCircle, Plus } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface ForecastDetailToolbarProps {
  cashFlowView: boolean;
  setCashFlowView: (val: boolean) => void;
}

export function ForecastDetailToolbar({ cashFlowView, setCashFlowView }: ForecastDetailToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [controlsOpen, setControlsOpen] = useState(false);
  const [periodsOpen, setPeriodsOpen] = useState(false);
  const [newPredOpen, setNewPredOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  const [selectedPeriod, setSelectedPeriod] = useState("Monthly");

  const periods = ["Days", "Weeks", "Months", "Quarters", "Years"];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // extract forecastId from pathname /forecasting/[id]
    const match = pathname.match(/\/forecasting\/([^\/]+)/);
    const forecastId = match ? match[1] : null;
    if (!forecastId) {
      alert("Forecast ID not found");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("forecastId", forecastId);

    setIsImporting(true);
    setControlsOpen(false);
    try {
      const res = await fetch("/api/excel/import/forecast", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to import");
      
      // refresh data on page
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to import excel overrides");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="w-full bg-white border-b border-[#e5e5e5] dark:bg-[#111] dark:border-white/10 px-6 py-3 flex items-center justify-between z-10 shrink-0">
      
      {/* Left side */}
      <div className="flex items-center gap-4">
        {/* Controls Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setControlsOpen(!controlsOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-foreground/5 rounded-md transition-colors"
          >
            <Settings className="w-4 h-4" />
            Controls
            <ChevronDown className="w-3 h-3 ml-1" />
          </button>
          
          {controlsOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-white/10 rounded-md shadow-lg py-1 z-50">
              <button onClick={() => setControlsOpen(false)} className="w-full text-left px-4 py-2 text-sm text-foreground/70 hover:bg-foreground/5 hover:text-foreground">Assumptions</button>
              <button onClick={() => setControlsOpen(false)} className="w-full text-left px-4 py-2 text-sm text-foreground/70 hover:bg-foreground/5 hover:text-foreground">Settings</button>
              <div className="w-full h-px bg-foreground/10 my-1" />
              <label className="w-full block text-left px-4 py-2 text-sm text-foreground/70 hover:bg-foreground/5 hover:text-foreground cursor-pointer">
                {isImporting ? "Importing..." : "Import from Excel"}
                <input type="file" className="hidden" accept=".xlsx" onChange={handleFileUpload} disabled={isImporting} />
              </label>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-[#e5e5e5] dark:bg-white/10" />

        {/* Cash flow view toggle */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">Cash flow view</span>
          <button
            onClick={() => setCashFlowView(!cashFlowView)}
            className={clsx(
              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
              cashFlowView ? "bg-emerald-500" : "bg-foreground/20"
            )}
            role="switch"
            aria-checked={cashFlowView}
          >
            <span
              aria-hidden="true"
              className={clsx(
                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                cashFlowView ? "translate-x-4" : "translate-x-0"
              )}
            />
          </button>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground/60">Periods:</span>
          <div className="relative">
            <button 
              onClick={() => setPeriodsOpen(!periodsOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-foreground border border-[#e5e5e5] dark:border-white/10 rounded-md hover:bg-foreground/5 transition-colors"
            >
              {selectedPeriod}
              <ChevronDown className="w-3 h-3 ml-1 text-foreground/50" />
            </button>
            {periodsOpen && (
              <div className="absolute top-full right-0 mt-1 w-32 bg-white dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-white/10 rounded-md shadow-lg py-1 z-50">
                {periods.map(p => (
                  <button 
                    key={p} 
                    onClick={() => { setSelectedPeriod(p); setPeriodsOpen(false); }}
                    className="w-full text-left px-4 py-1.5 text-sm text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setNewPredOpen(!newPredOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground text-background hover:opacity-90 rounded-md text-sm font-medium transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New prediction
            <ChevronDown className="w-3 h-3 ml-1 opacity-70" />
          </button>
          
          {newPredOpen && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-white/10 rounded-md shadow-lg py-1 z-50">
              <button 
                onClick={() => {
                  setNewPredOpen(false);
                  router.push("/forecasting");
                }} 
                className="w-full text-left px-4 py-2 text-sm text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
              >
                Create new prediction
              </button>
            </div>
          )}
        </div>

        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors" title="Help / Documentation">
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
