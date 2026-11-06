import {Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily as bodyFont} from '../theme';
import {DEEP, GOLD, titleFont} from './theme';

// Full-screen portrait cutaway that fades over the dance footage.
const PortraitCardInner = ({title, subtitle}: {readonly title: string; readonly subtitle: string}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: interpolate(
          frame,
          [0, 0.5 * fps, durationInFrames - 0.5 * fps, durationInFrames],
          [0, 1, 1, 0],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
        ),
      }}
    >
      <Img
        src={staticFile('zeer/portrait.jpg')}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '50% 30%',
          scale: interpolate(frame, [0, durationInFrames], [1.02, 1.12], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.33, 0, 0.67, 1),
          }),
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 35%, rgba(0,0,0,0) 45%, ${DEEP}cc 100%), linear-gradient(to top, ${DEEP}f0 0%, ${DEEP}66 30%, rgba(0,0,0,0) 50%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 28,
          border: `3px solid ${GOLD}aa`,
          borderRadius: 28,
        }}
      />
      {title ? (
        <div
          dir="rtl"
          lang="ar"
          style={{
            position: 'absolute',
            left: 80,
            right: 80,
            bottom: 230,
            textAlign: 'center',
            opacity: interpolate(frame, [0.4 * fps, 1.2 * fps], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
            translate: interpolate(frame, [0.4 * fps, 1.3 * fps], ['0px 40px', '0px 0px'], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          <div style={{fontFamily: titleFont, fontWeight: 700, fontSize: 130, color: GOLD, textShadow: '0 6px 30px rgba(0,0,0,0.6)'}}>
            {title}
          </div>
          <div style={{fontFamily: bodyFont, fontWeight: 500, fontSize: 50, color: '#FFF6E5', marginTop: 10}}>
            {subtitle}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export const PortraitCard = Interactive.create({
  Component: PortraitCardInner,
  layout: 'absolute-fill',
  schema: {
    title: {type: 'string', default: '', description: 'Title'},
    subtitle: {type: 'string', default: '', description: 'Subtitle'},
  },
});
