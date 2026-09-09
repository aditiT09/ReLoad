from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.orm import Session
import uuid

from app.core.database import get_db
from app.models.booking import Booking, BookingStatus
from app.models.gps_ping import GPSPing as GPSPingModel
from app.models.safety_flag import (
    SafetyFlag,
    SafetyFlagSeverity,
    SafetyFlagStatus,
    SafetyFlagType,
)

from app.ml.demand.predict import (
    forecast_next_hours,
    get_feature_importance,
    load_model,
)

from app.ml.demand.zone import (
    get_zone_from_coordinates,
    get_zone_name,
)

from app.ml.safety.detector import (
    GPSPing,
    detect_safety_flags,
)


router = APIRouter(
    prefix="/api/v1",
    tags=["ML"],
)


# ============================================================
# DEMAND MODEL
# ============================================================

try:
    model = load_model()
except FileNotFoundError:
    model = None


DAY_NAMES = {
    0: "Monday",
    1: "Tuesday",
    2: "Wednesday",
    3: "Thursday",
    4: "Friday",
    5: "Saturday",
    6: "Sunday",
}


ZONE_IDS = list(range(1, 9))


# ============================================================
# SAFETY REQUEST SCHEMA
# ============================================================

class SafetyCheckRequest(BaseModel):
    """
    Expected route returned by the routing/maps layer.

    Each point is:
        [latitude, longitude]
    """

    expected_route: list[list[float]] = Field(
        min_length=2,
        description=(
            "Expected route as [latitude, longitude] points."
        ),
    )


# ============================================================
# DEMAND FORECAST
# ============================================================

@router.get("/demand-forecast")
def demand_forecast(
    zone_id: Optional[int] = Query(
        None,
        ge=1,
        le=8,
        description="Synthetic MVP zone ID.",
    ),

    latitude: Optional[float] = Query(
        None,
        description="Driver's current latitude.",
    ),

    longitude: Optional[float] = Query(
        None,
        description="Driver's current longitude.",
    ),

    hours: int = Query(
        4,
        ge=1,
        le=12,
        description="Number of hours to forecast.",
    ),
):
    """
    Demand forecast.

    Supported modes:

    1. Specific zone:
        /api/v1/demand-forecast?zone_id=2

    2. Driver GPS:
        /api/v1/demand-forecast?latitude=26.4520&longitude=80.3350

    3. All zones:
        /api/v1/demand-forecast
    """

    if model is None:
        raise HTTPException(
            status_code=503,
            detail=(
                "Demand model is unavailable. "
                "Run the training pipeline first."
            ),
        )

    now = datetime.now()

    current_hour = now.hour
    current_day = now.weekday()

    # --------------------------------------------------------
    # Determine requested zones
    # --------------------------------------------------------

    if zone_id is not None:

        requested_zones = [zone_id]
        location_source = "zone_id"
        zone_name = get_zone_name(zone_id)

    elif latitude is not None and longitude is not None:

        detected_zone = get_zone_from_coordinates(
            latitude,
            longitude,
        )

        requested_zones = [
            detected_zone["zone_id"]
        ]

        location_source = "driver_gps"
        zone_name = detected_zone["zone_name"]

    elif latitude is None and longitude is None:

        requested_zones = ZONE_IDS
        location_source = "all_zones"
        zone_name = None

    else:

        raise HTTPException(
            status_code=400,
            detail=(
                "Provide both latitude and longitude "
                "when using driver GPS."
            ),
        )

    # --------------------------------------------------------
    # Generate forecasts
    # --------------------------------------------------------

    forecasts = []

    for current_zone in requested_zones:

        zone_forecast = forecast_next_hours(
            model=model,
            zone_id=current_zone,
            start_hour=current_hour,
            day_of_week=current_day,
            hours_ahead=hours,
        )

        for item in zone_forecast:
            item["day_name"] = DAY_NAMES[
                item["day_of_week"]
            ]

        forecasts.append({
            "zone_id": current_zone,
            "forecast": zone_forecast,
        })

    return {
        "generated_at": now.isoformat(),

        "location": {
            "zone_id": (
                requested_zones[0]
                if len(requested_zones) == 1
                else None
            ),
            "zone_name": zone_name,
            "source": location_source,
        },

        "model_mode": "random_forest",

        "feature_importance": get_feature_importance(
            model
        ),

        "forecast_hours": hours,

        "forecasts": forecasts,
    }


