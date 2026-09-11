'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CustomerBottomNav from '@/components/customer/CustomerBottomNav';
import { bookings, getUserId } from '@/lib/api';

interface VehicleOption {
  id: string;
  name: string;
  hindiName: string;
  payload: string;
  eta: string;
  fare: string;
  baseFare: number;
  tollEstimate: number;
  gst: number;
  tag: string;
  tagColor: string;
  isReefer?: boolean;
  image: string;
}

const VEHICLES: VehicleOption[] = [
  {
    id: 'reefer-32',
    name: '32 FT Multi-Axle Reefer',
    hindiName: '32 फुट रेफ्रिजरेटेड ट्रक • 14 टन क्षमता',
    payload: '14 Ton Payload • Closed Box',
    eta: '18 mins to Dock',
    fare: '₹16,500',
    baseFare: 14200,
    tollEstimate: 950,
    gst: 1350,
    tag: 'Pharma IoT Temp (-18°C)',
    tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
    isReefer: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCVgSuMmUmyP7neujVMWFAnvyqaUKcPY99dtOxuPkr3WALMYKY3texBlEHxeZIWmiSuYIa0IF64W_vxtOXWAeRbu1-R5fCitrw9UgDVqLKEU8RagQAGfHnD08YQLZqV2-CNmNGYMr_inY5diyIVCFTiuzoTXNT1F-kbRDygSNvmgDiWayD-R-vKb73eCU7lUqL84v9gISz2BfegN7o2aOpHlCI3VzLw_QTzoj9VbootT4O_dQv78q3xGA',
  },
  {
    id: 'container-20',
    name: '20 FT Closed Container',
    hindiName: '20 फुट बंद कंटेनर • 8.5 टन क्षमता',
    payload: '8.5 Ton Payload • Dry Cargo',
    eta: '24 mins to Dock',
    fare: '₹9,800',
    baseFare: 8400,
    tollEstimate: 600,
    gst: 800,
    tag: '100% Weatherproof',
    tagColor: 'bg-emerald-50 text-[#0F6E56] border-emerald-200',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCFr5KPNiM5UIwOF_NGXxreAEZcUpmk3z-PFvc3rbV01v1o9WKs786qU-wxN2Lyi6PgipGbaxHCHwY3VM2Cd0cOBhaabjzV6vWus14P0eCii5zYVQDkmJWfH0CfALJgC3K1YTesSAp1CpnxDAhpgg6KyM1P611x8aUBYpt-0WW1GnmT3QLH_62E2ATJuCVCJrnYuicjB-Hk3Fg0km51I_6l1sQ8bV7tVoYjAcIFWM1pT708ltBqnAuT3w',
  },
  {
    id: 'bolero-14',
    name: '14 FT Bolero Open Deck',
    hindiName: '14 फुट बोलेरो पिकअप • 3.5 टन',
    payload: '3.5 Ton Payload • Open Body',
    eta: '12 mins to Dock',
    fare: '₹5,200',
    baseFare: 4400,
    tollEstimate: 400,
    gst: 400,
    tag: 'Quick City Express',
    tagColor: 'bg-slate-100 text-slate-700 border-slate-200',
    image:
      'https://lh3.googleusercontent.com/aida/AEtjO1UXoYK0a4cuXNBoZV8zC8FrZuZ-VmhrMLOAvUkGPkCpxoo2C40A5f7p8-2zAl-sYe6DyT6Q3QYe4gdDanfTOVCjxyxTFmcjcyem5XB2n_EW1W779rrUSRRo4C_gldIrawt0zrPKOcLqCT7zJv5lkeBiARdfwOXxNtlS5-I5lOUP8D2CMy2GkK5cUle4V1IXibOG8W0_kuA-kXZ1K3aGYy0cJI_ImY_xo06gfK-bg1eAZn4iiNBUCK_hZkKj',
  },
];

