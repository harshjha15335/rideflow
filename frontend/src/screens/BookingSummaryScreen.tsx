import React from 'react';
import { useJourney } from '../services/JourneyContext';
import { ChevronLeft, ArrowRight, Ticket, Receipt, Info } from 'lucide-react';

export const BookingSummaryScreen: React.FC = () => {
  const { booking, setSearchStep, allLocations } = useJourney();

  if (!booking || !booking.route) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p className="text-sm">No active booking session found.</p>
        <button 
          onClick={() => setSearchStep('form')}
          className="mt-4 text-xs font-semibold text-indigo-600 hover:underline"
        >
          Go to Search
        </button>
      </div>
    );
  }

  const { route } = booking;
  const srcName = allLocations.find(l => l.id === booking.sourceId)?.name || 'Central Railway Station';
  const destName = allLocations.find(l => l.id === booking.destId)?.name || 'Tech Park';

  // Calculate invoice
  const baseFare = Math.round(route.cost * 0.85);
  const convenienceFee = 10;
  const taxes = route.cost - baseFare - convenienceFee;

  return (
    <div className="flex flex-col gap-6 h-full justify-between">
      {/* Header */}
      <div>
        <button
          onClick={() => setSearchStep('details')}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 font-semibold mb-3 group"
        >
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Route Details</span>
        </button>

        <h2 className="font-display font-bold text-xl text-slate-800 tracking-tight">
          Booking Review
        </h2>
        <p className="text-xs text-slate-500">
          Confirm details and review pricing summary
        </p>
      </div>

      {/* Booking summary panel */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1 py-1">
        {/* Ticket Mock Visual */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm relative overflow-hidden flex flex-col gap-3">
          {/* Top colored highlight */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>TRANSIT VOUCHER</span>
            <span className="text-indigo-600 font-mono">{booking.bookingReference}</span>
          </div>

          <div className="flex flex-col gap-1 mt-1">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide truncate">
              {route.name}
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">
              Multi-modal: {route.modeSequence.join(' → ')}
            </p>
          </div>

          {/* Source Dest nodes */}
          <div className="flex flex-col gap-3.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100/50 my-1">
            <div className="flex gap-2.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1 flex-shrink-0"></span>
              <div>
                <h4 className="text-[11px] font-bold text-slate-700">Pick-up</h4>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">{srcName}</p>
              </div>
            </div>
            <div className="flex gap-2.5">
              <span className="w-2 h-2 rotate-45 bg-purple-500 mt-1 flex-shrink-0"></span>
              <div>
                <h4 className="text-[11px] font-bold text-slate-700">Drop-off</h4>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">{destName}</p>
              </div>
            </div>
          </div>

          {/* Ticket barcode simulation */}
          <div className="flex flex-col items-center justify-center py-2.5 border-t border-slate-100 mt-1">
            <div className="h-6 w-full flex gap-1 opacity-70">
              {Array.from({ length: 48 }).map((_, i) => (
                <div 
                  key={i} 
                  className="bg-slate-700 h-full rounded-xs" 
                  style={{ width: `${(i % 3 === 0 ? 3 : i % 5 === 0 ? 1 : 2)}px` }}
                ></div>
              ))}
            </div>
            <span className="text-[9px] font-mono text-slate-400 tracking-wider mt-1.5">
              SECURE DECRYPTED TRANSACTION
            </span>
          </div>
        </div>

        {/* Price Invoice */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5 px-1">
            <Receipt className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Payment Summary
            </span>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Transit Base Fare</span>
              <span>₹{baseFare}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Convenience Charges</span>
              <span>₹{convenienceFee}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>Local Service GST</span>
              <span>₹{taxes}</span>
            </div>
            <div className="border-t border-slate-100 pt-3 flex justify-between text-sm font-bold text-slate-800">
              <span>Total Price</span>
              <span className="text-indigo-600">₹{route.cost}</span>
            </div>
          </div>
        </div>

        {/* Pass discount notification */}
        <div className="bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100/50 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-indigo-600 leading-relaxed font-medium">
            Have an active Journey Pass? You can redeem the fare directly from your Pass on the payment screen.
          </p>
        </div>
      </div>

      {/* Action CTA */}
      <button
        onClick={() => setSearchStep('payment')}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-display font-semibold py-3.5 rounded-2xl transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 mt-2 hover:scale-[1.01]"
      >
        <span>Proceed to Payment</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