# ============================================================
# SAFETY CHECK
# ============================================================

@router.post(
    "/bookings/{booking_id}/safety-check"
)
def safety_check(
    booking_id:uuid.UUID,
    request: SafetyCheckRequest,
    db: Session = Depends(get_db),
):
    """
    Run safety detection for an active booking.

    The GPS pings come from the real gps_pings table.
    """

    # --------------------------------------------------------
    # Get booking
    # --------------------------------------------------------

    booking = db.execute(
        select(Booking).where(
            Booking.id == booking_id
        )
    ).scalar_one_or_none()

    if booking is None:
        raise HTTPException(
            status_code=404,
            detail="Booking not found.",
        )

    # --------------------------------------------------------
    # Safety monitoring only applies while in transit
    # --------------------------------------------------------

    if booking.status != BookingStatus.in_transit:
        raise HTTPException(
            status_code=409,
            detail=(
                "Safety monitoring is only available "
                "for bookings in in_transit status."
            ),
        )

    # --------------------------------------------------------
    # Get GPS pings from database
    # --------------------------------------------------------

    gps_rows = db.execute(
        select(GPSPingModel)
        .where(
            GPSPingModel.booking_id == booking.id
        )
        .order_by(
            GPSPingModel.timestamp.asc()
        )
    ).scalars().all()

    if not gps_rows:
        return {
            "booking_id": str(booking.id),
            "flags_detected": 0,
            "flags": [],
            "message": "No GPS pings available yet.",
        }

    # --------------------------------------------------------
    # Convert backend GPS model → detector GPSPing
    # --------------------------------------------------------

    detector_pings = [
        GPSPing(
            latitude=row.lat,
            longitude=row.lng,
            timestamp=row.timestamp,
        )
        for row in gps_rows
    ]

    # --------------------------------------------------------
    # Convert expected route
    # --------------------------------------------------------

    expected_route = [
        (
            point[0],
            point[1],
        )
        for point in request.expected_route
    ]

    # --------------------------------------------------------
    # Run detection
    # --------------------------------------------------------

    detected_flags = detect_safety_flags(
        booking_id=booking.id,
        pings=detector_pings,
        expected_route=expected_route,
    )

    created_flags = []

    # --------------------------------------------------------
    # Persist SafetyFlag records
    # --------------------------------------------------------

    for flag in detected_flags:

        flag_type = SafetyFlagType(
            flag["flag_type"]
        )

        severity = SafetyFlagSeverity(
            flag["severity"]
        )

        status = SafetyFlagStatus(
            flag.get(
                "status",
                "unresolved",
            )
        )

        # Avoid repeatedly inserting the same unresolved
        # flag type every time safety-check is called.
        existing_flag = db.execute(
            select(SafetyFlag)
            .where(
                SafetyFlag.booking_id == booking.id,
                SafetyFlag.flag_type == flag_type,
                SafetyFlag.status != (
                    SafetyFlagStatus.resolved
                ),
            )
            .limit(1)
        ).scalar_one_or_none()

        if existing_flag is not None:
            continue

        detected_at = datetime.fromisoformat(
            flag["detected_at"]
        )

        safety_flag = SafetyFlag(
            booking_id=booking.id,
            flag_type=flag_type,
            severity=severity,
            status=status,
            details=flag.get(
                "details",
                {},
            ),
            detected_at=detected_at,
        )

        db.add(safety_flag)

        created_flags.append(flag)

    db.commit()

    return {
        "booking_id": str(booking.id),
        "flags_detected": len(created_flags),
        "flags": created_flags,
        "storage_mode": "postgresql",
    }


