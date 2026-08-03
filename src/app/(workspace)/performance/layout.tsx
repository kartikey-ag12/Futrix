import { PerformanceSubNav } from "@/components/app-shell/PerformanceSubNav";

// Performance section layout: adds a horizontal sub-tab bar below the main navbar.
// Phase 2 will activate the tabs and render real content in children.

export default function PerformanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col flex-1">
      {/* Horizontal sub-tab bar slot — Phase 2 will make tabs interactive */}
      <PerformanceSubNav />

      {/* Page content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
