import Link from "next/link";
import { User, Building2, HelpCircle } from "lucide-react";

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5] dark:bg-[#0a0a0a]">
      {/* Minimal Top Bar */}
      <header className="h-16 bg-[#111] border-b border-[#222] flex items-center justify-end px-6 flex-shrink-0">
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <Building2 className="w-4 h-4" />
            <span className="text-sm font-medium">Acme Corp</span>
          </button>
          
          <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Help</span>
          </button>
          
          <div className="w-px h-5 bg-white/10" />
          
          <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Kartikey</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {children}
      </main>
    </div>
  );
}
