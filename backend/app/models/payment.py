# app/models/payment.py

import enum
import uuid
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional

from sqlalchemy import String, Numeric, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class PaymentRecordStatus(str, enum.Enum):
    pending = "pending"
    held = "held"
    released = "released"
    disputed = "disputed"
    refunded = "refunded"


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    booking_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        ForeignKey("bookings.id"), 
        unique=True,
        nullable=False
    )
    
    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    status: Mapped[PaymentRecordStatus] = mapped_column(
        Enum(PaymentRecordStatus, name="payment_record_status_enum"),
        default=PaymentRecordStatus.pending,
        nullable=False
    )
    
    gateway: Mapped[str] = mapped_column(String, default="mock_gateway", nullable=False)
    gateway_payment_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    booking: Mapped["Booking"] = relationship("Booking")
