'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import DriverBottomNav from '@/components/driver/DriverBottomNav';

export default function DriverForecastPage() {
  const router = useRouter();
  const { setLangModalOpen, getLangObj } = useLanguage();
  const currentLang = getLangObj();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isReserved, setIsReserved] = useState(false);

  const toggleVoice = () => {
    setIsPlayingVoice(!isPlayingVoice);
    if (!isPlayingVoice && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        'चाकण इंडस्ट्रियल एरिया में 142 रिटर्न लोड उपलब्ध हैं। खाली फेरा बचाने के लिए अभी स्लॉट बुक करें।'
      );
      utterance.lang = 'hi-IN';
      utterance.onend = () => setIsPlayingVoice(false);
      window.speechSynthesis.speak(utterance);
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleReserve = () => {
    setIsReserved(true);
    setTimeout(() => {
      router.push('/driver/trust-score');
    }, 1000);
  };

  return (
    <div className="bg-[#F8F9FA] font-body text-[#111c29] flex flex-col min-h-screen antialiased">
      {/* Top Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 pt-safe bg-[#0F6E56]/95 backdrop-blur-xl shadow-sm text-white">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/driver/handoff" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-white text-2xl">arrow_back</span>
              <div>
                <span className="font-display text-base text-white font-extrabold tracking-tight">AI Demand Radar</span>
                <p className="text-[10px] text-emerald-100">Zero Empty Deadhead (शून्य खाली फेरा)</p>
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
              <Link href="/driver/handoff" className="px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                Handoff
              </Link>
              <Link href="/driver/forecast" className="px-3 py-1.5 rounded-lg bg-white/20 text-white font-bold">
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
            <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              <span>Live Radar</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative w-full max-w-7xl mx-auto pt-20 pb-24 px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Responsive Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: AI Recommendation, Filter Ribbon, and Heatmap Canvas */}
          <div className="lg:col-span-7 space-y-4">
            {/* AI Top Recommendation Smart Banner */}
            <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#E2E8F0] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#E6F4F1] rounded-full -mr-12 -mt-12 pointer-events-none opacity-60"></div>
          <div className="flex items-center justify-between mb-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E6F4F1] text-[#0F6E56]">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              <span className="font-display text-xs font-bold tracking-wide uppercase">
                ReLoad AI Engine v3.4
              </span>
            </div>
            <button
              onClick={toggleVoice}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors min-h-[40px] font-display text-xs font-bold ${
                isPlayingVoice ? 'bg-[#0F6E56] text-white' : 'bg-[#F1F5F9] text-[#0F6E56] hover:bg-[#E6F4F1]'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {isPlayingVoice ? 'stop_circle' : 'volume_up'}
              </span>
              <span>{isPlayingVoice ? 'Stop' : 'Listen'}</span>
            </button>
          </div>
          <div className="space-y-0.5">
            <p className="font-display text-xs text-[#5A6578] font-medium">Optimal Backhaul Destination</p>
            <h2 className="font-display text-xl text-[#111c29] font-extrabold leading-tight">
              Chakan Industrial Area
            </h2>
            <p className="font-body text-xs text-[#5A6578] flex items-center gap-1.5 mt-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-[#0F6E56] animate-pulse"></span>
              Surge detected: 142 shippers active within 4.2 km
            </p>
          </div>
        </div>

        {/* Filter Pills Ribbon */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-4 py-2 rounded-full font-display text-xs font-bold flex items-center gap-1.5 whitespace-nowrap min-h-[44px] shadow-xs transition-all ${
              selectedFilter === 'all'
                ? 'bg-[#0F6E56] text-white'
                : 'bg-white border border-slate-200 text-[#5A6578] hover:text-[#111c29]'
            }`}
          >
            <span className="material-symbols-outlined text-base">local_shipping</span>
            <span>All Loads (187)</span>
          </button>
          <button
            onClick={() => setSelectedFilter('surge')}
            className={`px-4 py-2 rounded-full font-display text-xs font-bold flex items-center gap-1.5 whitespace-nowrap min-h-[44px] shadow-xs transition-all ${
              selectedFilter === 'surge'
                ? 'bg-[#0F6E56] text-white'
                : 'bg-white border border-slate-200 text-[#5A6578] hover:text-[#111c29]'
            }`}
          >
            <span className="material-symbols-outlined text-base text-[#0F6E56]">trending_up</span>
            <span>High Pay Surge</span>
          </button>
          <button
            onClick={() => setSelectedFilter('reefer')}
            className={`px-4 py-2 rounded-full font-display text-xs font-bold flex items-center gap-1.5 whitespace-nowrap min-h-[44px] shadow-xs transition-all ${
              selectedFilter === 'reefer'
                ? 'bg-[#0F6E56] text-white'
                : 'bg-white border border-slate-200 text-[#5A6578] hover:text-[#111c29]'
            }`}
          >
            <span className="material-symbols-outlined text-base text-[#2563EB]">ac_unit</span>
            <span>Reefer / Cold Chain</span>
          </button>
        </div>

        {/* Heatmap Map Canvas Card */}
        <div className="w-full bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E2E8F0] flex flex-col">
          <div className="relative w-full h-60 overflow-hidden bg-[#0F172A]">
            <img
              alt="Chakan Industrial Area heatmap corridor"
              className="w-full h-full object-cover opacity-75"
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 via-transparent to-[#0F172A]/30 pointer-events-none"></div>

            {/* Green Zone Pin: High Demand */}
            <div className="absolute top-8 right-10 flex flex-col items-center animate-pulse">
              <div className="px-2.5 py-1 rounded-full bg-[#0F6E56] text-white font-display text-[11px] font-bold shadow-md flex items-center gap-1 border border-emerald-300">
                <span className="material-symbols-outlined text-xs">local_fire_department</span>
                Chakan: 142 Loads
              </div>
              <div className="w-3 h-3 bg-[#0F6E56] rotate-45 -mt-1.5"></div>
            </div>

            {/* Yellow Zone Pin: Medium Demand */}
            <div className="absolute top-20 left-10 flex flex-col items-center">
              <div className="px-2.5 py-1 rounded-full bg-[#D97706] text-white font-display text-[11px] font-bold shadow-md flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">hourglass_top</span>
                Talegaon: 45 Loads
              </div>
              <div className="w-3 h-3 bg-[#D97706] rotate-45 -mt-1.5"></div>
            </div>

            {/* Red Zone Pin: Deadhead Risk */}
            <div className="absolute bottom-8 right-20 flex flex-col items-center opacity-90">
              <div className="px-2 py-0.5 rounded-full bg-[#DC2626] text-white font-display text-[10px] font-bold shadow-md flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">warning</span>
                Khadki: Deadhead Risk
              </div>
              <div className="w-2.5 h-2.5 bg-[#DC2626] rotate-45 -mt-1"></div>
            </div>

            {/* Radar live badge */}
            <div className="absolute top-3 left-3 bg-[#0F172A]/90 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-2 border border-slate-700">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0F6E56] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
              <span className="font-display text-[10px] text-white tracking-wide uppercase font-bold">
                Real-Time Corridors
              </span>
            </div>
          </div>

          {/* Zone Breakdown List */}
          <div className="p-3 bg-[#F8F9FA] flex flex-col space-y-2 border-t border-slate-100">
            <div className="p-2.5 rounded-xl bg-white flex items-center justify-between shadow-xs border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0F6E56]"></div>
                <div>
                  <p className="font-display text-xs font-bold text-[#111c29]">Chakan Ind. Hub</p>
                  <p className="font-body text-[10px] text-[#5A6578]">142 loads ready • 8 min pickup</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-display text-xs text-[#0F6E56] font-extrabold">+₹8,400</span>
                <span className="block text-[10px] text-[#0F6E56] font-bold">High Profit</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white flex items-center justify-between shadow-xs border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></div>
                <div>
                  <p className="font-display text-xs font-bold text-[#111c29]">Talegaon Cluster</p>
                  <p className="font-body text-[10px] text-[#5A6578]">45 loads waiting • 24 min avg</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-display text-xs text-[#111c29] font-bold">+₹3,900</span>
                <span className="block text-[10px] text-[#5A6578]">Balanced</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white flex items-center justify-between shadow-xs border border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#DC2626]"></div>
                <div>
                  <p className="font-display text-xs font-bold text-[#111c29]">Khadki Corridor</p>
                  <p className="font-body text-[10px] text-[#DC2626]">No verified returns • Avoid</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-display text-xs text-[#DC2626] font-bold">-₹3,800</span>
                <span className="block text-[10px] text-[#DC2626]">Loss Risk</span>
              </div>
            </div>
          </div>
        </div>
          </div>

          {/* Right Column: Return Profit Predictor & Corridor Reserve Opportunity */}
          <div className="lg:col-span-5 space-y-4">
            {/* Return Profit Predictor Split Bento Card */}
            <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#E2E8F0] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-sm font-extrabold text-[#111c29]">Return Profit Predictor</h3>
              <p className="font-body text-xs text-[#5A6578]">Calculated for 16T Multi-Axle Truck</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#E6F4F1] flex items-center justify-center text-[#0F6E56]">
              <span className="material-symbols-outlined text-lg">calculate</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="rounded-xl p-3 bg-[#FEF2F2] border border-red-200 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-display text-[10px] text-[#DC2626] font-bold uppercase tracking-wider">
                  Empty Deadhead
                </span>
                <span className="material-symbols-outlined text-base text-[#DC2626]">trending_down</span>
              </div>
              <div>
                <span className="font-display text-base text-[#DC2626] font-extrabold">-₹3,800</span>
                <p className="text-[10px] text-[#5A6578] leading-tight mt-0.5">Fuel &amp; Tolls Wasted</p>
              </div>
            </div>

            <div className="rounded-xl p-3 bg-[#E6F4F1] border border-emerald-200 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-display text-[10px] text-[#0F6E56] font-bold uppercase tracking-wider">
                  Matched Return
                </span>
                <span className="material-symbols-outlined text-base text-[#0F6E56]">savings</span>
              </div>
              <div>
                <span className="font-display text-base text-[#0F6E56] font-extrabold">+₹8,400</span>
                <p className="text-[10px] text-[#5A6578] leading-tight mt-0.5">Gross ₹14.2k • Net +59%</p>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#F8F9FA] flex items-center justify-between border border-slate-100">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-[#0F6E56]">monetization_on</span>
              <span className="font-display text-xs text-[#111c29] font-bold">Net Pocket Difference:</span>
            </div>
            <span className="font-display text-sm text-[#0F6E56] font-extrabold">+₹12,200</span>
          </div>
        </div>

        {/* Opportunity Card */}
        <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#E2E8F0] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB] font-display text-[11px] font-bold flex items-center gap-1 border border-blue-200">
              <span className="material-symbols-outlined text-xs">ac_unit</span>
              Reefer Auto-Parts
            </span>
            <span className="font-display text-[10px] text-[#5A6578] font-bold">Expiring in 11m</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-display text-xs font-bold text-[#111c29]">Chakan Auto Ancillary → JNPT Port</h4>
              <p className="font-body text-[11px] text-[#5A6578]">14.2 Tonnes • Precision Engine Blocks</p>
            </div>
            <div className="text-right">
              <span className="font-display text-sm text-[#0F6E56] font-extrabold">₹18,500</span>
              <span className="block text-[10px] text-[#5A6578]">Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Reserve Button CTA */}
        <div className="pt-1">
          <button
            onClick={handleReserve}
            disabled={isReserved}
            className="w-full h-14 min-h-[56px] bg-[#0F6E56] hover:bg-[#0B5240] text-white rounded-xl font-display text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-2xl">verified</span>
            <span>
              {isReserved
                ? 'Corridor Reserved! Loading Trust Tier...'
                : 'Reserve Return Corridor Now • ₹8,400 Save'}
            </span>
          </button>
          <p className="font-display text-[10px] text-center text-[#64748B] mt-2">
            Zero cancellation penalties within 15-minute slot lock.
          </p>
        </div>
          </div>
        </div>
      </main>

      <DriverBottomNav />
    </div>
  );
}
