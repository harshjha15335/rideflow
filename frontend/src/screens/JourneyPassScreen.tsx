import React from 'react';
import { useJourney } from '../services/JourneyContext';
import { Ticket, CreditCard, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';

export const JourneyPassScreen: React.FC = () => {
  const { passes, activatePass, walletBalance } = useJourney();

  return (
    <div className="flex flex-col gap-6 h-full justify-between select-none">
      {/* Header */}
      <div>
        <h2 className="font-display font-bold text-xl text-slate-800 tracking-tight">
          Journey Pass Hub
        </h2>
        <p className="text-xs text-slate-500">
          Unlock unlimited travel discounts and fast-track NFC ticketing
        </p>
      </div>

      {/* Passes list scrollable */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-5 pr-1 py-1">
        {passes.map((pass) => (
          <div
            key={pass.id}
            className={`rounded-3xl p-5 text-white bg-gradient-to-br ${pass.color} shadow-lg relative overflow-hidden flex flex-col justify-between h-48 border border-white/10`}
          >
            {/* Top glassmorphic highlights */}
            <div className="absolute left-[-20px] top-[-20px] w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
            <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 rounded-full bg-white/10 blur-xl"></div>

            <div className="flex justify-between items-start z-5">
              <div>
                <span className="text-[8px] font-bold tracking-widest text-white/70 uppercase">
                  {pass.type}
                </span>
                <h3 className="font-display font-extrabold text-base tracking-wide mt-0.5">
                  {pass.name}
                </h3>
              </div>
              <div className="bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/20 text-[10px] font-bold">
                {pass.isActive ? 'ACTIVE' : 'INACTIVE'}
              </div>
            </div>

            <div className="z-5">
              <p className="text-[10px] text-white/80 leading-relaxed font-medium pr-16 truncate">
                {pass.description}
              </p>
            </div>

            <div className="flex justify-between items-end border-t border-white/15 pt-3.5 mt-2 z-5">
              <div>
                {pass.isActive ? (
                  <>
                    <span className="text-[8px] text-white/60 uppercase font-bold tracking-wider">Remaining Trips</span>
                    <p className="text-xs font-bold">{pass.tripsLeft ? `${pass.tripsLeft} rides` : 'Unlimited'}</p>
                  </>
                ) : (
                  <>
                    <span className="text-[8px] text-white/60 uppercase font-bold tracking-wider">Price</span>
                    <p className="text-sm font-extrabold">₹{pass.price}</p>
                  </>
                )}
              </div>

              {pass.isActive ? (
                /* Barcode/QR render */
                <div className="bg-white p-2 rounded-lg flex items-center justify-center shadow-md">
                  {/* Mock QR graphic */}
                  <div className="grid grid-cols-4 gap-0.5">
                    {Array.from({ length: 16 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1.5 h-1.5 ${
                          (i * 3 + 5) % 2 === 0 ? 'bg-slate-800' : 'bg-transparent'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => activatePass(pass.id)}
                  className="bg-white text-indigo-600 hover:bg-slate-50 font-display font-semibold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1"
                >
                  <span>Purchase Pass</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Advisory FAQ */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-3 mt-4">
        <HelpCircle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-slate-700">How to use your pass?</h4>
          <p className="text-[10px] text-slate-500 font-medium mt-1 leading-relaxed">
            Active passes generate a unique QR code inside the app. Simply scan the QR code at the Metro turnstiles or board local city buses directly. Your wallet balance is automatically preserved.
          </p>
        </div>
      </div>
    </div>
  );
};
