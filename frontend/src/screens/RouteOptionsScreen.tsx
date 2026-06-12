import React from 'react';
import { useJourney } from '../services/JourneyContext';
import { ChevronLeft, ArrowRight, Clock, IndianRupee, Footprints, ArrowRightLeft } from 'lucide-react';
import type { RouteOption } from '../services/mockData';

export const RouteOptionsScreen: React.FC = () => {
  const { 
    routes, 
    selectedRoute, 
    setSelectedRoute, 
    setSearchStep,
    sourceId,
    destId,
    allLocations
  } = useJourney();

  const srcName = allLocations.find(l => l.id === sourceId)?.name || 'Central Railway Station';
  const destName = allLocations.find(l => l.id === destId)?.name || 'Tech Park';

  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'Recommended':
        return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
      case 'Eco-Friendly':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'Fastest':
        return 'bg-amber-50 text-amber-600 border border-amber-100';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-100';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'walk': return '🚶';
      case 'bus': return '🚌';
      case 'metro': return '🚇';
      case 'train': return '🚆';
      case 'auto': return '🛺';
      default: return '📍';
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full justify-between">
      {/* Header */}
      <div>
        <button
          onClick={() => setSearchStep('form')}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 font-semibold mb-3 group"
        >
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Edit Search</span>
        </button>

        <div className="flex flex-col gap-1">
          <h2 className="font-display font-bold text-xl text-slate-800 tracking-tight flex items-center gap-2">
            <span>Route Options</span>
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 min-w-0">
            <span className="truncate max-w-[100px] font-medium">{srcName.split(' ')[0]}</span>
            <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <span className="truncate max-w-[100px] font-medium">{destName.split(' ')[0]}</span>
          </div>
        </div>
      </div>

      {/* Routes List */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 py-1">
        {routes.map((route: RouteOption) => {
          const isSelected = selectedRoute?.id === route.id;
          return (
            <div
              key={route.id}
              onClick={() => setSelectedRoute(route)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-3 relative select-none ${
                isSelected
                  ? 'bg-white border-indigo-600 shadow-md shadow-indigo-100/40 ring-1 ring-indigo-600'
                  : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/50 shadow-sm'
              }`}
            >
              {/* Badge */}
              {route.badge && (
                <span className={`absolute right-4 top-4 text-[9px] font-bold px-2 py-0.5 rounded-full ${getBadgeStyle(route.badge)}`}>
                  {route.badge}
                </span>
              )}

              {/* Title & Modes */}
              <div>
                <h3 className="font-semibold text-slate-800 text-sm pr-16 truncate">
                  {route.name}
                </h3>
                <div className="flex items-center gap-1 mt-2">
                  {(route.modeSequence || []).map((m, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <span className="text-[10px] text-slate-300">→</span>}
                      <span className="text-sm bg-slate-50 border border-slate-100 rounded p-0.5" title={m}>
                        {getModeIcon(m)}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Summary Stats Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px] font-medium text-slate-500">
                <div className="flex items-center gap-1 text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold">{route.duration} min</span>
                </div>
                <div className="flex items-center gap-0.5 text-slate-700">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold">₹{route.cost}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
                  <span>{route.transfers} swaps</span>
                </div>
              </div>

              {/* Footprint / Walking */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-semibold">
                <span className="flex items-center gap-1">
                  <Footprints className="w-3 h-3" />
                  {route.walkingDistance}m walking
                </span>
                <span className="text-emerald-500">
                  Eco-Save: {route.carbonSaved} CO₂
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action CTA */}
      <button
        disabled={!selectedRoute}
        onClick={() => setSearchStep('details')}
        className={`w-full font-display font-semibold py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 mt-4 hover:scale-[1.01] ${
          selectedRoute
            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
        }`}
      >
        <span>View Route Details</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
