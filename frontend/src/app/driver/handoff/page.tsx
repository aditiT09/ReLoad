'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import DriverBottomNav from '@/components/driver/DriverBottomNav';

export default function DriverHandoffPage() {
  const router = useRouter();
  const { setLangModalOpen, getLangObj } = useLanguage();
  const currentLang = getLangObj();
  const [handoffMode, setHandoffMode] = useState<'pickup' | 'dropoff'>('pickup');
  const [isSealIntact, setIsSealIntact] = useState<boolean | null>(true);
  const [otp, setOtp] = useState('628');
  const [hasSigned, setHasSigned] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleKeyTap = (digit: string) => {
    if (otp.length < 4) {
      setOtp((prev) => prev + digit);
    }
  };

  const handleClearOtp = () => {
    setOtp('');
  };

  const handleConfirm = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      router.push('/driver/forecast');
    }, 1000);
  };

  return (
    <div className="bg-[#F8F9FA] font-body text-[#111c29] flex flex-col min-h-screen antialiased">
      {/* Top Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 pt-safe bg-[#0F6E56]/95 backdrop-blur-xl shadow-sm text-white">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/driver/navigation" className="flex items-center gap-2 text-white">
              <span className="material-symbols-outlined text-white text-2xl">arrow_back</span>
              <div>
                <span className="font-display text-base text-white font-extrabold">Cargo Handoff</span>
                <p className="text-[10px] text-emerald-100">Pallet #RL-9082-CK</p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-display font-semibold text-emerald-100">
              <Link href="/driver/home" className="px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                Bookings
              </Link>
              <Link href="/driver/navigation" className="px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                Navigation
              </Link>
              <Link href="/driver/handoff" className="px-3 py-1.5 rounded-lg bg-white/20 text-white font-bold">
                Handoff
              </Link>
              <Link href="/driver/forecast" className="px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                Forecast
              </Link>
              <Link href="/driver/trust-score" className="px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                Trust Score
              </Link>
              <Link href="/driver/profile" className="px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                Earnings & Profile
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setLangModalOpen(true)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-colors"
              type="button"
            >
              <span className="text-xs">🌐</span>
              <span className="font-display text-[11px] font-bold">{currentLang.native}</span>
            </button>
            <span className="bg-white/20 text-white font-display text-xs font-bold px-3 py-1 rounded-full border border-white/20">
              {handoffMode === 'pickup' ? 'उठाव (Pickup)' : 'सुपुर्दगी (Drop-off)'}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative w-full max-w-7xl mx-auto pt-20 pb-24 px-4 sm:px-6 lg:px-8 gap-4">
        {/* Responsive Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Mode Switcher, Geofence Seal, Camera Viewfinder, Physical Seal */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            {/* Handoff Mode Switcher */}
            <div className="flex items-center justify-between bg-[#F1F5F9] rounded-xl p-1 shadow-xs border border-slate-200">
          <button
            onClick={() => setHandoffMode('pickup')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-display text-xs font-bold transition-all ${
              handoffMode === 'pickup'
                ? 'bg-[#0F6E56] text-white shadow-sm'
                : 'text-[#5A6578] hover:text-[#111c29]'
            }`}
          >
            <span className="material-symbols-outlined text-base">inventory_2</span>
            <span>Pickup (उठाव)</span>
          </button>
          <button
            onClick={() => setHandoffMode('dropoff')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg font-display text-xs font-bold transition-all ${
              handoffMode === 'dropoff'
                ? 'bg-[#0F6E56] text-white shadow-sm'
                : 'text-[#5A6578] hover:text-[#111c29]'
            }`}
          >
            <span className="material-symbols-outlined text-base">local_shipping</span>
            <span>Drop-off (सुपुर्दगी)</span>
          </button>
        </div>

        {/* GPS Geofenced Bay Seal */}
        <div className="flex items-center gap-2.5 bg-[#E6F4F1] rounded-xl p-3 shadow-xs border border-[#0F6E56]/20">
          <div className="w-9 h-9 rounded-full bg-[#0F6E56] flex items-center justify-center text-white shrink-0">
            <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              my_location
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-display text-xs text-[#0F6E56] font-bold">
                {handoffMode === 'pickup' ? 'Chakan Hub Bay 04' : 'JNPT Freight Terminal Drop 02'}
              </span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-white text-[#0F6E56] font-display text-[10px] font-bold shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F6E56] animate-pulse"></span>
                Verified GPS (±3m)
              </span>
            </div>
            <p className="font-body text-[11px] text-[#5A6578] truncate">
              {handoffMode === 'pickup'
                ? 'Gate 2 • Auto-verified at loading dock'
                : 'Gate 5 • Auto-verified at delivery dock'}
            </p>
          </div>
          <span className="material-symbols-outlined text-[#0F6E56] text-xl shrink-0">verified</span>
        </div>

        {/* Live Dock Camera Capture Box */}
        <div className="relative w-full h-52 rounded-2xl overflow-hidden shadow-md bg-[#0F172A] flex flex-col justify-between p-3 border border-slate-700">
          <img
            alt="Logistics loading dock bay with cargo truck"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuYHLDxO8IQvPBYAeN1U7yc1AouFjJXnVIq4q1kVcqIUmMtcXJg8JtehvSv7RT02uQG3_dI90Lgcxl37w90SpcbD6g-xLhvvk83ynXSGC_gvWgWcdT4YOfh_-2M11SpFOVNSCYWbWzQO7ho1zYaC3EHtS6iUTToS38yeWqlV7k1ltVhP3bTr5kaJJGE5MsTSsRFe30NCcgL8oAAV88fdWXn1OjBlIIDlD3O54qFJ8wA_El3_jsWZmqwA"
          />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-[#0F172A]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-white">
              <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping"></span>
              <span className="font-display text-[10px] uppercase font-bold tracking-wider">
                Live Dock Cam (कैमरा)
              </span>
            </div>
            <button
              onClick={() => alert('Flash toggled')}
              className="w-7 h-7 rounded-full bg-[#0F172A]/70 backdrop-blur-md text-white flex items-center justify-center active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">flash_on</span>
            </button>
          </div>

          {/* Center focus viewfinder */}
          <div className="relative z-10 flex items-center justify-center my-auto pointer-events-none">
            <div className="w-32 h-32 border-2 border-dashed border-white/70 rounded-xl relative flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-white/80 text-3xl">center_focus_strong</span>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between bg-[#0F172A]/85 backdrop-blur-md rounded-lg px-3 py-1.5 text-white">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-lg">qr_code_scanner</span>
              <div className="flex flex-col">
                <span className="font-display text-xs font-bold leading-tight">Pallet ID: #RL-9082-CK</span>
                <span className="text-[10px] text-slate-300">Photo auto-tagged to bill of lading</span>
              </div>
            </div>
            <button
              onClick={() => alert('Photo captured')}
              className="h-7 px-2.5 rounded-lg bg-white text-[#0F6E56] font-display text-[11px] font-bold flex items-center gap-1 active:scale-95 shadow-xs"
            >
              <span className="material-symbols-outlined text-xs">photo_camera</span>
              Retake
            </button>
          </div>
        </div>

        {/* Cargo Seal Inspection Card */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#E2E8F0] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] flex items-center justify-center text-[#0F6E56]">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  lock
                </span>
              </div>
              <div>
                <h3 className="font-display text-xs font-bold text-[#111c29]">Cargo Physical Seal</h3>
                <p className="font-body text-[11px] text-[#5A6578]">सील अखंड है? (Intact &amp; Unbroken)</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#F1F5F9] font-display text-[11px] text-[#5A6578] font-bold">
              #SL-44910
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={() => setIsSealIntact(true)}
              className={`min-h-[44px] rounded-xl flex items-center justify-center gap-2 p-2 transition-all font-display text-xs font-bold ${
                isSealIntact === true
                  ? 'bg-[#0F6E56] text-white shadow-sm'
                  : 'bg-[#F1F5F9] text-[#5A6578] hover:bg-slate-200'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <div className="flex flex-col items-start leading-tight">
                <span>YES (हाँ)</span>
                <span className="text-[9px] font-normal opacity-90">Intact &amp; Matched</span>
              </div>
            </button>
            <button
              onClick={() => setIsSealIntact(false)}
              className={`min-h-[44px] rounded-xl flex items-center justify-center gap-2 p-2 transition-all font-display text-xs font-bold ${
                isSealIntact === false
                  ? 'bg-[#DC2626] text-white shadow-sm'
                  : 'bg-[#F1F5F9] text-[#5A6578] hover:bg-red-50'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-lg">cancel</span>
              <div className="flex flex-col items-start leading-tight">
                <span>NO (टूटा/खराब)</span>
                <span className="text-[9px] font-normal opacity-90">Broken / Tampered</span>
              </div>
            </button>
          </div>
        </div>
          </div>

          {/* Right Column: OTP Keypad, Signature, and Confirmation CTA */}
          <div className="lg:col-span-6 flex flex-col gap-3">
            {/* 4-Digit OTP Keypad Card */}
            <div className="bg-white rounded-xl p-4 shadow-xs border border-[#E2E8F0] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
                <span className="material-symbols-outlined text-lg">pin</span>
              </div>
              <div>
                <h3 className="font-display text-xs font-bold text-[#111c29]">
                  {handoffMode === 'pickup' ? 'Warehouse Handoff OTP' : 'Receiver Delivery OTP'}
                </h3>
                <p className="font-body text-[11px] text-[#5A6578]">
                  {handoffMode === 'pickup'
                    ? 'Ask Dock Supervisor for 4-digit code (ओटीपी)'
                    : 'Collect 4-digit PIN from Consignee'}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#64748B] text-lg">shield</span>
          </div>

          {/* OTP Digits Display */}
          <div className="flex justify-center gap-3 my-1">
            {[0, 1, 2, 3].map((index) => {
              const char = otp[index] || '';
              const isCurrent = index === otp.length;
              return (
                <div
                  key={index}
                  className={`w-12 h-14 rounded-xl flex items-center justify-center font-display text-2xl font-bold transition-all ${
                    char
                      ? 'bg-[#E6F4F1] text-[#0F6E56] border border-emerald-300'
                      : isCurrent
                      ? 'bg-[#F1F5F9] text-[#111c29] border-2 border-[#0F6E56] animate-pulse'
                      : 'bg-[#F8F9FA] text-slate-300 border border-slate-200'
                  }`}
                >
                  {char || (isCurrent ? '|' : '•')}
                </div>
              );
            })}
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-4 gap-1.5 mt-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((digit) => (
              <button
                key={digit}
                onClick={() => handleKeyTap(digit)}
                className="min-h-[44px] rounded-lg bg-[#F1F5F9] active:bg-slate-200 text-[#111c29] font-display text-sm font-bold flex items-center justify-center transition-colors"
                type="button"
              >
                {digit}
              </button>
            ))}
            <button
              onClick={handleClearOtp}
              className="col-span-2 min-h-[44px] rounded-lg bg-slate-200 active:bg-slate-300 text-[#5A6578] font-display text-xs font-bold flex items-center justify-center gap-1 transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-base">backspace</span>
              <span>Clear (मिटाएं)</span>
            </button>
          </div>
        </div>

        {/* E-Signature Pad */}
        <div className="bg-white rounded-xl p-4 shadow-xs border border-[#E2E8F0] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] flex items-center justify-center text-[#D97706]">
                <span className="material-symbols-outlined text-lg">draw</span>
              </div>
              <div>
                <h3 className="font-display text-xs font-bold text-[#111c29]">
                  {handoffMode === 'pickup' ? 'Supervisor Signature' : 'Consignee Signature'}
                </h3>
                <p className="font-body text-[11px] text-[#5A6578]">हस्ताक्षर (Signed on screen)</p>
              </div>
            </div>
            <button
              onClick={() => setHasSigned(!hasSigned)}
              className="h-7 px-2.5 rounded-lg bg-[#F1F5F9] text-[#5A6578] font-display text-[11px] font-bold flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">refresh</span>
              Reset
            </button>
          </div>

          <div className="relative w-full h-24 rounded-xl bg-[#F8F9FA] border border-dashed border-slate-300 overflow-hidden cursor-crosshair">
            {hasSigned && (
              <svg className="w-full h-full absolute inset-0 pointer-events-none">
                <path
                  d="M 30 55 Q 70 20, 110 50 T 180 35 T 260 60"
                  fill="none"
                  stroke="#0F6E56"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                ></path>
              </svg>
            )}
            <div className="absolute bottom-2 left-3 flex items-center gap-1 text-[#64748B] text-[10px]">
              <span className="material-symbols-outlined text-xs">edit</span>
              <span>Sign on dotted baseline</span>
            </div>
          </div>
        </div>

        {/* Confirm Action CTA */}
        <div className="pt-2">
          <button
            onClick={handleConfirm}
            disabled={isSubmitted}
            className="w-full h-14 min-h-[56px] rounded-xl bg-[#0F6E56] hover:bg-[#0B5240] active:scale-[0.98] text-white font-display text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-2xl">task_alt</span>
            <span>
              {isSubmitted
                ? 'Handoff Synchronized!'
                : handoffMode === 'pickup'
                ? 'Confirm Pickup & View Return Radar (पुष्टि करें) →'
                : 'Confirm Delivery & Complete Trip (पूर्ण करें) →'}
            </span>
          </button>
          <p className="text-center font-display text-[11px] text-[#64748B] mt-2 font-medium">
            Synced with Dispatch Control &amp; E-Way Bill Portal
          </p>
        </div>
          </div>
        </div>
      </main>

      <DriverBottomNav />
    </div>
  );
}
