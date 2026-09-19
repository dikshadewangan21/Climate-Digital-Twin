import React from 'react';
import { Activity, Server, CloudSun, MapPin } from 'lucide-react';

export const StatusFooter = ({ backendStatus }) => {
  return (
    <footer className="w-full bg-slate-900/60 border-t border-slate-800 text-xs text-slate-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-1.5">
            <CloudSun className="w-3.5 h-3.5 text-cyan-400" />
            <span>Data: <span className="text-slate-200 font-medium">India Meteorological Department (IMD)</span></span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Region: <span className="text-slate-200 font-medium">Chhattisgarh (33 Districts)</span></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${backendStatus ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span className={backendStatus ? 'text-emerald-400 font-medium' : 'text-rose-400'}>
              {backendStatus ? 'Live Data Synced' : 'Offline'}
            </span>
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-500 font-medium">Regional Climate Decision System</span>
        </div>
      </div>
    </footer>
  );
};

export default StatusFooter;
