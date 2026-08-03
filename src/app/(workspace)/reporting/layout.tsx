import { SectionSidebar } from "@/components/app-shell/SectionSidebar";

// Reporting section layout: two-column — left sidebar (document manager) + right content area.
// Phase 4 will activate the sidebar and render the document grid / create-from tabs.

export default function ReportingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 h-full">
      {/* Left sidebar slot */}
      <SectionSidebar section="reporting" />

      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
