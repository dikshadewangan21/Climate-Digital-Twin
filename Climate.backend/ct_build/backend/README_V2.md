# ClimateTwin AI v2

## What changed
- 33 Chhattisgarh districts instead of one state-level point.
- Live current weather + previous 7 days + next 7 days from Open-Meteo.
- Historical ERA5-Land data downloader for multi-year training.
- Multi-parameter LSTM: temperature, precipitation, humidity, wind, pressure, cloud cover and related variables.
- Scenario simulation starts from live conditions.
- AI training can be run in Google Colab with GPU.

## Run locally
```powershell
cd C:\Users\khushi\Desktop\ClimateTwin-AI\backend
..\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
Open http://127.0.0.1:8000/docs

## Useful endpoints
- GET `/weather/locations`
- GET `/weather/district/raipur`
- GET `/weather/district/durg`
- GET `/weather/point?latitude=21.19&longitude=81.28`
- GET `/climate/history/durg?years=5`
- GET `/climate/summary/durg?years=5`
- POST `/simulate`

## Important data wording
Open-Meteo current/forecast data are model-based weather data, not a claim of direct IMD station observations. Historical ERA5-Land is reanalysis. For an academic presentation, label the source clearly in the UI.
