import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      <p className="text-sm font-medium text-foreground/50 animate-pulse">Loading data...</p>
    </div>
  );
}
