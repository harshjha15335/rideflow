import React from 'react';
import { useJourney } from '../services/JourneyContext';
import { Wallet, PlusCircle, ArrowUpRight, ArrowDownLeft, ShieldCheck } from 'lucide-react';

export const WalletScreen: React.FC = () => {
  const { walletBalance, topUpWallet } = useJourney();

  const transactions = [
    {
      id: 'tx-228',
      type: 'payment',
      title: 'Booking Payment Route A',
      amount: -82,
      date: 'Today, 14:12',
      status: 'success'
    },
    {
      id: 'tx-115',
      type: 'topup',
      title: 'Wallet Deposit Credit Card',
      amount: 500,
      date: '08 Jun, 09:30',
      status: 'success'
    },
    {
      id: 'tx-992',
      type: 'payment',
      title: 'Metro Express Pass Renewal',
      amount: -499,
      date: '05 Jun, 18:22',
      status: 'success'
    }
  ];

  return (
    <div className="flex flex-col gap-6 h-full justify-between select-none">
      {/* Header */}
      <div>
        <h2 className="font-display font-bold text-xl text-slate-800 tracking-tight">
          Wallet Account
        </h2>
        <p className="text-xs text-slate-500">
          Manage credits, check card settings and top up funds
        </p>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-5 pr-1 py-1">
        {/* Wallet Balance Card */}
        <div className="bg-indigo-600 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between h-36 border border-indigo-500">
          <div className="absolute right-[-20px] top-[-20px] w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
          
          <div className="flex justify-between items-start z-5">
            <div>
              <span className="text-[8px] font-bold tracking-widest text-indigo-200 uppercase">
                DIGITAL BALANCE
              </span>
              <h3 className="font-display font-extrabold text-2xl mt-0.5">
                ₹{walletBalance}
              </h3>
            </div>
            <Wallet className="w-6 h-6 text-indigo-200" />
          </div>

          <div className="flex justify-between items-end border-t border-indigo-500/50 pt-3 z-5">
            <span className="text-[9px] text-indigo-200 font-bold uppercase tracking-wider">
              Auto-Deduct passes enabled
            </span>
            <span className="text-[10px] text-white/90 font-semibold bg-indigo-500/50 px-2 py-0.5 rounded-lg">
              Primary Wallet
            </span>
          </div>
        </div>

        {/* Top Up Panel */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Deposit Funds
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[100, 500, 1000].map((amt) => (
              <button
                key={amt}
                onClick={() => topUpWallet(amt)}
                className="py-2.5 bg-white border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/10 rounded-2xl text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5 text-indigo-500" />
                <span>+ ₹{amt}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="flex flex-col gap-2.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Transaction Activity
          </span>

          <div className="flex flex-col gap-2">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-slate-100 p-3.5 rounded-3xl flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    t.type === 'topup' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-600 border border-slate-100'
                  }`}>
                    {t.type === 'topup' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{t.title}</h4>
                    <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{t.date}</p>
                  </div>
                </div>

                <span className={`text-xs font-extrabold ${t.type === 'topup' ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {t.amount > 0 ? `+₹${t.amount}` : `-₹${Math.abs(t.amount)}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Info */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-2.5 mt-4">
        <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
        <span className="text-[10px] text-slate-500 font-medium leading-relaxed">
          RideFlow Wallet utilizes AES-256 vault encryption. Balance is guaranteed safe under reserve merchant clauses.
        </span>
      </div>
    </div>
  );
};
