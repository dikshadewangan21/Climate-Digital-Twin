from fastapi import APIRouter, HTTPException, Query
from data_locations import DISTRICTS, BY_ID
from weather_service import live_weather

router = APIRouter(prefix="/weather", tags=["live weather"])

@router.get("/locations")
def locations():
    return {"state": "Chhattisgarh", "count": len(DISTRICTS), "locations": DISTRICTS}

@router.get("/district/{district_id}")
def district_weather(district_id: str):
    district = BY_ID.get(district_id.lower())
    if not district:
        raise HTTPException(404, "District not found")
    try:
        data = live_weather(district["lat"], district["lon"], past_days=7, forecast_days=8)
    except Exception as exc:
        raise HTTPException(502, f"Weather provider unavailable: {exc}")
    return {"source": "Open-Meteo Forecast API", "location": district, **data}

@router.get("/point")
def point_weather(
    latitude: float = Query(..., ge=17, le=25),
    longitude: float = Query(..., ge=79, le=85),
):
    try:
        data = live_weather(latitude, longitude, past_days=7, forecast_days=8)
    except Exception as exc:
        raise HTTPException(502, f"Weather provider unavailable: {exc}")
    return {"source": "Open-Meteo Forecast API", "latitude": latitude, "longitude": longitude, **data}
