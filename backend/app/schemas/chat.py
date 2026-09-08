# app/schemas/chat.py

import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class MessageCreate(BaseModel):
    content: str = Field(..., min_length=1)


class MessageResponse(BaseModel):
    id: uuid.UUID
    booking_id: uuid.UUID
    sender_id: uuid.UUID
    content: str
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)
