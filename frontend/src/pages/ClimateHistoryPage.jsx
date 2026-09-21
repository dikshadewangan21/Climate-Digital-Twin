import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/Common/Card';
import { LoadingState } from '../components/Common/LoadingState';
import { ErrorState } from '../components/Common/ErrorState';
import { getClimateHistory, getClimateSummary } from '../services/api';
import { 
  History, 
  Calendar, 
  MapPin, 
  Thermometer, 
  CloudRain, 
  TrendingUp, 
  Layers,
  Database,
  RefreshCw,
  Droplets,
  Wind
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const ClimateHistoryPage = ({
  districts = [],
  activeDistrict,
  setActiveDistrict
}) => {
  const currentDistrict = activeDistrict || districts[0] || { id: 'raipur', name: 'Raipur' };
  
  const [years, setYears] = useState(5);
  const [historyData, setHistoryData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    if (!currentDistrict?.id) return;
    setLoading(true);
    setError(null);

    try {
      const [hRes, sRes] = await Promise.all([
        getClimateHistory(currentDistrict.id, years),
        getClimateSummary(currentDistrict.id, years)
      ]);

      if (hRes.success && hRes.data?.rows) {
        // Downsample for chart responsiveness if rows > 365
        const rows = hRes.data.rows;
        const step = Math.max(1, Math.floor(rows.length / 150));
        const sampled = rows.filter((_, i) => i % step === 0).map(r => ({
          date: r.date,
          tempMean: r.temperature_2m_mean,
          tempMax: r.temperature_2m_max,
          tempMin: r.temperature_2m_min,
          rain: r.precipitation_sum,
          humidity: r.relative_humidity_2m_mean,
          et0: r.et0_fao_evapotranspiration
        }));

        setHistoryData({ ...hRes.data, sampledRows: sampled, totalRows: rows.length });
      } else {
        setError(hRes.error || 'Unable to retrieve historical climate reanalysis.');
      }

      if (sRes.success && sRes.data?.summary) {
        setSummaryData(sRes.data.summary);
      }
    } catch (err) {
      console.error('History fetch error:', err);
      setError('Historical weather provider connection error.');
    } finally {
      setLoading(false);
    }
  }, [currentDistrict?.id, years]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* Header & Controls */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
              <Database className="w-3.5 h-3.5" />
              <span>HISTORICAL WEATHER ARCHIVE</span>
            </div>
            <h1 className="text-2xl font-black text-white font-heading tracking-tight">
              Climate History & Long-Term Trends
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Multi-year recorded climate observations for <strong className="text-slate-200">{currentDistrict.name}</strong>.
            </p>
          </div>

          {/* Years filter */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs">
            <span className="text-slate-400 pl-2 font-medium">Timespan:</span>
            {[2, 5, 10].map((y) => (
              <button
                key={y}
                onClick={() => setYears(y)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${years === y ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              >
                {y} Years
              </button>
            ))}
          </div>
        </div>

        {/* Historical Metadata Badge */}
        {historyData && (
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-800 text-xs text-slate-400 font-mono">
            <span>Period: <strong className="text-slate-200">{historyData.start_date}</strong> to <strong className="text-slate-200">{historyData.end_date}</strong></span>
            <span>•</span>
            <span>Recorded Daily Observations: <strong className="text-emerald-400">{historyData.totalRows}</strong></span>
          </div>
        )}
      </div>

      {loading ? (
        <LoadingState message={`Loading ${years}-year historical weather trends for ${currentDistrict.name}...`} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchHistory} />
      ) : (
        <div className="space-y-6">
          
          {/* Summary Stat Cards */}
          {summaryData && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Mean Temperature</span>
                <div className="text-2xl font-black text-white font-heading mt-1">
                  {summaryData.temperature_2m_mean}°C
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Multi-year average</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Annual Rainfall Avg</span>
                <div className="text-2xl font-black text-blue-400 font-heading mt-1">
                  {summaryData.annual_rainfall_average_mm} <span className="text-xs font-sans text-slate-400">mm/yr</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Cumulative year sum</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Relative Humidity</span>
                <div className="text-2xl font-black text-cyan-300 font-heading mt-1">
                  {summaryData.relative_humidity_2m_mean}%
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Mean moisture level</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Evapotranspiration</span>
                <div className="text-2xl font-black text-amber-300 font-heading mt-1">
                  {summaryData.et0_fao_evapotranspiration} <span className="text-xs font-sans text-slate-400">mm/day</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">FAO reference crop</div>
              </div>
            </div>
          )}

          {/* Chart 1: Historical Temperature Range */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-amber-400" />
              <span>Multi-Year Temperature Trend (°C)</span>
            </h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData?.sampledRows || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} unit="°" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line type="monotone" dataKey="tempMean" name="Mean Temp" stroke="#38bdf8" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="tempMax" name="Max Temp" stroke="#f43f5e" strokeWidth={1} dot={false} strokeDasharray="2 2" />
                  <Line type="monotone" dataKey="tempMin" name="Min Temp" stroke="#818cf8" strokeWidth={1} dot={false} strokeDasharray="2 2" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Historical Rainfall & Moisture */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-cyan-400" />
              <span>Historical Precipitation Events (mm)</span>
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historyData?.sampledRows || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10 }} unit="mm" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
                  <Bar dataKey="rain" name="Daily Rain (mm)" fill="#0284c7" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default ClimateHistoryPage;
