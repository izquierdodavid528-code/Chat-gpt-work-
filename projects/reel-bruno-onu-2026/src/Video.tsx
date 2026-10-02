import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Video,
} from "remotion";
import {TransitionSeries, linearTiming} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {wipe} from "@remotion/transitions/wipe";

const RED = "#ED1C24";
const BLACK = "#000000";
const GRAY = "#77787B";
const WHITE = "#FFFFFF";

const SOURCE = staticFile("source-bruno-onu-2026.mp4");
const LOGO = staticFile("logo_memorial_blanco.png");
const MUSIC = staticFile("music-bed-v2.wav");
const WHOOSH = staticFile("transition-whoosh-v2.wav");

const BASE_START_SEC = 49.8827;
const INTRO_FRAMES = 66;
const MAIN_FRAMES = 1025;
const OUTRO_FRAMES = 78;
const TRANSITION_FRAMES = 8;
export const TOTAL_DURATION_FRAMES =
  INTRO_FRAMES + MAIN_FRAMES + OUTRO_FRAMES - TRANSITION_FRAMES * 2;

type Cue = {
  start: number;
  end: number;
  text: string;
  accent?: string;
};

// V2: temporizacion reconstruida contra los limites de frase y pausas reales del audio.
// Cada cue usa tiempo local del fragmento que comienza en BASE_START_SEC.
const cues: Cue[] = [
  {start: 0.0, end: 0.9, text: "Sin embargo,"},
  {start: 1.62, end: 4.35, text: "es alarmante el avance del expansionismo,"},
  {start: 5.04, end: 7.48, text: "los actos de usurpación y conquista;"},
  {start: 7.98, end: 11.9, text: "la agresión militar y económica."},
  {start: 12.67, end: 14.98, text: "Es absurda e irrealizable"},
  {start: 15.36, end: 18.42, text: "la pretensión del gobierno de Estados Unidos"},
  {start: 18.72, end: 21.32, text: "de imponer la paz mediante la fuerza."},
  {
    start: 22.12,
    end: 25.06,
    text: "Pilares fundamentales del Derecho Internacional",
    accent: "Derecho Internacional",
  },
  {
    start: 25.43,
    end: 27.92,
    text: "y de la Organización de Naciones Unidas,",
    accent: "Naciones Unidas",
  },
  {start: 28.3, end: 31.32, text: "como la igualdad soberana entre los Estados,"},
  {start: 31.52, end: 34.05, text: "están bajo permanente ataque."},
];

type ShotMode = "close" | "medium" | "window";

type Shot = {
  start: number;
  end: number;
  mode: ShotMode;
  position?: string;
  zoomFrom?: number;
  zoomTo?: number;
};

// Cortes visuales deliberados cada 4-6 s. El audio permanece continuo para evitar saltos.
const shots: Shot[] = [
  {start: 0, end: 4.35, mode: "close", position: "50% 42%", zoomFrom: 1.04, zoomTo: 1.08},
  {start: 4.35, end: 8.0, mode: "medium", position: "50% 45%", zoomFrom: 1.0, zoomTo: 1.035},
  {start: 8.0, end: 12.67, mode: "window"},
  {start: 12.67, end: 18.72, mode: "close", position: "48% 42%", zoomFrom: 1.06, zoomTo: 1.11},
  {start: 18.72, end: 22.12, mode: "window"},
  {start: 22.12, end: 28.3, mode: "medium", position: "52% 44%", zoomFrom: 1.015, zoomTo: 1.055},
  {start: 28.3, end: 34.15, mode: "close", position: "50% 40%", zoomFrom: 1.075, zoomTo: 1.11},
];

const fitText = (text: string, accent?: string) => {
  if (!accent || !text.includes(accent)) return <>{text}</>;
  const [before, after] = text.split(accent);
  return (
    <>
      {before}
      <span style={{color: RED}}>{accent}</span>
      {after}
    </>
  );
};

const MemorialCorner: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 104,
      right: 62,
      width: 152,
      padding: "14px 16px",
      borderRadius: 18,
      background: "rgba(237,28,36,0.93)",
      boxShadow: "0 14px 36px rgba(0,0,0,0.32)",
      zIndex: 60,
    }}
  >
    <Img src={LOGO} style={{width: "100%", height: "auto", display: "block"}} />
  </div>
);

