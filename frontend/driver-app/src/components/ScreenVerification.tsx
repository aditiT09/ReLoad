import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Truck, 
  ThermometerSnowflake, 
  ArrowRight,
  Flame
} from 'lucide-react';
import { Certification, Vehicle, CertStatus } from '../types';

interface ScreenVerificationProps {
  certifications: Certification[];
  activeVehicle: Vehicle;
  onProceedToHome: () => void;
  onSwitchVehicle: (vehicleId: string) => void;
  allVehicles: Vehicle[];
}

export const ScreenVerification: React.FC<ScreenVerificationProps> = ({
  certifications,
  activeVehicle,
  onProceedToHome,
  onSwitchVehicle,
  allVehicles,
}) => {
  const getStatusBadge = (status: CertStatus) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center space-x-1 text-xs font-bold text-status-verified bg-status-verified-tint px-2.5 py-1 rounded-full border border-status-verified/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>VERIFIED</span>
          </span>
        );
      case 'due':
        return (
          <span className="inline-flex items-center space-x-1 text-xs font-bold text-status-warning bg-status-warning-tint px-2.5 py-1 rounded-full border border-status-warning/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>DUE SOON</span>
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center space-x-1 text-xs font-bold text-status-critical bg-status-critical-tint px-2.5 py-1 rounded-full border border-status-critical/30">
            <XCircle className="w-3.5 h-3.5" />
            <span>EXPIRED</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] p-4 max-w-2xl mx-auto space-y-5 pb-8 select-none">
      {/* Top Banner: Verification Status */}
      <div className="bg-ink text-card rounded-2xl p-5 shadow-sm border border-white/10">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-tint flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-primary-tint" />
              <span>DRIVER CLEARANCE: ACTIVE</span>
            </span>
            <h1 className="text-2xl font-display font-extrabold text-card tracking-tight">
              Verification Status
            </h1>
            <p className="text-sm text-border">
              Clearance for Standard & Cold-Chain medical cargo dispatch
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-card">
            <ShieldCheck className="w-7 h-7" />
          </div>
        </div>

        {/* Vehicle Suitability Overview */}
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-white/60 font-medium">Active Assigned Rig</div>
            <div className="font-bold text-card text-sm mt-0.5">{activeVehicle.makeModel}</div>
            <div className="text-white/70 font-mono mt-0.5">{activeVehicle.licensePlate}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-white/60 font-medium">Cargo Clearance</div>
            <div className="font-bold text-primary-tint text-sm mt-0.5 flex items-center space-x-1">
              <ThermometerSnowflake className="w-4 h-4 text-regulated-cargo" />
              <span>Cold-Chain Approved</span>
            </div>
            <div className="text-white/70 mt-0.5">Payload up to {activeVehicle.maxPayloadKg} kg</div>
          </div>
        </div>
      </div>

      {/* Regulated Cargo Vehicle Requirement Notice */}
      <div className="bg-card rounded-2xl p-4 border border-border shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-base text-ink flex items-center space-x-2">
            <Truck className="w-5 h-5 text-primary" />
            <span>Vehicle Cargo Match</span>
          </h2>
          <span className="text-xs font-semibold text-muted">Select Active Vehicle</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {allVehicles.map((v) => {
            const isSelected = v.id === activeVehicle.id;
            return (
              <button
                key={v.id}
                onClick={() => onSwitchVehicle(v.id)}
                className={`text-left p-3 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-primary bg-primary-tint/30 shadow-sm' 
                    : 'border-border bg-card hover:border-neutral-state'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink truncate">{v.type}</span>
                  {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
                <div className="font-mono text-xs text-muted mt-1">{v.licensePlate}</div>
                <div className="mt-2 text-[11px] font-bold">
                  {v.isReeferCertified ? (
                    <span className="text-regulated-cargo flex items-center space-x-1">
                      <ThermometerSnowflake className="w-3.5 h-3.5" />
                      <span>Cold-Chain OK</span>
                    </span>
                  ) : v.isHazmatCertified ? (
                    <span className="text-status-warning flex items-center space-x-1">
                      <Flame className="w-3.5 h-3.5" />
                      <span>Hazmat Shielded</span>
                    </span>
                  ) : (
                    <span className="text-muted">Dry Freight Only</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Regulated Cargo & Driver Certifications with strict colors */}
      <div className="bg-card rounded-2xl p-4 border border-border shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div>
            <h2 className="font-display font-bold text-base text-ink">
              Credentials & Inspections
            </h2>
            <p className="text-xs text-muted">
              Regulatory compliance required for cargo custody
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-neutral-state-tint text-ink px-2 py-1 rounded">
            5 Registered
          </span>
        </div>

        <div className="space-y-2.5">
          {certifications.map((cert) => (
            <div 
              key={cert.id} 
              className="p-3.5 rounded-xl border border-border hover:border-neutral-state bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-ink">{cert.title}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted bg-neutral-state-tint px-1.5 py-0.5 rounded">
                    {cert.category}
                  </span>
                </div>
                <p className="text-xs text-muted">{cert.description}</p>
                <div className="text-[11px] text-muted font-mono pt-0.5">
                  ID: {cert.badgeNumber} • Expires: {cert.expiryDate}
                </div>
              </div>
              <div className="self-start sm:self-center">
                {getStatusBadge(cert.status)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button to Proceed */}
      <div className="pt-2 sticky bottom-16 bg-surface/90 backdrop-blur-sm py-3">
        <button
          onClick={onProceedToHome}
          className="touch-btn w-full bg-primary hover:bg-primary-dark text-card font-display font-bold text-lg rounded-xl flex items-center justify-center space-x-2 py-4 shadow-lg active:scale-[0.99] transition-all cursor-pointer"
        >
          <span>Open Job Dispatch & Requests</span>
          <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-center text-xs text-muted mt-2">
          Step 3 of 10 • Ready to receive nearby cargo requests
        </p>
      </div>
    </div>
  );
};
