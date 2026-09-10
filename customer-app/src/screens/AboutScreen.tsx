import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock, ShieldCheck, Thermometer, Truck, Users, Globe,
  CheckCircle, ArrowRight, Target, Zap, BadgeCheck,
  ChevronDown, ChevronUp, Mail, Phone, Building2, Leaf,
  TrendingUp, Cpu, Map, FileCheck, Award, HeartHandshake
} from 'lucide-react';
import { reloadTokens } from '../theme/tokens';

// ── Design tokens ──────────────────────────────────────────────────────────
const INK    = reloadTokens.ink;
const PAPER  = reloadTokens.surface;
const TEAL   = reloadTokens.primary;
const TEAL_D = reloadTokens.primaryDark;
const TEAL_L = reloadTokens.primaryTint;
const BLUE   = reloadTokens.regulatedCargo;
const GREEN  = reloadTokens.statusVerified;
const GREEN_L= reloadTokens.statusVerifiedTint;
const AMBER  = reloadTokens.statusWarning;

// ── Lifecycle steps ─────────────────────────────────────────────────────────
const LIFECYCLE_STEPS = [
  {
    step: '01',
    icon: Truck,
    color: TEAL,
    bg: TEAL_L,
    title: 'Shipper Books & Fare Locks',
    desc: 'Consignor selects route, cargo category, and vehicle. The Locked Fare Engine immediately calculates and cryptographically locks the base fare in escrow.',
  },
  {
    step: '02',
    icon: BadgeCheck,
    color: BLUE,
    bg: reloadTokens.regulatedCargoTint,
    title: 'Driver Verified & Dispatched',
    desc: 'A VAHAN 4.0 verified, Trust Score–ranked driver accepts the job. AADHAAR biometric + vehicle certificate match is confirmed before dispatch.',
  },
  {
    step: '03',
    icon: ShieldCheck,
    color: GREEN,
    bg: GREEN_L,
    title: 'Cryptographic Pickup Handoff',
    desc: 'At origin dock, the dockmaster scans a digital tamper seal and signs off with OTP. Temperature, odometer, and seal state are immutably recorded.',
  },
  {
    step: '04',
    icon: Thermometer,
    color: BLUE,
    bg: reloadTokens.regulatedCargoTint,
    title: 'IoT Telemetry In-Transit',
    desc: 'Throughout the route, satellite-linked sensors stream temperature, GPS coordinates, speed, and FASTag toll status every 90 seconds. Excursion alerts are instant.',
  },
  {
    step: '05',
    icon: FileCheck,
    color: TEAL,
    bg: TEAL_L,
    title: 'Digital Drop-off Confirmation',
    desc: 'The inward dockmaster scans the tamper seal at the delivery terminal. Any surcharge (toll, detention) requires consignor approval before escrow update.',
  },
  {
    step: '06',
    icon: Lock,
    color: AMBER,
    bg: reloadTokens.statusWarningTint,
    title: 'Instant Escrow Settlement',
    desc: 'Once delivery is confirmed, the locked fare is instantly released to the driver\'s bank account. No paperwork. No chasing brokers. Same-day settlement.',
  },
];

// ── Pillars ─────────────────────────────────────────────────────────────────
const PILLARS = [
  {
    icon: Lock,
    color: TEAL,
    bg: TEAL_L,
    num: '01',
    title: 'Locked Fare Engine',
    desc: 'A proprietary escrow algorithm calculates and hard-locks the base fare at booking confirmation. Mid-transit cost updates are impossible without explicit consignor consent via a digital approval modal.',
    points: [
      'Escrow-protected locked base fare',
      'Surcharge approval push notifications',
      'Full audit trail for every fare change',
      'Invoice auto-generated at settlement',
    ],
  },
  {
    icon: Thermometer,
    color: BLUE,
    bg: reloadTokens.regulatedCargoTint,
    num: '02',
    title: 'Cold-Chain IoT Telemetry',
    desc: 'Every reefer vehicle in the Reload network is fitted with a satellite-linked multipoint sensor array — streaming temperature, humidity, GPS, and compressor vitals every 90 seconds.',
    points: [
      '90-second temperature broadcast interval',
      'Multi-zone thermograph support',
      'Automatic excursion SMS + in-app alert',
      'WHO-GDP compliant data logging',
    ],
  },
  {
    icon: BadgeCheck,
    color: GREEN,
    bg: GREEN_L,
    num: '03',
    title: 'Regulated Fleet Verification',
    desc: 'Reload\'s 4-layer driver & vehicle verification system cross-references VAHAN 4.0 APIs, Ministry of Road Transport records, commercial licence databases, and Aadhaar biometrics.',
    points: [
      'VAHAN 4.0 real-time vehicle status',
      'Aadhaar biometric identity match',
      'Reefer, Hazmat & ADR certifications',
      'Trust Score updated after every trip',
    ],
  },
  {
    icon: ShieldCheck,
    color: AMBER,
    bg: reloadTokens.statusWarningTint,
    num: '04',
    title: 'Ergonomic Driver Interface',
    desc: 'The Reload Driver Companion is purpose-built for one-handed outdoor operation — high-contrast dark UI, 52px touch targets, zero distracting animations, and offline-capable trip state.',
    points: [
      'High-contrast dark mode UI',
      '52px minimum touch targets',
      'Offline-resilient trip state caching',
      'Multilingual in 7 Indian languages',
    ],
  },
];

