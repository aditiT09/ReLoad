from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

FEATURE_DATA_FILE = DATA_DIR / "demand_features.csv"
MODEL_FILE = BASE_DIR / "model.pkl"

# Percentage of historical dates used for training.
TRAIN_RATIO = 0.80

# Random Forest configuration.
N_ESTIMATORS = 200
RANDOM_STATE = 42


# ============================================================
# LOAD DATA
# ============================================================

def load_data() -> pd.DataFrame:
    """Load the engineered demand dataset."""

    if not FEATURE_DATA_FILE.exists():
        raise FileNotFoundError(
            f"Feature dataset not found: {FEATURE_DATA_FILE}\n"
            "Run features.py first."
        )

    df = pd.read_csv(
        FEATURE_DATA_FILE,
        parse_dates=["booking_date"],
    )

    required_columns = {
        "booking_date",
        "zone_id",
        "hour_of_day",
        "day_of_week",
        "booking_count",
    }

    missing = required_columns - set(df.columns)

    if missing:
        raise ValueError(
            f"Missing required columns: {sorted(missing)}"
        )

    return df


# ============================================================
# TIME-BASED TRAIN / TEST SPLIT
# ============================================================

def split_data(df: pd.DataFrame):
    """
    Split chronologically.

    Earlier dates → training
    Later dates   → testing

    This is more appropriate for forecasting than a random split.
    """

    dates = sorted(df["booking_date"].dt.date.unique())

    split_index = int(len(dates) * TRAIN_RATIO)

    train_dates = dates[:split_index]
    test_dates = dates[split_index:]

    train_df = df[
        df["booking_date"].dt.date.isin(train_dates)
    ].copy()

    test_df = df[
        df["booking_date"].dt.date.isin(test_dates)
    ].copy()

    return train_df, test_df


# ============================================================
# TRAIN MODEL
# ============================================================

def train_model(train_df: pd.DataFrame):

    features = [
        "zone_id",
        "hour_of_day",
        "day_of_week",
    ]

    target = "booking_count"

    X_train = train_df[features]
    y_train = train_df[target]

    print("\nTraining Random Forest...")

    model = RandomForestRegressor(
        n_estimators=N_ESTIMATORS,
        random_state=RANDOM_STATE,
        n_jobs=-1,
        min_samples_leaf=2,
    )

    model.fit(
        X_train,
        y_train,
    )

    return model


# ============================================================
# EVALUATE MODEL
# ============================================================

def evaluate_model(
    model,
    test_df: pd.DataFrame,
):
    """Evaluate predictions on unseen future dates."""

    features = [
        "zone_id",
        "hour_of_day",
        "day_of_week",
    ]

    X_test = test_df[features]
    y_test = test_df["booking_count"]

    predictions = model.predict(X_test)

    mae = mean_absolute_error(
        y_test,
        predictions,
    )

    rmse = mean_squared_error(
        y_test,
        predictions,
    ) ** 0.5

    return mae, rmse


# ============================================================
# FEATURE IMPORTANCE
# ============================================================

def print_feature_importance(model):
    """Display which input features influenced the model most."""

    features = [
        "zone_id",
        "hour_of_day",
        "day_of_week",
    ]

    importance = pd.DataFrame({
        "feature": features,
        "importance": model.feature_importances_,
    })

    importance = importance.sort_values(
        "importance",
        ascending=False,
    )

    print("\nFeature importance:")
    print(
        importance.to_string(
            index=False
        )
    )


# ============================================================
# MAIN
# ============================================================

def main():

    print("Loading feature dataset...")

    df = load_data()

    print(
        f"Total feature rows: {len(df):,}"
    )

    # --------------------------------------------------------
    # Chronological split
    # --------------------------------------------------------

    train_df, test_df = split_data(df)

    print(
        f"\nTraining rows: {len(train_df):,}"
    )

    print(
        f"Testing rows: {len(test_df):,}"
    )

    print(
        f"\nTraining period:"
        f" {train_df['booking_date'].min().date()}"
        f" → "
        f"{train_df['booking_date'].max().date()}"
    )

    print(
        f"Testing period:"
        f" {test_df['booking_date'].min().date()}"
        f" → "
        f"{test_df['booking_date'].max().date()}"
    )

    # --------------------------------------------------------
    # Train
    # --------------------------------------------------------

    model = train_model(train_df)

    # --------------------------------------------------------
    # Evaluate
    # --------------------------------------------------------

    mae, rmse = evaluate_model(
        model,
        test_df,
    )

    print("\nModel evaluation:")
    print(
        f"MAE  : {mae:.3f}"
    )

    print(
        f"RMSE : {rmse:.3f}"
    )

    # --------------------------------------------------------
    # Explainability
    # --------------------------------------------------------

    print_feature_importance(model)

    # --------------------------------------------------------
    # Save model
    # --------------------------------------------------------

    joblib.dump(
        model,
        MODEL_FILE,
    )

    print(
        f"\nModel saved successfully:"
        f"\n{MODEL_FILE}"
    )


if __name__ == "__main__":
    main()