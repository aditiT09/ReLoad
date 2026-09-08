# app/services/payment_service.py

import uuid
from typing import Tuple
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.handoff_proof import HandoffProof


def validate_handoff_proofs_for_release(
    db: Session,
    booking_id: uuid.UUID
) -> Tuple[bool, str]:
    """
    Validates that both pickup and dropoff proofs exist and that each proof has
    been confirmed by BOTH the customer and the driver.
    
    Returns (is_valid, reason_if_invalid).
    """
    stmt = select(HandoffProof).where(HandoffProof.booking_id == booking_id)
    proofs = db.execute(stmt).scalars().all()
    
    proof_by_stage = {
        (proof.stage.value if hasattr(proof.stage, "value") else str(proof.stage)): proof
        for proof in proofs
    }
    
    pickup_proof = proof_by_stage.get("pickup")
    if not pickup_proof:
        return False, "Missing pickup handoff proof"
    if not pickup_proof.confirmed_by_customer:
        return False, "Pickup proof has not been confirmed by customer"
    if not pickup_proof.confirmed_by_driver:
        return False, "Pickup proof has not been confirmed by driver"
        
    dropoff_proof = proof_by_stage.get("dropoff")
    if not dropoff_proof:
        return False, "Missing dropoff handoff proof"
    if not dropoff_proof.confirmed_by_customer:
        return False, "Dropoff proof has not been confirmed by customer"
    if not dropoff_proof.confirmed_by_driver:
        return False, "Dropoff proof has not been confirmed by driver"
        
    return True, "All required handoff proofs are fully verified"
