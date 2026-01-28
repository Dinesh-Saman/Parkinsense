# ML-Server/voice_predict.py
"""
Voice analysis prediction module for ParkinSense
Processes uploaded audio → extracts Mel-spectrogram → runs through trained model → returns PD prediction
"""

import torch
import torchaudio
import torch.nn as nn
from torchvision import models
import os
from io import BytesIO

# ────────────────────────────────────────────────
# Model Definition (change this to match YOUR trained architecture)
# ────────────────────────────────────────────────
class VoiceParkinsonModel(nn.Module):
    def __init__(self):
        super(VoiceParkinsonModel, self).__init__()
        # Using ResNet18 backbone (common choice for spectrogram-based PD detection)
        self.backbone = models.resnet18(pretrained=False)
        # Modify first conv layer to accept 1-channel spectrogram if needed
        # (most papers repeat 1 channel → 3 channels to use pretrained weights)
        self.backbone.conv1 = nn.Conv2d(3, 64, kernel_size=7, stride=2, padding=3, bias=False)
        self.backbone.fc = nn.Linear(self.backbone.fc.in_features, 1)  # Binary output (PD vs Healthy)

    def forward(self, x):
        return self.backbone(x)

# ────────────────────────────────────────────────
# Load the trained model (update path & device)
# ────────────────────────────────────────────────
VOICE_MODEL_PATH = "model/best_voice_model.pth"  # ← CHANGE TO YOUR ACTUAL MODEL FILE

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

voice_model = VoiceParkinsonModel()
voice_model.load_state_dict(torch.load(VOICE_MODEL_PATH, map_location=device))
voice_model.to(device)
voice_model.eval()

print(f"Voice model loaded successfully from: {VOICE_MODEL_PATH}")
print(f"Running on device: {device}")

# ────────────────────────────────────────────────
# Audio Preprocessing Pipeline
# ────────────────────────────────────────────────
def preprocess_voice(audio_content, sample_rate=16000, n_mels=128, n_fft=1024, hop_length=512, target_length=224):
    """
    Convert raw audio bytes → Mel-spectrogram → resized tensor ready for model
    Input: audio_content (bytes from request.files['audio'].read())
    Output: torch.Tensor of shape (1, 3, 224, 224)
    """
    # Load from bytes
    waveform, orig_sr = torchaudio.load(BytesIO(audio_content))

    # Resample if needed
    if orig_sr != sample_rate:
        resampler = torchaudio.transforms.Resample(orig_sr, sample_rate)
        waveform = resampler(waveform)

    # Convert to mono if stereo
    if waveform.shape[0] > 1:
        waveform = torch.mean(waveform, dim=0, keepdim=True)

    # Mel Spectrogram
    mel_transform = torchaudio.transforms.MelSpectrogram(
        sample_rate=sample_rate,
        n_fft=n_fft,
        hop_length=hop_length,
        n_mels=n_mels,
        normalized=True
    )
    mel_spec = mel_transform(waveform)

    # To dB scale (most papers use log scale)
    mel_spec_db = torchaudio.transforms.AmplitudeToDB()(mel_spec)

    # Resize to fixed size expected by model (e.g. 224×224)
    resize = torchaudio.transforms.Resize((target_length, target_length))
    mel_spec_resized = resize(mel_spec_db)

    # Repeat channel from 1 → 3 (to match ResNet input)
    mel_spec_3ch = mel_spec_resized.repeat(3, 1, 1)  # (3, H, W)

    return mel_spec_3ch.unsqueeze(0)  # (1, 3, H, W)

# ────────────────────────────────────────────────
# Main prediction function (called from Flask route)
# ────────────────────────────────────────────────
def predict_voice(audio_content):
    """
    Input: audio_content → bytes from request.files['audio'].read()
    Returns: dict with prediction, confidence, hasParkinson
    """
    try:
        input_tensor = preprocess_voice(audio_content).to(device)

        with torch.no_grad():
            output = voice_model(input_tensor)
            prob = torch.sigmoid(output).squeeze().item()

        # Threshold at 0.5 (adjust if you tuned differently)
        prediction = "Parkinson" if prob > 0.5 else "Healthy"
        # Confidence: probability of the predicted class
        confidence = round((prob if prediction == "Parkinson" else 1 - prob) * 100, 2)

        return {
            "prediction": prediction,
            "confidence": confidence,
            "hasParkinson": prediction == "Parkinson"
        }

    except Exception as e:
        return {"error": f"Voice processing failed: {str(e)}"}