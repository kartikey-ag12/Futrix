"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";
import Link from "next/link";

interface SidebarItem {
  id: string;
  name: string;
  href: string;
}

interface SidebarGroupProps {
  title: string;
  count: number;
  items: SidebarItem[];
  defaultExpanded?: boolean;
}

export function SidebarCollapsibleGroup({ title, count, items, defaultExpanded = false }: SidebarGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-white/5 transition-colors rounded-lg group"
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-white/50 group-hover:text-white/80" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-white/50 group-hover:text-white/80" />
          )}
          <span className="text-sm font-medium text-white/70 group-hover:text-white/90">{title}</span>
        </div>
        <span className="text-xs font-semibold bg-white/5 text-white/50 group-hover:text-white/70 px-1.5 py-[1px] rounded-full">
          {count}
        </span>
      </button>

      {expanded && (
        <div className="mt-1 flex flex-col gap-0.5 pl-6 pr-2">
          {items.length > 0 ? (
            items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-2 px-2 py-1.5 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-md transition-colors"
              >
                <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            ))
          ) : (
            <div className="px-2 py-1.5 text-sm text-white/30 italic">Empty</div>
          )}
        </div>
      )}
    </div>
  );
}

interface SidebarSectionProps {
  title: string;
  count: number;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

export function SidebarCollapsibleSection({ title, count, defaultExpanded = true, children }: SidebarSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className="mb-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2 hover:bg-white/5 transition-colors rounded-lg group mb-2"
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-white/50 group-hover:text-white/80" />
          ) : (
            <ChevronRight className="w-4 h-4 text-white/50 group-hover:text-white/80" />
          )}
          <span className="text-sm font-semibold text-white/90">{title}</span>
        </div>
        <span className="text-xs font-semibold bg-white/10 text-white/70 px-2 py-0.5 rounded-full">
          {count}
        </span>
      </button>

      {expanded && (
        <div className="pl-4 pr-2">
          {children}
        </div>
      )}
    </div>
  );
}
