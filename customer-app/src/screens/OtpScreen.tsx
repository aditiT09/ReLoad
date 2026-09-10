import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OtpScreen: React.FC = () => {
  const navigate = useNavigate();
  const { loginPhone, verifyOtp, t } = useApp();
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState<number>(24);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, val: string) => {
    const char = val.slice(-1);
    if (!/^\d*$/.test(char)) return;

    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setErrorMsg('');

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d+$/.test(pastedData)) return;

    const cleanPasted = pastedData.slice(0, 6).split('');
    const newDigits = [...digits];
    cleanPasted.forEach((d, i) => {
      if (i < 6) newDigits[i] = d;
    });
    setDigits(newDigits);

    const nextIndex = Math.min(cleanPasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const isComplete = digits.every(d => d.length === 1);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;

    setIsLoading(true);
    const code = digits.join('');

    setTimeout(() => {
      setIsLoading(false);
      const success = verifyOtp(code);
      if (success) {
        navigate('/book');
      } else {
        setErrorMsg('Invalid code. Please try again or resend.');
      }
    }, 450);
  };

  const handleResend = () => {
    setResendTimer(24);
    setDigits(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const displayPhone = loginPhone 
    ? `+91 ${loginPhone.slice(0, 5)} ${loginPhone.slice(5)}` 
    : '+91 98201 44820';

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 sm:p-6 bg-surface">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-ink p-6 text-card border-b border-neutral-state/30">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-xs text-border hover:text-card flex items-center space-x-1 mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </button>

          <h1 className="font-condensed font-bold text-2xl text-card">
            {t.otp.title}
          </h1>
          <p className="text-xs text-border mt-1 leading-relaxed">
            {t.otp.subtitle}
          </p>

          <div className="mt-4 flex items-center justify-between text-xs bg-admin-shell px-3.5 py-2.5 rounded-xl border border-neutral-state/30">
            <span className="text-border">
              {t.otp.sentTo}: <strong className="text-card font-mono">{displayPhone}</strong>
            </span>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-regulated-cargo hover:underline text-[11px] font-semibold"
            >
              {t.otp.editNumber}
            </button>
          </div>
        </div>

        {/* 6-Digit Verification Body */}
        <form onSubmit={handleVerify} className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold text-ink text-center mb-4">
              Enter 6-digit code
            </label>

            {/* 6 Box Inputs */}
            <div className="flex justify-between gap-2 sm:gap-2.5" onPaste={handlePaste}>
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => { inputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  disabled={isLoading}
                  className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                    digit 
                      ? 'border-primary bg-primary-tint text-ink' 
                      : 'border-border bg-surface text-ink'
                  }`}
                />
              ))}
            </div>

            {errorMsg && (
              <p className="mt-3 text-xs text-center text-status-critical font-medium">{errorMsg}</p>
            )}

            <p className="mt-3 text-[11px] text-center text-muted">
              Demo hint: any 6 digits (e.g. 123456) will verify successfully.
            </p>
          </div>

          {/* Resend Countdown */}
          <div className="text-center">
            {resendTimer > 0 ? (
              <span className="text-xs text-muted">
                {t.otp.resendIn} <strong className="font-mono text-ink">{resendTimer}s</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-xs font-bold text-primary hover:underline flex items-center justify-center space-x-1 mx-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.otp.resendNow}</span>
              </button>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            id="btn-otp-verify"
            disabled={!isComplete || isLoading}
            className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-card shadow-md transition-all flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary ${
              isComplete && !isLoading
                ? 'bg-primary hover:bg-primary-dark active:scale-[0.99] cursor-pointer'
                : 'bg-neutral-state cursor-not-allowed opacity-60'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t.otp.verifying}</span>
              </div>
            ) : (
              <>
                <span>{t.otp.verifyButton}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
