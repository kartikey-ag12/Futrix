"use client";

import Link from "next/link";
import { Plus, LayoutTemplate, Square, LayoutGrid } from "lucide-react";

const REPORT_TYPES = [
  { id: "landscape", title: "Landscape report", icon: Square, rotation: "rotate-90" },
  { id: "portrait", title: "Portrait report", icon: Square, rotation: "" },
  { id: "dashboard", title: "Dashboard", icon: LayoutGrid, rotation: "" },
];

export default function ReportTypePickerPage() {
  return (
    <div className="flex-1 flex flex-col p-8 lg:p-12">
      
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center pb-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-foreground mb-3">What type of report do you want?</h1>
          <p className="text-foreground/60 text-lg">You can always change this later in report settings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REPORT_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <div 
                key={type.id}
                className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-emerald-500/50 hover:shadow-md transition-all group"
              >
                <div className="w-20 h-20 mb-6 bg-foreground/5 rounded-xl flex items-center justify-center">
                  <Icon className={`w-10 h-10 text-foreground/40 ${type.rotation}`} />
                </div>
                
                <h3 className="text-xl font-medium text-foreground mb-8">{type.title}</h3>
                
                <Link
                  href={`/reporting/builder?type=${type.id}`}
                  className="w-14 h-14 rounded-2xl border-2 border-[#e5e5e5] dark:border-white/10 flex items-center justify-center text-foreground/50 hover:border-emerald-500 hover:text-emerald-500 hover:bg-emerald-50 transition-colors"
                >
                  <Plus className="w-6 h-6" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Left Button */}
      <div className="absolute bottom-8 left-8">
        <Link
          href="/reporting"
          className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium shadow-sm transition-colors"
        >
          End guided flow
        </Link>
      </div>

    </div>
  );
}
