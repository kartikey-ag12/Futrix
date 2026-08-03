import { useState, useEffect } from "react";

export function useXeroData() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchXeroData = async () => {
      try {
        const res = await fetch("/api/xero/sync", { method: "POST" });
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (e) {
        console.error("Failed to fetch Xero data", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchXeroData();
  }, []);

  return { data, isLoading };
}
