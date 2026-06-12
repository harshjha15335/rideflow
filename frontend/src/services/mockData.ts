export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
}

export interface RouteSegment {
  mode: 'walk' | 'bus' | 'metro' | 'auto' | 'train';
  lineName?: string;
  duration: number; // minutes
  cost: number; // rupees
  distance: string; // e.g. "650m", "4.2km"
  instruction: string;
  fromName: string;
  toName: string;
  stops?: string[];
}

export interface RouteOption {
  id: string;
  name: string;
  modeSequence: ('walk' | 'bus' | 'metro' | 'auto' | 'train')[];
  duration: number; // minutes
  cost: number; // rupees
  transfers: number;
  walkingDistance: number; // meters
  reliabilityScore: number; // percentage
  safetyScore: number; // percentage
  carbonScore: number; // percentage (higher is greener)
  carbonSaved: string; // e.g. "2.4 kg"
  badge?: 'Recommended' | 'Eco-Friendly' | 'Fastest';
  segments: RouteSegment[];
  mapPathPoints: { x: number; y: number }[]; // Coordinates for map SVG drawing
}

export interface JourneyPass {
  id: string;
  name: string;
  type: 'Metro Express' | 'All-in-One Commuter' | 'City Bus Pass';
  price: number;
  validityDays: number;
  description: string;
  qrValue: string;
  isActive: boolean;
  color: string;
  tripsLeft?: number;
}

export const locations: Location[] = [
  { id: 'central-railway', name: 'Central Railway Station', lat: 120, lng: 150, description: 'Main railway hub with inter-city and local connections' },
  { id: 'metro-central', name: 'Metro Central', lat: 240, lng: 200, description: 'Subway terminal linking the commercial zones' },
  { id: 'bus-depot', name: 'City Bus Depot', lat: 180, lng: 380, description: 'Intercity and regional bus headquarters' },
  { id: 'tech-park', name: 'Tech Park', lat: 480, lng: 350, description: 'Major IT and business campus' },
  { id: 'university', name: 'University Campus', lat: 150, lng: 500, description: 'Educational and research campus hub' },
  { id: 'airport-road', name: 'Airport Road', lat: 480, lng: 120, description: 'Express junction heading towards the airport terminal' }
];

export const journeyPasses: JourneyPass[] = [
  {
    id: 'pass-all-in-one',
    name: 'All-in-One Pass',
    type: 'All-in-One Commuter',
    price: 999,
    validityDays: 30,
    description: 'Unlimited access to all Metro Lines and City Buses, +10% off Auto connections.',
    qrValue: 'RIDEFLOW-ALLINONE-998822',
    isActive: true,
    color: 'from-indigo-600 to-purple-600',
    tripsLeft: 42
  },
  {
    id: 'pass-metro',
    name: 'Metro Express Pass',
    type: 'Metro Express',
    price: 499,
    validityDays: 14,
    description: 'Unlimited rides on the Metro Central & Express Lines. Ideal for office commuters.',
    qrValue: 'RIDEFLOW-METRO-441188',
    isActive: false,
    color: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'pass-bus',
    name: 'City Bus Saver',
    type: 'City Bus Pass',
    price: 199,
    validityDays: 7,
    description: 'Flat 50% discount on all local bus services operating within municipal limits.',
    qrValue: 'RIDEFLOW-BUS-772299',
    isActive: false,
    color: 'from-emerald-600 to-teal-600'
  }
];

export const recentSearches = [
  { from: 'Central Railway Station', to: 'Tech Park' },
  { from: 'University Campus', to: 'Metro Central' },
  { from: 'Airport Road', to: 'Tech Park' }
];

