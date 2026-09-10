import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  BookingState, 
  BookingStatus, 
  CargoCategory, 
  CustomerProfile, 
  DriverInfo, 
  HistoricalTrip, 
  ReportIncident, 
  SurchargeRequest, 
  SupportedLanguage, 
  VehicleOption,
  ChatMessage
} from '../types';
import { translations, TranslationDictionary } from '../i18n/translations';

export const INITIAL_VEHICLES: VehicleOption[] = [
  {
    id: 'veh-reefer-van',
    name: 'Reefer Van 14ft (Tata 407 LPT)',
    typeBadge: 'Cold-Chain Regulated',
    capacityKg: 2500,
    tempRange: '-20°C to +4°C Active Reefer',
    isRegulatedVerified: true,
    hasActiveReefer: true,
    isVerified: true,
    rating: 4.9,
    baseFare: 34800,
    baseRate: 34800,
    etaMinutes: 28,
    dimensions: '14ft × 6.5ft × 6.5ft',
    features: ['Active IoT Telematics', 'VAHAN 4.0 Net-cleared', 'Digital Tamper Seal'],
  },
  {
    id: 'veh-reefer-medium',
    name: 'Eicher Pro 2114XP Reefer',
    typeBadge: 'Cold-Chain Heavy',
    capacityKg: 7500,
    tempRange: '-25°C to +8°C Active Chiller',
    isRegulatedVerified: true,
    hasActiveReefer: true,
    isVerified: true,
    rating: 4.8,
    baseFare: 52400,
    baseRate: 52400,
    etaMinutes: 45,
    dimensions: '20ft × 7.5ft × 7.5ft',
    features: ['Multi-zone Thermograph', 'Dual-driver Verified', 'FASTag Net Priority'],
  },
  {
    id: 'veh-pharma-sprinter',
    name: 'Force Traveller Pharma Cryo',
    typeBadge: 'Pharma / Biologicals',
    capacityKg: 1400,
    tempRange: '2°C to 8°C Certified Cold Box',
    isRegulatedVerified: true,
    hasActiveReefer: true,
    isVerified: true,
    rating: 4.95,
    baseFare: 29500,
    baseRate: 29500,
    etaMinutes: 18,
    dimensions: '10ft × 5.8ft × 6ft',
    features: ['WHO-GDP Compliant', 'Calibrated Data Logger', 'GPS Tamper Shield'],
  },
  {
    id: 'veh-dry-container',
    name: 'Container 20ft Closed Body',
    typeBadge: 'General Dry Cargo',
    capacityKg: 9000,
    isRegulatedVerified: false,
    hasActiveReefer: false,
    isVerified: true,
    rating: 4.7,
    baseFare: 31200,
    baseRate: 31200,
    etaMinutes: 35,
    dimensions: '20ft × 8ft × 8.5ft',
    features: ['Weatherproof Seal', 'Hydraulic Tailgate', 'FASTag NPCI Connected'],
  },
  {
    id: 'veh-open-taurus',
    name: 'Tata Signa 2823 10-Wheeler Open',
    typeBadge: 'General / Heavy Machinery',
    capacityKg: 18000,
    isRegulatedVerified: false,
    hasActiveReefer: false,
    isVerified: true,
    rating: 4.6,
    baseFare: 44000,
    baseRate: 44000,
    etaMinutes: 60,
    dimensions: '28ft × 8ft Open Flatbed',
    features: ['Heavy Tarpaulin Lashing', 'High Tensile Straps', 'Highway Clearance'],
  }
];

const INITIAL_DRIVER: DriverInfo = {
  name: 'Rajesh Kumar',
  phone: '+91 98201 44820',
  photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
  rating: 4.92,
  totalTrips: 1482,
  vehicleRegistration: 'MH-04-GP-8192',
  vahanVerified: true,
  aadhaarMatched: true,
  carrierCompany: 'Apex Logistics Corp (Tier 1)',
};

