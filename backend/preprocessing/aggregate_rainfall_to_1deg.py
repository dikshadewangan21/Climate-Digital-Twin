import pandas as pd
from pathlib import Path

print("=" * 60)
print("ClimateTwin AI")
print("Module 6 : Aggregate Rainfall to 1° Grid")
print("=" * 60)

BASE_DIR = Path(__file__).resolve().parent.parent

INPUT_FILE = (
    BASE_DIR
    / "datasets"
    / "processed"
    / "rainfall"
    / "chhattisgarh_rainfall_2025.csv"
)

OUTPUT_DIR = (
    BASE_DIR
    / "datasets"
    / "processed"
    / "rainfall"
)

OUTPUT_FILE = OUTPUT_DIR / "chhattisgarh_rainfall_2025_1deg.csv"

print("\nReading rainfall dataset...")

df = pd.read_csv(INPUT_FILE)

print("Records:", len(df))

# -----------------------------------
# Convert 0.25° grid to 1° grid
# -----------------------------------

df["Latitude"] = (
    (df["Latitude"] + 0.5)
    .round()
)

df["Longitude"] = (
    (df["Longitude"] + 0.5)
    .round()
)

print("\nAggregating rainfall...")

agg = (
    df.groupby(
        ["Date", "Latitude", "Longitude"],
        as_index=False
    )["Rainfall_mm"]
    .mean()
)

agg.to_csv(OUTPUT_FILE, index=False)

print("\nAggregation Complete!")

print("\nSaved To:")

print(OUTPUT_FILE)

print("\nTotal Records")

print(len(agg))

print("\nFirst Five Rows")

print(agg.head())