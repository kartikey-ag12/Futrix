import { ReportingSidebar } from "@/components/reporting/ReportingSidebar";

export default function ReportingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-64px)]">
      {/* Left Sidebar (Black, persistent for reporting route) */}
      <div className="w-[300px] flex-shrink-0 border-r border-[#222] bg-[#111] overflow-y-auto hidden md:block">
        <ReportingSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#f5f5f5] dark:bg-[#0a0a0a]">
        {children}
      </div>
    </div>
  );
}
