import React from 'react';
import type { AppTab } from '../services/JourneyContext';
import { useJourney } from '../services/JourneyContext';
import { 
  LayoutDashboard, 
  Search, 
  Calendar, 
  Ticket, 
  MapPin, 
  Wallet, 
  Settings, 
  Map, 
  User, 
  Star, 
  Car
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentTab, setTab, isTrackingActive, walletBalance } = useJourney();

  const navItems = [
    { id: 'dashboard' as AppTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'search' as AppTab, label: 'Search Journey', icon: Search },
    { id: 'bookings' as AppTab, label: 'Bookings', icon: Calendar },
    { id: 'pass' as AppTab, label: 'Journey Pass', icon: Ticket },
    { 
      id: 'tracking' as AppTab, 
      label: 'Live Tracking', 
      icon: MapPin, 
      badge: isTrackingActive ? 'Live' : undefined 
    },
    { id: 'wallet' as AppTab, label: 'Wallet', icon: Wallet, extra: `₹${walletBalance}` },
    { id: 'settings' as AppTab, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-80 h-full bg-white border-r border-slate-100 flex flex-col justify-between p-6 shadow-sm rounded-r-3xl z-10 select-none">
      <div>
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-2 py-4 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Map className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-slate-800 tracking-tight leading-none">
              RideFlow
            </h1>
            <span className="text-[10px] font-semibold tracking-wider text-indigo-500 uppercase">
              Intelligent Transit
            </span>
          </div>
        </div>

        {/* User Card */}
        <div className="bg-slate-50 rounded-2xl p-4 mb-6 flex flex-col gap-3 border border-slate-100/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-display font-semibold border border-indigo-200">
              JS
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Joe Smith</h3>
              <p className="text-xs text-slate-500">Premium Commuter</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-200/50 text-center">
            <div>
              <div className="flex items-center justify-center gap-0.5 text-amber-500 font-semibold text-xs">
                <Star className="w-3 h-3 fill-current" />
                <span>4.8</span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium uppercase">Rating</span>
            </div>
            <div className="border-x border-slate-200/50">
              <div className="text-slate-700 font-semibold text-xs flex items-center justify-center gap-0.5">
                <Car className="w-3 h-3 text-slate-400" />
                <span>126</span>
              </div>
              <span className="text-[9px] text-slate-400 font-medium uppercase">Trips</span>
            </div>
            <div>
              <div className="text-slate-700 font-semibold text-xs">3 yrs</div>
              <span className="text-[9px] text-slate-400 font-medium uppercase">Active</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 text-left group ${
                  isActive
                    ? 'bg-indigo-50/70 text-indigo-600 font-medium border-l-4 border-indigo-600 shadow-sm shadow-indigo-50/30'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-105 ${
                    isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`} />
                  <span className="text-[14px]">{item.label}</span>
                </div>
                
                {item.badge && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                    {item.badge}
                  </span>
                )}
                {item.extra && (
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                    {item.extra}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2 py-1 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
          <User className="w-5 h-5" />
          <span className="text-xs font-medium">My Account Settings</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-3 px-2">
          RideFlow v1.0.0 © 2026
        </p>
      </div>
    </aside>
  );
};
