import { useState, useEffect } from "react";

export interface ReportItem {
  id: string;
  name: string;
  type: string;
  status: string;
  pageCount: number;
  createdAt: string;
}

export function useReports() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/reports");
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const createReport = async (payload: Partial<ReportItem>) => {
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      await fetchReports();
      return true;
    }
    return false;
  };

  const published = reports.filter(r => r.status === "published");
  const drafts = reports.filter(r => r.status === "draft");

  return { reports, published, drafts, isLoading, fetchReports, createReport };
}