// ── Compliance badges ────────────────────────────────────────────────────────
const COMPLIANCE = [
  { label: 'VAHAN 4.0', sub: 'MoRTH Integration', color: TEAL },
  { label: 'WHO-GDP', sub: 'Pharma Cold Chain', color: BLUE },
  { label: 'FASTag NPCI', sub: 'Toll Reconciliation', color: GREEN },
  { label: 'GST e-Waybill', sub: 'GSTN Compliant', color: AMBER },
  { label: 'Aadhaar KYC', sub: 'UIDAI Verified', color: reloadTokens.neutralState },
  { label: 'ISO 9001', sub: 'Quality Systems', color: reloadTokens.statusCritical },
];

// ── FAQ sets ─────────────────────────────────────────────────────────────────
const FAQS_SHIPPER = [
  {
    q: 'Can the driver change the fare after I book?',
    a: 'No. The moment you confirm your booking, the fare is cryptographically locked in a regulated escrow account. Only you — the consignor — can approve any additional surcharges, and each approval requires an explicit in-app confirmation. The driver has zero access to modify base fare.',
  },
  {
    q: 'What happens if the temperature goes out of range?',
    a: 'You receive an immediate in-app push notification and SMS. The incident is automatically logged with geo-tagged timestamps and sensor data. You can instantly file a dispute which freezes the driver\'s escrow settlement pending a Tier-2 Ops Officer review.',
  },
  {
    q: 'How do I track my cold-chain shipment live?',
    a: 'Your Live Trip screen shows 90-second GPS pings, interior temperature chart, current speed, FASTag toll status, and estimated arrival time. You can also chat directly with the driver via the in-app secure message channel.',
  },
];
const FAQS_DRIVER = [
  {
    q: 'How does Trust Score affect my job access?',
    a: 'Trust Score is calculated from consignor ratings, on-time performance, temperature compliance (for reefer runs), and zero-dispute record. Drivers above 900 get priority job notifications before lower-rated drivers. Score above 950 unlocks Platinum status with 5% bonus on escrow payouts.',
  },
  {
    q: 'When do I get paid after delivery?',
    a: 'Payment is released instantly once the consignee\'s dockmaster confirms the digital drop-off handoff and the tamper seal is verified. There is no waiting period. Funds hit your registered bank account within 2 hours of settlement via IMPS.',
  },
  {
    q: 'What if I need to request a surcharge for a toll or delay?',
    a: 'From the Active Trip screen, tap "Request Surcharge", enter the reason and amount. Reload sends a push notification to the consignor with your photo receipt. Once they approve, the escrow is updated automatically and you receive the additional amount at settlement.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
export const AboutScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeFaqTab, setActiveFaqTab] = useState<'shipper' | 'driver'>('shipper');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formMsg, setFormMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqs = activeFaqTab === 'shipper' ? FAQS_SHIPPER : FAQS_DRIVER;

  return (
    <div className="min-h-screen bg-surface text-ink">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative py-16 lg:py-24 overflow-hidden bg-gradient-to-b from-primary-tint/50 via-surface to-surface border-b border-border">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `linear-gradient(${reloadTokens.border} 1px, transparent 1px), linear-gradient(90deg, ${reloadTokens.border} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-primary-tint border border-primary/30 rounded-full px-3.5 py-1.5 text-xs font-semibold text-primary mb-6 shadow-xs">
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span>Our Mission & Story</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ink leading-tight">
            Eradicating Freight Uncertainty<br />
            <span style={{ color: TEAL }}>Across India's Highways.</span>
          </h1>
          <p className="mt-6 text-muted text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Reload was born from a single observation: India's cold-chain cargo industry loses <strong className="text-ink font-semibold">₹92,000 Crore annually</strong> to temperature excursions, opaque freight pricing, and broker-driven fare manipulation. We built the antidote.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('/book')}
              className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-card font-bold px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>Book Your First Trip</span>
            </button>
            <button
              onClick={() => navigate('/driver')}
              className="inline-flex items-center space-x-2 bg-card border border-border text-ink font-bold px-6 py-3.5 rounded-xl shadow-xs transition-all hover:bg-surface cursor-pointer"
            >
              <Users className="w-4 h-4 text-primary" />
              <span>Join as Driver</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── THE RELOAD STORY ──────────────────────────────────── */}
      <section className="py-20 bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink mb-5">
                The Old Way Was Broken.
              </h2>
              <div className="space-y-4 text-sm text-muted leading-relaxed">
                <p>
                  Traditional freight brokering in India operated on handshake deals, verbal fare quotations, and carbon-copy waybills. Drivers could renegotiate fares mid-highway. Reefer vehicle temperature logs were paper printouts that arrived weeks after delivery — if at all.
                </p>
                <p>
                  Pharmaceutical companies lost vaccine batches to undetected temperature excursions. Dairy cooperatives paid 40% above quoted rates due to undisclosed broker margins. Drivers were underpaid and undervalued, with no transparent performance record to advance their careers.
                </p>
                <p>
                  <strong className="text-ink">We built Reload to end every one of these failures.</strong> Starting with the most fundamental guarantee: if you confirm a fare today, that is exactly what you pay — locked in a digital escrow, verifiable, immutable.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '❌', label: 'Old Way', items: ['Verbal fare quotations', 'Paper temperature logs', 'Opaque broker margins', 'No driver accountability', 'Manual waybill disputes'] },
                { icon: '✅', label: 'Reload Way', items: ['Cryptographic locked fare', 'IoT 90-second telemetry', 'Zero broker markup', 'Trust Score transparency', 'Instant digital handoff'] },
              ].map(col => (
                <div
                  key={col.label}
                  className={`rounded-2xl p-5 border ${col.label === 'Reload Way' ? 'bg-primary-tint border-primary/30' : 'bg-status-critical-tint/40 border-status-critical/20'}`}
                >
                  <div className="text-2xl mb-2">{col.icon}</div>
                  <div className={`font-bold text-sm mb-3 ${col.label === 'Reload Way' ? 'text-primary' : 'text-status-critical'}`}>
                    {col.label}
                  </div>
                  <ul className="space-y-2">
                    {col.items.map(item => (
                      <li key={item} className="text-xs text-muted flex items-start space-x-2">
                        <span>{col.label === 'Reload Way' ? '→' : '✗'}</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 PILLARS (DEEP DIVE) ─────────────────────────────── */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink">
              Four Technological Pillars
            </h2>
            <p className="mt-3 text-muted max-w-xl mx-auto">
              Every feature in Reload serves one of four foundational principles.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {PILLARS.map(p => {
              const Icon = p.icon;
              return (
                <div key={p.num} className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: p.bg }}>
                      <Icon className="w-6 h-6" style={{ color: p.color }} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: p.color }}>
                        Pillar {p.num}
                      </div>
                      <h3 className="font-display font-bold text-xl text-ink">{p.title}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted leading-relaxed mb-5">{p.desc}</p>
                  <ul className="grid grid-cols-2 gap-2">
                    {p.points.map(pt => (
                      <li key={pt} className="flex items-start space-x-2">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: p.color }} />
                        <span className="text-xs text-muted">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── LOGISTICS LIFECYCLE DIAGRAM ───────────────────────── */}
      <section className="py-20 bg-card border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink">
              How a Reload Trip Works
            </h2>
            <p className="mt-3 text-muted max-w-xl mx-auto">
              From booking to settlement — every step is automated, verified, and transparent.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div
              className="absolute left-7 top-8 bottom-8 w-0.5 hidden sm:block"
              style={{ background: `linear-gradient(to bottom, ${TEAL}, ${BLUE}, ${AMBER})` }}
            />

            <div className="space-y-6">
              {LIFECYCLE_STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.step} className="flex items-start space-x-5">
                    {/* Step circle */}
                    <div
                      className="relative w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-card shadow-md z-10"
                      style={{ background: s.bg, borderColor: s.color + '40' }}
                    >
                      <Icon className="w-6 h-6" style={{ color: s.color }} />
                      <div
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-card text-[9px] font-extrabold flex items-center justify-center"
                        style={{ background: s.color }}
                      >
                        {s.step}
                      </div>
                    </div>

                    <div className="bg-surface rounded-2xl p-5 flex-1 border border-border hover:shadow-sm transition-shadow">
                      <h3 className="font-display font-bold text-base text-ink mb-1.5">{s.title}</h3>
                      <p className="text-xs text-muted leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPLIANCE STANDARDS ──────────────────────────────── */}
      <section className="py-16 bg-surface border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink mb-3">
            Regulatory & Compliance Standards
          </h2>
          <p className="text-muted text-sm mb-10 max-w-xl mx-auto">
            Reload is built to meet every Indian regulatory and international pharma-logistics compliance standard.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {COMPLIANCE.map(c => (
              <div key={c.label} className="bg-card rounded-2xl p-4 border border-border hover:border-primary/40 shadow-xs transition-colors">
                <div
                  className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center font-mono font-bold text-xs"
                  style={{ background: c.color + '15', border: `1px solid ${c.color}35`, color: c.color }}
                >
                  ✓
                </div>
                <div className="font-bold text-sm text-ink">{c.label}</div>
                <div className="text-[10px] text-muted mt-0.5">{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DRIVER WELFARE & SUSTAINABILITY ───────────────────── */}
      <section className="py-20 bg-surface border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-ink mb-5">
                Fair for Drivers. <span style={{ color: TEAL }}>Always.</span>
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-6">
                We believe the future of Indian freight runs on respect for the driver. Every feature in our platform — from Trust Score to instant settlement — is designed to make the driver's life more predictable, fair, and rewarding.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Award, title: 'Trust Score Rewards', desc: 'Earn priority job access and Platinum bonus with consistent high ratings.' },
                  { icon: Zap, title: 'Instant Escrow Settlement', desc: 'Paid the moment the consignee confirms digital handoff. No waiting. No paperwork.' },
                  { icon: Leaf, title: 'Green Fleet Transition', desc: 'Reload partners with CNG & EV reefer manufacturers to incentivise fleet electrification.' },
                  { icon: HeartHandshake, title: 'Zero Hidden Deductions', desc: 'Your locked fare is yours. Reload earns only the platform fee shown at booking.' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-tint flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-ink">{title}</div>
                      <div className="text-xs text-muted mt-0.5">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <div className="text-center mb-6">
                <div className="font-display text-xs uppercase tracking-widest text-muted mb-1">Average Driver Stats</div>
                <div className="font-display font-extrabold text-4xl text-primary">₹1.8L+</div>
                <div className="text-xs text-muted">Monthly earnings for Platinum-tier drivers</div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Average Trust Score', val: '962 / 1000', color: GREEN },
                  { label: 'On-time Delivery Rate', val: '99.4%', color: TEAL },
                  { label: 'Avg. Settlement Time', val: '< 2 Hours', color: BLUE },
                  { label: 'Active Driver Partners', val: '3,800+', color: AMBER },
                ].map(({ label, val, color }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <span className="text-sm text-muted">{label}</span>
                    <span className="font-bold text-sm" style={{ color }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="py-20 bg-card border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-extrabold text-ink">Questions & Answers</h2>
          </div>

          {/* Tab */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex bg-surface rounded-xl p-1 border border-border">
              {(['shipper', 'driver'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => { setActiveFaqTab(tab); setOpenFaq(null); }}
                  className={`px-5 py-2 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                    activeFaqTab === tab
                      ? 'bg-primary text-card shadow'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {tab === 'shipper' ? '🏭 Shipper FAQ' : '🚛 Driver FAQ'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-border rounded-2xl overflow-hidden">
                <button
                  className="w-full text-left flex items-start justify-between px-5 py-4 hover:bg-surface transition-colors cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-sm text-ink pr-4">{faq.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    : <ChevronDown className="w-4 h-4 text-muted flex-shrink-0 mt-0.5" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pt-2 text-sm text-muted leading-relaxed border-t border-surface">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT / PARTNERSHIP FORM ────────────────────────── */}
      <section className="py-20 bg-surface border-t border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-extrabold text-ink">
              Partner With Reload
            </h2>
            <p className="mt-2 text-muted text-sm max-w-md mx-auto">
              Whether you're an enterprise shipper, fleet operator, or logistics tech company — let's build India's most trusted freight network together.
            </p>
          </div>

          {submitted ? (
            <div className="bg-primary-tint border border-primary/30 rounded-2xl p-8 text-center">
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-display font-bold text-xl text-primary mb-2">Inquiry Sent!</h3>
              <p className="text-sm text-muted">Our partnerships team will reach out within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-sm space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5 block">Your Name</label>
                  <div className="relative">
                    <input
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      required
                      placeholder="Vikramaditya Singhania"
                      className="w-full border border-border rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Users className="absolute left-3 top-3 w-3.5 h-3.5 text-muted" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5 block">Email</label>
                  <div className="relative">
                    <input
                      value={formEmail}
                      onChange={e => setFormEmail(e.target.value)}
                      required
                      type="email"
                      placeholder="ops@yourcompany.in"
                      className="w-full border border-border rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Mail className="absolute left-3 top-3 w-3.5 h-3.5 text-muted" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5 block">Message</label>
                <textarea
                  value={formMsg}
                  onChange={e => setFormMsg(e.target.value)}
                  required
                  rows={4}
                  placeholder="Tell us about your fleet size, monthly trip volume, or partnership interest..."
                  className="w-full border border-border rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center space-x-2 bg-primary hover:bg-primary-dark text-card font-bold py-3.5 rounded-xl shadow transition-all cursor-pointer"
              >
                <span>Submit Partnership Inquiry</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};
