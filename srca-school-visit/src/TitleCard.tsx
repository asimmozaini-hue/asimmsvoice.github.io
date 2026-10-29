import {Easing, Interactive, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {fontFamily, PAPER} from './theme';

const TitleCardInner = ({
  kicker,
  title,
  subtitle,
  footer,
}: {
  readonly kicker: string;
  readonly title: string;
  readonly subtitle: string;
  readonly footer: string;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div
      dir="rtl"
      lang="ar"
      style={{
        position: 'absolute',
        inset: 0,
        padding: '0 80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontFamily,
        color: PAPER,
      }}
    >
      <div
        style={{
          fontSize: 52,
          fontWeight: 500,
          opacity: interpolate(frame, [0.2 * fps, 0.9 * fps], [0, 0.9], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          fontSize: 124,
          fontWeight: 800,
          lineHeight: 1.2,
          margin: '28px 0',
          scale: interpolate(frame, [0.4 * fps, 1.3 * fps], [0.85, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.spring({damping: 200}),
            output: 'perceptual-scale',
          }),
          opacity: interpolate(frame, [0.4 * fps, 1 * fps], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        {title}
      </div>
      <div
        style={{
          width: interpolate(frame, [1 * fps, 1.6 * fps], [0, 240], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          height: 10,
          borderRadius: 5,
          background: PAPER,
          marginBottom: 36,
        }}
      />
      <div
        style={{
          fontSize: 56,
          fontWeight: 500,
          lineHeight: 1.5,
          opacity: interpolate(frame, [1.3 * fps, 2 * fps], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        {subtitle}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 160,
          fontSize: 44,
          fontWeight: 800,
          opacity: interpolate(frame, [1.8 * fps, 2.5 * fps], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        {footer}
      </div>
    </div>
  );
};

export const TitleCard = Interactive.create({
  Component: TitleCardInner,
  layout: 'absolute-fill',
  schema: {
    ...Interactive.backgroundSchema,
    kicker: {type: 'string', default: '', description: 'Kicker'},
    title: {type: 'string', default: '', description: 'Title'},
    subtitle: {type: 'string', default: '', description: 'Subtitle'},
    footer: {type: 'string', default: '', description: 'Footer'},
  },
});
