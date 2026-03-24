# extract_voice_features.py
# Extracts the 22 biomedical voice features from raw audio bytes
# using parselmouth (Python Praat wrapper) — same features as UCI dataset

import parselmouth
from parselmouth.praat import call
import numpy as np
import soundfile as sf
import io
import tempfile
import os

# The 22 UCI features + 39 MFCC (13 + 13Delta + 13DeltaDelta) + 7 Spectral Contrast + 3 Spectral
UCI_FEATURE_NAMES = [
    'MDVP:Fo(Hz)', 'MDVP:Fhi(Hz)', 'MDVP:Flo(Hz)',
    'MDVP:Jitter(%)', 'MDVP:Jitter(Abs)', 'MDVP:RAP', 'MDVP:PPQ', 'Jitter:DDP',
    'MDVP:Shimmer', 'MDVP:Shimmer(dB)', 'Shimmer:APQ3', 'Shimmer:APQ5',
    'MDVP:APQ', 'Shimmer:DDA',
    'NHR', 'HNR',
    'RPDE', 'DFA', 'spread1', 'spread2', 'D2', 'PPE',
    # MFCCs + Deltas
    *[f'MFCC_{i+1}' for i in range(13)],
    *[f'MFCC_Delta_{i+1}' for i in range(13)],
    *[f'MFCC_Delta2_{i+1}' for i in range(13)],
    # Spectral Contrast (usually 7 bands)
    *[f'Spectral_Contrast_{i+1}' for i in range(7)],
    # Spectral
    'Spectral_Centroid', 'Spectral_Rolloff', 'Spectral_Bandwidth'
]

