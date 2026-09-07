# app/schemas/gps.py

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class GPSPingCreate(BaseModel):
    lat: float
    lng: float
    
    # If not provided, the backend will default to the current server time when saving.
    # Note: booking_id and driver_id are intentionally omitted. They are populated 
    # via the URL path parameter and the authenticated JWT respectively to prevent spoofing.
    timestamp: Optional[datetime] = None


class GPSPingResponse(BaseModel):
    id: uuid.UUID
    booking_id: uuid.UUID
    driver_id: uuid.UUID
    lat: float
    lng: float
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)