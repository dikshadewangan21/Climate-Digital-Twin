import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CHHATTISGARH_STATE_GEOJSON, CHHATTISGARH_DISTRICTS_GEOJSON, CHHATTISGARH_BOUNDS } from '../../data/chhattisgarhGeoJSON';
import { 
  Layers, 
  MapPin, 
  RotateCcw, 
  Thermometer, 
  CloudRain, 
  Wind, 
  Cloud, 
  Sparkles, 
  Search, 
  Globe2, 
  Radio,
  AlertTriangle,
  Key,
  ExternalLink,
  Map as MapIcon
} from 'lucide-react';

// Dark Map Styling for Google Maps to fit SaaS Dashboard
const DARK_MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#38bdf8" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748b" }]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }]
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#0f172a" }]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748b" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#334155" }]
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0284c7" }, { lightness: -50 }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#38bdf8" }]
  }
];

// Leaflet Map Bounds Controller
function LeafletBoundsController({ targetCenter, targetZoom, resetTrigger }) {
  const map = useMap();

  useEffect(() => {
    if (resetTrigger > 0) {
      map.fitBounds(CHHATTISGARH_BOUNDS, { padding: [25, 25], animate: true, duration: 1.2 });
    }
  }, [resetTrigger, map]);

  useEffect(() => {
    if (targetCenter) {
      map.setView(targetCenter, targetZoom || 10, { animate: true, duration: 1.2 });
    }
  }, [targetCenter, targetZoom, map]);

  return null;
}

// Leaflet Resize & Invalidation Handler to prevent grey tile glitches
function MapResizeHandler() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);
  return null;
}

