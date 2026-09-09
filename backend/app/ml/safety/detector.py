from __future__ import annotations
import uuid
from dataclasses import dataclass
from datetime import datetime
from math import asin, cos, radians, sin, sqrt
from typing import Any, Sequence

from app.ml.safety.thresholds import (
    LONG_STOP_MINUTES,
    ROUTE_DEVIATION_THRESHOLD_METERS,
    STATIONARY_RADIUS_METERS,
)


# ============================================================
# DATA TYPES
# ============================================================

@dataclass
class GPSPing:
    """
    Represents one GPS reading from a vehicle.
    """

    latitude: float
    longitude: float
    timestamp: datetime


Point = tuple[float, float]


# ============================================================
# DISTANCE CALCULATION
# ============================================================

def haversine_distance_meters(
    lat1: float,
    lon1: float,
    lat2: float,
    lon2: float,
) -> float:
    """
    Calculate great-circle distance between two GPS points.

    Returns:
        Distance in meters.
    """

    earth_radius = 6_371_000  # meters

    lat1_rad = radians(lat1)
    lat2_rad = radians(lat2)

    delta_lat = radians(lat2 - lat1)
    delta_lon = radians(lon2 - lon1)

    a = (
        sin(delta_lat / 2) ** 2
        + cos(lat1_rad)
        * cos(lat2_rad)
        * sin(delta_lon / 2) ** 2
    )

    c = 2 * asin(sqrt(a))

    return earth_radius * c


# ============================================================
# POINT → ROUTE DISTANCE
# ============================================================

def point_to_segment_distance_meters(
    point: Point,
    segment_start: Point,
    segment_end: Point,
) -> float:
    """
    Approximate distance from a GPS point to one route segment.

    Uses a local equirectangular projection, which is accurate
    enough for short intra-city segments.
    """

    point_lat, point_lon = point
    start_lat, start_lon = segment_start
    end_lat, end_lon = segment_end

    reference_lat = radians(
        (point_lat + start_lat + end_lat) / 3
    )

    meters_per_degree_lat = 111_320
    meters_per_degree_lon = (
        111_320 * cos(reference_lat)
    )

    # Convert to local x/y coordinates.
    px = point_lon * meters_per_degree_lon
    py = point_lat * meters_per_degree_lat

    ax = start_lon * meters_per_degree_lon
    ay = start_lat * meters_per_degree_lat

    bx = end_lon * meters_per_degree_lon
    by = end_lat * meters_per_degree_lat

    dx = bx - ax
    dy = by - ay

    segment_length_squared = (
        dx * dx + dy * dy
    )

    # Degenerate segment.
    if segment_length_squared == 0:
        return sqrt(
            (px - ax) ** 2
            + (py - ay) ** 2
        )

    # Project point onto segment.
    t = (
        (px - ax) * dx
        + (py - ay) * dy
    ) / segment_length_squared

    # Clamp projection to the segment.
    t = max(0.0, min(1.0, t))

    closest_x = ax + t * dx
    closest_y = ay + t * dy

    return sqrt(
        (px - closest_x) ** 2
        + (py - closest_y) ** 2
    )


def distance_from_route_meters(
    point: Point,
    expected_route: Sequence[Point],
) -> float:
    """
    Return the minimum distance between a GPS point and
    the expected route polyline.
    """

    if not expected_route:
        raise ValueError(
            "Expected route cannot be empty."
        )

    if len(expected_route) == 1:
        return haversine_distance_meters(
            point[0],
            point[1],
            expected_route[0][0],
            expected_route[0][1],
        )

    minimum_distance = float("inf")

    for index in range(
        len(expected_route) - 1
    ):

        distance = point_to_segment_distance_meters(
            point,
            expected_route[index],
            expected_route[index + 1],
        )

        minimum_distance = min(
            minimum_distance,
            distance,
        )

    return minimum_distance


# ============================================================
# ROUTE DEVIATION
# ============================================================

def detect_route_deviation(
    pings: Sequence[GPSPing],
    expected_route: Sequence[Point],
) -> dict[str, Any] | None:
    """
    Detect whether the vehicle moves significantly away
    from the expected route.

    Returns one safety flag containing the maximum detected
    deviation, or None if no deviation occurred.
    """

    if not pings:
        return None

    maximum_deviation = 0.0
    deviation_timestamp = None

    for ping in pings:

        distance = distance_from_route_meters(
            (
                ping.latitude,
                ping.longitude,
            ),
            expected_route,
        )

        if distance > maximum_deviation:
            maximum_deviation = distance
            deviation_timestamp = ping.timestamp

    if (
        maximum_deviation
        <= ROUTE_DEVIATION_THRESHOLD_METERS
    ):
        return None

    # Simple MVP severity rule.
    if (
        maximum_deviation
        > ROUTE_DEVIATION_THRESHOLD_METERS * 2
    ):
        severity = "high"
    else:
        severity = "medium"

    return {
        "flag_type": "route_deviation",
        "severity": severity,
        "status": "unresolved",
        "detected_at": deviation_timestamp.isoformat()
        if deviation_timestamp
        else None,
        "details": {
            "maximum_deviation_meters": round(
                maximum_deviation,
                2,
            ),
            "threshold_meters": (
                ROUTE_DEVIATION_THRESHOLD_METERS
            ),
        },
    }


