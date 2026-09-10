import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, DollarSign, ChevronUp, ChevronDown, CheckCircle2, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BookingStatus } from '../../types';

export const DevControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { 
    currentBooking, 
    advanceBookingStatus, 
    triggerSurchargeModal,
    resetToDefaultState 
  } = useApp();

  const statuses: BookingStatus[] = [
    'requested',
    'accepted',
    'pickup_confirmed',
    'in_transit',
    'delivered',
    'closed',
  ];

  return (
    <div className="fixed top-16 right-3 z-30 flex flex-col items-end print:hidden">
      {/* Dev pill toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 bg-ink hover:bg-admin-shell text-status-warning border border-status-warning/40 px-2.5 py-1 rounded-full shadow-lg text-[11px] font-mono font-bold tracking-tight focus:outline-none transition-all cursor-pointer"
        title="Toggle simulation controller"
      >
        <span className="w-2 h-2 rounded-full bg-status-warning animate-ping" />
        <span>SIMULATOR</span>
        {isOpen ? <ChevronUp className="w-3 h-3 text-status-warning" /> : <ChevronDown className="w-3 h-3 text-status-warning" />}
      </button>

      {/* Expanded drawer */}
      {isOpen && (
        <div className="mt-2 w-72 bg-ink border border-border/30 rounded-xl shadow-2xl p-3 text-card text-xs font-mono animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-border/20 mb-2.5">
            <span className="text-[10px] text-muted uppercase tracking-wider font-bold">
              Dispatch & Escrow Engine
            </span>
            <button
              onClick={resetToDefaultState}
              className="text-[10px] text-regulated-cargo hover:underline flex items-center space-x-0.5 cursor-pointer"
              title="Reset state"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Current Stage */}
          <div className="mb-2.5 bg-card/10 p-2 rounded-lg">
            <div className="text-[10px] text-muted">Current Stage:</div>
            <div className="font-bold text-status-verified uppercase tracking-wide flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{currentBooking.status.replace('_', ' ')}</span>
            </div>
          </div>

          {/* Lifecycle Quick Switch */}
          <div className="space-y-1 mb-3">
            <div className="text-[10px] text-muted mb-1">Advance Status:</div>
            <div className="grid grid-cols-2 gap-1.5">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => advanceBookingStatus(s)}
                  className={`text-[10px] text-left px-2 py-1 rounded transition-colors cursor-pointer ${
                    currentBooking.status === s 
                      ? 'bg-primary text-card font-bold' 
                      : 'bg-card/10 text-muted hover:bg-card/20 hover:text-card'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Special Actions */}
          <div className="space-y-1.5 pt-2 border-t border-border/20">
            <button
              onClick={() => triggerSurchargeModal({ amount: 80, reason: 'Toll Plaza Surcharge (NH 48 Flyover Toll)' })}
              className="w-full py-1.5 px-2 bg-status-warning-tint/20 hover:bg-status-warning-tint/30 border border-status-warning/40 text-status-warning rounded text-left flex items-center justify-between text-[11px] font-semibold cursor-pointer"
            >
              <span className="flex items-center space-x-1">
                <DollarSign className="w-3 h-3" />
                <span>Trigger Surcharge (+₹80)</span>
              </span>
              <span className="text-[9px] bg-status-warning-tint text-status-warning px-1 rounded font-bold">FASTag</span>
            </button>

            <div className="grid grid-cols-2 gap-1 pt-1">
              <button
                onClick={() => navigate('/handoff/pickup')}
                className="text-[10px] bg-card/10 hover:bg-card/20 text-muted hover:text-card p-1.5 rounded text-center cursor-pointer"
              >
                Handoff (Pickup)
              </button>
              <button
                onClick={() => navigate('/handoff/dropoff')}
                className="text-[10px] bg-card/10 hover:bg-card/20 text-muted hover:text-card p-1.5 rounded text-center cursor-pointer"
              >
                Handoff (Dropoff)
              </button>
              <button
                onClick={() => navigate('/payment')}
                className="text-[10px] bg-card/10 hover:bg-card/20 text-muted hover:text-card p-1.5 rounded text-center cursor-pointer"
              >
                Go to Payment
              </button>
              <button
                onClick={() => navigate('/report')}
                className="text-[10px] bg-card/10 hover:bg-card/20 text-muted hover:text-card p-1.5 rounded text-center cursor-pointer"
              >
                File Dispute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
