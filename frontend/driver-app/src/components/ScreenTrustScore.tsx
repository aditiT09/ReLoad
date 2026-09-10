import React from 'react';
import { 
  ShieldCheck, 
  ThermometerSnowflake, 
  Clock, 
  Award, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { DriverProfile } from '../types';

interface ScreenTrustScoreProps {
  driver: DriverProfile;
  onProceedToHistory: () => void;
  onBackToHome: () => void;
}

export const ScreenTrustScore: React.FC<ScreenTrustScoreProps> = ({
  driver,
  onProceedToHistory,
}) => {
  return (
    <div className="min-h-[calc(100vh-120px)] p-4 max-w-2xl mx-auto space-y-4 pb-16 select-none">
      {/* Big Hero Card: Trust Rating */}
      <div className="bg-ink text-card rounded-2xl p-6 shadow-md border border-white/10 text-center space-y-3">
        <div className="inline-flex items-center space-x-1.5 bg-primary/20 text-primary-tint px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-primary/30">
          <ShieldCheck className="w-4 h-4" />
          <span>TOP TIER PRO DRIVER • TIER 1 FLEET</span>
        </div>

        <div>
          <div className="font-display font-black text-5xl text-card tracking-tight">
            {driver.trustRating}
            <span className="text-2xl text-status-warning ml-1">★</span>
          </div>
          <p className="text-xs text-white/70 mt-1">
            Calculated over {driver.totalTrips} verified commercial cargo trips
          </p>
        </div>

        {/* Rapid Highlights */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
          <div className="bg-white/5 rounded-xl p-2.5">
            <div className="text-white/60 text-[11px] font-semibold">On-Time Rate</div>
            <div className="font-display font-extrabold text-lg text-primary-tint mt-0.5">
              {driver.onTimePercent}%
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5">
            <div className="text-white/60 text-[11px] font-semibold">Cold Integrity</div>
            <div className="font-display font-extrabold text-lg text-regulated-cargo mt-0.5">
              {driver.coldChainCompliancePercent}%
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5">
            <div className="text-white/60 text-[11px] font-semibold">Acceptance</div>
            <div className="font-display font-extrabold text-lg text-card mt-0.5">
              {driver.acceptanceRatePercent}%
            </div>
          </div>
        </div>
      </div>

      {/* Compliance breakdown cards */}
      <div className="bg-card rounded-2xl p-4 border border-border shadow-sm space-y-3">
        <h3 className="font-display font-bold text-base text-ink flex items-center space-x-2">
          <Award className="w-5 h-5 text-primary" />
          <span>Trust Score Standards</span>
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="p-3 rounded-xl border border-border bg-surface flex items-start justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-sm text-ink flex items-center space-x-1.5">
                <ThermometerSnowflake className="w-4 h-4 text-regulated-cargo" />
                <span>Zero Cold-Chain Temperature Excursions</span>
              </div>
              <p className="text-muted">
                100% of chilled vaccine and plasma payloads delivered inside required 2°C–8°C threshold.
              </p>
            </div>
            <span className="font-mono font-bold text-xs text-status-verified bg-status-verified-tint px-2 py-0.5 rounded border border-status-verified/30">
              PASSED
            </span>
          </div>

          <div className="p-3 rounded-xl border border-border bg-surface flex items-start justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-sm text-ink flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-primary" />
                <span>Punctual Dock Arrival & Dispatch</span>
              </div>
              <p className="text-muted">
                On-time pickup rate is 99.2%, exceeding top fleet benchmark (95%).
              </p>
            </div>
            <span className="font-mono font-bold text-xs text-status-verified bg-status-verified-tint px-2 py-0.5 rounded border border-status-verified/30">
              PASSED
            </span>
          </div>

          <div className="p-3 rounded-xl border border-border bg-surface flex items-start justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-sm text-ink flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span>Unbroken Chain-of-Custody Handoffs</span>
              </div>
              <p className="text-muted">
                100% recipient PIN codes and electronic signatures verified prior to departure.
              </p>
            </div>
            <span className="font-mono font-bold text-xs text-status-verified bg-status-verified-tint px-2 py-0.5 rounded border border-status-verified/30">
              PASSED
            </span>
          </div>
        </div>
      </div>

      {/* Tier 1 Privileges */}
      <div className="bg-card rounded-2xl p-4 border border-border shadow-sm space-y-2">
        <h3 className="font-display font-bold text-base text-ink">
          Unlocked Tier 1 Driver Privileges
        </h3>
        <ul className="text-xs space-y-2 text-ink">
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Priority access to high-value medical cold-chain loads (₹1,100–₹2,500+)</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Instant payout clearance upon recipient handoff confirmation</span>
          </li>
          <li className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Fast-track customer approval for verified dock delay surcharges</span>
          </li>
        </ul>
      </div>

      {/* Primary Action to Proceed to History */}
      <div className="pt-2 sticky bottom-16 bg-surface/95 backdrop-blur-sm py-3">
        <button
          onClick={onProceedToHistory}
          className="touch-btn w-full bg-primary hover:bg-primary-dark text-card font-display font-bold text-lg rounded-xl flex items-center justify-center space-x-2 py-4 shadow-lg active:scale-[0.99] transition-all cursor-pointer"
        >
          <span>View Trip Earnings & History</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-center text-xs text-muted mt-2">
          Step 8 of 10 • Itemized fares & confirmed customer surcharges
        </p>
      </div>
    </div>
  );
};
