"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2, RefreshCcw, ArrowRight, Shield, Zap, Layers,
  Server, Building2, HelpCircle
} from "lucide-react";
import { TallyConnectModal } from "@/components/dashboard/TallyConnectModal";

export default function TallyIntegrationPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connectedCompany, setConnectedCompany] = useState<string | null>(null);

  return (
    <div className="bg-white text-slate-900 min-h-screen font-sans">
      {/* ── Hero Section ── */}
      <section className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-24 pb-20 px-6 lg:px-12 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            TallyPrime + Futrix Sync
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
            Seamless TallyPrime Integration for <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400">
              Indian Financial Intelligence
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Connect your TallyPrime company ledgers, vouchers, and GST reports to Futrix.
            Get automated 90-day cash flow forecasts, AI insights, and board-ready reporting in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-base rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              {connectedCompany ? `Connected: ${connectedCompany}` : "Connect TallyPrime Now"}
            </button>

            <Link
              href="/settings"
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 border border-slate-700 text-white font-semibold text-base rounded-2xl hover:bg-slate-700 transition-all text-center"
            >
              Integration Settings
            </Link>
          </div>
        </div>
      </section>

      {/* ── Key Features ── */}
      <section className="py-20 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Why Connect TallyPrime to Futrix?
          </h2>
          <p className="text-slate-600 mt-2 text-lg">
            Automated synchronization for ledgers, GST vouchers, and multi-entity consolidation.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-xl mb-6">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">HTTP XML Sync</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Connect directly to your local TallyPrime server (Port 9000). Zero manual data entry required.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xl mb-6">
              <RefreshCcw className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Daily Cash Flow</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Transform static Tally Daybook vouchers into interactive 90-day rolling cash flow projections.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xl mb-6">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Multi-Currency Consolidation</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Merge Tally Indian Rupees (INR) with international Xero entities (USD, GBP, EUR) seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Modal */}
      <TallyConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(company) => setConnectedCompany(company)}
      />
    </div>
  );
}
