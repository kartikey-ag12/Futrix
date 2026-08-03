"use client";

import { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Play, ChevronDown, Filter, ArrowUpDown } from "lucide-react";
import clsx from "clsx";

// ── Types & Mock Data ────────────────────────────────────────────────────────

type ContactType = "Customer" | "Supplier";

interface ContactRow {
  id: string;
  type: ContactType;
  contact: string;
  totalDue: number;
  totalOverdue: number;
  totalInvoiced: number;
  invoicesDue: number;
  averageSale: number;
  daysToPay: number;
  dependence: number;
  lastActivity: string;
}

const MOCK_DATA: ContactRow[] = [
  { id: "1", type: "Customer", contact: "Acme Corp", totalDue: 12500, totalOverdue: 2500, totalInvoiced: 45000, invoicesDue: 3, averageSale: 4500, daysToPay: 22, dependence: 15, lastActivity: "2024-08-01" },
  { id: "2", type: "Supplier", contact: "Tech Solutions", totalDue: 8200, totalOverdue: 0, totalInvoiced: 24000, invoicesDue: 2, averageSale: 3000, daysToPay: 14, dependence: 8, lastActivity: "2024-08-02" },
  { id: "3", type: "Customer", contact: "Global Industries", totalDue: 34000, totalOverdue: 12000, totalInvoiced: 120000, invoicesDue: 5, averageSale: 12000, daysToPay: 45, dependence: 35, lastActivity: "2024-07-28" },
  { id: "4", type: "Supplier", contact: "Office Supplies Co", totalDue: 450, totalOverdue: 0, totalInvoiced: 3200, invoicesDue: 1, averageSale: 400, daysToPay: 7, dependence: 1, lastActivity: "2024-08-03" },
  { id: "5", type: "Customer", contact: "Stark Enterprises", totalDue: 0, totalOverdue: 0, totalInvoiced: 85000, invoicesDue: 0, averageSale: 8500, daysToPay: 30, dependence: 22, lastActivity: "2024-07-15" },
];

function formatDollar(val: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);
}

// ── Column Definitions ────────────────────────────────────────────────────────

const columnHelper = createColumnHelper<ContactRow>();

const columns = [
  columnHelper.accessor("type", {
    header: "Type",
    cell: (info) => {
      const type = info.getValue();
      const isCustomer = type === "Customer";
      return (
        <div className="flex items-center">
          <div className={clsx("w-1 h-5 rounded-full mr-2", isCustomer ? "bg-teal-500" : "bg-rose-500")} />
          <span className="text-sm font-medium">{type}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor("contact", {
    header: "Contact",
    cell: (info) => <span className="text-sm font-semibold text-foreground">{info.getValue()}</span>,
  }),
  columnHelper.accessor("totalDue", {
    header: "Total Due",
    cell: (info) => <span className="text-sm tabular-nums">{formatDollar(info.getValue())}</span>,
  }),
  columnHelper.accessor("totalOverdue", {
    header: "Total Overdue",
    cell: (info) => {
      const val = info.getValue();
      return (
        <span className={clsx("text-sm tabular-nums font-medium", val > 0 ? "text-rose-500" : "text-foreground")}>
          {formatDollar(val)}
        </span>
      );
    },
  }),
  columnHelper.accessor("totalInvoiced", {
    header: "Total Invoiced",
    cell: (info) => <span className="text-sm tabular-nums">{formatDollar(info.getValue())}</span>,
  }),
  columnHelper.accessor("invoicesDue", {
    header: "Invoices Due",
    cell: (info) => <span className="text-sm tabular-nums">{info.getValue()}</span>,
  }),
  columnHelper.accessor("averageSale", {
    header: "Average Sale",
    cell: (info) => <span className="text-sm tabular-nums">{formatDollar(info.getValue())}</span>,
  }),
  columnHelper.accessor("daysToPay", {
    header: "Days to Pay",
    cell: (info) => <span className="text-sm tabular-nums">{info.getValue()}</span>,
  }),
  columnHelper.accessor("dependence", {
    header: "Dependence (%)",
    cell: (info) => <span className="text-sm tabular-nums">{info.getValue()}%</span>,
  }),
  columnHelper.accessor("lastActivity", {
    header: "Last Activity",
    cell: (info) => <span className="text-sm text-foreground/60">{info.getValue()}</span>,
  }),
];

// ── Main Component ────────────────────────────────────────────────────────────

export function CustomersSuppliersTable() {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: MOCK_DATA,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-foreground">Customers & Suppliers</h1>
          <button className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-semibold hover:bg-emerald-500/20 transition-colors">
            <Play className="w-3 h-3 fill-emerald-600" />
            Virtual demo
          </button>
        </div>
        
        <button className="flex items-center gap-2 px-3 py-1.5 border border-[#e5e5e5] dark:border-white/10 rounded-lg text-sm hover:bg-foreground/5 transition-colors">
          <span>Last 24 months</span>
          <ChevronDown className="w-4 h-4 text-foreground/50" />
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[1000px] text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-[#e5e5e5] dark:border-white/8 bg-foreground/[0.02]">
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
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-[#e5e5e5] dark:border-white/4 hover:bg-foreground/[0.015] transition-colors last:border-0">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-foreground/50">
                    No customers or suppliers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
