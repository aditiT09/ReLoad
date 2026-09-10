import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  Check, 
  ArrowRight, 
  Clock, 
  Weight, 
  ThermometerSnowflake, 
  Star,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VehicleOption } from '../types';

export const VehicleSelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const { 
    vehicles, 
    currentBooking, 
    selectVehicle, 
    confirmBookingAndLockFare, 
    t 
  } = useApp();

  // Check if cargo is regulated (cold_chain, pharma, dairy)
  const isRegulatedCargo = 
    currentBooking.cargoCategory === 'cold_chain' ||
    currentBooking.cargoCategory === 'pharma' ||
    currentBooking.cargoCategory === 'dairy';

  // Filter vehicles: if regulated, only show verified refrigerated/thermal vehicles
  const filteredVehicles = isRegulatedCargo 
    ? (vehicles || []).filter(v => v && (v.hasActiveReefer || v.isRegulatedVerified))
    : (vehicles || []);
  const displayedVehicles = filteredVehicles.length > 0 ? filteredVehicles : (vehicles || []);

  // Selected vehicle state
  const [selectedId, setSelectedId] = useState<string>(
    currentBooking?.selectedVehicleId || displayedVehicles[0]?.id || 'veh-reefer-van'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedVehicle = displayedVehicles.find(v => v?.id === selectedId) || displayedVehicles[0] || (vehicles && vehicles[0]);

  const handleSelect = (vehicle: VehicleOption) => {
    setSelectedId(vehicle.id);
    selectVehicle(vehicle);
  };

  const handleConfirm = () => {
    if (!selectedVehicle) return;
    setIsSubmitting(true);

    confirmBookingAndLockFare(selectedVehicle);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/trip');
    }, 500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate('/book')}
        className="text-xs text-muted hover:text-ink flex items-center space-x-1 mb-4 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Locations</span>
      </button>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
          <Truck className="w-3.5 h-3.5" />
          <span>Step 2 of 2 • Vehicle & Fare</span>
        </div>
        <h1 className="font-condensed font-bold text-3xl sm:text-4xl text-ink tracking-tight">
          {t.vehicles.title}
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Select a verified vehicle. The fare shown is locked and guaranteed.
        </p>
      </div>

      {/* Regulated Cargo Filter Notice */}
      {isRegulatedCargo && (
        <div className="mb-5 p-3.5 bg-regulated-cargo-tint rounded-xl border border-regulated-cargo/30 flex items-start space-x-3 text-xs text-regulated-cargo">
          <ShieldCheck className="w-4 h-4 text-regulated-cargo shrink-0 mt-0.5" />
          <div>
            <strong className="block text-ink font-bold">Temperature Control Filter Applied</strong>
            <span className="text-muted">{t.vehicles.regulatedFilterNotice}</span>
          </div>
        </div>
      )}

      {/* Locked Fare Guarantee Explainer */}
      <div className="mb-6 p-4 sm:p-5 bg-ink text-card rounded-2xl border border-border/20 shadow-md">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-xl bg-status-verified-tint border border-status-verified/40 flex items-center justify-center text-status-verified shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-condensed font-bold text-lg text-card uppercase tracking-wider">
              {t.vehicles.fareLockedTitle}
            </h2>
            <p className="text-xs text-muted mt-0.5 leading-relaxed">
              {t.vehicles.fareLockedSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Vehicle Options List */}
      <div className="space-y-3.5 mb-6">
        {displayedVehicles.map((vehicle) => {
          const isSelected = vehicle.id === selectedId;

          return (
            <div
              key={vehicle.id}
              onClick={() => handleSelect(vehicle)}
              className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all bg-card relative ${
                isSelected
                  ? 'border-primary ring-2 ring-primary shadow-md'
                  : 'border-border hover:border-muted shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left details */}
                <div className="flex items-start space-x-3.5">
                  <div className={`p-3 rounded-xl shrink-0 ${
                    isSelected ? 'bg-primary text-card' : 'bg-surface text-ink'
                  }`}>
                    <Truck className="w-6 h-6" />
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-base text-ink">
                        {vehicle.name}
                      </h3>
                      {vehicle.isVerified && (
                        <span className="inline-flex items-center space-x-1 text-[10px] font-mono font-bold bg-status-verified-tint text-status-verified px-2 py-0.5 rounded border border-status-verified/30 uppercase">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{t.vehicles.verifiedBadge}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-1.5 text-xs text-muted">
                      <span className="flex items-center space-x-1">
                        <Weight className="w-3.5 h-3.5 text-primary" />
                        <span>Up to {(vehicle.capacityKg ?? 0).toLocaleString()} kg</span>
                      </span>

                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-regulated-cargo" />
                        <span>Arrives in {vehicle.etaMinutes ?? 30} mins</span>
                      </span>

                      <span className="flex items-center space-x-1">
                        <Star className="w-3.5 h-3.5 text-status-warning fill-status-warning" />
                        <span className="font-semibold text-ink">{vehicle.rating ?? 4.8}</span>
                      </span>
                    </div>

                    {vehicle.hasActiveReefer && (
                      <div className="mt-2 flex items-center space-x-1 text-xs font-mono font-semibold text-regulated-cargo">
                        <ThermometerSnowflake className="w-3.5 h-3.5" />
                        <span>{t.vehicles.tempGuaranteed} (2°C to 8°C validated)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Fare and Selection */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider block sm:text-right">
                      LOCKED FARE
                    </span>
                    <div className="font-condensed font-bold text-2xl sm:text-3xl text-ink">
                      ₹{(vehicle.baseRate ?? vehicle.baseFare ?? 0).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="mt-1 sm:mt-2">
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-primary text-card flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-border bg-surface" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Card - Single primary CTA uses Trust Teal */}
      <div className="bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-muted block">
            Selected: <strong>{selectedVehicle?.name || 'Selected Vehicle'}</strong>
          </span>
          <div className="flex items-baseline space-x-2">
            <span className="font-condensed font-bold text-3xl text-ink">
              ₹{(selectedVehicle?.baseRate ?? selectedVehicle?.baseFare ?? 0).toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-primary font-semibold">
              Guaranteed Locked Fare
            </span>
          </div>
        </div>

        <button
          type="button"
          id="btn-confirm-vehicle"
          onClick={handleConfirm}
          disabled={isSubmitting}
          className="py-4 px-6 rounded-xl bg-primary hover:bg-primary-dark active:scale-[0.99] text-card text-xs font-bold uppercase tracking-wider shadow-lg transition-all flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-card border-t-transparent rounded-full animate-spin" />
              <span>{t.vehicles.dispatching}</span>
            </div>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>{t.vehicles.confirmBooking}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
