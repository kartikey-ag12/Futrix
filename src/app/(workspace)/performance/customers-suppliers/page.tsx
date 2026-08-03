import { CustomersSuppliersTable } from "@/components/performance/CustomersSuppliersTable";

export const metadata = {
  title: "Customers & Suppliers — Futrix",
  description: "View and manage your customers and suppliers performance.",
};

export default function CustomersSuppliersPage() {
  return (
    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 space-y-5 max-w-[1600px] mx-auto w-full">
      <CustomersSuppliersTable />
    </div>
  );
}
