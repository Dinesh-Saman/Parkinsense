# ML-Server/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS   # ← THIS LINE ADDED
from PIL import Image
import torch
from torchvision import transforms, models
import os

app = Flask(__name__)
CORS(app)   # ← THIS ALLOWS REACT TO CONNECT!

# Load model
model = models.resnet18(pretrained=False)
model.fc = torch.nn.Linear(model.fc.in_features, 1)
model_path = "model/best_spiral_model.pth"
model.load_state_dict(torch.load(model_path, map_location="cpu"))
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error": "No image"}), 400

    file = request.files["image"]
    try:
        img = Image.open(file.stream).convert("RGB")
    except:
        return jsonify({"error": "Invalid image"}), 400

    img_t = transform(img).unsqueeze(0)

    with torch.no_grad():
        output = model(img_t)
        prob = torch.sigmoid(output).item()

    prediction = "Parkinson" if prob > 0.5 else "Healthy"
    confidence = round((prob if prediction == "Parkinson" else 1 - prob) * 100, 2)

    return jsonify({
        "prediction": prediction,
        "confidence": confidence,
        "hasParkinson": prediction == "Parkinson"
    })

if __name__ == "__main__":
    print("AI Server running → http://localhost:5001/predict")
    app.run(port=5001, debug=False)