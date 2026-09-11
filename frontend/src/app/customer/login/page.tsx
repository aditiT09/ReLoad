'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { auth, setToken } from '@/lib/api';

export default function CustomerLoginPage() {
  const router = useRouter();
  const { setLangModalOpen, getLangObj } = useLanguage();
  const currentLang = getLangObj();

  const [step, setStep] = useState<'phone' | 'otp' | 'signup'>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(28);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (step === 'otp' && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [step, timer]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setStep('otp');
      setTimer(28);
      setError('');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) { setError('Enter all 6 digits'); return; }
    setIsLoading(true);
    setError('');
    try {
      const fullPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      const result = (await auth.verifyOtp(fullPhone, otpCode)) as { access_token?: string };
      if (result?.access_token) {
        setToken(result.access_token);
      }
      router.push('/customer/home');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('Please enter your name'); return; }
    const otpCode = otp.join('');
    setIsLoading(true);
    setError('');
    try {
      const result = await auth.signup({
        role: 'customer',
        name: name.trim(),
        phone: `+91${phone}`,
        password: otpCode,
      });
      setToken(result.access_token);
      router.push('/customer/home');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        'कृपया अपना 10 अंकों का मोबाइल नंबर दर्ज करें और ओटीपी सत्यापित करें।'
      );
      utterance.lang = 'hi-IN';
      utterance.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="bg-[#F8F9FA] font-body text-[#111c29] antialiased min-h-screen selection:bg-[#E6F4F1] selection:text-[#0F6E56] flex flex-col justify-center items-center p-3 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl border border-[#E2E8F0] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Hero */}
        <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-[#0F6E56] to-[#0B5240] p-10 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20" />
          <div className="relative z-10 space-y-4">
            <Link href="/landing" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                <span className="material-symbols-outlined text-2xl">local_shipping</span>
              </div>
              <div>
                <span className="font-display text-2xl font-black text-white tracking-tight">ReLoad</span>
                <span className="block text-[10px] text-emerald-200 uppercase font-bold tracking-wider">Shipper Portal</span>
              </div>
            </Link>
            <div className="pt-4">
              <h2 className="text-2xl font-black font-display text-white mt-3 leading-tight">Enterprise Freight Dispatch &amp; Cold-Chain Tracking</h2>
              <p className="text-emerald-100 text-xs mt-2 leading-relaxed">Connect directly with 10,000+ verified truck drivers across major National Highway corridors.</p>
            </div>
          </div>
          <div className="relative z-10 space-y-3 pt-6">
            <div className="flex items-center gap-2.5 text-xs font-semibold text-emerald-100">
              <span className="material-symbols-outlined text-emerald-300 text-base">check_circle</span>
              <span>100% KYC &amp; FASTag Verified Fleet</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs font-semibold text-emerald-100">
              <span className="material-symbols-outlined text-emerald-300 text-base">lock</span>
              <span>Locked Fare ₹0 Hidden Surcharges</span>
            </div>
            <div className="pt-4 border-t border-white/15 flex items-center justify-between text-[11px] text-emerald-200">
              <span>24/7 Helpline: 1800-200-8899</span>
              <span>ISO 27001 Certified</span>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-6 p-5 sm:p-8 flex flex-col justify-between">
          <main className="flex flex-col relative w-full">
            <div className="flex items-center justify-between py-1 mb-3">
              <Link href="/landing" className="flex items-center space-x-2 lg:hidden">
                <div className="w-9 h-9 rounded-xl bg-[#E6F4F1] border border-[#0F6E56]/20 flex items-center justify-center text-[#0F6E56] shadow-xs">
                  <span className="material-symbols-outlined text-xl">local_shipping</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-base font-extrabold text-[#111c29] leading-none">Re<span className="text-[#0F6E56]">Load</span></span>
                  <span className="font-display text-[9px] text-[#5A6578] uppercase font-semibold">Customer Portal</span>
                </div>
              </Link>
              <span className="hidden lg:block font-display text-xs font-bold text-slate-500 uppercase tracking-wider">Step 1 of 2 • Authentication</span>
              <button onClick={() => setLangModalOpen(true)} className="flex items-center space-x-1.5 h-9 px-3 bg-slate-100 hover:bg-slate-200 border border-[#E2E8F0] rounded-full shadow-xs active:scale-95 transition-transform text-[#111c29]" type="button">
                <span className="text-xs">🌐</span>
                <span className="font-display text-xs font-bold text-[#111c29]">{currentLang.native}</span>
                <span className="material-symbols-outlined text-slate-400 text-sm">expand_more</span>
              </button>
            </div>

            {/* Audio banner */}
            <div className="mb-3 bg-[#EFF6FF] border border-blue-200 p-3 rounded-xl shadow-xs flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button onClick={toggleAudio} className={`w-10 h-10 rounded-full flex items-center justify-center shadow-xs transition-transform active:scale-90 ${isPlayingAudio ? 'bg-[#D97706] text-white' : 'bg-[#2563EB] text-white'}`}>
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{isPlayingAudio ? 'stop_circle' : 'volume_up'}</span>
                </button>
                <div className="flex flex-col min-w-0">
                  <p className="font-display text-xs text-[#111c29] font-bold leading-tight truncate">बोलकर सुनें (Listen Audio Help)</p>
                  <p className="font-body text-[11px] text-[#5A6578]">{isPlayingAudio ? 'Audio running...' : 'Tap to hear step-by-step guidance'}</p>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0] flex flex-col space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <div>
                  <h2 className="font-display text-lg font-extrabold text-[#111c29]">
                    {step === 'phone' ? 'लॉगिन करें / Shipper Login' : step === 'otp' ? 'Enter OTP • ओटीपी' : 'Create Account • नया खाता'}
                  </h2>
                  <p className="font-body text-xs text-[#5A6578] mt-0.5">
                    {step === 'phone' ? 'Enter your 10-digit mobile number' : step === 'otp' ? 'Enter 6-digit verification code' : 'New user — enter your name to register'}
                  </p>
                </div>
                <div className="flex items-center px-2.5 py-1 bg-[#E6F4F1] text-[#0F6E56] rounded-full font-display text-[11px] font-bold space-x-1">
                  <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                  <span>Secure</span>
                </div>
              </div>

              {step === 'phone' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="font-display text-xs font-bold text-[#5A6578]">Mobile Number • मोबाइल नंबर</label>
                    <div className="flex items-center h-14 bg-[#F8F9FA] border border-slate-200 rounded-xl px-3.5 shadow-xs focus-within:border-[#0F6E56] focus-within:bg-white transition-all">
                      <div className="flex items-center space-x-1.5 pr-2 text-[#111c29] font-display text-sm font-bold">
                        <span>🇮🇳</span><span>+91</span>
                      </div>
                      <div className="h-6 w-px bg-slate-300 mx-2" />
                      <input
                        className="w-full bg-transparent font-display text-sm text-[#111c29] outline-none font-bold tracking-wider"
                        inputMode="numeric" maxLength={10} value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98765 43210" type="tel" required
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full h-14 bg-[#0F6E56] hover:bg-[#0B5240] text-white rounded-xl font-display text-sm font-extrabold flex items-center justify-center space-x-2 shadow-md active:scale-[0.99] transition-all">
                    <span>Get OTP • ओटीपी भेजें</span>
                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                  </button>
                </form>
              ) : step === 'otp' ? (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="flex items-center justify-between bg-[#E6F4F1] p-3 rounded-xl border border-emerald-200">
                    <div className="flex items-center space-x-2">
                      <span className="material-symbols-outlined text-[#0F6E56] text-lg">sms</span>
                      <span className="font-display text-xs text-[#111c29] font-bold">+91 {phone}</span>
                    </div>
                    <button type="button" onClick={() => setStep('phone')} className="font-display text-[11px] text-[#0F6E56] font-bold px-2 py-1 bg-white rounded-lg shadow-xs">बदलें (Edit)</button>
                  </div>
                  <div className="bg-[#E6F4F1] border border-[#0F6E56]/30 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="material-symbols-outlined text-[#0F6E56] text-sm">key</span>
                      <span className="font-display text-xs text-[#0F6E56] font-bold">
                        Demo OTP: Enter any 6 digits (e.g. 1 2 3 4 5 6)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtp(['1', '2', '3', '4', '5', '6'])}
                      className="text-[11px] font-bold px-2 py-1 bg-[#0F6E56] text-white rounded-md shadow-xs active:scale-95"
                    >
                      Auto-fill
                    </button>
                  </div>

                  <div className="grid grid-cols-6 gap-2">
                    {otp.map((digit, idx) => (
                      <input key={idx}
                        className="py-3 bg-[#F8F9FA] border border-slate-200 text-center font-display text-lg text-[#111c29] font-extrabold rounded-xl shadow-xs focus:bg-white focus:border-[#0F6E56] outline-none"
                        inputMode="numeric" maxLength={1} value={digit}
                        onChange={(e) => { const n = [...otp]; n[idx] = e.target.value; setOtp(n); }}
                        type="tel"
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-[#64748B] flex items-center space-x-1 text-[11px]">
                      <span className="material-symbols-outlined text-sm">timer</span>
                      <span>Resend in: <strong className="text-[#111c29]">00:{timer.toString().padStart(2, '0')}</strong></span>
                    </span>
                    <button type="button" disabled={timer > 0} onClick={() => setTimer(28)} className={`font-display text-xs font-bold ${timer > 0 ? 'text-slate-400' : 'text-[#0F6E56] hover:underline'}`}>
                      पुनः भेजें (Resend)
                    </button>
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full h-14 bg-[#0F6E56] hover:bg-[#0B5240] disabled:opacity-60 text-white rounded-xl font-display text-sm font-extrabold flex items-center justify-center space-x-2 shadow-md active:scale-[0.99] transition-all">
                    <span>{isLoading ? 'Verifying...' : 'Verify & Enter App • आगे बढ़ें'}</span>
                  </button>
                  {error && <p className="text-red-500 text-xs text-center font-display">{error}</p>}
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-xs font-display text-blue-800 font-semibold">
                    👋 New user! Please enter your name to create your account.
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="font-display text-xs font-bold text-[#5A6578]">Your Name • आपका नाम</label>
                    <input className="h-12 bg-[#F8F9FA] border border-slate-200 rounded-xl px-4 font-display text-sm text-[#111c29] outline-none focus:border-[#0F6E56] focus:bg-white"
                      value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" required />
                  </div>
                  <button type="submit" disabled={isLoading} className="w-full h-14 bg-[#0F6E56] hover:bg-[#0B5240] disabled:opacity-60 text-white rounded-xl font-display text-sm font-extrabold flex items-center justify-center space-x-2 shadow-md active:scale-[0.99] transition-all">
                    <span>{isLoading ? 'Creating account...' : 'Create Account • खाता बनाएं'}</span>
                  </button>
                  {error && <p className="text-red-500 text-xs text-center font-display">{error}</p>}
                </form>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
