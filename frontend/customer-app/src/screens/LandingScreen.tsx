import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock, ShieldCheck, Thermometer, Truck, Star, ArrowRight,
  CheckCircle, Radio, MapPin, Clock, ChevronDown, ChevronUp,
  Zap, Globe, Users, TrendingUp, Package, Award, Gauge,
  Wifi, BadgeCheck, Building2
} from 'lucide-react';
import { reloadTokens } from '../theme/tokens';

// ── Palette tokens (mirror centralized tokens) ────────────────────────────
const INK     = reloadTokens.ink;
const PAPER   = reloadTokens.surface;
const TEAL    = reloadTokens.primary;
const TEAL_D  = reloadTokens.primaryDark;
const TEAL_L  = reloadTokens.primaryTint;
const BLUE    = reloadTokens.regulatedCargo;
const GREEN   = reloadTokens.statusVerified;
const GREEN_L = reloadTokens.statusVerifiedTint;
const AMBER   = reloadTokens.statusWarning;
const DANGER  = reloadTokens.statusCritical;
const DARK    = reloadTokens.adminShell;
const BORDER  = reloadTokens.border;

// ── Fleet data ────────────────────────────────────────────────────────────
const FLEET = [
  {
    id: 'reefer-14',
    emoji: '🚛',
    name: 'Reefer Van 14ft',
    sub: 'Tata 407 LPT Active Reefer',
    badge: 'Cold-Chain',
    badgeColor: BLUE,
    cap: '2,500 kg',
    temp: '−20°C to +4°C',
    dims: '14ft × 6.5ft × 6.5ft',
    fare: '₹34,800',
    eta: '28 min',
    rating: 4.9,
    verified: true,
    features: ['Active IoT Telematics', 'VAHAN 4.0 Net-cleared', 'Digital Tamper Seal'],
  },
  {
    id: 'reefer-20',
    emoji: '🚚',
    name: 'Eicher 2114XP Reefer',
    sub: 'Heavy Cold-Chain 20ft',
    badge: 'Heavy Reefer',
    badgeColor: BLUE,
    cap: '7,500 kg',
    temp: '−25°C to +8°C',
    dims: '20ft × 7.5ft × 7.5ft',
    fare: '₹52,400',
    eta: '45 min',
    rating: 4.8,
    verified: true,
    features: ['Multi-zone Thermograph', 'Dual-driver Verified', 'FASTag Net Priority'],
  },
  {
    id: 'pharma',
    emoji: '🧊',
    name: 'Force Traveller Cryo',
    sub: 'Pharma / Biologicals Sprinter',
    badge: 'Pharma',
    badgeColor: GREEN,
    cap: '1,400 kg',
    temp: '2°C to 8°C Cold Box',
    dims: '10ft × 5.8ft × 6ft',
    fare: '₹29,500',
    eta: '18 min',
    rating: 4.95,
    verified: true,
    features: ['WHO-GDP Compliant', 'Calibrated Data Logger', 'GPS Tamper Shield'],
  },
  {
    id: 'dry-20',
    emoji: '📦',
    name: '20ft Dry Container',
    sub: 'General Cargo Closed Body',
    badge: 'Dry Cargo',
    badgeColor: AMBER,
    cap: '9,000 kg',
    temp: 'Ambient',
    dims: '20ft × 8ft × 8.5ft',
    fare: '₹31,200',
    eta: '35 min',
    rating: 4.7,
    verified: true,
    features: ['Weatherproof Seal', 'Hydraulic Tailgate', 'FASTag NPCI Connected'],
  },
  {
    id: 'heavy-10w',
    emoji: '🏗️',
    name: 'Tata Signa 2823',
    sub: '10-Wheeler Open Flatbed',
    badge: 'Heavy Machinery',
    badgeColor: reloadTokens.neutralState,
    cap: '18,000 kg',
    temp: 'Open / Tarpaulin',
    dims: '28ft × 8ft Open Flatbed',
    fare: '₹44,000',
    eta: '60 min',
    rating: 4.6,
    verified: true,
    features: ['Heavy Tarpaulin Lashing', 'High Tensile Straps', 'Highway Clearance'],
  },
];

