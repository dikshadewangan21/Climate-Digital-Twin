import pandas as pd
import numpy as np
from pathlib import Path

print("=" * 60)
print("ClimateTwin AI")
print("Module 8 : Map Rainfall to Common Grid")
print("=" * 60)

BASE_DIR = Path(__file__).resolve().parent.parent

rainfall_file = (
    BASE_DIR
    / "datasets"
    / "processed"
    / "rainfall"
    / "chhattisgarh_rainfall_2025.csv"
)

grid_file = (
    BASE_DIR
    / "datasets"
    / "processed"
    / "common_grid"
    / "chhattisgarh_grid.csv"
)

output_dir = (
    BASE_DIR
    / "datasets"
    / "processed"
    / "climate"
)

output_dir.mkdir(parents=True, exist_ok=True)

output_file = output_dir / "rainfall_grid_2025.csv"

print("\nReading rainfall dataset...")
rainfall = pd.read_csv(rainfall_file)

print("Records:", len(rainfall))

print("\nReading common grid...")
grid = pd.read_csv(grid_file)

print("Grid Cells:", len(grid))

# -------------------------------------------------
# Find nearest grid coordinate (0.5°)
# -------------------------------------------------

grid_lats = np.sort(grid["Latitude"].unique())
grid_lons = np.sort(grid["Longitude"].unique())

def nearest(value, candidates):
    return candidates[np.abs(candidates - value).argmin()]

rainfall["Latitude"] = rainfall["Latitude"].apply(
    lambda x: nearest(x, grid_lats)
)

rainfall["Longitude"] = rainfall["Longitude"].apply(
    lambda x: nearest(x, grid_lons)
)

print("\nAggregating rainfall...")

rainfall_grid = (
    rainfall
    .groupby(
        ["Date", "Latitude", "Longitude"],
        as_index=False
    )["Rainfall_mm"]
    .mean()
)

rainfall_grid.to_csv(output_file, index=False)

print("\nRainfall mapped successfully!")

print(output_file)

print("\nTotal Records")

print(len(rainfall_grid))

print("\nFirst Five Rows")

print(rainfall_grid.head())

print("=" * 60)