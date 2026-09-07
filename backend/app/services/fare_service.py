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


def calculate_fare(
    pickup_lat: float, 
    pickup_lng: float, 
    dropoff_lat: float, 
    dropoff_lng: float, 
    vehicle_type: str
) -> Decimal:
    """
    Calculates a locked base fare using the haversine distance between pickup and 
    dropoff, a per-km rate that varies by vehicle_type, plus a small fixed base charge.
    """
    rates_per_km = {
        "bike": 8.0,
        "tempo": 15.0,
        "pickup_8ft": 20.0,
        "pickup_14ft": 28.0,
        "truck": 35.0,
        "cold_chain_van": 40.0
    }
    
    base_charge = 50.0
    
    if vehicle_type not in rates_per_km:
        raise ValueError(f"Unrecognized vehicle_type: '{vehicle_type}'")
        
    distance_km = haversine(pickup_lat, pickup_lng, dropoff_lat, dropoff_lng)
    
    # Calculate float value first
    raw_fare = base_charge + (distance_km * rates_per_km[vehicle_type])
    
    # Convert string representation of the float to Decimal to prevent floating point 
    # precision issues during instantiation, then quantize to 2 decimal places
    final_fare = Decimal(str(raw_fare)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    
    return final_fare