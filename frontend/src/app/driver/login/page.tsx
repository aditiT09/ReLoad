'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DriverLoginPage() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState('hi');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleVoice = () => {
    setIsPlayingVoice(!isPlayingVoice);
    if (!isPlayingVoice && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        'कृपया अपना फिटनेस और बीमा पेपर का फोटो साफ़ खींच कर अपलोड करें।'
      );
      utterance.lang = 'hi-IN';
      utterance.onend = () => setIsPlayingVoice(false);
      window.speechSynthesis.speak(utterance);
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setIsVerified(true);
    }
  };

  const languages = [
    { id: 'en', label: 'English' },
    { id: 'hi', label: 'हिन्दी' },
    { id: 'mr', label: 'मराठी' },
    { id: 'gu', label: 'ગુજરાતી' },
    { id: 'pa', label: 'ਪੰਜਾਬੀ' },
  ];

  return (
    <div className="bg-[#F8F9FA] font-body text-[#111c29] antialiased min-h-screen selection:bg-[#E6F4F1] selection:text-[#0F6E56] flex flex-col justify-center items-center p-3 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-[#E2E8F0] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Hero Graphic Section (Desktop Only) */}
        <div className="hidden lg:flex lg:col-span-6 bg-[#0F172A] p-8 lg:p-10 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-20 -mt-20 pointer-events-none blur-xl"></div>

          <div className="relative z-10 space-y-4">
            <Link href="/landing" className="inline-flex items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-[#0F6E56] flex items-center justify-center shadow-md">
                <svg className="w-7 h-7 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M19.5 8h-2.5V4H3C1.9 4 1 4.9 1 6v10c0 1.1.9 2 2 2h1.1c.4 1.7 2 3 3.9 3s3.5-1.3 3.9-3h4.2c.4 1.7 2 3 3.9 3s3.5-1.3 3.9-3H23v-5l-3.5-5zm-11.5 10c-.8 0-1.5-.7-1.5-1.5S7.2 15 8 15s1.5.7 1.5 1.5-.7 1.5-1.5 1.5zm10 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5zM6 10l3.5-4 3.5 4H10v3H8v-3H6zm11.5 2H14V9.5h3.5l2 2.5z"></path>
                </svg>
              </div>
              <div>
                <span className="font-display text-2xl text-[#0F6E56] tracking-tight font-black flex items-center gap-1">
                  ReLoad
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </span>
                <span className="block font-display text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  Driver Partner Hub • साथी
                </span>
              </div>
            </Link>

            <div className="pt-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-display">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                <span>Tier-1 Sarathi Network</span>
              </div>
              <h2 className="text-2xl font-black font-display text-white mt-3 leading-tight">
                Zero Empty Return Loads. Guaranteed Daily Freight.
              </h2>
              <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                Join India's highest paying verified carrier network on NH-48, NH-44, and the Golden Quadrilateral.
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-3 pt-6">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200">
              <span className="material-symbols-outlined text-emerald-400 text-base">payments</span>
              <span>Instant UPI Advance &amp; Delivery Settlements</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200">
              <span className="material-symbols-outlined text-emerald-400 text-base">health_and_safety</span>
              <span>Complimentary ₹10 Lakh Driver Accidental Cover</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-200">
              <span className="material-symbols-outlined text-emerald-400 text-base">ev_station</span>
              <span>Automated FASTag &amp; Diesel Advance Integration</span>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>24/7 Driver Sarathi Line: 1800-RELOAD</span>
              <span>Ministry of Road Transport Verified</span>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="lg:col-span-6 p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
          <main className="flex flex-col relative w-full">
            <div className="flex flex-col w-full text-[#111c29]">
              {/* Quick Support Touch Target */}
              <a
                aria-label="Call Dispatch Help"
                className="min-w-[48px] min-h-[48px] px-3 bg-[#F1F5F9] rounded-full flex items-center justify-center gap-1 text-[#64748B] active:scale-95 transition-transform border border-slate-200"
                href="tel:1800123456"
              >
                <span className="material-symbols-outlined text-[22px]">support_agent</span>
                <span className="font-display text-xs font-bold">मदद</span>
              </a>
            </div>

            {/* 5-Language Selector Bar */}
            <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLang(lang.id)}
                  className={`min-h-[44px] px-4 rounded-full font-display text-xs font-bold flex items-center justify-center whitespace-nowrap transition-all ${
                    selectedLang === lang.id
                      ? 'bg-[#0F6E56] text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-[#111c29] hover:bg-slate-50'
                  }`}
                  type="button"
                >
                  {lang.label}
                </button>
              ))}
            </div>

          {/* Audio Guidance Hero Banner */}
          <div className="bg-[#E6F4F1] border border-[#0F6E56]/20 rounded-2xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-3 z-10">
              <button
                onClick={toggleVoice}
                aria-label="Listen Voice Assistance"
                className={`min-w-[50px] min-h-[50px] rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform ${
                  isPlayingVoice ? 'bg-[#D97706] text-white' : 'bg-[#0F6E56] text-white'
                }`}
              >
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isPlayingVoice ? 'stop_circle' : 'volume_up'}
                </span>
              </button>
              <div>
                <h2 className="font-display text-sm font-bold text-[#0B5240] leading-tight">
                  बोलकर सुनें (Voice Help)
                </h2>
                <p className="font-body text-xs text-[#5A6578] font-medium">
                  {isPlayingVoice ? 'Audio running...' : 'कागज़ात अपलोड करने की सरल सहायता'}
                </p>
              </div>
            </div>
          </div>

          {/* Verified Mobile & Driver State Badge */}
          <div className="bg-white rounded-xl p-4 shadow-xs border border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[#E6F4F1] text-[#0F6E56] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-2xl">verified_user</span>
              </div>
              <div>
                <span className="font-display text-[11px] text-[#64748B] uppercase font-bold tracking-wider">
                  ड्राइवर मोबाइल (Verified Driver)
                </span>
                <div className="font-display text-sm font-bold text-[#111c29] tracking-wide flex items-center gap-1.5">
                  +91 98230 ••••42
                  <span className="material-symbols-outlined text-[#0F6E56] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
              </div>
            </div>
            <button className="min-h-[40px] px-3 font-display text-xs text-[#0051d5] font-bold hover:underline flex items-center" type="button">
              बदलें
            </button>
          </div>

          {/* Govt Integration Trust Seal */}
          <div className="bg-[#E2E8F0] rounded-xl px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0F6E56] text-xl">verified</span>
              <span className="font-display text-xs font-bold text-[#111c29]">
                ULIP &amp; VAHAN Govt. Portal Linked
              </span>
            </div>
            <span className="font-display text-[11px] bg-white text-[#0F6E56] px-2.5 py-0.5 rounded-full font-bold shadow-xs">
              Instant E-KYC
            </span>
          </div>

          {/* KYC Documents Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-sm font-extrabold text-[#111c29]">
                  दस्तावेज़ सूची (Required KYC)
                </h3>
                <p className="font-body text-xs text-[#5A6578]">
                  {isVerified ? '3 में से 3 कागज़ात सत्यापित हैं' : '3 में से 2 कागज़ात सत्यापित हैं'}
                </p>
              </div>
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-display text-xs font-bold ${
                  isVerified
                    ? 'bg-[#E6F4F1] text-[#0F6E56]'
                    : 'bg-[#FEF3C7] text-[#D97706]'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {isVerified ? 'check_circle' : 'pending_actions'}
                </span>
                <span>{isVerified ? 'All Complete' : '1 बाक़ी (Pending)'}</span>
              </div>
            </div>

            {/* Document Card 1: Driving License (Verified) */}
            <div className="bg-white rounded-xl p-3.5 shadow-xs border border-[#E2E8F0] flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#E6F4F1] text-[#0F6E56] flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">badge</span>
                  </div>
                  <div>
                    <h4 className="font-display text-xs font-bold text-[#111c29]">ड्राइविंग लाइसेंस (DL)</h4>
                    <span className="font-body text-[11px] text-[#5A6578]">DL No: MH-14-2018-0098421</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-[#E6F4F1] text-[#0F6E56] px-2.5 py-1 rounded-full font-display text-[11px] font-bold">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <span>Verified • मान्य</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#F8F9FA] rounded-lg p-2 mt-1 border border-slate-100">
                <img
                  className="w-16 h-11 rounded object-cover shadow-xs border border-slate-200"
                  alt="Driving License Thumbnail"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL7656VOQnKeWVgxlpgFzBdf2E70v8JK4nEJajxgbZTqeLiKqLrvsHpWfbudAKDNxI3kA9I4bH0QQ9ZVkPgr4Wz5q0FzQ0jhr_XXC8kGtBpWu8uUFJvmiurIJxoyi05sOXiyypac-1eO49lgEJoSNYwxG630KxwGXclMDEBvQjfxlg6Or20JwGL2cl_zGgI1-6oLh_dZ8kc62SHYkjwGHjGAVDi6AKcAeAcIPhRkF7ICWaxeD6sYEWBw"
                />
                <div className="flex flex-col text-[11px]">
                  <span className="font-display font-bold text-[#111c29]">Heavy Goods Vehicle (HGV)</span>
                  <span className="text-[#5A6578]">Valid till: 14 Oct 2028</span>
                  <span className="text-[#0F6E56] flex items-center gap-1 font-semibold mt-0.5">
                    <span className="material-symbols-outlined text-[13px]">lock</span> Sarathi Portal Authenticated
                  </span>
                </div>
              </div>
            </div>

            {/* Document Card 2: Vehicle RC Book (Verified) */}
            <div className="bg-white rounded-xl p-3.5 shadow-xs border border-[#E2E8F0] flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-[#E6F4F1] text-[#0F6E56] flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">local_shipping</span>
                  </div>
                  <div>
                    <h4 className="font-display text-xs font-bold text-[#111c29]">गाड़ी आर.सी. (RC Book)</h4>
                    <span className="font-body text-[11px] text-[#5A6578]">MH-12-RN-7890 • Tata Signa 4825.TK</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-[#E6F4F1] text-[#0F6E56] px-2.5 py-1 rounded-full font-display text-[11px] font-bold">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <span>Verified • मान्य</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#F8F9FA] rounded-lg p-2 mt-1 border border-slate-100">
                <img
                  className="w-16 h-11 rounded object-cover shadow-xs border border-slate-200"
                  alt="RC Book Thumbnail"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZ7tx7wF5MkKDyCn6LK8FMyv7wxQxCDu2K-nm1UEQEEcZjgzUt-CUnLXJ-BNRWB8C17tywIV6AP4lhyxK1ckEbk-YZuiro3R1QBoQBibLxQXBA15pc-CBY0B9LrvIbCKa9eOls4Qupl-BQJwe0Vu7byWDQ5euyCuqKtHvLkOT21fNtbVoxP0QfblE2UwFkGCp4vthg5_qgOOcBWvnXFe4E4-W3KYkahflsl1mNcCJ15s2r3mZC6uzLhg"
                />
                <div className="flex flex-col text-[11px]">
                  <span className="font-display font-bold text-[#111c29]">32 Wheeler • Closed Container</span>
                  <span className="text-[#5A6578]">Pollution PUC: Active (PUC-8823)</span>
                  <span className="text-[#0F6E56] flex items-center gap-1 font-semibold mt-0.5">
                    <span className="material-symbols-outlined text-[13px]">check</span> VAHAN Matched Chassis No.
                  </span>
                </div>
              </div>
            </div>

            {/* Document Card 3: Commercial Fitness & Insurance */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-[#E2E8F0] flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isVerified ? 'bg-[#E6F4F1] text-[#0F6E56]' : 'bg-[#FEF3C7] text-[#D97706]'
                  }`}>
                    <span className="material-symbols-outlined text-xl">policy</span>
                  </div>
                  <div>
                    <h4 className="font-display text-xs font-bold text-[#111c29]">बीमा व फिटनेस (Insurance &amp; Fitness)</h4>
                    <span className="font-body text-[11px] text-[#5A6578]">Commercial Goods Policy Paper</span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full font-display text-[11px] font-bold ${
                  isVerified ? 'bg-[#E6F4F1] text-[#0F6E56]' : 'bg-[#FEF3C7] text-[#D97706] animate-pulse'
                }`}>
                  <span className="material-symbols-outlined text-sm">
                    {isVerified ? 'check_circle' : 'error'}
                  </span>
                  <span>{isVerified ? 'Uploaded & Verified' : 'अपलोड बाक़ी (Action Required)'}</span>
                </div>
              </div>

              {/* Interactive Camera Snap Box */}
              <div className="relative bg-[#F8F9FA] border border-dashed border-slate-300 rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-center">
                {uploadedImage ? (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border border-emerald-500">
                    <img src={uploadedImage} alt="Uploaded Document" className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      Uploaded ✓
                    </span>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined text-2xl">photo_camera</span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-display text-xs font-bold text-[#111c29]">
                    कागज़ात का साफ़ फ़ोटो खींचें
                  </span>
                  <span className="font-body text-[11px] text-[#5A6578]">
                    Tap Camera • Clear photo in bright sunlight
                  </span>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-[44px] w-full max-w-xs bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg font-display text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform mt-1"
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">add_a_photo</span>
                  <span>{uploadedImage ? 'फ़ोटो बदलें (Change Photo)' : 'फ़ोटो लें (Snap Photo)'}</span>
                </button>
                <input
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  type="file"
                  onChange={handleFileUpload}
                />
              </div>

              <div className="flex items-center gap-2 text-[#64748B] font-display text-[11px]">
                <span className="material-symbols-outlined text-base">lightbulb</span>
                <span>चारों कोने साफ़ दिखने चाहिए (Ensure all 4 corners are visible)</span>
              </div>
            </div>
          </div>

          {/* Driver Safety & Trust Info Footnote */}
          <div className="flex items-center justify-center gap-2 text-[#5A6578] text-center px-4 pt-1">
            <span className="material-symbols-outlined text-[#0F6E56] text-lg">encrypted</span>
            <span className="font-display text-[11px]">सुरक्षित डेटा • 256-bit Ministry Verified Transport Encryption</span>
          </div>

          {/* Bottom Sticky CTA Button */}
          <div className="pt-2">
            <button
              onClick={() => router.push('/driver/home')}
              className="w-full min-h-[56px] h-14 bg-[#0F6E56] hover:bg-[#0B5240] text-white rounded-xl font-display text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg active:scale-[0.99] transition-all"
              type="button"
            >
              <span>Save &amp; Continue • आगे बढ़ें</span>
              <span className="material-symbols-outlined text-2xl">arrow_forward</span>
            </button>
            <p className="font-display text-[11px] text-center text-[#64748B] mt-2 font-semibold">
              अगला चरण: ट्रिप लोड असाइनमेंट (Next: Ready to haul freight)
            </p>
          </div>
        </main>
        </div>
      </div>
    </div>
  );
}
