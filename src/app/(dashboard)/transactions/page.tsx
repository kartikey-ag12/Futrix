"use client";

import { useState, useMemo } from "react";
import {
  createColumnHelper, flexRender,
  getCoreRowModel, useReactTable, getSortedRowModel,
  getFilteredRowModel, getPaginationRowModel, type SortingState,
} from "@tanstack/react-table";
import {
  Search, Download, Filter, ArrowUpDown,
  ArrowUpRight, ArrowDownRight, RefreshCcw, CheckCircle2, Clock, FileSpreadsheet
} from "lucide-react";
import { useFinancial, Transaction } from "@/context/FinancialContext";



const columnHelper = createColumnHelper<Transaction>();

export default function TransactionsPage() {
  const { transactions: data, isSyncing, handleXeroSync } = useFinancial();
  const [sorting, setSorting] = useState<SortingState>([{ id: "date", desc: true }]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "revenue" | "expense">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "cleared" | "pending">("all");

  const handleSelectTypeFilter = (selectedType: "all" | "revenue" | "expense") => {
    if (typeFilter === selectedType && selectedType !== "all") {
      setTypeFilter("all");
    } else {
      setTypeFilter(selectedType);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      return true;
    });
  }, [data, typeFilter, statusFilter]);

  // Metric calculations
  const totalInflow = useMemo(
    () => data.filter(r => r.type === "revenue").reduce((s, r) => s + r.amount, 0),
    [data]
  );
  const totalOutflow = useMemo(
    () => Math.abs(data.filter(r => r.type === "expense").reduce((s, r) => s + r.amount, 0)),
    [data]
  );
  const netPosition = totalInflow - totalOutflow;

  const inflowCount = useMemo(() => data.filter(r => r.type === "revenue").length, [data]);
  const outflowCount = useMemo(() => data.filter(r => r.type === "expense").length, [data]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Math.abs(n));



  // Export to CSV
  const handleExportCSV = () => {
    const headers = ["Date", "Description", "Account", "Type", "Status", "Amount"];
    const rows = filteredData.map(t => [
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${t.account}"`,
      t.type,
      t.status,
      t.amount,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `futrix_transactions_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadInvoice = async (transaction: Transaction) => {
    try {
      const res = await fetch("/api/excel/export/single", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName: transaction.account, 
          description: transaction.description,
          amount: Math.abs(transaction.amount),
          date: transaction.date,
          status: transaction.status,
        })
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const dateStr = transaction.date;
        a.download = `invoice_${dateStr}.xlsx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        alert("Failed to download invoice.");
      }
    } catch (err) {
      console.error(err);
      alert("Error downloading invoice.");
    }
  };

  const columns = [
    columnHelper.accessor("date", {
      header: "Date",
      cell: i => <span className="text-foreground/60 text-xs font-mono">{i.getValue()}</span>,
    }),
    columnHelper.accessor("description", {
      header: "Description",
      cell: i => <span className="font-semibold text-foreground text-sm">{i.getValue()}</span>,
    }),
    columnHelper.accessor("account", {
      header: "Account",
      cell: i => (
        <span className="px-2.5 py-1 bg-foreground/5 border border-border text-foreground/70 rounded-lg text-xs font-medium">
          {i.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: i => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide ${
          i.getValue() === "cleared"
            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
            : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
        }`}>
          {i.getValue() === "cleared" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
          <span className="capitalize">{i.getValue()}</span>
        </span>
      ),
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: i => {
        const v = i.getValue();
        const isPos = v > 0;
        return (
          <div className="flex items-center justify-end gap-1.5 font-bold text-sm">
            {isPos ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                +{fmt(v)}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-red-500 dark:text-red-400">
                <ArrowDownRight className="w-4 h-4 text-red-400" />
                −{fmt(v)}
              </span>
            )}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "",
      cell: i => {
        const transaction = i.row.original;
        return (
          <div className="flex items-center justify-end">
            <button
              onClick={() => handleDownloadInvoice(transaction)}
              className="p-1.5 text-foreground/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-1"
              title="Download as Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="flex flex-col gap-7">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Transactions</h1>
          <p className="text-sm text-foreground/50 mt-0.5">Real-time ledger entries and Xero sync records</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleXeroSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-border rounded-xl text-sm font-medium hover:bg-foreground/10 transition-all disabled:opacity-50"
          >
            <RefreshCcw className={`w-4 h-4 ${isSyncing ? "animate-spin text-primary" : "text-foreground/60"}`} />
            {isSyncing ? "Syncing..." : "Sync Live Data"}
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-xl text-sm font-semibold hover:bg-foreground/90 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* ── Summary strip (Interactive Futrli-style UI) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Inflow Card */}
        <div
          onClick={() => handleSelectTypeFilter("revenue")}
          className={`cursor-pointer p-6 rounded-2xl border transition-all duration-200 shadow-sm relative overflow-hidden group select-none ${
            typeFilter === "revenue"
              ? "bg-emerald-500/10 border-emerald-500/50 ring-2 ring-emerald-500/30 scale-[1.01] shadow-premium"
              : "bg-card border-border hover:border-emerald-500/40 hover:shadow-premium"
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Total Inflow</p>
              <p className="text-2xl font-black text-foreground mt-1">{fmt(totalInflow)}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 flex-shrink-0 group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-foreground/50 border-t border-border/60 pt-3 mt-1">
            <span>{inflowCount} revenue items</span>
            <span className={`font-bold transition-colors ${typeFilter === "revenue" ? "text-emerald-600" : "text-foreground/60 group-hover:text-emerald-600"}`}>
              {typeFilter === "revenue" ? "Active Filter ✓" : "Click to filter →"}
            </span>
          </div>
        </div>

        {/* Total Outflow Card */}
        <div
          onClick={() => handleSelectTypeFilter("expense")}
          className={`cursor-pointer p-6 rounded-2xl border transition-all duration-200 shadow-sm relative overflow-hidden group select-none ${
            typeFilter === "expense"
              ? "bg-red-500/10 border-red-500/50 ring-2 ring-red-500/30 scale-[1.01] shadow-premium"
              : "bg-card border-border hover:border-red-500/40 hover:shadow-premium"
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-red-500 uppercase tracking-wider">Total Outflow</p>
              <p className="text-2xl font-black text-foreground mt-1">{fmt(totalOutflow)}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 flex-shrink-0 group-hover:scale-110 transition-transform">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-foreground/50 border-t border-border/60 pt-3 mt-1">
            <span>{outflowCount} expense items</span>
            <span className={`font-bold transition-colors ${typeFilter === "expense" ? "text-red-500" : "text-foreground/60 group-hover:text-red-500"}`}>
              {typeFilter === "expense" ? "Active Filter ✓" : "Click to filter →"}
            </span>
          </div>
        </div>

        {/* Net Position Card */}
        <div
          onClick={() => handleSelectTypeFilter("all")}
          className={`cursor-pointer p-6 rounded-2xl border transition-all duration-200 shadow-sm relative overflow-hidden group select-none ${
            typeFilter === "all"
              ? "bg-card border-foreground/30 ring-2 ring-foreground/10 shadow-premium scale-[1.01]"
              : "bg-card border-border hover:border-foreground/20 hover:shadow-premium"
          }`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Net Position</p>
              <p className={`text-2xl font-black mt-1 ${netPosition >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                {netPosition >= 0 ? "+" : "−"}{fmt(netPosition)}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-foreground/5 border border-border flex items-center justify-center text-foreground/60 flex-shrink-0 group-hover:scale-110 transition-transform">
              <ArrowUpDown className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-foreground/50 border-t border-border/60 pt-3 mt-1">
            <span>Show all entries</span>
            <span className={`font-bold transition-colors ${typeFilter === "all" ? "text-primary" : "text-foreground/60 group-hover:text-primary"}`}>
              {typeFilter === "all" ? "Active (All) ✓" : "Show all →"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Table Container ── */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row gap-4 sm:items-center justify-between bg-card">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none" />
            <input
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Search by description or account..."
              className="pl-9 pr-4 py-2 w-full sm:w-72 bg-foreground/5 border border-border rounded-xl text-sm outline-none focus:border-primary focus:bg-card transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Type selector */}
            <div className="flex items-center gap-1 p-1 bg-foreground/5 rounded-xl border border-border">
              {(["all", "revenue", "expense"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    typeFilter === t
                      ? "bg-foreground text-background shadow-sm font-bold"
                      : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Status selector */}
            <div className="flex items-center gap-1 p-1 bg-foreground/5 rounded-xl border border-border">
              {(["all", "cleared", "pending"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    statusFilter === s
                      ? "bg-foreground text-background shadow-sm font-bold"
                      : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-foreground/[0.03] border-b border-border">
              {table.getHeaderGroups().map(hg => (
                <tr key={hg.id}>
                  {hg.headers.map(header => (
                    <th
                      key={header.id}
                      className={`px-6 py-3.5 text-xs font-bold text-foreground/50 uppercase tracking-wider cursor-pointer select-none hover:text-foreground/80 transition-colors ${
                        header.column.id === "amount" ? "text-right" : ""
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className={`flex items-center gap-1.5 ${header.column.id === "amount" ? "justify-end" : ""}`}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc"  && <ArrowUpDown className="w-3 h-3 text-primary rotate-180" />}
                        {header.column.getIsSorted() === "desc" && <ArrowUpDown className="w-3 h-3 text-primary" />}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr
                    key={row.id}
                    className="hover:bg-foreground/[0.025] transition-colors"
                  >
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-foreground/40 text-sm">
                    No transactions match your current filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-foreground/[0.02] flex items-center justify-between text-xs text-foreground/50">
          <span>
            Showing <strong className="text-foreground font-semibold">
              {table.getFilteredRowModel().rows.length === 0 ? 0 : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
            </strong> to <strong className="text-foreground font-semibold">
              {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}
            </strong> of{" "}
            <strong className="text-foreground font-semibold">{table.getFilteredRowModel().rows.length}</strong> entries
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1.5 border border-border bg-card text-foreground rounded-lg disabled:opacity-50 hover:bg-foreground/5 transition-colors font-medium"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1.5 border border-border bg-card text-foreground rounded-lg disabled:opacity-50 hover:bg-foreground/5 transition-colors font-medium"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
