import { BalanceSheetDashboard } from "@/components/performance/BalanceSheetDashboard";

export const metadata = {
  title: "Balance Sheet Dashboard — Futrix",
  description: "View your balance sheet performance.",
};

export default function BalanceSheetPage() {
  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-5 max-w-[1600px] mx-auto w-full">
      <BalanceSheetDashboard />
    </div>
  );
}
