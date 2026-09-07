import uuid
from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict
class VehicleCreate(BaseModel):
    driver_id: uuid.UUID
    type: Literal["bike", "tempo", "pickup_8ft", "pickup_14ft", "truck", "cold_chain_van"]
    registration_number: str
    registration_year: int
class VehicleResponse(BaseModel):
    id: uuid.UUID
    driver_id: uuid.UUID
    type: str
    registration_number: str
    registration_year: int
    verification_status: str
    last_checked_date: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)