# app/routers/notifications.py

import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.notification import Notification
from app.models.user import User
from app.schemas.notification import NotificationResponse

router = APIRouter(prefix="/api/v1/notifications", tags=["notifications"])


@router.get("/", response_model=List[NotificationResponse])
def get_user_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve all notifications belonging strictly to the authenticated user, ordered newest first.
    """
    stmt = (
        select(Notification)
        .where(Notification.user_id == current_user.id)
        .order_by(Notification.created_at.desc())
    )
    notifications = db.execute(stmt).scalars().all()
    return notifications


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_as_read(
    notification_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mark a specific notification as read. Users cannot access or modify others' notifications.
    """
    stmt = select(Notification).where(Notification.id == notification_id)
    notification = db.execute(stmt).scalar_one_or_none()

    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found"
        )

    if notification.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to modify this notification"
        )

    notification.read = True
    db.commit()
    db.refresh(notification)

    return notification
