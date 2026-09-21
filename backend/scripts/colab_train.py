"""Google Colab one-file trainer. Upload the backend folder/zip, then run this file.
It downloads 10 years of ERA5-Land data for all 33 districts, builds sequences, trains the LSTM,
and produces artifacts that can be copied into backend/saved_models_v2 and datasets/processed/v2.
"""
from pathlib import Path
import subprocess, sys
ROOT=Path('/content/ClimateTwin-AI/backend')
if not ROOT.exists():
    print('Upload/extract your backend project to /content/ClimateTwin-AI/backend first.')
    raise SystemExit(1)
subprocess.run([sys.executable,str(ROOT/'scripts/download_historical.py'),'--years','10'],check=True)
subprocess.run([sys.executable,str(ROOT/'scripts/prepare_training.py')],check=True)
subprocess.run([sys.executable,str(ROOT/'scripts/train_lstm.py')],check=True)
print('Training complete. Download datasets/processed/v2 and saved_models_v2.')
