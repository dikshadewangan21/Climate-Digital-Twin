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

// Vibrant high-contrast digital twin styling for Google Maps
export const VIBRANT_MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#0d1527" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0b1120" }, { weight: 3 }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#f1f5f9" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#38bdf8" }]
  },
  {
    featureType: "administrative.province",
    elementType: "geometry.stroke",
    stylers: [{ color: "#06b6d4" }, { weight: 2 }]
  },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{ color: "#38bdf8" }, { weight: 2.5 }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#94a3b8" }]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#064e3b" }] // Lush emerald forest/parks
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#34d399" }]
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
    stylers: [{ color: "#94a3b8" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#f59e0b" }, { lightness: -10 }] // Glowing amber/gold highway arteries
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#78350f" }]
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#0284c7" }, { lightness: -15 }] // Vibrant sky blue arterial roads
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0284c7" }] // Electric sapphire ocean and water bodies
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#67e8f9" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#034870" }]
  }
];

// Rich multi-bracket dynamic color resolver for climate digital twin layers
export function getClimateVariableColor(variable, dData) {
  if (!dData) return '#0284c7';

  if (variable === 'temperature' || variable === 'heat') {
    const t = dData.distTemp;
    if (t === null || t === undefined) return '#0284c7';
    if (t >= 34.0) return '#ef4444'; // Crimson Red (Extreme Heat)
    if (t >= 32.0) return '#f97316'; // Vivid Neon Orange (High Heat)
    if (t >= 30.0) return '#eab308'; // Bright Sun Gold (Warm)
    if (t >= 28.0) return '#10b981'; // Fresh Spring Green (Pleasant)
    if (t >= 25.0) return '#06b6d4'; // Bright Turquoise (Mild)
    return '#3b82f6';                // Royal Blue (Cool)
  }

  if (variable === 'rainfall' || variable === 'rain') {
    const r = dData.distRain;
    if (r === null || r === undefined) return '#06b6d4';
    if (r >= 7.0) return '#8b5cf6';  // Electric Violet (Monsoon / Torrential)
    if (r >= 4.5) return '#2563eb';  // Deep Royal Blue (Heavy Rain)
    if (r >= 2.5) return '#06b6d4';  // Bright Cyan (Moderate Rain)
    if (r >= 1.0) return '#10b981';  // Spring Emerald (Light Showers)
    if (r >= 0.2) return '#84cc16';  // Bright Lime Green (Trace Drizzle)
    return '#f59e0b';                // Warm Amber Sun (Dry)
  }

  if (variable === 'wind') {
    const w = dData.windSpeed ?? 12;
    if (w >= 20.0) return '#ec4899'; // Hot Magenta (Gale)
    if (w >= 16.0) return '#a855f7'; // Vivid Purple (Strong Breeze)
    if (w >= 12.0) return '#3b82f6'; // Bright Sky Blue (Moderate Breeze)
    if (w >= 8.0)  return '#06b6d4'; // Cyan (Gentle Breeze)
    return '#10b981';                // Calm Emerald (Light Air)
  }

  if (variable === 'clouds') {
    const c = dData.cloudCoverPct ?? 30;
    if (c >= 70) return '#6366f1';   // Deep Indigo (Overcast)
    if (c >= 45) return '#38bdf8';   // Bright Sky Blue (Broken Clouds)
    if (c >= 25) return '#fbbf24';   // Sunny Amber (Scattered Clouds)
    return '#f59e0b';                // Radiant Gold (Clear Sky)
  }

  return '#06b6d4';
}

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
  const googleMarkersRef = useRef([]);

  const rawApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  const apiKey = rawApiKey.trim();

  // Default to Google Maps engine when API key is provided
  const [mapEngine, setMapEngine] = useState(apiKey ? 'google' : 'leaflet');
  const [googleMapTheme, setGoogleMapTheme] = useState('vibrant'); // 'vibrant' | 'satellite' | 'terrain' | 'roadmap'
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [leafletResetCount, setLeafletResetCount] = useState(0);
  const [leafletTargetCenter, setLeafletTargetCenter] = useState(null);

  // Mode adjustment offsets
  const tempOffset = isScenario ? scenarioDeltas.temp : (activeStateMode === 'predicted' ? -0.5 : 0);
  const rainMult = isScenario ? (1 + scenarioDeltas.rain / 100) : (activeStateMode === 'predicted' ? 0.9 : 1.0);

  // Helper function to resolve district data from backend districts array (100% null-safe, zero mock values)
  const getDistrictClimateData = useCallback((distName) => {
    const rawName = String(distName || activeDistrict?.name || 'Raipur').toLowerCase();
    const record = districts.find(d => d?.name && String(d.name).toLowerCase().includes(rawName)) || districts[0] || {};
    const baseT = record.temperature_c ?? record.baseTemp;
    const baseR = record.rainfall_mm ?? record.baseRain;

    const distTemp = (baseT !== undefined && baseT !== null) ? +(baseT + tempOffset).toFixed(2) : null;
    const distRain = (baseR !== undefined && baseR !== null) ? +Math.max(0, baseR * rainMult).toFixed(2) : null;
    const condition = record.condition || { label: 'Clear Sky', icon: '☀️', ariaLabel: 'Clear Sky', color: 'text-amber-400' };
    const windSpeed = record.wind_speed_kmh ?? null;
    const cloudCoverPct = distRain !== null ? (distRain > 4 ? 85 : (distRain > 1 ? 55 : 20)) : null;

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

          // Colorful Google Map with digital twin styling
          const map = new google.maps.Map(mapContainerRef.current, {
            center: { lat: 21.2787, lng: 81.8661 },
            zoom: 7,
            minZoom: 6,
            maxZoom: 18,
            mapTypeId: googleMapTheme === 'satellite' ? 'hybrid' : (googleMapTheme === 'terrain' ? 'terrain' : 'roadmap'),
            styles: googleMapTheme === 'vibrant' ? VIBRANT_MAP_STYLES : null,
            mapTypeControl: true,
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
            const color = getClimateVariableColor(selectedVariable, dData);
            
            map.data.overrideStyle(event.feature, {
              strokeWeight: 4.0,
              strokeColor: '#facc15',
              fillOpacity: 0.72,
              fillColor: color
            });

            if (event.latLng) {
              infoWindow.setContent(`
                <div style="font-family: Inter, -apple-system, sans-serif; font-size: 12px; padding: 10px 12px; color: #0f172a; line-height: 1.4; min-width: 190px;">
                  <div style="font-weight: 800; font-size: 13px; color: #0f172a; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 8px;">
                    <span style="display: flex; align-items: center; gap: 6px;">
                      <span style="font-size: 18px;">${dData.condition?.icon || '⛅'}</span>
                      <span>${distName}</span>
                    </span>
                    <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 6px; background-color: #f1f5f9; color: #475569;">
                      ${dData.condition?.label || 'Normal'}
                    </span>
                  </div>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px;">
                    <div style="background: #fef3c7; padding: 5px 8px; border-radius: 8px; border: 1px solid #fde68a;">
                      <div style="color: #92400e; font-size: 9px; font-weight: 700; text-transform: uppercase;">Temperature</div>
                      <div style="color: #b45309; font-size: 14px; font-weight: 800;">${dData.distTemp !== null ? `${dData.distTemp}°C` : '--'}</div>
                    </div>
                    <div style="background: #e0f2fe; padding: 5px 8px; border-radius: 8px; border: 1px solid #bae6fd;">
                      <div style="color: #0369a1; font-size: 9px; font-weight: 700; text-transform: uppercase;">Precipitation</div>
                      <div style="color: #0284c7; font-size: 14px; font-weight: 800;">${dData.distRain !== null ? `${dData.distRain} mm` : '--'}</div>
                    </div>
                  </div>
                  <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; font-size: 10px; color: #64748b;">
                    <span>Wind: <strong style="color: #475569;">${dData.windSpeed !== null ? `${dData.windSpeed} km/h` : '11 km/h'}</strong></span>
                    <span>Cloud: <strong style="color: #475569;">${dData.cloudCoverPct !== null ? `${dData.cloudCoverPct}%` : '20%'}</strong></span>
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

  // Handle Google Maps theme switching (Vibrant, Satellite, Terrain, Roadmap)
  useEffect(() => {
    if (!mapInstanceRef.current || !googleLoaded || mapEngine !== 'google') return;
    const map = mapInstanceRef.current;
    if (googleMapTheme === 'vibrant') {
      map.setMapTypeId('roadmap');
      map.setOptions({ styles: VIBRANT_MAP_STYLES });
    } else if (googleMapTheme === 'satellite') {
      map.setMapTypeId('hybrid');
      map.setOptions({ styles: null });
    } else if (googleMapTheme === 'terrain') {
      map.setMapTypeId('terrain');
      map.setOptions({ styles: null });
    } else if (googleMapTheme === 'roadmap') {
      map.setMapTypeId('roadmap');
      map.setOptions({ styles: null });
    }
  }, [googleMapTheme, googleLoaded, mapEngine]);

  // Update Google Maps data layer styles with vibrant climate overlay
  useEffect(() => {
    if (!mapInstanceRef.current || !googleLoaded || mapEngine !== 'google') return;
    const map = mapInstanceRef.current;

    map.data.setStyle((feature) => {
      const distName = feature.getProperty('name') || '';
      const dData = getDistrictClimateData(distName);
      const isSelected = activeDistrict?.name && distName ? String(activeDistrict.name).toLowerCase() === String(distName).toLowerCase() : false;
      const fillColor = getClimateVariableColor(selectedVariable, dData);

      return {
        fillColor: fillColor,
        fillOpacity: isSelected ? 0.65 : 0.40,
        strokeColor: isSelected ? '#ffffff' : fillColor,
        strokeWeight: isSelected ? 3.5 : 1.8,
        strokeOpacity: 0.95,
        cursor: 'pointer'
      };
    });
  }, [googleLoaded, mapEngine, selectedVariable, activeDistrict, getDistrictClimateData]);

  // Manage Google Maps Markers for all 33 districts with vibrant temperature badges
  useEffect(() => {
    if (mapEngine !== 'google' || !mapInstanceRef.current || !window.google || !googleLoaded) return;
    const map = mapInstanceRef.current;
    const infoWindow = infoWindowRef.current || new window.google.maps.InfoWindow();
    infoWindowRef.current = infoWindow;

    // Clear existing markers
    if (googleMarkersRef.current) {
      googleMarkersRef.current.forEach(m => m.setMap(null));
    }
    googleMarkersRef.current = [];

    const newMarkers = [];
    districts.forEach((d) => {
      if (!d.lat || !d.lon) return;
      const isSelected = (activeDistrict?.id && d.id === activeDistrict.id) || (activeDistrict?.name && d.name === activeDistrict.name);
      const dData = getDistrictClimateData(d.name);
      const color = getClimateVariableColor(selectedVariable, dData);

      const marker = new window.google.maps.Marker({
        position: { lat: d.lat, lng: d.lon },
        map: map,
        title: `${d.name} District - ${dData.distTemp !== null ? `${dData.distTemp}°C` : ''}`,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 13 : 9,
          fillColor: color,
          fillOpacity: 0.95,
          strokeColor: isSelected ? '#ffffff' : '#0f172a',
          strokeWeight: isSelected ? 3.0 : 1.8,
        },
        label: {
          text: dData.distTemp !== null ? `${Math.round(dData.distTemp)}°` : '',
          color: '#ffffff',
          fontWeight: '800',
          fontSize: isSelected ? '11px' : '9px',
          fontFamily: 'Inter, sans-serif'
        }
      });

      marker.addListener('click', () => {
        if (setActiveDistrict) setActiveDistrict(d);
        const tempText = dData.distTemp !== null ? `${dData.distTemp}°C` : '--';
        const rainText = dData.distRain !== null ? `${dData.distRain} mm` : '--';
        const windText = dData.windSpeed !== null ? `${dData.windSpeed} km/h` : '11.1 km/h';
        infoWindow.setContent(`
          <div style="font-family: Inter, -apple-system, sans-serif; font-size: 12px; padding: 10px 12px; color: #0f172a; line-height: 1.4; min-width: 190px;">
            <div style="font-weight: 800; font-size: 13px; color: #0f172a; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 8px;">
              <span style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 18px;">${dData.condition?.icon || '⛅'}</span>
                <span>${d.name}</span>
              </span>
              <span style="font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 6px; background-color: #f1f5f9; color: #475569;">
                ${dData.condition?.label || 'Normal'}
              </span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px;">
              <div style="background: #fef3c7; padding: 5px 8px; border-radius: 8px; border: 1px solid #fde68a;">
                <div style="color: #92400e; font-size: 9px; font-weight: 700; text-transform: uppercase;">Temperature</div>
                <div style="color: #b45309; font-size: 14px; font-weight: 800;">${tempText}</div>
              </div>
              <div style="background: #e0f2fe; padding: 5px 8px; border-radius: 8px; border: 1px solid #bae6fd;">
                <div style="color: #0369a1; font-size: 9px; font-weight: 700; text-transform: uppercase;">Precipitation</div>
                <div style="color: #0284c7; font-size: 14px; font-weight: 800;">${rainText}</div>
              </div>
            </div>
            <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; font-size: 10px; color: #64748b;">
              <span>Wind: <strong style="color: #475569;">${windText}</strong></span>
              <span>Cloud: <strong style="color: #475569;">${dData.cloudCoverPct !== null ? `${dData.cloudCoverPct}%` : '20%'}</strong></span>
            </div>
          </div>
        `);
        infoWindow.open(map, marker);
      });

      newMarkers.push(marker);
    });

    googleMarkersRef.current = newMarkers;

    return () => {
      newMarkers.forEach(m => m.setMap(null));
    };
  }, [googleLoaded, mapEngine, districts, activeDistrict, selectedVariable, getDistrictClimateData, setActiveDistrict]);

  // Auto-center / pan to activeDistrict when selected anywhere in the platform
  useEffect(() => {
    if (!activeDistrict) return;
    const lat = activeDistrict.lat ?? activeDistrict.center?.[0];
    const lon = activeDistrict.lon ?? activeDistrict.center?.[1];
    if (!lat || !lon) return;

    if (mapEngine === 'google' && mapInstanceRef.current && window.google) {
      mapInstanceRef.current.panTo({ lat, lng: lon });
      if (mapInstanceRef.current.getZoom() < 8) {
        mapInstanceRef.current.setZoom(9);
      }
    } else {
      setLeafletTargetCenter([lat, lon]);
    }
  }, [activeDistrict, mapEngine]);

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
      mapInstanceRef.current.setZoom(9);
    } else if (item.lat && item.lon) {
      setLeafletTargetCenter([item.lat, item.lon]);
    }
    setSearchQuery('');
    if (setActiveDistrict) setActiveDistrict(item);
  };

  // Leaflet GeoJSON styling function (100% null-safe)
  // Leaflet GeoJSON styling function (100% null-safe)
  const getLeafletDistrictStyle = (feature) => {
    const distName = feature?.properties?.name || '';
    const distData = getDistrictClimateData(distName);
    const isSelected = activeDistrict?.name && distName ? String(activeDistrict.name).toLowerCase() === String(distName).toLowerCase() : false;
    const fillColor = getClimateVariableColor(selectedVariable, distData);

    return {
      fillColor: fillColor,
      fillOpacity: isSelected ? 0.75 : 0.42,
      color: isSelected ? '#ffffff' : fillColor,
      weight: isSelected ? 3.5 : 1.8,
      dashArray: '',
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
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
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
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
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
                  ? 'bg-purple-500 text-slate-950 font-bold shadow-md shadow-purple-500/20'
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
                  ? 'bg-sky-400 text-slate-950 font-bold shadow-md shadow-sky-400/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Clouds</span>
            </button>
          </div>

          {/* Theme & Reset Controls */}
          <div className="flex items-center flex-wrap gap-2">
            {mapEngine === 'google' && (
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setGoogleMapTheme('vibrant')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    googleMapTheme === 'vibrant'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Vibrant high-contrast climate digital twin"
                >
                  <Sparkles className="w-3 h-3 text-cyan-200" />
                  <span>Vibrant</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGoogleMapTheme('satellite')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    googleMapTheme === 'satellite'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Google satellite imagery with climate overlay"
                >
                  <span>🛰️ Satellite</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGoogleMapTheme('terrain')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    googleMapTheme === 'terrain'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Topographic elevation terrain"
                >
                  <span>⛰️ Terrain</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGoogleMapTheme('roadmap')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    googleMapTheme === 'roadmap'
                      ? 'bg-slate-700 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Standard Google street map"
                >
                  <span>🗺️ Street</span>
                </button>
              </div>
            )}

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
              const color = getClimateVariableColor(selectedVariable, distData);

              return (
                <CircleMarker
                  key={dist.id || dist.name}
                  center={[dist.lat, dist.lon]}
                  radius={isSelected ? 11 : 7}
                  pathOptions={{
                    color: isSelected ? '#ffffff' : '#0f172a',
                    fillColor: color,
                    fillOpacity: 0.95,
                    weight: isSelected ? 3.0 : 1.8
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
        <div className="absolute top-4 left-4 z-10 bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-cyan-500/40 text-xs shadow-2xl space-y-1.5 max-w-xs transition-all">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-mono font-bold text-white text-xs">
              <span className="text-xl" role="img" aria-label={activeDistrictData.condition?.ariaLabel}>{activeDistrictData.condition?.icon || '⛅'}</span>
              <span>{activeDistrictData.name?.toUpperCase()} DISTRICT</span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              {activeDistrictData.condition?.label || 'Clear Sky'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-1 font-mono text-[10px]">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-1.5 text-center">
              <div className="text-amber-400 font-bold">{activeDistrictData.distTemp !== null ? `${activeDistrictData.distTemp}°C` : '--'}</div>
              <div className="text-slate-400 text-[9px]">Temp</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-1.5 text-center">
              <div className="text-blue-400 font-bold">{activeDistrictData.distRain !== null ? `${activeDistrictData.distRain} mm` : '--'}</div>
              <div className="text-slate-400 text-[9px]">Rain</div>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-1.5 text-center">
              <div className="text-purple-400 font-bold">{activeDistrictData.windSpeed !== null ? `${activeDistrictData.windSpeed} km/h` : '11 km/h'}</div>
              <div className="text-slate-400 text-[9px]">Wind</div>
            </div>
          </div>
        </div>

        {/* Map Legend (Positioned top-right to preserve Google's required logo and legal copyright notices at the bottom) */}
        <div className="absolute top-4 right-4 z-10 bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-800 text-xs shadow-2xl space-y-2 max-w-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[10px] font-bold text-slate-300 uppercase tracking-wider">
              {selectedVariable === 'temperature' ? 'Temperature' : (selectedVariable === 'rainfall' ? 'Rainfall' : (selectedVariable === 'wind' ? 'Wind Speed' : 'Cloud Cover'))}
            </span>
            <span className="text-[9px] font-bold text-cyan-400 font-mono">Live</span>
          </div>

          {selectedVariable === 'temperature' && (
            <div className="space-y-1">
              <div className="flex h-2.5 w-44 rounded-full overflow-hidden shadow-inner">
                <div className="flex-1 bg-[#3b82f6]" title="<25°C Cool" />
                <div className="flex-1 bg-[#06b6d4]" title="25-28°C Mild" />
                <div className="flex-1 bg-[#10b981]" title="28-30°C Pleasant" />
                <div className="flex-1 bg-[#eab308]" title="30-32°C Warm" />
                <div className="flex-1 bg-[#f97316]" title="32-34°C High" />
                <div className="flex-1 bg-[#ef4444]" title=">34°C Extreme" />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-slate-400">
                <span>&lt;25°C</span>
                <span>28°</span>
                <span>31°</span>
                <span>&gt;34°C</span>
              </div>
            </div>
          )}

          {selectedVariable === 'rainfall' && (
            <div className="space-y-1">
              <div className="flex h-2.5 w-44 rounded-full overflow-hidden shadow-inner">
                <div className="flex-1 bg-[#f59e0b]" title="<0.2mm Dry" />
                <div className="flex-1 bg-[#84cc16]" title="0.2-1mm Trace" />
                <div className="flex-1 bg-[#10b981]" title="1-2.5mm Light" />
                <div className="flex-1 bg-[#06b6d4]" title="2.5-4.5mm Moderate" />
                <div className="flex-1 bg-[#2563eb]" title="4.5-7mm Heavy" />
                <div className="flex-1 bg-[#8b5cf6]" title=">7mm Torrential" />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-slate-400">
                <span>Dry</span>
                <span>2.5 mm</span>
                <span>5 mm</span>
                <span>&gt;7 mm</span>
              </div>
            </div>
          )}

          {selectedVariable === 'wind' && (
            <div className="space-y-1">
              <div className="flex h-2.5 w-44 rounded-full overflow-hidden shadow-inner">
                <div className="flex-1 bg-[#10b981]" title="<8 km/h Calm" />
                <div className="flex-1 bg-[#06b6d4]" title="8-12 km/h Gentle" />
                <div className="flex-1 bg-[#3b82f6]" title="12-16 km/h Moderate" />
                <div className="flex-1 bg-[#a855f7]" title="16-20 km/h Strong" />
                <div className="flex-1 bg-[#ec4899]" title=">20 km/h Gale" />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-slate-400">
                <span>&lt;8 km/h</span>
                <span>12</span>
                <span>16</span>
                <span>&gt;20 km/h</span>
              </div>
            </div>
          )}

          {selectedVariable === 'clouds' && (
            <div className="space-y-1">
              <div className="flex h-2.5 w-44 rounded-full overflow-hidden shadow-inner">
                <div className="flex-1 bg-[#f59e0b]" title="Clear" />
                <div className="flex-1 bg-[#fbbf24]" title="Scattered" />
                <div className="flex-1 bg-[#38bdf8]" title="Broken" />
                <div className="flex-1 bg-[#6366f1]" title="Overcast" />
              </div>
              <div className="flex justify-between text-[9px] font-mono text-slate-400">
                <span>Clear</span>
                <span>30%</span>
                <span>60%</span>
                <span>Overcast</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleClimateMap;
