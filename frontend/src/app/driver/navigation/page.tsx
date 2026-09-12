'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import DriverBottomNav from '@/components/driver/DriverBottomNav';
import { useDriverLocation } from '@/hooks/useDriverLocation';
import { GPSSocket, GPSSocketStatus } from '@/lib/gpsSocket';
import { getToken } from '@/lib/api';

function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function DriverNavigationPage() {
  const router = useRouter();
  const { setLangModalOpen, getLangObj } = useLanguage();
  const currentLang = getLangObj();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [showArrivalToast, setShowArrivalToast] = useState(false);

  // Live GPS Telemetry
  const [bookingId, setBookingId] = useState<string | null>(null);
  const { position, error: locationError, isTracking, permissionDenied } = useDriverLocation(true);
  const [socketStatus, setSocketStatus] = useState<GPSSocketStatus>('disconnected');
  const [pingsSentCount, setPingsSentCount] = useState<number>(0);
  const lastSentRef = useRef<{ time: number; lat: number; lng: number } | null>(null);
  const socketRef = useRef<GPSSocket | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paramId = params.get('booking_id');
      const storedId = localStorage.getItem('latest_booking_id');
      setBookingId(paramId || storedId || '1c81ea67-2c3d-448a-b846-b65fa74fee9b');
    }
  }, []);

  useEffect(() => {
    if (!bookingId) return;
    const token = getToken();
    if (!token) return;

    const socket = new GPSSocket({
      bookingId,
      token,
      onStatusChange: (status) => setSocketStatus(status),
      onError: (err) => console.warn('[GPS Socket Error]', err),
    });
    socketRef.current = socket;
    socket.connect();

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [bookingId]);

  useEffect(() => {
    if (!position || !socketRef.current || socketStatus !== 'connected') return;

    const now = Date.now();
    const last = lastSentRef.current;

    let shouldSend = false;
    if (!last) {
      shouldSend = true;
    } else {
      const elapsed = now - last.time;
      if (elapsed >= 3000) {
        const dist = calculateDistanceMeters(last.lat, last.lng, position.lat, position.lng);
        if (dist >= 5 || elapsed >= 30000) {
          shouldSend = true;
        }
      }
    }

    if (shouldSend) {
      const sent = socketRef.current.sendPing({
        lat: position.lat,
        lng: position.lng,
        speed: position.speed,
        heading: position.heading,
        accuracy: position.accuracy,
        timestamp: position.timestamp,
      });
      if (sent) {
        lastSentRef.current = { time: now, lat: position.lat, lng: position.lng };
        setPingsSentCount((c) => c + 1);
      }
    }
  }, [position, socketStatus]);

  const sendQuickReply = (text: string) => {
    setMessages((prev) => [...prev, text]);
  };

  const handleArrival = () => {
    setShowArrivalToast(true);
    setTimeout(() => {
      router.push('/driver/handoff');
    }, 1200);
  };

  const currentSpeedKmH =
    position?.speed !== null && position?.speed !== undefined
      ? Math.max(0, Math.round(position.speed * 3.6))
      : null;

  return (
    <div className="bg-[#F8F9FA] font-body text-[#111c29] flex flex-col min-h-screen antialiased">
      {/* Top Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 pt-safe bg-[#0F6E56]/95 backdrop-blur-xl shadow-sm text-white">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/driver/home" className="flex items-center gap-2">
              <span className="material-symbols-outlined text-white text-2xl">arrow_back</span>
              <div>
                <span className="font-display text-base text-white font-extrabold tracking-tight">Active Trip</span>
                <p className="text-[10px] text-emerald-100">Trip #MH-CKN-9842</p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-display font-semibold text-emerald-100">
              <Link href="/driver/home" className="px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                Bookings
              </Link>
              <Link href="/driver/navigation" className="px-3 py-1.5 rounded-lg bg-white/20 text-white font-bold">
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
            <span className="bg-[#2563EB] text-white text-[10px] font-display font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
              <span className="material-symbols-outlined text-xs">ac_unit</span>
              -18°C Stable
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative w-full max-w-7xl mx-auto pt-20 pb-24 px-4 sm:px-6 lg:px-8 select-none">
        {/* Permission Denied Alert Banner */}
        {permissionDenied && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 flex items-start gap-3 shadow-xs">
            <span className="material-symbols-outlined text-amber-600 text-2xl shrink-0 mt-0.5">location_disabled</span>
            <div className="flex-1 text-xs">
              <strong className="font-display font-bold text-sm text-amber-950 block mb-0.5">Location Access Denied (स्थान अनुमति अस्वीकृत)</strong>
              <p className="text-amber-800 leading-relaxed">
                Real-time GPS tracking requires device location permissions. Please click the site permissions icon in your browser address bar and select <strong>&quot;Allow&quot;</strong> for Location, then refresh the page.
              </p>
            </div>
          </div>
        )}

        {/* WebSocket Status Warning Banner */}
        {socketStatus === 'reconnecting' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 flex items-center gap-2.5 shadow-xs">
            <span className="material-symbols-outlined text-blue-600 text-lg animate-spin">sync</span>
            <span className="text-xs font-medium">GPS stream disconnected. Reconnecting with exponential backoff...</span>
          </div>
        )}

        {/* Responsive Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Navigation HUD & Map */}
          <div className="lg:col-span-8 flex flex-col">
            {/* HUD Navigation Card */}
            <section className="w-full bg-[#0F172A] text-white rounded-2xl shadow-lg p-4 flex flex-col gap-3 mb-3 relative overflow-hidden">
              {/* Progress Micro-line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800">
                <div className="h-full bg-emerald-400 w-4/5"></div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="w-13 h-13 p-3 rounded-xl bg-[#0F6E56] flex items-center justify-center text-white shadow-md shrink-0">
                  <span className="material-symbols-outlined text-3xl font-bold">turn_right</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                      In 400 meters
                    </span>
                    <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-300">
                      <span className={`w-1.5 h-1.5 rounded-full ${socketStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : socketStatus === 'reconnecting' ? 'bg-amber-400 animate-spin' : 'bg-rose-400'}`}></span>
                      {socketStatus === 'connected' ? `Live (${pingsSentCount} pings)` : socketStatus === 'reconnecting' ? 'Reconnecting...' : 'Offline'}
                    </span>
                  </div>
                  <h2 className="font-display text-xl text-white font-extrabold tracking-tight truncate">
                    Take Exit 12B
                  </h2>
                  <p className="text-xs text-slate-300 truncate">Towards Chakan MIDC Industrial Corridor</p>
                </div>
              </div>

              {/* Telemetry & Velocity Strip */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg">
                  <span className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 font-display text-[11px] flex items-center justify-center font-bold">
                    60
                  </span>
                  <div className="flex flex-col">
                    <span className="font-display text-xs text-white font-bold leading-none">
                      {currentSpeedKmH !== null ? currentSpeedKmH : 48}{' '}
                      <span className="font-normal text-slate-400 text-[10px]">km/h</span>
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {currentSpeedKmH !== null ? 'Real GPS Speed' : 'Speed Limit 60'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-display text-lg text-emerald-400 font-extrabold leading-none">
                    14 <span className="text-xs text-white font-normal">mins</span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">1.8 km to Pickup Dock</div>
                </div>
              </div>
            </section>

        {/* Map Viewport Container */}
        <section className="relative w-full h-80 rounded-2xl overflow-hidden shadow-md bg-[#0b1322] border border-slate-800">
          <svg className="absolute inset-0 w-full h-full object-cover" preserveAspectRatio="none" viewBox="0 0 400 400">
            <rect fill="#0b1322" height="400" width="400"></rect>
            <path d="M 0,90 L 400,90 M 0,230 L 400,230 M 110,0 L 110,400 M 310,0 L 310,400" stroke="#172338" strokeDasharray="6,6" strokeWidth="1.5"></path>
            <rect fill="#131e33" height="110" opacity="0.75" rx="10" width="170" x="125" y="105"></rect>
            <rect fill="#131e33" height="135" opacity="0.6" rx="8" width="75" x="20" y="245"></rect>
            <text fill="#475569" fontFamily="Plus Jakarta Sans" fontSize="11" fontWeight="700" x="140" y="150">CHAKAN MIDC PHASE II</text>
            <text fill="#334155" fontFamily="Inter" fontSize="9" x="140" y="166">Auto Logistics Hub</text>
            <path d="M -20,290 Q 150,310 250,230 T 420,190" fill="none" stroke="#1f2d47" strokeLinecap="round" strokeWidth="12"></path>
            <path d="M 90,-20 L 90,420" fill="none" stroke="#1a263d" strokeWidth="14"></path>
            <path d="M 210,420 C 205,300 200,220 205,150 C 210,80 250,30 290,-20" fill="none" stroke="#253553" strokeLinecap="round" strokeWidth="26"></path>
            <path d="M 210,420 C 205,300 200,220 205,150 C 210,80 250,30 290,-20" fill="none" stroke="#0F172A" strokeLinecap="round" strokeWidth="20"></path>
            <path d="M 210,380 C 206,290 202,230 206,170 Q 212,135 258,118 L 330,105" fill="none" stroke="#0F6E56" strokeLinecap="round" strokeLinejoin="round" strokeWidth="14"></path>
            <path d="M 210,380 C 206,290 202,230 206,170 Q 212,135 258,118 L 330,105" fill="none" stroke="#84d6b9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8"></path>
            <path d="M 210,380 C 206,290 202,230 206,170 Q 212,135 258,118 L 330,105" fill="none" stroke="#ffffff" strokeDasharray="8,8" strokeLinecap="round" strokeWidth="2.5"></path>
            <circle cx="258" cy="118" fill="#0F6E56" opacity="0.35" r="14"></circle>
            <circle cx="258" cy="118" fill="#84d6b9" r="7"></circle>
            <g transform="translate(325, 90)">
              <rect fill="#0F6E56" height="34" rx="8" width="34" x="-8" y="-8"></rect>
              <path d="M9 3L3 7v10h12V7L9 3zm0 2.2l4 2.7v7.1h-2v-4H6v4H4V7.9l5-2.7z" fill="#ffffff"></path>
            </g>
            <g transform="translate(210, 310)">
              <circle cx="0" cy="0" fill="#2563EB" opacity="0.25" r="22" className="animate-ping"></circle>
              <circle cx="0" cy="0" fill="#2563EB" r="13"></circle>
              <circle cx="0" cy="0" fill="#ffffff" r="5"></circle>
              <polygon fill="#60A5FA" points="0,-18 -6,-10 6,-10"></polygon>
            </g>
          </svg>

          {/* Overlay Street Badge */}
          <div className="absolute top-3 left-3 bg-[#0F172A]/90 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-md border border-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-display text-xs text-white tracking-wide font-bold">
              {position ? `${position.lat.toFixed(4)}° N, ${position.lng.toFixed(4)}° E` : 'NH-48 EXPRESSWAY • KM 114'}
            </span>
          </div>

          {/* Audio Controls */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={() => alert('Recalibrating GPS route...')}
              className="w-10 h-10 rounded-xl bg-[#0F172A]/90 text-white flex items-center justify-center shadow-md border border-slate-700 active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">my_location</span>
            </button>
          </div>

          {/* SOS Button */}
          <div className="absolute bottom-3 left-3">
            <button
              onClick={() => setIsSOSOpen(true)}
              className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
              type="button"
            >
              <span className="material-symbols-outlined text-xl font-bold">fmd_bad</span>
              <div className="flex flex-col text-left">
                <span className="font-display text-xs font-extrabold leading-none">SOS HELP</span>
                <span className="text-[10px] text-white/90">आपातकालीन सहायता</span>
              </div>
            </button>
          </div>

          {/* Chat Trigger FAB */}
          <div className="absolute bottom-3 right-3">
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="w-12 h-12 rounded-full bg-[#0F6E56] hover:bg-[#0B5240] text-white flex items-center justify-center shadow-xl active:scale-95 transition-all relative border border-white/20"
              type="button"
            >
              <span className="material-symbols-outlined text-2xl">chat</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[10px] flex items-center justify-center font-bold">
                1
              </span>
            </button>
          </div>
        </section>

        {/* Live Route Telemetry Info Card */}
        <section className="mt-3 bg-white rounded-xl p-4 shadow-xs border border-[#E2E8F0] flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0F6E56]"></span>
              <span className="font-display text-xs font-bold text-[#111c29]">Consignment #RL-9082</span>
            </div>
            <span className="bg-[#EFF6FF] text-[#2563EB] px-2.5 py-0.5 rounded-full font-display text-[11px] font-bold flex items-center gap-1 border border-blue-200">
              <span className="material-symbols-outlined text-sm">ac_unit</span>
              -18°C Reefer Lock
            </span>
          </div>
          <div className="flex items-start gap-2.5 bg-[#F8F9FA] p-3 rounded-lg border border-slate-100">
            <span className="material-symbols-outlined text-[#0F6E56] text-2xl shrink-0 mt-0.5">warehouse</span>
            <div className="flex flex-col min-w-0">
              <span className="font-display text-[11px] text-[#5A6578] font-semibold">Destination Dock</span>
              <h3 className="font-display text-xs font-bold text-[#111c29] truncate">Apollo Cold Storage • Bay 4</h3>
              <p className="font-body text-[11px] text-[#5A6578] truncate">Sector 3, MIDC Chakan, Pune 410501</p>
            </div>
          </div>
        </section>

        {/* Arrived Button */}
        <div className="mt-3 w-full">
          <button
            onClick={handleArrival}
            className="w-full h-14 min-h-[56px] rounded-xl bg-[#0F6E56] hover:bg-[#0B5240] active:scale-[0.99] text-white font-display text-sm font-extrabold flex items-center justify-center gap-2 shadow-md transition-all"
            type="button"
          >
            <span>Arrived at Pickup Dock (पहुंच गए)</span>
            <span className="material-symbols-outlined text-2xl">arrow_forward</span>
          </button>
        </div>
          </div>

          {/* Right Column / Desktop Sidecar: Dispatch Instructions & Route Checkpoints */}
          <div className="lg:col-span-4 space-y-4">
            {/* Dock Security & Entry Pass */}
            <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-display text-xs font-bold text-slate-500 uppercase tracking-wider">Gate Clearance Pass</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Pre-Cleared
                </span>
              </div>
              <div className="mt-3 space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Security PIN</span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">#8821</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Authorized Dock</span>
                  <span className="font-bold text-slate-900">Bay 4 (Cold Chain)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Consignor Contact</span>
                  <a href="tel:+919876543210" className="font-bold text-[#0F6E56] hover:underline">+91 98765 43210</a>
                </div>
              </div>
            </div>

            {/* Weather & Road Condition Live */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-cyan-400 text-xl">cloud</span>
                  <span className="font-display text-xs font-bold text-slate-200">Highway Weather</span>
                </div>
                <span className="text-xs text-slate-400">Clear • 28°C</span>
              </div>
              <div className="bg-slate-800/80 rounded-xl p-3 text-xs space-y-1.5 border border-slate-700">
                <div className="flex justify-between text-slate-300">
                  <span>Toll Plaza Plaza 3:</span>
                  <span className="text-emerald-400 font-bold">Fastag Green (0 min queue)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Reefer Sensor Battery:</span>
                  <span className="text-cyan-400 font-bold">96% (Optimal)</span>
                </div>
              </div>
            </div>

            {/* Highway Quick Action Links */}
            <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0F6E56] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-lg">local_cafe</span>
                </div>
                <div>
                  <h6 className="font-display text-xs font-bold text-slate-800">Dhaba & Rest Stop</h6>
                  <p className="text-[11px] text-slate-500">Shree Gurukrupa (2.4 km ahead)</p>
                </div>
              </div>
              <button 
                onClick={() => alert('Marked Dhaba on Route!')}
                className="text-xs text-[#0F6E56] font-bold hover:underline"
              >
                View
              </button>
            </div>
          </div>
        </div>

        {/* Chat Drawer */}
        {isChatOpen && (
          <aside className="fixed inset-x-4 bottom-20 z-40 max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden animate-fade-up">
            <div className="bg-[#0F172A] px-4 py-2.5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#0F6E56] flex items-center justify-center font-bold text-xs">
                  S
                </div>
                <div>
                  <span className="font-display text-xs font-bold leading-tight block">
                    Shipper Dispatch (गेट प्रबंधक)
                  </span>
                  <span className="text-[10px] text-slate-300">Apollo Cold Storage Gate 3</span>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="p-3 flex flex-col gap-2 max-h-48 overflow-y-auto bg-[#F8F9FA]">
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="w-6 h-6 rounded-full bg-[#E6F4F1] text-[#0F6E56] font-bold text-[10px] flex items-center justify-center shrink-0 mt-1">
                  DS
                </div>
                <div className="bg-white p-2.5 rounded-xl rounded-tl-none shadow-xs border border-slate-200">
                  <p className="text-xs text-[#111c29] font-semibold leading-snug">
                    Gate 3 bay unlocked. Park directly at dock 4.
                  </p>
                  <span className="text-[10px] text-slate-400 text-right block">14:41 PM</span>
                </div>
              </div>

              {messages.map((msg, i) => (
                <div key={i} className="flex justify-end">
                  <div className="bg-[#0F6E56] text-white p-2.5 rounded-xl rounded-tr-none text-xs font-semibold shadow-xs">
                    {msg}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick 1-Tap Replies */}
            <div className="p-2.5 bg-white border-t border-slate-200 flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-[#5A6578] font-display">
                1-Tap Quick Reply (त्वरित उत्तर):
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  onClick={() => sendQuickReply('पहुंच रहा हूँ (Arriving now)')}
                  className="px-3 py-2 rounded-lg bg-[#E6F4F1] hover:bg-emerald-100 text-[#0F6E56] font-display text-xs font-bold flex items-center justify-between"
                >
                  <span>पहुंच रहा हूँ (Arriving now)</span>
                  <span className="material-symbols-outlined text-base">send</span>
                </button>
                <button
                  onClick={() => sendQuickReply('गेट पर हूँ (At gate)')}
                  className="px-3 py-2 rounded-lg bg-[#F1F5F9] hover:bg-slate-200 text-[#111c29] font-display text-xs font-bold flex items-center justify-between"
                >
                  <span>गेट पर हूँ (At gate)</span>
                  <span className="material-symbols-outlined text-base">send</span>
                </button>
                <button
                  onClick={() => sendQuickReply('ट्रैफिक जाम है (In traffic, 5 min delay)')}
                  className="px-3 py-2 rounded-lg bg-[#FEF3C7] hover:bg-amber-100 text-[#D97706] font-display text-xs font-bold flex items-center justify-between"
                >
                  <span>ट्रैफिक जाम है (In traffic)</span>
                  <span className="material-symbols-outlined text-base">send</span>
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* SOS Alert Modal */}
        {isSOSOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-3 text-center animate-fade-up">
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-3xl font-bold">fmd_bad</span>
              </div>
              <h3 className="font-display text-base font-extrabold text-[#111c29]">
                Emergency SOS Triggered
              </h3>
              <p className="text-xs text-[#5A6578]">
                Dispatch control center and highway police patrol have been pinged with your exact live coordinates.
              </p>
              <div className="flex gap-2 pt-2">
                <a
                  href="tel:112"
                  className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-display text-xs font-bold"
                >
                  Call 112 Patrol
                </a>
                <button
                  onClick={() => setIsSOSOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-display text-xs font-bold"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Arrival Toast */}
        {showArrivalToast && (
          <div className="fixed top-20 left-4 right-4 z-50 max-w-md mx-auto p-3.5 rounded-xl bg-[#0F6E56] text-white shadow-xl flex items-center gap-3 animate-fade-up">
            <span className="material-symbols-outlined text-2xl">task_alt</span>
            <div>
              <span className="font-display text-xs font-bold block">Dock Check-in Initiated</span>
              <span className="text-[11px] text-emerald-100">Door 4 notified. Proceed to handoff.</span>
            </div>
          </div>
        )}
      </main>

      <DriverBottomNav />
    </div>
  );
}
