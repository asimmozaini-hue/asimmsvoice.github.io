"""Writes src/cc2/CrashCourse2.tsx: the Crash Course 2 edit, cut on the score's 1.38s hit grid.

Run: python3 scripts/build_cc2_timeline.py <durations.txt>   (lines: "<clip> <seconds>")
Every clip is used once. Story: welcome -> briefing -> stations -> exams -> competition -> both
certificate ceremonies (one snap per participant, on the beat) -> mosaic of every certificate.
"""
import sys

FPS = 30
A = 8.065            # first strong hit
H = 1.3795 / 2       # half hit period
END = 114.0

def k(n):
    return A + n * H

def fr(t):
    return round(t * FPS)

dur = {l.split()[0]: float(l.split()[1]) for l in open(sys.argv[1])}

INTRO = [('0942', 0.0, 2.6, 0.5, 'push'), ('0943', 2.6, 4.6, 0.5, 'drift'), ('0949', 4.6, 6.6, 0.5, 'push'), ('0946', 6.6, A, 0.6, 'pull')]
# (clip, half-hits, rate, move); ('TRI', half-hits, (a, b, c)) is a three-panel split.
WELCOME = [
    ('0931', 2, 0.6, 'punch'), ('0933', 2, 0.5, 'push'), ('0937', 2, 0.6, 'whip-left'), ('0938', 2, 0.6, 'push'),
    ('0941', 2, 0.6, 'whip-right'), ('0967', 2, 0.6, 'push'), ('0086', 2, 0.6, 'drift'), ('0970', 2, 0.6, 'punch'),
    ('0939', 2, 0.6, 'push'), ('0963', 2, 0.6, 'drift'), ('0089', 2, 0.6, 'push'), ('0976', 2, 0.6, 'pull'), ('0971', 2, 0.6, 'push'),
    ('0935', 1, 0.8, 'punch'), ('0950', 1, 0.8, 'punch'), ('0954', 1, 0.8, 'punch'), ('0956', 1, 0.8, 'punch'),
    ('0960', 1, 0.8, 'punch'), ('0961', 1, 0.8, 'punch'), ('0962', 2, 0.5, 'push'),
]
EXAMS = [
    ('0005', 2, 0.8, 'punch'), ('0992', 2, 0.5, 'push'), ('0003', 2, 0.6, 'whip-left'), ('0029', 2, 0.6, 'push'),
    ('0054', 2, 0.6, 'drift'), ('0031', 2, 0.5, 'push'), ('0081', 2, 0.6, 'whip-right'), ('0045', 2, 0.6, 'push'),
    ('0011', 2, 0.6, 'drift'), ('0019', 2, 0.6, 'punch'), ('0036', 2, 0.6, 'whip-left'), ('0043', 1, 0.8, 'punch'),
    ('0951', 1, 0.8, 'punch'), ('0048', 2, 0.6, 'push'), ('0050', 2, 0.6, 'whip-right'), ('0122', 2, 0.6, 'push'),
    ('0988', 2, 0.6, 'drift'), ('0128', 2, 0.6, 'punch'), ('0133', 2, 0.6, 'push'), ('0010', 2, 0.6, 'whip-left'),
    ('0116', 2, 0.6, 'push'), ('0158', 2, 0.6, 'punch'), ('0109', 2, 0.6, 'drift'), ('0075', 2, 0.6, 'push'),
]
COMPETITION = [
    ('0163', 1, 1.0, 'punch'), ('0164', 1, 1.0, 'whip-left'), ('0165', 1, 1.0, 'punch'), ('0166', 1, 1.0, 'whip-right'),
    ('TRI', 2, ('0993', '0994', '0002')), ('0004', 1, 1.0, 'punch'), ('0009', 1, 1.0, 'whip-left'),
    ('0023', 0.5, 1.0, 'punch'), ('0024', 0.5, 1.0, 'punch'), ('0025', 1, 1.0, 'whip-right'), ('0026', 1, 1.0, 'punch'),
    ('TRI', 2, ('0028', '0032', '0033')), ('0052', 1, 1.0, 'whip-left'), ('0055', 1, 1.0, 'punch'), ('0056', 1, 1.0, 'punch'),
    ('0072', 1, 1.0, 'whip-right'), ('0082', 1, 1.0, 'punch'), ('0108', 1, 1.0, 'punch'), ('0110', 1, 1.0, 'whip-left'),
    ('0117', 1, 1.0, 'punch'), ('0142', 1, 1.0, 'punch'), ('0159', 1, 1.0, 'whip-right'), ('0039', 1, 1.0, 'punch'),
]
# Certificates: (clip, in-point, freeze after) — each snap is one hit long and freezes as the certificate is raised.
WALL = [('0095', 0.90, 0.7), ('0097', 0.83, 0.7), ('0098', 1.40, 0.7), ('0099', 1.30, 0.7), ('0100', 1.00, 0.7), ('0101', 1.05, 0.7), ('0102', 4.50, 0.7)]
AMBULANCE = [('0171', 0.80, 0.7), ('0173', 1.30, 0.7), ('0174', 1.50, 0.7), ('0175', 0.00, 0.6), ('0176', 2.00, 0.7), ('0177', 1.20, 0.7), ('0178', 1.10, 0.7), ('0179', 0.80, 0.7)]

