"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, User, Building2, HelpCircle, Settings, LogOut, RefreshCw, BookOpen, MessageCircle, Sparkles } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface UserProfile {
  name: string;
  email: string;
  completedTours?: string[];
}

// ── Nav items ─────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { label: "Summary",          href: "/summary" },
  { label: "Performance",      href: "/performance" },
  { label: "Forecasting",      href: "/forecasting" },
  { label: "Reporting",        href: "/reporting" },
  { label: "Chart of accounts", href: "/chart-of-accounts" },
  { label: "Drivers",          href: "/drivers" },
] as const;

// ── Shared dropdown hook ──────────────────────────────────────────────────────

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  return { open, toggle, close, ref };
}

// ── Dropdown shell ────────────────────────────────────────────────────────────

function DropdownPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute right-0 top-[calc(100%+6px)] min-w-[200px] bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden py-1">
      {children}
    </div>
  );
}

function DropdownItem({
  href,
  onClick,
  icon: Icon,
  children,
  danger,
}: {
  href?: string;
  onClick?: () => void;
  icon?: React.ElementType;
  children: React.ReactNode;
  danger?: boolean;
}) {
  const cls = `flex items-center gap-2.5 w-full px-4 py-2.5 text-sm transition-colors ${
    danger
      ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
      : "text-white/70 hover:bg-white/8 hover:text-white"
  }`;

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={cls}>
        {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cls}>
      {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
      {children}
    </button>
  );
}

function DropdownDivider() {
  return <div className="my-1 border-t border-white/8" />;
}

// ── User dropdown ─────────────────────────────────────────────────────────────

function UserDropdown({ user }: { user: UserProfile | null }) {
  const { open, toggle, close, ref } = useDropdown();
  const router = useRouter();

  const displayName = user?.name || user?.email?.split("@")[0] || "Account";
  const initial = displayName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    close();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    router.push("/login");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        id="navbar-user-dropdown-trigger"
        onClick={toggle}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/8 transition-colors select-none"
        aria-haspopup="true"
        aria-expanded={open}
      >
        {/* Avatar bubble */}
        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-[11px] font-bold text-slate-900 flex-shrink-0">
          {initial}
        </span>
        <span className="max-w-[120px] truncate font-medium">{displayName}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <DropdownPanel>
          {/* Identity header */}
          <div className="px-4 py-3 border-b border-white/8">
            <p className="text-sm font-semibold text-white truncate">{displayName}</p>
            {user?.email && (
              <p className="text-xs text-white/40 mt-0.5 truncate">{user.email}</p>
            )}
          </div>
          <DropdownItem href="/settings" icon={Settings} onClick={close}>
            Account Settings
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem onClick={handleSignOut} icon={LogOut} danger>
            Sign Out
          </DropdownItem>
        </DropdownPanel>
      )}
    </div>
  );
}

// ── Company dropdown ──────────────────────────────────────────────────────────

function CompanyDropdown({ orgName }: { orgName: string | null }) {
  const { open, toggle, close, ref } = useDropdown();
  const displayName = orgName || "My Company";

  return (
    <div className="relative" ref={ref}>
      <button
        id="navbar-company-dropdown-trigger"
        onClick={toggle}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/8 transition-colors select-none"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Building2 className="w-4 h-4 text-white/50 flex-shrink-0" />
        <span className="max-w-[140px] truncate font-medium">{displayName}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <DropdownPanel>
          <div className="px-4 py-2.5 border-b border-white/8">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/30">
              Workspace
            </p>
          </div>
          <DropdownItem icon={RefreshCw} onClick={close}>
            Switch Company
          </DropdownItem>
          <DropdownItem href="/settings" icon={Settings} onClick={close}>
            Manage Organisation
          </DropdownItem>
        </DropdownPanel>
      )}
    </div>
  );
}

// ── Help dropdown ─────────────────────────────────────────────────────────────

import { CheckSquare, Square, PlayCircle, ExternalLink } from "lucide-react";
import { useVirtualDemo } from "./VirtualDemoProvider";
import { TourStep } from "@/hooks/useGuidedTour";

