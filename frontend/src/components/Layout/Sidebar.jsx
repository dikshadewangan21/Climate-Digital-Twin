import React from 'react';
import { 
  Home, 
  LayoutDashboard, 
  Compass, 
  History, 
  BrainCircuit, 
  CalendarDays, 
  Sliders, 
  PlaneTakeoff, 
  Columns2, 
  LogIn, 
  Info,
  ChevronLeft,
  ChevronRight,
  CloudSun
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home, description: 'Overview & Highlights' },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Live Weather Overview' },
  { id: 'district-explorer', label: 'District Explorer', icon: Compass, description: '33 Districts Directory' },
  { id: 'climate-history', label: 'Climate History', icon: History, description: 'Historical Weather Trends' },
  { id: 'ai-prediction', label: 'AI Forecast', icon: BrainCircuit, description: 'Intelligent Weather Outlook' },
  { id: '14-day-weather', label: '14-Day Weather', icon: CalendarDays, description: 'Past 7 + Today + Next 7' },
  { id: 'scenario-simulation', label: 'Scenario Simulation', icon: Sliders, description: 'What-If Weather Testing' },
  { id: 'travel-assistant', label: 'Travel Assistant', icon: PlaneTakeoff, description: 'Trip Weather Advisory' },
  { id: 'compare-districts', label: 'Compare Districts', icon: Columns2, description: 'Cross-District Comparison' },
  { id: 'about', label: 'About Platform', icon: Info, description: 'Project Information & Sources' },
];

export const Sidebar = ({
  activeTab,
  setActiveTab,
  sidebarCollapsed,
  setSidebarCollapsed,
  mobileOpen,
  setMobileOpen,
  backendStatus,
  user,
  setUser
}) => {
  const handleNav = (tabId) => {
    setActiveTab(tabId);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/80 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'w-20' : 'w-64'} ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 shrink-0">
          <div 
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer overflow-hidden group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform shrink-0">
              <CloudSun className="w-5 h-5 text-cyan-400" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1.5 font-heading">
                  ClimateTwin <span className="text-cyan-400 font-mono text-xs">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium truncate">
                  Chhattisgarh Digital Twin
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex w-7 h-7 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer group relative ${isActive ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-300 font-semibold border border-cyan-500/30 shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'}`}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'}`} />
                
                {!sidebarCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs tracking-wide truncate">{item.label}</span>
                  </div>
                )}

                {/* Active Indicator Pip */}
                {isActive && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom User & System Status Card */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 shrink-0 space-y-2">
          {/* Auth Button */}
          <button
            onClick={() => handleNav('login')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${activeTab === 'login' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/60'}`}
          >
            <LogIn className="w-4 h-4 text-cyan-400 shrink-0" />
            {!sidebarCollapsed && (
              <div className="flex items-center justify-between w-full min-w-0">
                <span className="truncate font-medium">{user ? (user.name || 'Account') : 'Sign In / Account'}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${user ? 'bg-emerald-950 border border-emerald-500/30 text-emerald-300' : 'bg-cyan-950 border border-cyan-500/30 text-cyan-300'}`}>
                  {user ? 'Active' : 'Guest'}
                </span>
              </div>
            )}
          </button>

          {/* Weather Service Status indicator */}
          {!sidebarCollapsed && (
            <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800/60 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${backendStatus ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                <span className="text-slate-400">Weather Service</span>
              </div>
              <span className={`font-mono font-bold ${backendStatus ? 'text-emerald-400' : 'text-rose-400'}`}>
                {backendStatus ? 'ACTIVE' : 'OFFLINE'}
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
