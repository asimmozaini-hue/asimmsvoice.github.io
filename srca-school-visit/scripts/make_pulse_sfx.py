"""Synthesizes the rescue film's effects: heartbeat, monitor beep, flatline tone, soft sub hit."""
import sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt

SR = 44100
out = sys.argv[1]
rng = np.random.default_rng(3)

def save(name, x):
    x = x / (np.abs(x).max() + 1e-9) * 0.9
    wavfile.write(f'{out}/{name}.wav', SR, (np.stack([x, x], 1) * 32767).astype(np.int16))

def thump(t, f0, f1, decay):
    return np.sin(2 * np.pi * np.cumsum(f1 + (f0 - f1) * np.exp(-t * 30)) / SR) * np.exp(-t * decay)

t = np.arange(int(0.9 * SR)) / SR
lub = thump(t, 90, 42, 11)
dub = np.zeros_like(t)
i = int(0.28 * SR)
dub[i:] = thump(t[: len(t) - i], 110, 50, 14) * 0.75
save('heartbeat', np.tanh(1.4 * (lub + dub)))

t = np.arange(int(0.22 * SR)) / SR
save('beep', np.sin(2 * np.pi * 1000 * t) * np.minimum(t / 0.004, 1) * np.minimum((0.22 - t) / 0.03, 1).clip(0))

t = np.arange(int(2.2 * SR)) / SR
save('flatline', np.sin(2 * np.pi * 1000 * t) * np.minimum(t / 0.01, 1) * np.minimum((2.2 - t) / 0.4, 1).clip(0))

t = np.arange(int(2.0 * SR)) / SR
sub = thump(t, 70, 32, 2.6)
air = sosfilt(butter(2, 300, fs=SR, output='sos'), rng.standard_normal(len(t))) * np.exp(-t * 3) * 0.3
save('subhit', np.tanh(1.5 * (sub + air)))
print('ok')
