'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

interface DriverItem {
  id: string;
  name: string;
  phone: string;
  truckNo: string;
  truckType: string;
  trustScore: number;
  ulipStatus: 'Verified' | 'Pending Audit' | 'Locked' | 'Warning';
  fitnessExp: string;
  tripsCompleted: number;
  avatar: string;
}

const DRIVERS: DriverItem[] = [
  {
    id: 'DRV-1082',
    name: 'Gurpreet Singh',
    phone: '+91 98230 ••••42',
    truckNo: 'MH-12-RN-8821',
    truckType: '32 Ft Multi-Axle Reefer',
    trustScore: 98,
    ulipStatus: 'Verified',
    fitnessExp: 'Nov 2026',
    tripsCompleted: 142,
    avatar:
      'https://lh3.googleusercontent.com/aida/AEtjO1VikpgIL6PbWrgzNeJ69WEF1bg2Xzo96NNq01pi3dmwJg3mnGS5WQUMj5IYjWaWUjwQsQ0fa-Qd6HOWHrFcO-wL8Wdn5ocW2Vn6Gc8VsWSkSpE3U1mEFb-4Z89rtFX-xLCX1XbR_6D2bApOxZQqEZ2Jkt3knsMh2kGnZzi9Ju9j_H6eAuMSWKS3JrSnsJdSOyT4u0_btuw8UtetrALLPsA2othW0bRnDlBL2QvvvkVUR7jMfMfQgQuRFVA',
  },
  {
    id: 'DRV-1083',
    name: 'Rajesh Kumar Verma',
    phone: '+91 98210 ••••77',
    truckNo: 'MH-14-AZ-4410',
    truckType: '24 Ft Container Flatbed',
    trustScore: 94,
    ulipStatus: 'Warning',
    fitnessExp: 'In 3 Days',
    tripsCompleted: 88,
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDRxwPqKiKxJfKuAh1JUaW8qW-c2ETMAPjJ_ERPQ9cBQu5FBndlkNeDcB-hPPPxnIIdJbvgpqWrWPrmPVYwI1Re5ZeJ-b253YxivQyO88ZgDpbn9hM-jr9d0cwmiJICqXiV4ckSt5Ew5mGbATdJn9cfIBFulQuHNbOQ_4whW6inceox0ucmAk21k4H9_81K4jjU7J0hPxhBAboHq9x7zanULwB5aDdvG7fDgpdS2U3_FewYPFYfC2UWDw',
  },
  {
    id: 'DRV-1084',
    name: 'Vikramjit Roy',
    phone: '+91 97720 ••••99',
    truckNo: 'GJ-06-TT-9012',
    truckType: '16T Closed Body Cargo',
    trustScore: 78,
    ulipStatus: 'Locked',
    fitnessExp: 'Expired Yesterday',
    tripsCompleted: 54,
    avatar:
      'https://lh3.googleusercontent.com/aida/AEtjO1UXoYK0a4cuXNBoZV8zC8FrZuZ-VmhrMLOAvUkGPkCpxoo2C40A5f7p8-2zAl-sYe6DyT6Q3QYe4gdDanfTOVCjxyxTFmcjcyem5XB2n_EW1W779rrUSRRo4C_gldIrawt0zrPKOcLqCT7zJv5lkeBiARdfwOXxNtlS5-I5lOUP8D2CMy2GkK5cUle4V1IXibOG8W0_kuA-kXZ1K3aGYy0cJI_ImY_xo06gfK-bg1eAZn4iiNBUCK_hZkKj',
  },
  {
    id: 'DRV-1085',
    name: 'Balwinder Singh',
    phone: '+91 94120 ••••55',
    truckNo: 'PB-10-CK-3108',
    truckType: '40 Ft Heavy Hauler',
    trustScore: 99,
    ulipStatus: 'Verified',
    fitnessExp: 'Oct 2027',
    tripsCompleted: 210,
    avatar:
      'https://lh3.googleusercontent.com/aida/AEtjO1VikpgIL6PbWrgzNeJ69WEF1bg2Xzo96NNq01pi3dmwJg3mnGS5WQUMj5IYjWaWUjwQsQ0fa-Qd6HOWHrFcO-wL8Wdn5ocW2Vn6Gc8VsWSkSpE3U1mEFb-4Z89rtFX-xLCX1XbR_6D2bApOxZQqEZ2Jkt3knsMh2kGnZzi9Ju9j_H6eAuMSWKS3JrSnsJdSOyT4u0_btuw8UtetrALLPsA2othW0bRnDlBL2QvvvkVUR7jMfMfQgQuRFVA',
  },
];

