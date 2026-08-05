"use client";

import { Download, FileSpreadsheet } from "lucide-react";
import { useRef, useState } from "react";

interface DriversExcelUploadPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DriversExcelUploadPanel({ isOpen, onClose }: DriversExcelUploadPanelProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch('/api/drivers/export');
      if (!response.ok) {
        throw new Error('Failed to generate template');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "Drivers_Template.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading template:", error);
      // Optional: Add a toast notification here
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      onClose();
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white dark:bg-[#111] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e5e5e5] dark:border-white/10 bg-[#fcfcfc] dark:bg-[#1a1a1a]">
          <h2 className="text-2xl font-bold text-foreground">Upload Drivers from Excel</h2>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          
          {/* Step 1 */}
          <div className="mb-8">
            <h3 className="text-[15px] font-medium text-foreground mb-3">
              <strong>Step 1:</strong> Download the Excel template below.
            </h3>
            <button 
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 px-4 py-2 border border-emerald-500 rounded-full text-emerald-600 font-medium hover:bg-emerald-500/10 transition-colors bg-white dark:bg-[#1a1a1a]"
            >
              Drivers Template. xls
              <Download className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Step 2 */}
          <div className="mb-8">
            <h3 className="text-[15px] font-medium text-foreground/80 leading-relaxed">
              <strong>Step 2:</strong> Enter driver data, following the <a href="#" className="text-emerald-600 font-bold hover:underline">import guidelines</a>. Note: drivers can be stored daily: we will aggregate daily figures into the monthly amounts displayed on the Driver's page.
            </h3>
          </div>

          {/* Step 3 */}
          <div>
            <h3 className="text-[15px] font-medium text-foreground mb-4">
              <strong>Step 3:</strong> Upload the updated file in the box below.
            </h3>
            
            <label className="w-full border border-dashed border-[#e5e5e5] dark:border-white/20 rounded-lg p-10 flex flex-col items-center justify-center bg-white dark:bg-transparent cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors relative">
              <input 
                type="file" 
                accept=".csv,.xls,.xlsx" 
                className="hidden" 
                onChange={handleFileUpload}
                ref={fileInputRef}
                disabled={isUploading}
              />
              {isUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                  <span className="text-sm font-medium text-foreground">Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-4">
                  <div className="bg-[#666] text-white p-2 rounded flex items-center justify-center">
                    <FileSpreadsheet className="w-10 h-10" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-emerald-600 text-sm font-medium hover:underline underline-offset-2">Drop file here or click to upload</span>
                    <span className="text-xs text-foreground/50 mt-1">Max file size: 25 MB</span>
                  </div>
                </div>
              )}
            </label>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e5e5e5] dark:border-white/10 flex items-center justify-end bg-white dark:bg-[#111]">
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-emerald-500 text-emerald-600 dark:text-emerald-500 rounded-full text-sm font-bold hover:bg-emerald-500/10 transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </>
  );
}
