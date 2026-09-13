'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminBookingDetailPage({ params }: { params?: { id?: string } }) {
  const tripId = params?.id || 'TRIP-8842';
  const [surchargeApproved, setSurchargeApproved] = useState<boolean | null>(null);

  const timelineEvents = [
    {
      time: '14:15 PM',
      title: 'Consignment Dispatched from Chakan Hub',
      desc: 'Driver Gurpreet verified with 4-digit PIN #6284 and tamper seal #SL-44910.',
      status: 'completed',
      icon: 'local_shipping',
    },
    {
      time: '14:48 PM',
      title: 'Panvel Expressway Detour Detected',
      desc: 'Vehicle exited NH-48 onto state bypass due to flyover maintenance. Surcharge +₹650 claimed.',
      status: 'warning',
      icon: 'alt_route',
    },
    {
      time: '15:30 PM',
      title: 'Reefer Cold-Chain Temp SLA Check',
      desc: 'Telemetry verified: Container steady at -18.2°C. Zero thermal excursion.',
      status: 'completed',
      icon: 'ac_unit',
    },
    {
      time: '16:05 PM (Projected)',
      title: 'Estimated Arrival at JNPT Dock 4',
      desc: 'Loading bay supervisor pre-notified via automated dispatch telemetry.',
      status: 'pending',
      icon: 'warehouse',
    },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-5 w-full">
        {/* Breadcrumb & Top Command Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/dashboard"
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs"
            >
              <span className="material-symbols-outlined text-lg">arrow_back</span>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xs text-[#64748B] uppercase font-bold tracking-wider">
                  Bookings &amp; Timeline
                </span>
                <span className="text-slate-400">/</span>
                <span className="font-display text-xs text-[#0F6E56] font-bold">
                  Consignment #{tripId}
                </span>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap mt-0.5">
                <h1 className="font-display text-xl lg:text-2xl font-extrabold text-[#111c29]">
                  Consignment #{tripId}
                </h1>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] font-display text-[11px] font-bold border border-blue-200">
                  <span className="material-symbols-outlined text-xs">ac_unit</span>
                  REEFER 32FT • -18°C COLD CHAIN
                </span>
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] font-display text-[11px] font-bold border border-amber-200">
                  <span className="material-symbols-outlined text-xs">schedule</span>
                  DETOUR AUDIT PENDING
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('e-Way Bill dossier downloaded successfully!')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-display font-bold shadow-xs hover:bg-slate-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[#0F6E56] text-base">description</span>
              <span>e-Way Audit Dossier</span>
            </button>
            <a
              href="tel:+919823000042"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F6E56] hover:bg-[#0B5240] text-white text-xs font-display font-bold shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-base">call</span>
              <span>Call Driver</span>
            </a>
          </div>
        </div>

        {/* Primary Metric & Entity Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Driver & Vehicle Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0] space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-display text-[10px] uppercase font-bold text-[#64748B]">
                Assigned Carrier Profile
              </span>
              <span className="bg-[#E6F4F1] text-[#0F6E56] font-display text-[10px] font-bold px-2 py-0.5 rounded-full">
                ULIP Authenticated
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                alt="Gurpreet Singh"
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
              />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-base font-extrabold text-[#111c29]">Gurpreet Singh</span>
                  <span className="text-[#D97706] text-xs font-bold">4.9 ★</span>
                </div>
                <span className="text-xs text-[#5A6578]">Tata Signa 2823 • MH-12-RN-8821</span>
                <span className="text-[11px] text-[#0F6E56] font-bold mt-0.5">Trust Score: 98 / 100</span>
              </div>
            </div>

            <div className="p-3 bg-[#F8F9FA] rounded-xl border border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Locked Trip Fare:</span>
                <span className="font-display font-extrabold text-[#111c29]">₹16,500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Detour Surcharge Claim:</span>
                <span className="font-display font-extrabold text-[#D97706]">+₹650</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <span className="font-bold text-[#111c29]">Total Payable:</span>
                <span className="font-display font-extrabold text-[#0F6E56]">₹17,150</span>
              </div>
            </div>

            {/* Surcharge Decision Buttons */}
            {surchargeApproved === null ? (
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setSurchargeApproved(true)}
                  className="flex-1 py-2 bg-[#0F6E56] hover:bg-[#0B5240] text-white rounded-xl font-display text-xs font-bold"
                >
                  Approve +₹650
                </button>
                <button
                  onClick={() => setSurchargeApproved(false)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-[#111c29] rounded-xl font-display text-xs font-bold"
                >
                  Dispute
                </button>
              </div>
            ) : (
              <div
                className={`p-2.5 rounded-xl text-center font-display text-xs font-bold ${
                  surchargeApproved ? 'bg-[#E6F4F1] text-[#0F6E56]' : 'bg-[#FEF2F2] text-[#DC2626]'
                }`}
              >
                {surchargeApproved ? 'Surcharge Approved & Recorded' : 'Surcharge Disputed'}
              </div>
            )}
          </div>

          {/* Micro-Second GPS Telemetry & Reefer Monitor */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F6E56] text-xl">satellite_alt</span>
                <h3 className="font-display text-sm font-extrabold text-[#111c29]">
                  Live Telemetry &amp; Route Timeline
                </h3>
              </div>
              <span className="text-[11px] text-[#0F6E56] font-bold bg-[#E6F4F1] px-2.5 py-0.5 rounded-full">
                GPS Refresh: 2s
              </span>
            </div>

            {/* Reefer temperature graph representation */}
            <div className="bg-[#0F172A] rounded-xl p-4 text-white space-y-2 border border-slate-700">
              <div className="flex items-center justify-between text-xs">
                <span className="font-display text-slate-300 font-bold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#2563EB] text-sm">thermostat</span>
                  Reefer Cargo Telemetry: -18.2°C Constant
                </span>
                <span className="text-emerald-400 font-bold">100% SLA PASS</span>
              </div>
              <div className="h-10 w-full flex items-end gap-1 pt-2">
                {[40, 42, 41, 39, 43, 40, 41, 42, 40, 41, 39, 42, 40].map((val, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-blue-600 to-emerald-400 rounded-t"
                    style={{ height: `${val}%` }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-4 pt-1">
              {timelineEvents.map((evt, idx) => (
                <div key={idx} className="flex items-start gap-3 relative">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs ${
                      evt.status === 'completed'
                        ? 'bg-[#0F6E56]'
                        : evt.status === 'warning'
                        ? 'bg-[#D97706]'
                        : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">{evt.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs font-bold text-[#111c29]">
                        {evt.title}
                      </span>
                      <span className="text-[10px] text-[#64748B] font-mono">{evt.time}</span>
                    </div>
                    <p className="font-body text-xs text-[#5A6578] mt-0.5">{evt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
