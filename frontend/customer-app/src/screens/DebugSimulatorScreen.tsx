import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sliders, 
  RotateCcw, 
  CheckCircle2, 
  DollarSign, 
  ArrowLeft,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookingStatus } from '../types';

export const DebugSimulatorScreen: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentBooking, 
    advanceBookingStatus, 
    triggerSurchargeModal,
    resetToDefaultState 
  } = useApp();

  const stages: { status: BookingStatus; label: string; desc: string }[] = [
    { status: 'requested', label: '1. Requested', desc: 'Initial customer booking placed' },
    { status: 'accepted', label: '2. Driver Assigned', desc: 'Verified driver Rajesh Kumar assigned' },
    { status: 'pickup_confirmed', label: '3. Cargo Picked Up', desc: 'Seal matched, cargo loaded' },
    { status: 'in_transit', label: '4. On the Way', desc: 'Moving along NH 48 corridor' },
    { status: 'delivered', label: '5. Delivered', desc: 'Arrived at Whitefield hub' },
    { status: 'closed', label: '6. Payment Settled', desc: 'Invoice settled, trip closed' },
  ];

  const screens = [
    { name: '1. Login', path: '/login' },
    { name: '2. OTP Verification', path: '/otp' },
    { name: '3. Book (Address & Cargo)', path: '/book' },
    { name: '4. Vehicle & Locked Fare', path: '/vehicles' },
    { name: '5. Active Trip Tracker', path: '/trip' },
    { name: '6. Pickup Handoff', path: '/handoff/pickup' },
    { name: '7. Delivery Handoff', path: '/handoff/dropoff' },
    { name: '8. File a Report', path: '/report' },
    { name: '9. Report Status', path: '/report/status' },
    { name: '10. Receipt & Payment', path: '/payment' },
    { name: '11. Trip History', path: '/trips' },
    { name: '12. Profile & Language', path: '/profile' },
    { name: '13. Chat Screen', path: '/chat' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate('/profile')}
        className="text-xs text-muted hover:text-ink flex items-center space-x-1 mb-2 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Customer App</span>
      </button>

      {/* Header */}
      <div className="bg-ink text-card p-6 rounded-2xl border border-neutral-state/30 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-status-warning font-bold uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" />
            <span>Developer & Evaluator Simulator</span>
          </div>
          <h1 className="font-condensed font-bold text-3xl text-card">
            Trip Lifecycle & Rule Controller
          </h1>
          <p className="text-xs text-border mt-1">
            Isolated simulator route for testing trip progression and locked fare integrity.
          </p>
        </div>

        <button
          onClick={resetToDefaultState}
          className="px-4 py-2.5 bg-status-warning-tint hover:bg-status-warning/30 text-status-warning border border-status-warning/40 rounded-xl text-xs font-bold font-mono flex items-center space-x-1.5 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All State</span>
        </button>
      </div>

      {/* Current Trip State Info */}
      <div className="bg-card rounded-2xl p-5 border border-border shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="bg-surface p-3 rounded-xl border border-border">
          <span className="text-muted text-[10px] uppercase block">Current Stage</span>
          <span className="font-bold text-ink text-sm mt-0.5 block capitalize">
            {currentBooking.status.replace('_', ' ')}
          </span>
        </div>

        <div className="bg-surface p-3 rounded-xl border border-border">
          <span className="text-muted text-[10px] uppercase block">Locked Fare</span>
          <span className="font-bold text-primary text-sm mt-0.5 block">
            ₹{(currentBooking?.lockedFare ?? currentBooking?.currentTotalFare ?? 34800).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-surface p-3 rounded-xl border border-border">
          <span className="text-muted text-[10px] uppercase block">Approved Surcharges</span>
          <span className="font-bold text-status-warning text-sm mt-0.5 block">
            +₹{(currentBooking?.confirmedSurchargesTotal ?? 0).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Advance Stage Control */}
      <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
          1. Advance Trip Lifecycle Stages
        </h2>
        <p className="text-xs text-muted mb-4">
          Click any stage to simulate driver or trip progression. Then view the Active Trip or Handoff screen to see the updated state.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stages.map((stage) => {
            const isCurrent = currentBooking.status === stage.status;
            return (
              <button
                key={stage.status}
                onClick={() => advanceBookingStatus(stage.status)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  isCurrent
                    ? 'border-primary bg-primary-tint ring-2 ring-primary'
                    : 'border-border hover:bg-surface'
                }`}
              >
                <div>
                  <span className={`text-xs font-bold block ${isCurrent ? 'text-primary' : 'text-ink'}`}>
                    {stage.label}
                  </span>
                  <span className="text-[11px] text-muted">
                    {stage.desc}
                  </span>
                </div>
                {isCurrent && (
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Surcharge Test */}
      <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
          2. Test Locked Fare Surcharge Rule
        </h2>
        <p className="text-xs text-muted mb-4 leading-relaxed">
          Rule: The locked fare can <strong>never</strong> change without explicit customer approval. Triggering this modal allows you to test both approving and declining extra driver fees.
        </p>

        <button
          type="button"
          onClick={() => triggerSurchargeModal({ 
            amount: 80, 
            reason: 'Toll fee at NH 48 Plaza',
            plazaOrLocation: 'Khed Shivapur Toll Plaza, NH 48'
          })}
          className="w-full py-3.5 px-4 bg-status-warning hover:bg-amber-600 text-ink font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-xs flex items-center justify-center space-x-2 cursor-pointer"
        >
          <DollarSign className="w-4 h-4" />
          <span>Simulate Driver Requesting +₹80 Surcharge</span>
        </button>
      </div>

      {/* Jump to Any Screen */}
      <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
          3. Direct Navigation to Any Screen
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {screens.map((sc) => (
            <button
              key={sc.path}
              onClick={() => navigate(sc.path)}
              className="p-2.5 rounded-xl border border-border hover:border-primary hover:bg-surface text-xs font-semibold text-ink flex items-center justify-between text-left transition-colors cursor-pointer"
            >
              <span>{sc.name}</span>
              <ExternalLink className="w-3 h-3 text-muted" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
