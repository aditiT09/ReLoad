"""
Trust scores must always be explainable, never a black box — component_breakdown must be 
populated whenever score is calculated, showing exactly which factors contributed and by how 
much. This table stores only the CURRENT score per subject; it is not a historical log. 
The weighting formula that produces this score is owned by the trust-score service layer, 
not this model. This table may consume unresolved/high-severity rows from safety_flags as 
one input, coordinated with whoever owns that weighting.
"""

# app/models/trust_score.py

import enum
import uuid
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional, Dict, Any

from sqlalchemy import Numeric, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class TrustSubjectType(str, enum.Enum):
    driver = "driver"
    company = "company"


class TrustScore(Base):
    __tablename__ = "trust_scores"

    # Composite Primary Key: subject_id + subject_type
    subject_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        primary_key=True
    )
    subject_type: Mapped[TrustSubjectType] = mapped_column(
        Enum(TrustSubjectType, name="trust_subject_type_enum"), 
        primary_key=True
    )
    
    score: Mapped[Decimal] = mapped_column(Numeric(5, 2), nullable=False)
    
    component_breakdown: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSONB, 
        nullable=True
    )
    
    last_updated: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )