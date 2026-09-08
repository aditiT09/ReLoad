# app/services/notification_service.py

import uuid
from sqlalchemy.orm import Session
from app.models.notification import Notification


def notify(
    db: Session,
    user_id: uuid.UUID,
    type: str,
    content: str
) -> Notification:
    """
    Creates and persists a notification for a user.
    """
    notification = Notification(
        user_id=user_id,
        type=type,
        content=content,
        read=False
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification
