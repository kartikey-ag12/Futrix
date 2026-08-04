"use client";

import { useState, useEffect, useMemo } from "react";
import { PlayCircle, Download, Search, Info, ChevronDown, ChevronRight, RefreshCw, Plus, ArrowUpDown } from "lucide-react";
import clsx from "clsx";
import { ReclassifyPanel } from "@/components/chart-of-accounts/ReclassifyPanel";

export interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
  class: string;
  status: string;
  balance: number;
  daysToPay: number | null;
}

export interface AccountGroup {
  id: string;
  name: string;
  accountIds: string[];
}

export default function ChartOfAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountGroups, setAccountGroups] = useState<AccountGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"pnl" | "bs">("pnl");
  const [search, setSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    "Income": true,
    "Cost of Sales": true,
    "Expenses": true,
    "Assets": true,
    "Liabilities": true,
    "Equity": true,
  });

  // Modal states
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isReclassifyModalOpen, setIsReclassifyModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedAccountIds, setSelectedAccountIds] = useState<Set<string>>(new Set());

  const fetchAccounts = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch("/api/xero/chart-of-accounts");
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts || []);
        setAccountGroups(data.accountGroups || []);
        if (data.lastSync) setLastSync(data.lastSync);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    try {
      const res = await fetch("/api/xero/account-groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newGroupName, accountIds: Array.from(selectedAccountIds) })
      });
      if (res.ok) {
        const data = await res.json();
        setAccountGroups([...accountGroups, data.group]);
        setIsCreateGroupModalOpen(false);
        setNewGroupName("");
        setSelectedAccountIds(new Set());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleGroup = (groupLabel: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupLabel]: !prev[groupLabel] }));
  };

  // Filter accounts based on search
  const filteredAccounts = useMemo(() => {
    const term = search.toLowerCase();
    return accounts.filter(a => a.name.toLowerCase().includes(term) || (a.code && a.code.toLowerCase().includes(term)));
  }, [accounts, search]);

  // Build groups
  const groupedData = useMemo(() => {
    const groupsDef = activeTab === "pnl" 
      ? [
          { label: "Income", classes: ["REVENUE", "SALES"] },
          { label: "Cost of Sales", classes: ["DIRECTCOSTS"] },
          { label: "Expenses", classes: ["EXPENSE"] }
        ]
      : [
          { label: "Assets", classes: ["ASSET"] },
          { label: "Liabilities", classes: ["LIABILITY"] },
          { label: "Equity", classes: ["EQUITY"] }
        ];

    // Map custom groups inside main categories if we want, or as their own.
    // Xero accounts belong to main classes. If they are in a custom group, we could group them under the custom group.
    // For simplicity, let's inject custom groups into the main list if their accounts match the active tab's classes.
    
    return groupsDef.map(g => {
      const groupAccounts = filteredAccounts.filter(a => g.classes.includes(a.class));
      return {
        label: g.label,
        accounts: groupAccounts,
        col2Label: "YTD"
      };
    });
  }, [filteredAccounts, activeTab]);

  const timeAgo = (dateStr: string) => {
    const mins = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="flex-1 flex flex-col p-8 lg:p-12 overflow-y-auto bg-[#fafafa] dark:bg-[#0a0a0a]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4 max-w-6xl mx-auto w-full">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Chart of accounts management</h1>
          <p className="text-foreground/60 text-lg max-w-2xl">
            Create account groups and sub-groups, reclassify accounts and map accounts to the Futrix template accounts for seamless template usage.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3 mt-1">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-medium hover:bg-emerald-500/20 transition-colors">
              <PlayCircle className="w-4 h-4" />
              Virtual demo
            </button>
            <button className="flex items-center gap-2 px-5 py-2 rounded-lg font-medium border border-foreground/10 hover:border-foreground/20 hover:bg-foreground/5 transition-all text-foreground bg-white dark:bg-[#111]">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          {lastSync && (
            <div className="flex items-center gap-2 text-sm text-foreground/50">
              Data synced {timeAgo(lastSync)}.
              <button onClick={fetchAccounts} disabled={isSyncing} className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 transition-colors">
                <RefreshCw className={clsx("w-3 h-3", isSyncing && "animate-spin")} />
                Sync now
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full flex flex-col gap-6">
        
        {/* Sub-tabs & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1 p-1 bg-foreground/5 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab("pnl")}
              className={clsx(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                activeTab === "pnl" ? "bg-white dark:bg-[#111] shadow-sm text-foreground" : "text-foreground/60 hover:text-foreground"
              )}
            >
              Profit & Loss
            </button>
            <button
              onClick={() => setActiveTab("bs")}
              className={clsx(
                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                activeTab === "bs" ? "bg-white dark:bg-[#111] shadow-sm text-foreground" : "text-foreground/60 hover:text-foreground"
              )}
            >
              Balance Sheet
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded-full border border-foreground/10 text-sm font-medium text-foreground hover:bg-foreground/5 transition-colors">
                Reorder
              </button>
              <button 
                onClick={() => setIsReclassifyModalOpen(true)}
                className="px-4 py-2 rounded-full border border-foreground/10 text-sm font-medium text-foreground hover:bg-foreground/5 transition-colors"
              >
                Reclassify
              </button>
              <button 
                onClick={() => setIsCreateGroupModalOpen(true)}
                className="px-4 py-2 rounded-full border border-emerald-500/30 text-emerald-600 text-sm font-medium hover:bg-emerald-500/10 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Create group
              </button>
            </div>
            
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input 
                type="text" 
                placeholder="Search accounts..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-full border border-foreground/10 bg-white dark:bg-[#111] text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-64 text-foreground placeholder:text-foreground/40 transition-shadow"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
          ) : accounts.length > 0 ? (
            <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/10 rounded-xl overflow-hidden shadow-sm flex flex-col">
              
              {/* Header row */}
              <div className="flex items-center px-6 py-3 bg-[#fcfcfc] dark:bg-[#1a1a1a] border-b border-[#e5e5e5] dark:border-white/10 text-xs font-semibold text-foreground/60 uppercase tracking-wider">
                <div className="flex-1">Account</div>
                <div className="w-32 text-right flex items-center justify-end gap-1">
                  Days to Pay
                  <div className="group relative cursor-help">
                    <Info className="w-3.5 h-3.5 text-foreground/40 hover:text-foreground/80 transition-colors" />
                    <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-black/90 dark:bg-white/90 text-white dark:text-black text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      Average days taken to pay invoices mapped to this account.
                    </div>
                  </div>
                </div>
                <div className="w-40 text-right flex items-center justify-end gap-1">
                  {groupedData[0]?.col2Label}
                  <div className="group relative cursor-help">
                    <Info className="w-3.5 h-3.5 text-foreground/40 hover:text-foreground/80 transition-colors" />
                    <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-black/90 dark:bg-white/90 text-white dark:text-black text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      Year to date net total from synced transactions.
                    </div>
                  </div>
                </div>
              </div>

              {/* Grouped Lists */}
              <div className="divide-y divide-[#e5e5e5] dark:divide-white/10 max-h-[600px] overflow-y-auto">
                {groupedData.map((group) => {
                  if (group.accounts.length === 0 && search) return null;
                  const isExpanded = expandedGroups[group.label];

                  return (
                    <div key={group.label} className="flex flex-col">
                      <button 
                        onClick={() => toggleGroup(group.label)}
                        className="flex items-center justify-between px-6 py-4 bg-foreground/[0.015] hover:bg-foreground/[0.03] transition-colors w-full text-left"
                      >
                        <div className="flex items-center gap-2">
                          {isExpanded ? <ChevronDown className="w-4 h-4 text-foreground/50" /> : <ChevronRight className="w-4 h-4 text-foreground/50" />}
                          <span className="font-semibold text-foreground">{group.label}</span>
                          <span className="text-xs text-foreground/40 bg-foreground/5 px-2 py-0.5 rounded-full">{group.accounts.length}</span>
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="flex flex-col">
                          {group.accounts.length > 0 ? (
                            group.accounts.map(acc => (
                              <div key={acc.id} className="flex items-center px-6 py-3 hover:bg-foreground/[0.01] transition-colors group/row border-b border-[#e5e5e5]/50 dark:border-white/5 last:border-0 ml-4">
                                <div className="flex-1 flex items-center gap-3">
                                  <span className="text-sm font-medium text-foreground/50 w-16 tabular-nums">{acc.code || "—"}</span>
                                  <span className="text-sm text-foreground">{acc.name}</span>
                                </div>
                                <div className="w-32 text-right text-sm tabular-nums text-foreground/70">
                                  {acc.daysToPay !== null ? acc.daysToPay : "—"}
                                </div>
                                <div className="w-40 text-right text-sm tabular-nums font-medium text-foreground">
                                  {acc.balance ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.abs(acc.balance)) : "—"}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-6 py-4 pl-10 text-sm text-foreground/40 italic">
                              No accounts in this category.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/10 rounded-xl p-12 text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-3">No accounts synced</h2>
              <p className="text-foreground/60 max-w-md">Connect to Xero to sync your chart of accounts.</p>
            </div>
          )}
        </div>

      </div>

      {/* Reclassify Modal */}
      <ReclassifyPanel 
        isOpen={isReclassifyModalOpen} 
        onClose={() => setIsReclassifyModalOpen(false)} 
        accounts={accounts} 
      />

      {/* Create Group Modal */}
      {isCreateGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#111] rounded-2xl shadow-xl w-full max-w-md border border-[#e5e5e5] dark:border-white/10 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#e5e5e5] dark:border-white/10">
              <h3 className="text-xl font-semibold text-foreground">Create account group</h3>
              <p className="text-sm text-foreground/60 mt-1">Group your chart of accounts for custom reporting.</p>
            </div>
            
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Group name</label>
                <input 
                  type="text" 
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  placeholder="e.g. Operating Expenses"
                  className="w-full px-4 py-2.5 rounded-lg border border-[#e5e5e5] dark:border-white/10 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-foreground transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Add accounts (optional)</label>
                <div className="border border-[#e5e5e5] dark:border-white/10 rounded-lg max-h-48 overflow-y-auto divide-y divide-[#e5e5e5] dark:divide-white/5">
                  {accounts.slice(0, 50).map(acc => (
                    <label key={acc.id} className="flex items-center gap-3 px-3 py-2 hover:bg-foreground/[0.02] cursor-pointer transition-colors">
                      <input 
                        type="checkbox" 
                        checked={selectedAccountIds.has(acc.id)}
                        onChange={(e) => {
                          const newSet = new Set(selectedAccountIds);
                          if (e.target.checked) newSet.add(acc.id);
                          else newSet.delete(acc.id);
                          setSelectedAccountIds(newSet);
                        }}
                        className="rounded border-foreground/20 text-emerald-500 focus:ring-emerald-500/20"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">{acc.name}</span>
                        <span className="text-xs text-foreground/50">{acc.code} • {acc.type}</span>
                      </div>
                    </label>
                  ))}
                  {accounts.length > 50 && (
                    <div className="px-3 py-2 text-xs text-foreground/40 text-center italic">
                      Showing first 50 accounts. Search feature coming soon to modal.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-[#e5e5e5] dark:border-white/10 bg-[#fcfcfc] dark:bg-[#1a1a1a] flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsCreateGroupModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim()}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
