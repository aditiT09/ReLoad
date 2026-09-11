'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DriverBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Bookings', path: '/driver/home', icon: 'local_shipping' },
    { label: 'Navigation', path: '/driver/navigation', icon: 'navigation' },
    { label: 'Handoff', path: '/driver/handoff', icon: 'verified_user' },
    { label: 'Forecast', path: '/driver/forecast', icon: 'radar' },
    { label: 'Trust', path: '/driver/trust-score', icon: 'military_tech' },
    { label: 'Earnings', path: '/driver/profile', icon: 'account_balance_wallet' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-safe bg-white/95 backdrop-blur-xl border-t border-[#E2E8F0] shadow-[0_-2px_12px_rgba(15,23,42,0.06)] md:bottom-3 md:left-4 md:right-4 md:max-w-4xl md:mx-auto md:rounded-2xl md:border md:shadow-xl">
      <div className="w-full max-w-4xl mx-auto flex justify-around items-center h-16 px-2 sm:px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col md:flex-row items-center justify-center flex-1 h-12 md:gap-2 px-1 md:px-3 transition-all rounded-xl ${
                isActive
                  ? 'text-[#0F6E56] font-bold md:bg-[#E6F4F1] scale-[1.02]'
                  : 'text-[#5A6578] hover:text-[#16212E] hover:bg-slate-50'
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-display text-[10px] md:text-xs tracking-tight mt-0.5 md:mt-0">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
