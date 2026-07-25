"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  ArrowRight,
  Zap,
  RefreshCcw,
  BarChart3,
  ShieldCheck,
  Clock,
  Star,
  ChevronDown,
  TrendingUp,
  FileText,
  Globe,
  DollarSign,
} from "lucide-react";


// ─── Data ─────────────────────────────────────────────────────────────────────

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Connect in one click",
    description:
      "Authorise Futrix to access your Xero account through Xero's secure OAuth2 flow. No passwords shared — ever.",
    icon: Zap,
    color: "bg-emerald-500",
  },
  {
    step: "02",
    title: "Automatic data sync",
    description:
      "Futrix pulls your invoices, bills, bank transactions, and chart of accounts from Xero in real time — keeping your dashboard always current.",
    icon: RefreshCcw,
    color: "bg-teal-500",
  },
  {
    step: "03",
    title: "Generate invoices inside Futrix",
    description:
      "Create and send professional invoices directly from the Futrix dashboard. They sync back to Xero automatically, so your books stay perfect.",
    icon: FileText,
    color: "bg-blue-500",
  },
  {
    step: "04",
    title: "Instant insights & forecasting",
    description:
      "Your Xero data powers Futrix's AI engine — delivering cash flow forecasts, P&L projections, and business health scores without any manual input.",
    icon: BarChart3,
    color: "bg-violet-500",
  },
];

const FEATURES = [
  {
    icon: RefreshCcw,
    title: "Live two-way sync",
    description: "Changes in Xero appear in Futrix within seconds, and invoices created in Futrix push straight back to Xero.",
  },
  {
    icon: ShieldCheck,
    title: "Bank-grade security",
    description: "All data is encrypted in transit and at rest. Futrix is an authorised Xero App Partner.",
  },
  {
    icon: TrendingUp,
    title: "AI-powered forecasting",
    description: "Futrix uses your Xero history to build 90-day cash flow, P&L, and Balance Sheet forecasts automatically.",
  },
  {
    icon: Globe,
    title: "Multi-currency support",
    description: "Futrix consolidates multi-currency Xero organisations and normalises exchange rates so you always see the big picture.",
  },
  {
    icon: DollarSign,
    title: "Invoice generation",
    description: "Draft, send, and track invoices from within Futrix. Every invoice syncs to Xero instantly — zero double-entry.",
  },
  {
    icon: Clock,
    title: "Historical import",
    description: "Import up to 3 years of Xero history on connection, so you get meaningful trends and forecasts from day one.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "We connected Futrix to Xero on a Monday morning and had a fully automated cash flow forecast by lunchtime. It's been a game-changer for our finance team.",
    author: "Sarah Mitchell",
    role: "CFO, Evergreen Retail Group",
    stars: 5,
  },
  {
    quote:
      "I used to spend three hours every Friday pulling data from Xero into spreadsheets. With Futrix, that's down to zero. The integration is seamless.",
    author: "James Okonkwo",
    role: "Finance Manager, Apex Digital",
    stars: 5,
  },
  {
    quote:
      "The invoice generation feature inside Futrix is brilliant. Our sales team creates invoices, they land in Xero, and our accountant never has to chase anyone. Perfect.",
    author: "Priya Sharma",
    role: "Director, Clover Advisory",
    stars: 5,
  },
  {
    quote:
      "We run eight entities across four currencies. Futrix consolidates everything from Xero in seconds. We couldn't operate without it.",
    author: "Thomas Brennan",
    role: "Group Finance Director, Titan Holdings",
    stars: 5,
  },
];

