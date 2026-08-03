import { AppNavbar } from "@/components/app-shell/AppNavbar";
import { TrialBanner } from "@/components/app-shell/TrialBanner";
import { ChatWidget } from "@/components/app-shell/ChatWidget";

// Phase 0: trial props are static.
// Phase 6 will wire daysLeft to real subscription data from the DB.
const TRIAL_DAYS_LEFT = 14;

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Persistent top navbar */}
      <AppNavbar />

      {/* Trial banner — rendered below navbar, above page content */}
      <TrialBanner daysLeft={TRIAL_DAYS_LEFT} dismissable />

      {/* Page content area */}
      <main className="flex-1 flex flex-col min-h-0">
        {children}
      </main>

      {/* Floating chat / help widget */}
      <ChatWidget />
    </div>
  );
}
