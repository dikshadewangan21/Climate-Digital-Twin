import numpy as np
import pandas as pd
from pathlib import Path

import torch
import torch.nn as nn

from torch.utils.data import TensorDataset, DataLoader
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error
from ai.model import ClimateLSTM
print("=" * 60)
print("ClimateTwin AI")
print("Module 13 : Improved LSTM Training")
print("=" * 60)

# -------------------------------------------------------
# Paths
# -------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "datasets" / "processed" / "ai"
MODEL_DIR = BASE_DIR / "saved_models"

MODEL_DIR.mkdir(parents=True, exist_ok=True)

# -------------------------------------------------------
# Load Dataset
# -------------------------------------------------------

print("\nLoading Dataset...")

X = np.load(DATA_DIR / "X.npy")
Y = np.load(DATA_DIR / "Y.npy")

print("X Shape :", X.shape)
print("Y Shape :", Y.shape)

# -------------------------------------------------------
# Train Test Split
# -------------------------------------------------------

X_train, X_test, Y_train, Y_test = train_test_split(
    X,
    Y,
    test_size=0.2,
    random_state=42,
    shuffle=True
)

print("\nTraining Samples :", len(X_train))
print("Testing Samples  :", len(X_test))

# -------------------------------------------------------
# Torch Dataset
# -------------------------------------------------------

X_train = torch.tensor(X_train, dtype=torch.float32)
Y_train = torch.tensor(Y_train, dtype=torch.float32)

X_test = torch.tensor(X_test, dtype=torch.float32)
Y_test = torch.tensor(Y_test, dtype=torch.float32)

train_loader = DataLoader(
    TensorDataset(X_train, Y_train),
    batch_size=64,
    shuffle=True
)

test_loader = DataLoader(
    TensorDataset(X_test, Y_test),
    batch_size=64,
    shuffle=False
)

# -------------------------------------------------------
# LSTM Model
# -------------------------------------------------------

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

print("\nUsing Device:", device)

model = ClimateLSTM().to(device)

criterion = nn.MSELoss()

optimizer = torch.optim.Adam(
    model.parameters(),
    lr=0.001
)

# -------------------------------------------------------
# Training
# -------------------------------------------------------

EPOCHS = 20

history = []

best_loss = float("inf")

print("\nTraining Started...\n")

for epoch in range(EPOCHS):

    model.train()

    train_loss = 0

    for X_batch, Y_batch in train_loader:

        X_batch = X_batch.to(device)
        Y_batch = Y_batch.to(device)

        optimizer.zero_grad()

        prediction = model(X_batch)

        loss = criterion(prediction, Y_batch)

        loss.backward()

        optimizer.step()

        train_loss += loss.item()

    train_loss /= len(train_loader)

    model.eval()

    val_loss = 0

    with torch.no_grad():

        for X_batch, Y_batch in test_loader:

            X_batch = X_batch.to(device)
            Y_batch = Y_batch.to(device)

            prediction = model(X_batch)

            loss = criterion(prediction, Y_batch)

            val_loss += loss.item()

    val_loss /= len(test_loader)

    history.append([epoch + 1, train_loss, val_loss])

    print(
        f"Epoch {epoch+1:02d}/{EPOCHS} | "
        f"Train={train_loss:.6f} | "
        f"Validation={val_loss:.6f}"
    )

    if val_loss < best_loss:

        best_loss = val_loss

        torch.save(
            model.state_dict(),
            MODEL_DIR / "climate_lstm_best.pth"
        )

# -------------------------------------------------------
# Evaluation
# -------------------------------------------------------

print("\nEvaluating Model...")

model.load_state_dict(
    torch.load(
        MODEL_DIR / "climate_lstm_best.pth",
        map_location=device
    )
)

model.eval()

predictions = []

targets = []

with torch.no_grad():

    for X_batch, Y_batch in test_loader:

        X_batch = X_batch.to(device)

        prediction = model(X_batch)

        predictions.extend(
            prediction.cpu().numpy()
        )

        targets.extend(
            Y_batch.numpy()
        )

predictions = np.array(predictions)

targets = np.array(targets)

mse = mean_squared_error(
    targets,
    predictions
)

rmse = np.sqrt(mse)

mae = mean_absolute_error(
    targets,
    predictions
)

print("\nModel Performance")
print("---------------------------")
print(f"MSE  : {mse:.6f}")
print(f"RMSE : {rmse:.6f}")
print(f"MAE  : {mae:.6f}")

# -------------------------------------------------------
# Save Final Model
# -------------------------------------------------------

torch.save(
    model.state_dict(),
    MODEL_DIR / "climate_lstm_final.pth"
)

history_df = pd.DataFrame(
    history,
    columns=[
        "Epoch",
        "TrainingLoss",
        "ValidationLoss"
    ]
)

history_df.to_csv(
    MODEL_DIR / "training_history.csv",
    index=False
)

print("\nFiles Saved")

print(MODEL_DIR / "climate_lstm_best.pth")
print(MODEL_DIR / "climate_lstm_final.pth")
print(MODEL_DIR / "training_history.csv")

print("\nModule Completed Successfully")
print("=" * 60)