const INITIAL_CUSTOMER: CustomerProfile = {
  id: 'cust-9921',
  fullName: 'Vikramaditya Singhania',
  companyName: 'Apex Pharmaceuticals & Cold-chain Ltd',
  phone: '+91 98201 44820',
  countryCode: '+91',
  email: 'ops.logistics@apexpharma.in',
  gstin: '27AABCU9603R1ZM',
  escrowCreditBalance: 250000,
  trustScore: 980,
  tripsCleared: 1482,
  onTimeSlaPercent: 99.4,
  registeredTrucksCount: 48,
  savedDocks: [
    {
      id: 'dock-1',
      title: 'Bhiwandi Central Logistics Hub',
      address: 'Plot 42, Building B, Dapode Industrial Corridor',
      city: 'Thane, Maharashtra',
      contact: 'Dockmaster Ramesh (+91 91234 56789)',
    },
    {
      id: 'dock-2',
      title: 'Whitefield Distribution Park',
      address: 'Gate 4, Export Promotion Industrial Park',
      city: 'Bengaluru, Karnataka',
      contact: 'Store Incharge Suresh (+91 98765 43210)',
    },
    {
      id: 'dock-3',
      title: 'Sanand Auto & Heavy Freight Park',
      address: 'GIDC Phase II, Bol Industrial Estate',
      city: 'Ahmedabad, Gujarat',
      contact: 'Gate Office 2 (+91 97123 45678)',
    }
  ],
};

const INITIAL_BOOKING: BookingState = {
  consignmentId: 'RL-9842',
  originAddress: 'Plot 42, Mankoli Naka, Bhiwandi, Mumbai MMR',
  originCity: 'Bhiwandi, Mumbai',
  destinationAddress: 'Terminal Gate 4, Whitefield EPIP Warehouse, Bengaluru',
  destinationCity: 'Bengaluru',
  estimatedWeightKg: 2150,
  selectedVehicleId: 'veh-reefer-van',
  securitySealId: 'RL-SEAL-88219-A',
  origin: {
    title: 'Bhiwandi Logistics Hub',
    city: 'Thane, MH',
    dock: 'Dock Bay 14 (Cold Storage Terminal)',
    pincode: '421302',
    contactName: 'Ramesh Sawant (Dock Supervisor)',
    contactPhone: '+91 98210 11223',
  },
  destination: {
    title: 'Whitefield Industrial Area',
    city: 'Bengaluru, KA',
    dock: 'Terminal Gate 4 (Cold Chain Receiving)',
    pincode: '560066',
    contactName: 'Anil Rao (Receiving Officer)',
    contactPhone: '+91 99011 88776',
  },
  cargoCategory: 'cold_chain',
  cargoDetails: {
    description: 'Temperature-Sensitive Active Biologicals (Vaccine Vials)',
    weightKg: 2150,
    declaredValue: 4850000,
    isHazardous: false,
    tempControlled: true,
    targetTempCelsius: 4.0,
  },
  selectedVehicle: INITIAL_VEHICLES[0],
  lockedFare: 34800,
  confirmedSurchargesTotal: 0,
  currentTotalFare: 34800,
  status: 'in_transit',
  driver: INITIAL_DRIVER,
  pendingSurcharge: null,
  pickupHandoff: {
    stage: 'pickup',
    terminalName: 'Bhiwandi Logistics Hub - Dock Bay 14',
    dockNumber: 'Bay 14',
    timestamp: 'Today, 04:15 AM',
    tamperSealId: 'RL-SEAL-88219-A',
    sealVerified: true,
    odometerKm: 42180,
    tempReadingCelsius: 3.6,
    authorizedSignatory: 'Ramesh Sawant (Warehouse Lead)',
    notes: 'Cryptographic tamper wire engaged. Ambient temperature 3.6°C within validated envelope.',
    completed: true,
  },
  dropoffHandoff: {
    stage: 'dropoff',
    terminalName: 'Whitefield Receiving Terminal - Gate 4',
    dockNumber: 'Gate 4',
    timestamp: '',
    tamperSealId: 'RL-SEAL-88219-A',
    sealVerified: false,
    odometerKm: 43022,
    tempReadingCelsius: 3.8,
    authorizedSignatory: 'Anil Rao (Inward Dockmaster)',
    notes: '',
    completed: false,
  },
  telematics: {
    currentLocation: 'NH 48 Expressway • Near Satara Bypass (Km 214)',
    coordinates: [17.6805, 74.0183],
    routeProgressPercent: 54,
    currentSpeedKmph: 62,
    currentTempCelsius: 3.8,
    fastagPlazaCount: 5,
    lastPingTime: '2 mins ago (IoT Satellite)',
  },
  createdAt: '2026-09-08 03:45 AM',
};

