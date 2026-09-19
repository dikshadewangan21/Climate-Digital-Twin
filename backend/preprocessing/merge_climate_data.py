import pandas as pd
from pathlib import Path
from scipy.spatial import cKDTree

print("=" * 60)
print("ClimateTwin AI")
print("Module 10 : Merge Climate Dataset")
print("=" * 60)

BASE_DIR = Path(__file__).resolve().parent.parent

rainfall_file = (
    BASE_DIR
    / "datasets"
    / "processed"
    / "climate"
    / "rainfall_grid_2025.csv"
)

temperature_file = (
    BASE_DIR
    / "datasets"
    / "processed"
    / "climate"
    / "temperature_grid_2025.csv"
)

output_dir = (
    BASE_DIR
    / "datasets"
    / "processed"
    / "climate"
)

output_file = output_dir / "chhattisgarh_climate_2025.csv"

print("\nReading rainfall...")
rain = pd.read_csv(rainfall_file)

print("Records:", len(rain))

print("\nReading temperature...")
temp = pd.read_csv(temperature_file)

print("Records:", len(temp))

# -------------------------------------------------
# Remove rows with missing temperature
# -------------------------------------------------

temp = temp.dropna(subset=["Temperature_C"])

# -------------------------------------------------
# Merge day by day
# -------------------------------------------------

merged_days = []

dates = sorted(rain["Date"].unique())

for date in dates:

    rain_day = rain[rain["Date"] == date].copy()

    temp_day = temp[temp["Date"] == date].copy()

    if len(temp_day) == 0:
        continue

    tree = cKDTree(
        temp_day[["Latitude", "Longitude"]].values
    )

    _, idx = tree.query(
        rain_day[["Latitude", "Longitude"]].values,
        k=1
    )

    rain_day["Temperature_C"] = (
        temp_day.iloc[idx]["Temperature_C"].values
    )

    merged_days.append(rain_day)

merged = pd.concat(merged_days, ignore_index=True)

merged.to_csv(output_file, index=False)

print("\nMerged Successfully!")

print(output_file)

print("\nTotal Records")

print(len(merged))

print("\nMissing Values")

print(merged.isna().sum())

print("\nFirst Five Rows")

print(merged.head())

print("=" * 60)