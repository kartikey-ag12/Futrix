"use client";

import { useForecasts } from "@/hooks/useForecasts";
import { SidebarCollapsibleSection, SidebarCollapsibleGroup } from "@/components/shared/SidebarCollapsible";

export function ForecastingSidebar() {
  const { forecasts } = useForecasts();

  const oneYearPL = forecasts.filter((f) => f.type === "1yr-pl");
  const threeYearCF = forecasts.filter((f) => f.type === "3yr-cf");
  const threeYearCFInv = forecasts.filter((f) => f.type === "3yr-cf-inv");

  return (
    <div className="w-full py-4 flex flex-col gap-1 px-2">
      <SidebarCollapsibleGroup
        title="1 year P&L only"
        count={oneYearPL.length}
        items={oneYearPL.map(f => ({ id: f.id, name: f.name, href: `/forecasting/${f.id}`, status: f.status }))}
        defaultExpanded={true}
      />
      <div className="h-px bg-white/10 mx-2 my-1" />
      <SidebarCollapsibleGroup
        title="3 year cash flow"
        count={threeYearCF.length}
        items={threeYearCF.map(f => ({ id: f.id, name: f.name, href: `/forecasting/${f.id}`, status: f.status }))}
        defaultExpanded={true}
      />
      <div className="h-px bg-white/10 mx-2 my-1" />
      <SidebarCollapsibleGroup
        title="3 year cash flow with due invoices"
        count={threeYearCFInv.length}
        items={threeYearCFInv.map(f => ({ id: f.id, name: f.name, href: `/forecasting/${f.id}`, status: f.status }))}
        defaultExpanded={true}
      />
    </div>
  );
}
