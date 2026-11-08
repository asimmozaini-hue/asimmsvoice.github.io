"""Writes src/medgo/MedgoFilm.tsx: the MEDGO 5 edit, with every cut on the music's 1.38s hit grid.

Run: python3 scripts/build_medgo_timeline.py <clip-durations.txt>
The durations file has lines "<name> <seconds> <fps>" for the raw clips.
"""
import sys

FPS = 30
A = 8.065            # first strong hit (start of the rhythmic section)
H = 1.3795 / 2       # half of the hit period
END = 114.0          # film length in seconds

def k(t):
    return A + t * H

def fr(t):
    return round(t * FPS)

durations, fps_of = {}, {}
for line in open(sys.argv[1]):
    name, dur, rate = line.split()
    key = name.replace('IMG_', '')
    durations[key] = float(dur)
    n, d = rate.strip(',').split('/')
    fps_of[key] = int(n) / int(d)

def short(name):
    return name if name.startswith('22') or name.startswith('23') or name.startswith('21') else name

# (clip, length in half-hits, playback rate, camera move)
INTRO = [  # seconds-based
    ('2216', 0.0, 3.93, 0.5, 'push'),
    ('2324', 3.93, 6.69, 0.6, 'push'),
    ('2379', 6.69, A, 0.8, 'drift'),
]
SECTION_A = [
    ('2343', 4, 0.8, 'push'), ('2342', 2, 0.9, 'punch'), ('2208', 2, 1, 'whip-left'), ('2341', 2, 1, 'drift'),
    ('2211', 2, 1, 'punch'), ('2203', 2, 1, 'whip-right'), ('2207', 2, 0.8, 'push'), ('2209', 2, 1, 'punch'),
    ('2210', 2, 1, 'whip-left'), ('2197', 2, 0.8, 'punch'), ('2198', 2, 0.7, 'push'), ('2199', 2, 0.8, 'whip-right'),
    ('2201', 2, 0.8, 'drift'), ('2196', 0.5, 1, 'punch'), ('2180', 0.5, 1, 'punch'), ('2181', 0.5, 1, 'punch'),
    ('2182', 0.5, 1, 'punch'), ('2187', 4, 0.5, 'pull'),
]
SECTION_B = [
    ('2190', 4, 0.5, 'push'), ('2191', 2, 0.6, 'drift'), ('2228', 4, 0.5, 'pull'), ('2227', 2, 0.6, 'push'),
    ('2236', 4, 0.5, 'push'), ('2237', 2, 0.6, 'pull'), ('2254', 2, 0.6, 'drift'), ('2255', 2, 0.6, 'push'),
    ('2247', 4, 0.5, 'push'), ('2319', 2, 0.6, 'pull'), ('2373', 2, 0.6, 'drift'), ('2380', 2, 0.6, 'push'),
    ('2382', 2, 0.6, 'pull'), ('2361', 2, 0.6, 'push'), ('2369', 2, 0.6, 'drift'), ('2257', 2, 0.6, 'push'),
    ('358F8203-6A46-48FF-BF04-A3EA6ABB2DDB', 4, 0.9, 'push'), ('2272', 2, 0.6, 'pull'), ('2273', 2, 0.6, 'push'),
    ('2FA907AB-7026-473B-869C-176D2215FAC3', 2, 0.9, 'drift'), ('2326', 2, 0.6, 'push'), ('2274', 2, 0.6, 'pull'),
    ('2246', 4, 0.5, 'push'), ('2242', 2, 0.6, 'drift'), ('2279', 2, 0.6, 'push'), ('2281', 2, 0.6, 'pull'),
    ('2294', 2, 0.6, 'drift'), ('2358', 2, 0.6, 'push'), ('2366', 2, 0.6, 'pull'),
]
SECTION_C = [
    ('2331', 2, 0.6, 'punch'), ('2250', 2, 0.8, 'whip-left'), ('2188', 1, 1, 'punch'), ('2185', 1, 1, 'punch'),
    ('2186', 2, 0.8, 'whip-right'), ('2252', 2, 0.8, 'punch'), ('2225', 1, 1, 'punch'), ('2183', 1, 1, 'punch'),
    ('2256', 0.5, 1, 'punch'), ('2259', 0.5, 1, 'punch'), ('2268', 0.5, 1, 'punch'), ('2270', 0.5, 1, 'punch'),
    ('2320', 0.5, 1, 'punch'), ('2322', 0.5, 1, 'punch'), ('2359', 0.5, 1, 'punch'), ('2360', 0.5, 1, 'punch'),
    ('2194', 2, 0.8, 'whip-left'), ('2226', 2, 0.8, 'punch'), ('2229', 1, 1, 'punch'), ('2230', 1, 1, 'punch'),
    ('2239', 2, 0.8, 'whip-right'), ('2240', 2, 0.8, 'punch'), ('2244', 2, 0.8, 'push'),
]
OUTRO = [
    ('2235', 4, 0.5, 'push'), ('2364', 2, 0.6, 'drift'), ('2387', 2, 0.6, 'push'), ('2213', 3, 0.5, 'push'),
    ('2389', 3, 0.5, 'pull'),
]

shots = []
for clip, s, e, rate, motion in INTRO:
    shots.append((clip, s, e, rate, motion))
pos = 0.0
for section in (SECTION_A, SECTION_B, SECTION_C, OUTRO):
    for clip, length, rate, motion in section:
        shots.append((clip, k(pos), k(pos + length), rate, motion))
        pos += length
