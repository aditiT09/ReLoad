# app/routers/payments.py

import uuid
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


router = APIRouter(
    prefix="/api/v1/bookings",
    tags=["payments"]
)


# ============================================================
# CHECKOUT PAYMENT
# ============================================================

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
    """
    Create or update a held payment for a booking.

    Only the customer who created the booking can initiate checkout.

    Payment amount:
        final_fare if an approved surcharge exists
        otherwise base_fare

    The payment is placed in HELD state.
    It is not released until both pickup and dropoff
    handoff proofs are confirmed by both parties.
    """

    # --------------------------------------------------------
    # 1. Fetch booking
    # --------------------------------------------------------

    booking_stmt = select(Booking).where(
        Booking.id == booking_id
    )

    booking = db.execute(
        booking_stmt
    ).scalar_one_or_none()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # --------------------------------------------------------
    # 2. Authorization
    # --------------------------------------------------------
    # Only the customer can initiate checkout.

    if current_user.id != booking.customer_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the booking customer can initiate checkout"
        )

    # --------------------------------------------------------
    # 3. Calculate effective fare
    # --------------------------------------------------------
    # Approved final fare takes priority.
    # Otherwise use the locked base fare.
    #
    # An unapproved surcharge must NEVER silently change
    # the payment amount.

    effective_fare = (
        booking.final_fare
        if booking.final_fare is not None
        else booking.base_fare
    )

    # --------------------------------------------------------
    # 4. Check for an existing payment
    # --------------------------------------------------------

    payment_stmt = select(Payment).where(
        Payment.booking_id == booking_id
    )

    existing_payment = db.execute(
        payment_stmt
    ).scalar_one_or_none()

    if existing_payment:

        # ----------------------------------------------------
        # Payment already released
        # ----------------------------------------------------

        if existing_payment.status == PaymentRecordStatus.released:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Payment for this booking has already been released"
            )

        # ----------------------------------------------------
        # Reuse existing payment
        # ----------------------------------------------------

        existing_payment.amount = effective_fare
        existing_payment.status = PaymentRecordStatus.held

        payment = existing_payment

    else:

        # ----------------------------------------------------
        # Create mock held payment
        # ----------------------------------------------------

        mock_gateway_id = (
            f"mock_pay_{uuid.uuid4().hex[:12]}"
        )

        payment = Payment(
            booking_id=booking_id,
            amount=effective_fare,
            status=PaymentRecordStatus.held,
            gateway=request.gateway,
            gateway_payment_id=mock_gateway_id
        )

        db.add(payment)

    # --------------------------------------------------------
    # 5. Keep Booking payment status compatible
    # --------------------------------------------------------

    booking.payment_status = PaymentStatus.pending

    # --------------------------------------------------------
    # 6. Save payment
    # --------------------------------------------------------

    db.commit()

    db.refresh(payment)
    db.refresh(booking)

    # --------------------------------------------------------
    # 7. Notify customer
    # --------------------------------------------------------

    notify(
        db=db,
        user_id=booking.customer_id,
        type="payment_held",
        content=(
            f"Payment of ₹{payment.amount} "
            f"held securely in escrow"
        )
    )

    # --------------------------------------------------------
    # 8. Notify driver
    # --------------------------------------------------------

    if booking.driver_id:

        notify(
            db=db,
            user_id=booking.driver_id,
            type="payment_held",
            content=(
                f"Customer deposited "
                f"₹{payment.amount} in escrow"
            )
        )

    # --------------------------------------------------------
    # 9. Save notifications
    # --------------------------------------------------------

    db.commit()

    return payment


# ============================================================
# RELEASE PAYMENT
# ============================================================