const VIRTUAL_DEMOS = [
  { id: "performance", label: "Performance area", steps: [
    { targetId: "navbar-performance", title: "Performance Area", body: "View your Customers & Suppliers, Cash Flow, Balance Sheet, and P&L.", actionRequired: false, arrowPosition: "top" }
  ]},
  { id: "forecasting-main", label: "Forecasting", steps: [
    { targetId: "navbar-forecasting", title: "Forecasting", body: "Create and manage your 1-year P&L and 3-year cash flows.", actionRequired: false, arrowPosition: "top" }
  ]},
  { id: "drivers", label: "Drivers", steps: [
    { targetId: "navbar-drivers", title: "Drivers", body: "Create custom drivers (metrics or formulas) to base your predictions on.", actionRequired: false, arrowPosition: "top" }
  ]},
  { id: "coa", label: "Chart of accounts", steps: [
    { targetId: "navbar-coa", title: "Chart of Accounts", body: "Manage your account groupings and reclassify imported codes.", actionRequired: false, arrowPosition: "top" }
  ]},
  { id: "consolidation", label: "Consolidation", disabled: true, steps: [] }
] as const;

function HelpDropdown({ completedTours = [] }: { completedTours?: string[] }) {
  const { open, toggle, close, ref } = useDropdown();
  const { startTour } = useVirtualDemo();

  const handleStartDemo = (demo: any) => {
    if (demo.disabled) return;
    close();
    startTour(demo.id, demo.steps as TourStep[]);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        id="navbar-help-dropdown-trigger"
        onClick={toggle}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/8 transition-colors select-none"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <HelpCircle className="w-4 h-4 text-white/50 flex-shrink-0" />
        <span className="font-medium">Help</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <DropdownPanel>
          <div className="max-h-[80vh] overflow-y-auto">
            <DropdownItem href="/help" icon={BookOpen} onClick={close}>
              Help centre
            </DropdownItem>
            <DropdownItem icon={MessageCircle} onClick={() => { close(); document.getElementById("chat-widget-trigger")?.click(); }}>
              Ask us a question
            </DropdownItem>
            <DropdownItem href="https://ideas.futrix.example.com" icon={ExternalLink} onClick={close}>
              Customer Ideas Portal
            </DropdownItem>
            
            <DropdownDivider />
            
            <div className="px-4 py-2">
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-2">
                Virtual Demos
              </p>
              <div className="space-y-1">
                {VIRTUAL_DEMOS.map(demo => {
                  const isCompleted = completedTours.includes(demo.id);
                  const isDisabled = "disabled" in demo ? demo.disabled : false;
                  return (
                    <button 
                      key={demo.id} 
                      onClick={() => handleStartDemo(demo)}
                      disabled={isDisabled}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors text-left ${isDisabled ? "opacity-50 cursor-not-allowed text-white/40" : "text-white/80 hover:bg-white/10 hover:text-white"}`}
                    >
                      <span className="flex items-center gap-2">
                        {isCompleted ? <CheckSquare className="w-4 h-4 text-emerald-400" /> : <Square className="w-4 h-4 text-white/30" />}
                        {demo.label}
                        {isDisabled && <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded ml-2">Coming soon</span>}
                      </span>
                      {!isDisabled && !isCompleted && <PlayCircle className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </DropdownPanel>
      )}
    </div>
  );
}

// ── Main AppNavbar ────────────────────────────────────────────────────────────

export function AppNavbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orgName, setOrgName] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
            if (data.orgName) setOrgName(data.orgName);
          }
        }
      } catch {
        // proceed with nulls
      }
    }
    loadUser();
  }, []);

  return (
    <header className="w-full bg-black border-b border-white/8 sticky top-0 z-50">
      <div className="flex items-center justify-between h-12 px-4 sm:px-6">
        {/* ── Left: Logo + Nav links ── */}
        <div className="flex items-center gap-0">
          {/* Logo */}
          <Link href="/summary" className="flex items-center gap-2 mr-6 group flex-shrink-0">
            <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="text-slate-900 font-black text-sm">F</span>
            </div>
            <span className="text-white font-bold text-base tracking-tight hidden sm:block">Futrix</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/summary" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative px-3.5 py-3 text-sm transition-colors whitespace-nowrap
                    ${isActive
                      ? "text-white font-semibold"
                      : "text-white/50 hover:text-white/80 font-normal"
                    }
                  `}
                >
                  {item.label}
                  {/* Active bottom border */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-400 rounded-t-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ── Right: Dropdowns ── */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Divider */}
          <div className="h-5 w-px bg-white/10 mx-1" />

          <UserDropdown user={user} />

          {/* Divider */}
          <div className="h-5 w-px bg-white/10 mx-1" />

          <CompanyDropdown orgName={orgName} />

          {/* Divider */}
          <div className="h-5 w-px bg-white/10 mx-1" />

          <HelpDropdown completedTours={user?.completedTours} />
        </div>
      </div>
    </header>
  );
}
