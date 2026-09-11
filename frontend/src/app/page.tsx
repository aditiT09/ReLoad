'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function SplashScreen() {
  const router = useRouter();
  const { setLangModalOpen, getLangObj, t, currentLang } = useLanguage();
  const langObj = getLangObj();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleAudioHelp = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const speechMap: Record<string, { text: string; lang: string }> = {
        hi: { text: 'ReLoad Logistics में आपका स्वागत है। रिटर्न लोड और सुरक्षित माल ढुलाई के लिए शुरू करें।', lang: 'hi-IN' },
        mr: { text: 'ReLoad Logistics मध्ये आपले स्वागत आहे. जलद आणि सुरक्षित मालवाहतुकीसाठी सुरू करा.', lang: 'mr-IN' },
        gu: { text: 'ReLoad Logistics માં તમારું સ્વાગત છે. ઝડપી અને સુરક્ષિત પરિવહન માટે શરૂ કરો.', lang: 'gu-IN' },
        pa: { text: 'ReLoad Logistics ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ਸੁਰੱਖਿਅਤ ਅਤੇ ਤੇਜ਼ ਢੋਆ-ਢੁਆਈ ਲਈ ਸ਼ੁਰੂ ਕਰੋ।', lang: 'pa-IN' },
        en: { text: 'Welcome to ReLoad Logistics. Fast highway dispatch, guaranteed return loads, and transparent verified rates.', lang: 'en-IN' },
      };
      const config = speechMap[currentLang] || speechMap.hi;
      const msg = new SpeechSynthesisUtterance(config.text);
      msg.lang = config.lang;
      msg.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(msg);
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="bg-[#F8F9FA] font-body text-[#16212E] flex flex-col min-h-screen pt-safe pb-safe antialiased">
      {/* Top Header Bar: Responsive Container */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between border-b border-slate-100/80 bg-white/60 backdrop-blur-md sticky top-0 z-30">
        {/* Brand Name & Live Fleet Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] border border-[#0F6E56]/30 flex items-center justify-center text-[#0F6E56]">
              <span className="material-symbols-outlined text-[20px]">sync_alt</span>
            </div>
            <span className="font-display text-xl font-black text-[#16212E] tracking-tight">
              Re<span className="text-[#0F6E56]">Load</span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-[#E6F4F1]/90 border border-[#0F6E56]/20 px-3 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0F6E56] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0F6E56]"></span>
            </span>
            <span className="font-display text-xs font-bold text-[#0F6E56] tracking-wide">
              {t('live_fleet', 'Live Fleet • सक्रिय नेटवर्क')}
            </span>
          </div>
        </div>

        {/* Persistent Language Selector Button */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setLangModalOpen(true)}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 active:scale-95 border border-[#E2E8F0] px-3.5 py-1.5 rounded-full shadow-xs text-xs font-bold text-[#16212E] transition-all hover:border-[#0F6E56]"
            type="button"
          >
            <span className="text-base">{langObj.flag}</span>
            <span className="font-display tracking-tight">
              {langObj.native} ({langObj.code.toUpperCase()})
            </span>
            <span className="material-symbols-outlined text-sm text-[#5A6578]">expand_more</span>
          </button>
        </div>
      </header>

      {/* Main Content Area - Responsive for Mobile & Desktop Laptop */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Left Column: Visual Hero Photo Card */}
          <div className="lg:col-span-6 w-full">
            <section className="relative w-full rounded-2xl overflow-hidden shadow-md bg-white border border-[#E2E8F0] flex flex-col group">
              <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[420px] overflow-hidden bg-slate-900">
                <img
                  alt="Modern cargo truck on expansive Indian highway at sunrise"
                  className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-105 transition-transform duration-700"
                  src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

                {/* Floating Quality Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-[#2563EB] font-display text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-[#2563EB]/20">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      ac_unit
                    </span>
                    Reefer Ready (-18°C)
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-[#0F6E56] font-display text-xs font-bold px-3 py-1 rounded-full shadow-sm border border-[#0F6E56]/20">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      verified
                    </span>
                    GPS &amp; ULIP Verified
                  </span>
                </div>

                {/* Road Corridor Status */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/60 backdrop-blur-md text-white px-3.5 py-2 rounded-xl text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-400 text-base">route</span>
                    <span className="font-bold">Golden Quad &amp; NH-48 Active Corridor</span>
                  </div>
                  <span className="text-emerald-400 font-bold hidden sm:inline">100% On-Time</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Hero Content & Call to Actions */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-4">
            {/* Centerpiece Brand & Taglines */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-[#E6F4F1] border border-[#0F6E56]/20 px-3.5 py-1.5 rounded-xl">
                <span className="material-symbols-outlined text-[#0F6E56] text-base">local_shipping</span>
                <p className="font-display text-xs font-bold text-[#0F6E56]">
                  {t('return_load', 'Return Load Logistics')} • शून्य खाली फेरा
                </p>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#16212E] tracking-tight leading-tight">
                {t('book_truck_title', 'Book a truck, the easy way.')}
              </h1>

              <p className="font-body text-sm sm:text-base text-[#5A6578] leading-relaxed max-w-xl">
                {t('fast_dispatch', 'Fast highway dispatch, reliable payments, and transparent verified rates on all major Indian corridors.')}
              </p>
            </div>

            {/* Operational AI Pulse Card */}
            <div className="w-full bg-white rounded-2xl p-4 shadow-sm border border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-[#E6F4F1] text-[#0F6E56] shrink-0">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    hub
                  </span>
                  <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                  </span>
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-bold text-[#16212E]">{t('corridor_ai', 'NH Corridor AI Live')}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded font-display">
                      {t('active', 'ACTIVE')}
                    </span>
                  </div>
                  <span className="font-body text-xs text-[#0F6E56] font-semibold leading-tight mt-0.5">
                    {t('trucks_active', '1,420+ Trucks on Golden Quad & NH-48')}
                  </span>
                  <span className="font-body text-[11px] text-[#5A6578]">
                    {t('zero_deadhead', 'Zero Empty Deadhead (शून्य खाली फेरा)')}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end pl-2 shrink-0">
                <span className="material-symbols-outlined text-[#0F6E56] text-2xl">speed</span>
                <span className="text-xs font-bold text-[#0F6E56] mt-0.5 font-display">&lt; 3 mins</span>
              </div>
            </div>

            {/* Actions: Voice Guidance & Primary CTA */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={toggleAudioHelp}
                className={`flex-1 py-3 px-4 bg-white hover:bg-slate-50 active:scale-[0.99] border border-[#E2E8F0] rounded-xl flex items-center justify-between text-left transition-all ${
                  isPlayingAudio ? 'playing border-[#0F6E56] ring-2 ring-[#0F6E56]/30' : ''
                }`}
                type="button"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isPlayingAudio ? 'bg-[#0F6E56] text-white' : 'bg-[#E6F4F1] text-[#0F6E56]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {isPlayingAudio ? 'volume_up' : 'campaign'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-xs font-bold text-[#16212E]">
                      {t('listen_audio', 'Listen Audio Guide')}
                    </span>
                    <span className="font-body text-[11px] text-[#5A6578]">
                      {isPlayingAudio ? 'Playing audio...' : t('tap_hear', 'Tap to hear app overview')}
                    </span>
                  </div>
                </div>

                <div className="flex items-end gap-1 h-5 px-1 shrink-0">
                  <div className={`w-1 bg-[#0F6E56] rounded-full transition-all ${isPlayingAudio ? 'h-4 animate-pulse' : 'h-2'}`}></div>
                  <div className={`w-1 bg-[#0F6E56] rounded-full transition-all ${isPlayingAudio ? 'h-5 animate-pulse' : 'h-3.5'}`}></div>
                  <div className={`w-1 bg-[#0F6E56] rounded-full transition-all ${isPlayingAudio ? 'h-3 animate-pulse' : 'h-1.5'}`}></div>
                </div>
              </button>

              <button
                onClick={() => router.push('/landing')}
                className="flex-1 overflow-hidden h-14 bg-[#0F6E56] hover:bg-[#0B5240] active:scale-[0.98] text-white rounded-xl font-display text-base font-bold shadow-lg shadow-[#0F6E56]/20 flex items-center justify-center gap-2.5 transition-all group"
                type="button"
              >
                <span className="tracking-wide text-white">{t('get_started', 'Get Started • शुरू करें')}</span>
                <span className="material-symbols-outlined text-2xl transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </button>
            </div>

            {/* Bottom Secondary Badges & 24/7 Helpline */}
            <div className="pt-2 flex flex-wrap items-center justify-between text-xs font-semibold text-[#5A6578] border-t border-slate-200/60">
              <a
                className="inline-flex items-center gap-1.5 hover:text-[#0F6E56] active:scale-95 transition-colors py-1"
                href="tel:18001234567"
              >
                <span className="material-symbols-outlined text-base text-[#0F6E56]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  call
                </span>
                <span>{t('helpline', '24/7 Helpline: 1800-RELOAD')}</span>
              </a>
              <div className="inline-flex items-center gap-1.5 text-[#0F6E56]">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified_user
                </span>
                <span>{t('vahan_sync', 'Fastag & Vahan Sync')}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
