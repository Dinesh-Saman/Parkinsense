# train_voice_uci.py
# Downloads UCI Parkinson's dataset and trains a Random Forest classifier
# on the 22 biomedical voice features. Saves model/voice_uci_model.pkl

from ucimlrepo import fetch_ucirepo
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
import numpy as np

print("Fetching UCI Parkinson's dataset...")
parkinsons = fetch_ucirepo(id=174)

X = parkinsons.data.features
y = parkinsons.data.targets.values.ravel()

print(f"Dataset loaded: {X.shape[0]} samples, {X.shape[1]} features")
print(f"Class distribution → Healthy (0): {(y==0).sum()}  |  Parkinson's (1): {(y==1).sum()}")
print(f"Feature columns: {list(X.columns)}\n")

# Save the feature column order — voice_predict.py must extract features in THIS exact order
FEATURE_COLUMNS = list(X.columns)
os.makedirs("model", exist_ok=True)
joblib.dump(FEATURE_COLUMNS, "model/voice_feature_columns.pkl")
print(f"Feature column order saved → model/voice_feature_columns.pkl")

# Split (stratified to preserve class balance)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled  = scaler.transform(X_test)
joblib.dump(scaler, "model/voice_scaler.pkl")
print("Scaler saved → model/voice_scaler.pkl")

# Train Random Forest (best for small tabular datasets like this)
print("\nTraining Random Forest classifier...")
clf = RandomForestClassifier(
    n_estimators=200,
    max_depth=None,
    min_samples_split=2,
    random_state=42,
    n_jobs=-1
)
clf.fit(X_train_scaled, y_train)

# Evaluate
y_pred = clf.predict(X_test_scaled)
acc = accuracy_score(y_test, y_pred)
print(f"\nTest Accuracy: {acc*100:.2f}%")
print("\nClassification Report:")
print(classification_report(y_test, y_pred, target_names=["Healthy", "Parkinson's"]))

# Feature importance
importances = clf.feature_importances_
top_idx = np.argsort(importances)[::-1][:5]
print("Top 5 most important features:")
for i in top_idx:
    print(f"  {FEATURE_COLUMNS[i]}: {importances[i]:.4f}")

# Save model
joblib.dump(clf, "model/voice_uci_model.pkl")
print(f"\nModel saved → model/voice_uci_model.pkl")
print("Training complete! Restart Flask server to use the new model.")
