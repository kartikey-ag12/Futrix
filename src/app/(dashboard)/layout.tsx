"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { FinancialProvider } from "@/context/FinancialContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Footer } from "@/components/layout/Footer";

// Defer the 555-line Header (21 KB) — not needed for initial paint
const Header = dynamic(
  () => import("@/components/layout/Header").then((m) => ({ default: m.Header })),
  { ssr: false, loading: () => <div className="h-16 bg-card border-b border-border" /> }
);

// Defer SupportModal — only needed when user clicks the support button
const SupportModal = dynamic(
  () => import("@/components/support/SupportModal").then((m) => ({ default: m.SupportModal })),
  { ssr: false }
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <FinancialProvider>
      <div className="flex min-h-screen w-full bg-background overflow-x-hidden">
        <Sidebar
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          onOpenSupport={() => setIsSupportOpen(true)}
        />
        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen min-w-0">
          <Header onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background/50 overflow-y-auto flex flex-col justify-between">
            <div className="flex-1">{children}</div>
            <div className="-mx-4 -mb-4 sm:-mx-6 sm:-mb-6 lg:-mx-8 lg:-mb-8 mt-12">
              <Footer />
            </div>
          </main>
        </div>

        {/* Only mount the support modal DOM when actually opened */}
        {isSupportOpen && (
          <SupportModal
            isOpen={isSupportOpen}
            onClose={() => setIsSupportOpen(false)}
          />
        )}
      </div>
    </FinancialProvider>
  );
}
