# app/services/fare_service.py

import math
from decimal import Decimal, ROUND_HALF_UP


def haversine(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """
    Calculate the great circle distance in kilometers between two points 
    on the earth (specified in decimal degrees).
    """
    # Earth radius in kilometers
    r = 6371.0
    
    # Convert decimal degrees to radians
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lng2 - lng1)
    
    # Haversine formula
    a = math.sin(delta_phi / 2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return r * c


VEHICLE_RATES = {
    "bike": 8.0,
    "tempo": 15.0,
    "pickup_8ft": 20.0,
    "pickup_14ft": 28.0,
    "truck": 35.0,
    "cold_chain_van": 40.0
}

CARGO_MULTIPLIERS = {
    "general": 1.00,
    "dairy": 1.20,
    "cold_chain": 1.30,
    "pharma": 1.25,
    "other": 1.00
}

BASE_CHARGE = 50.0


def calculate_fare_for_distance(
    distance_km: float,
    vehicle_type: str,
    cargo_category: str = "general"
) -> Decimal:
    """
    Calculates a locked base fare using distance in km, vehicle type rate,
    and cargo category multiplier, plus fixed base charge:
    distance * vehicle_rate * cargo_multiplier + base_charge
    """
    if vehicle_type not in VEHICLE_RATES:
        raise ValueError(f"Unrecognized vehicle_type: '{vehicle_type}'")
        
    cargo_key = cargo_category.value if hasattr(cargo_category, "value") else str(cargo_category)
    multiplier = CARGO_MULTIPLIERS.get(cargo_key, 1.00)
    
    raw_fare = BASE_CHARGE + (distance_km * VEHICLE_RATES[vehicle_type] * multiplier)
    return Decimal(str(raw_fare)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def calculate_fare(
    pickup_lat: float, 
    pickup_lng: float, 
    dropoff_lat: float, 
    dropoff_lng: float, 
    vehicle_type: str,
    cargo_category: str = "general"
) -> Decimal:
    """
    Calculates a locked base fare using the haversine distance between pickup and 
    dropoff, a per-km rate that varies by vehicle_type, cargo multiplier, plus a 
    small fixed base charge.
    """
    distance_km = haversine(pickup_lat, pickup_lng, dropoff_lat, dropoff_lng)
    return calculate_fare_for_distance(distance_km, vehicle_type, cargo_category)