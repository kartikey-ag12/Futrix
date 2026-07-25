"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CheckCircle2,
  X,
  ArrowRight,
  Star,
  ChevronDown,
  Zap,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 49,
    annualPrice: 39,
    description: "Perfect for sole traders and early-stage businesses that want to understand their numbers.",
    cta: "Start free trial",
    href: "/signup",
    highlight: false,
    badge: null,
    features: [
      "1 Xero organisation",
      "Live dashboard & KPIs",
      "Cash flow forecasting (30 days)",
      "3 custom reports",
      "Invoice generation",
      "Email support",
    ],
    notIncluded: [
      "Multi-entity consolidations",
      "AI financial insights",
      "Unlimited custom reports",
      "Priority support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    monthlyPrice: 149,
    annualPrice: 119,
    description: "For growing businesses that need advanced forecasting, reporting, and multi-entity views.",
    cta: "Start free trial",
    href: "/signup",
    highlight: true,
    badge: "Most popular",
    features: [
      "Up to 5 Xero organisations",
      "Live dashboard & KPIs",
      "Cash flow forecasting (90 days)",
      "Unlimited custom reports",
      "Invoice generation",
      "Multi-currency consolidations",
      "AI financial insights & alerts",
      "Scheduled report delivery",
      "Priority email & chat support",
    ],
    notIncluded: [
      "Unlimited Xero organisations",
      "Dedicated account manager",
    ],
  },
  {
    id: "practice",
    name: "Practice",
    monthlyPrice: 299,
    annualPrice: 239,
    description: "Built for accountants, CFOs, and finance teams managing multiple clients or group entities.",
    cta: "Talk to sales",
    href: "/signup",
    highlight: false,
    badge: "Best for advisors",
    features: [
      "Unlimited Xero organisations",
      "Live dashboard & KPIs",
      "Cash flow forecasting (90 days)",
      "Unlimited custom reports",
      "Invoice generation",
      "Multi-currency consolidations",
      "AI financial insights & alerts",
      "Scheduled report delivery",
      "White-label client dashboards",
      "Dedicated account manager",
      "Phone & priority support",
      "Custom onboarding",
    ],
    notIncluded: [],
  },
];

const COMPARE_ROWS = [
  { feature: "Xero organisations", starter: "1", professional: "Up to 5", practice: "Unlimited" },
  { feature: "Cash flow forecast horizon", starter: "30 days", professional: "90 days", practice: "90 days" },
  { feature: "Custom reports", starter: "3", professional: "Unlimited", practice: "Unlimited" },
  { feature: "Invoice generation", starter: true, professional: true, practice: true },
  { feature: "Multi-currency consolidations", starter: false, professional: true, practice: true },
  { feature: "AI insights & alerts", starter: false, professional: true, practice: true },
  { feature: "Scheduled report delivery", starter: false, professional: true, practice: true },
  { feature: "White-label client dashboards", starter: false, professional: false, practice: true },
  { feature: "Dedicated account manager", starter: false, professional: false, practice: true },
  { feature: "Support", starter: "Email", professional: "Priority email & chat", practice: "Phone & priority" },
];

