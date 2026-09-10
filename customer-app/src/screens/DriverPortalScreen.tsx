import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Truck, MapPin, Package, Clock, CheckCircle, Star, 
  ShieldCheck, BadgeCheck, Award, TrendingUp, Thermometer,
  Lock, Users, ArrowRight, Radio, MessageSquare, Gauge,
  Phone, ChevronRight, AlertTriangle, Zap, Navigation,
  RotateCcw, Check
} from 'lucide-react';
import { reloadTokens } from '../theme/tokens';

// ── Types ─────────────────────────────────────────────────────────────────
type DriverView = 'home' | 'job_detail' | 'active_trip' | 'surcharge' | 'trust_score';

interface Job {
  id: string;
  consignmentId: string;
  cargo: string;
  cargoEmoji: string;
  origin: string;
  destination: string;
  distanceKm: number;
  fare: string;
  fareNum: number;
  pickupEta: string;
  weight: string;
  tempRequired: string | null;
  badge: string;
  badgeColor: string;
  requiresReefer: boolean;
}

// ── Mock Data ─────────────────────────────────────────────────────────────
const AVAILABLE_JOBS: Job[] = [
  {
    id: 'job-1',
    consignmentId: 'RL-9843',
    cargo: 'Vaccine Vials — Cold Chain',
    cargoEmoji: '🧊',
    origin: 'Bhiwandi Logistics Hub, Thane',
    destination: 'Whitefield EPIP Warehouse, Bengaluru',
    distanceKm: 842,
    fare: '₹34,800',
    fareNum: 34800,
    pickupEta: '22 min',
    weight: '2,150 kg',
    tempRequired: '2°C to 8°C',
    badge: 'Cold-Chain',
    badgeColor: reloadTokens.regulatedCargo,
    requiresReefer: true,
  },
  {
    id: 'job-2',
    consignmentId: 'RL-9844',
    cargo: 'Auto Spare Parts',
    cargoEmoji: '🔩',
    origin: 'Sanand Industrial GIDC, Ahmedabad',
    destination: 'Chakan Auto Hub, Pune',
    distanceKm: 498,
    fare: '₹28,400',
    fareNum: 28400,
    pickupEta: '35 min',
    weight: '5,800 kg',
    tempRequired: null,
    badge: 'General Cargo',
    badgeColor: reloadTokens.statusWarning,
    requiresReefer: false,
  },
  {
    id: 'job-3',
    consignmentId: 'RL-9845',
    cargo: 'Dairy Products — Chilled',
    cargoEmoji: '🥛',
    origin: 'Aarey Colony Dairy Hub, Mumbai',
    destination: 'Sholapur Distribution Centre',
    distanceKm: 305,
    fare: '₹18,200',
    fareNum: 18200,
    pickupEta: '14 min',
    weight: '1,200 kg',
    tempRequired: '0°C to 4°C',
    badge: 'Dairy',
    badgeColor: reloadTokens.statusVerified,
    requiresReefer: true,
  },
];

const DRIVER = {
  fullName: 'Rajesh Kumar',
  initials: 'RK',
  trustScore: 980,
  rating: 4.92,
  trips: 1482,
  tier: 'Platinum',
  tierColor: reloadTokens.statusWarning,
  vehicle: 'Tata 407 LPT Reefer Van',
  vehicleReg: 'MH-04-GP-8192',
  isOnline: true,
};

// ── Sub-components ────────────────────────────────────────────────────────

const TrustBadge = ({ score }: { score: number }) => (
  <div className="flex items-center space-x-1.5 bg-primary-tint border border-primary/30 px-2.5 py-1 rounded-full">
    <TrendingUp className="w-3 h-3 text-status-verified" />
    <span className="text-xs font-bold text-status-verified">Trust {score}</span>
  </div>
);

