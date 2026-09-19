import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/Common/Card';
import { LoadingState } from '../components/Common/LoadingState';
import { ErrorState } from '../components/Common/ErrorState';
import { compareDistrictsApi } from '../services/api';
import { 
  MapPin, 
  Thermometer, 
  CloudRain, 
  RefreshCw 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
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
  const [district3Id, setDistrict3Id] = useState(districts[5]?.id ?? 'surguja');

  const [compareResult, setCompareResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeDistrict?.id) {
      setDistrict1Id(activeDistrict.id);
    }
  }, [activeDistrict]);

  const fetchComparison = useCallback(async () => {
    if (!district1Id || !district2Id || !district3Id) return;
    setLoading(true);
    setError(null);

    const res = await compareDistrictsApi([district1Id, district2Id, district3Id]);
    if (res.success && res.data) {
      setCompareResult(res.data);
    } else {
      setError(res.error || 'Unable to compare selected districts.');
    }
    setLoading(false);
  }, [district1Id, district2Id, district3Id]);

  useEffect(() => {
    fetchComparison();
  }, [fetchComparison]);

  const distList = compareResult?.districts || [];
  const dist1Obj = distList.find(d => d.id === district1Id || d.name?.toLowerCase() === district1Id?.toLowerCase()) || distList[0] || {};
  const dist2Obj = distList.find(d => d.id === district2Id || d.name?.toLowerCase() === district2Id?.toLowerCase()) || distList[1] || {};
  const dist3Obj = distList.find(d => d.id === district3Id || d.name?.toLowerCase() === district3Id?.toLowerCase()) || distList[2] || {};

  const dist1 = dist1Obj.id ? dist1Obj : (districts.find(d => d.id === district1Id) || { name: 'District 1' });
  const dist2 = dist2Obj.id ? dist2Obj : (districts.find(d => d.id === district2Id) || { name: 'District 2' });
  const dist3 = dist3Obj.id ? dist3Obj : (districts.find(d => d.id === district3Id) || { name: 'District 3' });

  const temp1 = dist1Obj.temperature_c ?? dist1.temperature_c ?? dist1.baseTemp ?? '--';
  const rain1 = dist1Obj.rainfall_mm ?? dist1.rainfall_mm ?? dist1.baseRain ?? '--';
  const temp2 = dist2Obj.temperature_c ?? dist2.temperature_c ?? dist2.baseTemp ?? '--';
  const rain2 = dist2Obj.rainfall_mm ?? dist2.rainfall_mm ?? dist2.baseRain ?? '--';
  const temp3 = dist3Obj.temperature_c ?? dist3.temperature_c ?? dist3.baseTemp ?? '--';
  const rain3 = dist3Obj.rainfall_mm ?? dist3.rainfall_mm ?? dist3.baseRain ?? '--';

  const impact1 = dist1Obj.sector_impacts || dist1.sector_impacts || {};
  const impact2 = dist2Obj.sector_impacts || dist2.sector_impacts || {};
  const impact3 = dist3Obj.sector_impacts || dist3.sector_impacts || {};

  const tempChartData = compareResult?.combined_charts?.temperature || compareResult?.temperature_series || [];
  const rainChartData = compareResult?.combined_charts?.rainfall || compareResult?.rainfall_series || [];

  const handleDistrict1Change = (e) => {
    const id = e.target.value;
    setDistrict1Id(id);
    const found = districts.find(d => d.id === id);
    if (found && setActiveDistrict) {
      setActiveDistrict(found);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Compare Districts
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Compare weather conditions, temperature patterns, and rainfall side-by-side across any 3 districts.
          </p>
        </div>

        <button
          onClick={fetchComparison}
          disabled={loading}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Comparing...' : 'Refresh Comparison'}</span>
        </button>
      </div>

      {/* 3 District Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* District 1 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-2">
          <label className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> District 1 (Primary)
          </label>
          <select
            value={district1Id}
            onChange={handleDistrict1Change}
            className="w-full bg-slate-950 text-slate-100 text-xs p-2 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500 cursor-pointer font-semibold"
          >
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <div className="text-xs text-slate-400 flex justify-between pt-1">
            <span>Temp: <strong className="text-amber-400">{temp1}°C</strong></span>
            <span>Rain: <strong className="text-cyan-300">{rain1} mm</strong></span>
          </div>
        </div>

        {/* District 2 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/40 space-y-2">
          <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> District 2 (Comparison)
          </label>
          <select
            value={district2Id}
            onChange={(e) => setDistrict2Id(e.target.value)}
            className="w-full bg-slate-950 text-slate-100 text-xs p-2 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer font-semibold"
          >
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <div className="text-xs text-slate-400 flex justify-between pt-1">
            <span>Temp: <strong className="text-amber-400">{temp2}°C</strong></span>
            <span>Rain: <strong className="text-cyan-300">{rain2} mm</strong></span>
          </div>
        </div>

        {/* District 3 */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/40 space-y-2">
          <label className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> District 3 (Comparison)
          </label>
          <select
            value={district3Id}
            onChange={(e) => setDistrict3Id(e.target.value)}
            className="w-full bg-slate-950 text-slate-100 text-xs p-2 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer font-semibold"
          >
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <div className="text-xs text-slate-400 flex justify-between pt-1">
            <span>Temp: <strong className="text-amber-400">{temp3}°C</strong></span>
            <span>Rain: <strong className="text-cyan-300">{rain3} mm</strong></span>
          </div>
        </div>
      </div>

      {loading && !compareResult ? (
        <LoadingState message="Comparing weather metrics across districts..." />
      ) : error ? (
        <ErrorState title="Comparison Failed" message={error} onRetry={fetchComparison} />
      ) : (
        <>
          {/* Comparative Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Temperature Comparison Line Chart */}
            <Card title="7-Day Temperature Trend Comparison (°C)" icon={Thermometer}>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={tempChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Line type="monotone" dataKey={dist1.name} stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey={dist2.name} stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey={dist3.name} stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Rainfall Comparison Bar Chart */}
            <Card title="7-Day Expected Rainfall Comparison (mm)" icon={CloudRain}>
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rainChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey={dist1.name} fill="#38bdf8" radius={[3, 3, 0, 0]} />
                    <Bar dataKey={dist2.name} fill="#f59e0b" radius={[3, 3, 0, 0]} />
                    <Bar dataKey={dist3.name} fill="#10b981" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Metric Comparison Table */}
          <Card title="Detailed Metric Comparison" icon={Thermometer}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold">
                    <th className="pb-2.5">Weather Metric</th>
                    <th className="pb-2.5 text-cyan-400 font-bold">{dist1.name} (Selected)</th>
                    <th className="pb-2.5 text-amber-400 font-bold">{dist2.name}</th>
                    <th className="pb-2.5 text-emerald-400 font-bold">{dist3.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2.5 font-medium text-white">Current Temperature</td>
                    <td className="py-2.5 font-bold text-amber-400">{temp1}°C</td>
                    <td className="py-2.5 font-bold text-amber-400">{temp2}°C</td>
                    <td className="py-2.5 font-bold text-amber-400">{temp3}°C</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2.5 font-medium text-white">Expected Rainfall</td>
                    <td className="py-2.5 font-bold text-cyan-300">{rain1} mm</td>
                    <td className="py-2.5 font-bold text-cyan-300">{rain2} mm</td>
                    <td className="py-2.5 font-bold text-cyan-300">{rain3} mm</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2.5 font-medium text-white">Feels Like (Heat Index)</td>
                    <td className="py-2.5">{impact1.health?.heat_index_c ?? impact1.health?.heat_index ?? '--'}°C</td>
                    <td className="py-2.5">{impact2.health?.heat_index_c ?? impact2.health?.heat_index ?? '--'}°C</td>
                    <td className="py-2.5">{impact3.health?.heat_index_c ?? impact3.health?.heat_index ?? '--'}°C</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2.5 font-medium text-white">Farming & Crop Condition</td>
                    <td className="py-2.5 text-emerald-400 font-medium">{impact1.agriculture?.status ?? 'Favorable'}</td>
                    <td className="py-2.5 text-emerald-400 font-medium">{impact2.agriculture?.status ?? 'Favorable'}</td>
                    <td className="py-2.5 text-emerald-400 font-medium">{impact3.agriculture?.status ?? 'Favorable'}</td>
                  </tr>
                  <tr className="hover:bg-slate-800/40">
                    <td className="py-2.5 font-medium text-white">Soil Moisture Saturation</td>
                    <td className="py-2.5">{impact1.hydrology?.soil_moisture_pct ?? '--'}%</td>
                    <td className="py-2.5">{impact2.hydrology?.soil_moisture_pct ?? '--'}%</td>
                    <td className="py-2.5">{impact3.hydrology?.soil_moisture_pct ?? '--'}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default ComparePage;
