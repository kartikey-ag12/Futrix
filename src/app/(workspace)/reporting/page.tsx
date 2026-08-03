import { RecentReportsGrid } from "@/components/reporting/RecentReportsGrid";
import { CreateFromTabs } from "@/components/reporting/CreateFromTabs";

export const metadata = {
  title: "Reporting — Futrix",
  description: "View and create reports and dashboards.",
};

export default function ReportingPage() {
  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 space-y-12 max-w-[1400px] mx-auto w-full">
      
      {/* Recent Reports Grid Section */}
      <section>
        <RecentReportsGrid />
      </section>

      {/* Create From Tabs Section */}
      <section>
        <CreateFromTabs />
      </section>
      
    </div>
  );
}
