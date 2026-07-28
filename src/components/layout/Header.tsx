"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  User,
  LogOut,
  Settings as SettingsIcon,
  ChevronDown,
  BarChart3,
  FileText,
  Globe,
  TrendingUp,
  LayoutDashboard,
  PlayCircle,
  Zap,
  ArrowRight,
  Menu,
} from "lucide-react";
import Link from "next/link";

// ─── Nav data ────────────────────────────────────────────────────────────────

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
    accent: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
  },
  {
    label: "Reporting & Dashboards",
    description: "The most advanced and customisable reporting in the market",
    href: "/features#reporting",
    icon: FileText,
    accent: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/40",
  },
  {
    label: "Multi-currency Consolidations",
    description: "Merge multiple entities in moments with flexibility and accuracy",
    href: "/features#consolidations",
    icon: Globe,
    accent: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950/40",
  },
  {
    label: "Daily Cash Flow Forecasting",
    description: "Longer-range forecasts for P&L, Balance Sheet and daily cash flow",
    href: "/features#cashflow",
    icon: TrendingUp,
    accent: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/40",
  },
];

// ─── Shared hook ─────────────────────────────────────────────────────────────

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return { open, setOpen, ref };
}

// ─── Shared trigger button ────────────────────────────────────────────────────

function NavButton({
  label,
  open,
  onClick,
}: {
  label: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 select-none ${
        open
          ? "text-primary bg-primary/10"
          : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
      }`}
    >
      {label}
      <ChevronDown
        className={`w-4 h-4 opacity-60 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      />
    </button>
  );
}

// ─── Product dropdown ─────────────────────────────────────────────────────────

