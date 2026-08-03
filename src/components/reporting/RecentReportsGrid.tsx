"use client";

import Link from "next/link";
import { useReports } from "@/hooks/useReports";

export function RecentReportsGrid() {
  const { reports } = useReports();
  // For the grid, we just grab a few standard reports to mock "Recently used"
  const recentReports = reports.filter(r => r.type === "report").slice(0, 4);

  return (
    <div className="w-full mb-10">
      <h2 className="text-base font-semibold text-foreground mb-4">Recently used reports and dashboards</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recentReports.map((report) => (
          <Link
            key={report.id}
            href={`/reporting/view/${report.id}`}
            className="group relative flex flex-col items-center justify-center h-48 bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/8 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all cursor-pointer"
          >
            <div className="p-6 text-center">
              <h3 className="font-medium text-foreground text-sm group-hover:text-emerald-600 transition-colors">
                {report.name}
              </h3>
            </div>
            
            <div className="absolute bottom-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-foreground/5 text-foreground/60 border border-foreground/10 group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:border-emerald-200 transition-colors">
                {report.pages} page{report.pages !== 1 ? 's' : ''}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
