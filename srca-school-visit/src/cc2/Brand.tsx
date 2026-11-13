import {Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {arabicFont, latinFont} from '../medgo/theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// The SRCA seal in the top corner, as in the first Crash Course film.
const LogoBugInner = () => {
  const frame = useCurrentFrame();
  return (
    <Img
      src={staticFile('cc/logo-bug.png')}
      style={{
        position: 'absolute',
        left: 50,
        top: 40,
        width: 150,
        height: 150,
        opacity: interpolate(frame, [0, 12], [0, 0.92], clamp),
        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.45))',
      }}
    />
  );
};
export const LogoBug = Interactive.create({Component: LogoBugInner, layout: 'absolute-fill', schema: {}});

// Two lines typed in from the right; a mask sweep keeps the Arabic letters joined.
const TypewriterInner = ({line1, line2}: {readonly line1: string; readonly line2: string}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const reveal = (start: number, len: number) =>
    `inset(-20% -2% -20% ${interpolate(frame, [start, start + len], [102, -2], clamp)}%)`;
  return (
    <div
      dir="rtl"
      lang="ar"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 760,
        textAlign: 'center',
        color: '#fff',
        fontFamily: arabicFont,
        textShadow: '0 3px 14px rgba(0,0,0,0.6)',
        opacity: interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], clamp),
      }}
    >
      <div style={{fontSize: 64, fontWeight: 800, clipPath: reveal(4, 30)}}>{line1}</div>
      <div style={{fontSize: 50, fontWeight: 500, marginTop: 10, clipPath: reveal(30, 24)}}>{line2}</div>
    </div>
  );
};
export const Typewriter = Interactive.create({
  Component: TypewriterInner,
  layout: 'absolute-fill',
  schema: {
    line1: {type: 'string', default: '', description: 'First line'},
    line2: {type: 'string', default: '', description: 'Second line'},
  },
});

// "تنفذ برنامج / crash course 2" with RGB split and jitter, like the first film's title.
const GlitchTitleInner = ({arabic, latin}: {readonly arabic: string; readonly latin: string}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const burst = frame < 10 || (frame % 23 < 3) || frame > durationInFrames - 8;
  const jitter = burst ? Math.sin(frame * 12.9898) * 14 : Math.sin(frame * 0.7) * 2;
  const split = burst ? 12 : 5;
  const layer = (color: string, dx: number, dy: number, blend: React.CSSProperties['mixBlendMode']) => (
    <div style={{position: 'absolute', inset: 0, color, translate: `${dx}px ${dy}px`, mixBlendMode: blend}}>
      <div dir="rtl" lang="ar" style={{fontFamily: arabicFont, fontWeight: 900, fontSize: 104}}>{arabic}</div>
      <div style={{fontFamily: latinFont, fontWeight: 900, fontSize: 92, marginTop: -6}}>{latin}</div>
    </div>
  );
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 820,
        height: 280,
        textAlign: 'center',
        opacity: interpolate(frame, [0, 4, durationInFrames - 4, durationInFrames], [0, 1, 1, 0], clamp),
        scale: String(interpolate(frame, [0, 8], [1.25, 1], {...clamp, easing: Easing.out(Easing.cubic)})),
        translate: `${jitter}px 0px`,
        filter: 'drop-shadow(0 0 18px rgba(255,255,255,0.35))',
      }}
    >
      {layer('#ff2a3a', -split, 0, 'screen')}
      {layer('#2ad4ff', split, split / 3, 'screen')}
      {layer('#ffe14a', 0, -split / 2, 'screen')}
      {layer('#ffffff', 0, 0, 'normal')}
    </div>
  );
};
export const GlitchTitle = Interactive.create({
  Component: GlitchTitleInner,
  layout: 'absolute-fill',
  schema: {
    arabic: {type: 'string', default: '', description: 'Arabic line'},
    latin: {type: 'string', default: '', description: 'Latin line'},
  },
});

