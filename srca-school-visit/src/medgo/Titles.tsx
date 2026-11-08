import {
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { arabicFont, latinFont, RED } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Words rise out of a blur one after another; the whole block fades before the cut.
const Words = ({
  text,
  delay,
  size,
  weight,
}: {
  readonly text: string;
  readonly delay: number;
  readonly size: number;
  readonly weight: number;
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      dir="rtl"
      lang="ar"
      style={{
        fontFamily: arabicFont,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.3,
      }}
    >
      {text.split(" ").map((w, i) => {
        const start = delay + i * 3;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginLeft: size * 0.22,
              opacity: interpolate(frame, [start, start + 8], [0, 1], clamp),
              filter: `blur(${interpolate(frame, [start, start + 10], [14, 0], clamp)}px)`,
              translate: `0px ${interpolate(frame, [start, start + 12], [size * 0.5, 0], { ...clamp, easing: Easing.out(Easing.cubic) })}px`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

const TitleInner = ({
  kicker,
  headline,
  sub,
  position,
}: {
  readonly kicker: string;
  readonly headline: string;
  readonly sub: string;
  readonly position: "center" | "lower";
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const headWords = headline.split(" ").length;

  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            position === "center"
              ? "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0) 70%)"
              : "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 28%, rgba(0,0,0,0) 48%)",
          opacity: interpolate(
            frame,
            [0, 8, durationInFrames - 8, durationInFrames],
            [0, 1, 1, 0],
            clamp,
          ),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          ...(position === "center"
            ? { top: 0, bottom: 0, justifyContent: "center" }
            : { bottom: 300 }),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          color: "#fff",
          textShadow: "0 6px 28px rgba(0,0,0,0.75)",
          opacity: interpolate(
            frame,
            [durationInFrames - 8, durationInFrames],
            [1, 0],
            clamp,
          ),
        }}
      >
        {kicker ? (
          <div style={{ color: "#FFD9D4", marginBottom: 14 }}>
            <Words text={kicker} delay={0} size={46} weight={800} />
          </div>
        ) : null}
        <Words
          text={headline}
          delay={kicker ? 6 : 0}
          size={headline.length > 18 ? 88 : 104}
          weight={900}
        />
        <div
          style={{
            height: 9,
            borderRadius: 5,
            margin: "26px 0 22px",
            backgroundColor: RED,
            boxShadow: `0 0 24px ${RED}`,
            width: interpolate(frame, [10, 26], [0, 260], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            }),
          }}
        />
        {sub ? (
          <Words
            text={sub}
            delay={(kicker ? 6 : 0) + headWords * 3 + 6}
            size={50}
            weight={500}
          />
        ) : null}
      </div>
    </>
  );
};

export const Title = Interactive.create({
  Component: TitleInner,
  layout: "absolute-fill",
  schema: {
    kicker: { type: "string", default: "", description: "Kicker" },
    headline: { type: "string", default: "", description: "Headline" },
    sub: { type: "string", default: "", description: "Subline" },
    position: {
      type: "enum",
      default: "lower",
      description: "Placement",
      variants: { center: {}, lower: {} },
    },
  },
});

// The congress mark: letters close in from wide tracking with a red "5".
const MedgoMarkInner = ({
  line1,
  line2,
}: {
  readonly line1: string;
  readonly line2: string;
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        textAlign: "center",
        textShadow: "0 8px 40px rgba(0,0,0,0.8)",
        background:
          "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 75%)",
        opacity: interpolate(
          frame,
          [durationInFrames - 10, durationInFrames],
          [1, 0],
          clamp,
        ),
      }}
    >
      <div
        style={{
          fontFamily: latinFont,
          fontWeight: 900,
          fontSize: 190,
          letterSpacing: interpolate(frame, [0, 40], [60, 6], {
            ...clamp,
            easing: Easing.out(Easing.cubic),
          }),
          opacity: interpolate(frame, [0, 10], [0, 1], clamp),
          filter: `blur(${interpolate(frame, [0, 14], [20, 0], clamp)}px)`,
        }}
      >
        MEDGO<span style={{ color: RED }}> 5</span>
      </div>
      <div
        style={{
          padding: "0 90px",
          marginTop: 20,
          opacity: interpolate(frame, [18, 30], [0, 1], clamp),
        }}
      >
        <div
          dir="rtl"
          lang="ar"
          style={{
            fontFamily: arabicFont,
            fontWeight: 800,
            fontSize: 54,
            lineHeight: 1.45,
          }}
        >
          {line1}
        </div>
        <div
          style={{
            fontFamily: latinFont,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: 4,
            marginTop: 18,
            color: "#FFD9D4",
          }}
        >
          {line2}
        </div>
      </div>
    </div>
  );
};

export const MedgoMark = Interactive.create({
  Component: MedgoMarkInner,
  layout: "absolute-fill",
  schema: {
    line1: { type: "string", default: "", description: "Arabic congress name" },
    line2: { type: "string", default: "", description: "Date and venue" },
  },
});

// Small broadcast-style tag in the top corner.
const CornerTagInner = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top: 110,
        left: 70,
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontFamily: latinFont,
        fontWeight: 800,
        fontSize: 26,
        letterSpacing: 4,
        color: "#fff",
        opacity: interpolate(
          frame,
          [0, 15, durationInFrames - 15, durationInFrames],
          [0, 0.9, 0.9, 0],
          clamp,
        ),
        textShadow: "0 2px 10px rgba(0,0,0,0.7)",
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: RED,
          boxShadow: `0 0 12px ${RED}`,
          opacity: 0.6 + 0.4 * Math.sin(frame / 6),
        }}
      />
      MEDGO 5 · MADINAH 2026
    </div>
  );
};

export const CornerTag = Interactive.create({
  Component: CornerTagInner,
  layout: "absolute-fill",
  schema: {},
});
