import { getServerContext } from "@/lib/auth/serverUser";
import { HeroBanner } from "@/components/summary/HeroBanner";
import { PerformanceChartCard, MOCK_PERFORMANCE_DATA } from "@/components/summary/PerformanceChartCard";
import { BusinessInsightsCard, MOCK_INSIGHTS } from "@/components/summary/BusinessInsightsCard";
import { QuickLinksCard } from "@/components/summary/QuickLinksCard";
import { AlertsCard } from "@/components/summary/AlertsCard";
import { HelpSection } from "@/components/summary/HelpSection";

export const metadata = {
  title: "Summary — Futrix",
  description: "Your business summary: performance chart, insights, quick links and alerts.",
};

export default async function SummaryPage() {
  // Fetch real user + workspace + team data server-side via Prisma
  const ctx = await getServerContext();

  const firstName   = ctx?.user.name?.split(" ")[0] ?? "there";
  const companyName = ctx?.workspace?.name ?? "Your Company";
  const teamMembers = ctx?.team ?? [];

  return (
    <div className="flex flex-col min-h-full bg-[#f5f5f5] dark:bg-[#0a0a0a]">
      {/* 1. Hero banner */}
      <HeroBanner firstName={firstName} />

      {/* Inner content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-5 max-w-[1600px] mx-auto w-full">
        {/* 2. Performance chart */}
        <PerformanceChartCard data={MOCK_PERFORMANCE_DATA} />

        {/* 3. Three-column insights row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
          {/* Column 1 — Business insights */}
          <BusinessInsightsCard
            companyName={companyName}
            metrics={MOCK_INSIGHTS}
            hasForecasts={false}
          />

          {/* Column 2 — Quick links */}
          <QuickLinksCard />

          {/* Column 3 — Alerts */}
          <AlertsCard
            companyName={companyName}
            teamMembers={teamMembers}
            hasForecasts={false}
            lastSyncedMinsAgo={12}
            unreconciledCount={4}
          />
        </div>

        {/* 4. Need more help? */}
        <HelpSection />
      </div>
    </div>
  );
}
