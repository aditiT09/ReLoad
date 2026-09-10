import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  ArrowRight, 
  ThermometerSnowflake, 
  Pill, 
  Package, 
  Milk, 
  Truck, 
  Info,
  Navigation,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CargoCategory } from '../types';

interface PresetLocation {
  name: string;
  address: string;
  city: string;
}

const PRESET_PICKUPS: PresetLocation[] = [
  { name: 'Bhiwandi Logistics Hub', address: 'Plot 42, Mankoli Naka, Bhiwandi', city: 'Mumbai MMR' },
  { name: 'JNPT Port Container Terminal', address: 'Gate 4, Nhava Sheva', city: 'Navi Mumbai' },
  { name: 'Chakan Industrial Zone', address: 'Phase II, Chakan MIDC', city: 'Pune' },
];

const PRESET_DROPOFFS: PresetLocation[] = [
  { name: 'Whitefield Tech Park Hub', address: 'EPIP Industrial Area, Whitefield', city: 'Bengaluru' },
  { name: 'Peenya Industrial Estate', address: '1st Stage, Peenya', city: 'Bengaluru' },
  { name: 'Electronic City Cargo Dock', address: 'Phase 1, Hosur Road', city: 'Bengaluru' },
];

export const NewBookingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentBooking, updateBookingDraft, t } = useApp();

  const [pickupAddress, setPickupAddress] = useState(
    currentBooking.originAddress || 'Plot 42, Mankoli Naka, Bhiwandi, Mumbai MMR'
  );
  const [dropoffAddress, setDropoffAddress] = useState(
    currentBooking.destinationAddress || 'Whitefield EPIP Warehouse, Bengaluru'
  );
  const [category, setCategory] = useState<CargoCategory>(currentBooking.cargoCategory || 'pharma');
  const [estimatedWeight, setEstimatedWeight] = useState(
    currentBooking.estimatedWeightKg ? String(currentBooking.estimatedWeightKg) : '2400'
  );

  const categories: {
    id: CargoCategory;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    isRegulated: boolean;
  }[] = [
    {
      id: 'general',
      title: t.booking?.general || 'General Dry Cargo',
      description: 'Standard palletized freight, cartons, dry manufactured goods',
      icon: Package,
      isRegulated: false,
    },
    {
      id: 'cold_chain',
      title: t.booking?.coldChain || 'Cold Chain Perishables',
      description: 'Meat, seafood, frozen perishables requiring -20°C active thermograph',
      icon: ThermometerSnowflake,
      isRegulated: true,
    },
    {
      id: 'pharma',
      title: t.booking?.pharma || 'Pharmaceuticals & Biologicals',
      description: 'Vaccines, biologicals, APIs requiring WHO-GDP calibrated +2°C to +8°C',
      icon: Pill,
      isRegulated: true,
    },
    {
      id: 'dairy',
      title: t.booking?.dairy || 'Chilled Dairy / FMCG',
      description: 'Fresh milk, paneer, and chilled FMCG items with active chillers',
      icon: Milk,
      isRegulated: true,
    },
    {
      id: 'other',
      title: t.booking?.other || 'Heavy Machinery / Flatbed',
      description: 'Heavy machinery, building materials, and oversized crates',
      icon: Truck,
      isRegulated: false,
    },
  ];

  const selectedCatObj = categories.find(c => c.id === category);
  const isRegulated = selectedCatObj?.isRegulated || false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupAddress.trim() || !dropoffAddress.trim()) return;

    updateBookingDraft({
      originAddress: pickupAddress,
      originCity: pickupAddress.includes('Pune') ? 'Pune' : 'Mumbai',
      destinationAddress: dropoffAddress,
      destinationCity: 'Bengaluru',
      cargoCategory: category,
      estimatedWeightKg: Number(estimatedWeight) || 2400,
    });

    navigate('/vehicles');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
          <Navigation className="w-3.5 h-3.5" />
          <span>Step 1 of 2 • Trip & Cargo Details</span>
        </div>
        <h1 className="font-condensed font-bold text-3xl sm:text-4xl text-ink tracking-tight">
          {t.booking.title}
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Enter pickup and delivery locations to lock your guaranteed fare.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Address Card */}
        <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
            Locations
          </h2>

          {/* Pickup Address */}
          <div>
            <label htmlFor="pickup-input" className="block text-xs font-semibold text-ink mb-1.5 flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span>{t.booking.pickupLabel}</span>
            </label>
            <div className="relative">
              <input
                id="pickup-input"
                type="text"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder="Enter pickup address or warehouse"
                className="w-full pl-9 pr-4 py-3 bg-surface border border-border rounded-xl text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <MapPin className="w-4 h-4 text-primary absolute left-3 top-3.5" />
            </div>

            {/* Quick location chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {PRESET_PICKUPS.map((loc) => (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() => setPickupAddress(`${loc.name}, ${loc.city}`)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-surface hover:bg-border text-ink border border-border transition-colors cursor-pointer"
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </div>

          {/* Connector Line with Route details */}
          <div className="relative py-1 flex items-center">
            <div className="flex-grow border-t border-dashed border-border"></div>
            <span className="flex-shrink mx-3 text-[11px] font-mono text-primary bg-primary-tint px-2.5 py-0.5 rounded-full border border-primary/30">
              {t.booking.routeDetails}
            </span>
            <div className="flex-grow border-t border-dashed border-border"></div>
          </div>

          {/* Dropoff Address - Red removed for decorative destination per Rule 1, uses neutral-state / ink */}
          <div>
            <label htmlFor="dropoff-input" className="block text-xs font-semibold text-ink mb-1.5 flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-state" />
              <span>{t.booking.dropoffLabel}</span>
            </label>
            <div className="relative">
              <input
                id="dropoff-input"
                type="text"
                value={dropoffAddress}
                onChange={(e) => setDropoffAddress(e.target.value)}
                placeholder="Enter delivery address or warehouse"
                className="w-full pl-9 pr-4 py-3 bg-surface border border-border rounded-xl text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <MapPin className="w-4 h-4 text-neutral-state absolute left-3 top-3.5" />
            </div>

            {/* Quick location chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {PRESET_DROPOFFS.map((loc) => (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() => setDropoffAddress(`${loc.name}, ${loc.city}`)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-surface hover:bg-border text-ink border border-border transition-colors cursor-pointer"
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cargo Category (5 Essentials) */}
        <div className="bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
              {t.booking.categoryTitle}
            </h2>
            <span className="text-[11px] text-muted">Choose 1 category</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.id;

              return (
                <div
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 text-left ${
                    isSelected
                      ? 'border-primary bg-primary-tint ring-1 ring-primary shadow-xs'
                      : 'border-border bg-card hover:bg-surface'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${
                    isSelected ? 'bg-primary text-card' : 'bg-surface text-ink'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-sm font-bold text-ink">
                        {cat.title}
                      </span>
                      {cat.isRegulated && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-regulated-cargo-tint text-regulated-cargo font-bold border border-regulated-cargo/30">
                          Verified Only
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-1 leading-snug">
                      {cat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Regulated Cargo Explanation Banner */}
          {isRegulated && (
            <div className="mt-4 p-3.5 bg-regulated-cargo-tint rounded-xl border border-regulated-cargo/30 flex items-start space-x-2.5 text-xs text-regulated-cargo">
              <Info className="w-4 h-4 text-regulated-cargo shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="block text-ink font-bold">Temperature Control Required</strong>
                <span className="text-muted">{t.booking.regulatedNotice}</span>
              </div>
            </div>
          )}
        </div>

        {/* Estimated Weight & Reassurance */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <label htmlFor="weight-input" className="block text-xs font-semibold text-ink mb-1">
              Estimated Total Weight (kg)
            </label>
            <input
              id="weight-input"
              type="number"
              value={estimatedWeight}
              onChange={(e) => setEstimatedWeight(e.target.value)}
              placeholder="e.g. 2400"
              className="w-full max-w-xs px-3.5 py-2 bg-surface border border-border rounded-xl text-sm font-mono text-ink focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs text-primary font-medium bg-primary-tint px-3.5 py-2.5 rounded-xl border border-primary/20">
            <Lock className="w-4 h-4 shrink-0" />
            <span>Locked Fare Guarantee applies automatically.</span>
          </div>
        </div>

        {/* Single Primary CTA per screen (Rule Enforced) */}
        <button
          type="submit"
          id="btn-choose-vehicle"
          className="w-full py-4 px-4 rounded-xl bg-primary hover:bg-primary-dark active:scale-[0.99] text-card text-xs font-bold uppercase tracking-wider shadow-lg transition-all flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
        >
          <span>{t.booking.continueButton}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
