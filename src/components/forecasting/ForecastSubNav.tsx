"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface ForecastSubNavProps {
  forecastId: string;
  predictionsExplanation: boolean;
  setPredictionsExplanation: (val: boolean) => void;
}

export function ForecastSubNav({ forecastId, predictionsExplanation, setPredictionsExplanation }: ForecastSubNavProps) {
  const pathname = usePathname();

  const tabs = [
    { id: "invoices", label: "Invoices" },
    { id: "sales", label: "Sales" },
    { id: "costs", label: "Costs" },
    { id: "expenses", label: "Expenses" },
    { id: "other-pl", label: "Other P&L" },
    { id: "assets", label: "Assets" },
    { id: "liabilities", label: "Liabilities" },
    { id: "profit-loss", label: "Profit & Loss" },
    { id: "balance-sheet", label: "Balance Sheet" },
    { id: "cash-flow-statement", label: "Cash Flow Statement" },
  ];

  return (
    <div className="w-full bg-white dark:bg-[#111] border-b border-[#e5e5e5] dark:border-white/10 px-6 flex items-center justify-between shrink-0 overflow-x-auto custom-scrollbar">
      <div className="flex items-center gap-6">
        {tabs.map((tab) => {
          const href = `/forecasting/${forecastId}/${tab.id}`;
          const isActive = pathname.startsWith(href) || (pathname === `/forecasting/${forecastId}` && tab.id === "invoices");

          return (
            <Link
              key={tab.id}
              href={href}
              className={clsx(
                "py-3 text-sm transition-colors whitespace-nowrap border-b-2",
                isActive 
                  ? "border-emerald-500 font-bold text-emerald-600 dark:text-emerald-500" 
                  : "border-transparent font-medium text-foreground/60 hover:text-foreground"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3 ml-8 shrink-0 py-3">
        <span className="text-sm font-medium text-foreground">Predictions explanation</span>
        <button
          onClick={() => setPredictionsExplanation(!predictionsExplanation)}
          className={clsx(
            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
            predictionsExplanation ? "bg-emerald-500" : "bg-foreground/20"
          )}
          role="switch"
          aria-checked={predictionsExplanation}
        >
          <span
            aria-hidden="true"
            className={clsx(
              "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
              predictionsExplanation ? "translate-x-4" : "translate-x-0"
            )}
          />
        </button>
      </div>
    </div>
  );
}
