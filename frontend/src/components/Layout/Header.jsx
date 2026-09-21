import React from 'react';
import { 
  CloudSun, 
  MapPin, 
  RefreshCw, 
  Menu, 
  ChevronDown,
  Activity,
  Sparkles
} from 'lucide-react';
import { NAV_ITEMS } from './Sidebar';

export const Header = ({ 
  backendStatus, 
  onRefresh, 
  districts = [], 
  activeDistrict, 
  setActiveDistrict, 
  activeTab, 
  setActiveTab,
  setMobileOpen
}) => {
  const currentNav = NAV_ITEMS.find(n => n.id === activeTab) || { label: 'Climate Dashboard' };

  const handleDistrictChange = (e) => {
    const selected = districts.find(d => d.id === e.target.value || d.name === e.target.value);
    if (selected && setActiveDistrict) {
      setActiveDistrict(selected);
    }
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-30 h-16">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Left: Mobile hamburger & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight font-heading flex items-center gap-2">
              <span>{currentNav.label}</span>
              <span className="hidden sm:inline-block text-xs font-normal text-slate-400 font-sans">
                • Chhattisgarh Digital Twin
              </span>
            </h1>
          </div>
        </div>

        {/* Right: District Selector, Status & Refresh */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* District Selector */}
          <div className="relative flex items-center">
            <div className="absolute left-3 pointer-events-none text-cyan-400">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <select
              value={activeDistrict?.id || 'raipur'}
              onChange={handleDistrictChange}
              className="pl-8 pr-8 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none cursor-pointer transition-all shadow-sm max-w-[140px] sm:max-w-[200px] truncate"
            >
              {districts.map((d) => (
                <option key={d.id || d.name} value={d.id} className="bg-slate-900 text-white">
                  {d.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 pointer-events-none text-slate-400" />
          </div>

          {/* Live Feed Status Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs">
            <span className={`w-2 h-2 rounded-full ${backendStatus ? 'bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse' : 'bg-rose-500'}`} />
            <span className={backendStatus ? 'text-slate-300 font-medium' : 'text-rose-400'}>
              {backendStatus ? 'Live Weather Feed' : 'Feed Offline'}
            </span>
          </div>

          {/* Refresh Action */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 rounded-xl bg-slate-800/60 hover:bg-cyan-500/10 hover:text-cyan-400 text-slate-400 border border-slate-700/60 transition-all cursor-pointer"
              title="Refresh weather data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
