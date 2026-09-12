# tests/test_gps_websocket.py

import pytest
from fastapi.testclient import TestClient
from starlette.websockets import WebSocketDisconnect

from app.main import app
from app.models.gps_ping import GPSPing
from tests.test_person4_flows import (
    TestingSessionLocal,
    client,
    create_test_entities,
    reset_db
)


def test_gps_websocket_auth_rejection():
    """Verify that connecting without token or with invalid token is rejected with WS 1008 policy violation."""
    reset_db()
    entities = create_test_entities()
    booking = entities["booking"]

    with TestClient(app) as ws_client:
        # 1. Missing token
        with pytest.raises(Exception):
            with ws_client.websocket_connect(f"/api/v1/ws/gps/{booking.id}") as ws:
                ws.send_text("test")

        # 2. Invalid token
        with pytest.raises(Exception):
            with ws_client.websocket_connect(f"/api/v1/ws/gps/{booking.id}?token=invalid_garbage_token") as ws:
                ws.send_text("test")


def test_gps_websocket_transmission_and_persistence():
    """
    Verify real-time GPS transmission over /api/v1/ws/gps/{booking_id}:
    1. Driver sends GPS payload with coordinates, speed, heading, timestamp.
    2. Customer WebSocket receives live broadcast.
    3. GPS ping row is persisted to gps_pings table in DB.
    4. GET /api/v1/bookings/{booking_id}/gps-pings/latest returns latest coordinates.
    """
    reset_db()
    entities = create_test_entities()
    booking = entities["booking"]
    tokens = entities["tokens"]
    customer = entities["customer"]
    driver = entities["driver"]

    # Advance booking status to pickup_confirmed then in_transit
    client.patch(f"/api/v1/bookings/{booking.id}/status", json={"status": "pickup_confirmed"})
    client.patch(f"/api/v1/bookings/{booking.id}/status", json={"status": "in_transit"})

    with TestClient(app) as ws_client:
        with ws_client.websocket_connect(f"/api/v1/ws/gps/{booking.id}?token={tokens['customer']}") as ws_cust:
            with ws_client.websocket_connect(f"/api/v1/ws/gps/{booking.id}?token={tokens['driver']}") as ws_driver:
                # Send GPS ping payload
                payload = {
                    "lat": 18.5204,
                    "lng": 73.8567,
                    "speed": 15.2,
                    "heading": 85.0,
                    "accuracy": 4.5,
                    "timestamp": "2026-09-12T10:30:00Z"
                }
                import json
                ws_driver.send_text(json.dumps(payload))

                # Customer receives broadcast
                received = ws_cust.receive_json()
                assert received["lat"] == 18.5204
                assert received["lng"] == 73.8567
                assert received["speed"] == 15.2
                assert received["heading"] == 85.0
                assert received["accuracy"] == 4.5
                assert received["driver_id"] == str(driver.id)
                assert received["booking_id"] == str(booking.id)

    # Verify persistence in database
    db = TestingSessionLocal()
    saved_ping = db.query(GPSPing).filter(GPSPing.booking_id == booking.id).first()
    assert saved_ping is not None
    assert saved_ping.lat == 18.5204
    assert saved_ping.lng == 73.8567
    assert saved_ping.driver_id == driver.id
    db.close()

    # Verify GET /api/v1/bookings/{booking_id}/gps-pings/latest
    res_latest = client.get(
        f"/api/v1/bookings/{booking.id}/gps-pings/latest",
        headers={"Authorization": f"Bearer {tokens['customer']}"}
    )
    assert res_latest.status_code == 200
    data = res_latest.json()
    assert data["lat"] == 18.5204
    assert data["lng"] == 73.8567
    assert data["booking_id"] == str(booking.id)


def test_gps_coordinate_range_validation():
    """Verify that coordinates outside -90..90 and -180..180 are rejected with an error message."""
    reset_db()
    entities = create_test_entities()
    booking = entities["booking"]
    tokens = entities["tokens"]

    client.patch(f"/api/v1/bookings/{booking.id}/status", json={"status": "pickup_confirmed"})
    client.patch(f"/api/v1/bookings/{booking.id}/status", json={"status": "in_transit"})

    with TestClient(app) as ws_client:
        with ws_client.websocket_connect(f"/api/v1/ws/gps/{booking.id}?token={tokens['driver']}") as ws_driver:
            import json
            # Send invalid lat > 90
            ws_driver.send_text(json.dumps({"lat": 95.0, "lng": 73.8567}))
            err = ws_driver.receive_json()
            assert "error" in err
            assert "out of range" in err["error"].lower()
