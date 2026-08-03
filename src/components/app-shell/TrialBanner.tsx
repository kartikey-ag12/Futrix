"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface TrialBannerProps {
  daysLeft: number;
  subscribeHref?: string;
  dismissable?: boolean;
}

const DISMISSED_KEY = "futrix_trial_banner_dismissed";

export function TrialBanner({
  daysLeft,
  subscribeHref = "/pricing",
  dismissable = true,
}: TrialBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — read localStorage only on client
  useEffect(() => {
    setMounted(true);
    try {
      if (localStorage.getItem(DISMISSED_KEY) === "true") {
        setDismissed(true);
      }
    } catch {
      // localStorage might be blocked
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISSED_KEY, "true");
    } catch {
      // ignore
    }
  };

  // Don't render until mounted to avoid SSR mismatch
  if (!mounted || dismissed) return null;

  const urgency = daysLeft <= 3;
  const warning = daysLeft <= 7 && daysLeft > 3;

  return (
    <div
      id="trial-banner"
      className={`
        w-full flex items-center justify-center gap-3 px-4 py-2 text-sm font-medium
        ${urgency
          ? "bg-red-600 text-white"
          : warning
          ? "bg-amber-500 text-slate-900"
          : "bg-emerald-500 text-slate-900"
        }
      `}
      role="banner"
    >
      <span>
        {daysLeft === 0 ? (
          "Your trial has expired."
        ) : (
          <>
            You have{" "}
            <strong>
              {daysLeft} {daysLeft === 1 ? "day" : "days"}
            </strong>{" "}
            of your trial left.{" "}
          </>
        )}
        <Link
          href={subscribeHref}
          className="underline underline-offset-2 hover:opacity-80 transition-opacity font-semibold"
        >
          Subscribe now
        </Link>
        {" "}to keep full access.
      </span>

      {dismissable && (
        <button
          onClick={handleDismiss}
          aria-label="Dismiss trial banner"
          className="ml-2 p-0.5 rounded hover:opacity-70 transition-opacity flex-shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
