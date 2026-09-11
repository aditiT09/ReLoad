'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface CustomerBottomNavProps {
  activeTab?: string;
}

export default function CustomerBottomNav({ activeTab }: CustomerBottomNavProps) {
  const pathname = usePathname();

  const navItems = [
    { id: 'book', label: 'Book', path: '/customer/home', icon: 'local_shipping' },
    { id: 'vehicles', label: 'Vehicles', path: '/customer/vehicles', icon: 'rv_hookup' },
    { id: 'tracking', label: 'Track', path: '/customer/tracking', icon: 'fmd_good' },
    { id: 'handoff', label: 'Handoff', path: '/customer/handoff', icon: 'qr_code_scanner' },
    { id: 'receipt', label: 'Receipt', path: '/customer/receipt', icon: 'receipt_long' },
    { id: 'support', label: 'Support', path: '/customer/support', icon: 'support_agent' },
    { id: 'bookings', label: 'Bookings', path: '/customer/bookings', icon: 'history' },
    { id: 'profile', label: 'Profile', path: '/customer/profile', icon: 'warehouse' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-safe bg-white/95 backdrop-blur-xl border-t border-[#E2E8F0] shadow-[0_-2px_12px_rgba(15,23,42,0.06)] md:bottom-3 md:left-4 md:right-4 md:max-w-5xl md:mx-auto md:rounded-2xl md:border md:shadow-xl">
      <div className="w-full max-w-5xl mx-auto flex justify-around items-center h-16 px-2 sm:px-4">
        {navItems.map((item) => {
          const isActive = activeTab ? activeTab === item.id : pathname === item.path;
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
                className="material-symbols-outlined text-[20px] md:text-[22px]"
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                {item.icon}
              </span>
              <span className="font-display text-[9px] md:text-xs tracking-tight mt-0.5 md:mt-0">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
