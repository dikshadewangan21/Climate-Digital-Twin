import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Thermometer, 
  CloudRain, 
  Wind, 
  Droplets, 
  ArrowRight, 
  Sliders, 
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';

export const DistrictExplorerPage = ({
  districts = [],
  activeDistrict,
  setActiveDistrict,
  setActiveTab
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // all, rain, warm, cool

  const filteredDistricts = districts.filter((d) => {
    const nameMatch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      d.id.toLowerCase().includes(searchTerm.toLowerCase());
    if (!nameMatch) return false;

    const temp = d.temperature_c ?? d.baseTemp;
    const rain = d.rainfall_mm ?? d.baseRain;

    if (filterMode === 'rain') return rain !== undefined && rain !== null && rain > 1.0;
    if (filterMode === 'warm') return temp !== undefined && temp !== null && temp >= 30;
    if (filterMode === 'cool') return temp !== undefined && temp !== null && temp < 25;
    return true;
  });

  const handleSelect = (district) => {
    if (setActiveDistrict) setActiveDistrict(district);
  };

  const current = activeDistrict || districts[0] || { name: 'Raipur' };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* Top Header & Search */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white font-heading tracking-tight">
              District Explorer
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Explore live weather conditions and climate profiles across all 33 districts of Chhattisgarh.
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
            Total: {districts.length} Districts
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search district by name (e.g. Bastar, Raipur, Surguja)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${filterMode === 'all' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterMode('rain')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${filterMode === 'rain' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              Rainy
            </button>
            <button
              onClick={() => setFilterMode('warm')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${filterMode === 'warm' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              Warm (&gt;=30°C)
            </button>
            <button
              onClick={() => setFilterMode('cool')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${filterMode === 'cool' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
            >
              Cool (&lt;25°C)
            </button>
          </div>
        </div>
      </div>

      {/* District Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDistricts.map((d) => {
          const isSelected = d.id === current.id;
          const hasTemp = d.temperature_c !== undefined && d.temperature_c !== null;
          const temp = hasTemp ? `${d.temperature_c}°C` : (d.baseTemp !== undefined ? `${d.baseTemp}°C` : 'Data unavailable');
          const hasRain = d.rainfall_mm !== undefined && d.rainfall_mm !== null;
          const rain = hasRain ? `${d.rainfall_mm} mm` : (d.baseRain !== undefined ? `${d.baseRain} mm` : 'Data unavailable');
          const rawH = d.humidity ?? d.humidity_pct;
          const humidity = rawH !== undefined && rawH !== null ? `${rawH}%` : 'Data unavailable';
          const wind = d.wind_speed_kmh !== undefined && d.wind_speed_kmh !== null ? `${d.wind_speed_kmh} km/h` : 'Data unavailable';
          const cond = d.condition || { label: 'Clear', icon: '☀️' };

          return (
            <div
              key={d.id || d.name}
              onClick={() => handleSelect(d)}
              className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer relative flex flex-col justify-between space-y-4 ${isSelected ? 'bg-gradient-to-br from-cyan-950/60 to-slate-900 border-cyan-400/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/30' : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'}`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <h3 className="font-bold text-sm text-white font-heading">{d.name}</h3>
                  </div>
                  <span className="text-xl">{cond.icon}</span>
                </div>

                <div className="mt-1 text-[11px] text-slate-400 font-mono">
                  Lat {d.lat?.toFixed(2)}°, Lon {d.lon?.toFixed(2)}°
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <div className="text-[10px] text-slate-400">Temp</div>
                  <div className="text-xs font-bold text-white font-heading">{temp}</div>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <div className="text-[10px] text-slate-400">Rain</div>
                  <div className="text-xs font-bold text-blue-400 font-heading">{rain}</div>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <div className="text-[10px] text-slate-400">Humidity</div>
                  <div className="text-xs font-bold text-cyan-300 font-heading">{humidity}</div>
                </div>
              </div>

              {/* Action Strip */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400">
                  {d.role ? d.role.slice(0, 30) + '...' : 'Representative station'}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(d);
                    if (setActiveTab) setActiveTab('dashboard');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold flex items-center gap-1 transition-colors"
                >
                  <span>Dashboard</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default DistrictExplorerPage;
