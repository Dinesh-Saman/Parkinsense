import joblib
import os

try:
    model = joblib.load('model/voice_uci_model.pkl')
    scaler = joblib.load('model/voice_scaler.pkl')
    selector = joblib.load('model/voice_selector.pkl')

    print(f"Model type: {type(model)}")
    if hasattr(model, 'n_features_in_'):
        print(f"Model expected features: {model.n_features_in_}")
    
    print(f"Scaler expected features: {scaler.n_features_in_}")
    
    print(f"Selector features in: {selector.n_features_in_}")
    print(f"Selector features out: {selector.n_features_to_select_}")

    # Check if we can transform a dummy input
    import numpy as np
    dummy_71 = np.zeros((1, 71))
    scaled = scaler.transform(dummy_71)
    print(f"Scaled shape: {scaled.shape}")
    selected = selector.transform(scaled)
    print(f"Selected shape: {selected.shape}")
    
    try:
        pred = model.predict(selected)
        print(f"Predict success: {pred}")
    except Exception as e:
        print(f"Predict error: {e}")

except Exception as e:
    print(f"Error loading/testing artifacts: {e}")
