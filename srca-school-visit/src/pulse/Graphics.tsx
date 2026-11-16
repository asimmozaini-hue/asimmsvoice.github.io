import {Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {arabicFont, latinFont} from '../medgo/theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const RED = '#E1251B';

// Cinematic bars that close in during the opening and stay for the whole film.
const LetterboxInner = () => {
  const frame = useCurrentFrame();
  const h = interpolate(frame, [0, 20], [0, 96], {...clamp, easing: Easing.out(Easing.cubic)});
  const bar = {position: 'absolute', left: 0, right: 0, height: h, backgroundColor: '#000'} as const;
  return (
    <>
      <div style={{...bar, top: 0}} />
      <div style={{...bar, bottom: 0}} />
    </>
  );
};
export const Letterbox = Interactive.create({Component: LetterboxInner, layout: 'absolute-fill', schema: {}});

// Big centred words that rise out of a blur, one after another; used for the hook quotes.
const HookLineInner = ({text, size}: {readonly text: string; readonly size: number}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <div
      dir="rtl"
      lang="ar"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 160px',
        textAlign: 'center',
        color: '#fff',
        fontFamily: arabicFont,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.35,
        textShadow: '0 6px 40px rgba(0,0,0,0.85)',
        opacity: interpolate(frame, [durationInFrames - 5, durationInFrames], [1, 0], clamp),
      }}
    >
      <div>
        {text.split(' ').map((w, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              marginLeft: size * 0.25,
              opacity: interpolate(frame, [i * 3, i * 3 + 7], [0, 1], clamp),
              filter: `blur(${interpolate(frame, [i * 3, i * 3 + 9], [16, 0], clamp)}px)`,
              translate: `0px ${interpolate(frame, [i * 3, i * 3 + 10], [size * 0.45, 0], {...clamp, easing: Easing.out(Easing.cubic)})}px`,
            }}
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  );
};
export const HookLine = Interactive.create({
  Component: HookLineInner,
  layout: 'absolute-fill',
  schema: {
    text: {type: 'string', default: '', description: 'Quote'},
    size: {type: 'number', default: 96, description: 'Font size', hiddenFromList: false},
  },
});

// Documentary subtitle on a soft dark band above the bottom bar.
const SubtitleInner = ({text}: {readonly text: string}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 128, display: 'flex', justifyContent: 'center'}}>
      <div
        dir="rtl"
        lang="ar"
        style={{
          padding: '10px 34px 14px',
          borderRadius: 14,
          backgroundColor: 'rgba(0,0,0,0.5)',
          color: '#fff',
          fontFamily: arabicFont,
          fontWeight: 700,
          fontSize: 50,
          textShadow: '0 2px 10px rgba(0,0,0,0.6)',
          opacity: interpolate(frame, [0, 4, durationInFrames - 4, durationInFrames], [0, 1, 1, 0], clamp),
          translate: `0px ${interpolate(frame, [0, 6], [12, 0], {...clamp, easing: Easing.out(Easing.cubic)})}px`,
        }}
      >
        {text}
      </div>
    </div>
  );
};
export const Subtitle = Interactive.create({
  Component: SubtitleInner,
  layout: 'absolute-fill',
  schema: {text: {type: 'string', default: '', description: 'Line'}},
});

// Name strap for the paramedic, sliding in from the right edge.
const LowerThirdInner = ({title, sub, org}: {readonly title: string; readonly sub: string; readonly org: string}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const x = interpolate(frame, [0, 12, durationInFrames - 10, durationInFrames], [520, 0, 0, 520], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <div dir="rtl" lang="ar" style={{position: 'absolute', right: 110, top: 150, translate: `${x}px 0px`, display: 'flex', alignItems: 'stretch', gap: 0}}>
      <div style={{width: 12, backgroundColor: RED, borderRadius: 3, boxShadow: `0 0 18px ${RED}`}} />
      <div style={{backgroundColor: 'rgba(0,0,0,0.6)', padding: '14px 28px', color: '#fff', fontFamily: arabicFont}}>
        <div style={{fontWeight: 900, fontSize: 46}}>{title}</div>
        <div style={{fontWeight: 700, fontSize: 32, marginTop: 2}}>{sub}</div>
        {org ? <div style={{fontWeight: 500, fontSize: 26, opacity: 0.8, marginTop: 4}}>{org}</div> : null}
      </div>
    </div>
  );
};
export const LowerThird = Interactive.create({
  Component: LowerThirdInner,
  layout: 'absolute-fill',
  schema: {
    title: {type: 'string', default: '', description: 'Name'},
    sub: {type: 'string', default: '', description: 'Role'},
    org: {type: 'string', default: '', description: 'Organization'},
  },
});

