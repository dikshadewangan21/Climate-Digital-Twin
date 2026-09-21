import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/Common/Card';
import { LoadingState } from '../components/Common/LoadingState';
import { ErrorState } from '../components/Common/ErrorState';
import { getDistrictForecast } from '../services/api';
import { 
  PlaneTakeoff, 
  Calendar, 
  MapPin, 
  Thermometer, 
  CloudRain, 
  Wind, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sun, 
  Info,
  Droplets
} from 'lucide-react';

export const TravelAssistantPage = ({
  districts = [],
  activeDistrict,
  setActiveDistrict
}) => {
  const currentDistrict = activeDistrict || districts[0] || { id: 'raipur', name: 'Raipur' };

  const [forecastList, setForecastList] = useState([]);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTravelWeather = useCallback(async () => {
    if (!currentDistrict?.id) return;
    setLoading(true);
    setError(null);

    try {
      const res = await getDistrictForecast(currentDistrict.id, 7);
      if (res.success && res.data?.forecast) {
        setForecastList(res.data.forecast);
      } else {
        setError(res.error || 'Failed to retrieve travel weather outlook.');
      }
    } catch (err) {
      console.error('Travel assistant error:', err);
      setError('Unable to load weather outlook. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentDistrict?.id]);

  useEffect(() => {
    fetchTravelWeather();
  }, [fetchTravelWeather]);

  const selectedDay = forecastList[selectedDayIdx] || forecastList[0] || {};
  const temp = selectedDay.temperature_c !== undefined && selectedDay.temperature_c !== null ? selectedDay.temperature_c : null;
  const rain = selectedDay.rainfall_mm !== undefined && selectedDay.rainfall_mm !== null ? selectedDay.rainfall_mm : null;
  const wind = selectedDay.wind_speed_kmh !== undefined && selectedDay.wind_speed_kmh !== null ? selectedDay.wind_speed_kmh : null;
  const heatIndex = selectedDay.heat_index ?? temp;

  // Transparent Travel Suitability derivation strictly from real parameters
  let suitability = { label: 'Suitable for Travel', color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-500/30', icon: CheckCircle2 };
  let reasons = [];

  if (rain >= 15.0) {
    suitability = { label: 'Not Recommended', color: 'text-rose-400', bg: 'bg-rose-950/40 border-rose-500/30', icon: XCircle };
    reasons.push(`Heavy rainfall predicted (${rain} mm) causing potential roadway waterlogging.`);
  } else if (rain >= 3.0) {
    suitability = { label: 'Moderate Caution', color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-500/30', icon: AlertTriangle };
    reasons.push(`Showers expected (${rain} mm). Carry rain protection.`);
  }

  if (heatIndex >= 42.0) {
    suitability = { label: 'Not Recommended', color: 'text-rose-400', bg: 'bg-rose-950/40 border-rose-500/30', icon: XCircle };
    reasons.push(`Dangerous heat index (${heatIndex}°C). Heatstroke risk during outdoor daytime travel.`);
  } else if (heatIndex >= 36.0) {
    if (suitability.label === 'Suitable for Travel') {
      suitability = { label: 'Moderate Caution', color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-500/30', icon: AlertTriangle };
    }
    reasons.push(`High temperature and humidity (Heat Index: ${heatIndex}°C). Hydration recommended.`);
  }

  if (wind >= 35.0) {
    if (suitability.label === 'Suitable for Travel') {
      suitability = { label: 'Moderate Caution', color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-500/30', icon: AlertTriangle };
    }
    reasons.push(`Elevated surface gusts (${wind} km/h). Caution on high-speed highways.`);
  }

  if (reasons.length === 0) {
    reasons.push('Comfortable ambient temperature and dry conditions. Excellent for outdoor transit and tourism.');
  }

  const SuitIcon = suitability.icon;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-2">
          <PlaneTakeoff className="w-3.5 h-3.5" />
          <span>TRAVEL & MOBILITY WEATHER ASSISTANT</span>
        </div>
        <h1 className="text-2xl font-black text-white font-heading tracking-tight">
          District Travel Suitability — {currentDistrict.name}
        </h1>
        <p className="text-xs text-slate-400">
          Evaluates real temperature, precipitation, and heat index data to transparently determine travel comfort.
        </p>
      </div>

      {loading ? (
        <LoadingState message="Analyzing travel conditions..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchTravelWeather} />
      ) : (
        <div className="space-y-6">
          
          {/* Day Selector Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {forecastList.map((f, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDayIdx(idx)}
                className={`px-4 py-3 rounded-2xl border text-left transition-all min-w-[110px] cursor-pointer ${selectedDayIdx === idx ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-md ring-1 ring-cyan-400/40' : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'}`}
              >
                <div className="text-xs font-bold font-heading">{f.day_label}</div>
                <div className="text-[10px] text-slate-500">{f.full_date}</div>
                <div className="text-sm font-black text-white mt-1">{f.temperature_c}°C</div>
              </button>
            ))}
          </div>

          {/* Suitability Verdict Banner */}
          <div className={`p-6 rounded-3xl border ${suitability.bg} space-y-3`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-white/10">
                  <SuitIcon className={`w-6 h-6 ${suitability.color}`} />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Suitability Verdict</span>
                  <h2 className={`text-xl font-black font-heading ${suitability.color}`}>
                    {suitability.label}
                  </h2>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {selectedDay.full_date} • {currentDistrict.name}
              </span>
            </div>

            {/* Explanatory Reasons */}
            <div className="pt-2 border-t border-white/10 space-y-1.5">
              {reasons.map((r, i) => (
                <div key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Condition Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Temperature</span>
              <div className="text-2xl font-black text-white font-heading">
                {temp !== null ? `${temp}°C` : 'Data unavailable'}
              </div>
              <div className="text-[10px] text-slate-500">
                {selectedDay.temp_min !== undefined ? `Min ${selectedDay.temp_min}° / Max ${selectedDay.temp_max}°` : 'Expected range'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Precipitation</span>
              <div className="text-2xl font-black text-blue-400 font-heading">
                {rain !== null ? `${rain} mm` : 'Data unavailable'}
              </div>
              <div className="text-[10px] text-slate-500">
                {selectedDay.rainfall_probability !== undefined ? `Rain Chance: ${selectedDay.rainfall_probability}%` : 'Daily expected rainfall'}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Feels Like</span>
              <div className="text-2xl font-black text-amber-300 font-heading">
                {heatIndex !== null ? `${heatIndex}°C` : 'Data unavailable'}
              </div>
              <div className="text-[10px] text-slate-500">Heat index comfort</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Wind Speed</span>
              <div className="text-2xl font-black text-slate-200 font-heading">
                {wind !== null ? `${wind} km/h` : 'Data unavailable'}
              </div>
              <div className="text-[10px] text-slate-500">Surface wind speed</div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default TravelAssistantPage;
