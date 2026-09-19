import { CHHATTISGARH_DISTRICTS } from '../data/chhattisgarhGrid';
import { getWeatherCondition } from './weatherUtils';

/**
 * Generates dynamic 7-day auto-regressive forecast series for any selected district
 * Incorporates district baseline climate data, spatial coordinates, and backend PyTorch predictions.
 */
export function getDistrict7DayForecast(district, backendLive7Days = null) {
  if (!district) district = CHHATTISGARH_DISTRICTS[0];

  const baseTemp = district.baseTemp || 32.0;
  const baseRain = district.baseRain || 3.0;

  // Day variation multipliers to create realistic auto-regressive temporal evolution
  const variations = [
    { tempOff: 0.0, rainMult: 1.0, humidity: 62 },
    { tempOff: -0.4, rainMult: 1.25, humidity: 68 },
    { tempOff: -0.7, rainMult: 1.6, humidity: 74 },
    { tempOff: -0.5, rainMult: 1.45, humidity: 70 },
    { tempOff: 0.1, rainMult: 0.9, humidity: 64 },
    { tempOff: 0.6, rainMult: 0.6, humidity: 58 },
    { tempOff: 0.9, rainMult: 0.4, humidity: 55 },
  ];

  return variations.map((v, index) => {
    let dayTemp = +(baseTemp + v.tempOff).toFixed(2);
    let dayRain = +Math.max(0, baseRain * v.rainMult).toFixed(2);

    // If backend forecast is provided, calibrate with model delta
    if (backendLive7Days && backendLive7Days[index]) {
      const backendDeltaT = backendLive7Days[index].temperature_c - 24.85;
      const backendDeltaR = backendLive7Days[index].rainfall_mm;
      dayTemp = +(dayTemp + backendDeltaT * 0.3).toFixed(2);
      dayRain = +(dayRain + backendDeltaR * 0.4).toFixed(2);
    }

    const cond = getWeatherCondition({ rainfall_mm: dayRain, temperature_c: dayTemp });
    const heatIndex = calculateHeatIndex(dayTemp, v.humidity);

    return {
      day: index + 1,
      dayLabel: `Day ${index + 1}`,
      temperature_c: dayTemp,
      temp_min: +(dayTemp - 2.8).toFixed(1),
      temp_max: +(dayTemp + 3.2).toFixed(1),
      rainfall_mm: dayRain,
      humidity: v.humidity,
      heat_index: heatIndex,
      condition: cond,
      wind_speed_kmh: +(12 + (index * 1.5) % 8).toFixed(1),
      uv_index: dayTemp > 34 ? 9 : (dayTemp > 30 ? 7 : 5)
    };
  });
}

/**
 * Calculates Heat Index / Apparent Temperature (°C)
 * Standard Rothfusz regression adaptation
 */
export function calculateHeatIndex(tempC, humidityPct) {
  const T = (tempC * 9) / 5 + 32; // Convert to F
  const R = humidityPct;

  let HI = 0.5 * (T + 61.0 + ((T - 68.0) * 1.2) + (R * 0.094));

  if (HI >= 80) {
    HI = -42.379 + 2.04901523 * T + 10.14333127 * R
      - 0.22475541 * T * R - 0.00683783 * T * T
      - 0.05481717 * R * R + 0.00122874 * T * T * R
      + 0.00085282 * T * R * R - 0.00000199 * T * T * R * R;
  }

  const hiCelsius = ((HI - 32) * 5) / 9;
  return +hiCelsius.toFixed(1);
}

/**
 * Computes Sectoral Impacts for Scenario Analysis & Digital Twin
 */
