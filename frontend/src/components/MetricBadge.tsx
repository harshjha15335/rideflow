import React from 'react';
import { ShieldCheck, Zap, Leaf } from 'lucide-react';

interface MetricBadgeProps {
  type: 'safety' | 'reliability' | 'carbon';
  score: number;
  label?: string;
  detail?: string;
}

export const MetricBadge: React.FC<MetricBadgeProps> = ({ type, score, label, detail }) => {
  const getIcon = () => {
    switch (type) {
      case 'safety':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'reliability':
        return <Zap className="w-4 h-4 text-indigo-600" />;
      case 'carbon':
        return <Leaf className="w-4 h-4 text-teal-600" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'safety':
        return {
          bg: 'bg-emerald-50 border-emerald-100',
          stroke: 'stroke-emerald-500',
          track: 'stroke-emerald-100',
          text: 'text-emerald-700'
        };
      case 'reliability':
        return {
          bg: 'bg-indigo-50 border-indigo-100',
          stroke: 'stroke-indigo-500',
          track: 'stroke-indigo-100',
          text: 'text-indigo-700'
        };
      case 'carbon':
        return {
          bg: 'bg-teal-50 border-teal-100',
          stroke: 'stroke-teal-500',
          track: 'stroke-teal-100',
          text: 'text-teal-700'
        };
    }
  };

  const colors = getColors();
  
  // Circle coordinates
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-2xl border ${colors.bg} shadow-sm w-full transition-transform hover:scale-[1.01]`}>
      {/* Radial Progress Ring */}
      <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center bg-white rounded-xl shadow-sm">
        <svg className="w-10 h-10 transform -rotate-90">
          <circle
            cx="20"
            cy="20"
            r={radius}
            className={`fill-none ${colors.track}`}
            strokeWidth="3"
          />
          <circle
            cx="20"
            cy="20"
            r={radius}
            className={`fill-none ${colors.stroke} transition-all duration-500 ease-out`}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex items-center justify-center">
          {getIcon()}
        </div>
      </div>

      {/* Texts */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700">
            {label || type.charAt(0).toUpperCase() + type.slice(1)}
          </span>
          <span className={`text-xs font-extrabold ${colors.text}`}>
            {score}%
          </span>
        </div>
        <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
          {detail || `${score}% score`}
        </p>
      </div>
    </div>
  );
};
