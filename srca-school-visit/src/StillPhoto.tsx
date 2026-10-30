import {Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

// A photo with a slow zoom. "contain" keeps the whole picture over a blurred fill, for wide group shots.
const StillPhotoInner = ({src, fit}: {readonly src: string; readonly fit: 'cover' | 'contain'}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.08], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.33, 0, 0.67, 1),
  });

  return (
    <>
      {fit === 'contain' ? (
        <Img
          src={staticFile(src)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(40px) brightness(0.6)',
            scale: 1.2,
          }}
        />
      ) : null}
      <Img
        src={staticFile(src)}
        style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: fit, scale: zoom}}
      />
    </>
  );
};

export const StillPhoto = Interactive.create({
  Component: StillPhotoInner,
  layout: 'absolute-fill',
  schema: {
    src: {type: 'asset', assetType: 'image', default: '', description: 'Photo'},
  },
});
