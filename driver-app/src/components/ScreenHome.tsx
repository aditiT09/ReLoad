import React, { useState } from 'react';
import { 
  Package, 
  ThermometerSnowflake, 
  Flame, 
  AlertCircle, 
  CheckCircle2, 
  Truck, 
  ArrowRight, 
  Navigation 
} from 'lucide-react';
import { CargoJob, Vehicle } from '../types';

interface ScreenHomeProps {
  availableJobs: CargoJob[];
  activeVehicle: Vehicle;
  onAcceptJob: (job: CargoJob) => void;
  onSwitchVehicle: (vehicleId: string) => void;
  allVehicles: Vehicle[];
  isOnline: boolean;
  onToggleOnline: () => void;
  activeJob: CargoJob | null;
  onViewActiveTrip: () => void;
}

export const ScreenHome: React.FC<ScreenHomeProps> = ({
  availableJobs,
  activeVehicle,
  onAcceptJob,
  onSwitchVehicle,
  allVehicles,
  isOnline,
  onToggleOnline,
  activeJob,
  onViewActiveTrip,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'cold_chain' | 'standard'>('all');

  // Helper to check vehicle eligibility
  const checkVehicleEligibility = (job: CargoJob): { eligible: boolean; reason?: string } => {
    if (job.cargoType === 'cold_chain') {
      if (!activeVehicle.isReeferCertified) {
        return {
          eligible: false,
          reason: 'Regulated Cold-Chain: Requires Verified Refrigerated Van with telemetry sensor',
        };
      }
    }
    if (job.cargoType === 'regulated_hazmat') {
      if (!activeVehicle.isHazmatCertified) {
        return {
          eligible: false,
          reason: 'Regulated Hazmat: Requires Hazmat certified flatbed & containment lockbox',
        };
      }
    }
    return { eligible: true };
  };

  const filteredJobs = availableJobs.filter((j) => {
    if (selectedFilter === 'cold_chain') return j.cargoType === 'cold_chain';
    if (selectedFilter === 'standard') return j.cargoType === 'standard';
    return true;
  });

  return (
    <div className="min-h-[calc(100vh-120px)] p-4 max-w-2xl mx-auto space-y-4 pb-12 select-none">
      {/* Online / Offline Status Bar */}
      <div className={`p-4 rounded-2xl flex items-center justify-between shadow-sm border ${
        isOnline 
          ? 'bg-ink text-card border-white/10' 
          : 'bg-status-warning-tint text-ink border-status-warning/40'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-4 h-4 rounded-full ${
            isOnline ? 'bg-status-verified animate-ping' : 'bg-status-warning'
          }`} />
          <div>
            <div className="font-display font-extrabold text-base tracking-tight">
              {isOnline ? 'YOU ARE ONLINE — RECEIVING JOBS' : 'YOU ARE OFFLINE'}
            </div>
            <div className={`text-xs ${isOnline ? 'text-white/70' : 'text-ink/70'}`}>
              {isOnline 
                ? 'Nearby cargo matches sent in real time' 
                : 'Turn on to accept high-paying loads'}
            </div>
          </div>
        </div>

        <button
          onClick={onToggleOnline}
          className={`touch-btn px-4 py-2 rounded-xl text-xs font-bold transition-all shadow cursor-pointer ${
            isOnline 
              ? 'bg-primary hover:bg-primary-dark text-card' 
              : 'bg-primary hover:bg-primary-dark text-card'
          }`}
        >
          {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
        </button>
      </div>

      {/* Active Trip Banner if one is in progress */}
      {activeJob && (
        <div className="bg-primary text-card p-4 rounded-2xl shadow-md flex items-center justify-between border-2 border-white/20">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
              <Navigation className="w-3.5 h-3.5 animate-pulse" />
              <span>Active Trip in Progress</span>
            </div>
            <h3 className="font-display font-bold text-lg text-card">
              {activeJob.title}
            </h3>
            <p className="text-xs text-primary-tint">
              Guaranteed Pay: <span className="font-mono font-bold text-base text-card">₹{activeJob.baseFare.toFixed(2)}</span>
            </p>
          </div>
          <button
            onClick={onViewActiveTrip}
            className="touch-btn bg-card text-primary font-display font-bold text-sm px-4 py-3 rounded-xl shadow hover:bg-surface flex items-center space-x-1.5 active:scale-95 transition-all cursor-pointer"
          >
            <span>Resume Trip</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Current Active Rig & Fast Switch Bar */}
      <div className="bg-card rounded-2xl p-3.5 border border-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-neutral-state-tint flex items-center justify-center text-ink">
            <Truck className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-xs font-semibold text-muted uppercase tracking-wider">
              Current Vehicle
            </div>
            <div className="font-bold text-ink text-sm flex items-center space-x-1.5">
              <span>{activeVehicle.makeModel}</span>
              <span className="font-mono text-xs text-muted">({activeVehicle.licensePlate})</span>
            </div>
            <div className="text-xs font-bold mt-0.5">
              {activeVehicle.isReeferCertified ? (
                <span className="text-regulated-cargo flex items-center space-x-1">
                  <ThermometerSnowflake className="w-3.5 h-3.5" />
                  <span>Refrigerated Chiller Verified ({activeVehicle.reeferTempMin}°C to {activeVehicle.reeferTempMax}°C)</span>
                </span>
              ) : activeVehicle.isHazmatCertified ? (
                <span className="text-status-warning flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Hazmat Shielded Approved</span>
                </span>
              ) : (
                <span className="text-muted">Standard Dry Cargo Only</span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Rig Switch Dropdown */}
        <div className="self-end sm:self-center">
          <select
            value={activeVehicle.id}
            onChange={(e) => onSwitchVehicle(e.target.value)}
            className="text-xs font-bold bg-surface text-ink px-3 py-2 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          >
            {allVehicles.map((v) => (
              <option key={v.id} value={v.id}>
                Switch: {v.type} ({v.licensePlate})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Tabs for Driver One-Handed Tapping */}
      <div className="flex space-x-2">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedFilter === 'all'
              ? 'bg-ink text-card shadow'
              : 'bg-card text-muted border border-border'
          }`}
        >
          All Cargo ({availableJobs.length})
        </button>
        <button
          onClick={() => setSelectedFilter('cold_chain')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 cursor-pointer ${
            selectedFilter === 'cold_chain'
              ? 'bg-regulated-cargo text-card shadow'
              : 'bg-card text-regulated-cargo border border-border'
          }`}
        >
          <ThermometerSnowflake className="w-3.5 h-3.5" />
          <span>Cold-Chain</span>
        </button>
        <button
          onClick={() => setSelectedFilter('standard')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedFilter === 'standard'
              ? 'bg-primary text-card shadow'
              : 'bg-card text-primary border border-border'
          }`}
        >
          Dry Cargo
        </button>
      </div>

      {/* Available Requests Cards */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between text-xs font-bold text-muted uppercase tracking-wider">
          <span>Available Nearby Loads</span>
          <span>Fast Direct Match</span>
        </div>

        {filteredJobs.map((job) => {
          const eligibility = checkVehicleEligibility(job);
          const isEligible = eligibility.eligible;

          return (
            <div
              key={job.id}
              className={`bg-card rounded-2xl border p-4 shadow-sm transition-all ${
                isEligible ? 'border-border hover:border-primary' : 'border-border opacity-90'
              }`}
            >
              {/* Header: Cargo Type Badge & Guaranteed Pay */}
              <div className="flex items-start justify-between pb-3 border-b border-border">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    {job.cargoType === 'cold_chain' ? (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-card bg-regulated-cargo px-2.5 py-0.5 rounded-full">
                        <ThermometerSnowflake className="w-3.5 h-3.5" />
                        <span>COLD-CHAIN (2°C - 8°C)</span>
                      </span>
                    ) : job.cargoType === 'regulated_hazmat' ? (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-card bg-status-warning px-2.5 py-0.5 rounded-full">
                        <Flame className="w-3.5 h-3.5" />
                        <span>REGULATED HAZMAT</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-xs font-bold text-ink bg-neutral-state-tint px-2.5 py-0.5 rounded-full">
                        <Package className="w-3.5 h-3.5 text-muted" />
                        <span>STANDARD CARGO</span>
                      </span>
                    )}
                    <span className="text-xs font-mono font-bold text-muted">
                      {job.orderNumber}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-ink leading-snug">
                    {job.title}
                  </h3>
                </div>

                {/* Guaranteed Payout */}
                <div className="text-right">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted">
                    Guaranteed Pay
                  </div>
                  <div className="font-display font-extrabold text-2xl text-primary">
                    ₹{job.baseFare.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-muted">
                    + Customer surcharges if approved
                  </div>
                </div>
              </div>

              {/* Route & Cargo Details in Glanceable Grid */}
              <div className="py-3 space-y-2.5">
                {/* Pickup */}
                <div className="flex items-start space-x-2.5">
                  <div className="w-6 h-6 rounded-full bg-primary-tint text-primary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    P
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-muted font-semibold">PICKUP • {job.pickup.distanceAway} away</div>
                    <div className="font-bold text-sm text-ink truncate">{job.pickup.facilityName}</div>
                    <div className="text-xs text-muted truncate">{job.pickup.address}</div>
                  </div>
                </div>

                {/* Dropoff */}
                <div className="flex items-start space-x-2.5">
                  <div className="w-6 h-6 rounded-full bg-neutral-state-tint text-neutral-state font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    D
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-muted font-semibold">DROPOFF • {job.dropoff.distanceFromPickup} trip</div>
                    <div className="font-bold text-sm text-ink truncate">{job.dropoff.facilityName}</div>
                    <div className="text-xs text-muted truncate">{job.dropoff.address}</div>
                  </div>
                </div>

                {/* Specs: Weight, Packages */}
                <div className="bg-surface rounded-xl p-2.5 flex items-center justify-between text-xs text-ink border border-border">
                  <div>
                    <span className="text-muted">Weight:</span> <strong className="font-semibold">{job.weight}</strong>
                  </div>
                  <div>
                    <span className="text-muted">Cargo:</span> <strong className="font-semibold">{job.packagesCount} containers</strong>
                  </div>
                  <div>
                    <span className="text-muted">Delivery:</span> <strong className="font-semibold">{job.dropoff.requiredBy}</strong>
                  </div>
                </div>
              </div>

              {/* Regulated Cargo Vehicle Match Rule */}
              {!isEligible ? (
                <div className="mt-2 p-3 rounded-xl bg-status-critical-tint border border-status-critical/30 text-xs space-y-2">
                  <div className="flex items-start space-x-2 text-status-critical font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{eligibility.reason}</span>
                  </div>
                  <p className="text-ink">
                    Switch to a certified vehicle in your fleet to unlock and accept this regulated cargo.
                  </p>
                  <button
                    onClick={() => {
                      if (job.cargoType === 'cold_chain') onSwitchVehicle('veh-1');
                      if (job.cargoType === 'regulated_hazmat') onSwitchVehicle('veh-3');
                    }}
                    className="touch-btn w-full bg-ink text-card font-bold py-2 rounded-lg text-xs hover:bg-admin-shell transition-colors cursor-pointer"
                  >
                    Switch to {job.requiredVehicleType} ({job.cargoType === 'cold_chain' ? 'Reefer Van' : 'Hazmat'})
                  </button>
                </div>
              ) : (
                <div className="mt-2 flex items-center space-x-1.5 text-xs text-status-verified font-bold bg-status-verified-tint px-3 py-1.5 rounded-lg border border-status-verified/30">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified Vehicle Match: {activeVehicle.makeModel} is certified for this load</span>
                </div>
              )}

              {/* Large Touch Accept Button */}
              <div className="mt-3.5 pt-2">
                <button
                  onClick={() => onAcceptJob(job)}
                  disabled={!isEligible || !isOnline}
                  className={`touch-btn w-full font-display font-bold text-base py-3.5 rounded-xl shadow flex items-center justify-center space-x-2 transition-all active:scale-[0.99] cursor-pointer ${
                    !isOnline
                      ? 'bg-neutral-state text-card cursor-not-allowed opacity-60'
                      : isEligible
                      ? 'bg-primary hover:bg-primary-dark text-card'
                      : 'bg-neutral-state text-card cursor-not-allowed opacity-60'
                  }`}
                >
                  {!isOnline ? (
                    <span>Go Online to Accept Job</span>
                  ) : isEligible ? (
                    <>
                      <span>Accept Job • ₹{job.baseFare.toFixed(2)} Guaranteed</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  ) : (
                    <span>Vehicle Verification Required</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
