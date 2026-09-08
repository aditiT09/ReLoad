# app/routers/gps.py

import json
import uuid
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, WebSocket, WebSocketDisconnect, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import SessionLocal, get_db
from app.core.security import decode_access_token, get_current_user
from app.models.booking import Booking
from app.models.gps_ping import GPSPing
from app.models.user import User
from app.schemas.gps import GPSPingCreate, GPSPingResponse
from app.services.connection_manager import manager

router = APIRouter(prefix="/api/v1/bookings", tags=["gps"])
ws_router = APIRouter(tags=["gps"])


@router.post("/{booking_id}/gps-pings", response_model=GPSPingResponse, status_code=status.HTTP_201_CREATED)
def create_gps_ping(
    booking_id: uuid.UUID,
    request: GPSPingCreate,
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
        
    # 2. Validate booking status is in_transit (defensively handle Enum values)
    booking_status = booking.status.value if hasattr(booking.status, "value") else booking.status
    if booking_status != "in_transit":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="GPS pings can only be submitted while booking is in_transit"
        )
        
    # 3. Anti-spoofing check: only the assigned driver can submit GPS pings for this booking
    if current_user.id != booking.driver_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the assigned driver can submit GPS pings for this booking"
        )
        
    # 4. Create GPSPing row (only include explicit timestamp if provided)
    ping_kwargs = {
        "booking_id": booking_id,
        "driver_id": current_user.id,
        "lat": request.lat,
        "lng": request.lng
    }
    if request.timestamp is not None:
        ping_kwargs["timestamp"] = request.timestamp
        
    new_ping = GPSPing(**ping_kwargs)
    
    db.add(new_ping)
    db.commit()
    db.refresh(new_ping)
    
    # 5. Broadcast to any active tracking WebSocket listeners
    broadcast_data = {
        "lat": new_ping.lat,
        "lng": new_ping.lng,
        "timestamp": new_ping.timestamp.isoformat(),
        "driver_id": str(new_ping.driver_id),
        "booking_id": str(booking_id)
    }
    manager.broadcast_sync(booking_id, broadcast_data, room_type="gps")
    
    return new_ping


@ws_router.websocket("/ws/bookings/{booking_id}/tracking")
async def gps_tracking_websocket(
    websocket: WebSocket,
    booking_id: uuid.UUID,
    token: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
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

    # Connect authenticated user to GPS room
    await manager.connect(booking_id, websocket, room_type="gps")

    is_driver = (user.id == booking.driver_id)

    try:
        while True:
            data = await websocket.receive_text()
            if is_driver:
                # Driver sending live GPS points over WebSocket
                db.refresh(booking)
                b_status = booking.status.value if hasattr(booking.status, "value") else str(booking.status)
                if b_status != "in_transit":
                    await websocket.send_json({"error": "GPS pings only accepted while booking is in_transit"})
                    continue

                try:
                    coords = json.loads(data)
                    lat = float(coords["lat"])
                    lng = float(coords["lng"])
                except Exception:
                    continue

                ping = GPSPing(
                    booking_id=booking_id,
                    driver_id=user.id,
                    lat=lat,
                    lng=lng,
                    timestamp=datetime.now(timezone.utc)
                )
                db.add(ping)
                db.commit()
                db.refresh(ping)

                broadcast_data = {
                    "lat": ping.lat,
                    "lng": ping.lng,
                    "timestamp": ping.timestamp.isoformat(),
                    "driver_id": str(user.id),
                    "booking_id": str(booking_id)
                }
                await manager.broadcast(booking_id, broadcast_data, room_type="gps")
            else:
                # Customer listener ping/keepalive
                pass
    except WebSocketDisconnect:
        manager.disconnect(booking_id, websocket, room_type="gps")