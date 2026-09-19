# ClimateTwin AI: AI-Powered Digital Twin of India's Climate

> **AI-Driven Climate Intelligence, Spatio-Temporal Prediction, and Scenario Simulation Using National Climate Datasets**

---

## 📌 Executive Summary

**ClimateTwin AI** is an advanced, research-grade artificial intelligence platform designed to build a dynamic **Digital Twin** of India's regional climate system using official national weather observations from the **India Meteorological Department (IMD)**. 

Unlike conventional weather sites that merely report static forecasts, ClimateTwin AI constructs a dynamic virtual representation of the climate state. By coupling **PyTorch Recurrent Neural Networks (LSTM)** with interactive geospatial spatial grids and parameter perturbation sliders, policymakers and researchers can perform **short-term (7-day) AI forecasting** as well as **interactive what-if scenario simulations**.

---

## 🗺️ Official Project Workflow

The application architecture strictly adheres to the official 8-stage climate digital twin workflow:

```
┌────────────────────────┐
│  01. Problem Definition │  --> Define geographic scope (Chhattisgarh pilot) & target variables
└───────────┬────────────┘
            │
┌───────────▼────────────┐
│   02. Data Collection  │  --> Ingest IMD Daily Gridded Rainfall (0.25°) & Temperature (1.0°)
└───────────┬────────────┘
            │
┌───────────▼────────────┐
│   03. Data Processing  │  --> Construct 7-day sliding window sequences (36,874 samples)
└───────────┬────────────┘
            │
┌───────────▼────────────┐
│ 04. Model Development  │  --> PyTorch 2-layer stacked LSTM neural architecture
└───────────┬────────────┘
            │
┌───────────▼────────────┐
│   05. Digital Twin     │  --> Virtual climate state synthesis (Observed + AI Forecast)
└───────────┬────────────┘
            │
┌───────────▼────────────┐
│ 06. Training & Validate│  --> Loss convergence evaluation (MSE: 0.001907 across 20 Epochs)
└───────────┬────────────┘
            │
┌───────────▼────────────┐
│    07. Visualization   │  --> Interactive 7-day forecast line/bar charts & tabular series
└───────────┬────────────┘
            │
┌───────────▼────────────┐
│ 08. Scenario Analysis  │  --> What-if climate simulator (Temp Δ ±5°C, Rain Δ ±50%)
└────────────────────────┘
```

---

## 📂 Repository Structure

The project is cleanly modularized into two distinct root directories:

```
backend/
 ├── backend/                   # Python FastAPI & AI Engine
 │    ├── ai/                   # PyTorch LSTM model, prediction utils & training scripts
 │    │    ├── model.py         # ClimateLSTM nn.Module architecture
 │    │    ├── predict_utils.py # Sequence inference engine & auto-regressive state updater
 │    │    ├── prepare_sequence.py # Sliding window dataset sequence generator
 │    │    └── train_lstm.py   # Training script (20 Epochs with checkpointing)
 │    ├── api/                  # FastAPI router definitions
 │    │    ├── health.py        # GET /health healthcheck endpoint
 │    │    └── predict.py       # GET /predict & GET /predict/7days prediction endpoints
 │    ├── datasets/             # Processed IMD climate data & numpy sequence tensors
 │    │    └── processed/ai/    # X.npy (36,874 x 7 x 7) & Y.npy (36,874 x 2)
 │    ├── saved_models/         # Saved PyTorch models & training history CSV
 │    │    ├── climate_lstm_best.pth
 │    │    └── training_history.csv
 │    ├── digital_twin/         # Digital twin simulation module placeholders
 │    ├── preprocessing/        # IMD grid decoding & Chhattisgarh region extraction scripts
 │    └── main.py               # FastAPI app entry point (with CORSMiddleware)
 │
 └── frontend/                  # React 18 + Vite Web Application
      ├── src/
      │    ├── components/      # UI components (Sidebar, Header, WorkflowBar, Leaflet Map)
      │    ├── pages/           # Workflow page views (Overview, Digital Twin, What-If, etc.)
      │    ├── services/        # Centralized Axios API service (api.js)
      │    ├── data/            # Spatial grid coordinates & district metadata
      │    ├── App.jsx          # Main application router & state manager
      │    └── index.css        # Tailwind CSS v4 & custom glassmorphism styling
      ├── package.json
      └── vite.config.js
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Python 3.10+** (with PyTorch, FastAPI, Uvicorn, scikit-learn, joblib)
- **Node.js v18+** & **npm v9+**

### 1. Running the FastAPI Backend

Navigating into the `backend/` folder and starting the server:

```bash
# Move to backend directory
cd backend/backend

