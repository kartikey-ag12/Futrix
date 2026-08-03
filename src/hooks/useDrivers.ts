import { useState, useEffect } from "react";

export interface Driver {
  id: string;
  name: string;
  type: string;
  value: string | null;
  unit: string | null;
  createdAt: string;
}

export function useDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDrivers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/drivers");
      if (res.ok) {
        const data = await res.json();
        setDrivers(data.drivers || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const createDriver = async (payload: Partial<Driver>) => {
    const res = await fetch("/api/drivers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      await fetchDrivers();
      return true;
    }
    return false;
  };

  return { drivers, isLoading, createDriver, fetchDrivers };
}
