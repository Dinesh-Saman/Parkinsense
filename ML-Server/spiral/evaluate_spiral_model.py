# evaluate_spiral_model_CORRECT.py  ← THIS IS THE ONE YOU MUST USE
import torch
import torch.nn as nn
from torchvision import transforms, models
from sklearn.metrics import confusion_matrix, classification_report, roc_curve, auc, accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
from PIL import Image
from pathlib import Path
import os

# Set relative paths to script location
BASE_DIR = Path(__file__).resolve().parent
TEST_HEALTHY = BASE_DIR / "testing" / "healthy"
TEST_PD      = BASE_DIR / "testing" / "parkinson"
MODEL_PATH   = BASE_DIR / "model" / "best_spiral_model.pth"

# Quick check
if not TEST_HEALTHY.exists() or not TEST_PD.exists():
    print("Test folders not found!")
    print(f"Expected: {TEST_HEALTHY}")
    print(f"and {TEST_PD}")
    exit()

print("Using ONLY the official 30-image test set for evaluation...\n")

healthy_paths = list(TEST_HEALTHY.glob("*.png"))
pd_paths = list(TEST_PD.glob("*.png"))

print(f"Test Healthy images  : {len(healthy_paths)}")
print(f"Test Parkinson images: {len(pd_paths)}")

# Transform
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Load model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = models.resnet18(weights=None)
model.fc = nn.Linear(model.fc.in_features, 1)

if not MODEL_PATH.exists():
    print(f"Error: Model not found at {MODEL_PATH}")
    exit()

model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.to(device)
model.eval()

# Predict
all_probs = []
all_preds = []
all_labels = []

with torch.no_grad():
    for path in healthy_paths:
        img = Image.open(path).convert("RGB")
        tensor = transform(img).unsqueeze(0).to(device)
        prob = torch.sigmoid(model(tensor)).item()
        all_probs.append(prob)
        all_preds.append(0 if prob < 0.5 else 1)
        all_labels.append(0)

    for path in pd_paths:
        img = Image.open(path).convert("RGB")
        tensor = transform(img).unsqueeze(0).to(device)
        prob = torch.sigmoid(model(tensor)).item()
        all_probs.append(prob)
        all_preds.append(1 if prob >= 0.5 else 0)
        all_labels.append(1)

if not all_labels:
    print("Error: No images found!")
    exit()

# Results
accuracy = accuracy_score(all_labels, all_preds)
print(f"\nOFFICIAL TEST ACCURACY (30 images): {accuracy*100:.2f}% ({int(accuracy*len(all_labels))}/{len(all_labels)} correct)")
print(classification_report(all_labels, all_preds, target_names=["Healthy", "Parkinson"]))

# Confusion Matrix
cm = confusion_matrix(all_labels, all_preds)
plt.figure(figsize=(7,5))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', cbar=False,
            xticklabels=['Healthy', 'Parkinson'],
            yticklabels=['Healthy', 'Parkinson'])
plt.title(f'Confusion Matrix\nTest Accuracy: {accuracy*100:.2f}% ({len(all_labels)} images)')
plt.ylabel('Actual')
plt.xlabel('Predicted')
plt.tight_layout()
cm_path = os.path.join(BASE_DIR, "official_confusion_matrix.png")
plt.savefig(cm_path, dpi=300)
# plt.show() # Commented out for non-interactive execution

# ROC
fpr, tpr, _ = roc_curve(all_labels, all_probs)
roc_auc = auc(fpr, tpr)
plt.figure(figsize=(7,5))
plt.plot(fpr, tpr, color='darkorange', lw=3, label=f'AUC = {roc_auc:.3f}')
plt.plot([0,1],[0,1], 'k--')
plt.xlim([0,1])
plt.ylim([0,1.05])
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curve (30-image test set)')
plt.legend()
plt.grid(True, alpha=0.3)
plt.tight_layout()
roc_path = os.path.join(BASE_DIR, "official_roc_curve.png")
plt.savefig(roc_path, dpi=300)
# plt.show() # Commented out for non-interactive execution

print(f"\nThis is your OFFICIAL result → {accuracy*100:.2f}% test accuracy")
print(f"Confusion Matrix saved to: {cm_path}")
print(f"ROC Curve saved to: {roc_path}")
