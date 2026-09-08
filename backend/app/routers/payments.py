# app/routers/payments.py

import uuid
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.booking import Booking, PaymentStatus
from app.models.payment import Payment, PaymentRecordStatus
from app.models.user import User
from app.schemas.payment import PaymentCheckoutRequest, PaymentResponse
from app.services.notification_service import notify
from app.services.payment_service import validate_handoff_proofs_for_release

router = APIRouter(prefix="/api/v1/bookings", tags=["payments"])


@router.post(
    "/{booking_id}/payment/checkout",
    response_model=PaymentResponse,
    status_code=status.HTTP_201_CREATED
)
def checkout_payment(
    booking_id: uuid.UUID,
    request: PaymentCheckoutRequest,
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

    # 2. Authorization: Only the booking customer can initiate payment checkout
    if current_user.id != booking.customer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the booking customer can initiate checkout"
        )

    # 3. Calculate effective fare: final_fare if present, else base_fare
    effective_fare = (
        booking.final_fare
        if booking.final_fare is not None
        else booking.base_fare
    )

    # 4. Check for existing payment
    payment_stmt = select(Payment).where(Payment.booking_id == booking_id)
    existing_payment = db.execute(payment_stmt).scalar_one_or_none()

    if existing_payment:
        if existing_payment.status == PaymentRecordStatus.released:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Payment for this booking has already been released"
            )
        # Update existing held payment with updated fare if changed
        existing_payment.amount = effective_fare
        existing_payment.status = PaymentRecordStatus.held
        payment = existing_payment
    else:
        # Create mock held payment record
        mock_gateway_id = f"mock_pay_{uuid.uuid4().hex[:12]}"
        payment = Payment(
            booking_id=booking_id,
            amount=effective_fare,
            status=PaymentRecordStatus.held,
            gateway=request.gateway,
            gateway_payment_id=mock_gateway_id
        )
        db.add(payment)

    booking.payment_status = PaymentStatus.pending

    db.commit()
    db.refresh(payment)
    db.refresh(booking)

    # 5. Notify customer and driver
    notify(
        db=db,
        user_id=booking.customer_id,
        type="payment_held",
        content=f"Payment of ₹{payment.amount} held securely in escrow"
    )
    if booking.driver_id:
        notify(
            db=db,
            user_id=booking.driver_id,
            type="payment_held",
            content=f"Customer deposited ₹{payment.amount} in escrow"
        )

    return payment


@router.post(
    "/{booking_id}/payment/release",
    response_model=PaymentResponse
)
def release_payment(
    booking_id: uuid.UUID,
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

    # 2. Authorization: Only participants or admin
    if current_user.id not in [booking.customer_id, booking.driver_id]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only booking participants can trigger payment release"
        )

    # 3. Fetch payment record
    payment_stmt = select(Payment).where(Payment.booking_id == booking_id)
    payment = db.execute(payment_stmt).scalar_one_or_none()
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No payment record found for this booking"
        )

    # 4. Idempotency guard
    if payment.status == PaymentRecordStatus.released:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Payment has already been released"
        )

    # 5. Strictly validate pickup and dropoff handoffs with dual confirmations
    is_valid, reason = validate_handoff_proofs_for_release(db, booking_id)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payment cannot be released: {reason}"
        )

    # 6. Release payment
    payment.status = PaymentRecordStatus.released
    booking.payment_status = PaymentStatus.paid

    db.commit()
    db.refresh(payment)
    db.refresh(booking)

    # 7. Notify customer and driver
    notify(
        db=db,
        user_id=booking.customer_id,
        type="payment_released",
        content=f"Payment of ₹{payment.amount} has been released to the driver."
    )
    if booking.driver_id:
        notify(
            db=db,
            user_id=booking.driver_id,
            type="payment_released",
            content=f"Payment of ₹{payment.amount} has been released to your account."
        )

    return payment


@router.get(
    "/{booking_id}/payment",
    response_model=PaymentResponse
)
def get_payment(
    booking_id: uuid.UUID,
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

    # 2. Authorization
    if current_user.id not in [booking.customer_id, booking.driver_id]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only booking participants can view payment details"
        )

    # 3. Fetch payment
    payment_stmt = select(Payment).where(Payment.booking_id == booking_id)
    payment = db.execute(payment_stmt).scalar_one_or_none()
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found for this booking"
        )

    return payment
