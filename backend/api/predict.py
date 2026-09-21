from fastapi import APIRouter
import numpy as np
from pathlib import Path

from ai.predict_utils import (
    predict_from_sequence,
    update_sequence
)

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = (
    BASE_DIR /
    "datasets" /
    "processed" /
    "ai"
)


@router.get("/predict")
def predict():

    X = np.load(DATA_DIR / "X.npy")

    sequence = X[-1]

    rainfall, temperature, _, _ = predict_from_sequence(sequence)

    return {
        "rainfall_mm": round(rainfall, 2),
        "temperature_c": round(temperature, 2)
    }


@router.get("/predict/7days")
def predict_7days():

    X = np.load(DATA_DIR / "X.npy")

    sequence = X[-1]

    forecast = []

    for day in range(7):

        rainfall, temperature, rainfall_scaled, temperature_scaled = predict_from_sequence(sequence)

        forecast.append({
            "day": day + 1,
            "rainfall_mm": round(rainfall, 2),
            "temperature_c": round(temperature, 2)
        })

        sequence = update_sequence(
            sequence,
            rainfall_scaled,
            temperature_scaled
        )

    return forecast