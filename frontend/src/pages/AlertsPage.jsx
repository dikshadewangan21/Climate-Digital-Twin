import React, { useState, useEffect, useCallback } from 'react';
import { LoadingState } from '../components/Common/LoadingState';
import { ErrorState } from '../components/Common/ErrorState';
import { getAlerts } from '../services/api';
import { 
  AlertTriangle, 
  Flame, 
  CloudRain, 
  Droplets, 
  Filter, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  Bell, 
  MapPin, 
  RefreshCw 
} from 'lucide-react';

export const AlertsPage = ({ districts = [], setActiveDistrict, setActiveTab }) => {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [alertsData, setAlertsData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getAlerts();
    if (res.success && res.data) {
      setAlertsData(res.data.alerts || []);
      setSummaryData(res.data.summary || null);
    } else {
      setError(res.error || 'Failed to load hazard alerts.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const totalDistricts = summaryData?.total_monitored ?? alertsData.length;
  const districtsWithAlerts = summaryData?.districts_with_alerts ?? alertsData.filter(d => d.has_alerts).length;
  const heatwaveCount = summaryData?.heatwave_count ?? alertsData.filter(d => d.alerts?.some(a => a.type === 'heatwave')).length;
  const floodCount = summaryData?.heavy_rain_count ?? alertsData.filter(d => d.alerts?.some(a => a.type === 'flood')).length;
  const droughtCount = summaryData?.drought_count ?? alertsData.filter(d => d.alerts?.some(a => a.type === 'drought')).length;

  const filteredData = alertsData.filter((item) => {
    const distName = item.district?.name || '';
    const matchesSearch = distName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterType === 'warnings_only') return item.has_alerts;
    if (filterType === 'heatwave') return item.alerts?.some(a => a.type === 'heatwave');
    if (filterType === 'flood') return item.alerts?.some(a => a.type === 'flood');
    if (filterType === 'drought') return item.alerts?.some(a => a.type === 'drought');
    return true;
  });

  const handleSelectDistrict = (district) => {
    const fullDist = districts.find(d => d.id === district.id) || district;
    if (setActiveDistrict) setActiveDistrict(fullDist);
    if (setActiveTab) setActiveTab('digital-twin');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Hazard & Safety Alerts
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time hazard detection for extreme heat, heavy rainfall, and dry conditions across Chhattisgarh.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs">
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Active Alerts:</span>
            <span className="text-rose-400 font-bold">{districtsWithAlerts}</span>
            <span className="text-slate-500">/ {totalDistricts}</span>
          </div>

          <button
            onClick={fetchAlerts}
            disabled={loading}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh alerts"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Checking hazard thresholds across 33 districts..." />
      ) : error ? (
        <ErrorState title="Unable to Load Alerts" message={error} onRetry={fetchAlerts} />
      ) : (
        <>
          {/* 4 Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 font-medium">
                <span>Districts Monitored</span>
                <MapPin className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white">{totalDistricts} Districts</div>
              <div className="text-[11px] text-emerald-400">Statewide Coverage</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 font-medium">
                <span>Heatwave Advisories</span>
                <Flame className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-amber-400">{heatwaveCount}</div>
              <div className="text-[11px] text-slate-400">Temp &ge; 38°C or Heat Index &ge; 42°C</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 font-medium">
                <span>Heavy Rain / Flood Warnings</span>
                <CloudRain className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-cyan-300">{floodCount}</div>
              <div className="text-[11px] text-slate-400">Precipitation &ge; 15 mm</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 font-medium">
                <span>Soil Moisture Deficit</span>
                <Droplets className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-orange-400">{droughtCount}</div>
              <div className="text-[11px] text-slate-400">Dry soil condition alert</div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mr-2">
                <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filter:
              </span>
              {[
                { id: 'all', label: 'All Districts' },
                { id: 'warnings_only', label: 'Active Alerts Only' },
                { id: 'heatwave', label: 'Heatwaves' },
                { id: 'flood', label: 'Heavy Rain' },
                { id: 'drought', label: 'Soil Drought' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filterType === f.id
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 text-slate-100 text-xs rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>
          </div>

          {/* District Alert Cards Grid */}
          {filteredData.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="font-bold text-slate-200">No matching district alerts</div>
              <div>Try changing your filter or search term.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.map((item) => {
                const { district, temperature_c, rainfall_mm, heat_index_c, overall_risk, alerts = [], has_alerts } = item;

                return (
                  <div
                    key={district?.id}
                    className={`rounded-2xl p-4.5 border transition-all flex flex-col justify-between space-y-3 ${
                      has_alerts
                        ? 'bg-slate-900/90 border-slate-800 hover:border-amber-500/40 shadow-lg'
                        : 'bg-slate-900/50 border-slate-800/60 opacity-85 hover:opacity-100'
                    }`}
                  >
                    <div>
                      {/* District Header */}
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-cyan-400" />
                            {district?.name}
                          </h3>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          overall_risk === 'High' ? 'bg-rose-950 text-rose-300 border-rose-500/40' :
                          overall_risk === 'Moderate' ? 'bg-amber-950 text-amber-300 border-amber-500/40' :
                          'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {overall_risk} Risk
                        </span>
                      </div>

                      {/* Weather Snapshot */}
                      <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 text-xs">
                        <div className="p-2 rounded-lg bg-slate-950 text-center">
                          <span className="text-[10px] text-slate-400 block font-medium">Temp</span>
                          <span className="font-bold text-amber-400">{temperature_c}°C</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-950 text-center">
                          <span className="text-[10px] text-slate-400 block font-medium">Rainfall</span>
                          <span className="font-bold text-cyan-300">{rainfall_mm} mm</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-950 text-center">
                          <span className="text-[10px] text-slate-400 block font-medium">Feels Like</span>
                          <span className="font-bold text-orange-400">{heat_index_c}°C</span>
                        </div>
                      </div>

                      {/* Warnings List */}
                      <div className="space-y-2 mt-3">
                        {alerts.length > 0 ? (
                          alerts.map((a, idx) => (
                            <div
                              key={idx}
                              className={`p-2.5 rounded-xl border text-xs space-y-1 ${a.badge_color || 'bg-amber-950 text-amber-300 border-amber-500/40'}`}
                            >
                              <div className="font-bold flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                  {a.title}
                                </span>
                                <span className="text-[9px] uppercase font-bold px-1 rounded bg-black/20">{a.level}</span>
                              </div>
                              <p className="text-[11px] leading-snug text-slate-200">{a.message}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Normal weather. No active safety warnings.</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleSelectDistrict(district)}
                      className="w-full mt-2 py-2 px-3 bg-slate-950 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-xs rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Inspect on Map</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AlertsPage;
