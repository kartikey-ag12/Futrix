"use client";

import { useEffect, useState } from "react";
import { TourStep } from "@/hooks/useGuidedTour";
import { createPortal } from "react-dom";
import clsx from "clsx";

interface GuidedTourOverlayProps {
  step: TourStep;
  isActionCompleted: boolean;
  onNext: () => void;
}

// Hand-drawn style curved arrow SVG
function CurvedArrow({ position }: { position: string }) {
  // We'll render a simple SVG arrow that points generally towards the target.
  // In a real app, you'd have specific SVGs for different directions.
  const rotation = position === "right" ? "scale-x-[-1]" : position === "bottom" ? "rotate-90" : "";
  
  return (
    <svg 
      className={`absolute w-16 h-16 text-emerald-400 ${rotation}`} 
      style={{
        ...(position === "right" ? { right: -50, top: 40 } : { left: -50, top: 40 })
      }}
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M90 10 C 60 10, 40 40, 20 80" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeDasharray="4 4" 
      />
      <path 
        d="M20 80 L 35 70 M20 80 L 15 65" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
      />
    </svg>
  );
}

export function GuidedTourOverlay({ step, isActionCompleted, onNext }: GuidedTourOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const updateRect = () => {
      const el = document.getElementById(step.targetId);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
        // Temporarily elevate the target above the overlay
        el.classList.add("relative", "z-[60]");
      }
    };

    updateRect();
    // Re-calc on resize
    window.addEventListener("resize", updateRect);
    
    return () => {
      window.removeEventListener("resize", updateRect);
      const el = document.getElementById(step.targetId);
      if (el) {
        el.classList.remove("relative", "z-[60]");
      }
    };
  }, [step.targetId, mounted]);

  if (!mounted) return null;

  // The position of the callout box relative to the target
  // Default to rendering it roughly in the center-top if we can't find the target yet
  let calloutStyle: React.CSSProperties = { top: '20%', left: '50%', transform: 'translateX(-50%)' };
  
  if (targetRect) {
    // If arrow points to a right-side panel, place callout on the left of it
    if (step.arrowPosition === "right") {
      calloutStyle = {
        top: Math.max(20, targetRect.top + 20) + "px",
        left: Math.max(20, targetRect.left - 380) + "px", // 380px roughly fits the callout + arrow
      };
    } else {
      calloutStyle = {
        top: Math.max(20, targetRect.bottom + 40) + "px",
        left: targetRect.left + "px",
      };
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Dimmed Background */}
      <div className="absolute inset-0 bg-black/60 pointer-events-auto transition-opacity" />
      
      {/* Callout Box */}
      <div 
        className="absolute w-[320px] bg-white text-foreground rounded-2xl p-6 shadow-2xl pointer-events-auto transition-all duration-300 ease-in-out"
        style={calloutStyle}
      >
        <CurvedArrow position={step.arrowPosition} />
        
        <h3 className="text-lg font-bold mb-2">{step.title}</h3>
        <p className="text-sm text-foreground/70 mb-6 leading-relaxed">{step.body}</p>
        
        <button
          onClick={onNext}
          disabled={!isActionCompleted}
          className={clsx(
            "w-full py-2.5 rounded-lg font-medium transition-colors",
            isActionCompleted 
              ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
              : "bg-foreground/5 text-foreground/40 cursor-not-allowed"
          )}
        >
          Next
        </button>
      </div>
    </div>,
    document.body
  );
}
