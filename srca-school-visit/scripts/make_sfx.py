"""Synthesizes the Crash Course sound effects: whooshes, impact, riser, camera shutter, glitch."""
import sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 44100
rng = np.random.default_rng(42)
out = sys.argv[1]

def save(name, x):
    x = x / (np.abs(x).max() + 1e-9) * 0.9
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    wavfile.write(f'{out}/{name}.wav', SR, (x * 32767).astype(np.int16))

def t_(sec):
    return np.arange(int(sec * SR)) / SR

def sweep_noise(sec, f0, f1, q=2.0):
    """Noise through a band-pass whose centre glides from f0 to f1, in short blocks."""
    n = int(sec * SR)
    noise = rng.standard_normal(n)
    y = np.zeros(n)
    block = 512
    for i in range(0, n, block):
        p = i / n
        fc = f0 * (f1 / f0) ** p
        lo, hi = max(40, fc / q), min(SR / 2 - 100, fc * q)
        sos = butter(2, [lo, hi], btype='band', fs=SR, output='sos')
        seg = noise[max(0, i - 2048): i + block]
        y[i:i + block] = sosfilt(sos, seg)[-len(y[i:i + block]):]
    return y

# Whoosh: rising then falling noise with a swell envelope and stereo pan.
for idx, (sec, f0, f1) in enumerate([(0.55, 300, 4000), (0.45, 600, 6000), (0.7, 200, 2500)]):
    y = sweep_noise(sec, f0, f1)
    t = t_(sec)
    env = np.sin(np.pi * (t / sec) ** 0.6) ** 2
    y *= env
    pan = np.linspace(-0.8, 0.8, len(y))
    save(f'whoosh{idx + 1}', np.stack([y * (1 - pan) / 2, y * (1 + pan) / 2], 1))

# Impact: sub drop + noise crack + long tail.
t = t_(2.5)
sub = np.sin(2 * np.pi * np.cumsum(30 + 90 * np.exp(-t * 9)) / SR) * np.exp(-t * 2.2)
crack = sosfilt(butter(2, [800, 6000], btype='band', fs=SR, output='sos'), rng.standard_normal(len(t))) * np.exp(-t * 18)
tail = sosfilt(butter(2, 400, fs=SR, output='sos'), rng.standard_normal(len(t))) * np.exp(-t * 1.6) * 0.5
save('impact', np.tanh(1.6 * (sub * 1.0 + crack * 0.6 + tail)))

# Riser: noise sweep plus pitch-rising tone, ending sharply.
sec = 2.0
t = t_(sec)
noise = sweep_noise(sec, 200, 8000, q=1.6) * (t / sec) ** 2
tone = np.sin(2 * np.pi * np.cumsum(120 * 2 ** (3 * t / sec)) / SR) * (t / sec) ** 3 * 0.4
save('riser', noise + tone)

# Camera shutter: two mechanical clicks with a short whir between.
t = t_(0.32)
def click(at, bright):
    c = np.zeros(len(t))
    i = int(at * SR)
    k = rng.standard_normal(int(0.012 * SR)) * np.exp(-np.arange(int(0.012 * SR)) / (0.0025 * SR))
    c[i:i + len(k)] = k
    return sosfilt(butter(2, [bright, 9000], btype='band', fs=SR, output='sos'), c)
whir = sosfilt(butter(2, [2000, 5000], btype='band', fs=SR, output='sos'), rng.standard_normal(len(t)))
whir *= ((t > 0.02) & (t < 0.11)) * 0.12
save('shutter', click(0.0, 1500) + whir + click(0.12, 2500) * 0.8)

# Glitch: stuttered digital buzz.
t = t_(0.45)
buzz = np.sign(np.sin(2 * np.pi * 180 * t)) * 0.3 + rng.standard_normal(len(t)) * 0.4
gate = (np.floor(t * 40) % 3 != 0).astype(float) * (rng.random(int(len(t) / (SR / 40)) + 1)[np.floor(t * 40).astype(int)] > 0.3)
save('glitch', sosfilt(butter(2, [300, 7000], btype='band', fs=SR, output='sos'), buzz * gate) * np.exp(-t * 3))
print('ok')
