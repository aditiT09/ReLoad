"""
This utility is OPTIONAL and NOT used to write to demand_logs — the demand_logs table 
stores only raw pickup_lat/pickup_lng/booking_created_at per the frozen ML data contract. 
This function exists only as a potential shared convenience utility, in case the ML module 
or an admin/analytics view wants a consistent zone-bucketing approach without duplicating 
grid logic. It is NOT called anywhere in the booking creation flow.
"""

def get_zone_id(lat: float, lng: float) -> str:
    """
    Buckets coordinates into a coarse grid zone by rounding lat/lng to 2 decimal 
    places, returning a string like "26.45_80.33".
    """
    return f"{lat:.2f}_{lng:.2f}"