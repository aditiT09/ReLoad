"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CustomerBottomNav from "@/components/customer/CustomerBottomNav";
import { useLanguage } from "@/context/LanguageContext";
import { bookings } from "@/lib/api";

export default function CustomerBookingsPage() {
  const { currentLanguage, setLangModalOpen } = useLanguage();
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  const [dbBookings, setDbBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bookings
      .list()
      .then((data: any) => {
        if (Array.isArray(data)) {
          setDbBookings(data);
        }
      })
      .catch((err) => console.error("Error fetching bookings:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] antialiased selection:bg-brand-tint selection:text-brand flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl text-slate-900 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Link href="/customer/home" className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors mr-1">
              <span className="material-symbols-outlined text-sm text-slate-700">arrow_back</span>
            </Link>
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">ReLoad</span>
            <span className="text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-500">My Consignment Bookings</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setLangModalOpen(true)}
              className="flex items-center space-x-1 bg-slate-100 text-xs font-semibold py-1.5 px-3 rounded-full border border-slate-200"
            >
              <span className="material-symbols-outlined text-[14px] text-brand">language</span>
              <span className="uppercase">{currentLanguage}</span>
            </button>
            <Link
              href="/customer/profile"
              className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold"
            >
              <span className="material-symbols-outlined text-[16px]">person</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24 space-y-4">
          {/* Active / Past Toggle */}
          <div className="bg-slate-200 p-1 rounded-xl flex items-center shadow-inner">
            <button
              onClick={() => setActiveTab("active")}
              className={`flex-1 min-h-[46px] py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                activeTab === "active"
                  ? "bg-white text-brand shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              <span>Active (चालू)</span>
              <span className="bg-brand text-white px-1.5 py-0.5 rounded-full text-[10px] leading-none">
                1
              </span>
            </button>

            <button
              onClick={() => setActiveTab("past")}
              className={`flex-1 min-h-[46px] py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all text-xs font-bold ${
                activeTab === "past"
                  ? "bg-white text-brand shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">history</span>
              <span>Past (पुरानी)</span>
              <span className="bg-slate-300 text-slate-700 px-1.5 py-0.5 rounded-full text-[10px] leading-none">
                1
              </span>
            </button>
          </div>

          {/* ACTIVE BOOKINGS */}
          {activeTab === "active" && (
            <div className="space-y-3">
              {isLoading && (
                <div className="p-8 text-center bg-white rounded-xl border border-slate-100">
                  <span className="material-symbols-outlined text-3xl animate-spin text-[#0F6E56]">sync</span>
                  <p className="text-xs text-slate-500 mt-2">Loading live bookings from Supabase PostgreSQL...</p>
                </div>
              )}

              {!isLoading && dbBookings.length === 0 && (
                <div className="p-8 text-center bg-white rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500">No active bookings found.</p>
                </div>
              )}

              {dbBookings.slice(0, 8).map((b) => (
                <div key={b.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col gap-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#0F6E56] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">tag</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-900 tracking-tight">#{String(b.id).slice(0, 8).toUpperCase()}</span>
                        <span className="text-[11px] text-slate-500 capitalize">{b.cargo_category} Cargo</span>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[#0F6E56] border border-emerald-200 shrink-0 text-[11px] font-bold">
                      <span className="h-2 w-2 rounded-full bg-[#0F6E56] animate-pulse"></span>
                      <span className="capitalize">{String(b.status).replace('_', ' ')}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-2.5 flex flex-col gap-2 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#0F6E56] text-[18px] mt-0.5">trip_origin</span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-slate-500">Pickup (उठाव)</span>
                        <span className="font-semibold text-slate-900 truncate">{b.pickup_address}</span>
                      </div>
                    </div>

                    <div className="ml-2 w-0.5 h-2.5 bg-slate-300"></div>

                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-red-600 text-[18px] mt-0.5">location_on</span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] text-slate-500">Drop (पहुंच)</span>
                        <span className="font-semibold text-slate-900 truncate">{b.dropoff_address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500">Guaranteed Fare (भाड़ा)</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-base font-bold text-slate-900">₹{b.base_fare}</span>
                        <span className="text-[10px] text-[#0F6E56] font-semibold">Locked</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/customer/receipt?id=${b.id}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                      >
                        Receipt
                      </Link>
                      <Link
                        href="/customer/tracking"
                        className="h-10 px-3.5 rounded-xl bg-[#0F6E56] hover:bg-[#0B5240] text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">near_me</span>
                        <span>Track</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PAST BOOKINGS */}
          {activeTab === "past" && (
            <div className="space-y-3">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col gap-3 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">tag</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-900 tracking-tight">#RL-8821</span>
                      <span className="text-[11px] text-slate-500">24 Ft Container</span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0 text-[11px] font-bold">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span>Delivered • 12 Sep</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-2.5 flex flex-col gap-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-brand text-[18px] mt-0.5">trip_origin</span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] text-slate-500">Bhiwandi Warehousing Hub</span>
                      <span className="font-semibold text-slate-900 truncate">Gala #14, Anjurphata</span>
                    </div>
                  </div>

                  <div className="ml-2 w-0.5 h-2.5 bg-slate-300"></div>

                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-red-600 text-[18px] mt-0.5">location_on</span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] text-slate-500">Vapi Industrial Zone</span>
                      <span className="font-semibold text-slate-900 truncate">Plot 88, GIDC Phase 1</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500">Total Paid (कुल भुगतान)</span>
                    <span className="text-base font-bold text-slate-900">₹11,800</span>
                  </div>

                  <Link
                    href="/customer/receipt"
                    className="h-10 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-brand">download</span>
                    <span>POD / Receipt</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Book Again Hero Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 flex flex-col items-center text-center overflow-hidden">
            <div className="w-full h-32 rounded-lg overflow-hidden relative mb-3">
              <img
                alt="Truck Fleet"
                className="w-full h-full object-cover object-center"
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex items-end p-2.5">
                <div className="flex items-center gap-1 text-white text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px] text-emerald-400">verified</span>
                  <span>10,000+ Verified Fleets Ready</span>
                </div>
              </div>
            </div>

            <p className="text-xs font-bold text-slate-900">Need another transport?</p>
            <p className="text-[11px] text-slate-500 mb-3">Instant booking with guaranteed locks</p>

            <Link
              href="/customer/home"
              className="w-full h-12 rounded-xl bg-brand hover:bg-brand-dark active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>Book a Truck Now • नई गाड़ी</span>
            </Link>
          </div>
        </main>

        <CustomerBottomNav activeTab="bookings" />
      </div>
    );
  }
