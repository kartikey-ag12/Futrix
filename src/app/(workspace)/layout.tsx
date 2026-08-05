import { AppNavbar } from "@/components/app-shell/AppNavbar";
import { TrialBanner } from "@/components/app-shell/TrialBanner";
import { ChatWidget } from "@/components/app-shell/ChatWidget";
import { FinancialProvider } from "@/context/FinancialContext";
import { VirtualDemoProvider } from "@/components/app-shell/VirtualDemoProvider";

import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const trialEndsCookie = cookieStore.get("futrix_trial_ends_at")?.value;
  
  let daysLeft = 14; // fallback
  
  if (trialEndsCookie) {
    const trialEndsAt = new Date(trialEndsCookie);
    daysLeft = Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
  } else {
    // Fallback: try to fetch from DB if cookie is missing (e.g. old session)
    const token = cookieStore.get("futrix_access_token")?.value;
    if (token) {
      try {
        const payload = await verifyAccessToken(token);
        if (payload) {
          const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: { workspaces: { select: { workspace: { select: { trialEndsAt: true } } } } }
          });
          const trialEndsAt = user?.workspaces?.[0]?.workspace?.trialEndsAt;
          if (trialEndsAt) {
            daysLeft = Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
          }
        }
      } catch (err) {
        // Silently catch Prisma schema mismatches or JWT errors during dev
        console.error("Error fetching trial ends at fallback:", err);
      }
    }
  }

  return (
    <VirtualDemoProvider>
      <div className="flex flex-col min-h-screen bg-background">
        {/* Persistent top navbar */}
        <AppNavbar />

        {/* Trial banner — rendered below navbar, above page content */}
        <TrialBanner daysLeft={daysLeft} dismissable />

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

