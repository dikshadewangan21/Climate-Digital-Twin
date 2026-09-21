import numpy as np
import pandas as pd
from pathlib import Path
from datetime import datetime, timedelta

print("=" * 60)
print("ClimateTwin AI")
print("Module 5 : Extract Chhattisgarh Temperature")
print("=" * 60)

GRID_WIDTH = 31
GRID_HEIGHT = 31

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_FILE = BASE_DIR / "datasets" / "raw" / "temperature" / "temperature_2025.grd"

OUTPUT_DIR = BASE_DIR / "datasets" / "processed" / "temperature"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_FILE = OUTPUT_DIR / "chhattisgarh_temperature_2025.csv"

# ---------------------------------------------
# Read Binary Dataset
# ---------------------------------------------

temperature = np.fromfile(DATA_FILE, dtype=np.float32)

VALUES_PER_DAY = GRID_WIDTH * GRID_HEIGHT

days = len(temperature) // VALUES_PER_DAY

temperature = temperature.reshape(days, GRID_HEIGHT, GRID_WIDTH)

# Replace IMD Missing Values

temperature[temperature >= 99.9] = np.nan

# ---------------------------------------------
# Generate Latitude & Longitude
# ---------------------------------------------

latitudes = np.arange(7.5, 7.5 + GRID_HEIGHT, 1.0)

longitudes = np.arange(67.5, 67.5 + GRID_WIDTH, 1.0)

# ---------------------------------------------
# Chhattisgarh Bounding Box
# ---------------------------------------------

LAT_MIN = 17.5
LAT_MAX = 24.5

LON_MIN = 80.0
LON_MAX = 84.5

records = []

start_date = datetime(2025, 1, 1)

for day in range(days):

    current_date = (start_date + timedelta(days=day)).strftime("%Y-%m-%d")

    grid = temperature[day]

    for i, lat in enumerate(latitudes):

        if LAT_MIN <= lat <= LAT_MAX:

            for j, lon in enumerate(longitudes):

                if LON_MIN <= lon <= LON_MAX:

                    value = grid[i, j]

                    records.append(
                        [
                            current_date,
                            lat,
                            lon,
                            value
                        ]
                    )

df = pd.DataFrame(
    records,
    columns=[
        "Date",
        "Latitude",
        "Longitude",
        "Temperature_C"
    ]
)

df.to_csv(OUTPUT_FILE, index=False)

print("\nCSV Saved Successfully!")

print(OUTPUT_FILE)

print("\nTotal Records")

print(len(df))

print("\nFirst Five Rows")

print(df.head())