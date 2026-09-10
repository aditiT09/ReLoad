import React, { useState } from 'react';
import { 
  History, 
  ThermometerSnowflake, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { PAST_TRIPS_HISTORY } from '../data';

interface ScreenHistoryProps {
  onProceedToProfile: () => void;
  onBackToHome: () => void;
}

export const ScreenHistory: React.FC<ScreenHistoryProps> = ({
  onProceedToProfile,
}) => {
  const [selectedTrip, setSelectedTrip] = useState<typeof PAST_TRIPS_HISTORY[0] | null>(null);

  const totalEarnings = PAST_TRIPS_HISTORY.reduce((acc, t) => acc + t.totalPayout, 0);

  return (
    <div className="min-h-[calc(100vh-120px)] p-4 max-w-2xl mx-auto space-y-4 pb-16 select-none">
      {/* Earnings Summary Header */}
      <div className="bg-ink text-card rounded-2xl p-5 shadow-sm border border-white/10 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary-tint">
            RECENT SETTLED EARNINGS
          </span>
          <div className="font-display font-extrabold text-3xl text-card mt-0.5">
            ₹{totalEarnings.toFixed(2)}
          </div>
          <div className="text-xs text-white/70 mt-0.5">
            3 Trips • All customer surcharges confirmed & deposited
          </div>
        </div>

        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-card">
          <History className="w-6 h-6" />
        </div>
      </div>

      {/* Surcharge transparency reminder */}
      <div className="bg-surface border border-border rounded-xl p-3 text-xs text-ink flex items-center space-x-2">
        <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
        <span>
          <strong>Rule Confirmed:</strong> Every extra fee below was only added to the payout after explicit customer approval in-app.
        </span>
      </div>

      {/* Trip List */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-muted uppercase tracking-wider px-1">
          Trip Log & Receipts
        </div>

        {PAST_TRIPS_HISTORY.map((trip) => (
          <div
            key={trip.id}
            onClick={() => setSelectedTrip(selectedTrip?.id === trip.id ? null : trip)}
            className="bg-card rounded-2xl border border-border p-4 shadow-sm hover:border-primary transition-all cursor-pointer space-y-2.5"
          >
            {/* Header: Title & Total Payout */}
            <div className="flex items-start justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  {trip.cargoType === 'cold_chain' ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-card bg-regulated-cargo px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <ThermometerSnowflake className="w-3 h-3" />
                      <span>Cold-Chain</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink bg-neutral-state-tint px-2 py-0.5 rounded-full">
                      Dry Freight
                    </span>
                  )}
                  <span className="text-xs font-mono text-muted">{trip.orderNumber}</span>
                </div>
                <h4 className="font-display font-bold text-base text-ink">
                  {trip.title}
                </h4>
                <div className="text-xs text-muted">{trip.date}</div>
              </div>

              <div className="text-right">
                <div className="font-display font-extrabold text-xl text-primary">
                  ₹{trip.totalPayout.toFixed(2)}
                </div>
                <span className="text-[11px] font-bold text-status-verified bg-status-verified-tint px-1.5 py-0.2 rounded border border-status-verified/30">
                  Settled
                </span>
              </div>
            </div>

            {/* Route */}
            <div className="text-xs text-muted flex items-center space-x-2 pt-1 border-t border-border">
              <span className="font-semibold text-ink">{trip.pickup}</span>
              <span>→</span>
              <span className="font-semibold text-ink">{trip.dropoff}</span>
              <span className="text-muted">({trip.distance})</span>
            </div>

            {/* Itemized Fare Breakdown */}
            <div className="bg-surface rounded-xl p-2.5 text-xs space-y-1 border border-border">
              <div className="flex justify-between text-muted">
                <span>Base Freight Fare:</span>
                <span className="font-mono font-bold text-ink">
                  ₹{trip.baseFare.toFixed(2)}
                </span>
              </div>

              {trip.surcharges.map((s) => (
                <div key={s.id} className="flex justify-between text-primary font-semibold">
                  <span>Customer Confirmed: {s.reason}</span>
                  <span className="font-mono font-bold">+₹{s.amount.toFixed(2)}</span>
                </div>
              ))}

              {trip.verifiedTemp && (
                <div className="flex justify-between text-regulated-cargo font-medium pt-0.5">
                  <span>Handoff Temperature:</span>
                  <span>{trip.verifiedTemp}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Primary Action to Proceed to Profile */}
      <div className="pt-2 sticky bottom-16 bg-surface/95 backdrop-blur-sm py-3">
        <button
          onClick={onProceedToProfile}
          className="touch-btn w-full bg-primary hover:bg-primary-dark text-card font-display font-bold text-lg rounded-xl flex items-center justify-center space-x-2 py-4 shadow-lg active:scale-[0.99] transition-all cursor-pointer"
        >
          <span>View Driver & Vehicle Profile</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-center text-xs text-muted mt-2">
          Step 9 of 10 • Manage vehicle suitability & certifications
        </p>
      </div>
    </div>
  );
};
