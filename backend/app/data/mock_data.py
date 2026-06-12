from pydantic import BaseModel
from typing import List, Optional

class Location(BaseModel):
    id: str
    name: str
    lat: float
    lng: float
    description: str

class RouteSegment(BaseModel):
    mode: str  # 'walk' | 'bus' | 'metro' | 'auto' | 'train'
    lineName: Optional[str] = None
    duration: int  # minutes
    cost: int  # rupees
    distance: str
    instruction: str
    fromName: str
    toName: str
    stops: Optional[List[str]] = None

class RouteOption(BaseModel):
    id: str
    name: str
    modeSequence: List[str]
    duration: int
    cost: int
    transfers: int
    walkingDistance: int
    reliabilityScore: int
    safetyScore: int
    carbonScore: int
    carbonSaved: str
    badge: Optional[str] = None
    segments: List[RouteSegment]
    mapPathPoints: List[dict]

class JourneyPass(BaseModel):
    id: str
    name: str
    type: str
    price: int
    validityDays: int
    description: str
    qrValue: str
    isActive: bool
    color: str
    tripsLeft: Optional[int] = None

# Sample data matching the frontend mockData.ts
locations = [
    Location(id='central-railway', name='Central Railway Station', lat=120, lng=150, description='Main railway hub with inter-city and local connections'),
    Location(id='metro-central', name='Metro Central', lat=240, lng=200, description='Subway terminal linking the commercial zones'),
    Location(id='bus-depot', name='City Bus Depot', lat=180, lng=380, description='Intercity and regional bus headquarters'),
    Location(id='tech-park', name='Tech Park', lat=480, lng=350, description='Major IT and business campus'),
    Location(id='university', name='University Campus', lat=150, lng=500, description='Educational and research campus hub'),
    Location(id='airport-road', name='Airport Road', lat=480, lng=120, description='Express junction heading towards the airport terminal'),
]

journey_passes = [
    JourneyPass(id='pass-all-in-one', name='All-in-One Pass', type='All-in-One Commuter', price=999, validityDays=30, description='Unlimited access to all Metro Lines and City Buses, +10% off Auto connections.', qrValue='RIDEFLOW-ALLINONE-998822', isActive=True, color='from-indigo-600 to-purple-600', tripsLeft=42),
    JourneyPass(id='pass-metro', name='Metro Express Pass', type='Metro Express', price=499, validityDays=14, description='Unlimited rides on the Metro Central & Express Lines. Ideal for office commuters.', qrValue='RIDEFLOW-METRO-441188', isActive=False, color='from-blue-600 to-indigo-600'),
    JourneyPass(id='pass-bus', name='City Bus Saver', type='City Bus Pass', price=199, validityDays=7, description='Flat 50% discount on all local bus services operating within municipal limits.', qrValue='RIDEFLOW-BUS-772299', isActive=False, color='from-emerald-600 to-teal-600'),
]

def get_route_options(source_id: str, dest_id: str) -> List[RouteOption]:
    src = next((l for l in locations if l.id == source_id), locations[0])
    dest = next((l for l in locations if l.id == dest_id), locations[3]
    # Simple static return of three predefined routes (mirroring TS version)
    # For brevity, only returning empty list placeholder – the frontend mock already provides data.
    return []
