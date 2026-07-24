"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type Transaction = {
  id: string;
  date: string;
  description: string;
  account: string;
  amount: number;
  type: "revenue" | "expense";
};

const mockData: Transaction[] = [
  { id: "1", date: "2024-07-20", description: "Software Subscription", account: "Operating Expenses", amount: -150.0, type: "expense" },
  { id: "2", date: "2024-07-19", description: "Client Retainer - Acme Corp", account: "Sales Revenue", amount: 5000.0, type: "revenue" },
  { id: "3", date: "2024-07-18", description: "Office Supplies", account: "Operating Expenses", amount: -45.2, type: "expense" },
  { id: "4", date: "2024-07-15", description: "Consulting Fee", account: "Services Revenue", amount: 2500.0, type: "revenue" },
  { id: "5", date: "2024-07-12", description: "Cloud Hosting", account: "IT Expenses", amount: -850.0, type: "expense" },
];

const columnHelper = createColumnHelper<Transaction>();

const columns = [
  columnHelper.accessor("date", {
    header: "Date",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.accessor("account", {
    header: "Account",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: (info) => {
      const amount = info.getValue();
      const isExpense = amount < 0;
      return (
        <span className={isExpense ? "text-red-500 font-medium" : "text-emerald-500 font-medium"}>
          {isExpense ? "-" : "+"}${Math.abs(amount).toFixed(2)}
        </span>
      );
    },
  }),
];

export default function TransactionsPage() {
  const table = useReactTable({
    data: mockData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
        <p className="text-foreground/60 text-sm mt-1">View and filter all your synced financial records.</p>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-foreground/5 border-b border-border">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-4 font-semibold text-foreground/70">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0 hover:bg-foreground/5 transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
