import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  MessageSquare, 
  ThermometerSnowflake, 
  CheckCircle2, 
  Clock, 
  PlusCircle, 
  ArrowRight, 
  Sparkles, 
  Info 
} from 'lucide-react';
import { CargoJob, TripStatus } from '../types';

interface ScreenActiveTripProps {
  job: CargoJob;
  onUpdateTripStatus: (status: TripStatus) => void;
  onRequestSurcharge: (reason: string, amount: number, note?: string) => void;
  onSimulateCustomerApproval: (surchargeId: string) => void;
  onProceedToHandoff: () => void;
  onOpenChat: () => void;
}

export const ScreenActiveTrip: React.FC<ScreenActiveTripProps> = ({
  job,
  onUpdateTripStatus,
  onRequestSurcharge,
  onSimulateCustomerApproval,
  onProceedToHandoff,
  onOpenChat,
}) => {
  const [showSurchargeModal, setShowSurchargeModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState('Dock Delay (30+ min wait)');
  const [selectedAmount, setSelectedAmount] = useState(250.0);
  const [customNote, setCustomNote] = useState('');

  const PRESET_SURCHARGES = [
    { reason: 'Dock Delay (30+ min wait)', amount: 250.0 },
    { reason: 'Heavy Carry / Extra Flight of Stairs', amount: 150.0 },
    { reason: 'Unplanned Highway Toll', amount: 120.0 },
    { reason: 'Emergency Temperature Dry-Ice Staging', amount: 350.0 },
  ];

  // Calculate confirmed payout and pending amount
  const approvedSurcharges = job.surcharges.filter((s) => s.status === 'approved');
  const pendingSurcharges = job.surcharges.filter((s) => s.status === 'requested');

  const approvedExtra = approvedSurcharges.reduce((acc, s) => acc + s.amount, 0);
  const currentGuaranteedPay = job.baseFare + approvedExtra;

  // Step state logic
  const isAtDropoff = job.tripStatus === 'at_dropoff';
  const isEnRoute = job.tripStatus === 'en_route_delivery';
  const isLoaded = job.tripStatus === 'cargo_loaded';
  const isAtPickup = job.tripStatus === 'at_pickup';
  const isHeadingToPickup = job.tripStatus === 'heading_to_pickup';

  const handleNextStep = () => {
    if (isHeadingToPickup) {
      onUpdateTripStatus('at_pickup');
    } else if (isAtPickup) {
      onUpdateTripStatus('cargo_loaded');
    } else if (isLoaded) {
      onUpdateTripStatus('en_route_delivery');
    } else if (isEnRoute) {
      onUpdateTripStatus('at_dropoff');
    } else if (isAtDropoff) {
      onProceedToHandoff();
    }
  };

  const getPrimaryButtonLabel = () => {
    if (isHeadingToPickup) return 'I Have Arrived at Pickup Dock';
    if (isAtPickup) return 'Confirm Cargo Loaded & Temperature OK';
    if (isLoaded) return 'Start Route to Dropoff';
    if (isEnRoute) return 'I Have Arrived at Dropoff Dock';
    return 'Start Chain-of-Custody Handoff';
  };

  const handleCreateSurcharge = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestSurcharge(selectedReason, selectedAmount, customNote);
    setShowSurchargeModal(false);
    setCustomNote('');
  };

  // Next target destination based on status
  const currentDestination = isEnRoute || isAtDropoff ? job.dropoff : job.pickup;
  const isPickupPhase = isHeadingToPickup || isAtPickup || isLoaded;

  return (
    <div className="min-h-[calc(100vh-120px)] p-4 max-w-2xl mx-auto space-y-4 pb-16 select-none">
      {/* High-Contrast Navigation Destination Card */}
      <div className="bg-ink text-card rounded-2xl p-5 shadow-lg border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-tint bg-primary/30 px-2.5 py-1 rounded-full flex items-center space-x-1.5 border border-primary/40">
            <span className="w-2 h-2 rounded-full bg-primary-tint animate-ping" />
            <span>
              {isPickupPhase ? 'STEP 1: PICKUP ROUTE' : 'STEP 2: DROPOFF ROUTE'}
            </span>
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => alert(`Calling facility dispatch: ${currentDestination.contactPhone}`)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-card transition-colors cursor-pointer"
              title="Call Contact"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenChat}
              className="p-2 rounded-xl bg-primary hover:bg-primary-dark text-card transition-colors flex items-center space-x-1 text-xs font-bold px-2.5 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </button>
          </div>
        </div>

        <div>
          <div className="text-xs text-white/60 font-semibold uppercase tracking-wider">
            {isPickupPhase ? 'Head to Staging Area' : 'Head to Delivery Location'}
          </div>
          <h1 className="text-2xl font-display font-extrabold text-card mt-0.5 tracking-tight">
            {currentDestination.facilityName}
          </h1>
          <p className="text-sm text-white/85 flex items-start space-x-1.5 mt-1">
            <MapPin className="w-4 h-4 text-regulated-cargo shrink-0 mt-0.5" />
            <span>{currentDestination.address}</span>
          </p>
        </div>

        {/* Dock / Staging Info Callout */}
        <div className="bg-white/10 rounded-xl p-3 flex items-center justify-between text-xs">
          <div>
            <span className="text-white/60">Dock / Gate:</span>{' '}
            <strong className="text-card font-mono text-sm">{currentDestination.dock}</strong>
          </div>
          <div>
            <span className="text-white/60">Contact:</span>{' '}
            <strong className="text-card">{isPickupPhase ? job.pickup.contactName : job.dropoff.recipientName}</strong>
          </div>
        </div>

        {/* Special Instructions */}
        {currentDestination.notes && (
          <div className="text-xs text-status-warning bg-status-warning-tint/20 border border-status-warning/40 rounded-xl p-2.5">
            <strong>Driver Note:</strong> {currentDestination.notes}
          </div>
        )}
      </div>

      {/* TRIP STATUS MILESTONE PROGRESS BAR */}
      <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
        <div className="text-xs font-bold text-muted uppercase tracking-wider mb-2.5">
          Delivery Progress Milestones
        </div>

        <div className="grid grid-cols-4 gap-1 text-center">
          <div className={`p-2 rounded-xl text-[11px] font-bold transition-all ${
            isHeadingToPickup || isAtPickup || isLoaded || isEnRoute || isAtDropoff
              ? 'bg-primary text-card'
              : 'bg-surface text-muted'
          }`}>
            1. Pickup
          </div>
          <div className={`p-2 rounded-xl text-[11px] font-bold transition-all ${
            isAtPickup || isLoaded || isEnRoute || isAtDropoff
              ? 'bg-primary text-card'
              : 'bg-surface text-muted'
          }`}>
            2. Loaded
          </div>
          <div className={`p-2 rounded-xl text-[11px] font-bold transition-all ${
            isEnRoute || isAtDropoff
              ? 'bg-primary text-card'
              : 'bg-surface text-muted'
          }`}>
            3. En Route
          </div>
          <div className={`p-2 rounded-xl text-[11px] font-bold transition-all ${
            isAtDropoff
              ? 'bg-primary text-card'
              : 'bg-surface text-muted'
          }`}>
            4. Dropoff
          </div>
        </div>
      </div>

      {/* LIVE COLD-CHAIN TELEMETRY SENSOR CARD (if applicable) */}
      {job.coldChain && (
        <div className="bg-card rounded-2xl p-4 border border-regulated-cargo/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-regulated-cargo-tint text-regulated-cargo flex items-center justify-center">
                <ThermometerSnowflake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-ink">
                  Active Chiller Telemetry
                </h3>
                <span className="text-[11px] text-muted font-mono">
                  Sensor {job.coldChain.sensorId} • {job.coldChain.lastPing}
                </span>
              </div>
            </div>

            <span className="text-xs font-bold text-status-verified bg-status-verified-tint px-2 py-0.5 rounded-full border border-status-verified/30 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>OPTIMAL</span>
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <div className="text-3xl font-display font-black text-ink">
                {job.coldChain.currentTemp.toFixed(1)}°C
              </div>
              <div className="text-xs text-muted">
                Safe range: {job.coldChain.targetTempMin}°C to {job.coldChain.targetTempMax}°C
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-regulated-cargo bg-regulated-cargo-tint px-2.5 py-1 rounded-lg">
                Reefer Unit Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STRICT SURCHARGE & FARE CARD (MUST RESPECT THE CORE SURCHARGE RULE) */}
      <div className="bg-card rounded-2xl p-4 border border-border shadow-sm space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted">
              Trip Payout Summary
            </div>
            <div className="font-display font-extrabold text-2xl text-primary">
              ₹{currentGuaranteedPay.toFixed(2)}{' '}
              <span className="text-xs font-semibold text-muted font-sans">
                {approvedExtra > 0 ? '(Includes approved fees)' : 'Guaranteed Base'}
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowSurchargeModal(true)}
            className="touch-btn bg-ink hover:bg-admin-shell text-card text-xs font-bold px-3 py-2 rounded-xl flex items-center space-x-1.5 shadow cursor-pointer transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-status-warning" />
            <span>Request Extra Fee</span>
          </button>
        </div>

        {/* PENDING SURCHARGES LIST (CRITICAL: FARE DOES NOT CHANGE UNTIL CUSTOMER APPROVES) */}
        {pendingSurcharges.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="text-xs font-bold uppercase tracking-wider text-status-warning flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Customer Approval (Not added yet)</span>
            </div>

            {pendingSurcharges.map((s) => (
              <div
                key={s.id}
                className="bg-status-warning-tint border border-status-warning/40 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="font-bold text-sm text-ink flex items-center space-x-1.5">
                    <span>{s.reason}</span>
                    <span className="font-mono text-ink bg-card px-2 py-0.5 rounded border border-border">
                      +₹{s.amount.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    Status: <strong className="text-status-warning">Waiting for customer confirmation</strong>
                  </p>
                  <div className="text-[11px] text-muted italic mt-0.5">
                    The driver fare remains ₹{job.baseFare.toFixed(2)} until customer approves this fee.
                  </div>
                </div>

                {/* Quick Simulation Button for user to test customer acceptance */}
                <button
                  onClick={() => onSimulateCustomerApproval(s.id)}
                  className="touch-btn text-xs font-bold bg-status-verified hover:bg-primary-dark text-card px-3 py-2 rounded-xl self-start sm:self-center shadow-sm flex items-center space-x-1 cursor-pointer transition-colors"
                  title="Simulate Customer approving the surcharge"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Simulate Customer Approval</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* APPROVED SURCHARGES LIST */}
        {approvedSurcharges.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-border">
            <div className="text-xs font-bold uppercase tracking-wider text-status-verified flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Customer Confirmed Surcharges (Added to Payout)</span>
            </div>

            {approvedSurcharges.map((s) => (
              <div
                key={s.id}
                className="bg-status-verified-tint border border-status-verified/30 rounded-xl p-2.5 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-ink">{s.reason}</span>
                  <div className="text-[11px] text-muted">
                    Confirmed by customer • Added to trip fare
                  </div>
                </div>
                <span className="font-mono font-bold text-sm text-status-verified">
                  +₹{s.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* THUMB-FRIENDLY PRIMARY BOTTOM ACTION BUTTON */}
      <div className="pt-2 sticky bottom-16 bg-surface/95 backdrop-blur-sm py-3 space-y-2">
        <button
          onClick={handleNextStep}
          className="touch-btn w-full bg-primary hover:bg-primary-dark text-card font-display font-bold text-lg rounded-xl flex items-center justify-center space-x-2 py-4 shadow-lg active:scale-[0.99] transition-all cursor-pointer"
        >
          <span>{getPrimaryButtonLabel()}</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-between text-xs text-muted px-1">
          <span>Current: {job.tripStatus.replace(/_/g, ' ').toUpperCase()}</span>
          <span>Order #{job.orderNumber}</span>
        </div>
      </div>

      {/* REQUEST EXTRA FEE / SURCHARGE MODAL */}
      {showSurchargeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3">
          <div className="bg-card rounded-3xl w-full max-w-lg p-5 space-y-4 shadow-2xl border border-border animate-in fade-in slide-in-from-bottom">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-display font-extrabold text-xl text-ink">
                  Request Extra Surcharge
                </h3>
                <p className="text-xs text-muted">
                  Select incident or extra labor fee
                </p>
              </div>
              <button
                onClick={() => setShowSurchargeModal(false)}
                className="w-8 h-8 rounded-full bg-surface hover:bg-neutral-state-tint text-muted font-bold flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Strict Notice for Driver */}
            <div className="bg-status-warning-tint border border-status-warning/40 rounded-xl p-3 flex items-start space-x-2 text-xs text-ink">
              <Info className="w-4 h-4 text-status-warning shrink-0 mt-0.5" />
              <div>
                <strong className="text-ink">Customer Approval Required:</strong>
                <p className="mt-0.5 text-muted">
                  Sending this request does <strong>not</strong> change your guaranteed fare immediately. The surcharge will only be added to your payout after the customer explicitly reviews and confirms it.
                </p>
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted">
                Select Surcharge Reason
              </label>
              <div className="grid grid-cols-1 gap-2">
                {PRESET_SURCHARGES.map((item) => (
                  <button
                    key={item.reason}
                    type="button"
                    onClick={() => {
                      setSelectedReason(item.reason);
                      setSelectedAmount(item.amount);
                    }}
                    className={`p-3 rounded-xl border-2 text-left flex items-center justify-between transition-all cursor-pointer ${
                      selectedReason === item.reason
                        ? 'border-primary bg-primary-tint/30 font-bold'
                        : 'border-border hover:border-neutral-state bg-card'
                    }`}
                  >
                    <span className="text-sm text-ink">{item.reason}</span>
                    <span className="font-mono font-bold text-sm text-primary">
                      +₹{item.amount.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Note input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1">
                Driver Note / Proof details (Optional)
              </label>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. Delayed at dock gate 3 since 1:15 PM"
                className="w-full px-3 py-2.5 rounded-xl border border-border text-sm focus:border-primary focus:outline-none bg-card text-ink"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex space-x-3">
              <button
                type="button"
                onClick={() => setShowSurchargeModal(false)}
                className="flex-1 py-3 rounded-xl border border-border font-bold text-sm text-muted hover:bg-surface cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateSurcharge}
                className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-dark text-card font-display font-bold text-sm shadow cursor-pointer transition-colors"
              >
                Send Request (Pending)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
