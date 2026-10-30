"""Synthesizes the original background score: piano arpeggios, string pad, bass and a soft heartbeat drum."""
import sys
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, fftconvolve, sosfilt

SR = 44100
BPM = 70
BEAT = 60 / BPM
BAR = 4 * BEAT
LENGTH = float(sys.argv[2]) if len(sys.argv) > 2 else 74.0
rng = np.random.default_rng(7)

def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)

# Chord tones as MIDI notes (root position, around middle C).
CHORDS = {
    'Am': [57, 60, 64], 'F': [53, 57, 60], 'C': [48, 52, 55], 'G': [55, 59, 62],
}
# Intro and build, then an eight-bar lift, then two bars resolving on C, fitted to LENGTH.
TOTAL_BARS = int(np.ceil(LENGTH / BAR))
LIFT_START = TOTAL_BARS - 10
PROGRESSION = (
    (['Am', 'F', 'C', 'G'] * 4)[:LIFT_START]
    + ['F', 'G', 'Am', 'C', 'F', 'G', 'C', 'C']
    + ['C', 'C']
)

n = int(LENGTH * SR)
left = np.zeros(n)
right = np.zeros(n)

def add(sig, start, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= n:
        return
    sig = sig[: n - i]
    left[i : i + len(sig)] += sig * gain * (1 - pan) / 2 ** 0.5
    right[i : i + len(sig)] += sig * gain * (1 + pan) / 2 ** 0.5

def piano(midi, dur=2.5):
    t = np.arange(int(dur * SR)) / SR
    f = hz(midi)
    tone = sum(np.sin(2 * np.pi * f * k * t * (1 + 0.0004 * k)) * (0.6 ** (k - 1)) for k in range(1, 6))
    env = np.minimum(t / 0.006, 1) * np.exp(-t * (2.2 + midi / 60))
    return tone * env

def pad(midis, dur):
    t = np.arange(int(dur * SR)) / SR
    sig = np.zeros_like(t)
    for m in midis:
        for detune in (-0.12, 0.0, 0.12):
            f = hz(m) * 2 ** (detune / 12)
            phase = rng.uniform(0, 2 * np.pi)
            sig += sum(np.sin(2 * np.pi * f * k * t + phase) / k for k in range(1, 9))
    sig = sosfilt(butter(2, 1400, fs=SR, output='sos'), sig)
    attack, release = 1.2, 1.4
    env = np.minimum(t / attack, 1) * np.minimum((dur - t) / release, 1).clip(0)
    return sig * env

def bass(midi, dur):
    t = np.arange(int(dur * SR)) / SR
    f = hz(midi)
    sig = np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)
    env = np.minimum(t / 0.08, 1) * np.minimum((dur - t) / 0.6, 1).clip(0)
    return sig * env

def heartbeat():
    t = np.arange(int(0.6 * SR)) / SR
    freq = 45 + 75 * np.exp(-t * 25)
    return np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t * 7)

ARP = [0, 1, 2, 1, 0 + 12, 2, 1, 2]  # indexes into chord tones (+12 = octave up)

for bar, name in enumerate(PROGRESSION):
    start = bar * BAR
    if start >= LENGTH:
        break
    notes = CHORDS[name]
    build = min(bar / LIFT_START, 1.0)
    lift = 1.0 if LIFT_START <= bar < LIFT_START + 8 else 0.0
    final = bar >= LIFT_START + 8

    # Piano arpeggio in eighth notes, one octave up.
    if not final:
        for step, idx in enumerate(ARP):
            midi = notes[idx % 3] + 12 + (12 if idx >= 12 else 0)
            add(piano(midi), start + step * BEAT / 2, gain=0.16, pan=0.25 if step % 2 else -0.25)
    else:
        if bar == LIFT_START + 8:
            for i, m in enumerate(notes + [notes[0] + 12, notes[1] + 12]):
                add(piano(m + 12, dur=6), start + i * 0.09, gain=0.2)

    # Melody line on the lift.
    if lift:
        for beat_i, idx in enumerate([2, 1, 0, 1]):
            add(piano(notes[idx] + 24, dur=3), start + beat_i * BEAT, gain=0.11, pan=0.1)

    # String pad, swelling in over the first bars.
    pad_gain = 0.010 + 0.016 * build + 0.010 * lift
    add(pad([m + 12 for m in notes], BAR + 1.4), start, gain=pad_gain)

    # Bass and heartbeat from bar 4.
    if bar >= 4:
        add(bass(notes[0] - 12, BAR + 0.4), start, gain=0.22 + 0.06 * lift)
    if LIFT_START - 4 <= bar < LIFT_START + 8:
        for b in (0, 2):
            add(heartbeat(), start + b * BEAT, gain=0.32 + 0.12 * lift)
            add(heartbeat() * 0.6, start + b * BEAT + 0.28, gain=0.32 + 0.12 * lift)

# Hall reverb from decaying noise, separate per channel for width.
ir_t = np.arange(int(2.8 * SR)) / SR
def ir():
    r = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 2.3)
    return sosfilt(butter(1, 5000, fs=SR, output='sos'), r) / 40
wet_l = fftconvolve(left, ir())[:n]
wet_r = fftconvolve(right, ir())[:n]
out_l = left * 0.75 + wet_l * 0.45
out_r = right * 0.75 + wet_r * 0.45

# Fade in/out and normalize to -1 dBFS.
t = np.arange(n) / SR
fade = np.minimum(t / 1.0, 1) * np.minimum((LENGTH - t) / 4.0, 1).clip(0)
stereo = np.stack([out_l * fade, out_r * fade], axis=1)
stereo = stereo / np.abs(stereo).max() * 10 ** (-1 / 20)
wavfile.write(sys.argv[1], SR, (stereo * 32767).astype(np.int16))
