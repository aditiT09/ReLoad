"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomerBottomNav from "@/components/customer/CustomerBottomNav";
import { useLanguage } from "@/context/LanguageContext";

export default function CustomerHandoffPage() {
  const router = useRouter();
  const { currentLanguage, setLangModalOpen } = useLanguage();
  const [mode, setMode] = useState<"pickup" | "dropoff">("pickup");
  const [sealIntact, setSealIntact] = useState<boolean>(true);
  const [authMethod, setAuthMethod] = useState<"pin" | "sign">("pin");
  const [pin, setPin] = useState(["7", "4", "9", ""]);
  const [clock, setClock] = useState("2024-10-24 14:38:12 IST");
  const [flashlight, setFlashlight] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      setClock(
        `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(
          now.getHours()
        )}:${pad(now.getMinutes())}:${pad(now.getSeconds())} IST`
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePinChange = (idx: number, val: string) => {
    if (val.length > 1) return;
    const newPin = [...pin];
    newPin[idx] = val;
    setPin(newPin);
  };

  const handleConfirmHandoff = () => {
    setIsSuccess(true);
    setTimeout(() => {
      router.push("/customer/receipt");
    }, 1200);
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
              <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">ReLoad</span>
            <span className="text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">Digital Cargo Handoff</span>
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
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Mode, Camera Viewfinder & Geofence */}
          <div className="lg:col-span-6 space-y-4">
          {/* Mode Switcher */}
          <div className="bg-slate-200 p-1 rounded-xl flex items-center shadow-inner">
            <button
              onClick={() => setMode("pickup")}
              className={`flex-1 min-h-[46px] rounded-lg py-1.5 px-3 flex flex-col items-center justify-center transition-all ${
                mode === "pickup"
                  ? "bg-brand text-white shadow-md font-bold"
                  : "bg-transparent text-slate-600 hover:text-slate-900 font-medium"
              }`}
            >
              <span className="text-xs tracking-tight flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">outbox</span>
                Pickup Handoff
              </span>
              <span className="text-[10px] opacity-90">माल उठाव</span>
            </button>

            <button
              onClick={() => setMode("dropoff")}
              className={`flex-1 min-h-[46px] rounded-lg py-1.5 px-3 flex flex-col items-center justify-center transition-all ${
                mode === "dropoff"
                  ? "bg-brand text-white shadow-md font-bold"
                  : "bg-transparent text-slate-600 hover:text-slate-900 font-medium"
              }`}
            >
              <span className="text-xs tracking-tight flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">move_to_inbox</span>
                Drop-off Delivery
              </span>
              <span className="text-[10px] opacity-90">सामान सुपुर्दगी</span>
            </button>
          </div>

          {/* Consignment & Trip Header Metadata */}
          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base">WB-892410</span>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px] text-emerald-600">verified</span>
                  Verified Dock
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {mode === "pickup"
                  ? "Tata 407 LPT • 32 Crates (Pharma Consignment)"
                  : "Apollo Logistics Hub • Receiving Bay 12"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <span className="material-symbols-outlined text-[22px]">ac_unit</span>
            </div>
          </div>

          {/* Camera Live Viewfinder */}
          <div className="relative w-full rounded-xl overflow-hidden shadow-md bg-slate-900 aspect-[4/3] flex flex-col justify-between p-3">
            <img
              alt="Dock Cam Feed"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80"
            />

            {/* Crosshair Overlay */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-44 h-32 relative">
                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-white"></div>
                <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-white"></div>
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-white"></div>
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-white"></div>
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/30"></div>
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] bg-white/30"></div>
              </div>
            </div>

            {/* Live HUD Pill */}
            <div className="relative z-10 flex items-center justify-between w-full">
              <div className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-white text-[10px] font-bold tracking-wide uppercase">
                  DOCK CAM 04 • LIVE
                </span>
              </div>
              <button
                onClick={() => setFlashlight(!flashlight)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  flashlight
                    ? "bg-amber-400 text-slate-900"
                    : "bg-white/80 backdrop-blur-md text-slate-900"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {flashlight ? "flash_on" : "flash_off"}
                </span>
              </button>
            </div>

            {/* Timestamp & Watermark */}
            <div className="relative z-10 bg-slate-900/85 backdrop-blur-md text-white p-2.5 rounded-lg flex items-center justify-between text-xs">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-emerald-400">BHIWANDI HUB • BAY 09</span>
                <span className="text-[11px] text-slate-200 tracking-wider">{clock}</span>
              </div>
              <div className="flex items-center gap-1 bg-brand-dark/90 px-2 py-1 rounded text-[10px] font-semibold text-emerald-300">
                <span className="material-symbols-outlined text-[14px]">fingerprint</span>
                <span>GEO-TAMPER SAFE</span>
              </div>
            </div>
          </div>

          {/* Auto Geo-Pin GPS Verification Card */}
          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-slate-100 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-brand flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[20px]">location_on</span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h2 className="text-sm font-bold text-slate-900">
                      {mode === "pickup"
                        ? "Bhiwandi Warehouse Gate 4"
                        : "Navi Mumbai Distribution Park Gate 1"}
                    </h2>
                    <span className="material-symbols-outlined text-[16px] text-brand">verified</span>
                  </div>
                  <p className="text-xs text-slate-500">Lat 19.2968° N, Long 73.0642° E</p>
                  <span className="text-[11px] font-semibold text-emerald-700 mt-0.5 block">
                    Accuracy: within 4 meters (Verified GEOFENCE)
                  </span>
                </div>
              </div>
              <button className="h-8 px-2.5 rounded-lg bg-slate-100 text-slate-700 flex items-center gap-1 text-xs font-semibold shrink-0">
                <span className="material-symbols-outlined text-[16px] text-brand">my_location</span>
                <span>Re-scan</span>
              </button>
            </div>
          </div>
          </div>

          {/* Right Column: Seal Integrity & PIN/Signature Confirmation */}
          <div className="lg:col-span-6 space-y-4">
          {/* Cold-Chain Seal Integrity */}
          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-slate-100 flex flex-col space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-[20px]">lock_reset</span>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Cargo Physical Seal</span>
                  <span className="text-xs text-slate-500">कंटेनर सील स्थिति</span>
                </div>
              </div>
              <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">ac_unit</span>
                <span>Cold-Chain (-18°C)</span>
              </span>
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-100">
              <div className="flex flex-col pl-1">
                <span className="text-xs font-bold text-slate-800">Seal Tamper Status</span>
                <span className={`text-[11px] ${sealIntact ? "text-slate-500" : "text-red-600 font-bold"}`}>
                  {sealIntact
                    ? "Seal intact, matching Manifest #SL-4089"
                    : "WARNING: Broken or mismatched seal flagged!"}
                </span>
              </div>
              <div className="flex items-center bg-slate-200 p-0.5 rounded-lg gap-1">
                <button
                  onClick={() => setSealIntact(true)}
                  className={`h-8 px-3 rounded-md text-xs font-bold flex items-center gap-1 transition-all ${
                    sealIntact ? "bg-brand text-white shadow-sm" : "text-slate-600"
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">done</span> Yes
                </button>
                <button
                  onClick={() => setSealIntact(false)}
                  className={`h-8 px-3 rounded-md text-xs font-bold flex items-center gap-1 transition-all ${
                    !sealIntact ? "bg-red-600 text-white shadow-sm" : "text-slate-600"
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">close</span> No
                </button>
              </div>
            </div>
          </div>

          {/* Authentication Section: PIN / Signature */}
          <div className="bg-white rounded-xl p-3.5 shadow-sm border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-bold text-slate-900 block">
                  {mode === "pickup" ? "Shipper / Loader 4-Digit Code" : "Receiver 4-Digit Delivery Code"}
                </span>
                <span className="text-xs text-slate-500">
                  {mode === "pickup" ? "लोडर पुष्टिकरण कोड दर्ज करें" : "डिलीवरी पुष्टिकरण कोड दर्ज करें"}
                </span>
              </div>
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => setAuthMethod("pin")}
                  className={`h-8 px-2.5 rounded text-xs font-bold ${
                    authMethod === "pin" ? "bg-brand text-white shadow-sm" : "text-slate-600"
                  }`}
                >
                  PIN Code
                </button>
                <button
                  onClick={() => setAuthMethod("sign")}
                  className={`h-8 px-2.5 rounded text-xs font-bold ${
                    authMethod === "sign" ? "bg-brand text-white shadow-sm" : "text-slate-600"
                  }`}
                >
                  Sign / हस्ताक्षर
                </button>
              </div>
            </div>

            {authMethod === "pin" ? (
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2.5">
                  {pin.map((digit, idx) => (
                    <input
                      key={idx}
                      className="w-full h-12 text-center text-xl font-extrabold text-brand bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white"
                      maxLength={1}
                      type="tel"
                      value={digit}
                      onChange={(e) => handlePinChange(idx, e.target.value)}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-slate-500 text-xs pt-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-brand">sms</span>
                    Code sent to driver Sunil S.
                  </span>
                  <button className="text-brand font-bold hover:underline">Resend OTP</button>
                </div>
              </div>
            ) : (
              <div className="w-full h-28 bg-slate-50 border border-slate-200 rounded-xl p-2.5 relative flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Sign on screen with finger (उंगली से दस्तखत करें)</span>
                  <button className="text-red-500 font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[14px]">refresh</span> Clear
                  </button>
                </div>
                <svg className="w-full h-12 text-brand stroke-current fill-none stroke-[3] stroke-linecap-round stroke-linejoin-round" viewBox="0 0 300 80">
                  <path d="M 20,50 Q 50,15 90,45 T 160,35 Q 210,70 260,25" opacity="0.85"></path>
                </svg>
                <div className="w-full border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>Sunil Sharma (Driver ID: DL-04-A912)</span>
                  <span className="text-emerald-700 font-bold">Captured</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div>
            <button
              onClick={handleConfirmHandoff}
              className={`w-full h-14 rounded-xl text-white font-bold text-base flex flex-col items-center justify-center shadow-lg active:scale-[0.98] transition-all ${
                isSuccess ? "bg-emerald-600" : "bg-brand hover:bg-brand-dark"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[20px]">
                  {isSuccess ? "check_circle" : "task_alt"}
                </span>
                {isSuccess
                  ? "Handoff Verified!"
                  : mode === "pickup"
                  ? "Confirm Pickup (माल उठाव पक्का करें)"
                  : "Confirm Delivery (डिलीवरी पक्की करें)"}
              </span>
            </button>
            <div className="flex items-center justify-center gap-1.5 mt-2 text-slate-500 text-xs">
              <span className="material-symbols-outlined text-[14px] text-brand">security</span>
              <span>End-to-end cryptographic consignment handoff</span>
            </div>
          </div>
          </div>
        </div>
      </main>

      <CustomerBottomNav activeTab="handoff" />
    </div>
  );
}
