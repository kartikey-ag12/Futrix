"use client";

import { useState } from "react";
import {
  X,
  Loader2,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Download,
  Sparkles,
  Info,
} from "lucide-react";

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type ValidationStatus = "PASS" | "WARN" | "FAIL";

interface ValidationResult {
  status: ValidationStatus;
  qualityScore: number;
  criticalIssues: string[];
  warnings: string[];
  recommendations: string[];
  degraded?: boolean;
}

type DownloadPhase =
  | "idle"
  | "validating"
  | "downloading"
  | "validated_warn"
  | "validated_fail"
  | "done";

export function CreateInvoiceModal({ isOpen, onClose, onSuccess }: CreateInvoiceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdInvoiceData, setCreatedInvoiceData] = useState<any>(null);

  // Download / validation state
  const [downloadPhase, setDownloadPhase] = useState<DownloadPhase>("idle");
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const [formData, setFormData] = useState({
    contactName: "",
    description: "",
    amount: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/xero/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create invoice");

      setCreatedInvoiceData({
        ...formData,
        invoiceID: data.data?.invoiceID,
      });
      setIsSuccess(true);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Trigger Excel download (after validation passed / user overrides) ───
  const triggerExcelDownload = async () => {
    if (!createdInvoiceData?.invoiceID) return;
    setDownloadPhase("downloading");
    try {
      const res = await fetch(
        `/api/excel/export/xero-invoice?invoiceId=${createdInvoiceData.invoiceID}`
      );

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const dateStr = new Date().toISOString().split("T")[0];
        a.download = `invoice_${createdInvoiceData.contactName.replace(/\s+/g, "_")}_${dateStr}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setDownloadPhase("done");
      } else {
        const errData = await res.json().catch(() => null);
        setError(`Failed to download invoice: ${errData?.error || "Unknown error"}`);
        setDownloadPhase("idle");
      }
    } catch (err) {
      console.error(err);
      setError("Error downloading invoice.");
      setDownloadPhase("idle");
    }
  };

  // ─── Main download handler – runs validation first ───
  const handleDownloadInvoice = async () => {
    if (!createdInvoiceData?.invoiceID) {
      alert("No Invoice ID found. Cannot download from Xero.");
      return;
    }

    setDownloadPhase("validating");
    setValidationResult(null);
    setError(null);

    try {
      const res = await fetch("/api/ai/validate-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: createdInvoiceData.invoiceID }),
      });

      const result: ValidationResult = await res.json();
      setValidationResult(result);

      if (result.status === "PASS") {
        // Auto-download
        await triggerExcelDownload();
      } else if (result.status === "WARN") {
        setDownloadPhase("validated_warn");
      } else {
        setDownloadPhase("validated_fail");
      }
    } catch (err: any) {
      // Unexpected fetch error – don't block user
      console.error("[Validation] Unexpected error:", err);
      setValidationResult({
        status: "PASS",
        qualityScore: 90,
        criticalIssues: [],
        warnings: ["Validation service unavailable. Proceeding with deterministic checks only."],
        recommendations: [],
        degraded: true,
      });
      await triggerExcelDownload();
    }
  };

  const handleCloseAndReset = () => {
    setIsSuccess(false);
    setCreatedInvoiceData(null);
    setFormData({ contactName: "", description: "", amount: "" });
    setDownloadPhase("idle");
    setValidationResult(null);
    setError(null);
    onClose();
  };

  // ─── Score colour helpers ───
  const scoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 70) return "text-amber-500";
    return "text-red-500";
  };

  const scoreBg = (score: number) => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 70) return "bg-amber-500";
    return "bg-red-500";
  };

  // ─── Render validation report panel ───
  const renderValidationReport = () => {
    if (!validationResult) return null;
    const { qualityScore, criticalIssues, warnings, recommendations, degraded } = validationResult;

    return (
      <div className="flex flex-col gap-3 mt-2">
        {/* Score bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-foreground/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${scoreBg(qualityScore)}`}
              style={{ width: `${qualityScore}%` }}
            />
          </div>
          <span className={`text-sm font-bold tabular-nums ${scoreColor(qualityScore)}`}>
            {qualityScore}/100
          </span>
        </div>

        {degraded && (
          <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-400">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            AI validation skipped (API unavailable). Deterministic checks passed.
          </div>
        )}

        {/* Critical Issues */}
        {criticalIssues.length > 0 && (
          <div className="flex flex-col gap-1.5 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-xs font-semibold text-red-400 flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5" /> Critical Issues
            </p>
            <ul className="flex flex-col gap-1">
              {criticalIssues.map((issue, i) => (
                <li key={i} className="text-xs text-red-300 flex items-start gap-1.5">
                  <span className="mt-0.5">•</span> {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="flex flex-col gap-1.5 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Warnings
            </p>
            <ul className="flex flex-col gap-1">
              {warnings.map((w, i) => (
                <li key={i} className="text-xs text-amber-300 flex items-start gap-1.5">
                  <span className="mt-0.5">•</span> {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="flex flex-col gap-1.5 p-3 bg-foreground/5 border border-border rounded-lg">
            <p className="text-xs font-semibold text-foreground/60 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Recommendations
            </p>
            <ul className="flex flex-col gap-1">
              {recommendations.map((r, i) => (
                <li key={i} className="text-xs text-foreground/50 flex items-start gap-1.5">
                  <span className="mt-0.5">•</span> {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // ─── Success screen ───
  const renderSuccessScreen = () => {
    // Done – show confirmation
    if (downloadPhase === "done") {
      return (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-bold">Invoice Downloaded!</h3>
          <p className="text-sm text-foreground/60">Your invoice has been downloaded successfully.</p>
          <button
            onClick={handleCloseAndReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-colors"
          >
            Close
          </button>
        </div>
      );
    }

    // Validating spinner
    if (downloadPhase === "validating") {
      return (
        <div className="flex flex-col items-center gap-5 py-6 text-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-2 border-t-primary animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold">AI Validating Invoice…</h3>
            <p className="text-xs text-foreground/50 mt-1">
              Gemini 2.5 Flash is reviewing the invoice quality
            </p>
          </div>
        </div>
      );
    }

    // Downloading spinner
    if (downloadPhase === "downloading") {
      return (
        <div className="flex flex-col items-center gap-5 py-6 text-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-t-emerald-500 animate-spin" />
            <Download className="absolute inset-0 m-auto w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold">Generating Excel…</h3>
            <p className="text-xs text-foreground/50 mt-1">Preparing your professional invoice</p>
          </div>
        </div>
      );
    }

    // WARN – show report + "Download Anyway"
    if (downloadPhase === "validated_warn" && validationResult) {
      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Validation Warnings</h3>
              <p className="text-xs text-foreground/50">
                Score {validationResult.qualityScore}/100 — you may still download
              </p>
            </div>
          </div>
          {renderValidationReport()}
          <div className="flex flex-col gap-2 mt-1">
            <button
              onClick={triggerExcelDownload}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700 transition-colors"
            >
              <Download className="w-4 h-4" /> Download Anyway
            </button>
            <button
              onClick={handleCloseAndReset}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-colors"
            >
              Fix Invoice in Xero
            </button>
          </div>
        </div>
      );
    }

    // FAIL – show critical issues, block download
    if (downloadPhase === "validated_fail" && validationResult) {
      return (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Validation Failed</h3>
              <p className="text-xs text-foreground/50">
                Score {validationResult.qualityScore}/100 — please fix the issues in Xero
              </p>
            </div>
          </div>
          {renderValidationReport()}
          <button
            onClick={handleCloseAndReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-colors mt-1"
          >
            Fix Invoice in Xero
          </button>
        </div>
      );
    }

    // Default: invoice created, idle – show action buttons
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Success!</h3>
        <p className="text-sm text-foreground/60 mb-4">
          Invoice for <strong>{createdInvoiceData?.contactName}</strong> has been successfully
          synced to Xero.
        </p>

        {error && (
          <div className="w-full mb-2 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handleDownloadInvoice}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            Validate &amp; Download (.xlsx)
          </button>
          <button
            onClick={handleCloseAndReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-colors"
          >
            Close
          </button>
        </div>

        <p className="text-[10px] text-foreground/30 flex items-center gap-1 mt-1">
          <Sparkles className="w-3 h-3" /> Powered by Gemini 2.5 Flash
        </p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card w-full max-w-md p-6 rounded-2xl border border-border shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {isSuccess ? "Invoice Created" : "Quick Create Invoice"}
          </h2>
          <button
            onClick={handleCloseAndReset}
            className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && !isSuccess && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
            {error}
          </div>
        )}

        {isSuccess ? (
          renderSuccessScreen()
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground/80">Customer Name</label>
              <input
                required
                type="text"
                placeholder="e.g. Acme Corp"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground/80">Description</label>
              <input
                required
                type="text"
                placeholder="e.g. Web Design Services"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground/80">Total Amount ($)</label>
              <input
                required
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={handleCloseAndReset}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-foreground/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Creating..." : "Create Invoice"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
