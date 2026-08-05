import { useState } from "react";

export type TemplateOrientation = "portrait" | "landscape";

export interface BuilderTemplate {
  id: string;
  name: string;
  category: string;
  orientation: TemplateOrientation;
  pages: number;
  componentType?: string;
  elements?: any[];
}

const SEED_TEMPLATES: BuilderTemplate[] = [
  { id: "futrix-pl-dash", name: "Profit & Loss Dashboard", category: "Performance", orientation: "landscape", pages: 1, componentType: "ProfitLossDashboard" },
  { id: "futrix-bs-dash", name: "Balance Sheet Dashboard", category: "Performance", orientation: "landscape", pages: 1, componentType: "BalanceSheetDashboard" },
  { id: "futrix-cf-dash", name: "Cash Flow Dashboard", category: "Performance", orientation: "landscape", pages: 1, componentType: "CashFlowDashboard" },
  { id: "futrix-exec-1", name: "Annual Health Check Template - Cloud Clients", category: "Executive summaries", orientation: "portrait", pages: 3 },
  { id: "futrix-bs-1", name: "Balance Sheet - Actual vs Forecast", category: "Balance Sheet", orientation: "landscape", pages: 1 },
  { id: "futrix-bs-2", name: "Balance Sheet Ratios - Historical - Monthly", category: "Balance Sheet", orientation: "landscape", pages: 1 },
  { id: "futrix-bs-3", name: "Balance Sheet Report", category: "Balance Sheet", orientation: "portrait", pages: 2 },
  { id: "futrix-bs-4", name: "Balance Sheet Summary", category: "Balance Sheet", orientation: "landscape", pages: 1 },
  { id: "futrix-pl-1", name: "Profit & Loss - Last 12 Months", category: "Profit & Loss", orientation: "portrait", pages: 1 },
  { id: "futrix-pl-2", name: "Profit & Loss - Quarterly Trend", category: "Profit & Loss", orientation: "landscape", pages: 2 },
  { id: "futrix-cf-1", name: "Cash Flow Statement", category: "Cash Flow", orientation: "portrait", pages: 1 },
  { id: "futrix-cf-2", name: "Cash Flow Forecast (3 Year)", category: "Cash Flow", orientation: "landscape", pages: 4 },
  { id: "futrix-1p-1", name: "One Page Summary - Board Pack", category: "1-page templates", orientation: "portrait", pages: 1 },
  { id: "futrix-scen-1", name: "Scenario Analysis - Best/Worst Case", category: "Scenario based", orientation: "landscape", pages: 3 },
  { id: "futrix-budg-1", name: "Budget vs Actuals - Departmental", category: "Budget based", orientation: "landscape", pages: 2 },
  { id: "futrix-perf-1", name: "Performance Dashboard - KPIs", category: "Performance", orientation: "landscape", pages: 1 },
  { id: "futrix-hist-1", name: "Historical Revenue Analysis", category: "Historical", orientation: "portrait", pages: 5 },
  { id: "futrix-daily-1", name: "Daily Cash Tracker", category: "Daily Tracker based", orientation: "landscape", pages: 1 },
];

export function useTemplates(initialData: BuilderTemplate[] = SEED_TEMPLATES) {
  const [templates] = useState<BuilderTemplate[]>(initialData);

  return { templates };
}
