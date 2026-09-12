// src/lib/locationService.ts
// Geocoding, distance, transit estimation, and fare calculation for ReLoad

export interface GeoCoordinate {
  lat: number;
  lng: number;
  displayName: string;
}

export interface PlaceSuggestion {
  name: string;
  subtext: string;
  corridor: string;
  city: string;
  state: string;
}

export const PRESET_LOCATIONS: PlaceSuggestion[] = [
  // Delhi-NCR
  {
    name: 'Noida Electronic City',
    subtext: 'Sector 62 Industrial Area, Noida',
    corridor: 'NH-24 / FNG',
    city: 'Noida',
    state: 'Uttar Pradesh',
  },
  {
    name: 'Noida Sector 62',
    subtext: 'Institutional & Tech Hub, Noida',
    corridor: 'NH-24 Corridor',
    city: 'Noida',
    state: 'Uttar Pradesh',
  },
  {
    name: 'Noida Sector 18',
    subtext: 'Atta Commercial Hub, Noida',
    corridor: 'DND Flyway',
    city: 'Noida',
    state: 'Uttar Pradesh',
  },
  {
    name: 'Greater Noida Pari Chowk',
    subtext: 'Industrial & Freight Cluster',
    corridor: 'Yamuna Expressway',
    city: 'Greater Noida',
    state: 'Uttar Pradesh',
  },
  {
    name: 'Sarojini Nagar',
    subtext: 'Ring Road Market & Logistics Hub',
    corridor: 'Barapullah / Ring Rd',
    city: 'South Delhi',
    state: 'Delhi',
  },
  {
    name: 'Connaught Place',
    subtext: 'Central Commercial District, New Delhi',
    corridor: 'Inner Ring Road',
    city: 'New Delhi',
    state: 'Delhi',
  },
  {
    name: 'Okhla Industrial Area Phase III',
    subtext: 'Logistics & Cargo Warehousing Zone',
    corridor: 'Mathura Road',
    city: 'South Delhi',
    state: 'Delhi',
  },
  {
    name: 'Mayapuri Industrial Area Phase II',
    subtext: 'Heavy Machinery & Goods Hub',
    corridor: 'Ring Road West',
    city: 'West Delhi',
    state: 'Delhi',
  },
  {
    name: 'Gurugram Cyber City',
    subtext: 'DLF Phase 2 / NH-48 Corridor',
    corridor: 'NH-48 Expressway',
    city: 'Gurugram',
    state: 'Haryana',
  },
  {
    name: 'Manesar Industrial Model Township (IMT)',
    subtext: 'Automotive & Freight Corridor',
    corridor: 'KMP Expressway',
    city: 'Gurugram',
    state: 'Haryana',
  },
  {
    name: 'Faridabad Industrial Sector 15',
    subtext: 'Engineering & Manufacturing Cluster',
    corridor: 'Delhi-Agra Highway',
    city: 'Faridabad',
    state: 'Haryana',
  },
  {
    name: 'Ghaziabad Loni Industrial Corridor',
    subtext: 'Inter-State Cargo Transport Hub',
    corridor: 'Eastern Peripheral',
    city: 'Ghaziabad',
    state: 'Uttar Pradesh',
  },
  {
    name: 'Kundli Industrial Corridor',
    subtext: 'Sonipat Highway Freight Gateway',
    corridor: 'KMP / NH-44',
    city: 'Sonipat',
    state: 'Haryana',
  },

  // Maharashtra Corridor
  {
    name: 'Mumbai Port (Nhava Sheva Gate 2)',
    subtext: 'JNPT International Container Terminal',
    corridor: 'NH-48 / Coastal Hub',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
  },
  {
    name: 'Bhiwandi Logistics Park',
    subtext: 'Mankoli / Purna Warehousing Hub',
    corridor: 'Mumbai-Nashik Highway',
    city: 'Thane',
    state: 'Maharashtra',
  },
  {
    name: 'Panvel MIDC Industrial Area',
    subtext: 'Expressway Interchange Dock',
    corridor: 'Mumbai-Pune Expy',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
  },
  {
    name: 'Pune Industrial Cluster, Chakan Phase II',
    subtext: 'Automotive & Cold Chain Logistics Hub',
    corridor: 'Chakan Auto Hub',
    city: 'Pune',
    state: 'Maharashtra',
  },
  {
    name: 'Pune MIDC Bhosari',
    subtext: 'Pimpri-Chinchwad Heavy Transport Zone',
    corridor: 'Old Mumbai-Pune Hwy',
    city: 'Pune',
    state: 'Maharashtra',
  },
  {
    name: 'Hinjawadi Infotech Park Phase 3',
    subtext: 'Commercial Express Gateway',
    corridor: 'Mumbai-Bangalore Hwy',
    city: 'Pune',
    state: 'Maharashtra',
  },
  {
    name: 'Nagpur Butibori Industrial Zone',
    subtext: 'Central India Multimodal Logistics Park',
    corridor: 'Samruddhi Mahamarg',
    city: 'Nagpur',
    state: 'Maharashtra',
  },
  {
    name: 'Nashik MIDC Satpur',
    subtext: 'Industrial & Perishable Cargo Center',
    corridor: 'Mumbai-Nashik Expy',
    city: 'Nashik',
    state: 'Maharashtra',
  },

  // Uttar Pradesh & Northern Hubs
  {
    name: 'Lucknow Transport Nagar',
    subtext: 'Kanpur Road Multimodal Goods Hub',
    corridor: 'Shaheed Path / NH-27',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
  },
  {
    name: 'Hazratganj Central',
    subtext: 'Central Dispatch Point, Lucknow',
    corridor: 'Shaheed Path',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
  },
  {
    name: 'Gomti Nagar Logistics Bay',
    subtext: 'Vibhuti Khand Commercial District',
    corridor: 'Kisan Path Ring',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
  },
  {
    name: 'Kanpur Panki Industrial Estate',
    subtext: 'Heavy Freight & Leather Goods Hub',
    corridor: 'NH-19 / GT Road',
    city: 'Kanpur',
    state: 'Uttar Pradesh',
  },
  {
    name: 'Agra Foundry Nagar',
    subtext: 'Transport Nagar Commercial Gateway',
    corridor: 'Yamuna Expressway',
    city: 'Agra',
    state: 'Uttar Pradesh',
  },
  {
    name: 'Varanasi Transport Nagar',
    subtext: 'Purvanchal Freight Corridor',
    corridor: 'Purvanchal Expressway',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
  },

  // Other Major Metros
  {
    name: 'Bengaluru Peenya Industrial Area',
    subtext: 'Asia’s Largest Industrial Freight Zone',
    corridor: 'NH-48 Tumkur Road',
    city: 'Bengaluru',
    state: 'Karnataka',
  },
  {
    name: 'Bengaluru Electronic City Phase 1',
    subtext: 'Hosur Road Logistics Corridor',
    corridor: 'Hosur Elevated Expy',
    city: 'Bengaluru',
    state: 'Karnataka',
  },
  {
    name: 'Hyderabad Patancheru Industrial Hub',
    subtext: 'Outer Ring Road Cargo Gateway',
    corridor: 'Nehru ORR',
    city: 'Hyderabad',
    state: 'Telangana',
  },
  {
    name: 'Chennai Sriperumbudur Hub',
    subtext: 'Auto & Electronics Export Corridor',
    corridor: 'Bangalore-Chennai Hwy',
    city: 'Chennai',
    state: 'Tamil Nadu',
  },
  {
    name: 'Ahmedabad Sanand Industrial Hub',
    subtext: 'Automotive & FMCG Logistics Corridor',
    corridor: 'Ahmedabad-Vadodara',
    city: 'Ahmedabad',
    state: 'Gujarat',
  },
  {
    name: 'Jaipur Vishwakarma Industrial Area',
    subtext: 'VKI Road No. 14 Freight Terminal',
    corridor: 'NH-48 Delhi-Jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
  },
  {
    name: 'Chandigarh Industrial Area Phase 1',
    subtext: 'Panchkula-Mohali Express Junction',
    corridor: 'Himalayan Expressway',
    city: 'Chandigarh',
    state: 'Punjab / Haryana',
  },
  {
    name: 'Delhi IGI Cargo Terminal',
    subtext: 'Air Cargo Logistics Complex & Aerocity',
    corridor: 'Delhi-Gurugram Expressway',
    city: 'New Delhi',
    state: 'Delhi',
  },
  {
    name: 'Surat Hazira Industrial Port Hub',
    subtext: 'Heavy Engineering & Petrochemical Port',
    corridor: 'Hazira Coastal Highway',
    city: 'Surat',
    state: 'Gujarat',
  },
  {
    name: 'Indore Pithampur Auto Cluster',
    subtext: 'Madhya Pradesh Special Economic Zone',
    corridor: 'Indore-Bhopal Highway',
    city: 'Indore',
    state: 'Madhya Pradesh',
  },
  {
    name: 'Kolkata Dankuni Freight Terminal',
    subtext: 'Eastern Dedicated Freight Hub',
    corridor: 'NH-19 / Durgapur Expy',
    city: 'Kolkata',
    state: 'West Bengal',
  },
];

