import React, { useState } from 'react';
import { Truck, ShieldCheck, ArrowRight, CheckCircle2, UserPlus, LogIn } from 'lucide-react';
import { DriverProfile } from '../types';

interface ScreenLoginProps {
  onLoginSuccess: (phoneEntered?: string) => void;
  onNavigateToSignup: () => void;
  driver: DriverProfile;
}

export const ScreenLogin: React.FC<ScreenLoginProps> = ({ 
  onLoginSuccess, 
  onNavigateToSignup, 
  driver 
}) => {
  const [phoneNumber, setPhoneNumber] = useState('98452 19820');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const formatted = phoneNumber.startsWith('+91') ? phoneNumber : `+91 ${phoneNumber}`;
      onLoginSuccess(formatted);
    }, 450);
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-between p-4 max-w-lg mx-auto select-none">
      {/* Top Brand & Context */}
      <div className="pt-2 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-md text-card">
            <Truck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-extrabold text-ink tracking-tight">
              Driver Dispatch
            </h1>
            <p className="text-xs font-semibold text-muted">
              Commercial Cargo & Cold-Chain Fleet
            </p>
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="bg-neutral-state-tint p-1 rounded-2xl flex items-center space-x-1 border border-border">
          <button
            type="button"
            className="flex-1 py-2.5 rounded-xl font-display font-bold text-xs bg-card text-primary shadow-sm transition-all text-center flex items-center justify-center space-x-1"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={onNavigateToSignup}
            className="flex-1 py-2.5 rounded-xl font-display font-bold text-xs text-muted hover:text-ink transition-all text-center flex items-center justify-center space-x-1 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account (Sign Up)</span>
          </button>
        </div>

        {/* Quick Driver Card */}
        <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              Active Driver Profile
            </span>
            <span className="inline-flex items-center space-x-1 text-xs font-bold text-status-verified bg-status-verified-tint px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Identity Verified</span>
            </span>
          </div>

          <div className="flex items-center space-x-3.5 mt-3">
            <img 
              src={driver.avatarUrl} 
              alt={driver.fullName} 
              className="w-12 h-12 rounded-full object-cover border-2 border-primary"
            />
            <div>
              <div className="font-display font-bold text-ink text-base">
                {driver.fullName}
              </div>
              <div className="text-xs text-muted flex items-center space-x-2 mt-0.5">
                <span className="font-semibold text-primary">{driver.callSign}</span>
                <span>•</span>
                <span>Trust Score: {driver.trustRating} ★</span>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Phone Entry Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-2">
              Registered Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted font-bold text-sm">
                +91
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="98452 19820"
                required
                className="w-full pl-13 pr-4 py-3.5 rounded-xl border-2 border-border focus:border-primary focus:outline-none text-base font-bold font-mono text-ink bg-card shadow-inner"
              />
            </div>
            <p className="text-xs text-muted mt-1.5">
              Single-use 4-digit verification code will be sent via SMS.
            </p>
          </div>
        </form>
      </div>

      {/* Thumb-friendly Big Bottom Action */}
      <div className="pt-6 pb-2 space-y-3">
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={isLoading}
          className="touch-btn w-full bg-primary hover:bg-primary-dark text-card font-display font-bold text-lg rounded-xl flex items-center justify-center space-x-2 py-4 shadow-md active:scale-[0.99] transition-all cursor-pointer"
        >
          {isLoading ? (
            <span className="flex items-center space-x-2">
              <span className="w-5 h-5 border-2 border-card border-t-transparent rounded-full animate-spin" />
              <span>Sending Code...</span>
            </span>
          ) : (
            <>
              <span>Send One-Time Code</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={onNavigateToSignup}
            className="text-xs font-bold text-primary hover:underline inline-flex items-center space-x-1 cursor-pointer"
          >
            <span>New commercial driver? Create an account / Sign Up</span>
            <span>→</span>
          </button>
        </div>

        <div className="text-center">
          <span className="text-xs text-muted flex items-center justify-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Encrypted Driver Authentication Session</span>
          </span>
        </div>
      </div>
    </div>
  );
};
