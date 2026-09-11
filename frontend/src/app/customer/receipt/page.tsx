"use client";

import React, { useState } from "react";
import Link from "next/link";
import CustomerBottomNav from "@/components/customer/CustomerBottomNav";
import { useLanguage } from "@/context/LanguageContext";

export default function CustomerReceiptPage() {
  const { currentLanguage, setLangModalOpen } = useLanguage();
  const [activeTab, setActiveTab] = useState<"checkout" | "receipt">("receipt");
  const [selectedPayment, setSelectedPayment] = useState<string>("gpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [rating, setRating] = useState(5);
  const [praises, setPraises] = useState<string[]>(["Punctual (समय पर)", "Careful Driving (सुरक्षित)"]);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [selectedDisputes, setSelectedDisputes] = useState<string[]>([]);
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  const ratingMessages = [
    "Poor Experience (1 Star)",
    "Below Expectations (2 Stars)",
    "Good Trip (3 Stars)",
    "Very Good (4 Stars)",
    "Excellent 5-Star Service! ★★★★★",
  ];

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setActiveTab("receipt");
    }, 1200);
  };

  const togglePraise = (item: string) => {
    if (praises.includes(item)) {
      setPraises(praises.filter((p) => p !== item));
    } else {
      setPraises([...praises, item]);
    }
  };

  const toggleDisputeOption = (opt: string) => {
    if (selectedDisputes.includes(opt)) {
      setSelectedDisputes(selectedDisputes.filter((d) => d !== opt));
    } else {
      setSelectedDisputes([...selectedDisputes, opt]);
    }
  };

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
            <span className="text-xs font-semibold text-slate-500">Checkout &amp; Invoice</span>
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

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24 space-y-4">
          {/* Status Mode Tabs */}
          <div className="flex p-1 bg-slate-200 rounded-xl shadow-inner">
            <button
              onClick={() => setActiveTab("checkout")}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "checkout"
                  ? "bg-white text-brand shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">payments</span>
              <span>1. Pay ₹14,200</span>
            </button>

            <button
              onClick={() => setActiveTab("receipt")}
              className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === "receipt"
                  ? "bg-white text-brand shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              <span>2. Receipt & Trip</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </button>
          </div>

          {/* CHECKOUT PANE */}
          {activeTab === "checkout" && (
            <div className="space-y-4">
              {/* Fare Highlight Card */}
              <div className="rounded-xl bg-gradient-to-br from-brand to-brand-dark text-white p-4 shadow-md relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none"></div>
                <div className="flex items-center justify-between z-10 relative">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 text-emerald-200 text-xs font-semibold">
                    <span className="material-symbols-outlined text-[14px]">lock</span>
                    <span>Locked Fixed Rate • तय किराया</span>
                  </span>
                  <span className="text-xs text-white/80">RL-9042</span>
                </div>

                <div className="my-3 z-10 relative">
                  <p className="text-xs text-white/80">Total Guaranteed Fare / कुल किराया</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">₹14,200</h1>
                    <span className="text-xs text-emerald-200">All-Inclusive (सभी कर सहित)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-white/20 z-10 relative text-xs text-white/90 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-emerald-300">toll</span>
                    NH-48 Tolls Included
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px] text-emerald-300">ac_unit</span>
                    Reefer Fuel Included
                  </span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-brand text-[20px]">account_balance_wallet</span>
                    <h2 className="text-sm font-bold text-slate-900">Select Payment Mode</h2>
                  </div>
                  <span className="text-xs text-slate-500">भुगतान विकल्प</span>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Instant UPI Apps (तुरंत भुगतान)
                  </p>

                  {/* GPay */}
                  <label
                    onClick={() => setSelectedPayment("gpay")}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedPayment === "gpay"
                        ? "bg-emerald-50/60 border-brand"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-slate-200 font-extrabold text-blue-600 text-sm">
                        GPay
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          Google Pay
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                            Fastest
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">One-tap UPI mandate / यूपीआई</p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                        selectedPayment === "gpay" ? "bg-brand" : "bg-slate-300 text-transparent"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </div>
                  </label>

                  {/* PhonePe */}
                  <label
                    onClick={() => setSelectedPayment("phonepe")}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedPayment === "phonepe"
                        ? "bg-emerald-50/60 border-brand"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-slate-200 font-extrabold text-purple-600 text-sm">
                        PhonePe
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">PhonePe</div>
                        <p className="text-[11px] text-slate-500">QR or Registered UPI ID</p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                        selectedPayment === "phonepe" ? "bg-brand" : "bg-slate-300 text-transparent"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </div>
                  </label>

                  {/* Paytm / BHIM */}
                  <label
                    onClick={() => setSelectedPayment("paytm")}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedPayment === "paytm"
                        ? "bg-emerald-50/60 border-brand"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-slate-200 font-extrabold text-cyan-600 text-sm">
                        Paytm
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Paytm / BHIM UPI</div>
                        <p className="text-[11px] text-slate-500">Direct bank debit via UPI</p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                        selectedPayment === "paytm" ? "bg-brand" : "bg-slate-300 text-transparent"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </div>
                  </label>
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Business & Logistics Gateways
                  </p>

                  {/* NetBanking */}
                  <label
                    onClick={() => setSelectedPayment("netbanking")}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedPayment === "netbanking"
                        ? "bg-emerald-50/60 border-brand"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-slate-200 text-brand">
                        <span className="material-symbols-outlined text-[24px]">account_balance</span>
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">NetBanking (बैंक ट्रांसफर)</div>
                        <p className="text-[11px] text-slate-500">HDFC, ICICI, SBI, Axis & 40+ banks</p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                        selectedPayment === "netbanking" ? "bg-brand" : "bg-slate-300 text-transparent"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Pay Action Button */}
              <div>
                <button
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="w-full h-14 bg-brand hover:bg-brand-dark active:scale-[0.99] text-white rounded-xl font-bold text-base flex items-center justify-between px-4 shadow-md transition-all disabled:opacity-75"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2 w-full">
                      <span className="material-symbols-outlined animate-spin text-[22px]">progress_activity</span>
                      <span>Processing Secured Payment...</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[22px]">verified_user</span>
                        <span>Pay Now • भुगतान करें</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/20 py-1 px-3 rounded-lg">
                        <span className="text-base font-bold">₹14,200</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </div>
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-1.5 mt-2 text-slate-500 text-xs">
                  <span className="material-symbols-outlined text-brand text-[16px]">lock_clock</span>
                  <span>256-bit Encrypted Logistics Gateway • 100% Secure</span>
                </div>
              </div>
            </div>
          )}

          {/* RECEIPT PANE */}
          {activeTab === "receipt" && (
            <div className="space-y-4">
              {/* Receipt Ticket Header */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 text-brand flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">check_circle</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">Trip Delivered</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px]">verified</span>
                          Verified
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">यात्रा सफलतापूर्वक पूरी हुई</p>
                    </div>
                  </div>

                  <button
                    onClick={() => alert("Downloading GST Invoiced Tax PDF...")}
                    className="h-9 px-3 rounded-lg bg-slate-100 text-brand flex items-center gap-1 hover:bg-slate-200 text-xs font-bold"
                  >
                    <span className="material-symbols-outlined text-[16px]">download</span>
                    <span>PDF रसीद</span>
                  </button>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-2 mb-3 bg-slate-50 p-2.5 rounded-lg text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Consignment ID</span>
                    <span className="text-slate-900 font-bold">#RL-9042</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Truck & Type</span>
                    <span className="text-slate-900 font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-blue-600 text-[14px]">ac_unit</span>
                      14ft Reefer Cold
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Distance Travelled</span>
                    <span className="text-slate-900 font-semibold">142 km (NH-48)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Delivery Time</span>
                    <span className="text-slate-900 font-semibold">Today, 02:45 PM</span>
                  </div>
                </div>

                {/* Route Visual Step */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="flex flex-col items-center mt-0.5">
                      <span className="w-3 h-3 rounded-full bg-brand ring-4 ring-emerald-100"></span>
                      <span className="w-0.5 h-6 bg-slate-200"></span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-slate-500">Pickup Point (उठाव)</p>
                      <p className="font-semibold text-slate-900 truncate">Mumbai JNPT Port, Terminal 3</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="flex flex-col items-center mt-0.5">
                      <span className="w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-emerald-100"></span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-slate-500">Delivered To (वितरण)</p>
                      <p className="font-semibold text-slate-900 truncate">Pune Chakan MIDC Industrial Phase II</p>
                    </div>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between items-center">
                    <span>Freight Base Charges (142 km)</span>
                    <span className="text-slate-900 font-semibold">₹11,400</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cold Chain Reefer Monitoring Fuel</span>
                    <span className="text-slate-900 font-semibold">₹1,600</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Automated Toll Plazas (3 Tolls)</span>
                    <span className="text-slate-900 font-semibold">₹720</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>GST @ 5% (RCM compliant)</span>
                    <span className="text-slate-900 font-semibold">₹480</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200 font-bold text-slate-900 text-sm">
                    <span>Paid Total (कुल भुगतान)</span>
                    <span className="text-brand">₹14,200</span>
                  </div>
                </div>
              </div>

              {/* Driver Rating & Feedback */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Rate Driver Partner</h3>
                    <p className="text-xs text-slate-500">ड्राइवर को रेटिंग दें व अनुभव साझा करें</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-brand text-xs font-semibold">
                    Assigned Fleet
                  </span>
                </div>

                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <img
                    alt="Gurpreet Singh"
                    className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-200"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900 truncate">Gurpreet Singh</h4>
                      <span className="material-symbols-outlined text-brand text-[15px]">verified</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Vehicle: MH-12-RN-8821 • Tata 407</p>
                    <div className="flex items-center gap-1 text-amber-500 mt-0.5">
                      <span className="material-symbols-outlined text-[14px]">star</span>
                      <span className="text-xs font-bold text-slate-800">4.9</span>
                      <span className="text-slate-500 text-[10px]">(340+ runs completed)</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Star Rating */}
                <div className="py-2 flex flex-col items-center">
                  <p className="text-xs text-slate-500 mb-1">Tap a star to rate / स्टार चुनें</p>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 text-amber-500 active:scale-90 transition-transform"
                      >
                        <span
                          className={`material-symbols-outlined text-[28px] ${
                            star <= rating ? "text-amber-500" : "text-slate-300"
                          }`}
                        >
                          star
                        </span>
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-emerald-800 font-bold mt-2">
                    {ratingMessages[rating - 1]}
                  </span>
                </div>

                {/* Praise chips */}
                <div className="space-y-1.5">
                  <p className="text-xs text-slate-500">Select quick praises (अनुभव बताएं):</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Punctual (समय पर)",
                      "Careful Driving (सुरक्षित)",
                      "Clean Reefer (स्वच्छ वाहन)",
                      "Helpful Unloading",
                    ].map((item, idx) => {
                      const selected = praises.includes(item);
                      return (
                        <button
                          key={idx}
                          onClick={() => togglePraise(item)}
                          className={`h-9 px-3 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                            selected
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {selected ? "check" : "add"}
                          </span>
                          <span>{item}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Dispute Escalation Block */}
              <div className="bg-red-50 rounded-xl p-4 shadow-sm border border-red-200 space-y-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">report_problem</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-red-700">Have an issue with this trip?</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Damage, route detour, invoice dispute, or unexpected toll charges.
                    </p>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => setShowDisputeModal(true)}
                    className="w-full h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">flag</span>
                    <span>Report an Issue (समस्या बताएं) ⚠️</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-slate-500 pt-1 text-[11px]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-brand text-[14px]">headset_mic</span>
                    24x7 Priority Desk: 1800-420-9000
                  </span>
                  <span className="text-emerald-700 font-bold">Ticket SLA: &lt;15 Mins</span>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Support Modal */}
        {showDisputeModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-600 text-[22px]">fmd_bad</span>
                  <h3 className="text-sm font-bold text-slate-900">Report Consignment Issue</h3>
                </div>
                <button
                  onClick={() => setShowDisputeModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <p className="text-xs text-slate-600">Trip: Mumbai to Pune (RL-9042). Select concern type:</p>

              <div className="space-y-2">
                {[
                  { id: "damage", label: "📦 Cargo Damage / Seal Broken" },
                  { id: "temp", label: "🌡️ Reefer Temperature Deviation" },
                  { id: "fare", label: "💵 Incorrect Toll / Extra Fare Charged" },
                ].map((item) => {
                  const active = selectedDisputes.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggleDisputeOption(item.id)}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-colors ${
                        active
                          ? "bg-amber-50 border-amber-300 text-amber-900"
                          : "bg-slate-50 border-slate-200 text-slate-800"
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className="material-symbols-outlined text-[16px] text-slate-400">
                        {active ? "check" : "chevron_right"}
                      </span>
                    </button>
                  );
                })}
              </div>

              <Link
                href="/customer/support"
                className="w-full h-11 bg-brand text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 mt-2"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Open Dispute Room (डिस्प्यूट कक्ष)</span>
              </Link>
            </div>
          </div>
        )}

        <CustomerBottomNav activeTab="receipt" />
      </div>
    );
  }
