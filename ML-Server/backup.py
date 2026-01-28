# ML-Server/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import torch
from torchvision import transforms, models
import torchaudio
import torch.nn as nn
from io import BytesIO
import os

app = Flask(__name__)
CORS(app)  # Allows React frontend to connect

# ────────────────────────────────────────────────
# Shared Device
# ────────────────────────────────────────────────
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# ────────────────────────────────────────────────
# SPIRAL MODEL & TRANSFORM (unchanged)
# ────────────────────────────────────────────────
spiral_model = models.resnet18(pretrained=False)
spiral_model.fc = torch.nn.Linear(spiral_model.fc.in_features, 1)
spiral_model_path = "model/best_spiral_model.pth"
spiral_model.load_state_dict(torch.load(spiral_model_path, map_location=device))
spiral_model.to(device)
spiral_model.eval()

spiral_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# ────────────────────────────────────────────────
# VOICE MODEL & PREPROCESSING
# ────────────────────────────────────────────────
class VoiceParkinsonModel(nn.Module):
    def __init__(self):
        super(VoiceParkinsonModel, self).__init__()
        self.backbone = models.resnet18(pretrained=False)
        # If your voice model was trained with 1-channel spectrogram, change conv1:
        # self.backbone.conv1 = nn.Conv2d(1, 64, kernel_size=7, stride=2, padding=3, bias=False)
        self.backbone.fc = nn.Linear(self.backbone.fc.in_features, 1)

    def forward(self, x):
        return self.backbone(x)

voice_model = VoiceParkinsonModel()
voice_model_path = "model/best_voice_model.pth"  # ← CHANGE TO YOUR ACTUAL VOICE MODEL FILE
voice_model.load_state_dict(torch.load(voice_model_path, map_location=device))
voice_model.to(device)
voice_model.eval()

# Voice preprocessing parameters (adjust if your training used different values)
VOICE_SAMPLE_RATE = 16000
VOICE_N_MELS = 128
VOICE_N_FFT = 1024
VOICE_HOP_LENGTH = 512
VOICE_TARGET_SIZE = 224

def preprocess_voice(audio_bytes):
    """Convert audio bytes → Mel-spectrogram tensor (1, 3, 224, 224)"""
    waveform, orig_sr = torchaudio.load(BytesIO(audio_bytes))

    # Resample if needed
    if orig_sr != VOICE_SAMPLE_RATE:
        resampler = torchaudio.transforms.Resample(orig_sr, VOICE_SAMPLE_RATE)
        waveform = resampler(waveform)

    # To mono
    if waveform.shape[0] > 1:
        waveform = torch.mean(waveform, dim=0, keepdim=True)

    # Mel Spectrogram
    mel_transform = torchaudio.transforms.MelSpectrogram(
        sample_rate=VOICE_SAMPLE_RATE,
        n_fft=VOICE_N_FFT,
        hop_length=VOICE_HOP_LENGTH,
        n_mels=VOICE_N_MELS,
        normalized=True
    )
    mel_spec = mel_transform(waveform)

    # Log scale
    mel_spec_db = torchaudio.transforms.AmplitudeToDB()(mel_spec)

    # Resize to model input size
    resize = torchaudio.transforms.Resize((VOICE_TARGET_SIZE, VOICE_TARGET_SIZE))
    mel_spec_resized = resize(mel_spec_db)

    # Repeat to 3 channels (for ResNet)
    mel_spec_3ch = mel_spec_resized.repeat(3, 1, 1)

    return mel_spec_3ch.unsqueeze(0).to(device)

# ────────────────────────────────────────────────
# ENDPOINTS
# ────────────────────────────────────────────────

@app.route("/predict", methods=["POST"])
def predict_spiral():
    if "image" not in request.files:
        return jsonify({"error": "No image"}), 400

    file = request.files["image"]
    try:
        img = Image.open(file.stream).convert("RGB")
    except:
        return jsonify({"error": "Invalid image"}), 400

    img_t = spiral_transform(img).unsqueeze(0).to(device)

    with torch.no_grad():
        output = spiral_model(img_t)
        prob = torch.sigmoid(output).item()

    prediction = "Parkinson" if prob > 0.5 else "Healthy"
    confidence = round((prob if prediction == "Parkinson" else 1 - prob) * 100, 2)

    return jsonify({
        "prediction": prediction,
        "confidence": confidence,
        "hasParkinson": prediction == "Parkinson"
    })


@app.route("/predict_voice", methods=["POST"])
def predict_voice():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file"}), 400

    file = request.files["audio"]
    
    try:
        # Read directly into memory
        audio_bytes = file.read()
        
        # Preprocess
        input_tensor = preprocess_voice(audio_bytes)

        with torch.no_grad():
            output = voice_model(input_tensor)
            prob = torch.sigmoid(output).item()

        prediction = "Parkinson" if prob > 0.5 else "Healthy"
        confidence = round((prob if prediction == "Parkinson" else 1 - prob) * 100, 2)

        return jsonify({
            "prediction": prediction,
            "confidence": confidence,
            "hasParkinson": prediction == "Parkinson"
        })

    except Exception as e:
        return jsonify({"error": f"Voice processing failed: {str(e)}"}), 500


if __name__ == "__main__":
    print("AI Server running → http://localhost:5001")
    print("Endpoints:")
    print("  POST /predict        → Spiral image analysis")
    print("  POST /predict_voice  → Voice audio analysis")
    app.run(port=5001, debug=False)