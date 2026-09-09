# app/services/connection_manager.py

import json
import uuid
from typing import Dict, List
from fastapi import WebSocket


class ConnectionManager:
    """
    In-memory WebSocket connection manager grouped by booking_id for chat and GPS tracking.
    """
    def __init__(self):
        # Maps booking_id -> list of active WebSocket connections
        self.chat_connections: Dict[str, List[WebSocket]] = {}
        self.gps_connections: Dict[str, List[WebSocket]] = {}

    def _get_room(self, room_type: str) -> Dict[str, List[WebSocket]]:
        if room_type == "gps":
            return self.gps_connections
        return self.chat_connections

    async def connect(self, booking_id: uuid.UUID, websocket: WebSocket, room_type: str = "chat"):
        await websocket.accept()
        key = str(booking_id)
        room = self._get_room(room_type)
        if key not in room:
            room[key] = []
        room[key].append(websocket)

    def disconnect(self, booking_id: uuid.UUID, websocket: WebSocket, room_type: str = "chat"):
        key = str(booking_id)
        room = self._get_room(room_type)
        if key in room and websocket in room[key]:
            room[key].remove(websocket)
            if not room[key]:
                del room[key]

    async def broadcast(
        self,
        booking_id: uuid.UUID,
        message: dict,
        room_type: str = "chat",
        exclude: WebSocket = None
    ):
        key = str(booking_id)
        room = self._get_room(room_type)
        if key not in room:
            return

        dead_connections = []
        for connection in list(room[key]):
            if exclude is not None and connection == exclude:
                continue
            try:
                await connection.send_json(message)
            except Exception:
                dead_connections.append(connection)

        for dead in dead_connections:
            if dead in room[key]:
                room[key].remove(dead)
        if not room[key]:
            del room[key]

    def broadcast_sync(
        self,
        booking_id: uuid.UUID,
        message: dict,
        room_type: str = "chat",
        exclude: WebSocket = None
    ):
        import asyncio
        try:
            loop = asyncio.get_running_loop()
            loop.create_task(self.broadcast(booking_id, message, room_type, exclude=exclude))
        except RuntimeError:
            pass


# Global singleton instance
manager = ConnectionManager()
