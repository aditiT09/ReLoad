"""
This table stores the driver's LIVE, MOVING location during an active in_transit booking. 
This is fundamentally different from demand_logs, which stores the customer's static pickup 
location at booking-creation time for demand forecasting. Do NOT merge these two concepts. 
gps_pings feeds the separate route-deviation/long-stop safety anomaly detection module, not 
the demand forecasting module.
"""

# app/models/gps_ping.py

import uuid
from datetime import datetime, timezone

from sqlalchemy import Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class GPSPing(Base):
    __tablename__ = "gps_pings"

    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    booking_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        ForeignKey("bookings.id"), 
        nullable=False
    )
    driver_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        ForeignKey("users.id"), 
        nullable=False
    )
    
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    lng: Mapped[float] = mapped_column(Float, nullable=False)
    
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships (One-directional as requested)
    booking: Mapped["Booking"] = relationship("Booking")
    driver: Mapped["User"] = relationship("User")