const INITIAL_REPORTS: ReportIncident[] = [
  {
    id: 'REP-4019',
    waybillId: 'RL-9104',
    targetType: 'vehicle',
    targetName: 'Eicher 2114XP (KA-01-MJ-4102)',
    category: 'temperature_breach',
    description: 'Intermittent reefer thermal excursion recorded near Hubballi bypass. Temperature spiked to +11.2°C for 38 minutes. Escrow freeze requested pending secondary lab assay.',
    attachmentName: 'thermo_log_hubballi_excursion.csv',
    geoTag: 'NH 48, Hubballi Toll Plaza (15.3647° N, 75.1240° E)',
    escrowLockedAmount: 42800,
    status: 'investigating',
    filedAt: 'Yesterday, 14:22 IST',
    assignedOfficer: {
      name: 'Virendra S.',
      tier: 'Senior Ops Desk Officer (Tier 2)',
      desk: 'Western Corridor Freight Protection Desk',
      status: 'online',
    },
    resolutionNotes: 'Carrier cold-log auditor requested raw telematics packet from VAHAN-IoT server. Payout remains locked in escrow.',
  }
];

const INITIAL_TRIP_HISTORY: HistoricalTrip[] = [
  {
    id: 'trip-1',
    consignmentId: 'RL-9842',
    originCity: 'Bhiwandi, MH',
    destinationCity: 'Bengaluru, KA',
    vehicleName: 'Tata 407 Reefer Van',
    vehicleReg: 'MH-04-GP-8192',
    cargoType: 'Cold-chain Pharma',
    completedDate: 'Active Now',
    totalFare: 34800,
    status: 'In Transit',
  },
  {
    id: 'trip-2',
    consignmentId: 'RL-9104',
    originCity: 'Vapi Industrial Estate, GJ',
    destinationCity: 'Peenya, Bengaluru, KA',
    vehicleName: 'Eicher 2114XP Reefer',
    vehicleReg: 'KA-01-MJ-4102',
    cargoType: 'Temperature Regulated',
    completedDate: 'Yesterday, 14:22',
    totalFare: 42800,
    status: 'Disputed',
    disputeId: 'REP-4019',
  },
  {
    id: 'trip-3',
    consignmentId: 'RL-8921',
    originCity: 'Sanand Industrial Cluster, GJ',
    destinationCity: 'Chakan Auto Hub, Pune, MH',
    vehicleName: 'Tata Signa 2823 10-Wheeler',
    vehicleReg: 'MH-12-RN-7731',
    cargoType: 'Heavy Machinery & Auto Parts',
    completedDate: '04 Sep 2026',
    totalFare: 51200,
    status: 'Delivered',
  },
  {
    id: 'trip-4',
    consignmentId: 'RL-8750',
    originCity: 'Jawaharlal Nehru Port Trust (JNPT)',
    destinationCity: 'Bhiwandi Container CFS',
    vehicleName: 'Container 20ft Closed Body',
    vehicleReg: 'MH-43-BB-9011',
    cargoType: 'Imported General Cargo',
    completedDate: '01 Sep 2026',
    totalFare: 16800,
    status: 'Delivered',
  },
  {
    id: 'trip-5',
    consignmentId: 'RL-8412',
    originCity: 'Hyderabad Pharma City, TS',
    destinationCity: 'Whitefield Industrial, KA',
    vehicleName: 'Force Cryo Sprinter',
    vehicleReg: 'TS-09-UB-3344',
    cargoType: 'Cold Chain Vaccines',
    completedDate: '28 Aug 2026',
    totalFare: 29500,
    status: 'Delivered',
  }
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'dispatch',
    senderName: 'Reload Automated Dispatch',
    text: 'Consignment #RL-9842 successfully boarded onto NH 48 corridor. All 4 fastag plazas cleared without detention.',
    timestamp: '04:20 AM',
  },
  {
    id: 'msg-2',
    sender: 'driver',
    senderName: 'Rajesh Kumar (Pilot)',
    text: 'Namaste Sir, crossed Pune bypass smoothly. Reefer compressor running steadily at 3.8°C. ETA Whitefield dock around 16:30.',
    timestamp: '06:15 AM',
  },
  {
    id: 'msg-3',
    sender: 'user',
    senderName: 'Vikramaditya (Consignor)',
    text: 'Understood Rajesh. The Whitefield receiving dockmaster has been notified. Keep the secondary temp logger engaged.',
    timestamp: '06:22 AM',
  }
];

