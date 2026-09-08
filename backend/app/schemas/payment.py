# app/schemas/payment.py

import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class PaymentCheckoutRequest(BaseModel):
    gateway: str = Field(default="mock_gateway", description="Payment gateway identifier")


class PaymentResponse(BaseModel):
    id: uuid.UUID
    booking_id: uuid.UUID
    amount: Decimal
    status: str
    gateway: str
    gateway_payment_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
