from pathlib import Path
import numpy as np, joblib, torch
from fastapi import APIRouter, HTTPException
from data_locations import BY_ID
from weather_service import live_weather
from ai.model import ClimateLSTM

router = APIRouter(prefix="/ai", tags=["trained AI"])
BASE=Path(__file__).resolve().parent.parent
DATA=BASE/'datasets/processed/v2'
MODEL=BASE/'saved_models_v2/climate_lstm_best.pth'
FEATURES=['latitude','longitude','temperature_2m_mean','precipitation_sum','relative_humidity_2m_mean','wind_speed_10m_mean','surface_pressure_mean','cloud_cover_mean','shortwave_radiation_sum','et0_fao_evapotranspiration']
TARGETS=['temperature_2m_mean','temperature_2m_max','temperature_2m_min','precipitation_sum','relative_humidity_2m_mean','wind_speed_10m_mean','surface_pressure_mean','cloud_cover_mean']

_LOADED = None

def _load():
    global _LOADED
    if _LOADED is not None:
        return _LOADED
    if not MODEL.exists() or not (DATA/'feature_scaler.pkl').exists() or not (DATA/'target_scaler.pkl').exists():
        raise HTTPException(503,'AI model artifacts not installed. Run the Colab/local training pipeline first.')
    fs=joblib.load(DATA/'feature_scaler.pkl'); ts=joblib.load(DATA/'target_scaler.pkl')
    m=ClimateLSTM()
    checkpoint=torch.load(MODEL,map_location='cpu',weights_only=False)
    state = checkpoint.get('model_state_dict', checkpoint)
    m.load_state_dict(state)
    m.eval()
    _LOADED = (m, fs, ts)
    return _LOADED

@router.get('/next-day/{district_id}')
def next_day(district_id:str):
    d=BY_ID.get(district_id.lower())
    if not d: raise HTTPException(404,'District not found')
    m,fs,ts=_load()
    payload=live_weather(d['lat'],d['lon'],past_days=7,forecast_days=0)
    daily=payload.get('daily',{})
    dates=daily.get('time',[])
    if len(dates)<7: raise HTTPException(502,'Provider did not return enough daily history')
    rows=[]
    for i in range(len(dates)):
        rows.append([d['lat'],d['lon'],daily['temperature_2m_mean'][i],daily['precipitation_sum'][i],daily['relative_humidity_2m_mean'][i],daily['wind_speed_10m_mean'][i],daily['surface_pressure_mean'][i],daily['cloud_cover_mean'][i],daily['shortwave_radiation_sum'][i],daily['et0_fao_evapotranspiration'][i]])
    X=fs.transform(np.asarray(rows[-7:],dtype=float)).astype('float32')[None,:,:]
    with torch.no_grad(): y=ts.inverse_transform(m(torch.tensor(X)).numpy())[0]
    return {'source':'ClimateTwin trained LSTM + Open-Meteo recent conditions','location':d,'prediction_date':dates[-1],'prediction':{k:round(float(v),2) for k,v in zip(TARGETS,y)}}
