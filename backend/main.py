import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.health import router as health_router
from api.weather import router as weather_router
from api.climate import router as climate_router
from api.simulate import router as simulate_router
from api.ai_predict import router as ai_predict_router
from api.compat import router as compat_router, predict_router  # frontend compatibility layer

app = FastAPI(
    title="ClimateTwin AI",
    description="AI-powered digital twin and district-level weather/climate explorer for Chhattisgarh.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

cors_env = os.getenv("CORS_ORIGINS", "") or os.getenv("FRONTEND_ORIGINS", "")
if cors_env.strip() and cors_env.strip() != "*":
    allowed_origins = [o.strip() for o in cors_env.split(",") if o.strip()]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    # Allow all origins (including Vercel, Netlify, Render, localhost) with full credentials reflection
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=r".*",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Core v2 routes
app.include_router(health_router)
app.include_router(weather_router)
app.include_router(climate_router)
app.include_router(simulate_router)
app.include_router(ai_predict_router)

# Frontend compatibility routes (/api/*, /predict, /predict/7days)
app.include_router(compat_router)
app.include_router(predict_router)  # /predict and /predict/7days at root


@app.get("/")
def home():
    return {
        "project": "ClimateTwin AI",
        "status": "Running",
        "pilot_region": "Chhattisgarh",
        "version": "2.0.0",
        "data_policy": "Live weather from Open-Meteo; historical climate from ERA5-Land/ERA5.",
        "frontend_endpoints": [
            "/api/districts", "/api/forecast", "/api/alerts",
            "/api/scenario", "/api/compare", "/api/report",
            "/api/model-metrics", "/api/pilot-info",
            "/predict", "/predict/7days", "/health",
        ],
    }
