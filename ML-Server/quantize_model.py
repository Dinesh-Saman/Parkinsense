import torch
from torchvision import models

model = models.resnet18(pretrained=False)
model.fc = torch.nn.Linear(model.fc.in_features, 1)
model.load_state_dict(torch.load("model/best_spiral_model.pth", map_location="cpu"))

# Quantize (dynamic quantization for linear layers)
quantized_model = torch.quantization.quantize_dynamic(
    model, {torch.nn.Linear}, dtype=torch.qint8
)

torch.save(quantized_model.state_dict(), "model/quantized_best_spiral_model.pth")
print("Quantized model saved.")