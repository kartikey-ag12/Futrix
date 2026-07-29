"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User, Mail, Lock, Building2, Briefcase, Eye, EyeOff,
  ArrowRight, RefreshCcw, AlertCircle, CheckCircle2, ShieldCheck, Sparkles
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("Owner");
  const [terms, setTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<"user" | "admin">("user");
  const [adminCode, setAdminCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Calculate password strength score (0 to 4)
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terms) {
      setError("Please accept the Terms of Service to create your account.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, company, role, isAdminSignup: authMode === "admin", adminCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account.");
        setIsLoading(false);
        return;
      }

      setSuccess(authMode === "admin" ? "Admin account created! Redirecting..." : "Account created successfully! Setting up your workspace...");
      setTimeout(() => {
        router.push(authMode === "admin" ? "/admin" : "/dashboard");
        router.refresh();
      }, 1000);
    } catch (err) {
      console.error(err);
      setError("An unexpected network error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg">
      {/* Signup Card */}
      <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Top glow bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-foreground/5 via-foreground/20 to-foreground/5" />

        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-foreground/5 border border-border text-foreground/70 text-xs font-semibold rounded-full mb-6">
          <Sparkles className="w-3.5 h-3.5 text-foreground" />
          14-Day Free Trial · No Credit Card Required
        </div>

        {/* Role Toggle */}
        <div className="flex bg-foreground/5 p-1 rounded-xl mb-6 relative z-10">
          <button
            type="button"
            onClick={() => setAuthMode("user")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${authMode === "user" ? "bg-background text-foreground shadow-sm" : "text-foreground/50 hover:text-foreground/80"}`}
          >
            User Signup
          </button>
          <button
            type="button"
            onClick={() => setAuthMode("admin")}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${authMode === "admin" ? "bg-background text-foreground shadow-sm" : "text-foreground/50 hover:text-foreground/80"}`}
          >
            Admin Signup
          </button>
        </div>

        {/* Card Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-foreground tracking-tight">
            {authMode === "admin" ? "Admin Portal Access" : "Start your free trial"}
          </h1>
          <p className="text-sm text-foreground/50 mt-1">
            {authMode === "admin" ? "Create a platform administrator account." : "Get instant access to live forecasting, multi-currency reports, and Xero sync."}
          </p>
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

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name & Company Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Collins"
                  className="w-full pl-10 pr-3 py-2.5 bg-background border border-border rounded-xl text-foreground placeholder-foreground/40 text-sm focus:outline-none focus:border-foreground/50 focus:ring-1 focus:ring-foreground/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wider">
                Company Name
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Broadstone Group"
                  className="w-full pl-10 pr-3 py-2.5 bg-background border border-border rounded-xl text-foreground placeholder-foreground/40 text-sm focus:outline-none focus:border-foreground/50 focus:ring-1 focus:ring-foreground/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wider">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@broadstone.com"
                className="w-full pl-10 pr-3 py-2.5 bg-background border border-border rounded-xl text-foreground placeholder-foreground/40 text-sm focus:outline-none focus:border-foreground/50 focus:ring-1 focus:ring-foreground/50 transition-all"
              />
            </div>
          </div>

          {/* Role selection */}
          <div>
            <label className="block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wider">
              Your Primary Role
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-background border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-foreground/50 focus:ring-1 focus:ring-foreground/50 transition-all appearance-none cursor-pointer"
              >
                <option value="Owner">Business Owner / CEO</option>
                <option value="CFO">CFO / Finance Director</option>
                <option value="Accountant">Accountant / Bookkeeper</option>
                <option value="Advisor">Financial Advisor / Consultant</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wider">
              Create Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-background border border-border rounded-xl text-foreground placeholder-foreground/40 text-sm focus:outline-none focus:border-foreground/50 focus:ring-1 focus:ring-foreground/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password strength bar */}
            {password && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-foreground/10 rounded-full overflow-hidden flex gap-1">
                  <div className={`h-full rounded-full transition-all duration-300 ${strength >= 1 ? "bg-red-500 w-1/4" : "w-0"}`} />
                  <div className={`h-full rounded-full transition-all duration-300 ${strength >= 2 ? "bg-amber-500 w-1/4" : "w-0"}`} />
                  <div className={`h-full rounded-full transition-all duration-300 ${strength >= 3 ? "bg-emerald-500 w-1/4" : "w-0"}`} />
                  <div className={`h-full rounded-full transition-all duration-300 ${strength >= 4 ? "bg-emerald-400 w-1/4" : "w-0"}`} />
                </div>
                <span className="text-[10px] font-semibold text-foreground/50 uppercase">
                  {strength <= 1 ? "Weak" : strength === 2 ? "Fair" : strength === 3 ? "Good" : "Strong"}
                </span>
              </div>
            )}
          </div>

          {/* Admin Code (only if admin) */}
          {authMode === "admin" && (
            <div>
              <label className="block text-xs font-semibold text-foreground/70 mb-1.5 uppercase tracking-wider text-red-500 dark:text-red-400">
                Admin Access Code
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-red-500/50" />
                <input
                  type="password"
                  required
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  placeholder="Enter secret access code"
                  className="w-full pl-10 pr-3 py-2.5 bg-background border border-red-500/30 rounded-xl text-foreground placeholder-foreground/40 text-sm focus:outline-none focus:border-red-500/80 focus:ring-1 focus:ring-red-500/80 transition-all"
                />
              </div>
            </div>
          )}

          {/* Terms Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-foreground/60">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-border text-foreground focus:ring-foreground bg-background"
              />
              <span>
                I agree to Futrix&apos;s{" "}
                <a href="#" className="text-foreground hover:underline">Terms of Service</a> and{" "}
                <a href="#" className="text-foreground hover:underline">Privacy Policy</a>.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 bg-foreground text-background font-bold rounded-xl transition-all shadow-premium hover:shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-4 hover:bg-foreground/90"
          >
            {isLoading ? (
              <>
                <RefreshCcw className="w-4 h-4 animate-spin" />
                Creating your account...
              </>
            ) : (
              <>
                Create Account & Start Trial
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Benefits checklist */}
        <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 gap-2 text-xs text-foreground/50">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-foreground/40" />
            <span>14-day free access</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-foreground/40" />
            <span>Cancel anytime</span>
          </div>
        </div>

        {/* Switch to Login */}
        <div className="mt-6 text-center text-xs text-foreground/50">
          Already have a Futrix account?{" "}
          <Link href="/login" className="font-bold text-foreground hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
