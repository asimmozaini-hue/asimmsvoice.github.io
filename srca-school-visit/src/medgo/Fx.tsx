import { lightLeak } from "@remotion/effects/light-leak";
import {
  Interactive,
  interpolate,
  Solid,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const FlashInner = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#fff",
        opacity: interpolate(frame, [0, durationInFrames], [0.9, 0], clamp),
      }}
    />
  );
};

export const Flash = Interactive.create({
  Component: FlashInner,
  layout: "absolute-fill",
  schema: {},
});

const LeakInner = ({
  seed,
  hueShift,
}: {
  readonly seed: number;
  readonly hueShift: number;
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  return (
    <Solid
      width={width}
      height={height}
      style={{ mixBlendMode: "screen", opacity: 0.5 }}
      effects={[
        lightLeak({
          seed,
          hueShift,
          progress: interpolate(
            frame,
            [0, durationInFrames - 1],
            [0, 1],
            clamp,
          ),
        }),
      ]}
    />
  );
};

export const Leak = Interactive.create({
  Component: LeakInner,
  layout: "absolute-fill",
  schema: {
    seed: {
      type: "number",
      default: 0,
      description: "Pattern seed",
      hiddenFromList: false,
    },
    hueShift: {
      type: "number",
      default: 0,
      description: "Hue shift (deg)",
      hiddenFromList: false,
    },
  },
});