export default function CustomerVehiclesPage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState('reefer-32');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const selectedVehicle = VEHICLES.find((v) => v.id === selectedId) || VEHICLES[0];

  const handleBook = async () => {
    setIsBooking(true);
    setBookingError('');
    try {
      const typeMapping: Record<string, string> = {
        'reefer-32': 'cold_chain_van',
        'container-20': 'truck',
        'bolero-14': 'pickup_14ft',
      };
      const vType = typeMapping[selectedId] || 'cold_chain_van';
      const customerId = getUserId() || '44477809-b0d1-455b-881f-600d09d974ce';

      const payload = {
        customer_id: customerId,
        pickup_address: 'Mumbai Port (Nhava Sheva Gate 2)',
        pickup_lat: 18.9499,
        pickup_lng: 72.9515,
        dropoff_address: 'Pune Chakan MIDC Industrial Hub Phase II',
        dropoff_lat: 18.7606,
        dropoff_lng: 73.8636,
        cargo_category: selectedVehicle.isReefer ? 'cold_chain' : 'general',
        vehicle_type: vType,
      };

      const res = (await bookings.create(payload)) as { id?: string };
      if (res?.id) {
        localStorage.setItem('latest_booking_id', res.id);
      }
      router.push('/customer/tracking');
    } catch (err: unknown) {
      setBookingError(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="bg-[#F8F9FA] font-body text-[#1A202C] antialiased min-h-screen selection:bg-[#E6F4F1] selection:text-[#0F6E56] flex flex-col">
      {/* Top Header */}
      <header className="bg-[#0F6E56] text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link href="/customer/home" className="flex items-center space-x-2.5">
            <span className="material-symbols-outlined text-white text-xl">arrow_back</span>
            <span className="font-display font-extrabold text-base text-white">
              Available Verified Fleet (3)
            </span>
          </Link>
          <div className="flex items-center space-x-2 bg-black/20 px-3 py-1.5 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-100">15m Guaranteed Fare Lock</span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Corridor Summary & Vehicles List */}
          <div className="lg:col-span-8 space-y-4">
            {/* Corridor Header Card */}
            <section className="bg-gradient-to-br from-[#12222B] to-[#1E3342] rounded-2xl p-5 text-white relative overflow-hidden shadow-sm">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10">
                <div className="flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-300 font-display text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>4 Trucks Ready Nearby (Nhava Sheva Cluster)</span>
                </div>
                <div className="text-slate-300 text-[11px] font-mono">
                  Corridor: <span className="text-white font-bold">#MH-12-EXPR</span>
                </div>
              </div>

              <div className="mt-3 relative pl-5 space-y-2 text-xs">
                <div className="absolute left-[5px] top-1 bottom-1 w-[2px] bg-slate-600 border-l border-dashed border-emerald-300"></div>

                {/* Origin */}
                <div>
                  <p className="font-display font-bold text-sm text-white">Mumbai Port (Nhava Sheva Gate 2)</p>
                  <p className="text-slate-300 text-[11px]">मुंबई पोर्ट • 08:00 Dedicated Dock Window</p>
                </div>

                {/* Destination */}
                <div>
                  <p className="font-display font-bold text-sm text-white">Pune Chakan MIDC Industrial Hub Phase II</p>
                  <p className="text-emerald-300 font-bold text-[11px]">142 km (~3.8h via Expressway)</p>
                </div>
              </div>
            </section>

            {/* Quick Trust Badges */}
            <section className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center space-y-1">
                <span className="material-symbols-outlined text-[#0F6E56] text-xl">verified</span>
                <p className="font-display font-bold text-[11px] text-slate-800">100% VAHAN</p>
                <span className="text-[10px] text-slate-500">Government Verified</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center space-y-1">
                <span className="material-symbols-outlined text-[#2563EB] text-xl">ac_unit</span>
                <p className="font-display font-bold text-[11px] text-slate-800">IoT Cold Chain</p>
                <span className="text-[10px] text-slate-500">Live Temperature Log</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center space-y-1">
                <span className="material-symbols-outlined text-teal-700 text-xl">contactless</span>
                <p className="font-display font-bold text-[11px] text-slate-800">FASTag Auto-Pay</p>
                <span className="text-[10px] text-slate-500">Zero Toll Stoppage</span>
              </div>
            </section>

            {/* Vehicle Selection List (Grid on md/lg) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
              {VEHICLES.map((v) => {
                const isSelected = selectedId === v.id;
                return (
                  <article
                    key={v.id}
                    onClick={() => setSelectedId(v.id)}
                    className={`bg-white rounded-2xl p-4 border-2 shadow-xs relative cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#0F6E56] ring-1 ring-[#0F6E56] shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`inline-flex items-center text-[10px] font-display font-bold px-2.5 py-0.5 rounded-full border ${v.tagColor}`}
                      >
                        {v.tag}
                      </span>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-[#0F6E56] text-white' : 'border-2 border-slate-300'
                        }`}
                      >
                        {isSelected && (
                          <span className="material-symbols-outlined text-sm font-bold">check</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3.5">
                      <img
                        src={v.image}
                        alt={v.name}
                        className="w-24 h-16 rounded-xl object-cover border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-slate-900 text-sm truncate">{v.name}</h3>
                        <p className="font-body text-xs text-slate-500 truncate">{v.hindiName}</p>
                        <div className="mt-1 flex items-center text-xs font-display font-semibold text-[#0F6E56]">
                          <span className="material-symbols-outlined text-sm mr-1">schedule</span>
                          <span>{v.eta}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-[#2563EB] font-display font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">telemetry</span>
                        OBD-II Realtime Telematics
                      </span>
                      <div className="text-right">
                        <span className="font-display text-lg font-extrabold text-[#111c29]">
                          {v.fare}
                        </span>
                        <span className="text-[10px] text-[#64748B] block font-semibold">Locked All-Inclusive</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Right Column (Desktop Dashboard Sidecar): Fare Transparency & Booking Action */}
          <div className="lg:col-span-4 space-y-4">
            {/* Locked Fare Transparency Breakdown Card */}
            <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0F6E56] text-xl">lock</span>
                  <h4 className="font-display text-sm font-extrabold text-[#111827]">
                    15-Min Guaranteed Price Lock
                  </h4>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-base">
                  {showBreakdown ? 'expand_less' : 'expand_more'}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs space-y-2 font-display">
                <div className="flex justify-between text-slate-600">
                  <span>Selected Vehicle:</span>
                  <span className="font-bold text-slate-900">{selectedVehicle.name}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Base Freight (142 km):</span>
                  <span>₹{selectedVehicle.baseFare}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Tolls (FASTag):</span>
                  <span>₹{selectedVehicle.tollEstimate}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Applicable GST (5% Freight):</span>
                  <span>₹{selectedVehicle.gst}</span>
                </div>
                <div className="flex justify-between font-bold text-[#111827] pt-2 border-t border-slate-100 text-sm">
                  <span>Total Payable:</span>
                  <span className="text-[#0F6E56] font-black text-lg">{selectedVehicle.fare}</span>
                </div>
              </div>

              <p className="text-[11px] text-[#5A6578] pt-1">
                ₹0 Hidden Surcharges • Automatic FASTag expressway toll clearance included.
              </p>

              {/* Primary Lock CTA */}
              <div className="pt-2">
                <button
                  onClick={handleBook}
                  disabled={isBooking}
                  className="w-full h-14 min-h-[56px] bg-[#0F6E56] hover:bg-[#0B5240] disabled:opacity-60 text-white rounded-xl font-display text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg active:scale-[0.99] transition-all"
                  type="button"
                >
                  <span className="material-symbols-outlined text-xl">verified</span>
                  <span>{isBooking ? 'Dispatching & Saving to Database...' : `Confirm & Dispatch Truck (${selectedVehicle.fare})`}</span>
                </button>
                {bookingError && <p className="text-red-600 text-xs text-center font-bold mt-2">{bookingError}</p>}
              </div>

              <div className="text-center pt-1">
                <span className="text-[11px] text-slate-500 font-medium">
                  Driver assigned within 90 seconds of confirmation
                </span>
              </div>
            </section>
          </div>
        </div>
      </main>

      <CustomerBottomNav activeTab="vehicles" />
    </div>
  );
}