# Run FastAPI server on port 8000
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

The backend server will run at: **`http://localhost:8000`**

Available endpoints:
- `GET /` — API Status & Pilot Metadata
- `GET /health` — Healthcheck status (`{"status": "running"}`)
- `GET /predict` — Single step PyTorch LSTM inference (`{"rainfall_mm": 0.0, "temperature_c": 24.85}`)
- `GET /predict/7days` — Auto-regressive 7-day forecast series

### 2. Running the React Frontend

In a separate terminal, navigate into `frontend/` and launch the Vite dev server:

```bash
# Move to frontend directory
cd backend/frontend

# Install dependencies (if not already installed)
npm install

# Start Vite dev server on port 5173
npm run dev
```

The web application will open at: **`http://localhost:5173`**

---

## 🧠 AI Model & Training Specs

The AI forecasting module utilizes a stacked **Long Short-Term Memory (LSTM)** neural network built with **PyTorch**:

- **Model Architecture**: `ClimateLSTM`
- **Input Sequence Tensor**: 7 Time Steps × 7 Channels (`Rainfall_mm`, `Temperature_C`, `Latitude`, `Longitude`, `Month`, `WeekOfYear`, `DayOfYear`)
- **Hidden Layer Units**: 2 Stacked LSTM Layers (64 Hidden Units per layer)
- **Regularization**: Dropout ($p=0.2$)
- **Output Targets**: 2 Variables (`Rainfall_mm`, `Temperature_C`)
- **Training Dataset**: 36,874 sequence samples extracted from IMD Chhattisgarh grid points
- **Optimizer**: Adam ($lr = 0.001$) with Mean Squared Error (MSE) loss

### Model Loss & Performance Metrics
- **Final MSE**: `0.001907`
- **Final RMSE**: `0.04367`
- **Final MAE**: `0.03125`

---

## 🌐 Key Dashboard Features

1. **Interactive Spatial Leaflet Map**: Renders Chhattisgarh's 0.5° × 0.5° interpolation grid across 33 districts (Raipur, Bilaspur, Durg, Korba, Jagdalpur, Ambikapur, etc.) with real-time temperature/rainfall layer toggles.
2. **What-If Scenario Simulator**: Interactive sliders for Temperature ($\pm 5.0^\circ\text{C}$) and Rainfall ($\pm 50\%$) allow users to explore climate state shifts relative to baseline.
3. **Loss Curve Viewer**: Displays 20-epoch training vs validation loss history using Recharts directly from `training_history.csv`.
4. **Judges Guided Demo Mode**: An interactive `[ START DEMO MODE ]` stepper designed for academic presentations and technical juries.

---

## 🛰️ National Expansion & Future Scope

While **Chhattisgarh** serves as the active Proof-of-Concept pilot region, the platform architecture is designed for national scaling:
- **Satellite Data Integration**: Planned integration with **INSAT-3D/3DR** thermal channels and **MOSDAC** soil moisture products.
- **National Spatial Grid**: Scaling from 24 regional points to all 36 States & Union Territories of India.
- **Multi-Sectoral Impact Models**: Sector-specific impact models for agriculture, hydrological runoff, and urban heat islands.

---

## 📄 License & Attribution

Developed for **ClimateTwin AI — AI-Powered Digital Twin of India's Climate using India's National Data**.  
Data courtesy of the **India Meteorological Department (IMD)**.
