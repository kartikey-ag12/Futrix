"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ForecastContextType {
  cashFlowView: boolean;
  setCashFlowView: (val: boolean) => void;
  predictionsExplanation: boolean;
  setPredictionsExplanation: (val: boolean) => void;
}

const ForecastContext = createContext<ForecastContextType | undefined>(undefined);

export function ForecastProvider({ children }: { children: ReactNode }) {
  const [cashFlowView, setCashFlowView] = useState(false);
  const [predictionsExplanation, setPredictionsExplanation] = useState(false);

  return (
    <ForecastContext.Provider value={{ cashFlowView, setCashFlowView, predictionsExplanation, setPredictionsExplanation }}>
      {children}
    </ForecastContext.Provider>
  );
}

export function useForecastContext() {
  const context = useContext(ForecastContext);
  if (!context) {
    throw new Error("useForecastContext must be used within a ForecastProvider");
  }
  return context;
}
