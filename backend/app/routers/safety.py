# app/routers/safety.py

import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.booking import Booking
from app.models.safety_flag import SafetyFlag

router = APIRouter(prefix="/api/v1/bookings", tags=["safety"])


# Local response schema for safety flags
class SafetyFlagResponse(BaseModel):
    id: uuid.UUID
    booking_id: uuid.UUID
    flag_type: str
    severity: str
    status: str
    details: Optional[Dict[str, Any]] = None
    detected_at: datetime
    resolved_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


@router.get("/{booking_id}/safety-flags", response_model=List[SafetyFlagResponse])
def get_booking_safety_flags(booking_id: uuid.UUID, db: Session = Depends(get_db)):
    # 1. Ensure the booking exists
    booking_stmt = select(Booking).where(Booking.id == booking_id)
    booking = db.execute(booking_stmt).scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
        
    # 2. Query safety flags for this booking, ordered by most recent first
    flags_stmt = select(SafetyFlag).where(
        SafetyFlag.booking_id == booking_id
    ).order_by(SafetyFlag.detected_at.desc())
    
    flags = db.execute(flags_stmt).scalars().all()
    
    return flags