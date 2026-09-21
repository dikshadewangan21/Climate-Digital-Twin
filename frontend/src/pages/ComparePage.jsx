import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/Common/Card';
import { LoadingState } from '../components/Common/LoadingState';
import { ErrorState } from '../components/Common/ErrorState';
import { compareDistrictsApi } from '../services/api';
import { 
  Columns2, 
  MapPin, 
  Thermometer, 
  CloudRain, 
  Wind, 
  Droplets, 
  RefreshCw,
  TrendingUp,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

export const ComparePage = ({ districts = [], activeDistrict, setActiveDistrict }) => {
  const [district1Id, setDistrict1Id] = useState(activeDistrict?.id || (districts[0]?.id ?? 'raipur'));
  const [district2Id, setDistrict2Id] = useState(districts[4]?.id ?? 'bastar');

  const [compareResult, setCompareResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeDistrict?.id) {
      setDistrict1Id(activeDistrict.id);
    }
  }, [activeDistrict]);

  const fetchComparison = useCallback(async () => {
    if (!district1Id || !district2Id) return;
    setLoading(true);
    setError(null);

    const res = await compareDistrictsApi([district1Id, district2Id]);
    if (res.success && res.data) {
      setCompareResult(res.data);
    } else {
      setError(res.error || 'Unable to compare selected districts.');
    }
    setLoading(false);
  }, [district1Id, district2Id]);

  useEffect(() => {
    fetchComparison();
  }, [fetchComparison]);

  const distList = compareResult?.districts || [];
  const dist1 = distList.find(d => d.id === district1Id || d.name?.toLowerCase() === district1Id?.toLowerCase()) || distList[0] || {};
  const dist2 = distList.find(d => d.id === district2Id || d.name?.toLowerCase() === district2Id?.toLowerCase()) || distList[1] || {};

  const barData = [
    {
      metric: 'Temperature (°C)',
      [dist1.name || 'District 1']: dist1.temperature_c ?? 0,
      [dist2.name || 'District 2']: dist2.temperature_c ?? 0,
    },
    {
      metric: 'Precipitation (mm)',
      [dist1.name || 'District 1']: dist1.rainfall_mm ?? 0,
      [dist2.name || 'District 2']: dist2.rainfall_mm ?? 0,
    },
    {
      metric: 'Humidity (%)',
      [dist1.name || 'District 1']: dist1.humidity ?? 0,
      [dist2.name || 'District 2']: dist2.humidity ?? 0,
    },
    {
      metric: 'Wind Speed (km/h)',
      [dist1.name || 'District 1']: dist1.wind_speed_kmh ?? 0,
      [dist2.name || 'District 2']: dist2.wind_speed_kmh ?? 0,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* Header & District Selectors */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-2">
              <Columns2 className="w-3.5 h-3.5" />
              <span>DISTRICT COMPARISON</span>
            </div>
            <h1 className="text-2xl font-black text-white font-heading tracking-tight">
              Side-by-Side District Comparison
            </h1>
            <p className="text-xs text-slate-400">
              Compare current weather conditions between two Chhattisgarh districts.
            </p>
          </div>

          <button
            onClick={fetchComparison}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Refresh comparison"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Dual District Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-cyan-500/30 space-y-1">
            <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">District A (Primary)</span>
            <select
              value={district1Id}
              onChange={(e) => setDistrict1Id(e.target.value)}
              className="w-full bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer"
            >
              {districts.map(d => (
                <option key={d.id || d.name} value={d.id} className="bg-slate-900 text-white">
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-blue-500/30 space-y-1">
            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">District B (Comparison)</span>
            <select
              value={district2Id}
              onChange={(e) => setDistrict2Id(e.target.value)}
              className="w-full bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer"
            >
              {districts.map(d => (
                <option key={d.id || d.name} value={d.id} className="bg-slate-900 text-white">
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Comparing district weather..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchComparison} />
      ) : (
        <div className="space-y-6">
          
          {/* Side-by-Side Detail Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* District 1 Card */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">District A</span>
                  <h2 className="text-xl font-black text-white font-heading">{dist1.name || district1Id}</h2>
                </div>
                <span className="text-2xl">{dist1.condition?.icon || '☀️'}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Temperature</div>
                  <div className="text-xl font-black text-white font-heading mt-0.5">
                    {dist1.temperature_c !== undefined && dist1.temperature_c !== null ? `${dist1.temperature_c}°C` : 'Data unavailable'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Precipitation</div>
                  <div className="text-xl font-black text-blue-400 font-heading mt-0.5">
                    {dist1.rainfall_mm !== undefined && dist1.rainfall_mm !== null ? `${dist1.rainfall_mm} mm` : 'Data unavailable'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Humidity</div>
                  <div className="text-xl font-black text-cyan-300 font-heading mt-0.5">
                    {dist1.humidity !== undefined && dist1.humidity !== null ? `${dist1.humidity}%` : 'Data unavailable'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Wind Speed</div>
                  <div className="text-xl font-black text-slate-200 font-heading mt-0.5">
                    {dist1.wind_speed_kmh !== undefined && dist1.wind_speed_kmh !== null ? `${dist1.wind_speed_kmh} km/h` : 'Data unavailable'}
                  </div>
                </div>
              </div>
            </div>

            {/* District 2 Card */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-blue-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">District B</span>
                  <h2 className="text-xl font-black text-white font-heading">{dist2.name || district2Id}</h2>
                </div>
                <span className="text-2xl">{dist2.condition?.icon || '🌤️'}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Temperature</div>
                  <div className="text-xl font-black text-white font-heading mt-0.5">
                    {dist2.temperature_c !== undefined && dist2.temperature_c !== null ? `${dist2.temperature_c}°C` : 'Data unavailable'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Precipitation</div>
                  <div className="text-xl font-black text-blue-400 font-heading mt-0.5">
                    {dist2.rainfall_mm !== undefined && dist2.rainfall_mm !== null ? `${dist2.rainfall_mm} mm` : 'Data unavailable'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Humidity</div>
                  <div className="text-xl font-black text-cyan-300 font-heading mt-0.5">
                    {dist2.humidity !== undefined && dist2.humidity !== null ? `${dist2.humidity}%` : 'Data unavailable'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Wind Speed</div>
                  <div className="text-xl font-black text-slate-200 font-heading mt-0.5">
                    {dist2.wind_speed_kmh !== undefined && dist2.wind_speed_kmh !== null ? `${dist2.wind_speed_kmh} km/h` : 'Data unavailable'}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Comparative Bar Chart */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Weather Comparison Chart</span>
            </h3>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="metric" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey={dist1.name || 'District 1'} fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey={dist2.name || 'District 2'} fill="#818cf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default ComparePage;
