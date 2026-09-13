'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import DriverBottomNav from '@/components/driver/DriverBottomNav';
import { bookings } from '@/lib/api';

export interface LoadOffer {
  id: string;
  bookingId?: string;
  tripCode: string;
  isRealBooking?: boolean;
  consignor: {
    name: string;
    company: string;
    rating: number;
    tripsCompleted: number;
    verified: boolean;
    tier: string;
  };
  pickup: {
    hubName: string;
    address: string;
    city: string;
    status: string;
  };
  dropoff: {
    hubName: string;
    address: string;
    city: string;
    etaTarget: string;
  };
  route: {
    corridor: string;
    distanceKm: number;
    durationText: string;
  };
  financials: {
    fare: number;
    formattedFare: string;
    ratePerKm: number;
    tollIncluded: boolean;
    peakSurchargePercent: number;
    profitMarginPercent: number;
    profitRating: 'MAX' | 'HIGH' | 'STRONG';
    advancePayout: string;
  };
  cargo: {
    type: string;
    weightTons: number;
    vehicleRequired: string;
    badgeLabel: string;
    badgeColor: string;
    icon: string;
  };
  urgency: {
    label: string;
    color: string;
    tag: 'EXPRESS' | 'COLD_CHAIN' | 'HIGH_MARGIN' | 'BACKHAUL';
  };
  image: string;
}

