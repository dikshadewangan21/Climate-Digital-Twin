import React, { useState, useEffect, useCallback, useRef } from 'react';
import { runScenarioSimulation } from '../services/api';
import { 
  Sliders, 
  Thermometer, 
  CloudRain, 
  Zap, 
  Droplets, 
  RotateCcw,
  Sprout,
  HeartPulse,
  ChevronDown,
  Sparkles,
  Info
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
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  const fetchSimulation = useCallback(async (tVal, rVal, distId) => {
    if (!distId) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    try {
      const res = await runScenarioSimulation(distId, tVal, rVal);
      if (res.success && res.data) {
        setSimulationData(res.data);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced trigger on slider / district changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSimulation(tempDelta, rainDelta, currentDistrict.id);
    }, 120);

    return () => clearTimeout(timer);
  }, [tempDelta, rainDelta, currentDistrict.id, fetchSimulation]);

  const handleReset = () => {
    setTempDelta(0);
    setRainDelta(0);
  };

  // Base values from backend or district profile
  const baseT = Number(
    simulationData?.baseline?.temperature_c ?? 
    currentDistrict.temperature_c ?? 
    currentDistrict.baseTemp ?? 
    31.5
  );
  const baseR = Number(
    simulationData?.baseline?.rainfall_mm ?? 
    currentDistrict.rainfall_mm ?? 
    currentDistrict.baseRain ?? 
    3.2
  );

  // Simulated outcomes — dynamic response to inputs
  const rawSim = simulationData?.simulated || simulationData?.scenario;
  const isDataSynced = simulationData?.deltas?.temp_delta_c === tempDelta &&
                       simulationData?.deltas?.rain_delta_pct === rainDelta;

  const simT = isDataSynced && rawSim?.temperature_c !== undefined
    ? Number(rawSim.temperature_c)
    : Math.round((baseT + tempDelta) * 10) / 10;

  const simR = isDataSynced && rawSim?.rainfall_mm !== undefined
    ? Number(rawSim.rainfall_mm)
    : Math.round(Math.max(0, baseR * (1.0 + rainDelta / 100.0)) * 100) / 100;

  const baseline = {
    temperature_c: Math.round(baseT * 10) / 10,
    rainfall_mm: Math.round(baseR * 100) / 100,
  };

  const simulated = {
    temperature_c: Math.round(simT * 10) / 10,
    rainfall_mm: Math.round(simR * 100) / 100,
    temp_max: rawSim?.temp_max ?? Math.round((simT + 3.8) * 10) / 10,
    temp_min: rawSim?.temp_min ?? Math.round((simT - 4.5) * 10) / 10,
    humidity: rawSim?.humidity ?? Math.max(15, Math.min(95, Math.round(65 - tempDelta * 2.5))),
    wind_speed_kmh: rawSim?.wind_speed_kmh ?? 10.5,
  };

  // Sector impacts calculations
  const heatStress = rawSim?.heat_index_c ?? 
    Math.round((simulated.temperature_c + (simulated.humidity * 0.09) - 1.5) * 10) / 10;
  
  const droughtRiskPct = rawSim?.drought_risk_pct ?? 
    Math.min(100, Math.max(5, Math.round(35 - rainDelta * 0.65 + tempDelta * 4.5)));
  
  const cropStressScore = rawSim?.crop_stress_score ?? 
    Math.min(100, Math.max(5, Math.round(25 - rainDelta * 0.5 + tempDelta * 5.0)));

  const interp = simulationData?.interpretation || {
    temperature_condition: simulated.temperature_c >= 38 ? 'Extreme Heat' : simulated.temperature_c >= 33 ? 'Hot' : simulated.temperature_c >= 26 ? 'Warm' : 'Pleasant',
    rainfall_condition: simulated.rainfall_mm >= 15 ? 'Heavy Rain / Flood' : simulated.rainfall_mm >= 3 ? 'Moderate Rain' : simulated.rainfall_mm >= 0.5 ? 'Light Rain' : 'Dry / Deficit',
    summary: `Under a ${tempDelta >= 0 ? '+' : ''}${tempDelta}°C temperature shift and ${rainDelta >= 0 ? '+' : ''}${rainDelta}% rainfall anomaly, ${currentDistrict.name} exhibits a Heat Index of ${heatStress}°C and Drought Vulnerability of ${droughtRiskPct}%.`,
  };

  const chartData = [
    {
      metric: 'Temperature (°C)',
      Baseline: baseline.temperature_c,
      Simulated: simulated.temperature_c,
    },
    {
      metric: 'Precipitation (mm)',
      Baseline: baseline.rainfall_mm,
      Simulated: simulated.rainfall_mm,
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* Top Header & District Selector */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>WHAT-IF CLIMATE SIMULATOR</span>
          </div>
          <h1 className="text-2xl font-black text-white font-heading tracking-tight">
            Climate Scenario Simulation — {currentDistrict.name}
          </h1>
          <p className="text-xs text-slate-400">
            Interactive digital twin stress-testing: Perturb temperature and precipitation to evaluate AI-modeled impacts on heat comfort, crops, and drought vulnerability.
          </p>
        </div>

        {/* District Selector Dropdown */}
        {districts && districts.length > 0 && (
          <div className="relative min-w-[220px]">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Monitored District
            </label>
            <div className="relative">
              <select
                value={currentDistrict.id}
                onChange={(e) => {
                  const found = districts.find(d => d.id === e.target.value);
                  if (found && setActiveDistrict) setActiveDistrict(found);
                }}
                className="w-full appearance-none bg-slate-950/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer pr-8"
              >
                {districts.map((d) => (
                  <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                    {d.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Sliders & Interactive Input Card */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              Scenario Inputs & Perturbations
            </h3>
            {loading && (
              <span className="flex items-center gap-1.5 text-[11px] text-cyan-400 animate-pulse bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">
                <Sparkles className="w-3 h-3" />
                <span>Simulating...</span>
              </span>
            )}
          </div>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Baseline</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Temperature Slider & Direct Input */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-rose-400" />
                <span>Temperature Anomaly (ΔT)</span>
              </span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.5"
                  min="-10"
                  max="10"
                  value={tempDelta}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v)) setTempDelta(Math.max(-10, Math.min(10, v)));
                  }}
                  className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 text-xs text-right font-bold text-rose-400 focus:outline-none focus:border-rose-500"
                />
                <span className="text-xs text-rose-400 font-bold">°C</span>
              </div>
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
              <span>-10°C (Cooling)</span>
              <span>0°C (Baseline)</span>
              <span>+10°C (Extreme)</span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: 'Baseline (0°)', val: 0.0 },
                { label: '+1.5°C (Paris)', val: 1.5 },
                { label: '+3.0°C (Severe)', val: 3.0 },
                { label: '+5.0°C (Extreme)', val: 5.0 },
              ].map((p) => (
                <button
                  key={p.val}
                  onClick={() => setTempDelta(p.val)}
                  className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                    tempDelta === p.val 
                      ? 'bg-rose-950/80 border-rose-500 text-rose-300 font-bold' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rainfall Slider & Direct Input */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-cyan-400" />
                <span>Precipitation Anomaly (ΔP)</span>
              </span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="5"
                  min="-100"
                  max="100"
                  value={rainDelta}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    if (!isNaN(v)) setRainDelta(Math.max(-100, Math.min(100, v)));
                  }}
                  className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 text-xs text-right font-bold text-cyan-400 focus:outline-none focus:border-cyan-500"
                />
                <span className="text-xs text-cyan-400 font-bold">%</span>
              </div>
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
              <span>-100% (Drought)</span>
              <span>0% (Baseline)</span>
              <span>+100% (Deluge)</span>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: '-40% (Severe Drought)', val: -40 },
                { label: '-20% (Deficit)', val: -20 },
                { label: 'Normal (0%)', val: 0 },
                { label: '+30% (Surplus)', val: 30 },
              ].map((p) => (
                <button
                  key={p.val}
                  onClick={() => setRainDelta(p.val)}
                  className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                    rainDelta === p.val 
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold' 
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Tri-Card Flow: Baseline -> Applied Shift -> Simulated Outcome */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          
          {/* Card 1: Baseline */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">1. Current District Baseline</span>
            <div className="space-y-1">
              <div className="text-2xl font-black text-white font-heading">
                {baseline.temperature_c}°C
              </div>
              <div className="text-xs text-slate-400">
                Precipitation: <strong className="text-blue-400">{baseline.rainfall_mm} mm</strong>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
              Source: Live Observations & ERA5-Land Climatology
            </div>
          </div>

          {/* Card 2: Shift Applied */}
          <div className="p-5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-center space-y-2">
            <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">2. Weather Shift Applied</span>
            <div className="text-base font-bold text-white flex items-center justify-center gap-2">
              <span className="text-rose-400">ΔT: {tempDelta >= 0 ? `+${tempDelta}` : tempDelta}°C</span>
              <span>•</span>
              <span className="text-cyan-400">ΔP: {rainDelta >= 0 ? `+${rainDelta}` : rainDelta}%</span>
            </div>
            <div className="text-[10px] text-cyan-400">PyTorch ClimateLSTM Evaluation</div>
          </div>

          {/* Card 3: Simulated Outcome */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950/60 border border-blue-500/40 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">3. Simulated Outcome</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-200 border border-blue-400/30 font-medium">
                {interp.temperature_condition}
              </span>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-black text-white font-heading">
                {simulated.temperature_c}°C
              </div>
              <div className="text-xs text-slate-300 flex items-center justify-between">
                <span>Precipitation: <strong className="text-blue-300">{simulated.rainfall_mm} mm</strong></span>
                <span className="text-[11px] text-slate-400 font-mono">Range: {simulated.temp_min}° – {simulated.temp_max}°</span>
              </div>
            </div>
            <div className="text-[10px] text-emerald-400 pt-1 border-t border-blue-500/20 font-medium truncate">
              {interp.rainfall_condition}
            </div>
          </div>

        </div>

        {/* Narrative Synthesis Banner */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
          <Info className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-300 leading-relaxed">
            {interp.summary}
          </p>
        </div>

        {/* Sector Impacts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                <HeartPulse className="w-4 h-4" />
                <span>Heat Index</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                heatStress >= 40 ? 'bg-rose-950 text-rose-300' : heatStress >= 32 ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
              }`}>
                {heatStress >= 40 ? 'Danger' : heatStress >= 32 ? 'Caution' : 'Normal'}
              </span>
            </div>
            <div className="text-xl font-black text-white">{heatStress}°C</div>
            <p className="text-[10px] text-slate-400">Thermal discomfort rating for population</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Droplets className="w-4 h-4" />
                <span>Drought Risk</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                droughtRiskPct >= 60 ? 'bg-red-950 text-red-300' : droughtRiskPct >= 35 ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
              }`}>
                {droughtRiskPct >= 60 ? 'Severe' : droughtRiskPct >= 35 ? 'Moderate' : 'Low'}
              </span>
            </div>
            <div className="text-xl font-black text-white">{droughtRiskPct}%</div>
            <p className="text-[10px] text-slate-400">Soil moisture deficit probability</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sprout className="w-4 h-4" />
                <span>Crop Stress</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                cropStressScore >= 60 ? 'bg-rose-950 text-rose-300' : cropStressScore >= 35 ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
              }`}>
                {cropStressScore >= 60 ? 'High' : cropStressScore >= 35 ? 'Moderate' : 'Favorable'}
              </span>
            </div>
            <div className="text-xl font-black text-white">{cropStressScore} / 100</div>
            <p className="text-[10px] text-slate-400">Agricultural yield sensitivity pressure</p>
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

    </div>
  );
};

export default ScenarioAnalysisPage;

