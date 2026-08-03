"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

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

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: "1",  date: "2024-07-20", description: "Software Subscription",         account: "Operating Expenses", amount: -150.00,   type: "expense", status: "cleared"  },
  { id: "2",  date: "2024-07-19", description: "Client Retainer — Acme Corp",   account: "Sales Revenue",      amount:  5000.00,  type: "revenue", status: "cleared"  },
  { id: "3",  date: "2024-07-18", description: "Office Supplies",               account: "Operating Expenses", amount: -45.20,    type: "expense", status: "cleared"  },
  { id: "4",  date: "2024-07-15", description: "Consulting Fee",                account: "Services Revenue",   amount:  2500.00,  type: "revenue", status: "cleared"  },
  { id: "5",  date: "2024-07-12", description: "Cloud Hosting — AWS",           account: "IT Expenses",        amount: -850.00,   type: "expense", status: "cleared"  },
  { id: "6",  date: "2024-07-10", description: "Invoice #INV-0042 — Delta Ltd", account: "Sales Revenue",      amount:  8200.00,  type: "revenue", status: "pending"  },
  { id: "7",  date: "2024-07-08", description: "Contractor Payment — Design",   account: "Freelance Costs",    amount: -1200.00,  type: "expense", status: "cleared"  },
  { id: "8",  date: "2024-07-05", description: "Ad Spend — Google",             account: "Marketing",          amount: -640.00,   type: "expense", status: "cleared"  },
  { id: "9",  date: "2024-07-03", description: "Monthly Retainer — Beta Inc",   account: "Sales Revenue",      amount:  3750.00,  type: "revenue", status: "cleared"  },
  { id: "10", date: "2024-07-01", description: "Payroll — July",                account: "Salaries",           amount: -12500.00, type: "expense", status: "cleared"  },
  { id: "11", date: "2024-07-01", description: "Enterprise License — Globex",   account: "Enterprise Sales",   amount:  25781.89, type: "revenue", status: "cleared"  },
  { id: "12", date: "2024-07-01", description: "Office Lease — Q3",             account: "Office Rent",        amount: -7808.80,  type: "expense", status: "cleared"  },
];

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
