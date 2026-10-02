import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
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
const LOGO = staticFile("logo_memorial_denuncia.png");

type Cue = {
  start: number;
  end: number;
  text: string;
  accent?: string;
};

// Primer pase de sincronizacion basado en la transcripcion de apoyo de la ONU.
// Se ajustara cue por cue contra el audio antes del cierre final.
const cues: Cue[] = [
  {start: 0.0, end: 4.2, text: "Sin embargo, es alarmante el avance del expansionismo,", accent: "expansionismo"},
  {start: 4.2, end: 7.7, text: "los actos de usurpación y conquista,"},
  {start: 7.7, end: 11.3, text: "la agresión militar y económica."},
  {start: 11.3, end: 17.6, text: "Es absurda e irrealizable la pretensión del gobierno de Estados Unidos"},
  {start: 17.6, end: 21.8, text: "de imponer la paz mediante la fuerza."},
  {start: 21.8, end: 27.7, text: "Pilares fundamentales del derecho internacional", accent: "derecho internacional"},
  {start: 27.7, end: 31.8, text: "y de la Organización de Naciones Unidas,", accent: "Naciones Unidas"},
  {start: 31.8, end: 35.2, text: "como la igualdad soberana entre los Estados,", accent: "igualdad soberana"},
  {start: 35.2, end: 38.0, text: "están bajo permanente ataque."},
  {start: 38.0, end: 43.7, text: "También son reflejo de la crisis de identidad y relevancia"},
  {start: 43.7, end: 49.6, text: "que se ha impuesto a la Organización de las Naciones Unidas,"},
  {start: 49.6, end: 54.5, text: "incluso a esta Asamblea General,"},
  {start: 54.5, end: 60.0, text: "el órgano más universal, democrático y representativo de la comunidad internacional."},
  {start: 60.0, end: 62.0, text: "Estamos convencidos de la indispensable necesidad de preservar y fortalecer la ONU."},
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

const MemorialCorner = () => (
  <div
    style={{
      position: "absolute",
      top: 112,
      right: 72,
      width: 168,
      padding: "16px 18px",
      borderRadius: 22,
      background: "rgba(237,28,36,0.92)",
      boxShadow: "0 14px 34px rgba(0,0,0,0.34)",
      zIndex: 30,
    }}
  >
    <Img src={LOGO} style={{width: "100%", height: "auto", display: "block"}} />
  </div>
);

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 180, stiffness: 160}});
  const titleY = interpolate(enter, [0, 1], [54, 0]);
  const shade = interpolate(frame, [0, 40], [0.72, 0.52], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{backgroundColor: BLACK, overflow: "hidden"}}>
      <Video
        src={SOURCE}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scale(1.08)",
          filter: "blur(20px) saturate(0.72)",
          opacity: 0.72,
        }}
      />
      <AbsoluteFill style={{background: `rgba(0,0,0,${shade})`}} />
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 230,
          height: 1040,
          borderRadius: 34,
          overflow: "hidden",
          border: "2px solid rgba(255,255,255,0.16)",
          boxShadow: "0 32px 90px rgba(0,0,0,0.5)",
        }}
      >
        <Video
          src={SOURCE}
          muted
          style={{width: "100%", height: "100%", objectFit: "contain", backgroundColor: BLACK}}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 118,
          backgroundColor: RED,
          color: WHITE,
          padding: "14px 24px 12px",
          fontFamily: "Arial Narrow, Arial, sans-serif",
          fontWeight: 900,
          fontSize: 34,
          letterSpacing: 2.2,
        }}
      >
        FRAGMENTO
      </div>
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          bottom: 250,
          transform: `translateY(${titleY}px)`,
          opacity: enter,
        }}
      >
        <div
          style={{
            color: WHITE,
            fontFamily: "Arial Narrow, Arial, sans-serif",
            fontSize: 90,
            lineHeight: 0.92,
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: -1.5,
            textShadow: "0 8px 30px rgba(0,0,0,0.6)",
          }}
        >
          Discurso en la ONU
        </div>
        <div
          style={{
            color: "#D7D7D7",
            marginTop: 24,
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 37,
            lineHeight: 1.25,
            fontWeight: 600,
          }}
        >
          Asamblea General · fragmento de intervención
        </div>
      </div>
      <div style={{position: "absolute", right: 72, bottom: 106, width: 170}}>
        <Img src={LOGO} style={{width: "100%", height: "auto"}} />
      </div>
    </AbsoluteFill>
  );
};

