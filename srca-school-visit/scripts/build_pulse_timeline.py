"""Writes src/pulse/PulseFilm.tsx: the 89.5s cut of the rescue documentary.

Hook of the paramedic's strongest lines -> ECG title -> story -> rescue -> numbers -> meaning -> close.
All times are seconds; picture comes from public/story/clean.mp4, voices from public/story/vocals.wav
(music removed). The patient is never blurred: his shots are zoomed so his face stays out of frame (CROPS).
"""
FPS = 30
END = 100.0

def fr(t):
    return round(t * FPS)

# (out start, src start, src end, speaker)
VOICES = [
    (0.6, 97.83, 104.75, 'paramedic'), (8.0, 128.66, 131.42, 'paramedic'), (11.1, 183.72, 185.28, 'paramedic'),
    (13.6, 1.17, 7.55, 'narrator'), (21.0, 24.44, 30.40, 'paramedic'), (34.6, 107.15, 114.79, 'narrator'),
    (42.6, 122.62, 128.66, 'paramedic'), (48.9, 131.42, 133.80, 'paramedic'), (51.7, 135.52, 140.32, 'narrator'),
    (57.0, 140.32, 148.66, 'narrator'), (65.9, 152.12, 158.26, 'paramedic'),
    (72.3, 182.66, 203.78, 'paramedic and narrator'),
]
# (out start, out end, src start, rate, move)
SHOTS = [
    (0.6, 1.8, 89.0, 1, 'punch'), (1.8, 3.0, 104.2, 1, 'whip-left'), (3.0, 4.2, 21.6, 1, 'punch'), (4.2, 5.4, 134.4, 1, 'push'),
    (5.4, 6.4, 143.6, 1, 'punch'), (6.4, 7.6, 173.5, 1, 'whip-right'),
    (8.0, 9.4, 138.0, 1, 'push'), (9.4, 10.6, 149.95, 0.9, 'push'),
    (11.1, 12.7, 164.6, 1, 'push'),
    (13.4, 15.6, 7.95, 0.45, 'push'), (15.6, 17.8, 13.15, 0.55, 'drift'), (17.8, 21.0, 10.75, 0.35, 'push'),
    (21.0, 27.0, 24.44, 1, 'push'),
    (27.0, 28.8, 31.5, 0.8, 'push'), (28.8, 30.0, 40.5, 1, 'punch'), (30.0, 31.2, 46.0, 0.8, 'push'),
    (31.2, 32.2, 47.95, 0.85, 'whip-left'), (32.2, 33.4, 51.5, 1, 'push'), (33.4, 34.6, 64.8, 1, 'drift'),
    (34.6, 36.6, 92.0, 1, 'push'), (36.6, 39.0, 107.5, 1, 'push'), (39.0, 42.6, 126.0, 0.8, 'pull'),
    (42.6, 44.2, 117.6, 1, 'push'), (44.2, 45.8, 123.0, 1, 'push'), (45.8, 47.2, 135.8, 1, 'push'),
    (47.2, 48.1, 146.9, 1, 'punch'), (48.1, 48.9, 148.75, 1, 'punch'), (48.9, 51.4, 131.42, 1, 'push'),
    (51.4, 57.0, 62.95, 0.3, 'push'),
    (57.0, 59.2, 159.0, 1, 'push'), (59.2, 61.4, 175.6, 1, 'drift'), (61.4, 63.4, 67.6, 1, 'push'), (63.4, 65.9, 77.6, 0.7, 'push'),
    (65.9, 72.0, 152.12, 1, 'push'), (72.0, 78.4, 182.36, 1, 'push'), (78.4, 81.0, 82.0, 1, 'push'),
    (81.0, 83.9, 86.75, 0.62, 'push'), (83.9, END, 194.4, 0.85, 'push'),
]
# Patient shots by source start -> (zoom, origin x, origin y), from story_work/plan_crops.py: the widest window that
# keeps his face out of frame for the whole shot.
CROPS = {134.4: (1.5, 1.0, 0.0), 31.5: (1.66, 0.0, 1.0), 46.0: (1.42, 0.0, 1.0), 117.6: (1.82, 1.0, 0.0), 123.0: (1.92, 1.0, 0.0), 135.8: (1.56, 1.0, 0.0)}
# (src start, src end, text): hook quotes are big and centred, the rest are subtitles.
HOOK = [(97.83, 99.51, 'في لحظة الوصول للبلاغ'), (99.51, 100.99, 'ما في مجال للتردد'), (100.99, 103.25, 'كل ثانية لها قيمة'),
        (103.25, 104.75, 'وكل قرار يصنع الفرق'), (128.66, 131.42, 'هل حيرجع النبض لقلبه… أو لا؟'), (183.72, 185.28, 'أنا ما أعتبر نفسي بطل')]
