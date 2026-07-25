"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  healthScore: number;
  incomeItems: Array<{ code: string; label: string; amount: number; pct: string; category: string }>;
  expenseCategories: Array<{ id: string; label: string; amount: number; pct: number; dept: string; chartLabel: string; color: string; desc: string }>;
}

interface FinancialContextType {
  metrics: FinancialMetrics;
  isSyncing: boolean;
  orgName: string | null;
  lastSynced: string | null;
  handleXeroSync: () => Promise<FinancialMetrics | null>;
}

const defaultMetrics: FinancialMetrics = {
  totalRevenue: 45231.89,
  totalExpenses: 23194.00,
  netProfit: 22037.89,
  healthScore: 92,
  incomeItems: [
    { code: "REV-1", label: "General Sales", category: "Operating Revenue", amount: 45231.89, pct: "100%" }
  ],
  expenseCategories: [
    { id: "exp-1", label: "General Expenses", chartLabel: "General", dept: "Operations", amount: 23194.00, color: "#10b981", pct: 100, desc: "General operations" }
  ]
};

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const [metrics, setMetrics] = useState<FinancialMetrics>(defaultMetrics);
  const [isSyncing, setIsSyncing] = useState(false);
  const [orgName, setOrgName] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  const handleXeroSync = useCallback(async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/xero/sync', { method: 'POST' });
      const data = await response.json();
      if (response.ok && data.metrics) {
        setMetrics(data.metrics);
        if (data.message?.includes("org:")) {
          setOrgName(data.message.split("org: ")[1]);
        }
        return data.metrics;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
      setLastSynced(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
    return null;
  }, []);



  return (
    <FinancialContext.Provider
      value={{
        metrics,
        isSyncing,
        orgName,
        lastSynced,
        handleXeroSync,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
}

export function useFinancial() {
  const context = useContext(FinancialContext);
  if (context === undefined) {
    throw new Error("useFinancial must be used within a FinancialProvider");
  }
  return context;
}