assert abs(pos - 146) < 1e-6, pos
shots.append(('2216', k(146), END, 0.5, 'pull'))  # behind the end card

def jsx_shot(i, clip, s, e, rate, motion):
    f0, f1 = fr(s), fr(e)
    seconds = (f1 - f0) / FPS
    dur = durations[clip]
    native = fps_of[clip]
    if native < 40:
        rate = max(rate, 0.8)
    rate = min(rate, (dur - 0.15) / seconds)
    need = seconds * rate
    trim = max(0.1, (dur - need) / 2)
    return (f'        <Shot name="{i:02d} {clip[:8]}" src="medgo/{clip}.mp4" from={{{f0}}} durationInFrames={{{f1 - f0}}} '
            f'trim={{{trim:.2f}}} rate={{{rate:.2f}}} motion="{motion}" />')

TITLES = [
    # (start, end, kicker, headline, sub, position)
    (k(0), k(8), 'في الميدان', 'جاهزيةٌ على مدار الساعة', '', 'lower'),
    (k(20), k(28), '', 'من الميدان… إلى قلب المؤتمر', '', 'lower'),
    (k(34), k(42), 'في جناح الهيئة', 'نُعلِّمُ مهارةً… تُنقذ حياة', '', 'lower'),
    (k(56), k(64), '', 'الإنعاش القلبي الرئوي', 'للبالغين والرُّضَّع', 'lower'),
    (k(74), k(82), '', 'لأجل كل أمٍّ… وكل مولود', '', 'lower'),
    (k(88), k(96), '', 'رسالةٌ تصل… وأثرٌ يبقى', '', 'lower'),
    (k(104), k(110), 'تطوّع معنا', 'متطوعون… بروحٍ واحدة', '', 'lower'),
    (k(122), k(130), '', 'علمٌ ومهارةٌ… وإنسانية', '', 'lower'),
    (k(132), k(142), '', 'شركاءُ في صحة المجتمع', 'مؤتمر المدينة المنورة الدولي الخامس للنساء والولادة', 'center'),
]
FLASHES = [2.55, k(0), k(30), k(104), k(106), k(116)]
LEAKS = [(0.0, 1.2, 3, 0), (k(34), 1.0, 7, 0), (k(74), 1.0, 11, 340), (k(132), 1.2, 5, 0)]

out = []
out.append("""// Generated by scripts/build_medgo_timeline.py — edit the shot lists there and re-run.
import {Audio} from '@remotion/media';
import {interpolate, staticFile, Track, useVideoConfig} from 'remotion';
import {EndCard} from './EndCard';
import {Flash, Leak} from './Fx';
import {Shot} from './Shot';
import {CornerTag, MedgoMark, Title} from './Titles';

export const MedgoFilm = () => {
  const {durationInFrames} = useVideoConfig();

  return (
    <>
      <Track name="Shots">""")
for i, (clip, s, e, rate, motion) in enumerate(shots):
    out.append(jsx_shot(i, clip, s, e, rate, motion))
out.append("""      </Track>
      <Track name="Light leaks">""")
for i, (t, length, seed, hue) in enumerate(LEAKS):
    f0 = max(0, fr(t - length / 2)) if t > 0 else 0
    out.append(f'        <Leak name="Leak {i + 1}" seed={{{seed}}} hueShift={{{hue}}} from={{{f0}}} durationInFrames={{{fr(length)}}} />')
out.append("""      </Track>
      <Track name="Flashes">""")
for i, t in enumerate(FLASHES):
    out.append(f'        <Flash name="Flash {i + 1}" from={{{fr(t)}}} durationInFrames={{7}} />')
out.append("""      </Track>
      <CornerTag name="Corner tag" from={%d} durationInFrames={%d} />
      <Track name="Titles">
        <Title name="Opening org" kicker="مشاركة" headline="هيئة الهلال الأحمر السعودي" sub="" position="center" from={12} durationInFrames={%d} />
        <MedgoMark name="MEDGO mark" line1="مؤتمر المدينة المنورة الدولي الخامس للنساء والولادة" line2="6–7 NOVEMBER 2026 · MADINAH" from={%d} durationInFrames={%d} />""" % (
    fr(A), fr(k(146)) - fr(A), fr(2.45) - 12, fr(2.55), fr(A) - fr(2.55) - 2))
for i, (s, e, kicker, head, sub, position) in enumerate(TITLES):
    out.append(f'        <Title name="Title {i + 1}" kicker="{kicker}" headline="{head}" sub="{sub}" position="{position}" '
               f'from={{{fr(s) + 4}}} durationInFrames={{{fr(e) - fr(s) - 6}}} />')
out.append("""      </Track>
      <EndCard name="End card" org="هيئة الهلال الأحمر السعودي" slogan="معك… في كل لحظة" footer="MEDGO 5 · MADINAH · NOV 2026" from={%d} durationInFrames={%d} />
      <Audio
        name="Score"
        src={staticFile('medgo/score.mp3')}
        volume={(f) => interpolate(f, [0, 8, durationInFrames - 45, durationInFrames - 1], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
      />
    </>
  );
};
""" % (fr(k(146)), fr(END) - fr(k(146))))
open('src/medgo/MedgoFilm.tsx', 'w').write('\n'.join(out))
print('shots', len(shots), 'unique clips', len({s[0] for s in shots}), 'frames', fr(END))
