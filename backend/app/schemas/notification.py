# app/schemas/notification.py

import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class NotificationResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    type: str
    content: str
    read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
