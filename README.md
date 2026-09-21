# ClimateTwin AI: AI-Powered Digital Twin of India's Regional Climate System

> **High-Resolution Climate Intelligence, Spatio-Temporal Prediction, Risk Assessment, and What-If Scenario Simulation**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.5+-EE4C2C?style=flat&logo=pytorch&logoColor=white)](https://pytorch.org)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📌 Overview

**ClimateTwin AI** is an advanced climate intelligence platform and digital twin of India's regional atmospheric systems, piloted across all **33 districts of Chhattisgarh**. 

Traditional weather reporting websites only present static, point-in-time forecasts without modeling cross-variable climate interactions or allowing exploratory hypothesis testing. ClimateTwin AI bridges this gap by coupling:
1. **Multivariate Spatio-Temporal Deep Learning (PyTorch LSTM)** to capture non-linear atmospheric dynamics.
2. **Interactive Digital Twin Engine** that maintains a live, synchronized digital model of district weather, soil moisture, and atmospheric state.
3. **Interactive Scenario Simulation (What-If Analysis)** enabling climate scientists, urban planners, and disaster management authorities to perturb temperature, rainfall, and humidity to observe projected impacts on heat waves, drought indices, and agricultural risks.

---

## 🎯 Problem Statement

Climate change intensifies extreme weather events—unprecedented heatwaves, erratic monsoon precipitation, and agricultural droughts. Decision makers face several key challenges:
- **Siloed Data**: Historical reanalysis observations, near-real-time satellite telemetry, and weather forecasts reside in disconnected repositories.
- **Lack of Counterfactual Simulation**: Existing meteorological portals tell you what is predicted, but cannot answer *what would happen if average temperature rises by 2.5°C alongside a 20% rainfall deficit?*
- **Delayed Risk Assessment**: Actionable warnings for heat index thresholds and compound extreme weather events frequently arrive too late for proactive mitigation.

ClimateTwin AI solves these challenges by unifying data ingestion, multivariate deep learning inference, risk indices, and counterfactual scenario modeling into an intuitive geospatial web cockpit.

---

## 🚀 Key Features

* **Real-Time Regional Digital Twin**: Live atmospheric state tracking across Chhattisgarh's 33 districts, continuously monitoring temperature, humidity, precipitation, wind speed, solar radiation, and calculated heat index.
* **7-Day Multivariate Deep Learning Forecast**: Auto-regressive multi-step forecast predicting 8 atmospheric and biophysical variables simultaneously.
* **Interactive What-If Scenario Simulator**: Perturb temperature ($\pm 5.0^\circ\text{C}$), precipitation ($\pm 50\%$), and relative humidity ($\pm 20\%$) to simulate ecological stress, drought severity, and heat index shifts in real-time.
* **Compound Extreme Event Risk Engine**: Quantifies heat wave probabilities, drought risk index, flood risk, and agricultural stress with color-coded severity tiers (Low, Moderate, High, Severe).
* **Carbon Calculator & Mitigation Estimator**: Estimates district-level and organizational carbon footprints with sector-wise breakdowns and actionable reduction pathways.
* **Interactive Geospatial Visualizations**: Google Maps platform integration with dynamic heatmaps, district polygon markers, weather layers, and fallback Leaflet tiles for zero-dependency offline exploration.
* **Model Transparency & Verification**: In-app performance dashboards detailing model loss curves (MSE, RMSE, MAE), feature correlations, and real-time backend API latency telemetry.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA INGESTION                                │
│  • Open-Meteo Historical & Real-Time Weather API                        │
│  • ECMWF ERA5-Land Climate Reanalysis (1990–2024)                       │
│  • Local Dataset Fallback: historical_chhattisgarh.csv (120,550 rows)   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         BACKEND (FastAPI + Python)                      │
│                                                                         │
│  ┌───────────────────────┐ ┌──────────────────────┐ ┌────────────────┐  │
│  │   PyTorch LSTM Engine │ │   Digital Twin State │ │ Scenario Engine│  │
│  │  • 10 Inputs, 8 Target│ │  • District Ingestion│ │ • Perturbations│  │
│  │  • 2 Layers, 96 Hidden│ │  • Heat Index Calc   │ │ • Risk Scoring │  │
│  │  • Multi-step Rollout │ │  • Drought Index Calc│ │ • Impact Delta │  │
│  └───────────────────────┘ └──────────────────────┘ └────────────────┘  │
│                                                                         │
│  FastAPI REST API Layer (CORS Enabled, 19 Endpoints, Pydantic Schemas)  │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ JSON over HTTP
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React 18 + Vite)                      │
│                                                                         │
│  • Single-Page Application (SPA) with React 18 & Vite 8                 │
│  • UI Design: Glassmorphic Tailwind CSS v4, Lucide Icons                │
│  • Interactive Visualizations: Recharts & Dynamic Metric Cards          │
│  • Geospatial Engine: Google Maps JS API + Leaflet Fallback             │
│  • Public Research Mode & Session Authentication                        │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🧠 AI Model & Forecasting Engine

