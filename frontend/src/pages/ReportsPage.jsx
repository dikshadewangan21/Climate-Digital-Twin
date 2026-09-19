import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/Common/Card';
import { LoadingState } from '../components/Common/LoadingState';
import { ErrorState } from '../components/Common/ErrorState';
import { getDistrictReport } from '../services/api';
import { exportDistrictForecastCSV } from '../utils/exportUtils';
import { 
  FileText, 
  Download, 
  Printer, 
  MapPin, 
  Calendar, 
  Thermometer, 
  CloudRain, 
  CheckCircle2, 
  Sparkles, 
  ShieldAlert, 
  Layers,
  Sprout,
  HeartPulse,
  Droplets,
  Zap,
  RefreshCw
} from 'lucide-react';

export const ReportsPage = ({ districts = [], activeDistrict, setActiveDistrict }) => {
  const [selectedDistrictId, setSelectedDistrictId] = useState(activeDistrict?.id || (districts[0]?.id ?? 'raipur'));
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeDistrict?.id) {
      setSelectedDistrictId(activeDistrict.id);
    }
  }, [activeDistrict]);

  const fetchReport = useCallback(async () => {
    if (!selectedDistrictId) return;
    setLoading(true);
    setError(null);

    const res = await getDistrictReport(selectedDistrictId);
    if (res.success && res.data) {
      setReportData(res.data);
    } else {
      setError(res.error || 'Failed to generate district climate decision brief');
    }
    setLoading(false);
  }, [selectedDistrictId]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const district = reportData?.district || districts.find(d => d.id === selectedDistrictId) || { name: 'District' };
  const metrics = reportData?.metrics || {};
  const impacts = reportData?.sector_advisories || {};
  const forecast = reportData?.forecast_table || [];

  const handleDistrictChange = (e) => {
    const id = e.target.value;
    setSelectedDistrictId(id);
    const found = districts.find(d => d.id === id);
    if (found && setActiveDistrict) {
      setActiveDistrict(found);
    }
  };

  const handleDownloadCSV = () => {
    exportDistrictForecastCSV(district, forecast);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Controls */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>WEATHER REPORTS</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-100 font-heading">
            District Weather Reports
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Download or print official weather summaries, 7-day outlooks, and sector advisories for any district.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleDownloadCSV}
            disabled={!reportData}
            className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={handlePrint}
            disabled={!reportData}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Printer className="w-4 h-4 text-cyan-400" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Target District Selector & Summary Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-400 block">Select District</label>
            <select
              value={selectedDistrictId}
              onChange={handleDistrictChange}
              className="bg-slate-950 text-slate-100 font-bold text-sm p-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.role || 'District'})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-300">
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block font-medium">7-Day Mean Temp</span>
            <span className="font-bold text-amber-400 text-sm font-mono">{metrics.avg_temperature_c ?? '--'} °C</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block font-medium">Total 7-Day Rain</span>
            <span className="font-bold text-cyan-300 text-sm font-mono">{metrics.total_rainfall_mm ?? '--'} mm</span>
          </div>
          <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-400 text-[10px] block font-medium">Crop Condition</span>
            <span className="font-bold text-emerald-400 text-sm">{metrics.crop_health_status ?? '--'}</span>
          </div>
        </div>
      </div>

      {loading && !reportData ? (
        <LoadingState message={`Generating weather report for ${district.name}...`} />
      ) : error ? (
        <ErrorState title="Failed to Load Weather Report" message={error} onRetry={fetchReport} />
      ) : (
        /* Official Decision Brief Document */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl text-slate-100">
          {/* Document Header */}
          <div className="border-b border-slate-800 pb-4 flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block font-sans">
                DISTRICT WEATHER SUMMARY REPORT
              </span>
              <h2 className="text-2xl font-black font-heading text-slate-100 mt-1">
                {district.name ? district.name.toUpperCase() : 'DISTRICT'}
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Region: Chhattisgarh • Coordinates: {district.lat}° N, {district.lon}° E • Admin: {district.role || 'District Unit'}
              </p>
            </div>

            <div className="text-right text-xs text-slate-400">
              <div>Report Date: {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</div>
              <div className="text-emerald-400 font-bold">Verified IMD Weather Data</div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-sans">
              <Sparkles className="w-3.5 h-3.5" /> 1. Weather Summary
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              {reportData?.executive_summary || 'Generating summary overview...'}
            </p>
          </div>

          {/* Section 2: Sector Advisories */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-sans">
              <Layers className="w-3.5 h-3.5" /> 2. Sector Advisories & Impact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block flex items-center gap-1">
                  <Sprout className="w-3.5 h-3.5 text-emerald-400" /> Farming & Crops
                </span>
                <div className="font-bold text-slate-100">{impacts.agriculture?.status}</div>
                <p className="text-[11px] text-slate-400 font-sans leading-snug">{impacts.agriculture?.note}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-amber-400" /> Public Health
                </span>
                <div className="font-bold text-amber-400 font-mono">{impacts.health?.heat_index_c}°C Heat Index</div>
                <p className="text-[11px] text-slate-400 font-sans leading-snug">{impacts.health?.category}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Water Storage
                </span>
                <div className="font-bold text-cyan-300 font-mono">{impacts.hydrology?.soil_moisture_pct}% Saturation</div>
                <p className="text-[11px] text-slate-400 font-sans leading-snug">{impacts.hydrology?.reservoir_status}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-orange-400" /> Power Grid Load
                </span>
                <div className="font-bold text-orange-400 font-mono">+{impacts.energy?.grid_surge_pct}% Surge</div>
                <p className="text-[11px] text-slate-400 font-sans leading-snug">Cooling demand estimate</p>
              </div>
            </div>
          </div>

          {/* Section 3: 7-Day Daily Forecast Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-sans">
              <Calendar className="w-3.5 h-3.5" /> 3. 7-Day Daily Forecast
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="pb-2">Day</th>
                    <th className="pb-2">Weather Condition</th>
                    <th className="pb-2 font-mono">Expected Temp</th>
                    <th className="pb-2 font-mono">Min – Max</th>
                    <th className="pb-2 font-mono">Rainfall</th>
                    <th className="pb-2 font-mono">Heat Index</th>
                    <th className="pb-2 font-mono">Humidity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {forecast.map((d) => (
                    <tr key={d.day} className="hover:bg-slate-950/60">
                      <td className="py-2.5 font-bold text-cyan-400">{d.day_label || `Day ${d.day}`}</td>
                      <td className="py-2.5 font-semibold text-slate-100 flex items-center gap-1.5">
                        <span>{d.condition?.icon || '⛅'}</span>
                        <span>{d.condition?.label || 'Clear Sky'}</span>
                      </td>
                      <td className="py-2.5 font-bold text-amber-400 font-mono">{d.temperature_c} °C</td>
                      <td className="py-2.5 text-slate-400 font-mono">{d.temp_min}°C – {d.temp_max}°C</td>
                      <td className="py-2.5 font-bold text-cyan-300 font-mono">{d.rainfall_mm} mm</td>
                      <td className="py-2.5 text-orange-300 font-mono font-bold">{d.heat_index} °C</td>
                      <td className="py-2.5 text-slate-300 font-mono">{d.humidity}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Document Footer */}
          <div className="border-t border-slate-800 pt-4 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-sans">
            <div>Chhattisgarh Climate Dashboard — Weather Decision Support System</div>
            <div>Weather Data from India Meteorological Department (IMD)</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
