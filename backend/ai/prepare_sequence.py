import pandas as pd
import numpy as np

from pathlib import Path
from sklearn.preprocessing import MinMaxScaler
import joblib

print("=" * 60)
print("ClimateTwin AI")
print("Module 12 : Preparing Improved LSTM Dataset")
print("=" * 60)

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_FILE = (
    BASE_DIR /
    "datasets" /
    "processed" /
    "ai" /
    "climate_ai_dataset.csv"
)

OUTPUT_DIR = (
    BASE_DIR /
    "datasets" /
    "processed" /
    "ai"
)

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print("\nReading Dataset...")

df = pd.read_csv(DATA_FILE)

print("Records:", len(df))

# ---------------------------------------------------
# Sort by Location then Date
# ---------------------------------------------------

df["Date"] = pd.to_datetime(df["Date"])

df = df.sort_values(
    ["Latitude", "Longitude", "Date"]
).reset_index(drop=True)

# ---------------------------------------------------
# Input Features
# ---------------------------------------------------

FEATURE_COLUMNS = [
    "Rainfall_mm",
    "Temperature_C",
    "Latitude",
    "Longitude",
    "Month",
    "WeekOfYear",
    "DayOfYear"
]

# Target Columns
TARGET_COLUMNS = [
    "Rainfall_mm",
    "Temperature_C"
]

# ---------------------------------------------------
# Keep Original Target Values
# ---------------------------------------------------

original_targets = df[TARGET_COLUMNS].copy()

# ---------------------------------------------------
# Scale Input Features
# ---------------------------------------------------

feature_scaler = MinMaxScaler()

df[FEATURE_COLUMNS] = feature_scaler.fit_transform(
    df[FEATURE_COLUMNS]
)

joblib.dump(
    feature_scaler,
    OUTPUT_DIR / "feature_scaler.pkl"
)

print("\nFeature Scaler Saved.")

# ---------------------------------------------------
# Scale Targets (using ORIGINAL values)
# ---------------------------------------------------

target_scaler = MinMaxScaler()

target_scaler.fit(original_targets)

df[TARGET_COLUMNS] = target_scaler.transform(original_targets)

joblib.dump(
    target_scaler,
    OUTPUT_DIR / "target_scaler.pkl"
)

print("Target Scaler Saved.")
# ---------------------------------------------------
# Sliding Window
# ---------------------------------------------------

SEQUENCE_LENGTH = 7

X = []
Y = []

groups = df.groupby(
    ["Latitude", "Longitude"]
)

print("\nCreating Sequences...")

for _, group in groups:

    group = group.sort_values("Date")

    feature_values = group[FEATURE_COLUMNS].values
    target_values = group[TARGET_COLUMNS].values

    if len(feature_values) <= SEQUENCE_LENGTH:
        continue

    for i in range(len(feature_values) - SEQUENCE_LENGTH):

        X.append(
            feature_values[i:i + SEQUENCE_LENGTH]
        )

        Y.append(
            target_values[i + SEQUENCE_LENGTH]
        )

X = np.array(X, dtype=np.float32)
Y = np.array(Y, dtype=np.float32)

print("\nSequence Creation Completed")

print("X Shape :", X.shape)
print("Y Shape :", Y.shape)

np.save(
    OUTPUT_DIR / "X.npy",
    X
)

np.save(
    OUTPUT_DIR / "Y.npy",
    Y
)

print("\nSaved Successfully")

print(OUTPUT_DIR / "X.npy")
print(OUTPUT_DIR / "Y.npy")

print("\nModule Completed Successfully")
print("=" * 60)