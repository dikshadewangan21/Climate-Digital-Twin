import numpy as np
from pathlib import Path

# ==========================================================
# ClimateTwin AI
# Module 3 : Read IMD Temperature Dataset
# ==========================================================

GRID_WIDTH = 31
GRID_HEIGHT = 31

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "datasets" / "raw" / "temperature"

files = list(DATA_DIR.glob("*.grd"))

print("=" * 60)
print("ClimateTwin AI")
print("Module 3 : Reading IMD Temperature Dataset")
print("=" * 60)

if not files:
    print("\nNo .grd temperature dataset found!")
    exit()

DATA_FILE = files[0]

print("\nDataset Found:")
print(DATA_FILE)

# ----------------------------------------------------------
# Read Entire Binary File
# ----------------------------------------------------------

temperature = np.fromfile(DATA_FILE, dtype=np.float32)

print("\nTotal Float Values")
print(len(temperature))

VALUES_PER_DAY = GRID_WIDTH * GRID_HEIGHT

days = len(temperature) // VALUES_PER_DAY

print("\nDays Found")
print(days)

temperature = temperature.reshape(days, GRID_HEIGHT, GRID_WIDTH)

print("\nDataset Shape")
print(temperature.shape)

# ----------------------------------------------------------
# First Day Analysis
# ----------------------------------------------------------

first_day = temperature[0].copy()

# IMD missing value
first_day[first_day >= 99.9] = np.nan

print("\nMissing Values")
print(np.isnan(first_day).sum())

print("\nMinimum Temperature (°C)")
print(np.nanmin(first_day))

print("\nMaximum Temperature (°C)")
print(np.nanmax(first_day))

print("\nAverage Temperature (°C)")
print(np.nanmean(first_day))

# ----------------------------------------------------------
# Generate Latitude & Longitude
# ----------------------------------------------------------

longitudes = np.arange(67.5, 67.5 + GRID_WIDTH, 1.0)

latitudes = np.arange(7.5, 7.5 + GRID_HEIGHT, 1.0)

print("\nLongitude Count :", len(longitudes))
print("Latitude Count  :", len(latitudes))

print("\nLongitude Range")
print(f"{longitudes[0]}°E  --->  {longitudes[-1]}°E")

print("\nLatitude Range")
print(f"{latitudes[0]}°N  --->  {latitudes[-1]}°N")

print("\nSample Temperature Grid (Top Left 5 x 5)")
print(first_day[:5, :5])

print("\nModule 3 Completed Successfully!")
print("=" * 60)