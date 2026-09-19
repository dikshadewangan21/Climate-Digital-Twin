/**
 * Export utilities for ClimateTwin AI
 */

export function exportDistrictForecastCSV(district, forecastData) {
  if (!forecastData || forecastData.length === 0) return;

  const headers = [
    "Day Horizon",
    "District",
    "Latitude",
    "Longitude",
    "Temperature (°C)",
    "Min Temp (°C)",
    "Max Temp (°C)",
    "Rainfall (mm)",
    "Humidity (%)",
    "Heat Index (°C)",
    "Condition",
    "Wind Speed (km/h)",
    "UV Index"
  ];

  const rows = forecastData.map((d) => [
    d.day_label || d.dayLabel || `Day ${d.day}`,
    district.name,
    district.lat,
    district.lon,
    d.temperature_c,
    d.temp_min,
    d.temp_max,
    d.rainfall_mm,
    d.humidity,
    d.heat_index,
    d.condition?.label || "Normal",
    d.wind_speed_kmh,
    d.uv_index
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(val => `"${val}"`).join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `ClimateTwin_${district.name.replace(/\s+/g, "_")}_7Day_Forecast.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