// ── Value pillars ─────────────────────────────────────────────────────────
const PILLARS = [
  {
    icon: Lock,
    color: TEAL,
    bg: TEAL_L,
    title: 'Locked Fare Guarantee',
    body: 'The fare you confirm at booking is the fare you pay. Zero mid-transit price spikes. All surcharges (tolls, detentions) require your explicit approval before they affect your escrow.',
  },
  {
    icon: Thermometer,
    color: BLUE,
    bg: reloadTokens.regulatedCargoTint,
    title: 'IoT Cold-Chain Telemetry',
    body: 'Continuous real-time temperature monitoring with automatic excursion alerts. Every reefer vehicle streams temperature, speed, and location via satellite-linked IoT every 90 seconds.',
  },
  {
    icon: ShieldCheck,
    color: GREEN,
    bg: GREEN_L,
    title: 'Regulated & Verified Fleet',
    body: 'Every driver on Reload is VAHAN 4.0 verified, Aadhaar-matched, and reefer/hazmat certified. Trust Score calculated across 1,400+ community trips.',
  },
  {
    icon: BadgeCheck,
    color: AMBER,
    bg: reloadTokens.statusWarningTint,
    title: 'Cryptographic Handoff',
    body: 'Digital tamper seals with cryptographic verification at every pickup and delivery. Dockmaster OTP + seal scan ensures chain-of-custody is immutably logged.',
  },
];

// ── Shipper vs Driver comparison ───────────────────────────────────────────
const SHIPPER_BENEFITS = [
  'Guaranteed locked fare — no surprise invoices',
  'Real-time IoT temperature monitoring',
  'Live GPS tracking with 90-second pings',
  'Automated FASTag toll reconciliation',
  'Cryptographic tamper-seal handoff at every dock',
  'Dispute-protected escrow with assigned officer',
  'Fleet selection across 5 cargo categories',
  'Multilingual interface in 7 Indian languages',
];
const DRIVER_BENEFITS = [
  'Instant cargo job notifications near your zone',
  'Zero fake bookings — consignor-escrow verified',
  'Transparent surcharge requests with client approval',
  'Trust Score rewards top-rated drivers with priority jobs',
  'One-handed high-contrast UI built for outdoor use',
  'Reefer & Hazmat certification management',
  'Quick digital handoff scanning at terminal docks',
  'Fair, same-day escrow settlements',
];

// ── Cargo categories for estimator ────────────────────────────────────────
const CARGO_CATS = [
  { key: 'cold_chain', label: '❄️ Cold Chain' },
  { key: 'pharma',     label: '💊 Pharma/Bio' },
  { key: 'dry',        label: '📦 Dry Cargo' },
  { key: 'heavy',      label: '🏗️ Heavy/Machinery' },
  { key: 'dairy',      label: '🥛 Dairy / FMCG' },
];

// ── Testimonials ──────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: 'Vikramaditya Singhania',
    company: 'Apex Pharmaceuticals & Cold-chain Ltd',
    text: 'Reload\'s locked fare guarantee eliminated every pricing dispute we had with freight brokers. The cold-chain IoT data feeds directly into our WMS. Absolutely irreplaceable.',
    rating: 5,
    trips: 1482,
  },
  {
    name: 'Ramesh Sawant',
    company: 'Dockmaster — Bhiwandi Logistics Hub',
    text: 'The cryptographic tamper-seal QR scan takes 10 seconds. Before Reload it was 45 minutes of paperwork per truck at our dock. Completely transformed our throughput.',
    rating: 5,
    trips: 220,
  },
  {
    name: 'Rajesh Kumar',
    company: 'Driver Partner — Apex Logistics Corp',
    text: 'Trust Score went from 820 to 980 in 3 months. I now get priority cargo requests and never negotiate fare. Reload is the only platform that treats drivers as partners.',
    rating: 5,
    trips: 1482,
  },
];

