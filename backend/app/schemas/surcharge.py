# app/schemas/surcharge.py

import uuid
from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field


class SurchargeRequestCreate(BaseModel):
    amount: Decimal = Field(..., gt=0, description="Surcharge amount must be positive")
    reason: str = Field(..., min_length=1, description="Reason for surcharge request")


class SurchargeRequestResponse(BaseModel):
    id: uuid.UUID
    booking_id: uuid.UUID
    amount: Decimal
    reason: str
    customer_confirmed: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
