from fastapi import APIRouter, HTTPException, Query
from datetime import date, timedelta
import pandas as pd
from data_locations import BY_ID
from weather_service import historical_weather, daily_rows

router = APIRouter(prefix="/climate", tags=["historical climate"])

@router.get("/history/{district_id}")
def climate_history(
    district_id: str,
    years: int = Query(5, ge=1, le=20),
):
    district = BY_ID.get(district_id.lower())
    if not district:
        raise HTTPException(404, "District not found")
    end = date.today() - timedelta(days=6)
    start = end.replace(year=end.year - years)
    try:
        payload = historical_weather(district["lat"], district["lon"], start, end)
        rows = daily_rows(payload, district)
    except Exception as exc:
        raise HTTPException(502, f"Historical weather provider unavailable: {exc}")
    return {"source": "Open-Meteo ERA5-Land historical reanalysis", "location": district,
            "start_date": start.isoformat(), "end_date": end.isoformat(), "rows": rows}

@router.get("/summary/{district_id}")
def climate_summary(district_id: str, years: int = Query(5, ge=1, le=20)):
    district = BY_ID.get(district_id.lower())
    if not district:
        raise HTTPException(404, "District not found")
    end = date.today() - timedelta(days=6)
    start = end.replace(year=end.year - years)
    try:
        payload = historical_weather(district["lat"], district["lon"], start, end)
        rows = daily_rows(payload, district)
    except Exception as exc:
        raise HTTPException(502, f"Historical weather provider unavailable: {exc}")
    df = pd.DataFrame(rows)
    numeric = [c for c in ["temperature_2m_mean","temperature_2m_max","temperature_2m_min",
                           "precipitation_sum","relative_humidity_2m_mean","wind_speed_10m_mean",
                           "surface_pressure_mean","cloud_cover_mean","et0_fao_evapotranspiration"] if c in df]
    summary = {c: round(float(df[c].mean()), 2) for c in numeric}
    summary["annual_rainfall_average_mm"] = round(float(df.groupby(pd.to_datetime(df["date"]).dt.year)["precipitation_sum"].sum().mean()), 2)
    return {"source": "Open-Meteo ERA5-Land historical reanalysis", "location": district,
            "years": years, "summary": summary}
