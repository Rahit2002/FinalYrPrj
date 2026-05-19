import cv2
import numpy as np
import time
import json
from scipy.signal import butter, filtfilt, find_peaks

# =========================================================
# CONFIG — scan for this many seconds then output result
# =========================================================
SCAN_DURATION = 15
BUFFER_SIZE = 300

# =========================================================
# FILTER
# =========================================================
def bandpass_filter(signal, fs):
    low = 0.8 / (0.5 * fs)
    high = 3.0 / (0.5 * fs)
    b, a = butter(3, [low, high], btype='band')
    return filtfilt(b, a, signal)

# =========================================================
# BPM CALCULATION
# =========================================================
def calculate_bpm(signal, timestamps):
    if len(signal) < 100:
        return None, None, None
    duration = timestamps[-1] - timestamps[0]
    if duration <= 0:
        return None, None, None
    fs = len(signal) / duration
    try:
        sig = np.array(signal)
        sig = (sig - np.mean(sig)) / (np.std(sig) + 1e-8)
        filtered = bandpass_filter(sig, fs)
        peaks, _ = find_peaks(filtered, distance=fs / 2)
        bpm = int((len(peaks) / duration) * 60)
        return bpm, peaks, filtered
    except:
        return None, None, None

# =========================================================
# HRV
# =========================================================
def calculate_hrv(peaks, timestamps):
    if len(peaks) < 3:
        return 0
    beat_times = [timestamps[p] for p in peaks]
    intervals = np.diff(beat_times)
    if len(intervals) < 2:
        return 0
    return int(np.std(intervals) * 1000)

# =========================================================
# WELLNESS SCORE
# =========================================================
def compute_wellness(bpm, hrv, breathing_rate, signal_quality):
    score = 100
    if bpm > 100: score -= 20
    if bpm < 55:  score -= 15
    if hrv < 40:  score -= 25
    if breathing_rate > 22: score -= 15
    if signal_quality < 20: score -= 10
    return max(0, score)

# =========================================================
# MAIN — headless scan, exits after SCAN_DURATION seconds
# =========================================================
def run_scan():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print(json.dumps({"success": False, "error": "Camera not found"}))
        return

    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    cap.set(cv2.CAP_PROP_AUTO_EXPOSURE, 0.25)
    cap.set(cv2.CAP_PROP_EXPOSURE, 1)

    signal_buffer = []
    time_buffer = []
    last_bpm = None
    start = time.time()

    while time.time() - start < SCAN_DURATION:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(
            gray, scaleFactor=1.1, minNeighbors=5, minSize=(120, 120)
        )

        for (x, y, w, h) in faces:
            fx = x + int(w * 0.3)
            fy = y + int(h * 0.15)
            fw = int(w * 0.4)
            fh = int(h * 0.15)
            roi = frame[fy:fy+fh, fx:fx+fw]

            if roi.size > 0:
                signal_buffer.append(np.mean(roi[:, :, 1]))
                time_buffer.append(time.time())
                if len(signal_buffer) > BUFFER_SIZE:
                    signal_buffer.pop(0)
                    time_buffer.pop(0)
                bpm, _, _ = calculate_bpm(signal_buffer, time_buffer)
                if bpm and 40 < bpm < 180:
                    last_bpm = bpm
            break

        cv2.waitKey(1)

    cap.release()
    cv2.destroyAllWindows()

    if last_bpm is None:
        print(json.dumps({
            "success": False,
            "error": "Could not detect pulse. Ensure face is well lit and visible to camera."
        }))
        return

    # Re-run calculations on full buffer for final values
    bpm, peaks, filtered = calculate_bpm(signal_buffer, time_buffer)
    if not bpm or not (40 < bpm < 180):
        bpm = last_bpm
        peaks = []
        filtered = None

    hrv = calculate_hrv(peaks, time_buffer) if peaks is not None and len(peaks) > 2 else 0

    # Breathing rate estimation
    breathing_rate = 0
    if filtered is not None and len(filtered) > 20:
        breath_sig = np.convolve(filtered, np.ones(15)/15, mode='same')
        breath_peaks, _ = find_peaks(breath_sig, distance=20)
        duration = time_buffer[-1] - time_buffer[0]
        if duration > 0:
            breathing_rate = int((len(breath_peaks) / duration) * 60)

    # Signal quality
    signal_quality = min(100, int(np.var(signal_buffer) * 40)) if signal_buffer else 0

    # Stress
    if bpm > 95 or hrv < 40:
        stress_level = "HIGH"
    elif bpm > 80 or hrv < 60:
        stress_level = "MEDIUM"
    else:
        stress_level = "LOW"

    # Fatigue
    fatigue_status = "TIRED" if bpm < 55 else "ACTIVE"

    # Estimated BP
    est_sys = int(110 + (bpm - 60) * 0.5)
    est_dia = int(70 + (bpm - 60) * 0.3)

    # Wellness
    wellness_score = compute_wellness(bpm, hrv, breathing_rate, signal_quality)

    # BPM status
    if 60 <= bpm <= 100:
        bpm_status = "Normal"
    elif bpm < 60:
        bpm_status = "Low (Bradycardia)"
    else:
        bpm_status = "High (Tachycardia)"

    # Health status
    if wellness_score >= 80:
        health_status = "Good"
    elif wellness_score >= 60:
        health_status = "Fair"
    else:
        health_status = "Poor — consult a doctor"

    # result = {
    #     "success": True,
    #     "heartbeat_bpm": bpm,
    #     "bpm_status": bpm_status,
    #     "health_score": wellness_score,
    #     "health_status": health_status,
    #     "hrv_ms": hrv,
    #     "stress_level": stress_level,
    #     "fatigue_status": fatigue_status,
    #     "breathing_rate": breathing_rate,
    #     "signal_quality": signal_quality,
    #     "estimated_bp": f"{est_sys}/{est_dia}",
    #     "message": f"Heart rate {bpm} BPM ({bpm_status}). Wellness score: {wellness_score}/100. Stress: {stress_level}."
    # }

    result = {
    "success": True,
    "heartbeat_bpm": bpm,
    "bpm_status": bpm_status,
    "health_score": wellness_score,
    "health_status": health_status,
    "hrv_ms": hrv,
    "estimated_bp": f"{est_sys}/{est_dia}",
    "stress_level": stress_level,
    "breathing_rate": breathing_rate,
    "fatigue_status": fatigue_status,
    "signal_quality": signal_quality
}

# print(json.dumps(result))
    print(json.dumps(result))

if __name__ == "__main__":
    run_scan()
