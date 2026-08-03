import { useState } from "react";

export type ReportStatus = "published" | "draft";
export type ReportType = "report" | "template";

export interface Report {
  id: string;
  name: string;
  status: ReportStatus;
  type: ReportType;
  pages: number;
  lastEdited: string;
}

export function useReports(initialData: Report[] = [
  { id: "r1", name: "Q1 Financial Summary", status: "published", type: "report", pages: 4, lastEdited: "2024-03-31" },
  { id: "r2", name: "Monthly Cash Flow", status: "published", type: "report", pages: 2, lastEdited: "2024-04-15" },
  { id: "r3", name: "Board Pack Template", status: "published", type: "template", pages: 10, lastEdited: "2024-01-10" },
  { id: "r4", name: "Draft P&L Analysis", status: "draft", type: "report", pages: 1, lastEdited: "2024-05-01" },
  { id: "r5", name: "New Pitch Deck", status: "draft", type: "report", pages: 5, lastEdited: "2024-05-05" },
  { id: "r6", name: "Custom KPI Dashboard", status: "published", type: "report", pages: 3, lastEdited: "2024-04-20" },
]) {
  // Hardcoded to mock data array for now
  const [reports] = useState<Report[]>(initialData);

  return { reports };
}
