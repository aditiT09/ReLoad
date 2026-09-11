'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

interface IncidentReport {
  id: string;
  tripId: string;
  driverName: string;
  driverPhone: string;
  category: 'Toll Surcharge' | 'Cold Chain' | 'Delay Anomaly' | 'Cargo Damage';
  severity: 'high' | 'medium' | 'low';
  amount: string;
  status: 'Open Review' | 'Under Audit' | 'Approved' | 'Resolved';
  time: string;
  location: string;
  description: string;
  trustImpact: string;
}

const INCIDENTS: IncidentReport[] = [
  {
    id: 'INC-9041',
    tripId: 'TRIP-8842',
    driverName: 'Gurpreet Singh',
    driverPhone: '+91 98230 ••••42',
    category: 'Toll Surcharge',
    severity: 'medium',
    amount: '₹650',
    status: 'Open Review',
    time: '12 mins ago',
    location: 'Panvel Express Bypass (NH-48)',
    description: 'Driver claimed diversion toll charge due to bridge maintenance on main expressway.',
    trustImpact: '-2 pts pending review',
  },
  {
    id: 'INC-9040',
    tripId: 'TRIP-7712',
    driverName: 'Rajesh Varma',
    driverPhone: '+91 94120 ••••11',
    category: 'Cold Chain',
    severity: 'high',
    amount: '₹0 (SLA)',
    status: 'Under Audit',
    time: '45 mins ago',
    location: 'Apollo Cold Storage Bay 4',
    description: 'Reefer temperature spiked to -12°C for 22 minutes during dock unloading wait.',
    trustImpact: '-8 pts potential penalty',
  },
  {
    id: 'INC-9039',
    tripId: 'TRIP-6629',
    driverName: 'Manpreet Sandhu',
    driverPhone: '+91 98881 ••••33',
    category: 'Delay Anomaly',
    severity: 'low',
    amount: '₹0',
    status: 'Approved',
    time: '2 hours ago',
    location: 'Vapi Industrial Toll',
    description: 'Tyre puncture stop verified with garage GPS geofence stamp.',
    trustImpact: '0 pts (Excused)',
  },
  {
    id: 'INC-9038',
    tripId: 'TRIP-5510',
    driverName: 'Vikramjit Roy',
    driverPhone: '+91 97720 ••••99',
    category: 'Cargo Damage',
    severity: 'high',
    amount: '₹4,200',
    status: 'Resolved',
    time: 'Yesterday',
    location: 'JNPT Port Dock 3',
    description: 'Outer carton crush insurance claim processed and credited.',
    trustImpact: 'Resolved via FastClaim',
  },
];

