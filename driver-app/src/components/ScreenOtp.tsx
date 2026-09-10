import React, { useState } from 'react';
import { ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';

interface ScreenOtpProps {
  onVerifySuccess: () => void;
  onBackToLogin: () => void;
  phone: string;
}

export const ScreenOtp: React.FC<ScreenOtpProps> = ({
  onVerifySuccess,
  onBackToLogin,
  phone,
}) => {
  const [otp, setOtp] = useState(['4', '8', '2', '9']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto move to next input if filled
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 4) {
      setError('Please enter all 4 digits');
      return;
    }
    setIsVerifying(true);
    setError('');

    setTimeout(() => {
      setIsVerifying(false);
      onVerifySuccess();
    }, 400);
  };

  const handleFillDemo = () => {
    setOtp(['4', '8', '2', '9']);
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-between p-4 max-w-lg mx-auto select-none">
      <div className="pt-6 space-y-6">
        <div>
          <button 
            onClick={onBackToLogin}
            className="text-xs font-bold text-primary hover:underline mb-3 inline-block cursor-pointer"
          >
            ← Back to phone number
          </button>
          <h1 className="text-2xl font-display font-extrabold text-ink tracking-tight">
            Enter 4-Digit Code
          </h1>
          <p className="text-sm font-medium text-muted mt-1">
            Sent via SMS to <span className="font-mono font-bold text-ink">{phone}</span>
          </p>
        </div>

        {/* 4 Digit Boxes */}
        <div className="flex justify-center space-x-3 py-2">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-input-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              className="w-16 h-18 text-center text-3xl font-display font-black text-ink bg-card border-2 border-border focus:border-primary rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all"
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-sm font-bold text-status-critical">
            {error}
          </p>
        )}

        {/* Quick Demo Autofill chip for driver simplicity */}
        <div className="bg-primary-tint border border-primary/30 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="text-xs font-semibold text-ink">
              Demo Quick Key: <strong className="font-mono text-sm">4829</strong>
            </span>
          </div>
          <button
            onClick={handleFillDemo}
            className="text-xs font-bold bg-primary hover:bg-primary-dark text-card px-2.5 py-1.5 rounded-lg active:scale-95 transition-colors cursor-pointer"
          >
            Insert Code
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => setOtp(['', '', '', ''])}
            className="text-xs font-bold text-muted hover:text-ink inline-flex items-center space-x-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Digits</span>
          </button>
        </div>
      </div>

      {/* Bottom Verify Action */}
      <div className="pt-6 pb-2 space-y-3">
        <button
          type="button"
          onClick={handleVerify}
          disabled={isVerifying}
          className="touch-btn w-full bg-primary hover:bg-primary-dark text-card font-display font-bold text-lg rounded-xl flex items-center justify-center space-x-2 py-4 shadow-md active:scale-[0.99] transition-all cursor-pointer"
        >
          {isVerifying ? (
            <span className="flex items-center space-x-2">
              <span className="w-5 h-5 border-2 border-card border-t-transparent rounded-full animate-spin" />
              <span>Verifying Driver Code...</span>
            </span>
          ) : (
            <>
              <span>Confirm & Check Credentials</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-muted">
          Step 2 of 10 in standard driver onboarding & session flow
        </p>
      </div>
    </div>
  );
};
