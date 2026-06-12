import React, { useState } from 'react';
import { useJourney } from '../services/JourneyContext';
import { ChevronLeft, ShieldCheck, Wallet, CreditCard, Loader2 } from 'lucide-react';

export const MockPaymentScreen: React.FC = () => {
  const { booking, walletBalance, completePayment, setSearchStep } = useJourney();
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');

  if (!booking || !booking.route) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <p className="text-sm">No booking active.</p>
        <button 
          onClick={() => setSearchStep('form')}
          className="mt-4 text-xs font-semibold text-indigo-600 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { route } = booking;
  const isWalletInsufficient = walletBalance < route.cost;

  const handlePay = async () => {
    setIsProcessing(true);
    setProcessingMessage('Authenticating transaction...');
    
    // Step 1 simulation
    setTimeout(() => {
      setProcessingMessage('Securing corridor booking slots...');
      
      // Step 2 simulation
      setTimeout(async () => {
        setProcessingMessage('Finalizing transit tokens...');
        
        // Execute booking pay
        const success = await completePayment(paymentMethod);
        setIsProcessing(false);
        if (!success) {
          alert('Payment failed. Check your wallet balance!');
        }
      }, 800);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-6 h-full justify-between relative">
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center gap-4 text-center px-4 animate-fade-in">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <div>
            <h3 className="font-display font-bold text-slate-800 text-base">
              Processing Payment
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-1">
              {processingMessage}
            </p>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold tracking-wider mt-12">
            DO NOT REFRESH OR CLOSE
          </span>
        </div>
      )}

      {/* Header */}
      <div>
        <button
          onClick={() => setSearchStep('booking')}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 font-semibold mb-3 group"
        >
          <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Ticket Summary</span>
        </button>

        <h2 className="font-display font-bold text-xl text-slate-800 tracking-tight">
          Select Payment
        </h2>
        <p className="text-xs text-slate-500">
          Complete the ticket booking using a secure payment channel
        </p>
      </div>

      {/* Payment Options */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1 py-1">
        {/* Total Amount Indicator */}
        <div className="bg-indigo-600 text-white rounded-2xl p-4 flex justify-between items-center shadow-md shadow-indigo-100">
          <div>
            <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider">Amount Due</span>
            <h3 className="font-display font-bold text-xl mt-0.5">₹{route.cost}</h3>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold bg-indigo-500/50 px-3 py-1.5 rounded-xl border border-indigo-400/30">
            <ShieldCheck className="w-4 h-4 text-indigo-200" />
            <span>Secure SSL</span>
          </div>
        </div>

        {/* Method Selectors */}
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Payment Options
          </span>

          {/* Wallet Method */}
          <div
            onClick={() => setPaymentMethod('wallet')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 select-none ${
              paymentMethod === 'wallet'
                ? 'bg-indigo-50/20 border-indigo-600 shadow-sm'
                : 'bg-white border-slate-100 hover:border-slate-200 shadow-xs'
            }`}
          >
            <div className={`p-2.5 rounded-xl border ${
              paymentMethod === 'wallet' ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-slate-50 text-slate-500 border-slate-100'
            }`}>
              <Wallet className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800">
                  RideFlow Digital Wallet
                </h4>
                <input 
                  type="radio" 
                  checked={paymentMethod === 'wallet'} 
                  onChange={() => setPaymentMethod('wallet')} 
                  className="accent-indigo-600"
                />
              </div>
              <p className="text-[11px] text-slate-500 font-semibold mt-1">
                Balance: ₹{walletBalance} 
                {isWalletInsufficient && (
                  <span className="text-red-500 ml-2 font-bold">(Insufficient Funds)</span>
                )}
              </p>
            </div>
          </div>

          {/* Credit Card Method */}
          <div
            onClick={() => setPaymentMethod('card')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 select-none ${
              paymentMethod === 'card'
                ? 'bg-indigo-50/20 border-indigo-600 shadow-sm'
                : 'bg-white border-slate-100 hover:border-slate-200 shadow-xs'
            }`}
          >
            <div className={`p-2.5 rounded-xl border ${
              paymentMethod === 'card' ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-slate-50 text-slate-500 border-slate-100'
            }`}>
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800">
                  Credit / Debit Card
                </h4>
                <input 
                  type="radio" 
                  checked={paymentMethod === 'card'} 
                  onChange={() => setPaymentMethod('card')} 
                  className="accent-indigo-600"
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Pay using saved Visa/Mastercard
              </p>
            </div>
          </div>
        </div>

        {/* Card Mock Details View (if card selected) */}
        {paymentMethod === 'card' && (
          <div className="bg-slate-800 text-white rounded-3xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between h-36 mt-1 border border-slate-700">
            {/* Glossmorphism bubble glow */}
            <div className="absolute right-[-40px] top-[-40px] w-24 h-24 rounded-full bg-indigo-500/20 blur-xl"></div>
            
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">SAVED CARD</span>
                <h4 className="text-xs font-semibold tracking-wide text-slate-200 mt-0.5">Orizon Travel Select</h4>
              </div>
              <span className="font-display font-extrabold text-sm italic text-indigo-400">Mastercard</span>
            </div>

            <div>
              <div className="text-sm font-mono tracking-widest text-slate-100">
                ••••  ••••  ••••  3561
              </div>
              <div className="flex justify-between items-end mt-2">
                <div>
                  <span className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Card Holder</span>
                  <p className="text-[10px] font-semibold text-slate-200">{booking.route.segments[0].fromName === 'Central Railway Station' ? 'Joe Smith' : 'Joe Smith'}</p>
                </div>
                <div>
                  <span className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Expires</span>
                  <p className="text-[10px] font-semibold text-slate-200">09 / 29</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action CTA */}
      <button
        onClick={handlePay}
        disabled={paymentMethod === 'wallet' && isWalletInsufficient}
        className={`w-full font-display font-semibold py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 mt-4 hover:scale-[1.01] ${
          paymentMethod === 'wallet' && isWalletInsufficient
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
        }`}
      >
        <span>Confirm & Pay ₹{route.cost}</span>
      </button>
    </div>
  );
};
