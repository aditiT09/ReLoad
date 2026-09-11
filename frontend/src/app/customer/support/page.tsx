"use client";

import React, { useState } from "react";
import Link from "next/link";
import CustomerBottomNav from "@/components/customer/CustomerBottomNav";
import { useLanguage } from "@/context/LanguageContext";

export default function CustomerSupportPage() {
  const { currentLanguage, setLangModalOpen } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("damage");
  const [description, setDescription] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const categories = [
    { id: "damage", icon: "inventory_2", labelEn: "Damage", labelHi: "टूटा सामान", color: "bg-red-50 text-red-600" },
    { id: "delay", icon: "hourglass_top", labelEn: "Delay", labelHi: "देरी हुई", color: "bg-amber-50 text-amber-600" },
    { id: "payment", icon: "account_balance_wallet", labelEn: "Payment", labelHi: "भुगतान समस्या", color: "bg-emerald-50 text-brand" },
    { id: "driver", icon: "airline_seat_recline_normal", labelEn: "Driver", labelHi: "ड्राइवर व्यवहार", color: "bg-slate-100 text-slate-700" },
    { id: "detour", icon: "alt_route", labelEn: "Detour", labelHi: "रास्ता बदला", color: "bg-blue-50 text-blue-600" },
    { id: "other", icon: "help_center", labelEn: "Other", labelHi: "अन्य समस्या", color: "bg-slate-100 text-slate-600" },
  ];

  const handleVoiceDictation = () => {
    if (!isListening) {
      setIsListening(true);
      setTimeout(() => {
        setDescription("ड्राइवर ने तय रूट से 15 किमी दूर गाड़ी रोक दी है, तापमान 6°C से ऊपर जा रहा है। (Driver stopped 15km off scheduled route; temp rising).");
        setIsListening(false);
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] antialiased selection:bg-brand-tint selection:text-brand flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl text-slate-900 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Link href="/customer/home" className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors mr-1">
              <span className="material-symbols-outlined text-sm text-slate-700">arrow_back</span>
            </Link>
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[20px]">support_agent</span>
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">ReLoad</span>
            <span className="text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">24/7 Operations Help &amp; Support</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setLangModalOpen(true)}
              className="flex items-center space-x-1 bg-slate-100 text-xs font-semibold py-1.5 px-3 rounded-full border border-slate-200"
            >
              <span className="material-symbols-outlined text-[14px] text-brand">language</span>
              <span className="uppercase">{currentLanguage}</span>
            </button>
            <Link
              href="/customer/profile"
              className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold"
            >
              <span className="material-symbols-outlined text-[16px]">person</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24 space-y-4">
          {/* Active Trip Context Bar */}
          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-brand">
                <span className="material-symbols-outlined text-[24px]">local_shipping</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-slate-900 truncate">Trip #RL-9042</span>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                    <span className="material-symbols-outlined text-[12px]">ac_unit</span>
                    Reefer
                  </span>
                </div>
                <span className="text-xs text-slate-500 truncate">Gurpreet Singh • Tata Signa</span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[12px]">check_circle</span>
              En Route
            </span>
          </div>

          {/* Priority Response Promise Strip */}
          <div className="bg-amber-50 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 border border-amber-200 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-amber-200/60 flex items-center justify-center shrink-0 text-amber-800">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </div>
            <p className="text-xs text-slate-800 flex-1">
              <strong className="font-bold text-slate-900">15-Minute Resolution Guarantee</strong>
              <span className="text-slate-600 block text-[11px] leading-tight">ReLoad Ops 24/7 Priority Support Desk</span>
            </p>
          </div>

          {/* Category Picker Section */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">Select Issue • समस्या चुनें</h2>
              <span className="text-[11px] text-red-600 font-bold">* Required</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    type="button"
                    className={`min-h-[64px] p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all active:scale-[0.98] relative overflow-hidden ${
                      isSelected
                        ? "bg-emerald-50/60 border-brand shadow-sm"
                        : "bg-white border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${cat.color}`}>
                      <span className="material-symbols-outlined text-[22px]">{cat.icon}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-900 leading-tight">{cat.labelEn}</span>
                      <span className="text-[11px] text-slate-500 leading-tight">{cat.labelHi}</span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-brand text-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-[12px]">done</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description & Audio Dictation */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900">Describe Issue • विवरण लिखें</label>
              <span className="text-[11px] text-brand font-semibold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">translate</span>
                Bilingual input
              </span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 space-y-2">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-900 placeholder:text-slate-400 resize-none outline-none"
                placeholder="Describe briefly or speak (बोलकर बताएं)..."
                rows={3}
              />
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className={`inline-block w-2 h-2 rounded-full ${isListening ? "bg-red-500 animate-ping" : "bg-emerald-500"}`}></span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {isListening ? "Listening (Hindi/English)..." : "Ready for typing or speech"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleVoiceDictation}
                  className={`h-9 px-3 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-all ${
                    isListening
                      ? "bg-red-600 text-white animate-pulse"
                      : "bg-emerald-50 text-brand hover:bg-brand hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isListening ? "record_voice_over" : "mic"}
                  </span>
                  <span>{isListening ? "Listening..." : "बोलें (Speak)"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Photo / Bill Evidence */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Attach Photo / प्रमाण (Optional)</span>
              <span className="text-[11px] text-slate-500">Max 3 photos</span>
            </div>

            {!photoUploaded ? (
              <button
                type="button"
                onClick={() => setPhotoUploaded(true)}
                className="w-full min-h-[84px] rounded-xl bg-white border border-dashed border-slate-300 p-3 shadow-sm flex items-center justify-center gap-3 hover:border-brand transition-colors text-left"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-brand shrink-0">
                  <span className="material-symbols-outlined text-[26px]">photo_camera</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Attach Photo / बिल या सामान की फोटो लगाएं
                  </span>
                  <span className="text-[11px] text-slate-500">Capture goods, odometer, or weighbridge slip</span>
                </div>
              </button>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <div className="relative rounded-lg overflow-hidden h-20 bg-slate-800 shadow-sm border border-slate-200">
                  <img
                    alt="Proof photo"
                    className="w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=300&q=80"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoUploaded(false)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-900/80 text-white flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[12px]">close</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Safety Dispatch Checklist Info Card */}
          <div className="rounded-xl bg-slate-100 p-3 flex items-start gap-2.5 border border-slate-200">
            <span className="material-symbols-outlined text-brand text-[20px] shrink-0 mt-0.5">verified_user</span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900">Immediate Driver Call-Out</span>
              <span className="text-[11px] text-slate-600 leading-tight mt-0.5">
                Filing this alert flags your trip to the central fleet monitoring hub. Our local highway liaison will contact driver Gurpreet Singh immediately.
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full min-h-[52px] rounded-xl bg-brand text-white hover:bg-brand-dark active:scale-[0.98] transition-all font-bold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">send</span>
              <span>Submit Issue • समस्या दर्ज करें</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 py-1">
              <span className="material-symbols-outlined text-[16px] text-brand">headset_mic</span>
              <span className="text-xs text-slate-500">Prefer calling?</span>
              <a className="text-xs text-brand font-bold hover:underline" href="tel:1800-419-0909">
                Toll-Free 1800-419-0909
              </a>
            </div>
          </div>
        </main>

        {/* Confirmation Toast State */}
        {toastVisible && (
          <div className="fixed inset-x-4 bottom-24 z-50 transition-all duration-300">
            <div className="bg-slate-900 text-white rounded-xl p-3.5 shadow-2xl flex items-center gap-3 border border-slate-700">
              <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-[20px]">check</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-xs font-bold">Ticket #ISS-8402 Created</span>
                <span className="text-[11px] text-slate-300 leading-tight">
                  Ops team is reviewing. Callback within 15 mins.
                </span>
              </div>
            </div>
          </div>
        )}

        <CustomerBottomNav activeTab="support" />
      </div>
    );
  }
