export type CargoCategory = 'general' | 'cold_chain' | 'pharma' | 'dairy' | 'other';

export type BookingStatus = 
  | 'requested'
  | 'accepted'
  | 'pickup_confirmed'
  | 'in_transit'
  | 'delivered'
  | 'closed';

export interface VehicleOption {
  id: string;
  name: string;
  typeBadge: string;
  capacityKg: number;
  tempRange?: string; // e.g. "-20°C to +4°C"
  isRegulatedVerified: boolean;
  baseFare: number;
  baseRate: number; // alias for baseFare
  etaMinutes: number;
  dimensions: string;
  features: string[];
  hasActiveReefer: boolean;
  isVerified: boolean;
  rating: number;
}

export interface SurchargeRequest {
  id: string;
  reason: string;
  category: 'toll' | 'detention' | 'route_diversion' | 'dock_handling';
  amount: number;
  requestedAt: string;
  plazaOrLocation: string;
  status: 'pending' | 'confirmed' | 'declined';
  receiptUrl?: string;
}

export interface DigitalHandoff {
  stage: 'pickup' | 'dropoff';
  terminalName: string;
  dockNumber: string;
  timestamp?: string;
  tamperSealId: string;
  sealVerified: boolean;
  odometerKm?: number;
  tempReadingCelsius?: number;
  authorizedSignatory: string;
  notes?: string;
  completed: boolean;
}

export interface DriverInfo {
  name: string;
  phone: string;
  photoUrl: string;
  rating: number;
  totalTrips: number;
  vehicleRegistration: string;
  vahanVerified: boolean;
  aadhaarMatched: boolean;
  carrierCompany: string;
}

export interface BookingState {
  consignmentId: string;
  originAddress?: string;
  originCity?: string;
  destinationAddress?: string;
  destinationCity?: string;
  estimatedWeightKg?: number;
  selectedVehicleId?: string;
  securitySealId?: string;
  origin: {
    title: string;
    city: string;
    dock: string;
    pincode: string;
    contactName: string;
    contactPhone: string;
  };
  destination: {
    title: string;
    city: string;
    dock: string;
    pincode: string;
    contactName: string;
    contactPhone: string;
  };
  cargoCategory: CargoCategory;
  cargoDetails: {
    description: string;
    weightKg: number;
    declaredValue: number;
    isHazardous: boolean;
    tempControlled: boolean;
    targetTempCelsius?: number;
  };
  selectedVehicle?: VehicleOption;
  lockedFare: number; // The locked base fare
  confirmedSurchargesTotal: number; // Sum of confirmed surcharges
  currentTotalFare: number; // lockedFare + confirmedSurchargesTotal
  status: BookingStatus;
  driver?: DriverInfo;
  pendingSurcharge: SurchargeRequest | null;
  pickupHandoff?: DigitalHandoff;
  dropoffHandoff?: DigitalHandoff;
  telematics: {
    currentLocation: string;
    coordinates: [number, number]; // [lat, lng]
    routeProgressPercent: number;
    currentSpeedKmph: number;
    currentTempCelsius?: number;
    fastagPlazaCount: number;
    lastPingTime: string;
  };
  createdAt: string;
}

export interface ReportIncident {
  id: string;
  waybillId: string;
  targetType: 'driver' | 'vehicle' | 'company' | 'toll_dock';
  targetName: string;
  category: 'conduct' | 'vehicle_state' | 'pricing' | 'temperature_breach' | 'other';
  description: string;
  attachmentDataUrl?: string;
  attachmentName?: string;
  geoTag?: string;
  escrowLockedAmount: number;
  status: 'filed' | 'investigating' | 'resolved';
  filedAt: string;
  assignedOfficer: {
    name: string;
    tier: string;
    desk: string;
    status: 'online' | 'offline';
  };
  resolutionNotes?: string;
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  companyName: string;
  phone: string;
  countryCode: string;
  email: string;
  gstin: string;
  escrowCreditBalance: number;
  trustScore: number;
  tripsCleared: number;
  onTimeSlaPercent: number;
  registeredTrucksCount: number;
  savedDocks: {
    id: string;
    title: string;
    address: string;
    city: string;
    contact: string;
  }[];
}

export interface HistoricalTrip {
  id: string;
  consignmentId: string;
  originCity: string;
  destinationCity: string;
  vehicleName: string;
  vehicleReg: string;
  cargoType: string;
  completedDate: string;
  totalFare: number;
  status: 'Delivered' | 'In Transit' | 'Disputed' | 'Cancelled';
  disputeId?: string;
}

export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'gu' | 'ta' | 'te' | 'kn';

export interface LanguageOption {
  code: SupportedLanguage;
  nativeName: string;
  englishName: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'driver' | 'dispatch';
  senderName: string;
  text: string;
  timestamp: string;
}
