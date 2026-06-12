from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import json
from pathlib import Path
from typing import List, Dict, Any
from uuid import uuid4
import datetime

from .services.routing_engine import (
    calculate_score,
    rank_routes
)

app = FastAPI(title="RideFlow API")

# CORS middleware to allow the React frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Paths
DATA_DIR = Path(__file__).parent.parent / "data"
ROUTES_FILE = DATA_DIR / "routes.json"
LOCATIONS_FILE = DATA_DIR / "locations.json"

# --- Helpers ---
def load_json(filename: str):
    file_path = DATA_DIR / filename
    if not file_path.exists():
        return []
    with open(file_path, "r") as f:
        return json.load(f)

# --- API Endpoints ---

@app.get("/")
def root():
    return {"message": "RideFlow Backend Running"}

@app.get("/locations")
def get_locations():
    """Returns all available locations for the search dropdowns."""
    return load_json("locations.json")

@app.post("/routes/search")
def search_routes(payload: Dict[str, Any]):
    """
    Requirement 13.1: POST /routes/search
    Request: {"source": "...", "destination": "...", "preference": "..."}
    """
    source = payload.get("source")
    destination = payload.get("destination")
    preference = payload.get("preference", "balanced")

    if not source or not destination:
        raise HTTPException(status_code=400, detail="source and destination are required")

    routes = load_json("routes.json")
    if not routes:
        raise HTTPException(status_code=404, detail="No routes available in data")

    # Calculate score for each route using the routing engine
    for route in routes:
        route["score"] = calculate_score(route)

    # Rank based on user preference
    ranked_routes = rank_routes(routes, preference)

    return {
        "preference": preference,
        "routes": ranked_routes
    }

@app.get("/routes/{route_id}")
def get_route_details(route_id: str):
    """Requirement 13.2: GET /routes/{routeId}"""
    routes = load_json("routes.json")
    for route in routes:
        if route["routeId"] == route_id:
            return route
    raise HTTPException(status_code=404, detail="Route not found")

@app.get("/routes/{route_id}/explanation")
def get_route_explanation(route_id: str):
    """Requirement 13.3: GET /routes/{routeId}/explanation"""
    explanations = {
        "RF-R1": "This route is recommended because it offers the best balance of time, cost, transfers, and walking distance.",
        "RF-R2": "This is the most eco-friendly and cheapest option, though it takes longer and requires more walking.",
        "RF-R3": "This is the fastest route with the fewest transfers, ideal for urgent travel, but it is the most expensive."
    }

    return {
        "routeId": route_id,
        "explanation": explanations.get(route_id, "This route is a reliable alternative based on your travel preferences.")
    }

@app.post("/bookings/create")
def create_booking(payload: Dict[str, Any]):
    """Requirement 13.4: POST /bookings/create"""
    route_id = payload.get("routeId")
    if not route_id:
        raise HTTPException(status_code=400, detail="routeId is required")

    booking_id = f"RF-BKG-{uuid4().hex[:6].upper()}"

    # Mock legs
    legs = [
        {"mode": "Walk", "ticketId": f"WLK-{uuid4().hex[:4].upper()}", "fare": 0},
        {"mode": "Bus", "ticketId": f"BUS-{uuid4().hex[:4].upper()}", "fare": 15},
        {"mode": "Metro", "ticketId": f"MTR-{uuid4().hex[:4].upper()}", "fare": 35},
        {"mode": "Auto", "ticketId": f"AUTO-{uuid4().hex[:4].upper()}", "fare": 32},
    ]

    return {
        "bookingId": booking_id,
        "legs": legs,
        "totalFare": 82,
        "status": "Pending Payment"
    }

@app.post("/payments/pay")
def process_payment(payload: Dict[str, Any]):
    """Requirement 13.5: POST /payments/pay"""
    booking_id = payload.get("bookingId")
    if not booking_id:
        raise HTTPException(status_code=400, detail="bookingId is required")

    return {
        "paymentStatus": "Success",
        "journeyPassId": f"RF-PASS-{uuid4().hex[:6].upper()}",
        "qrCodeText": f"RF-PASS-{uuid4().hex[:6].upper()}",
        "walletBalance": 418
    }

@app.get("/journey/{booking_id}/updates")
def get_live_updates(booking_id: str):
    """Requirement 13.6: GET /journey/{bookingId}/updates"""
    updates = load_json("live_updates.json")
    return {
        "bookingId": booking_id,
        "updates": updates if updates else [
            "Bus arriving in 4 minutes.",
            "Metro expected on Platform 2.",
            "Auto driver arriving at Gate 3.",
            "ETA updated by 5 minutes due to traffic."
        ]
    }

@app.get("/passes")
def get_passes():
    """Additional helper for frontend pass screen."""
    return load_json("passes.json") # Assuming we create this file or use a mock list
