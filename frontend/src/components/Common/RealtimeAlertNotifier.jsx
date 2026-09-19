import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getAlerts } from '../../services/api';
import { 
  Bell, 
  AlertTriangle, 
  Flame, 
  CloudRain, 
  Droplets, 
  X, 
  ArrowRight, 
  Volume2, 
  VolumeX,
  ShieldAlert
} from 'lucide-react';

export const RealtimeAlertNotifier = ({ setActiveDistrict, setActiveTab, onNewAlert }) => {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [toastAlert, setToastAlert] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const prevAlertKeysRef = useRef(new Set());
  const initialLoadRef = useRef(true);

  // Sound effect generator for real-time hazard threshold breach
  const playAlertSound = useCallback((level) => {
    if (isMuted) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = level === 'Severe' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(level === 'Severe' ? 580 : 440, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio context might be restricted before user interaction
    }
  }, [isMuted]);

  const pollAlerts = useCallback(async () => {
    const res = await getAlerts();
    if (res.success && res.data) {
      const rawAlerts = res.data.alerts || res.data.district_alerts || [];
      const triggeredDistricts = rawAlerts.filter(d => d.has_alerts && d.alerts?.length > 0);
      setActiveAlerts(triggeredDistricts);

      // Collect all active alert identifiers (e.g. "raipur-heatwave", "bastar-flood")
      const currentKeys = new Set();
      const newlyDetected = [];

      triggeredDistricts.forEach(d => {
        d.alerts.forEach(a => {
          const key = `${d.district?.id || d.id || d.name}-${a.type}-${a.level}`;
          currentKeys.add(key);
          if (!prevAlertKeysRef.current.has(key)) {
            newlyDetected.push({ district: d.district || d, alert: a });
          }
        });
      });

      // If new condition / threshold breach detected after initial mount
      if (newlyDetected.length > 0) {
        const topAlert = newlyDetected[0];
        setToastAlert(topAlert);
        if (!initialLoadRef.current) {
          playAlertSound(topAlert.alert.level);
        }
        if (onNewAlert) onNewAlert(topAlert);
      }

      prevAlertKeysRef.current = currentKeys;
      initialLoadRef.current = false;
    }
  }, [playAlertSound, onNewAlert]);

  // Initial and periodic polling every 12 seconds
  useEffect(() => {
    pollAlerts();
    const interval = setInterval(pollAlerts, 12000);
    return () => clearInterval(interval);
  }, [pollAlerts]);

  // Auto-dismiss single toast after 8 seconds
  useEffect(() => {
    if (!toastAlert) return;
    const timer = setTimeout(() => {
      setToastAlert(null);
    }, 8000);
    return () => clearTimeout(timer);
  }, [toastAlert]);

  const handleInspectDistrict = (district) => {
    if (setActiveDistrict) setActiveDistrict(district);
    if (setActiveTab) setActiveTab('digital-twin');
    setToastAlert(null);
    setExpanded(false);
  };

  const handleOpenAlertsCenter = () => {
    if (setActiveTab) setActiveTab('alerts');
    setToastAlert(null);
    setExpanded(false);
  };

  return (
    <>
      {/* 1. Real-Time Floating Notification Toast for Condition Breaches */}
      {toastAlert && (
        <div className="fixed bottom-14 right-6 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300">
          <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex flex-col space-y-2 ${
            toastAlert.alert.level === 'Severe'
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-100 shadow-rose-950/50'
              : 'bg-amber-950/90 border-amber-500/50 text-amber-100 shadow-amber-950/50'
          }`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-xs">
                <span className="p-1.5 rounded-lg bg-black/30 border border-white/10">
                  {toastAlert.alert.type === 'heatwave' ? <Flame className="w-4 h-4 text-amber-400" /> :
                   toastAlert.alert.type === 'flood' ? <CloudRain className="w-4 h-4 text-cyan-400" /> :
                   <Droplets className="w-4 h-4 text-orange-400" />}
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-extrabold">{toastAlert.district.name}</span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-black/40 border border-white/15">
                      {toastAlert.alert.level}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-normal">{toastAlert.alert.title}</div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title={isMuted ? 'Unmute Alerts' : 'Mute Alerts'}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setToastAlert(null)}
                  className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-200 leading-snug">
              {toastAlert.alert.message}
            </p>

            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                onClick={() => handleInspectDistrict(toastAlert.district)}
                className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-cyan-300 font-bold rounded-lg border border-cyan-500/30 flex items-center gap-1 transition-colors cursor-pointer text-[11px]"
              >
                <span>Inspect on Map</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                onClick={handleOpenAlertsCenter}
                className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
              >
                All Hazards ({activeAlerts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Floating Persistent Risk Badge in Bottom Right */}
      {activeAlerts.length > 0 && (
        <div className="fixed bottom-4 right-6 z-40">
          <div className="relative">
            <button
              onClick={() => setExpanded(!expanded)}
              className="px-3 py-1.5 rounded-full bg-slate-900/95 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold shadow-xl backdrop-blur-md flex items-center gap-2 hover:bg-slate-800 transition-all cursor-pointer"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
              <span>LIVE ALERTS: {activeAlerts.length} DISTRICTS</span>
            </button>

            {expanded && (
              <div className="absolute bottom-10 right-0 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 space-y-3 animate-in fade-in duration-200 text-xs font-sans">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-slate-100 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" /> Active Weather Alerts
                  </span>
                  <button
                    onClick={() => setExpanded(false)}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 divide-y divide-slate-800/60">
                  {activeAlerts.map((d) => (
                    <div key={d.district?.id || d.id || d.name} className="pt-2 first:pt-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-cyan-300">{d.district?.name || d.name}</span>
                        <span className="text-[10px] font-mono text-amber-400">{d.temperature_c ?? d.temp}°C | {d.rainfall_mm ?? d.rain}mm</span>
                      </div>
                      {d.alerts?.map((a, i) => (
                        <div key={i} className="text-[11px] text-slate-300 flex items-center justify-between">
                          <span>{a.title}</span>
                          <button
                            onClick={() => handleInspectDistrict(d.district || d)}
                            className="text-[10px] text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleOpenAlertsCenter}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-center transition-colors cursor-pointer block text-xs"
                >
                  Open Full Alerts Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default RealtimeAlertNotifier;