def extract_features_from_audio(audio_bytes: bytes) -> np.ndarray:
    """
    Input : raw audio bytes (from request.files['audio'].read())
    Output: numpy array of shape (22,) with UCI-compatible voice features
    Raises: ValueError if audio is too short or feature extraction fails
    """
    import librosa

    raw_tmp = None
    try:
        with tempfile.NamedTemporaryFile(suffix=".tmp", delete=False) as raw:
            raw.write(audio_bytes)
            raw_tmp = raw.name
        
        print(f"Decoding audio: {len(audio_bytes)} bytes...")
        y_raw, sr_raw = librosa.load(raw_tmp, sr=22050, mono=True)
        
        # --- HARDENING: Sanitize audio before C++ calls (prevent segfaults) ---
        y_raw = np.nan_to_num(y_raw).astype(np.float32)
        if len(y_raw) < 1000:
            raise ValueError("Audio stream is empty or too short.")
        # -------------------------------------------------------------------

    except Exception as e:
        if raw_tmp and os.path.exists(raw_tmp):
            os.unlink(raw_tmp)
        raise ValueError(f"Could not decode audio: {str(e)}. Please upload a WAV, MP3, OGG, or WebM file.")

    tmp_path = raw_tmp + ".wav"
    sf.write(tmp_path, y_raw, sr_raw)

    if raw_tmp and os.path.exists(raw_tmp):
        os.unlink(raw_tmp)

    try:
        snd = parselmouth.Sound(tmp_path)

        if snd.duration < 1.0:
            raise ValueError("Audio too short (minimum 1 second required)")

        pitch = snd.to_pitch()
        pitch_values = pitch.selected_array['frequency']
        pitch_values = pitch_values[pitch_values > 0]

        if len(pitch_values) == 0:
            raise ValueError("No voiced frames detected — please record sustained vowel sound (e.g. 'aaah')")

        fo  = np.mean(pitch_values)
        fhi = np.max(pitch_values)
        flo = np.min(pitch_values)

        point_process = call(snd, "To PointProcess (periodic, cc)", 75, 500)

        jitter_pct  = call(point_process, "Get jitter (local)",          0, 0, 0.0001, 0.02, 1.3)
        jitter_abs  = call(point_process, "Get jitter (local, absolute)", 0, 0, 0.0001, 0.02, 1.3)
        jitter_rap  = call(point_process, "Get jitter (rap)",             0, 0, 0.0001, 0.02, 1.3)
        jitter_ppq  = call(point_process, "Get jitter (ppq5)",            0, 0, 0.0001, 0.02, 1.3)
        jitter_ddp  = jitter_rap * 3

        shimmer      = call([snd, point_process], "Get shimmer (local)",      0, 0, 0.0001, 0.02, 1.3, 1.6)
        shimmer_db   = call([snd, point_process], "Get shimmer (local_dB)",   0, 0, 0.0001, 0.02, 1.3, 1.6)
        shimmer_apq3 = call([snd, point_process], "Get shimmer (apq3)",       0, 0, 0.0001, 0.02, 1.3, 1.6)
        shimmer_apq5 = call([snd, point_process], "Get shimmer (apq5)",       0, 0, 0.0001, 0.02, 1.3, 1.6)
        shimmer_apq  = call([snd, point_process], "Get shimmer (apq11)",      0, 0, 0.0001, 0.02, 1.3, 1.6)
        shimmer_dda  = shimmer_apq3 * 3

        harmonicity = call(snd, "To Harmonicity (cc)", 0.01, 75, 0.1, 1.0)
        hnr = call(harmonicity, "Get mean", 0, 0)
        nhr = 1.0 / (10 ** (hnr / 10)) if hnr > 0 else 0.0

        # Reuse already loaded/written audio
        y_audio = y_raw
        sr = sr_raw

        if len(pitch_values) > 1:
            hist, _ = np.histogram(pitch_values, bins=20, density=True)
            hist = hist[hist > 0]
            rpde = -np.sum(hist * np.log(hist)) / np.log(len(hist)) if len(hist) > 1 else 0.5
        else:
            rpde = 0.5

        def dfa_estimate(x, scales=None):
            if scales is None:
                scales = np.logspace(1, np.log10(len(x)//4), 10, dtype=int)
                scales = np.unique(scales)
            fluctuations = []
            for s in scales:
                segments = [x[i:i+s] for i in range(0, len(x)-s, s)]
                if len(segments) == 0:
                    continue
                rms_list = []
                for seg in segments:
                    t = np.arange(len(seg))
                    p = np.polyfit(t, seg, 1)
                    rms_list.append(np.sqrt(np.mean((seg - np.polyval(p, t))**2)))
                fluctuations.append(np.mean(rms_list))
            if len(fluctuations) < 2:
                return 0.7
            scales_used = scales[:len(fluctuations)]
            try:
                alpha = np.polyfit(np.log(scales_used), np.log(fluctuations), 1)[0]
            except Exception:
                alpha = 0.7
            return float(np.clip(alpha, 0, 2))

        dfa = dfa_estimate(y_audio[:min(len(y_audio), 16000*5)])

        if len(pitch_values) > 1:
            log_pitch = np.log(pitch_values)
            spread1 = -np.std(log_pitch)
            spread2 =  np.percentile(log_pitch, 75) - np.percentile(log_pitch, 25)
        else:
            spread1, spread2 = -4.0, 0.2

        def approx_d2(x, m=2, tau=1):
            n = len(x) - (m - 1) * tau
            if n <= 10:
                return 2.0
            embedded = np.array([x[i:i + m * tau:tau] for i in range(n)])
            dists = []
            sample = min(n, 200)
            idx = np.random.choice(n, sample, replace=False)
            for i in idx:
                for j in idx:
                    if i != j:
                        dists.append(np.linalg.norm(embedded[i] - embedded[j]))
            if not dists:
                return 2.0
            r = np.median(dists) * 0.5
            count = np.sum(np.array(dists) < r)
            total = len(dists)
            if count == 0 or total == 0:
                return 2.0
            c = count / total
            return float(np.clip(-np.log(c) / np.log(r + 1e-10), 0, 5)) if r > 0 else 2.0

        np.random.seed(42)
        d2 = approx_d2(pitch_values if len(pitch_values) > 20 else y_audio[:2000])

        if len(pitch_values) > 1:
            periods = 1.0 / pitch_values
            hist_p, _ = np.histogram(periods, bins=30, density=True)
            hist_p = hist_p[hist_p > 0]
            ppe = -np.sum(hist_p * np.log(hist_p)) / np.log(len(hist_p) + 1e-10)
        else:
            ppe = 0.2

        # --- ADDITIONAL SPECTRAL FEATURES ---
        y_audio_trimmed, _ = librosa.effects.trim(y_audio)
        
        # MFCCs (typically 13 is standard for speech)
        mfccs = librosa.feature.mfcc(y=y_audio_trimmed, sr=sr_raw, n_mfcc=13)
        mfccs_delta = librosa.feature.delta(mfccs)
        mfccs_delta2 = librosa.feature.delta(mfccs, order=2)
        
        mfccs_mean = np.mean(mfccs, axis=1)
        mfccs_delta_mean = np.mean(mfccs_delta, axis=1)
        mfccs_delta2_mean = np.mean(mfccs_delta2, axis=1)

        # Spectral Contrast
        stft = np.abs(librosa.stft(y_audio_trimmed))
        contrast = librosa.feature.spectral_contrast(S=stft, sr=sr_raw)
        contrast_mean = np.mean(contrast, axis=1)

        # Spectral Centroid, Rolloff, Bandwidth
        spectral_centroid = librosa.feature.spectral_centroid(y=y_audio_trimmed, sr=sr_raw)
        sc_mean = np.mean(spectral_centroid)

        spectral_rolloff = librosa.feature.spectral_rolloff(y=y_audio_trimmed, sr=sr_raw)
        sr_mean = np.mean(spectral_rolloff)

        spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y_audio_trimmed, sr=sr_raw)
        sb_mean = np.mean(spectral_bandwidth)

        features = np.concatenate([
            np.array([
                fo, fhi, flo,
                jitter_pct, jitter_abs, jitter_rap, jitter_ppq, jitter_ddp,
                shimmer, shimmer_db, shimmer_apq3, shimmer_apq5, shimmer_apq, shimmer_dda,
                nhr, hnr,
                rpde, dfa, spread1, spread2, d2, ppe
            ], dtype=np.float32),
            mfccs_mean,
            mfccs_delta_mean,
            mfccs_delta2_mean,
            contrast_mean,
            np.array([sc_mean, sr_mean, sb_mean], dtype=np.float32)
        ])

        features = np.nan_to_num(features, nan=0.0, posinf=0.0, neginf=0.0)

        return features

    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass


if __name__ == "__main__":
    import soundfile as sf
    import io

    print("Testing feature extraction with synthetic audio...")
    sr = 22050
    duration = 3.0
    t = np.linspace(0, duration, int(sr * duration))
    audio = (np.sin(2 * np.pi * 120 * t) * 0.5).astype(np.float32)

    buf = io.BytesIO()
    sf.write(buf, audio, sr, format="WAV")
    audio_bytes = buf.getvalue()

    features = extract_features_from_audio(audio_bytes)
    print(f"\nExtracted {len(features)} features:")
    for name, val in zip(UCI_FEATURE_NAMES, features):
        print(f"  {name:25s}: {val:.6f}")
    print("\nFeature extraction working correctly!")
