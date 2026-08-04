import Link from "next/link";
import { FinancialProvider } from "@/context/FinancialContext";
import { AppNavbar } from "@/components/app-shell/AppNavbar";
import { VirtualDemoProvider } from "@/components/app-shell/VirtualDemoProvider";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VirtualDemoProvider>
      <div className="min-h-screen flex flex-col bg-[#f5f5f5] dark:bg-[#0a0a0a]">
        {/* Persistent top navbar */}
        <AppNavbar />

        {/* Main Content */}
        <main className="flex-1 flex flex-col relative">
          <FinancialProvider>
            {children}
          </FinancialProvider>
        </main>
      </div>
    </VirtualDemoProvider>
  );
}
