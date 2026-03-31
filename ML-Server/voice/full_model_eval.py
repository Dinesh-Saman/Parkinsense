import pandas as pd
import numpy as np
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.preprocessing import StandardScaler, RobustScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, AdaBoostClassifier, ExtraTreesClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression
from sklearn.neural_network import MLPClassifier
from sklearn.neighbors import KNeighborsClassifier
from xgboost import XGBClassifier

df = pd.read_csv('voice/extracted_features_analysis.csv')

# Drop FileName and Class, separate X and y
X = df.drop(columns=['FileName', 'Class', 'Label']).values
y = df['Label'].values

print(f"Loaded dataset: {X.shape[0]} samples, {X.shape[1]} features.")

# Scaling
scaler = RobustScaler()
X_scaled = scaler.fit_transform(X)

models = {
    "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
    "Random Forest (100)": RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced'),
    "Random Forest (500)": RandomForestClassifier(n_estimators=500, max_depth=5, random_state=42, class_weight='balanced'),
    "Extra Trees": ExtraTreesClassifier(n_estimators=500, max_depth=5, random_state=42, class_weight='balanced'),
    "Gradient Boosting": GradientBoostingClassifier(n_estimators=100, random_state=42),
    "XGBoost": XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42),
    "AdaBoost": AdaBoostClassifier(random_state=42),
    "SVM (RBF)": SVC(kernel='rbf', probability=True, random_state=42, class_weight='balanced'),
    "SVM (Linear)": SVC(kernel='linear', probability=True, random_state=42, class_weight='balanced'),
    "KNN": KNeighborsClassifier(n_neighbors=5),
    "MLP Neural Net": MLPClassifier(hidden_layer_sizes=(100, 50), max_iter=1000, random_state=42)
}

print("\n--- 5-Fold Cross Validation Accuracy ---")
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

best_acc = 0
best_model_name = ""

for name, model in models.items():
    scores = cross_val_score(model, X_scaled, y, cv=cv, scoring='accuracy')
    mean_score = np.mean(scores)
    std_score = np.std(scores)
    print(f"{name:25s}: {mean_score*100:.2f}% (+/- {std_score*100:.2f}%)")
    
    if mean_score > best_acc:
        best_acc = mean_score
        best_model_name = name

print(f"\nBest Model: {best_model_name} with {best_acc*100:.2f}% accuracy")
