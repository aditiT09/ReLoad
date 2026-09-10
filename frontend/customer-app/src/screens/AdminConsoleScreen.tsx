import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert, ShieldCheck, AlertTriangle, AlertCircle, 
  Search, Filter, RefreshCw, Eye, Download, CheckCircle, 
  XCircle, Thermometer, Lock, ExternalLink, ArrowLeft,
  FileText, Activity, Clock, ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

type ComplianceStatus = 'verified' | 'warning' | 'critical';
type CargoClass = 'cold_chain' | 'dry' | 'heavy';

interface ComplianceRecord {
  id: string;
  vehicleReg: string;
  driverName: string;
  carrier: string;
  cargoClass: CargoClass;
  vahanStatus: ComplianceStatus;
  reeferCalibration: ComplianceStatus;
  hazmatCert: ComplianceStatus;
  pucStatus: ComplianceStatus;
  currentTempCelsius?: number;
  targetTempCelsius?: number;
  activeTripId: string;
  severity: 'normal' | 'medium' | 'critical';
  notes: string;
}

const MOCK_RECORDS: ComplianceRecord[] = [
  {
    id: 'CMP-101',
    vehicleReg: 'MH-04-GP-8192',
    driverName: 'Rajesh Kumar',
    carrier: 'Apex Logistics Corp',
    cargoClass: 'cold_chain',
    vahanStatus: 'verified',
    reeferCalibration: 'verified',
    hazmatCert: 'verified',
    pucStatus: 'verified',
    currentTempCelsius: 3.8,
    targetTempCelsius: 4.0,
    activeTripId: 'RL-9842',
    severity: 'normal',
    notes: 'All telematics sensors within WHO-GDP envelope. Gate pass issued.',
  },
  {
    id: 'CMP-102',
    vehicleReg: 'KA-01-MJ-4102',
    driverName: 'Suresh Patil',
    carrier: 'Southern Express Line',
    cargoClass: 'cold_chain',
    vahanStatus: 'verified',
    reeferCalibration: 'warning',
    hazmatCert: 'verified',
    pucStatus: 'warning',
    currentTempCelsius: 8.4,
    targetTempCelsius: 4.0,
    activeTripId: 'RL-9104',
    severity: 'medium',
    notes: 'Reefer calibration expires in 8 days. Secondary temp excursion logged near Hubballi.',
  },
  {
    id: 'CMP-103',
    vehicleReg: 'DL-1L-AA-2291',
    driverName: 'Manpreet Singh',
    carrier: 'North Corridor Freight',
    cargoClass: 'heavy',
    vahanStatus: 'critical',
    reeferCalibration: 'verified',
    hazmatCert: 'critical',
    pucStatus: 'critical',
    activeTripId: 'RL-8750',
    severity: 'critical',
    notes: 'Commercial Fitness Certificate EXPIRED 3 days ago. Escrow freeze engaged.',
  },
  {
    id: 'CMP-104',
    vehicleReg: 'MH-12-RN-7731',
    driverName: 'Dnyaneshwar More',
    carrier: 'Deccan Cargo Lines',
    cargoClass: 'dry',
    vahanStatus: 'verified',
    reeferCalibration: 'verified',
    hazmatCert: 'verified',
    pucStatus: 'verified',
    activeTripId: 'RL-8921',
    severity: 'normal',
    notes: 'Dry container structural audit verified. FASTag NPCI cleared.',
  },
  {
    id: 'CMP-105',
    vehicleReg: 'GJ-06-TT-5519',
    driverName: 'Hitesh Patel',
    carrier: 'Gujarat Reefer Logistics',
    cargoClass: 'cold_chain',
    vahanStatus: 'warning',
    reeferCalibration: 'critical',
    hazmatCert: 'verified',
    pucStatus: 'verified',
    currentTempCelsius: 12.1,
    targetTempCelsius: 2.0,
    activeTripId: 'RL-9012',
    severity: 'critical',
    notes: 'Active thermal breach in pharma cargo zone. Alert dispatched to ops desk.',
  },
];