const MusicBed: React.FC = () => {
  const frame = useCurrentFrame();
  const outroStart = TOTAL_DURATION_FRAMES - OUTRO_FRAMES;
  const volume = interpolate(
    frame,
    [0, 22, INTRO_FRAMES - 10, INTRO_FRAMES + 20, outroStart, TOTAL_DURATION_FRAMES - 24, TOTAL_DURATION_FRAMES],
    [0, 0.22, 0.22, 0.115, 0.115, 0.19, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"},
  );
  return <Audio src={MUSIC} volume={volume} />;
};

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, durationInFrames: 22, config: {damping: 180, stiffness: 180}});
  const titleY = interpolate(enter, [0, 1], [48, 0]);
  const cardScale = interpolate(frame, [0, 66], [1.05, 1.015], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const redBar = interpolate(frame, [5, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill style={{backgroundColor: BLACK, overflow: "hidden"}}>
      <Video
        src={SOURCE}
        startFrom={Math.round(BASE_START_SEC * fps)}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 45%",
          transform: `scale(${cardScale})`,
          filter: "blur(18px) saturate(0.68) brightness(0.58)",
        }}
      />
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(0,0,0,.30), rgba(0,0,0,.78))"}} />

      <div
        style={{
          position: "absolute",
          top: 114,
          left: 70,
          height: 9,
          width: 315,
          backgroundColor: RED,
          transform: `scaleX(${redBar})`,
          transformOrigin: "left center",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 154,
          color: WHITE,
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 30,
          fontWeight: 900,
          letterSpacing: 2.6,
          textTransform: "uppercase",
          opacity: enter,
        }}
      >
        FRAGMENTO · NACIONES UNIDAS
      </div>

      <div
        style={{
          position: "absolute",
          left: 66,
          right: 66,
          top: 340,
          height: 720,
          borderRadius: 32,
          overflow: "hidden",
          border: "2px solid rgba(255,255,255,.15)",
          boxShadow: "0 34px 90px rgba(0,0,0,.55)",
          transform: `scale(${0.96 + enter * 0.04})`,
          opacity: 0.45 + enter * 0.55,
        }}
      >
        <Video
          src={SOURCE}
          startFrom={Math.round(BASE_START_SEC * fps)}
          muted
          style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 42%"}}
        />
        <AbsoluteFill style={{boxShadow: "inset 0 0 0 1px rgba(255,255,255,.07)"}} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          bottom: 238,
          transform: `translateY(${titleY}px)`,
          opacity: enter,
        }}
      >
        <div
          style={{
            color: WHITE,
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 86,
            lineHeight: 0.92,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: -2,
            textShadow: "0 8px 30px rgba(0,0,0,.65)",
          }}
        >
          Bruno Rodríguez
          <br />
          ante la ONU
        </div>
        <div
          style={{
            color: "#D6D6D6",
            marginTop: 24,
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 31,
            lineHeight: 1.25,
            fontWeight: 650,
          }}
        >
          Asamblea General · 26 SEP 2026
        </div>
      </div>

      <div style={{position: "absolute", right: 68, bottom: 92, width: 166}}>
        <Img src={LOGO} style={{width: "100%", height: "auto"}} />
      </div>

      <Sequence from={49} durationInFrames={17} layout="none">
        <Audio src={WHOOSH} volume={0.18} />
      </Sequence>
    </AbsoluteFill>
  );
};

const LowerThird: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, delay: 5, durationInFrames: 20, config: {damping: 180, stiffness: 190}});
  const exit = interpolate(frame, [154, 178], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const opacity = enter * exit;
  const x = interpolate(enter, [0, 1], [-72, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: 58,
        top: 1110,
        width: 754,
        opacity,
        transform: `translateX(${x}px)`,
        zIndex: 55,
      }}
    >
      <div style={{height: 8, width: 214, backgroundColor: RED}} />
      <div
        style={{
          background: "rgba(0,0,0,.88)",
          padding: "22px 28px 24px",
          borderLeft: `7px solid ${RED}`,
          boxShadow: "0 18px 44px rgba(0,0,0,.42)",
        }}
      >
        <div style={{color: WHITE, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 45, lineHeight: 1, fontWeight: 900}}>
          Bruno Rodríguez Parrilla
        </div>
        <div style={{color: "#D0D0D0", marginTop: 12, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 27, fontWeight: 600}}>
          Ministro de Relaciones Exteriores de Cuba
        </div>
        <div style={{color: RED, marginTop: 8, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 21, fontWeight: 900, letterSpacing: 1.2, textTransform: "uppercase"}}>
          Asamblea General · Naciones Unidas
        </div>
      </div>
    </div>
  );
};

const SubtitleLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const cue = cues.find((item) => t >= item.start && t < item.end);
  if (!cue) return null;

  const local = t - cue.start;
  const remaining = cue.end - t;
  const opacity = Math.min(
    interpolate(local, [0, 0.1], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
    interpolate(remaining, [0, 0.08], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}),
  );
  const y = interpolate(local, [0, 0.13], [15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 58,
        right: 92,
        bottom: 238,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${y}px)`,
        zIndex: 70,
      }}
    >
      <div
        style={{
          maxWidth: 900,
          color: WHITE,
          background: "rgba(0,0,0,.84)",
          borderRadius: 16,
          padding: "16px 23px 18px",
          borderBottom: `4px solid ${RED}`,
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 46,
          fontWeight: 850,
          lineHeight: 1.12,
          letterSpacing: -0.5,
          textAlign: "center",
          textShadow: "0 3px 9px rgba(0,0,0,.95)",
          boxShadow: "0 13px 34px rgba(0,0,0,.30)",
        }}
      >
        {fitText(cue.text, cue.accent)}
      </div>
    </div>
  );
};

const CutPulse: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 1, 4], [0.16, 0.09, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const x = interpolate(frame, [0, 5], [-100, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <>
      <AbsoluteFill style={{backgroundColor: RED, opacity, zIndex: 12}} />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${x}%`,
          width: "18%",
          background: "linear-gradient(90deg, rgba(237,28,36,0), rgba(237,28,36,.22), rgba(237,28,36,0))",
          zIndex: 13,
        }}
      />
    </>
  );
};

const VisualShot: React.FC<{shot: Shot; index: number}> = ({shot, index}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const durationFrames = Math.max(1, Math.round((shot.end - shot.start) * fps));
  const progress = interpolate(frame, [0, durationFrames - 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const zoom = interpolate(progress, [0, 1], [shot.zoomFrom ?? 1, shot.zoomTo ?? 1.035]);
  const panX = interpolate(progress, [0, 1], [index % 2 === 0 ? -5 : 5, index % 2 === 0 ? 4 : -4]);
  const startFrom = Math.round((BASE_START_SEC + shot.start) * fps);

  if (shot.mode === "window") {
    return (
      <AbsoluteFill style={{backgroundColor: BLACK, overflow: "hidden"}}>
        <Video
          src={SOURCE}
          startFrom={startFrom}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "50% 45%",
            transform: "scale(1.16)",
            filter: "blur(24px) brightness(.43) saturate(.72)",
          }}
        />
        <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(0,0,0,.12), rgba(0,0,0,.55))"}} />
        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            top: 298,
            height: 900,
            borderRadius: 28,
            overflow: "hidden",
            border: "2px solid rgba(255,255,255,.16)",
            boxShadow: "0 34px 80px rgba(0,0,0,.58)",
            transform: `translateX(${panX * 0.35}px) scale(${1 + progress * 0.012})`,
          }}
        >
          <Video
            src={SOURCE}
            startFrom={startFrom}
            muted
            style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 44%"}}
          />
        </div>
        <div style={{position: "absolute", left: 56, top: 250, color: "rgba(255,255,255,.74)", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 21, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase"}}>
          Registro documental · ONU
        </div>
        {index > 0 ? <CutPulse /> : null}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{backgroundColor: BLACK, overflow: "hidden"}}>
      <Video
        src={SOURCE}
        startFrom={startFrom}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: shot.position ?? "50% 43%",
          transform: `translateX(${panX}px) scale(${zoom})`,
          filter: shot.mode === "close" ? "contrast(1.03) saturate(.96)" : "contrast(1.02) saturate(.94)",
        }}
      />
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(0,0,0,.20) 0%, rgba(0,0,0,.01) 36%, rgba(0,0,0,.06) 63%, rgba(0,0,0,.52) 100%)"}} />
      {index > 0 ? <CutPulse /> : null}
    </AbsoluteFill>
  );
};

