"use client";

import Link from "next/link";

import { ArrowUpRight, ChevronDown } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { useXeroData } from "@/hooks/useXeroData";

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
}

// ── Components ────────────────────────────────────────────────────────────────

export function ProfitLossDashboard({ isBuilderMode }: { isBuilderMode?: boolean }) {
  const { data, isLoading } = useXeroData();

  const topSales = (data?.metrics?.incomeItems || []).map((item: any) => ({
    name: item.label,
    amount: item.amount,
    percentage: parseFloat(item.pct) || 0,
    fill: "#10b981"
  }));

  const topCosts = (data?.metrics?.expenseCategories || []).map((item: any) => ({
    name: item.label,
    amount: item.amount,
    percentage: parseFloat(item.pct) || 0,
    fill: "#f43f5e"
  }));

  // Group transactions by month for the last 12 months (mocking missing months for display)
  const monthlyDataMap: Record<string, { income: number; expenses: number }> = {};
  
  // Initialize last 12 months
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    monthlyDataMap[label] = { income: 0, expenses: 0 };
  }

  // Aggregate transactions
  if (data?.transactions) {
    data.transactions.forEach((tx: any) => {
      const d = new Date(tx.date);
      const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (monthlyDataMap[label]) {
        if (tx.type === "revenue") monthlyDataMap[label].income += Math.abs(tx.amount);
        else monthlyDataMap[label].expenses += Math.abs(tx.amount);
      }
    });
  }

  let ytdIncome = 0;
  let ytdExpenses = 0;

  const monthlyData = Object.keys(monthlyDataMap).map(label => {
    const d = monthlyDataMap[label];
    ytdIncome += d.income;
    ytdExpenses += d.expenses;
    const net = d.income - d.expenses;
    const grossMargin = d.income > 0 ? Math.round((net / d.income) * 100) : 0;
    return { monthLabel: label, income: d.income, expenses: d.expenses, net, grossMargin };
  });

  const ytd = {
    income: ytdIncome,
    expenses: ytdExpenses,
    net: ytdIncome - ytdExpenses,
  };

  const pieData = topSales.slice(0, 3).map((item: any) => ({ name: item.name, value: item.amount, color: item.fill }))
    .concat(topCosts.slice(0, 3).map((item: any, i: number) => ({ name: item.name, value: item.amount, color: ['#f43f5e', '#fb923c', '#eab308'][i] || '#cbd5e1' })));

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Profit & Loss Dashboard</h1>
        
        {!isBuilderMode && (
          <Link href="/reporting/builder?templateId=futrix-pl-dash" className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors">
            Edit in reporting
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <h2 className="text-base font-semibold text-foreground mt-2">Top performers</h2>
      
      {/* Top performers: Sales & Costs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Top sales accounts */}
        <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-foreground mb-1">Top sales accounts</h3>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-[#e5e5e5] dark:border-white/10 rounded-lg text-xs font-medium hover:bg-foreground/5 transition-colors">
              <span>This financial year</span>
              <ChevronDown className="w-3 h-3 text-foreground/50" />
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[300px]">
                <thead>
                  <tr className="border-b border-[#e5e5e5] dark:border-white/8">
                    <th className="py-2 text-xs font-semibold text-foreground/60">Name</th>
                    <th className="py-2 px-3 text-xs font-semibold text-foreground/60 text-right">Amount</th>
                    <th className="py-2 pl-3 text-xs font-semibold text-foreground/60 text-right">% of Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topSales.length === 0 && !isLoading && (
                    <tr><td colSpan={3} className="py-4 text-center text-sm text-foreground/50">No sales data found</td></tr>
                  )}
                  {topSales.map((item: any) => (
                    <tr key={item.name} className="border-b border-[#e5e5e5] dark:border-white/4 last:border-0">
                      <td className="py-2.5 text-sm font-medium text-foreground">{item.name}</td>
                      <td className="py-2.5 px-3 text-sm tabular-nums text-right">{formatCurrency(item.amount)}</td>
                      <td className="py-2.5 pl-3 text-sm tabular-nums text-right">{item.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="w-full sm:w-[120px] h-[140px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSales} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" hide />
                  <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px" }} />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top cost & expense accounts */}
        <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-foreground mb-1">Top cost & expense accounts</h3>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-[#e5e5e5] dark:border-white/10 rounded-lg text-xs font-medium hover:bg-foreground/5 transition-colors">
              <span>This financial year</span>
              <ChevronDown className="w-3 h-3 text-foreground/50" />
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[300px]">
                <thead>
                  <tr className="border-b border-[#e5e5e5] dark:border-white/8">
                    <th className="py-2 text-xs font-semibold text-foreground/60">Name</th>
                    <th className="py-2 px-3 text-xs font-semibold text-foreground/60 text-right">Amount</th>
                    <th className="py-2 pl-3 text-xs font-semibold text-foreground/60 text-right">% of Costs</th>
                  </tr>
                </thead>
                <tbody>
                  {topCosts.length === 0 && !isLoading && (
                    <tr><td colSpan={3} className="py-4 text-center text-sm text-foreground/50">No cost data found</td></tr>
                  )}
                  {topCosts.map((item: any) => (
                    <tr key={item.name} className="border-b border-[#e5e5e5] dark:border-white/4 last:border-0">
                      <td className="py-2.5 text-sm font-medium text-foreground">{item.name}</td>
                      <td className="py-2.5 px-3 text-sm tabular-nums text-right">{formatCurrency(item.amount)}</td>
                      <td className="py-2.5 pl-3 text-sm tabular-nums text-right">{item.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="w-full sm:w-[120px] h-[140px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topCosts} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" hide />
                  <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "12px" }} />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* Full Profit & Loss Dashboard */}
      <h2 className="text-base font-semibold text-foreground mt-4">Profit & Loss</h2>
      <p className="text-xs text-foreground/50 mb-4">Last month and the prior 11</p>
      
      {/* 1) Data Table */}
      <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl p-0 shadow-sm overflow-x-auto mb-6">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-[#e5e5e5] dark:border-white/8 bg-[#fafafa] dark:bg-white/5">
              <th className="py-2.5 px-4 text-xs font-semibold text-foreground/60 w-48">Account</th>
              {monthlyData.map((m) => (
                <th key={m.monthLabel} className="py-2.5 px-3 text-xs font-semibold text-foreground/60 text-right min-w-[80px]">
                  {m.monthLabel}
                </th>
              ))}
              <th className="py-2.5 px-4 text-xs font-semibold text-foreground/60 text-right min-w-[90px]">YTD</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#e5e5e5] dark:border-white/4 hover:bg-foreground/[0.02]">
              <td className="py-2 px-4 text-sm font-semibold text-foreground">Income</td>
              {monthlyData.map((m) => <td key={m.monthLabel} className="py-2 px-3 text-sm tabular-nums text-right text-foreground/80">{formatCurrency(m.income)}</td>)}
              <td className="py-2 px-4 text-sm tabular-nums text-right font-semibold">{formatCurrency(ytd.income)}</td>
            </tr>
            <tr className="border-b border-[#e5e5e5] dark:border-white/4 hover:bg-foreground/[0.02]">
              <td className="py-2 px-4 text-sm font-semibold text-foreground">Cost of Sales</td>
              {monthlyData.map((m) => <td key={m.monthLabel} className="py-2 px-3 text-sm tabular-nums text-right text-foreground/80">{formatCurrency(0)}</td>)}
              <td className="py-2 px-4 text-sm tabular-nums text-right font-semibold">{formatCurrency(0)}</td>
            </tr>
            <tr className="border-b border-[#e5e5e5] dark:border-white/4 bg-[#fafafa] dark:bg-white/5">
              <td className="py-2 px-4 text-sm font-semibold text-foreground">Gross Profit</td>
              {monthlyData.map((m) => <td key={m.monthLabel} className="py-2 px-3 text-sm tabular-nums text-right text-foreground">{formatCurrency(m.income)}</td>)}
              <td className="py-2 px-4 text-sm tabular-nums text-right font-bold text-emerald-600">{formatCurrency(ytd.income)}</td>
            </tr>
            <tr className="border-b border-[#e5e5e5] dark:border-white/4 hover:bg-foreground/[0.02]">
              <td className="py-2 px-4 text-sm font-semibold text-foreground/60">Gross Profit %</td>
              {monthlyData.map((m) => <td key={m.monthLabel} className="py-2 px-3 text-sm tabular-nums text-right text-foreground/60">{m.income > 0 ? "100%" : "-"}</td>)}
              <td className="py-2 px-4 text-sm tabular-nums text-right font-semibold text-foreground/60">{ytd.income > 0 ? "100%" : "-"}</td>
            </tr>
            <tr className="border-b border-[#e5e5e5] dark:border-white/4 hover:bg-foreground/[0.02]">
              <td className="py-2 px-4 text-sm font-semibold text-foreground">Expenses</td>
              {monthlyData.map((m) => <td key={m.monthLabel} className="py-2 px-3 text-sm tabular-nums text-right text-foreground/80">{formatCurrency(m.expenses)}</td>)}
              <td className="py-2 px-4 text-sm tabular-nums text-right font-semibold">{formatCurrency(ytd.expenses)}</td>
            </tr>
            <tr className="border-b border-[#e5e5e5] dark:border-white/4 hover:bg-foreground/[0.02]">
              <td className="py-2 px-4 text-sm font-semibold text-foreground">Operating Profit</td>
              {monthlyData.map((m) => <td key={m.monthLabel} className="py-2 px-3 text-sm tabular-nums text-right text-foreground/80">{formatCurrency(m.net)}</td>)}
              <td className="py-2 px-4 text-sm tabular-nums text-right font-semibold">{formatCurrency(ytd.net)}</td>
            </tr>
            <tr className="border-b border-[#e5e5e5] dark:border-white/4 hover:bg-foreground/[0.02]">
              <td className="py-2 px-4 text-sm font-semibold text-foreground/60">Operating Profit %</td>
              {monthlyData.map((m) => <td key={m.monthLabel} className="py-2 px-3 text-sm tabular-nums text-right text-foreground/60">{m.income > 0 ? Math.round((m.net/m.income)*100) + "%" : "-"}</td>)}
              <td className="py-2 px-4 text-sm tabular-nums text-right font-semibold text-foreground/60">{ytd.income > 0 ? Math.round((ytd.net/ytd.income)*100) + "%" : "-"}</td>
            </tr>
            <tr className="border-b border-[#e5e5e5] dark:border-white/4 bg-emerald-50 dark:bg-emerald-900/10">
              <td className="py-2 px-4 text-sm font-semibold text-foreground">Net Profit</td>
              {monthlyData.map((m) => <td key={m.monthLabel} className="py-2 px-3 text-sm tabular-nums text-right text-emerald-700 dark:text-emerald-400 font-semibold">{formatCurrency(m.net)}</td>)}
              <td className="py-2 px-4 text-sm tabular-nums text-right font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(ytd.net)}</td>
            </tr>
            <tr className="hover:bg-foreground/[0.02]">
              <td className="py-2 px-4 text-sm font-semibold text-foreground/60">Net Profit %</td>
              {monthlyData.map((m) => <td key={m.monthLabel} className="py-2 px-3 text-sm tabular-nums text-right text-foreground/60">{m.income > 0 ? Math.round((m.net/m.income)*100) + "%" : "-"}</td>)}
              <td className="py-2 px-4 text-sm tabular-nums text-right font-semibold text-foreground/60">{ytd.income > 0 ? Math.round((ytd.net/ytd.income)*100) + "%" : "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2) Charts Grid Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl p-5 shadow-sm flex flex-col h-[350px]">
          <h3 className="text-sm font-bold mb-1">Income</h3>
          <p className="text-xs text-foreground/50 mb-6">Last month and prior 11</p>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <XAxis dataKey="monthLabel" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} tickFormatter={(val) => `$${val}`} />
                <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                <Bar dataKey="income" fill="#69f0ae" radius={[2, 2, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl p-5 shadow-sm flex flex-col h-[350px]">
          <h3 className="text-sm font-bold mb-1">Gross Profit %</h3>
          <p className="text-xs text-foreground/50 mb-6">Last month and prior 11</p>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <XAxis dataKey="monthLabel" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} tickFormatter={(val) => `${val}%`} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="grossMargin" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3, fill: '#0ea5e9' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3) Charts Grid Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl p-5 shadow-sm flex flex-col h-[350px]">
          <h3 className="text-sm font-bold mb-1">Profit & Loss breakdown</h3>
          <p className="text-xs text-foreground/50 mb-2">Last month</p>
          <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={100}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-foreground/40">No breakdown data available</p>
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            {pieData.map((entry: any, index: number) => (
              <div key={`legend-${entry.name}-${index}`} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
                <span className="text-[10px] text-foreground/70">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl p-5 shadow-sm flex flex-col h-[350px]">
          <h3 className="text-sm font-bold mb-1">Net Profit</h3>
          <p className="text-xs text-foreground/50 mb-6">Last month and prior 11</p>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="monthLabel" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#888' }} tickFormatter={(val) => `$${val}`} />
                <Tooltip />
                <Area type="monotone" dataKey="net" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorNet)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}
