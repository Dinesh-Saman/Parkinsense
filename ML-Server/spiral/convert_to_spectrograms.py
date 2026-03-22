# convert_to_spectrograms.py
# Converts .wav files from Voice_Dataset to Mel-spectrogram images for Deep Learning

import os
import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np
from pathlib import Path

# Paths
SOURCE_DIR = "Voice_Dataset"
TARGET_DIR = "wave"
HC_SOURCE = os.path.join(SOURCE_DIR, "HC_AH")
PD_SOURCE = os.path.join(SOURCE_DIR, "PD_AH")

# Target structure for train_voice_model.py
TRAIN_HEALTHY = os.path.join(TARGET_DIR, "training", "healthy")
TRAIN_PD      = os.path.join(TARGET_DIR, "training", "parkinson")
TEST_HEALTHY  = os.path.join(TARGET_DIR, "testing", "healthy")
TEST_PD       = os.path.join(TARGET_DIR, "testing", "parkinson")

for p in [TRAIN_HEALTHY, TRAIN_PD, TEST_HEALTHY, TEST_PD]:
    os.makedirs(p, exist_ok=True)

def create_spectrogram(audio_path, save_path):
    try:
        y, sr = librosa.load(audio_path, sr=22050)
        # 1.5 seconds slice to keep them consistent
        if len(y) > sr * 1.5:
            y = y[:int(sr * 1.5)]
        
        # Create Mel Spectrogram
        S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128, fmax=8000)
        S_dB = librosa.power_to_db(S, ref=np.max)
        
        # Plot and save as PNG without axes/whitespace
        plt.figure(figsize=(2.24, 2.24), dpi=100)
        librosa.display.specshow(S_dB, sr=sr, fmax=8000)
        plt.axis('off')
        plt.savefig(save_path, bbox_inches='tight', pad_inches=0, transparent=False)
        plt.close()
        return True
    except Exception as e:
        print(f"Error converting {audio_path}: {e}")
        return False

def process_all():
    print("🎨 Converting Voice Dataset to Mel-Spectrograms...")
    
    # Process HC
    hc_files = [f for f in os.listdir(HC_SOURCE) if f.endswith(".wav")]
    for i, f in enumerate(hc_files):
        src = os.path.join(HC_SOURCE, f)
        # Split train/test (80/20)
        target_folder = TRAIN_HEALTHY if i < len(hc_files) * 0.8 else TEST_HEALTHY
        dst = os.path.join(target_folder, f.replace(".wav", ".png"))
        create_spectrogram(src, dst)
        if (i+1) % 10 == 0: print(f"  Processed {i+1} HC files...")

    # Process PD
    pd_files = [f for f in os.listdir(PD_SOURCE) if f.endswith(".wav")]
    for i, f in enumerate(pd_files):
        src = os.path.join(PD_SOURCE, f)
        target_folder = TRAIN_PD if i < len(pd_files) * 0.8 else TEST_PD
        dst = os.path.join(target_folder, f.replace(".wav", ".png"))
        create_spectrogram(src, dst)
        if (i+1) % 10 == 0: print(f"  Processed {i+1} PD files...")

    print(f"✨ Conversion complete! Images saved in '{TARGET_DIR}' folder.")

if __name__ == "__main__":
    process_all()
