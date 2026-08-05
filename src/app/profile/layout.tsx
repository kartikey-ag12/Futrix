import Link from "next/link";
import { ReactNode } from "react";

export const metadata = {
  title: "My Profile - Futrix",
};

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8">
        <h1 className="text-lg font-bold text-foreground">My Profile</h1>
        <Link 
          href="/organizations"
          className="px-6 py-2 rounded-full text-sm font-semibold border border-[#0f8a55] text-[#0f8a55] hover:bg-[#0f8a55]/5 transition-colors"
        >
          Exit
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-background/50 py-8">
        {children}
      </main>
    </div>
  );
}
