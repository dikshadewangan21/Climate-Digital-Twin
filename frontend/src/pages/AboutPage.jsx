import React, { useState, useEffect } from 'react';
import { Card } from '../components/Common/Card';
import { getPilotInfo, getModelMetrics } from '../services/api';
import { 
  BookOpen, 
  Target, 
  Cpu, 
  Database, 
  Globe, 
  Sprout, 
  HeartPulse, 
  Droplets, 
  Zap, 
  ShieldCheck,
  BrainCircuit,
  CloudSun
} from 'lucide-react';

export const AboutPage = () => {
  const [pilotInfo, setPilotInfo] = useState(null);
  const [modelMetrics, setModelMetrics] = useState(null);

  useEffect(() => {
    getPilotInfo().then(res => {
      if (res.success) setPilotInfo(res.data);
    });
    getModelMetrics().then(res => {
      if (res.success) setModelMetrics(res.data);
    });
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>ABOUT CLIMATETWIN AI</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 font-heading">
          About the Weather & Climate Platform
        </h1>
        <p className="text-sm text-slate-300 mt-1">
          A comprehensive regional weather intelligence platform providing live observations, AI-driven forecasts, and historical climate patterns for Chhattisgarh.
        </p>
      </div>

      {/* Core Mission & Data Source */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Purpose & Overview" icon={Target}>
          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 font-semibold">
              Providing localized climate intelligence, hazard surveillance, and predictive decision-support for all 33 districts of Chhattisgarh.
            </div>
            <p>
              ClimateTwin AI provides an interactive digital representation of Chhattisgarh's climate: reflecting real atmospheric conditions, calculating intelligent multi-factor forecasts, and enabling what-if simulations to study heat comfort, rainfall patterns, and agricultural impacts.
            </p>
          </div>
        </Card>

        <Card title="Official Meteorological Data Sources" icon={Database}>
          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] block font-semibold">LIVE OBSERVATIONS & HISTORICAL RECORDS</span>
              <span className="text-slate-100 font-bold text-sm">Open-Meteo & ERA5 Global Climate Observations</span>
            </div>
            <p>
              High-resolution daily weather records across all {pilotInfo?.total_districts || 33} districts of {pilotInfo?.name || 'Chhattisgarh'}.
            </p>
            <div className="text-[11px] font-mono text-cyan-400 pt-1">
              Historical Observations Analyzed: {modelMetrics?.training_samples?.toLocaleString() || '120,000+'} Daily Records
            </div>
          </div>
        </Card>
      </div>

      {/* Forecasting Methodology */}
      <Card title="Weather Forecasting Intelligence & Methodology" icon={BrainCircuit}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Forecasting Method</span>
            <div className="text-base font-bold text-white">Multi-Variable Analysis</div>
            <p className="text-[11px] text-slate-400 mt-1">Multi-factor weather analysis with trend calibration</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Forecasting Capability</span>
            <div className="text-base font-bold text-cyan-300">
              High Precision
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Calibrated against historical observations across all districts</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Forecast Horizon</span>
            <div className="text-base font-bold text-emerald-400">Next 24h to 14 Days</div>
            <p className="text-[11px] text-slate-400 mt-1">Daily updates with rolling multi-day projections</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs text-slate-300 space-y-2">
          <div className="font-semibold text-white">Atmospheric Factors Analyzed (10):</div>
          <div className="text-[11px] text-cyan-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            Latitude, Longitude, Mean Temperature, Precipitation, Relative Humidity, Wind Speed, Atmospheric Pressure, Cloud Cover, Solar Radiation, Evaporation Rate
          </div>

          <div className="font-semibold text-white pt-2">Generated Daily Projections (8):</div>
          <div className="text-[11px] text-blue-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            Daily Mean Temperature, Maximum Temperature, Minimum Temperature, Expected Rainfall, Humidity Percentage, Wind Velocity, Surface Pressure, Cloud Cover
          </div>
        </div>
      </Card>

      {/* Technology Overview */}
      <Card title="Platform Technology Overview" icon={Cpu}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">PROCESSING ENGINE</span>
            <span className="font-bold text-white">High-Speed Climate Engine</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">FORECAST CORE</span>
            <span className="font-bold text-cyan-300">Intelligent Neural Forecasting</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">INTERFACE</span>
            <span className="font-bold text-blue-300">Modern Responsive Web</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 text-[10px] block">DATA SOURCES</span>
            <span className="font-bold text-emerald-400">Open-Meteo & ERA5 Global Data</span>
          </div>
        </div>
      </Card>

    </div>
  );
};

export default AboutPage;
