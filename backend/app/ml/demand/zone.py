from math import cos, radians


# ------------------------------------------------------------
# MVP zone definitions
# ------------------------------------------------------------
#
# These are synthetic zones for the prototype.
#
# FUTURE:
# Replace these with the real zone/geospatial definitions
# from the production backend.
#

ZONES = {
    1: {
        "name": "central_market",
        "lat": 26.4499,
        "lng": 80.3319,
    },
    2: {
        "name": "residential_north",
        "lat": 26.4850,
        "lng": 80.3000,
    },
    3: {
        "name": "industrial_area",
        "lat": 26.4200,
        "lng": 80.3700,
    },
    4: {
        "name": "commercial_district",
        "lat": 26.4600,
        "lng": 80.3500,
    },
    5: {
        "name": "residential_south",
        "lat": 26.4100,
        "lng": 80.3200,
    },
    6: {
        "name": "transport_hub",
        "lat": 26.4300,
        "lng": 80.2900,
    },
    7: {
        "name": "medical_district",
        "lat": 26.4700,
        "lng": 80.3150,
    },
    8: {
        "name": "mixed_area",
        "lat": 26.4450,
        "lng": 80.3650,
    },
}


def _distance_score(
    lat1: float,
    lng1: float,
    lat2: float,
    lng2: float,
) -> float:
    """
    Approximate local geographic distance.

    Used only to identify the nearest synthetic zone.
    """

    # Convert longitude difference so the scale is
    # approximately comparable with latitude.
    longitude_scale = cos(
        radians((lat1 + lat2) / 2)
    )

    x = (lng1 - lng2) * longitude_scale
    y = lat1 - lat2

    return x * x + y * y


def get_zone_from_coordinates(
    latitude: float,
    longitude: float,
) -> dict:
    """
    Return the nearest zone for a coordinate.
    """

    best_zone_id = None
    best_distance = float("inf")

    for zone_id, zone in ZONES.items():

        distance = _distance_score(
            latitude,
            longitude,
            zone["lat"],
            zone["lng"],
        )

        if distance < best_distance:
            best_distance = distance
            best_zone_id = zone_id

    if best_zone_id is None:
        raise ValueError(
            "Could not determine a zone."
        )

    zone = ZONES[best_zone_id]

    return {
        "zone_id": best_zone_id,
        "zone_name": zone["name"],
    }
def get_zone_name(zone_id: int) -> str:
    if zone_id not in ZONES:
        raise ValueError(
            f"Unknown zone_id: {zone_id}"
        )

    return ZONES[zone_id]["name"]
