import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  Video,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const RED = "#ED1C24";
const BLACK = "#000000";
const WHITE = "#FFFFFF";
const GRAY = "#77787B";

const SOURCE = staticFile("source-bruno-onu-2026.mp4");
const LOGO = staticFile("logo_memorial_blanco.png");
const MUSIC = staticFile("music-bed-v3.wav");
const WHOOSH = staticFile("transition-whoosh-v2.wav");

export const V3_FPS = 30;
export const V3_DURATION_FRAMES = 58 * V3_FPS;

type Segment = {
  id: string;
  from: number;
  duration: number;
  sourceStart: number;
  chapter?: string;
  chapterIndex?: string;
  mode: "close" | "window" | "medium";
};

const SEGMENTS: Segment[] = [
  // Until the master source is upgraded from 640x360, every real shot stays in a
  // native 16:9 documentary window. Fake vertical close-ups exaggerate softness.
  {id: "cold", from: 0, duration: 4.8, sourceStart: 1160.43, mode: "window"},
  {id: "principle", from: 6.0, duration: 12, sourceStart: 49.883, chapter: "DERECHO INTERNACIONAL", chapterIndex: "01", mode: "window"},
  {id: "containers", from: 18.0, duration: 13, sourceStart: 208.68, chapter: "PRESIÓN ECONÓMICA", chapterIndex: "02", mode: "window"},
  {id: "dialogue", from: 31.0, duration: 11, sourceStart: 745.50, chapter: "DIÁLOGO", chapterIndex: "03", mode: "window"},
  {id: "payoff", from: 42.0, duration: 10.5, sourceStart: 1156.88, mode: "window"},
];

type Caption = {start: number; end: number; text: string; accent?: string};
const CAPTIONS: Caption[] = [
  {start: 0, end: 2.4, text: "La ley de la selva no puede ser", accent: "ley de la selva"},
  {start: 2.4, end: 4.8, text: "el futuro de la humanidad.", accent: "humanidad"},
  {start: 6.0, end: 7.5, text: "Sin embargo, es alarmante"},
  {start: 7.5, end: 10.5, text: "el avance del expansionismo,"},
  {start: 10.5, end: 13.0, text: "los actos de usurpación y conquista;"},
  {start: 13.0, end: 18.0, text: "la agresión militar y económica."},
  {start: 18.0, end: 22.7, text: "Más de 7 000 contenedores han sido detenidos"},
  {start: 22.7, end: 26.5, text: "en diversos puertos, muchos de ellos"},
  {start: 26.5, end: 31.0, text: "con alimentos, medicamentos y dispositivos médicos."},
  {start: 31.0, end: 36.4, text: "Siempre hemos estado y seguimos dispuestos al diálogo", accent: "diálogo"},
  {start: 36.4, end: 39.1, text: "con el gobierno de Estados Unidos"},
  {start: 39.1, end: 42.0, text: "para intentar encontrar solución a las diferencias bilaterales."},
  {start: 42.0, end: 46.5, text: "Creemos que este rumbo es peligroso"},
  {start: 46.5, end: 49.0, text: "y es insostenible."},
  {start: 49.0, end: 52.5, text: "La ley de la selva no puede ser el futuro de la humanidad.", accent: "futuro de la humanidad"},
];

const FrameTexture: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      opacity: 0.12,
      backgroundImage:
        "radial-gradient(circle at 20% 10%, rgba(255,255,255,.24) 0 1px, transparent 1.4px), radial-gradient(circle at 80% 70%, rgba(255,255,255,.14) 0 1px, transparent 1.2px)",
      backgroundSize: "16px 16px, 23px 23px",
      mixBlendMode: "soft-light",
    }}
  />
);

const Highlight: React.FC<{text: string; accent?: string}> = ({text, accent}) => {
  if (!accent || !text.toLowerCase().includes(accent.toLowerCase())) return <>{text}</>;
  const i = text.toLowerCase().indexOf(accent.toLowerCase());
  return <>{text.slice(0, i)}<span style={{color: RED}}>{text.slice(i, i + accent.length)}</span>{text.slice(i + accent.length)}</>;
};

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / V3_FPS;
  const cue = CAPTIONS.find((c) => t >= c.start && t < c.end);
  if (!cue) return null;
  const local = t - cue.start;
  const opacity = interpolate(local, [0, 0.12], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const y = interpolate(local, [0, 0.14], [12, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad)});
  return (
    <div style={{position: "absolute", left: 78, right: 116, bottom: 300, zIndex: 80, display: "flex", justifyContent: "center", opacity, transform: `translateY(${y}px)`}}>
      <div style={{maxWidth: 850, color: WHITE, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 42, fontWeight: 850, lineHeight: 1.1, letterSpacing: -0.4, textAlign: "center", padding: "13px 20px 15px", borderRadius: 12, background: "rgba(0,0,0,.72)", boxShadow: "0 10px 30px rgba(0,0,0,.28)", textShadow: "0 3px 10px rgba(0,0,0,.90)", borderBottom: `3px solid ${RED}`}}>
        <Highlight text={cue.text} accent={cue.accent} />
      </div>
    </div>
  );
};