The core predictive engine is powered by **PyTorch ClimateLSTM (v2)**, trained specifically on high-resolution reanalysis weather data for the central Indian subcontinent.

### Model Specification
- **Architecture**: `ClimateLSTM` (2 Stacked Long Short-Term Memory layers with recurrent dropout)
- **Input Dimensions**: 10 engineered features:
  1. `rainfall` (mm)
  2. `temperature_max` (°C)
  3. `temperature_min` (°C)
  4. `humidity` (%)
  5. `wind_speed` (km/h)
  6. `solar_radiation` ($W/m^2$)
  7. `latitude` (normalized)
  8. `longitude` (normalized)
  9. `day_of_year` (cyclical sine/cosine encoding)
  10. `month` (cyclical encoding)
- **Hidden Dimensions**: 96 hidden units per layer
- **Output Targets**: 8 concurrent variables:
  `rainfall`, `temperature_max`, `temperature_min`, `humidity`, `wind_speed`, `solar_radiation`, `heat_index`, `drought_index`
- **Sequence Length**: 7-day sliding lookback window ($T = 7$)
- **Forecast Horizon**: 7 days forward with autoregressive rollout
- **Model Checkpoint**: `backend/saved_models_v2/climate_lstm_best.pth`
- **Scaler Object**: Robust feature scaling via `backend/saved_models_v2/scaler.joblib`

### Training Convergence & Metrics
| Metric | Value |
| :--- | :--- |
| **Final Train Loss (MSE)** | `0.000934` |
| **Validation Loss (MSE)** | `0.001142` |
| **Root Mean Squared Error (RMSE)** | `0.03056` |
| **Mean Absolute Error (MAE)** | `0.02184` |
| **Epochs** | 20 (Early stopping checkpoint saved at best validation epoch) |

---

## 📊 Datasets & Data Pipeline

ClimateTwin AI uses a dual-source data pipeline designed for high availability and offline resilience:

1. **Live Atmospheric Feeds (Primary)**:
   - Queries the **Open-Meteo Global Weather API** for high-resolution hourly and daily weather metrics for Indian district centroids.
   - Non-blocking asynchronous HTTP fetching with automatic caching and retry policies.

2. **ECMWF ERA5-Land Climate Reanalysis (Fallback & Training)**:
   - Ingests regional grid data covering latitudes $17.5^\circ\text{N} - 24.5^\circ\text{N}$ and longitudes $80.0^\circ\text{E} - 84.5^\circ\text{E}$.
   - Local dataset snapshot: `backend/datasets/historical_chhattisgarh.csv` containing **120,550 records** spanning 1990 to 2024.
   - Fallback mechanism: If an external network or satellite data source is unreachable, the system automatically uses regional climatological baselines to ensure zero downtime.

---

## 📁 Project Structure

