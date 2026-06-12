import React from 'react';
import { useJourney } from '../services/JourneyContext';
import { Calendar, ReceiptText, ChevronRight, Award } from 'lucide-react';

export const BookingsScreen: React.FC = () => {
  const { booking, allLocations } = useJourney();

  const srcName = booking ? allLocations.find(l => l.id === booking.sourceId)?.name : '';
  const destName = booking ? allLocations.find(l => l.id === booking.destId)?.name : '';

  const pastBookings = [
    {
      id: 'bk-552211',
      date: '08 Jun 2026',
      from: 'Metro Central',
      to: 'Tech Park',
      fare: 82,
      status: 'completed',
      route: 'Multi-Modal Green Link'
    },
    {
      id: 'bk-228833',
      date: '05 Jun 2026',
      from: 'Central Railway Station',
      to: 'Metro Central',
      fare: 35,
      status: 'completed',
      route: 'City Bus Shuttle'
    }
  ];

  return (
    <div className="flex flex-col gap-6 h-full justify-between select-none">
      {/* Header */}
      <div>
        <h2 className="font-display font-bold text-xl text-slate-800 tracking-tight">
          Booking History
        </h2>
        <p className="text-xs text-slate-500">
          Access your active travel tokens and past payment invoices
        </p>
      </div>

      {/* Bookings List scrollable */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-5 pr-1 py-1">
        {/* Active Booking Segment if exists */}
        {booking && booking.status === 'confirmed' && (
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider px-1">
              Active Bookings
            </span>
            <div className="bg-white border-2 border-indigo-600 p-4 rounded-3xl shadow-sm flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-extrabold bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-0.5 rounded-lg">
                  READY TO BOARD
                </span>
                <span className="text-xs font-mono font-bold text-slate-700">{booking.bookingReference}</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">{booking.route?.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{srcName} to {destName}</p>
              </div>
              <div className="border-t border-slate-100 pt-2.5 flex justify-between items-center text-xs font-medium text-slate-500">
                <span>Fare Paid: ₹{booking.route?.cost}</span>
                <span>Active Tracking enabled</span>
              </div>
            </div>
          </div>
        )}

        {/* Past Bookings */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Archived Rides
          </span>
          <div className="flex flex-col gap-2">
            {pastBookings.map((pb) => (
              <div
                key={pb.id}
                className="bg-white border border-slate-100 p-4 rounded-3xl shadow-xs flex items-center justify-between group cursor-pointer hover:border-slate-200 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{pb.from} to {pb.to}</span>
                    <span className="text-[8px] font-bold bg-slate-50 text-slate-400 border border-slate-100 px-1.5 py-0.2 rounded uppercase">
                      Archived
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    {pb.date} • {pb.route}
                  </p>
                </div>
                
                <div className="flex items-center gap-2.5 ml-4 flex-shrink-0">
                  <span className="text-xs font-bold text-slate-700">₹{pb.fare}</span>
                  <ReceiptText className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advisory FAQ */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-3 mt-4">
        <Calendar className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-slate-700">Invoice Downloads</h4>
          <p className="text-[10px] text-slate-500 font-medium mt-1 leading-relaxed">
            Need receipts for corporate tax filings? Expand any archived card above to generate a downloadable PDF invoice for reimbursement.
          </p>
        </div>
      </div>
    </div>
  );
};
