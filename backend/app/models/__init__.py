# app/models/__init__.py

from app.core.database import Base

from app.models.user import User, UserRole
from app.models.vehicle import Vehicle, VehicleType, VehicleVerificationStatus
from app.models.booking import Booking, CargoCategory, BookingStatus, PaymentStatus
from app.models.demand_log import DemandLog
from app.models.gps_ping import GPSPing
from app.models.safety_flag import SafetyFlag, SafetyFlagType, SafetyFlagSeverity, SafetyFlagStatus
from app.models.handoff_proof import HandoffProof, HandoffStage
from app.models.report import Report, ReportTargetType, ReportCategory, ReportStatus
from app.models.surcharge_request import SurchargeRequest
from app.models.trust_score import TrustScore, TrustSubjectType
from app.models.document import Document, DocumentType
from app.models.message import Message
from app.models.notification import Notification

__all__ = [
    "Base",
    "User", "UserRole",
    "Vehicle", "VehicleType", "VehicleVerificationStatus",
    "Booking", "CargoCategory", "BookingStatus", "PaymentStatus",
    "DemandLog",
    "GPSPing",
    "SafetyFlag", "SafetyFlagType", "SafetyFlagSeverity", "SafetyFlagStatus",
    "HandoffProof", "HandoffStage",
    "Report", "ReportTargetType", "ReportCategory", "ReportStatus",
    "SurchargeRequest",
    "TrustScore", "TrustSubjectType",
    "Document", "DocumentType",
    "Message",
    "Notification",
]