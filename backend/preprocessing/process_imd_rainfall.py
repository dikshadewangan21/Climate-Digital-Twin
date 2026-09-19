import numpy as np
from pathlib import Path
from datetime import datetime, timedelta

# ==========================================================
# ClimateTwin AI
# Module 2 : Read Complete IMD Rainfall Dataset
# ==========================================================

GRID_WIDTH = 135
GRID_HEIGHT = 129
VALUES_PER_DAY = GRID_WIDTH * GRID_HEIGHT

YEAR = 2025

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "datasets" / "raw" / "rainfall"

files = list(DATA_DIR.glob("*.grd"))

if not files:
    print("No rainfall dataset found.")
    exit()

DATA_FILE = files[0]

print("=" * 60)
print("ClimateTwin AI")
print("Module 2 : Processing Complete Rainfall Dataset")
print("=" * 60)

print("\nReading:")
print(DATA_FILE)

# --------------------------------------------------------
# Read Entire File
# --------------------------------------------------------

all_data = np.fromfile(DATA_FILE, dtype=np.float32)

print("\nTotal Float Values")

print(len(all_data))

# --------------------------------------------------------
# Number of Days
# --------------------------------------------------------

number_of_days = len(all_data) // VALUES_PER_DAY

print("\nNumber of Days Found")

print(number_of_days)

# --------------------------------------------------------
# Reshape
# --------------------------------------------------------

rainfall = all_data.reshape(
    (
        number_of_days,
        GRID_HEIGHT,
        GRID_WIDTH
    )
)

print("\nDataset Shape")

print(rainfall.shape)

print("\nFirst Day Shape")

print(rainfall[0].shape)

print("\nLast Day Shape")

print(rainfall[-1].shape)

print("\nProcessing Complete.")