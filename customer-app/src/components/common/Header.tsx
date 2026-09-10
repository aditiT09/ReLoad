import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck, Globe, ChevronDown, Radio, Lock,
  Truck, Info, Navigation, User, Menu, X, Users, LayoutDashboard
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';
import { SupportedLanguage } from '../../types';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentBooking, language, setLanguage, t } = useApp();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  const handleLangSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setLangMenuOpen(false);
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/otp';
  const isLandingOrAbout = location.pathname === '/' || location.pathname === '/about';

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Main nav links
  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Book Cargo', path: '/book' },
    { label: 'Live Trip', path: '/trip' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-card text-ink border-b border-border shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">

          {/* ── Brand ── */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-left focus:outline-none rounded-md px-1 py-0.5 shrink-0 cursor-pointer"
            aria-label="Reload Home"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-lg text-card shadow-inner select-none">
              R
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-xl tracking-wide uppercase text-ink">
                RELOAD
              </span>
              <span className="hidden sm:inline-flex items-center space-x-0.5 text-[10px] uppercase font-semibold px-1.5 py-0.5 bg-primary-tint text-primary border border-primary/30 rounded">
                <Lock className="w-2.5 h-2.5" />
                <span>LOCKED FARE</span>
              </span>
            </div>
          </button>

          {/* ── Desktop Nav Links ── */}
          <nav className="hidden md:flex items-center space-x-1 flex-1 justify-center">
            {navLinks.map(({ label, path }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  isActive(path)
                    ? 'bg-primary-tint text-primary border border-primary/30 font-bold'
                    : 'text-muted hover:text-ink hover:bg-surface'
                }`}
              >
                {label}
              </button>
            ))}

            {/* Active trip chip */}
            {!isAuthPage && !isLandingOrAbout && (
              <button
                onClick={() => navigate('/trip')}
                className="hidden lg:flex items-center space-x-1.5 text-xs bg-surface hover:bg-border/60 px-2.5 py-1 rounded-xl border border-border transition-colors cursor-pointer"
                title="View Active Trip"
              >
                <Radio className="w-3 h-3 text-primary animate-pulse" />
                <span className="text-muted">Trip:</span>
                <span className="font-mono font-bold text-ink">#{currentBooking.consignmentId}</span>
                <span className="capitalize text-regulated-cargo text-[11px] font-medium ml-1">
                  ({currentBooking.status.replace('_', ' ')})
                </span>
              </button>
            )}
          </nav>

          {/* ── Right Controls ── */}
          <div className="flex items-center space-x-2 shrink-0">

            {/* Driver Hub */}
            <button
              onClick={() => navigate('/driver')}
              className="hidden sm:inline-flex items-center space-x-1.5 text-xs bg-primary-tint hover:bg-primary-tint/80 border border-primary/30 text-primary font-bold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Driver Hub</span>
            </button>

            {/* Admin Console */}
            <button
              onClick={() => navigate('/admin')}
              className="hidden sm:inline-flex items-center space-x-1.5 text-xs bg-surface hover:bg-border/60 border border-border text-ink font-semibold px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
              title="Admin Console"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-status-warning" />
              <span className="text-[11px]">Admin</span>
            </button>

            {/* Profile */}
            <button
              onClick={() => navigate('/profile')}
              className={`hidden sm:flex items-center justify-center w-8 h-8 rounded-lg border transition-colors cursor-pointer ${
                isActive('/profile')
                  ? 'bg-primary-tint border-primary/30 text-primary'
                  : 'bg-surface border-border text-muted hover:text-ink'
              }`}
              title="Profile"
            >
              <User className="w-4 h-4" />
            </button>

            {/* GPS live pill */}
            <div className="hidden sm:flex items-center space-x-1.5 text-[11px] text-muted bg-surface px-2.5 py-1 rounded-lg border border-border">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_var(--color-primary)]" />
              <span className="text-ink font-medium">GPS Live</span>
            </div>

            {/* Language selector */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center space-x-1.5 text-xs bg-surface hover:bg-border/60 text-ink px-2.5 py-1.5 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-colors cursor-pointer"
                aria-label="Select Language"
                aria-expanded={langMenuOpen}
              >
                <Globe className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium hidden sm:inline">{currentLangObj.nativeName}</span>
                <ChevronDown className={`w-3 h-3 text-muted transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {langMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl py-1 z-50"
                  role="menu"
                >
                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-muted border-b border-border">
                    Select Language
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLangSelect(lang.code)}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-surface transition-colors cursor-pointer ${
                        language === lang.code ? 'text-primary font-bold bg-primary-tint/40' : 'text-ink'
                      }`}
                      role="menuitem"
                    >
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] text-muted">{lang.englishName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-surface border border-border text-muted hover:text-ink transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-card border-t border-border px-4 py-3 space-y-1">
            {navLinks.map(({ label, path }) => (
              <button
                key={path}
                onClick={() => { navigate(path); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  isActive(path)
                    ? 'bg-primary-tint text-primary font-bold border border-primary/30'
                    : 'text-muted hover:bg-surface hover:text-ink'
                }`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => { navigate('/driver'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-primary bg-primary-tint border border-primary/30 cursor-pointer"
            >
              🚛 Driver Hub
            </button>
            <button
              onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-status-warning bg-status-warning-tint/20 border border-status-warning/30 cursor-pointer"
            >
              📊 Admin Console
            </button>
            <button
              onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                isActive('/profile')
                  ? 'bg-primary-tint text-primary'
                  : 'text-muted hover:bg-surface hover:text-ink'
              }`}
            >
              Profile
            </button>
          </div>
        )}
      </header>
    </>
  );
};
