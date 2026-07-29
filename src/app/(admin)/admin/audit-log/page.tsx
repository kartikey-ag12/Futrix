import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { ActivitySquare, ShieldCheck } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminAuditLogPage() {
  const logs = await prisma.adminAuditLog.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      admin: true
    }
  });

  return (
    <div className="p-8 max-w-[90rem] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
            <ActivitySquare className="w-8 h-8 text-amber-500" />
            Admin Audit Log
          </h1>
          <p className="text-sm text-foreground/50 mt-1">Chronological history of all actions performed by platform administrators.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-foreground/5 text-foreground/70 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Administrator</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target Type</th>
                <th className="px-6 py-4 font-mono">Target ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-foreground/50">
                    <div className="flex flex-col items-center justify-center">
                      <ShieldCheck className="w-12 h-12 text-foreground/20 mb-4" />
                      <p className="text-lg font-medium">No audit logs found</p>
                      <p className="text-sm">No administrative actions have been recorded yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-foreground/5 transition-colors">
                    <td className="px-6 py-4 text-foreground/70 text-xs whitespace-nowrap">
                      {format(new Date(log.createdAt), 'MMM d, yyyy · HH:mm:ss')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{log.admin?.name || 'Unknown'}</span>
                        <span className="text-foreground/40 text-[10px]">{log.admin?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground/80 uppercase text-xs tracking-wider">
                      {log.targetType}
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-foreground/50">
                      {log.targetId}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
