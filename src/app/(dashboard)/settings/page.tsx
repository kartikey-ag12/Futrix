import { Building2, CreditCard, Users, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-foreground/60 text-sm mt-1">Manage your organization and platform preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="flex flex-col gap-1 md:col-span-1">
          <button className="flex items-center gap-3 px-3 py-2.5 bg-primary/10 text-primary font-semibold rounded-lg text-sm transition-colors text-left">
            <Building2 className="w-4 h-4" />
            Organization
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 text-foreground/70 hover:bg-foreground/5 hover:text-foreground font-medium rounded-lg text-sm transition-colors text-left">
            <Users className="w-4 h-4" />
            Team Members
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 text-foreground/70 hover:bg-foreground/5 hover:text-foreground font-medium rounded-lg text-sm transition-colors text-left">
            <CreditCard className="w-4 h-4" />
            Billing
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 text-foreground/70 hover:bg-foreground/5 hover:text-foreground font-medium rounded-lg text-sm transition-colors text-left">
            <Bell className="w-4 h-4" />
            Notifications
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 text-foreground/70 hover:bg-foreground/5 hover:text-foreground font-medium rounded-lg text-sm transition-colors text-left">
            <Shield className="w-4 h-4" />
            Security
          </button>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-3 flex flex-col gap-6">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-semibold text-lg">Organization Profile</h3>
              <p className="text-sm text-foreground/60">Update your company details and logo.</p>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground/80">Company Name</label>
                  <input type="text" defaultValue="Acme Corp" className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-foreground/80">Industry</label>
                  <select className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all">
                    <option>Technology</option>
                    <option>Finance</option>
                    <option>Healthcare</option>
                    <option>Retail</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-semibold text-lg">Integrations</h3>
              <p className="text-sm text-foreground/60">Connect your accounting software.</p>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 font-bold">X</div>
                  <div>
                    <h4 className="font-medium">Xero</h4>
                    <p className="text-xs text-foreground/60">Last synced: 2 hours ago</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 border border-border rounded-lg text-sm font-medium hover:bg-foreground/5 transition-colors">
                  Configure
                </button>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-500 font-bold">T</div>
                  <div>
                    <h4 className="font-medium">TallyPrime</h4>
                    <p className="text-xs text-foreground/60">Not connected</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
