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
    href: "/product",
    icon: LayoutDashboard,
  },
  {
    label: "How It Works",
    description: "A step-by-step walkthrough of the platform",
    href: "/product/how-it-works",
    icon: PlayCircle,
  },
];

const FEATURE_ITEMS = [
  {
    label: "Business Performance",
    description: "Stay one step ahead with an instant view of your whole business",
    href: "/features#business-performance",
    icon: BarChart3,
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
    iconColor: "text-emerald-500",
  },
  {
    label: "Reporting & Dashboards",
    description: "The most advanced and customisable reporting in the market",
    href: "/features#reporting",
    icon: FileText,
    color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20",
    iconColor: "text-blue-500",
  },
  {
    label: "Multi-currency Consolidations",
    description: "Merge multiple entities in moments with flexibility and accuracy",
    href: "/features#consolidations",
    icon: Globe,
    color: "from-violet-500/10 to-purple-500/10 border-violet-500/20",
    iconColor: "text-violet-500",
  },
  {
    label: "Daily Cash Flow Forecasting",
    description: "Longer-range forecasts for Profit & Loss, Balance Sheet and daily cash flow",
    href: "/features#cashflow",
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
            ? "text-primary bg-primary/10"
            : "text-foreground/80 hover:text-foreground hover:bg-foreground/5"
        }`}
        aria-expanded={open}
      >
        Product
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-72 bg-card border border-border rounded-2xl shadow-premium overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
          <div className="p-2">
            {PRODUCT_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-foreground/5 transition-colors group"
                >
                  <span className="mt-0.5 p-2 bg-emerald-100 rounded-lg text-emerald-600 group-hover:bg-emerald-200 transition-colors">
                    <Icon className="w-4 h-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground group-hover:text-emerald-500 transition-colors">
                      {item.label}
                    </p>
                    <p className="text-xs text-foreground/70 mt-0.5">{item.description}</p>
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
            ? "text-primary bg-primary/10"
            : "text-foreground/80 hover:text-foreground hover:bg-foreground/5"
        }`}
        aria-expanded={open}
      >
        Features
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-[480px] bg-card border border-border rounded-2xl shadow-premium overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
          <div className="p-4 border-b border-border">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
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
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="text-xs text-foreground/70 mt-0.5">{item.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="px-4 py-3 bg-foreground/[0.02] border-t border-border">
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
            ? "text-primary bg-primary/10"
            : "text-foreground/80 hover:text-foreground hover:bg-foreground/5"
        }`}
        aria-expanded={open}
      >
        Integrations
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-72 bg-card border border-border rounded-2xl shadow-premium overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
          <div className="p-4 border-b border-border">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">
              Connected Apps
            </p>
          </div>
          <div className="p-2">
            {INTEGRATION_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-foreground/5 transition-colors group"
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
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/10 text-emerald-600`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground/70 mt-0.5 truncate">{item.description}</p>
                </div>
                <Zap className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </Link>
            ))}
          </div>
          <div className="px-4 py-3 bg-foreground/[0.02] border-t border-border">
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
  const [userProfile, setUserProfile] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUserProfile(data.user);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadUser();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-background border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          
          {/* ── Left: Logo ── */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-background font-black text-sm">F</span>
              </div>
              <span className="text-lg font-bold text-foreground tracking-tight">Futrix</span>
            </Link>
          </div>

          {/* ── Middle: Desktop Nav ── */}
          <div className="hidden md:flex flex-1 justify-center">
            <nav className="flex items-center gap-1">
              <Link
                href={userProfile ? "/dashboard" : "/"}
                className="px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-foreground/5 transition-all duration-200"
              >
                Home
              </Link>
              <ProductDropdown />
              <FeaturesDropdown />
              <IntegrationsDropdown />
              <Link
                href="/pricing"
                className="px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-foreground/5 transition-all duration-200"
              >
                Pricing
              </Link>
            </nav>
          </div>

          {/* ── Right: Auth buttons & Mobile menu ── */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {!userProfile && (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-foreground text-background text-sm font-semibold rounded-xl hover:bg-foreground/90 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Start free trial
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-foreground/80 hover:bg-foreground/5 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            <Link
              href={userProfile ? "/dashboard" : "/"}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:bg-foreground/5 hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground/50">
              Product
            </p>
            {PRODUCT_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:bg-foreground/5 hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground/50">
                Features
              </p>
              {FEATURE_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:bg-foreground/5 hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="pt-2 space-y-1">
              <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-foreground/50">
                Integrations
              </p>
              <Link
                href="/integrations/xero"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:bg-foreground/5 hover:text-foreground transition-colors"
              >
                Xero Integration
              </Link>
              <Link
                href="/excel-tools"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:bg-foreground/5 hover:text-foreground transition-colors"
              >
                Excel Import/Export
              </Link>
            </div>
            <div className="pt-2">
              <Link
                href="/pricing"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:bg-foreground/5 transition-colors"
              >
                Pricing
              </Link>
            </div>
            {!userProfile && (
              <div className="pt-4 border-t border-border flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium text-center text-foreground border border-border hover:border-foreground/20 hover:bg-foreground/5 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-center bg-foreground text-background shadow-sm hover:bg-foreground/90 transition-colors"
                >
                  Start free trial
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
