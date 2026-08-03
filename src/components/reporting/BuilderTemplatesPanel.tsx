"use client";

import { useState } from "react";
import { LayoutTemplate, ChevronRight, ChevronLeft } from "lucide-react";
import { useTemplates } from "@/hooks/useTemplates";
import clsx from "clsx";

interface BuilderTemplatesPanelProps {
  onDragStart: (e: React.DragEvent, templateId: string) => void;
}

export function BuilderTemplatesPanel({ onDragStart }: BuilderTemplatesPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { templates } = useTemplates();

  return (
    <div 
      className={clsx(
        "relative flex flex-col bg-white dark:bg-[#111] border-l border-[#e5e5e5] dark:border-white/10 transition-all duration-300 ease-in-out z-10 shadow-xl",
        isOpen ? "w-[320px]" : "w-0 overflow-hidden border-l-0"
      )}
    >
      {/* Toggle Tab */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "absolute top-8 flex items-center justify-center w-8 h-24 bg-emerald-500 text-white rounded-l-xl transition-all duration-300 shadow-md",
          isOpen ? "-left-8" : "-left-8 rounded-xl"
        )}
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
      >
        <span className="flex items-center gap-1 font-medium text-sm tracking-wide transform rotate-180">
          {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          Templates
        </span>
      </button>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-6 min-w-[320px]">
        <div className="flex items-center gap-3 mb-6">
          <LayoutTemplate className="w-5 h-5 text-emerald-500" />
          <h2 className="font-semibold text-foreground">Templates</h2>
        </div>

        <div className="space-y-4">
          {templates.map((t) => (
            <div
              key={t.id}
              draggable
              onDragStart={(e) => onDragStart(e, t.id)}
              className="group relative flex flex-col items-center justify-center h-40 bg-white dark:bg-[#0a0a0a] border-2 border-dashed border-[#e5e5e5] dark:border-white/20 rounded-xl cursor-grab active:cursor-grabbing hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all"
            >
              <div className="p-4 text-center pointer-events-none">
                <h3 className="font-medium text-foreground text-sm group-hover:text-emerald-600 transition-colors">
                  {t.name}
                </h3>
              </div>
              
              <div className="absolute bottom-3 pointer-events-none">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-foreground/5 text-foreground/60 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                  {t.pages} page{t.pages !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
          <p className="text-sm text-emerald-800 dark:text-emerald-200/90 leading-relaxed text-center">
            When you've finished onboarding you'll have over 60 templates to choose from here!
          </p>
        </div>
      </div>
    </div>
  );
}