export interface TelematicsState {
  etaHours: number;
  progressPercent: number;
  speedKmph: number;
  temperatureC: number;
  remainingDistanceKm: number;
  currentLocation: string;
  coordinates: [number, number];
  routeProgressPercent: number;
  currentSpeedKmph: number;
  currentTempCelsius?: number;
  fastagPlazaCount: number;
  lastPingTime: string;
}

interface AppContextType {
  // State
  isAuthenticated: boolean;
  loginPhone: string;
  customer: CustomerProfile;
  currentBooking: BookingState;
  vehicles: VehicleOption[];
  telematics: TelematicsState;
  pendingSurcharge: SurchargeRequest | null;
  reports: ReportIncident[];
  tripHistory: HistoricalTrip[];
  language: SupportedLanguage;
  t: TranslationDictionary;
  chatMessages: ChatMessage[];
  isSurchargeModalOpen: boolean;

  // Actions
  setLanguage: (lang: SupportedLanguage) => void;
  setLoginPhone: (phone: string) => void;
  login: (phone: string) => void;
  verifyOtp: (code: string) => boolean;
  logout: () => void;
  updateBookingDraft: (draft: Partial<BookingState> & {
    originAddress?: string;
    originCity?: string;
    destinationAddress?: string;
    destinationCity?: string;
    cargoCategory?: CargoCategory;
    estimatedWeightKg?: number;
  }) => void;
  updateBookingLocations: (originCity: string, destinationCity: string) => void;
  setCargoCategory: (cat: CargoCategory) => void;
  selectVehicle: (vehicle: VehicleOption) => void;
  selectVehicleAndLockFare: (vehicle: VehicleOption) => void;
  confirmBookingAndLockFare: (vehicle: VehicleOption) => void;
  advanceBookingStatus: (target?: BookingStatus) => void;
  triggerSurchargeModal: (request?: Partial<SurchargeRequest>) => void;
  closeSurchargeModal: () => void;
  confirmSurcharge: () => void;
  declineSurcharge: () => void;
  confirmPickup: (sealId?: string, signatory?: string) => void;
  confirmDelivery: (sealId?: string, signatory?: string) => void;
  confirmPickupHandoff: (sealId: string, signatory: string) => void;
  confirmDropoffHandoff: (sealId: string, signatory: string) => void;
  fileReport: (report: {
    targetType: 'driver' | 'vehicle' | 'company' | 'toll_dock';
    targetName: string;
    category: 'conduct' | 'vehicle_state' | 'pricing' | 'temperature_breach' | 'other';
    description: string;
    attachmentName?: string;
    attachmentDataUrl?: string;
  }) => string;
  settlePayment: (method: 'upi' | 'card') => void;
  sendChatMessage: (text: string) => void;
  resetToDefaultState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [loginPhone, setLoginPhone] = useState<string>('9820144820');
  const [customer, setCustomer] = useState<CustomerProfile>(INITIAL_CUSTOMER);
  const [currentBooking, setCurrentBooking] = useState<BookingState>(INITIAL_BOOKING);
  const [pendingSurcharge, setPendingSurcharge] = useState<SurchargeRequest | null>(null);
  const [isSurchargeModalOpen, setIsSurchargeModalOpen] = useState<boolean>(false);
  const [reports, setReports] = useState<ReportIncident[]>(INITIAL_REPORTS);
  const [tripHistory, setTripHistory] = useState<HistoricalTrip[]>(INITIAL_TRIP_HISTORY);
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  const t = translations[language] || translations.en;

