"use client";

import { useForecasts } from "@/hooks/useForecasts";
import { SidebarCollapsibleSection, SidebarCollapsibleGroup } from "@/components/shared/SidebarCollapsible";

export function ForecastingSidebar() {
  const { forecasts } = useForecasts();

  const renderTypeSection = (title: string, typeFilter: string) => {
    const typeForecasts = forecasts.filter((f) => f.type === typeFilter);
    if (typeForecasts.length === 0) return null;

    const drafts = typeForecasts.filter((f) => f.status !== "published");
    const published = typeForecasts.filter((f) => f.status === "published");

    return (
      <SidebarCollapsibleSection title={title} count={typeForecasts.length} defaultExpanded={true} key={typeFilter}>
        {drafts.length > 0 && (
          <SidebarCollapsibleGroup
            title="Draft"
            count={drafts.length}
            items={drafts.map(f => ({ id: f.id, name: f.name, href: `/forecasting/${f.id}`, status: f.status }))}
            defaultExpanded={true}
          />
        )}
        {published.length > 0 && (
          <SidebarCollapsibleGroup
            title="Published"
            count={published.length}
            items={published.map(f => ({ id: f.id, name: f.name, href: `/forecasting/${f.id}`, status: f.status }))}
            defaultExpanded={true}
          />
        )}
      </SidebarCollapsibleSection>
    );
  };

  return (
    <div className="w-full py-6 flex flex-col">
      <div className="px-6 mb-6">
        <h2 className="text-xs font-semibold text-white/50 uppercase tracking-wider">Saved Forecasts</h2>
      </div>

      <div className="px-2">
        {renderTypeSection("1 year P&L only", "1yr-pl")}
        {renderTypeSection("3 year cash flow", "3yr-cf")}
        {renderTypeSection("3 year cash flow with due invoices", "3yr-cf-inv")}
      </div>
    </div>
  );
}
