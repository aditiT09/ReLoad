"""
Notifications are created for: booking status changes, surcharge requests (this is the 
enforcement mechanism ensuring a surcharge is never missed/unnoticed by the customer), and 
report status updates. Delivery mechanism (push notification via FCM, in-app toast, etc.) is 
handled by a separate real-time/notification service layer, not here — this table is just 
the persistent record.
"""

# app/models/notification.py

import uuid
from datetime import datetime, timezone

from sqlalchemy import String, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        ForeignKey("users.id"), 
        nullable=False
    )
    
    type: Mapped[str] = mapped_column(String, nullable=False)
    content: Mapped[str] = mapped_column(String, nullable=False)
    
    read: Mapped[bool] = mapped_column(
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
    user: Mapped["User"] = relationship("User")