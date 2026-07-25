"use client";

import { useState, useEffect } from "react";
import {
  Building2, CreditCard, Users, Bell, Shield,
  RefreshCcw, CheckCircle2, Plug, Mail, ChevronRight,
  Lock, UserPlus, AlertTriangle, Check
} from "lucide-react";

const TABS = [
  { id: "organization",  label: "Organisation",    icon: Building2  },
  { id: "integrations",  label: "Integrations",    icon: Plug       },
  { id: "team",          label: "Team Members",    icon: Users      },
  { id: "billing",       label: "Billing",         icon: CreditCard },
  { id: "notifications", label: "Notifications",   icon: Bell       },
  { id: "security",      label: "Security",        icon: Shield     },
];

function FormField({
  label, type = "text", defaultValue, placeholder, children, hint,
}: {
  label: string; type?: string; defaultValue?: string; placeholder?: string;
  children?: React.ReactNode; hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground/80">{label}</label>
      {children ?? (
        <input
          type={type}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all"
        />
      )}
      {hint && <p className="text-xs text-foreground/40">{hint}</p>}
    </div>
  );
}

function Toggle({ label, description, defaultChecked = false }: { label: string; description: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div>
        <h4 className="text-sm font-medium text-foreground">{label}</h4>
        <p className="text-xs text-foreground/50 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${on ? "bg-primary" : "bg-foreground/15"}`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${on ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
    </div>
  );
}

