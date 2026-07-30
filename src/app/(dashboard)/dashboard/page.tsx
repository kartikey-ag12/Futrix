/**
 * Dashboard Page — SERVER COMPONENT
 *
 * No "use client" directive here.
 * Static sections (About, Marquee) render as zero-JS HTML on the server.
 * Only DashboardClient and ReviewsCarousel are client islands.
 */
import DashboardClient from "@/components/dashboard/DashboardClient";
import ReviewsCarousel from "@/components/dashboard/ReviewsCarousel";
import { RefreshCcw, TrendingUp, Layers, Shield } from "lucide-react";

// ── Static data lives in the server bundle, never shipped to the browser ────
const LOGO_PARTNERS = [
  { name: "Xero Verified Partner", icon: "X", color: "text-[#1AB4D7]" },
  { name: "Trustpilot 4.9/5 Rating", icon: "★", color: "text-emerald-500" },
  { name: "QuickBooks Online Sync", icon: "QB", color: "text-emerald-600" },
  { name: "Sage Integration", icon: "S", color: "text-green-500" },
  { name: "TallyPrime Enterprise", icon: "T", color: "text-orange-500" },
  { name: "SOC-2 Type II Certified", icon: "🔒", color: "text-slate-400" },
];

const ABOUT_PILLARS = [
  {
    Icon: RefreshCcw,
    title: "100% Automated Data Sync",
    desc: "Connect Xero or Tally and eliminate manual data entry. Your invoices, bills, and bank ledgers stay synced every hour automatically.",
    color: "text-emerald-500",
  },
  {
    Icon: TrendingUp,
    title: "90-Day Rolling Forecasts",
    desc: "Predict cash inflows and outflows out to 90 days. Models P&L, Balance Sheet, and daily cash balances based on actual customer payment velocity.",
    color: "text-blue-500",
  },
  {
    Icon: Layers,
    title: "Multi-Currency Consolidations",
    desc: "Merge multiple business entities and international currencies in seconds. Get unified group reporting with intercompany elimination.",
    color: "text-violet-500",
  },
  {
    Icon: Shield,
    title: "Bank-Grade Security",
    desc: "Your data is encrypted end-to-end. Official OAuth2 protocol authorization ensures we never see or store your accounting password.",
    color: "text-amber-500",
  },
];

export default function DashboardPage() {
  // Double the partners list for the infinite marquee (done server-side — no client JS)
  const doubledPartners = [...LOGO_PARTNERS, ...LOGO_PARTNERS];

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/*
       * ── CLIENT ISLAND 1: DashboardClient ───────────────────────────────────
       * All interactive/data-driven sections:
       *   Header, Sync button, New Invoice button, Integration banners,
       *   KPI cards, Revenue chart, Cash flow chart, AI Insights, Modal
       */}
      <DashboardClient />

      {/* ── SERVER-RENDERED: Partner Marquee ─────────────────────────────────
          Pure CSS animation — zero client JavaScript required.
      ── */}
      <div className="bg-card rounded-2xl border border-border shadow-sm p-4 overflow-hidden cv-auto">
        <div className="flex items-center gap-3 mb-3 px-2">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground/40">
            Verified Partners &amp; Integrations
          </span>
          <div className="h-px bg-border flex-1" aria-hidden="true" />
        </div>
        <div className="relative w-full overflow-hidden mask-fade" aria-label="Partner logos">
          <div className="animate-marquee flex items-center gap-8 py-2" aria-hidden="true">
            {doubledPartners.map((partner, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 px-4 py-2 bg-foreground/5 border border-border rounded-xl flex-shrink-0"
              >
                <div className={`w-6 h-6 rounded-lg bg-card border border-border flex items-center justify-center font-black text-xs ${partner.color}`}>
                  {partner.icon}
                </div>
                <span className="text-xs font-semibold text-foreground/80 whitespace-nowrap">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SERVER-RENDERED: About Futrix Platform ────────────────────────────
          Static HTML — no hydration cost at all.
      ── */}
      <div className="bg-card text-foreground rounded-3xl p-8 shadow-xl relative overflow-hidden border border-border cv-auto">
        {/* Decorative blur — pointer-events-none so no JS handler needed */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-foreground/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="max-w-3xl mb-8">
          <span className="inline-block px-3.5 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
            About Futrix Engine
          </span>
          <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-3">
            Built for modern finance teams who demand clarity, not chaos
          </h2>
          <p className="text-foreground/80 text-sm leading-relaxed">
            Futrix brings your accounting data, cash flow forecasting, board reporting, and
            AI-powered advice under one intelligent roof — keeping you in command of your
            business growth.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ABOUT_PILLARS.map(({ Icon, title, desc, color }) => (
            <div
              key={title}
              className="p-5 rounded-2xl border border-border bg-foreground/[0.02] hover:bg-foreground/5 transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center mb-4 ${color}`}>
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-sm text-foreground mb-1.5">{title}</h3>
              <p className="text-xs text-foreground/70 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/*
       * ── CLIENT ISLAND 2: ReviewsCarousel ──────────────────────────────────
       * Only the arrow buttons + dot indicators need client state.
       * Everything else (text, stars, author) is static.
       */}
      <ReviewsCarousel />
    </div>
  );
}
