"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { name: "Jan", cashflow: 1600 },
  { name: "Feb", cashflow: 1602 },
  { name: "Mar", cashflow: -7800 },
  { name: "Apr", cashflow: -1128 },
  { name: "May", cashflow: -2910 },
  { name: "Jun", cashflow: -1410 },
  { name: "Jul", cashflow: -810 },
  { name: "Aug", cashflow: 2500 },
  { name: "Sep", cashflow: 3200 },
];

export function CashFlowChart() {
  return (
    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Cash Flow Projection</h3>
      <div className="h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-foreground)" }} opacity={0.5} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-foreground)" }} opacity={0.5} />
            <Tooltip 
              cursor={{ fill: "var(--color-foreground)", opacity: 0.05 }}
              contentStyle={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", borderRadius: "8px" }}
            />
            <Bar dataKey="cashflow" fill="#047857" radius={[4, 4, 0, 0]}>
              {
                data.map((entry, index) => (
                  <cell key={`cell-${index}`} fill={entry.cashflow < 0 ? "#ef4444" : "#047857"} />
                ))
              }
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
