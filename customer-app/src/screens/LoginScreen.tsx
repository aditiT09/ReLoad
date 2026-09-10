import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { loginPhone, login, t } = useApp();
  const [phoneNumber, setPhoneNumber] = useState(loginPhone || '9820144820');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Validate clean 10-digit number
  const cleanDigits = phoneNumber.replace(/\D/g, '');
  const isValid = cleanDigits.length === 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    login(cleanDigits);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/otp');
    }, 450);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 sm:p-6 bg-surface">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        {/* Brand Header */}
        <div className="bg-ink p-6 text-card border-b border-neutral-state/30">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-card font-condensed font-bold text-2xl shadow-md">
              R
            </div>
            <div>
              <span className="font-condensed font-bold text-2xl uppercase tracking-wider text-card">
                RELOAD
              </span>
              <span className="block text-[11px] text-border font-medium">
                Locked Fare Cargo Transport
              </span>
            </div>
          </div>
          <h1 className="font-condensed font-bold text-2xl text-card mt-2">
            {t.login.title}
          </h1>
          <p className="text-xs text-border mt-1 leading-relaxed">
            {t.login.subtitle}
          </p>
        </div>

        {/* Clean Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label 
              htmlFor="phone-input" 
              className="block text-xs font-semibold text-ink mb-2"
            >
              {t.login.phoneLabel}
            </label>

            {/* Clean Mobile Input with fixed +91 prefix */}
            <div className="flex rounded-xl border border-border focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent bg-surface overflow-hidden transition-all">
              <div className="flex items-center px-3.5 bg-neutral-state-tint border-r border-border text-xs font-bold text-ink select-none">
                <span>🇮🇳 +91</span>
              </div>

              <div className="relative flex-1 flex items-center">
                <input
                  id="phone-input"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder={t.login.phonePlaceholder}
                  maxLength={10}
                  className="w-full px-3.5 py-3 text-sm font-mono tracking-wider text-ink bg-transparent focus:outline-none"
                  disabled={isLoading}
                />
                {isValid && (
                  <div className="pr-3 text-status-verified">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>

            {errorMsg ? (
              <p className="mt-1.5 text-xs text-status-critical font-medium">{errorMsg}</p>
            ) : (
              <p className="mt-1.5 text-[11px] text-muted">
                We'll send a 6-digit one-time password to verify your phone.
              </p>
            )}
          </div>

          {/* Locked Fare reassurance badge */}
          <div className="p-3 bg-primary-tint border border-primary/30 rounded-xl flex items-start space-x-2.5 text-xs text-ink">
            <Lock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span className="text-[11px] text-primary font-medium leading-relaxed">
              <strong>Locked Fare Guarantee:</strong> The rate you see is the rate you pay. No sudden surges or unexpected fees.
            </span>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            id="btn-login-submit"
            disabled={!isValid || isLoading}
            className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-card shadow-md transition-all flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary ${
              isValid && !isLoading
                ? 'bg-primary hover:bg-primary-dark active:scale-[0.99] cursor-pointer'
                : 'bg-neutral-state cursor-not-allowed opacity-60'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t.login.transmitting}</span>
              </div>
            ) : (
              <>
                <span>{t.login.sendCode}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-muted pt-1">
            {t.login.termsNotice}
          </p>
        </form>
      </div>
    </div>
  );
};
