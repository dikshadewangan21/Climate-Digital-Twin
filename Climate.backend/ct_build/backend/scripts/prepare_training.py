"""Create 7-day sequences from datasets/historical_chhattisgarh.csv."""
from pathlib import Path
import numpy as np, pandas as pd, joblib
from sklearn.preprocessing import StandardScaler
BASE=Path(__file__).resolve().parents[1]
INPUT=BASE/'datasets/historical_chhattisgarh.csv'
OUT=BASE/'datasets/processed/v2'; OUT.mkdir(parents=True,exist_ok=True)
FEATURES=['latitude','longitude','temperature_2m_mean','precipitation_sum','relative_humidity_2m_mean','wind_speed_10m_mean','surface_pressure_mean','cloud_cover_mean','shortwave_radiation_sum','et0_fao_evapotranspiration']
TARGETS=['temperature_2m_mean','temperature_2m_max','temperature_2m_min','precipitation_sum','relative_humidity_2m_mean','wind_speed_10m_mean','surface_pressure_mean','cloud_cover_mean']
df = pd.read_csv(INPUT)
df['date'] = pd.to_datetime(df['time'])
df = df.sort_values(['district_id', 'date']).dropna(subset=FEATURES + TARGETS)
fs=StandardScaler(); ts=StandardScaler(); X=[];Y=[]
for _,g in df.groupby('district_id'):
    g=g.reset_index(drop=True); f=fs.fit_transform(g[FEATURES]); t=ts.fit_transform(g[TARGETS])
    for i in range(7,len(g)):
        X.append(f[i-7:i]); Y.append(t[i])
X=np.asarray(X,np.float32); Y=np.asarray(Y,np.float32)
# Refit scalers globally for inference consistency.
fs.fit(df[FEATURES]); ts.fit(df[TARGETS])
# Rebuild using global scalers.
X=[];Y=[]
for _,g in df.groupby('district_id'):
    f=fs.transform(g[FEATURES]); t=ts.transform(g[TARGETS])
    for i in range(7,len(g)):
        X.append(f[i-7:i]); Y.append(t[i])
X=np.asarray(X,np.float32); Y=np.asarray(Y,np.float32)
np.save(OUT/'X.npy',X); np.save(OUT/'Y.npy',Y); joblib.dump(fs,OUT/'feature_scaler.pkl'); joblib.dump(ts,OUT/'target_scaler.pkl')
with open(OUT/'metadata.txt','w') as f: f.write(f'features={FEATURES}\ntargets={TARGETS}\nsamples={len(X)}\n')
print('X',X.shape,'Y',Y.shape)
