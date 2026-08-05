import { OrgNavbar } from "@/components/app-shell/OrgNavbar";
import { ChatWidget } from "@/components/app-shell/ChatWidget";
import { FinancialProvider } from "@/context/FinancialContext";
import { VirtualDemoProvider } from "@/components/app-shell/VirtualDemoProvider";

export default async function OrganizationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VirtualDemoProvider>
      <div className="flex flex-col min-h-screen bg-background">
        {/* Simplified top navbar for organizations view */}
        <OrgNavbar />

        {/* Page content area */}
        <main className="flex-1 flex flex-col min-h-0">
          <FinancialProvider>
            {children}
          </FinancialProvider>
        </main>

        {/* Floating chat / help widget */}
        <ChatWidget />
      </div>
    </VirtualDemoProvider>
  );
}