// Monitor trace: flat (with the flatline tone) until `beatAt`, then a heartbeat spike every `period` frames.
const ecgPath = (w: number, mid: number, phase: number, flatUntil: number, period: number) => {
  let d = `M0 ${mid}`;
  for (let x = 0; x <= w; x += 6) {
    const s = x / 6;
    let y = mid;
    if (s > flatUntil) {
      const k = ((s - flatUntil + phase) % period) / period;
      if (k > 0.40 && k < 0.44) y = mid - 30;
      else if (k >= 0.46 && k < 0.48) y = mid + 40;
      else if (k >= 0.48 && k < 0.51) y = mid - 170;
      else if (k >= 0.51 && k < 0.54) y = mid + 70;
      else if (k > 0.62 && k < 0.70) y = mid - 34;
    }
    d += ` L${x} ${y}`;
  }
  return d;
};

const EcgTitleInner = ({line1, line2, line3, beatAt, l2At, l3At}: {readonly line1: string; readonly line2: string; readonly line3: string; readonly beatAt: number; readonly l2At: number; readonly l3At: number}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, width} = useVideoConfig();
  const draw = interpolate(frame, [0, 24], [0, 1], clamp);
  const beating = frame >= beatAt;
  const d = ecgPath(width, 360, beating ? frame * 1.6 : 0, beating ? 0 : 9999, 70);
  const line = (txt: string, at: number, size: number, color: string) => (
    <div
      style={{
        fontSize: size,
        color,
        opacity: interpolate(frame, [at, at + 10], [0, 1], clamp),
        filter: `blur(${interpolate(frame, [at, at + 12], [14, 0], clamp)}px)`,
        translate: `0px ${interpolate(frame, [at, at + 14], [30, 0], {...clamp, easing: Easing.out(Easing.cubic)})}px`,
      }}
    >
      {txt}
    </div>
  );
  return (
    <div style={{position: 'absolute', inset: 0, opacity: interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], clamp)}}>
      <div style={{position: 'absolute', inset: 0, backgroundColor: '#000', opacity: interpolate(frame, [beatAt - 8, beatAt + 4], [1, 0], clamp)}} />
      <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0.35), rgba(0,0,0,0.85))'}} />
      <svg width={width} height={720} style={{position: 'absolute', top: 0, left: 0}}>
        <defs>
          <filter id="pulse-glow" filterUnits="userSpaceOnUse" x={0} y={0} width={width} height={720}>
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={d} fill="none" stroke={beating ? RED : '#3cff8a'} strokeWidth={6} filter="url(#pulse-glow)" pathLength={1} strokeDasharray={`${draw} 1`} />
      </svg>
      <div
        dir="rtl"
        lang="ar"
        style={{position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center', fontFamily: arabicFont, fontWeight: 900, lineHeight: 1.3, textShadow: '0 6px 30px rgba(0,0,0,0.8)'}}
      >
        {line(line1, beatAt - 6, 54, 'rgba(255,255,255,0.85)')}
        {line(line2, l2At, 92, '#fff')}
        {line(line3, l3At, 104, '#ff5a4f')}
      </div>
    </div>
  );
};
export const EcgTitle = Interactive.create({
  Component: EcgTitleInner,
  layout: 'absolute-fill',
  schema: {
    line1: {type: 'string', default: '', description: 'First line'},
    line2: {type: 'string', default: '', description: 'Second line'},
    line3: {type: 'string', default: '', description: 'Third line'},
    beatAt: {type: 'number', default: 20, description: 'Pulse starts (frame)', hiddenFromList: false},
    l2At: {type: 'number', default: 80, description: 'Second line in (frame)', hiddenFromList: false},
    l3At: {type: 'number', default: 150, description: 'Third line in (frame)', hiddenFromList: false},
  },
});

// Dispatch HUD: incoming call card with a pulsing dot and a live mini trace.
const CallHudInner = ({label, number}: {readonly label: string; readonly number: string}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <div
      dir="rtl"
      lang="ar"
      style={{
        position: 'absolute',
        left: 110,
        top: 140,
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '16px 28px',
        borderRadius: 16,
        backgroundColor: 'rgba(10,10,12,0.62)',
        border: `2px solid ${RED}`,
        boxShadow: `0 0 ${18 + 10 * Math.sin(frame / 5)}px rgba(225,37,27,0.6)`,
        color: '#fff',
        opacity: interpolate(frame, [0, 8, durationInFrames - 8, durationInFrames], [0, 1, 1, 0], clamp),
        scale: String(interpolate(frame, [0, 10], [0.8, 1], {...clamp, easing: Easing.out(Easing.back(1.6))})),
      }}
    >
      <div style={{width: 22, height: 22, borderRadius: 11, backgroundColor: RED, opacity: frame % 20 < 10 ? 1 : 0.3}} />
      <div style={{fontFamily: arabicFont, fontWeight: 800, fontSize: 40}}>{label}</div>
      <div style={{fontFamily: latinFont, fontWeight: 900, fontSize: 52, color: '#ff5a4f'}}>{number}</div>
      <svg width={150} height={50}>
        <path d={ecgPath(150, 25, frame * 2, 0, 50).replace(/-1[0-9]{2}/g, '-20')} fill="none" stroke="#3cff8a" strokeWidth={3} />
      </svg>
    </div>
  );
};
export const CallHud = Interactive.create({
  Component: CallHudInner,
  layout: 'absolute-fill',
  schema: {
    label: {type: 'string', default: '', description: 'Label'},
    number: {type: 'string', default: '997', description: 'Number'},
  },
});