const JobCard: React.FC<{ job: Job; onView: (j: Job) => void }> = ({ job, onView }) => (
  <div className="bg-card rounded-2xl border border-border shadow-xs hover:shadow-md hover:border-primary/40 transition-all overflow-hidden">
    {/* Header */}
    <div className="flex items-start justify-between p-4 pb-3">
      <div className="flex items-start space-x-3">
        <div className="text-3xl mt-0.5">{job.cargoEmoji}</div>
        <div>
          <div className="font-mono text-[11px] text-muted mb-0.5">#{job.consignmentId}</div>
          <div className="font-bold text-sm text-ink">{job.cargo}</div>
          <div className="flex items-center space-x-2 mt-1 flex-wrap gap-y-1">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full text-card"
              style={{ background: job.badgeColor }}
            >
              {job.badge}
            </span>
            {job.requiresReefer && (
              <span className="text-[10px] font-semibold text-regulated-cargo flex items-center space-x-0.5">
                <Thermometer className="w-3 h-3" />
                <span>{job.tempRequired}</span>
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-lg text-primary">{job.fare}</div>
        <div className="flex items-center justify-end space-x-1 mt-0.5">
          <Lock className="w-2.5 h-2.5 text-status-verified" />
          <span className="text-[10px] text-status-verified font-semibold">Locked</span>
        </div>
      </div>
    </div>

    {/* Route */}
    <div className="px-4 py-2 border-t border-surface">
      <div className="flex items-start space-x-2 text-xs">
        <div className="flex flex-col items-center mt-1">
          <div className="w-2 h-2 rounded-full bg-status-warning" />
          <div className="w-0.5 h-5 bg-border" />
          <div className="w-2 h-2 rounded-full bg-status-verified" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="text-muted">{job.origin}</div>
          <div className="text-muted">{job.destination}</div>
        </div>
      </div>
    </div>

    {/* Stats row */}
    <div className="grid grid-cols-3 divide-x divide-surface border-t border-surface px-1">
      {[
        { icon: Navigation, val: `${job.distanceKm} km` },
        { icon: Package, val: job.weight },
        { icon: Clock, val: `Pickup ${job.pickupEta}` },
      ].map(({ icon: Icon, val }) => (
        <div key={val} className="flex items-center justify-center space-x-1.5 py-2 px-2">
          <Icon className="w-3 h-3 text-muted" />
          <span className="text-[11px] text-muted font-medium">{val}</span>
        </div>
      ))}
    </div>

    {/* Accept button - Primary action in Trust Teal */}
    <div className="p-3 border-t border-surface">
      <button
        onClick={() => onView(job)}
        className="w-full bg-primary hover:bg-primary-dark text-card font-bold text-sm py-3 rounded-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center space-x-2"
      >
        <Check className="w-4 h-4" />
        <span>View & Accept Job</span>
      </button>
    </div>
  </div>
);

// ── Main Screen ───────────────────────────────────────────────────────────
export const DriverPortalScreen: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<DriverView>('home');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [tripStatus, setTripStatus] = useState<
    'heading_to_pickup' | 'at_pickup' | 'in_transit' | 'at_dropoff' | 'completed'
  >('heading_to_pickup');
  const [surchargeSubmitted, setSurchargeSubmitted] = useState(false);
  const [surchargeApproved, setSurchargeApproved] = useState(false);
  const [liveTemp, setLiveTemp] = useState(3.8);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLiveTemp(prev => parseFloat((prev + (Math.random() - 0.5) * 0.12).toFixed(1)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAcceptJob = (job: Job) => {
    setActiveJob(job);
    setTripStatus('heading_to_pickup');
    setView('active_trip');
  };

  const tripStatusSteps: Array<{ key: typeof tripStatus; label: string; done: boolean }> = [
    { key: 'heading_to_pickup', label: 'Heading to Pickup', done: ['at_pickup', 'in_transit', 'at_dropoff', 'completed'].includes(tripStatus) },
    { key: 'at_pickup', label: 'At Pickup Dock', done: ['in_transit', 'at_dropoff', 'completed'].includes(tripStatus) },
    { key: 'in_transit', label: 'In Transit', done: ['at_dropoff', 'completed'].includes(tripStatus) },
    { key: 'at_dropoff', label: 'At Drop-off', done: ['completed'].includes(tripStatus) },
    { key: 'completed', label: 'Delivered ✓', done: tripStatus === 'completed' },
  ];

  const advanceTrip = () => {
    const order: typeof tripStatus[] = ['heading_to_pickup', 'at_pickup', 'in_transit', 'at_dropoff', 'completed'];
    const idx = order.indexOf(tripStatus);
    if (idx < order.length - 1) setTripStatus(order[idx + 1]);
    else {
      setView('trust_score');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-28">

      {/* ── Header banner ── */}
      <div className="bg-ink rounded-2xl p-5 mb-6 border border-border/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-primary text-card flex items-center justify-center font-bold text-lg border border-card/20">
                {DRIVER.initials}
              </div>
              <div
                className="absolute -bottom-1 -right-1 text-[9px] font-extrabold px-1 py-0.5 rounded-full text-card"
                style={{ background: DRIVER.tierColor }}
              >
                PLT
              </div>
            </div>
            <div>
              <div className="font-bold text-card text-base">{DRIVER.fullName}</div>
              <div className="text-xs text-muted">{DRIVER.vehicle}</div>
              <div className="flex items-center space-x-2 mt-1">
                <TrustBadge score={DRIVER.trustScore} />
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-status-warning text-status-warning" />
                  <span className="text-xs font-bold text-status-warning">{DRIVER.rating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Online toggle */}
          <div className="flex flex-col items-end space-y-2">
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`relative w-14 h-7 rounded-full transition-all cursor-pointer border-2 ${
                isOnline ? 'bg-primary border-primary' : 'bg-neutral-state border-neutral-state'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-all ${isOnline ? 'left-7' : 'left-0.5'}`} />
            </button>
            <span className={`text-[11px] font-bold ${isOnline ? 'text-status-verified' : 'text-muted'}`}>
              {isOnline ? '● ONLINE' : '○ OFFLINE'}
            </span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="mt-4 pt-4 border-t border-border/20 grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'Total Trips', val: DRIVER.trips.toLocaleString(), color: reloadTokens.card },
            { label: 'Trust Score', val: `${DRIVER.trustScore}/1000`, color: reloadTokens.statusVerified },
            { label: 'Rating', val: `★ ${DRIVER.rating}`, color: reloadTokens.statusWarning },
          ].map(({ label, val, color }) => (
            <div key={label}>
              <div className="text-[10px] text-muted uppercase mb-0.5">{label}</div>
              <div className="font-bold text-sm" style={{ color }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Navigation tabs ── */}
      <div className="flex space-x-1 mb-5 bg-surface border border-border rounded-xl p-1">
        {([
          { key: 'home', label: '📋 Jobs' },
          { key: 'active_trip', label: '🚛 Active Trip' },
          { key: 'trust_score', label: '⭐ Trust Score' },
        ] as { key: DriverView; label: string }[]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              view === tab.key
                ? 'bg-ink text-card shadow'
                : 'text-muted hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════
          VIEW: AVAILABLE JOBS
      ══════════════════════════════════════════ */}
      {view === 'home' && (
        <div className="space-y-4">
          {!isOnline ? (
            <div className="text-center py-16 text-muted">
              <div className="text-4xl mb-3">📵</div>
              <div className="font-bold text-base text-ink mb-1">You're Offline</div>
              <div className="text-sm">Toggle online above to receive cargo job notifications.</div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-base text-ink">
                  Available Cargo Jobs
                  <span className="ml-2 text-xs text-muted font-normal">({AVAILABLE_JOBS.length} near you)</span>
                </h2>
                <div className="flex items-center space-x-1.5 text-xs text-status-verified">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>Live</span>
                </div>
              </div>
              {AVAILABLE_JOBS.map(job => (
                <JobCard key={job.id} job={job} onView={j => { setSelectedJob(j); setView('job_detail'); }} />
              ))}
            </>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════
          VIEW: JOB DETAIL
      ══════════════════════════════════════════ */}
      {view === 'job_detail' && selectedJob && (
        <div className="space-y-4">
          <button
            onClick={() => setView('home')}
            className="text-xs text-muted hover:text-ink flex items-center space-x-1 cursor-pointer"
          >
            ← Back to Jobs
          </button>

          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-xs text-muted">#{selectedJob.consignmentId}</div>
                <h2 className="font-bold text-xl text-ink mt-0.5">{selectedJob.cargo}</h2>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full text-card mt-1 inline-block"
                  style={{ background: selectedJob.badgeColor }}
                >
                  {selectedJob.badge}
                </span>
              </div>
              <div className="text-right">
                <div className="font-bold text-2xl text-primary">{selectedJob.fare}</div>
                <div className="flex items-center justify-end space-x-1">
                  <Lock className="w-3 h-3 text-status-verified" />
                  <span className="text-[11px] text-status-verified font-semibold">Locked Fare</span>
                </div>
              </div>
            </div>

            {/* Route detail */}
            <div className="bg-surface rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="flex flex-col items-center mt-1">
                  <div className="w-3 h-3 rounded-full bg-status-warning border-2 border-card shadow" />
                  <div className="w-0.5 h-8 bg-border" />
                  <div className="w-3 h-3 rounded-full bg-status-verified border-2 border-card shadow" />
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] uppercase text-muted font-bold">Pickup</div>
                    <div className="text-sm font-semibold text-ink">{selectedJob.origin}</div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-muted font-bold">Delivery</div>
                    <div className="text-sm font-semibold text-ink">{selectedJob.destination}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cargo specs */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Distance', val: `${selectedJob.distanceKm} km` },
                { label: 'Weight', val: selectedJob.weight },
                { label: 'Pickup ETA', val: selectedJob.pickupEta },
              ].map(({ label, val }) => (
                <div key={label} className="bg-surface rounded-xl p-3 border border-border">
                  <div className="text-[10px] text-muted uppercase mb-0.5">{label}</div>
                  <div className="font-bold text-sm text-ink">{val}</div>
                </div>
              ))}
            </div>

            {selectedJob.requiresReefer && (
              <div className="flex items-center space-x-2 bg-regulated-cargo-tint border border-regulated-cargo/30 rounded-xl p-3">
                <Thermometer className="w-4 h-4 text-regulated-cargo" />
                <div>
                  <div className="text-xs font-bold text-regulated-cargo">Temperature Controlled Cargo</div>
                  <div className="text-xs text-muted">Maintain {selectedJob.tempRequired} throughout transit</div>
                </div>
              </div>
            )}

            {/* Single primary CTA */}
            <button
              onClick={() => handleAcceptJob(selectedJob)}
              className="w-full bg-primary hover:bg-primary-dark text-card font-bold py-4 rounded-xl transition-all active:scale-95 cursor-pointer flex items-center justify-center space-x-2 text-base shadow-lg shadow-primary/20"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Accept Job — {selectedJob.fare} Locked</span>
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          VIEW: ACTIVE TRIP
      ══════════════════════════════════════════ */}
      {view === 'active_trip' && (
        <div className="space-y-4">
          {!activeJob ? (
            <div className="text-center py-16 text-muted">
              <Truck className="w-12 h-12 mx-auto mb-3 text-border" />
              <div className="font-bold text-base text-ink mb-1">No Active Trip</div>
              <div className="text-sm mb-4">Accept a cargo job to start your trip.</div>
              <button
                onClick={() => setView('home')}
                className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-card font-bold px-5 py-3 rounded-xl cursor-pointer transition-colors"
              >
                <span>Browse Available Jobs</span>
              </button>
            </div>
          ) : (
            <>
              {/* Trip status bar */}
              <div className="bg-ink rounded-2xl p-5 border border-border/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-mono text-xs text-muted">#{activeJob.consignmentId}</div>
                    <div className="font-bold text-card text-base">{activeJob.cargo}</div>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-primary/20 border border-primary/30 px-2.5 py-1 rounded-full">
                    <Radio className="w-3 h-3 text-status-verified animate-pulse" />
                    <span className="text-xs font-bold text-status-verified">ACTIVE</span>
                  </div>
                </div>

                {/* Progress steps */}
                <div className="space-y-2">
                  {tripStatusSteps.map((step, i) => (
                    <div key={step.key} className={`flex items-center space-x-3 text-xs ${
                      tripStatus === step.key ? 'opacity-100' : step.done ? 'opacity-60' : 'opacity-30'
                    }`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.done ? 'bg-status-verified' : tripStatus === step.key ? 'bg-primary ring-2 ring-primary/30' : 'bg-neutral-state'
                      }`}>
                        {step.done
                          ? <Check className="w-3 h-3 text-card" />
                          : <span className="text-[9px] font-bold text-card">{i + 1}</span>
                        }
                      </div>
                      <span className={`font-medium ${tripStatus === step.key ? 'text-card' : 'text-muted'}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Live temp (for reefer jobs) */}
                {activeJob.requiresReefer && (
                  <div className="mt-4 pt-4 border-t border-border/20 grid grid-cols-2 gap-3">
                    <div className="bg-card/10 rounded-xl p-3">
                      <div className="text-[10px] text-muted uppercase mb-1">Live Temp</div>
                      <div className={`font-mono font-bold text-xl ${liveTemp < 5 ? 'text-regulated-cargo' : 'text-status-warning'}`}>
                        {liveTemp}°C
                      </div>
                    </div>
                    <div className="bg-card/10 rounded-xl p-3">
                      <div className="text-[10px] text-muted uppercase mb-1">Target</div>
                      <div className="font-mono font-bold text-xl text-status-verified">{activeJob.tempRequired}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Route summary */}
              <div className="bg-card rounded-2xl p-4 border border-border shadow-xs">
                <div className="flex items-start space-x-3">
                  <div className="flex flex-col items-center mt-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-status-warning" />
                    <div className="w-0.5 h-6 bg-border" />
                    <div className="w-2.5 h-2.5 rounded-full bg-status-verified" />
                  </div>
                  <div className="space-y-3 flex-1 text-sm">
                    <div className="text-muted">{activeJob.origin}</div>
                    <div className="text-muted">{activeJob.destination}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary text-lg">{activeJob.fare}</div>
                    <div className="flex items-center space-x-1">
                      <Lock className="w-3 h-3 text-status-verified" />
                      <span className="text-[10px] text-status-verified font-semibold">Locked</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons: Surcharge uses outlined/warning pill, Advance uses Primary Trust Teal */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setView('surcharge')}
                  className="bg-status-warning-tint border border-status-warning/30 text-status-warning font-bold py-3.5 rounded-xl text-sm flex items-center justify-center space-x-2 hover:bg-status-warning-tint/80 transition-colors cursor-pointer"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Request Surcharge</span>
                </button>
                <button
                  onClick={advanceTrip}
                  className="bg-primary hover:bg-primary-dark text-card font-bold py-3.5 rounded-xl text-sm flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>
                    {tripStatus === 'at_dropoff' ? 'Complete Delivery' : 'Advance Status'}
                  </span>
                </button>
              </div>

              {tripStatus === 'completed' && (
                <div className="bg-primary-tint border border-primary/30 rounded-2xl p-5 text-center">
                  <CheckCircle className="w-10 h-10 text-primary mx-auto mb-2" />
                  <div className="font-bold text-primary text-lg">Delivery Confirmed!</div>
                  <div className="text-xs text-muted mt-1">Escrow settled — {activeJob.fare} released to your account.</div>
                  <button
                    onClick={() => setView('trust_score')}
                    className="mt-3 text-xs font-bold text-primary flex items-center justify-center space-x-1 mx-auto cursor-pointer"
                  >
                    <span>View Trust Score Update</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════
          VIEW: SURCHARGE REQUEST
      ══════════════════════════════════════════ */}
      {view === 'surcharge' && (
        <div className="space-y-4">
          <button
            onClick={() => setView('active_trip')}
            className="text-xs text-muted hover:text-ink flex items-center space-x-1 cursor-pointer"
          >
            ← Back to Active Trip
          </button>

          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-status-warning-tint flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-status-warning" />
              </div>
              <div>
                <h2 className="font-bold text-base text-ink">Request Surcharge</h2>
                <p className="text-xs text-muted">Consignor must approve before escrow updates</p>
              </div>
            </div>

            {surchargeSubmitted ? (
              <div className="text-center py-6">
                {surchargeApproved ? (
                  <>
                    <CheckCircle className="w-12 h-12 text-status-verified mx-auto mb-2" />
                    <div className="font-bold text-status-verified text-base">Surcharge Approved!</div>
                    <div className="text-xs text-muted mt-1">₹80 toll surcharge added to escrow by consignor.</div>
                    <button onClick={() => { setSurchargeSubmitted(false); setSurchargeApproved(false); setView('active_trip'); }}
                      className="mt-4 text-xs font-bold text-primary cursor-pointer">
                      Back to Trip →
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-status-warning-tint border-2 border-status-warning flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-status-warning" />
                    </div>
                    <div className="font-bold text-status-warning text-base">Pending Consignor Approval</div>
                    <div className="text-xs text-muted mt-1 mb-4">
                      Request sent to Vikramaditya Singhania. Waiting for in-app confirmation.
                    </div>
                    {/* Secondary simulate button uses subtle outlined style */}
                    <button
                      onClick={() => setSurchargeApproved(true)}
                      className="text-xs bg-primary-tint border border-primary/30 text-primary font-bold px-4 py-2 rounded-xl cursor-pointer"
                    >
                      [Demo] Simulate Consignor Approves
                    </button>
                  </>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="bg-status-warning-tint border border-status-warning/30 rounded-xl p-3 text-xs text-muted">
                    <strong className="text-status-warning">Important:</strong> The surcharge will only be added to your escrow payment after the consignor explicitly approves it in their app.
                  </div>

                  {[
                    { label: 'Reason', val: 'FASTag Toll — Khed-Shivapur Plaza (NH 48, Km 188)' },
                    { label: 'Amount', val: '₹80' },
                    { label: 'Location', val: 'Current GPS: NH 48 Near Satara Bypass' },
                  ].map(({ label, val }) => (
                    <div key={label} className="bg-surface rounded-xl p-3 border border-border">
                      <div className="text-[10px] text-muted uppercase mb-0.5">{label}</div>
                      <div className="text-sm font-semibold text-ink">{val}</div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setSurchargeSubmitted(true)}
                  className="w-full mt-4 bg-primary hover:bg-primary-dark text-card font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>Send Surcharge Request to Consignor</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          VIEW: TRUST SCORE
      ══════════════════════════════════════════ */}
      {view === 'trust_score' && (
        <div className="space-y-4">
          {/* Score card */}
          <div className="bg-ink rounded-2xl p-6 border border-border/20 text-center">
            <div className="text-[10px] uppercase tracking-widest text-muted mb-2">Your Trust Score</div>
            <div className="font-bold text-6xl text-status-verified">{DRIVER.trustScore}</div>
            <div className="text-muted text-sm mb-4">/ 1000 · Platinum Tier</div>

            {/* Score bar */}
            <div className="w-full h-3 bg-card/10 rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${DRIVER.trustScore / 10}%`,
                  background: `linear-gradient(90deg, ${reloadTokens.primary}, ${reloadTokens.statusVerified})`,
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted">
              <span>0</span>
              <span>500</span>
              <span>1000</span>
            </div>
          </div>

          {/* Score breakdown */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-xs">
            <h3 className="font-bold text-sm text-ink mb-4">Score Breakdown</h3>
            <div className="space-y-3">
              {[
                { label: 'On-Time Delivery', score: 99, max: 100, color: reloadTokens.statusVerified },
                { label: 'Consignor Ratings', score: 98, max: 100, color: reloadTokens.primary },
                { label: 'Temperature Compliance', score: 100, max: 100, color: reloadTokens.regulatedCargo },
                { label: 'Zero Disputes', score: 100, max: 100, color: reloadTokens.statusWarning },
                { label: 'Surcharge Accuracy', score: 97, max: 100, color: reloadTokens.statusVerified },
              ].map(({ label, score, max, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted">{label}</span>
                    <span className="font-bold" style={{ color }}>{score}/{max}</span>
                  </div>
                  <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(score / max) * 100}%`, background: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-xs">
            <h3 className="font-bold text-sm text-ink mb-3">Certifications Active</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'VAHAN 4.0 Verified', color: reloadTokens.statusVerified },
                { label: 'Reefer Certified', color: reloadTokens.regulatedCargo },
                { label: 'Aadhaar KYC', color: reloadTokens.statusVerified },
                { label: 'Hazmat Certified', color: reloadTokens.statusWarning },
                { label: 'Commercial DL', color: reloadTokens.primary },
              ].map(cert => (
                <span
                  key={cert.label}
                  className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border"
                  style={{ color: cert.color, borderColor: `${cert.color}40`, background: `${cert.color}12` }}
                >
                  <BadgeCheck className="w-3.5 h-3.5" />
                  <span>{cert.label}</span>
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => setView('home')}
            className="w-full py-3.5 bg-primary hover:bg-primary-dark text-card font-bold rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>Browse New Jobs</span>
          </button>
        </div>
      )}
    </div>
  );
};
