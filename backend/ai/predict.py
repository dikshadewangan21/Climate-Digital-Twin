import numpy as np
from pathlib import Path

from predict_utils import predict_from_sequence

print("=" * 60)
print("ClimateTwin AI")
print("Module 14 : Climate Prediction")
print("=" * 60)

# -------------------------------------------------------
# Paths
# -------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = (
    BASE_DIR /
    "datasets" /
    "processed" /
    "ai"
)

# -------------------------------------------------------
# Load Dataset
# -------------------------------------------------------

print("\nLoading Sequences...")

X = np.load(DATA_DIR / "X.npy")

print("Total Sequences :", len(X))

# -------------------------------------------------------
# Select Last Sequence
# -------------------------------------------------------

last_sequence = X[-1]

print("\nLast Sequence Shape")
print(last_sequence.shape)

# -------------------------------------------------------
# Prediction
# -------------------------------------------------------

print("\nPredicting Next Day Climate...")

rainfall, temperature = predict_from_sequence(last_sequence)

print("\nPredicted Climate")
print("-----------------------------")
print(f"Rainfall    : {rainfall:.2f} mm")
print(f"Temperature : {temperature:.2f} °C")

print("\nPrediction Completed Successfully")
print("=" * 60)