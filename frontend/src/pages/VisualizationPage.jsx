import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/Common/Card';
import { LoadingState } from '../components/Common/LoadingState';
import { ErrorState } from '../components/Common/ErrorState';
import { getDistrictForecast } from '../services/api';
import { exportDistrictForecastCSV } from '../utils/exportUtils';
import { 
  RefreshCw, 
  Thermometer, 
  CloudRain, 
  Calendar, 
  MapPin, 
  Download, 
  Wind, 
  Droplets, 
  Sun
} from 'lucide-react';
import { 
  ComposedChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Area, 
  Legend 
} from 'recharts';

export const VisualizationPage = ({ 
  districts = [], 
  activeDistrict, 
  setActiveDistrict, 
  onRefresh 
}) => {
  const [selectedDistrictId, setSelectedDistrictId] = useState(activeDistrict?.id || (districts[0]?.id ?? 'raipur'));
  const [forecastData, setForecastData] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const district = districts.find(d => d.id === selectedDistrictId) || districts[0] || { id: 'raipur', name: 'Raipur' };

  const fetchForecast = useCallback(async () => {
    if (!district.id) return;
    setLoading(true);
    setError(null);

    const res = await getDistrictForecast(district.id, 7);
    if (res.success && res.data?.forecast) {
      setForecastData(res.data.forecast);
      setSummaryData(res.data.summary);
    } else {
      setError(res.error || 'Unable to load 7-day forecast.');
    }
    setLoading(false);
  }, [district.id]);

  useEffect(() => {
    fetchForecast();
  }, [fetchForecast]);

  const handleDistrictChange = (e) => {
    const id = e.target.value;
    setSelectedDistrictId(id);
    const found = districts.find(d => d.id === id);
    if (found && setActiveDistrict) {
      setActiveDistrict(found);
    }
  };

  const handleExportCSV = () => {
    exportDistrictForecastCSV(district, forecastData);
  };

  const currentDay = forecastData[0] || {};
  const avgTemp = summaryData?.avg_temperature_c ?? (forecastData.length > 0 ? +(forecastData.reduce((acc, d) => acc + d.temperature_c, 0) / forecastData.length).toFixed(1) : '--');
  const totalRain = summaryData?.total_rainfall_mm ?? (forecastData.length > 0 ? +(forecastData.reduce((acc, d) => acc + d.rainfall_mm, 0)).toFixed(1) : '--');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            7-Day Weather Forecast
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Expected temperature, precipitation, and humidity trends for {district.name}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            disabled={forecastData.length === 0}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={fetchForecast}
            disabled={loading}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* District Selector & Summary Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-medium">Forecast District:</label>
            <select
              value={selectedDistrictId}
              onChange={handleDistrictChange}
              className="bg-slate-950 text-slate-100 font-bold text-xs p-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-2">
            <span className="text-xl">{currentDay.condition?.icon || '⛅'}</span>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Condition</span>
              <span className="font-bold text-cyan-300">{currentDay.condition?.label || 'Clear Sky'}</span>
            </div>
          </div>

          <div className="px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Weekly Avg Temp</span>
            <span className="font-bold text-amber-400">{avgTemp} °C</span>
          </div>

          <div className="px-3 py-1.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-medium">Total 7-Day Rain</span>
            <span className="font-bold text-cyan-300">{totalRain} mm</span>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingState message={`Fetching 7-day weather forecast for ${district.name}...`} />
      ) : error ? (
        <ErrorState title="Unable to Load Forecast" message={error} onRetry={fetchForecast} />
      ) : (
        <>
          {/* 4 Measurement Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                <span>Today's Temperature</span>
                <Thermometer className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-amber-400">{currentDay.temperature_c ?? '--'} °C</div>
              <div className="text-[11px] text-slate-400">Min: {currentDay.temp_min ?? '--'}°C • Max: {currentDay.temp_max ?? '--'}°C</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                <span>Expected Rain</span>
                <CloudRain className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-cyan-300">{currentDay.rainfall_mm ?? '--'} mm</div>
              <div className="text-[11px] text-slate-400">
                {currentDay.rainfall_mm > 5 ? 'Moderate to Heavy Rainfall' : (currentDay.rainfall_mm > 0 ? 'Light Showers' : 'Dry Day')}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                <span>Humidity</span>
                <Droplets className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400">{currentDay.humidity ?? '--'} %</div>
              <div className="text-[11px] text-slate-400">Feels like: {currentDay.heat_index ?? '--'}°C</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-xs font-medium flex items-center justify-between">
                <span>Wind Speed</span>
                <Wind className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-blue-400">{currentDay.wind_speed_kmh ?? '--'} km/h</div>
              <div className="text-[11px] text-slate-400">UV Index: {currentDay.uv_index ?? '--'}/10</div>
            </div>
          </div>

          {/* Forecast Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title={`7-Day Temperature Trend (°C) — ${district.name}`} icon={Thermometer}>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day_label" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#f59e0b', borderRadius: '8px', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="temperature_c" name="Expected Temp (°C)" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#tempGradient)" />
                    <Line type="monotone" dataKey="temp_max" name="High (°C)" stroke="#ef4444" strokeDasharray="3 3" dot={false} />
                    <Line type="monotone" dataKey="temp_min" name="Low (°C)" stroke="#38bdf8" strokeDasharray="3 3" dot={false} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title={`7-Day Expected Rainfall (mm) — ${district.name}`} icon={CloudRain}>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day_label" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#38bdf8', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="rainfall_mm" name="Rainfall (mm)" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* 7-Day Table Breakdown */}
          <Card title={`Daily Breakdown — ${district.name}`} icon={Calendar}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold">
                    <th className="pb-2.5">Day</th>
                    <th className="pb-2.5">Weather</th>
                    <th className="pb-2.5">Temperature</th>
                    <th className="pb-2.5">Min / Max</th>
                    <th className="pb-2.5">Rainfall</th>
                    <th className="pb-2.5">Humidity</th>
                    <th className="pb-2.5">Feels Like</th>
                    <th className="pb-2.5">Wind</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {forecastData.map((d) => (
                    <tr key={d.day} className="hover:bg-slate-800/40">
                      <td className="py-2.5 font-bold text-cyan-400">{d.day_label || `Day ${d.day}`}</td>
                      <td className="py-2.5 font-medium text-slate-100 flex items-center gap-1.5">
                        <span className="text-base" role="img" aria-label={d.condition?.ariaLabel}>{d.condition?.icon || '⛅'}</span>
                        <span>{d.condition?.label || 'Clear Sky'}</span>
                      </td>
                      <td className="py-2.5 font-bold text-amber-400">{d.temperature_c} °C</td>
                      <td className="py-2.5 text-slate-400">{d.temp_min}°C – {d.temp_max}°C</td>
                      <td className="py-2.5 font-bold text-cyan-300">{d.rainfall_mm} mm</td>
                      <td className="py-2.5">{d.humidity}%</td>
                      <td className="py-2.5 text-orange-300 font-medium">{d.heat_index} °C</td>
                      <td className="py-2.5 text-slate-400">{d.wind_speed_kmh} km/h</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default VisualizationPage;
