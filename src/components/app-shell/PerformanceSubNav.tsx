// PerformanceSubNav — layout slot placeholder
// Phase 2 will fill this with the actual horizontal sub-tab bar
// (Customers & Suppliers | Cash Flow | Balance Sheet | P&L)

export function PerformanceSubNav() {
  return (
    <div
      className="w-full border-b border-[#e5e5e5] dark:border-white/8 bg-white dark:bg-[#111]"
      aria-label="Performance sub-navigation (placeholder)"
    >
      <div className="flex items-center gap-1 px-6 h-11">
        {/* TODO Phase 2: Replace with real sub-tabs */}
        {["Customers & Suppliers", "Cash Flow", "Balance Sheet", "P&L"].map((tab) => (
          <div
            key={tab}
            className="px-4 py-2 text-sm text-foreground/30 rounded-lg select-none"
          >
            {tab}
          </div>
        ))}
      </div>
    </div>
  );
}
