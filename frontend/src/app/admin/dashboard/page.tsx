'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { bookings } from '@/lib/api';

export default function AdminDashboardPage() {
  const [bookingCount, setBookingCount] = useState<number | null>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    bookings
      .list()
      .then((data: any) => {
        if (Array.isArray(data)) {
          setBookingCount(data.length);
          setRecentBookings(data.slice(-5).reverse());
        }
      })
      .catch((err) => console.error('Admin dashboard fetch error:', err));
  }, []);
  return (
    <AdminLayout>
      <div className="flex flex-col w-full space-y-6">
        {/* Hero Command Center Card */}
        <div className="relative w-full rounded-2xl overflow-hidden bg-[#0F172A] text-white shadow-xl">
          <div
            className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCvMNCvF55QvLBgS92Nouy61oQTXNa6YxEyWeVBbiYi8oIdm0d8UF0C8YTolclhFZg5O0km6RdUqIH9oWowaiRES949qwjEEnbMdrTQKjywBJ2KT3P7MOp6rgDc4SGwlMt0hjkk22_vVauuGviEpqI14cLzwKX7vdwZ2hoh6ejGdsUArKP_HagrJiyB1zolHONDKZ8K_mxWSKmf3kuWMOklNyqp_6TDIixEjyAYeMwVvuGlugnYlo2vTg')",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/85 to-transparent"></div>

          <div className="relative z-10 p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4F1] text-[#0F6E56] font-display text-xs font-bold">
                  <span className="h-2 w-2 rounded-full bg-[#0F6E56] animate-pulse"></span>
                  LIVE RADAR ACTIVE
                </span>
                <span className="font-display text-xs tracking-wider uppercase text-slate-400">
                  STATION ID: DCC-W04-MH
                </span>
              </div>
              <h1 className="font-display text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
                ReLoad National Command Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-lg">alt_route</span>
                <span>Corridor Live Feed: NH-48, Golden Quad &amp; Dedicated Freight Corridor</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3.5 flex items-center gap-4 text-white border border-white/10">
                <div className="flex flex-col text-right">
                  <span className="font-display text-[10px] text-slate-300 uppercase font-semibold">
                    Throughput Today
                  </span>
                  <span className="font-display text-xl font-extrabold">
                    14,890 <span className="font-normal text-xs text-slate-300">MT</span>
                  </span>
                </div>
                <div className="h-8 w-px bg-white/20"></div>
                <div className="flex items-center gap-2 text-emerald-300">
                  <span className="material-symbols-outlined text-2xl">speed</span>
                  <span className="font-display text-xs font-bold">Corridor Optimal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Metric Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Card 1: Active Bookings */}
          <div className="relative bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0] flex flex-col justify-between overflow-hidden hover:shadow-md transition-all">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="h-9 w-9 rounded-xl bg-[#E6F4F1] text-[#0F6E56] flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">local_shipping</span>
                  </span>
                  <div>
                    <span className="font-display text-[10px] uppercase tracking-wider text-[#64748B] font-bold">
                      Primary Manifest
                    </span>
                    <h2 className="font-display text-sm font-extrabold text-[#111c29]">Active Bookings</h2>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E6F4F1] text-[#0F6E56] font-display text-[11px] font-bold">
                  <span className="material-symbols-outlined text-xs">trending_up</span>
                  +14% today
                </span>
              </div>

              <div className="flex items-baseline gap-2 my-1">
                <span className="font-display text-4xl font-extrabold text-[#111c29] tracking-tight">
                  {bookingCount !== null ? bookingCount : '...'}
                </span>
                <span className="font-display text-xs text-[#64748B]">Bookings in Supabase DB</span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2 flex overflow-hidden">
                <div className="bg-[#0F6E56] h-full" style={{ width: '69%' }}></div>
                <div className="bg-[#0B5240] h-full" style={{ width: '20%' }}></div>
                <div className="bg-[#2563EB] h-full" style={{ width: '11%' }}></div>
              </div>

              <div className="flex flex-col gap-2 pt-1 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8F9FA]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#0F6E56]"></span>
                    <span className="text-[#111c29] font-medium">In-Transit Freight</span>
                  </div>
                  <span className="font-display font-bold text-[#111c29]">284</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8F9FA]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#0B5240]"></span>
                    <span className="text-[#111c29] font-medium">Loading Bay Operations</span>
                  </div>
                  <span className="font-display font-bold text-[#111c29]">82</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#EFF6FF]">
                  <div className="flex items-center gap-2 text-[#2563EB]">
                    <span className="material-symbols-outlined text-sm">ac_unit</span>
                    <span className="font-semibold">Reefer Cold-Chain</span>
                  </div>
                  <span className="font-display font-bold text-[#2563EB]">46</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-[#64748B] uppercase font-semibold">ULIP Synced 2m ago</span>
              <span className="font-display text-xs text-[#0F6E56] font-bold flex items-center gap-0.5">
                98.2% On-Schedule
                <span className="material-symbols-outlined text-sm">done_all</span>
              </span>
            </div>
          </div>

          {/* Card 2: Open Reports & Disputes */}
          <div className="relative bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0] flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="h-9 w-9 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">gavel</span>
                  </span>
                  <div>
                    <span className="font-display text-[10px] uppercase tracking-wider text-[#64748B] font-bold">
                      Resolution Queue
                    </span>
                    <h2 className="font-display text-sm font-extrabold text-[#111c29]">Open Disputes</h2>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#D97706] font-display text-[11px] font-bold animate-pulse">
                  <span className="material-symbols-outlined text-xs">timer</span>
                  15-min SLA
                </span>
              </div>

              <div className="flex items-baseline gap-2 my-1">
                <span className="font-display text-4xl font-extrabold text-[#D97706] tracking-tight">18</span>
                <span className="font-display text-xs text-[#64748B]">Active Escalations</span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2 flex overflow-hidden">
                <div className="bg-[#D97706] h-full" style={{ width: '39%' }}></div>
                <div className="bg-[#713B00] h-full" style={{ width: '28%' }}></div>
                <div className="bg-[#2563EB] h-full" style={{ width: '22%' }}></div>
                <div className="bg-[#DC2626] h-full" style={{ width: '11%' }}></div>
              </div>

              <div className="flex flex-col gap-2 pt-1 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8F9FA]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#D97706]"></span>
                    <span className="text-[#111c29] font-medium">Surcharge Detour</span>
                  </div>
                  <span className="font-display font-bold text-[#111c29]">7</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8F9FA]">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#713B00]"></span>
                    <span className="text-[#111c29] font-medium">Route Delay Anomaly</span>
                  </div>
                  <span className="font-display font-bold text-[#111c29]">5</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#EFF6FF]">
                  <div className="flex items-center gap-2 text-[#2563EB]">
                    <span className="material-symbols-outlined text-sm">thermostat</span>
                    <span className="font-semibold">Reefer Temp Spike</span>
                  </div>
                  <span className="font-display font-bold text-[#2563EB]">4</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-[#64748B] uppercase font-semibold">Arbitration Node: ON</span>
              <span className="font-display text-xs text-[#D97706] font-bold flex items-center gap-0.5">
                Avg Response 4.2m
                <span className="material-symbols-outlined text-sm">bolt</span>
              </span>
            </div>
          </div>

          {/* Card 3: Flagged Drivers */}
          <div className="relative bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0] flex flex-col justify-between hover:shadow-md transition-all">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="h-9 w-9 rounded-xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">person_alert</span>
                  </span>
                  <div>
                    <span className="font-display text-[10px] uppercase tracking-wider text-[#64748B] font-bold">
                      Driver Compliance
                    </span>
                    <h2 className="font-display text-sm font-extrabold text-[#111c29]">Flagged Drivers</h2>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#DC2626] text-white font-display text-[11px] font-bold">
                  <span className="material-symbols-outlined text-xs">warning</span>
                  Immediate Action
                </span>
              </div>

              <div className="flex items-baseline gap-2 my-1">
                <span className="font-display text-4xl font-extrabold text-[#DC2626] tracking-tight">9</span>
                <span className="font-display text-xs text-[#64748B]">Critical Breaches</span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2 flex overflow-hidden">
                <div className="bg-[#DC2626] h-full" style={{ width: '44%' }}></div>
                <div className="bg-[#944F00] h-full" style={{ width: '33%' }}></div>
                <div className="bg-[#0F172A] h-full" style={{ width: '23%' }}></div>
              </div>

              <div className="flex flex-col gap-2 pt-1 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#FEF2F2] text-[#DC2626]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">badge</span>
                    <span className="font-semibold">Expired RC / Fitness</span>
                  </div>
                  <span className="font-display font-bold">4</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8F9FA]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#944F00] text-sm">wrong_location</span>
                    <span className="text-[#111c29] font-medium">Geofence Corridor Breach</span>
                  </div>
                  <span className="font-display font-bold text-[#111c29]">3</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8F9FA]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-800 text-sm">lock_open</span>
                    <span className="text-[#111c29] font-medium">Tampered E-Seal</span>
                  </div>
                  <span className="font-display font-bold text-[#111c29]">2</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-[#64748B] uppercase font-semibold">ULIP Blacklist Sync</span>
              <span className="font-display text-xs text-[#DC2626] font-bold flex items-center gap-0.5">
                Lock Initiated
                <span className="material-symbols-outlined text-sm">emergency_home</span>
              </span>
            </div>
          </div>
        </div>

        {/* Tactical Interventions Buttons */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0]">
          <div className="flex items-center justify-between pb-3">
            <div>
              <span className="font-display text-[10px] text-[#64748B] uppercase font-bold tracking-wider">
                Fast Execution Layer
              </span>
              <h3 className="font-display text-sm font-extrabold text-[#111c29]">
                Immediate Tactical Interventions
              </h3>
            </div>
            <span className="text-xs text-[#5A6578]">Console Mode: Dispatch Supervisor</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <Link
              href="/admin/reports"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#F8F9FA] hover:bg-[#0F6E56] hover:text-white transition-all text-xs font-display font-bold group border border-slate-200"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-lg text-slate-500 group-hover:text-white">
                  rule
                </span>
                <span>Inspect Open Reports Table</span>
              </div>
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>

            <Link
              href="/admin/drivers"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#F8F9FA] hover:bg-[#DC2626] hover:text-white transition-all text-xs font-display font-bold group border border-slate-200"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-lg text-slate-500 group-hover:text-white">
                  policy
                </span>
                <span>Review Flagged Drivers Audit</span>
              </div>
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>

            <Link
              href="/admin/bookings/TRIP-8842"
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#F8F9FA] hover:bg-[#0F172A] hover:text-white transition-all text-xs font-display font-bold group border border-slate-200"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-lg text-slate-500 group-hover:text-white">
                  map
                </span>
                <span>Open Live Trip Timeline Replay</span>
              </div>
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