# ============================================================
# LONG STOP
# ============================================================

def detect_long_stop(
    pings: Sequence[GPSPing],
) -> dict[str, Any] | None:
    """
    Detect a continuous stationary period.

    A long stop occurs when:
        - vehicle stays within STATIONARY_RADIUS_METERS
        - for at least LONG_STOP_MINUTES
    """

    if len(pings) < 2:
        return None

    sorted_pings = sorted(
        pings,
        key=lambda ping: ping.timestamp,
    )

    stop_start = sorted_pings[0]

    for current_ping in sorted_pings[1:]:

        distance_from_start = haversine_distance_meters(
            stop_start.latitude,
            stop_start.longitude,
            current_ping.latitude,
            current_ping.longitude,
        )

        # Vehicle is still within the stationary radius.
        if (
            distance_from_start
            <= STATIONARY_RADIUS_METERS
        ):

            elapsed_seconds = (
                current_ping.timestamp
                - stop_start.timestamp
            ).total_seconds()

            if (
                elapsed_seconds
                >= LONG_STOP_MINUTES * 60
            ):

                stationary_minutes = (
                    elapsed_seconds / 60
                )

                return {
                    "flag_type": "long_stop",
                    "severity": "medium",
                    "status": "unresolved",
                    "detected_at": (
                        current_ping.timestamp.isoformat()
                    ),
                    "details": {
                        "stationary_minutes": round(
                            stationary_minutes,
                            2,
                        ),
                        "stationary_radius_meters": (
                            STATIONARY_RADIUS_METERS
                        ),
                        "threshold_minutes": (
                            LONG_STOP_MINUTES
                        ),
                    },
                }

        else:
            # Vehicle moved enough to reset the stop timer.
            stop_start = current_ping

    return None


# ============================================================
# COMBINED SAFETY DETECTOR
# ============================================================

def detect_safety_flags(
    booking_id: uuid.UUID,
    pings: Sequence[GPSPing],
    expected_route: Sequence[Point],
) -> list[dict[str, Any]]:
    """
    Run all safety detectors for one booking.

    Returns:
        A list of detected safety flags.
    """

    if not pings:
        return []

    flags = []

    route_flag = detect_route_deviation(
        pings,
        expected_route,
    )

    if route_flag is not None:
        route_flag["booking_id"] = booking_id
        flags.append(route_flag)

    stop_flag = detect_long_stop(
        pings,
    )

    if stop_flag is not None:
        stop_flag["booking_id"] = booking_id
        flags.append(stop_flag)

    return flags


# ============================================================
# DEMO / LOCAL TEST
# ============================================================

if __name__ == "__main__":

    from datetime import timedelta

    base_time = datetime(
        2026,
        9,
        6,
        10,
        0,
        0,
    )

    # Expected route:
    #
    # A -------- B -------- C
    #
    expected_route = [
        (26.4499, 80.3319),
        (26.4550, 80.3400),
        (26.4600, 80.3500),
    ]

    test_pings = [
        GPSPing(
            latitude=26.4500,
            longitude=80.3320,
            timestamp=base_time,
        ),
        GPSPing(
            latitude=26.4551,
            longitude=80.3401,
            timestamp=base_time + timedelta(
                minutes=4
            ),
        ),

        # Vehicle stops around this location.
        GPSPing(
            latitude=26.4551,
            longitude=80.3401,
            timestamp=base_time + timedelta(
                minutes=10
            ),
        ),
        GPSPing(
            latitude=26.4552,
            longitude=80.3400,
            timestamp=base_time + timedelta(
                minutes=20
            ),
        ),

        # Large route deviation.
        GPSPing(
            latitude=26.4700,
            longitude=80.3800,
            timestamp=base_time + timedelta(
                minutes=24
            ),
        ),
    ]

    flags = detect_safety_flags(
        booking_id=101,
        pings=test_pings,
        expected_route=expected_route,
    )

    print("\nDetected safety flags:\n")

    for flag in flags:
        print(flag)