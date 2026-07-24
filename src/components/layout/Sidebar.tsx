"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LineChart,
  Wallet,
  Settings,
  HelpCircle,
} from "lucide-react";
import clsx from "clsx";

export function Sidebar() {
  const pathname = usePathname();
  
  const links = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Forecasting", href: "/forecasting", icon: LineChart },
    { name: "Transactions", href: "/transactions", icon: Wallet },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">F</span>
          </div>
          Futrix
        </h1>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-foreground/70 hover:bg-foreground/10 hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-foreground/70 hover:bg-foreground/10 hover:text-foreground transition-colors">
          <HelpCircle className="w-5 h-5" />
          Support
        </button>
      </div>
    </aside>
  );
}
