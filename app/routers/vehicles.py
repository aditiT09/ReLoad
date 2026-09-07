# app/routers/vehicles.py
import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.core.security import require_role
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleResponse
router = APIRouter(prefix="/api/v1/vehicles", tags=["vehicles"])
@router.post("/", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_role("driver", "company_admin"))])
def create_vehicle(request: VehicleCreate, db: Session = Depends(get_db)):
    current_year = datetime.now().year
    cap = settings.VEHICLE_AGE_CAP_YEARS
    
    if (current_year - request.registration_year) > cap:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Vehicle registration year exceeds the {cap}-year age cap"
        )
        
    # Unpacking the request payload directly to model fields
    new_vehicle = Vehicle(**request.model_dump())
    
    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)
    
    return new_vehicle
@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle(vehicle_id: uuid.UUID, db: Session = Depends(get_db)):
    stmt = select(Vehicle).where(Vehicle.id == vehicle_id)
    vehicle = db.execute(stmt).scalar_one_or_none()
    
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
        
    return vehicle
@router.get("/", response_model=List[VehicleResponse])
def list_vehicles(driver_id: Optional[uuid.UUID] = None, db: Session = Depends(get_db)):
    stmt = select(Vehicle)
    
    if driver_id:
        stmt = stmt.where(Vehicle.driver_id == driver_id)
        
    vehicles = db.execute(stmt).scalars().all()
    
    return vehicles