"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-12 relative overflow-hidden font-sans border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* ── Top Row: Logo ── */}
        <div className="flex items-center justify-between pb-12">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-[#00D639] rounded-xl flex items-center justify-center shadow-lg shadow-[#00D639]/20 group-hover:scale-105 transition-transform">
              <span className="text-black font-black text-lg">F</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-xl tracking-wider leading-none">FUTRIX</span>
              <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">by Intelligence Engine</span>
            </div>
          </Link>
        </div>

        {/* ── Navigation Columns ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-20">
          {/* PRODUCT */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
              PRODUCT
            </h4>
            <ul className="space-y-4 text-sm font-medium text-slate-200">
              <li>
                <Link href="/product" className="hover:text-[#00D639] transition-colors">
                  Product overview
                </Link>
              </li>
              <li>
                <Link href="/product/how-it-works" className="hover:text-[#00D639] transition-colors">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/product#demo" className="hover:text-[#00D639] transition-colors">
                  Watch a demo
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#00D639] transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* FEATURES */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
              FEATURES
            </h4>
            <ul className="space-y-4 text-sm font-medium text-slate-200">
              <li>
                <Link href="/features#business-performance" className="hover:text-[#00D639] transition-colors">
                  Business performance management
                </Link>
              </li>
              <li>
                <Link href="/features#reporting" className="hover:text-[#00D639] transition-colors">
                  Financial reporting
                </Link>
              </li>
              <li>
                <Link href="/features#consolidations" className="hover:text-[#00D639] transition-colors">
                  Multi-currency consolidations
                </Link>
              </li>
              <li>
                <Link href="/features#cashflow" className="hover:text-[#00D639] transition-colors">
                  Cash flow forecasting
                </Link>
              </li>
              <li>
                <Link href="/features#hr" className="hover:text-[#00D639] transition-colors">
                  HR forecasting
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT & TRAINING */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
              SUPPORT & TRAINING
            </h4>
            <ul className="space-y-4 text-sm font-medium text-slate-200">
              <li>
                <Link href="/login" className="hover:text-[#00D639] transition-colors">
                  Log in
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-[#00D639] transition-colors">
                  Contact us
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-[#00D639] transition-colors">
                  Online support
                </Link>
              </li>
              <li>
                <Link href="/product#testimonials" className="hover:text-[#00D639] transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/product" className="hover:text-[#00D639] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/product" className="hover:text-[#00D639] transition-colors">
                  Webinars
                </Link>
              </li>
              <li>
                <Link href="/product#about" className="hover:text-[#00D639] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#00D639] transition-colors">
                  Referral Program
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Bottom Copyright Bar ── */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-400">
          <span>© Futrix Group plc {new Date().getFullYear()}</span>
          <a href="#" className="hover:text-white transition-colors">Legal</a>
          <a href="#" className="hover:text-white transition-colors">General data protection</a>
          <a href="#" className="hover:text-white transition-colors">Cookie policy</a>
        </div>
      </div>
    </footer>
  );
}
