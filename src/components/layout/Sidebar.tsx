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
  Table
} from "lucide-react";
import clsx from "clsx";

const NAV_LINKS = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Excel Tools", href: "/excel-tools", icon: Table },
  { name: "Forecasting", href: "/forecasting", icon: LineChart },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Reports & P&L", href: "/reports", icon: FileText },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenSupport?: () => void;
}

export function Sidebar({ isOpen = false, onClose, onOpenSupport }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={clsx(
          "w-64 h-screen bg-slate-900 flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo & Close */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800 flex-shrink-0">
          <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <span className="text-white font-black text-sm">F</span>
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Futrix</span>
          </Link>

          {/* Close button on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Main Menu
          </p>
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={onClose}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                  isActive
                    ? "bg-emerald-500/15 text-emerald-400 shadow-sm font-semibold"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                )}
              >
                <Icon
                  className={clsx(
                    "w-5 h-5 flex-shrink-0 transition-colors",
                    isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"
                  )}
                />
                <span className="flex-1">{link.name}</span>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500 opacity-70" />
                )}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="pt-4 pb-2 space-y-1">
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Integrations
            </p>
            <Link
              href="/integrations/xero"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all duration-150 group"
            >
              <div className="w-5 h-5 flex-shrink-0 bg-[#1AB4D7]/15 rounded flex items-center justify-center">
                <span className="text-[#1AB4D7] font-black text-xs leading-none">X</span>
              </div>
              <span className="flex-1">Xero</span>
              <span className="px-1.5 py-0.5 bg-emerald-500/15 text-emerald-400 text-[9px] font-bold rounded-full">
                Live
              </span>
            </Link>
            <Link
              href="/excel-tools"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all duration-150 group"
            >
              <div className="w-5 h-5 flex-shrink-0 bg-green-500/15 rounded flex items-center justify-center">
                <span className="text-green-500 font-black text-xs leading-none">E</span>
              </div>
              <span className="flex-1">Excel Tools</span>
              <span className="px-1.5 py-0.5 bg-green-500/15 text-green-400 text-[9px] font-bold rounded-full">
                Active
              </span>
            </Link>
          </div>
        </nav>

        {/* Upgrade nudge */}
        <div className="mx-3 mb-3 p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-300">Pro features</span>
          </div>
          <p className="text-xs text-slate-400 leading-snug mb-3">
            Unlock AI insights, multi-entity consolidation, and unlimited reports.
          </p>
          <Link
            href="/pricing"
            onClick={onClose}
            className="block text-center text-xs font-semibold py-1.5 px-3 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            Upgrade plan
          </Link>
        </div>

        {/* Support */}
        <div className="px-3 pb-4 border-t border-slate-800 pt-3">
          <button
            onClick={() => {
              if (onClose) onClose();
              if (onOpenSupport) onOpenSupport();
            }}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-all duration-150"
          >
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            Help & Support
          </button>
        </div>
      </aside>
    </>
  );
}