export const AdminConsoleScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentBooking } = useApp();
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'normal' | 'medium' | 'critical'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ComplianceRecord | null>(null);

  const filtered = MOCK_RECORDS.filter(rec => {
    if (filterSeverity !== 'all' && rec.severity !== filterSeverity) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        rec.vehicleReg.toLowerCase().includes(q) ||
        rec.driverName.toLowerCase().includes(q) ||
        rec.carrier.toLowerCase().includes(q) ||
        rec.activeTripId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-surface text-ink pb-24">
      {/* ── Admin Console Dark Shell Header ── */}
      <div className="bg-admin-shell text-card border-b border-admin-shell/80 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="text-neutral-state hover:text-card p-1 rounded-lg transition-colors cursor-pointer"
                title="Return to Customer App"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-condensed font-bold text-xl uppercase tracking-wider text-card">
                    RELOAD ADMIN CONSOLE
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary-tint text-primary font-bold">
                    TERMINAL OPS v4.2
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5">
                  Real-time Regulatory Compliance, Fleet Verifications & Escrow Lock Engine
                </p>
              </div>
            </div>

            {/* Terminal status indicators */}
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1.5 bg-card/10 px-3 py-1.5 rounded-lg border border-card/10">
                <div className="w-2 h-2 rounded-full bg-status-verified animate-pulse" />
                <span className="text-card font-mono text-[11px]">VAHAN 4.0: CONNECTED</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-card/10 px-3 py-1.5 rounded-lg border border-card/10">
                <div className="w-2 h-2 rounded-full bg-status-verified" />
                <span className="text-card font-mono text-[11px]">FASTag NPCI: LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ── Tri-Color Model Status Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Verified / Active Card */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                1. Verified / Active
              </span>
              <div className="w-8 h-8 rounded-xl bg-status-verified-tint flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-status-verified" />
              </div>
            </div>
            <div className="font-condensed font-bold text-3xl text-status-verified">3,482</div>
            <p className="text-xs text-muted mt-1">
              Compliant VAHAN 4.0, calibrated reefers & active gate passes.
            </p>
          </div>

          {/* Due / Warning Card */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                2. Due / Warning (30d)
              </span>
              <div className="w-8 h-8 rounded-xl bg-status-warning-tint flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-status-warning" />
              </div>
            </div>
            <div className="font-condensed font-bold text-3xl text-status-warning">48</div>
            <p className="text-xs text-muted mt-1">
              Documents expiring within 30 days or pending re-certification.
            </p>
          </div>

          {/* Critical / Expired Card */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                3. Expired / Critical Risk
              </span>
              <div className="w-8 h-8 rounded-xl bg-status-critical-tint flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-status-critical" />
              </div>
            </div>
            <div className="font-condensed font-bold text-3xl text-status-critical">6</div>
            <p className="text-xs text-muted mt-1">
              Escrow frozen due to expired certificate or thermal SLA breach.
            </p>
          </div>
        </div>

        {/* ── Filters & Search Bar ── */}
        <div className="bg-card rounded-2xl p-4 border border-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-muted absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search registration, driver, trip #..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl pl-9 pr-3.5 py-2 text-xs text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Tri-Color Risk Filter Tabs */}
          <div className="flex items-center space-x-1 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setFilterSeverity('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filterSeverity === 'all'
                  ? 'bg-ink text-card'
                  : 'bg-surface text-muted hover:text-ink'
              }`}
            >
              All Records
            </button>
            <button
              onClick={() => setFilterSeverity('normal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filterSeverity === 'normal'
                  ? 'bg-status-verified text-card'
                  : 'bg-status-verified-tint text-status-verified hover:opacity-80'
              }`}
            >
              Verified (3)
            </button>
            <button
              onClick={() => setFilterSeverity('medium')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filterSeverity === 'medium'
                  ? 'bg-status-warning text-card'
                  : 'bg-status-warning-tint text-status-warning hover:opacity-80'
              }`}
            >
              Due/Warning (1)
            </button>
            <button
              onClick={() => setFilterSeverity('critical')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                filterSeverity === 'critical'
                  ? 'bg-status-critical text-card'
                  : 'bg-status-critical-tint text-status-critical hover:opacity-80'
              }`}
            >
              Critical Risk (2)
            </button>
          </div>
        </div>

        {/* ── High-Contrast Data Grid (Tri-Color Compliance Model) ── */}
        <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface text-muted uppercase font-bold border-b border-border tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Vehicle & Driver</th>
                  <th className="py-3 px-4">Cargo Category</th>
                  <th className="py-3 px-4">VAHAN 4.0</th>
                  <th className="py-3 px-4">Reefer Calibration</th>
                  <th className="py-3 px-4">Telematics / Temp</th>
                  <th className="py-3 px-4">Trip Escrow Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {filtered.map(rec => {
                  // Full-row warning tint for critical records in admin tables per design system spec
                  const isCritical = rec.severity === 'critical';
                  const isWarning = rec.severity === 'medium';

                  return (
                    <tr
                      key={rec.id}
                      className={`transition-colors ${
                        isCritical
                          ? 'bg-status-critical-tint/50 hover:bg-status-critical-tint'
                          : isWarning
                          ? 'bg-status-warning-tint/30 hover:bg-status-warning-tint/50'
                          : 'hover:bg-surface'
                      }`}
                    >
                      {/* Vehicle & Driver */}
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-ink">{rec.vehicleReg}</div>
                        <div className="text-muted text-[11px]">{rec.driverName} • {rec.carrier}</div>
                      </td>

                      {/* Cargo Category Accent */}
                      <td className="py-3 px-4">
                        {rec.cargoClass === 'cold_chain' ? (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded bg-regulated-cargo-tint text-regulated-cargo border border-regulated-cargo/30">
                            <Thermometer className="w-3 h-3" />
                            <span>Cold-Chain Regulated</span>
                          </span>
                        ) : rec.cargoClass === 'heavy' ? (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-state-tint text-neutral-state border border-neutral-state/30">
                            <span>Heavy Machinery</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-state-tint text-neutral-state border border-neutral-state/30">
                            <span>Dry General Cargo</span>
                          </span>
                        )}
                      </td>

                      {/* VAHAN 4.0 Status */}
                      <td className="py-3 px-4">
                        {rec.vahanStatus === 'verified' && (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded bg-status-verified-tint text-status-verified border border-status-verified/30">
                            <CheckCircle className="w-3 h-3" />
                            <span>Cleared</span>
                          </span>
                        )}
                        {rec.vahanStatus === 'warning' && (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded bg-status-warning-tint text-status-warning border border-status-warning/30">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Review (14d)</span>
                          </span>
                        )}
                        {rec.vahanStatus === 'critical' && (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded bg-status-critical-tint text-status-critical border border-status-critical/30">
                            <XCircle className="w-3 h-3" />
                            <span>Expired</span>
                          </span>
                        )}
                      </td>

                      {/* Reefer Calibration */}
                      <td className="py-3 px-4">
                        {rec.reeferCalibration === 'verified' && (
                          <span className="text-[11px] text-status-verified font-bold">Valid (WHO-GDP)</span>
                        )}
                        {rec.reeferCalibration === 'warning' && (
                          <span className="text-[11px] text-status-warning font-bold">Due Soon (8d)</span>
                        )}
                        {rec.reeferCalibration === 'critical' && (
                          <span className="text-[11px] text-status-critical font-bold">Lapsed Sensor</span>
                        )}
                      </td>

                      {/* Telematics / Temp */}
                      <td className="py-3 px-4">
                        {rec.currentTempCelsius !== undefined ? (
                          <div className="font-mono text-xs">
                            <span className={rec.currentTempCelsius > (rec.targetTempCelsius || 4) + 2 ? 'text-status-critical font-bold' : 'text-regulated-cargo font-bold'}>
                              {rec.currentTempCelsius}°C
                            </span>
                            <span className="text-muted text-[10px] ml-1">
                              (Target: {rec.targetTempCelsius}°C)
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted text-[11px]">N/A (Ambient)</span>
                        )}
                      </td>

                      {/* Trip Escrow Status */}
                      <td className="py-3 px-4">
                        <div className="font-mono text-xs text-ink font-bold">#{rec.activeTripId}</div>
                        {isCritical ? (
                          <span className="text-[10px] font-bold text-status-critical uppercase">
                            Escrow Frozen
                          </span>
                        ) : isWarning ? (
                          <span className="text-[10px] font-bold text-status-warning uppercase">
                            Dispute Review
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-status-verified uppercase">
                            Escrow Locked (Safe)
                          </span>
                        )}
                      </td>

                      {/* Secondary Action - subtle outline button */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedRecord(rec)}
                          className="px-2.5 py-1 text-[11px] font-bold text-muted hover:text-ink border border-border hover:border-neutral-state rounded-lg transition-colors cursor-pointer"
                        >
                          Audit Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Single Primary CTA per screen (Rule Enforced) ── */}
        <div className="bg-card rounded-2xl p-5 border border-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm text-ink">Dispatch & Escrow Audit Cleared</h3>
            <p className="text-xs text-muted mt-0.5">
              Run automated batch audit across all active fleet telematics and e-waybill records.
            </p>
          </div>

          {/* Only ONE Primary CTA uses Trust Teal on this screen */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => alert('Batch verification audit running across all NH-48 nodes.')}
              className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary-dark text-card font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Run Batch Compliance Audit
            </button>
          </div>
        </div>

        {/* Audit Details Modal */}
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-xs">
            <div className="bg-card rounded-2xl p-6 max-w-lg w-full border border-border shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-base text-ink">
                    {selectedRecord.vehicleReg}
                  </span>
                  <span className="text-xs text-muted">
                    ({selectedRecord.carrier})
                  </span>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-muted hover:text-ink text-xs font-bold px-2 py-1 rounded"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="bg-surface p-3 rounded-xl border border-border">
                  <span className="text-[10px] text-muted uppercase font-bold block mb-1">
                    Regulatory Audit Log
                  </span>
                  <p className="text-ink font-medium leading-relaxed">
                    {selectedRecord.notes}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-surface p-2.5 rounded-xl border border-border">
                    <span className="text-[10px] text-muted block">Driver</span>
                    <span className="font-bold text-ink">{selectedRecord.driverName}</span>
                  </div>
                  <div className="bg-surface p-2.5 rounded-xl border border-border">
                    <span className="text-[10px] text-muted block">Active Trip</span>
                    <span className="font-bold text-ink">#{selectedRecord.activeTripId}</span>
                  </div>
                </div>

                {selectedRecord.severity === 'critical' && (
                  <div className="bg-status-critical-tint border border-status-critical/30 p-3 rounded-xl flex items-start space-x-2 text-status-critical">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Critical Compliance Deviation</span>
                      <span>Consignment escrow payment is held pending physical documentation submission.</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedRecord(null)}
                  className="px-4 py-2 border border-border text-muted hover:text-ink rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Close Audit View
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
