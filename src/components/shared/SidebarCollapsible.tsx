"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, FileText, MoreHorizontal, Edit, Globe, Trash2, FileSpreadsheet, Download } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SidebarItem {
  id: string;
  name: string;
  href: string;
  status?: string;
}

interface SidebarGroupProps {
  title: string;
  count: number;
  items: SidebarItem[];
  defaultExpanded?: boolean;
}

export function SidebarCollapsibleGroup({ title, count, items, defaultExpanded = false }: SidebarGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePublish = async (id: string, currentStatus?: string) => {
    setOpenMenuId(null);
    const newStatus = currentStatus === "published" ? "draft" : "published";
    try {
      await fetch(`/api/forecasts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteForecast = async (id: string) => {
    setOpenMenuId(null);
    if (!window.confirm("Are you sure you want to delete this forecast?")) return;
    try {
      await fetch(`/api/forecasts/${id}`, { method: "DELETE" });
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const exportExcel = (id: string) => {
    setOpenMenuId(null);
    window.location.href = `/api/excel/export/forecast?id=${id}`;
  };

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
              <div key={item.id} className="relative group flex items-center w-full">
                <Link
                  href={item.href}
                  className="flex-1 flex items-center gap-2 px-2 py-1.5 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === item.id ? null : item.id);
                  }}
                  className="p-1 text-white/30 hover:text-white hover:bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity absolute right-1"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {openMenuId === item.id && (
                  <div 
                    ref={menuRef}
                    className="absolute right-0 top-full mt-1 z-50 w-48 bg-[#1a1a1a] border border-white/10 rounded-md shadow-xl py-1 overflow-hidden"
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpenMenuId(null)}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <Edit className="w-4 h-4" /> View/Edit
                    </Link>
                    <button
                      onClick={() => togglePublish(item.id, item.status)}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <Globe className="w-4 h-4" /> {item.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => exportExcel(item.id)}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <FileSpreadsheet className="w-4 h-4" /> Export to Excel
                    </button>
                    <button
                      disabled
                      className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-white/30 cursor-not-allowed transition-colors group/gs"
                    >
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4" /> Google Sheets
                      </div>
                      <span className="text-[10px] uppercase bg-white/10 px-1 rounded">Soon</span>
                    </button>
                    <div className="w-full h-px bg-white/10 my-1" />
                    <button
                      onClick={() => deleteForecast(item.id)}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-rose-500/70 hover:bg-rose-500/10 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                )}
              </div>
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
