"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">
      {/* Placeholder chat panel */}
      {open && (
        <div className="mb-2 w-72 bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-emerald-500/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-semibold text-white">Futrix Support</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="px-4 py-8 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-sm text-white/70 leading-snug">
              Live chat is coming soon! In the meantime, email us at{" "}
              <a
                href="mailto:support@futrix.io"
                className="text-emerald-400 hover:underline"
              >
                support@futrix.io
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Floating trigger button */}
      <button
        id="chat-widget-trigger"
        onClick={() => setOpen((v) => !v)}
        title="Chat with us"
        aria-label="Open chat"
        className="
          w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400
          text-white shadow-lg shadow-emerald-500/30
          flex items-center justify-center
          transition-all duration-200 hover:scale-110 active:scale-95
        "
      >
        {open ? (
          <X className="w-5 h-5" />
        ) : (
          <MessageCircle className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
