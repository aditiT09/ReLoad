import React from 'react';
import { ScreenType, DriverProfile, Vehicle } from '../types';
import { 
  Truck, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface HeaderBarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  driver: DriverProfile;
  activeVehicle: Vehicle;
  isOnline: boolean;
  onToggleOnline: () => void;
}

export const SCREEN_TITLES: Record<ScreenType, string> = {
  login: 'Driver Sign In',
  signup: 'Driver Registration',
  otp: 'Enter Quick Code',
  verification_status: 'Verification Status',
  home: 'Job Requests',
  active_trip: 'Active Trip',
  handoff: 'Cargo Handoff',
  chat: 'Trip Chat',
  trust_score: 'Trust & Ratings',
  history: 'Trip History',
  profile: 'Driver Profile',
};

export const SCREEN_FLOW_ORDER: ScreenType[] = [
  'login',
  'signup',
  'otp',
  'verification_status',
  'home',
  'active_trip',
  'handoff',
  'chat',
  'trust_score',
  'history',
  'profile',
];

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentScreen,
  onNavigate,
  driver,
  activeVehicle,
  isOnline,
  onToggleOnline,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  // If in login or otp screen, show clean minimalist header
  if (currentScreen === 'login' || currentScreen === 'otp') {
    return (
      <header className="bg-ink text-surface px-4 py-3 flex items-center justify-between border-b border-white/10 shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-card text-base">
            <Truck className="w-5 h-5 text-card" />
          </div>
          <span className="font-display font-bold tracking-tight text-lg text-card">DRIVER</span>
        </div>
        <div className="text-xs text-white/60 bg-white/10 px-2.5 py-1 rounded font-medium">
          {SCREEN_TITLES[currentScreen]}
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="bg-ink text-surface sticky top-0 z-30 shadow-md border-b border-white/10 select-none">
        <div className="max-w-3xl mx-auto px-3.5 py-2.5 flex items-center justify-between">
          {/* Driver identity & callsign */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <button 
              onClick={() => onNavigate('profile')} 
              className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              aria-label="View Profile"
            >
              <img 
                src={driver.avatarUrl} 
                alt={driver.fullName} 
                className="w-10 h-10 rounded-full object-cover border-2 border-primary"
              />
              <span 
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-ink ${
                  isOnline ? 'bg-status-verified' : 'bg-status-warning'
                }`} 
              />
            </button>

            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-bold text-card text-base tracking-tight truncate">
                  {driver.fullName}
                </span>
                <span className="text-[11px] font-semibold bg-primary/40 text-primary-tint px-1.5 py-0.5 rounded border border-primary/60">
                  {driver.callSign}
                </span>
              </div>
              <div className="text-xs text-white/70 truncate flex items-center space-x-1">
                <span className="truncate">{activeVehicle.type}</span>
                <span>•</span>
                <span className="font-mono text-white/90">{activeVehicle.licensePlate}</span>
                {activeVehicle.isReeferCertified && (
                  <span className="inline-block px-1 py-0.2 rounded text-[10px] bg-regulated-cargo-tint text-regulated-cargo font-bold">
                    COLD
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Menu button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleOnline}
              className={`touch-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer ${
                isOnline 
                  ? 'bg-status-verified text-card hover:bg-primary-dark' 
                  : 'bg-status-warning text-ink hover:bg-amber-600'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-card animate-pulse" />
              <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-card active:bg-white/20 transition-colors cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Quick Screen Title Banner */}
        <div className="bg-admin-shell px-3.5 py-1.5 border-t border-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-white/80">
            <span className="text-white/40">Step:</span>
            <span className="font-semibold text-card">{SCREEN_TITLES[currentScreen]}</span>
          </div>
          <button 
            onClick={() => setMenuOpen(true)} 
            className="text-[11px] text-regulated-cargo hover:underline font-medium cursor-pointer"
          >
            All 10 Screens ▾
          </button>
        </div>
      </header>

      {/* Screen Selection Modal / Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="bg-ink text-card w-full max-w-sm h-full shadow-2xl flex flex-col p-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h2 className="font-display font-bold text-lg text-card">Driver App Flow</h2>
                <p className="text-xs text-white/60">Strict flow order (login to profile)</p>
              </div>
              <button 
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg bg-white/10 text-card cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3 space-y-1.5 flex-1">
              {SCREEN_FLOW_ORDER.map((s, idx) => {
                const isActive = currentScreen === s;
                return (
                  <button
                    key={s}
                    onClick={() => {
                      onNavigate(s);
                      setMenuOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                      isActive 
                        ? 'bg-primary text-card font-bold shadow' 
                        : 'bg-white/5 hover:bg-white/10 text-white/85'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                        isActive ? 'bg-card text-primary' : 'bg-white/10 text-white/60'
                      }`}>
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-sm">{SCREEN_TITLES[s]}</div>
                        <div className="text-[11px] text-white/50">
                          {s === 'verification_status' && 'Driver docs & vehicle suitability'}
                          {s === 'home' && 'Nearby jobs & vehicle check'}
                          {s === 'active_trip' && 'Live route & surcharge requests'}
                          {s === 'handoff' && 'Chain of custody & dropoff code'}
                          {s === 'chat' && 'Fast one-handed text chips'}
                          {s === 'trust_score' && 'Ratings & compliance'}
                          {s === 'history' && 'Confirmed fares & surcharges'}
                          {s === 'profile' && 'Vehicle specs & certifications'}
                          {s === 'login' && 'Driver phone sign in'}
                          {s === 'otp' && 'One-time security code'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/40" />
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-white/10 mt-3 text-xs text-white/50 flex justify-between items-center">
              <span>{driver.fullName} • Reefer {driver.callSign}</span>
              <button 
                onClick={() => {
                  onNavigate('login');
                  setMenuOpen(false);
                }}
                className="text-status-critical hover:underline font-bold cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
