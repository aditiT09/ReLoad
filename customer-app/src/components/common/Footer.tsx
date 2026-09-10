import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock, ShieldCheck, Globe, Truck, Users,
  Phone, Mail, MapPin, ArrowRight, LayoutDashboard
} from 'lucide-react';
import { reloadTokens } from '../../theme/tokens';

const SHIPPER_LINKS = [
  { label: 'Book Cargo', path: '/book' },
  { label: 'Vehicle Selection', path: '/vehicles' },
  { label: 'Live Trip Tracking', path: '/trip' },
  { label: 'Trip History', path: '/trips' },
  { label: 'Payment & Escrow', path: '/payment' },
  { label: 'File a Report', path: '/report' },
];

const DRIVER_LINKS = [
  { label: 'Driver Hub', path: '/driver' },
  { label: 'Available Jobs', path: '/driver' },
  { label: 'Active Trip', path: '/driver' },
  { label: 'Trust Score', path: '/driver' },
  { label: 'Driver Profile', path: '/profile' },
];

const COMPANY_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About Reload', path: '/about' },
  { label: 'Admin Console', path: '/admin' },
  { label: 'Compliance Standards', path: '/about' },
  { label: 'Driver Welfare', path: '/about' },
  { label: 'Partner With Us', path: '/about' },
];

const COMPLIANCE_BADGES = [
  { label: 'VAHAN 4.0', color: reloadTokens.statusVerified },
  { label: 'WHO-GDP', color: reloadTokens.regulatedCargo },
  { label: 'FASTag NPCI', color: reloadTokens.primary },
  { label: 'GST e-Waybill', color: reloadTokens.statusWarning },
  { label: 'Aadhaar KYC', color: reloadTokens.neutralState },
];

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-card text-ink border-t border-border">
      {/* ── Main footer grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 mb-4 cursor-pointer"
              aria-label="Reload Home"
            >
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center font-bold text-xl text-card shadow-inner select-none">
                R
              </div>
              <div>
                <div className="font-bold text-xl tracking-wide uppercase text-ink">RELOAD</div>
                <div className="text-[10px] text-primary font-semibold flex items-center space-x-1">
                  <Lock className="w-2.5 h-2.5" />
                  <span>LOCKED FARE GUARANTEE</span>
                </div>
              </div>
            </button>

            <p className="text-xs text-muted leading-relaxed mb-5 max-w-xs">
              India's first freight platform with cryptographic locked fares, real-time IoT cold-chain telemetry, and VAHAN-verified driver Trust Scores.
            </p>

            {/* Compliance badges */}
            <div className="flex flex-wrap gap-2">
              {COMPLIANCE_BADGES.map(b => (
                <span
                  key={b.label}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                  style={{ color: b.color, borderColor: `${b.color}35`, background: `${b.color}15` }}
                >
                  {b.label}
                </span>
              ))}
            </div>
          </div>

          {/* For Shippers */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Truck className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-ink">
                For Shippers
              </h3>
            </div>
            <ul className="space-y-2.5">
              {SHIPPER_LINKS.map(({ label, path }) => (
                <li key={label}>
                  <button
                    onClick={() => navigate(path)}
                    className="text-sm text-muted hover:text-primary transition-colors cursor-pointer text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* For Drivers */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-ink">
                For Drivers
              </h3>
            </div>
            <ul className="space-y-2.5">
              {DRIVER_LINKS.map(({ label, path }) => (
                <li key={label}>
                  <button
                    onClick={() => navigate(path)}
                    className="text-sm text-muted hover:text-primary transition-colors cursor-pointer text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="w-4 h-4 text-regulated-cargo" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-ink">
                Company & Operations
              </h3>
            </div>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map(({ label, path }) => (
                <li key={label}>
                  <button
                    onClick={() => navigate(path)}
                    className="text-sm text-muted hover:text-primary transition-colors cursor-pointer text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Contact */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center space-x-2 text-xs text-muted">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>ops@reload.in</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>1800-RELOAD-1 (Toll-free)</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Mumbai • Bengaluru • Hyderabad</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom CTA strip ── */}
      <div className="border-t border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-muted text-center sm:text-left">
            © 2026 Reload Logistics Technologies Pvt. Ltd. · All rights reserved.
            <span className="mx-2">·</span>
            <span className="text-primary font-semibold">VAHAN 4.0 Verified Platform</span>
            <span className="mx-2">·</span>
            <span>Made for India's Highways 🇮🇳</span>
          </div>
          <button
            onClick={() => navigate('/book')}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary hover:text-primary-dark transition-colors cursor-pointer"
          >
            <span>Book Cargo — Locked Fare</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
