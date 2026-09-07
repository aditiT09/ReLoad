"""
A driver's overall verification status should require ALL required document types to be 
present, verified=True, and unexpired — not just a single flag. This check is enforced in 
the verification service layer, not here. Documents expiring within a configurable window 
(e.g. 30 days) should be flagged by that service layer as 'expiring soon', not by this model.
"""

# app/models/document.py

import enum
import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import String, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class DocumentType(str, enum.Enum):
    KYC = "KYC"
    insurance = "insurance"
    permit = "permit"
    RC = "RC"
    fitness_certificate = "fitness_certificate"


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        primary_key=True, 
        default=uuid.uuid4
    )
    driver_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        ForeignKey("users.id"), 
        nullable=False
    )
    
    doc_type: Mapped[DocumentType] = mapped_column(
        Enum(DocumentType, name="document_type_enum"), 
        nullable=False
    )
    
    file_url: Mapped[str] = mapped_column(String, nullable=False)
    
    expiry_date: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), 
        nullable=True
    )
    
    verified: Mapped[bool] = mapped_column(
        Boolean, 
        nullable=False, 
        default=False
    )

    # Relationships (One-directional as requested)
    driver: Mapped["User"] = relationship("User")