import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Star, Truck, LogOut, User, Globe,
  Check, MapPin, Headphones, Sliders, Lock, TrendingUp,
  Award, BadgeCheck, Zap, Building2, CreditCard, Clock, LayoutDashboard
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';
import { reloadTokens } from '../theme/tokens';

// ── Mock driver profile data (mirrors driver app) ─────────────────────────
const DRIVER_PROFILE = {
  fullName: 'Rajesh Kumar',
  phone: '+91 98201 44820',
  initials: 'RK',
  company: 'Apex Logistics Corp (Tier 1)',
  vehicleReg: 'MH-04-GP-8192',
  vehicleName: 'Tata 407 LPT Reefer Van',
  vahanVerified: true,
  aadhaarMatched: true,
  trustScore: 980,
  totalTrips: 1482,
  rating: 4.92,
  monthlyEarnings: '₹1,84,200',
  tier: 'Platinum Driver',
  tierColor: reloadTokens.statusWarning,
  certifications: [
    { label: 'Reefer Certified', status: 'verified', color: reloadTokens.regulatedCargo },
    { label: 'VAHAN 4.0', status: 'verified', color: reloadTokens.statusVerified },
    { label: 'Aadhaar KYC', status: 'verified', color: reloadTokens.statusVerified },
    { label: 'Hazmat', status: 'verified', color: reloadTokens.statusWarning },
    { label: 'Commercial DL', status: 'verified', color: reloadTokens.primary },
  ],
  bankAccount: '••••  ••••  ••••  4820',
  bankName: 'SBI Main Branch, Dadar',
  recentEarnings: [
    { trip: 'RL-9842', route: 'Bhiwandi → Bengaluru', amount: '₹34,800', date: 'Active Now' },
    { trip: 'RL-9104', route: 'Vapi → Peenya', amount: '₹42,800', date: 'Yesterday' },
    { trip: 'RL-8921', route: 'Sanand → Chakan', amount: '₹51,200', date: '04 Sep 2026' },
  ],
};

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { customer, language, setLanguage, logout, t } = useApp();
  const [activeTab, setActiveTab] = useState<'shipper' | 'driver'>('shipper');

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-5">

      {/* ── Persona Toggle ── */}
      <div className="flex items-center justify-center">
        <div className="inline-flex bg-surface border border-border rounded-xl p-1">
          {(['shipper', 'driver'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-ink text-card shadow'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {tab === 'shipper' ? '🏭 Shipper Profile' : '🚛 Driver Profile'}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          SHIPPER PROFILE
      ══════════════════════════════════════════════ */}
      {activeTab === 'shipper' && (
        <>
          {/* Customer Header Card */}
          <div className="bg-ink text-card rounded-2xl p-6 border border-border/20 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-primary text-card flex items-center justify-center font-bold text-2xl shadow-sm border border-card/20">
                  VS
                </div>
                <div>
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="font-bold text-2xl text-card">{customer.fullName}</span>
                    <span className="inline-flex items-center space-x-1 text-[10px] font-bold bg-primary-tint text-primary px-2 py-0.5 rounded border border-primary/40 uppercase">
                      <ShieldCheck className="w-3 h-3" />
                      <span>{t.profile.verifiedConsignor}</span>
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">{customer.phone} · {customer.companyName}</p>
                  <p className="text-[11px] text-muted mt-0.5">GSTIN: {customer.gstin}</p>
                </div>
              </div>

              {/* Sign out uses subtle outlined button per design system rule */}
              <button
                onClick={handleSignOut}
                className="self-start sm:self-auto text-xs text-muted hover:text-status-critical border border-border/40 hover:border-status-critical/40 px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-colors font-semibold cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.profile.signOut}</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div className="mt-5 pt-4 border-t border-border/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-card/10 p-3 rounded-xl border border-border/20">
                <span className="text-[10px] text-muted uppercase block">Trust Score</span>
                <span className="font-bold text-xl text-status-verified flex items-center space-x-1 mt-0.5">
                  <Star className="w-4 h-4 fill-status-warning text-status-warning" />
                  <span>{customer.trustScore}/1000</span>
                </span>
              </div>
              <div className="bg-card/10 p-3 rounded-xl border border-border/20">
                <span className="text-[10px] text-muted uppercase block">Trips Cleared</span>
                <span className="font-bold text-xl text-card mt-0.5 block">{customer.tripsCleared}</span>
              </div>
              <div className="bg-card/10 p-3 rounded-xl border border-border/20">
                <span className="text-[10px] text-muted uppercase block">Escrow Balance</span>
                <span className="font-bold text-xl text-regulated-cargo mt-0.5 block">
                  ₹{(customer.escrowCreditBalance / 100000).toFixed(1)}L
                </span>
              </div>
              <div className="bg-card/10 p-3 rounded-xl border border-border/20">
                <span className="text-[10px] text-muted uppercase block">On-Time SLA</span>
                <span className="font-bold text-xl text-status-verified mt-0.5 flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  <span>{customer.onTimeSlaPercent}%</span>
                </span>
              </div>
            </div>
          </div>

          {/* Saved Logistics Docks */}
          <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Saved Logistics Docks</h2>
            </div>
            <div className="space-y-3">
              {customer.savedDocks.map(dock => (
                <div key={dock.id} className="flex items-start space-x-3 p-3 bg-surface rounded-xl border border-border">
                  <div className="w-8 h-8 rounded-lg bg-primary-tint flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-ink">{dock.title}</div>
                    <div className="text-xs text-muted">{dock.address}</div>
                    <div className="text-xs text-muted">{dock.city} · {dock.contact}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Language Preference */}
          <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs">
            <div className="flex items-center space-x-2 mb-1">
              <Globe className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
                {t.profile.languageHeading}
              </h2>
            </div>
            <p className="text-xs text-muted mb-4">
              All screens and notifications update instantly.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between focus:outline-none cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-primary-tint ring-1 ring-primary'
                        : 'border-border hover:bg-surface'
                    }`}
                  >
                    <div>
                      <span className="text-sm font-bold text-ink block">{lang.nativeName}</span>
                      <span className="text-[11px] text-muted">{lang.englishName}</span>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-primary text-card flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Support & Dev Tools */}
          <div className="space-y-3">
            <div className="bg-card rounded-2xl p-5 border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-regulated-cargo-tint text-regulated-cargo flex items-center justify-center">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-ink block">24/7 Reload Customer Support</span>
                  <span className="text-xs text-muted">Need help with a booking or a fare dispute?</span>
                </div>
              </div>
              <button
                onClick={() => navigate('/chat')}
                className="px-4 py-2.5 bg-ink hover:bg-admin-shell text-card text-xs font-bold rounded-xl transition-colors self-start sm:self-auto cursor-pointer"
              >
                Open Chat
              </button>
            </div>

            <div className="p-4 bg-surface rounded-2xl border border-border flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2.5 text-muted">
                <Sliders className="w-4 h-4 text-primary" />
                <div>
                  <span className="font-bold text-ink block">
                    Developer Testing Simulator
                  </span>
                  <span className="text-[11px] text-muted">
                    Access trip stage simulator, surcharge triggers, and test tools.
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate('/debug')}
                className="px-3.5 py-1.5 bg-card hover:bg-surface text-ink font-bold rounded-lg border border-border transition-colors cursor-pointer"
              >
                Open Simulator
              </button>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════
          DRIVER PROFILE
      ══════════════════════════════════════════ */}
      {activeTab === 'driver' && (
        <>
          {/* Driver Header Card */}
          <div className="bg-ink text-card rounded-2xl p-6 border border-border/20 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-primary text-card flex items-center justify-center font-bold text-2xl shadow-sm border border-card/20">
                    {DRIVER_PROFILE.initials}
                  </div>
                  <div
                    className="absolute -bottom-1 -right-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full text-card"
                    style={{ background: DRIVER_PROFILE.tierColor }}
                  >
                    PLT
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <span className="font-bold text-2xl text-card">{DRIVER_PROFILE.fullName}</span>
                    <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded border uppercase bg-status-warning-tint/20 border-status-warning/40 text-status-warning">
                      <Award className="w-3 h-3" />
                      <span>{DRIVER_PROFILE.tier}</span>
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">{DRIVER_PROFILE.phone} · {DRIVER_PROFILE.company}</p>
                  <p className="text-[11px] text-muted mt-0.5">Vehicle: {DRIVER_PROFILE.vehicleReg} — {DRIVER_PROFILE.vehicleName}</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/driver')}
                className="self-start sm:self-auto text-xs text-primary-tint hover:bg-primary/20 border border-primary/30 px-3.5 py-2 rounded-xl flex items-center space-x-1.5 transition-colors font-semibold cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Open Driver Hub</span>
              </button>
            </div>

            {/* Driver Stats */}
            <div className="mt-5 pt-4 border-t border-border/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-card/10 p-3 rounded-xl border border-border/20">
                <span className="text-[10px] text-muted uppercase block">Trust Score</span>
                <span className="font-bold text-xl text-status-verified flex items-center space-x-1 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>{DRIVER_PROFILE.trustScore}/1000</span>
                </span>
              </div>
              <div className="bg-card/10 p-3 rounded-xl border border-border/20">
                <span className="text-[10px] text-muted uppercase block">Total Trips</span>
                <span className="font-bold text-xl text-card mt-0.5 block">{DRIVER_PROFILE.totalTrips}</span>
              </div>
              <div className="bg-card/10 p-3 rounded-xl border border-border/20">
                <span className="text-[10px] text-muted uppercase block">Driver Rating</span>
                <span className="font-bold text-xl text-status-warning mt-0.5 flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-status-warning" />
                  <span>{DRIVER_PROFILE.rating}</span>
                </span>
              </div>
              <div className="bg-card/10 p-3 rounded-xl border border-border/20">
                <span className="text-[10px] text-muted uppercase block">This Month</span>
                <span className="font-bold text-xl text-status-verified mt-0.5 block">{DRIVER_PROFILE.monthlyEarnings}</span>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs">
            <div className="flex items-center space-x-2 mb-4">
              <BadgeCheck className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Certifications & Verifications</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {DRIVER_PROFILE.certifications.map(cert => (
                <div
                  key={cert.label}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl border text-xs font-semibold"
                  style={{
                    color: cert.color,
                    borderColor: `${cert.color}40`,
                    background: `${cert.color}12`,
                  }}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{cert.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Earnings */}
          <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Recent Earnings</h2>
            </div>
            <div className="space-y-3">
              {DRIVER_PROFILE.recentEarnings.map(e => (
                <div key={e.trip} className="flex items-center justify-between p-3 bg-surface rounded-xl border border-border">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-tint flex items-center justify-center flex-shrink-0">
                      <Truck className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-mono text-xs font-bold text-ink">#{e.trip}</div>
                      <div className="text-xs text-muted">{e.route}</div>
                      <div className="text-[11px] text-muted flex items-center space-x-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{e.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="font-bold text-base text-primary">{e.amount}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bank Account */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-xs flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-regulated-cargo-tint text-regulated-cargo flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-ink block">Settlement Bank Account</span>
                <span className="font-mono text-sm text-muted">{DRIVER_PROFILE.bankAccount}</span>
                <span className="text-[11px] text-muted block">{DRIVER_PROFILE.bankName}</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-status-verified bg-status-verified-tint border border-status-verified/30 px-2.5 py-1 rounded-full">
              Verified ✓
            </span>
          </div>

          {/* Go to Driver Hub - Primary action uses Trust Teal */}
          <button
            onClick={() => navigate('/driver')}
            className="w-full py-4 bg-primary hover:bg-primary-dark text-card font-bold rounded-2xl shadow-md flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <Truck className="w-5 h-5" />
            <span>Open Driver Hub — See Available Jobs</span>
          </button>
        </>
      )}
    </div>
  );
};
