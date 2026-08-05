"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function ProfilePage() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const canChange = oldPassword.length > 0 && newPassword.length > 0 && confirmPassword.length > 0;

  return (
    <div className="px-8 max-w-[1400px] mx-auto flex flex-col md:flex-row gap-6 items-start">
      {/* Password Card */}
      <div className="w-full md:w-[450px] bg-card p-8 shadow-sm border border-border">
        <h2 className="text-xl font-bold text-foreground mb-6">Change password</h2>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Old password</label>
            <div className="relative">
              <input 
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter old password"
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-1 focus:ring-[#0f8a55] transition-shadow placeholder:text-foreground/40"
              />
              <button 
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
              >
                {showOld ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">New password</label>
            <div className="relative">
              <input 
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-1 focus:ring-[#0f8a55] transition-shadow placeholder:text-foreground/40"
              />
              <button 
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
              >
                {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Confirm new password</label>
            <div className="relative">
              <input 
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter new password again"
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-1 focus:ring-[#0f8a55] transition-shadow placeholder:text-foreground/40"
              />
              <button 
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <button 
              disabled={!canChange}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                canChange 
                  ? "bg-[#0f8a55] text-white hover:bg-[#0c7447]" 
                  : "bg-foreground/10 text-foreground/40 cursor-not-allowed"
              }`}
            >
              Change password
            </button>
          </div>
        </div>
      </div>

      {/* MFA Card */}
      <div className="w-full md:w-[450px] bg-card p-8 shadow-sm border border-border">
        <h2 className="text-xl font-bold text-foreground mb-6">Multi-factor authentication</h2>
        
        <div className="flex items-center gap-4">
          <button className="relative w-16 h-8 rounded-full bg-slate-200 border border-slate-300 transition-colors flex items-center px-1">
            <span className="w-6 h-6 rounded-full bg-slate-500 shadow-sm z-10" />
            <span className="absolute right-3 text-[10px] font-bold text-slate-500">OFF</span>
          </button>
          <span className="text-sm font-semibold text-foreground">Multi-factor authentication is OFF</span>
        </div>
      </div>
    </div>
  );
}
