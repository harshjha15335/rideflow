import React from 'react';
import { useJourney } from '../services/JourneyContext';
import { 
  Sparkles, 
  Wallet, 
  Leaf, 
  Award, 
  ArrowRight, 
  MapPin, 
  Ticket, 
  PlusCircle 
} from 'lucide-react';

export const DashboardScreen: React.FC = () => {
  const { walletBalance, passes, setTab, setSearchQuery, executeSearch, topUpWallet } = useJourney();

  const activePass = passes.find(p => p.isActive);

  const handleQuickBook = (from: string, to: string) => {
    // Maps quick location names to ids
    const fromId = from === 'Home' ? 'university' : 'central-railway';
    const toId = to === 'Work' ? 'tech-park' : 'airport-road';
    
    setSearchQuery(fromId, toId, 'recommended');
    executeSearch();
  };

  return (
    <div className="flex flex-col gap-6 h-full justify-between select-none">
      {/* Title */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-indigo-500 font-bold">
          <Sparkles className="w-4 h-4 text-indigo-500 fill-current" />
          <span>Commuter Overview</span>
        </div>
        <h2 className="font-display font-bold text-xl text-slate-800 tracking-tight mt-1">
          Welcome back, Joe
        </h2>
        <p className="text-xs text-slate-500">
          Your transit passes and stats are up to date
        </p>
      </div>

      {/* Main Stats Scrollable Area */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-5 pr-1 py-1">
        {/* Wallet Balance Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-4.5 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Wallet Balance</span>
              <span className="text-sm font-extrabold text-slate-800 block mt-0.5">₹{walletBalance}</span>
            </div>
          </div>
          <button
            onClick={() => topUpWallet(500)}
            className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100/70 border border-indigo-100 px-3 py-2 rounded-xl transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add ₹500</span>
          </button>
        </div>

        {/* Active Pass Status Panel */}
        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Pass Status</span>
            <Ticket className="w-4 h-4 text-slate-400" />
          </div>

          {activePass ? (
            <div className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-2xl">
              <div>
                <h4 className="text-xs font-bold text-slate-800">{activePass.name}</h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  {activePass.tripsLeft ? `${activePass.tripsLeft} rides remaining` : 'Unlimited travel'}
                </p>
              </div>
              <button 
                onClick={() => setTab('pass')}
                className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-all"
              >
                Scan QR
              </button>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-xs font-medium text-slate-500">No active journey pass found.</p>
              <button 
                onClick={() => setTab('pass')}
                className="text-[10px] font-bold text-indigo-600 hover:underline mt-1 block w-full"
              >
                Browse Pass Store →
              </button>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="bg-white border border-slate-100 p-4 rounded-3xl flex flex-col gap-2 shadow-sm">
            <Leaf className="w-5 h-5 text-emerald-500" />
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Carbon Saved</span>
              <span className="text-sm font-extrabold text-slate-800 block mt-0.5">42.6 kg</span>
            </div>
          </div>
          <div className="bg-white border border-slate-100 p-4 rounded-3xl flex flex-col gap-2 shadow-sm">
            <Award className="w-5 h-5 text-amber-500" />
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Eco Tier</span>
              <span className="text-sm font-extrabold text-slate-800 block mt-0.5">Gold Rider</span>
            </div>
          </div>
        </div>

        {/* Quick Travel Shortcuts */}
        <div className="flex flex-col gap-2.5 mt-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Quick Route Booking
          </span>

          <div className="flex flex-col gap-2">
            <div 
              onClick={() => handleQuickBook('Home', 'Work')}
              className="bg-white border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Home to Work</h4>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">University Campus to Tech Park</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-all group-hover:translate-x-0.5" />
            </div>

            <div 
              onClick={() => handleQuickBook('Station', 'Airport')}
              className="bg-white border border-slate-100 hover:border-indigo-100 hover:bg-slate-50/50 p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-700">Station to Airport</h4>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Central Railway to Airport Road</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-all group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Route Direct Link */}
      <button
        onClick={() => setTab('search')}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-display font-semibold py-3.5 rounded-2xl transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 mt-4 hover:scale-[1.01]"
      >
        <span>Open Journey Planner</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