SUBS = [
    (24.44, 25.76, 'في كل مرة يوصلنا بلاغ'), (25.76, 28.68, 'أعرف أنه في شخص أو عائلة كلها أمل'), (28.68, 30.40, 'أننا نوصل في الوقت المناسب'),
    (107.15, 110.17, 'بينما يتراجع الجميع أمام الخطر'), (110.17, 114.79, 'يتقدّم هو… لا يبحث عن الأضواء ولا ينتظر الشكر'),
    (122.62, 126.26, 'وأنا أبذل إنعاش… ما أفكر في عدد الضغطات'), (126.26, 128.66, 'قد ما أفكر… أسأل نفسي عن المريض'),
    (131.42, 133.80, 'في هذه الحالة… أنا أبذل كل جهدي'),
    (135.52, 136.96, 'في الحالات التي باشرها'), (136.96, 140.32, 'بلغت نسبة النجاح ٥٥٪'),
    (140.32, 143.62, 'لكن القيمة الحقيقية ليست في الرقم'), (143.62, 145.74, 'بل في كل نبضةٍ عادت'), (145.74, 148.66, 'وفي كل عائلةٍ عاد إليها الأمل'),
    (152.12, 155.98, 'أجمل شعور لما أشوف أنه النبض رجع'), (155.98, 158.26, 'وأعرف أنه هذا المريض رح يرجع لأهله'),
    (182.66, 185.28, 'في الحقيقة أنا ما أعتبر نفسي بطل'), (185.28, 188.66, 'أنا أشوف نفسي شخص قام بواجبه'),
    (188.66, 191.44, 'وأتمنى أني أكون بعد الله'), (191.44, 194.20, 'سبب في مساعدة أي شخص يحتاجني'),
    (194.20, 198.32, 'هو بعد الله سببٌ في عودة النبض'), (198.32, 201.30, 'ورسم الابتسامة وإحياء الأمل'),
    (201.30, 203.78, 'في قلوبٍ كادت أن تفقد'),
]

def to_out(src, hook=False):
    for o, a, b, _ in VOICES:
        if (o < 13) == hook and a - 0.01 <= src <= b + 0.01:
            return o + (src - a)
    raise ValueError(src)

SFX = [('heartbeat', 0.0, 0.9), ('subhit', 0.55, 0.5), ('whoosh1', 1.68, 0.35), ('whoosh2', 5.28, 0.35), ('whoosh3', 6.28, 0.35),
       ('heartbeat', 7.5, 0.9), ('heartbeat', 10.5, 0.9), ('flatline', 12.7, 0.45), ('subhit', 13.4, 0.7),
       ('heartbeat', 14.0, 0.7), ('beep', 14.3, 0.25), ('heartbeat', 15.1, 0.6), ('beep', 15.4, 0.25), ('heartbeat', 16.2, 0.5),
       ('whoosh1', 31.08, 0.3), ('beep', 32.3, 0.3), ('beep', 33.0, 0.3),
       ('heartbeat', 51.4, 0.6), ('subhit', 57.0, 0.55),
       ('beep', 66.0, 0.3), ('beep', 66.85, 0.3), ('beep', 67.7, 0.3), ('beep', 68.55, 0.25),
       ('subhit', 94.6, 0.6), ('heartbeat', 94.9, 0.5)]
FLASHES = [0.6, 7.6, 13.4, 57.0]
LEAKS = [(56.4, 1.4, 3, 0), (83.2, 1.5, 9, 330)]

# Music under voices: 0.55 when clear, 0.2 under speech (0.35s ramps). Kept as interpolate keyframes.
pts = [(0, 0.0), (0.4, 0.4)]
for o, a, b, _ in VOICES:
    e = o + (b - a)
    pts += [(o - 0.35, 0.55 if o > 13 else 0.4), (o, 0.2), (e, 0.2), (e + 0.35, 0.55 if e > 13 else 0.4)]
pts += [(END - 2.5, 0.55), (END - 0.05, 0.0)]
pts.sort()
clean = []
for t, v in pts:
    if clean and t <= clean[-1][0] + 0.02:
        clean[-1] = (clean[-1][0], min(clean[-1][1], v))
    else:
        clean.append((t, v))
mus_in = ', '.join(str(fr(t)) for t, _ in clean)
mus_out = ', '.join(str(v) for _, v in clean)

o = ["""// Generated by scripts/build_pulse_timeline.py — edit the tables there and re-run.
import {Audio} from '@remotion/media';
import {AbsoluteFill, interpolate, staticFile, Track} from 'remotion';
import {Flash, Leak} from '../medgo/Fx';
import {Shot} from '../medgo/Shot';
import {CallHud, EcgTitle, EndCard, HookLine, Letterbox, LowerThird, StatPanel, Subtitle} from './Graphics';

export const PulseFilm = () => {
  return (
    <>
      <AbsoluteFill style={{backgroundColor: '#000'}} />
      <Track name="Shots">"""]
