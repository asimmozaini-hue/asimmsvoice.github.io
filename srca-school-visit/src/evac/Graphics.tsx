import {Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {arabicFont, latinFont} from '../medgo/theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
// Colours taken from the authority's evacuation plan.
export const NAVY = '#161A45';
export const TEAL = '#2B8A90';
export const RED = '#D7262E';
export const GREEN = '#148A3B';

const fadeInOut = (frame: number, dur: number, a = 6, b = 6) => interpolate(frame, [0, a, dur - b, dur], [0, 1, 1, 0], clamp);

// The SRCA crescent in the corner for the whole film.
const LogoBugInner = () => {
  const frame = useCurrentFrame();
  return (
    <Img
      src={staticFile('evac/logo.png')}
      style={{position: 'absolute', right: 60, top: 70, width: 110, opacity: interpolate(frame, [0, 15], [0, 0.95], clamp), filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.5))'}}
    />
  );
};
export const LogoBug = Interactive.create({Component: LogoBugInner, layout: 'absolute-fill', schema: {}});

// Typed timecode and place, like a mission HUD.
const HudStampInner = ({time, place}: {readonly time: string; readonly place: string}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const shown = Math.min(time.length, Math.floor(frame / 2));
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 820, textAlign: 'center', color: '#fff', opacity: fadeInOut(frame, durationInFrames, 2, 8)}}>
      <div style={{fontFamily: latinFont, fontWeight: 900, fontSize: 120, letterSpacing: 8, textShadow: `0 0 30px ${TEAL}`}}>
        {time.slice(0, shown)}
        <span style={{opacity: frame % 16 < 8 ? 1 : 0, color: TEAL}}>_</span>
      </div>
      <div dir="rtl" lang="ar" style={{fontFamily: arabicFont, fontWeight: 700, fontSize: 46, marginTop: 10, opacity: interpolate(frame, [16, 26], [0, 0.9], clamp)}}>
        {place}
      </div>
    </div>
  );
};
export const HudStamp = Interactive.create({
  Component: HudStampInner,
  layout: 'absolute-fill',
  schema: {
    time: {type: 'string', default: '', description: 'Timecode'},
    place: {type: 'string', default: '', description: 'Place'},
  },
});

// Hazard band with a flashing alert line.
const AlertBannerInner = ({text}: {readonly text: string}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const on = frame % 14 < 9;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 860, opacity: fadeInOut(frame, durationInFrames, 4, 8), scale: String(interpolate(frame, [0, 6], [1.3, 1], clamp))}}>
      <div
        style={{
          height: 24,
          background: `repeating-linear-gradient(-45deg, ${RED} 0 26px, #111 26px 52px)`,
          backgroundPositionX: frame * 3,
        }}
      />
      <div
        dir="rtl"
        lang="ar"
        style={{
          backgroundColor: on ? RED : NAVY,
          color: '#fff',
          textAlign: 'center',
          padding: '18px 0 22px',
          fontFamily: arabicFont,
          fontWeight: 900,
          fontSize: 86,
          boxShadow: on ? `0 0 50px ${RED}` : 'none',
        }}
      >
        {text}
      </div>
      <div style={{height: 24, background: `repeating-linear-gradient(45deg, ${RED} 0 26px, #111 26px 52px)`, backgroundPositionX: -frame * 3}} />
    </div>
  );
};
export const AlertBanner = Interactive.create({
  Component: AlertBannerInner,
  layout: 'absolute-fill',
  schema: {text: {type: 'string', default: '', description: 'Alert'}},
});

