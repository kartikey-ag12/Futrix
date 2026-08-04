"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Calendar, Calculator, Sparkles, FileSpreadsheet, Upload, Download, ArrowRight, Loader2 } from "lucide-react";
import clsx from "clsx";
import { ForecastMonthTable } from "./ForecastMonthTable";

interface WizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: string;
}

export function ForecastCreationWizard({ open, onOpenChange, type }: WizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [startMonth, setStartMonth] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1); // Next month by default
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
  });
  const [method, setMethod] = useState<"scratch" | "last-year" | "auto">("auto");
  const [previewData, setPreviewData] = useState<any>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, Record<string, number>>>({});
  const [isCreating, setIsCreating] = useState(false);

  // Excel Modal State
  const [excelModalOpen, setExcelModalOpen] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset state on open
  useEffect(() => {
    if (open) {
      setStep(1);
      setMethod("auto");
      setOverrides({});
      setPreviewData(null);
    }
  }, [open]);

  // Fetch preview data when method or startMonth changes
  useEffect(() => {
    if (open && (step === 2 || step === 3)) {
      fetchPreview();
    }
  }, [open, step, method, startMonth]);

  const fetchPreview = async () => {
    setIsLoadingPreview(true);
    try {
      const res = await fetch("/api/forecasts/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startMonth, method }),
      });
      if (res.ok) {
        const json = await res.json();
        setPreviewData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const res = await fetch("/api/forecasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "New Forecast",
          type,
          method,
          months: previewData.months,
          overrides,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        onOpenChange(false);
        router.push(`/forecasting/${json.id}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCreating(false);
    }
  };

  const downloadTemplate = () => {
    const url = `/api/forecasts/template?startMonth=${startMonth}`;
    window.location.href = url;
  };

  const handleExcelUpload = async () => {
    if (!excelFile || !previewData) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", excelFile);
    formData.append("months", JSON.stringify(previewData.months));
    formData.append("method", method);

    try {
      const res = await fetch("/api/excel/import/forecast-preview", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        if (json.overrides) {
          // Merge overrides
          setOverrides((prev) => {
            const next = { ...prev };
            Object.keys(json.overrides).forEach((code) => {
              if (!next[code]) next[code] = {};
              Object.assign(next[code], json.overrides[code]);
            });
            return next;
          });
        }
        setExcelModalOpen(false);
        setExcelFile(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  // Merge overrides into previewData for Step 3
  const mergedPreviewData = previewData ? { ...previewData } : null;
  if (mergedPreviewData && Object.keys(overrides).length > 0) {
    // We deep clone the tabs we are rendering to apply overrides to the UI
    mergedPreviewData.tabs = JSON.parse(JSON.stringify(previewData.tabs));
    
    Object.keys(mergedPreviewData.tabs).forEach((tabId: string) => {
      const tab = mergedPreviewData.tabs[tabId];
      tab.groups.forEach((g: any) => {
        if (g.children) {
          g.children.forEach((c: any) => {
            if (overrides[c.code]) {
              c.months = c.months.map((val: number, i: number) => {
                const mStr = mergedPreviewData.months[i];
                return overrides[c.code][mStr] !== undefined ? overrides[c.code][mStr] : val;
              });
            }
          });
        }
      });
    });
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => onOpenChange(false)}>
        <div 
          className="fixed left-[50%] top-[50%] z-50 w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] border bg-background shadow-lg sm:rounded-lg h-[85vh] flex flex-col p-0 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col space-y-1.5 p-6 border-b shrink-0 text-left">
            <h2 className="text-lg font-semibold leading-none tracking-tight">Create Forecast</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-[#FAFAFA] dark:bg-[#0A0A0A]">
            {step === 1 && (
              <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold">What month do you want it to start?</h2>
                  <p className="text-muted-foreground">Usually this is the first month of your financial year.</p>
                </div>
                
                <div className="bg-white dark:bg-[#111] p-6 rounded-xl border flex items-center justify-center">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <input 
                      type="month" 
                      value={startMonth}
                      onChange={(e) => setStartMonth(e.target.value)}
                      className="text-lg p-2 border rounded-md"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">This forecast will include:</p>
                  <div className="flex gap-2">
                    {["Sales", "Costs", "Expenses", "Other P&L", "Profit & Loss"].map(t => (
                      <div key={t} className="px-3 py-1.5 bg-white dark:bg-[#111] border rounded-md text-sm font-medium">
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold">How do you want to create it?</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: "scratch", title: "From scratch", icon: FileSpreadsheet, desc: "All periods start at 0" },
                    { id: "last-year", title: "Create from last year's actuals", icon: Calculator, desc: "Uses real historical data" },
                    { id: "auto", title: "Create with auto predictions", icon: Sparkles, desc: "3-month trailing average" }
                  ].map((opt) => {
                    const isSelected = method === opt.id;
                    const Icon = opt.icon;
                    return (
                      <div 
                        key={opt.id}
                        onClick={() => setMethod(opt.id as any)}
                        className={clsx(
                          "p-6 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center gap-3",
                          isSelected ? "border-emerald-500 ring-1 ring-emerald-500 bg-white dark:bg-[#111]" : "bg-white/50 dark:bg-[#111]/50 hover:border-emerald-500/50"
                        )}
                      >
                        <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center", isSelected ? "bg-emerald-100 text-emerald-600" : "bg-muted")}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{opt.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{opt.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="bg-white dark:bg-[#111] rounded-xl border overflow-hidden shadow-sm">
                  <div className="p-4 border-b bg-muted/20">
                    <h3 className="font-medium text-sm">Preview: Sales</h3>
                  </div>
                  <div className="p-4">
                    {isLoadingPreview || !previewData ? (
                      <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                    ) : (
                      <ForecastMonthTable 
                        title="Sales Preview"
                        months={previewData.months}
                        cashPosition={previewData.cashPosition}
                        summary={previewData.tabs.sales.summary}
                        groups={previewData.tabs.sales.groups}
                        onDaysToPayChange={() => {}}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between relative">
                  <h2 className="text-2xl font-semibold">Customise with your own predictions</h2>
                  
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <Sparkles className="w-4 h-4" />
                      New prediction
                    </button>
                    {dropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-black border rounded-md shadow-md z-10 overflow-hidden p-1">
                        <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-sm" onClick={() => setDropdownOpen(false)}>Manual prediction</button>
                        <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-sm" onClick={() => setDropdownOpen(false)}>Import template</button>
                        <button className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-sm" onClick={() => { setDropdownOpen(false); setExcelModalOpen(true); }}>Excel upload</button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 bg-white dark:bg-[#111] rounded-xl border overflow-hidden shadow-sm flex flex-col">
                   {isLoadingPreview || !mergedPreviewData ? (
                      <div className="flex-1 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                    ) : (
                      <div className="flex-1 overflow-y-auto p-4">
                        <ForecastMonthTable 
                          title="Profit & Loss"
                          months={mergedPreviewData.months}
                          cashPosition={mergedPreviewData.cashPosition}
                          summary={mergedPreviewData.tabs["profit-loss"].summary}
                          groups={[
                            ...mergedPreviewData.tabs.sales.groups,
                            ...mergedPreviewData.tabs.costs.groups,
                            ...mergedPreviewData.tabs.expenses.groups
                          ]}
                          onDaysToPayChange={() => {}}
                        />
                      </div>
                    )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="max-w-xl mx-auto text-center space-y-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircleIcon className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-semibold">You're ready to go!</h2>
                <p className="text-muted-foreground text-lg">
                  Get started with Futrix now. Your forecast is built and ready for review.
                </p>
                
                <div className="absolute -right-24 -top-8 text-emerald-500/50 hidden md:block">
                  <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-45">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                  <div className="text-sm font-medium absolute top-4 -right-12">Learn more here!</div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t flex justify-between shrink-0 bg-white dark:bg-black">
            <button 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              onClick={handleBack} 
              disabled={step === 1 || isCreating}
            >
              Back
            </button>
            {step < 4 ? (
              <button 
                onClick={handleNext} 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleCreate} 
                disabled={isCreating} 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Complete"} <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Excel Upload Modal */}
      {excelModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm" onClick={() => setExcelModalOpen(false)}>
          <div 
            className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] border bg-background shadow-lg sm:rounded-lg flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-1.5 p-6 border-b shrink-0 text-left">
              <h2 className="text-lg font-semibold leading-none tracking-tight">Upload a 1-year P&L budget</h2>
            </div>
            <div className="space-y-6 p-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Step 1: Download Template</h4>
                <p className="text-sm text-muted-foreground">Download the 1-year template below.</p>
                <button 
                  className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2" 
                  onClick={downloadTemplate}
                >
                  <Download className="w-4 h-4" /> 1-year P&L template.xlsx
                </button>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Step 2: Enter P&L data</h4>
                <p className="text-sm text-muted-foreground">Enter P&L data, following the import guidelines. Note: entered must be monthly.</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Step 3: Upload the updated file</h4>
                <div className="border-2 border-dashed rounded-xl p-8 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-full">
                      <Upload className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground mt-1">Max file size 25 MB</p>
                  </div>
                  <input 
                    type="file" 
                    accept=".xlsx" 
                    className="w-full text-sm" 
                    onChange={(e) => e.target.files && setExcelFile(e.target.files[0])}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t p-4 bg-white dark:bg-black">
              <button 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2" 
                onClick={() => setExcelModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                onClick={handleExcelUpload} 
                disabled={!excelFile || isUploading} 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CheckCircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

