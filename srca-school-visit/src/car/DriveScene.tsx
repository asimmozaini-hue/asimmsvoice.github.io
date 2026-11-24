import {
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// Vanishing point of the street, behind the car (px in the 1080x1920 frame).
const VX = 540;
const VY = 1130;
// Towers above this line, road below it; the seam sits behind the car body.
const SPLIT = 1300;

// Fake radial motion blur: the same layer stacked at growing scales and falling opacity.
const Streaked = ({
  src,
  scale,
  clip,
  streak,
}: {
  readonly src: string;
  readonly scale: number;
  readonly clip: string;
  readonly streak: number;
}) => (
  <div style={{ position: "absolute", inset: 0, clipPath: clip }}>
    {[0, 1, 2, 3].map((i) => (
      <Img
        key={i}
        src={staticFile(src)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          transformOrigin: `${VX}px ${VY}px`,
          scale: String(scale * (1 + i * streak)),
          opacity: i === 0 ? 1 : 0.28 / i,
        }}
      />
    ))}
  </div>
);

// The car "driving" down a street of towers: the camera follows it, so the car holds its place while the
// road streams under it, the towers draw nearer and street lights flash past.
const DriveSceneInner = ({
  speed,
  push,
}: {
  readonly speed: number;
  readonly push: number;
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const towers =
    1 + push * (frame / durationInFrames) + 0.004 * Math.sin(t * 2.1);
  // Road texture loops outward from the vanishing point; two phases cross-fade so the loop never shows.
  const cycle = 0.55 / speed;
  const phase = (t % cycle) / cycle;
  const road = (p: number) => 1 + 0.32 * p;
  const dash = (k: number) => ((t * 1.8 * speed + k / 5) % 1) ** 2.2;
  const shakeX = Math.sin(t * 47) * 1.2 + Math.sin(t * 23) * 0.8;
  const shakeY = Math.sin(t * 61) * 1.4 + Math.sin(t * 13) * 1.0;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#111",
        overflow: "hidden",
        scale: String(1 + push * 0.6 * (frame / durationInFrames)),
        transformOrigin: `${VX}px 1200px`,
      }}
    >
      <Streaked
        src="car/towers.jpg"
        scale={towers}
        clip={`inset(0 0 ${1920 - SPLIT}px 0)`}
        streak={0.006 * speed}
      />
      <div style={{ position: "absolute", inset: 0 }}>
        {[phase, (phase + 0.5) % 1].map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              opacity: Math.sin(Math.PI * p),
            }}
          >
            <Streaked
              src="car/road.jpg"
              scale={road(p)}
              clip={`inset(${SPLIT}px 0 0 0)`}
              streak={0.02 * speed}
            />
          </div>
        ))}
      </div>
      {/* lane dashes rushing towards the camera on both sides */}
      <svg
        width={1080}
        height={1920}
        style={{ position: "absolute", inset: 0 }}
      >
        {[-1, 1].map((side) =>
          [0, 1, 2, 3, 4].map((k) => {
            const a = dash(k);
            const b = Math.min(1, a + 0.05 + 0.25 * a);
            const x0 = VX + side * 620 * a;
            const y0 = VY + 900 * a;
            const x1 = VX + side * 620 * b;
            const y1 = VY + 900 * b;
            return (
              <line
                key={`${side}-${k}`}
                x1={x0}
                y1={y0}
                x2={x1}
                y2={y1}
                stroke="#f4f1e6"
                strokeWidth={4 + 26 * a}
                strokeLinecap="round"
                opacity={0.55 * Math.min(1, a * 4)}
              />
            );
          }),
        )}
      </svg>
      {/* street lights passing overhead on alternating sides */}
      {[0, 1, 2].map((k) => {
        const p = ((t * 0.9 * speed + k / 3) % 1) ** 2.4;
        const side = k % 2 ? 1 : -1;
        const x = VX + side * 900 * p;
        const y = VY - 260 - 900 * p;
        const r = 10 + 160 * p;
        return (
          <div
            key={k}
            style={{
              position: "absolute",
              left: x - r,
              top: y - r,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,236,190,0.95) 0%, rgba(255,200,120,0.35) 35%, rgba(255,180,90,0) 70%)",
              opacity: Math.min(1, p * 6) * (1 - p * 0.6),
              filter: `blur(${2 + 10 * p}px)`,
              mixBlendMode: "screen",
            }}
          />
        );
      })}
      <Img
        src={staticFile("car/car.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          translate: `${shakeX}px ${shakeY}px`,
        }}
      />
      {/* tail-light bloom */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 990,
          height: 120,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(255,40,30,0.55) 0%, rgba(255,30,20,0.18) 45%, rgba(255,0,0,0) 70%)",
          mixBlendMode: "screen",
          translate: `${shakeX}px ${shakeY}px`,
          opacity: 0.75 + 0.25 * Math.sin(t * 6),
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#000",
          opacity: interpolate(frame, [0, 4], [0.6, 0], clamp),
        }}
      />
    </div>
  );
};

export const DriveScene = Interactive.create({
  Component: DriveSceneInner,
  layout: "absolute-fill",
  schema: {
    speed: {
      type: "number",
      default: 1,
      description: "Speed",
      hiddenFromList: false,
    },
    push: {
      type: "number",
      default: 0.1,
      description: "Camera push",
      hiddenFromList: false,
    },
  },
});
