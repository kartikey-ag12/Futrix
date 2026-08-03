import { ProfitLossDashboard } from "@/components/performance/ProfitLossDashboard";

export const metadata = {
  title: "Profit & Loss Dashboard — Futrix",
  description: "View your profit and loss performance.",
};

export default function ProfitLossPage() {
  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-5 max-w-[1600px] mx-auto w-full">
      <ProfitLossDashboard />
    </div>
  );
}
