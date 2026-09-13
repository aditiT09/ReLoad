'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import DriverBottomNav from '@/components/driver/DriverBottomNav';

export default function DriverTrustScorePage() {
  const router = useRouter();
  const { setLangModalOpen, getLangObj } = useLanguage();
  const currentLang = getLangObj();
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('tyre_puncture');
  const [disputeNote, setDisputeNote] = useState('');
  const [isDisputeSent, setIsDisputeSent] = useState(false);

  const handleSubmitDispute = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisputeSent(true);
    setTimeout(() => {
      setIsDisputeSent(false);
      setIsDisputeOpen(false);
    }, 1500);
  };

  return (
    <div className="bg-[#F8F9FA] font-body text-[#111c29] flex flex-col min-h-screen antialiased">
      {/* Top Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 pt-safe bg-[#0F6E56]/95 backdrop-blur-xl shadow-sm text-white">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/driver/forecast" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-white text-2xl">arrow_back</span>
              <div>
                <span className="font-display text-base text-white font-extrabold tracking-tight">Trust Score</span>
                <p className="text-[10px] text-emerald-100">Carrier Verification &amp; Safety Tier</p>
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
              <Link href="/driver/trust-score" className="px-3 py-1.5 rounded-lg bg-white/20 text-white font-bold">
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
              <span className="material-symbols-outlined text-sm text-amber-300" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              <span>98 / 100</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative w-full max-w-7xl mx-auto pt-20 pb-24 px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Responsive Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Driver Profile, Circular Meter, Benefits */}
          <div className="lg:col-span-6 space-y-4">
            {/* Driver Profile Summary */}
            <div className="relative overflow-hidden bg-white rounded-2xl p-4 shadow-sm border border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                className="w-14 h-14 rounded-full object-cover shadow-sm border border-slate-200"
                alt="Rajesh Kumar Verma"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#0F6E56] flex items-center justify-center text-white text-[10px] ring-2 ring-white">
                <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check
                </span>
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-display text-base font-extrabold text-[#111c29] truncate">
                  Rajesh Kumar Verma
                </h2>
                <span className="bg-[#E6F4F1] text-[#0F6E56] font-display text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                  Pro Carrier
                </span>
              </div>
              <p className="font-body text-xs text-[#5A6578] truncate">
                Fleet ID: RL-MH-04-9921 • Heavy Multi-Axle
              </p>
            </div>
          </div>
        </div>

        {/* Circular Trust Score Meter Card */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0] flex flex-col items-center text-center">
          <div className="relative w-40 h-40 my-1 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              <circle
                className="text-slate-100"
                cx="80"
                cy="80"
                fill="transparent"
                r="68"
                stroke="currentColor"
                strokeWidth="12"
              ></circle>
              <circle
                className="transition-all duration-1000 ease-out"
                cx="80"
                cy="80"
                fill="transparent"
                r="68"
                stroke="#0F6E56"
                strokeDasharray="427.26"
                strokeDashoffset="8.54"
                strokeLinecap="round"
                strokeWidth="12"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
              <span className="font-display text-4xl font-extrabold text-[#0F6E56] tracking-tight">
                98
              </span>
              <span className="font-display text-[11px] text-[#5A6578] uppercase font-bold tracking-wider">
                Out of 100
              </span>
              <div className="mt-1 flex items-center gap-0.5 text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                ))}
              </div>
            </div>
          </div>

          <h3 className="font-display text-sm font-extrabold text-[#111c29] mt-1">
            Excellent Shipper Trust Rating
          </h3>
          <p className="font-display text-xs text-[#0F6E56] font-bold">शानदार विश्वास स्कोर</p>

          {/* Score Breakdown Pills */}
          <div className="grid grid-cols-3 gap-2 w-full mt-3 bg-[#F8F9FA] rounded-xl p-2.5 border border-slate-100">
            <div className="flex flex-col items-center">
              <span className="font-display text-[11px] text-[#5A6578]">On-Time Rate</span>
              <span className="font-display text-sm font-extrabold text-[#0F6E56]">99.4%</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-display text-[11px] text-[#5A6578]">Cold SLA</span>
              <span className="font-display text-sm font-extrabold text-[#2563EB]">100%</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-display text-[11px] text-[#5A6578]">Safe Miles</span>
              <span className="font-display text-sm font-extrabold text-[#111c29]">148k</span>
            </div>
          </div>
        </div>

        {/* Benefits Unlocked Banner */}
        <div className="bg-[#0F6E56] text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-start gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl text-emerald-200" style={{ fontVariationSettings: "'FILL' 1" }}>
                workspace_premium
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-display text-[11px] uppercase tracking-wider text-emerald-200 font-bold">
                  Priority Gold Status
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
              </div>
              <p className="font-display text-xs text-white font-bold mt-0.5">
                Eligible for Top 5% High-Paying Pharma &amp; Cold-Chain Loads
              </p>
              <p className="font-body text-[11px] text-emerald-100 mt-1">
                ₹18,500+ potential weekly bonus unlocked with instant UPI settlement.
              </p>
            </div>
          </div>
        </div>
          </div>

          {/* Right Column: Active Safety & Trip Flags, Verified Documents, and Actions */}
          <div className="lg:col-span-6 space-y-4">
            {/* Active Safety & Trip Flags */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E2E8F0] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#D97706] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                report_problem
              </span>
              <h4 className="font-display text-xs font-bold text-[#111c29]">Active Safety &amp; Trip Flags</h4>
            </div>
            <span className="bg-[#FEF3C7] text-[#D97706] font-display text-[10px] font-bold px-2 py-0.5 rounded-full">
              1 Review Pending
            </span>
          </div>

          <div className="bg-[#FEF2F2] rounded-xl p-3 space-y-2 border border-red-200">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#DC2626] text-base shrink-0 mt-0.5">warning</span>
              <div className="flex-1 min-w-0">
                <p className="font-display text-xs text-[#111c29] font-bold">
                  Flagged Trip RL-8821: Panvel Tollway Corridor
                </p>
                <p className="font-body text-[11px] text-[#5A6578] mt-0.5">
                  Unscheduled 45-min stop detected near Panvel toll on last trip. Explained as tyre puncture check.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 text-[10px] font-display">
              <span className="text-[#0F6E56] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">fact_check</span>
                Receipt uploaded
              </span>
              <span className="text-[#D97706] font-bold uppercase tracking-wider">
                Under Audit
              </span>
            </div>
          </div>
        </div>

        {/* Verified Document Checklist */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E2E8F0] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0F6E56] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                task_alt
              </span>
              <h4 className="font-display text-xs font-bold text-[#111c29]">Verified Documents Checklist</h4>
            </div>
            <span className="font-display text-xs text-[#0F6E56] font-bold">4 of 4 Valid</span>
          </div>

          <div className="space-y-2">
            {[
              { title: 'Commercial Driver License', exp: 'Active to 2029 (MH-0420140029)', icon: 'badge' },
              { title: 'Vehicle RC & Fitness Certificate', exp: 'Form 38 Valid (Exp: Nov 2026)', icon: 'local_shipping' },
              { title: 'All India Goods Permit', exp: 'National Permit 28 States Authorized', icon: 'map' },
              { title: 'FASTag Fleet Wallet Linked', exp: 'Auto-deduct active (₹4,850 Balance)', icon: 'contactless' },
            ].map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8F9FA] border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] text-[#0F6E56] flex items-center justify-center">
                    <span className="material-symbols-outlined text-base">{doc.icon}</span>
                  </div>
                  <div>
                    <span className="font-display text-xs font-bold text-[#111c29] block">{doc.title}</span>
                    <span className="font-body text-[10px] text-[#0F6E56] font-semibold">{doc.exp}</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[#0F6E56] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dispute Action Button */}
        <div className="pt-1 flex flex-col gap-2">
          <button
            onClick={() => setIsDisputeOpen(true)}
            className="w-full min-h-[48px] bg-white hover:bg-slate-50 text-[#0F6E56] font-display text-xs font-bold rounded-xl py-3 px-4 border border-[#0F6E56] shadow-xs flex items-center justify-center gap-2 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">rate_review</span>
            <span>Request Score Review / Submit Dispute (समीक्षा अनुरोध)</span>
          </button>

          <button
            onClick={() => router.push('/driver/profile')}
            className="w-full h-14 min-h-[56px] bg-[#0F6E56] hover:bg-[#0B5240] text-white font-display text-sm font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
            type="button"
          >
            <span>View Earnings &amp; Wallet (कमाई देखें)</span>
            <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
          </button>
        </div>
          </div>
        </div>

        {/* Dispute Modal */}
        {isDisputeOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl space-y-4 animate-fade-up">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div>
                  <h3 className="font-display text-sm font-bold text-[#111c29]">Submit Dispute Evidence</h3>
                  <p className="text-[11px] text-[#5A6578]">स्कोर समीक्षा व स्पष्टीकरण</p>
                </div>
                <button
                  onClick={() => setIsDisputeOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
                >
                  ✕
                </button>
              </div>

              {isDisputeSent ? (
                <div className="p-4 bg-[#E6F4F1] text-[#0F6E56] rounded-xl text-center font-display text-xs font-bold space-y-1">
                  <span className="material-symbols-outlined text-2xl">check_circle</span>
                  <p>Dispute submitted! Dispatch team will audit within 2 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitDispute} className="space-y-3">
                  <div>
                    <label className="font-display text-xs font-bold text-[#111c29] block mb-1">
                      Reason for Delay / Stop
                    </label>
                    <select
                      value={disputeReason}
                      onChange={(e) => setDisputeReason(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#0F6E56]"
                    >
                      <option value="tyre_puncture">Tyre Puncture / Mechanical Repair</option>
                      <option value="toll_congestion">Excessive Toll Plaza Jam (&gt;30 mins)</option>
                      <option value="police_checking">State Border Transport Inspection</option>
                      <option value="weather">Severe Weather / Road Blockage</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-display text-xs font-bold text-[#111c29] block mb-1">
                      Additional Notes / Garage Receipt
                    </label>
                    <textarea
                      rows={2}
                      value={disputeNote}
                      onChange={(e) => setDisputeNote(e.target.value)}
                      placeholder="Enter repair receipt number or explanation..."
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-[#0F6E56]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#0F6E56] text-white rounded-xl font-display text-xs font-bold shadow-md"
                  >
                    Submit for Compliance Audit
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      <DriverBottomNav />
    </div>
  );
}
