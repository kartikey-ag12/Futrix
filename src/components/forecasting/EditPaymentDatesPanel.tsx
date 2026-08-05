"use client";

import { X, Calendar, Trash2, Plus, AlertCircle } from "lucide-react";
import { DueInvoice } from "./DetailedInvoicesView";
import { useState, useEffect } from "react";
import clsx from "clsx";

interface EditPaymentDatesPanelProps {
  invoice: DueInvoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditPaymentDatesPanel({ invoice, isOpen, onClose }: EditPaymentDatesPanelProps) {
  const [payments, setPayments] = useState([
    { id: 1, amount: 0, date: "" },
    { id: 2, amount: 0, date: "" },
    { id: 3, amount: 0, date: "" },
  ]);

  useEffect(() => {
    if (invoice) {
      // Default set the first payment to total amount and today's date if possible
      const d = new Date();
      const dateStr = d.toISOString().split('T')[0];
      setTimeout(() => setPayments([
        { id: 1, amount: invoice.amountDue, date: dateStr },
        { id: 2, amount: 0, date: "" },
        { id: 3, amount: 0, date: "" },
      ]), 0);
    }
  }, [invoice]);

  if (!isOpen || !invoice) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-[480px] bg-white dark:bg-[#1a1a1a] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 border-l border-[#e5e5e5] dark:border-white/10">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6">
          <h2 className="text-[22px] font-bold text-foreground">Edit payment dates</h2>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-foreground/50 hover:text-foreground hover:bg-foreground/5 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Details Summary */}
        <div className="px-8 flex flex-col gap-1.5 text-[13px]">
          <div className="flex items-center">
            <span className="text-foreground/50 w-24">Contact:</span>
            <span className="font-semibold text-foreground">{invoice.contact}</span>
          </div>
          <div className="flex items-center">
            <span className="text-foreground/50 w-24">Reference:</span>
            <span className="font-semibold text-foreground">{invoice.reference}</span>
          </div>
          <div className="flex items-center">
            <span className="text-foreground/50 w-24">Total amount:</span>
            <span className="font-semibold text-foreground">
              US${invoice.amountDue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 pt-10 relative">
          
          <div className="flex flex-col gap-4 relative">
            {/* The dotted vertical line linking the plus button */}
            <div className="absolute left-[200px] top-6 bottom-0 w-px border-l-2 border-dotted border-[#e5e5e5] dark:border-white/10 -z-10" />

            {payments.map((p, index) => (
              <div key={p.id} className="flex items-center gap-4 bg-white dark:bg-[#1a1a1a] relative z-10">
                <span className="text-[13px] text-foreground w-16">Payment {index + 1}</span>
                
                {/* Amount Input */}
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground font-medium text-[13px]">$</div>
                  <input 
                    type="number"
                    value={p.amount}
                    onChange={(e) => {
                      const newP = [...payments];
                      newP[index].amount = Number(e.target.value);
                      setPayments(newP);
                    }}
                    className="w-[140px] pl-7 pr-3 py-2 border border-[#d1d5db] dark:border-white/20 bg-transparent rounded text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <span className="text-[13px] text-foreground/50">on</span>

                {/* Date Input */}
                <div className="relative w-[145px]">
                  <input 
                    type="date"
                    value={p.date}
                    onChange={(e) => {
                      const newP = [...payments];
                      newP[index].date = e.target.value;
                      setPayments(newP);
                    }}
                    className="w-full px-3 py-2 border border-[#d1d5db] dark:border-white/20 bg-transparent rounded text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:[color-scheme:dark]"
                  />
                </div>

                {/* Delete */}
                <button className="p-1.5 text-foreground/50 hover:text-foreground hover:bg-foreground/5 rounded">
                  <Trash2 className="w-[18px] h-[18px]" />
                </button>
              </div>
            ))}
            
            {/* Add Button */}
            <div className="flex justify-center mt-2 relative z-10 w-[140px] ml-[80px]">
              <button 
                className="w-6 h-6 rounded-full bg-foreground/5 text-foreground/40 flex items-center justify-center hover:bg-foreground/10 hover:text-foreground transition-colors"
                onClick={() => setPayments([...payments, { id: Date.now(), amount: 0, date: "" }])}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Warning Message */}
          <div className="mt-12">
            <p className="text-[12px] text-rose-500 bg-rose-500/10 p-2 rounded border border-rose-500/20">
              An expected payment is now overdue. Please alter the payments or dates above to reschedule.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#e5e5e5] dark:border-white/10 bg-white dark:bg-[#1a1a1a] flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-emerald-600 text-emerald-600 dark:text-emerald-500 font-medium rounded-full text-sm hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-emerald-600 text-white font-medium rounded-full text-sm hover:bg-emerald-700 transition-colors"
          >
            Save
          </button>
        </div>

      </div>
    </>
  );
}
