import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/Common/Card';
import { LoadingState } from '../components/Common/LoadingState';
import { ErrorState } from '../components/Common/ErrorState';
import { runScenarioSimulation } from '../services/api';
import { 
  Sliders, 
  Thermometer, 
  CloudRain, 
  ArrowRight, 
  Zap, 
  Droplets, 
  RotateCcw,
  MapPin,
  Sprout,
  HeartPulse
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

export const ScenarioAnalysisPage = ({ districts = [], activeDistrict, setActiveDistrict }) => {
  const currentDistrict = activeDistrict || districts[0] || { id: 'raipur', name: 'Raipur' };

  // Sliders state
  const [tempDelta, setTempDelta] = useState(2.0);
  const [rainDelta, setRainDelta] = useState(-20);

  // Backend simulation state
  const [simulationData, setSimulationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSimulation = useCallback(async () => {
    if (!currentDistrict.id) return;
    setLoading(true);
    setError(null);

    const res = await runScenarioSimulation(currentDistrict.id, tempDelta, rainDelta);
    if (res.success && res.data) {
      setSimulationData(res.data);
    } else {
      setError(res.error || 'Failed to calculate scenario simulation.');
    }
    setLoading(false);
  }, [currentDistrict.id, tempDelta, rainDelta]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSimulation();
    }, 150);
    return () => clearTimeout(timer);
  }, [fetchSimulation]);

  const applyPreset = (t, r) => {
    setTempDelta(t);
    setRainDelta(r);
  };

  const handleDistrictChange = (e) => {
    const found = districts.find(d => d.id === e.target.value);
    if (found && setActiveDistrict) {
      setActiveDistrict(found);
    }
  };

  const base = simulationData?.baseline || {};
  const scen = simulationData?.scenario || {};
  const scenImpacts = scen.sector_impacts || {};
  const comparisonData = simulationData?.comparison || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            What-If Climate Simulator
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Test how changes in temperature and rainfall impact farming, public health, water storage, and power demand.
          </p>
        </div>

        <button
          onClick={() => applyPreset(0, 0)}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Reset Sliders</span>
        </button>
      </div>

      {/* Target District & Presets */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-medium">District:</label>
            <select
              value={currentDistrict.id}
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

        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 text-[11px] font-medium mr-1">Quick Presets:</span>
          {[
            { label: 'Severe Heatwave (+3.5°C, -30% Rain)', t: 3.5, r: -30 },
            { label: 'Monsoon Deficit (+2°C, -45% Rain)', t: 2.0, r: -45 },
            { label: 'Heavy Cloudburst (-1°C, +50% Rain)', t: -1.0, r: 50 },
          ].map((p, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(p.t, p.r)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs font-medium"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders and Outcome Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Sliders Panel */}
        <div className="lg:col-span-7">
          <Card title="Adjust Weather Conditions" icon={Sliders}>
            <div className="space-y-6 pt-1">
              
              {/* Temperature Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Thermometer className="w-4 h-4 text-amber-400" />
                    Temperature Adjustment (°C)
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                    tempDelta > 0 ? 'bg-amber-950 text-amber-300 border border-amber-500/30' : 'bg-blue-950 text-blue-300 border border-blue-500/30'
                  }`}>
                    {tempDelta > 0 ? `+${tempDelta}°C (Warming)` : `${tempDelta}°C (Cooling)`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-5.0"
                  max="5.0"
                  step="0.5"
                  value={tempDelta}
                  onChange={(e) => setTempDelta(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>-5°C Cooler</span>
                  <span>0°C (Current)</span>
                  <span>+5°C Warmer</span>
                </div>
              </div>

              {/* Rainfall Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <CloudRain className="w-4 h-4 text-cyan-400" />
                    Rainfall Adjustment (%)
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                    rainDelta >= 0 ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' : 'bg-rose-950 text-rose-300 border border-rose-500/30'
                  }`}>
                    {rainDelta > 0 ? `+${rainDelta}% (More Rain)` : `${rainDelta}% (Drought)`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  step="5"
                  value={rainDelta}
                  onChange={(e) => setRainDelta(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>-50% (Severe Drought)</span>
                  <span>0% (Normal Rain)</span>
                  <span>+50% (Excess Rain)</span>
                </div>
              </div>

            </div>
          </Card>
        </div>

        {/* State Snapshot Cards */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Baseline</span>
            <div className="text-3xl my-1">{base.condition?.icon || '⛅'}</div>
            <div className="text-xs font-bold text-slate-200">{base.condition?.label || 'Baseline'}</div>
            <div className="pt-1 text-left space-y-1 text-xs">
              <div className="flex justify-between p-2 rounded bg-slate-950">
                <span className="text-slate-400">Temp:</span>
                <span className="font-bold text-amber-400">{base.temperature_c ?? '--'} °C</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950">
                <span className="text-slate-400">Rain:</span>
                <span className="font-bold text-cyan-300">{base.rainfall_mm ?? '--'} mm</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2 text-center">
            <span className="text-[10px] uppercase font-bold text-cyan-400 block">Simulated Outcome</span>
            <div className="text-3xl my-1">{scen.condition?.icon || '⛅'}</div>
            <div className="text-xs font-bold text-cyan-300">{scen.condition?.label || 'Simulated'}</div>
            <div className="pt-1 text-left space-y-1 text-xs">
              <div className="flex justify-between p-2 rounded bg-slate-950">
                <span className="text-slate-400">New Temp:</span>
                <span className="font-bold text-amber-400">{scen.temperature_c ?? '--'} °C</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-950">
                <span className="text-slate-400">New Rain:</span>
                <span className="font-bold text-cyan-300">{scen.rainfall_mm ?? '--'} mm</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {loading && !simulationData ? (
        <LoadingState message="Calculating climate perturbation impacts..." />
      ) : error ? (
        <ErrorState title="Calculation Failed" message={error} onRetry={fetchSimulation} />
      ) : (
        <>
          {/* 4 Practical Sector Impact Cards */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Sector Impact Projections
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              
              {/* Farming Impact */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Sprout className="w-4 h-4 text-emerald-400" /> Farming & Crops
                  </span>
                  <span className={`font-bold text-xs ${(scenImpacts.agriculture?.stress_score ?? 0) > 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {scenImpacts.agriculture?.status || 'Favorable'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {scenImpacts.agriculture?.stress_score ?? 15} <span className="text-xs text-slate-400">/ 100 Stress</span>
                </div>
                <div className="text-xs text-emerald-400">
                  Sowing Suitability: <strong>{scenImpacts.agriculture?.sowing_suitability ?? 80}%</strong>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {scenImpacts.agriculture?.note || 'Normal farming conditions.'}
                </p>
              </div>

              {/* Public Health */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <HeartPulse className="w-4 h-4 text-rose-400" /> Public Health
                  </span>
                  <span className={`font-bold text-xs ${scenImpacts.health?.color || 'text-amber-400'}`}>
                    {scenImpacts.health?.score ?? 20}/100 Risk
                  </span>
                </div>
                <div className="text-2xl font-bold text-amber-400">
                  {scenImpacts.health?.heat_index_c ?? 30}°C <span className="text-xs text-slate-400">Feels Like</span>
                </div>
                <div className="text-xs text-amber-300">
                  {scenImpacts.health?.category || 'Low Risk'}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Expected thermal comfort and outdoor labor safety.
                </p>
              </div>

              {/* Water Reserves */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-cyan-400" /> Water & Dams
                  </span>
                  <span className="text-cyan-300 font-bold">Runoff: {scenImpacts.hydrology?.runoff_index ?? 'Medium'}</span>
                </div>
                <div className="text-2xl font-bold text-cyan-300">
                  {scenImpacts.hydrology?.soil_moisture_pct ?? 45}% <span className="text-xs text-slate-400">Soil Moisture</span>
                </div>
                <div className="text-xs text-cyan-400">
                  Reservoir: <strong>{scenImpacts.hydrology?.reservoir_status || 'Stable'}</strong>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Expected reservoir inflows and irrigation canal availability.
                </p>
              </div>

              {/* Power Grid */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" /> Power Grid Demand
                  </span>
                  <span className={`font-bold text-xs ${scenImpacts.energy?.peak_load_warning ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {scenImpacts.energy?.peak_load_warning ? 'High Load' : 'Normal Load'}
                  </span>
                </div>
                <div className="text-2xl font-bold text-orange-400">
                  +{scenImpacts.energy?.grid_surge_pct ?? 10}% <span className="text-xs text-slate-400">Cooling Surge</span>
                </div>
                <div className="text-xs text-slate-300">
                  Cooling Factor: <strong>{scenImpacts.energy?.cooling_degree ?? 1.1}</strong>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Estimated peak power load from air conditioning and cooling.
                </p>
              </div>

            </div>
          </div>

          {/* Side-by-Side Comparison Chart */}
          <Card title="Baseline vs Simulated Outcome Comparison" icon={BarChart}>
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Current Baseline" fill="#475569" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Simulated Scenario" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default ScenarioAnalysisPage;
