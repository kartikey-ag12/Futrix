"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BuilderTemplatesPanel } from "@/components/reporting/BuilderTemplatesPanel";
import { useTemplates, BuilderTemplate } from "@/hooks/useTemplates";
import { useGuidedTour, TourStep } from "@/hooks/useGuidedTour";
import { GuidedTourOverlay } from "@/components/shared/GuidedTourOverlay";
import { LayoutTemplate, PieChart } from "lucide-react";
import clsx from "clsx";
import { ProfitLossDashboard } from "@/components/performance/ProfitLossDashboard";
import { BalanceSheetDashboard } from "@/components/performance/BalanceSheetDashboard";
import { CashFlowDashboard } from "@/components/performance/CashFlowDashboard";

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
      if (templateId.startsWith("widget:")) {
        const widgetName = templateId.replace("widget:", "");
        setDroppedTemplates(prev => [...prev, {
          id: `widget-${Date.now()}`,
          name: widgetName,
          category: "Widget",
          orientation: "landscape",
          pages: 1,
          componentType: "Widget"
        }]);
      } else if (templateId === "text-block") {
        setDroppedTemplates(prev => [...prev, {
          id: `text-${Date.now()}`,
          name: "Text Block",
          category: "Text",
          orientation: "landscape",
          pages: 1,
          componentType: "Text"
        }]);
      } else if (templateId.startsWith("builder-block-")) {
        setDroppedTemplates(prev => [...prev, {
          id: `builder-${Date.now()}`,
          name: "Chart/Table Block",
          category: "Builder",
          orientation: "landscape",
          pages: 1,
          componentType: "BuilderBlock"
        }]);
      } else if (templateId === "dynamic-placeholder") {
        setDroppedTemplates(prev => [...prev, {
          id: `placeholder-${Date.now()}`,
          name: "Report Date",
          category: "Text",
          orientation: "landscape",
          pages: 1,
          componentType: "DynamicPlaceholder"
        }]);
      } else if (templateId.startsWith("page-number-")) {
        const format = templateId.replace("page-number-", "");
        setDroppedTemplates(prev => [...prev, {
          id: `pagenum-${Date.now()}`,
          name: `Page Number: ${format}`,
          category: "Text",
          orientation: "landscape",
          pages: 1,
          componentType: "PageNumber"
        }]);
      } else if (templateId.startsWith("image-block-sample-")) {
        const num = templateId.replace("image-block-sample-", "");
        setDroppedTemplates(prev => [...prev, {
          id: `img-${Date.now()}`,
          name: `Image ${num}`,
          category: "Image",
          orientation: "landscape",
          pages: 1,
          componentType: "ImageBlock"
        }]);
      } else {
        const template = templates.find(t => t.id === templateId);
        if (template) {
          setDroppedTemplates(prev => [...prev, { ...template, elements: [] }]);
        }
      }
      if (tour.isActive && tour.currentStepIndex === 0) {
        tour.completeAction();
      }
    }
  };

  const handleDropIntoTemplate = (e: React.DragEvent, templateIndex: number) => {
    const templateId = e.dataTransfer.getData("templateId");
    if (!templateId) return;

    let newElement: any = null;

    if (templateId.startsWith("widget:")) {
      newElement = { id: `widget-${Date.now()}`, name: templateId.replace("widget:", ""), componentType: "Widget" };
    } else if (templateId === "text-block") {
      newElement = { id: `text-${Date.now()}`, name: "Text Block", componentType: "Text" };
    } else if (templateId.startsWith("builder-block-")) {
      newElement = { id: `builder-${Date.now()}`, name: "Chart/Table Block", componentType: "BuilderBlock" };
    } else if (templateId === "dynamic-placeholder") {
      newElement = { id: `placeholder-${Date.now()}`, name: "Report Date", componentType: "DynamicPlaceholder" };
    } else if (templateId.startsWith("page-number-")) {
      newElement = { id: `pagenum-${Date.now()}`, name: `Page Number: ${templateId.replace("page-number-", "")}`, componentType: "PageNumber" };
    } else if (templateId.startsWith("image-block-sample-")) {
      newElement = { id: `img-${Date.now()}`, name: `Image ${templateId.replace("image-block-sample-", "")}`, componentType: "ImageBlock" };
    }

    if (newElement) {
      e.preventDefault();
      e.stopPropagation();
      setDroppedTemplates(prev => {
        const updated = [...prev];
        const targetTemplate = { ...updated[templateIndex] };
        
        targetTemplate.elements = targetTemplate.elements 
          ? [...targetTemplate.elements, newElement] 
          : [newElement];
          
        updated[templateIndex] = targetTemplate;
        return updated;
      });
    }
  };

  const renderBuilderElement = (template: any, idx: number) => {
    if (template.componentType === "Widget") {
       return (
          <div key={`${template.id}-${idx}`} className="bg-white dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-white/10 shadow-sm rounded-lg p-6 min-w-[300px] max-w-sm flex flex-col items-center justify-center h-48 animate-in fade-in zoom-in-95 duration-200 self-start">
             <PieChart className="w-8 h-8 text-emerald-500 mb-3" />
             <h3 className="font-medium text-foreground">{template.name}</h3>
             <p className="text-xs text-foreground/50 mt-1">Live Widget Preview</p>
          </div>
       );
    }
    if (template.componentType === "BuilderBlock") {
       return (
          <div key={`${template.id}-${idx}`} className="bg-white dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-white/10 shadow-sm rounded-lg p-6 min-w-[400px] max-w-lg flex flex-col items-center justify-center h-64 animate-in fade-in zoom-in-95 duration-200 self-start">
             <div className="w-16 h-16 bg-foreground/5 rounded mb-4"></div>
             <h3 className="font-medium text-foreground">Chart / Table</h3>
             <p className="text-xs text-foreground/50 mt-1">Configure your chart metrics</p>
          </div>
       );
    }
    if (template.componentType === "Text") {
       return (
          <div key={`${template.id}-${idx}`} className="bg-white dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-white/10 shadow-sm rounded-lg p-6 min-w-[600px] text-left animate-in fade-in zoom-in-95 duration-200">
             <textarea className="w-full h-32 bg-transparent resize-none outline-none text-foreground placeholder:text-foreground/30 font-medium" placeholder="Type your text here..." />
          </div>
       );
    }
    if (template.componentType === "DynamicPlaceholder") {
       return (
          <div key={`${template.id}-${idx}`} className="bg-[#222] border border-[#e5e5e5] dark:border-white/10 shadow-sm rounded px-4 py-2 inline-block self-start animate-in fade-in zoom-in-95 duration-200">
             <span className="font-mono text-emerald-400 text-sm">@REPORT_DATE</span>
          </div>
       );
    }
    if (template.componentType === "PageNumber") {
       return (
          <div key={`${template.id}-${idx}`} className="bg-transparent border border-dashed border-[#e5e5e5] dark:border-white/20 shadow-sm rounded px-4 py-2 inline-block self-start animate-in fade-in zoom-in-95 duration-200">
             <span className="text-foreground/70 text-sm">{template.name}</span>
          </div>
       );
    }
    if (template.componentType === "ImageBlock") {
       return (
          <div key={`${template.id}-${idx}`} className="bg-white dark:bg-[#1a1a1a] border border-dashed border-[#ccc] dark:border-[#444] shadow-sm rounded-lg p-6 min-w-[300px] flex flex-col items-center justify-center h-48 animate-in fade-in zoom-in-95 duration-200 self-start">
             <p className="font-semibold text-foreground/50 mb-2">Image Placeholder</p>
             <p className="text-xs text-foreground/40">Select an image to render</p>
          </div>
       );
    }
    return null;
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
    <div className="flex flex-1 h-full w-full bg-gray-50 dark:bg-[#0a0a0a] overflow-hidden absolute inset-0">
      
      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col relative h-full overflow-hidden bg-[#f5f5f5] dark:bg-[#0a0a0a]">
        
        {/* Top Builder Toolbar */}
        <div className="w-full h-14 bg-white dark:bg-[#111] border-b border-[#e5e5e5] dark:border-white/10 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-6">
            <button className="text-sm font-medium flex items-center gap-1.5 text-foreground hover:text-emerald-600 transition-colors">
              Page setup <span className="text-[10px]">▼</span>
            </button>
            <div className="flex items-center gap-1.5 text-emerald-600">
              <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">★</div>
              <span className="text-sm font-medium">Added to Performance area</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground/80">Period end:</span>
              <select className="bg-white dark:bg-[#222] border border-[#e5e5e5] dark:border-white/20 rounded px-3 py-1 text-sm outline-none">
                <option>Mixed dates</option>
              </select>
            </div>
            <button onClick={handleSave} className="text-foreground/50 hover:text-foreground transition-colors p-1" title="Save draft">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            </button>
            <Link href="/reporting" className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-full transition-colors shadow-sm">
              Exit
            </Link>
          </div>
        </div>

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
              "flex-1 w-full mx-auto rounded-xl border-2 transition-all flex flex-col",
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
              <div className="flex flex-col gap-6 p-6 w-full">
                {droppedTemplates.map((template: any, idx) => {
                  
                  const elementUi = renderBuilderElement(template, idx);
                  if (elementUi) return elementUi;

                  let DashboardComponent = null;
                  if (template.componentType === "ProfitLossDashboard") DashboardComponent = ProfitLossDashboard;
                  if (template.componentType === "BalanceSheetDashboard") DashboardComponent = BalanceSheetDashboard;
                  if (template.componentType === "CashFlowDashboard") DashboardComponent = CashFlowDashboard;

                  return (
                    <div 
                      key={`${template.id}-${idx}`}
                      className="bg-white dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-white/10 shadow-sm rounded-lg p-6 w-full flex flex-col animate-in fade-in zoom-in-95 duration-200 relative group"
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.dataTransfer.dropEffect = "copy";
                        e.currentTarget.classList.add("border-emerald-500", "ring-4", "ring-emerald-500/10");
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.currentTarget.classList.remove("border-emerald-500", "ring-4", "ring-emerald-500/10");
                      }}
                      onDrop={(e) => {
                        e.currentTarget.classList.remove("border-emerald-500", "ring-4", "ring-emerald-500/10");
                        handleDropIntoTemplate(e, idx);
                      }}
                    >
                      {DashboardComponent ? (
                        <div className="w-full">
                          <DashboardComponent isBuilderMode={true} />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <LayoutTemplate className="w-12 h-12 text-emerald-500/40 mb-4" />
                          <h3 className="text-lg font-medium text-foreground">{template.name}</h3>
                          <p className="text-sm text-foreground/50 mt-2">Placeholder rendering block ({reportType} layout)</p>
                        </div>
                      )}

                      {template.elements && template.elements.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-dashed border-[#e5e5e5] dark:border-white/20 flex flex-wrap gap-4 items-start">
                          {template.elements.map((el: any, elIdx: number) => renderBuilderElement(el, elIdx))}
                        </div>
                      )}
                    </div>
                  );
                })}
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
          onCancel={tour.endTour}
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
