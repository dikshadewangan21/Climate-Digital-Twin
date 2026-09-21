import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '../components/Common/Card';
import { LoadingState } from '../components/Common/LoadingState';
import { ErrorState } from '../components/Common/ErrorState';
import { getDistrictWeatherDetail, getDistrictForecast } from '../services/api';
import { 
  CalendarDays, 
  MapPin, 
  Thermometer, 
  CloudRain, 
  Wind, 
  Droplets, 
  Sun, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  History
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export const FourteenDayWeatherPage = ({
  districts = [],
  activeDistrict,
  setActiveDistrict
}) => {
  const currentDistrict = activeDistrict || districts[0] || { id: 'raipur', name: 'Raipur' };

  const [weatherDetail, setWeatherDetail] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTimeline = useCallback(async () => {
    if (!currentDistrict?.id) return;
    setLoading(true);
    setError(null);

    try {
      const [wRes, fRes] = await Promise.all([
        getDistrictWeatherDetail(currentDistrict.id),
        getDistrictForecast(currentDistrict.id, 7)
      ]);

      if (wRes.success && wRes.data) {
        setWeatherDetail(wRes.data);
      } else {
        setError(wRes.error || 'Unable to retrieve 14-day timeline.');
      }

      if (fRes.success && fRes.data) {
        setForecastData(fRes.data);
      }
    } catch (err) {
      console.error('Timeline error:', err);
      setError('Unable to load weather timeline. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentDistrict?.id]);

  useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  // Construct 14-day days array: Previous 7 Days | Today | Next 7 Days
  const daysList = [];
  if (weatherDetail?.daily?.time) {
    const times = weatherDetail.daily.time;
    const tempsMean = weatherDetail.daily.temperature_2m_mean || [];
    const tempsMax = weatherDetail.daily.temperature_2m_max || [];
    const tempsMin = weatherDetail.daily.temperature_2m_min || [];
    const rains = weatherDetail.daily.precipitation_sum || [];
    const winds = weatherDetail.daily.wind_speed_10m_max || [];
    const todayStr = new Date().toISOString().slice(0, 10);

    times.forEach((dateStr, idx) => {
      const isToday = dateStr === todayStr || idx === 7;
      const isPast = idx < 7;
      daysList.push({
        date: dateStr,
        dayLabel: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        tempMean: tempsMean[idx] ?? null,
        tempMax: tempsMax[idx] ?? null,
        tempMin: tempsMin[idx] ?? null,
        rain: rains[idx] ?? null,
        wind: winds[idx] ?? null,
        isToday,
        section: isToday ? 'Today' : (isPast ? 'Previous 7 Days' : 'Next 7 Days'),
        type: isToday ? 'today' : (isPast ? 'past' : 'future')
      });
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-2">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>14-DAY WEATHER TIMELINE</span>
            </div>
            <h1 className="text-2xl font-black text-white font-heading tracking-tight">
              14-Day Timeline — {currentDistrict.name}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Displays the past 7 days of observed weather, today's current readings, and the next 7 days of forecast.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <span>Observed Past</span>
            </span>
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-cyan-400/40" />
              <span>Today</span>
            </span>
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Forecast</span>
            </span>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingState message={`Loading 14-day weather timeline for ${currentDistrict.name}...`} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchTimeline} />
      ) : (
        <div className="space-y-6">
          
          {/* Timeline Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-15 gap-2 overflow-x-auto pb-2">
            {daysList.map((d, idx) => {
              const isToday = d.isToday;
              const isPast = d.type === 'past';
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border flex flex-col justify-between text-center transition-all min-w-[85px] ${isToday ? 'bg-gradient-to-b from-cyan-950 to-blue-950 border-cyan-400 shadow-xl shadow-cyan-500/20 ring-2 ring-cyan-400/50 scale-105 z-10' : isPast ? 'bg-slate-950/60 border-slate-800/80 text-slate-400' : 'bg-slate-900/80 border-slate-800 text-slate-200'}`}
                >
                  <div className="space-y-0.5">
                    <div className={`text-[10px] font-bold ${isToday ? 'text-cyan-300' : 'text-slate-400'}`}>
                      {isToday ? 'TODAY' : d.dayLabel}
                    </div>
                    <div className="text-[9px] text-slate-500">{d.fullDate}</div>
                  </div>

                  <div className="my-2 space-y-1">
                    <div className={`text-base font-black font-heading ${isToday ? 'text-white' : 'text-slate-200'}`}>
                      {d.tempMean !== null ? `${d.tempMean}°C` : '--'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {d.tempMin !== null && d.tempMax !== null ? `${d.tempMin}° / ${d.tempMax}°` : '--'}
                    </div>
                    <div className="text-[11px] font-semibold text-blue-400">
                      {d.rain !== null ? (d.rain > 0 ? `${d.rain} mm` : '0 mm') : '--'}
                    </div>
                  </div>

                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full ${isToday ? 'bg-cyan-900 text-cyan-200 font-bold' : isPast ? 'bg-slate-900 text-slate-400' : 'bg-blue-950 text-blue-300'}`}>
                    {isToday ? 'Active' : (isPast ? 'Past' : 'Future')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Combined 14-Day Trajectory Chart */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>14-Day Temperature & Rainfall Trend</span>
            </h3>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={daysList}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="fullDate" stroke="#64748b" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="temp" stroke="#64748b" tick={{ fontSize: 10 }} unit="°" />
                  <YAxis yAxisId="rain" orientation="right" stroke="#64748b" tick={{ fontSize: 10 }} unit="mm" />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line yAxisId="temp" type="monotone" dataKey="tempMean" name="Mean Temp (°C)" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
                  <Line yAxisId="temp" type="monotone" dataKey="tempMax" name="Max Temp (°C)" stroke="#f43f5e" strokeWidth={1} dot={false} strokeDasharray="2 2" />
                  <Bar yAxisId="rain" dataKey="rain" name="Precipitation (mm)" fill="#0284c7" radius={[4, 4, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default FourteenDayWeatherPage;
