import { CashFlowDashboard } from "@/components/performance/CashFlowDashboard";

export const metadata = {
  title: "Cash Flow Dashboard — Futrix",
  description: "View your cash flow performance.",
};

export default function CashFlowPage() {
  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-5 max-w-[1600px] mx-auto w-full">
      <CashFlowDashboard />
    </div>
  );
}
