"use client";

import { useState, useEffect } from "react";
import { PlayCircle, Download } from "lucide-react";

export interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
  class: string;
  status: string;
  balance: number;
}

export default function ChartOfAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch("/api/xero/chart-of-accounts");
        if (res.ok) {
          const data = await res.json();
          setAccounts(data.accounts || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  return (
    <div className="flex-1 flex flex-col p-8 lg:p-12 overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 max-w-6xl mx-auto w-full">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-semibold text-foreground">Chart of Accounts</h1>
            <button className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-medium hover:bg-emerald-500/20 transition-colors">
              <PlayCircle className="w-4 h-4" />
              Virtual demo
            </button>
          </div>
          <p className="text-foreground/60 text-lg">View and map your synced chart of accounts.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium border border-foreground/10 hover:border-foreground/20 hover:bg-foreground/5 transition-all text-foreground">
            <Download className="w-5 h-5 text-emerald-600" />
            Export
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : accounts.length > 0 ? (
          <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-[#fcfcfc] dark:bg-[#1a1a1a] border-b border-[#e5e5e5] dark:border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium text-foreground/60">Code</th>
                  <th className="px-6 py-4 font-medium text-foreground/60">Name</th>
                  <th className="px-6 py-4 font-medium text-foreground/60">Type</th>
                  <th className="px-6 py-4 font-medium text-foreground/60">Class</th>
                  <th className="px-6 py-4 font-medium text-foreground/60 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e5] dark:divide-white/10">
                {accounts.map(acc => (
                  <tr key={acc.id} className="hover:bg-foreground/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{acc.code || "—"}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{acc.name}</td>
                    <td className="px-6 py-4 text-foreground/70">{acc.type}</td>
                    <td className="px-6 py-4 text-foreground/70">{acc.class}</td>
                    <td className="px-6 py-4 text-foreground/70 text-right font-medium">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(acc.balance || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/10 rounded-xl p-12 text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-3">No accounts synced</h2>
            <p className="text-foreground/60 max-w-md">Connect to Xero to sync your chart of accounts.</p>
          </div>
        )}
      </div>

    </div>
  );
}
