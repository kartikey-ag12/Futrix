"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, TrendingUp, BarChart3, LineChart } from "lucide-react";
import clsx from "clsx";

const FORECAST_TYPES = [
  {
    id: "1yr-pl",
    title: "1 year P&L only",
    icon: BarChart3,
    href: "/forecasting/new?type=1yr-pl",
  },
  {
    id: "3yr-cf",
    title: "3 year cash flow",
    icon: TrendingUp,
    href: "/forecasting/new?type=3yr-cf",
  },
  {
    id: "3yr-cf-inv",
    title: "3 year cash flow with due invoices",
    icon: LineChart,
    href: "/forecasting/new?type=3yr-cf-inv",
  },
];

export function ForecastCreationCards() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="w-full">
      <h2 className="text-base font-semibold text-foreground mb-4">Create a budget, forecast or scenario</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {FORECAST_TYPES.map((type) => {
          const isSelected = selectedId === type.id;
          const Icon = type.icon;
          
          return (
            <Link
              key={type.id}
              href={type.href}
              onClick={() => setSelectedId(type.id)}
              className={clsx(
                "relative flex flex-col items-center justify-center p-8 bg-white dark:bg-[#111] border rounded-2xl transition-all text-center group cursor-pointer",
                isSelected 
                  ? "border-emerald-500 shadow-md ring-1 ring-emerald-500" 
                  : "border-[#e5e5e5] dark:border-white/8 hover:border-emerald-500/50 hover:shadow-sm"
              )}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 text-emerald-500">
                  <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                </div>
              )}
              
              <div className={clsx(
                "w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors",
                isSelected ? "bg-emerald-500/10 text-emerald-600" : "bg-foreground/5 text-foreground/60 group-hover:bg-emerald-500/5 group-hover:text-emerald-500"
              )}>
                <Icon className="w-7 h-7" />
              </div>
              
              <h3 className={clsx(
                "font-semibold text-lg max-w-[200px] leading-tight transition-colors",
                isSelected ? "text-emerald-700 dark:text-emerald-500" : "text-foreground"
              )}>
                {type.title}
              </h3>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
