import enum
import uuid
from datetime import datetime, timezone
from typing import Optional, List

from sqlalchemy import String, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class UserRole(str, enum.Enum):
    customer = "customer"
    driver = "driver"
    company_admin = "company_admin"


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    role: Mapped[UserRole] = mapped_column(Enum(UserRole, name="user_role_enum"), nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    phone: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String, unique=True, index=True, nullable=True)
    password_hash: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships (using string references since related models are defined later)
    vehicles: Mapped[List["Vehicle"]] = relationship(
        "Vehicle",
        back_populates="driver",
        foreign_keys="[Vehicle.driver_id]"
    )

    bookings_as_customer: Mapped[List["Booking"]] = relationship(
        "Booking",
        back_populates="customer",
        foreign_keys="[Booking.customer_id]"
    )

    bookings_as_driver: Mapped[List["Booking"]] = relationship(
        "Booking",
        back_populates="driver",
        foreign_keys="[Booking.driver_id]"
    )