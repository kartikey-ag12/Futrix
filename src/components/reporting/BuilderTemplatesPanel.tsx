"use client";

import { useState } from "react";
import { 
  LayoutTemplate, ChevronRight, ChevronLeft, LayoutDashboard, Type, Image as ImageIcon, 
  PieChart, BarChartHorizontal, BarChart3, BarChart4, LineChart, 
  ScatterChart, Activity, AreaChart, Table2, Hash 
} from "lucide-react";
import { useTemplates } from "@/hooks/useTemplates";
import clsx from "clsx";

interface BuilderTemplatesPanelProps {
  onDragStart: (e: React.DragEvent, templateId: string) => void;
}

const SIDEBAR_ITEMS = [
  { id: 'templates', icon: LayoutTemplate, label: 'Templates' },
  { id: 'widgets', icon: PieChart, label: 'Widgets' },
  { id: 'builder', icon: LayoutDashboard, label: 'Builder' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'images', icon: ImageIcon, label: 'Images' },
];

const BUILDER_ICONS = {
  'bar-horizontal': BarChartHorizontal,
  'bar-vertical': BarChart3,
  'bar-stacked': BarChart4,
  'line-simple': LineChart,
  'pie': PieChart,
  'donut': PieChart,
  'line-points': ScatterChart,
  'step': Activity,
  'area': AreaChart,
  'table': Table2,
  'scoreboard': Hash
};

