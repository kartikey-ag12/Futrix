import { useState, useEffect } from "react";

export interface ForecastItem {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  data: any;
}

export function useForecasts() {
  const [forecasts, setForecasts] = useState<ForecastItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchForecasts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/forecasts");
      if (res.ok) {
        const data = await res.json();
        setForecasts(data.forecasts || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForecasts();
  }, []);

  const getForecastsByType = (type: string) => {
    return forecasts.filter(f => f.type === type);
  };

  return { forecasts, isLoading, getForecastsByType, fetchForecasts };
}
