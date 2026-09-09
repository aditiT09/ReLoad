"""Verification lifecycle and explainable trust-score calculations."""

import uuid
from datetime import datetime, timedelta, timezone
from decimal import Decimal
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models import (
    Booking, BookingStatus, Document, DocumentType, PaymentStatus, Report,
    ReportCategory, SafetyFlag, SafetyFlagSeverity, SafetyFlagStatus,
    TrustScore, TrustSubjectType, User, UserRole, Vehicle,
    VehicleVerificationStatus,
)

REQUIRED_DOCUMENT_TYPES = tuple(DocumentType)
EXPIRING_SOON_DAYS = 30
ROLLING_REPORT_DAYS = 90
REPORT_REVIEW_THRESHOLD = 3


def refresh_vehicle_verification(vehicle: Vehicle, now: datetime | None = None) -> Vehicle:
    """Apply the six-month due and seven-month expired lifecycle in memory."""
    now = now or datetime.now(timezone.utc)
    if vehicle.last_checked_date is None:
        vehicle.verification_status = VehicleVerificationStatus.expired
        return vehicle
    checked_at = vehicle.last_checked_date
    if checked_at.tzinfo is None:
        checked_at = checked_at.replace(tzinfo=timezone.utc)
    age = now - checked_at
    due_after = timedelta(days=settings.VERIFICATION_DUE_MONTHS * 30)
    expired_after = timedelta(days=(settings.VERIFICATION_DUE_MONTHS + 1) * 30)
    if age >= expired_after:
        vehicle.verification_status = VehicleVerificationStatus.expired
    elif age >= due_after:
        vehicle.verification_status = VehicleVerificationStatus.due
    else:
        vehicle.verification_status = VehicleVerificationStatus.verified
    return vehicle


def document_status(document: Document, now: datetime | None = None) -> str:
    now = now or datetime.now(timezone.utc)
    if not document.verified:
        return "unverified"
    if document.expiry_date is None:
        return "missing_expiry"
    expiry = document.expiry_date
    if expiry.tzinfo is None:
        expiry = expiry.replace(tzinfo=timezone.utc)
    if expiry < now:
        return "expired"
    if expiry <= now + timedelta(days=EXPIRING_SOON_DAYS):
        return "expiring_soon"
    return "valid"


def document_completeness(db: Session, driver_id: uuid.UUID, now: datetime | None = None) -> float:
    now = now or datetime.now(timezone.utc)
    documents = db.execute(select(Document).where(Document.driver_id == driver_id)).scalars().all()
    valid_types = {document.doc_type for document in documents if document_status(document, now) == "valid"}
    return len(valid_types.intersection(REQUIRED_DOCUMENT_TYPES)) / len(REQUIRED_DOCUMENT_TYPES)


