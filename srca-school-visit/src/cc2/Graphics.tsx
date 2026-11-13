import {Video} from '@remotion/media';
import {Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {arabicFont, latinFont} from '../medgo/theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// A word that slams into frame: oversized, blurred and shaking, then locks with an RGB split.
const SlamInner = ({text, accent}: {readonly text: string; readonly accent: string}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const arabic = /[؀-ۿ]/.test(text);
  const shake = frame < 8 ? Math.sin(frame * 9.1) * (8 - frame) * 3 : 0;
  const split = interpolate(frame, [0, 6], [26, 4], clamp);
  const word = (color: string, dx: number) => (
    <div
      dir={arabic ? 'rtl' : 'ltr'}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color,
        translate: `${dx}px 0px`,
        mixBlendMode: color === '#fff' ? 'normal' : 'screen',
        fontFamily: arabic ? arabicFont : latinFont,
        fontWeight: 900,
        fontSize: arabic ? 150 : text.length > 8 ? 130 : 170,
        letterSpacing: arabic ? 0 : interpolate(frame, [0, 10], [30, 4], clamp),
      }}
    >
      {text}
    </div>
  );
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: interpolate(frame, [0, 2, durationInFrames - 5, durationInFrames], [0, 1, 1, 0], clamp),
        scale: String(interpolate(frame, [0, 6], [2.2, 1], {...clamp, easing: Easing.out(Easing.cubic)})),
        translate: `${shake}px ${-shake / 2}px`,
        filter: `blur(${interpolate(frame, [0, 5], [10, 0], clamp)}px) drop-shadow(0 0 30px rgba(0,0,0,0.7))`,
      }}
    >
      <div style={{position: 'absolute', left: 0, right: 0, top: '44%', height: 200, background: `linear-gradient(90deg, transparent, ${accent}99, transparent)`, scale: `${interpolate(frame, [0, 8], [0, 1], clamp)} 1`}} />
      {word('#ff2a3a', -split)}
      {word('#2ad4ff', split)}
      {word('#fff', 0)}
    </div>
  );
};
export const Slam = Interactive.create({
  Component: SlamInner,
  layout: 'absolute-fill',
  schema: {
    text: {type: 'string', default: '', description: 'Word'},
    accent: {type: 'color', default: '#E1251B', description: 'Accent band'},
  },
});

// A glowing ECG trace that sweeps across the frame between sections.
const EcgSweepInner = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, width} = useVideoConfig();
  const head = interpolate(frame, [0, durationInFrames - 4], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const path = 'M0 960 L300 960 L340 960 L380 820 L430 1120 L480 700 L530 1060 L570 960 L780 960 L810 900 L840 1000 L870 960 L1080 960';
  return (
    <svg width={width} height={1920} style={{position: 'absolute', inset: 0, opacity: interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], clamp)}}>
      <defs>
        <filter id="ecg-glow">
          <feGaussianBlur stdDeviation="10" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d={path} fill="none" stroke="#ff2a3a" strokeWidth={14} filter="url(#ecg-glow)" pathLength={1} strokeDasharray={`${head} 1`} />
      <path d={path} fill="none" stroke="#fff" strokeWidth={5} pathLength={1} strokeDasharray={`${head} 1`} />
    </svg>
  );
};
export const EcgSweep = Interactive.create({Component: EcgSweepInner, layout: 'absolute-fill', schema: {}});

// Camera viewfinder: corner brackets, REC dot and a running take counter.
const ViewfinderInner = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const corner = (style: React.CSSProperties) => (
    <div style={{position: 'absolute', width: 90, height: 90, borderColor: 'rgba(255,255,255,0.85)', borderStyle: 'solid', borderWidth: 0, ...style}} />
  );
  const secs = frame / fps;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: interpolate(frame, [0, 10, durationInFrames - 10, durationInFrames], [0, 1, 1, 0], clamp)}}>
      {corner({left: 50, top: 230, borderLeftWidth: 5, borderTopWidth: 5})}
      {corner({right: 50, top: 230, borderRightWidth: 5, borderTopWidth: 5})}
      {corner({left: 50, bottom: 230, borderLeftWidth: 5, borderBottomWidth: 5})}
      {corner({right: 50, bottom: 230, borderRightWidth: 5, borderBottomWidth: 5})}
      <div style={{position: 'absolute', left: 70, bottom: 250, display: 'flex', alignItems: 'center', gap: 12, color: '#fff', fontFamily: latinFont, fontWeight: 800, fontSize: 28, letterSpacing: 3, textShadow: '0 2px 8px rgba(0,0,0,0.6)'}}>
        <div style={{width: 18, height: 18, borderRadius: 9, backgroundColor: '#ff2a2a', opacity: frame % 24 < 12 ? 1 : 0.2}} />
        REC {String(Math.floor(secs / 60)).padStart(2, '0')}:{String(Math.floor(secs % 60)).padStart(2, '0')}
      </div>
      <div style={{position: 'absolute', right: 70, bottom: 250, color: '#fff', fontFamily: latinFont, fontWeight: 800, fontSize: 26, letterSpacing: 4, opacity: 0.85}}>
        CC2 · 4K60
      </div>
    </div>
  );
};
export const Viewfinder = Interactive.create({Component: ViewfinderInner, layout: 'absolute-fill', schema: {}});