lines, sfx, used = [], [], []

def shot(clip, s, e, rate, motion):
    used.append(clip)
    f0, f1 = fr(s), fr(e)
    sec = (f1 - f0) / FPS
    rate = min(rate, (dur[clip] - 0.12) / sec)
    trim = max(0.05, (dur[clip] - sec * rate) / 2)
    lines.append(f'        <Shot name="{clip}" src="cc/clips/{clip}.mp4" from={{{f0}}} durationInFrames={{{f1 - f0}}} '
                 f'trim={{{trim:.2f}}} rate={{{rate:.2f}}} motion="{motion}" />')
    if motion.startswith('whip'):
        sfx.append(('whoosh' + str(1 + len(sfx) % 3), s - 0.12, 0.55))

def triptych(clips, s, e):
    used.extend(clips)
    f0, f1 = fr(s), fr(e)
    sec = (f1 - f0) / FPS
    trims = [max(0.05, (dur[c] - sec) / 2) for c in clips]
    a, b, c = clips
    lines.append(f'        <Triptych name="Split {a}-{b}-{c}" a="cc/clips/{a}.mp4" b="cc/clips/{b}.mp4" c="cc/clips/{c}.mp4" '
                 f'trimA={{{trims[0]:.2f}}} trimB={{{trims[1]:.2f}}} trimC={{{trims[2]:.2f}}} from={{{f0}}} durationInFrames={{{f1 - f0}}} />')
    sfx.append(('whoosh3', s - 0.1, 0.6))

for c, s, e, r, m in INTRO:
    shot(c, s, e, r, m)
pos = 0
for section in (WELCOME, EXAMS, COMPETITION):
    for item in section:
        if item[0] == 'TRI':
            triptych(item[2], k(pos), k(pos + item[1]))
            pos += item[1]
        else:
            c, n, r, m = item
            shot(c, k(pos), k(pos + n), r, m)
            pos += n
assert pos == 104, pos

snaps = []
def snap(c, trim, at, tilt):
    global pos
    used.append(c)
    f0, f1 = fr(k(pos)), fr(k(pos + 2))
    snaps.append(f'        <PhotoSnap name="Snap {c}" src="cc/clips/{c}.mp4" trim={{{trim:.2f}}} snapAt={{{at}}} tilt={{{tilt}}} from={{{f0}}} durationInFrames={{{f1 - f0}}} />')
    sfx.append(('shutter', k(pos) + at - 0.03, 0.9))
    pos += 2

shot('0091', k(pos), k(pos + 2), 0.6, 'punch')
pos += 2
for i, (c, trim, at) in enumerate(WALL):
    snap(c, trim, at, -3 if i % 2 else 3)
shot('0168', k(pos), k(pos + 2), 0.6, 'push')
pos += 2
for i, (c, trim, at) in enumerate(AMBULANCE):
    snap(c, trim, at, -3 if i % 2 else 3)
MOSAIC_START = pos
assert pos == 138, pos
assert len(used) == len(set(used)), 'repeated clip'

photos = [f'cc/stills/{c}.jpg' for c, _, _ in WALL + AMBULANCE]
for t in (A, k(34), k(80), k(104), k(138)):
    sfx.append(('impact', t - 0.05, 0.85))
    sfx.append(('riser', t - 2.0, 0.5))
for t in (k(8), k(30), k(34), k(80), k(86), k(92), k(98), k(104)):
    sfx.append(('glitch', t, 0.55))
    sfx.append(('whoosh2', t - 0.2, 0.5))
for i in range(0, 15, 3):
    sfx.append(('shutter', k(138) + i * 2 / FPS, 0.6))

SLAMS = [(k(30), 'READY?', '#2ad4ff'), (k(34), 'GO!', '#E1251B'), (k(80), 'SPEED', '#E1251B'), (k(86), 'PRECISION', '#2ad4ff'),
         (k(92), 'TEAMWORK', '#E1251B'), (k(98), 'PRESSURE', '#ffb02a'), (k(104), 'لحظة التتويج', '#E1251B')]

