"use client";

import { useMemo, memo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

// Module-scope formatter — created once, never re-instantiated on re-render
const _fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const fmtCurrency = (val: number) => _fmt.format(val);

interface CashFlowChartProps {
  totalRevenue?: number;
  totalExpenses?: number;
}

function CashFlowChartBase({
  totalRevenue = 45231.89,
  totalExpenses = 23194.0,
}: CashFlowChartProps) {
  // Dynamically compute net cash flow projections based on revenue & expense data
  const chartData = useMemo(() => {
    const rev = totalRevenue || 45231.89;
    const exp = totalExpenses || 23194.0;
    const currentNet = rev - exp;

    // Projected net cash flow velocity over 9 months
    const monthlyFactors = [0.4, 0.65, -0.2, 0.45, 0.8, 0.95, 1.0, 1.15, 1.25];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];

    return months.map((month, i) => {
      const netVal = Math.round(currentNet * monthlyFactors[i]);
      return {
        name: month,
        cashflow: netVal,
      };
    });
  }, [totalRevenue, totalExpenses]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
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
            formatter={(value: any) => [fmtCurrency(Number(value)), "Net Cash Flow"]}
            cursor={{ fill: "var(--color-foreground)", opacity: 0.04 }}
            contentStyle={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              fontSize: "12px",
            }}
            itemStyle={{ color: "var(--color-foreground)", fontWeight: 600 }}
          />
          <Bar dataKey="cashflow" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.cashflow < 0 ? "#ef4444" : "#10b981"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// memo prevents re-render when parent re-renders with same props
export const CashFlowChart = memo(CashFlowChartBase);
