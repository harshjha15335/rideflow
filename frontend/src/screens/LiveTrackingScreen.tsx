import React, { useState } from 'react';
import { useJourney } from '../services/JourneyContext';
import { X, MessageSquare, Phone, MapPin, Compass, Play, RotateCcw } from 'lucide-react';

export const LiveTrackingScreen: React.FC = () => {
  const { 
    booking, 
    trackingProgress, 
    simulatedETA, 
    isTrackingActive, 
    setTrackingActive, 
    resetSimulation 
  } = useJourney();

  const [messageOpen, setMessageOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [chatText, setChatText] = useState('');
  const [chatHistory, setChatHistory] = useState<string[]>([
    'Driver: Hello! I am approaching your pick-up spot.',
  ]);

  if (!booking || !booking.route) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6 text-center">
        <MapPin className="w-12 h-12 text-slate-300 mb-3" />
        <h3 className="font-semibold text-slate-700 text-sm">No Active Journey</h3>
        <p className="text-xs text-slate-500 mt-1">
          Plan and book a journey to launch real-time simulation and live tracking.
        </p>
      </div>
    );
  }

  const { route } = booking;
  
  // Calculate which segment we are currently on based on progress
  const totalSegments = route.segments.length;
  const activeSegmentIndex = Math.min(
    Math.floor((trackingProgress / 100) * totalSegments),
    totalSegments - 1
  );
  
  const currentSegment = route.segments[activeSegmentIndex];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;
    setChatHistory(prev => [...prev, `You: ${chatText}`]);
    setChatText('');
    setTimeout(() => {
      setChatHistory(prev => [...prev, 'Driver: Understood, see you shortly!']);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-5 h-full justify-between relative select-none">
      {/* Messaging Modal */}
      {messageOpen && (
        <div className="absolute inset-0 bg-white z-40 flex flex-col justify-between p-4 rounded-3xl animate-fade-in border border-slate-100">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Chat with Joe</h3>
              <p className="text-[10px] text-slate-400 font-semibold">Skoda Octavia • 22 A 228 10</p>
            </div>
            <button 
              onClick={() => setMessageOpen(false)}
              className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto my-3 flex flex-col gap-2 p-1">
            {chatHistory.map((chat, i) => (
              <div 
                key={i} 
                className={`p-2.5 rounded-2xl text-xs max-w-[85%] ${
                  chat.startsWith('You:') 
                    ? 'bg-indigo-600 text-white self-end rounded-br-none' 
                    : 'bg-slate-100 text-slate-700 self-start rounded-bl-none'
                }`}
              >
                {chat.replace(/^(You:|Driver:)\s*/, '')}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button 
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Call Dialog Modal */}
      {callOpen && (
        <div className="absolute inset-0 bg-slate-900/95 z-40 flex flex-col justify-between items-center p-8 rounded-3xl animate-fade-in text-white text-center">
          <div className="flex flex-col items-center mt-12 gap-3">
            <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-400/20 animate-pulse">
              <div className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center font-display font-bold text-lg">
                JS
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg">Calling Joe Smith</h3>
              <p className="text-xs text-indigo-300 font-mono mt-1">Connecting via Secure Proxy...</p>
            </div>
          </div>

          <button
            onClick={() => setCallOpen(false)}
            className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
          >
            <Phone className="w-6 h-6 text-white rotate-[135deg]" />
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
              Live Tracking
            </span>
            <h2 className="font-display font-bold text-xl text-slate-800 tracking-tight mt-1">
              {trackingProgress === 100 ? 'Journey Complete' : `Arriving in ${simulatedETA}m`}
            </h2>
          </div>
          
          <button
            onClick={resetSimulation}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Stats and active segment card */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1 py-1">
        {/* Driver Details Card (from Orizon Image Reference!) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-4.5 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center font-display font-semibold text-slate-700 border border-slate-200">
                JS
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1">
                  <span>Joe Smith</span>
                  <span className="text-[10px] text-amber-500 font-extrabold flex items-center bg-amber-50 px-1 py-0.2 rounded">
                    ★ 4.3
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Skoda Octavia • <span className="font-mono">22 A 228 10</span>
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Arriving</span>
              <span className="text-xs font-bold text-indigo-600 block mt-0.5">5 min</span>
            </div>
          </div>

          {/* Action buttons (Orizon inspired: Close, Msg, Call) */}
          <div className="grid grid-cols-3 gap-2.5 pt-1.5">
            <button 
              onClick={resetSimulation}
              className="py-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setMessageOpen(true)}
              className="py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition-colors shadow-sm shadow-amber-100"
            >
              <MessageSquare className="w-5 h-5 fill-current" />
            </button>
            <button 
              onClick={() => setCallOpen(true)}
              className="py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors shadow-sm shadow-indigo-100"
            >
              <Phone className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>

        {/* Dynamic progress bar info */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/80 flex flex-col gap-3">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Simulation Progress</span>
            <span className="text-indigo-600 font-mono">{trackingProgress}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${trackingProgress}%` }}
            ></div>
          </div>

          {/* Active Segment breakdown */}
          <div className="flex items-start gap-2.5 mt-1 border-t border-slate-200/50 pt-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
              <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
                Current Segment ({activeSegmentIndex + 1}/{totalSegments})
              </span>
              <h4 className="text-xs font-bold text-slate-700 mt-0.5 capitalize">
                {currentSegment.mode} Connection
              </h4>
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">
                {currentSegment.instruction}
              </p>
            </div>
          </div>
        </div>

        {/* Segment Node Bulletins */}
        <div className="flex flex-col gap-2.5 mt-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Trip Roadmap
          </span>
          <div className="flex flex-col gap-1.5 pl-1.5 border-l border-slate-200">
            {route.segments.map((s, idx) => {
              const isActive = idx === activeSegmentIndex;
              const isPast = idx < activeSegmentIndex;
              return (
                <div key={idx} className="flex items-center gap-2.5 py-1">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    isActive ? 'bg-indigo-600 scale-125 shadow-sm' : isPast ? 'bg-slate-300' : 'bg-slate-200'
                  }`}></span>
                  <span className={`text-[11px] font-semibold ${
                    isActive ? 'text-slate-800' : 'text-slate-400'
                  } capitalize`}>
                    {s.mode} ({s.duration} min)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Simulator Toggles */}
      <div className="flex gap-2">
        <button
          onClick={() => setTrackingActive(!isTrackingActive)}
          className={`w-full py-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 border shadow-xs transition-all ${
            isTrackingActive 
              ? 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600'
          }`}
        >
          {isTrackingActive ? (
            <>
              <X className="w-4 h-4" />
              <span>Pause Simulator</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Simulator</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
