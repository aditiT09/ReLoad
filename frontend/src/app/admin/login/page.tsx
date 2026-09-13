'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, setToken } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [operatorId, setOperatorId] = useState('');
  const [authPin, setAuthPin] = useState('');
  const [hubNode, setHubNode] = useState('west-corridor');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!operatorId || !authPin) { setError('Enter operator ID and PIN'); return; }
    setIsLoading(true);
    setError('');
    try {
      const result = await auth.login({ phone: operatorId, password: authPin });
      setToken(result.access_token);
      router.push('/admin/dashboard');
    } catch {
      // Try signup as company_admin
      try {
        const result = await auth.signup({
          role: 'company_admin',
          name: operatorId,
          phone: operatorId,
          password: authPin,
        });
        setToken(result.access_token);
        router.push('/admin/dashboard');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-[#F8F9FA] font-body text-[#111c29] antialiased min-h-screen flex flex-col justify-center items-center p-4 selection:bg-[#E6F4F1] selection:text-[#0F6E56]">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Hero Graphic Section */}
        <div className="lg:col-span-7 bg-[#0F172A] p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80')",
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-[#0F172A]/40 mix-blend-multiply"></div>

          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-display text-xs tracking-wider uppercase text-emerald-300 font-bold">
                Corridor Grid Operational
              </span>
            </div>
            <h1 className="font-display text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              ReLoad Operational Logistics Hub
            </h1>
            <p className="text-slate-300 text-sm max-w-md">
              Centralized Fleet Telematics &amp; Surcharge Compliance Dispatch Engine
            </p>
          </div>

          {/* Flow Sparkline Chart */}
          <div className="relative z-10 my-6 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span className="font-display uppercase tracking-wider font-semibold">
                Live Interstate Route Load Factor
              </span>
              <span className="text-emerald-300 flex items-center gap-1 font-bold">
                <span className="material-symbols-outlined text-sm">sensors</span> Realtime Sync
              </span>
            </div>
            <svg className="w-full h-10 text-emerald-400" fill="none" preserveAspectRatio="none" viewBox="0 0 460 50">
              <path
                d="M0 38 L60 30 L110 35 L170 18 L220 24 L280 10 L340 22 L400 8 L460 14"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
              ></path>
            </svg>
            <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 font-display">
              <span>JNPT Gateway Hub</span>
              <span className="text-emerald-300 font-bold">Toll Surcharge Index: Stable</span>
              <span>NCR Logistics Park</span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="relative z-10 grid grid-cols-3 gap-3">
            <div className="bg-[#0F172A]/80 backdrop-blur-md p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold block">
                Corridors
              </span>
              <span className="font-display text-lg font-extrabold text-white">1,420+</span>
            </div>
            <div className="bg-[#0F172A]/80 backdrop-blur-md p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold block">
                Active Reefer
              </span>
              <span className="font-display text-lg font-extrabold text-white">99.8%</span>
            </div>
            <div className="bg-[#0F172A]/80 backdrop-blur-md p-3 rounded-xl border border-slate-700">
              <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold block">
                ULIP Sync
              </span>
              <span className="font-display text-lg font-extrabold text-white">&lt; 12ms</span>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#0F6E56] flex items-center justify-center text-white font-bold shadow-sm">
                <span className="material-symbols-outlined text-2xl">admin_panel_settings</span>
              </div>
              <div>
                <h2 className="font-display text-base font-extrabold text-[#111c29]">Operations Login</h2>
                <p className="text-[11px] text-[#5A6578]">Dispatcher &amp; Terminal Control</p>
              </div>
            </div>
            <Link
              href="/landing"
              className="text-xs text-[#5A6578] hover:text-[#0F6E56] font-display font-semibold"
            >
              Back
            </Link>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 my-6">
            <div>
              <label className="font-display text-xs font-bold text-[#111c29] block mb-1">
                Regional Hub / Terminal Node
              </label>
              <select
                value={hubNode}
                onChange={(e) => setHubNode(e.target.value)}
                className="w-full h-11 px-3 bg-[#F8F9FA] border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F6E56]"
              >
                <option value="west-corridor">West Corridor (Mumbai - Pune - Vapi)</option>
                <option value="north-corridor">North Corridor (Delhi NCR - Jaipur)</option>
                <option value="south-corridor">South Corridor (Bengaluru - Chennai - Hyd)</option>
                <option value="east-corridor">East Corridor (Kolkata - Haldia - Asansol)</option>
              </select>
            </div>

            <div>
              <label className="font-display text-xs font-bold text-[#111c29] block mb-1">
                Operator ID / Dispatcher Token
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-slate-400 text-lg absolute left-3">badge</span>
                <input
                  type="text"
                  value={operatorId}
                  onChange={(e) => setOperatorId(e.target.value)}
                  className="w-full h-11 pl-10 pr-3 bg-[#F8F9FA] border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F6E56]"
                  placeholder="e.g. DISPATCH-MUM-09"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-display text-xs font-bold text-[#111c29] block mb-1">
                2FA Hardware PIN / Security Key
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-slate-400 text-lg absolute left-3">lock</span>
                <input
                  type="password"
                  value={authPin}
                  onChange={(e) => setAuthPin(e.target.value)}
                  className="w-full h-11 pl-10 pr-3 bg-[#F8F9FA] border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F6E56]"
                  placeholder="••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-1.5 text-[#5A6578] cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#0F6E56]" />
                <span>Keep terminal session active</span>
              </label>
              <a href="#" className="text-[#0F6E56] font-display font-semibold hover:underline">
                Hardware Token Help?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-13 min-h-[52px] bg-[#0F6E56] hover:bg-[#0B5240] text-white rounded-xl font-display text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg active:scale-[0.99] transition-all"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-xl animate-spin">refresh</span>
                  <span>Authenticating Dispatch Node...</span>
                </>
              ) : (
                <>
                  <span>Authenticate &amp; Open Console</span>
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </>
              )}
            </button>
            {error && <p className="text-red-500 text-xs text-center font-display mt-2">{error}</p>}
          </form>

          <div className="text-center text-[11px] text-[#5A6578] border-t border-slate-100 pt-3 space-y-1">
            <p className="font-semibold">ISO 27001 &amp; National Freight ULIP Protocol Secured</p>
            <p>24x7 Operations Support: ext 8800 (Control Room)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
