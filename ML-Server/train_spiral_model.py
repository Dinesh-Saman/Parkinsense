# train_spiral_model.py  ← FINAL VERSION (works even if you named folder differently)

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
from torchvision import transforms, models
from PIL import Image
from pathlib import Path
import os

# ------------------- AUTO FIND YOUR DATASET (no matter what you named it) -------------------
# It will search for any folder that contains "spiral" and has training/testing inside
possible_paths = list(Path(".").rglob("spiral"))
if not possible_paths:
    print("spiral folder not found!")
    print("Please make sure you have this structure somewhere in your project:")
    print("   any_folder_name/spiral/training/healthy/*.png")
    print("   any_folder_name/spiral/training/parkinson/*.png")
    print("   any_folder_name/spiral/testing/healthy/*.png")
    print("   any_folder_name/spiral/testing/parkinson/*.png")
    print("\nCurrent folder contents:")
    for p in Path(".").iterdir():
        print("   →", p)
    exit()

DATA_DIR = possible_paths[0]
print(f"Dataset found here → {DATA_DIR}")

TRAIN_HEALTHY = DATA_DIR / "training" / "healthy"
TRAIN_PD      = DATA_DIR / "training" / "parkinson"
TEST_HEALTHY  = DATA_DIR / "testing" / "healthy"
TEST_PD       = DATA_DIR / "testing" / "parkinson"

# Final check
if not all(p.exists() for p in [TRAIN_HEALTHY, TRAIN_PD, TEST_HEALTHY, TEST_PD]):
    print("Some subfolders are missing!")
    print("Expected:")
    print(f"   {TRAIN_HEALTHY}")
    print(f"   {TRAIN_PD}")
    print(f"   {TEST_HEALTHY}")
    print(f"   {TEST_PD}")
    exit()

# ------------------- Dataset Class -------------------
class SpiralDataset(Dataset):
    def __init__(self, healthy_dir, pd_dir, transform=None):
        self.images = []
        self.labels = []

        for p in healthy_dir.glob("*.png"):
            self.images.append(p)
            self.labels.append(0)
        for p in pd_dir.glob("*.png"):
            self.images.append(p)
            self.labels.append(1)

        self.transform = transform

    def __len__(self): return len(self.images)
    def __getitem__(self, idx):
        img = Image.open(self.images[idx]).convert("RGB")
        if self.transform:
            img = self.transform(img)
        return img, self.labels[idx]

# ------------------- Transforms -------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(20),
    transforms.ColorJitter(brightness=0.3, contrast=0.3),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

train_dataset = SpiralDataset(TRAIN_HEALTHY, TRAIN_PD, transform)
test_dataset  = SpiralDataset(TEST_HEALTHY,  TEST_PD,  transform)

print(f"Training images  : {len(train_dataset)} (should be 72)")
print(f"Testing images   : {len(test_dataset)} (should be 30)")

train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True, drop_last=True)
test_loader  = DataLoader(test_dataset,  batch_size=16, shuffle=False)

# ------------------- Model & Training -------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}\n")

model = models.resnet18(weights="IMAGENET1K_V1")
model.fc = nn.Linear(model.fc.in_features, 1)
model.to(device)

criterion = nn.BCEWithLogitsLoss()
optimizer = optim.Adam(model.parameters(), lr=0.0005)

best_acc = 0.0
print("Training started...\n" + "-"*60)

for epoch in range(30):
    model.train()
    for x, y in train_loader:
        x, y = x.to(device), y.to(device).float().unsqueeze(1)
        optimizer.zero_grad()
        loss = criterion(model(x), y)
        loss.backward()
        optimizer.step()

    # Test
    model.eval()
    correct = total = 0
    with torch.no_grad():
        for x, y in test_loader:
            x, y = x.to(device), y.to(device).float().unsqueeze(1)
            pred = (torch.sigmoid(model(x)) > 0.5).float()
            correct += (pred == y).sum().item()
            total += y.size(0)

    acc = correct / total
    print(f"Epoch {epoch+1:02d} → Test Accuracy: {acc:.4f} ({correct}/{total})")
    if acc > best_acc:
        best_acc = acc
        os.makedirs("model", exist_ok=True)
        torch.save(model.state_dict(), "model/best_spiral_model.pth")
        print(f"   → BEST MODEL SAVED! ({best_acc:.4f})")

print("-"*60)
print(f"Training finished! Best accuracy: {best_acc:.2%}")
print("Model saved → model/best_spiral_model.pth")
print("Ready for your Flask server!")