"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Star } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

const TABS = [
  { id: "customers-suppliers", label: "Customers & Suppliers", href: "/performance/customers-suppliers", hasStar: false },
  { id: "cash-flow", label: "Cash Flow Dashboard", href: "/performance/cash-flow", hasStar: true },
  { id: "balance-sheet", label: "Balance Sheet Dashboard", href: "/performance/balance-sheet", hasStar: true },
  { id: "profit-loss", label: "Profit & Loss Dashboard", href: "/performance/profit-loss", hasStar: true },
];

export function PerformanceSubNav() {
  const pathname = usePathname();
  
  // Static state for favorited tabs for now. 
  // In Phase 6, this can be persisted to the DB per user.
  const [favorites, setFavorites] = useState<Record<string, boolean>>({
    "cash-flow": false,
    "balance-sheet": false,
    "profit-loss": false,
  });

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      className="w-full border-b border-[#e5e5e5] dark:border-white/8 bg-white dark:bg-[#111]"
      aria-label="Performance sub-navigation"
    >
      <div className="flex items-center gap-2 px-6 h-12 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          const isFavorited = favorites[tab.id];

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={clsx(
                "group relative flex items-center gap-1.5 px-3 py-3 text-sm transition-colors whitespace-nowrap",
                isActive 
                  ? "text-foreground font-semibold" 
                  : "text-foreground/50 hover:text-foreground/80 font-medium"
              )}
            >
              {tab.hasStar && (
                <button 
                  onClick={(e) => toggleFavorite(e, tab.id)}
                  className="focus:outline-none flex-shrink-0 mt-[1px]"
                  aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                >
                  <Star 
                    className={clsx(
                      "w-3.5 h-3.5 transition-colors",
                      isFavorited 
                        ? "fill-amber-400 text-amber-400" 
                        : "fill-transparent text-foreground/30 group-hover:text-foreground/50"
                    )} 
                  />
                </button>
              )}
              <span>{tab.label}</span>

              {/* Active underline indicator */}
              {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-emerald-500 rounded-t-sm" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
