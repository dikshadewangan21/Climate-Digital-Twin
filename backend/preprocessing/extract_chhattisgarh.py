import numpy as np
import pandas as pd
from pathlib import Path
from datetime import datetime, timedelta

# ==========================================================
# ClimateTwin AI
# Module 3 : Extract Chhattisgarh Rainfall
# ==========================================================

GRID_WIDTH = 135
GRID_HEIGHT = 129
GRID_RESOLUTION = 0.25
VALUES_PER_DAY = GRID_WIDTH * GRID_HEIGHT

START_LAT = 6.5
START_LON = 66.5

YEAR = 2025

# Chhattisgarh Approximate Bounding Box
CG_MIN_LAT = 17.8
CG_MAX_LAT = 24.1

CG_MIN_LON = 80.2
CG_MAX_LON = 84.4

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_FILE = list(
    (BASE_DIR / "datasets/raw/rainfall").glob("*.grd")
)[0]

OUTPUT_DIR = BASE_DIR / "datasets/processed/rainfall"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_FILE = OUTPUT_DIR / "chhattisgarh_rainfall_2025.csv"

print("=" * 60)
print("Extracting Chhattisgarh Rainfall")
print("=" * 60)

# Read Entire Dataset
all_data = np.fromfile(DATA_FILE, dtype=np.float32)

days = len(all_data) // VALUES_PER_DAY

rainfall = all_data.reshape(days, GRID_HEIGHT, GRID_WIDTH)

# Replace Missing Values
rainfall[rainfall == -999] = np.nan

# Generate Coordinates
latitudes = START_LAT + np.arange(GRID_HEIGHT) * GRID_RESOLUTION
longitudes = START_LON + np.arange(GRID_WIDTH) * GRID_RESOLUTION

records = []

start_date = datetime(YEAR, 1, 1)

for day in range(days):

    current_date = str((start_date + timedelta(days=day)).date())

    for i, lat in enumerate(latitudes):

        if CG_MIN_LAT <= lat <= CG_MAX_LAT:

            for j, lon in enumerate(longitudes):

                if CG_MIN_LON <= lon <= CG_MAX_LON:

                    value = rainfall[day, i, j]

                    if not np.isnan(value):

                        records.append(
                            [
                                current_date,
                                round(lat, 2),
                                round(lon, 2),
                                round(float(value), 2)
                            ]
                        )

df = pd.DataFrame(
    records,
    columns=[
        "Date",
        "Latitude",
        "Longitude",
        "Rainfall_mm"
    ]
)

df.to_csv(OUTPUT_FILE, index=False)

print("\nCSV Saved Successfully!")

print(OUTPUT_FILE)

print("\nTotal Records")

print(len(df))

print("\nFirst Five Rows")

print(df.head())