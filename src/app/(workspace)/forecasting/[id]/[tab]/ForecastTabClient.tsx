"use client";

import { useEffect, useState } from "react";
import { ForecastMonthTable } from "@/components/forecasting/ForecastMonthTable";
import { Loader2 } from "lucide-react";

interface ForecastTabClientProps {
  forecastId: string;
  tabId: string;
  title: string;
}

export function ForecastTabClient({ forecastId, tabId, title }: ForecastTabClientProps) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/forecasts/${forecastId}/data`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [forecastId, tabId]);

  const handleDaysToPayChange = async (childId: string, val: number) => {
    // We would persist this to the forecast overrides, but the prompt says 
    // "Days to Pay fields are editable and persist".
    // I will save this as an override keyed by childId + "_daysToPay".
    try {
      await fetch(`/api/forecasts/${forecastId}/data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          overrides: {
            [`${childId}_daysToPay`]: val
          }
        })
      });
      // Optionally reload data if days to pay affects anything else, but for now we just persist it.
    } catch (e) {
      console.error("Failed to save days to pay", e);
    }
  };

  if (isLoading || !data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-foreground/30" />
      </div>
    );
  }

  const tabData = data.tabs[tabId];
  if (!tabData) {
    return <div className="p-6 text-foreground/50">Tab data not found</div>;
  }

  return (
    <ForecastMonthTable 
      title={title}
      months={data.months}
      cashPosition={data.cashPosition}
      summary={tabData.summary}
      groups={tabData.groups}
      onDaysToPayChange={handleDaysToPayChange}
    />
  );
}