export function calculateSectorImpacts(temp, rain) {
  // 1. Agriculture (Paddy / Rice in Chhattisgarh)
  // Optimal temp: 25-32°C, Optimal rain: 3-8 mm daily
  let cropStressScore = 0; // 0 (Ideal) to 100 (Critical)
  let cropNote = "Optimal growing conditions for Kharif crops";

  if (temp > 35) {
    cropStressScore += (temp - 35) * 12;
    cropNote = "High thermal stress causing pollen sterility risk";
  } else if (temp < 18) {
    cropStressScore += (18 - temp) * 8;
    cropNote = "Cold shock slowing vegetative development";
  }

  if (rain < 1.0) {
    cropStressScore += 35;
    cropNote = cropStressScore > 50 ? "Severe dry spell requiring supplemental irrigation" : "Mild soil moisture deficit";
  } else if (rain > 15.0) {
    cropStressScore += Math.min(45, (rain - 15) * 3);
    cropNote = "Waterlogging risk in low-lying paddy basins";
  }
  cropStressScore = Math.min(100, Math.max(5, Math.round(cropStressScore)));

  // 2. Public Health & Heat Stress
  const heatIndex = calculateHeatIndex(temp, 65);
  let healthCategory = "Low Risk";
  let healthRiskColor = "text-emerald-400";
  let healthScore = 15;

  if (heatIndex >= 45) {
    healthCategory = "Extreme Danger (Heatstroke Imminent)";
    healthRiskColor = "text-rose-500";
    healthScore = 95;
  } else if (heatIndex >= 38) {
    healthCategory = "Danger (Heat Exhaustion Likely)";
    healthRiskColor = "text-orange-400";
    healthScore = 75;
  } else if (heatIndex >= 32) {
    healthCategory = "Caution (Fatigue with Prolonged Exposure)";
    healthRiskColor = "text-amber-400";
    healthScore = 50;
  }

  // 3. Hydrology & Water Resources
  // Base reservoir inflow proxy index
  const runoffIndex = +(rain * 1.4 + (temp > 33 ? -2 : 0)).toFixed(1);
  let reservoirStatus = "Stable Inflow";
  if (rain > 12) reservoirStatus = "Spillway Discharge Recommended";
  else if (rain < 0.5 && temp > 33) reservoirStatus = "Evaporative Loss Stress";

  // 4. Energy & Cooling Load Surge
  // Cooling Degree Index relative to 24°C base
  const coolingDegree = Math.max(0, +(temp - 24).toFixed(1));
  const gridSurgePct = Math.min(85, Math.round(coolingDegree * 4.8));

  return {
    agriculture: {
      stressScore: cropStressScore,
      status: cropStressScore > 60 ? "High Stress" : (cropStressScore > 35 ? "Moderate Stress" : "Favorable"),
      note: cropNote,
      sowingSuitability: Math.max(10, 100 - cropStressScore),
    },
    health: {
      heatIndex,
      category: healthCategory,
      score: healthScore,
      color: healthRiskColor,
    },
    hydrology: {
      runoffIndex,
      reservoirStatus,
      soilMoisturePct: Math.min(95, Math.max(15, Math.round(35 + rain * 6 - (temp - 25) * 1.5))),
    },
    energy: {
      coolingDegree,
      gridSurgePct,
      peakLoadWarning: gridSurgePct > 40,
    }
  };
}

/**
 * Statewide Early Warning & Risk Evaluator for all 33 districts
 */
export function generateStatewideAlerts(tempDelta = 0, rainMult = 1.0) {
  return CHHATTISGARH_DISTRICTS.map((district) => {
    const temp = +(district.baseTemp + tempDelta).toFixed(1);
    const rain = +Math.max(0, district.baseRain * rainMult).toFixed(1);
    const heatIndex = calculateHeatIndex(temp, 65);

    const alerts = [];

    // Heatwave check
    if (temp >= 38.0 || heatIndex >= 42.0) {
      alerts.push({
        type: 'heatwave',
        level: temp >= 40.0 ? 'Severe' : 'Warning',
        title: `${temp >= 40 ? 'Severe Heatwave Alert' : 'Heat Advisory'}`,
        message: `Ambient temp ${temp}°C (Heat index ${heatIndex}°C). Advise restricted outdoor labor.`,
        badgeColor: temp >= 40 ? 'bg-rose-950 text-rose-300 border-rose-500/40' : 'bg-amber-950 text-amber-300 border-amber-500/40'
      });
    }

    // Heavy Rainfall / Flash Flood check
    if (rain >= 15.0) {
      alerts.push({
        type: 'flood',
        level: rain >= 30.0 ? 'Severe' : 'Alert',
        title: `${rain >= 30 ? 'Flash Flood Warning' : 'Heavy Rainfall Alert'}`,
        message: `Expected 24h precipitation: ${rain} mm. Water stagnation in catchment zones.`,
        badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
      });
    }

    // Drought / Dry Spell check
    if (rain < 0.2 && temp >= 34.0) {
      alerts.push({
        type: 'drought',
        level: 'Advisory',
        title: 'Soil Moisture Deficit',
        message: `Consecutive dry conditions with ${temp}°C heat. Supplementary irrigation recommended.`,
        badgeColor: 'bg-orange-950 text-orange-300 border-orange-500/40'
      });
    }

    // Overall Risk Level
    let overallRisk = 'Normal';
    let riskColor = 'text-emerald-400';
    if (alerts.some(a => a.level === 'Severe')) {
      overallRisk = 'High';
      riskColor = 'text-rose-400';
    } else if (alerts.length > 0) {
      overallRisk = 'Moderate';
      riskColor = 'text-amber-400';
    }

    return {
      district,
      temp,
      rain,
      heatIndex,
      overallRisk,
      riskColor,
      alerts,
      hasAlerts: alerts.length > 0,
    };
  });
}
