import React, { useState } from 'react';
import { 
  CloudSun, 
  MapPin, 
  RefreshCw, 
  Menu, 
  X, 
  Map, 
  Calendar, 
  AlertTriangle, 
  Sliders, 
  BarChart3, 
  FileText, 
  Info,
  ChevronDown
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'digital-twin', label: 'Live Map', icon: Map },
  { id: 'forecast', label: '7-Day Forecast', icon: Calendar },
  { id: 'alerts', label: 'Safety Alerts', icon: AlertTriangle },
  { id: 'scenario', label: 'What-If Simulator', icon: Sliders },
  { id: 'compare', label: 'Compare', icon: BarChart3 },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'about', label: 'About Data', icon: Info },
];

export const Header = ({ 
  backendStatus, 
  onRefresh, 
  districts = [], 
  activeDistrict, 
  setActiveDistrict, 
  activeTab, 
  setActiveTab 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDistrictChange = (e) => {
    const selected = districts.find(d => d.id === e.target.value);
    if (selected && setActiveDistrict) {
      setActiveDistrict(selected);
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Product Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white font-heading">
                  Climate Dashboard
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-cyan-300 border border-slate-700">
                  Chhattisgarh
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans hidden md:block">
                Regional Weather & Climate Decision Support
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: District Selector, Status & Refresh */}
          <div className="flex items-center gap-2.5">
            
            {/* Quick District Selector */}
            <div className="relative hidden sm:flex items-center">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 absolute left-2.5 pointer-events-none z-10" />
              <select
                value={activeDistrict?.id || ''}
                onChange={handleDistrictChange}
                aria-label="Select district"
                className="pl-8 pr-7 py-1.5 bg-slate-950 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 hover:border-slate-600 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
              >
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
            </div>

            {/* Server Connection Status Badge */}
            <div 
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                backendStatus
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-950/60 text-rose-300 border-rose-500/30'
              }`}
              title={backendStatus ? 'Live backend connected' : 'Backend offline'}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${backendStatus ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              <span className="text-[11px]">{backendStatus ? 'Live' : 'Offline'}</span>
            </div>

            {/* Refresh Data Button */}
            <button
              onClick={onRefresh}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
              title="Refresh weather data"
              aria-label="Refresh weather data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-4 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          {/* Mobile District Selector */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              Selected District:
            </label>
            <select
              value={activeDistrict?.id || ''}
              onChange={handleDistrictChange}
              className="w-full p-2 bg-slate-950 text-slate-100 text-xs font-semibold rounded-lg border border-slate-700"
            >
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.role || 'District'})
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Navigation List */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`p-2.5 rounded-lg text-xs font-medium flex items-center gap-2 text-left cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-950/60 text-slate-200 hover:bg-slate-800 border border-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Status Details */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Server Status:</span>
            <span className={`font-semibold flex items-center gap-1 ${backendStatus ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span className={`w-2 h-2 rounded-full ${backendStatus ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              {backendStatus ? 'Connected (IMD Data)' : 'Offline'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
