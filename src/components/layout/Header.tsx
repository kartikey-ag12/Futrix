"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bell, User, LogOut, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";

export function Header() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-9 pr-4 py-2 bg-foreground/5 border border-transparent focus:border-primary rounded-lg text-sm outline-none transition-all w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-foreground/5 text-foreground/70 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-border bg-foreground/5">
                <h4 className="font-semibold text-sm">Notifications</h4>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-4 border-b border-border hover:bg-foreground/5 transition-colors cursor-pointer">
                  <p className="text-sm font-medium">Xero Sync Complete</p>
                  <p className="text-xs text-foreground/60 mt-1">45 new transactions synced successfully.</p>
                  <p className="text-xs text-foreground/40 mt-2">10 mins ago</p>
                </div>
                <div className="p-4 hover:bg-foreground/5 transition-colors cursor-pointer">
                  <p className="text-sm font-medium text-accent">Cash Flow Alert</p>
                  <p className="text-xs text-foreground/60 mt-1">Review your forecasted runway for August.</p>
                  <p className="text-xs text-foreground/40 mt-2">1 hour ago</p>
                </div>
              </div>
              <div className="p-2 border-t border-border">
                <button className="w-full py-1.5 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-medium text-sm transition-transform hover:scale-105"
          >
            <User className="w-4 h-4" />
          </button>
          
          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold">Demo User</p>
                <p className="text-xs text-foreground/60 truncate">user@futrix.demo</p>
              </div>
              <div className="p-1 border-b border-border">
                <Link href="/settings" onClick={() => setShowProfile(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/80 hover:bg-foreground/5 hover:text-foreground rounded-lg transition-colors">
                  <SettingsIcon className="w-4 h-4" />
                  Account Settings
                </Link>
              </div>
              <div className="p-1">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
