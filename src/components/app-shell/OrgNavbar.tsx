"use client";

import Link from "next/link";
import { useState, useRef, useEffect, ReactNode } from "react";
import { Pencil, ChevronDown, HelpCircle, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return { open, setOpen, toggle: () => setOpen(!open), close: () => setOpen(false), ref };
}

function DropdownPanel({ children, right = true }: { children: ReactNode; right?: boolean }) {
  return (
    <div
      className={`absolute ${right ? "right-0" : "left-0"} top-full mt-1.5 w-60 bg-[#1c1c1c] border border-white/10 rounded-xl shadow-2xl py-1.5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200`}
    >
      {children}
    </div>
  );
}

function DropdownItem({
  children, href, onClick, icon: Icon, danger
}: {
  children: ReactNode; href?: string; onClick?: () => void; icon?: any; danger?: boolean;
}) {
  const content = (
    <>
      {Icon && <Icon className={`w-4 h-4 mr-2.5 ${danger ? "text-red-400" : "text-white/50"}`} />}
      {children}
    </>
  );
  
  const className = `w-full flex items-center px-4 py-2.5 text-sm font-medium transition-colors ${
    danger ? "text-red-400 hover:bg-red-500/10" : "text-white/80 hover:text-white hover:bg-white/8"
  }`;

  if (href) {
    return <Link href={href} className={className} onClick={onClick}>{content}</Link>;
  }
  return <button onClick={onClick} className={className}>{content}</button>;
}

export function OrgNavbar() {
  const router = useRouter();
  const { open: userOpen, toggle: userToggle, close: userClose, ref: userRef } = useDropdown();

  const handleSignOut = async () => {
    userClose();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    router.push("/login");
  };

  return (
    <nav className="h-14 bg-black border-b border-white/10 flex items-center justify-between px-6 flex-shrink-0 relative z-50">
      <div className="flex items-center gap-2">
        <Link href="/summary" className="text-white font-medium hover:text-white/80 transition-colors">
          Kartikey's workspace
        </Link>
        <button className="text-white/50 hover:text-white transition-colors">
          <Pencil className="w-3 h-3" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* User Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            onClick={userToggle}
            className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors select-none"
          >
            Kartikey Agrahari
            <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${userOpen ? "rotate-180" : ""}`} />
          </button>
          
          {userOpen && (
            <DropdownPanel>
              <DropdownItem 
                onClick={() => {
                  userClose();
                  router.push("/profile");
                }} 
                icon={User}
              >
                My Profile
              </DropdownItem>
              <DropdownItem onClick={handleSignOut} icon={LogOut} danger>
                Sign Out
              </DropdownItem>
            </DropdownPanel>
          )}
        </div>

        {/* Help Dropdown */}
        <button className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
          Help <ChevronDown className="w-3.5 h-3.5 text-white/40" />
        </button>
      </div>
    </nav>
  );
}
