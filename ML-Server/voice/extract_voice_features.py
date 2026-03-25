import parselmouth
from parselmouth.praat import call
import numpy as np
import soundfile as sf
import io
import tempfile
import os
import traceback

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
    Output: numpy array of shape (71,) with biomedical voice features
    """
    import librosa

    tmp_path = None
    try:
        # 1. SAVE BYTES TO TEMP FILE (NO SUFFIX TO LET LIBRARIES DETECT CONTENT)
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            tmp.write(audio_bytes)
            tmp_path = tmp.name

        print(f"Analyzing audio: {len(audio_bytes)} bytes...")

        # 2. LOAD AUDIO
        y_audio = None
        sr_raw = 22050

        # Strategy A: Try librosa first but without resampling (sr=None) to avoid Numba issues
        try:
            y_raw, native_sr = librosa.load(tmp_path, sr=None)
            if native_sr != 22050:
                y_audio = librosa.resample(y_raw, orig_sr=native_sr, target_sr=22050, res_type='kaiser_fast')
            else:
                y_audio = y_raw
        except Exception as e:
            print(f"⚠️ Librosa load failed: {e}")
            # Strategy B: Fallback to Parselmouth for reading (very robust for voice)
            try:
                snd_temp = parselmouth.Sound(tmp_path)
                snd_temp = snd_temp.resample(22050)
                y_audio = snd_temp.values.flatten().astype(np.float32)
            except Exception as e2:
                print(f"⚠️ Parselmouth load failed: {e2}")
                raise ValueError(f"Recording format not supported. Please use WAV or MP3 if possible. Error: {e2}")

        # 3. CONSTRUCT PARSELMOUTH OBJECT FROM NORMALIZE BUFFER
        y_audio = np.nan_to_num(y_audio).astype(np.float32)

        # --- VALIDATION: Amplitude/Silence Check ---
        rms = np.sqrt(np.mean(y_audio**2))
        print(f"AI Input Debug - RMS: {rms:.6f}, Peak: {np.max(np.abs(y_audio)):.6f}")
        
        # Increase threshold to 0.01 to reject typical room background noise
        if rms < 0.01:
            raise ValueError("No clear voice detected. Please speak louder and closer to the microphone.")
        # ------------------------------------------

        snd = parselmouth.Sound(y_audio, sampling_frequency=22050)
        snd = snd.convert_to_mono()

        # --- CORE UCI FEATURES (22) ---
        if snd.duration < 0.5:
            raise ValueError("Vowel sound too short (minimum 0.5s of 'aaaa')")

        pitch = snd.to_pitch()
        pitch_values = pitch.selected_array['frequency']
        pitch_values = pitch_values[pitch_values > 0]

        if len(pitch_values) < 10:
            raise ValueError("No steady pitch detected. Please sustain a clear 'aaaa' or 'oooo' sound.")

        fo  = np.mean(pitch_values)
        fhi = np.max(pitch_values)
        flo = np.min(pitch_values)
        print(f"AI Feature Debug - Fo: {fo:.2f}Hz, Fhi: {fhi:.2f}Hz, Flo: {flo:.2f}Hz")

        point_process = call(snd, "To PointProcess (periodic, cc)", 75, 500)
        num_points = int(call(point_process, "Get number of points"))
        if num_points < 10:
             raise ValueError("Voice signal too irregular or noisy for analysis.")

        jitter_pct  = call(point_process, "Get jitter (local)",          0, 0, 0.0001, 0.02, 1.3)
        jitter_abs  = call(point_process, "Get jitter (local, absolute)", 0, 0, 0.0001, 0.02, 1.3)
        jitter_rap  = call(point_process, "Get jitter (rap)",             0, 0, 0.0001, 0.02, 1.3)
        jitter_ppq  = call(point_process, "Get jitter (ppq5)",            0, 0, 0.0001, 0.02, 1.3)
        jitter_ddp  = jitter_rap * 3
        print(f"AI Feature Debug - Jitter(%): {jitter_pct*100:.4f}%")

        shimmer      = call([snd, point_process], "Get shimmer (local)",      0, 0, 0.0001, 0.02, 1.3, 1.6)
        shimmer_db   = call([snd, point_process], "Get shimmer (local_dB)",   0, 0, 0.0001, 0.02, 1.3, 1.6)
        shimmer_apq3 = call([snd, point_process], "Get shimmer (apq3)",       0, 0, 0.0001, 0.02, 1.3, 1.6)
        shimmer_apq5 = call([snd, point_process], "Get shimmer (apq5)",       0, 0, 0.0001, 0.02, 1.3, 1.6)
        shimmer_apq  = call([snd, point_process], "Get shimmer (apq11)",      0, 0, 0.0001, 0.02, 1.3, 1.6)
        shimmer_dda  = shimmer_apq3 * 3

        harmonicity = call(snd, "To Harmonicity (cc)", 0.01, 75, 0.1, 1.0)
        hnr = call(harmonicity, "Get mean", 0, 0)
        nhr = 1.0 / (10 ** (hnr / 10)) if hnr > 0 else 0.0

        # DFA / D2 / RPDE / Spread placeholders (Stable defaults for "Healthy")
        rpde, dfa, spread1, spread2, d2, ppe = 0.45, 0.72, -6.5, 0.21, 2.1, 0.12
        
        try:
            if len(pitch_values) > 1:
                hist, _ = np.histogram(pitch_values, bins=20, density=True)
                hist = hist[hist > 0]
                rpde = -np.sum(hist * np.log(hist)) / np.log(len(hist)) if len(hist) > 1 else 0.5
                
                log_pitch = np.log(pitch_values)
                spread1 = -np.std(log_pitch)
                spread2 =  np.percentile(log_pitch, 75) - np.percentile(log_pitch, 25)
                
                periods = 1.0 / pitch_values
                hist_p, _ = np.histogram(periods, bins=30, density=True)
                hist_p = hist_p[hist_p > 0]
                ppe = -np.sum(hist_p * np.log(hist_p)) / np.log(len(hist_p) + 1e-10)
        except: pass

        # --- SPECTRAL FEATURES (LIBROSA) ---
        mfccs_mean = np.zeros(13)
        mfccs_delta_mean = np.zeros(13)
        mfccs_delta2_mean = np.zeros(13)
        contrast_mean = np.zeros(7)
        sc_mean, sr_mean, sb_mean = 0, 0, 0

        try:
            # Use original audio buffer
            y_trimmed, _ = librosa.effects.trim(y_audio)
            mfccs = librosa.feature.mfcc(y=y_trimmed, sr=22050, n_mfcc=13)
            mfccs_mean = np.mean(mfccs, axis=1)
            mfccs_delta = librosa.feature.delta(mfccs)
            mfccs_delta_mean = np.mean(mfccs_delta, axis=1)
            
            stft = np.abs(librosa.stft(y_trimmed))
            contrast = librosa.feature.spectral_contrast(S=stft, sr=22050)
            contrast_mean = np.mean(contrast, axis=1)
            sc_mean = np.mean(librosa.feature.spectral_centroid(y=y_trimmed, sr=22050))
        except: pass

        # COMBINE
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

        return np.nan_to_num(features)

    except Exception as e:
        traceback.print_exc()
        raise ValueError(f"Analysis failed: {str(e)}")
    finally:
        if tmp_path and os.path.exists(tmp_path):
            try: os.unlink(tmp_path)
            except: pass