const DEFAULT_LOAD_OFFERS: LoadOffer[] = [
  {
    id: 'load-1',
    tripCode: '#MH-JNP-4012',
    consignor: {
      name: 'Dr. Sameer Patil',
      company: 'Serum BioPharma ColdLogistics',
      rating: 4.95,
      tripsCompleted: 420,
      verified: true,
      tier: 'Diamond Shipper',
    },
    pickup: {
      hubName: 'Mumbai JNPT Port (Gate 2)',
      address: 'Nhava Sheva Coastal Freight Terminal',
      city: 'Navi Mumbai',
      status: 'Dock 4 Ready (Immediate Pass)',
    },
    dropoff: {
      hubName: 'Pune Chakan Cluster (Phase II)',
      address: 'MIDC Biotech Cold Warehouse, Chakan',
      city: 'Pune',
      etaTarget: 'Today 04:30 PM',
    },
    route: {
      corridor: 'Mumbai-Pune Expressway',
      distanceKm: 136,
      durationText: '3.2 hrs via Expy',
    },
    financials: {
      fare: 21800,
      formattedFare: '₹21,800',
      ratePerKm: 160.3,
      tollIncluded: true,
      peakSurchargePercent: 35,
      profitMarginPercent: 46,
      profitRating: 'MAX',
      advancePayout: '₹17,440 Instant UPI Advance',
    },
    cargo: {
      type: 'Pharma Cold Chain Vaccines (-20°C)',
      weightTons: 6.5,
      vehicleRequired: '32ft Multi-Axle Reefer',
      badgeLabel: 'Pharma GDP Compliant',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: 'ac_unit',
    },
    urgency: {
      label: 'अत्यधिक मुनाफ़ा • MAX PROFIT (+46% Margin)',
      color: 'bg-emerald-600 text-white',
      tag: 'COLD_CHAIN',
    },
    image:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'load-2',
    tripCode: '#MH-CKN-9842',
    consignor: {
      name: 'Rajesh Deshmukh',
      company: 'Tata AutoComp Systems Ltd',
      rating: 4.9,
      tripsCompleted: 310,
      verified: true,
      tier: 'Enterprise Shipper',
    },
    pickup: {
      hubName: 'Pune Chakan Hub (Gate 4)',
      address: 'MIDC Phase II, Kuruli, Chakan',
      city: 'Pune',
      status: 'Ready Now (Bay 12)',
    },
    dropoff: {
      hubName: 'Vapi Industrial Hub',
      address: 'GIDC Phase 1, Near Toll Plaza',
      city: 'Vapi',
      etaTarget: 'Tonight 10:30 PM',
    },
    route: {
      corridor: 'NH-48 Golden Quadrilateral',
      distanceKm: 188,
      durationText: '4.5 hrs via NH 48',
    },
    financials: {
      fare: 18500,
      formattedFare: '₹18,500',
      ratePerKm: 98.4,
      tollIncluded: true,
      peakSurchargePercent: 22,
      profitMarginPercent: 36,
      profitRating: 'HIGH',
      advancePayout: '₹14,800 Instant UPI Advance',
    },
    cargo: {
      type: 'Auto Engine Components & Castings',
      weightTons: 8.5,
      vehicleRequired: 'Open Body 32ft / Multi-Axle',
      badgeLabel: 'Auto OEM Priority',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: 'precision_manufacturing',
    },
    urgency: {
      label: 'तत्काल लोड • High Priority Dispatch',
      color: 'bg-[#DC2626] text-white',
      tag: 'EXPRESS',
    },
    image:
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'load-3',
    tripCode: '#DL-OKH-5521',
    consignor: {
      name: 'Anil Gupta',
      company: 'Reliance Retail Logistics Hub',
      rating: 4.85,
      tripsCompleted: 580,
      verified: true,
      tier: 'Gold Consignor',
    },
    pickup: {
      hubName: 'Okhla Industrial Area Phase III',
      address: 'Mathura Road Cargo Warehousing Bay',
      city: 'Delhi',
      status: 'Ready Now (Dock 8)',
    },
    dropoff: {
      hubName: 'Kundli Industrial Corridor',
      address: 'KMP Express Freight Terminal',
      city: 'Sonipat',
      etaTarget: 'Today 03:00 PM',
    },
    route: {
      corridor: 'NH-44 / Ring Road',
      distanceKm: 58,
      durationText: '1.8 hrs via Highway',
    },
    financials: {
      fare: 8400,
      formattedFare: '₹8,400',
      ratePerKm: 144.8,
      tollIncluded: true,
      peakSurchargePercent: 18,
      profitMarginPercent: 42,
      profitRating: 'MAX',
      advancePayout: '₹6,720 Instant UPI Advance',
    },
    cargo: {
      type: 'FMCG Packaged Goods & Pallets',
      weightTons: 4.2,
      vehicleRequired: '20ft Closed Container',
      badgeLabel: 'Quick 2-Hr Turnaround',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: 'inventory_2',
    },
    urgency: {
      label: 'त्वरित ट्रिप • Quick Regional Turnaround',
      color: 'bg-purple-600 text-white',
      tag: 'HIGH_MARGIN',
    },
    image:
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'load-4',
    tripCode: '#MH-BHI-7714',
    consignor: {
      name: 'Vikram Shinde',
      company: 'Mahindra Logistics Multi-Modal',
      rating: 4.8,
      tripsCompleted: 240,
      verified: true,
      tier: 'Verified Partner',
    },
    pickup: {
      hubName: 'Bhiwandi Logistics Park',
      address: 'Mankoli / Purna Mega Warehousing Zone',
      city: 'Thane',
      status: 'Scheduled 11:00 AM',
    },
    dropoff: {
      hubName: 'Nashik MIDC Satpur',
      address: 'Industrial Heavy Park Dock 3',
      city: 'Nashik',
      etaTarget: 'Today 06:00 PM',
    },
    route: {
      corridor: 'Samruddhi Mahamarg / NH-160',
      distanceKm: 142,
      durationText: '3.4 hrs via Expressway',
    },
    financials: {
      fare: 15200,
      formattedFare: '₹15,200',
      ratePerKm: 107.0,
      tollIncluded: true,
      peakSurchargePercent: 15,
      profitMarginPercent: 33,
      profitRating: 'STRONG',
      advancePayout: '₹12,160 Instant UPI Advance',
    },
    cargo: {
      type: 'Heavy Industrial Equipment & Spares',
      weightTons: 10.0,
      vehicleRequired: '32ft Multi-Axle / Trailer',
      badgeLabel: 'Heavy Machinery',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: 'forklift',
    },
    urgency: {
      label: 'खाली वापसी नहीं • Guaranteed Backhaul',
      color: 'bg-[#0F6E56] text-white',
      tag: 'BACKHAUL',
    },
    image:
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80',
  },
];