export default function AdminDriversPage() {
  const [selectedDriver, setSelectedDriver] = useState<DriverItem | null>(DRIVERS[0]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = DRIVERS.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.truckNo.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (statusFilter === 'verified') return d.ulipStatus === 'Verified';
    if (statusFilter === 'locked') return d.ulipStatus === 'Locked';
    if (statusFilter === 'warning') return d.ulipStatus === 'Warning';
    return true;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 w-full">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xs text-[#64748B] uppercase font-bold tracking-wider">
                Fleet Operations
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#0F6E56]"></span>
              <span className="font-display text-xs text-[#0F6E56] font-bold uppercase tracking-wider">
                Live Driver Registry
              </span>
            </div>
            <h1 className="font-display text-2xl font-extrabold text-[#111c29] mt-1">
              Master Drivers Verification &amp; Safety Grid
            </h1>
            <p className="font-body text-xs text-[#5A6578]">
              Real-time ULIP Sarathi/Vahan cross-checks, fitness expiry timers, and telematics audits.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => alert('Broadcasting push alert to 1,420 drivers...')}
              className="px-4 py-2.5 bg-[#0F6E56] hover:bg-[#0B5240] text-white rounded-xl font-display text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-base">cell_tower</span>
              <span>Push Safety Broadcast</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">
                Registered Drivers
              </span>
              <span className="font-display text-2xl font-extrabold text-[#111c29] block mt-0.5">
                1,420
              </span>
              <span className="text-[10px] text-[#0F6E56] font-bold">98.2% Active on Routes</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#E6F4F1] text-[#0F6E56] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">groups</span>
            </div>
          </div>

          <div className="bg-[#FEF2F2] p-4 rounded-2xl shadow-xs border border-red-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#DC2626] uppercase font-bold tracking-wider">
                Critical Alerts
              </span>
              <span className="font-display text-2xl font-extrabold text-[#DC2626] block mt-0.5">
                09
              </span>
              <span className="text-[10px] text-[#DC2626] font-bold">Immediate Lock</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-100 text-[#DC2626] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">gpp_maybe</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">
                Form 38 / RC Expiries
              </span>
              <span className="font-display text-2xl font-extrabold text-[#D97706] block mt-0.5">
                04
              </span>
              <span className="text-[10px] text-[#D97706] font-bold">3 Overdue • 1 Next 48h</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">event_busy</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#64748B] uppercase font-bold tracking-wider">
                Cold-Chain Audits
              </span>
              <span className="font-display text-2xl font-extrabold text-[#2563EB] block mt-0.5">
                46
              </span>
              <span className="text-[10px] text-[#2563EB] font-bold">100% SLA Maintained</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl">ac_unit</span>
            </div>
          </div>
        </div>

        {/* Driver Fleet Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
          {/* Table Header / Search */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <span className="material-symbols-outlined text-slate-400 text-lg absolute left-3 top-2.5">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search driver name, truck no, or ID..."
                className="w-full h-9 pl-9 pr-3 bg-[#F8F9FA] border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#0F6E56]"
              />
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold ${
                  statusFilter === 'all'
                    ? 'bg-[#0F6E56] text-white'
                    : 'text-[#5A6578] hover:bg-slate-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('verified')}
                className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold ${
                  statusFilter === 'verified'
                    ? 'bg-[#0F6E56] text-white'
                    : 'text-[#5A6578] hover:bg-slate-100'
                }`}
              >
                Verified
              </button>
              <button
                onClick={() => setStatusFilter('warning')}
                className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold ${
                  statusFilter === 'warning'
                    ? 'bg-[#0F6E56] text-white'
                    : 'text-[#5A6578] hover:bg-slate-100'
                }`}
              >
                Warning
              </button>
              <button
                onClick={() => setStatusFilter('locked')}
                className={`px-3 py-1.5 rounded-lg text-xs font-display font-bold ${
                  statusFilter === 'locked'
                    ? 'bg-[#DC2626] text-white'
                    : 'text-[#5A6578] hover:bg-slate-100'
                }`}
              >
                Locked
              </button>
            </div>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FA] text-[#64748B] font-display font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Driver Profile</th>
                  <th className="py-3 px-4">Vehicle &amp; Type</th>
                  <th className="py-3 px-4">ULIP Status</th>
                  <th className="py-3 px-4">Fitness Expiry</th>
                  <th className="py-3 px-4">Trust Score</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((driver) => (
                  <tr
                    key={driver.id}
                    onClick={() => setSelectedDriver(driver)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={driver.avatar}
                          alt={driver.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-display font-bold text-[#111c29] block">
                            {driver.name}
                          </span>
                          <span className="text-[10px] text-[#64748B] font-mono">
                            {driver.id} • {driver.phone}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-[#111c29] block">{driver.truckNo}</span>
                      <span className="text-[10px] text-[#5A6578]">{driver.truckType}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-display text-[10px] font-bold ${
                          driver.ulipStatus === 'Verified'
                            ? 'bg-[#E6F4F1] text-[#0F6E56]'
                            : driver.ulipStatus === 'Locked'
                            ? 'bg-[#FEF2F2] text-[#DC2626]'
                            : 'bg-[#FEF3C7] text-[#D97706]'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {driver.ulipStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold ${
                          driver.fitnessExp.includes('Expired')
                            ? 'text-red-600 font-bold'
                            : driver.fitnessExp.includes('Days')
                            ? 'text-amber-600 font-bold'
                            : 'text-[#111c29]'
                        }`}
                      >
                        {driver.fitnessExp}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-display font-extrabold text-sm text-[#0F6E56]">
                        <span className="material-symbols-outlined text-amber-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                        <span>{driver.trustScore}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDriver(driver);
                        }}
                        className="px-2.5 py-1 bg-[#F1F5F9] hover:bg-slate-200 text-[#111c29] rounded-lg font-display text-[11px] font-bold"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Driver Inspection Drawer Modal */}
        {selectedDriver && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E2E8F0] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDriver.avatar}
                  alt={selectedDriver.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h3 className="font-display text-base font-extrabold text-[#111c29]">
                    {selectedDriver.name} ({selectedDriver.id})
                  </h3>
                  <p className="text-xs text-[#5A6578]">
                    {selectedDriver.truckNo} • {selectedDriver.truckType}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`ULIP compliance certificate re-verified for ${selectedDriver.name}`)}
                  className="px-3 py-1.5 bg-[#0F6E56] text-white rounded-xl font-display text-xs font-bold"
                >
                  Verify Sarathi E-KYC
                </button>
                <button
                  onClick={() => setSelectedDriver(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#F8F9FA] rounded-xl border border-slate-100">
                <span className="text-[#64748B] block font-semibold">Total Completed Runs</span>
                <span className="font-display text-lg font-extrabold text-[#111c29]">
                  {selectedDriver.tripsCompleted} Trips
                </span>
              </div>
              <div className="p-3 bg-[#F8F9FA] rounded-xl border border-slate-100">
                <span className="text-[#64748B] block font-semibold">National Permit Status</span>
                <span className="font-display text-lg font-extrabold text-[#0F6E56]">
                  28 States Authorized
                </span>
              </div>
              <div className="p-3 bg-[#F8F9FA] rounded-xl border border-slate-100">
                <span className="text-[#64748B] block font-semibold">FASTag Auto-Debit</span>
                <span className="font-display text-lg font-extrabold text-[#2563EB]">
                  Active (₹4,850)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
