"use client";

import { useState, useCallback } from "react";
import { Star } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { Quote } from "lucide-react";

const REVIEWS = [
  {
    quote: "Futrix transformed how we present financials to our board. What used to take a full day in spreadsheets now takes under 20 minutes.",
    author: "Rachel Osei",
    role: "CFO, Greenpath Ventures",
    rating: 5,
  },
  {
    quote: "The daily cash flow forecasting caught a potential deficit six weeks out. We had time to act. It literally saved us from a cash crunch.",
    author: "Daniel Fitzpatrick",
    role: "Finance Director, Apex Retail",
    rating: 5,
  },
  {
    quote: "Our accountants now spend time advising clients instead of manually copying data. Futrix is the platform that made that transition possible.",
    author: "Mei Lin",
    role: "Partner, Horizon Advisory",
    rating: 5,
  },
  {
    quote: "The Xero live integration synced 3 years of invoice ledgers in seconds. Our month-end reporting time has been cut by 70%.",
    author: "Marcus Vance",
    role: "Group Controller, Vance & Co",
    rating: 5,
  },
  {
    quote: "Scenario planning in Futrix allowed us to model our hiring plan safely before committing to Q4 headcount.",
    author: "Elena Rostova",
    role: "VP of Finance, TechScale Global",
    rating: 5,
  },
];

const FIVE_STARS = [0, 1, 2, 3, 4];

export default function ReviewsCarousel() {
  const [idx, setIdx] = useState(0);
  const next = useCallback(() => setIdx((p) => (p + 1) % REVIEWS.length), []);
  const prev = useCallback(() => setIdx((p) => (p - 1 + REVIEWS.length) % REVIEWS.length), []);
  const rev = REVIEWS[idx];

  return (
    <section className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-sm cv-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wide text-foreground/50">Customer Satisfaction</span>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold rounded-full">Trustpilot Verified</span>
          </div>
          <h3 className="text-xl font-black text-foreground">Why 2,400+ Finance Leaders Choose Futrix</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-2 bg-foreground/5 rounded-2xl border border-border">
            <div className="flex gap-1">
              {FIVE_STARS.map((i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
            </div>
            <span className="text-xs font-bold text-foreground">
              4.9 / 5 <span className="text-foreground/40 font-normal hidden sm:inline">from 320+ reviews</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={prev} aria-label="Previous review" className="w-10 h-10 rounded-xl bg-foreground/5 border border-border flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-all active:scale-95">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} aria-label="Next review" className="w-10 h-10 rounded-xl bg-foreground/5 border border-border flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-all active:scale-95">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Review card */}
      <div className="bg-gradient-to-br from-foreground/[0.03] to-foreground/[0.01] border border-border/80 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <Quote className="w-12 h-12 text-emerald-500/15 absolute right-6 top-6 pointer-events-none" aria-hidden />
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: rev.rating }, (_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="text-xs text-foreground/40 font-medium ml-2">Verified Review</span>
          </div>
          <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed italic">&ldquo;{rev.quote}&rdquo;</p>
        </div>
        <div className="flex items-center justify-between pt-6 border-t border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-sm flex items-center justify-center shadow-sm flex-shrink-0">
              {rev.author[0]}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-foreground">{rev.author}</p>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-xs text-foreground/50">{rev.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all ${idx === i ? "w-6 bg-emerald-500" : "w-2 bg-foreground/20 hover:bg-foreground/40"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
