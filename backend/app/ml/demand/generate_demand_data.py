import random
from datetime import datetime, timedelta
from pathlib import Path

import pandas as pd
import numpy as np


# ============================================================
# CONFIGURATION
# ============================================================

NUM_BOOKINGS = 30000
DAYS_OF_HISTORY = 180
NUM_ZONES = 8

START_DATE = datetime(2026, 1, 1)

# Simulated city zones.
# Coordinates are intentionally kept configurable so they can
# later be replaced by the actual application's zone definitions.
ZONES = {
    1: {"name": "central_market", "lat": 26.4499, "lng": 80.3319},
    2: {"name": "residential_north", "lat": 26.4850, "lng": 80.3000},
    3: {"name": "industrial_area", "lat": 26.4200, "lng": 80.3700},
    4: {"name": "commercial_district", "lat": 26.4600, "lng": 80.3500},
    5: {"name": "residential_south", "lat": 26.4100, "lng": 80.3200},
    6: {"name": "transport_hub", "lat": 26.4300, "lng": 80.2900},
    7: {"name": "medical_district", "lat": 26.4700, "lng": 80.3150},
    8: {"name": "mixed_area", "lat": 26.4450, "lng": 80.3650},
}


# ============================================================
# DEMAND PATTERN
# ============================================================

def get_base_demand(zone_id, hour, day_of_week):
    """
    Returns the expected relative demand for a particular
    zone, hour and day.

    This creates realistic synthetic patterns that the
    Random Forest can learn from.
    """

    # ----------------------------
    # Zone-specific base demand
    # ----------------------------

    zone_base = {
        1: 10,  # Central market
        2: 6,   # Residential north
        3: 8,   # Industrial
        4: 12,  # Commercial
        5: 6,   # Residential south
        6: 9,   # Transport hub
        7: 7,   # Medical
        8: 8,   # Mixed
    }

    demand = zone_base[zone_id]

    # ----------------------------
    # Time-of-day patterns
    # ----------------------------

    if 7 <= hour <= 10:
        # Morning demand
        if zone_id in [2, 5]:
            demand += 10

        if zone_id in [1, 4, 6]:
            demand += 6

    elif 11 <= hour <= 15:
        # Daytime business demand
        if zone_id in [1, 3, 4, 6, 7]:
            demand += 10

    elif 16 <= hour <= 19:
        # Evening demand
        if zone_id in [1, 2, 4, 5, 8]:
            demand += 9

    elif 20 <= hour <= 22:
        # Evening/night
        if zone_id in [1, 2, 5, 8]:
            demand += 5

    else:
        # Late night / early morning
        demand *= 0.25

    # ----------------------------
    # Weekday/weekend behavior
    # ----------------------------

    # Monday-Friday
    if day_of_week < 5:

        if zone_id in [3, 4]:
            demand *= 1.25

    # Saturday
    elif day_of_week == 5:

        if zone_id in [1, 2, 5, 8]:
            demand *= 1.15

    # Sunday
    else:

        if zone_id in [1, 2, 5, 8]:
            demand *= 0.85

        if zone_id == 3:
            demand *= 0.55

    return max(demand, 0.5)


# ============================================================
# GENERATE BOOKINGS
# ============================================================

def generate_dataset():

    random.seed(42)
    np.random.seed(42)

    records = []

    current_date = START_DATE

    booking_id = 1

    for day_index in range(DAYS_OF_HISTORY):

        date = current_date + timedelta(days=day_index)

        day_of_week = date.weekday()

        # Generate demand for every zone and every hour.
        for zone_id in range(1, NUM_ZONES + 1):

            for hour in range(24):

                expected_demand = get_base_demand(
                    zone_id,
                    hour,
                    day_of_week
                )

                # Add realistic randomness.
                booking_count = np.random.poisson(
                    expected_demand
                )

                zone = ZONES[zone_id]

                # Generate individual bookings.
                for _ in range(booking_count):

                    # Random minute/second inside the hour
                    minute = random.randint(0, 59)
                    second = random.randint(0, 59)

                    booking_time = date.replace(
                        hour=hour,
                        minute=minute,
                        second=second
                    )

                    # Small coordinate variation around
                    # the zone's center.
                    pickup_lat = zone["lat"] + np.random.normal(
                        0,
                        0.003
                    )

                    pickup_lng = zone["lng"] + np.random.normal(
                        0,
                        0.003
                    )

                    records.append({
                        "booking_id": booking_id,
                        "pickup_lat": round(
                            pickup_lat,
                            6
                        ),
                        "pickup_lng": round(
                            pickup_lng,
                            6
                        ),
                        "booking_created_at": booking_time
                    })

                    booking_id += 1

    df = pd.DataFrame(records)

    return df


# ============================================================
# SAVE DATASET
# ============================================================

def main():

    print("Generating synthetic demand data...")

    df = generate_dataset()

    output_dir = Path(__file__).parent / "data"

    output_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    output_file = output_dir / "demand_logs.csv"

    df.to_csv(
        output_file,
        index=False
    )

    print()
    print("Dataset generated successfully!")
    print(f"Records: {len(df):,}")
    print(f"Saved to: {output_file}")

    print()
    print("First 5 records:")
    print(df.head())

    print()
    print("Dataset information:")
    print(df.info())


if __name__ == "__main__":
    main()