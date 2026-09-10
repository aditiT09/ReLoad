export type ScreenType = 
  | 'login'
  | 'signup'
  | 'otp'
  | 'verification_status'
  | 'home'
  | 'active_trip'
  | 'handoff'
  | 'chat'
  | 'trust_score'
  | 'history'
  | 'profile';

export type CargoType = 'standard' | 'cold_chain' | 'regulated_hazmat';

export type TripStatus = 
  | 'heading_to_pickup'
  | 'at_pickup'
  | 'cargo_loaded'
  | 'en_route_delivery'
  | 'at_dropoff'
  | 'completed';

export interface SurchargeItem {
  id: string;
  reason: string;
  amount: number;
  status: 'requested' | 'approved' | 'declined';
  requestedAt: string;
  approvedAt?: string;
  note?: string;
}

export interface ColdChainData {
  targetTempMin: number; // e.g. 2
  targetTempMax: number; // e.g. 8
  currentTemp: number; // e.g. 4.2
  unit: '°C';
  status: 'optimal' | 'warning' | 'critical';
  sensorId: string;
  lastPing: string;
}

export interface CargoJob {
  id: string;
  orderNumber: string;
  title: string;
  cargoType: CargoType;
  weight: string;
  dimensions: string;
  packagesCount: number;
  requiredVehicleType: string;
  pickup: {
    facilityName: string;
    address: string;
    dock: string;
    contactName: string;
    contactPhone: string;
    readyTime: string;
    distanceAway: string;
    notes: string;
  };
  dropoff: {
    facilityName: string;
    address: string;
    dock: string;
    recipientName: string;
    recipientPhone: string;
    requiredBy: string;
    distanceFromPickup: string;
    securityCode: string;
    notes: string;
  };
  baseFare: number;
  surcharges: SurchargeItem[];
  tripStatus: TripStatus;
  coldChain?: ColdChainData;
  hazardClass?: string;
  specialInstructions: string[];
}

export type CertStatus = 'verified' | 'due' | 'expired';

export interface Certification {
  id: string;
  title: string;
  category: 'Driver' | 'Vehicle' | 'Regulated Cargo';
  status: CertStatus;
  issuedDate: string;
  expiryDate: string;
  badgeNumber: string;
  verifiedBy: string;
  description: string;
}

export interface Vehicle {
  id: string;
  makeModel: string;
  licensePlate: string;
  type: 'Refrigerated Van' | 'Dry Cargo Van' | 'Hazmat Flatbed';
  isReeferCertified: boolean;
  isHazmatCertified: boolean;
  reeferTempMin?: number;
  reeferTempMax?: number;
  maxPayloadKg: number;
  odometer: string;
  inspectionStatus: CertStatus;
}

export interface DriverProfile {
  id: string;
  fullName: string;
  phone: string;
  callSign: string;
  avatarUrl: string;
  memberSince: string;
  trustRating: number; // e.g. 4.98
  totalTrips: number;
  onTimePercent: number; // e.g. 98
  coldChainCompliancePercent: number; // e.g. 100
  acceptanceRatePercent: number; // e.g. 96
  selectedVehicleId: string;
}

export interface ChatMessage {
  id: string;
  sender: 'driver' | 'customer' | 'dispatch';
  senderName: string;
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}
