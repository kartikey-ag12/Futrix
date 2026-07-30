"use client";

import { useMemo, memo } from "react";

// Module-scope formatter — created once, never re-instantiated on re-render
const _fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const fmtCurrency = (val: number) => _fmt.format(val);
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RevenueChartProps {
  totalRevenue?: number;
  totalExpenses?: number;
}

function RevenueChartBase({
  totalRevenue = 45231.89,
  totalExpenses = 23194.0,
}: RevenueChartProps) {
  // Dynamically generate monthly data based on actual total revenue & expenses
  const chartData = useMemo(() => {
    const revBase = totalRevenue || 45231.89;
    const expBase = totalExpenses || 23194.0;

    // Monthly proportions leading up to the current month (Jul)
    const revMultipliers = [0.65, 0.72, 0.78, 0.85, 0.92, 0.96, 1.0];
    const expMultipliers = [0.82, 0.85, 0.79, 0.88, 0.94, 0.91, 1.0];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

    return months.map((month, i) => ({
      name: month,
      revenue: Math.round(revBase * revMultipliers[i]),
      expense: Math.round(expBase * expMultipliers[i]),
    }));
  }, [totalRevenue, totalExpenses]);

  // fmtCurrency is now at module scope — no re-instantiation

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "var(--color-foreground)" }}
            opacity={0.5}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "var(--color-foreground)" }}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            opacity={0.5}
          />
          <Tooltip
            formatter={(value: any) => [fmtCurrency(Number(value)), ""]}
            contentStyle={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              fontSize: "12px",
            }}
            itemStyle={{ color: "var(--color-foreground)", fontWeight: 600 }}
          />
          <Area
            type="monotone"
            name="Revenue"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
          <Area
            type="monotone"
            name="Expenses"
            dataKey="expense"
            stroke="#ef4444"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorExpense)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// memo prevents re-render when parent re-renders with same props
export const RevenueChart = memo(RevenueChartBase);
