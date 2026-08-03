"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, User, Building2, HelpCircle, Settings, LogOut, RefreshCw, BookOpen, MessageCircle, Sparkles } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface UserProfile {
  name: string;
  email: string;
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

function HelpDropdown() {
  const { open, toggle, close, ref } = useDropdown();

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
          <DropdownItem icon={BookOpen} onClick={close}>
            Documentation
          </DropdownItem>
          <DropdownItem icon={MessageCircle} onClick={close}>
            Contact Support
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem icon={Sparkles} onClick={close}>
            {"What's New"}
          </DropdownItem>
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

          <HelpDropdown />
        </div>
      </div>
    </header>
  );
}
