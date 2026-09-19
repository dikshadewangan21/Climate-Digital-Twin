import pandas as pd
import numpy as np
from pathlib import Path

print("="*60)
print("ClimateTwin AI")
print("Module 7 : Create Common Climate Grid")
print("="*60)

BASE_DIR = Path(__file__).resolve().parent.parent

OUTPUT_DIR = (
    BASE_DIR /
    "datasets" /
    "processed" /
    "common_grid"
)

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_FILE = OUTPUT_DIR / "chhattisgarh_grid.csv"

# ---------------------------------------------------
# Official ClimateTwin Grid
# ---------------------------------------------------

latitudes = np.arange(18.0, 25.0, 0.5)

longitudes = np.arange(80.5, 85.5, 0.5)

rows = []

for lat in latitudes:
    for lon in longitudes:
        rows.append({
            "Latitude": round(float(lat), 1),
            "Longitude": round(float(lon), 1)
        })

grid = pd.DataFrame(rows)

grid.to_csv(OUTPUT_FILE,index=False)

print()

print("Grid Created Successfully!")

print()

print(OUTPUT_FILE)

print()

print(grid.head())

print()

print("Total Grid Cells:",len(grid))