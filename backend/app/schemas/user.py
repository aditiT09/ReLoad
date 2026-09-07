# app/schemas/user.py

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class UserResponse(BaseModel):
    id: uuid.UUID
    role: str
    name: str
    phone: str
    email: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)