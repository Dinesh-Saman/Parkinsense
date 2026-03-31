import os
from voice.voice_predict import predict_voice

def test_all():
    healthy_dir = "voice/Voice_Dataset/HC_AH"
    pd_dir = "voice/Voice_Dataset/PD_AH"
    
    hc_files = [f for f in os.listdir(healthy_dir) if f.endswith(".wav")]
    pd_files = [f for f in os.listdir(pd_dir) if f.endswith(".wav")]
    
    hc_wrong = 0
    hc_total = len(hc_files)
    
    print("Testing Healthy (HC_AH)...")
    for idx, f in enumerate(hc_files):
        path = os.path.join(healthy_dir, f)
        with open(path, 'rb') as file:
            res = predict_voice(file.read())
            if res.get('prediction') != 'Healthy':
                hc_wrong += 1
                print(f"  [WRONG] {f} -> {res.get('prediction')} ({res.get('confidence')}%)")
                
    print(f"HC_AH Accuracy: {hc_total - hc_wrong} out of {hc_total} correct ({(hc_total - hc_wrong)/hc_total * 100:.2f}%)\n")

    pd_wrong = 0
    pd_total = len(pd_files)
    
    print("Testing Parkinson (PD_AH)...")
    for idx, f in enumerate(pd_files):
        path = os.path.join(pd_dir, f)
        with open(path, 'rb') as file:
            res = predict_voice(file.read())
            if res.get('prediction') != 'Parkinson':
                pd_wrong += 1
                print(f"  [WRONG] {f} -> {res.get('prediction')} ({res.get('confidence')}%)")
                
    print(f"PD_AH Accuracy: {pd_total - pd_wrong} out of {pd_total} correct ({(pd_total - pd_wrong)/pd_total * 100:.2f}%)\n")
    
    total = hc_total + pd_total
    total_wrong = hc_wrong + pd_wrong
    print(f"Overall Dataset Memory Accuracy: {(total - total_wrong)/total * 100:.2f}%")

if __name__ == "__main__":
    test_all()
