"use client";

import { useRef, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, TrendingUp, Info } from "lucide-react";
import clsx from "clsx";
import { useForecastContext } from "@/app/(workspace)/forecasting/[id]/ForecastContext";
import { CollapsibleAccountRow, AccountGroupData } from "./CollapsibleAccountRow";

interface ForecastMonthTableProps {
  title: string;
  months: string[];
  cashPosition: number[];
  summary: number[];
  groups: AccountGroupData[];
  onDaysToPayChange?: (childId: string, val: number) => void;
}

export function ForecastMonthTable({ title, months, cashPosition, summary, groups, onDaysToPayChange }: ForecastMonthTableProps) {
  const { cashFlowView, predictionsExplanation } = useForecastContext();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1); // -1 for rounding errors
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const amount = 300; // scroll by roughly 2 columns
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth"
      });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col min-h-0 bg-white dark:bg-[#111]">
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Sticky Column */}
        <div className="w-[350px] shrink-0 border-r border-[#e5e5e5] dark:border-white/10 flex flex-col bg-white dark:bg-[#111] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_5px_-2px_rgba(255,255,255,0.02)]">
          {/* Header */}
          <div className="h-12 border-b border-[#e5e5e5] dark:border-white/10 flex items-center px-6">
            <span className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">Account</span>
          </div>

          {/* Cash Position Row (Always visible) */}
          <div className={clsx(
            "flex flex-col border-b border-[#e5e5e5] dark:border-white/10 transition-colors",
            cashFlowView ? "bg-emerald-500/5" : ""
          )}>
            <div className="h-16 flex items-center px-6">
              <span className="text-sm font-semibold text-foreground">ALL BANK ACCOUNTS — Cash position</span>
            </div>
            {/* Sparkline placeholder space in left column */}
            <div className="h-8 w-full px-6 flex items-end pb-2">
              <TrendingUp className={clsx("w-4 h-4", cashFlowView ? "text-emerald-500" : "text-foreground/20")} />
            </div>
          </div>

          {/* Section Summary Row */}
          <div className="h-14 border-b border-[#e5e5e5] dark:border-white/10 flex items-center px-6 bg-foreground/[0.02]">
            <span className="text-sm font-bold text-foreground">{title}</span>
          </div>

          {/* Sub-header / Accounts Area Header */}
          <div className="h-10 border-b border-[#e5e5e5] dark:border-white/10 flex items-center justify-between px-6 bg-foreground/[0.01]">
            <span className="text-xs font-medium text-foreground/50 uppercase">Collapse Accounts</span>
            <span className="text-xs font-medium text-foreground/50 uppercase">Days To Pay</span>
          </div>

          {/* Empty Space for Part B2 */}
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-foreground/40 border-b border-[#e5e5e5] dark:border-white/10">
            <span className="text-sm">Account lines will populate here</span>
            {predictionsExplanation && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
                <Info className="w-3 h-3" /> Predictions explanation ON
              </div>
            )}
          </div>
        </div>

        {/* Horizontally Scrollable Months Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden">
          
          {/* Scroll Controls Overlay (Left) */}
          {canScrollLeft && (
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-[#111] dark:via-[#111]/80 z-20 pointer-events-none flex items-start pt-2">
              <button 
                onClick={() => scroll("left")}
                className="pointer-events-auto w-8 h-8 rounded-full bg-white dark:bg-[#222] shadow-md border border-[#e5e5e5] dark:border-white/10 flex items-center justify-center -ml-4 hover:bg-foreground/5 transition-colors absolute left-4"
              >
                <ChevronLeft className="w-4 h-4 text-foreground/70" />
              </button>
            </div>
          )}

          {/* Scroll Controls Overlay (Right) */}
          {canScrollRight && (
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-[#111] dark:via-[#111]/80 z-20 pointer-events-none flex items-start pt-2 justify-end">
              <button 
                onClick={() => scroll("right")}
                className="pointer-events-auto w-8 h-8 rounded-full bg-white dark:bg-[#222] shadow-md border border-[#e5e5e5] dark:border-white/10 flex items-center justify-center -mr-4 hover:bg-foreground/5 transition-colors absolute right-4"
              >
                <ChevronRight className="w-4 h-4 text-foreground/70" />
              </button>
            </div>
          )}

          <div 
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex-1 overflow-x-auto overflow-y-hidden flex flex-col custom-scrollbar no-scrollbar-arrows"
          >
            {/* Header Row */}
            <div className="flex border-b border-[#e5e5e5] dark:border-white/10 h-12 shrink-0">
              {months.map((month, idx) => (
                <div key={idx} className="w-[150px] shrink-0 flex items-center justify-end px-6 border-r border-[#e5e5e5] dark:border-white/10">
                  <span className="text-xs font-semibold text-foreground/50 uppercase">{month}</span>
                </div>
              ))}
            </div>

            {/* Cash Position Row */}
            <div className={clsx(
              "flex flex-col border-b border-[#e5e5e5] dark:border-white/10 shrink-0 transition-colors relative",
              cashFlowView ? "bg-emerald-500/5" : ""
            )}>
              <div className="flex h-16 relative z-10">
                {cashPosition.map((val, idx) => (
                  <div key={idx} className="w-[150px] shrink-0 flex items-center justify-end px-6 border-r border-[#e5e5e5] dark:border-white/10">
                    <span className="text-sm font-semibold text-foreground">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)}
                    </span>
                  </div>
                ))}
              </div>
              {/* Sparkline Visual */}
              <div className="flex h-8 w-full border-r border-[#e5e5e5] dark:border-white/10 relative overflow-hidden">
                {/* Mock SVG Area Chart (could dynamically map cashPosition, but keeping mock curve for now as requested) */}
                <svg className="absolute bottom-0 w-full h-full preserve-3d" preserveAspectRatio="none" viewBox="0 0 1000 40">
                  <path d="M0,40 L0,20 Q50,25 100,15 T200,10 T300,20 T400,5 T500,15 T600,10 T700,25 T800,15 T900,5 T1000,10 L1000,40 Z" fill={cashFlowView ? "rgba(16, 185, 129, 0.1)" : "rgba(128,128,128,0.05)"} />
                  <path d="M0,20 Q50,25 100,15 T200,10 T300,20 T400,5 T500,15 T600,10 T700,25 T800,15 T900,5 T1000,10" fill="none" stroke={cashFlowView ? "#10B981" : "rgba(128,128,128,0.3)"} strokeWidth="2" />
                </svg>
                {months.map((_, idx) => (
                  <div key={idx} className="w-[150px] shrink-0 border-r border-[#e5e5e5] dark:border-white/10" />
                ))}
              </div>
            </div>

            {/* Section Summary Row */}
            <div className="flex h-14 border-b border-[#e5e5e5] dark:border-white/10 shrink-0 bg-foreground/[0.02]">
              {summary.map((val, idx) => (
                <div key={idx} className="w-[150px] shrink-0 flex items-center justify-end px-6 border-r border-[#e5e5e5] dark:border-white/10">
                  <span className="text-sm font-bold text-foreground">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)}
                  </span>
                </div>
              ))}
            </div>

            {/* Sub-header / Accounts Area Header */}
            <div className="flex h-10 border-b border-[#e5e5e5] dark:border-white/10 shrink-0 bg-foreground/[0.01]">
              {months.map((_, idx) => (
                <div key={idx} className="w-[150px] shrink-0 border-r border-[#e5e5e5] dark:border-white/10" />
              ))}
            </div>

            {/* Actual Group Rows */}
            <div className="flex flex-col flex-1 min-h-[200px] border-b border-[#e5e5e5] dark:border-white/10">
              {groups.map(group => (
                <CollapsibleAccountRow key={group.id} group={group} onDaysToPayChange={onDaysToPayChange} />
              ))}
              {/* Filler empty rows for table structure styling */}
              <div className="flex flex-1">
                {months.map((_, idx) => (
                  <div key={idx} className="w-[150px] shrink-0 border-r border-[#e5e5e5] dark:border-white/10" />
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
