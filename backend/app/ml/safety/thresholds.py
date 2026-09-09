"""
Configurable safety detection thresholds.

These values are MVP defaults.
They should eventually be calibrated using real
GPS/route data from the application.
"""


# ------------------------------------------------------------
# Route deviation
# ------------------------------------------------------------

# Maximum acceptable distance between a GPS point and
# the expected route before it is considered a deviation.
ROUTE_DEVIATION_THRESHOLD_METERS = 500


# ------------------------------------------------------------
# Long stop
# ------------------------------------------------------------

# Minimum duration for a stationary vehicle to be flagged.
LONG_STOP_MINUTES = 10

# If the vehicle remains within this radius from the
# beginning of a stop, we consider it stationary.
STATIONARY_RADIUS_METERS = 50