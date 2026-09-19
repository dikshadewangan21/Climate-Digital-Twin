import React from 'react';
import { 
  Globe, 
  BarChart2, 
  ShieldAlert, 
  Sliders, 
  GitCompare, 
  FileText, 
  CloudSun
} from 'lucide-react';

const MAIN_MODULES = [
  { id: 'digital-twin', label: 'Live Climate Map', icon: Globe, desc: 'Real-time weather & conditions' },
  { id: 'forecast', label: 'Weather Forecast', icon: BarChart2, desc: '7-day expected weather' },
  { id: 'alerts', label: 'Alerts & Risks', icon: ShieldAlert, desc: 'Heatwaves, floods & drought' },
  { id: 'scenario', label: 'What-If Scenarios', icon: Sliders, desc: 'Test climate changes' },
  { id: 'compare', label: 'Compare Districts', icon: GitCompare, desc: 'Side-by-side weather trends' },
  { id: 'reports', label: 'Climate Reports', icon: FileText, desc: 'Download summary briefs' },
];

export const Sidebar = ({ activeTab, setActiveTab, backendStatus }) => {
  return (
    <aside className="w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between h-screen sticky top-0 z-30 shrink-0 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <CloudSun className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-100 tracking-wider font-heading leading-tight">
              CLIMATETWIN <span className="text-cyan-400">AI</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-sans font-medium">Climate Decision Dashboard</p>
          </div>
        </div>

        {/* Main User-Centric Navigation Menu */}
        <div className="px-4 pt-4 pb-1">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
            Decision Modules
          </span>
        </div>
        <nav className="px-3 space-y-1">
          {MAIN_MODULES.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-all text-left group cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                }`} />
                <div className="truncate">
                  <div className="leading-tight">{item.label}</div>
                  <div className="text-[9px] text-slate-500 group-hover:text-slate-400 font-normal">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Status indicator at bottom */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/80">
        <div className="space-y-2 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Live Server</span>
            <span className="flex items-center gap-1.5 font-mono">
              <span className={`w-2 h-2 rounded-full ${backendStatus ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
              <span className={backendStatus ? 'text-emerald-400 font-semibold' : 'text-rose-400'}>
                {backendStatus ? 'Online' : 'Offline'}
              </span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">Region</span>
            <span className="font-semibold text-slate-200">Chhattisgarh (33 Districts)</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
