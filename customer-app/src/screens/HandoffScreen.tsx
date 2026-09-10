import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Lock, 
  Check, 
  ArrowRight, 
  Camera, 
  FileText,
  Truck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HandoffScreen: React.FC = () => {
  const { mode } = useParams<{ mode: string }>();
  const navigate = useNavigate();
  const { currentBooking, confirmPickup, confirmDelivery, t } = useApp();

  const isPickup = mode === 'pickup';
  const expectedSeal = currentBooking.securitySealId;

  // 3 simple steps state:
  // Step 1: Seal Code Match
  const [sealInput, setSealInput] = useState(expectedSeal);
  const isSealMatched = sealInput.trim().toUpperCase() === expectedSeal.toUpperCase();

  // Step 2: Optional Photo & Notes
  const [note, setNote] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);

  // Step 3: Confirmation Name
  const [receiverName, setReceiverName] = useState('Rajesh Kumar (Driver)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSealMatched) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (isPickup) {
        confirmPickup();
        navigate('/trip');
      } else {
        confirmDelivery();
        navigate('/payment');
      }
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Back to trip */}
      <button
        type="button"
        onClick={() => navigate('/trip')}
        className="text-xs text-muted hover:text-ink flex items-center space-x-1 mb-4 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Trip</span>
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-xs text-primary font-bold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>{isPickup ? 'Pickup Confirmation' : 'Delivery Confirmation'}</span>
        </div>
        <h1 className="font-condensed font-bold text-3xl text-ink tracking-tight">
          {isPickup ? t.handoff.pickupTitle : t.handoff.dropoffTitle}
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Trip #{currentBooking.consignmentId} • Complete 3 simple steps to confirm.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Step 1: Check Security Seal Code */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center space-x-1.5">
              <span className="w-5 h-5 rounded-full bg-ink text-card flex items-center justify-center text-[10px]">
                1
              </span>
              <span>{t.handoff.sealNumber}</span>
            </h2>
            <span className="text-xs text-primary font-mono font-bold">
              Match Seal Code
            </span>
          </div>

          <div className="p-3 bg-surface rounded-xl border border-border">
            <span className="text-[11px] text-muted block mb-1">
              Expected Seal Code on Truck Container:
            </span>
            <div className="font-mono font-bold text-lg text-ink tracking-wider">
              {expectedSeal}
            </div>
          </div>

          <div>
            <label htmlFor="seal-input" className="block text-xs font-semibold text-ink mb-1">
              Confirm code on physical lock / tag:
            </label>
            <div className="relative">
              <input
                id="seal-input"
                type="text"
                value={sealInput}
                onChange={(e) => setSealInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm font-mono uppercase text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              {isSealMatched && (
                <div className="absolute right-3 top-3 text-status-verified flex items-center space-x-1 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Matched</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 2: Optional Photo & Notes */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center space-x-1.5">
            <span className="w-5 h-5 rounded-full bg-ink text-card flex items-center justify-center text-[10px]">
              2
            </span>
            <span>Optional Photo & Notes</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setHasPhoto(!hasPhoto)}
              className={`p-3.5 rounded-xl border flex items-center space-x-3 transition-colors text-left cursor-pointer ${
                hasPhoto 
                  ? 'border-primary bg-primary-tint text-primary' 
                  : 'border-border bg-surface text-muted hover:bg-border'
              }`}
            >
              <Camera className="w-5 h-5 shrink-0" />
              <div>
                <span className="text-xs font-bold block text-ink">
                  {hasPhoto ? 'Photo Attached' : 'Take or Upload Photo'}
                </span>
                <span className="text-[11px] text-muted">
                  {hasPhoto ? 'seal_cargo_check.jpg' : 'Attach truck or cargo photo'}
                </span>
              </div>
            </button>

            <div>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add optional note (e.g. all 20 pallets intact)"
                className="w-full h-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Contact / Receiver Name */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center space-x-1.5">
            <span className="w-5 h-5 rounded-full bg-ink text-card flex items-center justify-center text-[10px]">
              3
            </span>
            <span>{isPickup ? 'Handed over to' : t.handoff.signatureLabel}</span>
          </h2>

          <input
            type="text"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-surface border border-border rounded-xl text-sm font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Reassuring Note Banner */}
        <div className="p-4 bg-ink text-card rounded-2xl border border-border/20 flex items-start space-x-3">
          <Lock className="w-4 h-4 text-status-verified shrink-0 mt-0.5" />
          <p className="text-xs text-muted leading-relaxed">
            {t.handoff.escrowNote} Total locked fare: <strong className="text-card">₹{(currentBooking?.currentTotalFare ?? currentBooking?.lockedFare ?? 34800).toLocaleString('en-IN')}</strong>.
          </p>
        </div>

        {/* Submit - Single Primary CTA */}
        <button
          type="submit"
          id="btn-confirm-handoff"
          disabled={!isSealMatched || isSubmitting}
          className={`w-full py-4 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-card shadow-lg transition-all flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary ${
            isSealMatched && !isSubmitting
              ? 'bg-primary hover:bg-primary-dark active:scale-[0.99] cursor-pointer'
              : 'bg-neutral-state cursor-not-allowed opacity-60'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-card border-t-transparent rounded-full animate-spin" />
              <span>Confirming...</span>
            </div>
          ) : (
            <>
              <span>{isPickup ? t.handoff.confirmPickup : t.handoff.confirmDropoff}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
