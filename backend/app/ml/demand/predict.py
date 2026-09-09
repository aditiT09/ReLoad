from pathlib import Path
from typing import List

import joblib
import pandas as pd


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
MODEL_FILE = BASE_DIR / "model.pkl"

FEATURES = [
    "zone_id",
    "hour_of_day",
    "day_of_week",
]


# ============================================================
# LOAD MODEL
# ============================================================

def load_model():
    """Load the trained Random Forest model."""

    if not MODEL_FILE.exists():
        raise FileNotFoundError(
            f"Trained model not found: {MODEL_FILE}. "
            "Run train.py first."
        )

    return joblib.load(MODEL_FILE)


# ============================================================
# DEMAND LEVEL
# ============================================================

def get_demand_level(predicted_bookings: float) -> str:
    """
    Convert predicted booking volume into a driver-friendly
    demand category.

    MVP thresholds; these can later be calibrated using
    real platform demand distributions.
    """

    if predicted_bookings < 5:
        return "LOW"

    if predicted_bookings < 15:
        return "MEDIUM"

    return "HIGH"


# ============================================================
# SINGLE PREDICTION
# ============================================================

def predict_demand(
    model,
    zone_id: int,
    hour_of_day: int,
    day_of_week: int,
) -> dict:
    """Predict demand for one zone and one hour."""

    input_data = pd.DataFrame(
        [
            {
                "zone_id": zone_id,
                "hour_of_day": hour_of_day,
                "day_of_week": day_of_week,
            }
        ]
    )

    prediction = model.predict(
        input_data[FEATURES]
    )[0]

    prediction = max(
        0.0,
        float(prediction),
    )

    return {
        "zone_id": zone_id,
        "hour_of_day": hour_of_day,
        "day_of_week": day_of_week,
        "predicted_bookings": round(
            prediction,
            2,
        ),
        "demand_level": get_demand_level(
            prediction
        ),
    }


# ============================================================
# MULTI-HOUR FORECAST
# ============================================================

def forecast_next_hours(
    model,
    zone_id: int,
    start_hour: int,
    day_of_week: int,
    hours_ahead: int = 4,
) -> List[dict]:
    """
    Forecast demand for the current hour and the next
    few hours.

    The hour wraps around midnight.
    The day changes automatically when needed.
    """

    results = []

    current_hour = start_hour
    current_day = day_of_week

    for offset in range(hours_ahead):

        result = predict_demand(
            model=model,
            zone_id=zone_id,
            hour_of_day=current_hour,
            day_of_week=current_day,
        )

        result["hours_from_now"] = offset

        results.append(result)

        # Move to next hour.
        current_hour += 1

        # Midnight rollover.
        if current_hour == 24:
            current_hour = 0
            current_day = (
                current_day + 1
            ) % 7

    return results


# ============================================================
# FEATURE IMPORTANCE
# ============================================================

def get_feature_importance(model) -> dict:
    """Return feature importance learned by the model."""

    return {
        feature: round(
            float(importance),
            4,
        )
        for feature, importance in zip(
            FEATURES,
            model.feature_importances_,
        )
    }


# ============================================================
# TEST
# ============================================================

def main():

    model = load_model()

    forecast = forecast_next_hours(
        model=model,
        zone_id=2,
        start_hour=10,
        day_of_week=3,
        hours_ahead=4,
    )

    print("\nNext-hours forecast:")

    for item in forecast:
        print(item)

    print("\nFeature importance:")
    print(
        get_feature_importance(model)
    )


if __name__ == "__main__":
    main()