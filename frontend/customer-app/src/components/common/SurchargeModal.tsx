import React from 'react';
import { AlertCircle, Check, X, ShieldCheck, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SurchargeModal: React.FC = () => {
  const { 
    isSurchargeModalOpen, 
    closeSurchargeModal, 
    pendingSurcharge, 
    currentBooking, 
    confirmSurcharge, 
    declineSurcharge,
    t 
  } = useApp();

  if (!isSurchargeModalOpen || !pendingSurcharge) return null;

  const currentLocked = Number(currentBooking?.lockedFare ?? currentBooking?.currentTotalFare ?? 0) + Number(currentBooking?.confirmedSurchargesTotal ?? 0);
  const surchargeAmt = Number(pendingSurcharge?.amount ?? 0);
  const revisedTotal = currentLocked + surchargeAmt;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="surcharge-title"
    >
      <div className="relative w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-ink text-card p-4 sm:p-5 flex items-start justify-between border-b border-border/20">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-status-warning-tint border border-status-warning/40 flex items-center justify-center text-status-warning">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 id="surcharge-title" className="font-condensed font-bold text-xl text-card">
                {t.surcharge.modalTitle}
              </h3>
              <p className="text-xs text-muted">
                Trip #{currentBooking.consignmentId}
              </p>
            </div>
          </div>
          <button
            onClick={closeSurchargeModal}
            className="p-1 rounded-lg text-muted hover:text-card hover:bg-card/10 transition-colors focus:outline-none"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-muted leading-relaxed">
            {t.surcharge.modalSubtitle}
          </p>

          {/* Reason Card */}
          <div className="bg-card rounded-xl p-3.5 border border-border shadow-xs">
            <div className="text-[11px] uppercase tracking-wider text-muted font-semibold mb-1">
              {t.surcharge.reasonLabel}
            </div>
            <div className="text-sm font-semibold text-ink">
              {pendingSurcharge.reason}
            </div>
            <div className="mt-1.5 flex items-center space-x-1.5 text-xs text-primary font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Location: {pendingSurcharge.plazaOrLocation}</span>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-ink text-card rounded-xl p-4 space-y-2.5 font-mono text-sm">
            <div className="flex justify-between items-center text-xs text-muted">
              <span>{t.surcharge.lockedFare}:</span>
              <span className="text-card font-bold">₹{currentLocked.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-status-warning font-semibold">
              <span>+ {t.surcharge.additionalAmount}:</span>
              <span>+₹{surchargeAmt.toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t border-border/20 pt-2.5 flex justify-between items-baseline font-sans">
              <span className="font-bold text-xs uppercase text-muted tracking-wider">
                {t.surcharge.newTotal}
              </span>
              <span className="font-condensed font-bold text-2xl text-card">
                ₹{revisedTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Reassurance Notice */}
          <div className="text-[11px] text-primary leading-snug bg-primary-tint p-2.5 rounded-lg border border-primary/30 flex items-start space-x-2">
            <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>{t.surcharge.tollInfo}</span>
          </div>
        </div>

        {/* Action Buttons - Only one primary CTA uses Trust Teal */}
        <div className="p-4 bg-card border-t border-border flex items-center space-x-3">
          <button
            type="button"
            onClick={declineSurcharge}
            className="flex-1 py-3 px-4 rounded-xl border border-border text-xs font-semibold text-muted hover:bg-surface hover:text-ink active:scale-[0.98] transition-all text-center focus:outline-none"
          >
            {t.surcharge.declineButton}
          </button>
          <button
            type="button"
            onClick={confirmSurcharge}
            className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary-dark active:scale-[0.98] text-card text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-1.5 focus:outline-none"
          >
            <Check className="w-4 h-4" />
            <span>Approve +₹{surchargeAmt}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
