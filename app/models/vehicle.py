import enum
import uuid
from datetime import datetime
from typing import Optional, List

from sqlalchemy import String, Integer, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class VehicleType(str, enum.Enum):
    bike = "bike"
    tempo = "tempo"
    pickup_8ft = "pickup_8ft"
    pickup_14ft = "pickup_14ft"
    truck = "truck"
    cold_chain_van = "cold_chain_van"


class VehicleVerificationStatus(str, enum.Enum):
    verified = "verified"
    due = "due"
    expired = "expired"


class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    driver_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        ForeignKey("users.id"), 
        nullable=False
    )
    type: Mapped[VehicleType] = mapped_column(
        Enum(VehicleType, name="vehicle_type_enum"), 
        nullable=False
    )
    registration_number: Mapped[str] = mapped_column(
        String, 
        unique=True, 
        nullable=False
    )
    registration_year: Mapped[int] = mapped_column(
        Integer, 
        nullable=False
    )
    verification_status: Mapped[VehicleVerificationStatus] = mapped_column(
        Enum(VehicleVerificationStatus, name="vehicle_verification_status_enum"), 
        default=VehicleVerificationStatus.due,
        nullable=False
    )
    last_checked_date: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), 
        nullable=True
    )

    # Relationships
    driver: Mapped["User"] = relationship(
        "User",
        back_populates="vehicles",
        foreign_keys=[driver_id]
    )
    
    bookings: Mapped[List["Booking"]] = relationship(
        "Booking",
        back_populates="vehicle"
    )