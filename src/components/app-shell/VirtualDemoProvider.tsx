"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { TourStep, useGuidedTour } from "@/hooks/useGuidedTour";
import { GuidedTourOverlay } from "@/components/shared/GuidedTourOverlay";

interface VirtualDemoContextType {
  startTour: (tourId: string, steps: TourStep[]) => void;
  endTour: () => void;
  activeTourId: string | null;
}

const VirtualDemoContext = createContext<VirtualDemoContextType | null>(null);

export function useVirtualDemo() {
  const context = useContext(VirtualDemoContext);
  if (!context) throw new Error("useVirtualDemo must be used within VirtualDemoProvider");
  return context;
}

export function VirtualDemoProvider({ children }: { children: ReactNode }) {
  const [activeTourId, setActiveTourId] = useState<string | null>(null);
  const [tourSteps, setTourSteps] = useState<TourStep[]>([]);

  const tour = useGuidedTour(tourSteps);

  const startTour = (tourId: string, steps: TourStep[]) => {
    setActiveTourId(tourId);
    setTourSteps(steps);
    // When startTour is called, useGuidedTour will re-render with new steps.
    // We need to wait for it or just let the render cycle handle it.
  };

  const endTour = async () => {
    if (activeTourId) {
      try {
        await fetch("/api/user/tours", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tourId: activeTourId }),
        });
      } catch (e) {
        console.error(e);
      }
    }
    setActiveTourId(null);
    setTourSteps([]);
    tour.endTour();
  };

  const handleNext = () => {
    if (tour.currentStepIndex >= tour.totalSteps - 1) {
      endTour();
    } else {
      tour.nextStep();
    }
  };

  // If tour reaches end organically
  if (tour.totalSteps > 0 && !tour.isActive && activeTourId) {
    // Timeout to avoid state update during render
    setTimeout(() => {
      endTour();
    }, 0);
  }

  return (
    <VirtualDemoContext.Provider value={{ startTour, endTour, activeTourId }}>
      {children}
      {tour.isActive && activeTourId && tour.currentStep && (
        <GuidedTourOverlay
          step={tour.currentStep}
          isActionCompleted={tour.isActionCompleted}
          onNext={handleNext}
        />
      )}
    </VirtualDemoContext.Provider>
  );
}