def _driver_score(db: Session, driver_id: uuid.UUID, now: datetime) -> tuple[float, dict[str, Any]]:
    completed = db.execute(select(func.count(Booking.id)).where(
        Booking.driver_id == driver_id,
        Booking.status.in_([BookingStatus.delivered, BookingStatus.closed]),
    )).scalar_one()
    cancelled = db.execute(select(func.count(Booking.id)).where(
        Booking.driver_id == driver_id, Booking.status == BookingStatus.cancelled,
    )).scalar_one()
    total_driver_bookings = completed + cancelled
    # The shared schema has no pickup/delivery timestamps, so completed bookings
    # are the auditable proxy for on-time completion until those fields exist.
    on_time_rate = 100.0 if total_driver_bookings == 0 else completed / total_driver_bookings * 100

    reports = db.execute(select(Report).join(Booking, Booking.id == Report.booking_id).where(
        Booking.driver_id == driver_id,
        Report.created_at >= now - timedelta(days=ROLLING_REPORT_DAYS),
    )).scalars().all()
    # Report severity is not stored in the shared model; categories provide a
    # transparent interim severity proxy rather than pretending it is ML.
    complaint_weight = sum({
        ReportCategory.conduct: 1.0,
        ReportCategory.vehicle_condition: 1.0,
        ReportCategory.pricing: 0.75,
        ReportCategory.other: 0.5,
    }.get(report.category, 0.5) for report in reports)
    complaint_score = max(0.0, 100.0 - complaint_weight * 10.0)

    vehicles = db.execute(select(Vehicle).where(Vehicle.driver_id == driver_id)).scalars().all()
    for vehicle in vehicles:
        refresh_vehicle_verification(vehicle, now)
    verification_score = (
        sum(vehicle.verification_status == VehicleVerificationStatus.verified for vehicle in vehicles)
        / len(vehicles) * 100 if vehicles else 0.0
    )
    documents_score = document_completeness(db, driver_id, now) * 100
    verification_documents_score = (verification_score + documents_score) / 2

    flags = db.execute(select(SafetyFlag).join(Booking, Booking.id == SafetyFlag.booking_id).where(
        Booking.driver_id == driver_id, SafetyFlag.status != SafetyFlagStatus.resolved,
    )).scalars().all()
    safety_penalty = sum({
        SafetyFlagSeverity.low: 5.0,
        SafetyFlagSeverity.medium: 15.0,
        SafetyFlagSeverity.high: 30.0,
    }.get(flag.severity, 10.0) for flag in flags)
    safety_score = max(0.0, 100.0 - safety_penalty)

    # Defensible weights: 50% on-time, 25% complaints, 15% verification/docs,
    # and 10% unresolved safety flags.
    score = on_time_rate * 0.50 + complaint_score * 0.25 + verification_documents_score * 0.15 + safety_score * 0.10
    return round(score, 2), {
        "on_time_completion": round(on_time_rate, 2),
        "complaints": round(complaint_score, 2),
        "vehicle_verification": round(verification_score, 2),
        "document_completeness": round(documents_score, 2),
        "verification_and_documents": round(verification_documents_score, 2),
        "unresolved_safety_flags": round(safety_score, 2),
        "review_required": len(reports) >= REPORT_REVIEW_THRESHOLD,
        "review_threshold": REPORT_REVIEW_THRESHOLD,
        "weights": {"on_time": 0.50, "complaints": 0.25, "verification_documents": 0.15, "safety_flags": 0.10},
        "rolling_report_window_days": ROLLING_REPORT_DAYS,
    }


def _company_score(db: Session, company_id: uuid.UUID, now: datetime) -> tuple[float, dict[str, Any]]:
    bookings = db.execute(select(Booking).where(Booking.customer_id == company_id)).scalars().all()
    total = len(bookings)
    cancellation_score = 100.0 if not total else (1 - sum(b.status == BookingStatus.cancelled for b in bookings) / total) * 100
    payment_score = 100.0 if not bookings else sum(b.payment_status == PaymentStatus.paid for b in bookings) / total * 100
    complaints = db.execute(select(func.count(Report.id)).join(Booking, Booking.id == Report.booking_id).where(
        Booking.customer_id == company_id, Report.target_type == "company",
        Report.created_at >= now - timedelta(days=ROLLING_REPORT_DAYS),
    )).scalar_one()
    complaint_score = max(0.0, 100.0 - complaints * 10.0)
    score = cancellation_score * 0.40 + payment_score * 0.35 + complaint_score * 0.25
    return round(score, 2), {
        "cancellation_reliability": round(cancellation_score, 2),
        "payment_reliability": round(payment_score, 2),
        "complaints_by_drivers": round(complaint_score, 2),
        "review_required": complaints >= REPORT_REVIEW_THRESHOLD,
        "review_threshold": REPORT_REVIEW_THRESHOLD,
        "weights": {"cancellation": 0.40, "payment": 0.35, "complaints": 0.25},
        "rolling_report_window_days": ROLLING_REPORT_DAYS,
    }


def calculate_trust_score(db: Session, subject_id: uuid.UUID, subject_type: TrustSubjectType | str) -> TrustScore:
    """Calculate, persist, and return the current explainable score."""
    subject_type = TrustSubjectType(subject_type)
    now = datetime.now(timezone.utc)
    user = db.execute(select(User).where(User.id == subject_id)).scalar_one_or_none()
    if user is None or (
        subject_type == TrustSubjectType.driver and user.role != UserRole.driver
    ) or (
        subject_type == TrustSubjectType.company and user.role not in (UserRole.customer, UserRole.company_admin)
    ):
        raise ValueError("Trust subject not found or role does not match")
    if subject_type == TrustSubjectType.driver:
        score, breakdown = _driver_score(db, subject_id, now)
    else:
        score, breakdown = _company_score(db, subject_id, now)
    trust_score = db.get(TrustScore, {"subject_id": subject_id, "subject_type": subject_type})
    if trust_score is None:
        trust_score = TrustScore(subject_id=subject_id, subject_type=subject_type)
        db.add(trust_score)
    trust_score.score = Decimal(str(score))
    trust_score.component_breakdown = breakdown
    trust_score.last_updated = now
    db.flush()
    return trust_score
