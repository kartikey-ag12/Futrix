"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Jan", revenue: 4000, expense: 2400 },
  { name: "Feb", revenue: 3000, expense: 1398 },
  { name: "Mar", revenue: 2000, expense: 9800 },
  { name: "Apr", revenue: 2780, expense: 3908 },
  { name: "May", revenue: 1890, expense: 4800 },
  { name: "Jun", revenue: 2390, expense: 3800 },
  { name: "Jul", revenue: 3490, expense: 4300 },
];

export function RevenueChart() {
  return (
    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Revenue vs Expenses</h3>
      <div className="h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-foreground)" }} opacity={0.5} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-foreground)" }} opacity={0.5} />
            <Tooltip 
              contentStyle={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", borderRadius: "8px" }}
              itemStyle={{ color: "var(--color-foreground)" }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
            <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
