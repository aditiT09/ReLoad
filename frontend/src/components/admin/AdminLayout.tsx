'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: 'Overview Dashboard', path: '/admin/dashboard', icon: 'grid_view' },
    { label: 'Reports & Disputes', path: '/admin/reports', icon: 'analytics' },
    { label: 'Fleet & Drivers', path: '/admin/drivers', icon: 'local_shipping' },
    { label: 'Bookings & Timeline', path: '/admin/bookings/TRIP-8842', icon: 'calendar_clock' },
    { label: 'Compliance & ULIP', path: '/admin/drivers', icon: 'verified_user' },
  ];

  return (
    <div className="bg-[#F8F9FA] font-body text-[#111c29] antialiased min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white shadow-sm border-r border-[#E2E8F0] z-40 flex-col justify-between pt-5 pb-6">
        <div className="flex flex-col gap-5">
          {/* Brand header */}
          <Link href="/admin/dashboard" className="flex items-center gap-2.5 px-5">
            <div className="w-10 h-10 rounded-xl bg-[#0F6E56] flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-2xl">security</span>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-extrabold tracking-tight text-[#111c29] leading-none">
                ReLoad
              </span>
              <span className="font-display text-[10px] text-[#0F6E56] uppercase font-bold tracking-wider mt-0.5">
                Dispatch OS Pro
              </span>
            </div>
          </Link>

          {/* Nav items */}
          <div className="px-3">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-display font-semibold transition-all min-h-[44px] ${
                      isActive
                        ? 'bg-[#0F6E56] text-white shadow-xs'
                        : 'text-[#5A6578] hover:bg-[#F1F5F9] hover:text-[#111c29]'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] ${
                        isActive ? 'text-white' : 'text-[#64748B]'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="px-4 space-y-2">
          <div className="bg-[#F8F9FA] rounded-xl p-3 flex flex-col gap-1.5 border border-slate-200 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-display text-[10px] text-[#64748B] font-bold">ULIP GATEWAY</span>
              <span className="h-2 w-2 rounded-full bg-[#0F6E56] animate-pulse"></span>
            </div>
            <p className="font-display text-[11px] text-[#111c29] font-bold">National Logistics Node</p>
            <span className="text-[10px] text-[#5A6578]">v4.2.8 Enterprise Secure</span>
          </div>

          <Link
            href="/admin/login"
            className="flex items-center justify-center gap-1.5 py-2 text-xs font-display font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Exit Operations</span>
          </Link>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-white/95 backdrop-blur-xl border-b border-[#E2E8F0] sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6 shadow-xs">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <div className="hidden sm:flex items-center gap-2 bg-[#E6F4F1] px-3 py-1 rounded-full border border-emerald-200">
              <span className="material-symbols-outlined text-[#0F6E56] text-sm font-bold">check_circle</span>
              <span className="font-display text-[11px] text-[#0F6E56] font-bold">
                WEST CORRIDOR 99.4% ACTIVE
              </span>
            </div>
            <div className="relative flex items-center flex-1">
              <span className="material-symbols-outlined text-slate-400 text-lg absolute left-3 pointer-events-none">
                search
              </span>
              <input
                className="w-full h-9 pl-9 pr-3 bg-[#F1F5F9] rounded-lg font-body text-xs text-[#111c29] placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-[#0F6E56]"
                placeholder="Search e-Way bill, truck no, driver..."
                type="search"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/reports"
              className="flex items-center gap-1 bg-[#FEF2F2] hover:bg-red-100 text-[#DC2626] px-2.5 py-1 rounded-lg text-xs font-display font-bold border border-red-200 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">emergency</span>
              <span className="hidden sm:inline">3 FLAGGED</span>
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="hidden sm:flex flex-col text-right">
                <span className="font-display text-xs text-[#111c29] font-bold leading-tight">
                  Rajesh Varma
                </span>
                <span className="text-[10px] text-[#5A6578]">Ops Manager</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#0F6E56] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                RV
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 pb-20">{children}</main>
      </div>
    </div>
  );
}
