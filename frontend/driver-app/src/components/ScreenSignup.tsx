import React, { useState } from 'react';
import { 
  Truck, 
  ShieldCheck, 
  User, 
  ArrowRight, 
  ThermometerSnowflake, 
  Flame
} from 'lucide-react';
import { DriverProfile, Vehicle } from '../types';

interface ScreenSignupProps {
  onSignupSuccess: (newDriver: Partial<DriverProfile>, newVehicle: Partial<Vehicle>) => void;
  onNavigateToLogin: () => void;
}

export const ScreenSignup: React.FC<ScreenSignupProps> = ({
  onSignupSuccess,
  onNavigateToLogin,
}) => {
  const [fullName, setFullName] = useState('Rajesh Kumar');
  const [phone, setPhone] = useState('98452 19820');
  const [licenseNumber, setLicenseNumber] = useState('DL-042024-9982');
  const [cityHub, setCityHub] = useState('Mumbai Logistics Hub');
  const [vehicleType, setVehicleType] = useState<'Refrigerated Van' | 'Dry Cargo Van' | 'Hazmat Flatbed'>('Refrigerated Van');
  const [vehicleModel, setVehicleModel] = useState('Tata Winger Reefer Chiller');
  const [licensePlate, setLicensePlate] = useState('MH-12-TR-902');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleVehicleTypeChange = (type: 'Refrigerated Van' | 'Dry Cargo Van' | 'Hazmat Flatbed') => {
    setVehicleType(type);
    if (type === 'Refrigerated Van') {
      setVehicleModel('Tata Winger Reefer Chiller');
      setLicensePlate('MH-12-TR-902');
    } else if (type === 'Dry Cargo Van') {
      setVehicleModel('Mahindra Bolero Maxi Truck');
      setLicensePlate('DL-01-WG-118');
    } else {
      setVehicleModel('Eicher Pro 2049 Shielded Flatbed');
      setLicensePlate('KA-04-HZ-441');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !licenseNumber.trim()) {
      setErrorMessage('Please fill in all mandatory registration fields.');
      return;
    }
    if (!agreedTerms) {
      setErrorMessage('Please accept the commercial cargo guidelines to proceed.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    const formattedPhone = phone.startsWith('+91') ? phone : `+91 ${phone}`;

    setTimeout(() => {
      setIsLoading(false);
      onSignupSuccess(
        {
          fullName,
          phone: formattedPhone,
          callSign: `Unit ${licensePlate.slice(-4)}`,
          memberSince: 'March 2026',
        },
        {
          makeModel: vehicleModel,
          licensePlate,
          type: vehicleType,
          isReeferCertified: vehicleType === 'Refrigerated Van',
          isHazmatCertified: vehicleType === 'Hazmat Flatbed',
        }
      );
    }, 450);
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col justify-between p-4 max-w-lg mx-auto select-none">
      <div className="pt-2 space-y-4">
        {/* Brand Header */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-md text-card">
            <Truck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-extrabold text-ink tracking-tight">
              Commercial Cargo Driver
            </h1>
            <p className="text-xs font-semibold text-muted">
              High-Precision Cold-Chain & Heavy Freight Fleet
            </p>
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="bg-neutral-state-tint p-1 rounded-2xl flex items-center space-x-1 border border-border">
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="flex-1 py-2.5 rounded-xl font-display font-bold text-xs text-muted hover:text-ink transition-all text-center cursor-pointer"
          >
            Sign In
          </button>
          <button
            type="button"
            className="flex-1 py-2.5 rounded-xl font-display font-bold text-xs bg-card text-primary shadow-sm transition-all text-center"
          >
            Create Account (Sign Up)
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Section: Driver Personal Info */}
          <div className="bg-card rounded-2xl p-4 border border-border shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-primary" />
                <span>Driver Credentials</span>
              </span>
              <span className="text-[11px] font-bold text-status-verified bg-status-verified-tint px-2 py-0.5 rounded">
                Tier 1 Onboarding
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-ink mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rajesh Kumar"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-sm font-semibold text-ink bg-card"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-ink mb-1">
                Mobile Number (SMS OTP Verification)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted font-bold text-sm">
                  +91
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98452 19820"
                  required
                  className="w-full pl-13 pr-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-sm font-mono font-bold text-ink bg-card"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-ink mb-1">
                  Driving License No.
                </label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="DL-042024-9982"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-border focus:border-primary focus:outline-none text-xs font-mono font-bold text-ink bg-card"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-ink mb-1">
                  Operational Hub
                </label>
                <select
                  value={cityHub}
                  onChange={(e) => setCityHub(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-border focus:border-primary focus:outline-none text-xs font-semibold text-ink bg-card cursor-pointer"
                >
                  <option value="Mumbai Logistics Hub">Mumbai Hub</option>
                  <option value="Bengaluru Logistics Park">Bengaluru Park</option>
                  <option value="Delhi NCR Freight Hub">Delhi NCR Hub</option>
                  <option value="Chennai Port Corridor">Chennai Corridor</option>
                  <option value="Pune Industrial Cluster">Pune Cluster</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Rig & Cargo Certification */}
          <div className="bg-card rounded-2xl p-4 border border-border shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-bold uppercase tracking-wider text-muted flex items-center space-x-1.5">
                <Truck className="w-3.5 h-3.5 text-primary" />
                <span>Rig Type & Cargo Capability</span>
              </span>
              <span className="text-[11px] font-mono text-muted">
                Regulated Loads
              </span>
            </div>

            {/* Rig Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleVehicleTypeChange('Refrigerated Van')}
                className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                  vehicleType === 'Refrigerated Van'
                    ? 'border-regulated-cargo bg-regulated-cargo-tint text-regulated-cargo font-bold shadow-sm'
                    : 'border-border text-muted hover:border-neutral-state'
                }`}
              >
                <ThermometerSnowflake className="w-5 h-5 mx-auto mb-1 text-regulated-cargo" />
                <div className="text-[11px] leading-tight">Cold-Chain Reefer</div>
              </button>

              <button
                type="button"
                onClick={() => handleVehicleTypeChange('Dry Cargo Van')}
                className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                  vehicleType === 'Dry Cargo Van'
                    ? 'border-primary bg-primary-tint text-primary font-bold shadow-sm'
                    : 'border-border text-muted hover:border-neutral-state'
                }`}
              >
                <Truck className="w-5 h-5 mx-auto mb-1 text-primary" />
                <div className="text-[11px] leading-tight">Dry Cargo Freight</div>
              </button>

              <button
                type="button"
                onClick={() => handleVehicleTypeChange('Hazmat Flatbed')}
                className={`p-2.5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                  vehicleType === 'Hazmat Flatbed'
                    ? 'border-status-warning bg-status-warning-tint text-status-warning font-bold shadow-sm'
                    : 'border-border text-muted hover:border-neutral-state'
                }`}
              >
                <Flame className="w-5 h-5 mx-auto mb-1 text-status-warning" />
                <div className="text-[11px] leading-tight">Hazmat Shielded</div>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
                  Vehicle Model
                </label>
                <input
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs font-semibold text-ink bg-card"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-1">
                  Registration Plate
                </label>
                <input
                  type="text"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs font-mono font-bold text-ink bg-card"
                />
              </div>
            </div>
          </div>

          {/* Guidelines agreement */}
          <label className="flex items-start space-x-2.5 p-3 rounded-xl bg-card border border-border cursor-pointer">
            <input
              type="checkbox"
              checked={agreedTerms}
              onChange={(e) => setAgreedTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-primary rounded"
            />
            <span className="text-xs text-ink leading-relaxed">
              I certify commercial cargo readiness, unbroken cold-chain temperature telemetry compliance, and verified customer surcharge transparency.
            </span>
          </label>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-status-critical-tint border border-status-critical/30 text-xs font-bold text-status-critical">
              {errorMessage}
            </div>
          )}
        </form>
      </div>

      {/* Thumb-friendly Big Bottom Action */}
      <div className="pt-4 pb-2 space-y-2.5">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="touch-btn w-full bg-primary hover:bg-primary-dark text-card font-display font-bold text-lg rounded-xl flex items-center justify-center space-x-2 py-4 shadow-md active:scale-[0.99] transition-all cursor-pointer"
        >
          {isLoading ? (
            <span className="flex items-center space-x-2">
              <span className="w-5 h-5 border-2 border-card border-t-transparent rounded-full animate-spin" />
              <span>Registering Driver Profile...</span>
            </span>
          ) : (
            <>
              <span>Create Account & Send OTP</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="text-xs font-bold text-primary hover:underline inline-flex items-center space-x-1 cursor-pointer"
          >
            <span>Already have an account? Sign In with mobile number</span>
            <span>→</span>
          </button>
        </div>

        <div className="text-center">
          <span className="text-xs text-muted flex items-center justify-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Commercial Cargo Fleet • Fast Onboarding</span>
          </span>
        </div>
      </div>
    </div>
  );
};
