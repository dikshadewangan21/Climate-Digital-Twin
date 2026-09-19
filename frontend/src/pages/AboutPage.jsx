import React, { useState, useEffect } from 'react';
import { Card } from '../components/Common/Card';
import { getPilotInfo, getModelMetrics } from '../services/api';
import { BookOpen, Target, Cpu, Database, Globe, Sprout, HeartPulse, Droplets, Zap, ShieldCheck } from 'lucide-react';

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
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>ABOUT THE PLATFORM</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100 font-heading">About Chhattisgarh Climate Dashboard</h1>
        <p className="text-sm text-slate-300 mt-1">
          A real-time climate monitoring and weather decision support platform built on official datasets from the India Meteorological Department (IMD).
        </p>
      </div>

      {/* Core Mission & Data Source */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Purpose & Benefits" icon={Target}>
          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 font-semibold">
              Providing farmers, disaster management teams, and local administrations with real-time weather intelligence.
            </div>
            <p>
              Traditional weather apps only show generic temperatures. This dashboard provides interactive regional maps, real-time weather hazard alerts (heatwaves, heavy rain, soil moisture), 7-day forecasts, and interactive what-if weather simulations.
            </p>
          </div>
        </Card>

        <Card title="Official Weather Data Source" icon={Database}>
          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[10px] block font-semibold">PRIMARY DATA SOURCE</span>
              <span className="text-slate-100 font-bold text-sm">{pilotInfo?.data_source || 'India Meteorological Department (IMD)'}</span>
            </div>
            <p>
              Utilizes high-resolution gridded daily rainfall (0.25°) and surface temperature (1.0°) observations across all {pilotInfo?.total_districts || 33} administrative districts of {pilotInfo?.name || 'Chhattisgarh'}.
            </p>
            <div className="text-[11px] font-mono text-cyan-400 pt-1">
              Historical Sequences: {pilotInfo?.sequence_count?.toLocaleString() || modelMetrics?.total_sequences?.toLocaleString() || '36,874'} Data Points
            </div>
          </div>
        </Card>
      </div>

      {/* Beneficiary Sectors */}
      <Card title="Key Sectors Supported" icon={Globe}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Sprout className="w-4 h-4" /> Farmers & Agriculture
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Crop stress monitoring, sowing suitability scores, and soil moisture advisory.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="font-bold text-rose-400 flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4" /> Disaster Teams & Health
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Early warning surveillance for extreme heatwaves, cloudbursts, and flash flooding.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Droplets className="w-4 h-4" /> Water Resource Managers
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Reservoir water level estimations, soil saturation, and basin runoff indexes.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> City Planners & Energy
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Apparent heat indices and peak electricity cooling demand surges.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AboutPage;

