"""Train multi-district ClimateTwin LSTM. Recommended in Google Colab with GPU."""
from pathlib import Path
import numpy as np, pandas as pd, torch
from torch import nn
from torch.utils.data import DataLoader, TensorDataset
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from ai.model import ClimateLSTM
BASE=Path(__file__).resolve().parents[1]; DATA=BASE/'datasets/processed/v2'; OUT=BASE/'saved_models_v2'; OUT.mkdir(exist_ok=True)
X=np.load(DATA/'X.npy'); Y=np.load(DATA/'Y.npy')
# random split is acceptable for a demo, but a chronological holdout is preferable for publication.
Xtr,Xte,Ytr,Yte=train_test_split(X,Y,test_size=.2,random_state=42,shuffle=True)
device=torch.device('cuda' if torch.cuda.is_available() else 'cpu'); print('device',device,'samples',len(Xtr),len(Xte))
tr=DataLoader(TensorDataset(torch.tensor(Xtr),torch.tensor(Ytr)),batch_size=256,shuffle=True)
te=DataLoader(TensorDataset(torch.tensor(Xte),torch.tensor(Yte)),batch_size=512)
model=ClimateLSTM().to(device); opt=torch.optim.AdamW(model.parameters(),lr=1e-3,weight_decay=1e-4); loss_fn=nn.SmoothL1Loss()
best=1e9; history=[]
for epoch in range(1,31):
    model.train(); tl=0
    for xb,yb in tr:
        xb,yb=xb.to(device),yb.to(device); opt.zero_grad(); pred=model(xb); loss=loss_fn(pred,yb); loss.backward(); torch.nn.utils.clip_grad_norm_(model.parameters(),1.0); opt.step(); tl+=loss.item()
    model.eval(); vl=0
    with torch.no_grad():
        for xb,yb in te: vl+=loss_fn(model(xb.to(device)),yb.to(device)).item()
    tl/=len(tr); vl/=len(te); history.append([epoch,tl,vl]); print(f'{epoch:02d}/30 train={tl:.5f} val={vl:.5f}')
    if vl<best: best=vl; torch.save(model.state_dict(),OUT/'climate_lstm_best.pth')
model.load_state_dict(torch.load(OUT/'climate_lstm_best.pth',map_location=device)); model.eval(); preds=[]; ys=[]
with torch.no_grad():
    for xb,yb in te: preds.append(model(xb.to(device)).cpu().numpy()); ys.append(yb.numpy())
p=np.vstack(preds); y=np.vstack(ys)
print('overall MAE',mean_absolute_error(y,p),'RMSE',mean_squared_error(y,p)**.5,'R2',r2_score(y,p,multioutput='variance_weighted'))
np.save(OUT/'test_predictions.npy',p); np.save(OUT/'test_targets.npy',y); pd.DataFrame(history,columns=['epoch','train_loss','val_loss']).to_csv(OUT/'training_history.csv',index=False)
torch.save(model.state_dict(),OUT/'climate_lstm_final.pth')
