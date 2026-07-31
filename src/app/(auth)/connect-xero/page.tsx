"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Zap,
  ArrowRight,
  CheckCircle2,
  Building2,
  BarChart3,
  FileText,
  Lock,
  RefreshCcw,
} from "lucide-react";

const FEATURES = [
  { icon: BarChart3, title: "Real-time Financial Insights", desc: "Live revenue, expenses, and profit tracking from your Xero ledger." },
  { icon: FileText, title: "Invoice Management", desc: "Sync, view, and export all your Xero invoices in one place." },
  { icon: Building2, title: "Your Workspace, Auto-created", desc: "We use your Xero company name to set up your Futrix workspace instantly." },
  { icon: Lock, title: "Secure by Default", desc: "OAuth 2.0 — your credentials never touch Futrix servers." },
];

export default function ConnectXeroPage() {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
    setIsConnecting(true);
    // Navigate to the API route which builds the Xero OAuth consent URL
    window.location.href = "/api/xero/connect";
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">
          {/* Top gradient bar */}
          <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

          <div className="p-8">
            {/* Logo + Brand */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">Futrix</span>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Connect your Xero company
              </h1>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Futrix uses your real Xero organisation to power your financial dashboard.
                This one-time step sets up your private workspace automatically.
              </p>
            </div>

            {/* Feature list */}
            <ul className="space-y-3 mb-8">
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <li key={title} className="flex items-start gap-3">
                  <div className="mt-0.5 w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-foreground/50 mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* OAuth notice */}
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-foreground/[0.03] border border-border mb-6 text-xs text-foreground/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>
                You'll be redirected to Xero to authorise Futrix. We only request read access
                to invoices and accounting settings — we never store your Xero password.
              </span>
            </div>

            {/* CTA Button */}
            <button
              id="connect-xero-btn"
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-semibold text-sm transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
            >
              {isConnecting ? (
                <>
                  <RefreshCcw className="w-4 h-4 animate-spin" />
                  Redirecting to Xero…
                </>
              ) : (
                <>
                  <svg viewBox="0 0 60 60" className="w-4 h-4 flex-shrink-0" fill="none">
                    <circle cx="30" cy="30" r="30" fill="white" />
                    <path d="M30 12C20.06 12 12 20.06 12 30C12 39.94 20.06 48 30 48C39.94 48 48 39.94 48 30C48 20.06 39.94 12 30 12ZM30 44C22.27 44 16 37.73 16 30C16 22.27 22.27 16 30 16C37.73 16 44 22.27 44 30C44 37.73 37.73 44 30 44Z" fill="#00B5E8" />
                    <path d="M38 24H34L30 36L26 24H22L28 40H32L38 24Z" fill="#00B5E8" />
                  </svg>
                  Connect Xero Company
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-foreground/40 mt-4">
              Already connected?{" "}
              <Link href="/dashboard" className="text-primary hover:underline">
                Go to dashboard
              </Link>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-foreground/30 mt-5">
          Futrix uses Xero OAuth 2.0. Your Xero credentials are never shared with us.
        </p>
      </div>
    </div>
  );
}
