"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CustomerBottomNav from "@/components/customer/CustomerBottomNav";
import { useLanguage } from "@/context/LanguageContext";

interface Warehouse {
  id: string;
  name: string;
  tag: string;
  address: string;
  details: string;
  isDefault: boolean;
  type: "warehouse" | "port" | "factory";
}

export default function CustomerProfilePage() {
  const router = useRouter();
  const { currentLanguage, setLangModalOpen } = useLanguage();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([
    {
      id: "1",
      name: "Bhiwandi Central Warehouse",
      tag: "DEFAULT",
      address: "Gate 4, Survey No. 42/1, Mankoli Naka",
      details: "Bhiwandi, Maharashtra 421302 • Contact: R. More (+91 94220 11200)",
      isDefault: true,
      type: "warehouse",
    },
    {
      id: "2",
      name: "Nhava Sheva JNPT Dock 2",
      tag: "EXPORT DOCK",
      address: "CFS Yard B, Terminal 4 Road, Uran",
      details: "Navi Mumbai, Maharashtra 400707 • Port Officer: M. Khan",
      isDefault: false,
      type: "port",
    },
    {
      id: "3",
      name: "Chakan Industrial MIDC Plot 44",
      tag: "PHARMA MFG",
      address: "Phase II, Sector B-9, Near Mercedes Way",
      details: "Chakan, Pune, Maharashtra 410501 • Loading Bay: #3",
      isDefault: false,
      type: "factory",
    },
  ]);

  const [showAddHubModal, setShowAddHubModal] = useState(false);
  const [newHubName, setNewHubName] = useState("");
  const [newHubAddress, setNewHubAddress] = useState("");

  const setDefaultWarehouse = (id: string) => {
    setWarehouses(
      warehouses.map((w) => ({
        ...w,
        isDefault: w.id === id,
        tag: w.id === id ? "DEFAULT" : w.tag === "DEFAULT" ? "STANDARD" : w.tag,
      }))
    );
  };

  const handleAddHub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHubName) return;

    const newW: Warehouse = {
      id: Date.now().toString(),
      name: newHubName,
      tag: "NEW HUB",
      address: newHubAddress || "Industrial Corridor, Maharashtra",
      details: "Contact: Operations Team (+91 98000 00000)",
      isDefault: false,
      type: "warehouse",
    };

    setWarehouses([...warehouses, newW]);
    setNewHubName("");
    setNewHubAddress("");
    setShowAddHubModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] antialiased selection:bg-brand-tint selection:text-brand flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/customer/home" className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-slate-100 hover:bg-slate-200 transition-colors mr-1">
              <span className="material-symbols-outlined text-sm text-slate-700">arrow_back</span>
            </Link>
            <div className="w-8 h-8 rounded-lg bg-[#E6F4F1] flex items-center justify-center text-brand">
              <span className="material-symbols-outlined text-[18px]">sync_alt</span>
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">ReLoad</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 ml-0.5"></span>
            <span className="text-xs text-slate-500 font-semibold hidden sm:inline ml-2">• Shipper Enterprise Profile</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setLangModalOpen(true)}
              className="h-8 px-3 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 flex items-center gap-1 text-xs font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-brand text-[16px]">language</span>
              <span className="uppercase">{currentLanguage}</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-brand-dark text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24 space-y-4">
          {/* Verified Profile Header Card */}
          <div className="bg-white px-4 pt-4 pb-4 border-b border-slate-200 shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-emerald-100 shadow-sm bg-slate-100 flex items-center justify-center">
                  <img
                    alt="Rajesh Sharma"
                    className="w-full h-full object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                  />
                </div>
                <button
                  aria-label="Edit Profile Photo"
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center shadow-md active:scale-95 transition-transform ring-2 ring-white"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[13px]">photo_camera</span>
                </button>
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center pt-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h1 className="text-lg leading-tight text-slate-900 font-bold tracking-tight truncate">
                    Rajesh Sharma
                  </h1>
                  <span className="material-symbols-outlined text-brand text-[18px]">verified</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Logistics Manager</p>
                <div className="mt-1 flex items-center gap-1 text-slate-800 text-xs font-semibold truncate">
                  <span className="material-symbols-outlined text-slate-500 text-[15px] shrink-0">corporate_fare</span>
                  <span className="truncate">Apex Pharma & Cold Logistics Ltd.</span>
                </div>
              </div>
            </div>

            {/* Phone & OTP Verification Pill */}
            <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 text-brand">
                  <span className="material-symbols-outlined text-[16px]">phone_iphone</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-medium text-slate-500 leading-tight">
                    Registered Mobile / फोन नंबर
                  </span>
                  <span className="text-xs leading-tight text-slate-900 font-bold tracking-wide truncate">
                    +91 98765 43210
                  </span>
                </div>
              </div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-brand shrink-0 border border-emerald-200">
                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                <span className="text-[10px] font-bold whitespace-nowrap">OTP Verified</span>
              </div>
            </div>
          </div>

          <div className="px-4 space-y-4">
            {/* Business Compliance Card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-brand shrink-0">
                    <span className="material-symbols-outlined text-[20px]">verified_user</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm leading-tight text-slate-900 font-bold">Business Compliance</h2>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-emerald-50 text-brand border border-emerald-200">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">GSTIN Verified • Govt ULIP Linked</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium text-slate-500">GST Identification</span>
                  <span className="font-bold text-slate-900 tracking-wider mt-0.5">27AABCA9823Q1ZM</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium text-slate-500">ULIP Verification ID</span>
                  <span className="font-bold text-slate-900 tracking-wider mt-0.5">ULIP-CORP-8841</span>
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between text-brand pt-1">
                <span className="text-xs flex items-center gap-1.5 font-semibold">
                  <span className="material-symbols-outlined text-[16px]">shield</span> Priority Toll & Green Corridor
                </span>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </div>
            </div>

            {/* Quick Stats Bento Row */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex flex-col items-center text-center justify-center min-h-[76px]">
                <span className="text-2xl text-brand font-black leading-none">142</span>
                <span className="text-[10px] text-slate-500 mt-1 font-bold">Trips Done</span>
              </div>

              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex flex-col items-center text-center justify-center min-h-[76px]">
                <div className="flex items-center gap-0.5 text-amber-500">
                  <span className="text-2xl font-black leading-none text-slate-900">4.9</span>
                  <span className="material-symbols-outlined text-[16px]">star</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 font-bold">Shipper Score</span>
              </div>

              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex flex-col items-center text-center justify-center min-h-[76px]">
                <span className="text-2xl text-blue-600 font-black leading-none">100%</span>
                <span className="text-[10px] text-slate-500 mt-1 font-bold">Cold Integrity</span>
              </div>
            </div>

            {/* Saved Hubs & Warehouses */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm text-slate-900 font-bold">Saved Hubs & Warehouses</h2>
                  <p className="text-[11px] text-slate-500">पते और गोदाम विवरण</p>
                </div>
                <button
                  onClick={() => setShowAddHubModal(true)}
                  className="h-8 px-2.5 rounded-lg bg-emerald-50 text-brand text-xs font-bold flex items-center gap-1 border border-emerald-200 hover:bg-brand hover:text-white transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">add_location_alt</span>
                  <span>Add Hub</span>
                </button>
              </div>

              {warehouses.map((wh) => (
                <div
                  key={wh.id}
                  className="bg-white rounded-xl p-3.5 shadow-sm border border-slate-200 flex flex-col gap-2.5 relative"
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        wh.type === "port"
                          ? "bg-blue-50 text-blue-600"
                          : wh.type === "factory"
                          ? "bg-slate-100 text-slate-700"
                          : "bg-emerald-50 text-brand"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {wh.type === "port" ? "directions_boat" : wh.type === "factory" ? "factory" : "warehouse"}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xs text-slate-900 font-bold">{wh.name}</h3>
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                            wh.isDefault
                              ? "bg-brand text-white"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {wh.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 font-medium mt-0.5">{wh.address}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{wh.details}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      className="h-8 px-3 rounded-lg bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 border border-slate-200"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                      <span>Edit</span>
                    </button>

                    {wh.isDefault ? (
                      <button
                        className="h-8 px-3 rounded-lg bg-emerald-50 text-brand text-xs font-bold flex items-center gap-1 border border-emerald-200 cursor-default"
                        disabled
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        <span>Default Hub</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setDefaultWarehouse(wh.id)}
                        className="h-8 px-3 rounded-lg bg-white text-brand text-xs font-bold flex items-center gap-1 border border-brand hover:bg-emerald-50 transition-colors"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[14px]">bookmark_added</span>
                        <span>Set as Default</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Account & Security */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col">
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Account & Security
                </span>
                <span className="material-symbols-outlined text-slate-400 text-[16px]">security</span>
              </div>

              <a
                className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors"
                href="tel:18002094400"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 text-brand flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">ring_volume</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-900 font-bold">24x7 Shipper Priority Helpline</p>
                    <p className="text-[11px] text-slate-500">Dedicated freight controller desk (Toll-Free)</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span>
              </a>

              <div className="h-px bg-slate-100 mx-3"></div>

              <Link
                className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors"
                href="/customer/support"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">policy</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-900 font-bold">Terms & Cargo Safety Policy</p>
                    <p className="text-[11px] text-slate-500">Pharma transit standards & insurance</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span>
              </Link>

              <div className="h-px bg-slate-100 mx-3"></div>

              <Link
                className="flex items-center justify-between p-3 hover:bg-slate-50 transition-colors"
                href="/customer/receipt"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">receipt</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-900 font-bold">Billing & Tax Invoices</p>
                    <p className="text-[11px] text-slate-500">Automated E-way bills & GST invoices</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-[18px]">chevron_right</span>
              </Link>
            </div>

            {/* Sign Out Button */}
            <div className="space-y-1 pt-1">
              <button
                onClick={() => router.push("/landing")}
                className="w-full h-11 rounded-xl bg-red-50 text-red-600 font-bold text-xs flex items-center justify-center gap-2 border border-red-200 hover:bg-red-100 transition-colors shadow-sm"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>Sign Out (लॉगआउट)</span>
              </button>
              <p className="text-center text-[10px] text-slate-400">
                ReLoad Commercial Client v3.4.1 (Encrypted ULIP Node)
              </p>
            </div>
          </div>
        </main>

        {/* Add Hub Modal */}
        {showAddHubModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Add New Warehouse / Dock</h3>
                <button
                  onClick={() => setShowAddHubModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>

              <form onSubmit={handleAddHub} className="space-y-2.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Hub Name</label>
                  <input
                    required
                    value={newHubName}
                    onChange={(e) => setNewHubName(e.target.value)}
                    placeholder="e.g. Pune Wagholi Logistics Hub"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Address / Landmark</label>
                  <input
                    value={newHubAddress}
                    onChange={(e) => setNewHubAddress(e.target.value)}
                    placeholder="e.g. Gate 2, Plot 19, Wagholi Industrial Area"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-10 bg-brand text-white text-xs font-bold rounded-xl mt-2 flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>Save Hub (गोदाम सुरक्षित करें)</span>
                </button>
              </form>
            </div>
          </div>
        )}

        <CustomerBottomNav activeTab="profile" />
      </div>
    );
  }
