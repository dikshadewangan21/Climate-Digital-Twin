import pandas as pd
import numpy as np
from pathlib import Path

print("=" * 60)
print("ClimateTwin AI")
print("Module 9 : Map Temperature to Common Grid")
print("=" * 60)

BASE_DIR = Path(__file__).resolve().parent.parent

temperature_file = (
    BASE_DIR
    / "datasets"
    / "processed"
    / "temperature"
    / "chhattisgarh_temperature_2025.csv"
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

output_file = output_dir / "temperature_grid_2025.csv"

print("\nReading temperature dataset...")

temperature = pd.read_csv(temperature_file)

print("Records:", len(temperature))

print("\nReading common grid...")

grid = pd.read_csv(grid_file)

print("Grid Cells:", len(grid))

grid_lats = np.sort(grid["Latitude"].unique())
grid_lons = np.sort(grid["Longitude"].unique())


def nearest(value, candidates):
    return candidates[np.abs(candidates - value).argmin()]


temperature["Latitude"] = temperature["Latitude"].apply(
    lambda x: nearest(x, grid_lats)
)

temperature["Longitude"] = temperature["Longitude"].apply(
    lambda x: nearest(x, grid_lons)
)

print("\nAggregating temperature...")

temperature_grid = (
    temperature
    .groupby(
        ["Date", "Latitude", "Longitude"],
        as_index=False
    )["Temperature_C"]
    .mean()
)

temperature_grid.to_csv(output_file, index=False)

print("\nTemperature mapped successfully!")

print(output_file)

print("\nTotal Records")

print(len(temperature_grid))

print("\nFirst Five Rows")

print(temperature_grid.head())

print("=" * 60)