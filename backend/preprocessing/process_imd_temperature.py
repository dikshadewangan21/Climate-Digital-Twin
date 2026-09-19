import numpy as np
from pathlib import Path

print("=" * 60)
print("ClimateTwin AI")
print("Module 4 : Processing Complete Temperature Dataset")
print("=" * 60)

GRID_WIDTH = 31
GRID_HEIGHT = 31

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "datasets" / "raw" / "temperature"

files = list(DATA_DIR.glob("*.grd"))

if not files:
    print("Temperature dataset not found!")
    exit()

DATA_FILE = files[0]

print("\nReading:")
print(DATA_FILE)

temperature = np.fromfile(DATA_FILE, dtype=np.float32)

print("\nTotal Float Values")
print(len(temperature))

VALUES_PER_DAY = GRID_WIDTH * GRID_HEIGHT

days = len(temperature) // VALUES_PER_DAY

print("\nNumber of Days Found")
print(days)

temperature = temperature.reshape(days, GRID_HEIGHT, GRID_WIDTH)

# Replace missing values
temperature[temperature >= 99.9] = np.nan

print("\nDataset Shape")
print(temperature.shape)

print("\nFirst Day Shape")
print(temperature[0].shape)

print("\nLast Day Shape")
print(temperature[-1].shape)

print("\nProcessing Completed Successfully!")
print("=" * 60)