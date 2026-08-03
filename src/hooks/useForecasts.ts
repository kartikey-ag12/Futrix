import { useState } from "react";

export interface Forecast {
  id: string;
  name: string;
  type: "1yr-pl" | "3yr-cf" | "3yr-cf-inv";
  updatedAt: string;
  // Mock data payload for the chart
  data: Array<{ month: string; actual: number; target: number }>;
}

export function useForecasts(initialData: Forecast[] = []) {
  // Hardcoded to an empty array for now as per Phase 3 requirements.
  // We can pass data in for testing the populated state.
  const [forecasts] = useState<Forecast[]>(initialData);

  return { forecasts };
}