const ImpactLabel: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, durationInFrames: 14, config: {damping: 180, stiffness: 210}});
  const x = interpolate(enter, [0, 1], [-54, 0]);
  return (
    <div
      style={{
        position: "absolute",
        top: 260,
        left: 58,
        zIndex: 65,
        transform: `translateX(${x}px)`,
        opacity: enter,
      }}
    >
      <div style={{height: 7, width: 140, backgroundColor: RED, marginBottom: 10}} />
      <div
        style={{
          background: "rgba(0,0,0,.78)",
          color: WHITE,
          padding: "14px 18px",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 31,
          fontWeight: 900,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          boxShadow: "0 12px 32px rgba(0,0,0,.36)",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const MainScene: React.FC = () => {
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor: BLACK, overflow: "hidden"}}>
      {/* Capa de audio continua: mantiene la voz intacta mientras la imagen usa cortes/reencuadres. */}
      <Video
        src={SOURCE}
        startFrom={Math.round(BASE_START_SEC * fps)}
        style={{position: "absolute", width: 2, height: 2, opacity: 0, pointerEvents: "none"}}
      />

      {shots.map((shot, index) => {
        const from = Math.round(shot.start * fps);
        const duration = Math.max(1, Math.round((shot.end - shot.start) * fps));
        return (
          <Sequence key={`${shot.start}-${shot.end}`} from={from} durationInFrames={duration}>
            <VisualShot shot={shot} index={index} />
          </Sequence>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 10,
          backgroundColor: RED,
          zIndex: 50,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 58,
          top: 98,
          color: WHITE,
          background: "rgba(0,0,0,.66)",
          borderLeft: `6px solid ${RED}`,
          padding: "12px 17px 11px",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 22,
          fontWeight: 900,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          zIndex: 62,
        }}
      >
        Fragmento · ONU · 26 SEP 2026
      </div>

      <MemorialCorner />
      <LowerThird />
      <SubtitleLayer />

      <Sequence from={Math.round(22.12 * fps)} durationInFrames={48} layout="none">
        <ImpactLabel text="Derecho Internacional" />
      </Sequence>
      <Sequence from={Math.round(25.43 * fps)} durationInFrames={43} layout="none">
        <ImpactLabel text="Naciones Unidas" />
      </Sequence>

      {[8.0, 18.72, 28.3].map((seconds) => (
        <Sequence key={seconds} from={Math.round(seconds * fps)} durationInFrames={17} layout="none">
          <Audio src={WHOOSH} volume={0.105} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const EndScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, durationInFrames: 22, config: {damping: 180, stiffness: 180}});
  const line = interpolate(enter, [0, 1], [0, 1]);
  const y = interpolate(enter, [0, 1], [34, 0]);

  return (
    <AbsoluteFill style={{backgroundColor: BLACK, justifyContent: "center", alignItems: "center", padding: 90}}>
      <div style={{position: "absolute", top: 0, left: 0, right: 0, height: 11, backgroundColor: RED}} />
      <div style={{width: 240, opacity: enter, transform: `translateY(${y}px) scale(${0.94 + enter * 0.06})`}}>
        <Img src={LOGO} style={{width: "100%", height: "auto"}} />
      </div>
      <div style={{width: 330, height: 7, backgroundColor: RED, marginTop: 50, transform: `scaleX(${line})`}} />
      <div style={{marginTop: 40, color: WHITE, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 46, fontWeight: 900, textAlign: "center", textTransform: "uppercase", letterSpacing: 1.1, opacity: enter}}>
        Fragmento del discurso
      </div>
      <div style={{marginTop: 16, color: "#BEBEBE", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 28, fontWeight: 600, textAlign: "center", lineHeight: 1.3, opacity: enter}}>
        Asamblea General de las Naciones Unidas
        <br />
        26 de septiembre de 2026
      </div>
      <div style={{position: "absolute", bottom: 95, color: GRAY, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: 1.3, textTransform: "uppercase", opacity: enter}}>
        Edición documental · Memorial de la Denuncia
      </div>
    </AbsoluteFill>
  );
};

export default function BrunoONUReel() {
  return (
    <AbsoluteFill style={{backgroundColor: BLACK}}>
      <MusicBed />
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={INTRO_FRAMES}>
          <IntroScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({direction: "from-right"})}
          timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
        />
        <TransitionSeries.Sequence durationInFrames={MAIN_FRAMES}>
          <MainScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
        />
        <TransitionSeries.Sequence durationInFrames={OUTRO_FRAMES}>
          <EndScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
}
