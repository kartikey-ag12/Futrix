"use client";

import { useState } from "react";
import { ExcelUpload } from "@/components/excel/ExcelUpload";
import { Download, FileSpreadsheet, Activity } from "lucide-react";
import { useFinancial } from "@/context/FinancialContext";

export default function ExcelToolsPage() {
  const { handleXeroSync } = useFinancial();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/excel/export/invoices");
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const dateStr = new Date().toISOString().split('T')[0];
        a.download = `invoices_report_${dateStr}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Failed to export invoices.");
      }
    } catch (err) {
      console.error("Export error:", err);
      alert("An error occurred while exporting.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleUploadSuccess = (count: number) => {
    // Optionally trigger a sync with Xero to refresh dashboard data
    handleXeroSync();
  };

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-5xl">
      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-black text-foreground tracking-tight">Excel Tools</h1>
        <p className="text-sm text-foreground/50 mt-0.5">
          Import and export your financial data using Excel spreadsheets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Import Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-green-500" />
            Import Data
          </h2>
          <p className="text-sm text-foreground/60 mb-2">
            Upload an `.xlsx` file containing invoices. The system expects columns: <strong>Contact Name, Description, Date, Amount, Status</strong>.
            All valid invoices will be synced to your connected Xero account.
          </p>
          <ExcelUpload onSuccess={handleUploadSuccess} />
        </div>

        {/* Export & Actions Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-500" />
            Export Data
          </h2>
          <p className="text-sm text-foreground/60 mb-2">
            Download your current Xero invoices as a formatted Excel report.
          </p>
          
          <div className="p-6 bg-card border border-border rounded-2xl shadow-sm flex flex-col gap-4 items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Invoices Report</h4>
                <p className="text-xs text-foreground/50">Export all synced Xero invoices</p>
              </div>
            </div>
            
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="mt-2 px-5 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download .xlsx
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
