"""Composes the emotional score for the rescue film: soft piano, strings and a low drone, shaped to its sections.

Run: python3 scripts/compose_pulse.py <out.wav> <length-seconds>
Sections (seconds): hook 0-13.4, title 13.4-21, story 21-51, swell 51-66, warmth 66-78, resolve 78-end.
"""
import sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, sosfilt

SR = 44100
LENGTH = float(sys.argv[2])
BPM = 66
BEAT = 60 / BPM
BAR = 4 * BEAT
T0 = 13.4            # piano enters with the title
rng = np.random.default_rng(11)
n = int(LENGTH * SR)
L = np.zeros(n)
R = np.zeros(n)

def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)

def add(sig, t, gain, pan=0.0):
    i = int(t * SR)
    if i >= n or i < 0:
        return
    sig = sig[: n - i]
    L[i:i + len(sig)] += sig * gain * np.sqrt((1 - pan) / 2)
    R[i:i + len(sig)] += sig * gain * np.sqrt((1 + pan) / 2)

def piano(m, dur=4.0, vel=1.0):
    t = np.arange(int(dur * SR)) / SR
    f = hz(m)
    sig = np.zeros_like(t)
    for k in range(1, 9):
        fk = f * k * np.sqrt(1 + 0.0004 * k * k)          # string inharmonicity
        for det in (-0.6, 0.6):                          # two strings per note, slightly apart
            sig += np.sin(2 * np.pi * (fk + det) * t) * (0.55 ** (k - 1)) * np.exp(-t * (0.9 + 0.55 * k + m / 90))
    hammer = sosfilt(butter(2, [1500, 6000], btype='band', fs=SR, output='sos'), rng.standard_normal(len(t))) * np.exp(-t * 90) * 0.15
    env = np.minimum(t / 0.004, 1) * np.minimum((dur - t) / 0.3, 1).clip(0)
    return (sig * 0.25 + hammer) * env * vel

def strings(ms, dur, attack=1.6):
    t = np.arange(int(dur * SR)) / SR
    sig = np.zeros_like(t)
    vib = 1 + 0.003 * np.sin(2 * np.pi * 5.2 * t)
    for m in ms:
        for det in (-0.08, 0.0, 0.08):
            f = hz(m) * 2 ** (det / 12)
            ph = rng.uniform(0, 2 * np.pi)
            sig += sum(np.sin(2 * np.pi * f * k * np.cumsum(vib) / SR + ph * k) / k ** 1.3 for k in range(1, 10))
    sig = sosfilt(butter(2, 2400, fs=SR, output='sos'), sig)
    env = np.minimum(t / attack, 1) * np.minimum((dur - t) / 1.8, 1).clip(0)
    return sig * env / len(ms)

def drone(m, dur):
    t = np.arange(int(dur * SR)) / SR
    sig = np.sin(2 * np.pi * hz(m) * t) + 0.4 * np.sin(2 * np.pi * hz(m + 12) * t + 1.0) + 0.15 * np.sin(2 * np.pi * hz(m + 19) * t)
    sig *= 1 + 0.25 * np.sin(2 * np.pi * 0.11 * t)
    env = np.minimum(t / 3.0, 1) * np.minimum((dur - t) / 2.0, 1).clip(0)
    return sig * env

CH = {
    'Dm': [50, 53, 57], 'Bb': [46, 50, 53], 'F': [53, 57, 60], 'C': [48, 52, 55],
    'Gm': [55, 58, 62], 'A': [45, 49, 52],
}

# Hook: low D drone with a faint high shimmer, leaving room for the heartbeat effects.
add(drone(38, T0 + 2), 0.0, 0.10)
add(strings([74, 81], T0 + 1.5, attack=4.0), 0.0, 0.025, pan=0.3)

# Bars after the title.
prog = []
t = T0
while t < LENGTH - 2:
    prog.append(t)
    t += BAR
SEQ = ['Dm', 'Bb', 'F', 'C'] * 3 + ['Bb', 'F', 'C', 'Dm', 'Bb', 'C', 'F', 'F'] + ['F'] * 4

def section(t):
    if t < 21:
        return 'title'
    if t < 51:
        return 'story'
    if t < 66:
        return 'swell'
    if t < 78:
        return 'warm'
    return 'resolve'

for i, start in enumerate(prog):
    name = SEQ[min(i, len(SEQ) - 1)]
    notes = CH[name]
    sec = section(start)
    root = notes[0] - 12
    # piano: quarter-note arpeggio in the title, eighths afterwards; sparse long chord at the very end
    if sec == 'title':
        for b, idx in enumerate([0, 1, 2, 1]):
            add(piano(notes[idx] + 12, 4.5, 0.8), start + b * BEAT, 0.20, pan=-0.2 + 0.13 * b)
    elif sec in ('story', 'swell', 'warm'):
        pat = [0, 1, 2, 3, 2, 1, 2, 1]
        for s, idx in enumerate(pat):
            m = notes[idx % 3] + 12 + (12 if idx == 3 else 0)
            add(piano(m, 3.5, 0.75 if s % 2 else 0.9), start + s * BEAT / 2, 0.17, pan=0.25 if s % 2 else -0.25)
    elif start < LENGTH - 6:
        for j, m in enumerate(notes + [notes[0] + 12]):
            add(piano(m + 12, 7.0, 0.9), start + j * 0.11, 0.2)
    # melody in the swell and the warm section
    if sec in ('swell', 'warm'):
        line = [2, 1, 0, 1] if sec == 'swell' else [0, 2, 1, 2]
        for b, idx in enumerate(line):
            add(piano(notes[idx] + 24, 4.0, 0.7), start + b * BEAT, 0.10, pan=0.1)
    # low piano root on the downbeat
    add(piano(root, 5.0, 0.8), start, 0.16)
    # strings grow through the film and bloom in the swell
    sgain = {'title': 0.03, 'story': 0.045, 'swell': 0.09, 'warm': 0.075, 'resolve': 0.065}[sec]
    voices = [m + 12 for m in notes] + ([notes[0] + 24] if sec in ('swell', 'warm') else [])
    add(strings(voices, BAR + 1.8), start, sgain)
    add(strings([root], BAR + 1.8, attack=1.0), start, sgain * 0.9)

# Hall reverb.
ir_t = np.arange(int(3.2 * SR)) / SR
def ir():
    return sosfilt(butter(1, 4500, fs=SR, output='sos'), rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 1.9)) / 45
oL = L * 0.7 + fftconvolve(L, ir())[:n] * 0.55
oR = R * 0.7 + fftconvolve(R, ir())[:n] * 0.55
t = np.arange(n) / SR
fade = np.minimum(t / 1.5, 1) * np.minimum((LENGTH - t) / 3.5, 1).clip(0)
st = np.stack([oL * fade, oR * fade], 1)
st = st / np.abs(st).max() * 10 ** (-1 / 20)
wavfile.write(sys.argv[1], SR, (st * 32767).astype(np.int16))
print('ok', len(prog), 'bars')
