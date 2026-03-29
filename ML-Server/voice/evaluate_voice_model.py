# evaluate_voice_model.py
# Downloads the official UCI dataset, compares 3 models, saves the best, and generates charts

import joblib
import numpy as np
import os
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, roc_curve, auc
from ucimlrepo import fetch_ucirepo

# 1. SETUP PATHS
_DIR = os.path.dirname(os.path.abspath(__file__))
_MODEL_DIR = os.path.join(_DIR, "model")
os.makedirs(_MODEL_DIR, exist_ok=True)
_MODEL_PATH  = os.path.join(_MODEL_DIR, "voice_uci_model.pkl")
_SCALER_PATH = os.path.join(_MODEL_DIR, "voice_scaler.pkl")
_COLUMNS_PATH = os.path.join(_MODEL_DIR, "voice_feature_columns.pkl")

# 2. FETCH DATASET
print("🚀 Fetching official UCI Parkinson's dataset for evaluation...")
parkinsons = fetch_ucirepo(id=174)
X = parkinsons.data.features
y = parkinsons.data.targets.values.ravel()

# 3. PREPARE DATA
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# 4. COMPARE 3 MODELS
print("\n📊 Evaluating 3 Models...")
models = {
    "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
    "SVM": SVC(probability=True, random_state=42),
    "XGBoost": XGBClassifier(eval_metric='logloss', random_state=42)
}

results = []
best_model = None
best_acc = 0
best_name = ""

for name, clf in models.items():
    clf.fit(X_train_scaled, y_train)
    y_pred = clf.predict(X_test_scaled)
    acc = accuracy_score(y_test, y_pred)
    print(f"   [{name}] Accuracy: {acc*100:.2f}%")
    
    if acc > best_acc:
        best_acc = acc
        best_model = clf
        best_name = name

print(f"\n🏆 BEST MODEL: {best_name} with Accuracy {best_acc*100:.2f}%")

# 5. SAVE BEST MODEL
joblib.dump(best_model, _MODEL_PATH)
joblib.dump(scaler, _SCALER_PATH)
joblib.dump(list(X.columns), _COLUMNS_PATH)
print("💾 Best model saved to predict later!\n")

# 6. CALCULATE FINAL METRICS & CHARTS
y_pred_best = best_model.predict(X_test_scaled)
y_prob_best = best_model.predict_proba(X_test_scaled)[:, 1]

print(f"✅ OFFICIAL VALIDATION ACCURACY: {best_acc*100:.2f}%")
print("\nClassification Report:")
print(classification_report(y_test, y_pred_best, target_names=["Healthy", "Parkinson's"]))

# Confusion Matrix
plt.figure(figsize=(8, 6))
cm = confusion_matrix(y_test, y_pred_best)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=["Healthy", "Parkinson's"], yticklabels=["Healthy", "Parkinson's"])
plt.title(f'{best_name} - Confusion Matrix (Acc: {best_acc*100:.2f}%)')
plt.xlabel('Predicted')
plt.ylabel('Actual')
cm_path = os.path.join(_DIR, "voice_confusion_matrix.png")
plt.savefig(cm_path)
plt.close()

# ROC Curve
fpr, tpr, thresholds = roc_curve(y_test, y_prob_best)
roc_auc = auc(fpr, tpr)
plt.figure(figsize=(8, 6))
plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (area = {roc_auc:.2f})')
plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
plt.xlim([0.0, 1.0])
plt.ylim([0.0, 1.05])
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title(f'{best_name} - ROC Curve')
plt.legend(loc="lower right")
roc_path = os.path.join(_DIR, "voice_roc_curve.png")
plt.savefig(roc_path)
plt.close()

print(f"📈 Confusion Matrix saved to: {cm_path}")
print(f"📈 ROC Curve saved to: {roc_path}")
print("\nEvaluation complete! The best model is ready for prediction.")
