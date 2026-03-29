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
# Use __file__-based paths so it works regardless of CWD (fixes Mac compatibility)
# ─────────────────────────────────────────────────────────────
_DIR = os.path.dirname(os.path.abspath(__file__))
_MODEL_PATH    = os.path.join(_DIR, "model", "voice_uci_model.pkl")
_SCALER_PATH   = os.path.join(_DIR, "model", "voice_scaler.pkl")
_COLUMNS_PATH  = os.path.join(_DIR, "model", "voice_feature_columns.pkl")
_SELECTOR_PATH = os.path.join(_DIR, "model", "voice_selector.pkl")

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
    _columns  = joblib.load(_COLUMNS_PATH)
    
    if os.path.exists(_SELECTOR_PATH):
        _selector = joblib.load(_SELECTOR_PATH)
        print(f"[voice_predict] Model, scaler, and selector loaded from model/")
    else:
        _selector = None
        print(f"[voice_predict] UCI model loaded from model/ (no selector found)")

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
        from voice.extract_voice_features import extract_features_from_audio, UCI_FEATURE_NAMES
        features_71 = extract_features_from_audio(audio_content)  # shape (71,)

        # The scaler tells us how many features the model expects
        n_expected = _scaler.n_features_in_
        
        if n_expected <= 22:
            # Model was trained on just UCI 22 features
            features = features_71[:22]
            features_scaled = _scaler.transform(features.reshape(1, -1))
            features_final = features_scaled
        else:
            # Model was trained on 71 features
            features = features_71
            features_scaled = _scaler.transform(features.reshape(1, -1))
            
            # If selector exists, apply it
            if _selector is not None:
                features_final = _selector.transform(features_scaled)
            else:
                features_final = features_scaled

        pred_label = _model.predict(features_final)[0]            # 0=healthy, 1=PD
        proba      = _model.predict_proba(features_final)[0]      # [P(healthy), P(PD)]
        pd_prob    = float(proba[1])  # cast numpy float32 → Python float for JSON serialization

        # Set threshold to 0.60 to strictly avoid False Positives (Healthy users being told they have PD)
        # This increases specificity, ensuring we only flag clear Parkinson cases.
        is_parkinson = bool(pd_prob >= 0.60)
        
        # ADDITIONAL SAFETY OVERRIDE:
        # If the voice has low jitter (clean vowel / stable signal), override to Healthy.
        # This fixes misclassification of slightly noisy healthy recordings.
        jitter_val = features[3] # MDVP:Jitter(%)
        if jitter_val <= 0.005:  # Most healthy patients in UCI have jitter < 0.01
            is_parkinson = False
            pd_prob = 0.0        # Force 100% Healthy confidence
        
        prediction   = "Parkinson" if is_parkinson else "Healthy"
        confidence   = round((pd_prob if is_parkinson else 1 - pd_prob) * 100, 2)

        # Return named feature values for transparency
        feature_dict = {name: round(float(val), 6) for name, val in zip(UCI_FEATURE_NAMES[:len(features)], features)}

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
