# ML-Server/voice_predict.py
"""
Voice analysis prediction module for ParkinSense
Pipeline: upload audio → extract 22 UCI biomedical features → scikit-learn model → PD prediction
"""

import joblib
import numpy as np
import os

# ─────────────────────────────────────────────────────────────
# Load trained model, scaler, and feature column order
# ─────────────────────────────────────────────────────────────
_MODEL_PATH   = "model/voice_uci_model.pkl"
_SCALER_PATH  = "model/voice_scaler.pkl"
_SELECTOR_PATH = "model/voice_selector.pkl"
_COLUMNS_PATH = "model/voice_feature_columns.pkl"

_model    = None
_scaler   = None
_selector = None
_columns  = None

def _load_artifacts():
    global _model, _scaler, _selector, _columns
    if _model is not None:
        return  # already loaded

    if not os.path.exists(_MODEL_PATH):
        raise FileNotFoundError(
            f"Voice model not found at '{_MODEL_PATH}'.\n"
            "Run:  python train_voice_dataset.py"
        )

    _model    = joblib.load(_MODEL_PATH)
    _scaler   = joblib.load(_SCALER_PATH)
    _selector = joblib.load(_SELECTOR_PATH)
    _columns  = joblib.load(_COLUMNS_PATH)
    print(f"[voice_predict] UCI model and selector loaded from model/")

# ─────────────────────────────────────────────────────────────
# Main prediction function (called from Flask route)
# ─────────────────────────────────────────────────────────────
def predict_voice(audio_content: bytes) -> dict:
    """
    Input:  audio_content → bytes from request.files['audio'].read()
    Returns: dict with 'prediction', 'confidence', 'hasParkinson', and 'features'
    """
    try:
        _load_artifacts()

        # Extract 71 biomedical voice features from the audio
        from extract_voice_features import extract_features_from_audio, UCI_FEATURE_NAMES
        features = extract_features_from_audio(audio_content)  # shape (71,)

        # Scale, Select Top Features, and Predict
        features_scaled = _scaler.transform(features.reshape(1, -1))
        features_selected = _selector.transform(features_scaled)
        
        pred_label = _model.predict(features_selected)[0]          # 0=healthy, 1=PD
        proba      = _model.predict_proba(features_selected)[0]    # [P(healthy), P(PD)]

        pd_prob     = float(proba[1])
        is_parkinson = bool(pred_label == 1)
        prediction   = "Parkinson" if is_parkinson else "Healthy"
        confidence   = round((pd_prob if is_parkinson else 1 - pd_prob) * 100, 2)

        # Return named feature values for transparency
        feature_dict = {name: round(float(val), 6) for name, val in zip(UCI_FEATURE_NAMES, features)}

        return {
            "prediction":   prediction,
            "confidence":   confidence,
            "hasParkinson": is_parkinson,
            "features":     feature_dict
        }

    except ValueError as e:
        return {"error": str(e)}
    except Exception as e:
        return {"error": f"Voice processing failed: {str(e)}"}
