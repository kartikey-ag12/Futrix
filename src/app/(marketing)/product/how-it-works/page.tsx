import Link from "next/link";
import {
  ArrowRight,
  Plug,
  RefreshCcw,
  LayoutDashboard,
  TrendingUp,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "How It Works — Futrix",
  description: "See how Futrix combines actionable insights, reporting, and cash flow forecasting to transform your finance function.",
};

const STEPS = [
  {
    number: "01",
    icon: Plug,
    title: "Connect your accounting software",
    description:
      "Click 'Connect Xero' and authorise Futrix through Xero's secure OAuth2 flow. No passwords shared, no IT team required. You're connected in under 60 seconds.",
    detail: [
      "Supports Xero and Tally (more coming soon)",
      "Bank-grade OAuth2 security — we never see your password",
      "Up to 3 years of historical data imported on day one",
      "Multiple organisations supported for group consolidations",
    ],
    color: "bg-emerald-500",
    light: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    number: "02",
    icon: RefreshCcw,
    title: "Your data syncs automatically",
    description:
      "Futrix pulls your invoices, bills, bank transactions, chart of accounts, and payroll data from your accounting platform — then keeps it refreshed every hour, automatically.",
    detail: [
      "Hourly automatic sync keeps your data always current",
      "Manual sync available anytime from your dashboard",
      "Transactions, balances, and forecasts update in real time",
      "Zero manual data entry or CSV uploads required",
    ],
    color: "bg-blue-500",
    light: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    number: "03",
    icon: LayoutDashboard,
    title: "Your dashboard comes alive",
    description:
      "The moment your data lands, Futrix builds your live financial dashboard — KPIs, revenue trends, expense breakdowns, and cash flow projections, all ready without any setup.",
    detail: [
      "Revenue, expenses, profit, and cash — all in one view",
      "Automated variance analysis vs. budget or prior period",
      "Custom KPI cards for the metrics that matter to your business",
      "Mobile-friendly so you're never out of the loop",
    ],
    color: "bg-violet-500",
    light: "bg-violet-50",
    textColor: "text-violet-600",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Forecast, report, and decide faster",
    description:
      "Futrix uses your live data to power daily cash flow forecasts, board-ready reports, and AI-generated insights — so you can make confident decisions, not guesses.",
    detail: [
      "90-day rolling cash flow forecast updated daily",
      "P&L and Balance Sheet projections built automatically",
      "Board packs and management reports in minutes",
      "AI alerts flag risks and opportunities before they escalate",
    ],
    color: "bg-amber-500",
    light: "bg-amber-50",
    textColor: "text-amber-600",
  },
];

const FAQ_ITEMS = [
  {
    q: "How long does it take to get set up?",
    a: "Most users are fully connected and have a live dashboard within 5 minutes. Historical data import runs in the background and typically completes within 15 minutes.",
  },
  {
    q: "Do I need any technical knowledge?",
    a: "None at all. Futrix is designed for finance professionals, not developers. If you can log into Xero, you can connect Futrix.",
  },
  {
    q: "Can I use Futrix with multiple entities?",
    a: "Yes. Connect as many Xero organisations as you need and view them individually or as a consolidated group — including multi-currency consolidations.",
  },
  {
    q: "How accurate are the forecasts?",
    a: "Our customers average 94% accuracy on 90-day cash flow forecasts. The more historical data you have connected, the sharper the projections.",
  },
  {
    q: "What happens if my accounting data changes?",
    a: "Futrix syncs every hour automatically. Any change in your Xero data — a new invoice, a reconciled payment, a corrected entry — flows into your Futrix dashboard within the hour.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group border border-slate-200 rounded-2xl overflow-hidden">
      <summary className="flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-slate-50 transition-colors list-none">
        <span className="font-semibold text-slate-800">{q}</span>
        <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform duration-200 flex-shrink-0 ml-4" />
      </summary>
      <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
        {a}
      </div>
    </details>
  );
}

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-foreground/5 to-background pt-24 pb-36 border-b border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-foreground/5 border border-border text-foreground/70 text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
            How It Works
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-tight mb-6">
            From connection to
            <br />
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              clarity in minutes
            </span>
          </h1>
          <p className="text-foreground/60 text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Futrix combines real-time accounting data with AI-powered forecasting and beautiful
            reporting — all without any manual work.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg">
            Try it free — 14 days
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="py-28 bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className={`flex flex-col md:flex-row gap-8 items-start bg-background rounded-2xl border border-border p-8 shadow-sm hover:shadow-premium transition-shadow ${
                    i % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Icon + step number */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-3">
                    <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <span className="text-4xl font-black text-foreground/10">{step.number}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-black text-foreground mb-3">{step.title}</h2>
                    <p className="text-foreground/60 leading-relaxed mb-6">{step.description}</p>
                    <ul className="grid sm:grid-cols-2 gap-2.5">
                      {step.detail.map((d) => (
                        <li key={d} className="flex items-start gap-2">
                          <CheckCircle2 className={`w-4 h-4 ${step.textColor} flex-shrink-0 mt-0.5`} />
                          <span className="text-sm text-foreground/60">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Visual flow summary ── */}
      <section className="py-20 bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-black text-foreground mb-12">The Futrix flow at a glance</h2>
          <div className="flex flex-wrap justify-center items-center gap-3">
            {[
              { label: "Xero", bg: "bg-foreground text-background" },
              { label: "→", bg: "text-foreground/30 font-bold text-xl" },
              { label: "Auto Sync", bg: "bg-emerald-500/10 text-emerald-600" },
              { label: "→", bg: "text-foreground/30 font-bold text-xl" },
              { label: "Live Dashboard", bg: "bg-blue-500/10 text-blue-600" },
              { label: "→", bg: "text-foreground/30 font-bold text-xl" },
              { label: "AI Forecasts", bg: "bg-violet-500/10 text-violet-600" },
              { label: "→", bg: "text-foreground/30 font-bold text-xl" },
              { label: "Smart Reports", bg: "bg-amber-500/10 text-amber-600" },
            ].map((node, i) =>
              node.label === "→" ? (
                <span key={i} className={node.bg}>{node.label}</span>
              ) : (
                <span key={i} className={`px-4 py-2 rounded-xl font-semibold text-sm ${node.bg}`}>
                  {node.label}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-foreground">Common questions</h2>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-foreground">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-background mb-4">
            See it yourself in 14 days — free
          </h2>
          <p className="text-background/80 text-lg mb-10">
            No credit card. No long-term commitment. Just connect and go.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-background text-foreground font-semibold rounded-xl hover:bg-background/90 transition-all shadow-lg">
              Start free trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/integrations/xero" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-foreground text-background font-semibold rounded-xl border border-border hover:bg-background/10 transition-all">
              Xero integration
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
