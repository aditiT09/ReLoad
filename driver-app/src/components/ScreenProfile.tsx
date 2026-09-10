import React, { useState } from 'react';
import { 
  Truck, 
  ShieldCheck, 
  Award, 
  LogOut, 
  ThermometerSnowflake, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Volume2, 
  Sun, 
  Flame 
} from 'lucide-react';
import { DriverProfile, Vehicle, Certification, CertStatus } from '../types';

interface ScreenProfileProps {
  driver: DriverProfile;
  activeVehicle: Vehicle;
  allVehicles: Vehicle[];
  certifications: Certification[];
  onSwitchVehicle: (vehicleId: string) => void;
  onSignOut: () => void;
  onBackToHome: () => void;
}

export const ScreenProfile: React.FC<ScreenProfileProps> = ({
  driver,
  activeVehicle,
  allVehicles,
  certifications,
  onSwitchVehicle,
  onSignOut,
}) => {
  const [loudAudio, setLoudAudio] = useState(true);
  const [highContrast, setHighContrast] = useState(true);
  const [autoReeferPing, setAutoReeferPing] = useState(true);

  const getStatusBadge = (status: CertStatus) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center space-x-1 text-xs font-bold text-status-verified bg-status-verified-tint px-2.5 py-0.5 rounded-full border border-status-verified/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>VERIFIED</span>
          </span>
        );
      case 'due':
        return (
          <span className="inline-flex items-center space-x-1 text-xs font-bold text-status-warning bg-status-warning-tint px-2.5 py-0.5 rounded-full border border-status-warning/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>DUE SOON</span>
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center space-x-1 text-xs font-bold text-status-critical bg-status-critical-tint px-2.5 py-0.5 rounded-full border border-status-critical/30">
            <XCircle className="w-3.5 h-3.5" />
            <span>EXPIRED</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] p-4 max-w-2xl mx-auto space-y-4 pb-20 select-none">
      {/* Profile Header */}
      <div className="bg-ink text-card rounded-2xl p-5 shadow-sm border border-white/10 flex items-center space-x-4">
        <img
          src={driver.avatarUrl}
          alt={driver.fullName}
          className="w-16 h-16 rounded-2xl object-cover border-2 border-primary"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h1 className="font-display font-extrabold text-xl text-card truncate">
              {driver.fullName}
            </h1>
            <span className="text-xs font-bold bg-primary/40 text-primary-tint px-2 py-0.5 rounded border border-primary">
              {driver.callSign}
            </span>
          </div>
          <div className="text-xs text-white/70 mt-1 flex items-center space-x-2">
            <span>{driver.phone}</span>
            <span>•</span>
            <span>Member since {driver.memberSince}</span>
          </div>
          <div className="text-xs text-primary-tint font-semibold mt-1 flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-primary-tint" />
            <span>Tier 1 Commercial Cargo Master</span>
          </div>
        </div>
      </div>

      {/* Active Vehicle & Fleet Selector */}
      <div className="bg-card rounded-2xl p-4 border border-border shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-base text-ink flex items-center space-x-2">
              <Truck className="w-5 h-5 text-primary" />
              <span>Assigned Rig & Fleet Selection</span>
            </h2>
            <p className="text-xs text-muted">
              Regulated cargo match depends on active certified rig
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {allVehicles.map((v) => {
            const isSelected = v.id === activeVehicle.id;
            return (
              <div
                key={v.id}
                onClick={() => onSwitchVehicle(v.id)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-primary bg-primary-tint/30 shadow-sm'
                    : 'border-border hover:border-neutral-state'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-ink">{v.makeModel}</span>
                    <span className="font-mono text-xs text-muted">({v.licensePlate})</span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-card bg-primary px-2 py-0.5 rounded-full">
                        ACTIVE RIG
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted flex items-center space-x-2">
                    <span>Type: {v.type}</span>
                    <span>•</span>
                    <span>Max: {v.maxPayloadKg} kg</span>
                  </div>
                  <div className="text-xs font-semibold">
                    {v.isReeferCertified ? (
                      <span className="text-regulated-cargo flex items-center space-x-1">
                        <ThermometerSnowflake className="w-3.5 h-3.5" />
                        <span>Active Reefer Unit ({v.reeferTempMin}°C to {v.reeferTempMax}°C)</span>
                      </span>
                    ) : v.isHazmatCertified ? (
                      <span className="text-status-warning flex items-center space-x-1">
                        <Flame className="w-3.5 h-3.5" />
                        <span>Hazmat Shielded Approved</span>
                      </span>
                    ) : (
                      <span className="text-muted">Standard Dry Freight</span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-primary bg-primary text-card' : 'border-border'
                  }`}>
                    {isSelected ? '✓' : ''}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Regulated Cargo & Driver Certifications */}
      <div className="bg-card rounded-2xl p-4 border border-border shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h2 className="font-display font-bold text-base text-ink flex items-center space-x-2">
            <Award className="w-5 h-5 text-primary" />
            <span>Driver Clearances & Certificates</span>
          </h2>
          <span className="text-xs text-muted font-mono">5 on file</span>
        </div>

        <div className="space-y-2 text-xs">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-3 rounded-xl border border-border bg-surface flex items-center justify-between"
            >
              <div>
                <div className="font-bold text-sm text-ink">{cert.title}</div>
                <div className="text-muted text-[11px] font-mono">
                  {cert.badgeNumber} • Expires: {cert.expiryDate}
                </div>
              </div>
              <div>{getStatusBadge(cert.status)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Working Driver App Preferences */}
      <div className="bg-card rounded-2xl p-4 border border-border shadow-sm space-y-3">
        <h3 className="font-display font-bold text-base text-ink">
          Driver Ergonomics & Alerts
        </h3>

        <div className="space-y-2 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl border border-border cursor-pointer">
            <div className="flex items-center space-x-2.5">
              <Volume2 className="w-5 h-5 text-primary" />
              <div>
                <strong className="text-ink">High-Volume Dock Arrival Chime</strong>
                <div className="text-muted">Audible over heavy engine & dock machinery</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={loudAudio}
              onChange={(e) => setLoudAudio(e.target.checked)}
              className="w-5 h-5 text-primary rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-border cursor-pointer">
            <div className="flex items-center space-x-2.5">
              <Sun className="w-5 h-5 text-status-warning" />
              <div>
                <strong className="text-ink">Outdoor Sun High-Contrast Palette</strong>
                <div className="text-muted">Optimized for daylight windshield mounting</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              className="w-5 h-5 text-primary rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-border cursor-pointer">
            <div className="flex items-center space-x-2.5">
              <ThermometerSnowflake className="w-5 h-5 text-regulated-cargo" />
              <div>
                <strong className="text-ink">Active Chiller Telemetry Auto-Ping</strong>
                <div className="text-muted">Upload cargo temperature every 60 seconds</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={autoReeferPing}
              onChange={(e) => setAutoReeferPing(e.target.checked)}
              className="w-5 h-5 text-primary rounded"
            />
          </label>
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="pt-2">
        <button
          onClick={onSignOut}
          className="touch-btn w-full bg-card border-2 border-status-critical/40 hover:bg-status-critical-tint text-status-critical font-display font-bold text-base rounded-xl py-3.5 flex items-center justify-center space-x-2 transition-all shadow-sm cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out / End Driver Shift</span>
        </button>
        <p className="text-center text-xs text-muted mt-2">
          Step 10 of 10 in full driver lifecycle
        </p>
      </div>
    </div>
  );
};
