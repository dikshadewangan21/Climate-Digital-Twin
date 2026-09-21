import React from 'react';
import { RefreshCw, CloudSun } from 'lucide-react';

export const LoadingState = ({ message = "Loading live weather information..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center animate-in fade-in duration-300 min-h-[300px]">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
          <CloudSun className="w-7 h-7 text-cyan-400" />
        </div>
        <div className="absolute -bottom-1 -right-1 p-1 bg-slate-950 rounded-full border border-slate-800">
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
        </div>
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-100 font-heading">Loading Weather Information</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;
