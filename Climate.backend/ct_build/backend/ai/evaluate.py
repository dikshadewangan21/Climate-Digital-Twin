import numpy as np
import torch
import joblib

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

from ai.model import ClimateLSTM


# ============================================================
# PATHS
# ============================================================

DATA_DIR = "./datasets/processed/ai"
MODEL_PATH = "./saved_models/climate_lstm_best.pth"
SCALER_PATH = "./datasets/processed/ai/target_scaler.pkl"


# ============================================================
# LOAD DATA
# ============================================================

print("=" * 60)
print("ClimateTwin AI - LSTM Model Evaluation")
print("=" * 60)

X = np.load(f"{DATA_DIR}/X.npy")
Y = np.load(f"{DATA_DIR}/Y.npy")

print("\nDataset:")
print("X shape:", X.shape)
print("Y shape:", Y.shape)


# ============================================================
# SAME TEST SPLIT USED DURING TRAINING
# ============================================================

from sklearn.model_selection import train_test_split

X_train, X_test, Y_train, Y_test = train_test_split(
    X,
    Y,
    test_size=0.2,
    random_state=42,
    shuffle=True
)

print("\nTraining samples:", len(X_train))
print("Testing samples :", len(X_test))


# ============================================================
# LOAD MODEL
# ============================================================

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("\nDevice:", device)

model = ClimateLSTM().to(device)

model.load_state_dict(
    torch.load(
        MODEL_PATH,
        map_location=device
    )
)

model.eval()


# ============================================================
# PREDICTION
# ============================================================

X_test_tensor = torch.tensor(
    X_test,
    dtype=torch.float32
).to(device)

with torch.no_grad():

    predictions = model(
        X_test_tensor
    ).cpu().numpy()


# ============================================================
# LOAD TARGET SCALER
# ============================================================

scaler = joblib.load(
    SCALER_PATH
)


# ============================================================
# CONVERT BACK TO ORIGINAL UNITS
# ============================================================

predictions_original = scaler.inverse_transform(
    predictions
)

targets_original = scaler.inverse_transform(
    Y_test
)


# ============================================================
# SEPARATE TARGETS
# ============================================================

actual_rainfall = targets_original[:, 0]
predicted_rainfall = predictions_original[:, 0]

actual_temperature = targets_original[:, 1]
predicted_temperature = predictions_original[:, 1]


# ============================================================
# RAINFALL METRICS
# ============================================================

rainfall_mae = mean_absolute_error(
    actual_rainfall,
    predicted_rainfall
)

rainfall_rmse = np.sqrt(
    mean_squared_error(
        actual_rainfall,
        predicted_rainfall
    )
)

rainfall_r2 = r2_score(
    actual_rainfall,
    predicted_rainfall
)


# ============================================================
# TEMPERATURE METRICS
# ============================================================

temperature_mae = mean_absolute_error(
    actual_temperature,
    predicted_temperature
)

temperature_rmse = np.sqrt(
    mean_squared_error(
        actual_temperature,
        predicted_temperature
    )
)

temperature_r2 = r2_score(
    actual_temperature,
    predicted_temperature
)


# ============================================================
# PRINT RESULTS
# ============================================================

print("\n")
print("=" * 60)
print("MODEL PERFORMANCE")
print("=" * 60)

print("\nRAIN FALL")
print("-" * 60)

print(
    f"MAE  : {rainfall_mae:.4f} mm"
)

print(
    f"RMSE : {rainfall_rmse:.4f} mm"
)

print(
    f"R²   : {rainfall_r2:.4f}"
)


print("\nTEMPERATURE")
print("-" * 60)

print(
    f"MAE  : {temperature_mae:.4f} °C"
)

print(
    f"RMSE : {temperature_rmse:.4f} °C"
)

print(
    f"R²   : {temperature_r2:.4f}"
)


# ============================================================
# TOLERANCE BASED ACCURACY
# ============================================================

rainfall_accuracy = (
    np.mean(
        np.abs(
            actual_rainfall -
            predicted_rainfall
        ) <= 2.0
    ) * 100
)

temperature_accuracy = (
    np.mean(
        np.abs(
            actual_temperature -
            predicted_temperature
        ) <= 2.0
    ) * 100
)


print("\n")
print("=" * 60)
print("TOLERANCE-BASED ACCURACY")
print("=" * 60)

print(
    f"\nRainfall accuracy (±2 mm): "
    f"{rainfall_accuracy:.2f}%"
)

print(
    f"Temperature accuracy (±2 °C): "
    f"{temperature_accuracy:.2f}%"
)


print("\n")
print("=" * 60)
print("Evaluation completed")
print("=" * 60)