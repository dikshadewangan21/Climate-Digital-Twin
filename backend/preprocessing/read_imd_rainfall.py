import numpy as np
from pathlib import Path

# ==========================================================
# ClimateTwin AI
# Module 1 : Read IMD Rainfall Dataset
# ==========================================================

print("=" * 60)
print("ClimateTwin AI")
print("Module 1 : Reading IMD Rainfall Dataset")
print("=" * 60)

# ----------------------------------------------------------
# Grid Information (From IMD Documentation)
# ----------------------------------------------------------

GRID_WIDTH = 135
GRID_HEIGHT = 129

START_LONGITUDE = 66.5
START_LATITUDE = 6.5
GRID_RESOLUTION = 0.25

# ----------------------------------------------------------
# Locate Dataset Automatically
# ----------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "datasets" / "raw" / "rainfall"

files = list(DATA_DIR.glob("*.grd"))

if not files:
    print("\nERROR: No .grd rainfall file found.")
    print(DATA_DIR)
    exit()

DATA_FILE = files[0]

print("\nDataset Found")
print(DATA_FILE)

# ----------------------------------------------------------
# Read First Day Rainfall Grid
# ----------------------------------------------------------

with open(DATA_FILE, "rb") as file:

    rainfall = np.fromfile(
        file,
        dtype=np.float32,
        count=GRID_WIDTH * GRID_HEIGHT
    )

print("\nSuccessfully read first day's rainfall.")

print(f"\nTotal Values Read : {len(rainfall)}")

# ----------------------------------------------------------
# Convert 1D array to 2D Grid
# ----------------------------------------------------------

rainfall = rainfall.reshape((GRID_HEIGHT, GRID_WIDTH))

print("\nGrid Shape")

print(rainfall.shape)

# ----------------------------------------------------------
# Replace Missing Values
# ----------------------------------------------------------

rainfall[rainfall == -999] = np.nan

print("\nMissing Values")

print(np.isnan(rainfall).sum())

# ----------------------------------------------------------
# Rainfall Statistics
# ----------------------------------------------------------

print("\nMinimum Rainfall (mm)")

print(np.nanmin(rainfall))

print("\nMaximum Rainfall (mm)")

print(np.nanmax(rainfall))

print("\nAverage Rainfall (mm)")

print(np.nanmean(rainfall))

# ----------------------------------------------------------
# Generate Latitude & Longitude
# ----------------------------------------------------------

longitudes = np.arange(
    START_LONGITUDE,
    START_LONGITUDE + GRID_WIDTH * GRID_RESOLUTION,
    GRID_RESOLUTION
)

latitudes = np.arange(
    START_LATITUDE,
    START_LATITUDE + GRID_HEIGHT * GRID_RESOLUTION,
    GRID_RESOLUTION
)

print("\nLongitude Count :", len(longitudes))
print("Latitude Count  :", len(latitudes))

print("\nLongitude Range")

print(f"{longitudes[0]}°E  --->  {longitudes[-1]}°E")

print("\nLatitude Range")

print(f"{latitudes[0]}°N  --->  {latitudes[-1]}°N")

# ----------------------------------------------------------
# Sample Rainfall Grid
# ----------------------------------------------------------

print("\nSample Rainfall Grid (Top Left 5 x 5)")

print(rainfall[:5, :5])

print("\nModule 1 Completed Successfully!")

print("=" * 60)