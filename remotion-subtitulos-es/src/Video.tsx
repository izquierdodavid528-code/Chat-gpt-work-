import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Video,
} from "remotion";

type Cue = {start: number; end: number; text: string};

const cues: Cue[] = [
  {start:0.00,end:2.15,text:"Bueno, la verdad es que\nCuba ya ha caído."},
  {start:2.15,end:3.75,text:"No tiene una economía funcional"},
  {start:3.75,end:6.97,text:"y está gobernada por personas que\nsiguen hablando de una revolución"},
  {start:6.97,end:9.99,text:"que lleva 20 años muerta\ny que nunca funcionó."},
  {start:9.99,end:11.27,text:"Y ese es el problema que tienen."},
  {start:11.27,end:13.41,text:"El problema que tiene Cuba ahora mismo"},
  {start:13.41,end:16.95,text:"es que es un Estado fallido\nen todos los sentidos."},
  {start:16.95,end:20.39,text:"Ahora bien, puede que tengan un gobierno\ncapaz de encarcelar y matar a personas."},
  {start:20.39,end:24.20,text:"Tienen un régimen que es capaz de hacerlo\ny que ha encarcelado y matado a personas."},
  {start:24.20,end:25.48,text:"Pero no es un gobierno funcional"},
  {start:25.48,end:28.19,text:"ni es un país funcional.\nSimplemente no lo es."},
  {start:28.19,end:32.18,text:"Y, además, es un sistema alimentado por\nla corrupción, la malversación y el robo."},
  {start:32.18,end:35.41,text:"La economía cubana... no existe una economía\ncubana que beneficie al pueblo cubano."},
  {start:35.41,end:38.09,text:"Todo lo que tenía alguna posibilidad\nde generar dinero en Cuba"},
  {start:38.09,end:41.04,text:"era controlado por las Fuerzas Armadas\ncubanas y el Partido Comunista de Cuba"},
  {start:41.04,end:43.46,text:"para llenar los bolsillos\nde un puñado de personas"},
  {start:43.46,end:45.33,text:"a costa de todo el país."},
  {start:45.33,end:50.16,text:"¿Sabes que desde 2021 cerca del 20 % de la\npoblación de Cuba ha abandonado el país?"},
  {start:50.16,end:53.16,text:"Se ha ido porque esto es un\nfracaso, un fracaso total."},
  {start:53.16,end:55.80,text:"Así que esperamos que Cuba\nelija un camino diferente."},
  {start:55.80,end:60.35,text:"Esperamos que entre quienes hoy controlan\nlas armas y el aparato represivo"},
  {start:60.35,end:62.50,text:"haya algunas personas"},
  {start:62.50,end:65.45,text:"que abran los ojos a la realidad\nde lo que están enfrentando."},
  {start:65.45,end:68.96,text:"Lo que ya no van a poder hacer\nmientras Donald Trump sea presidente"},
  {start:68.96,end:74.84,text:"es seguir robando y ganando\ndinero a costa del pueblo cubano."},
  {start:74.84,end:79.67,text:"Y lo que nunca vamos a permitir, bajo ninguna\ncircunstancia, mientras Trump sea presidente"},
  {start:79.67,end:83.96,text:"es que Cuba se convierta en una base de\noperaciones contra intereses estadounidenses"},
  {start:83.96,end:86.11,text:"o que represente una amenaza\npara nuestra seguridad nacional."},
  {start:86.11,end:87.41,text:"En eso somos absolutamente claros."},
  {start:87.41,end:92.01,text:"Como en todos los casos —puedes preguntar\npor cualquier país o problema del mundo—"},
  {start:92.01,end:96.57,text:"te diré que la preferencia de nuestro presidente\nes resolver estas cosas diplomáticamente"},
  {start:96.57,end:99.25,text:"y de una manera que\npermita alcanzar un acuerdo"},
  {start:99.25,end:102.70,text:"y poner a Cuba, o a cualquier país, en un\ncamino de cambio positivo e irreversible"},
  {start:102.70,end:104.85,text:"que incluya libertades económicas,\npero también libertades políticas."},
  {start:104.85,end:107.57,text:"De hecho, no se puede tener\nlibertad económica en Cuba"},
  {start:107.57,end:109.44,text:"si primero no hay libertad política."},
  {start:109.44,end:112.66,text:"Ambas tienen que avanzar,\nal menos, al mismo tiempo."},
  {start:112.66,end:114.54,text:"Eso requerirá un período de transición."},
  {start:114.54,end:118.51,text:"Por desgracia, demasiados de los que siguen\nallí coreando consignas revolucionarias"},
  {start:118.51,end:120.71,text:"todavía creen que pueden esperar\na que termine esta administración"},
  {start:120.71,end:122.68,text:"sin hacer cambios ni hacer nada."},
  {start:122.68,end:126.08,text:"Están equivocados y aprenderán\nla lección por las malas"},
  {start:126.08,end:126.88,text:"si no rectifican."},
];

const Subtitle = ({cue, t}: {cue: Cue; t: number}) => {
  const local = t - cue.start;
  const remaining = cue.end - t;
  const opacity = Math.min(
    interpolate(local, [0, 0.09], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }),
    interpolate(remaining, [0, 0.08], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    }),
  );

  const translateY = interpolate(local, [0, 0.10], [5, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 72,
      display: "flex",
      justifyContent: "center",
      padding: "0 24px",
      opacity,
      transform: `translateY(${translateY}px)`,
    }}>
      <div style={{
        maxWidth: 570,
        color: "#fff",
        backgroundColor: "rgba(0,0,0,0.80)",
        borderRadius: 9,
        padding: "8px 13px 9px",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: 24,
        fontWeight: 700,
        lineHeight: 1.15,
        letterSpacing: "0.05px",
        textAlign: "center",
        textShadow: "0 1px 2px rgba(0,0,0,0.95)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.20)",
        whiteSpace: "pre-line",
      }}>
        {cue.text}
      </div>
    </div>
  );
};

export default function VideoWithSpanishSubtitles() {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const cue = cues.find((item) => t >= item.start && t < item.end);

  return (
    <AbsoluteFill style={{backgroundColor: "black"}}>
      <Video
        src={staticFile("input.mp4")}
        style={{width: "100%", height: "100%", objectFit: "cover"}}
      />
      {cue ? <Subtitle cue={cue} t={t} /> : null}
    </AbsoluteFill>
  );
}
