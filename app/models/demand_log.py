"""
This table's schema is FROZEN. It is the stable data contract consumed by a separate
ML demand-forecasting module. Do NOT rename fields, do NOT add zone_id or any derived fields,
and do NOT add driver GPS data here — see gps_pings for that. Any schema change requires
coordination with the ML engineer, since their Random Forest training pipeline depends on
these exact raw fields: pickup_lat, pickup_lng, booking_created_at.
"""

# app/models/demand_log.py

import uuid
from datetime import datetime

from sqlalchemy import Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class DemandLog(Base):
    __tablename__ = "demand_logs"

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
    
    pickup_lat: Mapped[float] = mapped_column(Float, nullable=False)
    pickup_lng: Mapped[float] = mapped_column(Float, nullable=False)
    
    booking_created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        nullable=False
    )

    # Relationships (One-directional as requested)
    booking: Mapped["Booking"] = relationship("Booking")