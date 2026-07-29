import { prisma } from "@/lib/prisma";
import { Link as LinkIcon, Building2, ExternalLink, ShieldAlert, CheckCircle2 } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminIntegrationsPage() {
  const integrations = await prisma.integration.findMany({
    include: {
      workspace: true
    }
  });

  return (
    <div className="p-8 max-w-[90rem] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
            <LinkIcon className="w-8 h-8 text-emerald-500" />
            Integration Health
          </h1>
          <p className="text-sm text-foreground/50 mt-1">Monitor the connection status of 3rd-party accounting software across all workspaces.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-foreground/5 text-foreground/70 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Workspace</th>
                <th className="px-6 py-4">Provider</th>
                <th className="px-6 py-4">Tenant ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {integrations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-foreground/50">
                    <div className="flex flex-col items-center justify-center">
                      <LinkIcon className="w-12 h-12 text-foreground/20 mb-4" />
                      <p className="text-lg font-medium">No integrations found</p>
                      <p className="text-sm">No workspaces have connected any 3rd-party providers yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                integrations.map((int) => {
                  const isExpired = int.expiresAt ? (int.expiresAt * 1000) < Date.now() : false;
                  
                  return (
                    <tr key={int.id} className="hover:bg-foreground/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-4 h-4 text-indigo-500" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground">{int.workspace.name}</span>
                            <span className="text-foreground/40 text-[10px] font-mono">{int.workspaceId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-widest bg-foreground/5 border border-border">
                          {int.provider}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-foreground/60 font-mono text-xs">
                          {int.tenantId || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isExpired ? (
                          <div className="inline-flex items-center gap-2 text-red-500 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
                            <ShieldAlert className="w-4 h-4" />
                            <span className="text-xs font-bold">TOKEN EXPIRED</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-xs font-bold">HEALTHY</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-foreground/50 hover:text-foreground hover:bg-foreground/10 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1.5">
                          Inspect <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
