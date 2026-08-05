"use client";

import { X, FileSpreadsheet } from "lucide-react";
import Link from "next/link";

interface AddOrganisationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddOrganisationPanel({ isOpen, onClose }: AddOrganisationPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative w-[600px] max-w-full bg-card h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-border bg-card">
          <h2 className="text-2xl font-bold text-foreground">Add an organisation</h2>
          <button onClick={onClose} className="text-foreground/60 hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-background/50">
          <h3 className="font-semibold text-foreground mb-1">Choose your accounting software below</h3>
          <p className="text-sm text-foreground/60 mb-6">
            You may add as many organisations as you like while in trial. Once your trial ends, we'll charge you per organisation.
          </p>
          
          <div className="space-y-4">
             {/* Xero Card */}
             <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card shadow-sm">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-[#00b7e2] rounded-lg flex items-center justify-center text-white font-bold text-xs">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 19.5C16.1421 19.5 19.5 16.1421 19.5 12C19.5 7.85786 16.1421 4.5 12 4.5C7.85786 4.5 4.5 7.85786 4.5 12C4.5 16.1421 7.85786 19.5 12 19.5Z" opacity="0.3"/>
                      <path d="M15.5 8.5L8.5 15.5M8.5 8.5L15.5 15.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                 </div>
                 <span className="font-semibold text-foreground">Xero</span>
               </div>
               <Link href="/api/xero/connect" className="bg-[#0f8a55] hover:bg-[#0c7447] text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors">
                 Connect
               </Link>
             </div>

             {/* Excel Card */}
             <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-card shadow-sm">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-white border border-[#0f8a55]/20 rounded-lg flex items-center justify-center text-[#0f8a55]">
                    <FileSpreadsheet className="w-6 h-6" />
                 </div>
                 <span className="font-semibold text-foreground">Excel organisation</span>
               </div>
               <button className="bg-[#0f8a55] hover:bg-[#0c7447] text-white px-6 py-2 rounded-full text-sm font-semibold transition-colors">
                 Upload Excel
               </button>
             </div>
          </div>
          
          <p className="text-xs text-foreground/60 mt-10">
            Click to connect <strong>Demo Company (UK)</strong> or <strong>Demo Company (AU)</strong>. Demo organisations will not affect the licences in your subscription.
          </p>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-border flex justify-end bg-card">
          <button 
            onClick={onClose} 
            className="px-6 py-2 rounded-full text-sm font-semibold border border-[#0f8a55] text-[#0f8a55] hover:bg-[#0f8a55]/5 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
