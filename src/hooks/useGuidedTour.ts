import { useState, useCallback } from "react";

export interface TourStep {
  targetId: string;
  title: string;
  body: string;
  actionRequired: boolean;
  arrowPosition: "left" | "right" | "top" | "bottom";
}

export function useGuidedTour(steps: TourStep[]) {
  const [isActive, setIsActive] = useState(true); // Default active for onboarding
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [actionCompleted, setActionCompleted] = useState(false);

  const currentStep = steps[currentStepIndex];

  const completeAction = useCallback(() => {
    setActionCompleted(true);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setActionCompleted(false);
    } else {
      setIsActive(false); // Tour completed
    }
  }, [currentStepIndex, steps.length]);

  const endTour = useCallback(() => {
    setIsActive(false);
  }, []);

  return {
    isActive,
    currentStep,
    isActionCompleted: !currentStep?.actionRequired || actionCompleted,
    completeAction,
    nextStep,
    endTour,
    currentStepIndex,
    totalSteps: steps.length,
  };
}
