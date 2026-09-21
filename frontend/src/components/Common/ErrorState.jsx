import React from 'react';
import { AlertTriangle, RefreshCw, ServerCrash } from 'lucide-react';

export const ErrorState = ({ 
  title = "Weather Information Unavailable", 
  message = "Unable to retrieve the latest weather records. Please check your network connection and try again.",
  onRetry 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 space-y-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-center animate-in fade-in duration-300 min-h-[300px]">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
          <ServerCrash className="w-7 h-7 text-rose-400" />
        </div>
        <div className="absolute -bottom-1 -right-1 p-1 bg-slate-950 rounded-full border border-rose-500/30">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
        </div>
      </div>
      <div className="max-w-md">
        <h4 className="text-sm font-bold text-rose-300 font-heading">{title}</h4>
        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorState;
