"""
A surcharge must NEVER silently modify booking.final_fare. The flow is: create a 
SurchargeRequest row -> customer explicitly confirms via the API (setting 
customer_confirmed = True) -> only then does the booking service layer update 
booking.final_fare. This model itself never touches the Booking row directly.
"""

# app/models/surcharge_request.py

import uuid
from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import String, Numeric, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class SurchargeRequest(Base):
    __tablename__ = "surcharge_requests"

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
    
    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    reason: Mapped[str] = mapped_column(String, nullable=False)
    
    customer_confirmed: Mapped[bool] = mapped_column(
        Boolean, 
        nullable=False, 
        default=False
    )
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships (One-directional as requested)
    booking: Mapped["Booking"] = relationship("Booking")