@router.post(
    "/{booking_id}/payment/release",
    response_model=PaymentResponse
)
def release_payment(
    booking_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Release a held payment.

    Payment can only be released when:

        Pickup:
            Customer confirmed ✓
            Driver confirmed ✓

        Dropoff:
            Customer confirmed ✓
            Driver confirmed ✓

    Payment release does NOT directly modify booking.status.
    Booking state changes remain controlled by the booking
    state machine.
    """

    # --------------------------------------------------------
    # 1. Fetch booking
    # --------------------------------------------------------

    booking_stmt = select(Booking).where(
        Booking.id == booking_id
    )

    booking = db.execute(
        booking_stmt
    ).scalar_one_or_none()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # --------------------------------------------------------
    # 2. Authorization
    # --------------------------------------------------------
    # Only customer or driver can trigger release.

    allowed_users = {
        booking.customer_id
    }

    if booking.driver_id:
        allowed_users.add(booking.driver_id)

    if current_user.id not in allowed_users:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only booking participants can trigger payment release"
        )

    # --------------------------------------------------------
    # 3. Fetch payment
    # --------------------------------------------------------

    payment_stmt = select(Payment).where(
        Payment.booking_id == booking_id
    )

    payment = db.execute(
        payment_stmt
    ).scalar_one_or_none()

    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No payment record found for this booking"
        )

    # --------------------------------------------------------
    # 4. Idempotency guard
    # --------------------------------------------------------

    if payment.status == PaymentRecordStatus.released:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Payment has already been released"
        )

    # --------------------------------------------------------
    # 5. Make sure payment is actually held
    # --------------------------------------------------------

    if payment.status != PaymentRecordStatus.held:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Payment cannot be released from "
                f"status '{payment.status.value}'"
            )
        )

    # --------------------------------------------------------
    # 6. Validate handoff proofs
    # --------------------------------------------------------
    # This is the most important trust gate.
    #
    # Both pickup and dropoff must have:
    #
    #     customer confirmation = True
    #     driver confirmation   = True

    is_valid, reason = validate_handoff_proofs_for_release(
        db,
        booking_id
    )

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Payment cannot be released: {reason}"
        )

    # --------------------------------------------------------
    # 7. Release payment
    # --------------------------------------------------------

    payment.status = PaymentRecordStatus.released

    booking.payment_status = PaymentStatus.paid

    db.commit()

    db.refresh(payment)
    db.refresh(booking)

    # --------------------------------------------------------
    # 8. Notify customer
    # --------------------------------------------------------

    notify(
        db=db,
        user_id=booking.customer_id,
        type="payment_released",
        content=(
            f"Payment of ₹{payment.amount} "
            f"has been released to the driver."
        )
    )

    # --------------------------------------------------------
    # 9. Notify driver
    # --------------------------------------------------------

    if booking.driver_id:

        notify(
            db=db,
            user_id=booking.driver_id,
            type="payment_released",
            content=(
                f"Payment of ₹{payment.amount} "
                f"has been released to your account."
            )
        )

    # --------------------------------------------------------
    # 10. Save notifications
    # --------------------------------------------------------

    db.commit()

    return payment


# ============================================================
# GET PAYMENT
# ============================================================

@router.get(
    "/{booking_id}/payment",
    response_model=PaymentResponse
)
def get_payment(
    booking_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get payment details for a booking.

    Only the customer or assigned driver can view payment
    information.
    """

    # --------------------------------------------------------
    # 1. Fetch booking
    # --------------------------------------------------------

    booking_stmt = select(Booking).where(
        Booking.id == booking_id
    )

    booking = db.execute(
        booking_stmt
    ).scalar_one_or_none()

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    # --------------------------------------------------------
    # 2. Authorization
    # --------------------------------------------------------

    allowed_users = {
        booking.customer_id
    }

    if booking.driver_id:
        allowed_users.add(booking.driver_id)

    if current_user.id not in allowed_users:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only booking participants can view payment details"
        )

    # --------------------------------------------------------
    # 3. Fetch payment
    # --------------------------------------------------------

    payment_stmt = select(Payment).where(
        Payment.booking_id == booking_id
    )

    payment = db.execute(
        payment_stmt
    ).scalar_one_or_none()

    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment not found for this booking"
        )

    # --------------------------------------------------------
    # 4. Return payment
    # --------------------------------------------------------

    return payment