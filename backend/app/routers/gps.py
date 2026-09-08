# app/routers/gps.py

import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.booking import Booking
from app.models.gps_ping import GPSPing
from app.models.user import User
from app.schemas.gps import GPSPingCreate, GPSPingResponse

router = APIRouter(prefix="/api/v1/bookings", tags=["gps"])


@router.post("/{booking_id}/gps-pings", response_model=GPSPingResponse, status_code=status.HTTP_201_CREATED)
def create_gps_ping(
    booking_id: uuid.UUID,
    request: GPSPingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Fetch booking
    stmt = select(Booking).where(Booking.id == booking_id)
    booking = db.execute(stmt).scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
        
    # 2. Validate booking status is in_transit (defensively handle Enum values)
    booking_status = booking.status.value if hasattr(booking.status, "value") else booking.status
    if booking_status != "in_transit":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="GPS pings can only be submitted while booking is in_transit"
        )
        
    # 3. Anti-spoofing check: only the assigned driver can submit GPS pings for this booking
    if current_user.id != booking.driver_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the assigned driver can submit GPS pings for this booking"
        )
        
    # 4. Create GPSPing row (only include explicit timestamp if provided)
    ping_kwargs = {
        "booking_id": booking_id,
        "driver_id": current_user.id,
        "lat": request.lat,
        "lng": request.lng
    }
    if request.timestamp is not None:
        ping_kwargs["timestamp"] = request.timestamp
        
    new_ping = GPSPing(**ping_kwargs)
    
    db.add(new_ping)
    db.commit()
    db.refresh(new_ping)
    
    return new_ping