import React, { useState } from 'react';
import { useJourney } from '../services/JourneyContext';
import { Settings, Shield, User, Globe, AlertCircle } from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const { preference, setSearchQuery, sourceId, destId } = useJourney();
  const [notifyTransfer, setNotifyTransfer] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const handlePrefChange = (pref: string) => {
    setSearchQuery(sourceId, destId, pref);
  };

  return (
    <div className="flex flex-col gap-6 h-full justify-between select-none">
      {/* Header */}
      <div>
        <h2 className="font-display font-bold text-xl text-slate-800 tracking-tight">
          Application Settings
        </h2>
        <p className="text-xs text-slate-500">
          Configure journey constraints and profile variables
        </p>
      </div>

      {/* Main Settings scrollable */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-5 pr-1 py-1">
        {/* Profile Details */}
        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Profile Reference
            </span>
          </div>
          <div className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-2xl">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Joe Smith</h4>
              <p className="text-[9px] font-mono text-slate-400 mt-0.5">UID: RF-882200-JS</p>
            </div>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
              Verified
            </span>
          </div>
        </div>

        {/* Global Travel Preference */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 px-1">
            <Globe className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Route Engine Preference
            </span>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-4 flex flex-col gap-3.5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
              <span>Default Filter Criteria</span>
              <select
                value={preference}
                onChange={(e) => handlePrefChange(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="recommended">Best Recommended</option>
                <option value="cheapest">Least Cost (Eco)</option>
                <option value="fastest">Quickest (Cab/Express)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alert Prefs */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2 px-1">
            <Shield className="w-4 h-4 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Notification & Security
            </span>
          </div>
          <div className="bg-white border border-slate-100 rounded-3xl p-4 flex flex-col gap-3.5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
              <span>Alert 5m Before Transfers</span>
              <input 
                type="checkbox" 
                checked={notifyTransfer} 
                onChange={() => setNotifyTransfer(!notifyTransfer)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
            </div>
            <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between text-xs text-slate-600 font-medium">
              <span>Offline Cache Datasets</span>
              <input 
                type="checkbox" 
                checked={isOfflineMode} 
                onChange={() => setIsOfflineMode(!isOfflineMode)}
                className="w-4 h-4 accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* API connection details */}
        <div className="bg-indigo-50/20 border border-indigo-100/50 p-4 rounded-3xl flex flex-col gap-2.5 mt-2">
          <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-indigo-500" />
            <span>FastAPI Server Config</span>
          </h4>
          <p className="text-[10px] text-indigo-500 leading-relaxed font-medium">
            URL: <code className="bg-white/80 border border-indigo-100/40 text-[9px] px-1 py-0.5 rounded text-indigo-600">http://localhost:8000/api</code>. 
            If the server is active, RideFlow will fetch live itineraries, bookings, and passes automatically.
          </p>
        </div>
      </div>

      {/* Footer Settings Icon */}
      <div className="flex items-center justify-center gap-1.5 py-2 text-slate-400">
        <Settings className="w-4 h-4" />
        <span className="text-[10px] font-bold uppercase tracking-wider">RideFlow Settings Panel</span>
      </div>
    </div>
  );
};
