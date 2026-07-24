"use client";

import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import { TrendingUp, TrendingDown, RefreshCcw } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";

export default function ForecastingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Financial Forecasting</h2>
          <p className="text-foreground/60 text-sm mt-1">AI-driven cash flow projections and scenario planning.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          <RefreshCcw className="w-4 h-4" />
          Update Forecast
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard 
          title="Projected End of Q3 Balance" 
          value="$142,500.00" 
          trend={15.2} 
          trendLabel="vs current balance"
          icon={<TrendingUp className="w-5 h-5" />} 
        />
        <KPICard 
          title="Estimated Burn Rate" 
          value="$15,200/mo" 
          trend={-2.1} 
          trendLabel="vs last month"
          icon={<TrendingDown className="w-5 h-5" />} 
        />
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-center">
          <h3 className="text-sm font-medium text-foreground/60 mb-2">Scenario Analysis</h3>
          <select className="w-full bg-background border border-border text-foreground rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer">
            <option>Base Case (Most Likely)</option>
            <option>Best Case (+20% Revenue)</option>
            <option>Worst Case (+15% Expenses)</option>
          </select>
          {/* Custom dropdown arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center px-2 text-foreground/50 mt-7">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">6-Month Runway Projection</h3>
          <p className="text-sm text-foreground/60">Includes committed recurring expenses and projected sales pipelines.</p>
        </div>
        
        {/* We can reuse the CashFlow chart here to demonstrate the projection view */}
        <div className="h-[400px]">
          <CashFlowChart />
        </div>
      </div>
    </div>
  );
}
