'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CustomerBottomNav from '@/components/customer/CustomerBottomNav';
import { useLanguage } from '@/context/LanguageContext';
import {
  calculateRouteEstimate,
  calculateVehicleFares,
  getPlaceSuggestions,
  PlaceSuggestion,
} from '@/lib/locationService';

export default function CustomerHomePage() {
  const router = useRouter();
  const { setLangModalOpen, getLangObj } = useLanguage();
  const currentLang = getLangObj();

  const [pickup, setPickup] = useState('Mumbai Port (Nhava Sheva Gate 2)');
  const [destination, setDestination] = useState('Pune Industrial Cluster, Chakan Phase II');
  const [isColdChain, setIsColdChain] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState('reefer-32');
  const [activeDropdown, setActiveDropdown] = useState<'pickup' | 'destination' | null>(null);

  const pickupContainerRef = useRef<HTMLDivElement>(null);
  const destinationContainerRef = useRef<HTMLDivElement>(null);

  // Load saved route from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPickup = localStorage.getItem('reload_pickup_address');
      const savedDest = localStorage.getItem('reload_dropoff_address');
      if (savedPickup) setPickup(savedPickup);
      if (savedDest) setDestination(savedDest);
    }
  }, []);

  // Compute live route distance, duration, and corridor
  const routeEstimate = useMemo(() => {
    return calculateRouteEstimate(pickup, destination);
  }, [pickup, destination]);

  // Compute dynamic vehicle fares based on current distance and cold-chain setting
  const dynamicFares = useMemo(() => {
    return calculateVehicleFares(routeEstimate.distanceKm, isColdChain);
  }, [routeEstimate.distanceKm, isColdChain]);

  // Dynamic suggestions matching user keystrokes / spelling
  const pickupSuggestions = useMemo(() => {
    return getPlaceSuggestions(pickup, 6);
  }, [pickup]);

  const destinationSuggestions = useMemo(() => {
    return getPlaceSuggestions(destination, 6);
  }, [destination]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        activeDropdown === 'pickup' &&
        pickupContainerRef.current &&
        !pickupContainerRef.current.contains(target)
      ) {
        setActiveDropdown(null);
      }
      if (
        activeDropdown === 'destination' &&
        destinationContainerRef.current &&
        !destinationContainerRef.current.contains(target)
      ) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  const isValidRoute = routeEstimate.isValid;

  const swapLocations = () => {
    const temp = pickup;
    setPickup(destination);
    setDestination(temp);
    setActiveDropdown(null);
  };

  const renderHighlightedText = (
    text: string,
    query: string,
    highlightClass = 'text-[#0F6E56] bg-emerald-100 font-bold px-0.5 rounded'
  ) => {
    const trimmed = query.trim();
    if (!trimmed) return <span>{text}</span>;
    const lowerText = text.toLowerCase();
    const lowerQuery = trimmed.toLowerCase();
    const idx = lowerText.indexOf(lowerQuery);
    if (idx === -1) return <span>{text}</span>;
    return (
      <span>
        {text.slice(0, idx)}
        <span className={highlightClass}>
          {text.slice(idx, idx + trimmed.length)}
        </span>
        {text.slice(idx + trimmed.length)}
      </span>
    );
  };

  const handleProceed = () => {
    if (!isValidRoute) return;

    if (typeof window !== 'undefined') {
      localStorage.setItem('reload_pickup_address', pickup);
      localStorage.setItem('reload_dropoff_address', destination);
      localStorage.setItem('reload_distance_km', String(routeEstimate.distanceKm));
      localStorage.setItem('reload_duration_text', routeEstimate.durationText);
      localStorage.setItem('reload_corridor', routeEstimate.corridor);
      localStorage.setItem('reload_pickup_lat', String(routeEstimate.pickupCoords.lat));
      localStorage.setItem('reload_pickup_lng', String(routeEstimate.pickupCoords.lng));
      localStorage.setItem('reload_dropoff_lat', String(routeEstimate.dropoffCoords.lat));
      localStorage.setItem('reload_dropoff_lng', String(routeEstimate.dropoffCoords.lng));
      localStorage.setItem('reload_is_cold_chain', String(isColdChain));
      localStorage.setItem('reload_selected_vehicle', selectedVehicle);
    }
    router.push('/customer/vehicles');
  };

  const vehiclePricing = {
    'reefer-32': {
      name: '32 Ft Multi-Axle Container',
      fare: isValidRoute ? dynamicFares['reefer-32']?.formattedFare || '₹16,500' : '—',
      payload: '14 Ton Payload • GPS Lock',
    },
    'container-20': {
      name: '20 Ft Closed Container',
      fare: isValidRoute ? dynamicFares['container-20']?.formattedFare || '₹9,800' : '—',
      payload: '8.5 Ton Payload • Dry Cargo',
    },
    'bolero-14': {
      name: '14 Ft Bolero Pickup',
      fare: isValidRoute ? dynamicFares['bolero-14']?.formattedFare || '₹5,200' : '—',
      payload: '3.5 Ton Payload • Open Body',
    },
    'tata-ace': {
      name: 'Tata Ace Mini Truck',
      fare: isValidRoute ? dynamicFares['tata-ace']?.formattedFare || '₹2,800' : '—',
      payload: '1.2 Ton Payload • City Express',
    },
  }[selectedVehicle] || {
    name: '32 Ft Multi-Axle Container',
    fare: isValidRoute ? dynamicFares['reefer-32']?.formattedFare || '₹16,500' : '—',
    payload: '14 Ton Payload',
  };

  return (
    <div className="bg-[#F8F9FA] font-body text-[#111827] antialiased min-h-screen selection:bg-[#E6F4F1] selection:text-[#0F6E56] flex flex-col">
      {/* Top Responsive Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/landing" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0F6E56] flex items-center justify-center text-white font-bold text-sm shadow-xs ring-2 ring-emerald-100">
              <svg className="w-5 h-5 text-white stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-xl font-black tracking-tight text-neutral-900">ReLoad</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F6E56] ml-1"></span>
              </div>
              <div className="text-[10px] font-bold text-[#0F6E56] leading-none uppercase tracking-wider">
                Shipper Portal
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3 text-xs font-display font-semibold text-slate-600">
            <Link href="/customer/home" className="px-3 py-1.5 rounded-lg bg-[#E6F4F1] text-[#0F6E56] font-bold">
              Book Freight
            </Link>
            <Link href="/customer/vehicles" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">
              Fleet &amp; Rates
            </Link>
            <Link href="/customer/tracking" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">
              Live Track
            </Link>
            <Link href="/customer/bookings" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">
              My Orders
            </Link>
            <Link href="/customer/support" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors">
              Support 24/7
            </Link>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setLangModalOpen(true)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              type="button"
            >
              <span className="text-xs">🌐</span>
              <span className="font-display text-[11px] font-bold">{currentLang.native}</span>
            </button>
            <Link
              href="/customer/profile"
              className="w-9 h-9 rounded-full bg-[#0B5240] flex items-center justify-center text-white shadow-xs hover:bg-[#0F6E56] transition-colors"
            >
              <span className="material-symbols-outlined text-lg">person</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container - Full-width on mobile, 2-column grid on desktop */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Route, Cargo & Vehicle Selection */}
          <div className="lg:col-span-7 space-y-4">
            {/* Live Presence Bar */}
            <section className="flex items-center justify-between gap-2">
              <div className="flex-1 flex items-center bg-white px-3.5 py-2 rounded-full border border-gray-200 shadow-xs text-xs font-medium text-slate-800">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse mr-2 flex-shrink-0"></span>
                <span className="truncate font-semibold font-display">412 Verified Trucks Live in Maharashtra Corridor</span>
              </div>
              <button
                onClick={() => alert('Listening for destination... "Pune Chakan"')}
                className="w-9 h-9 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-[#0F6E56] shadow-xs flex-shrink-0 hover:bg-teal-100 transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">mic</span>
              </button>
            </section>

            {/* Route Input Card */}
            <section className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-xs relative">
              <div className="relative flex flex-col space-y-3">
                <div className="absolute left-[13px] top-[18px] bottom-[28px] w-0.5 border-l-2 border-dashed border-gray-300"></div>

                {/* Pickup */}
                <div
                  ref={pickupContainerRef}
                  className={`flex items-start justify-between relative transition-all ${
                    activeDropdown === 'pickup' ? 'z-40' : 'z-20'
                  }`}
                >
                  <div className="flex items-start space-x-3 w-full mr-2">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="w-3 h-3 rounded-full bg-emerald-600 ring-2 ring-emerald-300"></span>
                    </div>
                    <div className="flex-1 bg-slate-50 border border-slate-200 focus-within:border-[#0F6E56] focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 rounded-xl px-3 py-2 relative transition-all">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                          PICKUP / माल उठाने की जगह
                        </p>
                        {activeDropdown === 'pickup' && (
                          <span className="text-[9px] font-bold text-[#0F6E56] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                            {pickupSuggestions.length} Hubs Found
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <input
                          type="text"
                          value={pickup}
                          onChange={(e) => {
                            setPickup(e.target.value);
                            setActiveDropdown('pickup');
                          }}
                          onFocus={() => setActiveDropdown('pickup')}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') setActiveDropdown(null);
                          }}
                          placeholder="Type pickup city, hub, JNPT, Okhla..."
                          className="w-full bg-transparent text-xs font-bold text-gray-900 leading-snug outline-none placeholder:text-gray-400"
                        />
                        {pickup && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPickup('');
                              setActiveDropdown('pickup');
                            }}
                            className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors flex-shrink-0"
                            title="Clear pickup"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(activeDropdown === 'pickup' ? null : 'pickup')}
                          className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors flex-shrink-0"
                          title="Show suggested hubs"
                        >
                          <span className="material-symbols-outlined text-sm">
                            {activeDropdown === 'pickup' ? 'expand_less' : 'expand_more'}
                          </span>
                        </button>
                      </div>

                      {/* Pickup Dropdown Table */}
                      {activeDropdown === 'pickup' && (
                        <div className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                          {/* Table Header */}
                          <div className="px-3.5 py-2 bg-gradient-to-r from-emerald-50 to-slate-50 border-b border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-600">
                            <span className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-xs text-[#0F6E56]">hub</span>
                              <span>SUGGESTED HUBS & LOGISTICS PARKS</span>
                            </span>
                            <span className="text-[9px] text-slate-400 font-medium">Click to select</span>
                          </div>

                          {/* Table Rows */}
                          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                            {pickupSuggestions.length > 0 ? (
                              pickupSuggestions.map((item, idx) => (
                                <div
                                  key={idx}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    setPickup(item.name);
                                    setActiveDropdown(null);
                                  }}
                                  className="px-3.5 py-2.5 hover:bg-[#E6F4F1]/60 cursor-pointer flex items-center justify-between gap-3 group transition-colors"
                                >
                                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                                    <div className="w-6 h-6 rounded-md bg-emerald-100/80 text-[#0F6E56] flex items-center justify-center flex-shrink-0 group-hover:bg-[#0F6E56] group-hover:text-white transition-colors">
                                      <span className="material-symbols-outlined text-sm">location_on</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#0F6E56] truncate">
                                        {renderHighlightedText(item.name, pickup)}
                                      </div>
                                      <div className="text-[10px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                                        <span className="font-semibold text-slate-700">{item.city}, {item.state}</span>
                                        <span>•</span>
                                        <span className="truncate">{item.subtext}</span>
                                      </div>
                                    </div>
                                  </div>
                                  {item.corridor && (
                                    <div className="flex-shrink-0 text-right hidden sm:block">
                                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-[#0F6E56] border border-slate-200">
                                        {item.corridor}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-xs text-slate-500 text-center">
                                No hubs matched "{pickup}". You can still use this as a custom address.
                              </div>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="px-3.5 py-1.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
                            <span className="truncate">Type any letters to refine suggestions</span>
                            <span className="text-[9px] text-slate-400 flex-shrink-0">Esc to close</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Swap Button */}
                <div className="absolute right-4 top-[48px] z-30">
                  <button
                    onClick={swapLocations}
                    className="w-7 h-7 bg-white rounded-full border border-gray-300 shadow flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-transform active:rotate-180"
                    type="button"
                    title="Swap pickup and destination"
                  >
                    <span className="material-symbols-outlined text-sm">swap_vert</span>
                  </button>
                </div>

                {/* Destination */}
                <div
                  ref={destinationContainerRef}
                  className={`flex items-start justify-between relative transition-all ${
                    activeDropdown === 'destination' ? 'z-40' : 'z-10'
                  }`}
                >
                  <div className="flex items-start space-x-3 w-full mr-2">
                    <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="w-3 h-3 rounded-full bg-amber-600"></span>
                    </div>
                    <div className="flex-1 bg-slate-50 border border-slate-200 focus-within:border-amber-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-100 rounded-xl px-3 py-2 relative transition-all">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                          DESTINATION / पहुँचाने की जगह
                        </p>
                        {activeDropdown === 'destination' && (
                          <span className="text-[9px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                            {destinationSuggestions.length} Hubs Found
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1.5 mt-0.5">
                        <input
                          type="text"
                          value={destination}
                          onChange={(e) => {
                            setDestination(e.target.value);
                            setActiveDropdown('destination');
                          }}
                          onFocus={() => setActiveDropdown('destination')}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') setActiveDropdown(null);
                          }}
                          placeholder="Type destination city, warehouse, Chakan, Peenya..."
                          className="w-full bg-transparent text-xs font-bold text-gray-900 leading-snug outline-none placeholder:text-gray-400"
                        />
                        {destination && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDestination('');
                              setActiveDropdown('destination');
                            }}
                            className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors flex-shrink-0"
                            title="Clear destination"
                          >
                            <span className="material-symbols-outlined text-sm">close</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setActiveDropdown(activeDropdown === 'destination' ? null : 'destination')}
                          className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors flex-shrink-0"
                          title="Show suggested hubs"
                        >
                          <span className="material-symbols-outlined text-sm">
                            {activeDropdown === 'destination' ? 'expand_less' : 'expand_more'}
                          </span>
                        </button>
                      </div>

                      {/* Destination Dropdown Table */}
                      {activeDropdown === 'destination' && (
                        <div className="absolute left-0 right-0 top-[calc(100%+6px)] bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                          {/* Table Header */}
                          <div className="px-3.5 py-2 bg-gradient-to-r from-amber-50 to-slate-50 border-b border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-600">
                            <span className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-xs text-amber-600">navigation</span>
                              <span>SUGGESTED DESTINATIONS & WAREHOUSES</span>
                            </span>
                            <span className="text-[9px] text-slate-400 font-medium">Click to select</span>
                          </div>

                          {/* Table Rows */}
                          <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                            {destinationSuggestions.length > 0 ? (
                              destinationSuggestions.map((item, idx) => (
                                <div
                                  key={idx}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    setDestination(item.name);
                                    setActiveDropdown(null);
                                  }}
                                  className="px-3.5 py-2.5 hover:bg-amber-50/70 cursor-pointer flex items-center justify-between gap-3 group transition-colors"
                                >
                                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                                    <div className="w-6 h-6 rounded-md bg-amber-100/80 text-amber-700 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                      <span className="material-symbols-outlined text-sm">flag</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="text-xs font-bold text-slate-900 group-hover:text-amber-800 truncate">
                                        {renderHighlightedText(
                                          item.name,
                                          destination,
                                          'text-amber-800 bg-amber-100 font-bold px-0.5 rounded'
                                        )}
                                      </div>
                                      <div className="text-[10px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                                        <span className="font-semibold text-slate-700">{item.city}, {item.state}</span>
                                        <span>•</span>
                                        <span className="truncate">{item.subtext}</span>
                                      </div>
                                    </div>
                                  </div>
                                  {item.corridor && (
                                    <div className="flex-shrink-0 text-right hidden sm:block">
                                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-800 border border-slate-200">
                                        {item.corridor}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-xs text-slate-500 text-center">
                                No hubs matched "{destination}". You can still use this as a custom address.
                              </div>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="px-3.5 py-1.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
                            <span className="truncate">Type any letters to refine suggestions</span>
                            <span className="text-[9px] text-slate-400 flex-shrink-0">Esc to close</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-display flex-wrap gap-2">
                <div className="flex items-center space-x-1.5 bg-slate-100/90 px-3 py-1.5 rounded-lg text-slate-700 font-semibold">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  <span>Today, Instant Highway Dispatch</span>
                </div>
                {isValidRoute ? (
                  <div className="flex items-center space-x-1.5 text-emerald-800 font-bold bg-[#E6F4F1] px-3 py-1.5 rounded-lg border border-emerald-200">
                    <span className="material-symbols-outlined text-sm text-[#0F6E56]">check_circle</span>
                    <span>{routeEstimate.distanceKm} km ({routeEstimate.durationText})</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5 text-amber-800 font-semibold bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                    <span className="material-symbols-outlined text-sm text-amber-600">info</span>
                    <span>{routeEstimate.durationText}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Cold Chain Cargo Feature Box */}
            <section className="bg-[#EFF6FF] border border-blue-200 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow">
                    <span className="material-symbols-outlined text-xl">ac_unit</span>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 leading-tight font-display">
                      Regulated &amp; Cold Chain Cargo
                    </h3>
                    <p className="text-[10px] text-gray-500 font-medium">तापमान संवेदनशील माल</p>
                  </div>
                </div>

                {/* Toggle */}
                <div
                  onClick={() => setIsColdChain(!isColdChain)}
                  className={`w-11 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${
                    isColdChain ? 'bg-[#2563EB] justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                </div>
              </div>

              {isColdChain && (
                <div className="grid grid-cols-2 gap-2 pt-1 animate-fade-up">
                  <div className="bg-white border border-blue-200 rounded-xl p-2.5 flex items-center space-x-2">
                    <span className="material-symbols-outlined text-blue-500 text-lg">severe_cold</span>
                    <div className="leading-tight">
                      <div className="text-[11px] font-bold text-blue-950 font-display">Reefer Deep Freeze</div>
                      <div className="text-[10px] text-gray-500 font-semibold">-18°C to -22°C Verified</div>
                    </div>
                  </div>
                  <div className="bg-white border border-blue-200 rounded-xl p-2.5 flex items-center space-x-2">
                    <span className="material-symbols-outlined text-teal-600 text-lg">medical_services</span>
                    <div className="leading-tight">
                      <div className="text-[11px] font-bold text-blue-950 font-display">Pharma GDP Cert</div>
                      <div className="text-[10px] text-gray-500 font-semibold">+2°C to +8°C Compliant</div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Vehicle Selection Header */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <h2 className="text-base font-extrabold text-gray-900 leading-tight font-display">
                  Choose Truck Type
                </h2>
                <p className="text-xs text-gray-500 font-medium">Live Fleet Capacity &amp; Rates</p>
              </div>
              <span className="bg-[#E6F4F1] text-[#0F6E56] text-[11px] font-bold px-2.5 py-1 rounded-lg border border-emerald-200 font-display">
                Locked Mileage Rates
              </span>
            </div>

            {/* Vehicle List */}
            <div className="space-y-3">
              {/* Vehicle 1: 32 Ft Reefer */}
              <article
                onClick={() => setSelectedVehicle('reefer-32')}
                className={`bg-white rounded-2xl border-2 p-4 shadow-xs cursor-pointer transition-all ${
                  selectedVehicle === 'reefer-32'
                    ? 'border-[#2563EB] ring-1 ring-[#2563EB] shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold text-xl">
                      <span className="material-symbols-outlined text-2xl">local_shipping</span>
                    </div>
                    <div>
                      <span className="font-display text-sm font-extrabold text-gray-900 block">
                        32 Ft Multi-Axle Container
                      </span>
                      <span className="text-[11px] text-gray-500">14 Ton Payload • GPS Telematics Lock</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-base font-extrabold text-[#0F6E56]">
                      {dynamicFares['reefer-32']?.formattedFare || '₹16,500'}
                    </span>
                    <span className="text-[10px] text-gray-400 block">All Incl. Fare</span>
                  </div>
                </div>
              </article>

              {/* Vehicle 2: 14 Ft Bolero */}
              <article
                onClick={() => setSelectedVehicle('bolero-14')}
                className={`bg-white rounded-2xl border-2 p-4 shadow-xs cursor-pointer transition-all ${
                  selectedVehicle === 'bolero-14'
                    ? 'border-[#0F6E56] ring-1 ring-[#0F6E56] shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-[#E6F4F1] text-[#0F6E56] flex items-center justify-center font-bold text-xl">
                      <span className="material-symbols-outlined text-2xl">rv_hookup</span>
                    </div>
                    <div>
                      <span className="font-display text-sm font-extrabold text-gray-900 block">
                        14 Ft Bolero Pickup
                      </span>
                      <span className="text-[11px] text-gray-500">3.5 Ton Payload • Open High Deck</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-base font-extrabold text-[#0F6E56]">
                      {dynamicFares['bolero-14']?.formattedFare || '₹5,200'}
                    </span>
                    <span className="text-[10px] text-gray-400 block">All Incl. Fare</span>
                  </div>
                </div>
              </article>

              {/* Vehicle 3: Tata Ace */}
              <article
                onClick={() => setSelectedVehicle('tata-ace')}
                className={`bg-white rounded-2xl border-2 p-4 shadow-xs cursor-pointer transition-all ${
                  selectedVehicle === 'tata-ace'
                    ? 'border-[#0F6E56] ring-1 ring-[#0F6E56] shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xl">
                      <span className="material-symbols-outlined text-2xl">airport_shuttle</span>
                    </div>
                    <div>
                      <span className="font-display text-sm font-extrabold text-gray-900 block">
                        Tata Ace Mini Truck
                      </span>
                      <span className="text-[11px] text-gray-500">1.2 Ton Payload • City Delivery</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-base font-extrabold text-[#0F6E56]">
                      {dynamicFares['tata-ace']?.formattedFare || '₹2,800'}
                    </span>
                    <span className="text-[10px] text-gray-400 block">All Incl. Fare</span>
                  </div>
                </div>
              </article>
            </div>
          </div>

          {/* Right Column (Desktop Dashboard Sidecar): Booking Summary & Action Panel */}
          <div className="lg:col-span-5 space-y-4">
            {/* Live Corridor Status Card */}
            <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-5 text-white shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${isValidRoute ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-emerald-300">
                    {isValidRoute ? `${routeEstimate.corridor} Active` : 'Route Incomplete'}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-300">E-Way Bill Auto-Sync</span>
              </div>
              <div className="pt-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Origin Dock</span>
                  <span className="font-bold text-white truncate max-w-[210px] text-right">
                    {pickup.trim() || '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Destination</span>
                  <span className="font-bold text-white truncate max-w-[210px] text-right">
                    {destination.trim() || '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Est. Transit Time</span>
                  <span className="font-bold text-emerald-300">
                    {isValidRoute ? routeEstimate.durationText : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Estimate Breakdown Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-extrabold text-sm text-[#111827]">Fare Breakdown Summary</h3>
                <span className="text-[10px] font-bold bg-[#E6F4F1] text-[#0F6E56] px-2 py-0.5 rounded-full">
                  ₹0 HIDDEN FEES
                </span>
              </div>

              <div className="space-y-2 text-xs divide-y divide-slate-100">
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-600">Selected Vehicle</span>
                  <span className="font-bold text-slate-900">{vehiclePricing.name}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-600">Capacity</span>
                  <span className="text-slate-700">{vehiclePricing.payload}</span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-600">Base Freight Mileage</span>
                  <span className="font-semibold text-slate-800">
                    {isValidRoute ? 'Included' : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-600">FASTag &amp; Highway Tolls</span>
                  <span className="text-emerald-700 font-semibold">
                    {isValidRoute ? 'Pre-paid (₹0 Gate Stoppage)' : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-600">Cold Chain IoT Monitoring</span>
                  <span className="text-blue-700 font-semibold">
                    {isValidRoute ? 'Active Telematics' : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 text-sm font-extrabold text-slate-900">
                  <span>Guaranteed Total Locked</span>
                  <span className="text-[#0F6E56] text-xl font-black">{vehiclePricing.fare}</span>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={handleProceed}
                disabled={!isValidRoute}
                className={`w-full h-14 min-h-[56px] rounded-xl font-display text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isValidRoute
                    ? 'bg-[#0F6E56] hover:bg-[#0B5240] text-white active:scale-[0.99] cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60 shadow-none'
                }`}
                type="button"
              >
                <span>
                  {isValidRoute
                    ? 'Dispatch Vehicle • गाड़ी बुक करें'
                    : 'Enter Both Locations to Dispatch • दोनों स्थान दर्ज करें'}
                </span>
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium pt-1">
                <span className="material-symbols-outlined text-[#0F6E56] text-sm">shield</span>
                <span>100% KYC &amp; VAHAN Verified Fleet • ULIP Safe</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CustomerBottomNav activeTab="book" />
    </div>
  );
}

