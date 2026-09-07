"""
This function must NEVER return an unverified vehicle, even as a fallback when no 
verified vehicle exists. Returning None in that case is the CORRECT behavior — the 
calling booking router must surface this as an explicit 409 'no verified vehicle 
available' error, never silently degrade to an unverified match. This is a core trust 
USP of the platform, not a minor detail.
"""

# app/services/matching_service.py

from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.vehicle import Vehicle, VehicleVerificationStatus


def find_verified_vehicle(
    db: Session, 
    vehicle_type: str, 
    pickup_lat: float, 
    pickup_lng: float
) -> Optional[Vehicle]:
    """
    Finds a verified vehicle of the requested type. Returns None if no verified 
    vehicle exists — the caller MUST treat None as 'no verified vehicle available' 
    and return a 409 error. NEVER fall back to an unverified vehicle as a default.
    """
    
    # TODO: Proper nearest-vehicle selection using haversine distance should replace 
    # this once driver live-location tracking exists (via gps_pings), since right now 
    # there's no reliable "current location" field to compare against.
    
    stmt = select(Vehicle).where(
        Vehicle.type == vehicle_type,
        Vehicle.verification_status == VehicleVerificationStatus.verified
    )
    
    return db.execute(stmt).scalars().first()