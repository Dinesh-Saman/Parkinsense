# train_voice_final_best.py
import joblib, numpy as np, os, pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score
from ucimlrepo import fetch_ucirepo

print("DOWNLOADING DATASET...")
p = fetch_ucirepo(id=174)
X, y = p.data.features, p.data.targets.values.ravel()

xt, xv, yt, yv = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
s = StandardScaler()
xts = s.fit_transform(xt)
xvs = s.transform(xv)

names = ["Random Forest", "SVM", "XGBoost"]
clfs = [RandomForestClassifier(n_estimators=100, random_state=42), 
        SVC(probability=True, random_state=42), 
        XGBClassifier(eval_metric='logloss', random_state=42)]

res = []
for n, c in zip(names, clfs):
    c.fit(xts, yt)
    a = accuracy_score(yv, c.predict(xvs))
    print(f"[{n}] = {a*100:.2f}%")
    res.append((a, c, n))

best = max(res, key=lambda x: x[0])
print(f"WINNER: {best[2]} at {best[0]*100:.2f}%")

joblib.dump(best[1], "voice/model/voice_uci_model.pkl")
joblib.dump(s, "voice/model/voice_scaler.pkl")
joblib.dump(list(X.columns), "voice/model/voice_feature_columns.pkl")
print("BEST SAVED!")
