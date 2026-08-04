"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, LayoutTemplate, PlayCircle, Plus } from "lucide-react";
import clsx from "clsx";
import { FutrixTemplateGallery } from "./FutrixTemplateGallery";

const TABS = [
  { id: "workspace", label: "A workspace template" },
  { id: "futrix", label: "A Futrix template" },
  { id: "scratch", label: "Scratch" },
];

export function CreateFromTabs() {
  const [activeTab, setActiveTab] = useState("workspace");

  return (
    <div className="w-full">
      <h2 className="text-base font-semibold text-foreground mb-4">Create from:</h2>
      
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-[#e5e5e5] dark:border-white/10 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-500"
                : "border-transparent text-foreground/60 hover:text-foreground hover:border-foreground/20"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Panels */}
      <div className="min-h-[300px]">
        
        {/* Workspace Template Content */}
        {activeTab === "workspace" && (
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Left side text/features */}
            <div className="flex-1 space-y-6">
              <h3 className="text-xl font-semibold text-foreground">Convert any report to a workspace template!</h3>
              
              <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-4 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-200/90 leading-relaxed">
                  Your role within this workspace gives you permission to convert any existing report to a workspace template. 
                  Users with a 'guest' role do not have access to this feature.
                </p>
              </div>

              <ul className="space-y-3">
                {[
                  "Perfect your brand's presentation to instantly impress your audience.",
                  "Brand charts and tables with your company colours.",
                  "Save time by duplicating structured templates for repeating clients.",
                  "Enforce standardization across your team's reporting outputs."
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right side promotional graphic */}
            <div className="w-full md:w-[320px] bg-[#111] text-white p-6 rounded-2xl shadow-lg border border-[#222] flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mb-6 border border-white/5">
                <LayoutTemplate className="w-8 h-8 text-emerald-400" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Workspace templates</h4>
              <p className="text-sm text-white/60 mb-6">
                Create and manage your own custom report layouts that anyone in your workspace can use.
              </p>
              <button className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
                Manage templates
              </button>
            </div>
          </div>
        )}

        {/* Futrix Template Content */}
        {activeTab === "futrix" && (
          <FutrixTemplateGallery />
        )}

        {/* Scratch Content */}
        {activeTab === "scratch" && (
          <div className="bg-white dark:bg-[#111] p-8 pt-6 border-t-0 -mt-6 pt-10">
            <div className="flex items-center gap-3 mb-8">
              <h3 className="text-xl font-bold text-foreground">Click to create a report</h3>
              <button className="flex items-center gap-1.5 text-[11px] font-bold text-foreground/50 hover:text-foreground/80 transition-colors uppercase tracking-wider">
                <PlayCircle className="w-4 h-4" />
                Virtual demo
              </button>
            </div>
            
            <div className="flex items-end gap-6">
              {/* Portrait */}
              <Link 
                href="/reporting/builder?layout=portrait" 
                className="flex flex-col items-center justify-center w-[160px] h-[220px] border border-[#e5e5e5] dark:border-white/10 hover:border-emerald-500 transition-colors bg-white dark:bg-[#1a1a1a]"
              >
                <div className="w-10 h-10 border-2 border-emerald-500 rounded-lg flex items-center justify-center mb-3 text-emerald-500">
                  <Plus className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <span className="text-[13px] font-medium text-foreground">Portrait</span>
              </Link>

              {/* Landscape */}
              <Link 
                href="/reporting/builder?layout=landscape" 
                className="flex flex-col items-center justify-center w-[220px] h-[160px] border border-[#e5e5e5] dark:border-white/10 hover:border-emerald-500 transition-colors bg-white dark:bg-[#1a1a1a]"
              >
                <div className="w-10 h-10 border-2 border-emerald-500 rounded-lg flex items-center justify-center mb-3 text-emerald-500">
                  <Plus className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <span className="text-[13px] font-medium text-foreground">Landscape</span>
              </Link>

              {/* Dashboard */}
              <Link 
                href="/reporting/builder?layout=dashboard" 
                className="flex flex-col items-center justify-center w-[220px] h-[220px] border border-[#e5e5e5] dark:border-white/10 hover:border-emerald-500 transition-colors bg-white dark:bg-[#1a1a1a]"
              >
                <div className="w-10 h-10 border-2 border-emerald-500 rounded-lg flex items-center justify-center mb-3 text-emerald-500">
                  <Plus className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <span className="text-[13px] font-medium text-foreground">Dashboard</span>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
