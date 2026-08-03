import { SectionSidebar } from "@/components/app-shell/SectionSidebar";

// Forecasting section layout: two-column — left sidebar + right content area.
// Phase 3 will activate the sidebar (forecast type cards, scenario list)
// and render real page content.

export default function ForecastingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 h-full">
      {/* Left sidebar slot */}
      <SectionSidebar section="forecasting" />

      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