export function BuilderTemplatesPanel({ onDragStart }: BuilderTemplatesPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('templates');
  const { templates } = useTemplates();

  return (
    <div className="h-full flex relative z-10 shadow-xl">
      {/* Tiny black half-circle toggle attached to the left of the toolbar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-1/2 -left-4 -translate-y-1/2 w-4 h-12 bg-[#111] text-white flex items-center justify-center rounded-l-full hover:bg-[#222] transition-colors z-30"
      >
        {isOpen ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Dark Toolbar Strip */}
      <div className="w-[72px] bg-[#111] flex flex-col items-center py-4 border-l border-[#222] z-20 flex-shrink-0">
        {SIDEBAR_ITEMS.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (!isOpen) setIsOpen(true);
              }}
              className={clsx(
                "w-full flex flex-col items-center justify-center py-3 gap-1.5 transition-colors cursor-pointer",
                isActive ? "bg-emerald-700 text-white" : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* White Sliding Panel */}
      <div 
        className={clsx(
          "relative flex flex-col bg-white dark:bg-[#1a1a1a] border-l border-[#e5e5e5] dark:border-white/10 transition-all duration-300 ease-in-out",
          isOpen ? "w-[320px]" : "w-0 border-l-0"
        )}
      >
        {/* Panel Content */}
        <div className={clsx("flex-1 p-6 min-w-[320px] transition-opacity duration-300 overflow-y-auto", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")}>
          
          {activeTab === 'templates' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <LayoutTemplate className="w-5 h-5 text-emerald-500" />
                <h2 className="font-semibold text-foreground">Futrli templates</h2>
              </div>
              <div className="space-y-4">
                {templates.filter(t => !t.componentType).map((t) => (
                  <div
                    key={t.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, t.id)}
                    className="group relative flex flex-col bg-white dark:bg-[#0a0a0a] border border-[#e5e5e5] dark:border-white/20 rounded-xl cursor-grab active:cursor-grabbing hover:border-emerald-500 hover:shadow-md transition-all overflow-hidden"
                  >
                    <div className="flex-1 bg-foreground/5 flex items-center justify-center border-b border-[#e5e5e5] dark:border-white/10 relative p-4 pointer-events-none">
                      <div className={clsx(
                        "bg-white dark:bg-[#222] shadow-sm rounded border border-[#e5e5e5] dark:border-white/10 flex items-center justify-center",
                        t.orientation === "portrait" ? "w-16 h-24" : "w-24 h-16"
                      )}>
                        <LayoutTemplate className="w-6 h-6 text-foreground/20" />
                      </div>
                    </div>
                    <div className="p-3 flex flex-col h-24 relative pointer-events-none bg-white dark:bg-[#0a0a0a]">
                      <h3 className="font-medium text-foreground text-xs line-clamp-2 mb-1 group-hover:text-emerald-600 transition-colors">{t.name}</h3>
                      <p className="text-[10px] text-foreground/50 truncate mb-4">{t.category}</p>
                      <div className="absolute bottom-2 right-2">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-foreground/5 text-foreground/50 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">1 of {t.pages}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'widgets' && (
            <>
              <div className="mb-6">
                <div className="relative">
                  <input type="text" placeholder="Search widgets..." className="w-full pl-4 pr-10 py-2 border border-[#e5e5e5] dark:border-white/20 rounded-md bg-transparent text-sm focus:outline-none focus:border-emerald-500" />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                  </div>
                </div>
              </div>
              <h3 className="font-bold text-foreground text-lg mb-4">Community widgets</h3>
              <div className="grid grid-cols-2 gap-4">
                {['Cash in from invoices', 'Cash out from bills', 'Top invoices due', 'Top bills owed', 'Top sales accounts', 'Top cost & expense accounts', 'Top cash in accounts', 'Top cash out accounts'].map(widget => (
                  <div 
                    key={widget} 
                    draggable
                    onDragStart={(e) => onDragStart(e, `widget:${widget}`)}
                    className="border border-[#e5e5e5] dark:border-white/20 rounded-sm p-3 h-24 flex flex-col justify-center items-center text-center cursor-grab hover:border-emerald-500 transition-colors bg-white dark:bg-[#0a0a0a] relative overflow-hidden group"
                  >
                    <span className="text-xs font-medium relative z-10">{widget}</span>
                    <div className="absolute bottom-2 right-2 flex items-end gap-1 opacity-20 group-hover:opacity-40 transition-opacity">
                       <div className="w-1.5 h-6 bg-emerald-500 rounded-t-sm"></div>
                       <div className="w-1.5 h-4 bg-purple-500 rounded-t-sm"></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'builder' && (
            <>
              <h3 className="font-bold text-foreground text-lg mb-4">Chart, table or scoreboard</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'bar-horizontal', icon: 'BarChartHorizontal' },
                  { id: 'bar-vertical', icon: 'BarChart3' },
                  { id: 'bar-stacked', icon: 'BarChart4' },
                  { id: 'line-simple', icon: 'LineChart' },
                  { id: 'pie', icon: 'PieChart' },
                  { id: 'donut', icon: 'PieChart' }, // Using PieChart as Donut placeholder
                  { id: 'line-points', icon: 'ScatterChart' },
                  { id: 'step', icon: 'Activity' },
                  { id: 'area', icon: 'AreaChart' },
                  { id: 'table', icon: 'Table2' },
                  { id: 'scoreboard', icon: 'Hash' }
                ].map((item, i) => {
                  // We dynamically render the icon if it exists in our imports, else a fallback.
                  const IconComponent = BUILDER_ICONS[item.id as keyof typeof BUILDER_ICONS] || PieChart;
                  return (
                    <button 
                      key={item.id} 
                      draggable
                      onDragStart={(e) => onDragStart(e, `builder-block-${item.id}`)}
                      className="w-10 h-10 border border-[#e5e5e5] dark:border-white/20 rounded flex items-center justify-center hover:border-emerald-500 transition-colors bg-white dark:bg-[#0a0a0a] cursor-grab active:cursor-grabbing text-emerald-600 dark:text-emerald-500"
                    >
                      <IconComponent className="w-5 h-5 pointer-events-none" />
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {activeTab === 'text' && (
            <>
              <h3 className="font-bold text-foreground text-lg mb-4">Text blocks</h3>
              <button 
                draggable
                onDragStart={(e) => onDragStart(e, "text-block")}
                className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-full font-semibold transition-colors mb-8 cursor-grab"
              >
                <Type className="w-4 h-4" /> Add text block
              </button>
              
              <h3 className="font-bold text-foreground text-lg mb-2">Available dynamic placeholders</h3>
              <p className="text-sm text-foreground/80 mb-8 leading-relaxed">
                <span 
                  draggable 
                  onDragStart={(e) => onDragStart(e, "dynamic-placeholder")}
                  className="bg-[#222] text-white text-xs px-2 py-0.5 rounded mr-1 font-mono cursor-grab"
                >
                  @REPORT_DATE
                </span>
                dynamic placeholder for current date.
              </p>

              <h3 className="font-bold text-foreground text-lg mb-4">Page numbers</h3>
              <div className="space-y-3">
                {['None', '1', '1 of 1', 'Page 1', 'Page 1 of 1'].map((opt, i) => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="pageNum" defaultChecked={i === 0} className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300" />
                    <span 
                      draggable
                      onDragStart={(e) => onDragStart(e, `page-number-${opt}`)}
                      className="text-sm font-medium cursor-grab group-hover:text-emerald-500 transition-colors"
                    >
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </>
          )}

          {activeTab === 'images' && (
            <>
              <div className="border border-dashed border-[#ccc] dark:border-[#444] rounded-sm p-8 flex flex-col items-center justify-center bg-white dark:bg-transparent mb-8 hover:border-emerald-500 transition-colors">
                <p className="font-semibold text-foreground mb-4">Upload image</p>
                <button className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2 rounded-full font-semibold transition-colors">
                  <ImageIcon className="w-4 h-4" /> Browse Files
                </button>
              </div>
              
              <h3 className="font-bold text-foreground text-lg mb-4">Uploaded images</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(num => (
                  <div 
                    key={num}
                    draggable
                    onDragStart={(e) => onDragStart(e, `image-block-sample-${num}`)}
                    className="aspect-square border border-[#e5e5e5] dark:border-white/20 rounded bg-[#f5f5f5] dark:bg-[#222] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing hover:border-emerald-500 transition-colors"
                  >
                    <ImageIcon className="w-6 h-6 text-foreground/20 mb-2 pointer-events-none" />
                    <span className="text-[10px] text-foreground/40 pointer-events-none">Image {num}</span>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
