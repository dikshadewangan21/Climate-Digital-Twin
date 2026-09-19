import pandas as pd
from pathlib import Path

print("=" * 60)
print("ClimateTwin AI")
print("Module 11 : Prepare AI Dataset")
print("=" * 60)

BASE_DIR = Path(__file__).resolve().parent.parent

input_file = (
    BASE_DIR
    / "datasets"
    / "processed"
    / "climate"
    / "chhattisgarh_climate_2025.csv"
)

output_dir = (
    BASE_DIR
    / "datasets"
    / "processed"
    / "ai"
)

output_dir.mkdir(parents=True, exist_ok=True)

output_file = output_dir / "climate_ai_dataset.csv"

print("\nReading merged climate dataset...")

df = pd.read_csv(input_file)

# --------------------------------------------------
# Date Features
# --------------------------------------------------

df["Date"] = pd.to_datetime(df["Date"])

df["DayOfYear"] = df["Date"].dt.dayofyear
df["Month"] = df["Date"].dt.month
df["WeekOfYear"] = df["Date"].dt.isocalendar().week.astype(int)

# --------------------------------------------------
# Season Encoding
# --------------------------------------------------

def season_code(month):
    if month in [12, 1, 2]:
        return 0      # Winter
    elif month in [3, 4, 5]:
        return 1      # Summer
    elif month in [6, 7, 8, 9]:
        return 2      # Monsoon
    else:
        return 3      # Post Monsoon

df["Season"] = df["Month"].apply(season_code)

# --------------------------------------------------
# Reorder Columns
# --------------------------------------------------

df = df[
    [
        "Date",
        "Latitude",
        "Longitude",
        "Month",
        "WeekOfYear",
        "DayOfYear",
        "Season",
        "Rainfall_mm",
        "Temperature_C",
    ]
]

df.to_csv(output_file, index=False)

print("\nAI Dataset Saved Successfully!")
print(output_file)

print("\nDataset Shape:", df.shape)

print("\nColumns")
print(df.columns.tolist())

print("\nFirst Five Rows")
print(df.head())

print("=" * 60)