"use client";

import { CheckCircle2, Circle, Car, Receipt, CreditCard, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { createPortal } from "react-dom";

interface ForecastChecklistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  forecastId: string;
  checklistState: {
    driversAdded: boolean;
    expensesSet: boolean;
    costsSet: boolean;
    salesCoverOutgoings: boolean;
  };
  manualOverrides: Record<string, boolean>;
}

export function ForecastChecklistModal({
  open,
  onOpenChange,
  userName,
  forecastId,
  checklistState,
  manualOverrides,
}: ForecastChecklistModalProps) {
  const router = useRouter();
  const [localOverrides, setLocalOverrides] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => setLocalOverrides(manualOverrides || {}), 0);
    }
  }, [open, manualOverrides]);

  const handleToggle = (key: string) => {
    setLocalOverrides((prev) => ({
      ...prev,
      [key]: !getIsChecked(key),
    }));
  };

  const getIsChecked = (key: string) => {
    if (localOverrides[key] !== undefined) return localOverrides[key];
    return (checklistState as any)[key] || false;
  };

  const items = [
    {
      key: "driversAdded",
      label: "Add any Drivers required for manual predictions",
      icon: Car,
      action: () => {
        onOpenChange(false);
        router.push("/drivers");
      },
    },
    {
      key: "expensesSet",
      label: "Set Expenses",
      icon: Receipt,
      action: () => {
        onOpenChange(false);
      },
    },
    {
      key: "costsSet",
      label: "Set Costs",
      icon: CreditCard,
      action: () => {
        onOpenChange(false);
      },
    },
    {
      key: "salesCoverOutgoings",
      label: "Set Sales to closed all outgoings",
      icon: DollarSign,
      action: () => {
        onOpenChange(false);
      },
    },
  ];

  const completedCount = items.filter((item) => getIsChecked(item.key)).length;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/forecasts/${forecastId}/checklist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checklistOverrides: localOverrides }),
      });
      onOpenChange(false);
    } catch (e) {
      console.error("Failed to save checklist overrides", e);
    } finally {
      setIsSaving(false);
    }
  };

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed background */}
      <div 
        className="absolute inset-0 bg-black/60 pointer-events-auto"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Modal content */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#1a1a1a] border border-[#e5e5e5] dark:border-white/10 rounded-xl shadow-2xl z-10 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-[#e5e5e5] dark:border-white/10 shrink-0">
          <h2 className="text-lg font-bold text-foreground">
            Hi {userName}, these steps may help when creating.
          </h2>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>{completedCount} of 4 have been completed</span>
            </div>
            <div className="h-2 w-full bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${(completedCount / 4) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item) => {
              const isChecked = getIsChecked(item.key);
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  className="flex items-center gap-3 p-3 rounded-lg border border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  onClick={(e) => {
                    // If clicking the text, it navigates
                    if ((e.target as HTMLElement).closest(".checkbox-hitbox")) return;
                    if (!isChecked) item.action();
                  }}
                >
                  <div
                    className="checkbox-hitbox p-1 -m-1 cursor-pointer shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(item.key);
                    }}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-foreground/40" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-black/5 dark:bg-white/10 rounded-md shrink-0">
                      <Icon className="w-4 h-4 text-foreground/60" />
                    </div>
                    <span className={clsx("text-sm font-medium truncate", isChecked && "line-through text-foreground/40")}>
                      {item.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 border-t border-[#e5e5e5] dark:border-white/10 shrink-0 flex justify-end gap-3 bg-black/5 dark:bg-white/5 rounded-b-xl">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm font-medium border border-black/10 dark:border-white/20 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