// Three clips side by side, each sliding in from alternating edges.
const TriptychInner = ({a, b, c, trimA, trimB, trimC}: {readonly a: string; readonly b: string; readonly c: string; readonly trimA: number; readonly trimB: number; readonly trimC: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const panel = (src: string, trim: number, i: number) => (
    <div
      key={src}
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: i * 360,
        width: 356,
        overflow: 'hidden',
        translate: `0px ${interpolate(frame, [i * 3, i * 3 + 8], [i % 2 ? -1920 : 1920, 0], {...clamp, easing: Easing.out(Easing.cubic)})}px`,
      }}
    >
      <Video src={staticFile(src)} muted trimBefore={Math.round(trim * fps)} style={{position: 'absolute', top: 0, left: '50%', width: 1080, height: 1920, translate: '-50% 0px'}} />
    </div>
  );
  return (
    <div style={{position: 'absolute', inset: 0, backgroundColor: '#fff'}}>
      {panel(a, trimA, 0)}
      {panel(b, trimB, 1)}
      {panel(c, trimC, 2)}
    </div>
  );
};
export const Triptych = Interactive.create({
  Component: TriptychInner,
  layout: 'absolute-fill',
  schema: {
    a: {type: 'asset', assetType: 'video', default: '', description: 'Left clip'},
    b: {type: 'asset', assetType: 'video', default: '', description: 'Middle clip'},
    c: {type: 'asset', assetType: 'video', default: '', description: 'Right clip'},
    trimA: {type: 'number', default: 0, description: 'Left in-point', hiddenFromList: false},
    trimB: {type: 'number', default: 0, description: 'Middle in-point', hiddenFromList: false},
    trimC: {type: 'number', default: 0, description: 'Right in-point', hiddenFromList: false},
  },
});

// Final wall: every certificate photo pops into a 3x5 grid, then the title lands over it.
const MosaicInner = ({photos, title, sub}: {readonly photos: readonly string[]; readonly title: string; readonly sub: string}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const cols = 3;
  const cw = 1080 / cols;
  const ch = 1920 / Math.ceil(photos.length / cols);
  const end = durationInFrames;
  return (
    <div style={{position: 'absolute', inset: 0, backgroundColor: '#0b0b0d', opacity: interpolate(frame, [end - 10, end], [1, 0], clamp)}}>
      {photos.map((p, i) => {
        const start = i * 2;
        return (
          <Img
            key={p}
            src={staticFile(p)}
            style={{
              position: 'absolute',
              left: (i % cols) * cw + 4,
              top: Math.floor(i / cols) * ch + 4,
              width: cw - 8,
              height: ch - 8,
              objectFit: 'cover',
              opacity: interpolate(frame, [start, start + 3], [0, 1], clamp),
              scale: String(interpolate(frame, [start, start + 6], [1.6, 1], {...clamp, easing: Easing.out(Easing.cubic)})),
              filter: `brightness(${interpolate(frame, [start, start + 4, 40, 50], [3, 1, 1, 0.45], clamp)})`,
            }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          textAlign: 'center',
          textShadow: '0 6px 30px rgba(0,0,0,0.9)',
          background: 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.75) 42%, rgba(0,0,0,0.75) 58%, transparent 70%)',
          opacity: interpolate(frame, [40, 48], [0, 1], clamp),
          scale: String(interpolate(frame, [40, 50], [1.4, 1], {...clamp, easing: Easing.out(Easing.cubic)})),
        }}
      >
        <div dir="rtl" lang="ar" style={{fontFamily: arabicFont, fontWeight: 900, fontSize: 170}}>{title}</div>
        <div style={{fontFamily: latinFont, fontWeight: 900, fontSize: 84, marginTop: 6}}>{sub}</div>
      </div>
    </div>
  );
};
export const Mosaic = Interactive.create({
  Component: MosaicInner,
  layout: 'absolute-fill',
  schema: {
    photos: {type: 'hidden'},
    title: {type: 'string', default: '', description: 'Title'},
    sub: {type: 'string', default: '', description: 'Subtitle'},
  },
});
