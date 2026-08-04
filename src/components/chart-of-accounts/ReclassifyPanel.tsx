"use client";

import { X } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

interface ReclassifyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: { id: string; name: string; code?: string }[];
}

export function ReclassifyPanel({ isOpen, onClose, accounts }: ReclassifyPanelProps) {
  const [selectedAccount, setSelectedAccount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white dark:bg-[#111] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e5e5e5] dark:border-white/10">
          <h2 className="text-xl font-bold text-foreground">Reclassify an account to another Profit & Loss category</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-foreground/50 hover:text-foreground transition-colors rounded-full hover:bg-foreground/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <p className="text-sm text-foreground/70 mb-8">
            Please consult your accountant before reclassifying accounts to a different category.
          </p>

          <div className="flex flex-col gap-8">
            
            {/* Account Row */}
            <div className="grid grid-cols-[200px_1fr] items-start gap-4">
              <label className="text-sm font-semibold text-foreground mt-2">
                Choose account to reclassify:
              </label>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-foreground/80">Account</span>
                <select 
                  className="w-full px-3 py-2 border border-[#e5e5e5] dark:border-white/10 rounded-lg bg-white dark:bg-[#1a1a1a] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                >
                  <option value="" disabled hidden>Start typing to find your account</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.code ? `${acc.code} - ` : ''}{acc.name}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-[26px] pointer-events-none">
                  {/* Dropdown chevron is natively added, but we could add custom here */}
                </div>
              </div>
            </div>

            {/* Category Row */}
            <div className="grid grid-cols-[200px_1fr] items-start gap-4">
              <label className="text-sm font-semibold text-foreground mt-2">
                Choose Category to move to:
              </label>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-foreground/80">Profit & Loss categories</span>
                <select 
                  className="w-full px-3 py-2 border border-[#e5e5e5] dark:border-white/10 rounded-lg bg-white dark:bg-[#1a1a1a] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="" disabled hidden>Please select...</option>
                  <option value="income">Income</option>
                  <option value="cost_of_sales">Cost of Sales</option>
                  <option value="expenses">Expenses</option>
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e5e5e5] dark:border-white/10 flex items-center justify-end gap-3 bg-[#fcfcfc] dark:bg-[#1a1a1a]">
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-emerald-500 text-emerald-600 dark:text-emerald-500 rounded-full text-sm font-medium hover:bg-emerald-500/10 transition-colors"
          >
            Cancel
          </button>
          <button 
            disabled={!selectedAccount || !selectedCategory}
            className="px-6 py-2 bg-[#f0f0f0] dark:bg-white/10 text-foreground/40 rounded-full text-sm font-medium cursor-not-allowed"
          >
            Save
          </button>
        </div>

      </div>
    </>
  );
}
