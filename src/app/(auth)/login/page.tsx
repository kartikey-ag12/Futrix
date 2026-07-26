"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, RefreshCcw,
  AlertCircle, CheckCircle2, Zap, Shield, KeyRound
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAutofillDemo = () => {
    setEmail("demo@futrix.com");
    setPassword("password123");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to log in.");
        setIsLoading(false);
        return;
      }

      setSuccess("Login successful! Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 800);
    } catch (err) {
      console.error(err);
      setError("An unexpected network error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Auth Card */}
      <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Top subtle border glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-foreground/5 via-foreground/20 to-foreground/5" />

        {/* Card Title */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-foreground/5 border border-border rounded-2xl flex items-center justify-center mx-auto mb-4 text-foreground shadow-sm">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Welcome back</h1>
          <p className="text-sm text-foreground/50 mt-1">Sign in to your Futrix account to continue</p>
        </div>

        {/* Demo Quick Fill Banner */}
        <div className="mb-6 p-3.5 bg-foreground/5 border border-border rounded-2xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-foreground/70">
            <Zap className="w-4 h-4 text-foreground flex-shrink-0" />
            <span>Need quick access? Use <strong>Demo Account</strong></span>
          </div>
          <button
            type="button"
            onClick={handleAutofillDemo}
            className="px-3 py-1 bg-foreground text-background font-bold text-xs rounded-xl transition-all hover:bg-foreground/90 shadow-sm flex-shrink-0"
          >
            Autofill
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-900 rounded-2xl flex items-start gap-3 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900 rounded-2xl flex items-start gap-3 text-emerald-600 dark:text-emerald-400 text-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-11 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-foreground/40 text-sm focus:outline-none focus:border-foreground/50 focus:ring-1 focus:ring-foreground/50 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-foreground/70 uppercase tracking-wider">
                Password
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Demo mode: Click 'Autofill' above or enter any email/password."); }} className="text-xs font-medium text-foreground hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-11 py-3 bg-background border border-border rounded-xl text-foreground placeholder-foreground/40 text-sm focus:outline-none focus:border-foreground/50 focus:ring-1 focus:ring-foreground/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between text-xs text-foreground/60">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-border text-foreground focus:ring-foreground bg-background"
              />
              <span>Remember me for 30 days</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 bg-foreground text-background font-bold rounded-xl transition-all shadow-premium hover:shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50 hover:bg-foreground/90"
          >
            {isLoading ? (
              <>
                <RefreshCcw className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign in to Dashboard
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/40">Or continue with</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleAutofillDemo()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-background border border-border hover:bg-foreground/5 text-foreground/70 rounded-xl text-xs font-semibold transition-all"
          >
            <div className="w-4 h-4 bg-foreground/10 rounded text-foreground font-black text-[10px] flex items-center justify-center">X</div>
            Xero OAuth
          </button>
          <button
            type="button"
            onClick={() => handleAutofillDemo()}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-background border border-border hover:bg-foreground/5 text-foreground/70 rounded-xl text-xs font-semibold transition-all"
          >
            <Shield className="w-4 h-4 text-foreground/70" />
            Single Sign-On
          </button>
        </div>

        {/* Switch to Signup */}
        <div className="mt-8 text-center text-xs text-foreground/50">
          Don&apos;t have a Futrix account?{" "}
          <Link href="/signup" className="font-bold text-foreground hover:underline">
            Start 14-day free trial
          </Link>
        </div>
      </div>
    </div>
  );
}