export function getPlaceSuggestions(query: string, maxResults = 6): PlaceSuggestion[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return PRESET_LOCATIONS.slice(0, maxResults);

  const tokens = clean.split(/[\s,.\-_/]+/).filter(Boolean);

  const scored = PRESET_LOCATIONS.map((place) => {
    const nameLower = place.name.toLowerCase();
    const cityLower = place.city.toLowerCase();
    const subtextLower = place.subtext.toLowerCase();
    const corridorLower = place.corridor.toLowerCase();
    const stateLower = place.state.toLowerCase();
    const combined = `${nameLower} ${cityLower} ${subtextLower} ${corridorLower} ${stateLower}`;

    let score = 0;
    if (nameLower === clean) {
      score = 100;
    } else if (nameLower.startsWith(clean)) {
      score = 85;
    } else if (cityLower === clean) {
      score = 80;
    } else if (cityLower.startsWith(clean)) {
      score = 75;
    } else {
      const words = nameLower.split(/[\s,()\-]+/);
      if (words.some((w) => w.startsWith(clean))) {
        score = 65;
      } else if (nameLower.includes(clean)) {
        score = 55;
      } else if (tokens.length > 0 && tokens.every((tok) => combined.includes(tok))) {
        score = 50;
      } else if (cityLower.includes(clean)) {
        score = 40;
      } else if (tokens.some((tok) => nameLower.includes(tok))) {
        score = 30;
      } else if (subtextLower.includes(clean)) {
        score = 25;
      } else if (corridorLower.includes(clean)) {
        score = 20;
      } else if (tokens.some((tok) => combined.includes(tok))) {
        score = 15;
      }
    }

    return { place, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (scored.length === 0) {
    // Return closest defaults if nothing matched
    return PRESET_LOCATIONS.slice(0, Math.min(3, maxResults));
  }

  return scored.slice(0, maxResults).map((item) => item.place);
}

// Known logistics hubs, cities, and neighborhoods across India
export const KNOWN_LOCATIONS: Record<string, { lat: number; lng: number; corridor?: string }> = {
  // Delhi NCR
  'noida electronic city': { lat: 28.6280, lng: 77.3649, corridor: 'NH-24 / FNG Corridor' },
  'noida sector 62': { lat: 28.6271, lng: 77.3625, corridor: 'NH-24 Corridor' },
  'noida sector 18': { lat: 28.5708, lng: 77.3271, corridor: 'DND Flyway' },
  'noida': { lat: 28.5355, lng: 77.3910, corridor: 'Noida-Greater Noida Expressway' },
  'greater noida': { lat: 28.4744, lng: 77.5040, corridor: 'Yamuna Expressway' },
  'sarojini nagar': { lat: 28.5779, lng: 77.1990, corridor: 'Ring Road / Barapullah' },
  'sarojni nagar': { lat: 28.5779, lng: 77.1990, corridor: 'Ring Road / Barapullah' },
  'connaught place': { lat: 28.6315, lng: 77.2167, corridor: 'Inner Ring Road' },
  'new delhi': { lat: 28.6139, lng: 77.2090, corridor: 'Ring Road' },
  'delhi': { lat: 28.6139, lng: 77.2090, corridor: 'Ring Road' },
  'gurugram': { lat: 28.4595, lng: 77.0266, corridor: 'NH-48 / Delhi-Jaipur Expy' },
  'gurgaon': { lat: 28.4595, lng: 77.0266, corridor: 'NH-48 / Delhi-Jaipur Expy' },
  'manesar': { lat: 28.3541, lng: 76.9388, corridor: 'KMP Expressway' },
  'faridabad': { lat: 28.4089, lng: 77.3178, corridor: 'Delhi-Agra Highway' },
  'ghaziabad': { lat: 28.6692, lng: 77.4538, corridor: 'Eastern Peripheral Expy' },
  'kundli': { lat: 28.8789, lng: 77.1264, corridor: 'KMP Expressway' },

  // Maharashtra Corridor
  'mumbai port': { lat: 18.9499, lng: 72.9515, corridor: 'NH-48 Expressway' },
  'nhava sheva': { lat: 18.9499, lng: 72.9515, corridor: 'NH-48 Expressway' },
  'jnpt': { lat: 18.9499, lng: 72.9515, corridor: 'NH-48 Expressway' },
  'mumbai': { lat: 19.0760, lng: 72.8777, corridor: 'Western Express Highway' },
  'bhiwandi': { lat: 19.2967, lng: 73.0631, corridor: 'Mumbai-Nashik Highway' },
  'navi mumbai': { lat: 19.0330, lng: 73.0297, corridor: 'Sion-Panvel Highway' },
  'panvel': { lat: 18.9894, lng: 73.1175, corridor: 'Mumbai-Pune Expressway' },
  'chakan': { lat: 18.7606, lng: 73.8636, corridor: 'NH-50 / Pune MIDC' },
  'chakan phase ii': { lat: 18.7606, lng: 73.8636, corridor: 'Chakan Auto Hub' },
  'pune': { lat: 18.5204, lng: 73.8567, corridor: 'Mumbai-Pune Expressway' },
  'pune industrial cluster': { lat: 18.7606, lng: 73.8636, corridor: 'Chakan Auto Hub' },
  'nagpur': { lat: 21.1458, lng: 79.0882, corridor: 'Samruddhi Mahamarg' },
  'nashik': { lat: 19.9975, lng: 73.7898, corridor: 'Mumbai-Nashik Expy' },

  // Uttar Pradesh & Northern Hubs
  'lucknow': { lat: 26.8467, lng: 80.9462, corridor: 'Agra-Lucknow Expressway' },
  'hazratganj': { lat: 26.8467, lng: 80.9462, corridor: 'Shaheed Path' },
  'gomti nagar': { lat: 26.8606, lng: 80.9858, corridor: 'Kisan Path' },
  'kanpur': { lat: 26.4499, lng: 80.3319, corridor: 'NH-19 / GT Road' },
  'agra': { lat: 27.1767, lng: 78.0081, corridor: 'Yamuna Expressway' },
  'varanasi': { lat: 25.3176, lng: 82.9739, corridor: 'Purvanchal Expressway' },
  'meerut': { lat: 28.9845, lng: 77.7064, corridor: 'Delhi-Meerut Expressway' },

  // Other Major Metros
  'bengaluru': { lat: 12.9716, lng: 77.5946, corridor: 'Hosur Road / NH-44' },
  'bangalore': { lat: 12.9716, lng: 77.5946, corridor: 'Hosur Road / NH-44' },
  'hyderabad': { lat: 17.3850, lng: 78.4867, corridor: 'Nehru Outer Ring Road' },
  'chennai': { lat: 13.0827, lng: 80.2707, corridor: 'Grand Southern Trunk' },
  'kolkata': { lat: 22.5726, lng: 88.3639, corridor: 'NH-16 / Kona Expressway' },
  'ahmedabad': { lat: 23.0225, lng: 72.5714, corridor: 'Ahmedabad-Vadodara Expy' },
  'jaipur': { lat: 26.9124, lng: 75.7873, corridor: 'NH-48 Delhi-Jaipur' },
  'chandigarh': { lat: 30.7333, lng: 76.7794, corridor: 'NH-44 Corridor' },
};

export function resolveCoordinates(query: string): { lat: number; lng: number; corridor?: string } {
  const normalized = query.toLowerCase().trim();
  if (!normalized) {
    return { lat: 19.0760, lng: 72.8777 }; // default Mumbai
  }

  // Exact match
  if (KNOWN_LOCATIONS[normalized]) {
    return KNOWN_LOCATIONS[normalized];
  }

  // Partial substring match
  for (const [key, val] of Object.entries(KNOWN_LOCATIONS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return val;
    }
  }

  // Token-based matching
  const tokens = normalized.split(/[\s,.-]+/);
  for (const token of tokens) {
    if (token.length < 3) continue;
    for (const [key, val] of Object.entries(KNOWN_LOCATIONS)) {
      if (key.split(' ').includes(token)) {
        return val;
      }
    }
  }

  // Deterministic pseudo-coordinate for arbitrary locations based on string hash
  let hash = 0;
  for (let i = 0; i < query.length; i++) {
    hash = (hash << 5) - hash + query.charCodeAt(i);
    hash |= 0;
  }
  const latOffset = ((Math.abs(hash) % 1000) / 1000) * 0.35;
  const lngOffset = ((Math.abs(hash >> 3) % 1000) / 1000) * 0.35;

  return {
    lat: 28.5355 + latOffset,
    lng: 77.3910 + lngOffset,
    corridor: 'Regional Highway Route',
  };
}

export function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface RouteEstimate {
  isValid: boolean;
  distanceKm: number;
  durationText: string;
  corridor: string;
  pickupCoords: { lat: number; lng: number };
  dropoffCoords: { lat: number; lng: number };
}

export function calculateRouteEstimate(pickupQuery: string, destinationQuery: string): RouteEstimate {
  const pTrim = pickupQuery.trim();
  const dTrim = destinationQuery.trim();

  if (!pTrim || !dTrim) {
    const missing = !pTrim && !dTrim ? 'pickup and destination' : !pTrim ? 'pickup location' : 'destination';
    return {
      isValid: false,
      distanceKm: 0,
      durationText: `Enter ${missing}`,
      corridor: 'Route Pending',
      pickupCoords: { lat: 0, lng: 0 },
      dropoffCoords: { lat: 0, lng: 0 },
    };
  }

  const pickup = resolveCoordinates(pTrim);
  const dropoff = resolveCoordinates(dTrim);

  const straightLine = haversineDistanceKm(pickup.lat, pickup.lng, dropoff.lat, dropoff.lng);

  // Road distance multiplier (roads are not straight lines; ~1.25x - 1.35x)
  let roadDistance = Math.round(straightLine * 1.28);

  // Edge case: if locations are same name, return minimum local dock distance
  if (pTrim.toLowerCase() === dTrim.toLowerCase()) {
    roadDistance = 4;
  } else if (roadDistance < 5) {
    roadDistance = 5;
  }

  // Duration calculation based on commercial freight speeds
  let durationText = '';
  if (roadDistance <= 30) {
    const mins = Math.max(15, Math.round(roadDistance * 1.7));
    durationText = `~${mins} mins`;
  } else if (roadDistance <= 90) {
    const hours = (roadDistance / 40).toFixed(1);
    durationText = `~${hours} hrs`;
  } else {
    const hours = Math.floor(roadDistance / 48);
    const mins = Math.round(((roadDistance % 48) / 48) * 60);
    durationText = mins > 0 ? `~${hours}.${Math.round(mins / 6)} hrs` : `~${hours} hrs`;
  }

  const corridor =
    pickup.corridor || dropoff.corridor || (roadDistance > 80 ? 'National Highway Corridor' : 'City Express Ring');

  return {
    isValid: true,
    distanceKm: roadDistance,
    durationText: `${durationText} via ${corridor}`,
    corridor,
    pickupCoords: { lat: pickup.lat, lng: pickup.lng },
    dropoffCoords: { lat: dropoff.lat, lng: dropoff.lng },
  };
}

export interface DynamicFare {
  baseFare: number;
  tollEstimate: number;
  gst: number;
  totalFare: number;
  formattedFare: string;
}

export function calculateVehicleFares(distanceKm: number, isColdChain: boolean): Record<string, DynamicFare> {
  if (distanceKm <= 0) {
    const emptyFare: DynamicFare = {
      baseFare: 0,
      tollEstimate: 0,
      gst: 0,
      totalFare: 0,
      formattedFare: '—',
    };
    return {
      'reefer-32': emptyFare,
      'container-20': emptyFare,
      'bolero-14': emptyFare,
      'tata-ace': emptyFare,
    };
  }

  // Matches backend fare_service: distance * rate * cargoMultiplier + baseCharge
  const compute = (ratePerKm: number, cargoMultiplier: number, tollRate: number): DynamicFare => {
    const baseFare = Math.round(distanceKm * ratePerKm * cargoMultiplier + 50);
    const tollEstimate = distanceKm > 30 ? Math.round(distanceKm * tollRate) : 100;
    const subtotal = baseFare + tollEstimate;
    const gst = Math.round(subtotal * 0.05); // 5% GST on commercial freight
    const totalFare = subtotal + gst;

    return {
      baseFare,
      tollEstimate,
      gst,
      totalFare,
      formattedFare: `₹${totalFare.toLocaleString('en-IN')}`,
    };
  };

  return {
    'reefer-32': compute(40, isColdChain ? 1.30 : 1.15, 6.5),
    'container-20': compute(35, 1.0, 4.2),
    'bolero-14': compute(28, 1.0, 2.8),
    'tata-ace': compute(20, 1.0, 1.5),
  };
}
