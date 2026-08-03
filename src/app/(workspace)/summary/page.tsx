import { getServerContext } from "@/lib/auth/serverUser";
import { HeroBanner } from "@/components/summary/HeroBanner";
import { HelpSection } from "@/components/summary/HelpSection";
import { SummaryDashboardContent } from "@/components/summary/SummaryDashboardContent";

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
        {/* 2 & 3. Real data wrapper */}
        <SummaryDashboardContent companyName={companyName} teamMembers={teamMembers} />

        {/* 4. Need more help? */}
        <HelpSection />
      </div>
    </div>
  );
}
