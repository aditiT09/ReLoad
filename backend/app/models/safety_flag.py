"""
This table is written by a separate rule-based safety anomaly detection module (NOT a 
trained ML model — route-deviation and long-stop detection are threshold/geometry-based). 
The backend's job is to store and serve these flags via API, not to calculate them. 
The trust-score module consumes unresolved/high-severity flags from this table as one input 
to its scoring formula — do not duplicate trust-score calculation logic here.
"""

# app/models/safety_flag.py

import enum
import uuid
from datetime import datetime, timezone
from typing import Optional, Dict, Any

from sqlalchemy import DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class SafetyFlagType(str, enum.Enum):
    route_deviation = "route_deviation"
    long_stop = "long_stop"


class SafetyFlagSeverity(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"


class SafetyFlagStatus(str, enum.Enum):
    unresolved = "unresolved"
    acknowledged = "acknowledged"
    resolved = "resolved"


class SafetyFlag(Base):
    __tablename__ = "safety_flags"

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
    
    flag_type: Mapped[SafetyFlagType] = mapped_column(
        Enum(SafetyFlagType, name="safety_flag_type_enum"), 
        nullable=False
    )
    severity: Mapped[SafetyFlagSeverity] = mapped_column(
        Enum(SafetyFlagSeverity, name="safety_flag_severity_enum"), 
        nullable=False
    )
    status: Mapped[SafetyFlagStatus] = mapped_column(
        Enum(SafetyFlagStatus, name="safety_flag_status_enum"), 
        default=SafetyFlagStatus.unresolved,
        nullable=False
    )
    
    details: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSONB, 
        nullable=True
    )
    
    detected_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )
    resolved_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), 
        nullable=True
    )

    # Relationships (One-directional as requested)
    booking: Mapped["Booking"] = relationship("Booking")