// ── FAQ ───────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'What is the Locked Fare Guarantee exactly?',
    a: 'Once you confirm your booking, the base fare is cryptographically locked in an escrow account. No driver or dispatcher can change it. Any surcharge (e.g., toll, dock delay) is presented as a push notification for YOUR explicit approval before the escrow is updated.',
  },
  {
    q: 'How does the cold-chain IoT monitoring work?',
    a: 'Every reefer vehicle is fitted with a satellite-linked IoT telematics unit that streams interior temperature, humidity, and GPS coordinates every 90 seconds. Excursions beyond your target temperature range trigger an immediate in-app and SMS alert to you and the assigned officer.',
  },
  {
    q: 'How are drivers verified on Reload?',
    a: 'All driver partners go through VAHAN 4.0 vehicle registration verification, Aadhaar biometric matching, and a 3-step certification review for Reefer, Hazmat, and commercial driving licences. Trust Score is updated after every trip based on punctuality, temperature compliance, and shipper ratings.',
  },
  {
    q: 'Which cargo categories does Reload support?',
    a: 'Cold-chain pharma, dairy & FMCG, general dry cargo, heavy machinery & auto-parts, and hazardous materials. Each category has a curated fleet of vehicles specifically certified and inspected for that cargo type.',
  },
  {
    q: 'How does the payment and settlement work?',
    a: 'Shippers pre-fund escrow before the trip starts. Once the drop-off handoff is cryptographically confirmed, the locked fare is instantly released to the driver\'s registered bank account. Disputed trips are held in escrow until an assigned Reload ops officer resolves the claim.',
  },
];

