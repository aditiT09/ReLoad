"""
Captures photo + geo-tag + timestamp proof at both pickup and drop-off. A booking should 
only be allowed to progress past pickup_confirmed or delivered status once BOTH 
confirmed_by_customer and confirmed_by_driver are true for the relevant stage — this dual 
confirmation is a core trust USP and must not be bypassed.
"""

# app/models/handoff_proof.py

import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Float, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class HandoffStage(str, enum.Enum):
    pickup = "pickup"
    dropoff = "dropoff"


class HandoffProof(Base):
    __tablename__ = "handoff_proofs"

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
    
    stage: Mapped[HandoffStage] = mapped_column(
        Enum(HandoffStage, name="handoff_stage_enum"), 
        nullable=False
    )
    
    photo_url: Mapped[str] = mapped_column(String, nullable=False)
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    lng: Mapped[float] = mapped_column(Float, nullable=False)
    
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )
    
    confirmed_by_customer: Mapped[bool] = mapped_column(
        Boolean, 
        nullable=False, 
        default=False
    )
    confirmed_by_driver: Mapped[bool] = mapped_column(
        Boolean, 
        nullable=False, 
        default=False
    )

    # Relationships (One-directional as requested)
    booking: Mapped["Booking"] = relationship("Booking")