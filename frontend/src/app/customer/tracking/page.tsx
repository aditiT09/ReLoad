"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CustomerBottomNav from "@/components/customer/CustomerBottomNav";
import { useLanguage } from "@/context/LanguageContext";
import { bookings, gps, getToken } from "@/lib/api";
import { GPSSocket } from "@/lib/gpsSocket";

interface ChatMessage {
  id: string;
  sender: "driver" | "customer";
  name: string;
  text: string;
  subtext?: string;
  time: string;
}

export default function CustomerActiveTrackingPage() {
  const { currentLanguage, setLangModalOpen, t } = useLanguage();
  const [surchargeStatus, setSurchargeStatus] = useState<"pending" | "accepted" | "declined">("pending");
  const [booking, setBooking] = useState<any>(null);
  const [liveLocation, setLiveLocation] = useState<{
    lat: number;
    lng: number;
    speed?: number | null;
    timestamp?: string;
  } | null>(null);
  const [telemetryStatus, setTelemetryStatus] = useState<"connected" | "connecting" | "disconnected">("disconnected");

  useEffect(() => {
    const latestId = localStorage.getItem("latest_booking_id");
    if (!latestId) return;

    bookings.get(latestId)
      .then((b: any) => setBooking(b))
      .catch((err) => console.log(err));

    // Fetch initial latest GPS ping
    gps.getLatestPing(latestId)
      .then((ping) => {
        if (ping) {
          setLiveLocation({
            lat: ping.lat,
            lng: ping.lng,
            timestamp: ping.timestamp,
          });
        }
      })
      .catch(() => {
        // No ping yet or unauthorized
      });

    // Connect to GPS WebSocket room
    const token = getToken();
    if (!token) return;

    const socket = new GPSSocket({
      bookingId: latestId,
      token,
      onStatusChange: (status) => {
        if (status === 'connected') setTelemetryStatus('connected');
        else if (status === 'connecting' || status === 'reconnecting') setTelemetryStatus('connecting');
        else setTelemetryStatus('disconnected');
      },
      onMessage: (data) => {
        if (data && typeof data === 'object' && 'lat' in data && 'lng' in data) {
          setLiveLocation({
            lat: Number(data.lat),
            lng: Number(data.lng),
            speed: data.speed !== undefined ? data.speed : null,
            timestamp: data.timestamp || new Date().toISOString(),
          });
        }
      },
    });

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "driver",
      name: "Gurpreet Singh",
      text: "Sir, Gate 3 par truck queue hai, 5 min lagega.",
      subtext: "Sir, there is a small queue at Gate 3, will take 5 mins.",
      time: "10:24 AM",
    },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "customer",
      name: "You",
      text: text,
      time: "Just now",
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputText("");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] antialiased selection:bg-brand selection:text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-brand text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/customer/home" className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center bg-brand-dark/90 hover:bg-brand-dark transition-colors mr-1">
              <span className="material-symbols-outlined text-sm text-white">arrow_back</span>
            </Link>
            <div className="w-7 h-7 rounded-full border-2 border-white/90 flex items-center justify-center bg-brand-dark">
              <span className="material-symbols-outlined text-[16px] text-white">sync</span>
            </div>
            <span className="text-xl font-black tracking-tight text-white">ReLoad</span>
            <span className="text-emerald-200 text-xs hidden sm:inline">• Live Telematics Tracking</span>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setLangModalOpen(true)}
              className="flex items-center space-x-1.5 bg-brand-dark/80 hover:bg-brand-dark text-xs font-semibold py-1.5 px-3 rounded-full border border-white/20 transition-colors uppercase"
            >
              <span className="material-symbols-outlined text-[14px] text-slate-200">language</span>
              <span>{currentLanguage}</span>
            </button>
            <Link
              href="/customer/profile"
              className="w-8 h-8 rounded-full bg-brand-dark/90 flex items-center justify-center border border-white/30 text-white"
            >
              <span className="material-symbols-outlined text-[16px]">person</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-7 space-y-4">
            {/* Driver Card */}
          <section className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100">
            <div className="flex items-start justify-between gap-3">
              <div className="relative flex-shrink-0">
                <img
                  alt="Gurpreet Singh"
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                />
                <span className="absolute -bottom-1 -right-1 bg-brand text-white p-0.5 rounded-full ring-2 ring-white">
                  <span className="material-symbols-outlined text-[12px] block">verified</span>
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-[17px] font-bold text-slate-900 tracking-tight truncate">Gurpreet Singh</h2>
                  <div className="flex items-center space-x-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-[12px] text-emerald-600">verified_user</span>
                    <span>Trust 98/100</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  MH-12-RN-8821 • <span className="text-slate-700 font-semibold">Tata Signa 2823</span>
                </p>

                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className="inline-flex items-center space-x-1 bg-amber-50 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded text-[11px] font-medium">
                    <span className="material-symbols-outlined text-[13px] text-amber-500 fill-1">star</span>
                    <span className="font-bold">4.9</span>
                    <span className="text-slate-500 text-[10px]">(1,420 trips)</span>
                  </span>
                  <span className="inline-flex items-center space-x-1 bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                    <span className="material-symbols-outlined text-[13px] text-blue-500">ac_unit</span>
                    <span>Chilled 4°C</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Contact Actions */}
            <div className="grid grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-slate-100">
              <a
                href="tel:9876543210"
                className="h-12 flex items-center justify-center space-x-2 bg-brand hover:bg-brand-dark active:scale-[0.98] text-white font-semibold text-sm rounded-xl transition shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                <span>Call (कॉल करें)</span>
              </a>
              <a
                href="#quick-chat"
                className="h-12 flex items-center justify-center space-x-2 bg-slate-50 hover:bg-slate-100 active:scale-[0.98] text-slate-800 font-semibold text-sm rounded-xl border border-slate-200 transition"
              >
                <span className="material-symbols-outlined text-[18px] text-slate-700">chat</span>
                <span>Chat (संदेश)</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white ml-0.5"></span>
              </a>
            </div>
          </section>

          {/* Consignment Tracker */}
          <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                CONSIGNMENT #{booking?.id ? String(booking.id).slice(0, 8).toUpperCase() : 'RL-9042'}
              </span>
              <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[11px] font-bold text-emerald-800 capitalize">
                  {booking?.status ? String(booking.status).replace('_', ' ') : 'GPS Live'}
                </span>
              </div>
            </div>

            <div className="mt-1">
              <h1 className="text-[22px] font-extrabold text-slate-900 tracking-tight">
                ETA: 14 mins <span className="text-slate-600 font-bold text-lg">(1.8 km)</span>
              </h1>
            </div>

            {/* Stepper */}
            <div className="mt-5 relative">
              <div className="absolute top-4 left-5 right-5 h-[3px] bg-slate-200 -z-0"></div>
              <div className="absolute top-4 left-5 w-[25%] h-[3px] bg-brand -z-0"></div>

              <div className="grid grid-cols-5 relative z-10 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 mt-2">Booked</span>
                  <span className="text-[10px] text-slate-500 font-medium">10:15 AM</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center ring-4 ring-emerald-100 shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                  </div>
                  <span className="text-xs font-bold text-brand mt-2">On the<br />Way</span>
                  <span className="text-[10px] text-brand font-semibold">रास्ते में</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200">
                    <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                  </div>
                  <span className="text-xs font-medium text-slate-500 mt-2">Pickup</span>
                  <span className="text-[10px] text-slate-400">उठाव</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200">
                    <span className="material-symbols-outlined text-[14px]">navigation</span>
                  </div>
                  <span className="text-xs font-medium text-slate-500 mt-2">Transit</span>
                  <span className="text-[10px] text-slate-400">पारगमन</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200">
                    <span className="material-symbols-outlined text-[14px]">where_to_vote</span>
                  </div>
                  <span className="text-xs font-medium text-slate-500 mt-2">Delivered</span>
                  <span className="text-[10px] text-slate-400">वितरित</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/customer/handoff"
                className="text-xs font-bold text-brand hover:underline flex items-center space-x-1"
              >
                <span>Proceed to Digital Handoff (हैंडऑफ)</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
          </section>

          {/* Live Map Card */}
          <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200">
            <div className="relative h-48 w-full bg-[#E4ECEF] overflow-hidden">
              <svg className="w-full h-full object-cover" fill="none" viewBox="0 0 380 190">
                <rect fill="#EBF1F5" height="190" width="380"></rect>
                <path d="M-20 60 Q90 40 180 80 T390 50 L390 0 L-20 0 Z" fill="#E2EBEF"></path>
                <path d="M0 130 C120 110 240 160 400 130 L400 200 L0 200 Z" fill="#E2EAEF"></path>
                <path d="M-10 110 C80 90 200 130 390 90" stroke="#CBD5E1" strokeLinecap="round" strokeWidth="12"></path>
                <path d="M70 -10 C90 80 120 140 160 210" stroke="#CBD5E1" strokeLinecap="round" strokeWidth="8"></path>
                <path d="M260 -10 C240 70 290 140 320 200" stroke="#CBD5E1" strokeLinecap="round" strokeWidth="7"></path>
                <path d="M10 170 C90 120 170 140 220 90 C260 50 310 60 360 48" fill="none" stroke="#0F6E56" strokeLinecap="round" strokeWidth="6"></path>
                <path d="M10 170 C90 120 170 140 220 90 C260 50 310 60 360 48" fill="none" stroke="#34D399" strokeDasharray="4 4" strokeLinecap="round" strokeWidth="2.5"></path>
                
                <circle cx="270" cy="62" fill="#F59E0B" r="5" stroke="#FFFFFF" strokeWidth="2"></circle>
                <text fill="#78350F" fontFamily="sans-serif" fontSize="9" fontWeight="bold" x="245" y="50">Toll Gate 4B</text>

                <circle cx="355" cy="48" fill="#0F172A" r="6"></circle>
                <circle cx="355" cy="48" fill="#FFFFFF" r="2.5"></circle>
                <text fill="#1E293B" fontFamily="sans-serif" fontSize="9" fontWeight="bold" x="315" y="40">Warehouse</text>

                <g transform="translate(180, 100)">
                  <circle className="animate-ping" cx="10" cy="10" fill="#0F6E56" fillOpacity="0.2" r="14"></circle>
                  <circle cx="10" cy="10" fill="#0F6E56" r="12"></circle>
                  <path d="M10 4 L16 14 L10 12 L4 14 Z" fill="#FFFFFF"></path>
                </g>
              </svg>

              <div className="absolute bottom-2.5 left-2.5 bg-slate-900/90 backdrop-blur text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-md">
                <span className="material-symbols-outlined text-[14px] text-emerald-400">speed</span>
                <span>
                  {liveLocation?.speed !== null && liveLocation?.speed !== undefined
                    ? `${Math.max(0, Math.round(liveLocation.speed * 3.6))} km/h`
                    : '46 km/h'} • {telemetryStatus === 'connected' ? 'Live Telematics' : 'NH-48 Express'}
                </span>
              </div>
            </div>

            <div className="px-3.5 py-2.5 bg-white flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-slate-800 font-semibold truncate">
                <span className="material-symbols-outlined text-[16px] text-brand flex-shrink-0">location_on</span>
                <span className="truncate">
                  {liveLocation
                    ? `Live: ${liveLocation.lat.toFixed(4)}° N, ${liveLocation.lng.toFixed(4)}° E`
                    : 'Navigating to JNPT Gate 3, Sector 19'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 flex-shrink-0 font-medium">
                {telemetryStatus === 'connected' ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live GPS
                  </span>
                ) : (
                  'Updated 4s ago'
                )}
              </span>
            </div>
          </section>

          {/* Zero Surprise Guarantee */}
          <section className="bg-[#E6F4EE] rounded-2xl p-4 border border-[#B7E2D2] flex items-start space-x-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-slate-900 tracking-tight leading-tight">ReLoad Zero-Surprise Guarantee</h3>
              <p className="text-xs text-slate-700 font-normal mt-1.5 leading-relaxed">
                <strong className="font-bold text-brand-dark">100% Explicit Tap Confirmation</strong> on any toll or detour route changes. Unlike competitor silent post-trip deductions, nothing is charged without your direct consent.
              </p>
              <p className="text-[11px] font-semibold text-brand-dark mt-2">
                कोई गुप्त शुल्क नहीं • हर शुल्क पर आपकी पूर्व सहमति आवश्यक
              </p>
            </div>
          </section>
          </div>

          {/* Right Column: Surcharge Approval & Quick Chat */}
          <div className="lg:col-span-5 space-y-4">
            {/* Surcharge Approval Panel */}
          {surchargeStatus === "pending" ? (
            <section className="bg-white rounded-2xl p-4 shadow-md border-2 border-amber-300 relative">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  Driver Request
                </span>
                <span className="text-xs text-slate-500 font-medium">Fastag Gate 4B</span>
              </div>

              <div className="flex items-start justify-between mt-2.5">
                <div className="flex items-start space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[16px] text-amber-600">toll</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 leading-tight">Unplanned Toll /<br />Detour Surcharge</h2>
                    <p className="text-[11px] text-slate-500 mt-0.5">अतिरिक्त टोल / मार्ग परिवर्तन शुल्क अनुरोध</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900 tracking-tight">₹450</span>
                </div>
              </div>

              <div className="mt-3.5 bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs">
                <div className="flex items-start space-x-2">
                  <span className="material-symbols-outlined text-[16px] text-amber-600 flex-shrink-0 mt-0.5">warning</span>
                  <div>
                    <p className="text-slate-800 font-medium">
                      <span className="font-bold text-slate-900">Reason:</span> Police barricade detour via Panvel Ring Tollway (+4.2 km).
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">कारण: मुख्य मार्ग पर नाकाबंदी, नया टोल मार्ग आवश्यक है।</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                  onClick={() => setSurchargeStatus("declined")}
                  className="h-[52px] bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold text-sm rounded-xl flex items-center justify-center space-x-1.5 shadow-sm transition"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                  <span>Decline (अस्वीकार)</span>
                </button>
                <button
                  onClick={() => setSurchargeStatus("accepted")}
                  className="h-[52px] bg-brand hover:bg-brand-dark active:scale-[0.98] text-white font-bold text-sm rounded-xl flex items-center justify-center space-x-1.5 shadow-md transition"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  <span>Accept (स्वीकार करें)</span>
                </button>
              </div>
            </section>
          ) : (
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              surchargeStatus === "accepted"
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-red-50 border-red-200 text-red-900"
            }`}>
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-[20px]">
                  {surchargeStatus === "accepted" ? "check_circle" : "cancel"}
                </span>
                <span className="text-sm font-bold">
                  {surchargeStatus === "accepted"
                    ? "Surcharge Approved (₹450 Added to final invoice)"
                    : "Surcharge Declined (Driver instructed to maintain standard route)"}
                </span>
              </div>
              <button
                onClick={() => setSurchargeStatus("pending")}
                className="text-xs font-semibold underline text-slate-600"
              >
                Reset
              </button>
            </div>
          )}

          {/* Driver Quick Chat */}
          <section id="quick-chat" className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 rounded-lg bg-emerald-50 text-brand">
                  <span className="material-symbols-outlined text-[16px] block">forum</span>
                </span>
                <h3 className="text-sm font-bold text-slate-900">Driver Quick Chat (त्वरित संदेश)</h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-600">Online • Driving Mode</span>
            </div>

            <div className="mt-3 space-y-2.5 max-h-48 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 ${
                    msg.sender === "customer" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                      msg.sender === "customer" ? "bg-slate-800" : "bg-brand"
                    }`}
                  >
                    {msg.sender === "customer" ? "ME" : "GS"}
                  </div>
                  <div
                    className={`rounded-2xl p-3 max-w-[85%] text-slate-800 ${
                      msg.sender === "customer"
                        ? "bg-brand text-white rounded-tr-none"
                        : "bg-slate-100 rounded-tl-none"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className={`text-xs font-bold ${msg.sender === "customer" ? "text-emerald-100" : "text-slate-900"}`}>
                        {msg.name}
                      </span>
                      <span className={`text-[10px] ${msg.sender === "customer" ? "text-emerald-200" : "text-slate-400"}`}>
                        {msg.time}
                      </span>
                    </div>
                    <p className="text-xs font-medium mt-1">{msg.text}</p>
                    {msg.subtext && (
                      <p className="text-[11px] text-slate-500 mt-0.5 italic">{msg.subtext}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3.5">
              <p className="text-[11px] text-slate-500 font-medium mb-2">Tap quick reply to send:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Okay, understood (ठीक है)",
                  "Gate 3 bay unlocked",
                  "Security will open gate",
                ].map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(reply)}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-full active:scale-95 flex items-center space-x-1.5 transition"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[12px] text-brand">send</span>
                    <span>{reply}</span>
                  </button>
                ))}
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="mt-3.5 flex items-center space-x-2"
            >
              <input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand focus:bg-white text-slate-900 placeholder:text-slate-400"
                placeholder="Type instructions / संदेश लिखें..."
                type="text"
              />
              <button
                aria-label="Send message"
                className="w-10 h-10 bg-brand hover:bg-brand-dark active:scale-95 text-white rounded-xl flex items-center justify-center transition shadow-sm"
                type="submit"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
          </section>
          </div>
        </div>
      </main>

      <CustomerBottomNav activeTab="tracking" />
    </div>
  );
}