```text
Climate-Digital-Twin/
├── backend/                             # Python FastAPI Backend & AI Engine
│   ├── app/
│   │   ├── api/                         # FastAPI Route Controllers
│   │   │   ├── auth.py                  # Authentication & public research access
│   │   │   ├── carbon.py                # Carbon footprint estimation routes
│   │   │   ├── digital_twin.py          # State representation & telemetry routes
│   │   │   ├── districts.py             # Geospatial district boundaries & metadata
│   │   │   ├── forecast.py              # PyTorch 7-day multi-variable forecasts
│   │   │   ├── health.py                # System health check & monitoring
│   │   │   ├── risk.py                  # Heatwave, drought, and flood risk analysis
│   │   │   └── simulation.py            # What-If counterfactual scenario engine
│   │   ├── core/                        # Application configuration & CORS settings
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── models/                      # PyTorch LSTM definitions & weights loader
│   │   │   └── lstm_model.py
│   │   ├── schemas/                     # Pydantic request/response validation
│   │   │   └── schemas.py
│   │   └── services/                    # Business logic & data access layer
│   │       ├── data_service.py          # Open-Meteo & historical dataset service
│   │       ├── digital_twin_service.py  # Virtual twin state aggregator
│   │       ├── forecast_service.py      # Autoregressive inference runner
│   │       ├── risk_service.py          # Extreme event risk calculator
│   │       └── simulation_service.py    # Perturbation delta engine
│   ├── datasets/                        # Climatological datasets
│   │   └── historical_chhattisgarh.csv  # 120,550 historical weather records
│   ├── saved_models_v2/                 # Trained model checkpoints
│   │   ├── climate_lstm_best.pth        # PyTorch model weights
│   │   └── scaler.joblib                # Feature normalization scaler
│   ├── main.py                          # FastAPI server entry point
│   ├── requirements.txt                 # Python dependencies
│   └── .env.example                     # Backend environment template
│
├── frontend/                            # React 18 + Vite Web Application
│   ├── public/                          # Static assets and icons
│   ├── src/
│   │   ├── components/                  # Reusable UI components
│   │   │   ├── auth/                    # Login, Register & Protected Route modals
│   │   │   ├── common/                  # Navbar, Sidebar, PageHeader, ErrorBoundary
│   │   │   └── maps/                    # Google Maps & Leaflet interactive map
│   │   ├── context/                     # React Context (AuthContext)
│   │   ├── data/                        # Static district metadata & coordinates
│   │   ├── pages/                       # Application Views (11 full pages)
│   │   │   ├── Overview.jsx             # Platform landing and executive KPIs
│   │   │   ├── DigitalTwin.jsx          # Live regional state and map view
│   │   │   ├── WeatherForecast.jsx      # 7-day deep learning forecast curves
│   │   │   ├── ClimateSimulation.jsx    # Interactive What-If perturbation sliders
│   │   │   ├── ExtremeEventsRisk.jsx    # Heatwave & drought risk matrices
│   │   │   ├── CarbonCalculator.jsx     # Emissions auditing & reduction recommendations
│   │   │   ├── ChhattisgarhDistricts.jsx# District profile directory
│   │   │   ├── DataSources.jsx          # Data integrity & source documentation
│   │   │   ├── ModelArchitecture.jsx    # PyTorch network specs & loss curves
│   │   │   ├── Verification.jsx         # Live API health & latency diagnostics
│   │   │   └── Settings.jsx             # User preferences & API key configurations
│   │   ├── services/                    # Axios API client layer (api.js)
│   │   ├── App.jsx                      # Route definitions & layout shell
│   │   ├── main.jsx                     # Vite DOM entry point
│   │   └── index.css                    # Tailwind CSS imports & theme definitions
│   ├── package.json                     # Node.js dependencies
│   └── vite.config.js                   # Vite configuration & proxy settings
│
├── .env.example                         # Root configuration template
├── LICENSE                              # Open-source license (MIT)
└── README.md                            # Comprehensive platform documentation
```

---

## 🛠️ Installation & Setup Guide

### System Prerequisites
- **Python**: Version `3.10` or higher
- **Node.js**: Version `18.x` or higher
- **npm**: Version `9.x` or higher
- **Git**: For version control

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/dikshadewangan21/Climate-Digital-Twin.git
cd Climate-Digital-Twin
```

---

### Step 2: Backend Setup (Python FastAPI)

1. **Navigate to the backend folder**:
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment**:
   ```bash
   # Windows (PowerShell)
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment Variables**:
   Copy the `.env.example` file to `.env`:
   ```bash
   # Windows PowerShell
   Copy-Item .env.example .env

   # Linux/macOS
   cp .env.example .env
   ```
   *(The default settings in `.env.example` work out of the box for local development).*

5. **Start the FastAPI server**:
   ```bash
   python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

   The backend service will now be active at **`http://localhost:8000`**.  
   Interactive Swagger documentation is available at **`http://localhost:8000/docs`**.

---

### Step 3: Frontend Setup (React 18 + Vite)

1. **Open a new terminal and navigate to the frontend folder**:
   ```bash
   cd frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the frontend `.env.example` file:
   ```bash
   # Windows PowerShell
   Copy-Item .env.example .env

   # Linux/macOS
   cp .env.example .env
   ```

   *(Optional)* To enable Google Maps satellite layers and terrain mode, add your Google Maps JavaScript API key in `frontend/.env`:
   ```env
   VITE_GOOGLE_MAPS_API_KEY="your_google_maps_api_key_here"
   VITE_API_BASE_URL="http://localhost:8000"
   ```
   *Note: If no Google Maps API key is provided, the platform automatically falls back to Leaflet OpenStreetMap tiles without crashing.*

4. **Start the Vite development server**:
   ```bash
   npm run dev
   ```

   Open your browser and navigate to **`http://localhost:5173`**.

---

## 🔌 API Reference (FastAPI Endpoints)

The backend provides 19 REST endpoints grouped logically by functional domain:

### 1. System Health
| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server status, PyTorch model availability, and uptime |
| `GET` | `/api/health` | Comprehensive subsystem diagnostic report |

