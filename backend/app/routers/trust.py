import uuid
from datetime import datetime, timezone
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user, require_role
from app.models import (
    Booking, Document, DocumentType, Report, ReportCategory, ReportStatus,
    ReportTargetType, TrustScore, TrustSubjectType, User, UserRole, Vehicle,
    VehicleVerificationStatus,
)
from app.services.trust_service import calculate_trust_score, document_status

router = APIRouter(prefix="/api/v1", tags=["trust"])


class DocumentCreate(BaseModel):
    driver_id: uuid.UUID
    doc_type: DocumentType
    file_url: str = Field(min_length=1)
    expiry_date: datetime
    verified: bool = False


class DocumentResponse(BaseModel):
    id: uuid.UUID
    driver_id: uuid.UUID
    doc_type: DocumentType
    file_url: str
    expiry_date: datetime
    verified: bool
    expiry_status: str
    expiring_soon: bool
    model_config = ConfigDict(from_attributes=True)


class VehicleVerificationResponse(BaseModel):
    id: uuid.UUID
    verification_status: VehicleVerificationStatus
    last_checked_date: datetime
    model_config = ConfigDict(from_attributes=True)


class ReportCreate(BaseModel):
    booking_id: uuid.UUID
    target_type: ReportTargetType
    category: ReportCategory
    description: str = Field(min_length=1)
    evidence_url: Optional[str] = None


class ReportStatusUpdate(BaseModel):
    status: ReportStatus


class ReportResponse(BaseModel):
    id: uuid.UUID
    booking_id: uuid.UUID
    reporter_id: uuid.UUID
    target_type: ReportTargetType
    category: ReportCategory
    description: str
    evidence_url: Optional[str]
    status: ReportStatus
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class TrustScoreResponse(BaseModel):
    subject_id: uuid.UUID
    subject_type: TrustSubjectType
    score: float
    component_breakdown: dict[str, Any]
    last_updated: datetime
    model_config = ConfigDict(from_attributes=True)


def _get_user(db: Session, user_id: uuid.UUID, role: UserRole | None = None) -> User:
    user = db.get(User, user_id)
    if user is None or (role is not None and user.role != role):
        raise HTTPException(status_code=404, detail="User not found")
    return user


def _document_payload(document: Document) -> dict[str, Any]:
    expiry_status = document_status(document)
    return {**document.__dict__, "expiry_status": expiry_status, "expiring_soon": expiry_status == "expiring_soon"}


def _score_response(db: Session, subject_id: uuid.UUID, subject_type: TrustSubjectType) -> TrustScore:
    try:
        return calculate_trust_score(db, subject_id, subject_type)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/vehicles/{vehicle_id}/verify", response_model=VehicleVerificationResponse)
def verify_vehicle(vehicle_id: uuid.UUID, db: Session = Depends(get_db), _admin: User = Depends(require_role("company_admin"))):
    vehicle = db.get(Vehicle, vehicle_id)
    if vehicle is None:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    vehicle.last_checked_date = datetime.now(timezone.utc)
    vehicle.verification_status = VehicleVerificationStatus.verified
    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.post("/documents", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
def upload_document(request: DocumentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    driver = _get_user(db, request.driver_id, UserRole.driver)
    if current_user.role != UserRole.company_admin and current_user.id != driver.id:
        raise HTTPException(status_code=403, detail="You can only upload your own documents")
    document_data = request.model_dump()
    if current_user.role != UserRole.company_admin:
        document_data["verified"] = False
    document = Document(**document_data)
    db.add(document)
    db.commit()
    db.refresh(document)
    return _document_payload(document)


@router.get("/drivers/{driver_id}/documents", response_model=list[DocumentResponse])
def list_documents(driver_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    _get_user(db, driver_id, UserRole.driver)
    if current_user.role not in (UserRole.company_admin, UserRole.customer) and current_user.id != driver_id:
        raise HTTPException(status_code=403, detail="You cannot view these documents")
    documents = db.execute(select(Document).where(Document.driver_id == driver_id).order_by(Document.doc_type)).scalars().all()
    return [_document_payload(document) for document in documents]


@router.post("/reports", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(request: ReportCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    booking = db.get(Booking, request.booking_id)
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")
    if current_user.role != UserRole.company_admin and current_user.id not in (booking.customer_id, booking.driver_id):
        raise HTTPException(status_code=403, detail="Only booking participants can report")
    target_id = booking.driver_id if request.target_type in (ReportTargetType.driver, ReportTargetType.vehicle) else booking.customer_id
    if request.target_type == ReportTargetType.driver and target_id is None:
        raise HTTPException(status_code=400, detail="Booking has no assigned driver")
    if request.target_type == ReportTargetType.vehicle and booking.vehicle_id is None:
        raise HTTPException(status_code=400, detail="Booking has no assigned vehicle")
    report = Report(reporter_id=current_user.id, **request.model_dump())
    db.add(report)
    db.flush()
    if target_id is not None:
        calculate_trust_score(db, target_id, TrustSubjectType.driver if request.target_type != ReportTargetType.company else TrustSubjectType.company)
    db.commit()
    db.refresh(report)
    return report


@router.get("/reports", response_model=list[ReportResponse])
def list_reports(report_status: Optional[ReportStatus] = Query(default=None, alias="status"), db: Session = Depends(get_db), _admin: User = Depends(require_role("company_admin"))):
    statement = select(Report).order_by(Report.created_at.desc())
    if report_status is not None:
        statement = statement.where(Report.status == report_status)
    return db.execute(statement).scalars().all()


@router.patch("/reports/{report_id}/status", response_model=ReportResponse)
def update_report_status(report_id: uuid.UUID, request: ReportStatusUpdate, db: Session = Depends(get_db), _admin: User = Depends(require_role("company_admin"))):
    report = db.get(Report, report_id)
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    valid_transitions = {ReportStatus.open: ReportStatus.investigating, ReportStatus.investigating: ReportStatus.resolved}
    if valid_transitions.get(report.status) != request.status:
        raise HTTPException(status_code=400, detail="Reports must move open -> investigating -> resolved")
    report.status = request.status
    if request.status == ReportStatus.resolved:
        booking = db.get(Booking, report.booking_id)
        target_id = booking.driver_id if report.target_type in (ReportTargetType.driver, ReportTargetType.vehicle) else booking.customer_id
        if target_id is not None:
            calculate_trust_score(db, target_id, TrustSubjectType.driver if report.target_type != ReportTargetType.company else TrustSubjectType.company)
    db.commit()
    db.refresh(report)
    return report


@router.get("/drivers/{driver_id}/trust-score", response_model=TrustScoreResponse)
def driver_trust_score(driver_id: uuid.UUID, db: Session = Depends(get_db)):
    _get_user(db, driver_id, UserRole.driver)
    return _score_response(db, driver_id, TrustSubjectType.driver)


@router.get("/companies/{company_id}/trust-score", response_model=TrustScoreResponse)
def company_trust_score(company_id: uuid.UUID, db: Session = Depends(get_db)):
    _get_user(db, company_id)
    return _score_response(db, company_id, TrustSubjectType.company)