for a, b, src, rate, move in SHOTS:
    crop = ''
    if src in CROPS:
        z, ox, oy = CROPS[src]
        crop = f' zoom={{{z}}} originX={{{ox}}} originY={{{oy}}}'
    o.append(f'        <Shot name="{src:.2f}" src="story/clean.mp4" from={{{fr(a)}}} durationInFrames={{{fr(b) - fr(a)}}} trim={{{src:.2f}}} rate={{{rate}}} motion="{move}"{crop} />')
o.append('      </Track>')
o.append(f'      <EcgTitle name="Title" line1="بين كل نداء استغاثة" line2="هناك ثوانٍ لا تُقاس بالوقت" line3="بل تُقاس بالحياة" beatAt={{{fr(13.6) - fr(12.7)}}} l2At={{{fr(to_out(3.09)) - fr(12.7)}}} l3At={{{fr(to_out(5.85)) - fr(12.7)}}} from={{{fr(12.7)}}} durationInFrames={{{fr(21.0) - fr(12.7)}}} />')
o.append(f'      <CallHud name="Call" label="بلاغ وارد" number="997" from={{{fr(32.2)}}} durationInFrames={{{fr(42.6) - fr(32.2)}}} />')
o.append(f'      <LowerThird name="Paramedic" title="وسام فيزو" sub="أخصائي إسعاف وطب طوارئ" org="هيئة الهلال الأحمر السعودي بمنطقة المدينة المنورة" from={{{fr(21.3)}}} durationInFrames={{{fr(26.9) - fr(21.3)}}} />')
o.append(f'      <StatPanel name="Success rate" value={{55}} average={{30}} caption="نسبة النجاح في الحالات التي باشرها" averageCaption="المتوسط العالمي لاستعادة النبض خارج المستشفى" from={{{fr(51.4)}}} durationInFrames={{{fr(57.0) - fr(51.4)}}} />')
o.append('      <Track name="Hook quotes">')
for a, b, text in HOOK:
    s, e = to_out(a, hook=True), to_out(b, hook=True)
    o.append(f'        <HookLine name="{text}" text="{text}" size={{{100 if len(text) < 22 else 84}}} from={{{fr(s)}}} durationInFrames={{{fr(e) - fr(s) + 4}}} />')
o.append('      </Track>\n      <Track name="Subtitles">')
for a, b, text in SUBS:
    s, e = to_out(a), to_out(b)
    o.append(f'        <Subtitle name="{text}" text="{text}" from={{{fr(s)}}} durationInFrames={{{fr(e) - fr(s)}}} />')
o.append('      </Track>\n      <Track name="Light leaks">')
for i, (t, l, seed, hue) in enumerate(LEAKS):
    o.append(f'        <Leak name="Leak {i + 1}" seed={{{seed}}} hueShift={{{hue}}} from={{{fr(t)}}} durationInFrames={{{fr(l)}}} />')
o.append('      </Track>\n      <Track name="Flashes">')
for i, t in enumerate(FLASHES):
    o.append(f'        <Flash name="Flash {i + 1}" from={{{fr(t)}}} durationInFrames={{7}} />')
o.append(f"""      </Track>
      <EndCard name="End card" org="هيئة الهلال الأحمر السعودي" line="ثوانٍ تُقاس بالحياة" from={{{fr(94.6)}}} durationInFrames={{{fr(END) - fr(94.6)}}} />
      <Letterbox name="Letterbox" />
      <Track name="Voices">""")
for i, (out_t, a, b, who) in enumerate(VOICES):
    o.append(f'        <Audio name="{who} {i + 1}" src={{staticFile(\'story/vocals.wav\')}} from={{{fr(out_t)}}} trimBefore={{{fr(a)}}} durationInFrames={{{fr(b) - fr(a) + 6}}} volume={{1.15}} />')
o.append(f"""      </Track>
      <Audio
        name="Score"
        src={{staticFile('story/score.mp3')}}
        volume={{(f) => interpolate(f, [{mus_in}], [{mus_out}], {{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}})}}
      />""")
for i, (name, t, vol) in enumerate(SFX):
    folder = 'cc/sfx' if name.startswith('whoosh') else 'story/sfx'
    o.append(f'      <Audio name="{name} {i + 1}" src={{staticFile(\'{folder}/{name}.mp3\')}} from={{{fr(t)}}} volume={{{vol}}} />')
o.append("""    </>
  );
};
""")
open('src/pulse/PulseFilm.tsx', 'w').write('\n'.join(o))
print('shots', len(SHOTS), 'voices', len(VOICES), 'subs', len(SUBS), 'frames', fr(END))
