import Link from "next/link";
import {
  BarChart3,
  FileText,
  Globe,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Star,
} from "lucide-react";

export const metadata = {
  title: "Features — Futrix",
  description: "Explore Futrix's four core features: Business Performance, Reporting & Dashboards, Multi-currency Consolidations, and Daily Cash Flow Forecasting.",
};

const FEATURES = [
  {
    id: "business-performance",
    icon: BarChart3,
    tag: "Business Performance",
    headline: "Stay one step ahead with an instant view of your whole business",
    description:
      "Futrix gives you a real-time command centre for your business health. Live KPIs, automated variance analysis, and AI-powered alerts mean you always know what's happening — and what's coming — before it affects your bottom line.",
    benefits: [
      "Live revenue, expense, and profit KPIs updated automatically",
      "Automated variance analysis vs. budget and prior period",
      "AI alerts flag risks and opportunities the moment they appear",
      "Custom KPI cards for the metrics unique to your business",
      "Mobile-friendly — check your business health anywhere",
      "Drill down from any summary figure to the underlying transactions",
    ],
    testimonial: {
      quote: "I open Futrix every morning like I used to open emails. It tells me everything I need to know about the business in one glance.",
      author: "Sarah Collins",
      role: "Managing Director, Broadstone Group",
    },
    accent: "emerald",
    gradient: "from-emerald-500 to-teal-600",
    lightBg: "bg-emerald-50",
    border: "border-emerald-200",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    tagBg: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "reporting",
    icon: FileText,
    tag: "Reporting & Dashboards",
    headline: "The most advanced and customisable reporting in the market",
    description:
      "Stop spending days building reports in spreadsheets. Futrix generates board packs, management accounts, and client dashboards automatically — using your live data — and lets you customise every element without any technical skills.",
    benefits: [
      "Board-ready reports generated automatically from live data",
      "Drag-and-drop report builder — no coding needed",
      "Scheduled delivery: reports land in inboxes automatically",
      "Client-ready dashboards with your branding",
      "Compare actuals vs. budget, forecast, or prior period",
      "Export to PDF, Excel, or share via a secure link",
    ],
    testimonial: {
      quote: "What used to take our team a full day every month now takes 20 minutes. The board gets better information and we get our time back.",
      author: "James Wu",
      role: "Finance Director, Meridian Partners",
    },
    accent: "blue",
    gradient: "from-blue-500 to-indigo-600",
    lightBg: "bg-blue-50",
    border: "border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    tagBg: "bg-blue-100 text-blue-700",
  },
  {
    id: "consolidations",
    icon: Globe,
    tag: "Multi-currency Consolidations",
    headline: "Merge multiple entities in moments with flexibility and accuracy",
    description:
      "Running a group of businesses across multiple countries and currencies? Futrix consolidates all your entities automatically — normalising exchange rates, eliminating intercompany transactions, and giving you one clean group view.",
    benefits: [
      "Connect unlimited Xero organisations",
      "Automatic multi-currency conversion at live or fixed rates",
      "Intercompany transaction elimination built in",
      "View entities individually or as a consolidated group",
      "Group P&L, Balance Sheet, and Cash Flow in one report",
      "Drill down from group to entity to transaction",
    ],
    testimonial: {
      quote: "We run eight entities across four currencies. Futrix consolidates everything automatically. Our monthly close went from a week to a day.",
      author: "Thomas Brennan",
      role: "Group CFO, Titan Holdings",
    },
    accent: "violet",
    gradient: "from-violet-500 to-purple-600",
    lightBg: "bg-violet-50",
    border: "border-violet-200",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    tagBg: "bg-violet-100 text-violet-700",
  },
  {
    id: "cashflow",
    icon: TrendingUp,
    tag: "Daily Cash Flow Forecasting",
    headline: "Longer-range forecasts for Profit & Loss, Balance Sheet, and daily cash flow",
    description:
      "Know your cash position today, next week, and 90 days from now. Futrix builds daily cash flow forecasts, P&L projections, and Balance Sheet models automatically — using your real transaction history as the foundation.",
    benefits: [
      "Daily cash flow forecast out to 90 days, updated automatically",
      "P&L and Balance Sheet projections built from actual patterns",
      "Scenario modelling: compare best, base, and worst case",
      "Invoice and bill timing factored in to the day",
      "AI identifies seasonal patterns and adjusts forecasts accordingly",
      "Early warning alerts when cash dips below your threshold",
    ],
    testimonial: {
      quote: "Futrix caught a cash shortfall we were heading toward six weeks out. We had time to act. Without it, we'd have had a very difficult conversation with our bank.",
      author: "Priya Mehta",
      role: "CFO, Clover Digital",
    },
    accent: "amber",
    gradient: "from-amber-500 to-orange-600",
    lightBg: "bg-amber-50",
    border: "border-amber-200",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    tagBg: "bg-amber-100 text-amber-700",
  },
];

export default function FeaturesPage() {
  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-24 pb-36">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 text-slate-300 text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
            Platform Features
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Four features.
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
              Complete financial control.
            </span>
          </h1>
          <p className="text-slate-300 text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Every Futrix feature is built around one goal: give you the financial clarity
            you need to make confident decisions — without the manual work.
          </p>
          {/* Quick-jump links */}
          <div className="flex flex-wrap justify-center gap-3">
            {FEATURES.map((f) => (
              <a
                key={f.id}
                href={`#${f.id}`}
                className="px-4 py-2 bg-white/10 border border-white/15 text-slate-200 text-sm font-medium rounded-full hover:bg-white/20 transition-colors"
              >
                {f.tag}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature sections ── */}
      {FEATURES.map((feature, i) => {
        const Icon = feature.icon;
        const isEven = i % 2 === 0;
        return (
          <section
            key={feature.id}
            id={feature.id}
            className={`py-28 ${isEven ? "bg-white" : "bg-slate-50"}`}
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 items-center`}>
                {/* Visual panel */}
                <div className={`flex-1 ${feature.lightBg} ${feature.border} border rounded-2xl p-8 flex flex-col items-center justify-center min-h-[320px]`}>
                  <div className={`w-20 h-20 ${feature.iconBg} ${feature.iconColor} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                    <Icon className="w-10 h-10" />
                  </div>
                  <div className={`inline-block px-4 py-2 bg-gradient-to-r ${feature.gradient} text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4`}>
                    {feature.tag}
                  </div>
                  {/* Testimonial inside panel */}
                  <div className="mt-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm max-w-xs">
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 italic leading-relaxed mb-3">
                      &ldquo;{feature.testimonial.quote}&rdquo;
                    </p>
                    <p className="text-xs font-semibold text-slate-800">{feature.testimonial.author}</p>
                    <p className="text-[11px] text-slate-500">{feature.testimonial.role}</p>
                  </div>
                </div>

                {/* Text content */}
                <div className="flex-1">
                  <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full mb-4 ${feature.tagBg}`}>
                    {feature.tag}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-5">
                    {feature.headline}
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 ${feature.iconColor} flex-shrink-0 mt-0.5`} />
                        <span className="text-slate-700 text-sm">{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link
                      href="/signup"
                      className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${feature.gradient} text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-sm`}
                    >
                      Try {feature.tag} free
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            All four features. One platform. 14 days free.
          </h2>
          <p className="text-emerald-100 text-lg mb-10">No credit card. Cancel anytime.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-all shadow-lg">
              Start free trial <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/pricing" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all">
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
