import { type ReactNode } from "react";
import clsx from "clsx";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  trend?: number;
  trendLabel?: string;
  icon: ReactNode;
  className?: string;
}

export function KPICard({ title, value, trend, trendLabel, icon, className }: KPICardProps) {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;

  return (
    <div className={clsx(
      "bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col gap-5 hover:shadow-md transition-shadow",
      className
    )}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-foreground/55 leading-snug">{title}</p>
        <div className="p-2.5 bg-primary/8 rounded-xl text-primary flex-shrink-0 mt-[-2px]">
          {icon}
        </div>
      </div>

      {/* Value */}
      <div>
        <div className="text-3xl font-black tracking-tight text-foreground">{value}</div>

        {trend !== undefined && (
          <div className="flex items-center gap-2 mt-2">
            <span className={clsx(
              "flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full",
              isPositive && "bg-emerald-100 text-emerald-700",
              isNegative && "bg-red-100 text-red-600",
              !isPositive && !isNegative && "bg-foreground/5 text-foreground/50"
            )}>
              {isPositive && <ArrowUpRight className="w-3 h-3" />}
              {isNegative && <ArrowDownRight className="w-3 h-3" />}
              {isPositive ? "+" : ""}{trend}%
            </span>
            {trendLabel && (
              <span className="text-xs text-foreground/40">{trendLabel}</span>
            )}
          </div>
        )}

        {trend === undefined && trendLabel && (
          <p className="text-xs text-foreground/40 mt-2">{trendLabel}</p>
        )}
      </div>
    </div>
  );
}