const FAQ_ITEMS = [
  {
    q: "Is there really no credit card needed for the trial?",
    a: "Correct. You get 14 days completely free with full access to your chosen plan. No card, no commitment. If you decide Futrix isn't right for you, just let your trial expire.",
  },
  {
    q: "Can I change plans at any time?",
    a: "Yes. Upgrade or downgrade at any time from your account settings. Upgrades take effect immediately. Downgrades take effect at the end of your current billing period.",
  },
  {
    q: "What counts as a 'Xero organisation'?",
    a: "Each separate Xero account (or 'organisation') you connect counts as one. If you run three separate companies each with their own Xero account, that's three organisations.",
  },
  {
    q: "Do you offer discounts for accountants or advisors?",
    a: "Yes — our Practice plan is designed for accountants and advisors managing multiple clients. Contact us for volume pricing if you manage more than 10 clients.",
  },
  {
    q: "What happens at the end of my free trial?",
    a: "You'll be prompted to enter payment details and choose a plan. Your data, reports, and settings are preserved regardless of which plan you choose.",
  },
  {
    q: "Is there a contract or minimum term?",
    a: "No. All plans are month-to-month by default. Annual billing is available at a discount with no penalty for early cancellation (we'll refund unused months).",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-800">{q}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ml-4 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) return <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />;
  if (value === false) return <X className="w-5 h-5 text-slate-300 mx-auto" />;
  return <span className="text-sm text-slate-700 text-center block">{value}</span>;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-32 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" /> 14 days free on every plan
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-slate-300 text-xl mb-4 max-w-2xl mx-auto">
            No credit card. No hidden fees. No long-term contracts. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 mt-6 bg-white/10 border border-white/15 rounded-full p-1.5">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${!annual ? "bg-white text-slate-900 shadow-sm" : "text-slate-300 hover:text-white"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${annual ? "bg-white text-slate-900 shadow-sm" : "text-slate-300 hover:text-white"}`}
            >
              Annual
              <span className="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-bold rounded-full">Save 20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Pricing cards ── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6 -mt-20">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl overflow-hidden flex flex-col ${
                  plan.highlight
                    ? "bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-2xl shadow-emerald-500/30 ring-4 ring-emerald-400/30 scale-105"
                    : "bg-white border border-slate-200 shadow-sm"
                }`}
              >
                {plan.badge && (
                  <div className={`px-4 py-2 text-center text-xs font-bold uppercase tracking-wider ${plan.highlight ? "bg-white/15" : "bg-slate-900 text-white"}`}>
                    {plan.badge}
                  </div>
                )}

                <div className="p-8 flex-1 flex flex-col">
                  <h2 className={`text-xl font-black mb-1 ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                    {plan.name}
                  </h2>
                  <p className={`text-sm mb-6 leading-relaxed ${plan.highlight ? "text-emerald-100" : "text-slate-500"}`}>
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-end gap-1">
                      <span className={`text-5xl font-black ${plan.highlight ? "text-white" : "text-slate-900"}`}>
                        ${annual ? plan.annualPrice : plan.monthlyPrice}
                      </span>
                      <span className={`text-sm mb-2 ${plan.highlight ? "text-emerald-200" : "text-slate-400"}`}>/mo</span>
                    </div>
                    {annual && (
                      <p className={`text-xs mt-1 ${plan.highlight ? "text-emerald-200" : "text-slate-400"}`}>
                        Billed annually (${annual ? plan.annualPrice * 12 : plan.monthlyPrice * 12}/yr)
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={plan.href}
                    className={`block text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all mb-8 ${
                      plan.highlight
                        ? "bg-white text-emerald-700 hover:bg-emerald-50 shadow-sm"
                        : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  {/* Features */}
                  <ul className="space-y-3 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-emerald-200" : "text-emerald-500"}`} />
                        <span className={`text-sm ${plan.highlight ? "text-emerald-50" : "text-slate-700"}`}>{f}</span>
                      </li>
                    ))}
                    {plan.notIncluded.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <X className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlight ? "text-emerald-400/50" : "text-slate-300"}`} />
                        <span className={`text-sm ${plan.highlight ? "text-emerald-200/50" : "text-slate-400"}`}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-slate-400 text-sm mt-8">
            All prices in USD. 14-day free trial on every plan. No credit card required.
          </p>
        </div>
      </section>

      {/* ── Trustpilot-style strip ── */}
      <section className="py-10 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-8">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-bold text-slate-800">4.9 / 5</span>
            <span className="text-slate-400 text-sm">from 320+ reviews</span>
          </div>
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />
          <p className="text-slate-500 text-sm">&ldquo;The best investment our finance team made this year.&rdquo;</p>
        </div>
      </section>

      {/* ── Comparison table ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 text-center mb-12">
            Compare all features
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50">
              <div className="px-6 py-4 text-sm font-semibold text-slate-500">Feature</div>
              {PLANS.map((p) => (
                <div key={p.id} className={`px-4 py-4 text-sm font-bold text-center ${p.highlight ? "text-emerald-600" : "text-slate-800"}`}>
                  {p.name}
                </div>
              ))}
            </div>
            {/* Rows */}
            {COMPARE_ROWS.map((row, i) => (
              <div key={row.feature} className={`grid grid-cols-4 border-b border-slate-100 last:border-0 ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}>
                <div className="px-6 py-4 text-sm text-slate-700 font-medium flex items-center">{row.feature}</div>
                <div className="px-4 py-4 flex items-center justify-center"><CellValue value={row.starter} /></div>
                <div className="px-4 py-4 flex items-center justify-center bg-emerald-50/40"><CellValue value={row.professional} /></div>
                <div className="px-4 py-4 flex items-center justify-center"><CellValue value={row.practice} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 text-center mb-12">
            Pricing questions, answered
          </h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Start your 14-day free trial today
          </h2>
          <p className="text-emerald-100 text-lg mb-10">
            No credit card. No setup fee. Full access from day one.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-all shadow-lg">
              Get started free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/product" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all">
              View product overview
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
