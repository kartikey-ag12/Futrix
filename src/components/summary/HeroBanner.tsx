"use client";

interface HeroBannerProps {
  firstName: string;
}

export function HeroBanner({ firstName }: HeroBannerProps) {
  return (
    <section className="relative w-full bg-[#0d0d0d] overflow-hidden">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Green glow blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-emerald-400/6 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative flex items-center justify-between max-w-none px-8 py-10 min-h-[160px]">
        {/* Text */}
        <div className="flex-1 min-w-0 z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Hello, {firstName}!
          </h1>
          <p className="mt-2 text-base text-white/50 font-normal">
            Welcome to your Futrix summary
          </p>
        </div>

        {/* Decorative abstract graphic */}
        <div className="hidden md:block flex-shrink-0 ml-8 relative w-64 h-36">
          <svg
            viewBox="0 0 260 144"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
          >
            {/* Background card shapes */}
            <rect x="60" y="20" width="180" height="104" rx="10" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1" />
            <rect x="30" y="36" width="180" height="104" rx="10" fill="#161616" stroke="#252525" strokeWidth="1" />
            <rect x="0" y="52" width="180" height="92" rx="10" fill="#121212" stroke="#202020" strokeWidth="1" />

            {/* Chart bar shapes inside card */}
            <rect x="18" y="106" width="18" height="22" rx="3" fill="#10b981" opacity="0.7" />
            <rect x="44" y="94" width="18" height="34" rx="3" fill="#3b82f6" opacity="0.6" />
            <rect x="70" y="100" width="18" height="28" rx="3" fill="#f97316" opacity="0.5" />
            <rect x="96" y="88" width="18" height="40" rx="3" fill="#10b981" opacity="0.65" />
            <rect x="122" y="96" width="18" height="32" rx="3" fill="#3b82f6" opacity="0.6" />
            <rect x="148" y="90" width="18" height="38" rx="3" fill="#f97316" opacity="0.5" />

            {/* Green diagonal accent lines */}
            <line x1="0" y1="52" x2="40" y2="0" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
            <line x1="10" y1="52" x2="55" y2="0" stroke="#10b981" strokeWidth="1" strokeOpacity="0.25" strokeLinecap="round" />
            <line x1="180" y1="52" x2="220" y2="0" stroke="#10b981" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
            <line x1="170" y1="52" x2="205" y2="0" stroke="#10b981" strokeWidth="1" strokeOpacity="0.25" strokeLinecap="round" />

            {/* Trend line overlay */}
            <polyline
              points="18,118 44,108 70,112 96,98 122,104 148,96"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />

            {/* Small dot indicators */}
            <circle cx="18" cy="118" r="3" fill="#10b981" opacity="0.9" />
            <circle cx="44" cy="108" r="3" fill="#10b981" opacity="0.9" />
            <circle cx="96" cy="98" r="3" fill="#10b981" opacity="0.9" />
            <circle cx="148" cy="96" r="3" fill="#10b981" opacity="0.9" />

            {/* Top-right corner badge */}
            <rect x="172" y="28" width="68" height="28" rx="6" fill="#10b981" opacity="0.12" />
            <text x="206" y="46" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="600" opacity="0.9">+12.4%</text>
          </svg>
        </div>
      </div>
    </section>
  );
}
