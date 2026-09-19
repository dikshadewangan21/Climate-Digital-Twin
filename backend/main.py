from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.health import router as health_router
from api.predict import router as predict_router
from api.climate import router as climate_router

app = FastAPI(
    title="ClimateTwin AI — Climate Intelligence Decision Platform",
    description="Backend API and AI Digital Twin Engine for Chhattisgarh Climate",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(predict_router)
app.include_router(climate_router)


@app.get("/")
def home():
    return {
        "project": "ClimateTwin AI",
        "version": "2.0.0",
        "status": "Running",
        "pilot_region": "Chhattisgarh (33 Districts)",
        "endpoints": [
            "/api/districts",
            "/api/forecast",
            "/api/alerts",
            "/api/scenario",
            "/api/compare",
            "/api/report",
            "/health",
            "/predict",
            "/predict/7days"
        ]
    }