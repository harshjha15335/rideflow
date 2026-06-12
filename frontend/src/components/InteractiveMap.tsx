import React from 'react';
import { useJourney } from '../services/JourneyContext';
import { Navigation2, MapPin, Compass, ShieldAlert, Award, Footprints } from 'lucide-react';

// Helper to interpolate position along a path
interface Point {
  x: number;
  y: number;
}

function getPointAtProgress(points: Point[], progress: number): Point {
  if (!points || points.length === 0) return { x: 100, y: 150 };
  if (points.length === 1) return points[0];
  if (progress <= 0) return points[0];
  if (progress >= 100) return points[points.length - 1];

  const totalSegments = points.length - 1;
  const progressPerSegment = 100 / totalSegments;
  const segmentIndex = Math.min(
    Math.floor(progress / progressPerSegment),
    totalSegments - 1
  );

  const segmentProgress = (progress % progressPerSegment) / progressPerSegment;
  const start = points[segmentIndex];
  const end = points[segmentIndex + 1];

  return {
    x: start.x + (end.x - start.x) * segmentProgress,
    y: start.y + (end.y - start.y) * segmentProgress,
  };
}

export const InteractiveMap: React.FC = () => {
  const {
    selectedRoute,
    allLocations,
    sourceId,
    destId,
    isTrackingActive,
    trackingProgress,
    simulatedETA,
    currentTab,
    routes
  } = useJourney();

  const srcLoc = allLocations.find(l => l.id === sourceId) || allLocations[0];
  const destLoc = allLocations.find(l => l.id === destId) || allLocations[3];

  // Current active points to render (from route, or start-end if no route chosen)
  const activePathPoints = selectedRoute?.mapPathPoints || [
    { x: srcLoc?.lat ?? 0, y: srcLoc?.lng ?? 0 },
    { x: destLoc?.lat ?? 0, y: destLoc?.lng ?? 0 }
  ];

  // Get car/metro position along route during tracking
  const vehiclePos = getPointAtProgress(activePathPoints, trackingProgress);

  return (
    <div className="relative w-full h-full bg-slate-50 overflow-hidden flex flex-col justify-end">
      {/* SVG Canvas Map */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice">
        {/* Grids / Latitudes */}
        <g stroke="#f1f5f9" strokeWidth="1">
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`x-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="600" />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`y-${i}`} x1="0" y1={i * 50} x2="600" y2={i * 50} />
          ))}
        </g>

        {/* River */}
        <path
          d="M -50,180 C 150,160 220,380 340,360 C 440,340 480,520 650,540"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="36"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M -50,180 C 150,160 220,380 340,360 C 440,340 480,520 650,540"
          fill="none"
          stroke="#f1f5f9"
          strokeWidth="28"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Parks */}
        <circle cx="150" cy="460" r="60" fill="#f8fafc" stroke="#f1f5f9" strokeWidth="2" />
        <rect x="380" y="80" width="120" height="80" rx="30" fill="#f8fafc" stroke="#f1f5f9" strokeWidth="2" />
        <circle cx="50" cy="50" r="40" fill="#f8fafc" stroke="#f1f5f9" strokeWidth="2" />

        {/* Background Road Networks */}
        <g stroke="#cbd5e1" strokeWidth="2" opacity="0.3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 50,100 L 550,100" />
          <path d="M 100,50 L 100,550" />
          <path d="M 50,500 L 550,500" />
          <path d="M 120,150 C 250,50 450,150 480,350 C 400,520 200,480 120,150 Z" fill="none" strokeWidth="1.5" />
          <path d="M 50,50 L 550,550" strokeWidth="1" />
        </g>

        {/* Static Subway Rail Line (dashed) */}
        <path
          d="M 50,500 L 240,200 L 480,350"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="3.5"
          strokeDasharray="6,6"
          opacity="0.5"
        />

        {/* Inactive Route Paths */}
        {currentTab === 'search' && routes.map(route => {
          if (selectedRoute && route.id === selectedRoute.id) return null;
          if (!route.mapPathPoints || route.mapPathPoints.length === 0) return null;
          return (
            <path
              key={route.id}
              d={`M ${route.mapPathPoints.map(p => `${p.x},${p.y}`).join(' L ')}`}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.4"
            />
          );
        })}

        {/* Active Selected Route Path */}
        {selectedRoute && selectedRoute.mapPathPoints && (
          <>
            <path
              d={`M ${selectedRoute.mapPathPoints.map(p => `${p.x},${p.y}`).join(' L ')}`}
              fill="none"
              stroke="#6366f1"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.15"
            />
            <path
              d={`M ${selectedRoute.mapPathPoints.map(p => `${p.x},${p.y}`).join(' L ')}`}
              fill="none"
              stroke="#6366f1"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-dash"
            />
          </>
        )}

        {/* Predefined locations markers */}
        {allLocations.map((loc) => {
          const isSource = loc.id === sourceId;
          const isDest = loc.id === destId;
          const isStop = selectedRoute?.segments?.some(s => s.stops?.includes(loc.name));

          if (!isSource && !isDest && !isStop) {
            return (
              <g key={loc.id} className="group cursor-pointer">
                <circle cx={loc.lat} cy={loc.lng} r="5" fill="#94a3b8" opacity="0.6" />
                <circle cx={loc.lat} cy={loc.lng} r="8" fill="transparent" />
              </g>
            );
          }
          return null;
        })}

        {/* Source Station Pin */}
        <g transform={`translate(${srcLoc?.lat ?? 0}, ${srcLoc?.lng ?? 0})`} className="cursor-pointer">
          <circle cx="0" cy="0" r="14" fill="#6366f1" fillOpacity="0.15" className="animate-ping" style={{ animationDuration: '3s' }} />
          <circle cx="0" cy="0" r="7" fill="#6366f1" />
          <circle cx="0" cy="0" r="3" fill="#ffffff" />
        </g>

        {/* Destination Station Pin */}
        <g transform={`translate(${destLoc?.lat ?? 0}, ${destLoc?.lng ?? 0})`} className="cursor-pointer">
          <circle cx="0" cy="0" r="16" fill="#a855f7" fillOpacity="0.2" className="animate-ping" style={{ animationDuration: '2.5s' }} />
          <path d="M0 -14 L12 0 L0 14 L-12 0 Z" fill="#a855f7" />
          <circle cx="0" cy="0" r="4" fill="#ffffff" />
        </g>

        {/* Vehicle indicator */}
        {isTrackingActive && selectedRoute && (
          <g transform={`translate(${vehiclePos.x ?? 0}, ${vehiclePos.y ?? 0})`} className="transition-all duration-300 ease-out">
            <circle cx="0" cy="0" r="16" fill="#6366f1" fillOpacity="0.2" className="animate-pulse" />
            <circle cx="0" cy="0" r="10" fill="#6366f1" className="shadow-md" />
            <circle cx="0" cy="0" r="4" fill="#ffffff" />
          </g>
        )}
      </svg>

      {/* Floating GPS Control Cards */}
      <div className="absolute top-6 left-6 flex flex-col gap-3">
        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
          <Compass className="w-5 h-5 text-indigo-500 animate-spin" style={{ animationDuration: '10s' }} />
          <div>
            <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Compass</h4>
            <p className="text-[10px] text-slate-500 font-medium">Auto-Center Map Active</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-3 border border-slate-100 w-52 flex flex-col gap-2.5">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Saved Places</h4>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 truncate">Work (Tech Park)</p>
                <p className="text-[10px] text-slate-400 truncate">Studio 08 Jake Stream</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 truncate">Home (University)</p>
                <p className="text-[10px] text-slate-400 truncate">Hall of Residence 3</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Map Indicators */}
      <div className="absolute bottom-6 left-6 flex items-center gap-3">
        <div className="bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
          <span className="text-xs font-semibold text-slate-700">Start: {srcLoc?.name || 'Unknown'}</span>
        </div>
        <div className="bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rotate-45 bg-purple-500"></span>
          <span className="text-xs font-semibold text-slate-700">End: {destLoc?.name || 'Unknown'}</span>
        </div>
      </div>

      {/* Floating Vehicle ETA badge */}
      {isTrackingActive && selectedRoute && (
        <div className="absolute bg-indigo-600 text-white font-display px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2.5 border border-indigo-500"
          style={{
            position: 'absolute',
            left: `${vehiclePos.x + 10}px`,
            top: `${vehiclePos.y - 50}px`,
            transform: 'translateX(-50%)',
            transition: 'left 300ms ease-out, top 300ms ease-out',
            zIndex: 5
          }}
        >
          <Navigation2 className="w-4 h-4 fill-current rotate-90 text-indigo-200" />
          <span className="text-xs font-bold whitespace-nowrap">{simulatedETA} min left</span>
        </div>
      )}

      {/* Selected Route Info Card */}
      {selectedRoute && !isTrackingActive && (
        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-slate-100 w-64 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Path</span>
            {selectedRoute.badge && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedRoute.badge === 'Recommended'
                  ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                  : selectedRoute.badge === 'Eco-Friendly'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : 'bg-amber-50 text-amber-600 border border-amber-100'
              }`}>
                {selectedRoute.badge}
              </span>
            )}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800 leading-tight">
              {selectedRoute.name}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-modal trip via {selectedRoute.modeSequence?.join(' → ') || 'Multiple Modes'}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-slate-200/50 text-center">
            <div>
              <div className="flex items-center justify-center gap-0.5 text-xs text-slate-700 font-semibold">
                <Footprints className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedRoute.walkingDistance}m</span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium uppercase">Walk</span>
            </div>
            <div className="border-x border-slate-200/50">
              <div className="flex items-center justify-center gap-0.5 text-xs text-slate-700 font-semibold">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedRoute.reliabilityScore}%</span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium uppercase">Reliability</span>
            </div>
            <div>
              <div className="flex items-center justify-center gap-0.5 text-xs text-slate-700 font-semibold">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedRoute.safetyScore}%</span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium uppercase">Safety</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