const FAQS = [
  {
    q: "Do I need a Xero account to use Futrix?",
    a: "Yes — the Xero integration is currently our primary data source. We also support Tally for Indian businesses, with more integrations coming soon.",
  },
  {
    q: "Is the connection secure?",
    a: "Absolutely. Futrix uses Xero's official OAuth2 protocol, meaning you authorise access through Xero's own login screen and we never see your password.",
  },
  {
    q: "Can I disconnect Xero at any time?",
    a: "Yes. You can revoke Futrix's access from your Xero account settings or from the Futrix Settings → Integrations page at any time.",
  },
  {
    q: "How often does Futrix sync with Xero?",
    a: "By default, Futrix syncs automatically every hour. You can also trigger a manual sync from the dashboard at any time.",
  },
  {
    q: "Does it work with multiple Xero organisations?",
    a: "Yes — Futrix supports multi-entity consolidation. Connect multiple Xero orgs and view them individually or as a consolidated group.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-800 text-sm sm:text-base">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ml-4 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100">
          <p className="pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function XeroIntegrationPage() {
  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900 pt-20 pb-32">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Xero × Futrix badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-8">
            <span className="text-white font-black text-xl">X</span>
            <span className="text-white/60 text-lg">×</span>
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-md flex items-center justify-center">
              <span className="text-white font-black text-xs">F</span>
            </div>
            <span className="text-white/80 text-sm font-medium">Official Integration</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Futrix × Xero:
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              your finances, automated
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-lg sm:text-xl leading-relaxed mb-10">
            Connect Xero to Futrix in one click and get live cash flow forecasts, automated
            reporting, and invoice generation — all without leaving your dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/api/xero/connect"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-emerald-500/40 hover:shadow-xl"
            >
              <Zap className="w-5 h-5" />
              Connect Xero now
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-200"
            >
              View dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Social proof strip */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-slate-400 text-sm">
            {[
              "🔒 OAuth2 secure",
              "⚡ Live sync",
              "📊 AI forecasting",
              "🌐 Multi-currency",
            ].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats banner ── */}
      <section className="bg-emerald-600 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-white">
            {[
              { value: "2,400+", label: "businesses connected" },
              { value: "< 60s", label: "to connect Xero" },
              { value: "99.9%", label: "uptime SLA" },
              { value: "3 yrs", label: "history imported" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl font-black">{stat.value}</p>
                <p className="text-emerald-100 text-xs sm:text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
              How it works
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              From Xero to insights in minutes
            </h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto">
              No engineers, no spreadsheets, no waiting. Just connect and go.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {HOW_IT_WORKS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.step}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className={`${step.color} p-3 rounded-xl text-white flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Step {step.step}
                      </span>
                      <h3 className="text-lg font-bold text-slate-800 mt-1">{step.title}</h3>
                      <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-teal-100 text-teal-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
              What you get
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              Everything your Xero data can do — supercharged
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group p-6 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:bg-emerald-100 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-emerald-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-emerald-300 text-xs font-semibold uppercase tracking-wider rounded-full mb-4 border border-white/10">
              Customer stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Why customers love Futrix × Xero
            </h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto">
              Join thousands of businesses that have automated their financial workflow.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-200 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {t.author[0]}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.author}</p>
                    <p className="text-slate-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Aggregate rating */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 border border-white/20 rounded-full">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-white font-semibold text-sm">4.9 / 5</span>
              <span className="text-slate-400 text-sm">from 320+ reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Checklist ── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
                Before & after
              </span>
              <h2 className="text-3xl font-black text-slate-900 mb-6">
                Stop living in spreadsheets
              </h2>
              <div className="space-y-4">
                {[
                  "No more manual CSV exports from Xero",
                  "No more copy-pasting into spreadsheets",
                  "No more waiting for month-end reports",
                  "No more chasing the team for invoice status",
                  "No more guessing your cash position",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100">
              <div className="space-y-4">
                {[
                  { label: "Hours saved per month", value: "12 hrs" },
                  { label: "Forecast accuracy", value: "94%" },
                  { label: "Sync delay", value: "< 60s" },
                  { label: "Manual data entry", value: "0" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-3 border-b border-emerald-100 last:border-0"
                  >
                    <span className="text-slate-600 text-sm">{item.label}</span>
                    <span className="text-emerald-700 font-black text-lg">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900">Frequently asked questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to automate your Xero workflow?
          </h2>
          <p className="text-emerald-100 text-lg mb-10">
            Connect Xero to Futrix in under 60 seconds. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/api/xero/connect"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Zap className="w-5 h-5" />
              Connect Xero — it&apos;s free
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all duration-200"
            >
              Go to dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
