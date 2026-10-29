import {Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily, RED} from './theme';

// Slow Ken Burns zoom on a photo from public/photos, or a placeholder until one is added.
export const Photo = ({src, label}: {readonly src: string; readonly label: string}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  if (!src) {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(160deg, #3a3f46, #22262b)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
          color: 'rgba(255,255,255,0.75)',
          fontFamily,
          fontSize: 44,
        }}
        dir="rtl"
      >
        <div style={{width: 160, height: 120, border: `6px solid ${RED}`, borderRadius: 24}} />
        <div>صورة: {label}</div>
      </div>
    );
  }

  return (
    <Img
      src={staticFile(src)}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        scale: interpolate(frame, [0, durationInFrames], [1.04, 1.16], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.33, 0, 0.67, 1),
        }),
      }}
    />
  );
};
