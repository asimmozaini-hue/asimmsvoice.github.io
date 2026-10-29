import {Easing, Interactive, interpolate, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {Photo} from './Photo';
import {fontFamily, PAPER, RED} from './theme';

const Caption = ({step, title, subtitle}: {readonly step: string; readonly title: string; readonly subtitle: string}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div
      dir="rtl"
      lang="ar"
      style={{
        position: 'absolute',
        right: 80,
        left: 80,
        bottom: 220,
        fontFamily,
        color: PAPER,
        opacity: interpolate(frame, [0.3 * fps, 1 * fps], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }),
        translate: interpolate(frame, [0.3 * fps, 1.1 * fps], ['0px 60px', '0px 0px'], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <div
        style={{
          display: 'inline-block',
          background: RED,
          padding: '8px 28px',
          borderRadius: 14,
          fontSize: 40,
          fontWeight: 800,
          marginBottom: 24,
        }}
      >
        {step}
      </div>
      <div style={{fontSize: 92, fontWeight: 800, lineHeight: 1.2, textShadow: '0 4px 24px rgba(0,0,0,0.5)'}}>{title}</div>
      <div
        style={{
          fontSize: 48,
          fontWeight: 500,
          lineHeight: 1.5,
          marginTop: 20,
          opacity: interpolate(frame, [1 * fps, 1.8 * fps], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

const VisitSceneInner = ({
  step,
  title,
  subtitle,
  photo1,
  photo2,
}: {
  readonly step: string;
  readonly title: string;
  readonly subtitle: string;
  readonly photo1: string;
  readonly photo2: string;
}) => {
  const {durationInFrames} = useVideoConfig();
  const half = Math.floor(durationInFrames / 2);

  return (
    <>
      <Sequence name="Photo 1" durationInFrames={photo2 ? half : durationInFrames}>
        <Photo src={photo1} label={`${title} (1)`} />
      </Sequence>
      {photo2 ? (
        <Sequence name="Photo 2" from={half}>
          <Photo src={photo2} label={`${title} (2)`} />
        </Sequence>
      ) : null}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 70%)',
        }}
      />
      <Caption step={step} title={title} subtitle={subtitle} />
    </>
  );
};

export const VisitScene = Interactive.create({
  Component: VisitSceneInner,
  layout: 'absolute-fill',
  schema: {
    ...Interactive.backgroundSchema,
    step: {type: 'string', default: '', description: 'Step label'},
    title: {type: 'string', default: '', description: 'Title'},
    subtitle: {type: 'string', default: '', description: 'Subtitle'},
    photo1: {type: 'asset', assetType: 'image', default: '', description: 'First photo'},
    photo2: {type: 'asset', assetType: 'image', default: '', description: 'Second photo'},
  },
});
