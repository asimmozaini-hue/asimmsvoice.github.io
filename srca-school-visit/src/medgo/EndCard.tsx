import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { arabicFont, DEEP_RED, latinFont, RED } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const EndCardInner = ({
  org,
  slogan,
  footer,
}: {
  readonly org: string;
  readonly slogan: string;
  readonly footer: string;
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const rise = (start: number) => ({
    opacity: interpolate(frame, [start, start + 12], [0, 1], clamp),
    translate: `0px ${interpolate(frame, [start, start + 16], [40, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}px`,
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse at 50% 40%, rgba(225,37,27,0.55), ${DEEP_RED}ee 55%, #120202 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#fff",
        padding: "0 90px",
        opacity: interpolate(
          frame,
          [0, 14, durationInFrames - 20, durationInFrames],
          [0, 1, 1, 0],
          clamp,
        ),
      }}
    >
      <div
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: arabicFont,
          fontWeight: 900,
          fontSize: 82,
          lineHeight: 1.3,
          ...rise(4),
        }}
      >
        {org}
      </div>
      <div
        style={{
          height: 8,
          width: interpolate(frame, [14, 32], [0, 300], clamp),
          backgroundColor: "#fff",
          borderRadius: 4,
          margin: "34px 0",
        }}
      />
      <div
        dir="rtl"
        lang="ar"
        style={{
          fontFamily: arabicFont,
          fontWeight: 500,
          fontSize: 62,
          ...rise(18),
        }}
      >
        {slogan}
      </div>
      <div
        style={{
          fontFamily: latinFont,
          fontWeight: 900,
          fontSize: 210,
          marginTop: 40,
          color: "#fff",
          textShadow: `0 0 50px ${RED}`,
          scale: String(
            interpolate(frame, [30, 44], [1.4, 1], {
              ...clamp,
              easing: Easing.out(Easing.back(2)),
            }),
          ),
          opacity: interpolate(frame, [30, 38], [0, 1], clamp),
        }}
      >
        997
      </div>
      <div
        style={{
          fontFamily: latinFont,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: 5,
          marginTop: 30,
          color: "#FFD9D4",
          ...rise(44),
        }}
      >
        {footer}
      </div>
    </div>
  );
};

export const EndCard = Interactive.create({
  Component: EndCardInner,
  layout: "absolute-fill",
  schema: {
    org: { type: "string", default: "", description: "Organization" },
    slogan: { type: "string", default: "", description: "Slogan" },
    footer: { type: "string", default: "", description: "Footer" },
  },
});
