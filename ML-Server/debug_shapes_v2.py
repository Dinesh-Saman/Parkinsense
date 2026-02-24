import joblib
import os
import numpy as np

def check_artifact(name, path):
    print(f"\n--- Checking {name} ({path}) ---")
    try:
        obj = joblib.load(path)
        print(f"Type: {type(obj)}")
        if hasattr(obj, 'n_features_in_'):
            print(f"Features in: {obj.n_features_in_}")
        if hasattr(obj, 'n_features_to_select_'):
            print(f"Features out: {obj.n_features_to_select_}")
        
        if name == "scaler":
            dummy = np.zeros((1, 71))
            out = obj.transform(dummy)
            print(f"Output shape: {out.shape}")
        elif name == "selector":
            dummy = np.zeros((1, 71))
            out = obj.transform(dummy)
            print(f"Output shape: {out.shape}")
        elif name == "model":
            # Test with 25 and 71
            for n in [25, 71]:
                try:
                    dummy = np.zeros((1, n))
                    obj.predict(dummy)
                    print(f"Predict success with {n} features")
                except Exception as e:
                    print(f"Predict failed with {n} features: {e}")
    except Exception as e:
        print(f"Error: {e}")

check_artifact("scaler", "model/voice_scaler.pkl")
check_artifact("selector", "model/voice_selector.pkl")
check_artifact("model", "model/voice_uci_model.pkl")
