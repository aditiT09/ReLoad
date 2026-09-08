# app/routers/bookings.py

import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.booking import Booking
from app.models.demand_log import DemandLog
from app.schemas.booking import BookingCreate, BookingStatusUpdate, BookingResponse
from app.services.matching_service import find_verified_vehicle
from app.services.fare_service import calculate_fare
from app.services.booking_state_machine import can_transition

router = APIRouter(prefix="/api/v1/bookings", tags=["bookings"])


@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(request: BookingCreate, db: Session = Depends(get_db)):
    # 1. Enforce verified vehicle matching (never fall back to unverified)
    vehicle = find_verified_vehicle(
        db=db,
        vehicle_type=request.vehicle_type,
        pickup_lat=request.pickup_lat,
        pickup_lng=request.pickup_lng
    )
    
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="No verified vehicle available for this vehicle type — booking cannot proceed without a verified match"
        )
        
    # 2. Calculate locked base fare
    base_fare = calculate_fare(
        pickup_lat=request.pickup_lat,
        pickup_lng=request.pickup_lng,
        dropoff_lat=request.dropoff_lat,
        dropoff_lng=request.dropoff_lng,
        vehicle_type=request.vehicle_type,
        cargo_category=request.cargo_category
    )
    
    # 3. Create the Booking row
    new_booking = Booking(
        customer_id=request.customer_id,
        driver_id=vehicle.driver_id,
        vehicle_id=vehicle.id,
        pickup_address=request.pickup_address,
        pickup_lat=request.pickup_lat,
        pickup_lng=request.pickup_lng,
        dropoff_address=request.dropoff_address,
        dropoff_lat=request.dropoff_lat,
        dropoff_lng=request.dropoff_lng,
        cargo_category=request.cargo_category,
        base_fare=base_fare
    )
    
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    
    # 4. Create DemandLog row for ML forecasting
    # Per the frozen demand_logs contract: raw coordinates + timestamp only, no zone_id, no derived fields.
    demand_log = DemandLog(
        booking_id=new_booking.id,
        pickup_lat=new_booking.pickup_lat,
        pickup_lng=new_booking.pickup_lng,
        booking_created_at=new_booking.created_at
    )
    db.add(demand_log)
    db.commit()
    
    return new_booking


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: uuid.UUID, db: Session = Depends(get_db)):
    stmt = select(Booking).where(Booking.id == booking_id)
    booking = db.execute(stmt).scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
        
    return booking


@router.get("/", response_model=List[BookingResponse])
def list_bookings(
    customer_id: Optional[uuid.UUID] = None,
    driver_id: Optional[uuid.UUID] = None,
    db: Session = Depends(get_db)
):
    stmt = select(Booking)
    
    if customer_id:
        stmt = stmt.where(Booking.customer_id == customer_id)
    if driver_id:
        stmt = stmt.where(Booking.driver_id == driver_id)
        
    bookings = db.execute(stmt).scalars().all()
    
    return bookings


@router.patch("/{booking_id}/status", response_model=BookingResponse)
def update_booking_status(
    booking_id: uuid.UUID,
    request: BookingStatusUpdate,
    db: Session = Depends(get_db)
):
    stmt = select(Booking).where(Booking.id == booking_id)
    booking = db.execute(stmt).scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
        
    # Resolve potential enum values defensively to string for state machine comparison
    current_status = booking.status.value if hasattr(booking.status, "value") else booking.status
    new_status = request.status.value if hasattr(request.status, "value") else request.status
    
    if not can_transition(current_status, new_status):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot transition from '{current_status}' to '{new_status}'"
        )
        
    booking.status = request.status
    db.commit()
    db.refresh(booking)
    
    return booking