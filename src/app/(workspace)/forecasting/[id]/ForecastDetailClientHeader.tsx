"use client";

import { ForecastDetailToolbar } from "@/components/forecasting/ForecastDetailToolbar";
import { ForecastSubNav } from "@/components/forecasting/ForecastSubNav";
import { useForecastContext } from "./ForecastContext";
import Link from "next/link";

interface ForecastDetailClientHeaderProps {
  forecastId: string;
  forecastName: string;
}

export function ForecastDetailClientHeader({ forecastId, forecastName }: ForecastDetailClientHeaderProps) {
  const { cashFlowView, setCashFlowView, predictionsExplanation, setPredictionsExplanation } = useForecastContext();

  return (
    <div className="flex flex-col w-full shrink-0">
      <ForecastDetailToolbar cashFlowView={cashFlowView} setCashFlowView={setCashFlowView} />
      
      {/* Page Header */}
      <div className="w-full bg-white dark:bg-[#111] px-6 py-4 flex items-center justify-between border-b border-[#e5e5e5] dark:border-white/10 shrink-0">
        <h1 className="text-xl font-semibold text-foreground truncate">{forecastName}</h1>
        <Link href="#" className="text-sm font-medium text-foreground underline decoration-foreground/30 hover:decoration-foreground transition-all">
          Checklist
        </Link>
      </div>

      <ForecastSubNav 
        forecastId={forecastId} 
        predictionsExplanation={predictionsExplanation} 
        setPredictionsExplanation={setPredictionsExplanation} 
      />
    </div>
  );
}
