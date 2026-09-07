# app/schemas/booking.py

import uuid
from datetime import datetime
from decimal import Decimal
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict


class BookingCreate(BaseModel):
    customer_id: uuid.UUID
    pickup_address: str
    pickup_lat: float
    pickup_lng: float
    dropoff_address: str
    dropoff_lat: float
    dropoff_lng: float
    cargo_category: Literal["general", "pharma", "cold_chain", "dairy", "other"]
    
    # This field is used only for matching at booking time. 
    # It is NOT stored directly on the Booking row, as the actual 
    # assigned vehicle_id gets set by the matching service.
    vehicle_type: Literal["bike", "tempo", "pickup_8ft", "pickup_14ft", "truck", "cold_chain_van"]


class BookingStatusUpdate(BaseModel):
    status: Literal[
        "requested", 
        "accepted", 
        "pickup_confirmed", 
        "in_transit", 
        "delivered", 
        "closed", 
        "cancelled"
    ]


class BookingResponse(BaseModel):
    id: uuid.UUID
    customer_id: uuid.UUID
    driver_id: Optional[uuid.UUID] = None
    vehicle_id: Optional[uuid.UUID] = None
    
    pickup_address: str
    pickup_lat: float
    pickup_lng: float
    
    dropoff_address: str
    dropoff_lat: float
    dropoff_lng: float
    
    cargo_category: str
    status: str
    
    base_fare: Decimal
    final_fare: Optional[Decimal] = None
    payment_status: str
    
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)