export default function DriverHomePage() {
  const router = useRouter();
  const { setLangModalOpen, getLangObj } = useLanguage();
  const currentLang = getLangObj();

  const [availableLoads, setAvailableLoads] = useState<LoadOffer[]>(DEFAULT_LOAD_OFFERS);
  const [selectedLoadId, setSelectedLoadId] = useState<string>('load-1');
  const [activeFilter, setActiveFilter] = useState<'all' | 'highest_margin' | 'express' | 'cold_chain'>('all');
  const [secondsLeft, setSecondsLeft] = useState(28);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const totalSeconds = 30;
  const circumference = 2 * Math.PI * 28; // ~175.92
  const strokeOffset = circumference - (secondsLeft / totalSeconds) * circumference;

  // Integrate live customer booking if created recently
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedPickup = localStorage.getItem('reload_pickup_address');
    const savedDrop = localStorage.getItem('reload_dropoff_address');
    const savedDist = localStorage.getItem('reload_distance_km');
    const savedBookingId = localStorage.getItem('latest_booking_id');

    if (savedPickup && savedDrop && savedDist && Number(savedDist) > 0) {
      const distKm = Number(savedDist);
      const estFare = Math.round(distKm * 96);
      const rateKm = 96.0;

      const liveCustomerLoad: LoadOffer = {
        id: 'live-customer-load',
        bookingId: savedBookingId || 'live-booking-' + Date.now(),
        tripCode: '#REQ-LIVE-' + Math.floor(1000 + Math.random() * 9000),
        isRealBooking: true,
        consignor: {
          name: 'Direct Shipper User',
          company: 'Verified Customer Booking',
          rating: 5.0,
          tripsCompleted: 3,
          verified: true,
          tier: 'Live Shipper Request',
        },
        pickup: {
          hubName: savedPickup.split(',')[0].trim(),
          address: savedPickup,
          city: savedPickup.includes('Pune') ? 'Pune' : 'Delhi NCR',
          status: 'Ready Now (Immediate Dispatch)',
        },
        dropoff: {
          hubName: savedDrop.split(',')[0].trim(),
          address: savedDrop,
          city: savedDrop.includes('Mumbai') ? 'Mumbai' : 'Highway Terminal',
          etaTarget: 'Today Express Delivery',
        },
        route: {
          corridor: localStorage.getItem('reload_corridor') || 'National Highway Express Corridor',
          distanceKm: distKm,
          durationText: localStorage.getItem('reload_duration_text') || `${Math.round(distKm / 42)} hrs approx`,
        },
        financials: {
          fare: estFare,
          formattedFare: `₹${estFare.toLocaleString('en-IN')}`,
          ratePerKm: rateKm,
          tollIncluded: true,
          peakSurchargePercent: 20,
          profitMarginPercent: 38,
          profitRating: 'HIGH',
          advancePayout: `₹${Math.round(estFare * 0.8).toLocaleString('en-IN')} Instant UPI Advance`,
        },
        cargo: {
          type: 'General Commercial Freight',
          weightTons: 8.5,
          vehicleRequired: localStorage.getItem('reload_selected_vehicle') || '32ft Multi-Axle Container',
          badgeLabel: 'Live Customer Match',
          badgeColor: 'bg-emerald-50 text-[#0F6E56] border-emerald-200',
          icon: 'local_shipping',
        },
        urgency: {
          label: '⚡ लाइव ग्राहक अनुरोध • Live Customer Request',
          color: 'bg-emerald-600 text-white',
          tag: 'EXPRESS',
        },
        image:
          'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80',
      };

      setAvailableLoads([liveCustomerLoad, ...DEFAULT_LOAD_OFFERS]);
      setSelectedLoadId('live-customer-load');
    }
  }, []);

  // Filter and sort loads based on driver preference
  const filteredLoads = useMemo(() => {
    let result = [...availableLoads];

    if (activeFilter === 'highest_margin') {
      result.sort((a, b) => b.financials.ratePerKm - a.financials.ratePerKm);
    } else if (activeFilter === 'express') {
      result = result.filter((l) => l.urgency.tag === 'EXPRESS');
    } else if (activeFilter === 'cold_chain') {
      result = result.filter((l) => l.urgency.tag === 'COLD_CHAIN');
    }

    return result;
  }, [availableLoads, activeFilter]);

  // Selected load details
  const activeLoad = useMemo(() => {
    return availableLoads.find((l) => l.id === selectedLoadId) || availableLoads[0];
  }, [availableLoads, selectedLoadId]);

  // Urgency countdown
  useEffect(() => {
    if (secondsLeft <= 0 || isRejected || isAccepting) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft, isRejected, isAccepting]);

  const handleSelectLoad = (load: LoadOffer) => {
    setSelectedLoadId(load.id);
    setIsRejected(false);
    setSecondsLeft(30);
  };

  const handleAcceptLoad = async (loadToAccept: LoadOffer) => {
    setIsAccepting(true);
    try {
      const targetBookingId = loadToAccept.bookingId || loadToAccept.id;
      localStorage.setItem('latest_booking_id', targetBookingId);
      localStorage.setItem('reload_pickup_address', loadToAccept.pickup.address);
      localStorage.setItem('reload_dropoff_address', loadToAccept.dropoff.address);
      localStorage.setItem('reload_distance_km', String(loadToAccept.route.distanceKm));
      localStorage.setItem('reload_consignor', loadToAccept.consignor.company);

      if (loadToAccept.isRealBooking && loadToAccept.bookingId) {
        await bookings.updateStatus(loadToAccept.bookingId, 'accepted');
      }
    } catch (err) {
      console.log('Status update error:', err);
    }

    setShowToast(true);
    setTimeout(() => {
      router.push(`/driver/navigation?booking_id=${loadToAccept.bookingId || loadToAccept.id}`);
    }, 1000);
  };

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const text = `${activeLoad.consignor.company} का लोड उपलब्ध है। ${activeLoad.pickup.hubName} से ${activeLoad.dropoff.hubName}। कुल किराया ${activeLoad.financials.formattedFare} है, प्रति किलोमीटर ₹${activeLoad.financials.ratePerKm} का शुद्ध मुनाफ़ा। तुरंत स्वीकार करें।`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.onend = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="bg-[#F8F9FA] font-body text-[#111c29] flex flex-col min-h-screen antialiased">
      {/* Top Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 pt-safe bg-[#0F6E56]/95 backdrop-blur-xl shadow-sm text-white">
        <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/driver/home" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-xl">local_shipping</span>
              </div>
              <span className="font-display text-lg text-white font-extrabold tracking-tight">ReLoad Driver</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-display font-semibold text-emerald-100">
              <Link href="/driver/home" className="px-3 py-1.5 rounded-lg bg-white/20 text-white font-bold">
                Bookings
              </Link>
              <Link href="/driver/navigation" className="px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                Navigation
              </Link>
              <Link href="/driver/handoff" className="px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                Handoff
              </Link>
              <Link href="/driver/forecast" className="px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                Forecast
              </Link>
              <Link href="/driver/trust-score" className="px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                Trust Score
              </Link>
              <Link href="/driver/profile" className="px-3 py-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors">
                Earnings & Profile
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setLangModalOpen(true)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white transition-colors"
              type="button"
            >
              <span className="text-xs">🌐</span>
              <span className="font-display text-[11px] font-bold">{currentLang.native}</span>
            </button>
            <span className="bg-emerald-800/80 text-emerald-100 text-[11px] font-display font-bold px-2.5 py-1 rounded-full border border-emerald-600/50 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              ONLINE
            </span>
            <Link
              href="/driver/profile"
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
            >
              <span className="material-symbols-outlined text-base">person</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full max-w-7xl mx-auto pt-20 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Marketplace Banner & Audio Announcement */}
        <div className="w-full mb-4 bg-gradient-to-r from-[#E6F4F1] via-white to-emerald-50 border border-[#0F6E56]/20 p-3 sm:p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#0F6E56] text-white flex items-center justify-center shrink-0 shadow-md">
              <span className="material-symbols-outlined text-2xl">compare_arrows</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-sm sm:text-base font-extrabold text-slate-900">
                  {filteredLoads.length} Available Shipper Loads • उपलब्ध लोड व बुकिंग्स
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[#0F6E56] text-[10px] font-bold border border-emerald-300">
                  Best Profit Selection
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Compare rates, routes &amp; profit margins. Select your preferred trip for maximum earnings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
            <button
              onClick={toggleAudio}
              className={`flex-1 sm:flex-initial flex items-center justify-center min-h-[40px] px-3.5 rounded-xl font-display text-xs font-bold active:scale-95 transition-all shadow-xs ${
                isPlayingAudio
                  ? 'bg-[#0F6E56] text-white'
                  : 'bg-white text-[#0F6E56] border border-emerald-300 hover:bg-emerald-50'
              }`}
            >
              <span className="material-symbols-outlined text-base mr-1.5">
                {isPlayingAudio ? 'pause' : 'volume_up'}
              </span>
              <span>{isPlayingAudio ? 'Pause Audio' : 'बोलकर सुनें (Audio)'}</span>
            </button>
          </div>
        </div>

        {/* Filter / Sort Preference Chips */}
        <div className="flex items-center gap-2 pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-bold shrink-0 transition-all ${
              activeFilter === 'all'
                ? 'bg-[#0F6E56] text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            🚀 All Loads ({availableLoads.length})
          </button>
          <button
            onClick={() => setActiveFilter('highest_margin')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-bold shrink-0 transition-all flex items-center gap-1.5 ${
              activeFilter === 'highest_margin'
                ? 'bg-[#0F6E56] text-white shadow-sm ring-2 ring-emerald-300'
                : 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            <span>💰 Highest Profit (₹/km)</span>
            <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded-full font-black">
              Top Yield
            </span>
          </button>
          <button
            onClick={() => setActiveFilter('express')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-bold shrink-0 transition-all ${
              activeFilter === 'express'
                ? 'bg-[#0F6E56] text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            ⚡ Express Ready Now
          </button>
          <button
            onClick={() => setActiveFilter('cold_chain')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-bold shrink-0 transition-all ${
              activeFilter === 'cold_chain'
                ? 'bg-[#0F6E56] text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            ❄️ Cold Chain (+35% Premium)
          </button>
        </div>

        {/* 2-Column Responsive Layout: Left List / Right Active Inspection Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: List of Available Load Requests */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase px-1">
              <span>Select Load to Inspect &amp; Accept</span>
              <span>Sorted by {activeFilter === 'highest_margin' ? 'Profit Margin' : 'Live Arrival'}</span>
            </div>

            <div className="space-y-3">
              {filteredLoads.map((load) => {
                const isSelected = load.id === activeLoad.id;

                return (
                  <div
                    key={load.id}
                    onClick={() => handleSelectLoad(load)}
                    className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer relative overflow-hidden shadow-xs hover:shadow-md ${
                      isSelected
                        ? 'border-[#0F6E56] ring-2 ring-[#0F6E56]/30 bg-gradient-to-br from-white to-[#E6F4F1]/30'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Top Tag & Trip Code */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${load.urgency.color}`}>
                          {load.urgency.tag}
                        </span>
                        <span className="font-display text-[11px] font-bold text-slate-400">
                          {load.tripCode}
                        </span>
                      </div>

                      {/* Profit Margin Badge */}
                      <div className="flex items-center gap-1 bg-emerald-50 text-[#0F6E56] px-2 py-0.5 rounded-md border border-emerald-200">
                        <span className="material-symbols-outlined text-xs">trending_up</span>
                        <span className="font-display text-xs font-black">
                          ₹{load.financials.ratePerKm}/km
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700">
                          ({load.financials.profitMarginPercent}% Margin)
                        </span>
                      </div>
                    </div>

                    {/* Consignor Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-display text-xs font-bold text-slate-900">
                            {load.consignor.company}
                          </span>
                          {load.consignor.verified && (
                            <span className="material-symbols-outlined text-[#0F6E56] text-xs">
                              verified
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500">
                          {load.consignor.tier} • {load.consignor.rating}★ ({load.consignor.tripsCompleted} trips)
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-display text-base font-black text-slate-900">
                          {load.financials.formattedFare}
                        </span>
                        <span className="block text-[9px] text-[#0F6E56] font-bold uppercase">
                          Guaranteed Net
                        </span>
                      </div>
                    </div>

                    {/* Route Micro-Summary */}
                    <div className="py-2.5 flex items-center justify-between text-xs">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                          <span className="font-bold text-slate-800 truncate">{load.pickup.city}</span>
                          <span className="text-slate-400 text-[10px]">({load.pickup.hubName.split('(')[0]})</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                          <span className="font-bold text-slate-800 truncate">{load.dropoff.city}</span>
                          <span className="text-slate-400 text-[10px]">({load.dropoff.hubName.split('(')[0]})</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 ml-2">
                        <span className="text-xs font-semibold text-slate-700">
                          {load.route.distanceKm} km
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          {load.route.durationText}
                        </span>
                      </div>
                    </div>

                    {/* Cargo & Action Footer */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-600 font-medium truncate flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-slate-400">{load.cargo.icon}</span>
                        <span>{load.cargo.type} ({load.cargo.weightTons}T)</span>
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptLoad(load);
                        }}
                        disabled={isAccepting}
                        className="px-3 py-1 bg-[#0F6E56] hover:bg-[#0B5240] text-white text-xs font-display font-bold rounded-lg shadow-xs active:scale-95 transition-all shrink-0 ml-2"
                      >
                        ✓ Accept
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Full Trip Inspection & Accept Console for Active Load */}
          <div className="lg:col-span-7 space-y-4">
            {!isRejected ? (
              <div className="w-full bg-white rounded-2xl shadow-xl border border-[#E2E8F0] overflow-hidden flex flex-col relative animate-fade-up">
                {/* Urgency & Margin Header */}
                <div className={`${activeLoad.urgency.color} px-4 py-2 flex items-center justify-between`}>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-lg animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>
                      priority_high
                    </span>
                    <span className="font-display text-xs font-bold tracking-wider uppercase">
                      {activeLoad.urgency.label}
                    </span>
                  </div>
                  <span className="font-display text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                    {activeLoad.urgency.tag}
                  </span>
                </div>

                {/* Warehouse Banner Photo & Radial Countdown */}
                <div className="relative w-full h-44 bg-slate-900 overflow-hidden">
                  <img
                    alt="Logistics warehouse loading dock"
                    className="w-full h-full object-cover"
                    src={activeLoad.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent flex items-end justify-between p-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 bg-[#E6F4F1]/95 backdrop-blur-sm px-2.5 py-1 rounded-full w-fit mb-1 border border-emerald-400/30">
                        <span className="w-2 h-2 rounded-full bg-[#0F6E56] animate-ping"></span>
                        <span className="font-display text-[11px] font-bold text-[#0F6E56]">
                          {activeLoad.consignor.company}
                        </span>
                      </div>
                      <p className="font-display text-xs font-semibold text-slate-200">
                        Trip ID: {activeLoad.tripCode} • {activeLoad.consignor.rating}★ Consignor
                      </p>
                    </div>

                    {/* 30s Countdown Ring */}
                    <div className="flex flex-col items-center shrink-0">
                      <div className="relative w-14 h-14 flex items-center justify-center bg-[#0F172A]/80 rounded-full shadow-lg backdrop-blur-md">
                        <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 64 64">
                          <circle
                            className="text-slate-600/40 fill-none"
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <circle
                            className="text-[#DC2626] fill-none transition-all duration-1000 ease-linear"
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeOffset}
                            strokeLinecap="round"
                            strokeWidth="4.5"
                          ></circle>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-display text-sm font-extrabold text-white">
                            {secondsLeft}s
                          </span>
                        </div>
                      </div>
                      <span className="font-display text-[10px] text-slate-300 mt-0.5">समय शेष</span>
                    </div>
                  </div>
                </div>

                {/* Fare & Profit Margin Breakdown */}
                <div className="p-4 bg-[#F8F9FA] border-b border-[#E2E8F0] flex flex-col">
                  <div className="flex items-baseline justify-between flex-wrap gap-2">
                    <div className="flex flex-col">
                      <span className="font-display text-[11px] font-bold text-[#5A6578] uppercase tracking-wider">
                        निश्चित किराया • GUARANTEED TOTAL FARE
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#111c29] tracking-tight">
                          {activeLoad.financials.formattedFare}
                        </span>
                        <span className="font-display text-xs text-[#0F6E56] bg-[#E6F4F1] px-2 py-0.5 rounded-md font-bold">
                          Toll Extra Incl.
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="font-display text-sm text-[#0F6E56] font-black bg-emerald-100/70 px-2.5 py-0.5 rounded-md">
                        Net ₹{activeLoad.financials.ratePerKm}/km ({activeLoad.financials.profitMarginPercent}% Net Margin)
                      </span>
                      <span className="font-display text-xs text-[#0F6E56] flex items-center gap-0.5 font-bold mt-1">
                        <span className="material-symbols-outlined text-sm">trending_up</span> +{activeLoad.financials.peakSurchargePercent}% Peak Surcharge
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 bg-[#E6F4F1] text-[#0F6E56] px-3 py-2 rounded-lg border border-[#0F6E56]/20">
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      bolt
                    </span>
                    <span className="font-display text-xs font-bold">
                      {activeLoad.financials.advancePayout} • (अनलोडिंग होते ही तुरंत शेष बैंक ट्रांसफर)
                    </span>
                  </div>
                </div>

                {/* Cargo Spec Pills */}
                <div className="px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-[#E2E8F0] bg-white">
                  <div className="flex items-center gap-1.5 bg-[#F1F5F9] text-[#111c29] px-3 py-1.5 rounded-lg shrink-0 text-xs font-semibold">
                    <span className="material-symbols-outlined text-base text-[#0F6E56]">{activeLoad.cargo.icon}</span>
                    <span>{activeLoad.cargo.type}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#F1F5F9] text-[#111c29] px-3 py-1.5 rounded-lg shrink-0 text-xs font-semibold">
                    <span className="material-symbols-outlined text-base text-[#0F6E56]">weight</span>
                    <span>{activeLoad.cargo.weightTons} Ton</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#F1F5F9] text-[#111c29] px-3 py-1.5 rounded-lg shrink-0 text-xs font-semibold">
                    <span className="material-symbols-outlined text-base text-[#0F6E56]">rv_hookup</span>
                    <span>{activeLoad.cargo.vehicleRequired}</span>
                  </div>
                </div>

                {/* Route Stepper */}
                <div className="p-4 bg-white space-y-4">
                  <div className="relative flex flex-col gap-4">
                    <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-[#CBD5E1]"></div>

                    {/* Pickup Waypoint */}
                    <div className="flex items-start gap-3 relative z-10">
                      <div className="w-8 h-8 rounded-full bg-[#0F6E56] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                          storefront
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-display text-xs text-[#0F6E56] font-bold uppercase tracking-wider">
                            उठाने का स्थान • PICKUP
                          </span>
                          <span className="font-display text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                            {activeLoad.pickup.status}
                          </span>
                        </div>
                        <p className="font-display text-sm text-[#111c29] font-bold truncate mt-0.5">
                          {activeLoad.pickup.hubName}
                        </p>
                        <p className="font-body text-xs text-[#5A6578] truncate">
                          {activeLoad.pickup.address}
                        </p>
                      </div>
                    </div>

                    {/* Distance pill */}
                    <div className="ml-11 flex items-center gap-2 py-1 px-3 bg-[#F1F5F9] rounded-lg w-fit text-xs font-semibold text-[#111c29]">
                      <span className="material-symbols-outlined text-sm text-[#0051d5]">alt_route</span>
                      <span>{activeLoad.route.distanceKm} km ({activeLoad.route.durationText})</span>
                    </div>

                    {/* Drop-off Waypoint */}
                    <div className="flex items-start gap-3 relative z-10">
                      <div className="w-8 h-8 rounded-full bg-[#D97706] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                          warehouse
                        </span>
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-display text-xs text-[#D97706] font-bold uppercase tracking-wider">
                            पहुंचाने का स्थान • DROP
                          </span>
                          <span className="font-display text-xs text-[#5A6578]">{activeLoad.dropoff.etaTarget}</span>
                        </div>
                        <p className="font-display text-sm text-[#111c29] font-bold truncate mt-0.5">
                          {activeLoad.dropoff.hubName}
                        </p>
                        <p className="font-body text-xs text-[#5A6578] truncate">
                          {activeLoad.dropoff.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="p-4 bg-[#F8F9FA] border-t border-[#E2E8F0] flex flex-col gap-2.5">
                  <button
                    onClick={() => handleAcceptLoad(activeLoad)}
                    disabled={isAccepting}
                    className="w-full h-14 min-h-[56px] bg-[#0F6E56] hover:bg-[#0B5240] active:scale-[0.98] text-white rounded-xl font-display text-base font-extrabold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                    type="button"
                  >
                    {isAccepting ? (
                      <>
                        <span className="material-symbols-outlined text-2xl animate-spin">refresh</span>
                        <span>लोड स्वीकृत हो रहा है... (Accepting Load...)</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                          check_circle
                        </span>
                        <span>✓ ACCEPT THIS LOAD • {activeLoad.financials.formattedFare} स्वीकार करें</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setIsRejected(true)}
                    className="w-full h-12 bg-white hover:bg-slate-100 text-[#64748B] border border-slate-200 rounded-xl font-display text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg">skip_next</span>
                    <span>पास करें व अन्य लोड देखें (Skip to Next Load)</span>
                  </button>

                  {showToast && (
                    <div className="w-full py-2.5 px-3 bg-[#0F6E56] text-white rounded-lg text-center font-display text-xs font-bold animate-fade-up">
                      {activeLoad.consignor.company} का लोड सफलतापूर्वक स्वीकृत! नेविगेशन खुल रहा है...
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full bg-white rounded-2xl p-6 text-center border border-slate-200 shadow-sm space-y-4 animate-fade-up">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-3xl">radar</span>
                </div>
                <h3 className="font-display text-base font-bold text-[#111c29]">Load Skipped</h3>
                <p className="text-xs text-[#5A6578]">Select another load from the left list to review its route &amp; profit margin.</p>
                <button
                  onClick={() => {
                    setIsRejected(false);
                    setSecondsLeft(30);
                  }}
                  className="px-4 py-2 bg-[#0F6E56] text-white rounded-lg font-display text-xs font-bold cursor-pointer"
                >
                  Reload Inspection Console
                </button>
              </div>
            )}

            {/* Shift Target & Fleet Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Daily Shift Target Card */}
              <div className="bg-white rounded-2xl p-4 border border-[#E2E8F0] shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] text-[#0F6E56] flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-lg">monetization_on</span>
                    </div>
                    <div>
                      <h4 className="font-display text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Earnings</h4>
                      <p className="font-display text-lg font-black text-slate-900">₹6,850 <span className="text-xs font-medium text-slate-400">/ ₹12,000</span></p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-md">57%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#0F6E56] h-full rounded-full w-[57%]"></div>
                </div>
              </div>

              {/* Trust & Diamond Captain Badge */}
              <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-400 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      military_tech
                    </span>
                    <div>
                      <p className="text-[10px] text-slate-400">Driver Badge</p>
                      <p className="font-display text-sm font-bold text-white">Diamond Captain 4.94★</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-400/20 text-amber-300 text-[11px] font-bold rounded-full border border-amber-400/30">
                    Tier 1
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-2">
                  Eligible for highest profit margin matching on NH-48 &amp; Expressway.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <DriverBottomNav />
    </div>
  );
}
