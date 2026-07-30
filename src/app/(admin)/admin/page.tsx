import { prisma } from "@/lib/prisma";
import { Users, Building2, Link as LinkIcon, Activity, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Suspense } from "react";

export const dynamic = 'force-dynamic';

function AdminOverviewSkeleton() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      <div>
        <div className="h-9 bg-foreground/10 rounded w-48 mb-2"></div>
        <div className="h-4 bg-foreground/10 rounded w-64"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="p-3 rounded-xl bg-foreground/5 w-12 h-12"></div>
            <div className="space-y-2">
              <div className="h-4 bg-foreground/10 rounded w-20"></div>
              <div className="h-8 bg-foreground/10 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-2xl h-64 shadow-sm"></div>
    </div>
  );
}

async function AdminOverviewData() {
  const [userCount, workspaceCount, integrationCount, sessionCount, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.workspace.count(),
    prisma.integration.count(),
    prisma.refreshToken.count({ where: { revoked: false, expiresAt: { gt: new Date() } } }),
    prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5, select: { id: true, name: true, email: true, createdAt: true, role: true } })
  ]);

  const stats = [
    { name: 'Total Users', value: userCount, icon: Users, color: 'text-blue-500' },
    { name: 'Total Workspaces', value: workspaceCount, icon: Building2, color: 'text-indigo-500' },
    { name: 'Active Integrations', value: integrationCount, icon: LinkIcon, color: 'text-emerald-500' },
    { name: 'Active Sessions', value: sessionCount, icon: Activity, color: 'text-amber-500' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Admin Overview</h1>
        <p className="text-sm text-foreground/50 mt-1">Platform-wide statistics and recent activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-xl bg-foreground/5 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/50">{stat.name}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-foreground/50" />
            Recent Signups
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-foreground/5 text-foreground/70 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentUsers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-foreground/50">
                    No users found.
                  </td>
                </tr>
              ) : (
                recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-foreground/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{user.name || 'Unknown'}</span>
                        <span className="text-foreground/50 text-xs">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${user.role === 'ADMIN' ? 'bg-red-500/10 text-red-500' : 'bg-foreground/10 text-foreground/70'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground/70 whitespace-nowrap">
                      {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
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

export default function AdminOverviewPage() {
  return (
    <Suspense fallback={<AdminOverviewSkeleton />}>
      <AdminOverviewData />
    </Suspense>
  );
}