function SectionCard({ title, description, action, children }: {
  title: string; description?: string;
  action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          {description && <p className="text-xs text-foreground/50 mt-0.5">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("integrations");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleXeroSync = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/xero/sync', { method: 'POST' });
      const data = await res.json();
      if (res.ok) alert(`${data.message}\nFound ${data.records_synced} invoices.`);
      else alert(`Error: ${data.error}`);
    } catch { alert("Failed to connect to sync endpoint."); }
    finally { setIsSyncing(false); }
  };



  return (
    <div className="flex flex-col gap-7 max-w-4xl">

      {/* ── Page header ── */}
      <div>
        <h1 className="text-2xl font-black text-foreground tracking-tight">Settings</h1>
        <p className="text-sm text-foreground/50 mt-0.5">Manage your organisation, team, and platform preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        {/* ── Sidebar nav ── */}
        <div className="md:col-span-1 flex md:flex-col overflow-x-auto gap-1.5 pb-2 md:pb-0 scrollbar-none flex-shrink-0">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all text-left whitespace-nowrap group ${
                  isActive
                    ? "bg-primary/10 text-primary font-bold shadow-sm"
                    : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-primary" : "text-foreground/40 group-hover:text-foreground/60"}`} />
                <span className="flex-1">{tab.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-primary/60 hidden md:block" />}
              </button>
            );
          })}
        </div>

        {/* ── Content ── */}
        <div className="md:col-span-3 flex flex-col gap-5">

          {/* Organisation */}
          {activeTab === "organization" && (
            <>
              <SectionCard title="Organisation Profile" description="Update your company details.">
                <div className="p-6 flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField label="Company Name" defaultValue="Acme Corp" />
                    <FormField label="Industry">
                      <select className="px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all">
                        <option>Technology</option>
                        <option>Finance</option>
                        <option>Healthcare</option>
                        <option>Retail</option>
                      </select>
                    </FormField>
                    <FormField label="Business Email" type="email" defaultValue="hello@acmecorp.com" />
                    <FormField label="Country">
                      <select className="px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all">
                        <option>United Kingdom</option>
                        <option>United States</option>
                        <option>Australia</option>
                        <option>India</option>
                      </select>
                    </FormField>
                  </div>
                  <FormField label="Company Description" hint="A brief description shown in client-facing reports.">
                    <textarea
                      rows={3}
                      defaultValue="Leading technology consultancy helping businesses grow through digital transformation."
                      className="px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none"
                    />
                  </FormField>
                  <div className="flex justify-end pt-1">
                    <button className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm">
                      Save Changes
                    </button>
                  </div>
                </div>
              </SectionCard>
            </>
          )}

          {/* Integrations */}
          {activeTab === "integrations" && (
            <SectionCard title="Connected Integrations" description="Manage your accounting software connections.">
              <div className="divide-y divide-border">
                {/* Xero */}
                <div className="px-6 py-4 flex items-center gap-4">
                  <div className="w-11 h-11 bg-[#1AB4D7]/10 border border-[#1AB4D7]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-[#1AB4D7] font-black text-lg">X</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-foreground">Xero</h4>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Connected
                      </span>
                    </div>
                    <p className="text-xs text-foreground/50 mt-0.5">Invoices, bills, and bank transactions synced automatically</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={handleXeroSync}
                      disabled={isSyncing}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/8 text-primary rounded-lg text-xs font-semibold hover:bg-primary/15 transition-colors disabled:opacity-50"
                    >
                      <RefreshCcw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      {isSyncing ? "Syncing…" : "Sync"}
                    </button>
                    <a href="/api/xero/connect" className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium hover:bg-foreground/5 transition-colors text-foreground/60">
                      Reconnect
                    </a>
                  </div>
                </div>

              </div>
            </SectionCard>
          )}

          {/* Team */}
          {activeTab === "team" && (
            <SectionCard
              title="Team Members"
              description="Manage who has access to your organisation."
              action={
                <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors">
                  <UserPlus className="w-3.5 h-3.5" /> Invite
                </button>
              }
            >
              <div className="divide-y divide-border">
                {[
                  { name: "Kartikey",  email: "kartikey@example.com", role: "Owner", color: "bg-primary/15 text-primary"   },
                  { name: "Aman",      email: "aman@example.com",      role: "Admin", color: "bg-blue-100 text-blue-600"    },
                ].map((m) => (
                  <div key={m.email} className="flex items-center gap-4 px-6 py-4">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${m.color}`}>
                      {m.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{m.name}</p>
                      <p className="text-xs text-foreground/50 truncate">{m.email}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-foreground/5 border border-border text-foreground/60 rounded-lg text-xs font-medium flex-shrink-0">
                      {m.role}
                    </span>
                  </div>
                ))}
                <div className="px-6 py-4">
                  <button className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-xl text-sm text-foreground/40 hover:border-primary/40 hover:text-primary/60 transition-all">
                    <UserPlus className="w-4 h-4" /> Invite a team member
                  </button>
                </div>
              </div>
            </SectionCard>
          )}

          {/* Billing */}
          {activeTab === "billing" && (
            <SectionCard title="Billing & Plan" description="Manage your subscription and payment method.">
              <div className="p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-primary/8 to-transparent border border-primary/20 rounded-2xl">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-primary">Professional Plan</h4>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">Active</span>
                    </div>
                    <p className="text-sm text-foreground/60">$149/month · Next billing: Aug 1, 2026</p>
                  </div>
                  <button className="px-4 py-2 bg-card border border-border rounded-xl text-sm font-medium hover:bg-foreground/5 transition-colors">
                    Manage Plan
                  </button>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Payment Method</h4>
                  <div className="flex items-center gap-3 p-4 border border-border rounded-xl bg-foreground/[0.02]">
                    <div className="w-9 h-6 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Visa ending in 4242</p>
                      <p className="text-xs text-foreground/50">Expires 12/28</p>
                    </div>
                    <button className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">Edit</button>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-3">Recent Invoices</h4>
                  <div className="space-y-2">
                    {[
                      { date: "Jul 1, 2026", amount: "$149.00", status: "Paid" },
                      { date: "Jun 1, 2026", amount: "$149.00", status: "Paid" },
                    ].map(inv => (
                      <div key={inv.date} className="flex items-center justify-between py-2.5 px-4 border border-border rounded-xl">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm text-foreground">{inv.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-foreground">{inv.amount}</span>
                          <span className="text-xs text-emerald-600 font-medium">{inv.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <SectionCard title="Notification Preferences" description="Choose what and how you want to be notified.">
              <div className="px-6 divide-y divide-border">
                <div className="py-2">
                  <p className="text-xs font-bold text-foreground/40 uppercase tracking-wider py-3">Email Notifications</p>
                  <Toggle label="Weekly Financial Summary" description="A weekly digest of your revenue, expenses, and cash position." defaultChecked />
                  <Toggle label="AI Insights Alerts" description="Get notified when AI detects an anomaly or opportunity." defaultChecked />
                  <Toggle label="Sync Failures" description="Email if Xero fails to sync." defaultChecked />
                </div>
                <div className="py-2">
                  <p className="text-xs font-bold text-foreground/40 uppercase tracking-wider py-3">Dashboard Alerts</p>
                  <Toggle label="Cash Flow Warnings" description="Alert when projected cash drops below your threshold." defaultChecked />
                  <Toggle label="Invoice Overdue" description="Notify when a client invoice becomes overdue." defaultChecked />
                  <Toggle label="Budget Overrun" description="Alert when spending in a category exceeds budget." />
                </div>
              </div>
              <div className="px-6 py-4 border-t border-border">
                <div className="flex items-center gap-3 p-3 bg-foreground/[0.03] rounded-xl border border-border">
                  <Mail className="w-4 h-4 text-foreground/40 flex-shrink-0" />
                  <p className="text-xs text-foreground/60">Notifications sent to <span className="font-semibold text-foreground">kartikey@example.com</span></p>
                  <button className="ml-auto text-xs text-primary font-medium hover:text-primary/80">Change</button>
                </div>
              </div>
            </SectionCard>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <>
              <SectionCard title="Password" description="Keep your account secure with a strong password.">
                <div className="p-6 grid sm:grid-cols-2 gap-4">
                  <FormField label="Current Password" type="password" placeholder="••••••••" />
                  <div />
                  <FormField label="New Password" type="password" placeholder="••••••••" hint="Min. 8 characters" />
                  <FormField label="Confirm Password" type="password" placeholder="••••••••" />
                  <div className="sm:col-span-2 flex justify-end">
                    <button className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all">
                      Update Password
                    </button>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Two-Factor Authentication" description="Add an extra layer of security to your account.">
                <div className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Lock className="w-6 h-6 text-foreground/40" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">2FA is not enabled</p>
                    <p className="text-xs text-foreground/50 mt-0.5">Secure your account with an authenticator app or SMS.</p>
                  </div>
                  <button className="px-4 py-2 bg-foreground text-background rounded-xl text-sm font-semibold hover:bg-foreground/90 transition-all flex-shrink-0">
                    Enable 2FA
                  </button>
                </div>
              </SectionCard>

              <SectionCard title="Danger Zone" description="Irreversible actions — proceed with caution.">
                <div className="p-6 flex items-start gap-4">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">Delete Account</p>
                    <p className="text-xs text-foreground/50 mt-0.5">Permanently delete your account and all associated data. This cannot be undone.</p>
                  </div>
                  <button className="px-4 py-2 bg-red-500/10 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-500/20 transition-all flex-shrink-0">
                    Delete
                  </button>
                </div>
              </SectionCard>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
