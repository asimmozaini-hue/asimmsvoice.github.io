import {Video} from '@remotion/media';
import {Easing, Freeze, Interactive, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Certificate moment: the clip plays, then freezes into a white-framed photo with a flash.
const PhotoSnapInner = ({src, trim, snapAt, tilt}: {readonly src: string; readonly trim: number; readonly snapAt: number; readonly tilt: number}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const snapFrame = Math.round(snapAt * fps);
  const snapped = frame >= snapFrame;
  const k = frame - snapFrame;
  const video = <Video src={staticFile(src)} muted trimBefore={Math.round(trim * fps)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />;

  return (
    <div style={{position: 'absolute', inset: 0, backgroundColor: '#111', overflow: 'hidden'}}>
      {snapped ? (
        <>
          <div style={{position: 'absolute', inset: 0, filter: 'blur(28px) brightness(0.45)', scale: '1.2'}}>
            <Freeze frame={snapFrame}>{video}</Freeze>
          </div>
          <div
            style={{
              position: 'absolute',
              left: 90,
              right: 90,
              top: 210,
              bottom: 330,
              backgroundColor: '#fff',
              padding: 22,
              paddingBottom: 110,
              boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
              rotate: `${interpolate(k, [0, 10], [0, tilt], {...clamp, easing: Easing.out(Easing.cubic)})}deg`,
              scale: String(interpolate(k, [0, 10], [1.25, 1], {...clamp, easing: Easing.out(Easing.cubic)})),
            }}
          >
            <div style={{width: '100%', height: '100%', overflow: 'hidden'}}>
              <Freeze frame={snapFrame}>{video}</Freeze>
            </div>
          </div>
        </>
      ) : (
        video
      )}
      <div style={{position: 'absolute', inset: 0, backgroundColor: '#fff', opacity: snapped ? interpolate(k, [0, 6], [1, 0], clamp) : 0}} />
    </div>
  );
};

export const PhotoSnap = Interactive.create({
  Component: PhotoSnapInner,
  layout: 'absolute-fill',
  schema: {
    src: {type: 'asset', assetType: 'video', default: '', description: 'Clip'},
    trim: {type: 'number', default: 0, description: 'Source in-point (seconds)', hiddenFromList: false},
    snapAt: {type: 'number', default: 1, description: 'Freeze after (seconds)', hiddenFromList: false},
    tilt: {type: 'number', default: -3, description: 'Photo tilt (deg)', hiddenFromList: false},
  },
});
