"use client";

import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  account: string;
  amount: number;
  type: "revenue" | "expense";
  status: "cleared" | "pending";
}

export interface FinancialMetrics {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  healthScore: number;
  incomeItems: Array<{ code: string; label: string; amount: number; pct: string; category: string }>;
  expenseCategories: Array<{ id: string; label: string; amount: number; pct: number; dept: string; chartLabel: string; color: string; desc: string }>;
  historicalPnL?: Array<{ month: string; revenue: number; expenses: number; netProfit: number }>;
}

interface FinancialContextType {
  metrics: FinancialMetrics;
  transactions: Transaction[];
  isSyncing: boolean;
  orgName: string | null;
  lastSynced: string | null;
  syncError: string | null;
  handleXeroSync: () => Promise<FinancialMetrics | null>;
}

export const INITIAL_TRANSACTIONS: Transaction[] = [];

const defaultMetrics: FinancialMetrics = {
  totalRevenue: 0,
  totalExpenses: 0,
  netProfit: 0,
  healthScore: 0,
  incomeItems: [],
  expenseCategories: []
};

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const [metrics, setMetrics] = useState<FinancialMetrics>(defaultMetrics);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isSyncing, setIsSyncing] = useState(false);
  const [orgName, setOrgName] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const handleXeroSync = useCallback(async () => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const response = await fetch('/api/xero/sync', { method: 'POST' });
      const data = await response.json();
      if (response.ok && data.metrics) {
        setMetrics(data.metrics);
        if (data.transactions) {
          setTransactions(data.transactions);
        }
        if (data.message?.includes("org:")) {
          setOrgName(data.message.split("org: ")[1]);
        }
        return data.metrics;
      } else {
        setSyncError(data.error || "Failed to sync with Xero");
      }
    } catch (e: any) {
      console.error(e);
      setSyncError(e.message || "An error occurred during sync");
    } finally {
      setIsSyncing(false);
      setLastSynced(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
    return null;
  }, []);

  useEffect(() => {
    // Attempt auto-sync once on mount asynchronously to avoid cascading renders
    const timer = setTimeout(() => {
      handleXeroSync();
    }, 0);
    return () => clearTimeout(timer);
  }, [handleXeroSync]);



  const contextValue = useMemo(() => ({
    metrics,
    transactions,
    isSyncing,
    orgName,
    lastSynced,
    syncError,
    handleXeroSync,
  }), [metrics, transactions, isSyncing, orgName, lastSynced, syncError, handleXeroSync]);

  return (
    <FinancialContext.Provider value={contextValue}>
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
