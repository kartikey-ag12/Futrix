"use client";

import Link from "next/link";
import { AlertCircle, CheckCircle2, RefreshCw, ExternalLink, UserPlus, Users } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  role: string;
  user: { id: string; name: string | null; email: string | null };
}

export interface AlertsCardProps {
  companyName: string;
  teamMembers?: TeamMember[];
  hasForecasts?: boolean;
  lastSyncedMinsAgo?: number;
  unreconciledCount?: number;
  isSyncing?: boolean;
  syncError?: string | null;
  onSync?: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatSyncTime(minsAgo: number): string {
  if (minsAgo < 1)    return "just now";
  if (minsAgo < 60)   return `${minsAgo} min${minsAgo === 1 ? "" : "s"} ago`;
  const h = Math.floor(minsAgo / 60);
  return `${h} hour${h === 1 ? "" : "s"} ago`;
}

function SectionDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 pt-4 border-t border-[#e5e5e5] dark:border-white/8">
      <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/30 mb-2">
        {children}
      </p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function AlertsCard({
  companyName,
  teamMembers = [],
  hasForecasts = false,
  lastSyncedMinsAgo = 12,
  unreconciledCount = 4,
  isSyncing = false,
  syncError = null,
  onSync,
}: AlertsCardProps) {
  const displayMembers = teamMembers.slice(0, 3);

  return (
    <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl p-4 shadow-sm flex flex-col">
      {/* Header */}
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-foreground">Alerts</h2>
        <p className="text-xs text-foreground/40 mt-0.5">
          Take action on the alerts below for greater insights
        </p>
      </div>

      {/* ── No-forecast alert ── */}
      {!hasForecasts && (
        <div className="bg-amber-50 dark:bg-amber-500/8 border border-amber-200 dark:border-amber-500/20 rounded-xl p-3 mb-1">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-amber-800 dark:text-amber-400">
                Create your first budget or forecast
              </p>
              <p className="text-xs text-amber-700/80 dark:text-amber-400/60 mt-1 leading-relaxed">
                Forecasts help you plan ahead and track performance to targets.
              </p>
              <Link
                href="/forecasting"
                className="inline-flex items-center gap-1 text-xs text-amber-700 dark:text-amber-400 font-medium hover:underline mt-1.5"
              >
                Go to Forecasting
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {hasForecasts && (
        <div className="flex items-center gap-2 py-2 text-xs text-emerald-600">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>All alerts resolved</span>
        </div>
      )}

      {/* ── Data connection ── */}
      <SectionDivider>Data connection</SectionDivider>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="text-xs text-foreground/60">
              Data synced{" "}
              <span className="font-medium text-foreground/80">
                {formatSyncTime(lastSyncedMinsAgo)}
              </span>
            </span>
          </div>
          <button 
            onClick={onSync}
            disabled={isSyncing}
            className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-500 font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing..." : "Sync now"}
          </button>
        </div>

        {syncError && (
          <div className="flex items-center justify-between text-xs text-red-500 mt-2">
            <span>{syncError}</span>
            <a href="/api/xero/connect" className="underline hover:text-red-400">Reconnect Xero</a>
          </div>
        )}

        {unreconciledCount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-foreground/60">
              <span className="font-semibold text-amber-600">{unreconciledCount}</span>
              {" "}unreconciled transactions
            </span>
            <a
              href="/api/xero/connect"
              className="flex items-center gap-1 text-xs text-foreground/50 hover:text-foreground transition-colors"
            >
              Log into Xero
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* ── Users with access ── */}
      <SectionDivider>
        Users with access to {companyName}
      </SectionDivider>

      <div className="space-y-2">
        {displayMembers.length === 0 ? (
          <p className="text-xs text-foreground/30">No team members yet.</p>
        ) : (
          displayMembers.map((m) => {
            const name  = m.user.name  || m.user.email?.split("@")[0] || "User";
            const email = m.user.email || "";
            const initial = name.charAt(0).toUpperCase();
            return (
              <div key={m.id} className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-[11px] font-bold text-white">{initial}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{name}</p>
                  {email && <p className="text-[11px] text-foreground/40 truncate">{email}</p>}
                </div>
                <span className="text-[10px] text-foreground/30 flex-shrink-0">{m.role}</span>
                <a
                  href="/settings"
                  aria-label="Manage user"
                  className="text-foreground/25 hover:text-foreground/50 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            );
          })
        )}

        <div className="flex items-center gap-3 pt-1">
          <Link
            href="/settings"
            className="flex items-center gap-1.5 text-xs font-medium text-foreground/60 hover:text-foreground bg-foreground/5 hover:bg-foreground/8 px-3 py-1.5 rounded-lg transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Invite your team
          </Link>
          {teamMembers.length > 3 && (
            <Link href="/settings" className="flex items-center gap-1 text-xs text-foreground/40 hover:text-foreground/70 transition-colors">
              <Users className="w-3.5 h-3.5" />
              See {teamMembers.length - 3} more
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
