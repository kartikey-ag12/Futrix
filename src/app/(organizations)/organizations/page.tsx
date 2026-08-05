"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { AddOrganisationPanel } from "@/components/organizations/AddOrganisationPanel";

function OrganizationsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") || "organizations";
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const setTab = (newTab: string) => {
    router.push(`/organizations${newTab === "organizations" ? "" : `?tab=${newTab}`}`);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <AddOrganisationPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
      {/* Top Tabs */}
      <div className="bg-card px-8 border-b border-border flex items-center h-14 gap-8">
        <button
          onClick={() => setTab("organizations")}
          className={`h-full text-sm font-semibold border-b-2 transition-colors ${
            tab === "organizations" ? "border-emerald-600 text-emerald-800" : "border-transparent text-foreground/60 hover:text-foreground"
          }`}
        >
          Organisations
        </button>
        <button
          onClick={() => setTab("users")}
          className={`h-full text-sm font-semibold border-b-2 transition-colors ${
            tab === "users" ? "border-emerald-600 text-emerald-800" : "border-transparent text-foreground/60 hover:text-foreground"
          }`}
        >
          Users
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full p-8">
          {tab === "organizations" ? <OrganizationsView onOpenAdd={() => setIsPanelOpen(true)} /> : <UsersView />}
        </div>
      </div>
    </div>
  );
}

function OrganizationsView({ onOpenAdd }: { onOpenAdd: () => void }) {
  const [subTab, setSubTab] = useState("data-connected");
  const [orgData, setOrgData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrg() {
      try {
        const res = await fetch("/api/settings/organization");
        if (res.ok) {
          const data = await res.json();
          setOrgData(data.workspace);
        }
      } catch (err) {
        console.error("Failed to fetch organization:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrg();
  }, []);

  return (
    <div className="flex flex-col animate-in fade-in duration-200">
      {/* Sub Tabs */}
      <div className="flex gap-8 border-b border-border">
        <button
          onClick={() => setSubTab("data-connected")}
          className={`pb-3 text-sm font-semibold transition-colors relative ${
            subTab === "data-connected" ? "text-foreground" : "text-foreground/60 hover:text-foreground"
          }`}
        >
          Data connected organisations
          {subTab === "data-connected" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600" />
          )}
        </button>
        <button
          onClick={() => setSubTab("consolidations")}
          className={`pb-3 text-sm font-semibold transition-colors relative ${
            subTab === "consolidations" ? "text-foreground" : "text-foreground/60 hover:text-foreground"
          }`}
        >
          Consolidations
          {subTab === "consolidations" && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600" />
          )}
        </button>
      </div>

      {/* Actions */}
      <div className="flex justify-end py-6">
        <button 
          onClick={onOpenAdd}
          className="bg-[#0f8a55] hover:bg-[#0c7447] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
        >
          Add new organisation
        </button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-card text-xs font-medium text-foreground/60">
              <th className="py-4 px-6 font-medium w-16"></th>
              <th className="py-4 px-6 font-medium"></th>
              <th className="py-4 px-6 font-medium">Subscription</th>
              <th className="py-4 px-6 font-medium">Sync status</th>
              <th className="py-4 px-6 font-medium">Last synced</th>
              <th className="py-4 px-6 font-medium w-16"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-foreground/50 text-sm">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 opacity-50" />
                  Loading...
                </td>
              </tr>
            ) : orgData ? (
              <tr className="hover:bg-foreground/[0.02] transition-colors border-b border-border last:border-0 group">
                <td className="py-4 px-6">
                  <div className="w-10 h-10 rounded-lg bg-[#00b7e2] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 19.5C16.1421 19.5 19.5 16.1421 19.5 12C19.5 7.85786 16.1421 4.5 12 4.5C7.85786 4.5 4.5 7.85786 4.5 12C4.5 16.1421 7.85786 19.5 12 19.5Z" opacity="0.3"/>
                      <path d="M15.5 8.5L8.5 15.5M8.5 8.5L15.5 15.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </td>
                <td className="py-4 px-6 text-sm font-medium text-foreground">
                  {orgData.name || "Demo Company (Global)"}
                </td>
                <td className="py-4 px-6 text-sm text-foreground/80">
                  Active
                </td>
                <td className="py-4 px-6 text-sm text-foreground/80">
                  Synced
                </td>
                <td className="py-4 px-6 text-sm text-foreground/80">
                  Just now
                </td>
                <td className="py-4 px-6 text-right">
                  <button className="text-foreground/40 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-foreground/50 text-sm">
                  No organisations connected yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsersView() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await fetch("/api/settings/team");
        if (res.ok) {
          const data = await res.json();
          setTeam(data.team || []);
        }
      } catch (err) {
        console.error("Failed to fetch team:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeam();
  }, []);

  return (
    <div className="flex flex-col animate-in fade-in duration-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Users</h2>
        <button className="bg-[#0f8a55] hover:bg-[#0c7447] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors">
          Invite new user
        </button>
      </div>

      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-card text-xs font-medium text-foreground/60">
              <th className="py-4 px-6 font-medium">User Name</th>
              <th className="py-4 px-6 font-medium">Email Address</th>
              <th className="py-4 px-6 font-medium">Role</th>
              <th className="py-4 px-6 font-medium w-16"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-foreground/50 text-sm">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 opacity-50" />
                  Loading...
                </td>
              </tr>
            ) : team.length > 0 ? (
              team.map((member: any) => (
                <tr key={member.id} className="hover:bg-foreground/[0.02] transition-colors border-b border-border last:border-0 group">
                  <td className="py-4 px-6 text-sm font-medium text-foreground">
                    {member.user?.name || "Unknown User"}
                  </td>
                  <td className="py-4 px-6 text-sm text-foreground/80">
                    {member.user?.email || "No email"}
                  </td>
                  <td className="py-4 px-6 text-sm text-foreground/80">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">
                      {member.role === "ADMIN" ? "Owner" : "Member"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-foreground/40 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-foreground/50 text-sm">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function OrganizationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-foreground/50"/></div>}>
      <OrganizationsContent />
    </Suspense>
  );
}