  const telematics: TelematicsState = {
    etaHours: 14.5,
    progressPercent: currentBooking.telematics?.routeProgressPercent ?? 54,
    speedKmph: currentBooking.telematics?.currentSpeedKmph ?? 62,
    temperatureC: currentBooking.telematics?.currentTempCelsius ?? 3.8,
    remainingDistanceKm: Math.round(842 * (1 - (currentBooking.telematics?.routeProgressPercent ?? 54) / 100)),
    currentLocation: currentBooking.telematics?.currentLocation ?? 'NH 48 Expressway • Near Satara Bypass (Km 214)',
    coordinates: currentBooking.telematics?.coordinates ?? [17.6805, 74.0183],
    routeProgressPercent: currentBooking.telematics?.routeProgressPercent ?? 54,
    currentSpeedKmph: currentBooking.telematics?.currentSpeedKmph ?? 62,
    currentTempCelsius: currentBooking.telematics?.currentTempCelsius ?? 3.8,
    fastagPlazaCount: currentBooking.telematics?.fastagPlazaCount ?? 5,
    lastPingTime: currentBooking.telematics?.lastPingTime ?? '2 mins ago (IoT Satellite)',
  };

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };

  const login = (phone: string) => {
    setLoginPhone(phone);
  };

  const verifyOtp = (code: string) => {
    if (code.length === 6) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateBookingDraft = (draft: Partial<BookingState> & {
    originAddress?: string;
    originCity?: string;
    destinationAddress?: string;
    destinationCity?: string;
    cargoCategory?: CargoCategory;
    estimatedWeightKg?: number;
  }) => {
    setCurrentBooking(prev => {
      const originAddress = draft.originAddress ?? prev.originAddress ?? 'Plot 42, Mankoli Naka, Bhiwandi, Mumbai MMR';
      const originCity = draft.originCity ?? prev.originCity ?? 'Mumbai';
      const destinationAddress = draft.destinationAddress ?? prev.destinationAddress ?? 'Whitefield EPIP Warehouse, Bengaluru';
      const destinationCity = draft.destinationCity ?? prev.destinationCity ?? 'Bengaluru';
      const cargoCategory = draft.cargoCategory ?? prev.cargoCategory;
      const weightKg = draft.estimatedWeightKg ?? prev.cargoDetails?.weightKg ?? 2150;

      return {
        ...prev,
        ...draft,
        originAddress,
        originCity,
        destinationAddress,
        destinationCity,
        cargoCategory,
        estimatedWeightKg: weightKg,
        origin: {
          ...prev.origin,
          title: originAddress,
          city: originCity,
        },
        destination: {
          ...prev.destination,
          title: destinationAddress,
          city: destinationCity,
        },
        cargoDetails: {
          ...prev.cargoDetails,
          weightKg,
          tempControlled: cargoCategory === 'cold_chain' || cargoCategory === 'pharma' || cargoCategory === 'dairy',
        }
      };
    });
  };

  const updateBookingLocations = (originCity: string, destinationCity: string) => {
    setCurrentBooking(prev => ({
      ...prev,
      origin: {
        ...prev.origin,
        title: originCity.includes('Bhiwandi') ? 'Bhiwandi Logistics Hub' : originCity,
        city: originCity,
      },
      destination: {
        ...prev.destination,
        title: destinationCity.includes('Whitefield') ? 'Whitefield Industrial Area' : destinationCity,
        city: destinationCity,
      }
    }));
  };

  const setCargoCategory = (category: CargoCategory) => {
    setCurrentBooking(prev => {
      // If user changes category and selected vehicle is no longer suitable, reset or adjust
      const isRegulated = category === 'cold_chain' || category === 'pharma' || category === 'dairy';
      let selectedVehicle = prev.selectedVehicle;
      if (isRegulated && selectedVehicle && !selectedVehicle.isRegulatedVerified) {
        selectedVehicle = INITIAL_VEHICLES[0];
      }
      return {
        ...prev,
        cargoCategory: category,
        selectedVehicle,
        lockedFare: selectedVehicle ? selectedVehicle.baseFare : prev.lockedFare,
        currentTotalFare: (selectedVehicle ? selectedVehicle.baseFare : prev.lockedFare) + prev.confirmedSurchargesTotal,
        cargoDetails: {
          ...prev.cargoDetails,
          tempControlled: isRegulated,
        }
      };
    });
  };

  const selectVehicle = (vehicle: VehicleOption) => {
    setCurrentBooking(prev => ({
      ...prev,
      selectedVehicle: vehicle,
      selectedVehicleId: vehicle.id,
      lockedFare: vehicle.baseFare || vehicle.baseRate || prev.lockedFare,
      currentTotalFare: (vehicle.baseFare || vehicle.baseRate || prev.lockedFare) + prev.confirmedSurchargesTotal,
    }));
  };

  const confirmBookingAndLockFare = (vehicle: VehicleOption) => {
    setCurrentBooking(prev => ({
      ...prev,
      selectedVehicle: vehicle,
      selectedVehicleId: vehicle.id,
      lockedFare: vehicle.baseFare || vehicle.baseRate || prev.lockedFare,
      currentTotalFare: (vehicle.baseFare || vehicle.baseRate || prev.lockedFare) + prev.confirmedSurchargesTotal,
      status: 'accepted',
      driver: INITIAL_DRIVER,
    }));
  };

  const selectVehicleAndLockFare = (vehicle: VehicleOption) => {
    setCurrentBooking(prev => ({
      ...prev,
      selectedVehicle: vehicle,
      selectedVehicleId: vehicle.id,
      lockedFare: vehicle.baseFare,
      currentTotalFare: vehicle.baseFare + prev.confirmedSurchargesTotal,
      status: 'accepted',
      driver: INITIAL_DRIVER,
    }));
  };

  const advanceBookingStatus = (targetStatus?: BookingStatus) => {
    setCurrentBooking(prev => {
      let nextStatus: BookingStatus = prev.status;
      if (targetStatus) {
        nextStatus = targetStatus;
      } else {
        switch (prev.status) {
          case 'requested':
            nextStatus = 'accepted';
            break;
          case 'accepted':
            nextStatus = 'pickup_confirmed';
            break;
          case 'pickup_confirmed':
            nextStatus = 'in_transit';
            break;
          case 'in_transit':
            nextStatus = 'delivered';
            break;
          case 'delivered':
            nextStatus = 'closed';
            break;
          case 'closed':
            nextStatus = 'requested';
            break;
        }
      }

      // Update telematics progress accordingly
      let progress = prev.telematics.routeProgressPercent;
      if (nextStatus === 'requested') progress = 0;
      else if (nextStatus === 'accepted') progress = 10;
      else if (nextStatus === 'pickup_confirmed') progress = 20;
      else if (nextStatus === 'in_transit') progress = 65;
      else if (nextStatus === 'delivered' || nextStatus === 'closed') progress = 100;

      return {
        ...prev,
        status: nextStatus,
        telematics: {
          ...prev.telematics,
          routeProgressPercent: progress,
        }
      };
    });
  };

  const triggerSurchargeModal = (request?: Partial<SurchargeRequest>) => {
    const surcharge: SurchargeRequest = {
      id: `SUR-${Math.floor(1000 + Math.random() * 9000)}`,
      reason: request?.reason || 'Toll Plaza Surcharge (NH 48 Flyover Toll & Elevated Corridor)',
      category: request?.category || 'toll',
      amount: request?.amount || 80,
      requestedAt: 'Just now (Automated FASTag Trigger)',
      plazaOrLocation: request?.plazaOrLocation || 'Khed-Shivapur FASTag Plaza (Km 188)',
      status: 'pending',
    };
    setPendingSurcharge(surcharge);
    setCurrentBooking(prev => ({ ...prev, pendingSurcharge: surcharge }));
    setIsSurchargeModalOpen(true);
  };

  const closeSurchargeModal = () => {
    setIsSurchargeModalOpen(false);
  };

  /**
   * CRITICAL FARE RULE:
   * Only the "Confirm +₹X" button in the surcharge confirmation modal
   * is allowed to update the locked fare in state.
   */
  const confirmSurcharge = () => {
    if (!pendingSurcharge) return;
    const additional = pendingSurcharge.amount;
    
    setCurrentBooking(prev => {
      const newConfirmedTotal = prev.confirmedSurchargesTotal + additional;
      const newTotal = prev.lockedFare + newConfirmedTotal;
      return {
        ...prev,
        confirmedSurchargesTotal: newConfirmedTotal,
        currentTotalFare: newTotal,
        pendingSurcharge: null,
      };
    });

    setPendingSurcharge(null);
    setIsSurchargeModalOpen(false);

    // Add audit notice to chat
    setChatMessages(prev => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: 'dispatch',
        senderName: 'System Escrow Audit',
        text: `Consignor confirmed +₹${additional} toll surcharge at ${pendingSurcharge.plazaOrLocation}. New escrow total: ₹${currentBooking.lockedFare + additional}.`,
        timestamp: 'Just now',
      }
    ]);
  };

  const declineSurcharge = () => {
    setCurrentBooking(prev => ({
      ...prev,
      pendingSurcharge: null,
    }));
    setPendingSurcharge(null);
    setIsSurchargeModalOpen(false);
  };

  const confirmPickupHandoff = (sealId: string, signatory: string) => {
    setCurrentBooking(prev => ({
      ...prev,
      status: 'in_transit',
      pickupHandoff: {
        ...prev.pickupHandoff!,
        tamperSealId: sealId || prev.pickupHandoff?.tamperSealId || 'RL-SEAL-88219-A',
        authorizedSignatory: signatory || prev.pickupHandoff?.authorizedSignatory || 'Authorized Origin Dockmaster',
        timestamp: 'Just now (Verified)',
        sealVerified: true,
        completed: true,
      },
      telematics: {
        ...prev.telematics,
        routeProgressPercent: 30,
      }
    }));
  };

  const confirmDropoffHandoff = (sealId: string, signatory: string) => {
    setCurrentBooking(prev => ({
      ...prev,
      status: 'delivered',
      dropoffHandoff: {
        ...prev.dropoffHandoff!,
        tamperSealId: sealId || prev.dropoffHandoff?.tamperSealId || 'RL-SEAL-88219-A',
        authorizedSignatory: signatory || prev.dropoffHandoff?.authorizedSignatory || 'Authorized Inward Dockmaster',
        timestamp: 'Just now (Verified)',
        sealVerified: true,
        completed: true,
      },
      telematics: {
        ...prev.telematics,
        routeProgressPercent: 100,
      }
    }));
  };

  const confirmPickup = (sealId?: string, signatory?: string) => {
    confirmPickupHandoff(
      sealId || currentBooking.securitySealId || 'RL-SEAL-88219-A',
      signatory || 'Authorized Origin Dockmaster'
    );
  };

  const confirmDelivery = (sealId?: string, signatory?: string) => {
    confirmDropoffHandoff(
      sealId || currentBooking.securitySealId || 'RL-SEAL-88219-A',
      signatory || 'Authorized Inward Dockmaster'
    );
  };

  const fileReport = (reportData: {
    targetType: 'driver' | 'vehicle' | 'company' | 'toll_dock';
    targetName: string;
    category: 'conduct' | 'vehicle_state' | 'pricing' | 'temperature_breach' | 'other';
    description: string;
    attachmentName?: string;
    attachmentDataUrl?: string;
  }): string => {
    const newId = `REP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReport: ReportIncident = {
      id: newId,
      waybillId: currentBooking.consignmentId,
      targetType: reportData.targetType,
      targetName: reportData.targetName,
      category: reportData.category,
      description: reportData.description,
      attachmentName: reportData.attachmentName || 'consignment_photo.jpg',
      attachmentDataUrl: reportData.attachmentDataUrl,
      geoTag: `${currentBooking.telematics.currentLocation} (Verified EXIF)`,
      escrowLockedAmount: currentBooking.currentTotalFare,
      status: 'filed',
      filedAt: 'Just now',
      assignedOfficer: {
        name: 'Virendra S.',
        tier: 'Senior Ops Escalation Desk',
        desk: 'Terminal Dispute Desk Tier 2',
        status: 'online',
      },
    };

    setReports(prev => [newReport, ...prev]);

    // Also update history status if present
    setTripHistory(prev => prev.map(trip => {
      if (trip.consignmentId === currentBooking.consignmentId) {
        return {
          ...trip,
          status: 'Disputed',
          disputeId: newId,
        };
      }
      return trip;
    }));

    return newId;
  };

  const settlePayment = (method: 'upi' | 'card') => {
    const paidTrip: HistoricalTrip = {
      id: `trip-${Date.now()}`,
      consignmentId: currentBooking.consignmentId,
      originCity: currentBooking.origin.city,
      destinationCity: currentBooking.destination.city,
      vehicleName: currentBooking.selectedVehicle?.name || 'Reefer Van 14ft',
      vehicleReg: currentBooking.driver?.vehicleRegistration || 'MH-04-GP-8192',
      cargoType: currentBooking.cargoCategory === 'cold_chain' ? 'Cold-Chain Pharma' : 'General Freight',
      completedDate: 'Settled Just Now',
      totalFare: currentBooking.currentTotalFare,
      status: 'Delivered',
    };

    // Update history, mark booking closed
    setTripHistory(prev => [paidTrip, ...prev.filter(t => t.consignmentId !== currentBooking.consignmentId)]);
    setCurrentBooking(prev => ({
      ...prev,
      status: 'closed',
    }));
  };

  const sendChatMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      senderName: customer.fullName.split(' ')[0],
      text,
      timestamp: 'Just now',
    };
    setChatMessages(prev => [...prev, newMsg]);

    // Automated dispatch reply after 1s
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'dispatch',
          senderName: 'Port Desk Dispatch (Virendra S.)',
          text: `Acknowledged consignor instruction regarding #${currentBooking.consignmentId}. Telematics feed confirmed stable.`,
          timestamp: 'Just now',
        }
      ]);
    }, 1000);
  };

  const resetToDefaultState = () => {
    setCurrentBooking(INITIAL_BOOKING);
    setPendingSurcharge(null);
    setIsSurchargeModalOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        loginPhone,
        customer,
        currentBooking,
        vehicles: INITIAL_VEHICLES,
        telematics,
        pendingSurcharge,
        reports,
        tripHistory,
        language,
        t,
        chatMessages,
        isSurchargeModalOpen,
        setLanguage,
        setLoginPhone,
        login,
        verifyOtp,
        logout,
        updateBookingDraft,
        updateBookingLocations,
        setCargoCategory,
        selectVehicle,
        selectVehicleAndLockFare,
        confirmBookingAndLockFare,
        advanceBookingStatus,
        triggerSurchargeModal,
        closeSurchargeModal,
        confirmSurcharge,
        declineSurcharge,
        confirmPickup,
        confirmDelivery,
        confirmPickupHandoff,
        confirmDropoffHandoff,
        fileReport,
        settlePayment,
        sendChatMessage,
        resetToDefaultState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
