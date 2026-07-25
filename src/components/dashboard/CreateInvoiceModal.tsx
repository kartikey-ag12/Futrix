"use client";

import { useState } from "react";
import { X, Loader2, CheckCircle2, FileSpreadsheet } from "lucide-react";

interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateInvoiceModal({ isOpen, onClose, onSuccess }: CreateInvoiceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdInvoiceData, setCreatedInvoiceData] = useState<any>(null);

  const [formData, setFormData] = useState({
    contactName: "",
    description: "",
    amount: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/xero/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create invoice");
      
      setCreatedInvoiceData(formData);
      setIsSuccess(true);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (!createdInvoiceData) return;
    try {
      const res = await fetch("/api/excel/export/single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: createdInvoiceData.contactName, 
          description: createdInvoiceData.description,
          amount: Math.abs(parseFloat(createdInvoiceData.amount)),
          date: new Date().toISOString().split('T')[0],
          status: "DRAFT",
        })
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const dateStr = new Date().toISOString().split('T')[0];
        a.download = `invoice_${createdInvoiceData.contactName.replace(/\s+/g, '_')}_${dateStr}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Failed to download invoice.");
      }
    } catch (err) {
      console.error(err);
      alert("Error downloading invoice.");
    }
  };

  const handleCloseAndReset = () => {
    setIsSuccess(false);
    setCreatedInvoiceData(null);
    setFormData({ contactName: "", description: "", amount: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card w-full max-w-md p-6 rounded-2xl border border-border shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{isSuccess ? "Invoice Created" : "Quick Create Invoice"}</h2>
          <button onClick={handleCloseAndReset} className="p-2 hover:bg-foreground/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
            {error}
          </div>
        )}

        {isSuccess ? (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Success!</h3>
            <p className="text-sm text-foreground/60 mb-4">
              Invoice for <strong>{createdInvoiceData?.contactName}</strong> has been successfully synced to Xero.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={handleDownloadInvoice}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Download Invoice (.xlsx)
              </button>
              <button
                onClick={handleCloseAndReset}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground/80">Customer Name</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Acme Corp" 
                value={formData.contactName}
                onChange={e => setFormData({...formData, contactName: e.target.value})}
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
                onChange={e => setFormData({...formData, description: e.target.value})}
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
                onChange={e => setFormData({...formData, amount: e.target.value})}
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
