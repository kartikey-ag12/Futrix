"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BuilderTemplatesPanel } from "@/components/reporting/BuilderTemplatesPanel";
import { useTemplates, BuilderTemplate } from "@/hooks/useTemplates";
import { useGuidedTour, TourStep } from "@/hooks/useGuidedTour";
import { GuidedTourOverlay } from "@/components/shared/GuidedTourOverlay";
import { LayoutTemplate } from "lucide-react";
import clsx from "clsx";

const TOUR_STEPS: TourStep[] = [
  {
    targetId: "templates-panel",
    title: "Drag and drop the template onto your page...",
    body: "We'll show you how quickly a report can be made and customised.",
    actionRequired: true,
    arrowPosition: "right",
  },
  {
    targetId: "builder-next-btn",
    title: "Great! Now proceed.",
    body: "Click Next to continue configuring your report settings.",
    actionRequired: false,
    arrowPosition: "top",
  }
];

function BuilderCanvasContent() {
  const searchParams = useSearchParams();
  const reportType = searchParams.get("type") || "dashboard"; // e.g., 'dashboard', 'landscape', 'portrait'
  const templateIdParam = searchParams.get("templateId");
  const { templates } = useTemplates();
  
  const tour = useGuidedTour(TOUR_STEPS);
  
  const [droppedTemplates, setDroppedTemplates] = useState<BuilderTemplate[]>(() => {
    if (templateIdParam) {
      const template = templates.find(t => t.id === templateIdParam);
      if (template) return [template];
    }
    return [];
  });
  const [isDragOver, setIsDragOver] = useState(false);

  // DnD Handlers
  const handleDragStart = (e: React.DragEvent, templateId: string) => {
    e.dataTransfer.setData("templateId", templateId);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "copy";
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const templateId = e.dataTransfer.getData("templateId");
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setDroppedTemplates(prev => [...prev, template]);
        if (tour.isActive && tour.currentStepIndex === 0) {
          tour.completeAction();
        }
      }
    }
  };

  const handleSave = async () => {
    if (!hasContent) return;
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `New ${reportType} Report`,
          type: reportType,
          status: "draft",
          pageCount: droppedTemplates.length,
          data: { templates: droppedTemplates.map(t => t.id) }
        }),
      });
      if (res.ok) {
        window.location.href = "/reporting";
      }
    } catch (e) {
      console.error("Save failed", e);
    }
  };

  const hasContent = droppedTemplates.length > 0;

  return (
    <div className="flex-1 flex overflow-hidden">
      
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-[#f5f5f5] dark:bg-[#0a0a0a]">
        
        {/* Progress Bar (Placeholder for guided tour phase) */}
        <div className="w-full h-1 bg-white/10 shrink-0">
          <div className="h-full bg-emerald-500 transition-all duration-500 ease-out" style={{ width: '20%' }} />
        </div>

        <div className="flex-1 flex flex-col p-8 overflow-y-auto">
          
          {/* Header area */}
          <div className="flex items-start justify-between mb-8 max-w-5xl mx-auto w-full">
            <div>
              <h1 className="text-xl font-semibold text-foreground mb-1">Drag and drop the template onto your page...</h1>
              <p className="text-sm text-foreground/60">We'll show you how quickly a report can be made and customised.</p>
            </div>
            <div className="flex gap-3">
              <button 
                id="builder-next-btn"
                disabled={!hasContent}
                className={clsx(
                  "px-8 py-2.5 rounded-lg font-medium transition-all shadow-sm",
                  hasContent 
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                    : "bg-foreground/10 text-foreground/40 cursor-not-allowed"
                )}
              >
                Next
              </button>
              <button 
                onClick={handleSave}
                disabled={!hasContent}
                className={clsx(
                  "px-8 py-2.5 rounded-lg font-medium transition-all shadow-sm border",
                  hasContent 
                    ? "bg-white dark:bg-[#111] hover:bg-foreground/5 text-foreground border-foreground/20" 
                    : "bg-transparent text-foreground/40 border-foreground/10 cursor-not-allowed"
                )}
              >
                Save
              </button>
            </div>
          </div>

          {/* The Canvas Drop Zone */}
          <div 
            className={clsx(
              "flex-1 w-full max-w-5xl mx-auto rounded-xl border-2 transition-all flex flex-col overflow-x-auto",
              isDragOver 
                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/5 shadow-inner" 
                : hasContent
                  ? "border-transparent"
                  : "border-dashed border-[#e5e5e5] dark:border-white/20 bg-white dark:bg-[#111]"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {hasContent ? (
              <div className="flex flex-col gap-6 p-6 min-w-max">
                {droppedTemplates.map((template, idx) => (
                  <div 
                    key={`${template.id}-${idx}`}
                    className="bg-white dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-white/10 shadow-sm rounded-lg p-12 min-w-[800px] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-200"
                  >
                    <LayoutTemplate className="w-12 h-12 text-emerald-500/40 mb-4" />
                    <h3 className="text-lg font-medium text-foreground">{template.name}</h3>
                    <p className="text-sm text-foreground/50 mt-2">Placeholder rendering block ({reportType} layout)</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center pointer-events-none">
                <p className="text-foreground/40 font-medium text-lg">Drop templates here</p>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Left Button */}
        <div className="absolute bottom-8 left-8 z-20">
          <Link
            href="/reporting"
            onClick={(e) => {
              if (tour.isActive) {
                // If it was just a regular click while tour is active, 
                // let the Link natural behavior happen but also mark tour ended
                tour.endTour();
              }
            }}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium shadow-sm transition-colors"
          >
            End guided flow
          </Link>
        </div>
      </div>

      {/* Right Side Templates Panel */}
      <div id="templates-panel" className="h-full relative">
        <BuilderTemplatesPanel onDragStart={handleDragStart} />
      </div>

      {/* Guided Tour Overlay */}
      {tour.isActive && tour.currentStep && (
        <GuidedTourOverlay 
          step={tour.currentStep} 
          isActionCompleted={tour.isActionCompleted} 
          onNext={tour.nextStep} 
        />
      )}
      
    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading builder...</div>}>
      <BuilderCanvasContent />
    </Suspense>
  );
}
