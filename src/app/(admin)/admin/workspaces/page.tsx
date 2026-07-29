import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Building2, Link as LinkIcon, Users as UsersIcon, MoreVertical } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminWorkspacesPage() {
  const workspaces = await prisma.workspace.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      members: {
        include: { user: true }
      },
      integrations: true,
    }
  });

  return (
    <div className="p-8 max-w-[90rem] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
            <Building2 className="w-8 h-8 text-indigo-500" />
            Workspaces Management
          </h1>
          <p className="text-sm text-foreground/50 mt-1">View registered companies, their members, and integration health.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-foreground/5 text-foreground/70 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Workspace</th>
                <th className="px-6 py-4">Members</th>
                <th className="px-6 py-4">Integrations</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {workspaces.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-foreground/50">
                    <div className="flex flex-col items-center justify-center">
                      <Building2 className="w-12 h-12 text-foreground/20 mb-4" />
                      <p className="text-lg font-medium">No workspaces found</p>
                      <p className="text-sm">No companies have registered on the platform yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                workspaces.map((workspace) => (
                  <tr key={workspace.id} className="hover:bg-foreground/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">{workspace.name}</span>
                        <span className="text-foreground/40 text-xs font-mono mt-0.5">{workspace.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 mb-1">
                        <UsersIcon className="w-4 h-4 text-foreground/40" />
                        <span className="font-semibold text-foreground/80">{workspace.members.length}</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        {workspace.members.slice(0, 2).map((wm) => (
                          <span key={wm.userId} className="text-[10px] text-foreground/60 truncate max-w-[150px]">
                            {wm.user.name || wm.user.email} <span className="text-foreground/30">({wm.role})</span>
                          </span>
                        ))}
                        {workspace.members.length > 2 && (
                          <span className="text-[10px] text-foreground/40 italic">+{workspace.members.length - 2} more</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {workspace.integrations.length === 0 ? (
                        <span className="text-foreground/40 text-xs italic">Not Connected</span>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          {workspace.integrations.map((int) => {
                            const isExpired = int.expiresAt ? (int.expiresAt * 1000) < Date.now() : false;
                            return (
                              <div key={int.id} className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide border ${isExpired ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                                  {int.provider}
                                </span>
                                {isExpired && <span className="text-[10px] text-red-500 font-semibold">EXPIRED</span>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-foreground/70 text-xs whitespace-nowrap">
                      {format(new Date(workspace.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-foreground/40 hover:text-foreground transition-colors p-2 rounded-lg hover:bg-foreground/10 opacity-0 group-hover:opacity-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
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