// ─────────────────────────────────────────────────────────────────────────
export const LandingScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'shipper' | 'driver'>('shipper');
  const [selectedCargo, setSelectedCargo] = useState('cold_chain');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [liveTemp, setLiveTemp] = useState(3.8);
  const [liveProgress, setLiveProgress] = useState(54);

  // Simulate live telemetry on the hero
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTemp(prev => parseFloat((prev + (Math.random() - 0.5) * 0.15).toFixed(1)));
      setLiveProgress(prev => {
        const next = prev + 0.05;
        return next > 100 ? 54 : next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getRecommendedVehicles = () => {
    if (selectedCargo === 'cold_chain' || selectedCargo === 'pharma' || selectedCargo === 'dairy') {
      return FLEET.filter(f => f.id === 'reefer-14' || f.id === 'pharma' || f.id === 'reefer-20');
    }
    if (selectedCargo === 'heavy') return FLEET.filter(f => f.id === 'heavy-10w' || f.id === 'dry-20');
    return FLEET.filter(f => f.id === 'dry-20' || f.id === 'reefer-14');
  };

  return (
    <div className="min-h-screen bg-surface text-ink">

      {/* ── HERO SECTION ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-tint/50 via-surface to-surface border-b border-border">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `linear-gradient(${BORDER} 1px, transparent 1px), linear-gradient(90deg, ${BORDER} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-18 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Left — copy */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-primary-tint border border-primary/30 rounded-full px-3.5 py-1.5 text-xs font-semibold text-primary mb-5 shadow-xs">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>India's Verified Cold-Chain Freight Network</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ink leading-tight tracking-tight">
                Cargo Shipped.<br />
                <span style={{ color: TEAL }} className="relative">
                  Fare Locked.
                </span>{' '}
                <span className="text-muted">Cold-Chain</span>{' '}
                <span className="text-ink">Guaranteed.</span>
              </h1>

              <p className="mt-5 text-muted text-base sm:text-lg leading-relaxed max-w-xl">
                Reload is India's first freight platform with a <strong className="text-ink font-semibold">cryptographic Locked Fare Guarantee</strong>, real-time IoT cold-chain telemetry, and VAHAN-verified driver Trust Scores — built for pharmaceutical, dairy, and enterprise logistics.
              </p>

              {/* CTA buttons - Primary uses Trust Teal */}
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/book')}
                  className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-card font-bold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>Book Cargo Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/driver')}
                  className="inline-flex items-center space-x-2 bg-card hover:bg-surface border border-border text-ink font-bold text-sm px-6 py-3.5 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <Users className="w-4 h-4 text-primary" />
                  <span>Join as Driver Partner</span>
                </button>
              </div>

              {/* Trust stats */}
              <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  { num: '1,482+', label: 'Trips Cleared', icon: CheckCircle },
                  { num: '₹24Cr+', label: 'Escrow Settled', icon: Lock },
                  { num: '99.4%', label: 'On-Time SLA', icon: TrendingUp },
                ].map(({ num, label, icon: Icon }) => (
                  <div key={label} className="bg-card border border-border rounded-2xl p-3.5 text-center shadow-xs">
                    <Icon className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <div className="font-display font-extrabold text-2xl text-ink">{num}</div>
                    <div className="text-[10px] text-muted uppercase tracking-wide mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — live telemetry card */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-sm">
                {/* Trip ID + status pill */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs text-muted">Consignment #RL-9842</span>
                  <div className="flex items-center space-x-1.5 bg-primary-tint border border-primary/30 px-2.5 py-1 rounded-full text-[11px] text-primary font-bold shadow-xs">
                    <Radio className="w-3 h-3 animate-pulse text-primary" />
                    <span>IN TRANSIT</span>
                  </div>
                </div>

                {/* Map placeholder card */}
                <div className="relative bg-card rounded-2xl overflow-hidden border border-border shadow-lg">
                  {/* Fake map */}
                  <div className="relative h-44 bg-surface flex items-center justify-center border-b border-border">
                    <div className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage: `linear-gradient(${BORDER} 1px, transparent 1px), linear-gradient(90deg, ${BORDER} 1px, transparent 1px)`,
                        backgroundSize: '24px 24px',
                      }}
                    />
                    {/* Route line SVG */}
                    <svg viewBox="0 0 300 160" className="w-full h-full absolute inset-0">
                      <path d="M40,120 Q100,60 160,80 Q220,100 260,40" stroke={TEAL} strokeWidth="2.5" fill="none" strokeDasharray="6 3" opacity="0.8" />
                      {/* Progress dot */}
                      <circle cx="155" cy="80" r="6" fill={TEAL} />
                      <circle cx="155" cy="80" r="12" fill={TEAL} opacity="0.25" />
                      {/* Origin */}
                      <circle cx="40" cy="120" r="5" fill={AMBER} />
                      {/* Destination */}
                      <circle cx="260" cy="40" r="5" fill={GREEN} />
                    </svg>
                    {/* Speed pill */}
                    <div className="absolute top-3 left-3 flex items-center space-x-1.5 bg-card/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] text-ink font-mono border border-border shadow-xs">
                      <Gauge className="w-3 h-3 text-regulated-cargo" />
                      <span className="font-bold">62 km/h</span>
                    </div>
                    {/* GPS pill */}
                    <div className="absolute top-3 right-3 flex items-center space-x-1.5 bg-card/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] text-primary font-bold border border-primary/30 shadow-xs">
                      <Wifi className="w-3 h-3 text-primary" />
                      <span>GPS Live</span>
                    </div>
                    {/* Location label */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center space-x-1.5 bg-card/95 backdrop-blur px-2.5 py-1.5 rounded-lg border border-border shadow-xs">
                      <MapPin className="w-3 h-3 text-regulated-cargo shrink-0" />
                      <span className="text-[10px] text-ink font-medium truncate">NH 48 • Near Satara Bypass (Km 214)</span>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 divide-x divide-border border-b border-border bg-card">
                    <div className="p-3 text-center">
                      <div className="text-[10px] text-muted mb-1 uppercase font-semibold">Temp</div>
                      <div className={`font-mono font-bold text-lg ${liveTemp < 5 ? 'text-regulated-cargo' : 'text-status-warning'}`}>
                        {liveTemp}°C
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <div className="text-[10px] text-muted mb-1 uppercase font-semibold">Progress</div>
                      <div className="font-mono font-bold text-lg text-ink">
                        {Math.round(liveProgress)}%
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <div className="text-[10px] text-muted mb-1 uppercase font-semibold">Fare</div>
                      <div className="font-mono font-bold text-lg text-primary">
                        ₹34,800
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="px-4 pb-3 pt-2 bg-card">
                    <div className="flex items-center justify-between text-[10px] text-muted mb-1 font-medium">
                      <span className="flex items-center space-x-1"><MapPin className="w-2.5 h-2.5 text-status-warning" /><span>Bhiwandi</span></span>
                      <span className="flex items-center space-x-1"><MapPin className="w-2.5 h-2.5 text-status-verified" /><span>Bengaluru</span></span>
                    </div>
                    <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-border/50">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${liveProgress}%`, background: `linear-gradient(90deg, ${TEAL}, ${BLUE})` }}
                      />
                    </div>
                  </div>

                  {/* Locked fare badge */}
                  <div className="mx-4 mb-4 flex items-center space-x-2 bg-primary-tint border border-primary/30 rounded-xl px-3 py-2">
                    <Lock className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs text-ink font-semibold">Locked Fare — No Surprises</span>
                    <span className="ml-auto text-xs font-bold text-primary">Active ✓</span>
                  </div>
                </div>

                <p className="mt-3 text-center text-[11px] text-muted">
                  Live telemetry simulation — refreshing every 2s
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FARE ESTIMATOR ────────────────────────────────────── */}
      <section className="py-16 bg-card border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink">
              Instant Fare Estimator
            </h2>
            <p className="mt-3 text-muted text-base max-w-xl mx-auto">
              Select your cargo type and route to see guaranteed locked fares and recommended verified vehicles.
            </p>
          </div>

          <div className="bg-surface rounded-2xl p-6 border border-border">
            {/* Cargo category selector */}
            <div className="mb-6">
              <label className="text-xs font-bold uppercase tracking-wider text-muted mb-2 block">
                Cargo Category
              </label>
              <div className="flex flex-wrap gap-2">
                {CARGO_CATS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCargo(key)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                      selectedCargo === key
                        ? 'bg-primary border-primary text-card shadow-md'
                        : 'bg-card border-border text-ink hover:bg-surface'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Origin / Destination / Weight */}
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5 block">Origin City</label>
                <input
                  value={origin}
                  onChange={e => setOrigin(e.target.value)}
                  placeholder="e.g. Bhiwandi, Mumbai"
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5 block">Destination City</label>
                <input
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  placeholder="e.g. Bengaluru, KA"
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5 block">Weight (kg)</label>
                <input
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  placeholder="e.g. 2000"
                  type="number"
                  className="w-full bg-card border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            {/* Recommended vehicles */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
                Recommended Vehicles — Guaranteed Locked Fares
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {getRecommendedVehicles().map(v => (
                  <button
                    key={v.id}
                    onClick={() => navigate('/vehicles')}
                    className="bg-card border border-border rounded-2xl p-4 text-left hover:border-primary hover:shadow-md transition-all group cursor-pointer"
                  >
                    <div className="text-3xl mb-2">{v.emoji}</div>
                    <div className="font-semibold text-sm text-ink group-hover:text-primary">{v.name}</div>
                    <div className="text-[11px] text-muted mb-2">{v.sub}</div>
                    <div className="flex items-center justify-between">
                      <span className="font-display font-extrabold text-xl text-primary">{v.fare}</span>
                      <span className="text-[11px] text-muted flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{v.eta}</span>
                      </span>
                    </div>
                    <div className="mt-2 flex items-center space-x-1">
                      <Lock className="w-3 h-3 text-status-verified" />
                      <span className="text-[10px] text-status-verified font-semibold">Locked Fare</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 flex justify-center">
              <button
                onClick={() => navigate('/book')}
                className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-card font-bold text-sm px-8 py-3.5 rounded-xl shadow transition-all active:scale-95 cursor-pointer"
              >
                <span>Book Full Trip Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUE PILLARS ─────────────────────────────────────── */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink">
              Why Reload is Different
            </h2>
            <p className="mt-3 text-muted max-w-xl mx-auto">
              Four technological pillars that make freight transparent, safe, and trustworthy.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map(({ icon: Icon, color, bg, title, body }) => (
              <div key={title} className="bg-card rounded-2xl p-6 border border-border shadow-xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: bg }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="font-display font-bold text-base text-ink mb-2">{title}</h3>
                <p className="text-xs text-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLEET SHOWCASE ────────────────────────────────────── */}
      <section className="py-20 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink">
              Verified Fleet Across 5 Categories
            </h2>
            <p className="mt-3 text-muted max-w-xl mx-auto">
              Every vehicle is VAHAN 4.0 cleared, IoT-fitted, and certified for its cargo class.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FLEET.map(v => (
              <div
                key={v.id}
                className="bg-surface rounded-2xl p-5 border border-border hover:border-primary hover:shadow-md transition-all group cursor-pointer"
                onClick={() => navigate('/vehicles')}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">{v.emoji}</div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span
                      className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full text-card"
                      style={{ background: v.badgeColor }}
                    >
                      {v.badge}
                    </span>
                    {v.verified && (
                      <span className="text-[10px] font-semibold text-status-verified flex items-center space-x-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        <span>VAHAN Verified</span>
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-display font-bold text-lg text-ink group-hover:text-primary transition-colors">
                  {v.name}
                </h3>
                <p className="text-xs text-muted mt-0.5 mb-3">{v.sub}</p>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-card rounded-xl p-2 border border-border">
                    <div className="text-[10px] text-muted uppercase">Capacity</div>
                    <div className="font-bold text-sm text-ink">{v.cap}</div>
                  </div>
                  <div className="bg-card rounded-xl p-2 border border-border">
                    <div className="text-[10px] text-muted uppercase">Temp Range</div>
                    <div className="font-bold text-xs text-ink">{v.temp}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {v.features.map(f => (
                    <span key={f} className="text-[10px] bg-card border border-border text-muted px-2 py-0.5 rounded-lg">
                      {f}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <span className="font-display font-extrabold text-2xl text-primary">{v.fare}</span>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <Lock className="w-3 h-3 text-status-verified" />
                      <span className="text-[10px] text-status-verified font-semibold">Locked Fare</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-xs text-muted">
                      <Clock className="w-3.5 h-3.5" />
                      <span>ETA {v.eta}</span>
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      <Star className="w-3 h-3 fill-status-warning text-status-warning" />
                      <span className="text-xs font-bold text-ink">{v.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => navigate('/vehicles')}
              className="inline-flex items-center space-x-2 border-2 border-primary text-primary hover:bg-primary hover:text-card font-bold px-8 py-3.5 rounded-xl transition-all cursor-pointer"
            >
              <span>Browse Full Fleet & Lock Your Fare</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── SHIPPER vs DRIVER TABS ────────────────────────────── */}
      <section className="py-20 bg-surface border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink">
              Built for Both Sides of Freight
            </h2>
            <p className="mt-3 text-muted max-w-xl mx-auto">
              Whether you're shipping pharma cargo across NH-48 or driving a certified reefer van, Reload is purpose-built for you.
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-card rounded-xl p-1 border border-border shadow-xs">
              {(['shipper', 'driver'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all cursor-pointer ${
                    activeTab === tab
                      ? 'bg-primary text-card shadow-sm'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {tab === 'shipper' ? '🏭 Shipper / Consignor' : '🚛 Driver Partner'}
                </button>
              ))}
            </div>
          </div>

          {/* Benefit list */}
          <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-xs">
            <div className="grid sm:grid-cols-2 gap-3.5">
              {(activeTab === 'shipper' ? SHIPPER_BENEFITS : DRIVER_BENEFITS).map(b => (
                <div key={b} className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-primary-tint border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm text-ink">{b}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              {activeTab === 'shipper' ? (
                <button
                  onClick={() => navigate('/book')}
                  className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-card font-bold text-sm px-7 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>Start Booking Cargo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/driver')}
                  className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-card font-bold text-sm px-7 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Apply as Driver Partner</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-20 bg-surface border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink">
              Trusted by Enterprise Logistics
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-card rounded-2xl p-6 border border-border shadow-xs">
                <div className="flex items-center space-x-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-status-warning text-status-warning" />
                  ))}
                </div>
                <p className="text-sm text-muted leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center space-x-3 pt-4 border-t border-surface">
                  <div className="w-10 h-10 rounded-full bg-primary text-card flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-ink">{t.name}</div>
                    <div className="text-[11px] text-muted">{t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="py-20 bg-card border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="border border-border rounded-2xl overflow-hidden"
              >
                <button
                  className="w-full text-left flex items-center justify-between px-5 py-4 hover:bg-surface transition-colors cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-sm text-ink pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-primary flex-shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-muted flex-shrink-0" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-muted leading-relaxed border-t border-surface pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA BANNER ─────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-primary-tint via-surface to-primary-tint/60 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink mb-4">
            Ready to Ship with Certainty?
          </h2>
          <p className="text-muted text-base mb-8 max-w-xl mx-auto">
            Join 1,200+ shippers and 3,800+ verified drivers on India's most trusted cold-chain freight platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/book')}
              className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-card font-bold text-sm px-8 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Book Cargo — Locked Fare</span>
            </button>
            <button
              onClick={() => navigate('/about')}
              className="inline-flex items-center space-x-2 bg-card hover:bg-surface border border-border text-ink font-bold text-sm px-8 py-3.5 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-primary" />
              <span>Learn About Reload</span>
            </button>
          </div>
          <p className="mt-8 text-muted text-xs">
            VAHAN 4.0 Verified  ·  WHO-GDP Compliant  ·  FASTag NPCI Connected  ·  Escrow Protected
          </p>
        </div>
      </section>

    </div>
  );
};
