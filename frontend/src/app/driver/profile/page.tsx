'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DriverBottomNav from '@/components/driver/DriverBottomNav';
import { useLanguage } from '@/context/LanguageContext';

export default function DriverProfilePage() {
  const router = useRouter();
  const { setLangModalOpen, getLangObj } = useLanguage();
  const currentLang = getLangObj();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showPayoutToast, setShowPayoutToast] = useState(false);

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setShowPayoutToast(true);
      setTimeout(() => setShowPayoutToast(false), 3000);
    }, 1000);
  };

  return (
    <div className="bg-[#F8F9FA] font-body text-[#111c29] flex flex-col min-h-screen antialiased">
      {/* Top Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 pt-safe bg-[#0F6E56]/95 backdrop-blur-xl shadow-sm text-white">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/driver/trust-score" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-white text-2xl">arrow_back</span>
              <div>
                <span className="font-display text-base text-white font-extrabold tracking-tight">Driver Profile</span>
                <p className="text-[10px] text-emerald-100">Settlements &amp; Wallet Hub</p>
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
              <Link href="/driver/forecast" className="px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                Forecast
              </Link>
              <Link href="/driver/trust-score" className="px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                Trust Score
              </Link>
              <Link href="/driver/profile" className="px-3 py-1.5 rounded-lg bg-white/20 text-white font-bold">
                Earnings & Profile
              </Link>
            </div>
          </div>

          <button
            onClick={() => setLangModalOpen(true)}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold border border-white/20 transition-colors"
          >
            <span className="text-xs">🌐</span>
            <span>{currentLang.native}</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative w-full max-w-5xl mx-auto pt-20 pb-24 px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Driver Identity Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3 border border-[#E2E8F0] relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#E6F4F1] rounded-full blur-2xl pointer-events-none opacity-60"></div>
          <div className="flex items-center gap-3 relative">
            <div className="relative w-16 h-16 shrink-0">
              <img
                alt="Driver Gurpreet Singh"
                className="w-16 h-16 rounded-full object-cover shadow-sm border border-slate-200"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
              />
              <div
                className="absolute -bottom-1 -right-1 bg-[#0F6E56] text-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm"
                title="Identity Verified"
              >
                <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </div>
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h1 className="font-display text-base text-[#111c29] truncate font-extrabold">
                  Gurpreet Singh
                </h1>
                <span className="inline-flex items-center gap-1 bg-[#FEF3C7] text-[#D97706] px-2 py-0.5 rounded-full font-display text-xs font-bold shrink-0">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  4.9 ★
                </span>
              </div>
              <p className="font-body text-xs text-[#5A6578] flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-sm text-[#0F6E56]">verified_user</span>
                ID: RL-884291 • Gold Pilot
              </p>
            </div>
          </div>

          {/* Rig & Equipment Tag */}
          <div className="bg-[#F8F9FA] rounded-xl p-3 flex items-start gap-2.5 border border-slate-100">
            <div className="bg-[#E6F4F1] text-[#0F6E56] p-1.5 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-xl">local_shipping</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-display text-xs font-bold text-[#111c29] truncate">
                Tata Signa 2823 • MH-12-RN-8821
              </span>
              <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                <span className="inline-flex items-center gap-1 font-display text-[10px] bg-[#EFF6FF] text-[#2563EB] px-2 py-0.5 rounded-md font-bold">
                  <span className="material-symbols-outlined text-xs">ac_unit</span> 32 Ft Multi-Axle Reefer
                </span>
                <span className="text-[10px] text-[#0F6E56] font-bold">BS-VI Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Driver Earnings Dashboard Card */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3 border border-[#E2E8F0]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#0F6E56] text-xl">account_balance_wallet</span>
              <span className="font-display text-xs text-[#5A6578] font-bold uppercase tracking-wide">
                Weekly Settlement Payout
              </span>
            </div>
            <span className="inline-flex items-center gap-1 bg-[#E6F4F1] text-[#0F6E56] px-2.5 py-1 rounded-full font-display text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#0F6E56] animate-pulse"></span>
              Live Cycle
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-extrabold text-[#111c29] tracking-tight">
                ₹42,800
              </span>
              <span className="font-display text-xs text-[#0F6E56] font-bold">+18.4% vs last wk</span>
            </div>
            <p className="font-display text-[11px] text-[#64748B] mt-0.5">
              This Week&apos;s Earnings • Verified via Smart BOLs
            </p>
          </div>

          {/* Sub-stats Ticker Bar */}
          <div className="grid grid-cols-3 gap-2 bg-[#F8F9FA] rounded-xl p-2.5 text-center border border-slate-100">
            <div className="flex flex-col items-center">
              <span className="font-display text-xs font-bold text-[#111c29]">12</span>
              <span className="font-display text-[10px] text-[#5A6578]">Trips Done</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-display text-xs font-bold text-[#0F6E56]">0 KM</span>
              <span className="font-display text-[10px] text-[#5A6578]">Empty Deadhead</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-display text-xs font-bold text-[#2563EB]">₹6,200</span>
              <span className="font-display text-[10px] text-[#5A6578]">Fuel Saved</span>
            </div>
          </div>

          {/* Instant Withdrawal Button */}
          <button
            onClick={handleWithdraw}
            disabled={isWithdrawing}
            className="w-full min-h-[48px] bg-[#0F6E56] text-white rounded-xl font-display text-xs font-bold flex items-center justify-between px-4 shadow-sm active:scale-[0.98] transition-all hover:bg-[#0B5240]"
            type="button"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">bolt</span>
              <span>
                {isWithdrawing ? 'Processing UPI Transfer...' : 'Withdraw to UPI (तुरंत पैसे निकालें)'}
              </span>
            </div>
            <span className="bg-[#E6F4F1] text-[#0F6E56] px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-0.5">
              Instant
            </span>
          </button>
        </div>

        {/* Profile Details & Essential Settings List */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] flex flex-col divide-y divide-slate-100 overflow-hidden">
          {/* Linked UPI */}
          <div className="p-3.5 flex items-center justify-between gap-2 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#E6F4F1] text-[#0F6E56] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">account_balance</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-xs font-bold text-[#111c29]">Linked UPI &amp; Bank</span>
                  <span className="bg-[#E6F4F1] text-[#0F6E56] text-[10px] px-1.5 rounded font-bold">Verified</span>
                </div>
                <span className="font-mono text-[11px] text-[#5A6578]">gurpreet@okhdfcbank</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-lg">chevron_right</span>
          </div>

          {/* FASTag Balance */}
          <div className="p-3.5 flex items-center justify-between gap-2 hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">toll</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-xs font-bold text-[#111c29]">FASTag Balance</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 rounded font-semibold">Auto-Recharge</span>
                </div>
                <span className="font-body text-[11px] text-[#5A6578]">₹3,450 Available • NHAI Linked</span>
              </div>
            </div>
            <button className="text-[#0F6E56] font-display text-xs font-bold px-2 py-1 bg-[#E6F4F1] rounded-lg">
              Top-up
            </button>
          </div>

          {/* Emergency SOS */}
          <div className="p-3.5 flex items-center justify-between gap-2 bg-[#FEF2F2]/50 hover:bg-red-50 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-[#DC2626] text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">sos</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-xs font-bold text-[#DC2626]">Emergency SOS Contact</span>
                  <span className="bg-red-100 text-[#DC2626] text-[10px] px-1.5 rounded font-bold">Active 24x7</span>
                </div>
                <span className="font-body text-[11px] text-[#5A6578]">All-India Motor Transport &amp; Police</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#DC2626] text-xl">shield_person</span>
          </div>

          {/* Language Switcher Row */}
          <div
            onClick={() => setLangModalOpen(true)}
            className="p-3.5 flex items-center justify-between gap-2 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">translate</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-display text-xs font-bold text-[#111c29]">App Language (भाषा)</span>
                <span className="font-body text-[11px] text-[#0F6E56] font-semibold">Change 5 Regional Dialects</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-lg">chevron_right</span>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={() => router.push('/landing')}
          className="w-full min-h-[48px] bg-white text-[#DC2626] rounded-xl font-display text-xs font-bold flex items-center justify-center gap-2 shadow-xs border border-red-200 active:bg-red-50 transition-all"
          type="button"
        >
          <span className="material-symbols-outlined text-base">logout</span>
          <span>Sign Out (लॉग आउट)</span>
        </button>

        {/* Payout Toast */}
        {showPayoutToast && (
          <div className="fixed bottom-20 left-4 right-4 z-50 bg-[#0F172A] text-white p-3.5 rounded-xl shadow-2xl flex items-center justify-between animate-fade-up border border-slate-700 max-w-md mx-auto">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-emerald-400 text-2xl">verified</span>
              <div>
                <span className="font-display text-xs font-bold block">Instant Payout Transferred!</span>
                <span className="text-[11px] text-slate-300">₹42,800 sent to gurpreet@okhdfcbank</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-emerald-400 text-xl">done_all</span>
          </div>
        )}
      </main>

      <DriverBottomNav />
    </div>
  );
}
