from fastapi import APIRouter
from pydantic import BaseModel, Field
from data_locations import BY_ID
from weather_service import live_weather

router = APIRouter(prefix="/simulate", tags=["digital twin"])

class SimulationRequest(BaseModel):
    district_id: str = "raipur"
    rainfall_change_mm: float = Field(0, ge=-500, le=500)
    temperature_change_c: float = Field(0, ge=-20, le=20)

@router.post("")
def simulate_climate(data: SimulationRequest):
    district = BY_ID.get(data.district_id.lower())
    if not district:
        return {"error": "District not found"}
    weather = live_weather(district["lat"], district["lon"], past_days=0, forecast_days=1)
    current = weather.get("current", {})
    baseline_rain = float(current.get("precipitation") or 0)
    baseline_temp = float(current.get("temperature_2m") or 0)
    rain = max(0.0, baseline_rain + data.rainfall_change_mm)
    temp = baseline_temp + data.temperature_change_c
    if rain == 0: rain_condition = "Dry"
    elif rain < 2.5: rain_condition = "Light rain"
    elif rain < 7.5: rain_condition = "Moderate rain"
    else: rain_condition = "Heavy rain"
    if temp < 20: temp_condition = "Cool"
    elif temp < 30: temp_condition = "Comfortable/normal"
    elif temp < 35: temp_condition = "Hot"
    else: temp_condition = "Very hot"
    return {
        "source": "Live baseline + user-defined scenario",
        "location": district,
        "baseline": {"rainfall_mm": round(baseline_rain,2), "temperature_c": round(baseline_temp,2)},
        "scenario": {"rainfall_change_mm": data.rainfall_change_mm, "temperature_change_c": data.temperature_change_c},
        "simulated": {"rainfall_mm": round(rain,2), "temperature_c": round(temp,2)},
        "interpretation": {"rainfall_condition": rain_condition, "temperature_condition": temp_condition},
    }