// Success-rate panel: a ring that fills to `value` against a bar for the global average.
const StatPanelInner = ({value, average, caption, averageCaption}: {readonly value: number; readonly average: number; readonly caption: string; readonly averageCaption: string}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const p = interpolate(frame, [8, 60], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const shown = Math.round(value * p);
  const r = 190;
  const c = 2 * Math.PI * r;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: interpolate(frame, [0, 10, durationInFrames - 10, durationInFrames], [0, 1, 1, 0], clamp)}}>
      <div style={{position: 'absolute', inset: 0, backgroundColor: 'rgba(5,5,8,0.72)'}} />
      <div style={{position: 'absolute', left: 1120, top: 250}}>
        <svg width={460} height={460}>
          <circle cx={230} cy={230} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={26} />
          <circle
            cx={230}
            cy={230}
            r={r}
            fill="none"
            stroke={RED}
            strokeWidth={26}
            strokeLinecap="round"
            strokeDasharray={`${(c * value * p) / 100} ${c}`}
            transform="rotate(-90 230 230)"
            style={{filter: `drop-shadow(0 0 16px ${RED})`}}
          />
        </svg>
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: latinFont, fontWeight: 900, fontSize: 130}}>
          {shown}
          <span style={{fontSize: 70, marginTop: 30}}>%</span>
        </div>
      </div>
      <div dir="rtl" lang="ar" style={{position: 'absolute', right: 900, left: 230, top: 330, color: '#fff', fontFamily: arabicFont}}>
        <div style={{fontWeight: 900, fontSize: 58, lineHeight: 1.3}}>{caption}</div>
        <div style={{marginTop: 70, fontWeight: 700, fontSize: 38, opacity: 0.85}}>{averageCaption}</div>
        <div style={{marginTop: 18, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.12)', overflow: 'hidden', direction: 'ltr'}}>
          <div
            style={{
              height: '100%',
              width: `${average * interpolate(frame, [20, 60], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)})}%`,
              backgroundColor: 'rgba(255,255,255,0.75)',
              borderRadius: 15,
            }}
          />
        </div>
        <div style={{marginTop: 10, fontFamily: latinFont, fontWeight: 800, fontSize: 40, opacity: interpolate(frame, [40, 55], [0, 0.9], clamp)}}>{average}%</div>
      </div>
    </div>
  );
};
export const StatPanel = Interactive.create({
  Component: StatPanelInner,
  layout: 'absolute-fill',
  schema: {
    value: {type: 'number', default: 55, description: 'Success rate', hiddenFromList: false},
    average: {type: 'number', default: 30, description: 'Global average', hiddenFromList: false},
    caption: {type: 'string', default: '', description: 'Caption'},
    averageCaption: {type: 'string', default: '', description: 'Average caption'},
  },
});

// Closing card: the SRCA seal, the line, and 997.
const EndCardInner = ({org, line}: {readonly org: string; readonly line: string}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const rise = (at: number) => ({
    opacity: interpolate(frame, [at, at + 12], [0, 1], clamp),
    translate: `0px ${interpolate(frame, [at, at + 16], [30, 0], {...clamp, easing: Easing.out(Easing.cubic)})}px`,
  });
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 45%, #b01510 0%, #6d0a08 55%, #1a0202 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        opacity: interpolate(frame, [0, 12, durationInFrames - 1, durationInFrames], [0, 1, 1, 1], clamp),
      }}
    >
      <Img src={staticFile('cc/logo-bug.png')} style={{width: 210, height: 210, ...rise(4)}} />
      <div dir="rtl" lang="ar" style={{fontFamily: arabicFont, fontWeight: 900, fontSize: 64, marginTop: 26, ...rise(12)}}>
        {org}
      </div>
      <div dir="rtl" lang="ar" style={{fontFamily: arabicFont, fontWeight: 500, fontSize: 44, marginTop: 12, ...rise(22)}}>
        {line}
      </div>
      <div
        style={{
          fontFamily: latinFont,
          fontWeight: 900,
          fontSize: 150,
          marginTop: 20,
          textShadow: '0 0 40px rgba(255,90,79,0.9)',
          opacity: interpolate(frame, [32, 40], [0, 1], clamp),
          scale: String(interpolate(frame, [32, 46], [1.4, 1], {...clamp, easing: Easing.out(Easing.back(2))})),
        }}
      >
        997
      </div>
    </div>
  );
};
export const EndCard = Interactive.create({
  Component: EndCardInner,
  layout: 'absolute-fill',
  schema: {
    org: {type: 'string', default: '', description: 'Organization'},
    line: {type: 'string', default: '', description: 'Line'},
  },
});
