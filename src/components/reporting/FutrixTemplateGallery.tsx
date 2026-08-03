"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, LayoutTemplate, Plus } from "lucide-react";
import { useTemplates, BuilderTemplate } from "@/hooks/useTemplates";
import clsx from "clsx";

export function FutrixTemplateGallery() {
  const { templates } = useTemplates();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(templates.map(t => t.category));
    return Array.from(cats);
  }, [templates]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? t.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchQuery, selectedCategory]);

  const portraitTemplates = filteredTemplates.filter(t => t.orientation === "portrait");
  const landscapeTemplates = filteredTemplates.filter(t => t.orientation === "landscape");

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-300">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-1">Click to create a report</h2>
          <p className="text-sm text-foreground/60">Templates are provided by the Futrix team.</p>
        </div>
        <div className="relative flex items-center max-w-sm w-full">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-24 py-2.5 bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          <button className="absolute right-1.5 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-medium transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="relative flex items-center group">
        <ScrollableRow>
          <button
            onClick={() => setSelectedCategory(null)}
            className={clsx(
              "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
              selectedCategory === null
                ? "bg-foreground text-background border-foreground"
                : "bg-white dark:bg-[#111] text-foreground/70 border-[#e5e5e5] dark:border-white/10 hover:border-foreground/30 hover:text-foreground"
            )}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={clsx(
                "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                selectedCategory === cat
                  ? "bg-foreground text-background border-foreground"
                  : "bg-white dark:bg-[#111] text-foreground/70 border-[#e5e5e5] dark:border-white/10 hover:border-foreground/30 hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </ScrollableRow>
      </div>

      {/* Portrait Templates Section */}
      <TemplateSection title="Portrait templates" templates={portraitTemplates} />

      {/* Landscape Templates Section */}
      <TemplateSection title="Landscape templates" templates={landscapeTemplates} includeBlankCard={true} />

    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ScrollableRow({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full flex items-center">
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 z-10 p-1.5 bg-white dark:bg-[#222] border border-[#e5e5e5] dark:border-white/10 rounded-full shadow-sm text-foreground/50 hover:text-foreground -ml-4 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      
      <div 
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth w-full px-1 py-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>

      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 z-10 p-1.5 bg-white dark:bg-[#222] border border-[#e5e5e5] dark:border-white/10 rounded-full shadow-sm text-foreground/50 hover:text-foreground -mr-4 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function TemplateSection({ title, templates, includeBlankCard = false }: { title: string, templates: BuilderTemplate[], includeBlankCard?: boolean }) {
  if (templates.length === 0 && !includeBlankCard) return null;

  return (
    <div className="space-y-4 group">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{title}</h3>
      </div>
      
      <ScrollableRow>
        {includeBlankCard && (
          <Link
            href={`/reporting/builder?type=landscape`}
            className="flex-shrink-0 w-64 h-72 flex flex-col items-center justify-center bg-white dark:bg-[#111] border-2 border-dashed border-[#e5e5e5] dark:border-white/20 rounded-xl hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all group/card"
          >
            <div className="w-12 h-12 bg-foreground/5 rounded-xl flex items-center justify-center mb-4 group-hover/card:bg-emerald-100 dark:group-hover/card:bg-emerald-500/20 transition-colors">
              <Plus className="w-6 h-6 text-foreground/40 group-hover/card:text-emerald-600 transition-colors" />
            </div>
            <span className="text-sm font-medium text-foreground">Create blank landscape</span>
          </Link>
        )}
        
        {templates.map(t => (
          <Link
            key={t.id}
            href={`/reporting/builder?type=${t.orientation}&templateId=${t.id}`}
            className="flex-shrink-0 w-64 h-72 flex flex-col bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/10 rounded-xl hover:border-emerald-500 hover:shadow-md overflow-hidden transition-all group/card"
          >
            {/* Thumbnail Placeholder */}
            <div className="flex-1 bg-foreground/5 flex items-center justify-center border-b border-[#e5e5e5] dark:border-white/10 relative p-4">
              <div className={clsx(
                "bg-white dark:bg-[#222] shadow-sm rounded border border-[#e5e5e5] dark:border-white/10 flex items-center justify-center",
                t.orientation === "portrait" ? "w-24 h-32" : "w-32 h-24"
              )}>
                <LayoutTemplate className="w-8 h-8 text-foreground/20" />
              </div>
            </div>
            {/* Details */}
            <div className="p-4 flex flex-col h-28 relative">
              <h4 className="text-sm font-medium text-foreground line-clamp-2 mb-1 group-hover/card:text-emerald-600 transition-colors">{t.name}</h4>
              <p className="text-xs text-foreground/50 truncate">{t.category}</p>
              
              <div className="absolute bottom-4 right-4">
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-foreground/5 text-foreground/50 group-hover/card:bg-emerald-100 group-hover/card:text-emerald-700 transition-colors">
                  1 of {t.pages}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </ScrollableRow>
    </div>
  );
}
