"""Synthesizes the evacuation film's alerts: PA attention chime, fire-alarm horn, ambulance siren."""
import sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 44100
out = sys.argv[1]

def save(name, x):
    x = x / (np.abs(x).max() + 1e-9) * 0.9
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    wavfile.write(f'{out}/{name}.wav', SR, (x * 32767).astype(np.int16))

def bell(f, dur):
    t = np.arange(int(dur * SR)) / SR
    return sum(np.sin(2 * np.pi * f * k * t) * a * np.exp(-t * d) for k, a, d in ((1, 1, 1.6), (2.01, 0.35, 3), (3.0, 0.15, 5))) * np.minimum(t / 0.005, 1)

# Two-tone "ding-dong" before the announcement.
t = np.arange(int(2.6 * SR)) / SR
chime = np.zeros_like(t)
for f, at in ((784, 0.0), (622, 0.55)):
    b = bell(f, 2.0)
    i = int(at * SR)
    chime[i:i + len(b)] += b[: len(chime) - i]
save('chime', chime)

# Fire-alarm horn: temporal-3 pattern of a harsh square tone.
t = np.arange(int(3.6 * SR)) / SR
horn = np.sign(np.sin(2 * np.pi * 520 * t)) * 0.5 + np.sign(np.sin(2 * np.pi * 780 * t)) * 0.3
gate = np.zeros_like(t)
for s in (0.0, 1.0, 2.0):
    gate[(t >= s) & (t < s + 0.5)] = 1
horn = sosfilt(butter(2, [400, 3500], btype='band', fs=SR, output='sos'), horn * gate)
save('alarm', horn)

# Ambulance wail, sweeping 650-1350 Hz, slight doppler pan.
t = np.arange(int(4.0 * SR)) / SR
f = 1000 + 350 * np.sin(2 * np.pi * 0.55 * t)
wail = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * np.sin(4 * np.pi * np.cumsum(f) / SR)
env = np.minimum(t / 0.4, 1) * np.minimum((4.0 - t) / 0.8, 1).clip(0)
pan = np.linspace(-0.6, 0.6, len(t))
save('siren', np.stack([wail * env * (1 - pan) / 2, wail * env * (1 + pan) / 2], 1))
print('ok')
