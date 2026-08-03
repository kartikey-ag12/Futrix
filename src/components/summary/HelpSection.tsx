"use client";

import Link from "next/link";

function HelpCard({
  title,
  description,
  linkLabel,
  href,
  illustration,
}: {
  title: string;
  description: string;
  linkLabel: string;
  href: string;
  illustration: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl p-5 shadow-sm flex items-center gap-5 flex-1 min-w-0">
      {/* Illustration area */}
      <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
        {illustration}
      </div>
      {/* Text */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-foreground/50 mt-0.5 leading-relaxed">{description}</p>
        <Link
          href={href}
          className="inline-block mt-2 text-xs font-semibold text-emerald-600 hover:text-emerald-500 hover:underline transition-colors"
        >
          {linkLabel}
        </Link>
      </div>
    </div>
  );
}

// ── SVG illustrations ──────────────────────────────────────────────────────────

function WebinarIllustration() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-8 h-8" aria-hidden="true">
      <rect width="56" height="56" rx="14" fill="transparent" />
      {/* Screen */}
      <rect x="8" y="12" width="40" height="26" rx="4" fill="#10b981" opacity="0.15" stroke="#10b981" strokeWidth="1.5" />
      {/* Play button */}
      <polygon points="23,19 37,25 23,31" fill="#10b981" opacity="0.9" />
      {/* Stand */}
      <rect x="22" y="38" width="12" height="3" rx="1.5" fill="#10b981" opacity="0.4" />
      <rect x="18" y="41" width="20" height="2" rx="1" fill="#10b981" opacity="0.3" />
    </svg>
  );
}

function LearningIllustration() {
  return (
    <svg viewBox="0 0 56 56" fill="none" className="w-8 h-8" aria-hidden="true">
      <rect width="56" height="56" rx="14" fill="transparent" />
      {/* Book */}
      <rect x="11" y="11" width="34" height="34" rx="4" fill="#10b981" opacity="0.12" />
      <rect x="11" y="11" width="16" height="34" rx="4" fill="#10b981" opacity="0.2" />
      {/* Lines */}
      <line x1="29" y1="18" x2="39" y2="18" stroke="#10b981" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <line x1="29" y1="24" x2="39" y2="24" stroke="#10b981" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <line x1="29" y1="30" x2="36" y2="30" stroke="#10b981" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      {/* Graduation cap */}
      <polygon points="19,22 24,19 29,22 24,25" fill="#10b981" opacity="0.9" />
      <line x1="29" y1="22" x2="29" y2="28" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <circle cx="29" cy="29" r="2" fill="#10b981" opacity="0.7" />
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function HelpSection() {
  return (
    <section className="mt-6">
      <h2 className="text-sm font-semibold text-foreground mb-3">Need more help?</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <HelpCard
          title="Webinars"
          description="Join live sessions and learn how to get the most out of Futrix features."
          linkLabel="Explore Futrix's webinars"
          href="#"
          illustration={<WebinarIllustration />}
        />
        <HelpCard
          title="Learning"
          description="Browse our help docs and step-by-step guides at your own pace."
          linkLabel="Visit Futrix's help area"
          href="#"
          illustration={<LearningIllustration />}
        />
      </div>
    </section>
  );
}
