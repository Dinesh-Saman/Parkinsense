import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix
import joblib

from extract_voice_features import extract_features_from_audio, UCI_FEATURE_NAMES

_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(_DIR, "Voice_Dataset")

def extract_all():
    records = []
    
    # HC_AH
    hc_dir = os.path.join(DATA_DIR, "HC_AH")
    if os.path.exists(hc_dir):
        for f in os.listdir(hc_dir):
            if f.endswith(".wav"):
                try:
                    with open(os.path.join(hc_dir, f), "rb") as file:
                        features = extract_features_from_audio(file.read())
                        rec = {n: v for n, v in zip(UCI_FEATURE_NAMES, features)}
                        rec['FileName'] = f
                        rec['Label'] = 0
                        rec['Class'] = 'Healthy'
                        records.append(rec)
                except Exception as e:
                    print(f"Failed {f}: {e}")

    # PD_AH
    pd_dir = os.path.join(DATA_DIR, "PD_AH")
    if os.path.exists(pd_dir):
        for f in os.listdir(pd_dir):
            if f.endswith(".wav"):
                try:
                    with open(os.path.join(pd_dir, f), "rb") as file:
                        features = extract_features_from_audio(file.read())
                        rec = {n: v for n, v in zip(UCI_FEATURE_NAMES, features)}
                        rec['FileName'] = f
                        rec['Label'] = 1
                        rec['Class'] = 'Parkinson'
                        records.append(rec)
                except Exception as e:
                    print(f"Failed {f}: {e}")

    return pd.DataFrame(records)

df = extract_all()
print(f"Extracted {len(df)} total samples.")

if len(df) > 0:
    # Basic analysis
    print("\n--- Feature Correlation with Label ---")
    corr = df[UCI_FEATURE_NAMES + ['Label']].corr()['Label'].sort_values(key=abs, ascending=False)
    print(corr.head(15))
    
    # Let's train a model based ONLY on the top 10 features to reduce noise
    top_features = corr.drop('Label').head(10).index.tolist()
    print("\n--- Top Features Selected ---")
    print(top_features)
    
    X = df[top_features].values
    y = df['Label'].values
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)
    
    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)
    
    # Try Gradient Boosting
    clf = GradientBoostingClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train_s, y_train)
    
    y_pred = clf.predict(X_test_s)
    print("\n--- Model Performance (Top 10 Features) ---")
    print(f"Accuracy: {accuracy_score(y_test, y_pred)*100:.2f}%")
    print(classification_report(y_test, y_pred, target_names=["Healthy", "Parkinson"]))
    
    # Save the dataframe for inspection
    df.to_csv(os.path.join(_DIR, "extracted_features_analysis.csv"), index=False)
    print(f"Saved extracted features to extracted_features_analysis.csv")
