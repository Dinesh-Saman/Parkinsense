# train_voice_dataset.py
# Advanced Voice Training Pipeline for Parkinsense
# Uses 71 features (UCI + MFCC/Delta/Delta2 + Contrast + Spectral) 
# Features RFE + Ensemble (XGB + SVM + RF) + SMOTE

import pandas as pd
import numpy as np
import os
import joblib
import warnings
from sklearn.model_selection import train_test_split, StratifiedKFold, RandomizedSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.svm import SVC
from sklearn.feature_selection import RFE
from sklearn.metrics import accuracy_score, classification_report
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE
from extract_voice_features import extract_features_from_audio, UCI_FEATURE_NAMES

warnings.filterwarnings('ignore')

# Configuration
DATASET_DIR = "Voice_Dataset"
DEMOGRAPHICS_FILE = "Demographics_age_sex.xlsx"
MODEL_DIR = "model"
os.makedirs(MODEL_DIR, exist_ok=True)

def load_data():
    print("🚀 Loading data and labels...")
    if not os.path.exists(DEMOGRAPHICS_FILE):
        print(f"❌ Error: {DEMOGRAPHICS_FILE} not found.")
        return [], []
        
    df = pd.read_excel(DEMOGRAPHICS_FILE)
    label_map = {"HC": 0, "PwPD": 1}
    df['label_int'] = df['Label'].map(label_map)
    id_to_label = dict(zip(df['Sample ID'], df['label_int']))
    
    X, y = [], []
    subfolders = ["HC_AH", "PD_AH"]
    
    for sub in subfolders:
        folder_path = os.path.join(DATASET_DIR, sub)
        if not os.path.exists(folder_path): continue
            
        files = [f for f in os.listdir(folder_path) if f.endswith(".wav")]
        print(f"📦 Extracting {len(files)} files from {sub}...")
        
        for filename in files:
            sample_id = filename.replace(".wav", "")
            label = None
            
            if sample_id in id_to_label:
                label = id_to_label[sample_id]
            else:
                for sid, lbl in id_to_label.items():
                    if sid in sample_id or sample_id in sid:
                        label = lbl
                        break
            
            if label is None: continue
            
            file_path = os.path.join(folder_path, filename)
            try:
                with open(file_path, "rb") as f:
                    audio_bytes = f.read()
                features = extract_features_from_audio(audio_bytes)
                X.append(features)
                y.append(label)
            except Exception as e:
                print(f"⚠️ Error in {filename}: {e}")
                
    return np.array(X), np.array(y)

def train_best_model(X, y):
    print(f"\n✨ Training on {len(X)} samples with {len(UCI_FEATURE_NAMES)} features...")
    
    # 1. Stratified Split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # 2. Resampling (SMOTE)
    smote = SMOTE(random_state=42)
    X_train_res, y_train_res = smote.fit_resample(X_train, y_train)
    
    # 3. Scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train_res)
    X_test_scaled = scaler.transform(X_test)
    
    # 4. Feature Selection (RFE with Random Forest)
    # Selecting top 25 features to avoid overfitting with small dataset
    print("🎯 Selecting best 25 features via RFE...")
    selector = RFE(estimator=RandomForestClassifier(n_estimators=100, random_state=42), n_features_to_select=25, step=1)
    selector = selector.fit(X_train_scaled, y_train_res)
    
    X_train_sel = selector.transform(X_train_scaled)
    X_test_sel = selector.transform(X_test_scaled)
    
    selected_feature_names = [UCI_FEATURE_NAMES[i] for i, mask in enumerate(selector.support_) if mask]
    print(f"📌 Selected Features: {selected_feature_names[:5]} ... and more.")

    # 5. XGBoost Optimization
    print("🧠 Optimizing XGBoost Model...")
    xgb = XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
    
    param_grid = {
        'n_estimators': [100, 200, 300],
        'max_depth': [3, 4, 5],
        'learning_rate': [0.01, 0.05, 0.1],
        'subsample': [0.7, 0.8, 0.9],
        'colsample_bytree': [0.7, 0.8, 0.9]
    }
    
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    search = RandomizedSearchCV(xgb, param_grid, n_iter=15, cv=cv, scoring='accuracy', random_state=42)
    search.fit(X_train_sel, y_train_res)
    best_xgb = search.best_estimator_

    # 6. Ensemble: XGBoost + SVM + Random Forest
    rf = RandomForestClassifier(n_estimators=200, class_weight='balanced', random_state=42)
    svm = SVC(probability=True, kernel='rbf', C=1.0, class_weight='balanced', random_state=42)
    
    ensemble = VotingClassifier(
        estimators=[('xgb', best_xgb), ('rf', rf), ('svm', svm)],
        voting='soft'
    )
    
    ensemble.fit(X_train_sel, y_train_res)
    
    # 7. Evaluation
    y_pred = ensemble.predict(X_test_sel)
    acc = accuracy_score(y_test, y_pred)
    
    print("\n" + "="*30)
    print(f"🔥 FINAL ACCURACY: {acc*100:.2f}%")
    print("="*30)
    print(classification_report(y_test, y_pred))
    
    # Save Artifacts
    # Note: We now need to save the selector too!
    joblib.dump(ensemble, os.path.join(MODEL_DIR, "voice_uci_model.pkl"))
    joblib.dump(scaler, os.path.join(MODEL_DIR, "voice_scaler.pkl"))
    joblib.dump(selector, os.path.join(MODEL_DIR, "voice_selector.pkl"))
    joblib.dump(UCI_FEATURE_NAMES, os.path.join(MODEL_DIR, "voice_feature_columns.pkl"))
    
    print(f"\n💾 Saved high-accuracy models to {MODEL_DIR}")

if __name__ == "__main__":
    X, y = load_data()
    if len(X) > 0:
        train_best_model(X, y)
    else:
        print("❌ No data loaded.")
