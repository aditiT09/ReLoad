# app/routers/surcharges.py

import uuid
from decimal import Decimal
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.booking import Booking
from app.models.surcharge_request import SurchargeRequest
from app.models.user import User
from app.schemas.surcharge import SurchargeRequestCreate, SurchargeRequestResponse
from app.services.notification_service import notify

router = APIRouter(prefix="/api/v1/bookings", tags=["surcharges"])


@router.post(
    "/{booking_id}/surcharge-request",
    response_model=SurchargeRequestResponse,
    status_code=status.HTTP_201_CREATED
)
def request_surcharge(
    booking_id: uuid.UUID,
    request: SurchargeRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Fetch booking
    stmt = select(Booking).where(Booking.id == booking_id)
    booking = db.execute(stmt).scalar_one_or_none()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # 2. Authorization: Only the assigned driver can request a surcharge
    if current_user.id != booking.driver_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the assigned driver can request a surcharge for this booking"
        )

    # 3. Validate positive amount
    if request.amount <= Decimal("0.00"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Surcharge amount must be greater than zero"
        )

    # 4. Create SurchargeRequest record (customer_confirmed=False)
    surcharge = SurchargeRequest(
        booking_id=booking_id,
        amount=request.amount,
        reason=request.reason,
        customer_confirmed=False
    )
    db.add(surcharge)
    db.commit()
    db.refresh(surcharge)

    # 5. Notify customer — explicit notice, final fare remains unchanged until approved
    notify(
        db=db,
        user_id=booking.customer_id,
        type="surcharge_requested",
        content=f"Driver requested surcharge of ₹{request.amount} for {request.reason}"
    )

    return surcharge


@router.patch(
    "/{booking_id}/surcharge-request/{surcharge_id}/confirm",
    response_model=SurchargeRequestResponse
)
def confirm_surcharge(
    booking_id: uuid.UUID,
    surcharge_id: uuid.UUID,
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

    # 2. Authorization: Only the booking customer can confirm a surcharge
    if current_user.id != booking.customer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the booking customer can confirm a surcharge"
        )

    # 3. Fetch surcharge request
    surcharge_stmt = select(SurchargeRequest).where(
        SurchargeRequest.id == surcharge_id,
        SurchargeRequest.booking_id == booking_id
    )
    surcharge = db.execute(surcharge_stmt).scalar_one_or_none()
    if not surcharge:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Surcharge request not found for this booking"
        )

    # 4. Idempotency guard: reject duplicate confirmation
    if surcharge.customer_confirmed:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Surcharge request has already been confirmed"
        )

    # 5. Mark surcharge as confirmed
    surcharge.customer_confirmed = True
    db.flush()

    # 6. Recalculate final_fare = base_fare + SUM(all confirmed surcharges)
    all_surcharges_stmt = select(SurchargeRequest).where(
        SurchargeRequest.booking_id == booking_id,
        SurchargeRequest.customer_confirmed == True
    )
    confirmed_surcharges = db.execute(all_surcharges_stmt).scalars().all()
    total_approved_surcharges = sum(s.amount for s in confirmed_surcharges)

    booking.final_fare = booking.base_fare + total_approved_surcharges

    db.commit()
    db.refresh(surcharge)
    db.refresh(booking)

    # 7. Notify driver
    if booking.driver_id:
        notify(
            db=db,
            user_id=booking.driver_id,
            type="surcharge_approved",
            content=f"Customer approved surcharge of ₹{surcharge.amount}"
        )

    return surcharge
