"""
Chat messages are scoped per booking_id — a customer and driver can only message each other 
within the context of an active booking. This table stores message history for retrieval; 
real-time delivery (WebSocket push) is handled separately in a real-time/chat service layer, 
not here.
"""

# app/models/message.py

import uuid
from datetime import datetime, timezone

from sqlalchemy import Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Message(Base):
    __tablename__ = "messages"

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
    sender_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        ForeignKey("users.id"), 
        nullable=False
    )
    
    content: Mapped[str] = mapped_column(Text, nullable=False)
    
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        nullable=False,
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships (One-directional as requested)
    booking: Mapped["Booking"] = relationship("Booking")
    sender: Mapped["User"] = relationship("User")