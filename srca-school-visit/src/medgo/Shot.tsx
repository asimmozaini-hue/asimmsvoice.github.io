import { Video } from "@remotion/media";
import {
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type Motion = "push" | "pull" | "punch" | "whip-left" | "whip-right" | "drift";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// One clip of the film: graded footage with a camera move. Punch and whip moves open with a blur burst.
const ShotInner = ({
  src,
  trim,
  rate,
  motion,
}: {
  readonly src: string;
  readonly trim: number;
  readonly rate: number;
  readonly motion: Motion;
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / Math.max(1, durationInFrames - 1);

  const burst = motion === "punch" || motion.startsWith("whip") ? 7 : 0;
  const blurPx = burst
    ? interpolate(frame, [0, burst], [18, 0], {
        ...clamp,
        easing: Easing.out(Easing.cubic),
      })
    : 0;

  let scale = 1;
  let x = 0;
  if (motion === "push") scale = interpolate(t, [0, 1], [1.02, 1.11]);
  if (motion === "pull") scale = interpolate(t, [0, 1], [1.13, 1.02]);
  if (motion === "drift") {
    scale = 1.08;
    x = interpolate(t, [0, 1], [-30, 30]);
  }
  if (motion === "punch") {
    scale = interpolate(
      frame,
      [0, burst, durationInFrames],
      [1.28, 1.06, 1.0],
      { ...clamp, easing: Easing.out(Easing.cubic) },
    );
  }
  if (motion.startsWith("whip")) {
    const dir = motion === "whip-left" ? -1 : 1;
    x = interpolate(frame, [0, burst], [dir * 420, 0], {
      ...clamp,
      easing: Easing.out(Easing.cubic),
    });
    scale = interpolate(t, [0, 1], [1.08, 1.02]);
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        backgroundColor: "#000",
        filter: blurPx > 0.1 ? `blur(${blurPx}px)` : undefined,
      }}
    >
      <Video
        src={staticFile(src)}
        muted
        trimBefore={Math.round(trim * fps)}
        playbackRate={rate}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: String(scale),
          translate: `${x}px 0px`,
        }}
      />
    </div>
  );
};

export const Shot = Interactive.create({
  Component: ShotInner,
  layout: "absolute-fill",
  schema: {
    src: {
      type: "asset",
      assetType: "video",
      default: "",
      description: "Clip",
    },
    trim: {
      type: "number",
      default: 0,
      description: "Source in-point (seconds)",
      hiddenFromList: false,
    },
    rate: {
      type: "number",
      default: 1,
      description: "Playback rate",
      hiddenFromList: false,
    },
    motion: {
      type: "enum",
      default: "push",
      description: "Camera move",
      variants: {
        push: {},
        pull: {},
        punch: {},
        "whip-left": {},
        "whip-right": {},
        drift: {},
      },
    },
  },
});
