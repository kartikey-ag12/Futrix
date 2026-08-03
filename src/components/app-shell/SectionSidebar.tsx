// SectionSidebar — left sidebar layout slot placeholder
// Phase 3 (Forecasting) and Phase 4 (Reporting) will fill this with real content

interface SectionSidebarProps {
  section: "forecasting" | "reporting";
}

export function SectionSidebar({ section }: SectionSidebarProps) {
  const labels: Record<typeof section, string[]> = {
    forecasting: ["Scenarios", "Cash Flow", "Revenue", "Expenses"],
    reporting:   ["All Reports", "Recently Used", "Shared with Me", "Templates"],
  };

  return (
    <aside
      className="w-56 flex-shrink-0 h-full border-r border-[#e5e5e5] dark:border-white/8 bg-white dark:bg-[#111] flex flex-col"
      aria-label={`${section} sidebar (placeholder)`}
    >
      <div className="px-4 pt-5 pb-2">
        <p className="text-[11px] font-bold uppercase tracking-widest text-foreground/30">
          {/* TODO Phase 3/4: Replace with real sidebar header */}
          {section === "forecasting" ? "Forecasts" : "Documents"}
        </p>
      </div>
      <nav className="flex-1 px-2 py-1 space-y-0.5">
        {labels[section].map((item) => (
          <div
            key={item}
            className="px-3 py-2.5 rounded-xl text-sm text-foreground/25 select-none"
          >
            {item}
          </div>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-[#e5e5e5] dark:border-white/8">
        <p className="text-xs text-foreground/20">
          {/* TODO Phase 3/4: Replace with real sidebar footer action */}
          + New {section === "forecasting" ? "Forecast" : "Report"}
        </p>
      </div>
    </aside>
  );
}
