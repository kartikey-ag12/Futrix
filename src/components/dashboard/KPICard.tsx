import { type ReactNode } from "react";
import clsx from "clsx";

interface KPICardProps {
  title: string;
  value: string;
  trend?: number;
  trendLabel?: string;
  icon: ReactNode;
  className?: string;
}

export function KPICard({ title, value, trend, trendLabel, icon, className }: KPICardProps) {
  const isPositive = trend && trend > 0;
  
  return (
    <div className={clsx("bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col gap-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground/60">{title}</h3>
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          {icon}
        </div>
      </div>
      
      <div>
        <div className="text-3xl font-bold">{value}</div>
        {trend !== undefined && (
          <div className="flex items-center gap-2 mt-2">
            <span className={clsx(
              "text-xs font-semibold px-2 py-1 rounded-full",
              isPositive ? "bg-accent/10 text-accent" : "bg-red-500/10 text-red-500"
            )}>
              {isPositive ? "+" : ""}{trend}%
            </span>
            {trendLabel && (
              <span className="text-xs text-foreground/50">{trendLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
