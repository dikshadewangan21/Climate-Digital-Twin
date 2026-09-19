/**
 * Weather & Climate Condition Utility
 * Dynamically computes weather emojis and neutral labels based on actual backend climate data.
 */

export function getWeatherCondition(data) {
  if (!data) {
    return {
      icon: "🌤️",
      label: "Pleasant",
      type: "pleasant",
      ariaLabel: "Pleasant climate condition",
      color: "text-amber-400"
    };
  }

  const rain = typeof data.rainfall_mm === 'number' ? data.rainfall_mm : (typeof data.rain === 'number' ? data.rain : 0);
  const temp = typeof data.temperature_c === 'number' ? data.temperature_c : (typeof data.temp === 'number' ? data.temp : 25.0);

  // 1. Rainfall Priority (When meaningful rainfall > 0)
  if (rain >= 50.0) {
    return {
      icon: "⛈️",
      label: "Very Heavy Rain",
      type: "very_heavy_rain",
      ariaLabel: "Very heavy rain weather condition",
      color: "text-cyan-400"
    };
  } else if (rain >= 15.0) {
    return {
      icon: "🌧️",
      label: "Heavy Rain",
      type: "heavy_rain",
      ariaLabel: "Heavy rain weather condition",
      color: "text-cyan-400"
    };
  } else if (rain >= 2.5) {
    return {
      icon: "🌧️",
      label: "Rain",
      type: "rain",
      ariaLabel: "Rainy weather condition",
      color: "text-blue-400"
    };
  } else if (rain > 0.0) {
    return {
      icon: "🌦️",
      label: "Light Rain",
      type: "light_rain",
      ariaLabel: "Light rain weather condition",
      color: "text-sky-300"
    };
  }

  // 2. Thermal Conditions (When rainfall == 0)
  if (temp >= 40.0) {
    return {
      icon: "🔥",
      label: "Extreme Heat",
      type: "extreme_heat",
      ariaLabel: "Extreme heat climate condition",
      color: "text-rose-500"
    };
  } else if (temp >= 32.0) {
    return {
      icon: "🥵",
      label: "Hot",
      type: "hot",
      ariaLabel: "Hot climate condition",
      color: "text-amber-500"
    };
  } else if (temp >= 25.0) {
    return {
      icon: "☀️",
      label: "Warm",
      type: "warm",
      ariaLabel: "Warm sunny climate condition",
      color: "text-yellow-400"
    };
  } else if (temp >= 15.0) {
    return {
      icon: "🌤️",
      label: "Pleasant",
      type: "pleasant",
      ariaLabel: "Pleasant mild climate condition",
      color: "text-emerald-400"
    };
  } else {
    return {
      icon: "🥶",
      label: "Cold",
      type: "cold",
      ariaLabel: "Cold climate condition",
      color: "text-cyan-300"
    };
  }
}
