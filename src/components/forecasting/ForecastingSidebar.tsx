"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FileBarChart } from "lucide-react";
import clsx from "clsx";
import { useForecasts } from "@/hooks/useForecasts";
import Link from "next/link";

interface CollapsibleSectionProps {
  title: string;
  count: number;
  items: Array<{ id: string; name: string; href: string }>;
  defaultExpanded?: boolean;
}

function CollapsibleSection({ title, count, items, defaultExpanded = true }: CollapsibleSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/5 transition-colors rounded-lg group"
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-white/50 group-hover:text-white/80" />
          ) : (
            <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white/80" />
          )}
          <span className="text-sm font-medium text-white/90">{title}</span>
        </div>
        <span className="text-xs font-semibold bg-white/10 text-white/70 px-2 py-0.5 rounded-full">
          {count}
        </span>
      </button>

      {expanded && (
        <div className="mt-1 flex flex-col gap-1 pl-10 pr-4">
          {items.length > 0 ? (
            items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-2 py-1.5 text-sm text-white/60 hover:text-white transition-colors"
              >
                <FileBarChart className="w-3.5 h-3.5" />
                <span className="truncate">{item.name}</span>
              </Link>
            ))
          ) : (
            <div className="py-2 text-sm text-white/30 italic">No forecasts yet</div>
          )}
        </div>
      )}
    </div>
  );
}

export function ForecastingSidebar() {
  const { forecasts } = useForecasts();

  const oneYearPL = forecasts.filter((f) => f.type === "1yr-pl");
  const threeYearCF = forecasts.filter((f) => f.type === "3yr-cf");
  const threeYearCFInv = forecasts.filter((f) => f.type === "3yr-cf-inv");

  return (
    <div className="w-full py-6 flex flex-col">
      <div className="px-6 mb-6">
        <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Saved Forecasts</h2>
      </div>

      <div className="px-2">
        <CollapsibleSection
          title="1 year P&L only"
          count={oneYearPL.length}
          items={oneYearPL.map(f => ({ id: f.id, name: f.name, href: `/forecasting/${f.id}` }))}
        />
        <CollapsibleSection
          title="3 year cash flow"
          count={threeYearCF.length}
          items={threeYearCF.map(f => ({ id: f.id, name: f.name, href: `/forecasting/${f.id}` }))}
        />
        <CollapsibleSection
          title="3 year cash flow with due invoices"
          count={threeYearCFInv.length}
          items={threeYearCFInv.map(f => ({ id: f.id, name: f.name, href: `/forecasting/${f.id}` }))}
        />
      </div>
    </div>
  );
}
