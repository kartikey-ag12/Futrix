"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, LayoutTemplate } from "lucide-react";
import clsx from "clsx";

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
          <div className="flex flex-col items-center justify-center h-48 bg-white dark:bg-[#111] border border-dashed border-[#e5e5e5] dark:border-white/10 rounded-xl text-center">
            <LayoutTemplate className="w-8 h-8 text-foreground/30 mb-3" />
            <h3 className="text-sm font-medium text-foreground/60">Browse Futrix's built-in templates — coming soon</h3>
          </div>
        )}

        {/* Scratch Content */}
        {activeTab === "scratch" && (
          <div className="flex flex-col items-center justify-center h-48 bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/10 rounded-xl text-center">
            <h3 className="text-base font-medium text-foreground mb-4">Start from a blank canvas</h3>
            <Link 
              href="/reporting/new"
              className="px-6 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors"
            >
              Create blank report
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
