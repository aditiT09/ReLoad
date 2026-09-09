# app/routers/chat.py

import json
import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, WebSocket, WebSocketDisconnect, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, get_db
from app.core.security import decode_access_token, get_current_user
from app.models.booking import Booking
from app.models.message import Message
from app.models.user import User
from app.schemas.chat import MessageCreate, MessageResponse
from app.services.connection_manager import manager
from app.services.notification_service import notify

router = APIRouter(tags=["chat"])


@router.get("/api/v1/bookings/{booking_id}/messages", response_model=List[MessageResponse])
def get_booking_messages(
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

    # 2. Authorization: Only customer or assigned driver can view messages
    if current_user.id not in [booking.customer_id, booking.driver_id]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only booking participants can view messages"
        )

    # 3. Retrieve messages ordered chronologically
    messages_stmt = (
        select(Message)
        .where(Message.booking_id == booking_id)
        .order_by(Message.timestamp.asc())
    )
    messages = db.execute(messages_stmt).scalars().all()
    return messages


@router.post(
    "/api/v1/bookings/{booking_id}/messages",
    response_model=MessageResponse,
    status_code=status.HTTP_201_CREATED
)
def send_booking_message(
    booking_id: uuid.UUID,
    request: MessageCreate,
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
            detail="Only booking participants can send messages"
        )

    # 3. Create and persist Message
    msg = Message(
        booking_id=booking_id,
        sender_id=current_user.id,
        content=request.content,
        timestamp=datetime.now(timezone.utc)
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    # 4. Notify recipient
    recipient_id = booking.driver_id if current_user.id == booking.customer_id else booking.customer_id
    if recipient_id:
        notify(
            db=db,
            user_id=recipient_id,
            type="new_message",
            content=f"New message from {'customer' if current_user.id == booking.customer_id else 'driver'}: {request.content[:50]}"
        )

    return msg


@router.websocket("/ws/bookings/{booking_id}/chat")
async def chat_websocket(
    websocket: WebSocket,
    booking_id: uuid.UUID,
    token: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    # Validate auth token
    if not token:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    try:
        payload = decode_access_token(token)
        raw_sub = payload.get("sub")
        if not raw_sub:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return
        user_id = uuid.UUID(str(raw_sub))
    except Exception:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    user_stmt = select(User).where(User.id == user_id)
    user = db.execute(user_stmt).scalar_one_or_none()

    booking_stmt = select(Booking).where(Booking.id == booking_id)
    booking = db.execute(booking_stmt).scalar_one_or_none()

    if not user or not booking or user.id not in [booking.customer_id, booking.driver_id]:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    # Connect authenticated user to chat room
    await manager.connect(booking_id, websocket, room_type="chat")

    try:
        while True:
            data = await websocket.receive_text()
            try:
                payload_data = json.loads(data)
                content = payload_data.get("content", data)
            except Exception:
                content = data

            if not content or not str(content).strip():
                continue

            msg = Message(
                booking_id=booking_id,
                sender_id=user.id,
                content=str(content),
                timestamp=datetime.now(timezone.utc)
            )
            db.add(msg)
            db.commit()
            db.refresh(msg)

            broadcast_data = {
                "id": str(msg.id),
                "booking_id": str(booking_id),
                "sender_id": str(user.id),
                "content": msg.content,
                "timestamp": msg.timestamp.isoformat()
            }
            await manager.broadcast(booking_id, broadcast_data, room_type="chat", exclude=websocket)

            recipient_id = booking.driver_id if user.id == booking.customer_id else booking.customer_id
            if recipient_id:
                notify(
                    db=db,
                    user_id=recipient_id,
                    type="new_message",
                    content=f"New message from {'customer' if user.id == booking.customer_id else 'driver'}: {msg.content[:50]}"
                )
    except WebSocketDisconnect:
        manager.disconnect(booking_id, websocket, room_type="chat")
