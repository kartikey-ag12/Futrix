"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LineChart,
  ArrowLeftRight,
  FileText,
  Settings,
  HelpCircle,
  Zap,
  ChevronRight,
  X,
  Table,
  Users,
  Folders,
  Link2,
  ShieldAlert
} from "lucide-react";
import clsx from "clsx";

const NAV_LINKS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Excel Tools", href: "/excel-tools", icon: Table },
  { name: "Forecasting", href: "/forecasting", icon: LineChart },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Reports & P&L", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

const ADMIN_NAV_LINKS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Workspaces", href: "/admin/workspaces", icon: Folders },
  { name: "Integrations", href: "/admin/integrations", icon: Link2 },
  { name: "Audit Log", href: "/admin/audit-log", icon: ShieldAlert },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenSupport?: () => void;
}

export function Sidebar({ isOpen = false, onClose, onOpenSupport }: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") || false;
  const currentLinks = isAdmin ? ADMIN_NAV_LINKS : NAV_LINKS;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={clsx(
          "w-64 h-screen bg-card flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0 border-r border-border",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo & Close */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-border flex-shrink-0">
          <Link href={isAdmin ? "/admin" : "/"} onClick={onClose} className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-background font-black text-sm">F</span>
            </div>
            <span className="text-foreground font-bold text-lg tracking-tight">Futrix</span>
            {isAdmin && (
              <span className="px-1.5 py-0.5 bg-red-500/10 text-red-600 text-[9px] font-bold rounded-full border border-red-500/20">
                ADMIN
              </span>
            )}
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-widest text-foreground/40">
            Main Menu
          </p>
          {currentLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={onClose}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 group",
                  isActive
                    ? "bg-foreground/5 text-foreground shadow-sm font-semibold relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-foreground before:rounded-r-full"
                    : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                )}
              >
                <Icon
                  className={clsx(
                    "w-4 h-4 flex-shrink-0 transition-colors",
                    isActive ? "text-foreground" : "text-foreground/50 group-hover:text-foreground/80"
                  )}
                />
                <span className="flex-1">{link.name}</span>
              </Link>
            );
          })}

          {/* Divider */}
          {!isAdmin && (
            <div className="pt-6 pb-2 space-y-1">
              <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-widest text-foreground/40">
                Integrations
              </p>
              <Link
                href="/integrations/xero"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-all duration-150 group"
              >
                <div className="w-5 h-5 flex-shrink-0 bg-[#1AB4D7]/10 border border-[#1AB4D7]/20 rounded flex items-center justify-center">
                  <span className="text-[#1AB4D7] font-black text-[10px] leading-none">X</span>
                </div>
                <span className="flex-1">Xero</span>
                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-bold rounded-full">
                  Live
                </span>
              </Link>
              <Link
                href="/excel-tools"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-all duration-150 group"
              >
                <div className="w-5 h-5 flex-shrink-0 bg-emerald-100 border border-emerald-200 rounded flex items-center justify-center">
                  <span className="text-emerald-600 font-black text-[10px] leading-none">E</span>
                </div>
                <span className="flex-1">Excel Tools</span>
                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-bold rounded-full">
                  Active
                </span>
              </Link>
            </div>
          )}
        </nav>

        {/* Upgrade nudge */}
        {!isAdmin && (
          <div className="mx-3 mb-3 p-4 rounded-xl bg-foreground/5 border border-border shadow-inner-border">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-semibold text-foreground">Pro features</span>
            </div>
            <p className="text-xs text-foreground/60 leading-snug mb-3">
              Unlock AI insights, multi-entity consolidation, and unlimited reports.
            </p>
            <Link
              href="/pricing"
              onClick={onClose}
              className="block text-center text-xs font-semibold py-1.5 px-3 rounded-lg bg-foreground text-background shadow-md hover:bg-foreground/90 transition-colors"
            >
              Upgrade plan
            </Link>
          </div>
        )}

        {/* Support */}
        <div className="px-3 pb-4 border-t border-border pt-3">
          <button
            onClick={() => {
              if (onClose) onClose();
              if (onOpenSupport) onOpenSupport();
            }}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-xl text-sm font-medium text-foreground/60 hover:bg-foreground/5 hover:text-foreground transition-all duration-150"
          >
            <HelpCircle className="w-4 h-4 text-foreground/50" />
            Help & Support
          </button>
        </div>
      </aside>
    </>
  );
}
