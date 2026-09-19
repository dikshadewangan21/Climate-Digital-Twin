import React, { useState, useEffect } from 'react';
import { Card } from '../components/Common/Card';
import { ClimateMap } from '../components/DigitalTwin/ClimateMap';
import { getDistrictForecast } from '../services/api';
import { 
  MapPin, 
  Thermometer, 
  CloudRain, 
  Calendar, 
  AlertTriangle, 
  Sliders, 
  FileText, 
  ArrowRight, 
  RefreshCw,
  Sprout,
  Droplets,
  Sun
} from 'lucide-react';

export const DigitalTwinPage = ({ 
  districts = [],
  activeDistrict, 
  setActiveDistrict, 
  setActiveTab, 
  backendStatus, 
  onRefresh
}) => {
  const [selectedVariable, setSelectedVariable] = useState('temperature');
  const [activeStateMode, setActiveStateMode] = useState('current');
  const [forecastList, setForecastList] = useState([]);
  const [forecastLoading, setForecastLoading] = useState(false);

  // Safe fallback district
  const currentDistrict = activeDistrict || districts[0] || { id: 'raipur', name: 'Raipur' };

  // Fetch backend 7-day forecast
  useEffect(() => {
    let isMounted = true;
    if (currentDistrict.id) {
      setForecastLoading(true);
      getDistrictForecast(currentDistrict.id, 7)
        .then(res => {
          if (isMounted && res.success && res.data?.forecast) {
            setForecastList(res.data.forecast);
          }
        })
        .catch(err => console.error('Failed to load district forecast:', err))
        .finally(() => {
          if (isMounted) setForecastLoading(false);
        });
    }
    return () => { isMounted = false; };
  }, [currentDistrict.id]);

  const distTemp = currentDistrict.temperature_c ?? currentDistrict.baseTemp ?? 28.5;
  const distRain = currentDistrict.rainfall_mm ?? currentDistrict.baseRain ?? 2.0;
  const distCondition = currentDistrict.condition || { label: 'Clear Sky', icon: '☀️', ariaLabel: 'Clear Sky' };

  const sectorImpacts = currentDistrict.sector_impacts || {
    agriculture: { status: 'Favorable', note: 'Normal seasonal moisture and soil conditions', stress_score: 15 },
    health: { heat_index_c: 30.0, category: 'Low Risk', score: 15 },
    hydrology: { soil_moisture_pct: 48.0, reservoir_status: 'Stable' },
    energy: { grid_surge_pct: 10 }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Live Weather & Regional Map
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time conditions and 7-day weather outlook across all 33 districts of Chhattisgarh.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Selected:</span>
          <span className="px-3 py-1 bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 rounded-lg text-xs font-bold">
            {currentDistrict.name}
          </span>
        </div>
      </div>

      {/* Main Map & Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Map & 7-Day Quick Strip */}
        <div className="lg:col-span-8 space-y-4">
          <ClimateMap
            districts={districts}
            selectedVariable={selectedVariable}
            setSelectedVariable={setSelectedVariable}
            activeStateMode={activeStateMode}
            setActiveStateMode={setActiveStateMode}
            activeDistrict={currentDistrict}
            setActiveDistrict={setActiveDistrict}
            isScenario={false}
            scenarioDeltas={{ temp: 0, rain: 0 }}
          />

          {/* 7-Day Forecast Quick Strip */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="text-slate-200 font-bold flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-cyan-400" />
                7-Day Forecast for {currentDistrict.name}
              </span>
              <button
                onClick={() => setActiveTab('forecast')}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-xs cursor-pointer font-semibold"
              >
                <span>Full Forecast & Charts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {forecastLoading ? (
              <div className="py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Loading forecast...</span>
              </div>
            ) : forecastList.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400">
                Select a district on the map to view the 7-day forecast.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center">
                {forecastList.map((d) => (
                  <div key={d.day} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-semibold block">{d.day_label || `Day ${d.day}`}</span>
                    <div className="text-xl my-0.5" role="img" aria-label={d.condition?.ariaLabel}>{d.condition?.icon || '⛅'}</div>
                    <div className="text-xs font-bold text-amber-400">{d.temperature_c ?? '--'}°C</div>
                    <div className="text-[10px] text-cyan-300">{d.rainfall_mm ?? '--'} mm</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Selected District Details & Quick Actions */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Current District Weather Card */}
          <Card title={`${currentDistrict.name} Weather`} icon={MapPin}>
            <div className="space-y-4 py-1">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="text-4xl" role="img" aria-label={distCondition?.ariaLabel || 'Weather'}>
                    {distCondition?.icon || '⛅'}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">
                      {distCondition?.label || 'Clear Sky'}
                    </div>
                    <div className="text-xs text-slate-400">
                      {currentDistrict.name} District
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-amber-400">
                    {distTemp}°C
                  </div>
                  <div className="text-xs text-slate-400">
                    Current Temp
                  </div>
                </div>
              </div>

              {/* 4 Clean Metric Cards */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-amber-400" /> Temperature
                  </span>
                  <span className="text-amber-400 font-bold text-base mt-0.5 block">{distTemp} °C</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                    <CloudRain className="w-3 h-3 text-cyan-400" /> Rainfall
                  </span>
                  <span className="text-cyan-300 font-bold text-base mt-0.5 block">{distRain} mm</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                    <Sun className="w-3 h-3 text-orange-400" /> Feels Like
                  </span>
                  <span className="text-orange-400 font-bold text-base mt-0.5 block">
                    {currentDistrict.heat_index_c ?? currentDistrict.heat_index ?? 30.0} °C
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-cyan-400" /> Soil Moisture
                  </span>
                  <span className="text-cyan-300 font-bold text-base mt-0.5 block">
                    {currentDistrict.soil_moisture_pct ?? 48.0} %
                  </span>
                </div>
              </div>

              {/* Farming & Agriculture Guidance */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5" />
                  <span>Farming & Crop Condition</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Crop Health Status:</span>
                  <span className="font-bold text-emerald-400">{sectorImpacts.agriculture?.status || 'Favorable'}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {sectorImpacts.agriculture?.note || 'Normal weather conditions favorable for regional agriculture.'}
                </p>
              </div>

            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions" icon={Calendar}>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => setActiveTab('forecast')}
                className="w-full py-2.5 px-3 bg-slate-950 hover:bg-slate-800 text-slate-200 font-medium rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>View 7-Day Detailed Forecast</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('alerts')}
                className="w-full py-2.5 px-3 bg-slate-950 hover:bg-slate-800 text-slate-200 font-medium rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Check Weather & Risk Alerts</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('scenario')}
                className="w-full py-2.5 px-3 bg-slate-950 hover:bg-slate-800 text-slate-200 font-medium rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Test What-If Climate Scenarios</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className="w-full py-2.5 px-3 bg-slate-950 hover:bg-slate-800 text-slate-200 font-medium rounded-xl border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Download District Report</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default DigitalTwinPage;
