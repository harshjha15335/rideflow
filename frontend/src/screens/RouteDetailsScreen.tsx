import React from 'react';
import { useJourney } from '../services/JourneyContext';
import { ChevronLeft, ArrowRight, ShieldCheck, Zap, Leaf, ShieldAlert } from 'lucide-react';
import { Timeline } from '../components/Timeline';
import { MetricBadge } from '../components/MetricBadge';

export const RouteDetailsScreen: React.FC = () => {
  const { selectedRoute, setSearchStep, startBooking } = useJourney();

  if (!selectedRoute) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p className="text-sm">No route selected. Please go back.</p>
        <button 
          onClick={() => setSearchStep('options')}
          className="mt-4 text-xs font-semibold text-indigo-600 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 h-full justify-between">
      {/* Header */}
      <div>
        <button
          onClick={() => setSearchStep('options')}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 font-semibold mb-3 group"
        >
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>All Options</span>
        </button>

        <h2 className="font-display font-bold text-xl text-slate-800 tracking-tight">
          Route Details
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Step-by-step breakdown of your journey plan
        </p>
      </div>

      {/* Details Scroll Panel */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-5 pr-1 py-1">
        {/* Route Header Card */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-slate-800 text-sm">{selectedRoute.name}</h3>
            <span className="text-xs font-extrabold text-indigo-600">₹{selectedRoute.cost}</span>
          </div>
          <div className="flex gap-4 text-xs text-slate-500 font-medium">
            <span>⏱️ {selectedRoute.duration} mins total</span>
            <span>📍 {selectedRoute.transfers} transfers</span>
          </div>
        </div>

        {/* Dial Indicators */}
        <div className="flex flex-col gap-2.5">
          <MetricBadge 
            type="reliability" 
            score={selectedRoute.reliabilityScore} 
            label="Reliability Score"
            detail="Schedule alignment and delay metrics"
          />
          <MetricBadge 
            type="safety" 
            score={selectedRoute.safetyScore} 
            label="Safety Rating"
            detail="Lit walkways & certified operators"
          />
          <MetricBadge 
            type="carbon" 
            score={selectedRoute.carbonScore} 
            label="Carbon Savings"
            detail={`Saved ${selectedRoute.carbonSaved} CO₂ vs private taxi`}
          />
        </div>

        {/* Timeline */}
        <div className="mt-2">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">
            Segment Timeline
          </h4>
          <Timeline segments={selectedRoute.segments} />
        </div>

        {/* Safety Note Alert */}
        <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-100 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Transit Advisory</h4>
            <p className="text-[10px] text-amber-600 font-medium mt-0.5 leading-relaxed">
              Wearing masks is recommended in Metro and crowded bus compartments during peak hours. Keep passes active.
            </p>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <button
        onClick={startBooking}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-display font-semibold py-3.5 rounded-2xl transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 mt-2 hover:scale-[1.01]"
      >
        <span>Proceed to Book Route</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
