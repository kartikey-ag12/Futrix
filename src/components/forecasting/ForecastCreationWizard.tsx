"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Info } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";

interface WizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: string;
}

export function ForecastCreationWizard({ open, onOpenChange, type }: WizardProps) {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [method, setMethod] = useState<"scratch" | "auto" | "last-year">("scratch");
  const [isCreating, setIsCreating] = useState(false);

  // In the real app, we'd fetch this from the user's connected Xero state.
  const syncOption = "Forecast data shows from last sync";

  if (!open) return null;

  const title = type === "cashflow-invoices" 
    ? "Create a 3 year cash flow with due invoices"
    : type === "cashflow" 
      ? "Create a 3 year cash flow"
      : "Create a 1 year P&L only";

  const handleCreate = async () => {
    if (!name.trim() || isCreating) return;
    setIsCreating(true);
    try {
      const res = await fetch("/api/forecasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          type,
          method,
          months: [], // We can let the backend decide this or fill it based on method
        }),
      });
      if (res.ok) {
        const json = await res.json();
        onOpenChange(false);
        router.push(`/forecasting/${json.id}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" 
        onClick={() => onOpenChange(false)}
      />
      <div 
        className="fixed left-[50%] top-[50%] z-50 w-[700px] max-w-[90vw] translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-[#111] shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-[#e5e5e5] dark:border-white/10">
          <h2 className="text-[22px] font-bold text-foreground">
            {title}
          </h2>
          <button 
            onClick={() => onOpenChange(false)}
            className="p-1.5 hover:bg-foreground/5 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-foreground/80" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 pb-10 space-y-8 flex-1 overflow-y-auto">
          
          {/* Top Row Inputs */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Name</label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#e5e5e5] dark:border-white/20 rounded-md bg-white dark:bg-[#111] text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Show forecast data from</label>
              <div className="w-full px-3 py-2.5 border border-[#e5e5e5] dark:border-white/20 rounded-md bg-[#fafafa] dark:bg-[#111] text-sm flex items-center justify-between text-foreground/70">
                <span>{syncOption}</span>
                <Info className="w-4 h-4 text-foreground/50" />
              </div>
            </div>
          </div>

          {/* Creation Options */}
          <div className="space-y-4">
            <label className="text-base font-semibold text-foreground">How would you like to create it?</label>
            <div className="grid grid-cols-2 gap-4">
              
              {/* Option 1: From Scratch */}
              <button 
                onClick={() => setMethod("scratch")}
                className={clsx(
                  "p-4 rounded-xl border flex items-center gap-3 transition-all text-left",
                  method === "scratch" ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10" : "border-[#e5e5e5] dark:border-white/20 bg-[#fafafa] dark:bg-[#111] hover:border-emerald-500/50"
                )}
              >
                <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-black dark:bg-white/10 rounded-md relative overflow-hidden">
                   {/* Custom icon approximation based on screenshot */}
                   <div className="w-3 h-4 bg-emerald-500 rounded-sm"></div>
                </div>
                <span className="text-sm font-semibold text-foreground">From scratch</span>
              </button>

              {/* Option 2: Auto-predictions */}
              <button 
                onClick={() => setMethod("auto")}
                className={clsx(
                  "p-4 rounded-xl border flex items-center gap-3 transition-all text-left",
                  method === "auto" ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10" : "border-[#e5e5e5] dark:border-white/20 bg-[#fafafa] dark:bg-[#111] hover:border-emerald-500/50"
                )}
              >
                <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-white dark:bg-white/10 border-2 border-emerald-500 rounded-full relative">
                   <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                </div>
                <span className="text-sm font-semibold text-foreground">Create with auto-predictions</span>
              </button>

              {/* Option 3: Last year's actuals */}
              <button 
                onClick={() => setMethod("last-year")}
                className={clsx(
                  "p-4 rounded-xl border flex items-center gap-3 transition-all text-left",
                  method === "last-year" ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10" : "border-[#e5e5e5] dark:border-white/20 bg-[#fafafa] dark:bg-[#111] hover:border-emerald-500/50"
                )}
              >
                <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-black dark:bg-white/10 rounded-md relative">
                   <div className="text-emerald-500 font-bold text-xs">£</div>
                </div>
                <span className="text-sm font-semibold text-foreground">Create from last year&apos;s actuals</span>
              </button>
            </div>
          </div>

          <p className="text-sm text-foreground/50 pt-2">
            Creating budgets or forecasts for the first time? Use our <span className="underline font-medium cursor-pointer">guided flows</span> on the home page
          </p>

        </div>

        {/* Footer Actions */}
        <div className="p-6 pt-4 border-t border-[#e5e5e5] dark:border-white/10 flex items-center justify-center gap-4 bg-[#fcfcfc] dark:bg-[#111]/80">
          <button 
            onClick={() => onOpenChange(false)}
            className="px-6 py-2 rounded-full border border-emerald-500 text-emerald-600 font-semibold text-sm hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleCreate}
            disabled={!name.trim() || isCreating}
            className="px-6 py-2 rounded-full bg-[#e2e8f0] dark:bg-white/10 text-foreground/50 font-semibold text-sm hover:bg-[#cbd5e1] dark:hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={name.trim() ? { backgroundColor: '#10b981', color: 'white' } : {}}
          >
            {isCreating ? "Creating..." : "Create new"}
          </button>
        </div>
      </div>
    </>
  );
}
