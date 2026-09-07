"""
A single low-severity report must NEVER auto-suspend a driver or auto-dismiss — status only 
moves open -> investigating -> resolved through explicit review. Suspension is only triggered 
past a configurable complaint threshold within a rolling time window, enforced in the trust-
score/report-handling service layer, not here in the model.
"""

# app/models/report.py

import enum
import uuid
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import String, Text, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ReportTargetType(str, enum.Enum):
    driver = "driver"
    vehicle = "vehicle"
    company = "company"


class ReportCategory(str, enum.Enum):
    conduct = "conduct"
    vehicle_condition = "vehicle_condition"
    pricing = "pricing"
    other = "other"


class ReportStatus(str, enum.Enum):
    open = "open"
    investigating = "investigating"
    resolved = "resolved"


class Report(Base):
    __tablename__ = "reports"

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
    reporter_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        ForeignKey("users.id"), 
        nullable=False
    )
    
    target_type: Mapped[ReportTargetType] = mapped_column(
        Enum(ReportTargetType, name="report_target_type_enum"), 
        nullable=False
    )
    category: Mapped[ReportCategory] = mapped_column(
        Enum(ReportCategory, name="report_category_enum"), 
        nullable=False
    )
    description: Mapped[str] = mapped_column(Text, nullable=False)
    
    evidence_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    status: Mapped[ReportStatus] = mapped_column(
        Enum(ReportStatus, name="report_status_enum"), 
        default=ReportStatus.open,
        nullable=False
    )
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships (One-directional as requested)
    booking: Mapped["Booking"] = relationship("Booking")
    reporter: Mapped["User"] = relationship("User")