# tests/test_person4_flows.py

import os
import sys
import uuid
from decimal import Decimal
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.ext.compiler import compiles
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Set dummy env vars for test suite
os.environ["DATABASE_URL"] = "sqlite:///:memory:"
os.environ["JWT_SECRET_KEY"] = "test-secret-key-for-jwt-verification-12345"

# SQLite custom compilers for PostgreSQL types in models
@compiles(JSONB, "sqlite")
def compile_jsonb_sqlite(type_, compiler, **kw):
    return "TEXT"

@compiles(PG_UUID, "sqlite")
def compile_uuid_sqlite(type_, compiler, **kw):
    return "TEXT"

from app.core.database import Base, get_db
from app.core.security import create_access_token, hash_password
from app.main import app
from app.models import (
    Booking, BookingStatus, CargoCategory, HandoffProof, HandoffStage,
    Message, Notification, Payment, PaymentRecordStatus, PaymentStatus,
    SurchargeRequest, User, UserRole, Vehicle, VehicleType, VehicleVerificationStatus
)
from app.services.fare_service import calculate_fare, calculate_fare_for_distance, VEHICLE_RATES, CARGO_MULTIPLIERS

# Setup in-memory SQLite engine
engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def reset_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def create_test_entities():
    db = TestingSessionLocal()
    # 1. Customer
    customer = User(
        id=uuid.uuid4(),
        role=UserRole.customer,
        name="Test Customer",
        phone="+919876543210",
        email="customer@test.com",
        password_hash=hash_password("password123")
    )
    # 2. Driver
    driver = User(
        id=uuid.uuid4(),
        role=UserRole.driver,
        name="Test Driver",
        phone="+919876543211",
        email="driver@test.com",
        password_hash=hash_password("password123")
    )
    # 3. Third party / unauthorized user
    other_user = User(
        id=uuid.uuid4(),
        role=UserRole.customer,
        name="Other User",
        phone="+919876543212",
        email="other@test.com",
        password_hash=hash_password("password123")
    )
    db.add_all([customer, driver, other_user])
    db.commit()

    # 4. Vehicle
    vehicle = Vehicle(
        id=uuid.uuid4(),
        driver_id=driver.id,
        type=VehicleType.truck,
        registration_number="UP32-TEST-1234",
        registration_year=2024,
        verification_status=VehicleVerificationStatus.verified
    )
    db.add(vehicle)
    db.commit()

    # 5. Booking
    base_fare = calculate_fare_for_distance(10.0, "truck", "general")
    booking = Booking(
        id=uuid.uuid4(),
        customer_id=customer.id,
        driver_id=driver.id,
        vehicle_id=vehicle.id,
        pickup_address="Hazratganj, Lucknow",
        pickup_lat=26.8500,
        pickup_lng=80.9499,
        dropoff_address="Gomti Nagar, Lucknow",
        dropoff_lat=26.8606,
        dropoff_lng=80.9858,
        cargo_category=CargoCategory.general,
        status=BookingStatus.accepted,
        base_fare=base_fare,
        final_fare=None,
        payment_status=PaymentStatus.pending
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    tokens = {
        "customer": create_access_token({"sub": str(customer.id)}),
        "driver": create_access_token({"sub": str(driver.id)}),
        "other": create_access_token({"sub": str(other_user.id)}),
    }

    data = {
        "customer": customer,
        "driver": driver,
        "other_user": other_user,
        "vehicle": vehicle,
        "booking": booking,
        "tokens": tokens
    }
    db.close()
    return data


# ==========================================
# 1. PRICING TESTS
# ==========================================
def test_pricing_vehicle_rates_and_cargo_multipliers():
    # Base formula: 50.0 + (distance * rate * multiplier)
    # Bike 10km general: 50 + 10 * 8 * 1.0 = 130.00
    assert calculate_fare_for_distance(10.0, "bike", "general") == Decimal("130.00")
    # Truck 10km general: 50 + 10 * 35 * 1.0 = 400.00
    assert calculate_fare_for_distance(10.0, "truck", "general") == Decimal("400.00")
    # Truck 10km pharma (1.25): 50 + 10 * 35 * 1.25 = 487.50
    assert calculate_fare_for_distance(10.0, "truck", "pharma") == Decimal("487.50")
    # Cold chain van 10km cold_chain (1.30): 50 + 10 * 40 * 1.30 = 570.00
    assert calculate_fare_for_distance(10.0, "cold_chain_van", "cold_chain") == Decimal("570.00")
    # Tempo 10km dairy (1.20): 50 + 10 * 15 * 1.20 = 230.00
    assert calculate_fare_for_distance(10.0, "tempo", "dairy") == Decimal("230.00")


def test_pricing_locked_base_fare():
    reset_db()
    entities = create_test_entities()
    booking = entities["booking"]
    assert booking.base_fare == Decimal("400.00")
    assert booking.final_fare is None


# ==========================================
# 2. SURCHARGE TESTS
# ==========================================
def test_surcharge_flow():
    reset_db()
    entities = create_test_entities()
    booking = entities["booking"]
    tokens = entities["tokens"]

    # 1. Non-driver requesting surcharge should fail with 403
    res = client.post(
        f"/api/v1/bookings/{booking.id}/surcharge-request",
        json={"amount": 150.0, "reason": "Extra waiting time"},
        headers={"Authorization": f"Bearer {tokens['customer']}"}
    )
    assert res.status_code == 403

    # 2. Driver requests surcharge
    res = client.post(
        f"/api/v1/bookings/{booking.id}/surcharge-request",
        json={"amount": 150.0, "reason": "Extra waiting time"},
        headers={"Authorization": f"Bearer {tokens['driver']}"}
    )
    assert res.status_code == 201
    surcharge_data = res.json()
    assert surcharge_data["amount"] == "150.00"
    assert surcharge_data["customer_confirmed"] is False
    surcharge_id = surcharge_data["id"]

    # Verify booking final_fare is UNCHANGED before customer confirmation
    b_res = client.get(f"/api/v1/bookings/{booking.id}")
    assert b_res.json()["base_fare"] == "400.00"
    assert b_res.json()["final_fare"] is None

    # 3. Driver cannot confirm own surcharge (must be customer)
    res_driver_conf = client.patch(
        f"/api/v1/bookings/{booking.id}/surcharge-request/{surcharge_id}/confirm",
        headers={"Authorization": f"Bearer {tokens['driver']}"}
    )
    assert res_driver_conf.status_code == 403

    # 4. Customer confirms surcharge
    res_conf = client.patch(
        f"/api/v1/bookings/{booking.id}/surcharge-request/{surcharge_id}/confirm",
        headers={"Authorization": f"Bearer {tokens['customer']}"}
    )
    assert res_conf.status_code == 200
    assert res_conf.json()["customer_confirmed"] is True

    # Verify final_fare is updated to 400 + 150 = 550.00
    b_res2 = client.get(f"/api/v1/bookings/{booking.id}")
    assert b_res2.json()["base_fare"] == "400.00"
    assert b_res2.json()["final_fare"] == "550.00"

    # 5. Duplicate confirmation rejected with 409
    res_dup = client.patch(
        f"/api/v1/bookings/{booking.id}/surcharge-request/{surcharge_id}/confirm",
        headers={"Authorization": f"Bearer {tokens['customer']}"}
    )
    assert res_dup.status_code == 409


# ==========================================
# 3. HANDOFF PROOF & VERIFICATION TESTS
# ==========================================
def test_handoff_proof_flow():
    reset_db()
    entities = create_test_entities()
    booking = entities["booking"]
    tokens = entities["tokens"]

    # 1. Driver creates pickup handoff proof
    res_p = client.post(
        f"/api/v1/bookings/{booking.id}/handoff-proof",
        json={
            "stage": "pickup",
            "photo_url": "https://storage.reload.in/proofs/pickup_123.jpg",
            "lat": 26.8500,
            "lng": 80.9499
        },
        headers={"Authorization": f"Bearer {tokens['driver']}"}
    )
    assert res_p.status_code == 201
    pickup_data = res_p.json()
    assert pickup_data["confirmed_by_driver"] is True
    assert pickup_data["confirmed_by_customer"] is False
    pickup_id = pickup_data["id"]

    # 2. Driver cannot confirm again (duplicate)
    res_dup = client.patch(
        f"/api/v1/bookings/{booking.id}/handoff-proof/{pickup_id}/confirm",
        headers={"Authorization": f"Bearer {tokens['driver']}"}
    )
    assert res_dup.status_code == 409

    # 3. Unauthorized user rejected (403)
    res_unauth = client.patch(
        f"/api/v1/bookings/{booking.id}/handoff-proof/{pickup_id}/confirm",
        headers={"Authorization": f"Bearer {tokens['other']}"}
    )
    assert res_unauth.status_code == 403

    # 4. Customer confirms pickup proof
    res_c = client.patch(
        f"/api/v1/bookings/{booking.id}/handoff-proof/{pickup_id}/confirm",
        headers={"Authorization": f"Bearer {tokens['customer']}"}
    )
    assert res_c.status_code == 200
    assert res_c.json()["confirmed_by_customer"] is True
    assert res_c.json()["confirmed_by_driver"] is True

    # Verify booking status transitioned to pickup_confirmed
    b_res = client.get(f"/api/v1/bookings/{booking.id}")
    assert b_res.json()["status"] == "pickup_confirmed"


# ==========================================
# 4. PAYMENT CHECKOUT & RELEASE TESTS
# ==========================================
def test_payment_escrow_and_release_gating():
    reset_db()
    entities = create_test_entities()
    booking = entities["booking"]
    tokens = entities["tokens"]

    # 1. Customer initiates checkout
    res_co = client.post(
        f"/api/v1/bookings/{booking.id}/payment/checkout",
        json={"gateway": "mock_gateway"},
        headers={"Authorization": f"Bearer {tokens['customer']}"}
    )
    assert res_co.status_code == 201
    pay_data = res_co.json()
    assert pay_data["status"] == "held"
    assert pay_data["amount"] == "400.00"
    assert pay_data["gateway_payment_id"].startswith("mock_pay_")

    # 2. Attempting release before dropoff proof completed must fail with 400
    res_rel_blocked = client.post(
        f"/api/v1/bookings/{booking.id}/payment/release",
        headers={"Authorization": f"Bearer {tokens['customer']}"}
    )
    assert res_rel_blocked.status_code == 400
    assert "cannot be released" in res_rel_blocked.json()["detail"].lower()

    # 3. Create pickup proof and confirm by both
    res_p = client.post(
        f"/api/v1/bookings/{booking.id}/handoff-proof",
        json={
            "stage": "pickup",
            "photo_url": "https://storage.reload.in/pickup.jpg",
            "lat": 26.8500,
            "lng": 80.9499
        },
        headers={"Authorization": f"Bearer {tokens['driver']}"}
    )
    pickup_id = res_p.json()["id"]
    client.patch(
        f"/api/v1/bookings/{booking.id}/handoff-proof/{pickup_id}/confirm",
        headers={"Authorization": f"Bearer {tokens['customer']}"}
    )

    # Transition to in_transit
    client.patch(
        f"/api/v1/bookings/{booking.id}/status",
        json={"status": "in_transit"}
    )

    # 4. Create dropoff proof and confirm by both
    res_d = client.post(
        f"/api/v1/bookings/{booking.id}/handoff-proof",
        json={
            "stage": "dropoff",
            "photo_url": "https://storage.reload.in/dropoff.jpg",
            "lat": 26.8606,
            "lng": 80.9858
        },
        headers={"Authorization": f"Bearer {tokens['driver']}"}
    )
    dropoff_id = res_d.json()["id"]
    client.patch(
        f"/api/v1/bookings/{booking.id}/handoff-proof/{dropoff_id}/confirm",
        headers={"Authorization": f"Bearer {tokens['customer']}"}
    )

    # 5. Now release payment -> must succeed!
    res_rel = client.post(
        f"/api/v1/bookings/{booking.id}/payment/release",
        headers={"Authorization": f"Bearer {tokens['customer']}"}
    )
    assert res_rel.status_code == 200
    assert res_rel.json()["status"] == "released"

    # Verify booking payment_status is paid
    b_res = client.get(f"/api/v1/bookings/{booking.id}")
    assert b_res.json()["payment_status"] == "paid"

    # 6. Duplicate release blocked with 409
    res_rel_dup = client.post(
        f"/api/v1/bookings/{booking.id}/payment/release",
        headers={"Authorization": f"Bearer {tokens['customer']}"}
    )
    assert res_rel_dup.status_code == 409


# ==========================================
# 5. CHAT TESTS
# ==========================================
def test_chat_messages():
    reset_db()
    entities = create_test_entities()
    booking = entities["booking"]
    tokens = entities["tokens"]

    # 1. Customer sends message
    res = client.post(
        f"/api/v1/bookings/{booking.id}/messages",
        json={"content": "Hi driver, I am waiting at gate 2."},
        headers={"Authorization": f"Bearer {tokens['customer']}"}
    )
    assert res.status_code == 201
    assert res.json()["content"] == "Hi driver, I am waiting at gate 2."

    # 2. Driver sends reply
    res2 = client.post(
        f"/api/v1/bookings/{booking.id}/messages",
        json={"content": "Acknowledged, reaching in 5 mins."},
        headers={"Authorization": f"Bearer {tokens['driver']}"}
    )
    assert res2.status_code == 201

    # 3. Retrieve messages
    history_res = client.get(
        f"/api/v1/bookings/{booking.id}/messages",
        headers={"Authorization": f"Bearer {tokens['customer']}"}
    )
    assert history_res.status_code == 200
    messages = history_res.json()
    assert len(messages) == 2
    assert messages[0]["content"] == "Hi driver, I am waiting at gate 2."
    assert messages[1]["content"] == "Acknowledged, reaching in 5 mins."

    # 4. Unauthorized user rejected
    res_unauth = client.get(
        f"/api/v1/bookings/{booking.id}/messages",
        headers={"Authorization": f"Bearer {tokens['other']}"}
    )
    assert res_unauth.status_code == 403


# ==========================================
# 6. NOTIFICATIONS TESTS
# ==========================================
def test_notifications_isolation_and_read():
    reset_db()
    entities = create_test_entities()
    customer = entities["customer"]
    driver = entities["driver"]
    tokens = entities["tokens"]
    booking = entities["booking"]

    # Trigger a notification by requesting surcharge
    client.post(
        f"/api/v1/bookings/{booking.id}/surcharge-request",
        json={"amount": 100.0, "reason": "Late night shift"},
        headers={"Authorization": f"Bearer {tokens['driver']}"}
    )

    # Customer notifications
    res = client.get(
        "/api/v1/notifications/",
        headers={"Authorization": f"Bearer {tokens['customer']}"}
    )
    assert res.status_code == 200
    notifs = res.json()
    assert len(notifs) >= 1
    for n in notifs:
        assert n["user_id"] == str(customer.id)

    # Driver notifications
    res_d = client.get(
        "/api/v1/notifications/",
        headers={"Authorization": f"Bearer {tokens['driver']}"}
    )
    assert res_d.status_code == 200
    d_notifs = res_d.json()
    for n in d_notifs:
        assert n["user_id"] == str(driver.id)

    # Test mark as read
    nid = notifs[0]["id"]
    patch_res = client.patch(
        f"/api/v1/notifications/{nid}/read",
        headers={"Authorization": f"Bearer {tokens['customer']}"}
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["read"] is True

    # Driver cannot mark customer's notification as read
    patch_fail = client.patch(
        f"/api/v1/notifications/{nid}/read",
        headers={"Authorization": f"Bearer {tokens['driver']}"}
    )
    assert patch_fail.status_code == 403


# ==========================================
# 7. GPS TESTS
# ==========================================
def test_gps_pings():
    reset_db()
    entities = create_test_entities()
    booking = entities["booking"]
    tokens = entities["tokens"]

    # 1. Non-in-transit booking rejected with 400
    res_not_transit = client.post(
        f"/api/v1/bookings/{booking.id}/gps-pings",
        json={"lat": 26.8520, "lng": 80.9510},
        headers={"Authorization": f"Bearer {tokens['driver']}"}
    )
    assert res_not_transit.status_code == 400

    # Advance status: accepted -> pickup_confirmed -> in_transit
    client.patch(f"/api/v1/bookings/{booking.id}/status", json={"status": "pickup_confirmed"})
    client.patch(f"/api/v1/bookings/{booking.id}/status", json={"status": "in_transit"})

    # 2. Non-driver rejected with 403
    res_not_driver = client.post(
        f"/api/v1/bookings/{booking.id}/gps-pings",
        json={"lat": 26.8520, "lng": 80.9510},
        headers={"Authorization": f"Bearer {tokens['customer']}"}
    )
    assert res_not_driver.status_code == 403

    # 3. Assigned driver accepted (201)
    res_driver = client.post(
        f"/api/v1/bookings/{booking.id}/gps-pings",
        json={"lat": 26.8520, "lng": 80.9510},
        headers={"Authorization": f"Bearer {tokens['driver']}"}
    )
    assert res_driver.status_code == 201
    assert res_driver.json()["lat"] == 26.8520
    assert res_driver.json()["lng"] == 80.9510


# ==========================================
# 8. WEBSOCKET TESTS (CHAT & GPS)
# ==========================================
def test_websockets_chat_and_gps():
    reset_db()
    entities = create_test_entities()
    booking = entities["booking"]
    tokens = entities["tokens"]
    customer = entities["customer"]
    driver = entities["driver"]

    # Advance booking to in_transit for GPS
    client.patch(f"/api/v1/bookings/{booking.id}/status", json={"status": "pickup_confirmed"})
    client.patch(f"/api/v1/bookings/{booking.id}/status", json={"status": "in_transit"})

    # 1. Chat WebSocket
    with client.websocket_connect(f"/ws/bookings/{booking.id}/chat?token={tokens['customer']}") as ws_cust:
        with client.websocket_connect(f"/ws/bookings/{booking.id}/chat?token={tokens['driver']}") as ws_driver:
            ws_cust.send_text("Hello driver via WebSocket!")
            msg_recv = ws_driver.receive_json()
            assert msg_recv["content"] == "Hello driver via WebSocket!"
            assert msg_recv["sender_id"] == str(customer.id)

    # 2. GPS WebSocket
    with client.websocket_connect(f"/ws/bookings/{booking.id}/tracking?token={tokens['customer']}") as ws_cust_gps:
        with client.websocket_connect(f"/ws/bookings/{booking.id}/tracking?token={tokens['driver']}") as ws_driver_gps:
            ws_driver_gps.send_text('{"lat": 26.8550, "lng": 80.9550}')
            gps_recv = ws_cust_gps.receive_json()
            assert gps_recv["lat"] == 26.8550
            assert gps_recv["lng"] == 80.9550
            assert gps_recv["driver_id"] == str(driver.id)


# ==========================================
# 9. COMPLETE HACKATHON DEMO FLOW TEST
# ==========================================
def test_complete_hackathon_demo_flow():
    """
    Demonstrates the full end-to-end trust chain:
    1. Booking created -> locked base fare (truck, 10km = ₹400.00)
    2. Payment checkout initiated -> payment status 'held' in escrow
    3. Driver requests surcharge of ₹200.00 for additional handling
    4. Surcharge remains unconfirmed, final_fare unchanged
    5. Customer receives notification and approves surcharge -> final_fare = ₹600.00
    6. Driver uploads pickup proof -> driver confirmed
    7. Customer confirms pickup proof -> dual confirmation -> status advances to 'pickup_confirmed'
    8. Booking transitions to 'in_transit'
    9. Driver streams live GPS coordinates -> broadcast to customer
    10. Driver uploads dropoff proof -> driver confirmed
    11. Customer confirms dropoff proof -> dual confirmation -> status advances to 'delivered'
    12. Payment release is triggered -> handoff validation passes -> payment status 'released', booking payment_status 'paid'
    13. Booking transitions to 'closed'
    """
    reset_db()
    entities = create_test_entities()
    booking = entities["booking"]
    tokens = entities["tokens"]
    customer = entities["customer"]
    driver = entities["driver"]

    # Step 1: Verify locked base fare
    assert booking.base_fare == Decimal("400.00")
    assert booking.final_fare is None

    # Step 2: Payment held
    res_co = client.post(
        f"/api/v1/bookings/{booking.id}/payment/checkout",
        json={"gateway": "mock_gateway"},
        headers={"Authorization": f"Bearer {tokens['customer']}"}
    )
    assert res_co.status_code == 201
    assert res_co.json()["status"] == "held"
    assert res_co.json()["amount"] == "400.00"

    # Step 3 & 4: Driver requests surcharge of ₹200.00
    res_sur = client.post(
        f"/api/v1/bookings/{booking.id}/surcharge-request",
        json={"amount": 200.00, "reason": "Additional fragile cargo handling"},
        headers={"Authorization": f"Bearer {tokens['driver']}"}
    )
    assert res_sur.status_code == 201
    sur_id = res_sur.json()["id"]

    # Fare unchanged before customer approval
    b_check = client.get(f"/api/v1/bookings/{booking.id}").json()
    assert b_check["final_fare"] is None

    # Step 5: Customer approves surcharge
    res_sur_app = client.patch(
        f"/api/v1/bookings/{booking.id}/surcharge-request/{sur_id}/confirm",
        headers={"Authorization": f"Bearer {tokens['customer']}"}
    )
    assert res_sur_app.status_code == 200

    b_updated = client.get(f"/api/v1/bookings/{booking.id}").json()
    assert b_updated["base_fare"] == "400.00"
    assert b_updated["final_fare"] == "600.00"

    # Step 6 & 7: Pickup handoff proof with dual confirmation
    res_pick = client.post(
        f"/api/v1/bookings/{booking.id}/handoff-proof",
        json={
            "stage": "pickup",
            "photo_url": "https://cdn.reload.in/proofs/pickup_demo.jpg",
            "lat": 26.8500,
            "lng": 80.9499
        },
        headers={"Authorization": f"Bearer {tokens['driver']}"}
    )
    assert res_pick.status_code == 201
    pick_id = res_pick.json()["id"]

    res_pick_conf = client.patch(
        f"/api/v1/bookings/{booking.id}/handoff-proof/{pick_id}/confirm",
        headers={"Authorization": f"Bearer {tokens['customer']}"}
    )
    assert res_pick_conf.status_code == 200
    assert res_pick_conf.json()["confirmed_by_customer"] is True
    assert res_pick_conf.json()["confirmed_by_driver"] is True

    # Status auto-advanced to pickup_confirmed
    assert client.get(f"/api/v1/bookings/{booking.id}").json()["status"] == "pickup_confirmed"

    # Step 8 & 9: In-transit & live GPS
    client.patch(
        f"/api/v1/bookings/{booking.id}/status",
        json={"status": "in_transit"}
    )
    res_gps = client.post(
        f"/api/v1/bookings/{booking.id}/gps-pings",
        json={"lat": 26.8555, "lng": 80.9600},
        headers={"Authorization": f"Bearer {tokens['driver']}"}
    )
    assert res_gps.status_code == 201

    # Step 10 & 11: Dropoff handoff proof with dual confirmation
    res_drop = client.post(
        f"/api/v1/bookings/{booking.id}/handoff-proof",
        json={
            "stage": "dropoff",
            "photo_url": "https://cdn.reload.in/proofs/dropoff_demo.jpg",
            "lat": 26.8606,
            "lng": 80.9858
        },
        headers={"Authorization": f"Bearer {tokens['driver']}"}
    )
    assert res_drop.status_code == 201
    drop_id = res_drop.json()["id"]

    res_drop_conf = client.patch(
        f"/api/v1/bookings/{booking.id}/handoff-proof/{drop_id}/confirm",
        headers={"Authorization": f"Bearer {tokens['customer']}"}
    )
    assert res_drop_conf.status_code == 200
    assert res_drop_conf.json()["confirmed_by_customer"] is True
    assert res_drop_conf.json()["confirmed_by_driver"] is True

    # Status auto-advanced to delivered
    assert client.get(f"/api/v1/bookings/{booking.id}").json()["status"] == "delivered"

    # Step 12: Release payment from escrow
    res_rel = client.post(
        f"/api/v1/bookings/{booking.id}/payment/release",
        headers={"Authorization": f"Bearer {tokens['customer']}"}
    )
    assert res_rel.status_code == 200
    assert res_rel.json()["status"] == "released"

    # Step 13: Close booking via state machine
    res_close = client.patch(
        f"/api/v1/bookings/{booking.id}/status",
        json={"status": "closed"}
    )
    assert res_close.status_code == 200
    assert res_close.json()["status"] == "closed"
    assert res_close.json()["payment_status"] == "paid"


if __name__ == "__main__":
    print("Running Person 4 flow tests...")
    tests = [
        ("Pricing: Vehicle Rates & Cargo Multipliers", test_pricing_vehicle_rates_and_cargo_multipliers),
        ("Pricing: Locked Base Fare", test_pricing_locked_base_fare),
        ("Surcharges: Request, Gating & Confirmation", test_surcharge_flow),
        ("Handoff Proofs: Dual Confirmation & Stage Gating", test_handoff_proof_flow),
        ("Payments: Escrow Checkout & Release Gating", test_payment_escrow_and_release_gating),
        ("Chat: Participant History & Permissions", test_chat_messages),
        ("Notifications: Creation, Isolation & Read State", test_notifications_isolation_and_read),
        ("GPS: In-Transit Enforcement, Anti-Spoofing & Broadcast", test_gps_pings),
        ("WebSockets: Live Chat & GPS Broadcast", test_websockets_chat_and_gps),
        ("Complete Hackathon Trust & Escrow Demo Flow", test_complete_hackathon_demo_flow),
    ]

    passed = 0
    for name, fn in tests:
        try:
            fn()
            print(f"  [PASS] {name}")
            passed += 1
        except Exception as e:
            print(f"  [FAIL] {name}: {e}")
            import traceback
            traceback.print_exc()

    print(f"\nCompleted: {passed}/{len(tests)} tests passed.")
    if passed != len(tests):
        sys.exit(1)
