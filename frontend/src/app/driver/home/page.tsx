'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import DriverBottomNav from '@/components/driver/DriverBottomNav';
import { bookings } from '@/lib/api';

export default function DriverHomePage() {
  const router = useRouter();
  const { setLangModalOpen, getLangObj } = useLanguage();
  const currentLang = getLangObj();
  const [secondsLeft, setSecondsLeft] = useState(24);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const totalSeconds = 30;
  const circumference = 2 * Math.PI * 28; // ~175.92
  const strokeOffset = circumference - (secondsLeft / totalSeconds) * circumference;

  useEffect(() => {
    if (secondsLeft <= 0 || isRejected || isAccepting) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft, isRejected, isAccepting]);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      const latestId = localStorage.getItem('latest_booking_id');
      if (latestId) {
        await bookings.updateStatus(latestId, 'accepted');
      }
    } catch (err) {
      console.log('Status update error:', err);
    }
    setShowToast(true);
    setTimeout(() => {
      router.push('/driver/navigation');
    }, 1200);
  };

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        'पुणे चाकण से वापी का नया लोड आया है। किराया ₹16,500 है। तुरंत स्वीकार करें।'
      );
      utterance.lang = 'hi-IN';
      utterance.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="bg-[#F8F9FA] font-body text-[#111c29] flex flex-col min-h-screen antialiased">
      {/* Top Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 pt-safe bg-[#0F6E56]/95 backdrop-blur-xl shadow-sm text-white">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/driver/home" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">local_shipping</span>
              </div>
              <span className="font-display text-lg text-white font-extrabold tracking-tight">ReLoad Driver</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-display font-semibold text-emerald-100">
              <Link href="/driver/home" className="px-3 py-1.5 rounded-lg bg-white/20 text-white font-bold">
                Bookings
              </Link>
              <Link href="/driver/navigation" className="px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                Navigation
              </Link>
              <Link href="/driver/handoff" className="px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
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
            <span className="bg-emerald-800/80 text-emerald-100 text-[11px] font-display font-bold px-2.5 py-1 rounded-full border border-emerald-600/50 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              ONLINE
            </span>
            <Link
              href="/driver/profile"
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            >
              <span className="material-symbols-outlined text-base">person</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full max-w-7xl mx-auto pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Audio Briefing Voice Bar */}
        <div className="w-full mb-4 flex items-center justify-between bg-[#E6F4F1] border border-[#0F6E56]/20 px-4 py-2.5 rounded-xl shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#0F6E56] flex items-center justify-center text-white shrink-0 shadow-sm animate-pulse">
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                volume_up
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-display text-xs font-bold text-[#0F6E56] truncate">बोलकर सुनें (Audio Help)</span>
              <span className="font-body text-[11px] text-[#5A6578] truncate">लोड विवरण और किराया सुनिए</span>
            </div>
          </div>
          <button
            onClick={toggleAudio}
            className={`flex items-center justify-center min-h-[40px] px-3 rounded-lg font-display text-xs font-bold active:scale-95 transition-all shadow-xs ${
              isPlayingAudio
                ? 'bg-[#0F6E56] text-white'
                : 'bg-white text-[#0F6E56] border border-emerald-200'
            }`}
          >
            <span className="material-symbols-outlined text-base mr-1">
              {isPlayingAudio ? 'pause' : 'play_circle'}
            </span>
            <span>{isPlayingAudio ? 'Stop' : 'Play'}</span>
          </button>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Column: Load Request */}
          <div className="lg:col-span-8">
            {!isRejected ? (
              <div className="w-full bg-white rounded-2xl shadow-xl border border-[#E2E8F0] overflow-hidden flex flex-col relative animate-fade-up">
            {/* Urgency Ticker Banner */}
            <div className="bg-[#DC2626] px-4 py-2 flex items-center justify-between text-white">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-lg animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>
                  priority_high
                </span>
                <span className="font-display text-xs font-bold tracking-wider uppercase">
                  तत्काल लोड अनुरोध • High Priority Dispatch
                </span>
              </div>
              <span className="font-display text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                EXPRESS
              </span>
            </div>

            {/* Warehouse Banner Photo & Radial Countdown */}
            <div className="relative w-full h-44 bg-slate-900 overflow-hidden">
              <img
                alt="Logistics warehouse loading dock"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida/AEtjO1UKeG8Z6Ki54FRomheguS25J2Ut4fN4E27Q4Y77Yb-TxsK4pN59SkxHa_VLi7hYVBFcaK0FEZovDYNZ_C7PI9RlzkqeirZncYYT-ZmriY4PMmPKHfoiKTcnUdMGW8phXLxsh6If5R6F69wzyjNV03GF6mu1VY3esfy_vYHcYpnq1wo-g7BMsuq_Weu1gLdWLYN-xy3O-KnGDr0dGU5KyZLWVKamt1_zXQEluf2QFslpFowEtoG5I7UhyD4n"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent flex items-end justify-between p-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5 bg-[#E6F4F1]/95 backdrop-blur-sm px-2.5 py-1 rounded-full w-fit mb-1 border border-emerald-400/30">
                    <span className="w-2 h-2 rounded-full bg-[#0F6E56] animate-ping"></span>
                    <span className="font-display text-[11px] font-bold text-[#0F6E56]">Verified Consignor</span>
                  </div>
                  <p className="font-display text-xs font-semibold text-slate-200">Trip ID: #MH-CKN-9842</p>
                </div>

                {/* 30s Countdown Ring */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="relative w-14 h-14 flex items-center justify-center bg-[#0F172A]/80 rounded-full shadow-lg backdrop-blur-md">
                    <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 64 64">
                      <circle
                        className="text-slate-600/40 fill-none"
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <circle
                        className="text-[#DC2626] fill-none transition-all duration-1000 ease-linear"
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeOffset}
                        strokeLinecap="round"
                        strokeWidth="4.5"
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-sm font-extrabold text-white">
                        {secondsLeft}s
                      </span>
                    </div>
                  </div>
                  <span className="font-display text-[10px] text-slate-300 mt-0.5">समय शेष</span>
                </div>
              </div>
            </div>

            {/* Fare & Settlement Section */}
            <div className="p-4 bg-[#F8F9FA] border-b border-[#E2E8F0] flex flex-col">
              <div className="flex items-baseline justify-between">
                <div className="flex flex-col">
                  <span className="font-display text-[11px] font-bold text-[#5A6578] uppercase tracking-wider">
                    निश्चित किराया • Guaranteed Return Fare
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-display text-2xl font-extrabold text-[#111c29] tracking-tight">
                      ₹16,500
                    </span>
                    <span className="font-display text-xs text-[#0F6E56] bg-[#E6F4F1] px-2 py-0.5 rounded-md font-bold">
                      Toll Extra Incl.
                    </span>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="font-display text-xs text-[#64748B] font-semibold">Net ₹87.7/km</span>
                  <span className="font-display text-xs text-[#0F6E56] flex items-center gap-0.5 font-bold mt-0.5">
                    <span className="material-symbols-outlined text-sm">trending_up</span> +18% Peak
                  </span>
                </div>
              </div>
              <div className="mt-2.5 flex items-center gap-1.5 bg-[#E6F4F1]/90 text-[#0F6E56] px-3 py-1.5 rounded-lg border border-[#0F6E56]/20">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  bolt
                </span>
                <span className="font-display text-xs font-bold">
                  Instant Same-Day UPI Settlement (अनलोडिंग होते ही तुरंत बैंक ट्रांसफर)
                </span>
              </div>
            </div>

            {/* Cargo Quick Spec Pills */}
            <div className="px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-[#E2E8F0] bg-white">
              <div className="flex items-center gap-1.5 bg-[#F1F5F9] text-[#111c29] px-3 py-1.5 rounded-lg shrink-0 text-xs font-semibold">
                <span className="material-symbols-outlined text-base text-[#0F6E56]">precision_manufacturing</span>
                <span>Auto Spare Parts</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#F1F5F9] text-[#111c29] px-3 py-1.5 rounded-lg shrink-0 text-xs font-semibold">
                <span className="material-symbols-outlined text-base text-[#0F6E56]">weight</span>
                <span>8.5 Ton</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#F1F5F9] text-[#111c29] px-3 py-1.5 rounded-lg shrink-0 text-xs font-semibold">
                <span className="material-symbols-outlined text-base text-[#0F6E56]">rv_hookup</span>
                <span>Open Deck 32ft</span>
              </div>
            </div>

            {/* Route Stepper */}
            <div className="p-4 bg-white space-y-4">
              <div className="relative flex flex-col gap-4">
                <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-[#CBD5E1]"></div>

                {/* Pickup Waypoint */}
                <div className="flex items-start gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-[#0F6E56] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                      storefront
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs text-[#0F6E56] font-bold uppercase tracking-wider">
                        उठाने का स्थान • PICKUP
                      </span>
                      <span className="font-display text-[10px] bg-[#F1F5F9] text-[#64748B] px-2 py-0.5 rounded font-bold">
                        Ready Now
                      </span>
                    </div>
                    <p className="font-display text-sm text-[#111c29] font-bold truncate mt-0.5">
                      Pune Chakan Hub (Gate 4)
                    </p>
                    <p className="font-body text-xs text-[#5A6578] truncate">
                      MIDC Phase II, Kuruli, Chakan, Pune
                    </p>
                  </div>
                </div>

                {/* Distance pill */}
                <div className="ml-11 flex items-center gap-2 py-1 px-3 bg-[#F1F5F9] rounded-lg w-fit text-xs font-semibold text-[#111c29]">
                  <span className="material-symbols-outlined text-sm text-[#0051d5]">alt_route</span>
                  <span>188 km (~4.5 hrs via NH 48)</span>
                </div>

                {/* Drop-off Waypoint */}
                <div className="flex items-start gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-[#D97706] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                      warehouse
                    </span>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xs text-[#D97706] font-bold uppercase tracking-wider">
                        पहुंचाने का स्थान • DROP
                      </span>
                      <span className="font-display text-xs text-[#5A6578]">Tonight 10:30 PM</span>
                    </div>
                    <p className="font-display text-sm text-[#111c29] font-bold truncate mt-0.5">
                      Vapi Industrial Hub
                    </p>
                    <p className="font-body text-xs text-[#5A6578] truncate">
                      GIDC Phase 1, Near Toll Plaza, Vapi
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 bg-[#F8F9FA] border-t border-[#E2E8F0] flex flex-col gap-2.5">
              <button
                onClick={handleAccept}
                disabled={isAccepting}
                className="w-full h-14 min-h-[56px] bg-[#0F6E56] hover:bg-[#0B5240] active:scale-[0.98] text-white rounded-xl font-display text-base font-extrabold flex items-center justify-center gap-2 shadow-md transition-all"
                type="button"
              >
                {isAccepting ? (
                  <>
                    <span className="material-symbols-outlined text-2xl animate-spin">refresh</span>
                    <span>स्वीकार किया जा रहा है... (Accepting...)</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span>✓ ACCEPT LOAD (स्वीकार करें)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsRejected(true)}
                className="w-full h-12 bg-white hover:bg-slate-100 text-[#64748B] border border-slate-200 rounded-xl font-display text-sm font-bold flex items-center justify-center gap-2 transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">cancel</span>
                <span>✕ REJECT (छोड़ें)</span>
              </button>

              {showToast && (
                <div className="w-full py-2.5 px-3 bg-[#0F6E56] text-white rounded-lg text-center font-display text-xs font-bold animate-fade-up">
                  लोड सफलतापूर्वक स्वीकृत! नेविगेशन लोड हो रहा है...
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full bg-white rounded-2xl p-6 text-center border border-slate-200 shadow-sm space-y-4 animate-fade-up">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">radar</span>
            </div>
            <h3 className="font-display text-base font-bold text-[#111c29]">Searching for Next Best Match</h3>
            <p className="text-xs text-[#5A6578]">अगले लोड की खोज जारी है। कृपया ऑनलाइन रहें।</p>
            <button
              onClick={() => {
                setIsRejected(false);
                setSecondsLeft(30);
              }}
              className="px-4 py-2 bg-[#0F6E56] text-white rounded-lg font-display text-xs font-bold"
            >
              Reset Trip Simulation
            </button>
          </div>
        )}
          </div>

          {/* Right Column / Desktop Sidecar: Shift Earnings & Live Insights */}
          <div className="lg:col-span-4 space-y-4">
            {/* Daily Shift Target Card */}
            <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] text-[#0F6E56] flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-lg">monetization_on</span>
                  </div>
                  <div>
                    <h4 className="font-display text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Earnings</h4>
                    <p className="font-display text-xl font-black text-slate-900">₹6,850 <span className="text-xs font-medium text-slate-400">/ ₹12,000 goal</span></p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-md">57%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#0F6E56] h-full rounded-full w-[57%]"></div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                <span>Completed: 2 Trips</span>
                <span className="text-[#0F6E56] font-bold">Fastag Tolls Paid</span>
              </div>
            </div>

            {/* Trust & Tier Score Card */}
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    military_tech
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-slate-300">Driver Badge</p>
                    <p className="font-display text-base font-bold text-white">Diamond Captain</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-amber-400/20 text-amber-300 text-xs font-bold rounded-full border border-amber-400/30">
                  4.94 ★
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Eligible for priority backhaul matching on Pune - Vapi - Ahmedabad corridor.
              </p>
              <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">Ontime Handoff Rate</span>
                <span className="font-bold text-emerald-400">98.2%</span>
              </div>
            </div>

            {/* Diesel & Highway Corridor Alert */}
            <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-lg">local_gas_station</span>
              </div>
              <div>
                <h5 className="font-display text-xs font-bold text-slate-800">Diesel Discount Partner</h5>
                <p className="text-xs text-slate-500 mt-0.5">IOCL Chakan Exit 4 — Save ₹2.40/L with ReLoad Fastag QR.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <DriverBottomNav />
    </div>
  );
}
