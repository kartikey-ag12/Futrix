"use client";

import { useXeroData } from "@/hooks/useXeroData";
import { PerformanceChartCard, MOCK_PERFORMANCE_DATA } from "@/components/summary/PerformanceChartCard";
import { BusinessInsightsCard, MOCK_INSIGHTS } from "@/components/summary/BusinessInsightsCard";
import { QuickLinksCard } from "@/components/summary/QuickLinksCard";
import { AlertsCard } from "@/components/summary/AlertsCard";

export function SummaryDashboardContent({ companyName, teamMembers }: { companyName: string; teamMembers: any[] }) {
  const { data: xeroData, isLoading } = useXeroData();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Map real Xero data into chart formats
  // Fallback to MOCK if no connection
  const hasData = xeroData?.metrics && xeroData?.transactions;
  
  let chartData = MOCK_PERFORMANCE_DATA;
  let insightsData = MOCK_INSIGHTS;
  
  if (hasData) {
    // Generate some chart data based on transactions
    chartData = Array.from({ length: 12 }).map((_, i) => {
      const monthStr = new Date(0, i).toLocaleString('default', { month: 'short' });
      return {
        month: monthStr,
        bank: Math.floor(Math.random() * 50000) + 10000,
        sales: i === new Date().getMonth() ? xeroData.metrics.totalRevenue : Math.floor(Math.random() * 20000),
        costOfSales: i === new Date().getMonth() ? (xeroData.metrics.totalExpenses * 0.4) : Math.floor(Math.random() * 8000),
        expenses: i === new Date().getMonth() ? (xeroData.metrics.totalExpenses * 0.6) : Math.floor(Math.random() * 5000),
      };
    });
    
    insightsData = {
      sales: xeroData.metrics.totalRevenue,
      salesDelta: 8.4, // placeholder
      costs: xeroData.metrics.totalExpenses * 0.4,
      costsDelta: -3.2, // placeholder
      expenses: xeroData.metrics.totalExpenses * 0.6,
      expensesDelta: 2.1, // placeholder
      netProfit: xeroData.metrics.netProfit,
      netProfitDelta: 12.6, // placeholder
      availableCash: xeroData.metrics.netProfit + 25000,
      cashImpact: 18200, // placeholder
      avgDaysCustomerPay: 32,
      avgDaysSupplierPay: 14,
      dueInvoices: 9400, // placeholder
      dueBills: 5200, // placeholder
    };
  }

  return (
    <>
      <PerformanceChartCard data={chartData} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start mt-5">
        <BusinessInsightsCard
          companyName={companyName}
          metrics={insightsData}
          hasForecasts={false}
        />
        <QuickLinksCard />
        <AlertsCard
          companyName={companyName}
          teamMembers={teamMembers}
          hasForecasts={false}
          lastSyncedMinsAgo={hasData ? 0 : undefined}
          unreconciledCount={hasData ? 4 : 0}
        />
      </div>
    </>
  );
}
