import os
from voice.voice_predict import predict_voice

def test():
    healthy_dir = "voice/Voice_Dataset/HC_AH"
    pd_dir = "voice/Voice_Dataset/PD_AH"
    
    # Test a healthy file
    hc_files = [f for f in os.listdir(healthy_dir) if f.endswith(".wav")]
    if hc_files:
        test_file = os.path.join(healthy_dir, hc_files[0])
        with open(test_file, 'rb') as f:
            hc_result = predict_voice(f.read())
        print(f"Testing Healthy File ({hc_files[0]}):")
        print(f"Prediction: {hc_result.get('prediction')}")
        print(f"Confidence: {hc_result.get('confidence')}%")
        print(f"Is Parkinson: {hc_result.get('hasParkinson')}")
        print("-" * 30)

    # Test a PD file
    pd_files = [f for f in os.listdir(pd_dir) if f.endswith(".wav")]
    if pd_files:
        test_file = os.path.join(pd_dir, pd_files[0])
        with open(test_file, 'rb') as f:
            pd_result = predict_voice(f.read())
        print(f"Testing Parkinson File ({pd_files[0]}):")
        print(f"Prediction: {pd_result.get('prediction')}")
        print(f"Confidence: {pd_result.get('confidence')}%")
        print(f"Is Parkinson: {pd_result.get('hasParkinson')}")
        print("-" * 30)

if __name__ == "__main__":
    test()
