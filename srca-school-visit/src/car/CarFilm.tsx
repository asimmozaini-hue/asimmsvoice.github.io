import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Flash } from "../medgo/Fx";
import { Shot } from "../medgo/Shot";
import { arabicFont, latinFont } from "../medgo/theme";
import { DriveScene } from "./DriveScene";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
// Beat times of the song (seconds), from librosa.
const B = [
  0.14, 0.67, 1.14, 1.67, 2.23, 2.79, 3.34, 3.9, 4.48, 5.04, 5.6, 6.15, 6.71,
  7.27, 7.83, 8.38, 8.96, 9.52, 10.08, 10.63, 11.19, 11.75, 12.33, 12.89, 13.44,
  14.0, 14.56, 15.12, 15.7, 16.25, 16.81, 17.37, 17.93, 18.48, 19.04, 19.62,
  20.18, 20.74, 21.29, 21.85,
];
const f = (s: number) => Math.round(s * 30);

const Photo = ({ src }: { readonly src: string }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          scale: String(
            interpolate(frame, [0, 5, durationInFrames], [1.18, 1.06, 1.0], {
              ...clamp,
              easing: Easing.out(Easing.cubic),
            }),
          ),
          filter: `blur(${interpolate(frame, [0, 4], [8, 0], clamp)}px) contrast(1.08) saturate(1.08)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const Title = ({
  big,
  small,
}: {
  readonly big: string;
  readonly small: string;
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        top: 250,
        color: "#fff",
        textShadow: "0 6px 30px rgba(0,0,0,0.6)",
        opacity: interpolate(
          frame,
          [0, 10, durationInFrames - 10, durationInFrames],
          [0, 1, 1, 0],
          clamp,
        ),
      }}
    >
      <div
        style={{
          fontFamily: latinFont,
          fontWeight: 900,
          fontSize: 170,
          letterSpacing: interpolate(frame, [0, 30], [70, 24], {
            ...clamp,
            easing: Easing.out(Easing.cubic),
          }),
          marginRight: -24,
        }}
      >
        {big}
      </div>
      <div
        dir="auto"
        style={{
          fontFamily: arabicFont,
          fontWeight: 700,
          fontSize: 54,
          marginTop: 6,
          opacity: interpolate(frame, [12, 24], [0, 0.95], clamp),
        }}
      >
        {small}
      </div>
    </AbsoluteFill>
  );
};

export const CarFilm = () => {
  const { durationInFrames } = useVideoConfig();
  const night: [number, number, number][] = [
    [0, 2, 0.0],
    [2, 4, 6.0],
    [4, 6, 8.4],
    [6, 8, 15.5],
    [8, 10, 11.2],
  ];
  const photos = [
    "photo1",
    "photo2",
    "photo3",
    "photo4",
    "photo5",
    "photo6",
    "photo7",
    "photo8",
  ];
  return (
    <>
      <AbsoluteFill style={{ backgroundColor: "#000" }} />
      {night.map(([a, b, src], i) => (
        <Shot
          key={i}
          name={`Night ${i + 1}`}
          src="car/night.mp4"
          from={a === 0 ? 0 : f(B[a])}
          durationInFrames={f(B[b]) - (a === 0 ? 0 : f(B[a]))}
          trim={src}
          rate={1}
          motion={i % 2 ? "push" : "pull"}
        />
      ))}
      <DriveScene
        name="Drive 1"
        speed={1}
        push={0.1}
        from={f(B[10])}
        durationInFrames={f(B[20]) - f(B[10])}
      />
      <Sequence
        name="Title"
        from={f(B[11])}
        durationInFrames={f(B[17]) - f(B[11])}
      >
        <Title big="MG7" small="المدينة المنورة" />
      </Sequence>
      {photos.map((p, i) => (
        <Sequence
          key={p}
          name={p}
          from={f(B[20 + i])}
          durationInFrames={f(B[21 + i]) - f(B[20 + i])}
        >
          <Photo src={`car/${p}.jpg`} />
        </Sequence>
      ))}
      <Sequence
        name="photo9"
        from={f(B[28])}
        durationInFrames={f(B[30]) - f(B[28])}
      >
        <Photo src="car/photo9.jpg" />
      </Sequence>
      <DriveScene
        name="Drive 2"
        speed={1.5}
        push={0.22}
        from={f(B[30])}
        durationInFrames={durationInFrames - f(B[30])}
      />
      <Sequence
        name="End title"
        from={f(B[35])}
        durationInFrames={durationInFrames - f(B[35])}
      >
        <Title big="MG7" small="Trophy+" />
      </Sequence>
      {[10, 20, 30].map((k) => (
        <Flash
          key={k}
          name={`Flash ${k}`}
          from={f(B[k])}
          durationInFrames={6}
        />
      ))}
      <Sequence name="Fade out" from={durationInFrames - 15}>
        <FadeOut />
      </Sequence>
      <Audio name="Song" src={staticFile("car/song.mp3")} />
    </>
  );
};

const FadeOut = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000",
        opacity: interpolate(frame, [0, 14], [0, 1], clamp),
      }}
    />
  );
};
