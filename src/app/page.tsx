import Link from "next/link";
import { ArrowRight, BarChart3, TrendingUp, Shield, Zap, DollarSign, Activity, CheckCircle2, ChevronRight, Lock, Layers } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import { Navbar } from "@/components/layout/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground font-sans scroll-smooth">
      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Hero Section ── */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-24 pb-20 sm:pt-32 sm:pb-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        
        <span className="px-3 py-1 bg-foreground/5 border border-border text-foreground/70 text-xs font-bold tracking-widest uppercase rounded-full mb-8 inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          The New Standard in Financial SaaS
        </span>
        
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.1] max-w-4xl mx-auto z-10 text-foreground">
          Financial clarity for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/60">
            modern teams.
          </span>
        </h1>
        
        <p className="mt-6 text-lg sm:text-xl text-foreground/60 max-w-2xl mx-auto z-10 font-medium">
          Futrix brings your accounting data, cash flow forecasting, and AI-powered advice under one intelligent roof. Stop guessing, start growing.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 z-10">
          <Link href="/signup" className="px-8 py-4 bg-foreground text-background rounded-2xl text-base font-semibold hover:bg-foreground/90 transition-all shadow-premium hover:shadow-lg flex items-center gap-2">
            Start your free trial <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/login" className="px-8 py-4 bg-background text-foreground border border-border rounded-2xl text-base font-semibold hover:bg-foreground/5 transition-all shadow-sm">
            Book a Demo
          </Link>
        </div>

        {/* ── UI Mockup Preview (Real Components) ── */}
        <div className="mt-20 w-full max-w-5xl mx-auto relative z-10">
          <div className="rounded-3xl border border-border bg-card shadow-2xl overflow-hidden p-3 relative">
            
            {/* Top Mockup Browser Bar */}
            <div className="flex items-center gap-2 px-3 pb-3 border-b border-border mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="flex-1 text-center text-xs font-bold text-foreground/30 tracking-widest uppercase">futrix.app/dashboard</div>
            </div>

            {/* Dashboard Content Mockup */}
            <div className="text-left bg-background rounded-2xl p-6 pointer-events-none select-none">
              <h2 className="text-xl font-bold mb-4">This Month's Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <KPICard title="Total Revenue" value="$45,231" trend={12.5} icon={<DollarSign className="w-4 h-4" />} />
                <KPICard title="Total Expenses" value="$23,194" trend={-4.5} icon={<TrendingUp className="w-4 h-4" />} />
                <KPICard title="Net Profit" value="$22,037" trend={8.2} icon={<TrendingUp className="w-4 h-4" />} />
                <KPICard title="Health Score" value="92/100" trend={2.4} icon={<Activity className="w-4 h-4" />} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-card border border-border rounded-xl p-4 hidden md:block">
                    <h3 className="text-sm font-semibold mb-4">Revenue Trend</h3>
                    <RevenueChart totalRevenue={45231} totalExpenses={23194} />
                 </div>
                 <div className="bg-card border border-border rounded-xl p-4">
                    <h3 className="text-sm font-semibold mb-4">Cash Flow Forecast</h3>
                    <CashFlowChart totalRevenue={45231} totalExpenses={23194} />
                 </div>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          </div>
        </div>
      </main>

      {/* ── Feature Highlights ── */}
      <section id="features" className="py-24 bg-card border-t border-border/40 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-foreground mb-4">Everything you need to scale</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto">Futrix combines traditional accounting data with powerful predictive modeling.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-premium hover:border-foreground/10 transition-all duration-300">
              <div className="w-12 h-12 bg-foreground/5 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Xero Sync</h3>
              <p className="text-foreground/60 text-sm leading-relaxed">
                Connect your Xero account in seconds. We automatically sync your invoices, bills, and ledger data to give you real-time insights without manual data entry.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-premium hover:border-foreground/10 transition-all duration-300">
              <div className="w-12 h-12 bg-foreground/5 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Forecasting</h3>
              <p className="text-foreground/60 text-sm leading-relaxed">
                Run advanced scenario models on your cash flow. Know your runway down to the day, and simulate best or worst case scenarios with one click.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-background border border-border shadow-sm hover:shadow-premium hover:border-foreground/10 transition-all duration-300">
              <div className="w-12 h-12 bg-foreground/5 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
              <p className="text-foreground/60 text-sm leading-relaxed">
                Your financial data is encrypted at rest and in transit. Bank-level security ensures that your most sensitive information is always protected.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 bg-background border-t border-border/40 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 text-xs font-bold tracking-widest uppercase rounded-full mb-6 inline-block">
                How It Works
              </span>
              <h2 className="text-3xl font-black text-foreground mb-6 leading-tight">
                From raw data to actionable insights in 3 steps
              </h2>
              
              <div className="space-y-8 mt-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-foreground text-background font-bold flex items-center justify-center flex-shrink-0">1</div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Connect your data sources</h4>
                    <p className="text-foreground/60 text-sm">Link your Xero account securely via OAuth or upload your existing spreadsheets through our Excel tools. We'll pull 2 years of historical data in seconds.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-foreground text-background font-bold flex items-center justify-center flex-shrink-0">2</div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Futrix Engine processes</h4>
                    <p className="text-foreground/60 text-sm">Our AI Engine categorizes your transactions, detects payment patterns, and establishes a baseline for your company's financial velocity.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-foreground text-background font-bold flex items-center justify-center flex-shrink-0">3</div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Monitor & Forecast</h4>
                    <p className="text-foreground/60 text-sm">Interact with live dashboards, generate customized reports, and run 'what-if' scenarios to plan your next strategic move.</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Visual Demo */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 rounded-[40px] rotate-3 scale-105" />
              <div className="bg-card rounded-[32px] border border-border p-8 relative shadow-xl">
                 <div className="flex flex-col gap-4">
                    <div className="p-4 bg-background border border-border rounded-xl flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-[#1AB4D7]/10 flex items-center justify-center text-[#1AB4D7] font-bold">X</div>
                          <div className="font-semibold text-sm">Xero Syncing...</div>
                       </div>
                       <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                    </div>
                    <div className="p-4 bg-background border border-border rounded-xl flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-bold">E</div>
                          <div className="font-semibold text-sm">Excel Imports processed</div>
                       </div>
                       <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                    </div>
                    <div className="mt-4 p-5 bg-gradient-to-br from-foreground to-foreground/90 rounded-2xl text-background">
                       <div className="text-xs font-medium opacity-80 mb-1">AI INSIGHT GENERATED</div>
                       <div className="font-bold">Based on current trends, your cash runway extends for 14.5 months. Safe to proceed with Q3 hiring plan.</div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Overview ── */}
      <section id="overview" className="py-24 bg-card border-t border-border/40 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-foreground mb-4">A complete view of your business</h2>
          <p className="text-foreground/60 max-w-2xl mx-auto mb-12">One unified dashboard for all your crucial financial metrics.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="p-6 bg-background rounded-2xl border border-border">
               <Layers className="w-8 h-8 text-primary mb-4" />
               <h4 className="font-bold mb-2">Consolidated Reporting</h4>
               <p className="text-xs text-foreground/60">Combine multiple entities into one seamless report.</p>
            </div>
            <div className="p-6 bg-background rounded-2xl border border-border">
               <TrendingUp className="w-8 h-8 text-emerald-500 mb-4" />
               <h4 className="font-bold mb-2">Predictive Cashflow</h4>
               <p className="text-xs text-foreground/60">See exactly when cash is entering and leaving.</p>
            </div>
            <div className="p-6 bg-background rounded-2xl border border-border">
               <Shield className="w-8 h-8 text-blue-500 mb-4" />
               <h4 className="font-bold mb-2">Audit Trails</h4>
               <p className="text-xs text-foreground/60">Full visibility over every change in your dataset.</p>
            </div>
            <div className="p-6 bg-background rounded-2xl border border-border">
               <Lock className="w-8 h-8 text-amber-500 mb-4" />
               <h4 className="font-bold mb-2">Granular Permissions</h4>
               <p className="text-xs text-foreground/60">Control exactly who can see what data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section id="reviews" className="py-24 bg-background border-t border-border/40 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-foreground mb-4">Trusted by finance leaders</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "Futrix transformed how we present financials to our board. What used to take a full day in spreadsheets now takes under 20 minutes.", author: "Rachel Osei", role: "CFO, Greenpath Ventures" },
              { quote: "The daily cash flow forecasting caught a potential deficit six weeks out. It literally saved us from a cash crunch.", author: "Daniel Fitzpatrick", role: "Finance Director, Apex Retail" },
              { quote: "Our accountants now spend time advising clients instead of manually copying data. Futrix made that transition possible.", author: "Mei Lin", role: "Partner, Horizon Advisory" }
            ].map((r, idx) => (
              <div key={idx} className="p-8 rounded-3xl border border-border bg-card shadow-sm flex flex-col justify-between">
                <p className="text-foreground font-medium mb-8 leading-relaxed">"{r.quote}"</p>
                <div>
                  <p className="font-bold text-sm">{r.author}</p>
                  <p className="text-xs text-foreground/50">{r.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 bg-card border-t border-border/40 scroll-mt-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-foreground mb-4">Simple, transparent pricing</h2>
          <p className="text-foreground/60 mb-12">Start for free, upgrade when you need more power.</p>
          
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="p-8 bg-background border border-border rounded-3xl shadow-sm">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-foreground/60 text-sm mb-6">Perfect for small businesses and solo founders.</p>
              <div className="text-4xl font-black mb-6">$0<span className="text-lg text-foreground/40 font-normal">/mo</span></div>
              <ul className="space-y-3 mb-8 text-sm font-medium">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Basic Xero Integration</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 30-Day Forecasting</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Standard Support</li>
              </ul>
              <Link href="/signup" className="block w-full py-3 text-center rounded-xl bg-foreground/5 font-bold hover:bg-foreground/10 transition-colors">Start Free</Link>
            </div>
            
            <div className="p-8 bg-foreground text-background border border-border rounded-3xl shadow-premium relative">
              <div className="absolute top-0 right-8 -translate-y-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">Most Popular</div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-background/60 text-sm mb-6">For growing teams that need advanced analytics.</p>
              <div className="text-4xl font-black mb-6">$49<span className="text-lg text-background/40 font-normal">/mo</span></div>
              <ul className="space-y-3 mb-8 text-sm font-medium text-background/90">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Advanced AI Insights</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 90-Day Deep Forecasting</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Custom Excel Exports</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Priority Support</li>
              </ul>
              <Link href="/signup" className="block w-full py-3 text-center rounded-xl bg-background text-foreground font-bold hover:bg-background/90 transition-colors">Start Free Trial</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 bg-background border-t border-border/40 scroll-mt-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-black text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: "Do I need a Xero account to use Futrix?", a: "While Futrix is heavily optimized for Xero, you can still use our platform by uploading your financial data manually via our Excel tools." },
              { q: "Is my financial data secure?", a: "Yes. We use 256-bit AES encryption for all data at rest and in transit. We use OAuth for integrations and never store your accounting passwords." },
              { q: "Can I invite my accountant?", a: "Absolutely. Pro plans allow you to invite unlimited read-only users, including your accountant or board members." },
            ].map((faq, i) => (
              <div key={i} className="p-6 bg-card border border-border rounded-2xl">
                <h4 className="font-bold mb-2">{faq.q}</h4>
                <p className="text-sm text-foreground/60 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-border/40 bg-card text-center px-6">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-background" />
            </div>
            <span className="text-base font-black tracking-tight">Futrix</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm font-medium text-foreground/60 mb-6 md:mb-0">
            <Link href="#features" className="hover:text-foreground">Features</Link>
            <Link href="#pricing" className="hover:text-foreground">Pricing</Link>
            <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground">Terms of Service</Link>
          </div>
          
          <p className="text-xs text-foreground/40 font-medium">
            © {new Date().getFullYear()} Futrix Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
