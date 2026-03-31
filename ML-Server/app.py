# ML-Server/app.py
import os
import sys

# --- MAC ARM64 HARDENING: Set these BEFORE any heavy imports ---
# os.environ["NUMBA_DISABLE_JIT"] = "1"  <-- Removed to fix 'get_call_template' error
os.environ["NUMBA_CACHE_DIR"] = "/tmp/numba_cache"
os.environ["MPLBACKEND"] = "Agg"
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
# -------------------------------------------------------------

# --- HEIC SUPPORT: Register HEIF opener for PIL ---
try:
    from pillow_heif import register_heif_opener
    register_heif_opener()
except ImportError:
    print("[app] Warning: pillow-heif not installed. HEIC support will be disabled.")
# --------------------------------------------------

# --- STABILIZATION: Import these early to avoid C-level thread crashes ---
try:
    import parselmouth
    import librosa
    import soundfile
except Exception as e:
    print(f"[app] Warning: Early library import failed: {e}")
# ----------------------------------------------------------------------

from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import torch
from torchvision import transforms, models
from voice.voice_predict import predict_voice

app = Flask(__name__)
CORS(app)

# Load model
# Use weights=None to fix UserWarning and modern torchvision API
model = models.resnet18(weights=None)
model.fc = torch.nn.Linear(model.fc.in_features, 1)

# Fix relative path for spiral model (mac-compatibility)
_APP_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(_APP_DIR, "spiral", "model", "best_spiral_model.pth")

if os.path.exists(model_path):
    model.load_state_dict(torch.load(model_path, map_location="cpu"))
    model.eval()
    print(f"[app] Spiral model loaded from {model_path}")
else:
    print(f"[app] Warning: Spiral model not found at {model_path}")

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

@app.route("/predict_voice", methods=["POST"])
def predict_voice_route():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file"}), 400
    
    audio_file = request.files["audio"]
    filename = audio_file.filename
    audio_content = audio_file.read()
    
    result = predict_voice(audio_content, filename=filename)
    
    if "error" in result:
        print(f"[Voice API Error]: {result['error']}")
        status_code = 400 if "Analysis failed" in result['error'] or "Voice processing failed" in result['error'] else 500
        return jsonify(result), status_code
        
    return jsonify(result)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5005))
    print(f"AI Server running → http://0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)