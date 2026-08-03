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
              className="group relative flex flex-col bg-white dark:bg-[#0a0a0a] border border-[#e5e5e5] dark:border-white/20 rounded-xl cursor-grab active:cursor-grabbing hover:border-emerald-500 hover:shadow-md transition-all overflow-hidden"
            >
              {/* Thumbnail Placeholder */}
              <div className="flex-1 bg-foreground/5 flex items-center justify-center border-b border-[#e5e5e5] dark:border-white/10 relative p-4 pointer-events-none">
                <div className={clsx(
                  "bg-white dark:bg-[#222] shadow-sm rounded border border-[#e5e5e5] dark:border-white/10 flex items-center justify-center",
                  t.orientation === "portrait" ? "w-16 h-24" : "w-24 h-16"
                )}>
                  <LayoutTemplate className="w-6 h-6 text-foreground/20" />
                </div>
              </div>

              {/* Details */}
              <div className="p-3 flex flex-col h-24 relative pointer-events-none bg-white dark:bg-[#0a0a0a]">
                <h3 className="font-medium text-foreground text-xs line-clamp-2 mb-1 group-hover:text-emerald-600 transition-colors">
                  {t.name}
                </h3>
                <p className="text-[10px] text-foreground/50 truncate mb-4">{t.category}</p>
                
                <div className="absolute bottom-2 right-2">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-foreground/5 text-foreground/50 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                    1 of {t.pages}
                  </span>
                </div>
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
