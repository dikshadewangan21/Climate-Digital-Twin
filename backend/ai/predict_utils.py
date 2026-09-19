import numpy as np
import torch
import joblib

from pathlib import Path
from ai.model import ClimateLSTM

# -------------------------------------------------------
# Paths
# -------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "datasets" / "processed" / "ai"

MODEL_DIR = BASE_DIR / "saved_models"

FEATURE_SCALER_PATH = DATA_DIR / "feature_scaler.pkl"
TARGET_SCALER_PATH = DATA_DIR / "target_scaler.pkl"

MODEL_PATH = MODEL_DIR / "climate_lstm_best.pth"

# -------------------------------------------------------
# Device
# -------------------------------------------------------

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

# -------------------------------------------------------
# Load Scalers
# -------------------------------------------------------

feature_scaler = joblib.load(FEATURE_SCALER_PATH)
target_scaler = joblib.load(TARGET_SCALER_PATH)

# -------------------------------------------------------
# Load Model
# -------------------------------------------------------

model = ClimateLSTM().to(device)

model.load_state_dict(
    torch.load(
        MODEL_PATH,
        map_location=device
    )
)

model.eval()

# -------------------------------------------------------
# Prediction Function
# -------------------------------------------------------

def predict_from_sequence(sequence):

    sequence = np.expand_dims(sequence, axis=0)
    sequence = torch.tensor(sequence, dtype=torch.float32).to(device)

    with torch.no_grad():
        prediction_scaled = model(sequence).cpu().numpy()

    prediction_real = target_scaler.inverse_transform(prediction_scaled)

    rainfall_real = max(0.0, float(prediction_real[0][0]))
    temperature_real = float(prediction_real[0][1])

    rainfall_scaled = float(prediction_scaled[0][0])
    temperature_scaled = float(prediction_scaled[0][1])

    return (
        rainfall_real,
        temperature_real,
        rainfall_scaled,
        temperature_scaled
    )
def update_sequence(sequence, rainfall_scaled, temperature_scaled):
    """
    Update the 7-day input sequence using the model's
    scaled prediction.
    """

    new_sequence = sequence.copy()

    # Shift everything one day up
    new_sequence[:-1] = new_sequence[1:]

    # Copy last day
    new_row = new_sequence[-1].copy()

    # Replace predicted climate
    new_row[0] = rainfall_scaled
    new_row[1] = temperature_scaled

    # Update DayOfYear
    new_row[6] = min(1.0, new_row[6] + 1/365)

    # Update WeekOfYear
    new_row[5] = min(1.0, new_row[5] + 1/52)

    new_sequence[-1] = new_row

    return new_sequence