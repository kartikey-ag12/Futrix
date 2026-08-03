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
  highlight?: boolean;
}

export interface AccountGroupData {
  id: string;
  name: string;
  months: number[];
  children: AccountChild[];
}

interface CollapsibleAccountRowProps {
  group: AccountGroupData;
  onDaysToPayChange?: (childId: string, val: number) => void;
}

export function CollapsibleAccountRow({ group, onDaysToPayChange }: CollapsibleAccountRowProps) {
  const [expanded, setExpanded] = useState(false);

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className="flex flex-col border-b border-[#e5e5e5] dark:border-white/10 shrink-0">
      
      {/* Parent Row */}
      <div className="flex h-12 bg-white dark:bg-[#111] hover:bg-foreground/[0.02] transition-colors group cursor-pointer" onClick={() => setExpanded(!expanded)}>
        {/* Sticky Label */}
        <div className="w-[350px] shrink-0 border-r border-[#e5e5e5] dark:border-white/10 flex items-center px-6 sticky left-0 z-10 bg-inherit shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_5px_-2px_rgba(255,255,255,0.02)]">
          {group.children.length > 0 ? (
            expanded ? (
              <ChevronDown className="w-4 h-4 mr-2 text-foreground/50 group-hover:text-foreground/80 transition-colors" />
            ) : (
              <ChevronRight className="w-4 h-4 mr-2 text-foreground/50 group-hover:text-foreground/80 transition-colors" />
            )
          ) : (
            <div className="w-6" /> // spacer
          )}
          <span className="text-sm font-semibold text-foreground truncate">{group.name}</span>
        </div>

        {/* Month Values */}
        <div className="flex flex-1">
          {group.months.map((val, idx) => (
            <div key={idx} className="w-[150px] shrink-0 flex items-center justify-end px-6 border-r border-[#e5e5e5] dark:border-white/10">
              <span className="text-sm font-medium text-foreground/80">{formatCurrency(val)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Child Rows */}
      {expanded && group.children.length > 0 && (
        <div className="flex flex-col">
          {group.children.map(child => (
            <div 
              key={child.id} 
              className={clsx(
                "flex h-12 transition-colors",
                child.highlight ? "bg-rose-500/5 hover:bg-rose-500/10 dark:bg-rose-500/10 dark:hover:bg-rose-500/20" : "bg-foreground/[0.01] hover:bg-foreground/[0.03]"
              )}
            >
              {/* Sticky Child Label */}
              <div className="w-[350px] shrink-0 border-r border-[#e5e5e5] dark:border-white/10 flex items-center justify-between pl-12 pr-6 sticky left-0 z-10 bg-inherit shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] dark:shadow-[2px_0_5px_-2px_rgba(255,255,255,0.02)]">
                <span className="text-sm font-medium text-foreground/70 truncate flex-1 pr-4">{child.name}</span>
                
                {/* Days to Pay Input */}
                <div className="flex items-center">
                  <input 
                    type="number" 
                    className="w-12 h-7 text-xs font-medium text-center bg-white dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-white/10 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    defaultValue={child.daysToPay}
                    onBlur={(e) => onDaysToPayChange?.(child.id, parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              {/* Child Month Values */}
              <div className="flex flex-1">
                {child.months.map((val, idx) => (
                  <div key={idx} className="w-[150px] shrink-0 flex items-center justify-end px-6 border-r border-[#e5e5e5] dark:border-white/10">
                    <span className={clsx("text-sm", child.highlight ? "text-rose-600 dark:text-rose-400 font-medium" : "text-foreground/60")}>
                      {formatCurrency(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
