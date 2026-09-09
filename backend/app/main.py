# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.ml import router as ml_router
from app.routers import (
    auth, vehicles, bookings, gps, safety,
    surcharges, handoffs, payments, chat, notifications
)

app = FastAPI(
    title="ReLoad Backend — Trust-First City Logistics Platform",
    description="Backend MVP for an intra-city goods transport platform. Built for a hackathon with a focus on trust, explainable metrics, and verified vehicle handoffs."
)

# Hackathon dev setup — allows all origins, methods, and headers.
# TODO: This should be restricted to specific frontend domains before any real production deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all API routers
app.include_router(auth.router)
app.include_router(vehicles.router)
app.include_router(bookings.router)
app.include_router(gps.router)
app.include_router(gps.ws_router)
app.include_router(safety.router)
app.include_router(surcharges.router)
app.include_router(handoffs.router)
app.include_router(payments.router)
app.include_router(chat.router)
app.include_router(notifications.router)
app.include_router(ml_router)


@app.get("/", tags=["health"])
def health_check():
    return {
        "status": "ok", 
        "service": "ReLoad Backend"
    }