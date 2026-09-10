import React, { useState } from 'react';
import { 
  CheckSquare, 
  KeyRound, 
  Camera, 
  PenTool, 
  ThermometerSnowflake, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { CargoJob } from '../types';

interface ScreenHandoffProps {
  job: CargoJob;
  onCompleteHandoff: () => void;
  onProceedToTrust: () => void;
}

export const ScreenHandoff: React.FC<ScreenHandoffProps> = ({
  job,
  onCompleteHandoff,
  onProceedToTrust,
}) => {
  const [recipientCode, setRecipientCode] = useState(['4', '8', '2', '9']);
  const [codeVerified, setCodeVerified] = useState(true);
  const [signedName, setSignedName] = useState('Dr. James Chen');
  const [isFinishing, setIsFinishing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Checks
  const [sealsIntact, setSealsIntact] = useState(true);
  const [tempVerified, setTempVerified] = useState(true);
  const [packagesCounted, setPackagesCounted] = useState(true);

  const handleVerifyCode = () => {
    const entered = recipientCode.join('');
    if (entered === job.dropoff.securityCode) {
      setCodeVerified(true);
    } else {
      alert(`Entered code ${entered} does not match recipient code ${job.dropoff.securityCode}`);
    }
  };

  const handleFinish = () => {
    setIsFinishing(true);
    setTimeout(() => {
      setIsFinishing(false);
      setIsCompleted(true);
      onCompleteHandoff();
    }, 600);
  };

  // Approved surcharges calculation
  const approvedSurcharges = job.surcharges.filter((s) => s.status === 'approved');
  const approvedExtra = approvedSurcharges.reduce((acc, s) => acc + s.amount, 0);
  const finalPayout = job.baseFare + approvedExtra;

  if (isCompleted) {
    return (
      <div className="min-h-[calc(100vh-120px)] p-4 max-w-lg mx-auto flex flex-col justify-between select-none">
        <div className="pt-6 space-y-5 text-center">
          <div className="w-20 h-20 bg-primary text-card rounded-3xl mx-auto flex items-center justify-center shadow-lg animate-bounce">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-tint px-3 py-1 rounded-full">
              CHAIN OF CUSTODY TRANSFERRED
            </span>
            <h1 className="text-2xl font-display font-black text-ink tracking-tight">
              Delivery Complete!
            </h1>
            <p className="text-sm text-muted">
              Cargo released to {job.dropoff.recipientName}
            </p>
          </div>

          {/* Earnings summary card */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm text-left space-y-3">
            <div className="text-xs font-bold text-muted uppercase tracking-wider">
              Earned Payout
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-display font-extrabold text-3xl text-primary">
                ₹{finalPayout.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-status-verified bg-status-verified-tint px-2 py-0.5 rounded">
                Funds Deposited
              </span>
            </div>

            <div className="text-xs space-y-1 pt-2 border-t border-border text-muted">
              <div className="flex justify-between">
                <span>Base Freight Fare:</span>
                <span className="font-bold text-ink">₹{job.baseFare.toFixed(2)}</span>
              </div>
              {approvedExtra > 0 && (
                <div className="flex justify-between text-primary font-semibold">
                  <span>Customer Confirmed Surcharges:</span>
                  <span>+₹{approvedExtra.toFixed(2)}</span>
                </div>
              )}
              {job.coldChain && (
                <div className="flex justify-between text-regulated-cargo font-semibold">
                  <span>Cold-Chain Temperature Compliance:</span>
                  <span>100% (Passed at 3.8°C)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-6 pb-4 space-y-2.5">
          <button
            onClick={onProceedToTrust}
            className="touch-btn w-full bg-primary hover:bg-primary-dark text-card font-display font-bold text-lg rounded-xl flex items-center justify-center space-x-2 py-4 shadow-lg active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>View Driver Trust & Rating</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-120px)] p-4 max-w-2xl mx-auto space-y-4 pb-16 select-none">
      {/* Top Header */}
      <div className="bg-ink text-card rounded-2xl p-5 shadow-sm border border-white/10">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-regulated-cargo bg-regulated-cargo-tint/20 px-2.5 py-1 rounded-full flex items-center space-x-1.5 border border-regulated-cargo/30">
              <CheckSquare className="w-4 h-4" />
              <span>STEP 6: DROP-OFF HANDOFF</span>
            </span>
            <h1 className="text-2xl font-display font-extrabold text-card mt-0.5 tracking-tight">
              Cargo Handoff
            </h1>
            <p className="text-sm text-border mt-1">
              Verify recipient identity & unbroken cold custody
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono text-white/60">Dropoff Code</span>
            <div className="font-mono font-black text-xl text-status-warning">
              {job.dropoff.securityCode}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-white/60">Authorized Receiver:</span>
            <div className="font-bold text-card text-sm">{job.dropoff.recipientName}</div>
          </div>
          <div>
            <span className="text-white/60">Facility / Dock:</span>
            <div className="font-bold text-card text-sm">{job.dropoff.facilityName}</div>
          </div>
        </div>
      </div>

      {/* 1. Recipient Security Code Check */}
      <div className="bg-card rounded-2xl p-4 border border-border shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-base text-ink flex items-center space-x-2">
            <KeyRound className="w-5 h-5 text-primary" />
            <span>1. Enter Recipient Security Code</span>
          </h3>
          {codeVerified ? (
            <span className="text-xs font-bold text-status-verified bg-status-verified-tint px-2 py-0.5 rounded-full flex items-center space-x-1 border border-status-verified/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Matched</span>
            </span>
          ) : (
            <span className="text-xs font-bold text-status-warning bg-status-warning-tint px-2 py-0.5 rounded-full border border-status-warning/30">
              Required
            </span>
          )}
        </div>

        <p className="text-xs text-muted">
          Ask receiver for their 4-digit verification code from their app or SMS.
        </p>

        <div className="flex items-center space-x-2">
          <div className="flex space-x-2">
            {recipientCode.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => {
                  const newCode = [...recipientCode];
                  newCode[idx] = e.target.value.slice(-1);
                  setRecipientCode(newCode);
                }}
                className="w-12 h-14 text-center font-display font-bold text-xl bg-surface border border-border text-ink rounded-xl focus:border-primary focus:outline-none"
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleVerifyCode}
            className="touch-btn px-4 py-2 bg-primary hover:bg-primary-dark text-card font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
          >
            Check Code
          </button>
        </div>
      </div>

      {/* 2. Cold Chain & Integrity Verification Checklist */}
      <div className="bg-card rounded-2xl p-4 border border-border shadow-sm space-y-2.5">
        <h3 className="font-display font-bold text-base text-ink flex items-center space-x-2">
          <ThermometerSnowflake className="w-5 h-5 text-regulated-cargo" />
          <span>2. Cargo Condition Verification</span>
        </h3>

        <div className="space-y-2 text-xs">
          <label className="flex items-center space-x-3 p-2.5 rounded-xl border border-border hover:bg-surface cursor-pointer">
            <input
              type="checkbox"
              checked={tempVerified}
              onChange={(e) => setTempVerified(e.target.checked)}
              className="w-5 h-5 text-primary rounded border-border focus:ring-primary"
            />
            <div className="flex-1">
              <strong className="text-ink">Temperature Reading: 3.8°C</strong>
              <div className="text-muted">Target range (2°C - 8°C) verified at handover</div>
            </div>
            <span className="font-bold text-status-verified">Optimal</span>
          </label>

          <label className="flex items-center space-x-3 p-2.5 rounded-xl border border-border hover:bg-surface cursor-pointer">
            <input
              type="checkbox"
              checked={sealsIntact}
              onChange={(e) => setSealsIntact(e.target.checked)}
              className="w-5 h-5 text-primary rounded border-border focus:ring-primary"
            />
            <div className="flex-1">
              <strong className="text-ink">Security Seals Intact</strong>
              <div className="text-muted">Tamper-evident seals checked with recipient</div>
            </div>
            <span className="font-bold text-status-verified">Intact</span>
          </label>

          <label className="flex items-center space-x-3 p-2.5 rounded-xl border border-border hover:bg-surface cursor-pointer">
            <input
              type="checkbox"
              checked={packagesCounted}
              onChange={(e) => setPackagesCounted(e.target.checked)}
              className="w-5 h-5 text-primary rounded border-border focus:ring-primary"
            />
            <div className="flex-1">
              <strong className="text-ink">Container Count: {job.packagesCount} Units</strong>
              <div className="text-muted">All 4 insulated medical boxes accounted for</div>
            </div>
            <span className="font-bold text-status-verified">Confirmed</span>
          </label>
        </div>
      </div>

      {/* 3. Proof of Delivery & Digital Signature */}
      <div className="bg-card rounded-2xl p-4 border border-border shadow-sm space-y-3">
        <h3 className="font-display font-bold text-base text-ink flex items-center space-x-2">
          <PenTool className="w-5 h-5 text-primary" />
          <span>3. Recipient Digital Signature</span>
        </h3>

        <div className="space-y-2">
          <div className="bg-surface border-2 border-dashed border-border rounded-xl p-4 text-center">
            <div className="font-serif italic text-2xl text-ink py-2">
              {signedName}
            </div>
            <div className="text-[11px] text-muted">
              Electronic Signature Captured • Dr. James Chen
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-muted">Signed at Memorial Hospital Receiving Dock B</span>
            <button
              onClick={() => setSignedName('Dr. James Chen')}
              className="text-primary font-bold hover:underline cursor-pointer"
            >
              Re-Sign
            </button>
          </div>
        </div>

        {/* Delivery Photo preview */}
        <div className="pt-2 border-t border-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-neutral-state-tint flex items-center justify-center text-ink">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-ink">Staging Photo Captured</div>
              <div className="text-[11px] text-muted">Insulated cargo containers at Dock B</div>
            </div>
          </div>
          <span className="text-xs font-bold text-status-verified bg-status-verified-tint px-2 py-0.5 rounded-full border border-status-verified/30">
            Attached
          </span>
        </div>
      </div>

      {/* Primary Action to Complete Trip */}
      <div className="pt-2 sticky bottom-16 bg-surface/95 backdrop-blur-sm py-3">
        <button
          onClick={handleFinish}
          disabled={!codeVerified || isFinishing}
          className="touch-btn w-full bg-primary hover:bg-primary-dark text-card font-display font-bold text-lg rounded-xl flex items-center justify-center space-x-2 py-4 shadow-lg active:scale-[0.99] transition-all cursor-pointer"
        >
          {isFinishing ? (
            <span>Confirming Transfer...</span>
          ) : (
            <>
              <span>Complete Handoff & Release Payout</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
        <p className="text-center text-xs text-muted mt-2">
          Step 6 of 10 • Immediate funds settlement to driver wallet
        </p>
      </div>
    </div>
  );
};
