import numpy as np
from pathlib import Path

from predict_utils import (
    predict_from_sequence,
    update_sequence
)

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = (
    BASE_DIR /
    "datasets" /
    "processed" /
    "ai"
)

X = np.load(DATA_DIR / "X.npy")

sequence = X[-1]

forecast = []

for day in range(7):

    (
        rainfall,
        temperature,
        rainfall_scaled,
        temperature_scaled
    ) = predict_from_sequence(sequence)

    forecast.append({
        "Day": day + 1,
        "Rainfall_mm": round(rainfall, 2),
        "Temperature_C": round(temperature, 2)
    })

    sequence = update_sequence(
        sequence,
        rainfall_scaled,
        temperature_scaled
    )

print("\n7-Day Forecast")
print("-" * 40)

for item in forecast:
    print(item)