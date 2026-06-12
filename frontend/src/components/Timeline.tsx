import React from 'react';
import type { RouteSegment } from '../services/mockData';
import { Footprints, Bus, Train, Car, ChevronRight, MapPin, Ticket } from 'lucide-react';

interface TimelineProps {
  segments: RouteSegment[];
}

export const Timeline: React.FC<TimelineProps> = ({ segments }) => {
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'walk':
        return <Footprints className="w-4 h-4" />;
      case 'bus':
        return <Bus className="w-4 h-4" />;
      case 'metro':
        return <Train className="w-4 h-4" />;
      case 'train':
        return <Train className="w-4 h-4" />;
      case 'auto':
        return <Car className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'walk':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'bus':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'metro':
        return 'bg-indigo-50 text-indigo-600 border-indigo-200';
      case 'train':
        return 'bg-violet-50 text-violet-600 border-violet-200';
      case 'auto':
        return 'bg-amber-50 text-amber-600 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getLineColor = (mode: string) => {
    switch (mode) {
      case 'walk':
        return 'border-dashed border-slate-300';
      case 'bus':
        return 'border-solid border-blue-400';
      case 'metro':
        return 'border-solid border-indigo-400';
      case 'train':
        return 'border-solid border-violet-400';
      case 'auto':
        return 'border-solid border-amber-400';
      default:
        return 'border-solid border-slate-300';
    }
  };

  return (
    <div className="flex flex-col gap-1 py-1">
      {/* Mini Top Segment Line for quick visualization */}
      <div className="flex items-center gap-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 mb-4 justify-between">
        <div className="flex items-center gap-1.5 overflow-hidden">
          {segments.map((seg, i) => (
            <React.Fragment key={i}>
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${getModeColor(seg.mode)}`}>
                {getModeIcon(seg.mode)}
                <span className="capitalize text-[10px]">{seg.mode}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-2 border-l border-slate-200">
          {segments.length - 1} Transfers
        </div>
      </div>

      {/* Main Detailed Timeline */}
      <div className="relative pl-6 flex flex-col gap-6">
        {segments.map((seg, index) => (
          <div key={index} className="relative group">
            {/* Timeline Vertical Line Connector */}
            {index < segments.length - 1 && (
              <div className={`absolute left-[-15px] top-7 bottom-[-15px] w-0.5 border-l-2 ${getLineColor(seg.mode)}`}></div>
            )}

            {/* Mode Icon Pin */}
            <div className={`absolute left-[-25px] top-0.5 w-6 h-6 rounded-full border flex items-center justify-center shadow-sm z-5 ${getModeColor(seg.mode)}`}>
              {getModeIcon(seg.mode)}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="capitalize">{seg.mode === 'auto' ? 'Auto/Cab' : seg.mode}</span>
                    {seg.lineName && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-medium uppercase">
                        {seg.lineName}
                      </span>
                    )}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    {seg.distance} • {seg.duration} mins
                  </p>
                </div>
                {seg.cost > 0 && (
                  <span className="text-xs font-bold text-slate-700">
                    ₹{seg.cost}
                  </span>
                )}
              </div>

              <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100/50 hover:bg-slate-50 transition-colors">
                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                  {seg.instruction}
                </p>
                
                {/* Station stop details if available */}
                {seg.stops && seg.stops.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/40 flex flex-col gap-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Stops ({seg.stops.length})
                    </span>
                    <div className="flex flex-col gap-1 pl-1">
                      {seg.stops.map((stop, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                          <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                          <span>{stop}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
