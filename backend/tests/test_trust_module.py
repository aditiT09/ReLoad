from datetime import datetime, timedelta, timezone

from tests.test_person4_flows import TestingSessionLocal, client, create_test_entities, reset_db
from app.models import Document, DocumentType, ReportCategory, ReportTargetType, User, UserRole, VehicleVerificationStatus
from app.services.trust_service import calculate_trust_score


def test_driver_score_changes_after_report_and_documents_are_expiry_aware():
    reset_db()
    entities = create_test_entities()
    driver = entities["driver"]
    customer = entities["customer"]
    booking = entities["booking"]
    db = TestingSessionLocal()
    db.add(Document(
        driver_id=driver.id,
        doc_type=DocumentType.KYC,
        file_url="https://storage.reload.in/kyc.pdf",
        expiry_date=datetime.now(timezone.utc) + timedelta(days=10),
        verified=True,
    ))
    db.commit()
    before = calculate_trust_score(db, driver.id, "driver").score
    db.close()

    response = client.post(
        "/api/v1/reports",
        json={
            "booking_id": str(booking.id),
            "target_type": ReportTargetType.driver.value,
            "category": ReportCategory.conduct.value,
            "description": "Unsafe handling",
        },
        headers={"Authorization": f"Bearer {entities['tokens']['customer']}"},
    )
    assert response.status_code == 201

    db = TestingSessionLocal()
    after = calculate_trust_score(db, driver.id, "driver").score
    assert after < before
    db.close()


def test_vehicle_verification_and_report_status_workflow():
    reset_db()
    entities = create_test_entities()
    admin = User(
        role=UserRole.company_admin,
        name="Admin",
        phone="+919876543299",
        email="admin@test.com",
        password_hash="not-used",
    )
    db = TestingSessionLocal()
    db.add(admin)
    vehicle = entities["vehicle"]
    vehicle_id = entities["booking"].vehicle_id
    vehicle.last_checked_date = datetime.now(timezone.utc) - timedelta(days=220)
    vehicle.verification_status = VehicleVerificationStatus.verified
    db.flush()
    admin_id = admin.id
    db.commit()
    db.close()

    response = client.get(f"/api/v1/vehicles/{vehicle_id}")
    assert response.status_code == 200
    assert response.json()["verification_status"] == "expired"

    from app.core.security import create_access_token
    admin_token = create_access_token({"sub": str(admin_id)})
    response = client.post(
        f"/api/v1/vehicles/{vehicle_id}/verify",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 200
    assert response.json()["verification_status"] == "verified"