// Leaflet DivIcon for District labels
function createDistrictLabelIcon(name, emoji) {
  return L.divIcon({
    className: 'district-label-marker',
    html: `<div style="
      font-family: Inter, sans-serif;
      font-size: 10px;
      font-weight: 700;
      color: #f8fafc;
      text-shadow: 0px 1px 3px rgba(0,0,0,0.95), 0px 0px 6px rgba(0,0,0,0.9);
      white-space: nowrap;
      pointer-events: none;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      gap: 3px;
    "><span style="font-size: 12px;">${emoji || '📍'}</span> ${name}</div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
}

export const GoogleClimateMap = ({
  districts = [],
  selectedVariable = 'temperature',
  setSelectedVariable,
  activeStateMode = 'predicted',
  setActiveStateMode,
  activeDistrict,
  setActiveDistrict,
  isScenario = false,
  scenarioDeltas = { temp: 2.0, rain: -20 },
  dataSourceMode = 'ai-twin',
  setDataSourceMode
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const infoWindowRef = useRef(null);

  const rawApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const apiKey = rawApiKey.trim();

  // Default to Google Maps engine when API key is provided
  const [mapEngine, setMapEngine] = useState(apiKey ? 'google' : 'leaflet');
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [leafletResetCount, setLeafletResetCount] = useState(0);
  const [leafletTargetCenter, setLeafletTargetCenter] = useState(null);

  // Mode adjustment offsets
  const tempOffset = isScenario ? scenarioDeltas.temp : (activeStateMode === 'predicted' ? -0.5 : 0);
  const rainMult = isScenario ? (1 + scenarioDeltas.rain / 100) : (activeStateMode === 'predicted' ? 0.9 : 1.0);

  // Helper function to resolve district data from backend districts array (100% null-safe)
  const getDistrictClimateData = useCallback((distName) => {
    const rawName = String(distName || activeDistrict?.name || 'Raipur').toLowerCase();
    const record = districts.find(d => d?.name && String(d.name).toLowerCase().includes(rawName)) || districts[0] || {};
    const baseT = record.temperature_c ?? record.baseTemp ?? 28.5;
    const baseR = record.rainfall_mm ?? record.baseRain ?? 2.0;

    const distTemp = +(baseT + tempOffset).toFixed(2);
    const distRain = +Math.max(0, baseR * rainMult).toFixed(2);
    const condition = record.condition || { label: 'Clear Sky', icon: '☀️', ariaLabel: 'Clear Sky', color: 'text-amber-400' };
    const windSpeed = record.wind_speed_kmh ?? 12.5;
    const cloudCoverPct = distRain > 4 ? 85 : (distRain > 1 ? 55 : 20);

    return {
      ...record,
      name: record.name || distName || 'Raipur',
      distTemp,
      distRain,
      condition,
      windSpeed,
      cloudCoverPct
    };
  }, [districts, activeDistrict, tempOffset, rainMult]);

  // Load Google Maps API when engine is set to google
  useEffect(() => {
    if (mapEngine !== 'google' || !apiKey) {
      if (!apiKey) setMapEngine('leaflet');
      return;
    }

    let isMounted = true;
    try {
      const loader = new Loader({
        apiKey: apiKey,
        version: 'weekly',
        libraries: ['places', 'geometry']
      });

      // Global Google Maps Auth Failure listener
      window.gm_authFailure = () => {
        if (isMounted) {
          setMapEngine('leaflet');
        }
      };

      loader.load()
        .then((google) => {
          if (!isMounted || !mapContainerRef.current) return;

          const chhattisgarhBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(CHHATTISGARH_BOUNDS[0][0], CHHATTISGARH_BOUNDS[0][1]),
            new google.maps.LatLng(CHHATTISGARH_BOUNDS[1][0], CHHATTISGARH_BOUNDS[1][1])
          );

          // Authentic Google Map without fake/custom map styles
          const map = new google.maps.Map(mapContainerRef.current, {
            center: { lat: 21.2787, lng: 81.8661 },
            zoom: 7,
            minZoom: 6,
            maxZoom: 18,
            mapTypeId: 'roadmap',
            styles: null, // Authentic Google Maps look with real roads, places, landmarks and labels
            mapTypeControl: true, // Allows toggling Map, Satellite, Terrain
            zoomControl: true,
            fullscreenControl: true,
            streetViewControl: true,
            scaleControl: true
          });

          map.fitBounds(chhattisgarhBounds, { top: 30, right: 30, bottom: 30, left: 30 });
          mapInstanceRef.current = map;

          const infoWindow = new google.maps.InfoWindow();
          infoWindowRef.current = infoWindow;

          map.data.addGeoJson(CHHATTISGARH_DISTRICTS_GEOJSON);

          map.data.addListener('click', (event) => {
            const distName = event.feature.getProperty('name');
            if (distName) {
              const match = districts.find(d => d?.name && String(d.name).toLowerCase().includes(String(distName).toLowerCase()));
              if (match && setActiveDistrict) {
                setActiveDistrict(match);
              }
            }
          });

          map.data.addListener('mouseover', (event) => {
            const distName = event.feature.getProperty('name') || 'District';
            const dData = getDistrictClimateData(distName);
            
            map.data.overrideStyle(event.feature, {
              strokeWeight: 3.5,
              strokeColor: '#0284c7',
              fillOpacity: 0.35
            });

            if (event.latLng) {
              infoWindow.setContent(`
                <div style="font-family: Inter, sans-serif; font-size: 11px; padding: 6px 10px; color: #0f172a; line-height: 1.4;">
                  <div style="font-weight: 800; font-size: 13px; color: #0284c7; display: flex; align-items: center; gap: 4px; border-bottom: 1px solid #e2e8f0; padding-bottom: 3px; margin-bottom: 4px;">
                    <span style="font-size: 15px;">${dData.condition?.icon || '⛅'}</span>
                    <span>${distName} District</span>
                  </div>
                  <div style="font-size: 11px; color: #334155;">
                    <strong>Condition:</strong> ${dData.condition?.label || 'Normal'}<br/>
                    <strong>Temperature:</strong> <span style="color: #d97706; font-weight: bold;">${dData.distTemp}°C</span><br/>
                    <strong>Rainfall:</strong> <span style="color: #0284c7; font-weight: bold;">${dData.distRain} mm</span><br/>
                    <strong>Wind:</strong> ${dData.windSpeed} km/h
                  </div>
                </div>
              `);
              infoWindow.setPosition(event.latLng);
              infoWindow.open(map);
            }
          });

          map.data.addListener('mouseout', (event) => {
            map.data.revertStyle(event.feature);
            infoWindow.close();
          });

          setGoogleLoaded(true);
        })
        .catch(() => {
          if (isMounted) {
            setMapEngine('leaflet');
          }
        });
    } catch {
      if (isMounted) {
        setMapEngine('leaflet');
      }
    }

    return () => {
      isMounted = false;
    };
  }, [apiKey, mapEngine]);

  // Update Google Maps data layer styles with subtle climate overlay
  useEffect(() => {
    if (!mapInstanceRef.current || !googleLoaded || mapEngine !== 'google') return;
    const map = mapInstanceRef.current;

    map.data.setStyle((feature) => {
      const distName = feature.getProperty('name') || '';
      const dData = getDistrictClimateData(distName);
      const isSelected = activeDistrict?.name && distName ? String(activeDistrict.name).toLowerCase() === String(distName).toLowerCase() : false;

      let fillColor = '#0284c7';
      if (selectedVariable === 'temperature' || selectedVariable === 'heat') {
        fillColor = dData.distTemp > 32.5 ? '#dc2626' : (dData.distTemp > 30.0 ? '#d97706' : '#0284c7');
      } else if (selectedVariable === 'rainfall' || selectedVariable === 'rain') {
        fillColor = dData.distRain > 4.5 ? '#0891b2' : (dData.distRain > 2.0 ? '#2563eb' : '#64748b');
      } else if (selectedVariable === 'wind') {
        fillColor = dData.windSpeed > 18 ? '#7c3aed' : (dData.windSpeed > 14 ? '#2563eb' : '#0891b2');
      } else if (selectedVariable === 'clouds') {
        fillColor = dData.cloudCoverPct > 70 ? '#64748b' : (dData.cloudCoverPct > 40 ? '#475569' : '#0284c7');
      }

      return {
        fillColor: fillColor,
        fillOpacity: isSelected ? 0.35 : 0.08,
        strokeColor: isSelected ? '#0284c7' : '#0369a1',
        strokeWeight: isSelected ? 3.0 : 1.2,
        cursor: 'pointer'
      };
    });
  }, [googleLoaded, mapEngine, selectedVariable, activeDistrict, getDistrictClimateData]);

  // Reset to full Chhattisgarh state
  const handleResetToState = () => {
    if (mapEngine === 'google' && mapInstanceRef.current && window.google) {
      const bounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(CHHATTISGARH_BOUNDS[0][0], CHHATTISGARH_BOUNDS[0][1]),
        new window.google.maps.LatLng(CHHATTISGARH_BOUNDS[1][0], CHHATTISGARH_BOUNDS[1][1])
      );
      mapInstanceRef.current.fitBounds(bounds, { top: 30, right: 30, bottom: 30, left: 30 });
    } else {
      setLeafletTargetCenter(null);
      setLeafletResetCount(c => c + 1);
    }
  };

  // Search Filter (Null-safe)
  const searchResults = districts.filter(d =>
    d?.name && searchQuery ? String(d.name).toLowerCase().includes(String(searchQuery).toLowerCase()) : false
  );

  const handleSelectLocation = (item) => {
    if (!item) return;
    if (mapEngine === 'google' && mapInstanceRef.current && window.google && item.lat && item.lon) {
      mapInstanceRef.current.panTo({ lat: item.lat, lng: item.lon });
      mapInstanceRef.current.setZoom(10);
    } else if (item.lat && item.lon) {
      setLeafletTargetCenter([item.lat, item.lon]);
    }
    setSearchQuery('');
    if (setActiveDistrict) setActiveDistrict(item);
  };

  // Leaflet GeoJSON styling function (100% null-safe)
  const getLeafletDistrictStyle = (feature) => {
    const distName = feature?.properties?.name || '';
    const distData = getDistrictClimateData(distName);
    const isSelected = activeDistrict?.name && distName ? String(activeDistrict.name).toLowerCase() === String(distName).toLowerCase() : false;
    
    let fillColor = '#3b82f6';
    if (selectedVariable === 'temperature' || selectedVariable === 'heat') {
      fillColor = distData.distTemp > 32.5 ? '#ef4444' : (distData.distTemp > 30.0 ? '#f59e0b' : '#38bdf8');
    } else if (selectedVariable === 'rainfall' || selectedVariable === 'rain') {
      fillColor = distData.distRain > 4.5 ? '#06b6d4' : (distData.distRain > 2.0 ? '#3b82f6' : '#64748b');
    } else if (selectedVariable === 'wind') {
      fillColor = distData.windSpeed > 18 ? '#a855f7' : (distData.windSpeed > 14 ? '#3b82f6' : '#06b6d4');
    } else if (selectedVariable === 'clouds') {
      fillColor = distData.cloudCoverPct > 70 ? '#94a3b8' : (distData.cloudCoverPct > 40 ? '#64748b' : '#38bdf8');
    } else {
      fillColor = distData.distRain > 3 ? '#0891b2' : '#f59e0b';
    }

    return {
      fillColor: fillColor,
      fillOpacity: isSelected ? 0.8 : 0.32,
      color: isSelected ? '#ffffff' : '#38bdf8',
      weight: isSelected ? 3.5 : 1.2,
      dashArray: isSelected ? '' : '3',
    };
  };

  const onEachLeafletDistrict = (feature, layer) => {
    const distName = feature?.properties?.name || 'District';
    const distData = getDistrictClimateData(distName);

    layer.on({
      mouseover: (e) => {
        const target = e.target;
        target.setStyle({ fillOpacity: 0.8, weight: 3.5, color: '#ffffff' });
      },
      mouseout: (e) => {
        const target = e.target;
        target.setStyle(getLeafletDistrictStyle(feature));
      },
      click: () => {
        const match = districts.find(d => d?.name && String(d.name).toLowerCase().includes(String(distName).toLowerCase()));
        if (setActiveDistrict) setActiveDistrict(match || distData);
      }
    });

    layer.bindTooltip(`
      <div style="font-family: Inter, sans-serif; font-size: 11px; padding: 4px 8px;">
        <span style="font-size: 14px;">${distData.condition?.icon || '⛅'}</span> <strong style="color: #0284c7;">${distName} District</strong><br/>
        <span style="color: #475569; font-size: 10px;">Temp: ${distData.distTemp}°C | Rain: ${distData.distRain}mm | Wind: ${distData.windSpeed}km/h</span>
      </div>
    `, { sticky: true });
  };

  const activeDistrictData = getDistrictClimateData(activeDistrict?.name || 'Raipur');

  return (
    <div className="space-y-3">
      {/* Top Search & Controls Panel */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-cyan-400" />
              Regional Weather Map
            </h3>
            <p className="text-xs text-slate-400">
              Select or search any of the 33 districts to inspect live weather conditions.
            </p>
          </div>

          {/* District Search Box */}
          <div className="relative w-full sm:w-72">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search district (e.g. Raipur, Bastar)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 text-slate-100 text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>

            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-30 max-h-48 overflow-y-auto divide-y divide-slate-800 font-sans text-xs">
                {searchResults.length > 0 ? (
                  searchResults.map((item) => {
                    const cData = getDistrictClimateData(item.name);
                    return (
                      <button
                        key={item.id || item.name}
                        onClick={() => handleSelectLocation(item)}
                        className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between text-slate-200 cursor-pointer"
                      >
                        <span className="font-semibold text-cyan-300 flex items-center gap-1">
                          <span>{cData.condition?.icon || '⛅'}</span> {item.name}
                        </span>
                        <span className="text-[10px] text-slate-400">{cData.distTemp}°C • {cData.distRain} mm</span>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-2.5 text-[11px] text-slate-400 text-center">No matching district found</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
          {/* 4 Weather Map Layers */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
            <span className="text-[10px] text-slate-400 uppercase font-bold px-2 shrink-0">Layer:</span>
            
            <button
              onClick={() => setSelectedVariable('temperature')}
              className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                selectedVariable === 'temperature' || selectedVariable === 'heat'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" />
              <span>Temperature</span>
            </button>

            <button
              onClick={() => setSelectedVariable('rainfall')}
              className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                selectedVariable === 'rainfall' || selectedVariable === 'rain'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              <span>Rainfall</span>
            </button>

            <button
              onClick={() => setSelectedVariable('wind')}
              className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                selectedVariable === 'wind'
                  ? 'bg-purple-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Wind</span>
            </button>

            <button
              onClick={() => setSelectedVariable('clouds')}
              className={`px-3 py-1 rounded-lg font-medium flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                selectedVariable === 'clouds'
                  ? 'bg-slate-300 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Clouds</span>
            </button>
          </div>

          {/* Reset & Engine Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToState}
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer text-xs font-medium"
              title="Reset map view to whole state"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Reset View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Display Container */}
      <div className="relative w-full h-[580px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
        {mapEngine === 'google' ? (
          <div ref={mapContainerRef} className="w-full h-full" />
        ) : (
          <MapContainer
            bounds={CHHATTISGARH_BOUNDS}
            boundsOptions={{ padding: [20, 20] }}
            zoomControl={false}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <MapResizeHandler />
            <LeafletBoundsController
              targetCenter={leafletTargetCenter}
              targetZoom={10}
              resetTrigger={leafletResetCount}
            />
            <ZoomControl position="bottomright" />

            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              maxZoom={16}
            />

            <GeoJSON
              data={CHHATTISGARH_STATE_GEOJSON}
              style={{
                fillColor: '#0284c7',
                fillOpacity: 0.04,
                color: '#38bdf8',
                weight: 3.5,
              }}
            />

            <GeoJSON
              key={`districts-leaflet-${selectedVariable}-${activeStateMode}-${isScenario}-${activeDistrict?.name}`}
              data={CHHATTISGARH_DISTRICTS_GEOJSON}
              style={getLeafletDistrictStyle}
              onEachFeature={onEachLeafletDistrict}
            />

            {/* Weather condition markers */}
            {CHHATTISGARH_DISTRICTS_GEOJSON.features.map((f) => {
              if (!f.properties?.center) return null;
              const dData = getDistrictClimateData(f.properties.name);
              return (
                <Marker
                  key={`label-${f.properties.id || f.properties.name}`}
                  position={f.properties.center}
                  icon={createDistrictLabelIcon(f.properties.name || 'District', dData.condition?.icon)}
                  interactive={false}
                />
              );
            })}

            {districts.map((dist) => {
              if (!dist || !dist.lat || !dist.lon) return null;
              const distData = getDistrictClimateData(dist.name);
              const isSelected = (activeDistrict?.id && dist.id === activeDistrict.id) || 
                                 (activeDistrict?.name && dist.name === activeDistrict.name);
              return (
                <CircleMarker
                  key={dist.id || dist.name}
                  center={[dist.lat, dist.lon]}
                  radius={isSelected ? 10 : 6}
                  pathOptions={{
                    color: isSelected ? '#ffffff' : '#0284c7',
                    fillColor: selectedVariable === 'rainfall' ? '#06b6d4' : (selectedVariable === 'wind' ? '#a855f7' : '#f59e0b'),
                    fillOpacity: 0.9,
                    weight: isSelected ? 3 : 1.5
                  }}
                  eventHandlers={{
                    click: () => {
                      if (setActiveDistrict) setActiveDistrict(dist);
                    }
                  }}
                >
                  <Popup>
                    <div className="p-2 space-y-2 font-sans text-xs min-w-[220px]">
                      <div className="font-bold text-cyan-600 border-b border-slate-200 pb-1 flex justify-between items-center">
                        <span className="flex items-center gap-1.5 font-heading text-sm">
                          <span className="text-lg" role="img" aria-label={distData.condition?.ariaLabel}>{distData.condition?.icon || '⛅'}</span>
                          {dist.name} District
                        </span>
                      </div>
                      <div className="space-y-1 text-[11px] text-slate-700 font-mono">
                        <div>Temp: <strong className="text-amber-600">{distData.distTemp} °C</strong></div>
                        <div>Rain: <strong className="text-cyan-600">{distData.distRain} mm</strong></div>
                        <div>Wind: <strong className="text-purple-600">{distData.windSpeed} km/h</strong></div>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        )}

        {/* Selected District Floating Badge */}
        <div className="absolute top-4 left-4 z-10 bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-cyan-500/30 text-xs shadow-2xl space-y-1 max-w-xs">
          <div className="flex items-center gap-2 font-mono font-bold text-cyan-400 text-xs">
            <span className="text-xl" role="img" aria-label={activeDistrictData.condition?.ariaLabel}>{activeDistrictData.condition?.icon || '⛅'}</span>
            <span>{activeDistrictData.name?.toUpperCase()}: {activeDistrictData.condition?.label?.toUpperCase()}</span>
          </div>
          <p className="text-[11px] text-slate-300 font-sans leading-tight">
            Temp: <strong>{activeDistrictData.distTemp} °C</strong> | Rain: <strong>{activeDistrictData.distRain} mm</strong> | Wind: <strong>{activeDistrictData.windSpeed} km/h</strong>
          </p>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-6 left-4 z-10 bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs shadow-2xl space-y-1.5 max-w-xs">
          <div className="font-mono text-[10px] font-bold text-slate-300 uppercase">
            Active Layer: {selectedVariable.toUpperCase()}
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
            <span className="w-3 h-3 rounded-full bg-cyan-500 inline-block"></span>
            <span>Low / Moderate</span>
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block ml-2"></span>
            <span>Elevated</span>
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block ml-2"></span>
            <span>Extreme</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleClimateMap;
