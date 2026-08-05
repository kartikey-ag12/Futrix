"use client";

import { useMemo } from "react";
import { 
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, 
  XAxis, YAxis, Tooltip, CartesianGrid 
} from "recharts";
import { WidgetConfig } from "@/hooks/useTemplates";
import { useXeroData } from "@/hooks/useXeroData";

// Hardcoded mock data from CashFlowDashboard for "cash-out" and "cash-in"
const INVOICE_CHART_DATA = [
  { name: "Unpaid", value: 45000, fill: "#10b981" },
  { name: "Avg Rev", value: 38000, fill: "#9ca3af" },
];

const BILLS_CHART_DATA = [
  { name: "Unpaid", value: 12500, fill: "#f43f5e" },
  { name: "Avg Cost", value: 15000, fill: "#9ca3af" },
];

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
}

interface DynamicWidgetProps {
  config: WidgetConfig;
}

export function DynamicWidget({ config }: DynamicWidgetProps) {
  const { data, isLoading } = useXeroData();

  const widgetData = useMemo(() => {
    if (config.dataset === "cash-in") return INVOICE_CHART_DATA;
    if (config.dataset === "cash-out") return BILLS_CHART_DATA;
    
    // For top-sales and top-expenses, use the real Xero data
    if (config.dataset === "top-sales") {
      return (data?.metrics?.incomeItems || []).map((item: any) => ({
        name: item.label,
        value: item.amount,
        fill: "#10b981"
      })).slice(0, 5);
    }
    
    if (config.dataset === "top-expenses") {
      return (data?.metrics?.expenseCategories || []).map((item: any) => ({
        name: item.label,
        value: item.amount,
        fill: "#f43f5e"
      })).slice(0, 5);
    }
    
    return [];
  }, [config.dataset, data]);

  const COLORS = ['#10b981', '#f43f5e', '#3b82f6', '#f59e0b', '#8b5cf6'];

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading data...</div>;
  }

  const renderChart = () => {
    if (!widgetData || widgetData.length === 0) {
      return <div className="text-sm text-foreground/50">No data available for this dataset.</div>;
    }

    if (config.chartType === "bar-vertical" || config.chartType === "bar-horizontal") {
      const isHorizontal = config.chartType === "bar-horizontal";
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={widgetData} 
            layout={isHorizontal ? "vertical" : "horizontal"}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={!isHorizontal} horizontal={isHorizontal} stroke="rgba(255,255,255,0.1)" />
            {isHorizontal ? (
              <>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "currentColor" }} className="text-foreground/60" width={80} />
              </>
            ) : (
              <>
                <XAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "currentColor" }} className="text-foreground/60" />
                <YAxis type="number" hide />
              </>
            )}
            <Tooltip 
              cursor={{ fill: "rgba(0,0,0,0.04)" }} 
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px", backgroundColor: "#222", color: "#fff" }} 
              formatter={(value: any) => formatCurrency(Number(value))}
            />
            <Bar dataKey="value" radius={[4, 4, 4, 4]}>
              {widgetData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (config.chartType === "pie" || config.chartType === "donut") {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip 
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px", backgroundColor: "#222", color: "#fff" }} 
              formatter={(value: any) => formatCurrency(Number(value))}
            />
            <Pie
              data={widgetData}
              cx="50%"
              cy="50%"
              innerRadius={config.chartType === "donut" ? 60 : 0}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {widgetData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      );
    }
    
    if (config.chartType === "table") {
      return (
        <div className="w-full h-full overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-foreground/50 uppercase bg-foreground/5">
              <tr>
                <th className="px-4 py-2 rounded-l">Item</th>
                <th className="px-4 py-2 rounded-r text-right">Value</th>
              </tr>
            </thead>
            <tbody>
              {widgetData.map((row: any, i: number) => (
                <tr key={i} className="border-b border-foreground/5 last:border-0">
                  <td className="px-4 py-2 font-medium">{row.name}</td>
                  <td className="px-4 py-2 text-right tabular-nums">{formatCurrency(row.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    
    if (config.chartType === "scoreboard") {
      const total = widgetData.reduce((acc: number, curr: any) => acc + curr.value, 0);
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-4xl font-bold tabular-nums text-foreground">{formatCurrency(total)}</p>
          <p className="text-sm text-foreground/50 mt-2">Total</p>
        </div>
      );
    }

    return <div className="text-sm text-foreground/50">Chart type not supported yet.</div>;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center pt-2">
      {renderChart()}
    </div>
  );
}
