# app/schemas/handoff.py

import uuid
from datetime import datetime
from typing import Literal
from pydantic import BaseModel, ConfigDict, Field


class HandoffProofCreate(BaseModel):
    stage: Literal["pickup", "dropoff"]
    photo_url: str = Field(..., min_length=1)
    lat: float
    lng: float


class HandoffProofResponse(BaseModel):
    id: uuid.UUID
    booking_id: uuid.UUID
    stage: str
    photo_url: str
    lat: float
    lng: float
    timestamp: datetime
    confirmed_by_customer: bool
    confirmed_by_driver: bool

    model_config = ConfigDict(from_attributes=True)
