"use client";

import { useForecasts } from "@/hooks/useForecasts";
import { SidebarCollapsibleSection, SidebarCollapsibleGroup } from "@/components/shared/SidebarCollapsible";

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
        <SidebarCollapsibleSection title="Forecasts" count={forecasts.length} defaultExpanded={true}>
          <SidebarCollapsibleGroup
            title="1 year P&L only"
            count={oneYearPL.length}
            items={oneYearPL.map(f => ({ id: f.id, name: f.name, href: `/forecasting/${f.id}` }))}
            defaultExpanded={true}
          />
          <SidebarCollapsibleGroup
            title="3 year cash flow"
            count={threeYearCF.length}
            items={threeYearCF.map(f => ({ id: f.id, name: f.name, href: `/forecasting/${f.id}` }))}
            defaultExpanded={true}
          />
          <SidebarCollapsibleGroup
            title="3 year cash flow with due invoices"
            count={threeYearCFInv.length}
            items={threeYearCFInv.map(f => ({ id: f.id, name: f.name, href: `/forecasting/${f.id}` }))}
            defaultExpanded={true}
          />
        </SidebarCollapsibleSection>
      </div>
    </div>
  );
}
