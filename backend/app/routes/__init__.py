from fastapi import APIRouter, HTTPException
from typing import List
from ..data.mock_data import locations, journey_passes, get_route_options

router = APIRouter()

@router.get("/locations", response_model=List[dict])
async def get_locations():
    return locations

@router.get("/journeys", response_model=List[dict])
async def get_journeys(source_id: str, dest_id: str):
    return get_route_options(source_id, dest_id)

@router.post("/bookings", response_model=dict)
async def create_booking(payload: dict):
    # Expected payload: {"routeId": str, "sourceId": str, "destId": str}
    from uuid import uuid4
    import datetime
    booking = {
        "id": f"bk-{uuid4().hex[:8]}",
        "routeId": payload.get("routeId"),
        "sourceId": payload.get("sourceId"),
        "destId": payload.get("destId"),
        "status": "pending",
        "bookingReference": f"RF-{uuid4().hex[:6].upper()}",
        "createdAt": datetime.datetime.utcnow().isoformat()
    }
    return booking

@router.post("/bookings/{booking_id}/payment", response_model=dict)
async def confirm_payment(booking_id: str, payload: dict):
    # Expected payload: {"paymentMethod": str}
    from uuid import uuid4
    import datetime
    return {
        "status": "success",
        "transactionId": f"txn-{uuid4().hex[:10].upper()}",
        "estimatedArrival": (datetime.datetime.utcnow() + datetime.timedelta(minutes=54)).isoformat()
    }

@router.get("/passes", response_model=List[dict])
async def get_passes():
    return journey_passes

@router.post("/passes/purchase", response_model=dict)
async def purchase_pass(payload: dict):
    # Expected payload: {"passId": str}
    from uuid import uuid4
    import datetime
    return {
        "success": True,
        "passId": payload.get("passId"),
        "expiresAt": (datetime.datetime.utcnow() + datetime.timedelta(days=30)).isoformat()
    }