// White outlined speech box with an ECG line and a heart, carrying the programme name.
const HeartbeatBadgeInner = ({label}: {readonly label: string}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const draw = interpolate(frame, [4, 26], [1, 0], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 1480,
        display: 'flex',
        justifyContent: 'center',
        opacity: interpolate(frame, [0, 6, durationInFrames - 8, durationInFrames], [0, 1, 1, 0], clamp),
        scale: String(interpolate(frame, [0, 10], [0.7, 1], {...clamp, easing: Easing.out(Easing.back(1.8))})),
      }}
    >
      <div style={{position: 'relative'}}>
        <svg width="560" height="210" viewBox="0 0 560 210" style={{position: 'absolute', left: -40, top: -70}}>
          <path
            d="M40 160 L40 70 Q40 60 50 60 L210 60 L240 60 L255 30 L270 95 L285 15 L300 75 L312 60 L470 60 Q480 60 480 70 L480 160 Q480 170 470 170 L95 170 L60 200 L68 170 L50 170 Q40 170 40 160 Z"
            fill="rgba(0,0,0,0.25)"
            stroke="#fff"
            strokeWidth={6}
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={draw}
          />
          <path
            d="M340 48 C330 36 314 44 322 58 L340 74 L358 58 C366 44 350 36 340 48 Z"
            fill="#fff"
            opacity={interpolate(frame, [20, 26], [0, 1], clamp)}
            transform={`translate(0 ${-6}) scale(${1 + 0.08 * Math.max(0, Math.sin(frame / 4))})`}
            style={{transformOrigin: '340px 58px'}}
          />
        </svg>
        <div
          style={{
            width: 440,
            height: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: latinFont,
            fontWeight: 900,
            fontSize: 44,
            color: '#fff',
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            opacity: interpolate(frame, [12, 20], [0, 1], clamp),
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};
export const HeartbeatBadge = Interactive.create({
  Component: HeartbeatBadgeInner,
  layout: 'absolute-fill',
  schema: {label: {type: 'string', default: '', description: 'Label'}},
});

// Competition HUD: a stopwatch counting down with a pulsing red dot.
const ExamTimerInner = ({label, seconds}: {readonly label: string; readonly seconds: number}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const left = Math.max(0, seconds - frame / fps);
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(Math.floor(left % 60)).padStart(2, '0');
  const cs = String(Math.floor((left % 1) * 100)).padStart(2, '0');
  return (
    <div
      style={{
        position: 'absolute',
        right: 60,
        top: 70,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '12px 24px',
        borderRadius: 14,
        backgroundColor: 'rgba(0,0,0,0.45)',
        border: '2px solid rgba(255,255,255,0.5)',
        color: '#fff',
        fontFamily: latinFont,
        fontWeight: 800,
        opacity: interpolate(frame, [0, 8, durationInFrames - 8, durationInFrames], [0, 1, 1, 0], clamp),
      }}
    >
      <div style={{width: 16, height: 16, borderRadius: 8, backgroundColor: '#ff2a2a', opacity: frame % 20 < 10 ? 1 : 0.25}} />
      <div style={{fontSize: 24, letterSpacing: 4}}>{label}</div>
      <div style={{fontSize: 44, fontVariantNumeric: 'tabular-nums'}}>
        {mm}:{ss}
        <span style={{fontSize: 28, opacity: 0.8}}>.{cs}</span>
      </div>
    </div>
  );
};
export const ExamTimer = Interactive.create({
  Component: ExamTimerInner,
  layout: 'absolute-fill',
  schema: {
    label: {type: 'string', default: 'EXAM', description: 'Label'},
    seconds: {type: 'number', default: 60, description: 'Countdown start (seconds)', hiddenFromList: false},
  },
});

// Official end slate from the first film, pushed in gently.
const EndSlateInner = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <Img
      src={staticFile('cc/endcard.png')}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: interpolate(frame, [0, 10, durationInFrames - 15, durationInFrames], [0, 1, 1, 0], clamp),
        scale: String(interpolate(frame, [0, durationInFrames], [1.06, 1], {...clamp, easing: Easing.out(Easing.cubic)})),
      }}
    />
  );
};
export const EndSlate = Interactive.create({Component: EndSlateInner, layout: 'absolute-fill', schema: {}});
