import {Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily as bodyFont} from '../theme';
import {GOLD} from './theme';

// The portrait in a gold ring above the dancers, swaying gently with the rhythm.
const FaceBadgeInner = ({caption}: {readonly caption: string}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  return (
    <div
      style={{
        position: 'absolute',
        top: 190,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: interpolate(frame, [durationInFrames - 0.5 * fps, durationInFrames], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
        scale: interpolate(frame, [0, 0.8 * fps], [0.6, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.spring({damping: 14}),
          output: 'perceptual-scale',
        }),
        rotate: `${Math.sin((frame / fps) * Math.PI * 1.1) * 2.5}deg`,
      }}
    >
      <div
        style={{
          width: 420,
          height: 420,
          borderRadius: '50%',
          padding: 12,
          background: `linear-gradient(135deg, #F6E3A8, ${GOLD} 45%, #8C6420)`,
          boxShadow: '0 18px 60px rgba(0,0,0,0.55), 0 0 40px rgba(217,180,90,0.45)',
        }}
      >
        <Img
          src={staticFile('zeer/face.jpg')}
          style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '6px solid #2A1A0C'}}
        />
      </div>
      {caption ? (
        <div
          dir="rtl"
          lang="ar"
          style={{
            marginTop: 26,
            padding: '10px 36px',
            borderRadius: 40,
            background: 'rgba(42,26,12,0.8)',
            border: `2px solid ${GOLD}`,
            color: '#FFF6E5',
            fontFamily: bodyFont,
            fontWeight: 800,
            fontSize: 48,
          }}
        >
          {caption}
        </div>
      ) : null}
    </div>
  );
};

export const FaceBadge = Interactive.create({
  Component: FaceBadgeInner,
  layout: 'absolute-fill',
  schema: {
    caption: {type: 'string', default: '', description: 'Name under the portrait'},
  },
});
