"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import clsx from "clsx";

export interface AccountChild {
  id: string;
  code: string;
  name: string;
  daysToPay: number;
  months: number[];
  highlightType?: 'invoice' | 'bill';
}

export interface AccountGroupData {
  id: string;
  name: string;
  months: number[];
  children: AccountChild[];
  isSummary?: boolean;
  summarySubLabel?: string;
}

interface CollapsibleAccountRowProps {
  group: AccountGroupData;
  hideDaysToPay?: boolean;
  hideCollapseAccounts?: boolean;
  onDaysToPayChange?: (childId: string, val: number) => void;
  isLabelPane?: boolean;
}

export function CollapsibleAccountRow({ group, hideDaysToPay, hideCollapseAccounts, onDaysToPayChange, isLabelPane }: CollapsibleAccountRowProps) {
  const [expanded, setExpanded] = useState(false);

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="flex flex-col border-b border-[#e5e5e5] dark:border-white/10 shrink-0">
      
      {/* Parent Row */}
      <div className={clsx("flex h-12 transition-colors group cursor-pointer", group.isSummary ? "bg-[#f4f4f5] dark:bg-[#27272a]" : "bg-white dark:bg-[#111] hover:bg-[#f4f4f5] dark:hover:bg-[#27272a]")} onClick={() => !group.isSummary && setExpanded(!expanded)}>
        {/* Sticky Label */}
        <div className="w-[350px] shrink-0 border-r border-[#e5e5e5] dark:border-white/10 flex items-center px-6 sticky left-0 z-10 bg-inherit shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_5px_-2px_rgba(255,255,255,0.02)]">
          {group.isSummary ? (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground truncate">{group.name}</span>
              {group.summarySubLabel && <span className="text-xs text-foreground/50">{group.summarySubLabel}</span>}
            </div>
          ) : (
            <>
              {!hideCollapseAccounts && group.children.length > 0 ? (
                expanded ? (
                  <ChevronDown className="w-4 h-4 mr-2 text-foreground/50 group-hover:text-foreground/80 transition-colors" />
                ) : (
                  <ChevronRight className="w-4 h-4 mr-2 text-foreground/50 group-hover:text-foreground/80 transition-colors" />
                )
              ) : (
                <div className="w-6" /> // spacer
              )}
              <span className="text-sm font-semibold text-foreground truncate">{group.name}</span>
            </>
          )}
        </div>

        {/* Month Values */}
        <div className="flex flex-1">
          {group.months.map((val, idx, arr) => (
            <div key={idx} className={clsx("w-[150px] shrink-0 flex items-center justify-end px-6 border-r border-[#e5e5e5] dark:border-white/10", (group.isSummary || false) && "bg-foreground/[0.02]")}>
              <span className={clsx("text-sm", group.isSummary ? "font-bold text-foreground" : "font-medium text-foreground/80")}>{formatCurrency(val)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Child Rows */}
      {expanded && group.children.length > 0 && !group.isSummary && (
        <div className="flex flex-col">
          {group.children.map(child => {
            const isInvoice = child.highlightType === 'invoice';
            const isBill = child.highlightType === 'bill';
            return (
            <div 
              key={child.id} 
              className={clsx(
                "flex h-12 transition-colors",
                isInvoice ? "bg-[#eef2ff] hover:bg-[#e0e7ff] dark:bg-[#312e81] dark:hover:bg-[#3730a3]" : 
                isBill ? "bg-[#fff1f2] hover:bg-[#ffe4e6] dark:bg-[#881337] dark:hover:bg-[#9f1239]" : 
                "bg-[#fafafa] hover:bg-[#f4f4f5] dark:bg-[#18181b] dark:hover:bg-[#27272a]"
              )}
            >
              {/* Sticky Child Label */}
              <div className="w-[350px] shrink-0 border-r border-[#e5e5e5] dark:border-white/10 flex items-center justify-between pl-12 pr-6 sticky left-0 z-10 bg-inherit shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_5px_-2px_rgba(255,255,255,0.02)]">
                <span className="text-sm font-medium text-foreground/70 truncate flex-1 pr-4">{child.name}</span>
                
                {/* Days to Pay Input */}
                {!hideDaysToPay && (
                  <div className="flex items-center">
                    <input 
                      type="number" 
                      className="w-12 h-7 text-xs font-medium text-center bg-white dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-white/10 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      defaultValue={child.daysToPay}
                      onBlur={(e) => onDaysToPayChange?.(child.id, parseInt(e.target.value) || 0)}
                    />
                  </div>
                )}
              </div>

              {/* Child Month Values */}
              <div className="flex flex-1">
                {child.months.map((val, idx) => (
                  <div key={idx} className="w-[150px] shrink-0 flex items-center justify-end px-6 border-r border-[#e5e5e5] dark:border-white/10">
                    <span className={clsx("text-sm", 
                      isInvoice ? "text-indigo-600 dark:text-indigo-400 font-medium" : 
                      isBill ? "text-rose-600 dark:text-rose-400 font-medium" : 
                      "text-foreground/60"
                    )}>
                      {formatCurrency(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