### 2. Deep Learning Forecasting
| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/api/forecast/7days` | 7-day auto-regressive forecast across all 8 variables |
| `POST`| `/api/forecast/multivariate` | Multi-step prediction for arbitrary custom input sequences |
| `GET` | `/api/forecast/district/{district_id}` | District-specific 7-day predictive series |

### 3. Digital Twin State
| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/api/digital-twin/state` | Live aggregated state across all monitored districts |
| `GET` | `/api/digital-twin/district/{district_id}` | Real-time atmospheric state for a selected district |
| `GET` | `/api/digital-twin/telemetry` | Time-series streaming telemetry of weather parameters |

### 4. What-If Scenario Simulation
| Method | Path | Description |
| :--- | :--- | :--- |
| `POST`| `/api/simulation/what-if` | Run scenario simulation with temperature/rainfall/humidity deltas |
| `GET` | `/api/simulation/baselines` | Retrieve historical baseline averages for comparison |

### 5. Extreme Events & Risk Analysis
| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/api/risk/extreme-events` | Heatwave, flood, and drought risk indices across districts |
| `GET` | `/api/risk/district/{district_id}` | Granular risk breakdown for an individual district |

### 6. Carbon Auditing & Mitigation
| Method | Path | Description |
| :--- | :--- | :--- |
| `POST`| `/api/carbon/calculator` | Calculate gross emissions from energy, transport, and industry |
| `GET` | `/api/carbon/benchmarks` | Regional emissions averages and reduction targets |

### 7. Geospatial & Stations
| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/api/districts` | List of 33 Chhattisgarh districts with coordinates and metadata |
| `GET` | `/api/stations` | Virtual meteorological station network metadata |

### 8. Authentication & Public Access
| Method | Path | Description |
| :--- | :--- | :--- |
| `POST`| `/api/auth/login` | Authenticate user session |
| `POST`| `/api/auth/register` | Register new user profile |
| `GET` | `/api/auth/me` | Current session verification and access scope |

---

## 🗺️ Interactive Maps & Geospatial Configuration

ClimateTwin AI incorporates a **dual-engine geospatial rendering layer**:

1. **Google Maps Platform (Default)**:
   - Uses `@googlemaps/js-api-loader` to dynamically mount interactive Google Maps.
   - Features custom stylized dark-mode map tiles, district boundary markers, and meteorological data overlays.
   - Supports switching between Road, Satellite, and Hybrid viewpoints.

2. **Leaflet OpenStreetMap (Automatic Resilient Fallback)**:
   - If `VITE_GOOGLE_MAPS_API_KEY` is not supplied, expired, or restricted by domain, the map module automatically mounts a **Leaflet OpenStreetMap** layer.
   - Eliminates blank screen errors and ensures all 33 district pins and tooltip popovers remain fully functional in any environment.

---

## 🔒 Authentication & Access Modes

To support both scientific publication review and restricted administrative usage:
- **Public Research Access Mode**: Guest visitors can freely explore all forecast graphs, run What-If simulations, calculate carbon budgets, and inspect district metrics without mandatory registration.
- **Session Authentication**: Includes JSON Web Token (JWT) based user session handling (`/api/auth/login`, `/api/auth/register`) for saving customized simulation parameters, alert thresholds, and district watchlists.

---

## ⚠️ Important Limitations

1. **Pilot Scope**: While the deep learning model architecture and data ingestion pipelines are engineered to scale nationally, the current high-resolution pilot dataset specifically targets the **33 districts of Chhattisgarh**.
2. **Reanalysis vs. Physical In-Situ Telemetry**: Forecast training utilizes ECMWF ERA5-Land reanalysis combined with Open-Meteo observations. Local microclimates (such as dense forest micro-canopies) may exhibit slight localized variations from regional grid centroid estimates.
3. **Exploratory Scenarios**: What-If scenario simulations provide non-linear directional projections based on statistical-physical relationships, designed for decision-support and planning rather than operational weather warnings.

---

## 🔮 Future Roadmap

- [ ] **National Expansion**: Ingestion of grid data covering all 28 states and 8 union territories of India.
- [ ] **ISRO Satellite Feeds**: Integration with **INSAT-3D/3DR** multispectral imagery and **MOSDAC** soil moisture radar datasets.
- [ ] **High-Resolution Urban Heat Modeling**: Sub-kilometer microclimate simulations for tier-1 municipal corporations (Raipur, Bilaspur, Durg-Bhilai).
- [ ] **Agricultural Yield Coupling**: Direct coupling of digital twin climate forecasts with crop simulation models (DSSAT / AquaCrop) to predict paddy and pulse harvest yields.
- [ ] **Automated Alert Webhooks**: SMS and WhatsApp weather anomaly alerts for regional disaster management agencies.

---

## 📄 License & Attribution

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

- **Data Sources**: Open-Meteo Weather API & ECMWF ERA5-Land Reanalysis Dataset.
- **Research & Development**: Developed as part of the **ClimateTwin AI** initiative to advance AI-driven climate resilience and environmental digital twin systems.
