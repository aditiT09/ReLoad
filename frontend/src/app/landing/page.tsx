'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function LandingRoleSplitPage() {
  const router = useRouter();
  const { setLangModalOpen, getLangObj } = useLanguage();
  const currentLang = getLangObj();

  return (
    <div className="bg-[#F8F9FA] text-[#16212E] font-body flex flex-col min-h-screen pt-safe pb-safe selection:bg-[#E6F4F1] selection:text-[#0F6E56]">
      {/* TOP HEADER & BRAND IDENTITY */}
      <header className="w-full px-4 pt-3 pb-2 flex items-center justify-between border-b border-[#E2E8F0]/70 bg-white/90 backdrop-blur sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] border border-[#0F6E56]/20 flex items-center justify-center relative shadow-sm">
            <svg
              className="w-6 h-6 text-[#0F6E56]"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
              <path d="M21 21v-5h-5"></path>
              <circle cx="12" cy="12" fill="#0F6E56" r="3" stroke="none"></circle>
            </svg>
          </div>
          <div>
            <div className="flex items-baseline">
              <span className="font-display font-extrabold text-2xl tracking-tight text-[#16212E]">Re</span>
              <span className="font-display font-extrabold text-2xl tracking-tight text-[#0F6E56]">Load</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F6E56] ml-0.5 mb-1 inline-block"></span>
            </div>
            <p className="font-display font-semibold text-[11px] text-[#64748B] tracking-wide -mt-0.5">
              Step 2 of 2 • Role Selection
            </p>
          </div>
        </Link>

        {/* Language Selector Pill */}
        <button
          onClick={() => setLangModalOpen(true)}
          className="h-11 px-3.5 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
          type="button"
        >
          <span className="text-base">🌐</span>
          <span className="font-display font-bold text-xs text-[#16212E]">
            {currentLang.native} / {currentLang.code.toUpperCase()}
          </span>
          <span className="material-symbols-outlined text-[#64748B] text-lg">arrow_drop_down</span>
        </button>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 flex flex-col gap-4 sm:gap-6">
        {/* HERO TITLE & DUAL SCRIPT */}
        <div className="pt-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6F4F1] text-[#0F6E56] text-xs font-display font-bold mb-2">
            <span className="material-symbols-outlined text-sm font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
            <span>National Freight Protocol v4.2</span>
          </div>
          <h1 className="font-display font-extrabold text-[28px] leading-tight text-[#16212E]">
            Who are you?
            <span className="block text-[#0F6E56] text-xl font-bold font-display mt-0.5">आप कौन हैं?</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5A6578] font-medium mt-1 leading-snug">
            Choose your role to get started with verified logistics • अपनी भूमिका चुनें
          </p>
        </div>

        {/* PERSONA CARDS CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* CARD 1: CUSTOMER (SHIPPER) */}
          <article className="rounded-2xl bg-white border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            {/* Real Authentic Photo Header */}
            <div className="relative w-full h-44 bg-slate-200 overflow-hidden">
              <img
                alt="Warehouse cargo bay with forklift loading freight trucks"
                className="w-full h-full object-cover object-center"
                src="https://lh3.googleusercontent.com/aida/AEtjO1UKeG8Z6Ki54FRomheguS25J2Ut4fN4E27Q4Y77Yb-TxsK4pN59SkxHa_VLi7hYVBFcaK0FEZovDYNZ_C7PI9RlzkqeirZncYYT-ZmriY4PMmPKHfoiKTcnUdMGW8phXLxsh6If5R6F69wzyjNV03GF6mu1VY3esfy_vYHcYpnq1wo-g7BMsuq_Weu1gLdWLYN-xy3O-KnGDr0dGU5KyZLWVKamt1_zXQEluf2QFslpFowEtoG5I7UhyD4n"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/95 via-[#0F172A]/35 to-transparent"></div>
              {/* Category Pill */}
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur text-[#0F6E56] font-display font-bold text-xs shadow-sm">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    warehouse
                  </span>
                  Shipper Portal
                </span>
              </div>
              {/* Dual Script Header Over Scrim */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <h2 className="font-display font-extrabold text-lg text-white leading-tight drop-shadow-sm">
                    I&apos;m a Customer (Shipper)
                  </h2>
                  <p className="font-display font-semibold text-sm text-[#E6F4F1] drop-shadow-sm">
                    मुझे सामान भेजना है
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#0F6E56] text-white flex items-center justify-center shadow shrink-0">
                  <span className="material-symbols-outlined text-xl">inventory_2</span>
                </div>
              </div>
            </div>

            {/* Card Content & Value Chips */}
            <div className="p-3.5 sm:p-4 flex flex-col gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0]">
                  <span className="text-base shrink-0">🛡️</span>
                  <span className="font-display font-bold text-xs text-[#16212E] leading-tight">
                    100% KYC &amp; FASTag Verified Fleet
                  </span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0]">
                  <span className="text-base shrink-0">🔒</span>
                  <span className="font-display font-bold text-xs text-[#16212E] leading-tight">
                    Locked Fare ₹0 Hidden Surcharges
                  </span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0]">
                  <span className="text-base shrink-0">📡</span>
                  <span className="font-display font-bold text-xs text-[#16212E] leading-tight">
                    Live GPS &amp; Cold-Chain Telematics
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => router.push('/customer/login')}
                className="w-full h-14 rounded-xl bg-[#0F6E56] hover:bg-[#0B5240] active:scale-[0.98] text-white font-display font-extrabold text-sm sm:text-base flex items-center justify-between px-4 shadow-md transition-all group"
                type="button"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl">forklift</span>
                  <span>Enter Customer App • कस्टमर पोर्टल</span>
                </span>
                <span className="material-symbols-outlined text-2xl transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </button>
            </div>
          </article>

          {/* CARD 2: TRUCK DRIVER */}
          <article className="rounded-2xl bg-white border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            {/* Real Authentic Photo Header */}
            <div className="relative w-full h-44 bg-slate-200 overflow-hidden">
              <img
                alt="Smiling Indian truck driver inside cab"
                className="w-full h-full object-cover object-top"
                src="https://lh3.googleusercontent.com/aida/AEtjO1VikpgIL6PbWrgzNeJ69WEF1bg2Xzo96NNq01pi3dmwJg3mnGS5WQUMj5IYjWaWUjwQsQ0fa-Qd6HOWHrFcO-wL8Wdn5ocW2Vn6Gc8VsWSkSpE3U1mEFb-4Z89rtFX-xLCX1XbR_6D2bApOxZQqEZ2Jkt3knsMh2kGnZzi9Ju9j_H6eAuMSWKS3JrSnsJdSOyT4u0_btuw8UtetrALLPsA2othW0bRnDlBL2QvvvkVUR7jMfMfQgQuRFVA"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/95 via-[#0F172A]/35 to-transparent"></div>
              {/* Category Pill */}
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur text-[#0B5240] font-display font-bold text-xs shadow-sm">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    badge
                  </span>
                  Driver Community
                </span>
              </div>
              {/* Dual Script Header Over Scrim */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <h2 className="font-display font-extrabold text-lg text-white leading-tight drop-shadow-sm">
                    I&apos;m a Truck Driver
                  </h2>
                  <p className="font-display font-semibold text-sm text-[#E6F4F1] drop-shadow-sm">
                    मैं ट्रक ड्राइवर हूँ
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#0B5240] text-white flex items-center justify-center shadow shrink-0">
                  <span className="material-symbols-outlined text-xl">local_shipping</span>
                </div>
              </div>
            </div>

            {/* Card Content & Value Chips */}
            <div className="p-3.5 sm:p-4 flex flex-col gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0]">
                  <span className="text-base shrink-0">🔄</span>
                  <span className="font-display font-bold text-xs text-[#16212E] leading-tight">
                    Guaranteed Return Loads (Zero Khali Deadhead)
                  </span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0]">
                  <span className="text-base shrink-0">⚡</span>
                  <span className="font-display font-bold text-xs text-[#16212E] leading-tight">
                    Same-Day UPI / Bank Direct Payouts
                  </span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#F8F9FA] border border-[#E2E8F0]">
                  <span className="text-base shrink-0">🎙️</span>
                  <span className="font-display font-bold text-xs text-[#16212E] leading-tight">
                    Voice Guidance &amp; Auto Map in 5 Dialects
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => router.push('/driver/login')}
                className="w-full h-14 rounded-xl bg-[#0B5240] hover:bg-[#16212E] active:scale-[0.98] text-white font-display font-extrabold text-sm sm:text-base flex items-center justify-between px-4 shadow-md transition-all group"
                type="button"
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl">mic</span>
                  <span>ड्राइवर मोड शुरू करें (Enter Driver Hub) 🚛</span>
                </span>
                <span className="material-symbols-outlined text-2xl transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </button>
            </div>
          </article>

          {/* CARD 3: OPERATIONS & DISPATCH ADMIN PORTAL */}
          <article className="rounded-2xl bg-[#0F172A] text-white border border-slate-700 shadow-sm p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center border border-slate-700">
                  <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-white">Operations &amp; Admin Portal</h3>
                  <p className="text-[11px] text-slate-400">Dispatcher Fleet Telematics &amp; Compliance</p>
                </div>
              </div>
              <span className="bg-emerald-950 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-800">
                PRO CONSOLE
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Real-time multi-corridor telemetry, cold-chain temperature SLA alerts, and driver KYC approval queue.
            </p>
            <button
              onClick={() => router.push('/admin/login')}
              className="w-full h-11 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-display font-bold text-xs flex items-center justify-between px-4 border border-slate-600 transition-colors"
            >
              <span>Launch Operations Portal (डिस्पैच कंसोल)</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </article>
        </div>

        {/* TRUST FOOTER & HELPLINE */}
        <footer className="mt-2 pt-3 border-t border-[#E2E8F0] flex flex-col gap-3 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-display font-semibold text-[#64748B]">
            <span className="inline-flex items-center gap-1 text-[#0F6E56]">
              <span className="material-symbols-outlined text-sm font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                shield
              </span>
              Govt of India ULIP
            </span>
            <span>•</span>
            <span>ISO 27001 Multimodal Verified</span>
          </div>
          <a
            className="h-12 w-full rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex items-center justify-center gap-2 text-[#16212E] active:bg-[#F1F5F9] transition-colors px-3"
            href="tel:18002008899"
          >
            <span className="material-symbols-outlined text-[#0F6E56] text-xl">support_agent</span>
            <span className="font-display font-bold text-xs sm:text-sm">
              📞 1800-200-8899 (Toll Free / 24x7 सहायता)
            </span>
          </a>
        </footer>
      </main>
    </div>
  );
}