// Generates routes for any source/destination pair, customizing descriptions and paths
export function getRouteOptions(sourceId: string, destId: string): RouteOption[] {
  const srcLoc = locations.find(l => l.id === sourceId) || locations[0];
  const destLoc = locations.find(l => l.id === destId) || locations[3];

  // Coordinates mapping
  const pStart = { x: srcLoc.lat, y: srcLoc.lng };
  const pEnd = { x: destLoc.lat, y: destLoc.lng };

  // Helper to generate coordinates interpolating between start & end
  const getWaypoints = (offsets: { dx: number; dy: number }[]) => {
    const points = [pStart];
    offsets.forEach((o, index) => {
      const fraction = (index + 1) / (offsets.length + 1);
      const px = pStart.x + (pEnd.x - pStart.x) * fraction + o.dx;
      const py = pStart.y + (pEnd.y - pStart.y) * fraction + o.dy;
      points.push({ x: px, y: py });
    });
    points.push(pEnd);
    return points;
  };

  return [
    {
      id: 'route-a',
      name: 'Multi-Modal Green Link',
      modeSequence: ['walk', 'bus', 'metro', 'auto'],
      duration: 54,
      cost: 82,
      transfers: 2,
      walkingDistance: 650,
      reliabilityScore: 94,
      safetyScore: 98,
      carbonScore: 85,
      carbonSaved: '2.4 kg',
      badge: 'Recommended',
      mapPathPoints: getWaypoints([
        { dx: -20, dy: 30 },
        { dx: 40, dy: -10 },
        { dx: -10, dy: 50 }
      ]),
      segments: [
        {
          mode: 'walk',
          duration: 6,
          cost: 0,
          distance: '450m',
          instruction: `Walk from ${srcLoc.name} to nearest Bus stop`,
          fromName: srcLoc.name,
          toName: 'Station Bus Bay'
        },
        {
          mode: 'bus',
          lineName: 'Route 102 (Express Bus)',
          duration: 15,
          cost: 15,
          distance: '3.4km',
          instruction: 'Board Route 102 Bus heading to Terminal Central',
          fromName: 'Station Bus Bay',
          toName: 'Metro Central Interchange',
          stops: ['Junction Square', 'Market Crossing', 'Metro Central Interchange']
        },
        {
          mode: 'metro',
          lineName: 'Blue Line (Subway)',
          duration: 20,
          cost: 32,
          distance: '8.2km',
          instruction: 'Take the Blue Line Metro platform 2 southbound',
          fromName: 'Metro Central Interchange',
          toName: 'Tech Park Metro station',
          stops: ['Downtown', 'Arts College', 'River Valley', 'Tech Park Metro station']
        },
        {
          mode: 'auto',
          lineName: 'RideFlow Local Auto',
          duration: 13,
          cost: 35,
          distance: '1.2km',
          instruction: `Book auto connection from Metro Gate 3 to ${destLoc.name}`,
          fromName: 'Tech Park Metro Gate 3',
          toName: destLoc.name
        }
      ]
    },
    {
      id: 'route-b',
      name: 'Transit Economizer',
      modeSequence: ['walk', 'train', 'bus', 'walk'],
      duration: 62,
      cost: 48,
      transfers: 2,
      walkingDistance: 1200,
      reliabilityScore: 88,
      safetyScore: 92,
      carbonScore: 95,
      carbonSaved: '3.1 kg',
      badge: 'Eco-Friendly',
      mapPathPoints: getWaypoints([
        { dx: -50, dy: 10 },
        { dx: -30, dy: -40 },
        { dx: 20, dy: -60 }
      ]),
      segments: [
        {
          mode: 'walk',
          duration: 4,
          cost: 0,
          distance: '300m',
          instruction: `Walk to Railway Platform 3`,
          fromName: srcLoc.name,
          toName: 'Platform 3'
        },
        {
          mode: 'train',
          lineName: 'Suburban Line S1',
          duration: 25,
          cost: 15,
          distance: '10.5km',
          instruction: 'Board S1 suburban rail towards Bus Depot West',
          fromName: 'Platform 3',
          toName: 'Depot Junction Station',
          stops: ['North Station', 'Bridge Toll', 'Industrial Zone', 'Depot Junction Station']
        },
        {
          mode: 'bus',
          lineName: 'City Shuttle 44',
          duration: 22,
          cost: 20,
          distance: '5.1km',
          instruction: 'Switch to City Shuttle 44 Bus from Platform B',
          fromName: 'Depot Junction Station Bus Stand',
          toName: 'South Plaza Gate',
          stops: ['Hospital Circle', 'Corporate Quarter', 'South Plaza Gate']
        },
        {
          mode: 'walk',
          duration: 11,
          cost: 0,
          distance: '900m',
          instruction: `Walk from South Plaza Gate to ${destLoc.name}`,
          fromName: 'South Plaza Gate',
          toName: destLoc.name
        }
      ]
    },
    {
      id: 'route-c',
      name: 'Express Direct Combo',
      modeSequence: ['auto', 'metro', 'walk'],
      duration: 45,
      cost: 120,
      transfers: 1,
      walkingDistance: 300,
      reliabilityScore: 91,
      safetyScore: 95,
      carbonScore: 68,
      carbonSaved: '1.8 kg',
      badge: 'Fastest',
      mapPathPoints: getWaypoints([
        { dx: 30, dy: -30 },
        { dx: 50, dy: 20 }
      ]),
      segments: [
        {
          mode: 'auto',
          lineName: 'Prepaid Local Taxi/Auto',
          duration: 12,
          cost: 75,
          distance: '4.1km',
          instruction: `Book Auto directly from ${srcLoc.name} to Metro Station`,
          fromName: srcLoc.name,
          toName: 'Metro Central Interchange'
        },
        {
          mode: 'metro',
          lineName: 'Metro Express (Gold Line)',
          duration: 25,
          cost: 45,
          distance: '9.0km',
          instruction: 'Board Gold Line Metro Express for direct travel',
          fromName: 'Metro Central Interchange',
          toName: 'Metro Hub East',
          stops: ['Interstate Junction', 'Metro Hub East']
        },
        {
          mode: 'walk',
          duration: 8,
          cost: 0,
          distance: '300m',
          instruction: `Walk from Metro Exit A1 to ${destLoc.name}`,
          fromName: 'Metro Hub East Exit A1',
          toName: destLoc.name
        }
      ]
    }
  ];
}
