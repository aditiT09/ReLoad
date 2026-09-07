# app/models/booking.py

import enum
import uuid
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional

from sqlalchemy import String, Float, Numeric, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class CargoCategory(str, enum.Enum):
    general = "general"
    pharma = "pharma"
    cold_chain = "cold_chain"
    dairy = "dairy"
    other = "other"


class BookingStatus(str, enum.Enum):
    requested = "requested"
    accepted = "accepted"
    pickup_confirmed = "pickup_confirmed"
    in_transit = "in_transit"
    delivered = "delivered"
    closed = "closed"
    cancelled = "cancelled"


class PaymentStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"
    refunded = "refunded"


class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    customer_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        ForeignKey("users.id"), 
        nullable=False
    )
    driver_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PG_UUID(as_uuid=True), 
        ForeignKey("users.id"), 
        nullable=True
    )
    vehicle_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        PG_UUID(as_uuid=True), 
        ForeignKey("vehicles.id"), 
        nullable=True
    )
    
    pickup_address: Mapped[str] = mapped_column(String, nullable=False)
    pickup_lat: Mapped[float] = mapped_column(Float, nullable=False)
    pickup_lng: Mapped[float] = mapped_column(Float, nullable=False)
    
    dropoff_address: Mapped[str] = mapped_column(String, nullable=False)
    dropoff_lat: Mapped[float] = mapped_column(Float, nullable=False)
    dropoff_lng: Mapped[float] = mapped_column(Float, nullable=False)

    cargo_category: Mapped[CargoCategory] = mapped_column(
        Enum(CargoCategory, name="cargo_category_enum"), 
        nullable=False
    )
    status: Mapped[BookingStatus] = mapped_column(
        Enum(BookingStatus, name="booking_status_enum"), 
        default=BookingStatus.requested,
        nullable=False
    )
    
    base_fare: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    final_fare: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2), nullable=True)
    payment_status: Mapped[PaymentStatus] = mapped_column(
        Enum(PaymentStatus, name="payment_status_enum"), 
        default=PaymentStatus.pending,
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    customer: Mapped["User"] = relationship(
        "User",
        back_populates="bookings_as_customer",
        foreign_keys=[customer_id]
    )
    
    driver: Mapped[Optional["User"]] = relationship(
        "User",
        back_populates="bookings_as_driver",
        foreign_keys=[driver_id]
    )
    
    vehicle: Mapped[Optional["Vehicle"]] = relationship(
        "Vehicle",
        back_populates="bookings",
        foreign_keys=[vehicle_id]
    )