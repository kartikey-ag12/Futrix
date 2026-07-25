import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  FileText,
  Globe,
  TrendingUp,
  CheckCircle2,
  Star,
  Zap,
  Shield,
  Clock,
  Users,
} from "lucide-react";

export const metadata = {
  title: "Product Overview — Futrix",
  description: "Everything you need to understand how Futrix communicates with your team, improves profit, and manages cash flow.",
};

const CAPABILITIES = [
  {
    icon: BarChart3,
    title: "Business Performance",
    description: "Stay one step ahead with an instant view of your whole business. Live KPIs, alerts, and trend analysis — all in one place.",
    href: "/features#business-performance",
    color: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-500/20",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    icon: FileText,
    title: "Reporting & Dashboards",
    description: "The most advanced and customisable reporting in the market. Build board packs, management reports, and client dashboards in minutes.",
    href: "/features#reporting",
    color: "from-blue-500/10 to-indigo-500/10",
    border: "border-blue-500/20",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Globe,
    title: "Multi-currency Consolidations",
    description: "Merge multiple entities across currencies in moments. Get a single consolidated view with flexibility and accuracy.",
    href: "/features#consolidations",
    color: "from-violet-500/10 to-purple-500/10",
    border: "border-violet-500/20",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    icon: TrendingUp,
    title: "Daily Cash Flow Forecasting",
    description: "Longer-range forecasts for Profit & Loss, Balance Sheet, and daily cash flow — powered by your live accounting data.",
    href: "/features#cashflow",
    color: "from-amber-500/10 to-orange-500/10",
    border: "border-amber-500/20",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
];

const STATS = [
  { value: "2,400+", label: "Businesses trust Futrix" },
  { value: "94%", label: "Forecast accuracy" },
  { value: "12 hrs", label: "Saved per month, on average" },
  { value: "14 days", label: "Free trial, no card needed" },
];

const TESTIMONIALS = [
  {
    quote: "Futrix transformed how we present financials to our board. What used to take a day now takes 20 minutes.",
    author: "Rachel Osei",
    role: "CFO, Greenpath Ventures",
    stars: 5,
  },
  {
    quote: "The cash flow forecasting alone paid for itself in the first month. We avoided a serious cash crunch we didn't even see coming.",
    author: "Daniel Fitzpatrick",
    role: "Finance Director, Apex Retail",
    stars: 5,
  },
  {
    quote: "Our accountants now spend time advising clients instead of building reports. Futrix is the platform that made that possible.",
    author: "Mei Lin",
    role: "Partner, Horizon Advisory",
    stars: 5,
  },
];

const WHY_FUTRIX = [
  { icon: Zap, title: "Instant setup", text: "Connect your accounting software and get a full dashboard in under 5 minutes." },
  { icon: Shield, title: "Bank-grade security", text: "Your data is encrypted end-to-end. We are an authorised Xero App Partner." },
  { icon: Clock, title: "Always up to date", text: "Live sync means you are always looking at real numbers, not last month's data." },
  { icon: Users, title: "Built for teams", text: "Share reports, set permissions, and collaborate across your whole finance team." },
];

export default function ProductOverviewPage() {
  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 pt-24 pb-36">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 right-0 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 text-xs font-semibold uppercase tracking-wider rounded-full mb-6">
            Product Overview
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] mb-6">
            Financial intelligence
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              that works for you
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-300 text-lg sm:text-xl leading-relaxed mb-10">
            Futrix connects to your accounting software and turns raw numbers into clear forecasts,
            beautiful reports, and instant business insights — automatically.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-emerald-500/40 hover:shadow-xl">
              Start free 14-day trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/product/how-it-works" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all">
              See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-emerald-600 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center text-white">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-3xl sm:text-4xl font-black">{s.value}</p>
                <p className="text-emerald-100 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform capabilities ── */}
      <section className="py-28 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
              Platform capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
              Everything in one platform
            </h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto text-lg">
              Four core modules working together to give you complete financial control.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {CAPABILITIES.map((cap) => {
              const Icon = cap.icon;
              return (
                <Link
                  key={cap.title}
                  href={cap.href}
                  className={`group p-8 rounded-2xl bg-gradient-to-br ${cap.color} border ${cap.border} hover:shadow-lg transition-all duration-200`}
                >
                  <div className={`w-12 h-12 ${cap.iconBg} ${cap.iconColor} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{cap.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{cap.description}</p>
                  <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why Futrix ── */}
      <section className="py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900">Why Futrix?</h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto">
              Built for finance teams who want clarity, not complexity.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_FUTRIX.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="text-center p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-28 bg-gradient-to-br from-slate-900 to-emerald-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white">What our customers say</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.author} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-200 text-sm leading-relaxed italic mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
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
        </div>
      </section>

      {/* ── Benefits checklist ── */}
      <section className="py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-6">Stop flying blind on your finances</h2>
              <div className="space-y-4">
                {[
                  "Live financials synced from Xero automatically",
                  "Cash flow forecasts updated daily, not monthly",
                  "Board-ready reports built in minutes, not hours",
                  "Multi-entity consolidations across currencies",
                  "AI-powered alerts before problems become crises",
                  "Collaborate with your team and advisors in one place",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-4">
                <Link href="/signup" className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm">
                  Try it free
                </Link>
                <Link href="/product/how-it-works" className="px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-emerald-400 hover:text-emerald-700 transition-all flex items-center gap-2">
                  How it works <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100 space-y-4">
              {[
                { label: "Time to first insight", value: "< 5 min" },
                { label: "Data entry eliminated", value: "100%" },
                { label: "Report build time", value: "−85%" },
                { label: "Cash flow accuracy", value: "94%" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center py-3 border-b border-emerald-100 last:border-0">
                  <span className="text-slate-600 text-sm">{row.label}</span>
                  <span className="text-emerald-700 font-black text-lg">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Ready to take control of your finances?
          </h2>
          <p className="text-emerald-100 text-lg mb-10">
            Start your 14-day free trial today. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-all shadow-lg">
              Start free trial
              <ArrowRight className="w-5 h-5" />
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