// Branded title over footage: navy wash, logo, the drill name and place.
const TitleCardInner = ({title, sub}: {readonly title: string; readonly sub: string}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const rise = (at: number) => ({
    opacity: interpolate(frame, [at, at + 10], [0, 1], clamp),
    translate: `0px ${interpolate(frame, [at, at + 14], [40, 0], {...clamp, easing: Easing.out(Easing.cubic)})}px`,
  });
  return (
    <div style={{position: 'absolute', inset: 0, opacity: interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], clamp)}}>
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${NAVY}cc 0%, ${NAVY}99 45%, ${NAVY}ee 100%)`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#fff', textAlign: 'center'}}>
        <Img src={staticFile('evac/logo.png')} style={{width: 190, ...rise(0)}} />
        <Img src={staticFile('evac/name.png')} style={{width: 640, marginTop: 30, ...rise(5)}} />
        <div style={{width: interpolate(frame, [10, 26], [0, 420], {...clamp, easing: Easing.out(Easing.cubic)}), height: 8, borderRadius: 4, backgroundColor: TEAL, margin: '44px 0', boxShadow: `0 0 20px ${TEAL}`}} />
        <div dir="rtl" lang="ar" style={{fontFamily: arabicFont, fontWeight: 900, fontSize: 150, lineHeight: 1.1, scale: String(interpolate(frame, [12, 22], [1.4, 1], {...clamp, easing: Easing.out(Easing.cubic)})), opacity: interpolate(frame, [12, 16], [0, 1], clamp)}}>
          {title}
        </div>
        <div dir="rtl" lang="ar" style={{fontFamily: arabicFont, fontWeight: 700, fontSize: 50, marginTop: 24, padding: '0 80px', lineHeight: 1.4, ...rise(20)}}>
          {sub}
        </div>
      </div>
    </div>
  );
};
export const TitleCard = Interactive.create({
  Component: TitleCardInner,
  layout: 'absolute-fill',
  schema: {
    title: {type: 'string', default: '', description: 'Title'},
    sub: {type: 'string', default: '', description: 'Subtitle'},
  },
});

// Announcement caption styled like a PA readout: speaker icon, live level bars, teal strip.
const PaCaptionInner = ({text}: {readonly text: string}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <div style={{position: 'absolute', left: 60, right: 60, bottom: 230, display: 'flex', justifyContent: 'center', opacity: fadeInOut(frame, durationInFrames, 4, 4)}}>
      <div
        dir="rtl"
        lang="ar"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '18px 30px',
          borderRadius: 18,
          backgroundColor: `${NAVY}e6`,
          borderRight: `10px solid ${TEAL}`,
          color: '#fff',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          translate: `0px ${interpolate(frame, [0, 6], [16, 0], {...clamp, easing: Easing.out(Easing.cubic)})}px`,
        }}
      >
        <svg width={56} height={56} viewBox="0 0 24 24">
          <path d="M3 9v6h4l5 4V5L7 9H3z" fill={TEAL} />
          <path d="M15.5 8.5a5 5 0 010 7M18 6a8.5 8.5 0 010 12" stroke="#fff" strokeWidth={1.8} fill="none" strokeLinecap="round" opacity={0.6 + 0.4 * Math.sin(frame / 3)} />
        </svg>
        <div style={{fontFamily: arabicFont, fontWeight: 800, fontSize: 52, lineHeight: 1.35}}>{text}</div>
        <div style={{display: 'flex', gap: 5, alignItems: 'center', height: 50}}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{width: 7, borderRadius: 4, backgroundColor: TEAL, height: 12 + 34 * Math.abs(Math.sin(frame / 2.6 + i * 1.3))}} />
          ))}
        </div>
      </div>
    </div>
  );
};
export const PaCaption = Interactive.create({
  Component: PaCaptionInner,
  layout: 'absolute-fill',
  schema: {text: {type: 'string', default: '', description: 'Announcement line'}},
});

// The ground-floor plan in a card, pushing in towards "you are here" with a pulsing pin.
const PlanCardInner = ({title}: {readonly title: string}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const z = interpolate(frame, [0, durationInFrames], [1, 1.35], {...clamp, easing: Easing.inOut(Easing.cubic)});
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: 300,
        borderRadius: 26,
        overflow: 'hidden',
        backgroundColor: '#fff',
        boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
        opacity: fadeInOut(frame, durationInFrames, 8, 8),
        scale: String(interpolate(frame, [0, 10], [0.85, 1], {...clamp, easing: Easing.out(Easing.back(1.4))})),
      }}
    >
      <div dir="rtl" lang="ar" style={{backgroundColor: TEAL, color: '#fff', fontFamily: arabicFont, fontWeight: 900, fontSize: 46, padding: '14px 30px'}}>
        {title}
      </div>
      <div style={{position: 'relative', height: 760, overflow: 'hidden'}}>
        <Img src={staticFile('evac/plan.png')} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', scale: String(z), transformOrigin: '61% 18%'}} />
      </div>
    </div>
  );
};
export const PlanCard = Interactive.create({
  Component: PlanCardInner,
  layout: 'absolute-fill',
  schema: {title: {type: 'string', default: '', description: 'Title'}},
});

// Numbered instruction chip in the plan's style.
const StepTagInner = ({num, text, warn}: {readonly num: string; readonly text: string; readonly warn: string}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', opacity: fadeInOut(frame, durationInFrames, 6, 6)}}>
      <div
        dir="rtl"
        lang="ar"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '16px 34px 16px 22px',
          borderRadius: 60,
          backgroundColor: '#fff',
          boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
          translate: `${interpolate(frame, [0, 10], [700, 0], {...clamp, easing: Easing.out(Easing.cubic)})}px 0px`,
        }}
      >
        <div style={{width: 74, height: 74, borderRadius: 37, backgroundColor: warn ? RED : NAVY, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: arabicFont, fontWeight: 900, fontSize: 46}}>
          {num}
        </div>
        <div style={{fontFamily: arabicFont, fontWeight: 900, fontSize: 52, color: NAVY}}>
          {text} {warn ? <span style={{color: RED}}>{warn}</span> : null}
        </div>
      </div>
    </div>
  );
};
export const StepTag = Interactive.create({
  Component: StepTagInner,
  layout: 'absolute-fill',
  schema: {
    num: {type: 'string', default: '', description: 'Number'},
    text: {type: 'string', default: '', description: 'Instruction'},
    warn: {type: 'string', default: '', description: 'Red warning'},
  },
});

// Closing card in the plan's identity.
const EndCardInner = ({region}: {readonly region: string}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const rise = (at: number) => ({
    opacity: interpolate(frame, [at, at + 12], [0, 1], clamp),
    translate: `0px ${interpolate(frame, [at, at + 16], [40, 0], {...clamp, easing: Easing.out(Easing.cubic)})}px`,
  });
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(ellipse at 50% 40%, #252a6b 0%, ${NAVY} 60%, #0b0d26 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        textAlign: 'center',
        opacity: interpolate(frame, [0, 12, durationInFrames - 15, durationInFrames], [0, 1, 1, 0], clamp),
      }}
    >
      <Img src={staticFile('evac/logo.png')} style={{width: 230, ...rise(2)}} />
      <Img src={staticFile('evac/name.png')} style={{width: 760, marginTop: 34, ...rise(8)}} />
      <div dir="rtl" lang="ar" style={{fontFamily: arabicFont, fontWeight: 500, fontSize: 44, marginTop: 22, ...rise(14)}}>
        {region}
      </div>
      <div dir="rtl" lang="ar" style={{fontFamily: arabicFont, fontWeight: 900, fontSize: 80, marginTop: 110, ...rise(24)}}>
        السلامة <span style={{color: '#47c1c8'}}>مسؤولية الجميع</span>
      </div>
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 14, display: 'flex'}}>
        <div style={{flex: 1, backgroundColor: TEAL}} />
        <div style={{flex: 1, backgroundColor: GREEN}} />
        <div style={{flex: 1, backgroundColor: RED}} />
      </div>
    </div>
  );
};
export const EndCard = Interactive.create({
  Component: EndCardInner,
  layout: 'absolute-fill',
  schema: {region: {type: 'string', default: '', description: 'Region'}},
});