function ProductDropdown() {
  const { open, setOpen, ref } = useDropdown();
  return (
    <div className="relative" ref={ref}>
      <NavButton label="Product" open={open} onClick={() => setOpen(!open)} />

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-72 bg-card border border-border rounded-2xl shadow-premium overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
          <div className="p-2 space-y-0.5">
            {PRODUCT_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-foreground/5 transition-colors group"
                >
                  <span className="mt-0.5 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                      {item.label}
                    </p>
                    <p className="text-xs text-foreground/50 mt-0.5 leading-snug">
                      {item.description}
                    </p>
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

// ─── Features dropdown ────────────────────────────────────────────────────────

function FeaturesDropdown() {
  const { open, setOpen, ref } = useDropdown();
  return (
    <div className="relative" ref={ref}>
      <NavButton label="Features" open={open} onClick={() => setOpen(!open)} />

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-[420px] bg-card border border-border rounded-2xl shadow-premium overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
          {/* Header */}
          <div className="px-4 pt-4 pb-2">
            <p className="text-[11px] font-bold uppercase tracking-widest text-foreground/40">
              Platform Features
            </p>
          </div>

          {/* Feature list */}
          <div className="px-2 pb-2 space-y-0.5">
            {FEATURE_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-foreground/5 transition-colors group"
                >
                  <span
                    className={`mt-0.5 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg ${item.bg} ${item.accent}`}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight">
                      {item.label}
                    </p>
                    <p className="text-xs text-foreground/50 mt-0.5 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Footer link */}
          <div className="px-5 py-3 border-t border-border bg-foreground/[0.02] flex items-center justify-between">
            <span className="text-xs text-foreground/40">4 features available</span>
            <Link
              href="/features"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              View all features
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Integrations dropdown ────────────────────────────────────────────────────

function IntegrationsDropdown() {
  const { open, setOpen, ref } = useDropdown();
  return (
    <div className="relative" ref={ref}>
      <NavButton label="Integrations" open={open} onClick={() => setOpen(!open)} />

      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 w-72 bg-card border border-border rounded-2xl shadow-premium overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
          {/* Header */}
          <div className="px-4 pt-4 pb-2">
            <p className="text-[11px] font-bold uppercase tracking-widest text-foreground/40">
              Connected Apps
            </p>
          </div>

          {/* Integrations items */}
          <div className="px-2 pb-2 space-y-1">
            {/* Xero item */}
            <Link
              href="/integrations/xero"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-foreground/5 transition-colors group"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-[#1AB4D7]/10 border border-[#1AB4D7]/20 flex items-center justify-center font-black text-sm text-[#1AB4D7]">
                X
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-foreground leading-tight">Xero</p>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold rounded-full leading-none">
                    Connected
                  </span>
                </div>
                <p className="text-xs text-foreground/50 leading-snug truncate">
                  Generate invoices &amp; sync live data
                </p>
              </div>
              <Zap className="flex-shrink-0 w-4 h-4 text-foreground/20 group-hover:text-emerald-500 transition-colors" />
            </Link>

            {/* Excel item */}
            <Link
              href="/excel-tools"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-foreground/5 transition-colors group"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-black text-sm text-emerald-500">
                E
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-foreground leading-tight">Excel Tools</p>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold rounded-full leading-none">
                    Supported
                  </span>
                </div>
                <p className="text-xs text-foreground/50 leading-snug truncate">
                  Import data &amp; export .xlsx reports
                </p>
              </div>
              <Zap className="flex-shrink-0 w-4 h-4 text-foreground/20 group-hover:text-emerald-500 transition-colors" />
            </Link>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-border bg-foreground/[0.02] flex items-center justify-between">
            <span className="text-xs text-foreground/40">2 apps supported</span>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Manage integrations
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Header ──────────────────────────────────────────────────────────────

interface HeaderProps {
  onOpenMobileSidebar?: () => void;
}

export function Header({ onOpenMobileSidebar }: HeaderProps) {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; email: string } | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Xero Sync Complete",
      desc: "45 new transactions synced successfully.",
      time: "10 mins ago",
      read: false,
      href: "/transactions",
      color: "bg-primary",
    },
    {
      id: "2",
      title: "Cash Flow Alert",
      desc: "Review your forecasted runway for August.",
      time: "1 hour ago",
      read: false,
      href: "/forecasting",
      color: "bg-amber-500",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

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
      } finally {
        setIsLoadingUser(false);
      }
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node))
        setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node))
        setShowProfile(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40 flex items-center px-4 sm:px-6 gap-3 sm:gap-4 justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-foreground/70 hover:bg-foreground/5 hover:text-foreground transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* ── Search ── */}
        <div className="relative flex-shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none" />
          <input
            type="text"
            placeholder="Search…"
            className="pl-9 pr-4 py-2 w-36 sm:w-52 bg-foreground/5 border border-border focus:border-primary focus:bg-card rounded-xl text-sm outline-none transition-all placeholder:text-foreground/40"
          />
        </div>
      </div>

      {/* ── Nav items ── */}
      <div className="hidden xl:flex flex-1 justify-center">
        <nav className="flex items-center gap-1">
          <Link
            href={userProfile ? "/dashboard" : "/"}
            className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-all duration-150"
          >
            Home
          </Link>
          <ProductDropdown />
          <FeaturesDropdown />
          <IntegrationsDropdown />

          <Link
            href="/pricing"
            className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-all duration-150"
          >
            Pricing
          </Link>
        </nav>
      </div>

      {/* ── Right: Notifications + Profile ── */}
      <div className="flex items-center gap-2 flex-shrink-0">

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-card animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-80 bg-card border border-border rounded-2xl shadow-premium overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h4 className="text-sm font-semibold">Notifications</h4>
                <span className="text-xs text-foreground/40">{unreadCount} unread</span>
              </div>
              <div className="divide-y divide-border">
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={n.href}
                    onClick={() => {
                      setNotifications((prev) =>
                        prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                      );
                      setShowNotifications(false);
                    }}
                    className={`block px-4 py-3.5 hover:bg-foreground/5 transition-colors cursor-pointer ${
                      n.read ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${n.color}`} />
                      <div>
                        <p className="text-sm font-semibold leading-snug">{n.title}</p>
                        <p className="text-xs text-foreground/60 mt-0.5 leading-snug">{n.desc}</p>
                        <p className="text-[10px] text-foreground/40 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-border">
                <button
                  onClick={() => {
                    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
                  }}
                  className="w-full py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary transition-all hover:bg-primary/25 hover:scale-105"
            aria-label="Profile menu"
          >
            <User className="w-4 h-4" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-card border border-border rounded-2xl shadow-premium overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
              <div className="px-4 py-4 border-b border-border">
                {isLoadingUser ? (
                  <div className="animate-pulse flex flex-col gap-2">
                    <div className="h-4 bg-foreground/10 rounded w-24"></div>
                    <div className="h-3 bg-foreground/10 rounded w-32"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-semibold">{userProfile?.name}</p>
                    <p className="text-xs text-foreground/50 mt-0.5 truncate">{userProfile?.email}</p>
                  </>
                )}
              </div>
              <div className="p-1.5 border-b border-border">
                <Link
                  href="/settings"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-foreground/75 hover:bg-foreground/5 hover:text-foreground rounded-xl transition-colors"
                >
                  <SettingsIcon className="w-4 h-4" />
                  Account Settings
                </Link>
              </div>
              <div className="p-1.5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/8 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
