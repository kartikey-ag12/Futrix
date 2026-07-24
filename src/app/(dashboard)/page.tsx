import { KPICard } from "@/components/dashboard/KPICard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import { DollarSign, TrendingUp, TrendingDown, Activity } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-foreground/60 text-sm mt-1">Here is your financial summary for this month.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Revenue" 
          value="$45,231.89" 
          trend={20.1} 
          trendLabel="from last month"
          icon={<DollarSign className="w-5 h-5" />} 
        />
        <KPICard 
          title="Total Expenses" 
          value="$23,194.00" 
          trend={-4.5} 
          trendLabel="from last month"
          icon={<TrendingDown className="w-5 h-5" />} 
        />
        <KPICard 
          title="Net Profit" 
          value="$22,037.89" 
          trend={12.5} 
          trendLabel="from last month"
          icon={<TrendingUp className="w-5 h-5" />} 
        />
        <KPICard 
          title="Health Score" 
          value="92/100" 
          trend={2.4} 
          trendLabel="from last month"
          icon={<Activity className="w-5 h-5" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <CashFlowChart />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">AI Financial Insights</h3>
            <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-semibold rounded-full">Beta</span>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <h4 className="font-medium text-primary mb-1">Cash Flow Alert</h4>
              <p className="text-sm text-foreground/70">Based on historical trends, you are projected to have a cash deficit of $4,500 in mid-August. Consider delaying the upcoming software purchase.</p>
            </div>
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
              <h4 className="font-medium text-primary mb-1">Expense Optimization</h4>
              <p className="text-sm text-foreground/70">Your SaaS subscriptions have increased by 15% this quarter. Reviewing inactive accounts could save up to $850/month.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
