"use client";

import { useState } from "react";
import { X, CheckCircle2, RefreshCcw, Server, Building2, ExternalLink, ShieldCheck } from "lucide-react";

interface TallyConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (companyName: string) => void;
}

export function TallyConnectModal({ isOpen, onClose, onSuccess }: TallyConnectModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [serverUrl, setServerUrl] = useState("http://localhost:9000");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) {
      setError("Please enter your Tally company name");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const res = await fetch("/api/tally/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, serverUrl }),
      });

      const data = await res.json();
      if (res.ok) {
        onSuccess(companyName);
        onClose();
      } else {
        setError(data.error || "Failed to connect to TallyPrime");
      }
    } catch (err) {
      console.error(err);
      setError("Network error connecting to Tally server");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative">
        
        {/* Top Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />

        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-orange-500/15 border border-orange-500/30 rounded-2xl flex items-center justify-center text-orange-400 font-black text-xl">
              T
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Connect TallyPrime</h3>
              <p className="text-xs text-slate-400">Sync ledgers, vouchers, and cash flow</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleConnect} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Tally Company Name
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme India Pvt Ltd"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Tally Server URL / Port
            </label>
            <div className="relative">
              <Server className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="http://localhost:9000"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          {/* Setup Guide */}
          <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">How to enable Tally HTTP Server:</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <ol className="text-xs text-slate-400 space-y-1.5 list-decimal pl-4 leading-relaxed">
              <li>Open <strong>TallyPrime</strong> on your computer.</li>
              <li>Press <code className="bg-slate-800 px-1 py-0.5 rounded text-orange-300">F12: Configure</code> → <strong>Advanced Configuration</strong>.</li>
              <li>Set <strong>Enable ODBC / HTTP Server</strong> to <strong className="text-white">Yes</strong> and Port to <strong className="text-white">9000</strong>.</li>
              <li>Open your company in Tally and click <strong>Test & Connect</strong> below.</li>
            </ol>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isConnecting}
              className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold rounded-xl text-sm hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-orange-500/20"
            >
              {isConnecting && <RefreshCcw className="w-4 h-4 animate-spin" />}
              {isConnecting ? "Connecting..." : "Test & Connect Tally"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
