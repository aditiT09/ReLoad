'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface ScreenCategory {
  title: string;
  count: number;
  color: string;
  items: {
    name: string;
    path: string;
    badge?: string;
    icon: string;
  }[];
}

export const SCREEN_CATEGORIES: ScreenCategory[] = [
  {
    title: 'Shared Entry (2)',
    count: 2,
    color: 'bg-emerald-600',
    items: [
      { name: '1. Splash Screen', path: '/', icon: 'local_shipping' },
      { name: '2. Role Split Landing', path: '/landing', icon: 'hub' },
    ],
  },
  {
    title: 'Driver Portal (7)',
    count: 7,
    color: 'bg-emerald-700',
    items: [
      { name: '1. Login & KYC Upload', path: '/driver/login', icon: 'badge' },
      { name: '2. Home & Trip Alert Modal', path: '/driver/home', icon: 'notifications_active' },
      { name: '3. Turn-by-Turn Nav & Chat', path: '/driver/navigation', icon: 'navigation' },
      { name: '4. Pickup / Drop-off Handoff', path: '/driver/handoff', icon: 'verified_user' },
      { name: '5. AI Demand Heatmap', path: '/driver/forecast', icon: 'radar' },
      { name: '6. Trust Score & Tier', path: '/driver/trust-score', icon: 'military_tech' },
      { name: '7. Profile & Earnings', path: '/driver/profile', icon: 'account_balance_wallet' },
    ],
  },
  {
    title: 'Admin / Dispatch (5)',
    count: 5,
    color: 'bg-slate-900',
    items: [
      { name: '1. Ops Portal Login', path: '/admin/login', icon: 'security' },
      { name: '2. Dashboard & Telemetry', path: '/admin/dashboard', icon: 'dashboard' },
      { name: '3. Reports & Trust Audit', path: '/admin/reports', icon: 'assessment' },
      { name: '4. Driver Fleet Compliance', path: '/admin/drivers', icon: 'fact_check' },
      { name: '5. Trip Timeline Inspector', path: '/admin/bookings/TRIP-8842', icon: 'query_stats' },
    ],
  },
  {
    title: 'Customer Portal (9)',
    count: 9,
    color: 'bg-blue-600',
    items: [
      { name: '1. Phone & OTP Verify', path: '/customer/login', icon: 'phonelink_lock' },
      { name: '2. Home & Book Vehicle', path: '/customer/home', icon: 'schedule_send' },
      { name: '3. Vehicle Results & Rates', path: '/customer/vehicles', icon: 'rv_hookup' },
      { name: '4. Active Tracking & Reefer', path: '/customer/tracking', icon: 'fmd_good' },
      { name: '5. Handoff PIN / Seal OTP', path: '/customer/handoff', icon: 'qr_code_scanner' },
      { name: '6. Payment Receipt & GST', path: '/customer/receipt', icon: 'receipt_long' },
      { name: '7. Issue Dispute & Support', path: '/customer/support', icon: 'support_agent' },
      { name: '8. My Bookings History', path: '/customer/bookings', icon: 'history' },
      { name: '9. Warehouses & Profile', path: '/customer/profile', icon: 'warehouse' },
    ],
  },
];

export default function ScreenSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Floating trigger bar */}
      <div className="fixed bottom-3 right-3 z-50 flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-[#0F6E56] hover:bg-[#0B5240] text-white px-3.5 py-2 rounded-full shadow-lg border border-white/20 transition-all active:scale-95 font-medium text-xs tracking-wide group"
          title="Toggle 23 Screens Directory (Ctrl+K)"
        >
          <span className="material-symbols-outlined text-sm transition-transform group-hover:rotate-180">
            {isOpen ? 'close' : 'apps'}
          </span>
          <span>Screens Navigator (23)</span>
          <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold">
            Ctrl+K
          </span>
        </button>
      </div>

      {/* Drawer / Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fadeIn">
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#0F6E56] text-white p-4 flex items-center justify-between shadow">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-xl text-emerald-200">local_shipping</span>
                <div>
                  <h2 className="font-bold font-display text-sm tracking-tight">ReLoad Logistics App</h2>
                  <p className="text-[11px] text-emerald-100">All 23 Screens (Shared, Driver, Admin, Customer)</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-xs"
              >
                ✕
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {SCREEN_CATEGORIES.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display">
                      {cat.title}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
                      {cat.count} screens
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {cat.items.map((item, itemIdx) => {
                      const isActive = pathname === item.path;
                      return (
                        <Link
                          key={itemIdx}
                          href={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-[#0F6E56] text-white shadow-sm font-semibold'
                              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          <span
                            className={`material-symbols-outlined text-base ${
                              isActive ? 'text-white' : 'text-slate-500'
                            }`}
                          >
                            {item.icon}
                          </span>
                          <span className="flex-1 truncate">{item.name}</span>
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-emerald-200 animate-pulse"></span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
              ReLoad Logistics Operational Design System • Ready & Running
            </div>
          </div>
        </div>
      )}
    </>
  );
}
