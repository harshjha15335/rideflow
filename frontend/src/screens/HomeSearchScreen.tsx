import React from 'react';
import { useJourney } from '../services/JourneyContext';
import { Search, MapPin, ArrowUpDown, History, Star } from 'lucide-react';

export const HomeSearchScreen: React.FC = () => {
  const { 
    allLocations, 
    sourceId, 
    destId, 
    preference, 
    setSearchQuery, 
    executeSearch 
  } = useJourney();

  const handleSwap = () => {
    setSearchQuery(destId, sourceId, preference);
  };

  const handleRecentClick = (fromName: string, toName: string) => {
    const src = allLocations.find(l => l.name === fromName)?.id || sourceId;
    const dest = allLocations.find(l => l.name === toName)?.id || destId;
    setSearchQuery(src, dest, preference);
  };

  return (
    <div className="flex flex-col gap-6 h-full justify-between">
      {/* Title */}
      <div>
        <h2 className="font-display font-bold text-xl text-slate-800 tracking-tight">
          Plan Journey
        </h2>
        <p className="text-xs text-slate-500">
          Find multi-modal routes across public transit and taxis
        </p>
      </div>

      {/* Search inputs panel */}
      <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-4 relative">
        {/* Source Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
            Pick-up Point
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-indigo-500">
              <MapPin className="w-4 h-4 fill-current" />
            </div>
            <select
              value={sourceId}
              onChange={(e) => setSearchQuery(e.target.value, destId, preference)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none"
            >
              {allLocations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="absolute right-8 top-[85px] z-5">
          <button 
            onClick={handleSwap}
            className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center hover:bg-indigo-100 transition-colors shadow-sm"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Destination Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
            Drop-off Point
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-purple-500">
              <MapPin className="w-4 h-4 fill-current" />
            </div>
            <select
              value={destId}
              onChange={(e) => setSearchQuery(sourceId, e.target.value, preference)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 appearance-none"
            >
              {allLocations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preference filter */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">
            Routing Preference
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'recommended', label: 'Best' },
              { id: 'cheapest', label: 'Cheap' },
              { id: 'fastest', label: 'Fast' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSearchQuery(sourceId, destId, p.id)}
                className={`py-2 px-1 rounded-xl text-center font-semibold text-xs border transition-all ${
                  preference === p.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Searches */}
      <div className="flex-1 overflow-y-auto mt-2">
        <div className="flex items-center gap-1.5 mb-3 px-1">
          <History className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Recent Searches
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { from: 'Central Railway Station', to: 'Tech Park' },
            { from: 'University Campus', to: 'Metro Central' },
            { from: 'Airport Road', to: 'Tech Park' }
          ].map((item, index) => (
            <div
              key={`recent-search-${index}`}
              onClick={() => handleRecentClick(item.from, item.to)}
              className="bg-white border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-700 truncate group-hover:text-indigo-600 transition-colors">
                  {item.from} → {item.to}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Static Demo Route A, B, C enabled
                </p>
              </div>
              <Star className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-400 transition-colors flex-shrink-0 ml-2" />
            </div>
          ))}
        </div>
      </div>

      {/* Action CTA */}
      <button
        onClick={executeSearch}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-display font-semibold py-3.5 rounded-2xl transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 mt-4 hover:scale-[1.01]"
      >
        <Search className="w-4 h-4" />
        <span>Search Journey Options</span>
      </button>
    </div>
  );
};
