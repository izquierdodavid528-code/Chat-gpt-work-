import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {wipe} from "@remotion/transitions/wipe";

const BG = "#05070B";
const WHITE = "#F7FAFC";
const CYAN = "#59E1FF";
const BLUE = "#6C7CFF";
const LIME = "#B8FF6A";
const MUTED = "#8A94A7";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

const Grid: React.FC<{intensity?: number}> = ({intensity = 1}) => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.7) % 80;

  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      <div
        style={{
          position: "absolute",
          inset: -120,
          opacity: 0.17 * intensity,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          transform: `translateY(${drift}px) perspective(900px) rotateX(64deg) scale(1.55)`,
          transformOrigin: "50% 85%",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.14,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,.16) 0px, rgba(255,255,255,.16) 1px, transparent 1px, transparent 5px)",
          mixBlendMode: "soft-light",
        }}
      />
    </AbsoluteFill>
  );
};

const Particles: React.FC<{count?: number; tint?: string}> = ({
  count = 34,
  tint = CYAN,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  return (
    <AbsoluteFill>
      {Array.from({length: count}).map((_, i) => {
        const x = ((i * 137.5) % 100) / 100;
        const y = ((i * 91.7) % 100) / 100;
        const size = 2 + (i % 4);
        const dy = ((frame * (0.35 + (i % 5) * 0.08) + i * 19) % 190) - 95;
        const pulse =
          0.28 + 0.5 * (0.5 + 0.5 * Math.sin((frame + i * 17) / 14));

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x * width,
              top: y * height,
              width: size,
              height: size,
              borderRadius: 999,
              background: tint,
              opacity: pulse,
              transform: `translateY(${dy}px)`,
              boxShadow: `0 0 18px ${tint}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Badge: React.FC<{text: string; accent?: string}> = ({
  text,
  accent = CYAN,
}) => (
  <div
    style={{
      padding: "12px 18px",
      borderRadius: 999,
      border: "1px solid rgba(255,255,255,.14)",
      background: "rgba(255,255,255,.055)",
      color: WHITE,
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: 1.2,
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}
  >
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: 999,
        background: accent,
        boxShadow: `0 0 14px ${accent}`,
      }}
    />
    {text}
  </div>
);

const OrbitalCore: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({
    frame,
    fps,
    config: {damping: 18, stiffness: 130},
    durationInFrames: 28,
  });
  const rotate = frame * 0.9;
  const pulse = 1 + 0.035 * Math.sin(frame / 8);

  return (
    <div
      style={{
        position: "relative",
        width: 560,
        height: 560,
        transform: `scale(${enter * pulse})`,
        filter: "drop-shadow(0 0 36px rgba(89,225,255,.25))",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 62 + i * 52,
            borderRadius: "50%",
            border: `${i === 1 ? 3 : 2}px solid ${
              i === 1 ? CYAN : "rgba(255,255,255,.28)"
            }`,
            transform: `rotate(${
              rotate * (i % 2 ? -1 : 1) + i * 32
            }deg) scaleY(${0.42 + i * 0.08})`,
            boxShadow:
              i === 1 ? "0 0 28px rgba(89,225,255,.38)" : "none",
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 184,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 35% 30%, #ffffff 0%, #9FF4FF 9%, #49C9FF 24%, #5266FF 56%, #11162C 100%)",
          boxShadow:
            "0 0 50px rgba(89,225,255,.8), 0 0 120px rgba(108,124,255,.45), inset -24px -30px 70px rgba(0,0,0,.45)",
        }}
      />
    </div>
  );
};

const SceneIdea: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const title = spring({
    frame,
    fps,
    delay: 9,
    config: {damping: 16, stiffness: 150},
    durationInFrames: 28,
  });
  const opacity = interpolate(
    frame,
    [0, 12, 76, 90],
    [0, 1, 1, 0],
    clamp,
  );

  return (
    <AbsoluteFill style={{background: BG, color: WHITE, overflow: "hidden"}}>
      <Grid />
      <Particles />
      <AbsoluteFill
        style={{alignItems: "center", justifyContent: "center", opacity}}
      >
        <div style={{transform: "translateY(-190px)"}}>
          <OrbitalCore />
        </div>

        <div
          style={{
            position: "absolute",
            top: 1110,
            width: "100%",
            textAlign: "center",
            transform: `translateY(${interpolate(
              title,
              [0, 1],
              [90, 0],
            )}px) scale(${0.92 + title * 0.08})`,
            opacity: title,
          }}
        >
          <div
            style={{
              fontSize: 28,
              letterSpacing: 9,
              color: CYAN,
              fontWeight: 800,
            }}
          >
            WORKSPACE // 01
          </div>
          <div
            style={{
              fontSize: 150,
              lineHeight: 0.9,
              fontWeight: 900,
              letterSpacing: -7,
              marginTop: 28,
            }}
          >
            IDEA
          </div>
          <div
            style={{
              fontSize: 34,
              color: MUTED,
              marginTop: 34,
              letterSpacing: 1.4,
            }}
          >
            From thought to motion.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const SceneCodeMotion: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = spring({
    frame,
    fps,
    config: {damping: 18, stiffness: 150},
    durationInFrames: 28,
  });
  const sweep = interpolate(frame, [8, 42], [-900, 900], {
    ...clamp,
    easing: Easing.out(Easing.exp),
  });

  return (
    <AbsoluteFill
      style={{
        background: "#070A12",
        color: WHITE,
        overflow: "hidden",
        padding: 74,
      }}
    >
      <Grid intensity={0.72} />
      <Particles count={22} tint={BLUE} />

      <div
        style={{
          position: "absolute",
          top: 118,
          left: 74,
          fontSize: 26,
          letterSpacing: 7,
          color: MUTED,
          fontWeight: 800,
        }}
      >
        REAL-TIME CREATIVE PIPELINE
      </div>

      <div style={{position: "absolute", top: 355, left: 74, right: 74}}>
        <div
          style={{
            fontSize: 142,
            lineHeight: 0.9,
            fontWeight: 900,
            letterSpacing: -8,
            transform: `translateX(${interpolate(
              reveal,
              [0, 1],
              [-120, 0],
            )}px)`,
            opacity: reveal,
          }}
        >
          CODE
        </div>

        <div
          style={{
            height: 4,
            background: "rgba(255,255,255,.12)",
            margin: "34px 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: sweep,
              width: 560,
              background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`,
            }}
          />
        </div>

        <div
          style={{
            fontSize: 142,
            lineHeight: 0.9,
            fontWeight: 900,
            letterSpacing: -8,
            color: CYAN,
            textAlign: "right",
            transform: `translateX(${interpolate(
              reveal,
              [0, 1],
              [120, 0],
            )}px)`,
            opacity: reveal,
          }}
        >
          MOTION
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 74,
          right: 74,
          bottom: 170,
          borderRadius: 34,
          border: "1px solid rgba(255,255,255,.14)",
          background: "rgba(255,255,255,.055)",
          padding: "34px 34px 30px",
          transform: `translateY(${interpolate(
            reveal,
            [0, 1],
            [80, 0],
          )}px)`,
          opacity: reveal,
        }}
      >
        <div
          style={{
            fontSize: 24,
            color: MUTED,
            marginBottom: 22,
            letterSpacing: 3,
            fontWeight: 700,
          }}
        >
          LIVE TOOLCHAIN
        </div>
        <div style={{display: "flex", gap: 14, flexWrap: "wrap"}}>
          <Badge text="REMOTION" accent={CYAN} />
          <Badge text="BLENDER" accent={BLUE} />
          <Badge text="DRIVE" accent={LIME} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneBuild: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = ["BUILD.", "PREVIEW.", "RENDER."];

  return (
    <AbsoluteFill style={{background: "#04060A", color: WHITE, overflow: "hidden"}}>
      <Grid intensity={0.55} />
      <Particles count={28} tint={LIME} />

      <div
        style={{
          position: "absolute",
          width: 980,
          height: 980,
          left: 50,
          top: 250,
          borderRadius: "50%",
          border: "1px solid rgba(184,255,106,.22)",
          transform: `scale(${1 + frame / 260}) rotate(${frame * 0.25}deg)`,
          boxShadow: "0 0 100px rgba(184,255,106,.07)",
        }}
      />

      <div style={{position: "absolute", left: 72, right: 72, top: 420}}>
        {words.map((word, i) => {
          const p = spring({
            frame,
            fps,
            delay: 8 + i * 16,
            config: {damping: 18, stiffness: 170},
            durationInFrames: 24,
          });

          return (
            <div
              key={word}
              style={{
                fontSize: i === 1 ? 126 : 118,
                lineHeight: 1.06,
                fontWeight: 900,
                letterSpacing: -5,
                color: i === 1 ? LIME : WHITE,
                transform: `translateX(${interpolate(
                  p,
                  [0, 1],
                  [i % 2 ? 160 : -160, 0],
                )}px)`,
                opacity: p,
                marginBottom: 18,
              }}
            >
              {word}
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: 72,
          bottom: 180,
          color: MUTED,
          fontSize: 30,
          lineHeight: 1.5,
          maxWidth: 830,
        }}
      >
        One workspace. Visual review. Reproducible output.
      </div>
    </AbsoluteFill>
  );
};

const SceneFinal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({
    frame,
    fps,
    config: {damping: 17, stiffness: 140},
    durationInFrames: 30,
  });
  const ring = frame * 1.25;
  const glow = 0.65 + 0.35 * Math.sin(frame / 7);

  return (
    <AbsoluteFill style={{background: "#030509", color: WHITE, overflow: "hidden"}}>
      <Grid intensity={0.45} />
      <Particles count={26} />

      <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>
        <div
          style={{
            width: 720,
            height: 720,
            borderRadius: "50%",
            border: "2px solid rgba(89,225,255,.3)",
            transform: `rotate(${ring}deg) scale(${0.85 + enter * 0.15})`,
            boxShadow: `0 0 ${60 + glow * 50}px rgba(89,225,255,.16)`,
            position: "absolute",
            top: 300,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: i % 2 ? BLUE : CYAN,
                boxShadow: `0 0 28px ${i % 2 ? BLUE : CYAN}`,
                left: "50%",
                top: "50%",
                transform: `rotate(${i * 90}deg) translateX(360px)`,
                transformOrigin: "0 0",
              }}
            />
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            top: 545,
            width: "100%",
            textAlign: "center",
            padding: "0 58px",
          }}
        >
          <div
            style={{
              fontSize: 26,
              letterSpacing: 9,
              color: CYAN,
              fontWeight: 800,
              opacity: enter,
            }}
          >
            CREATIVE INFRASTRUCTURE
          </div>
          <div
            style={{
              fontSize: 122,
              lineHeight: 0.92,
              fontWeight: 900,
              letterSpacing: -6,
              marginTop: 34,
              transform: `scale(${0.88 + enter * 0.12})`,
              opacity: enter,
            }}
          >
            SYSTEM
            <br />
            ONLINE
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 220,
            display: "flex",
            gap: 14,
            opacity: enter,
          }}
        >
          <Badge text="READY" accent={LIME} />
          <Badge text="REMOTE" accent={CYAN} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const WowWorkspaceDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{background: BG}}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={96}>
          <SceneIdea />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({direction: "from-right"})}
          timing={springTiming({
            config: {damping: 200},
            durationInFrames: 14,
          })}
        />

        <TransitionSeries.Sequence durationInFrames={98}>
          <SceneCodeMotion />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: 12})}
        />

        <TransitionSeries.Sequence durationInFrames={94}>
          <SceneBuild />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({direction: "from-bottom"})}
          timing={springTiming({
            config: {damping: 200},
            durationInFrames: 14,
          })}
        />

        <TransitionSeries.Sequence durationInFrames={124}>
          <SceneFinal />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
