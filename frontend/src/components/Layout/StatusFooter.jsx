import React from 'react';
import { Activity, CloudSun, MapPin, BrainCircuit } from 'lucide-react';

export const StatusFooter = ({ backendStatus }) => {
  return (
    <footer className="w-full bg-slate-900/60 border-t border-slate-800/80 text-xs text-slate-400 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-1.5">
            <CloudSun className="w-3.5 h-3.5 text-cyan-400" />
            <span>Data: <span className="text-slate-200 font-medium">Open-Meteo & ERA5-Land Reanalysis</span></span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Scope: <span className="text-slate-200 font-medium">Chhattisgarh (33 Districts)</span></span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5">
            <BrainCircuit className="w-3.5 h-3.5 text-cyan-400" />
            <span>Forecasting: <span className="text-slate-200 font-medium">Smart Weather Intelligence</span></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${backendStatus ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]' : 'bg-rose-500'}`} />
            <span className={backendStatus ? 'text-emerald-400 font-medium' : 'text-rose-400'}>
              {backendStatus ? 'Network Active' : 'Offline'}
            </span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-500 font-medium font-heading tracking-wide">ClimateTwin AI</span>
        </div>
      </div>
    </footer>
  );
};

export default StatusFooter;
