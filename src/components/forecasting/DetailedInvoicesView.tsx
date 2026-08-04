"use client";

import { useState, useEffect, useMemo } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { 
  ChevronDown, Filter, ArrowUpDown, Calendar, AlertTriangle
} from "lucide-react";
import clsx from "clsx";

export interface DueInvoice {
  id: string;
  type: "Invoice" | "Bill";
  contact: string;
  amount: number;
  amountDue: number;
  date: string;
  dueDate: string;
  reference: string;
  isOverdue: boolean;
  daysDiff: number;
}

function formatDollar(val: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
}

function getRelativeDateLabel(daysDiff: number, isOverdue: boolean, dueDate: string) {
  if (!dueDate) return "No due date";
  const formattedDate = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(dueDate));
  if (daysDiff === 0) return `Today on ${formattedDate}`;
  if (daysDiff === 1) return `In 1 day on ${formattedDate}`;
  if (daysDiff < 0) return `Today (overdue) on ${formattedDate}`;
  return `In ${daysDiff} days on ${formattedDate}`;
}

export function DetailedInvoicesView() {
  const [data, setData] = useState<DueInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
  const [sorting, setSorting] = useState<SortingState>([]);
  const [activeTab, setActiveTab] = useState("invoices");

  useEffect(() => {
    const fetchDueInvoices = async () => {
      try {
        const res = await fetch("/api/xero/due-invoices");
        if (res.ok) {
          const json = await res.json();
          setData(json.invoices || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDueInvoices();
  }, []);

  const toggleExclude = (id: string) => {
    setExcludedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // Cash Flow Calculations
  const calculations = useMemo(() => {
    let invoicesTotal = 0;
    let billsTotal = 0;

    data.forEach(inv => {
      if (!excludedIds.has(inv.id)) {
        if (inv.type === "Invoice") invoicesTotal += inv.amountDue;
        else if (inv.type === "Bill") billsTotal += inv.amountDue;
      }
    });

    const netCashFlow = invoicesTotal - billsTotal;
    return { invoicesTotal, billsTotal, netCashFlow };
  }, [data, excludedIds]);

  const columnHelper = createColumnHelper<DueInvoice>();

  const columns = useMemo(() => [
    columnHelper.accessor("type", {
      header: "Type",
      cell: (info) => {
        const type = info.getValue();
        const isInvoice = type === "Invoice";
        return (
          <div className="flex items-center">
            <div className={clsx("w-1 h-6 rounded-full mr-3", isInvoice ? "bg-teal-500" : "bg-pink-500")} />
            <span className="text-sm font-medium text-foreground">{type}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor("contact", {
      header: "Contact",
      cell: (info) => <span className="text-sm font-medium text-foreground">{info.getValue()}</span>,
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => <span className="text-sm tabular-nums text-foreground/70">{formatDollar(info.getValue())}</span>,
    }),
    columnHelper.accessor("amountDue", {
      header: "Amount Due",
      cell: (info) => <span className="text-sm tabular-nums font-semibold text-foreground">{formatDollar(info.getValue())}</span>,
    }),
    columnHelper.accessor("dueDate", {
      header: "Adds to/Reduces Cash Flow",
      cell: (info) => {
        const row = info.row.original;
        const isExcluded = excludedIds.has(row.id);
        const isInvoice = row.type === "Invoice";
        
        return (
          <div className="flex items-center justify-between w-full min-w-[280px]">
            <div className={clsx(
              "flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium transition-colors",
              isExcluded 
                ? "bg-foreground/5 text-foreground/40" 
                : isInvoice 
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" 
                  : "bg-rose-500/10 text-rose-700 dark:text-rose-400"
            )}>
              <Calendar className="w-3.5 h-3.5" />
              {getRelativeDateLabel(row.daysDiff, row.isOverdue, row.dueDate)}
            </div>
            
            <button 
              onClick={() => toggleExclude(row.id)}
              className={clsx(
                "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors ml-2",
                isExcluded ? "bg-foreground/10 text-foreground hover:bg-foreground/20" : "bg-white dark:bg-[#222] border border-[#e5e5e5] dark:border-white/10 shadow-sm hover:bg-foreground/5"
              )}
            >
              {row.isOverdue && !isExcluded && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
              {isExcluded ? "Include" : "Exclude"}
            </button>
          </div>
        );
      },
    }),
    columnHelper.accessor("reference", {
      header: "Reference",
      cell: (info) => <span className="text-sm text-foreground/50">{info.getValue() || "—"}</span>,
    }),
    columnHelper.accessor("date", {
      header: "Issued On",
      cell: (info) => <span className="text-sm text-foreground/70">{info.getValue() ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(info.getValue())) : "—"}</span>,
    }),
    columnHelper.accessor("dueDate", {
      id: "rawDueDate",
      header: "Due Date",
      cell: (info) => <span className="text-sm text-foreground/70">{info.getValue() ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).format(new Date(info.getValue())) : "—"}</span>,
    }),
  ], [excludedIds, columnHelper]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto">
      
      {/* Sub-tabs */}
      <div className="flex items-center gap-1 border-b border-[#e5e5e5] dark:border-white/10 mb-6">
        <button 
          onClick={() => setActiveTab("invoices")}
          className={clsx(
            "px-5 py-2.5 text-sm font-medium border-b-2 transition-colors",
            activeTab === "invoices" ? "border-emerald-500 text-foreground" : "border-transparent text-foreground/50 hover:text-foreground"
          )}
        >
          Invoices & Bills
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">Cash increase/decrease from due invoices and bills</span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e5e5e5] dark:border-white/10 bg-white dark:bg-[#111] text-sm text-foreground/70 hover:text-foreground transition-colors shadow-sm ml-2">
            All
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Calculation Row */}
      <div className="flex items-center gap-3 p-4 bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/10 rounded-xl shadow-sm mb-6 w-fit">
        <div className="flex items-center gap-2">
          <span className="text-emerald-600 font-semibold text-lg">{formatDollar(calculations.invoicesTotal)}</span>
          <span className="text-sm text-foreground/60">Invoices increasing cash flow</span>
        </div>
        <span className="text-foreground/30 font-medium">+</span>
        <div className="flex items-center gap-2">
          <span className="text-rose-500 font-semibold text-lg">-{formatDollar(calculations.billsTotal)}</span>
          <span className="text-sm text-foreground/60">Bills decreasing cash flow</span>
        </div>
        <span className="text-foreground/30 font-medium">=</span>
        <div className="flex items-center gap-2 pl-2">
          <span className={clsx("font-bold text-xl", calculations.netCashFlow >= 0 ? "text-emerald-600" : "text-rose-500")}>
            {calculations.netCashFlow >= 0 ? "+" : ""}{formatDollar(calculations.netCashFlow)}
          </span>
          <span className="text-sm font-medium text-foreground/80">Increase in net cash flow</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/10 rounded-xl shadow-sm flex flex-col flex-1 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto w-full flex-1">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-[#e5e5e5] dark:border-white/10 bg-[#fcfcfc] dark:bg-[#1a1a1a]">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3 text-xs font-semibold text-foreground/60 whitespace-nowrap">
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-2">
                          <button
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <ArrowUpDown className="w-3 h-3 text-emerald-500" />,
                              desc: <ArrowUpDown className="w-3 h-3 text-emerald-500 rotate-180" />,
                            }[header.column.getIsSorted() as string] ?? (
                              <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                            )}
                          </button>
                          <button className="p-1 hover:bg-foreground/5 rounded text-foreground/40 hover:text-foreground transition-colors ml-auto">
                            <Filter className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-[#e5e5e5] dark:divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-16 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-16 text-center text-sm text-foreground/50">
                    No due invoices or bills found in Xero.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => {
                  const isExcluded = excludedIds.has(row.original.id);
                  return (
                    <tr 
                      key={row.id} 
                      className={clsx(
                        "transition-colors group hover:bg-foreground/[0.015]",
                        isExcluded ? "opacity-50 bg-foreground/[0.02]" : ""
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 align-middle">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