const LowerThird: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, delay: 4, durationInFrames: 22, config: {damping: 170}});
  const exit = interpolate(frame, [190, 215], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const opacity = enter * exit;
  const x = interpolate(enter, [0, 1], [-80, 0]);

  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        top: 1120,
        width: 760,
        opacity,
        transform: `translateX(${x}px)`,
        zIndex: 25,
      }}
    >
      <div style={{height: 10, width: 190, backgroundColor: RED, marginBottom: 0}} />
      <div
        style={{
          background: "rgba(0,0,0,0.88)",
          padding: "24px 30px 25px",
          borderLeft: `8px solid ${RED}`,
          boxShadow: "0 18px 46px rgba(0,0,0,0.42)",
        }}
      >
        <div
          style={{
            color: WHITE,
            fontFamily: "Arial Narrow, Arial, sans-serif",
            fontSize: 48,
            lineHeight: 1.0,
            fontWeight: 900,
            textTransform: "uppercase",
          }}
        >
          Bruno Rodríguez Parrilla
        </div>
        <div
          style={{
            color: "#D0D0D0",
            marginTop: 14,
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 28,
            lineHeight: 1.22,
            fontWeight: 600,
          }}
        >
          Ministro de Relaciones Exteriores de Cuba
        </div>
        <div
          style={{
            color: RED,
            marginTop: 9,
            fontFamily: "Arial, Helvetica, sans-serif",
            fontSize: 23,
            fontWeight: 800,
            letterSpacing: 1.1,
            textTransform: "uppercase",
          }}
        >
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
    interpolate(local, [0, 0.12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    interpolate(remaining, [0, 0.10], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const y = interpolate(local, [0, 0.16], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        right: 118,
        bottom: 250,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${y}px)`,
        zIndex: 40,
      }}
    >
      <div
        style={{
          maxWidth: 870,
          color: WHITE,
          backgroundColor: "rgba(0,0,0,0.82)",
          borderRadius: 18,
          padding: "18px 24px 20px",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 48,
          fontWeight: 800,
          lineHeight: 1.13,
          letterSpacing: -0.5,
          textAlign: "center",
          textShadow: "0 3px 8px rgba(0,0,0,0.95)",
          boxShadow: "0 12px 36px rgba(0,0,0,0.30)",
        }}
      >
        {fitText(cue.text, cue.accent)}
      </div>
    </div>
  );
};

const MainScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1.03, 1.075], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const x = interpolate(frame, [0, durationInFrames * 0.55, durationInFrames], [0, -12, 7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const redPulse = interpolate(frame % 300, [0, 20, 55, 300], [0.45, 1, 0.45, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{backgroundColor: BLACK, overflow: "hidden"}}>
      <Video
        src={SOURCE}
        startFrom={45 * fps}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 50%",
          transform: `translateX(${x}px) scale(${scale})`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.02) 32%, rgba(0,0,0,0.02) 62%, rgba(0,0,0,0.50) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 12,
          backgroundColor: RED,
          opacity: redPulse,
          zIndex: 20,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 62,
          top: 92,
          color: WHITE,
          background: "rgba(0,0,0,0.62)",
          borderLeft: `6px solid ${RED}`,
          padding: "13px 18px 12px",
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: 1.2,
          textTransform: "uppercase",
          zIndex: 25,
        }}
      >
        Discurso · ONU
      </div>
      <MemorialCorner />
      <LowerThird />
      <SubtitleLayer />
    </AbsoluteFill>
  );
};

const EndScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, durationInFrames: 24, config: {damping: 180}});
  const line = interpolate(enter, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        justifyContent: "center",
        alignItems: "center",
        padding: 90,
      }}
    >
      <div
        style={{
          width: 230,
          opacity: enter,
          transform: `scale(${0.92 + enter * 0.08})`,
        }}
      >
        <Img src={LOGO} style={{width: "100%", height: "auto"}} />
      </div>
      <div
        style={{
          width: 320,
          height: 8,
          backgroundColor: RED,
          marginTop: 54,
          transform: `scaleX(${line})`,
        }}
      />
      <div
        style={{
          marginTop: 44,
          color: WHITE,
          fontFamily: "Arial Narrow, Arial, sans-serif",
          fontSize: 48,
          fontWeight: 900,
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: 1.2,
          opacity: enter,
        }}
      >
        Fragmento del discurso
      </div>
      <div
        style={{
          marginTop: 18,
          color: GRAY,
          fontFamily: "Arial, Helvetica, sans-serif",
          fontSize: 29,
          fontWeight: 600,
          textAlign: "center",
          opacity: enter,
        }}
      >
        Asamblea General de las Naciones Unidas
      </div>
    </AbsoluteFill>
  );
};

export default function BrunoONUReel() {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={90}>
        <IntroScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={wipe({direction: "from-right"})}
        timing={linearTiming({durationInFrames: 12})}
      />
      <TransitionSeries.Sequence durationInFrames={1860}>
        <MainScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({durationInFrames: 12})}
      />
      <TransitionSeries.Sequence durationInFrames={90}>
        <EndScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
}
