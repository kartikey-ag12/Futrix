"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileSpreadsheet, Loader2, CheckCircle, AlertCircle } from "lucide-react";

export function ExcelUpload({ onSuccess }: { onSuccess?: (count: number) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.name.endsWith(".xlsx")) {
        setFile(selected);
        setError(null);
        setSuccessMsg(null);
      } else {
        setError("Please select a valid .xlsx file");
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/excel/import/invoices", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg(data.message);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (onSuccess) onSuccess(data.count);
      } else {
        setError(data.error || "Failed to upload file");
      }
    } catch (err) {
      setError("An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-card border border-border rounded-2xl shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">Import Invoices via Excel</h3>
      
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
          file ? "border-green-500 bg-green-500/5" : "border-border hover:border-primary/50 hover:bg-foreground/[0.02]"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
          accept=".xlsx" 
          className="hidden" 
        />
        
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <FileSpreadsheet className="w-10 h-10 text-green-500" />
            <p className="text-sm font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-foreground/50">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <UploadCloud className="w-10 h-10 text-foreground/40" />
            <p className="text-sm font-medium text-foreground">Click to select or drag and drop</p>
            <p className="text-xs text-foreground/50">.xlsx files only</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {successMsg && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-green-700">{successMsg}</p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        className="w-full mt-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading...
          </>
        ) : (
          "Upload & Import"
        )}
      </button>
    </div>
  );
}