const SourceBug: React.FC = () => (
  <div style={{position: "absolute", top: 92, left: 66, zIndex: 72, display: "flex", alignItems: "center", gap: 9, padding: 0, color: "rgba(255,255,255,.70)", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 16, fontWeight: 800, letterSpacing: 1.45, textTransform: "uppercase", textShadow: "0 2px 8px rgba(0,0,0,.85)"}}>
    <span style={{width: 8, height: 8, borderRadius: 99, background: RED}} /> ONU · 26 SEP 2026
  </div>
);

const ChapterLabel: React.FC<{index: string; title: string}> = ({index, title}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, durationInFrames: 16, config: {damping: 170, stiffness: 190}});
  return (
    <div style={{position: "absolute", top: 205, left: 62, zIndex: 75, opacity: enter, transform: `translateX(${interpolate(enter, [0, 1], [-40, 0])}px)`}}>
      <div style={{height: 6, width: 110, background: RED, marginBottom: 12}} />
      <div style={{display: "flex", gap: 14, alignItems: "baseline"}}>
        <span style={{color: RED, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 26, fontWeight: 900}}>{index}</span>
        <span style={{color: WHITE, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 30, fontWeight: 900, letterSpacing: 1.2}}>{title}</span>
      </div>
    </div>
  );
};

const DocumentaryVideo: React.FC<{segment: Segment}> = ({segment}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, Math.max(1, Math.round(segment.duration * V3_FPS) - 1)], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const startFrom = Math.round(segment.sourceStart * V3_FPS);
  const objectPosition = segment.id === "dialogue" ? "49% 42%" : "50% 42%";
  if (segment.mode === "window") {
    return (
      <AbsoluteFill style={{background: BLACK, overflow: "hidden"}}>
        <Video src={SOURCE} startFrom={startFrom} muted style={{width: "100%", height: "100%", objectFit: "cover", objectPosition, transform: "scale(1.34)", filter: "blur(34px) brightness(.24) saturate(.62)"}} />
        <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(0,0,0,.36), rgba(0,0,0,.82))"}} />
        <div style={{position: "absolute", left: 60, right: 60, top: 410, height: 540, borderRadius: 20, overflow: "hidden", background: BLACK, border: "1px solid rgba(255,255,255,.20)", boxShadow: "0 30px 90px rgba(0,0,0,.68)", transform: `scale(${1 + progress * 0.008})`}}>
          <Video src={SOURCE} startFrom={startFrom} muted style={{width: "100%", height: "100%", objectFit: "contain", objectPosition: "center center"}} />
          <div style={{position: "absolute", inset: 0, boxShadow: "inset 0 0 0 1px rgba(255,255,255,.035)"}} />
        </div>
        <FrameTexture />
      </AbsoluteFill>
    );
  }
  const zoom = segment.mode === "close" ? 1.12 + progress * 0.035 : 1.05 + progress * 0.025;
  return (
    <AbsoluteFill style={{background: BLACK, overflow: "hidden"}}>
      <Video src={SOURCE} startFrom={startFrom} muted style={{width: "100%", height: "100%", objectFit: "cover", objectPosition, transform: `scale(${zoom}) translateX(${interpolate(progress, [0, 1], [-4, 3])}px)`, filter: "contrast(1.035) saturate(.94)"}} />
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(0,0,0,.26) 0%, rgba(0,0,0,.02) 34%, rgba(0,0,0,.04) 62%, rgba(0,0,0,.54) 100%)"}} />
      <FrameTexture />
    </AbsoluteFill>
  );
};

const SegmentWithAudio: React.FC<{segment: Segment}> = ({segment}) => {
  const frame = useCurrentFrame();
  const startFrom = Math.round(segment.sourceStart * V3_FPS);
  const durationFrames = Math.max(1, Math.round(segment.duration * V3_FPS));
  const fadeFrames = 4;
  const voiceVolume = interpolate(
    frame,
    [0, fadeFrames, Math.max(fadeFrames + 1, durationFrames - fadeFrames), durationFrames - 1],
    [0.82, 1, 1, 0.82],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );
  return (
    <AbsoluteFill>
      <DocumentaryVideo segment={segment} />
      <Video
        src={SOURCE}
        startFrom={startFrom}
        volume={voiceVolume}
        style={{position: "absolute", width: 2, height: 2, opacity: 0, pointerEvents: "none"}}
      />
      <SourceBug />
      {segment.chapter && segment.chapterIndex ? <ChapterLabel index={segment.chapterIndex} title={segment.chapter} /> : null}
    </AbsoluteFill>
  );
};

const ColdOpenOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [0, 65], [0, 1], {extrapolateRight: "clamp"});
  return (
    <>
      <div style={{position: "absolute", left: 64, top: 140, color: "rgba(255,255,255,.72)", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 21, fontWeight: 850, letterSpacing: 1.8}}>CIERRE DE LA INTERVENCIÓN</div>
      <div style={{position: "absolute", left: 64, top: 180, height: 6, width: 250, transform: `scaleX(${line})`, transformOrigin: "left", background: RED}} />
    </>
  );
};

const Bridge: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, durationInFrames: 20, config: {damping: 180, stiffness: 170}});
  const orbit = interpolate(frame, [0, 45], [-24, 28], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{background: BLACK, justifyContent: "center", alignItems: "center", overflow: "hidden"}}>
      <div style={{position: "absolute", width: 760, height: 760, top: 310, borderRadius: "50%", border: "1px solid rgba(255,255,255,.10)", boxShadow: "inset 0 0 110px rgba(255,255,255,.025)", transform: `rotate(${orbit}deg) scale(${0.88 + enter * 0.12})`}}>
        <div style={{position: "absolute", left: 22, right: 22, top: 379, height: 2, background: "rgba(237,28,36,.74)"}} />
        <div style={{position: "absolute", top: 22, bottom: 22, left: 379, width: 2, background: "rgba(237,28,36,.42)"}} />
      </div>
      <div style={{position: "absolute", top: 515, color: WHITE, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 278, fontWeight: 900, letterSpacing: -17, transform: `scale(${0.82 + enter * 0.18})`, opacity: enter, textShadow: "0 0 60px rgba(255,255,255,.10)"}}>81</div>
      <div style={{position: "absolute", left: 68, right: 68, bottom: 315, opacity: enter}}>
        <div style={{height: 5, width: 126, background: RED, marginBottom: 18}} />
        <div style={{color: WHITE, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 36, fontWeight: 900, letterSpacing: .2}}>BRUNO RODRÍGUEZ PARRILLA</div>
        <div style={{marginTop: 8, color: "rgba(255,255,255,.62)", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 19, fontWeight: 750, letterSpacing: 1.4}}>81.ª ASAMBLEA GENERAL · ONU · 26 SEP 2026</div>
        <div style={{marginTop: 18, color: "rgba(255,255,255,.46)", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: 1.1}}>FRAGMENTOS DE UNA INTERVENCIÓN DE ~21 MIN</div>
      </div>
      <FrameTexture />
    </AbsoluteFill>
  );
};

const ContextCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, durationInFrames: 16, config: {damping: 170, stiffness: 190}});
  return (
    <AbsoluteFill style={{background: BLACK, overflow: "hidden"}}>
      <Video src={SOURCE} startFrom={0} muted style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 44%", transform: "scale(1.32)", filter: "blur(32px) brightness(.22) saturate(.60)"}} />
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(0,0,0,.38), rgba(0,0,0,.86))"}} />
      <div style={{position: "absolute", left: 60, right: 60, top: 355, height: 540, borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,.18)", boxShadow: "0 30px 90px rgba(0,0,0,.70)"}}>
        <Video src={SOURCE} startFrom={0} muted style={{width: "100%", height: "100%", objectFit: "contain", objectPosition: "center center", background: BLACK}} />
      </div>
      <div style={{position: "absolute", left: 62, right: 62, top: 970, opacity: enter, transform: `translateY(${interpolate(enter,[0,1],[24,0])}px)`}}>
        <div style={{width: 126, height: 5, background: RED, marginBottom: 16}} />
        <div style={{fontFamily: "Arial, Helvetica, sans-serif", color: WHITE, fontSize: 50, lineHeight: .98, fontWeight: 900, letterSpacing: -1}}>BRUNO RODRÍGUEZ PARRILLA</div>
        <div style={{marginTop: 13, color: "#D0D0D0", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 23, lineHeight: 1.2, fontWeight: 650}}>Ministro de Relaciones Exteriores de Cuba</div>
        <div style={{marginTop: 8, color: "rgba(255,255,255,.58)", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 17, fontWeight: 800, letterSpacing: 1.4}}>NACIONES UNIDAS · 26 SEP 2026</div>
      </div>
      <FrameTexture />
    </AbsoluteFill>
  );
};

const DataCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, durationInFrames: 18, config: {damping: 180, stiffness: 190}});
  return (
    <div style={{position: "absolute", top: 245, right: 58, zIndex: 76, width: 390, padding: "25px 28px", background: "rgba(0,0,0,.86)", border: "1px solid rgba(255,255,255,.12)", borderTop: `6px solid ${RED}`, borderRadius: 18, boxShadow: "0 22px 60px rgba(0,0,0,.46)", opacity: enter, transform: `translateY(${interpolate(enter,[0,1],[-22,0])}px)`}}>
      <div style={{color: WHITE, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 78, lineHeight: .9, fontWeight: 900}}>7.000+</div>
      <div style={{marginTop: 13, color: "#D5D5D5", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 22, lineHeight: 1.15, fontWeight: 760}}>contenedores</div>
      <div style={{marginTop: 18, color: RED, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 15, lineHeight: 1.2, fontWeight: 900, letterSpacing: 1.2, textTransform: "uppercase"}}>cifra citada en el discurso</div>
    </div>
  );
};

const ChapterCut: React.FC = () => {
  const frame = useCurrentFrame();
  const phase = interpolate(frame, [0, 3, 7], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{pointerEvents: "none", zIndex: 95}}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          height: 3,
          width: "100%",
          background: RED,
          opacity: phase * 0.72,
          transform: `scaleX(${phase})`,
          transformOrigin: "left",
          boxShadow: "0 0 24px rgba(237,28,36,.45)",
        }}
      />
      <AbsoluteFill style={{background: `rgba(0,0,0,${phase * 0.11})`}} />
    </AbsoluteFill>
  );
};

const MemorialBug: React.FC = () => (
  <div style={{position: "absolute", right: 66, top: 88, width: 76, zIndex: 90, opacity: .70}}>
    <Img src={LOGO} style={{width: "100%", height: "auto"}} />
  </div>
);

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, durationInFrames: 20, config: {damping: 180, stiffness: 180}});
  return (
    <AbsoluteFill style={{background: BLACK, justifyContent: "center", alignItems: "center", padding: 80}}>
      <div style={{width: 200, opacity: enter}}><Img src={LOGO} style={{width: "100%", height: "auto"}} /></div>
      <div style={{width: 280, height: 6, background: RED, margin: "38px 0 34px", transform: `scaleX(${enter})`}} />
      <div style={{color: WHITE, textAlign: "center", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 38, fontWeight: 900, lineHeight: 1.05}}>FRAGMENTOS DE LA INTERVENCIÓN DE CUBA</div>
      <div style={{marginTop: 18, color: "#C7C7C7", textAlign: "center", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 24, lineHeight: 1.35, fontWeight: 650}}>81.ª Asamblea General de las Naciones Unidas<br />26 SEP 2026</div>
      <div style={{position: "absolute", bottom: 98, color: GRAY, fontFamily: "Arial, Helvetica, sans-serif", fontSize: 17, fontWeight: 700, letterSpacing: 1.1}}>FUENTE AUDIOVISUAL · NACIONES UNIDAS / MATERIAL DEL PROYECTO</div>
    </AbsoluteFill>
  );
};

const MusicBed: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / V3_FPS;

  // Continuous editorial underscore: almost absent under the cold open, stronger
  // across chapter changes, then deliberately collapses under the final quote.
  const volume = interpolate(
    t,
    [0, 0.7, 3.8, 4.8, 6.0, 18.0, 31.0, 42.0, 48.5, 52.5, 58.0],
    [0, 0.025, 0.045, 0.11, 0.085, 0.105, 0.08, 0.055, 0.022, 0.0, 0.0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );
  return <Audio src={MUSIC} volume={volume} />;
};

export default function BrunoONUReelV3() {
  return (
    <AbsoluteFill style={{background: BLACK}}>
      <MusicBed />
      {SEGMENTS.map((segment) => (
        <Sequence key={segment.id} from={Math.round(segment.from * V3_FPS)} durationInFrames={Math.round(segment.duration * V3_FPS)}>
          <SegmentWithAudio segment={segment} />
          {segment.id === "cold" ? <ColdOpenOverlay /> : null}
          {segment.id === "containers" ? <DataCard /> : null}
        </Sequence>
      ))}
      <Sequence from={Math.round(4.8 * V3_FPS)} durationInFrames={Math.round(1.2 * V3_FPS)}><Bridge /><Audio src={WHOOSH} volume={0.10} /></Sequence>
      <Sequence from={Math.round(18.0 * V3_FPS)} durationInFrames={8}><ChapterCut /><Audio src={WHOOSH} volume={0.045} /></Sequence>
      <Sequence from={Math.round(31.0 * V3_FPS)} durationInFrames={8}><ChapterCut /><Audio src={WHOOSH} volume={0.045} /></Sequence>
      <Sequence from={Math.round(52.5 * V3_FPS)} durationInFrames={Math.round(5.5 * V3_FPS)}><EndCard /></Sequence>
      <Sequence from={Math.round(6.0 * V3_FPS)} durationInFrames={Math.round(46.5 * V3_FPS)}><MemorialBug /></Sequence>
      <Captions />
    </AbsoluteFill>
  );
}
