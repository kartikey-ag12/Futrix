"use client";

import { useState } from "react";
import { CheckCircle2, TrendingUp, BarChart3, LineChart } from "lucide-react";
import clsx from "clsx";
import { ForecastCreationWizard } from "./ForecastCreationWizard";

const FORECAST_TYPES = [
  {
    id: "1yr-pl",
    title: "1 year P&L only",
    icon: BarChart3,
  },
  {
    id: "3yr-cf",
    title: "3 year cash flow",
    icon: TrendingUp,
  },
  {
    id: "3yr-cf-inv",
    title: "3 year cash flow with due invoices",
    icon: LineChart,
  },
];

export function ForecastCreationCards() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);

  const handleCardClick = (id: string) => {
    setSelectedId(id);
    setWizardOpen(true);
  };

  return (
    <div className="w-full">
      <h2 className="text-base font-semibold text-foreground mb-4">Create a budget, forecast or scenario</h2>
      
      <div className="flex flex-wrap items-center gap-4">
        {FORECAST_TYPES.map((type) => {
          const isSelected = selectedId === type.id;
          const Icon = type.icon;
          
          return (
            <button
              key={type.id}
              onClick={() => handleCardClick(type.id)}
              className={clsx(
                "flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-[#111] border rounded-xl transition-all cursor-pointer",
                isSelected 
                  ? "border-emerald-500 shadow-sm ring-1 ring-emerald-500" 
                  : "border-[#e5e5e5] dark:border-white/10 hover:border-emerald-500/50 hover:shadow-sm"
              )}
            >
              <div className="text-emerald-500">
                <Icon className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <span className={clsx(
                "text-sm font-semibold whitespace-nowrap",
                isSelected ? "text-emerald-700 dark:text-emerald-500" : "text-foreground"
              )}>
                {type.title}
              </span>
            </button>
          );
        })}
      </div>

      <ForecastCreationWizard 
        open={wizardOpen} 
        onOpenChange={setWizardOpen}
        type={selectedId || "1yr-pl"} 
      />
    </div>
  );
}
