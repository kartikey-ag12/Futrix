"use client";

import { useState } from "react";
import { ForecastDetailToolbar } from "@/components/forecasting/ForecastDetailToolbar";
import { ForecastSubNav } from "@/components/forecasting/ForecastSubNav";
import { ForecastChecklistModal } from "@/components/forecasting/ForecastChecklistModal";
import { useForecastContext } from "./ForecastContext";
import Link from "next/link";

interface ForecastDetailClientHeaderProps {
  forecastId: string;
  forecastName: string;
  userName?: string;
  checklistState?: any;
  manualOverrides?: any;
}

export function ForecastDetailClientHeader({ 
  forecastId, 
  forecastName,
  userName = "User",
  checklistState = {},
  manualOverrides = {}
}: ForecastDetailClientHeaderProps) {
  const { cashFlowView, setCashFlowView, predictionsExplanation, setPredictionsExplanation } = useForecastContext();
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);

  return (
    <div className="flex flex-col w-full shrink-0">
      <ForecastDetailToolbar cashFlowView={cashFlowView} setCashFlowView={setCashFlowView} />
      
      {/* Page Header */}
      <div className="w-full bg-white dark:bg-[#111] px-6 py-4 flex items-center justify-between border-b border-[#e5e5e5] dark:border-white/10 shrink-0">
        <h1 className="text-xl font-semibold text-foreground truncate">{forecastName}</h1>
        <button 
          onClick={() => setIsChecklistOpen(true)}
          className="text-sm font-medium text-foreground underline decoration-foreground/30 hover:decoration-foreground transition-all"
        >
          Checklist
        </button>
      </div>

      <ForecastChecklistModal
        open={isChecklistOpen}
        onOpenChange={setIsChecklistOpen}
        userName={userName}
        forecastId={forecastId}
        checklistState={checklistState}
        manualOverrides={manualOverrides}
      />

      <ForecastSubNav 
        forecastId={forecastId} 
        predictionsExplanation={predictionsExplanation} 
        setPredictionsExplanation={setPredictionsExplanation} 
      />
    </div>
  );
}
