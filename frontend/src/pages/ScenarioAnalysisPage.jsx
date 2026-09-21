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
  HeartPulse,
  Sparkles,
  CheckCircle2,
  AlertTriangle
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
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchSimulation]);

  const handleReset = () => {
    setTempDelta(0);
    setRainDelta(0);
  };

  const baseline = simulationData?.baseline || {};
  const simulated = simulationData?.simulated || {};
  const interp = simulationData?.interpretation || {};

  const chartData = [
    {
      metric: 'Temperature (°C)',
      Baseline: baseline.temperature_c !== undefined ? baseline.temperature_c : null,
      Simulated: simulated.temperature_c !== undefined ? simulated.temperature_c : null,
    },
    {
      metric: 'Precipitation (mm)',
      Baseline: baseline.rainfall_mm !== undefined ? baseline.rainfall_mm : null,
      Simulated: simulated.rainfall_mm !== undefined ? simulated.rainfall_mm : null,
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
          <Sliders className="w-3.5 h-3.5" />
          <span>WHAT-IF WEATHER SIMULATOR</span>
        </div>
        <h1 className="text-2xl font-black text-white font-heading tracking-tight">
          Weather What-If Simulation — {currentDistrict.name}
        </h1>
        <p className="text-xs text-slate-400">
          Adjust temperature and rainfall sliders to test how climate shifts could impact crops, water availability, and heat comfort.
        </p>
      </div>

      {/* Sliders Control Card */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
            Scenario Inputs & Controls
          </h3>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Normal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Temperature Slider */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-rose-400" />
                <span>Temperature Change (ΔT)</span>
              </span>
              <span className={`text-base font-black font-heading ${tempDelta >= 0 ? 'text-rose-400' : 'text-blue-400'}`}>
                {tempDelta >= 0 ? `+${tempDelta}°C` : `${tempDelta}°C`}
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="10"
              step="0.5"
              value={tempDelta}
              onChange={(e) => setTempDelta(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-10°C (Much Cooler)</span>
              <span>0°C (Current)</span>
              <span>+10°C (Much Hotter)</span>
            </div>
          </div>

          {/* Rainfall Slider */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-cyan-400" />
                <span>Rainfall Change (ΔP)</span>
              </span>
              <span className={`text-base font-black font-heading ${rainDelta >= 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
                {rainDelta >= 0 ? `+${rainDelta}%` : `${rainDelta}%`}
              </span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              step="5"
              value={rainDelta}
              onChange={(e) => setRainDelta(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-100% (Severe Drought)</span>
              <span>0% (Current)</span>
              <span>+100% (Double Rainfall)</span>
            </div>
          </div>

        </div>
      </div>

      {loading ? (
        <LoadingState message="Calculating weather simulation..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchSimulation} />
      ) : (
        <div className="space-y-6">
          
          {/* Baseline vs Simulated Tri-Card Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            
            {/* Card 1: Baseline */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">1. Current Conditions</span>
              <div className="space-y-1">
                <div className="text-2xl font-black text-white font-heading">
                  {baseline.temperature_c !== undefined && baseline.temperature_c !== null ? `${baseline.temperature_c}°C` : 'Data unavailable'}
                </div>
                <div className="text-xs text-slate-400">
                  Precipitation: <strong className="text-blue-400">{baseline.rainfall_mm !== undefined && baseline.rainfall_mm !== null ? `${baseline.rainfall_mm} mm` : 'Data unavailable'}</strong>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                Source: Live recorded weather
              </div>
            </div>

            {/* Card 2: Shift Applied */}
            <div className="p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-center space-y-2">
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">2. Weather Shift Applied</span>
              <div className="text-base font-bold text-white flex items-center justify-center gap-2">
                <span>ΔT: {tempDelta >= 0 ? `+${tempDelta}` : tempDelta}°C</span>
                <span>•</span>
                <span>ΔP: {rainDelta >= 0 ? `+${rainDelta}` : rainDelta}%</span>
              </div>
              <div className="text-[10px] text-cyan-400">Simulated Weather Outcome</div>
            </div>

            {/* Card 3: Outcome */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950/60 border border-blue-500/40 space-y-3 shadow-lg">
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">3. Simulated Outcome</span>
              <div className="space-y-1">
                <div className="text-2xl font-black text-white font-heading">
                  {simulated.temperature_c !== undefined && simulated.temperature_c !== null ? `${simulated.temperature_c}°C` : 'Data unavailable'}
                </div>
                <div className="text-xs text-slate-300">
                  Precipitation: <strong className="text-blue-300">{simulated.rainfall_mm !== undefined && simulated.rainfall_mm !== null ? `${simulated.rainfall_mm} mm` : 'Data unavailable'}</strong>
                </div>
              </div>
              <div className="text-[10px] text-emerald-400 pt-1 border-t border-blue-500/20 font-medium">
                Condition: {interp.temperature_condition || 'Normal'} & {interp.rainfall_condition || 'Dry'}
              </div>
            </div>

          </div>

          {/* Bar Chart Comparison */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Current vs Simulated Comparison</span>
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="metric" stroke="#64748b" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="Baseline" fill="#64748b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Simulated" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default ScenarioAnalysisPage;
