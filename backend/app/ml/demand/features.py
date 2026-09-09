from pathlib import Path

import numpy as np
import pandas as pd
from app.ml.demand.zone import get_zone_from_coordinates


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

RAW_DATA_FILE = DATA_DIR / "demand_logs.csv"
FEATURE_DATA_FILE = DATA_DIR / "demand_features.csv"


# ============================================================
# ZONE DEFINITIONS
# ============================================================

# These must match the zone centers used by
# generate_demand_data.py.
#
# In the future, replace these with the actual zone definitions
# from the backend/database.

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


# ============================================================
# LOAD RAW DATA
# ============================================================

def load_raw_data() -> pd.DataFrame:
    """Load synthetic/raw demand log records."""

    if not RAW_DATA_FILE.exists():
        raise FileNotFoundError(
            f"Raw dataset not found: {RAW_DATA_FILE}\n"
            "Run generate_demand_data.py first."
        )

    df = pd.read_csv(
        RAW_DATA_FILE,
        parse_dates=["booking_created_at"],
    )

    required_columns = {
        "booking_id",
        "pickup_lat",
        "pickup_lng",
        "booking_created_at",
    }

    missing = required_columns - set(df.columns)

    if missing:
        raise ValueError(
            f"Missing required columns: {sorted(missing)}"
        )

    return df


# ============================================================
# ASSIGN ZONE
# ============================================================

def assign_zone(
    pickup_lat: float,
    pickup_lng: float,
) -> int:
    """
    Assign a pickup coordinate to the nearest zone center.

    This is intentionally simple for the MVP.

    Future production version:
        use the application's real zone/geospatial service.
    """

    best_zone = None
    best_distance = float("inf")

    for zone_id, zone in ZONES.items():

        # Simple Euclidean distance in latitude/longitude space.
        # For this small simulated city area, this is sufficient
        # for assigning points to the nearest zone center.
        distance = (
            (pickup_lat - zone["lat"]) ** 2
            + (pickup_lng - zone["lng"]) ** 2
        )

        if distance < best_distance:
            best_distance = distance
            best_zone = zone_id

    return best_zone


# ============================================================
# CREATE FEATURES
# ============================================================

def create_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Convert raw booking records into a daily zone-hour demand dataset.

    Output:
        zone_id
        hour_of_day
        day_of_week
        booking_count
        booking_date
    """

    # --------------------------------------------------------
    # Assign zone
    # --------------------------------------------------------

    df["zone_id"] = [
    get_zone_from_coordinates(
        lat,
        lng,
    )["zone_id"]
    for lat, lng in zip(
        df["pickup_lat"],
        df["pickup_lng"],
    )
    ]

    # --------------------------------------------------------
    # Extract time features
    # --------------------------------------------------------

    df["hour_of_day"] = (
        df["booking_created_at"].dt.hour
    )

    df["day_of_week"] = (
        df["booking_created_at"].dt.dayofweek
    )

    df["booking_date"] = (
        df["booking_created_at"].dt.date
    )



    # --------------------------------------------------------
    # Aggregate bookings
    # --------------------------------------------------------

    # First count the bookings that actually occurred.
    booking_counts = (
        df.groupby(
            [
                "booking_date",
                "zone_id",
                "hour_of_day",
                "day_of_week",
            ],
            as_index=False,
        )
        .agg(
            booking_count=(
                "booking_id",
                "count",
            )
        )
    )

    # --------------------------------------------------------
    # Create ALL possible date × zone × hour combinations
    # --------------------------------------------------------

    dates = pd.date_range(
        start=df["booking_date"].min(),
        end=df["booking_date"].max(),
        freq="D",
    )

    zones = sorted(ZONES.keys())

    hours = range(24)

    days = dates.dayofweek

    complete_index = pd.MultiIndex.from_product(
        [
            dates,
            zones,
            hours,
        ],
        names=[
            "booking_date",
            "zone_id",
            "hour_of_day",
        ],
    )

    features = (
        booking_counts
        .set_index(
            [
                "booking_date",
                "zone_id",
                "hour_of_day",
            ]
        )
        .reindex(complete_index, fill_value=0)
        .reset_index()
    )

    # Add day of week from the booking date.
    features["day_of_week"] = (
        features["booking_date"].dt.dayofweek
    )

    # Make sure booking_count is an integer.
    features["booking_count"] = (
        features["booking_count"].astype(int)
    )

    # Convert date back into datetime.
    features["booking_date"] = pd.to_datetime(
        features["booking_date"]
    )

    # --------------------------------------------------------
    # Sort chronologically
    # --------------------------------------------------------

    features = features.sort_values(
        [
            "booking_date",
            "zone_id",
            "hour_of_day",
        ]
    ).reset_index(drop=True)

    return features


# ============================================================
# SAVE FEATURES
# ============================================================

def main():

    print("Loading raw demand logs...")

    raw_df = load_raw_data()

    print(f"Raw records: {len(raw_df):,}")

    print("\nCreating ML features...")

    features_df = create_features(raw_df)

    print(
        f"Feature rows created: "
        f"{len(features_df):,}"
    )

    features_df.to_csv(
        FEATURE_DATA_FILE,
        index=False,
    )

    print(
        f"\nSaved feature dataset to:\n"
        f"{FEATURE_DATA_FILE}"
    )

    print("\nFirst 10 rows:")

    print(
        features_df.head(10).to_string(
            index=False
        )
    )

    print("\nFeature dataset information:")

    print(features_df.info())

    print("\nDemand statistics:")

    print(
        features_df["booking_count"].describe()
    )


if __name__ == "__main__":
    main()