import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, 
  Phone, 
  MessageSquare, 
  ShieldAlert, 
  MapPin, 
  Lock, 
  ArrowRight, 
  Star, 
  Clock, 
  ThermometerSnowflake, 
  Gauge, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookingStatus } from '../types';

export const ActiveTripScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentBooking, telematics, t } = useApp();

  const activeTelematics = telematics || {
    etaHours: 14.5,
    progressPercent: currentBooking.telematics?.routeProgressPercent ?? 54,
    speedKmph: currentBooking.telematics?.currentSpeedKmph ?? 62,
    temperatureC: currentBooking.telematics?.currentTempCelsius ?? 3.8,
    remainingDistanceKm: Math.round(842 * (1 - (currentBooking.telematics?.routeProgressPercent ?? 54) / 100)),
  };

  // Plain 5 stages mapping
  const stages: {
    key: BookingStatus;
    label: string;
    description: string;
  }[] = [
    { key: 'requested', label: t.activeTrip.stages.requested, description: 'Matching nearest verified driver' },
    { key: 'accepted', label: t.activeTrip.stages.accepted, description: 'Driver is arriving at pickup location' },
    { key: 'pickup_confirmed', label: t.activeTrip.stages.pickup_confirmed, description: 'Cargo securely loaded and sealed' },
    { key: 'in_transit', label: t.activeTrip.stages.in_transit, description: 'Truck is on highway route' },
    { key: 'delivered', label: t.activeTrip.stages.delivered, description: 'Arrived at delivery location' },
  ];

  const getStageIndex = (status: BookingStatus) => {
    switch (status) {
      case 'requested': return 0;
      case 'accepted': return 1;
      case 'pickup_confirmed': return 2;
      case 'in_transit': return 3;
      case 'delivered':
      case 'closed':
        return 4;
      default: return 1;
    }
  };

  const currentStageIdx = getStageIndex(currentBooking.status);

  // Status-dependent handoff CTA - only one primary CTA uses Trust Teal
  const renderHandoffCTA = () => {
    if (currentBooking.status === 'accepted') {
      return (
        <button
          onClick={() => navigate('/handoff/pickup')}
          className="w-full py-3.5 px-4 bg-primary hover:bg-primary-dark active:scale-[0.99] text-card rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Confirm Cargo Loaded (Pickup)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      );
    }

    if (currentBooking.status === 'in_transit') {
      return (
        <button
          onClick={() => navigate('/handoff/dropoff')}
          className="w-full py-3.5 px-4 bg-primary hover:bg-primary-dark active:scale-[0.99] text-card rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Confirm Delivery (Drop-off)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      );
    }

    if (currentBooking.status === 'delivered') {
      return (
        <button
          onClick={() => navigate('/payment')}
          className="w-full py-3.5 px-4 bg-primary hover:bg-primary-dark active:scale-[0.99] text-card rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Lock className="w-4 h-4" />
          <span>Review Receipt & Settle Payment</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      );
    }

    return null;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* Top Banner: Booking ID & Status */}
      <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold bg-primary-tint text-primary px-2.5 py-0.5 rounded-full border border-primary/30">
              Trip #{currentBooking.consignmentId}
            </span>
            <span className="text-xs text-muted">
              {currentBooking.selectedVehicleName}
            </span>
          </div>
          <h1 className="font-condensed font-bold text-2xl sm:text-3xl text-ink mt-1">
            {stages[currentStageIdx].label}
          </h1>
          <p className="text-xs text-muted mt-0.5">
            {stages[currentStageIdx].description}
          </p>
        </div>

        {/* Locked Fare Display */}
        <div className="bg-ink text-card p-4 rounded-xl border border-border/20 sm:text-right">
          <span className="text-[10px] font-mono text-status-verified font-bold uppercase tracking-wider flex items-center sm:justify-end space-x-1">
            <Lock className="w-3 h-3" />
            <span>LOCKED FARE</span>
          </span>
          <div className="font-condensed font-bold text-2xl sm:text-3xl text-card">
            ₹{(currentBooking?.currentTotalFare ?? currentBooking?.lockedFare ?? 34800).toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-muted block">
            Will not change without your approval
          </span>
        </div>
      </div>

      {/* 5-Stage Visual Progress Tracker */}
      <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-5">
          Trip Progress
        </h2>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-surface -z-0 hidden sm:block" />
          <div 
            className="absolute top-4 left-6 h-0.5 bg-primary -z-0 transition-all duration-500 hidden sm:block" 
            style={{ width: `${(currentStageIdx / (stages.length - 1)) * 100}%` }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {stages.map((stage, idx) => {
              const isPast = idx < currentStageIdx;
              const isCurrent = idx === currentStageIdx;

              return (
                <div key={stage.key} className="flex sm:flex-col items-center sm:text-center space-x-3 sm:space-x-0 relative z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                    isPast
                      ? 'bg-primary text-card shadow-xs'
                      : isCurrent
                      ? 'bg-ink text-card ring-4 ring-primary/20 shadow-md'
                      : 'bg-surface text-muted border border-border'
                  }`}>
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>

                  <div className="mt-0 sm:mt-2">
                    <span className={`text-xs font-bold block ${
                      isCurrent ? 'text-ink' : isPast ? 'text-primary' : 'text-muted'
                    }`}>
                      {stage.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Map & Live Route View */}
      <div className="bg-ink rounded-2xl overflow-hidden border border-border/20 shadow-md">
        <div className="p-4 bg-admin-shell border-b border-border/20 flex items-center justify-between text-xs text-card">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-status-verified animate-pulse" />
            <span className="font-bold">Live Route: NH 48 Corridor (842 km)</span>
          </div>
          <span className="font-mono text-muted">ETA: ~{activeTelematics.etaHours} hrs</span>
        </div>

        {/* Route Illustration Map Canvas */}
        <div className="relative h-60 bg-ink p-6 flex flex-col justify-between overflow-hidden">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(var(--color-surface)_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Road Visual Line */}
          <div className="relative my-auto">
            <div className="w-full h-3 bg-card/10 rounded-full relative overflow-hidden border border-border/20">
              {/* Animated dashed divider */}
              <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_20px,var(--color-status-warning)_20px,var(--color-status-warning)_40px)] opacity-70" />
            </div>

            {/* Truck Icon moving along progress */}
            <div 
              className="absolute -top-4 transition-all duration-700 ease-out"
              style={{ left: `${Math.min(Math.max(activeTelematics.progressPercent, 8), 90)}%`, transform: 'translateX(-50%)' }}
            >
              <div className="bg-primary text-card p-2 rounded-xl shadow-lg border border-card/20 flex items-center space-x-1.5 animate-bounce">
                <Truck className="w-4 h-4" />
                <span className="text-[10px] font-mono font-bold">{activeTelematics.speedKmph} km/h</span>
              </div>
            </div>
          </div>

          {/* Origin and Destination labels */}
          <div className="flex justify-between items-end relative z-10 text-xs font-medium">
            <div className="bg-admin-shell/90 backdrop-blur-xs p-2 rounded-xl border border-border/20 text-card">
              <div className="flex items-center space-x-1.5 text-status-verified">
                <MapPin className="w-3.5 h-3.5" />
                <span className="font-bold">Pickup</span>
              </div>
              <p className="text-[11px] text-muted truncate max-w-[160px] sm:max-w-xs">
                {currentBooking.originAddress || currentBooking.origin?.title || 'Bhiwandi, Mumbai MMR'}
              </p>
            </div>

            {/* Destination label - neutral-state marker instead of decorative red */}
            <div className="bg-admin-shell/90 backdrop-blur-xs p-2 rounded-xl border border-border/20 text-card text-right">
              <div className="flex items-center justify-end space-x-1.5 text-neutral-state">
                <span className="font-bold">Delivery</span>
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] text-muted truncate max-w-[160px] sm:max-w-xs">
                {currentBooking.destinationAddress || currentBooking.destination?.title || 'Whitefield, Bengaluru'}
              </p>
            </div>
          </div>
        </div>

        {/* Live Truck Vitals Bar */}
        <div className="p-3.5 bg-admin-shell border-t border-border/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-card">
          <div className="flex items-center space-x-2">
            <Gauge className="w-4 h-4 text-primary" />
            <span>Speed: <strong>{activeTelematics.speedKmph} km/h</strong></span>
          </div>

          <div className="flex items-center space-x-2">
            <ThermometerSnowflake className="w-4 h-4 text-regulated-cargo" />
            <span>Cargo Temp: <strong className="text-regulated-cargo">{activeTelematics.temperatureC}°C</strong></span>
          </div>

          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-status-warning" />
            <span>Remaining: <strong>{activeTelematics.remainingDistanceKm} km</strong></span>
          </div>

          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-status-verified" />
            <span>Digital Seal: <strong>INTACT</strong></span>
          </div>
        </div>
      </div>

      {/* Driver Card & Actions */}
      <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-ink text-card flex items-center justify-center font-bold text-xl font-condensed shadow-sm">
              RK
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-ink">
                  {currentBooking.driver?.name}
                </h3>
                <span className="inline-flex items-center space-x-1 text-[10px] font-bold bg-status-verified-tint text-status-verified px-2 py-0.5 rounded border border-status-verified/30">
                  Verified Driver
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5 font-mono">
                {currentBooking.driver?.vehicleRegistration} • {currentBooking.driver?.carrierCompany}
              </p>
              <div className="flex items-center space-x-1 text-xs text-status-warning mt-1">
                <Star className="w-3.5 h-3.5 fill-status-warning" />
                <span className="font-bold text-ink">{currentBooking.driver?.rating}</span>
                <span className="text-muted">• 1,420 trips completed</span>
              </div>
            </div>
          </div>

          {/* Call & Chat Buttons - Secondary outlined / neutral */}
          <div className="flex items-center space-x-2.5">
            <a
              href={`tel:${currentBooking.driver?.phone}`}
              className="px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-border text-ink text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span>{t.activeTrip.callDriver}</span>
            </a>

            <button
              onClick={() => navigate('/chat')}
              className="px-4 py-2.5 rounded-xl bg-ink hover:bg-admin-shell text-card text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t.activeTrip.openChat}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Call to Action */}
      {renderHandoffCTA()}

      {/* Report an Issue Link - Legitimate risk action uses text-status-critical */}
      <div className="text-center pt-2">
        <button
          onClick={() => navigate('/report')}
          className="text-xs text-status-critical hover:underline font-semibold inline-flex items-center space-x-1.5 cursor-pointer"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Have an issue with this trip? Report a Problem</span>
        </button>
      </div>
    </div>
  );
};
