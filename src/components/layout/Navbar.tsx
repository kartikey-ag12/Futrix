"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  BarChart3,
  FileText,
  Globe,
  TrendingUp,
  Zap,
  ArrowRight,
  LayoutDashboard,
  PlayCircle,
  X,
  Menu,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const PRODUCT_ITEMS = [
  {
    label: "Product Overview",
    description: "See the full picture of what Futrix does",
    href: "#product-overview",
    icon: LayoutDashboard,
  },
  {
    label: "How It Works",
    description: "A step-by-step walkthrough of the platform",
    href: "#how-it-works",
    icon: PlayCircle,
  },
];

const FEATURE_ITEMS = [
  {
    label: "Business Performance",
    description: "Stay one step ahead with an instant view of your whole business",
    href: "#business-performance",
    icon: BarChart3,
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
    iconColor: "text-emerald-500",
  },
  {
    label: "Reporting & Dashboards",
    description: "The most advanced and customisable reporting in the market",
    href: "#reporting",
    icon: FileText,
    color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20",
    iconColor: "text-blue-500",
  },
  {
    label: "Multi-currency Consolidations",
    description: "Merge multiple entities in moments with flexibility and accuracy",
    href: "#consolidations",
    icon: Globe,
    color: "from-violet-500/10 to-purple-500/10 border-violet-500/20",
    iconColor: "text-violet-500",
  },
  {
    label: "Daily Cash Flow Forecasting",
    description: "Longer-range forecasts for Profit & Loss, Balance Sheet and daily cash flow",
    href: "#cashflow",
    icon: TrendingUp,
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/20",
    iconColor: "text-amber-500",
  },
];

const INTEGRATION_ITEMS = [
  {
    label: "Xero",
    description: "Generate invoices and sync live financial data",
    href: "/integrations/xero",
    logo: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/Xero_software_logo.svg/200px-Xero_software_logo.svg.png",
    badge: "Connected",
  },
  {
    label: "Excel Import/Export",
    description: "Import financial data and generate .xlsx reports",
    href: "/excel-tools",
    badge: "Supported",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return { open, setOpen, ref };
}

function ProductDropdown() {
  const { open, setOpen, ref } = useDropdown();
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          open
            ? "text-emerald-600 bg-emerald-50"
            : "text-slate-700 hover:text-emerald-600 hover:bg-slate-50"
        }`}
        aria-expanded={open}
      >
        Product
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 z-50">
          <div className="p-2">
            {PRODUCT_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-emerald-50 transition-colors group"
                >
                  <span className="mt-0.5 p-2 bg-emerald-100 rounded-lg text-emerald-600 group-hover:bg-emerald-200 transition-colors">
                    <Icon className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function FeaturesDropdown() {
  const { open, setOpen, ref } = useDropdown();
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          open
            ? "text-emerald-600 bg-emerald-50"
            : "text-slate-700 hover:text-emerald-600 hover:bg-slate-50"
        }`}
        aria-expanded={open}
      >
        Features
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-[480px] bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 z-50">
          <div className="p-4 border-b border-slate-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              All Features
            </p>
          </div>
          <div className="p-2 grid grid-cols-1 gap-1">
            {FEATURE_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r border hover:opacity-90 transition-opacity ${item.color}`}
                >
                  <span className={`mt-0.5 ${item.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
            <Link
              href="/features"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              View all features
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function IntegrationsDropdown() {
  const { open, setOpen, ref } = useDropdown();
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          open
            ? "text-emerald-600 bg-emerald-50"
            : "text-slate-700 hover:text-emerald-600 hover:bg-slate-50"
        }`}
        aria-expanded={open}
      >
        Integrations
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 z-50">
          <div className="p-4 border-b border-slate-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Connected Apps
            </p>
          </div>
          <div className="p-2">
            {INTEGRATION_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0 font-black text-lg ${
                  item.label === 'Xero'
                    ? 'bg-[#1AB4D7]/10 border-[#1AB4D7]/20 text-[#1AB4D7]'
                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                }`}>
                  {item.label[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-100 text-emerald-700`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{item.description}</p>
                </div>
                <Zap className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </Link>
            ))}
          </div>
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
            <Link
              href="/integrations/xero"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Explore accounting integrations
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Navbar ─────────────────────────────────────────────────────────────

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/60"
          : "bg-white border-b border-slate-200/60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-sm">F</span>
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">Futrix</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            <ProductDropdown />
            <FeaturesDropdown />
            <IntegrationsDropdown />
            <Link
              href="/pricing"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-emerald-600 hover:bg-slate-50 transition-all duration-200"
            >
              Pricing
            </Link>
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-sm hover:shadow-emerald-500/25 hover:shadow-md"
            >
              Start free trial
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Product
            </p>
            {PRODUCT_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Features
              </p>
              {FEATURE_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-2 space-y-1">
              <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Integrations
              </p>
              <Link
                href="/integrations/xero"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
              >
                Xero Integration
              </Link>
              <Link
                href="/excel-tools"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
              >
                Excel Import/Export
              </Link>
            </div>
            <div className="pt-2">
              <Link
                href="/pricing"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Pricing
              </Link>
            </div>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-center text-slate-700 border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
              >
                Start free trial
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
