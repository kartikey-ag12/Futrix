import { prisma } from "@/lib/prisma";
import { formatDistanceToNow, format } from "date-fns";
import { Users as UsersIcon, Search, MoreVertical, ShieldAlert } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      workspaces: {
        include: { workspace: true }
      },
      refreshTokens: {
        where: { revoked: false, expiresAt: { gt: new Date() } }
      }
    }
  });

  return (
    <div className="p-8 max-w-[90rem] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
            <UsersIcon className="w-8 h-8 text-blue-500" />
            Users Management
          </h1>
          <p className="text-sm text-foreground/50 mt-1">Manage and view all registered users and their platform roles.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* We would normally put a client-side search component here, but for now we list all */}
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-foreground/5 text-foreground/70 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Platform Role</th>
                <th className="px-6 py-4">Workspaces</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-foreground/50">
                    <div className="flex flex-col items-center justify-center">
                      <UsersIcon className="w-12 h-12 text-foreground/20 mb-4" />
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm">The platform currently has zero registered users.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-foreground/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{user.name || 'Unknown'}</span>
                        <span className="text-foreground/50 text-xs">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${user.role === 'ADMIN' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-foreground/10 text-foreground/70 border border-border'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.workspaces.length === 0 ? (
                        <span className="text-foreground/40 italic text-xs">No Workspaces</span>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {user.workspaces.map((wm) => (
                            <span key={wm.workspaceId} className="text-xs font-medium text-foreground/80 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/50" />
                              {wm.workspace.name} <span className="text-foreground/40">({wm.role})</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.refreshTokens.length > 0 ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-500 text-xs font-medium">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          Active Session
                        </span>
                      ) : (
                        <span className="text-foreground/40 text-xs font-medium">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-foreground/70 text-xs whitespace-nowrap">
                      {format(new Date(user.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-foreground/40 hover:text-foreground transition-colors p-2 rounded-lg hover:bg-foreground/10">
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