export default function AdminReportsPage() {
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport>(INCIDENTS[0]);
  const [filter, setFilter] = useState('all');
  const [isResolvedLocally, setIsResolvedLocally] = useState<string[]>([]);

  const filteredIncidents = INCIDENTS.filter((inc) => {
    if (filter === 'toll') return inc.category === 'Toll Surcharge';
    if (filter === 'cold') return inc.category === 'Cold Chain';
    return true;
  });

  const handleResolve = (id: string) => {
    setIsResolvedLocally((prev) => [...prev, id]);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-5 w-full">
        {/* Header Controls & Topline KPIs */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-display text-xs text-[#64748B] uppercase tracking-wider font-bold">
                Disputes &amp; Telematics Audit
              </span>
              <span className="h-2 w-2 rounded-full bg-[#D97706] animate-pulse"></span>
              <span className="font-display text-xs text-[#D97706] font-bold">
                {INCIDENTS.length} Active Inquiries
              </span>
            </div>
            <h1 className="font-display text-2xl font-extrabold text-[#111c29]">
              Operations Incident Log &amp; Trust Audit
            </h1>
          </div>

          {/* Quick KPI Strip */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white px-3.5 py-2 rounded-xl shadow-xs border border-slate-200 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FEF2F2] flex items-center justify-center text-[#DC2626]">
                <span className="material-symbols-outlined text-lg">report_problem</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#64748B] font-semibold">Open Reviews</span>
                <span className="font-display text-base font-extrabold text-[#111c29]">02</span>
              </div>
            </div>

            <div className="bg-white px-3.5 py-2 rounded-xl shadow-xs border border-slate-200 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] flex items-center justify-center text-[#D97706]">
                <span className="material-symbols-outlined text-lg">pending_actions</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#64748B] font-semibold">Under Audit</span>
                <span className="font-display text-base font-extrabold text-[#111c29]">01</span>
              </div>
            </div>

            <div className="bg-white px-3.5 py-2 rounded-xl shadow-xs border border-slate-200 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] flex items-center justify-center text-[#0F6E56]">
                <span className="material-symbols-outlined text-lg">verified</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#64748B] font-semibold">Resolved (24h)</span>
                <span className="font-display text-base font-extrabold text-[#111c29]">18</span>
              </div>
            </div>

            <button
              onClick={() => alert('Exporting incidents to CSV...')}
              className="bg-[#0F6E56] hover:bg-[#0B5240] text-white font-display text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Split Grid: Reports Table + Detail Inspector */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* Left Column: Reports Table */}
          <div className="xl:col-span-7 flex flex-col gap-3">
            {/* Filter Bar */}
            <div className="bg-white p-2 rounded-xl shadow-xs border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-display text-xs font-bold transition-all ${
                    filter === 'all'
                      ? 'bg-[#0F6E56] text-white'
                      : 'text-[#5A6578] hover:bg-slate-100'
                  }`}
                >
                  All Reports ({INCIDENTS.length})
                </button>
                <button
                  onClick={() => setFilter('toll')}
                  className={`px-3 py-1.5 rounded-lg font-display text-xs font-bold transition-all ${
                    filter === 'toll'
                      ? 'bg-[#0F6E56] text-white'
                      : 'text-[#5A6578] hover:bg-slate-100'
                  }`}
                >
                  Toll &amp; Detours
                </button>
                <button
                  onClick={() => setFilter('cold')}
                  className={`px-3 py-1.5 rounded-lg font-display text-xs font-bold transition-all ${
                    filter === 'cold'
                      ? 'bg-[#0F6E56] text-white'
                      : 'text-[#5A6578] hover:bg-slate-100'
                  }`}
                >
                  Cold-Chain
                </button>
              </div>
              <span className="text-[11px] text-[#64748B] font-semibold pr-2">Live Sync ✓</span>
            </div>

            {/* List */}
            <div className="space-y-2.5">
              {filteredIncidents.map((incident) => {
                const isSelected = selectedIncident.id === incident.id;
                const isResolved = isResolvedLocally.includes(incident.id);
                return (
                  <div
                    key={incident.id}
                    onClick={() => setSelectedIncident(incident)}
                    className={`p-4 rounded-2xl bg-white border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#0F6E56] ring-1 ring-[#0F6E56] shadow-md'
                        : 'border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                            incident.category === 'Cold Chain'
                              ? 'bg-[#EFF6FF] text-[#2563EB]'
                              : incident.category === 'Toll Surcharge'
                              ? 'bg-[#FEF3C7] text-[#D97706]'
                              : 'bg-[#FEF2F2] text-[#DC2626]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg">
                            {incident.category === 'Cold Chain'
                              ? 'ac_unit'
                              : incident.category === 'Toll Surcharge'
                              ? 'toll'
                              : 'report'}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display text-xs font-extrabold text-[#111c29]">
                              {incident.id}
                            </span>
                            <span className="text-[11px] text-[#64748B] font-mono">
                              • {incident.tripId}
                            </span>
                          </div>
                          <span className="font-display text-xs font-bold text-[#111c29]">
                            {incident.driverName}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <span
                          className={`px-2 py-0.5 rounded-full font-display text-[10px] font-bold ${
                            isResolved
                              ? 'bg-[#E6F4F1] text-[#0F6E56]'
                              : incident.status === 'Open Review'
                              ? 'bg-[#FEF2F2] text-[#DC2626]'
                              : incident.status === 'Under Audit'
                              ? 'bg-[#FEF3C7] text-[#D97706]'
                              : 'bg-[#E6F4F1] text-[#0F6E56]'
                          }`}
                        >
                          {isResolved ? 'Resolved' : incident.status}
                        </span>
                        <span className="text-[10px] text-[#64748B] mt-1">{incident.time}</span>
                      </div>
                    </div>

                    <p className="font-body text-xs text-[#5A6578] mt-2 line-clamp-2">
                      {incident.description}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs">
                      <span className="text-[#64748B] flex items-center gap-1 text-[11px]">
                        <span className="material-symbols-outlined text-sm">fmd_good</span>
                        {incident.location}
                      </span>
                      <span className="font-display font-extrabold text-[#111c29]">
                        {incident.amount}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Incident Detail Inspector */}
          <div className="xl:col-span-5 bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F6E56] text-xl">query_stats</span>
                <h3 className="font-display text-sm font-extrabold text-[#111c29]">
                  Incident Telematics Inspector
                </h3>
              </div>
              <span className="font-mono text-xs font-bold text-[#64748B]">
                {selectedIncident.id}
              </span>
            </div>

            {/* Selected Trip Details */}
            <div className="space-y-3">
              <div className="bg-[#F8F9FA] p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#64748B] uppercase font-bold">Assigned Carrier</span>
                  <span className="text-[#0F6E56] text-xs font-bold font-display">98/100 Trust</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-bold text-[#111c29]">
                    {selectedIncident.driverName}
                  </span>
                  <span className="text-xs text-[#5A6578] font-mono">{selectedIncident.driverPhone}</span>
                </div>
              </div>

              <div>
                <span className="font-display text-xs font-bold text-[#111c29] block mb-1">
                  Incident Summary &amp; GPS Telematics
                </span>
                <p className="text-xs text-[#5A6578] bg-[#F8F9FA] p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {selectedIncident.description}
                </p>
              </div>

              {/* Mock Map / Geofence Check */}
              <div className="relative w-full h-36 rounded-xl bg-[#0F172A] overflow-hidden border border-slate-700 flex items-center justify-center">
                <div className="absolute inset-0 opacity-50 bg-gradient-to-r from-emerald-900 to-slate-900"></div>
                <div className="relative z-10 flex flex-col items-center text-center p-3">
                  <span className="material-symbols-outlined text-emerald-400 text-2xl animate-pulse">
                    satellite_alt
                  </span>
                  <span className="font-display text-xs text-white font-bold mt-1">
                    FASTag Plazas Matched • 2 Sensors Active
                  </span>
                  <span className="text-[10px] text-slate-300">
                    Geofence deviation tolerance: 1.2 km within allowable corridor
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#E6F4F1] rounded-xl flex items-center justify-between text-xs">
                <span className="font-display text-[#0F6E56] font-bold">Trust Score Impact:</span>
                <span className="font-display text-[#0F6E56] font-bold">
                  {selectedIncident.trustImpact}
                </span>
              </div>
            </div>

            {/* Resolution Buttons */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleResolve(selectedIncident.id)}
                className="flex-1 py-2.5 bg-[#0F6E56] hover:bg-[#0B5240] text-white rounded-xl font-display text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>Approve Surcharge (₹650)</span>
              </button>
              <button
                onClick={() => handleResolve(selectedIncident.id)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#111c29] rounded-xl font-display text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">cancel</span>
                <span>Reject &amp; Penalize</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