out = [f"""// Generated by scripts/build_cc2_timeline.py — edit the shot lists there and re-run.
import {{Audio}} from '@remotion/media';
import {{interpolate, staticFile, Track, useVideoConfig}} from 'remotion';
import {{Flash}} from '../medgo/Fx';
import {{Shot}} from '../medgo/Shot';
import {{EndSlate, ExamTimer, GlitchTitle, HeartbeatBadge, LogoBug, Typewriter}} from './Brand';
import {{EcgSweep, Mosaic, Slam, Triptych, Viewfinder}} from './Graphics';
import {{PhotoSnap}} from './PhotoSnap';

export const CrashCourse2 = () => {{
  const {{durationInFrames}} = useVideoConfig();

  return (
    <>
      <Track name="Shots">"""]
out += lines
out.append("      </Track>\n      <Track name=\"Certificates\">")
out += snaps
out.append(f"""      </Track>
      <Mosaic name="Certificate wall" photos={{{photos!r}}} title="أبطال" sub="crash course 2" from={{{fr(k(138))}}} durationInFrames={{{fr(k(146)) - fr(k(138))}}} />
      <Viewfinder name="Viewfinder" from={{{fr(k(34))}}} durationInFrames={{{fr(k(80)) - fr(k(34))}}} />
      <Track name="Flashes">""".replace("'", '"'))
for i, t in enumerate([A, k(34), k(80), k(104), k(138)]):
    out.append(f'        <Flash name="Flash {i + 1}" from={{{fr(t)}}} durationInFrames={{8}} />')
out.append("      </Track>\n      <Track name=\"ECG sweeps\">")
for i, t in enumerate([A - 0.4, k(34) - 0.4, k(104) - 0.4, k(138) - 0.4]):
    out.append(f'        <EcgSweep name="ECG {i + 1}" from={{{fr(t)}}} durationInFrames={{24}} />')
out.append(f"""      </Track>
      <LogoBug name="Logo" from={{0}} durationInFrames={{{fr(k(146))}}} />
      <Track name="Titles">
        <Typewriter name="Typewriter" line1="هيئة الهلال الأحمر السعودي" line2="بمنطقة المدينة المنورة" from={{24}} durationInFrames={{{fr(A) - 24 - 4}}} />
        <GlitchTitle name="Glitch title" arabic="تنفذ برنامج" latin="crash course 2" from={{{fr(k(8))}}} durationInFrames={{{fr(k(16)) - fr(k(8))}}} />
        <HeartbeatBadge name="Badge" label="crash course 2" from={{{fr(k(44))}}} durationInFrames={{{fr(k(54)) - fr(k(44))}}} />
      </Track>
      <Track name="Slams">""")
for i, (t, text, accent) in enumerate(SLAMS):
    length = 1.4 if i == len(SLAMS) - 1 else 0.85
    out.append(f'        <Slam name="Slam {text}" text="{text}" accent="{accent}" from={{{fr(t)}}} durationInFrames={{{fr(length)}}} />')
out.append(f"""      </Track>
      <Track name="HUD">
        <ExamTimer name="Exam timer" label="EXAM" seconds={{240}} from={{{fr(k(34))}}} durationInFrames={{{fr(k(80)) - fr(k(34))}}} />
        <ExamTimer name="Final timer" label="FINAL" seconds={{{round(k(104) - k(80), 2)}}} from={{{fr(k(80))}}} durationInFrames={{{fr(k(104)) - fr(k(80))}}} />
      </Track>
      <EndSlate name="End slate" from={{{fr(k(146))}}} durationInFrames={{{fr(END) - fr(k(146))}}} />
      <Audio
        name="Score"
        src={{staticFile('medgo/score.mp3')}}
        volume={{(f) => 0.85 * interpolate(f, [0, 8, durationInFrames - 45, durationInFrames - 1], [0, 1, 1, 0], {{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}})}}
      />""")
for i, (name, t, vol) in enumerate(sorted(sfx, key=lambda x: x[1])):
    out.append(f'      <Audio name="{name} {i + 1}" src={{staticFile(\'cc/sfx/{name}.mp3\')}} from={{{max(0, fr(t))}}} volume={{{vol}}} />')
out.append("""    </>
  );
};
""")
open('src/cc2/CrashCourse2.tsx', 'w').write('\n'.join(out))
print('clips', len(used), 'unique', len(set(used)), 'sfx', len(sfx))
