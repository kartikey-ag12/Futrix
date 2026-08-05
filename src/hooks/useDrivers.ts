import { useState, useEffect } from "react";

export interface Driver {
  id: string;
  name: string;
  type: string;
  value: string | null;
  unit: string | null;
  driverGroupId?: string | null;
}

export interface DriverGroup {
  id: string;
  name: string;
  createdAt: string;
}

export function useDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [groups, setGroups] = useState<DriverGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDrivers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/drivers");
      if (res.ok) {
        const data = await res.json();
        setDrivers(data.drivers || []);
        setGroups(data.groups || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/drivers")
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => {
        setDrivers(data.drivers || []);
        setGroups(data.groups || []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
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

  const createGroup = async (name: string) => {
    const res = await fetch("/api/drivers/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      await fetchDrivers();
      return true;
    }
    return false;
  };

  const updateGroup = async (id: string, name: string) => {
    const res = await fetch(`/api/drivers/groups/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      await fetchDrivers();
      return true;
    }
    return false;
  };

  const deleteGroup = async (id: string) => {
    const res = await fetch(`/api/drivers/groups/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      await fetchDrivers();
      return true;
    }
    return false;
  };

  const deleteDriver = async (id: string) => {
    const res = await fetch(`/api/drivers/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      await fetchDrivers();
      return true;
    }
    return false;
  };

  return { drivers, groups, isLoading, createDriver, createGroup, updateGroup, deleteGroup, deleteDriver, fetchDrivers };
}
