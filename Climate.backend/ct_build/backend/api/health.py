from fastapi import APIRouter
from datetime import datetime, timezone

router = APIRouter(tags=["system"])

@router.get("/health")
def health():
    return {
        "status": "running",
        "project": "ClimateTwin AI",
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
    }
