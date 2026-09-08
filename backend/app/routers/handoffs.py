# app/routers/handoffs.py

import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.booking import Booking, BookingStatus
from app.models.handoff_proof import HandoffProof, HandoffStage
from app.models.user import User
from app.schemas.handoff import HandoffProofCreate, HandoffProofResponse
from app.services.booking_state_machine import can_transition
from app.services.notification_service import notify

router = APIRouter(prefix="/api/v1/bookings", tags=["handoffs"])


@router.post(
    "/{booking_id}/handoff-proof",
    response_model=HandoffProofResponse,
    status_code=status.HTTP_201_CREATED
)
def create_handoff_proof(
    booking_id: uuid.UUID,
    request: HandoffProofCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Fetch booking
    booking_stmt = select(Booking).where(Booking.id == booking_id)
    booking = db.execute(booking_stmt).scalar_one_or_none()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # 2. Authorization: Only booking participants can create a proof
    is_customer = current_user.id == booking.customer_id
    is_driver = current_user.id == booking.driver_id

    if not (is_customer or is_driver):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only assigned customer or driver can create a handoff proof"
        )

    # 3. Check for existing proof for this stage
    existing_stmt = select(HandoffProof).where(
        HandoffProof.booking_id == booking_id,
        HandoffProof.stage == request.stage
    )
    existing_proof = db.execute(existing_stmt).scalar_one_or_none()
    if existing_proof:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Handoff proof for '{request.stage}' stage already exists for this booking"
        )

    # 4. Create handoff proof with server timestamp and role confirmation
    new_proof = HandoffProof(
        booking_id=booking_id,
        stage=request.stage,
        photo_url=request.photo_url,
        lat=request.lat,
        lng=request.lng,
        timestamp=datetime.now(timezone.utc),
        confirmed_by_customer=is_customer,
        confirmed_by_driver=is_driver
    )

    db.add(new_proof)
    db.commit()
    db.refresh(new_proof)

    # 5. Notify the other party
    other_party_id = booking.driver_id if is_customer else booking.customer_id
    if other_party_id:
        notify(
            db=db,
            user_id=other_party_id,
            type="handoff_created",
            content=f"{'Customer' if is_customer else 'Driver'} uploaded {request.stage} handoff proof. Confirmation required."
        )

    return new_proof


@router.patch(
    "/{booking_id}/handoff-proof/{proof_id}/confirm",
    response_model=HandoffProofResponse
)
def confirm_handoff_proof(
    booking_id: uuid.UUID,
    proof_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Fetch booking
    booking_stmt = select(Booking).where(Booking.id == booking_id)
    booking = db.execute(booking_stmt).scalar_one_or_none()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # 2. Fetch handoff proof
    proof_stmt = select(HandoffProof).where(
        HandoffProof.id == proof_id,
        HandoffProof.booking_id == booking_id
    )
    proof = db.execute(proof_stmt).scalar_one_or_none()
    if not proof:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Handoff proof not found for this booking"
        )

    # 3. Determine role and apply confirmation
    is_customer = current_user.id == booking.customer_id
    is_driver = current_user.id == booking.driver_id

    if not (is_customer or is_driver):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only booking customer or driver can confirm handoff proof"
        )

    if is_customer:
        if proof.confirmed_by_customer:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Handoff proof already confirmed by customer"
            )
        proof.confirmed_by_customer = True

    elif is_driver:
        if proof.confirmed_by_driver:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Handoff proof already confirmed by driver"
            )
        proof.confirmed_by_driver = True

    # 4. If dual confirmation achieved, advance booking status via state machine if appropriate
    stage_val = proof.stage.value if hasattr(proof.stage, "value") else str(proof.stage)
    current_status = booking.status.value if hasattr(booking.status, "value") else str(booking.status)

    if proof.confirmed_by_customer and proof.confirmed_by_driver:
        target_status = None
        if stage_val == "pickup" and can_transition(current_status, "pickup_confirmed"):
            target_status = "pickup_confirmed"
        elif stage_val == "dropoff" and can_transition(current_status, "delivered"):
            target_status = "delivered"

        if target_status:
            booking.status = BookingStatus(target_status)

        # Notify participants of full dual confirmation
        notify(
            db=db,
            user_id=booking.customer_id,
            type="handoff_verified",
            content=f"{stage_val.capitalize()} handoff fully verified by both parties."
        )
        if booking.driver_id:
            notify(
                db=db,
                user_id=booking.driver_id,
                type="handoff_verified",
                content=f"{stage_val.capitalize()} handoff fully verified by both parties."
            )

    db.commit()
    db.refresh(proof)
    db.refresh(booking)

    return proof
