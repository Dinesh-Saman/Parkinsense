# train_voice_model.py  ← WITH MULTIPLE MODEL COMPARISON & AUTO BEST MODEL SELECTION

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
from torchvision import transforms, models
from pathlib import Path
import os
import pandas as pd
from sklearn.metrics import accuracy_score

# ------------------- AUTO FIND YOUR DATASET (wave folder) -------------------
possible_paths = list(Path(".").rglob("wave"))
if not possible_paths:
    print("wave folder not found!")
    print("Expected structure:")
    print("   any_folder/wave/training/healthy/*.png")
    print("   any_folder/wave/training/parkinson/*.png")
    print("   any_folder/wave/testing/healthy/*.png")
    print("   any_folder/wave/testing/parkinson/*.png")
    exit()

DATA_DIR = possible_paths[0]
print(f"Voice dataset (spectrograms) found → {DATA_DIR}")

TRAIN_HEALTHY = DATA_DIR / "training" / "healthy"
TRAIN_PD      = DATA_DIR / "training" / "parkinson"
TEST_HEALTHY  = DATA_DIR / "testing" / "healthy"
TEST_PD       = DATA_DIR / "testing" / "parkinson"

if not all(p.exists() for p in [TRAIN_HEALTHY, TRAIN_PD, TEST_HEALTHY, TEST_PD]):
    print("Missing subfolders in wave directory!")
    exit()

# ------------------- Voice Dataset Class (Image based) -------------------
class VoiceDataset(Dataset):
    def __init__(self, healthy_dir, pd_dir, transform=None):
        self.image_paths = []
        self.labels = []

        for p in healthy_dir.glob("*.png"):
            self.image_paths.append(p)
            self.labels.append(0)
        for p in pd_dir.glob("*.png"):
            self.image_paths.append(p)
            self.labels.append(1)

        self.transform = transform

    def __len__(self): return len(self.image_paths)

    def __getitem__(self, idx):
        from PIL import Image
        img = Image.open(self.image_paths[idx]).convert("RGB")
        if self.transform:
            img = self.transform(img)
        return img, self.labels[idx]

# Standard transforms with Augmentation for training
train_transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
    transforms.ColorJitter(brightness=0.1, contrast=0.1),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

test_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

train_dataset = VoiceDataset(TRAIN_HEALTHY, TRAIN_PD, transform=train_transform)
test_dataset  = VoiceDataset(TEST_HEALTHY, TEST_PD, transform=test_transform)

train_loader = DataLoader(train_dataset, batch_size=8, shuffle=True, drop_last=True)
test_loader  = DataLoader(test_dataset, batch_size=8, shuffle=False)

# ------------------- Device -------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}\n")

# ------------------- Model Factory Functions -------------------
def get_resnet18():
    model = models.resnet18(weights="IMAGENET1K_V1")
    model.fc = nn.Linear(model.fc.in_features, 1)
    return model.to(device)

def get_efficientnet_b0():
    model = models.efficientnet_b0(weights="IMAGENET1K_V1")
    model.classifier[1] = nn.Linear(model.classifier[1].in_features, 1)
    return model.to(device)

def get_mobilenet_v3_small():
    model = models.mobilenet_v3_small(weights="IMAGENET1K_V1")
    model.classifier[3] = nn.Linear(model.classifier[3].in_features, 1)
    return model.to(device)

class SimpleMLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.flatten = nn.Flatten()
        self.fc = nn.Sequential(
            nn.Linear(3*224*224, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, 128),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(128, 1)
        )
    def forward(self, x):
        return self.fc(self.flatten(x))

# List of models to compare
models_to_compare = {
    "ResNet18": get_resnet18,
    "EfficientNet-B0": get_efficientnet_b0,
    "MobileNetV3-Small": get_mobilenet_v3_small,
    "SimpleMLP": lambda: SimpleMLP().to(device)
}

# ------------------- Training & Comparison Loop -------------------
results = []
criterion = nn.BCEWithLogitsLoss()

for model_name, model_fn in models_to_compare.items():
    print(f"\n{'='*70}")
    print(f"Training {model_name}")
    print(f"{'='*70}\n")

    model = model_fn()
    optimizer = optim.Adam(model.parameters(), lr=0.0003)

    best_acc = 0.0
    for epoch in range(30):
        model.train()
        running_loss = 0.0
        for x, y in train_loader:
            x, y = x.to(device), y.to(device).float().unsqueeze(1)
            optimizer.zero_grad()
            output = model(x)
            loss = criterion(output, y)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()

        # Validation
        model.eval()
        preds, trues = [], []
        with torch.no_grad():
            for x, y in test_loader:
                x = x.to(device)
                output = model(x)
                prob = torch.sigmoid(output)
                pred = (prob > 0.5).float().squeeze()
                preds.extend(pred.cpu().numpy())
                trues.extend(y.numpy())

        acc = accuracy_score(trues, preds)
        print(f"Epoch {epoch+1:02d} → Loss: {running_loss/len(train_loader):.4f} | Acc: {acc:.4f}")

        if acc > best_acc:
            best_acc = acc
            save_path = f"model/best_{model_name.lower().replace('-','_')}.pth"
            os.makedirs("model", exist_ok=True)
            torch.save(model.state_dict(), save_path)
            print(f"   → Saved best for {model_name} ({best_acc:.4f})")

    results.append({
        "Model": model_name,
        "Best Accuracy": f"{best_acc:.4f}",
        "Saved Path": f"model/best_{model_name.lower().replace('-','_')}.pth"
    })

# ------------------- Final Summary & Auto-Select Best -------------------
print("\n" + "="*70)
print("FINAL MODEL COMPARISON")
print("="*70)
df = pd.DataFrame(results)
df_sorted = df.sort_values("Best Accuracy", ascending=False)
print(df_sorted.to_string(index=False))

# Find overall best
best_row = df_sorted.iloc[0]
best_model_name = best_row["Model"]
best_acc_str = best_row["Best Accuracy"]
best_path = best_row["Saved Path"]

print("\n" + "-"*70)
print(f"OVERALL BEST MODEL: {best_model_name}")
print(f"Best Accuracy: {best_acc_str}")
print(f"Saved at: {best_path}")
print("-"*70)

# Automatically copy the best model to the standard name used in app.py
import shutil
final_path = "model/best_voice_model.pth"
shutil.copy(best_path, final_path)
print(f"Copied best model to → {final_path}")
print("You can now use this file directly in app.py without changing anything!")
print("Training complete. Restart your Flask server to use the best model.")
