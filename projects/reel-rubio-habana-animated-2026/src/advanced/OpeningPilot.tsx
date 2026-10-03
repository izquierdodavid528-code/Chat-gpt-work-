import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame} from "remotion";
import {
  angleFromTangent,
  cubicBezierPoint,
  cubicBezierTangent,
  easeOutCubic,
  followThrough,
  windowProgress,
} from "./motion";
import {
  DepthLayer,
  ImpactAction,
  ParticleField,
  SceneCamera,
} from "./primitives";

const C = {
  paper: "#F3E9D2",
  paper2: "#E8D7B6",
  ink: "#20272A",
  sea: "#6FA6B7",
  seaDark: "#4F8598",
  red: "#D95B52",
  mustard: "#D7A64A",
  green: "#7B9B72",
  navy: "#344B57",
  cream: "#FFF6E6",
};

export const PILOT_FRAMES = 300;

const T = {
  establish: 0,
  route: 32,
  ship: 66,
  oilCue: 112,
  tariffRig: 176,
  stamp: 222,
  matchCut: 266,
};

const CAMERA = [
  {frame: 0, x: -12, y: 52, scale: 1.04, rotate: -0.7, tilt: 1.1},
  {frame: 52, x: -24, y: 64, scale: 1.10, rotate: 0.2, tilt: 0.5},
  {frame: 112, x: 12, y: 82, scale: 1.18, rotate: -0.45, tilt: 0.2},
  {frame: 182, x: -32, y: 104, scale: 1.28, rotate: -1.0, tilt: 0},
  {frame: 238, x: -86, y: 76, scale: 1.40, rotate: -1.35, tilt: 0},
  {frame: 299, x: -172, y: 8, scale: 1.58, rotate: -1.9, tilt: 0},
];

const ROUTE = {
  p0: {x: -160, y: 1170},
  p1: {x: 110, y: 1010},
  p2: {x: 510, y: 1000},
  p3: {x: 825, y: 1140},
};

const PaperOcean: React.FC<{frame: number}> = ({frame}) => (
  <AbsoluteFill
    style={{
      background: C.sea,
      backgroundImage:
        "radial-gradient(circle at 20% 15%, rgba(255,246,230,.13) 0 1px, transparent 1.4px), radial-gradient(circle at 70% 75%, rgba(32,39,42,.07) 0 1px, transparent 1.5px)",
      backgroundSize: "19px 19px, 27px 27px",
    }}
  >
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: "absolute", inset: 0}}>
      {Array.from({length: 14}).map((_, i) => {
        const y = 380 + i * 92;
        const phase = Math.sin(frame / 32 + i * 0.7) * 24;
        return (
          <path
            key={i}
            d={`M -120 ${y} C 120 ${y - 35 + phase}, 280 ${y + 28 - phase}, 520 ${y} S 880 ${y - 30 + phase * 0.4}, 1210 ${y + 8}`}
            fill="none"
            stroke="rgba(255,246,230,.20)"
            strokeWidth={4}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  </AbsoluteFill>
);

const LandMasses: React.FC = () => (
  <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: "absolute", inset: 0}}>
    <g transform="translate(16 20)" opacity={0.28} fill={C.ink}>
      <polygon points="165.7,224.1 234.3,256.8 297.1,281.4 360,310 405.7,387.7 434.3,473.6 462.9,567.7 494.3,641.4 534.3,698.6 582.9,706.8 594.3,657.7 585.7,584.1 565.7,510.5 537.1,436.8 491.4,367.3 431.4,301.8 348.6,248.6 262.9,228.2"/>
      <polygon points="314.3,964.5 345.7,940 391.4,919.5 442.9,895 500,870.5 557.1,858.2 622.9,870.5 688.6,911.4 757.1,960.5 817.1,1030 877.1,1091.4 928.6,1115.9 877.1,1058.6 820,1038.2 745.7,1001.4 668.6,980.9 594.3,964.5 520,952.3 445.7,960.5 382.9,980.9"/>
    </g>

    <polygon
      points="165.7,224.1 234.3,256.8 297.1,281.4 360,310 405.7,387.7 434.3,473.6 462.9,567.7 494.3,641.4 534.3,698.6 582.9,706.8 594.3,657.7 585.7,584.1 565.7,510.5 537.1,436.8 491.4,367.3 431.4,301.8 348.6,248.6 262.9,228.2"
      fill={C.green}
      stroke={C.ink}
      strokeWidth={11}
      strokeLinejoin="round"
    />
    <path d="M 212 249 C 310 274 393 322 438 399 C 470 454 486 535 523 617" fill="none" stroke={C.cream} strokeWidth={7} strokeLinecap="round" opacity={0.38}/>
    <g fill={C.green} stroke={C.ink} strokeWidth={6}>
      <ellipse cx="610" cy="705" rx="18" ry="38" transform="rotate(-18 610 705)"/>
      <ellipse cx="655" cy="765" rx="15" ry="31" transform="rotate(-18 655 765)"/>
      <ellipse cx="696" cy="825" rx="12" ry="25" transform="rotate(-18 696 825)"/>
    </g>

    <polygon
      points="314.3,964.5 345.7,940 391.4,919.5 442.9,895 500,870.5 557.1,858.2 622.9,870.5 688.6,911.4 757.1,960.5 817.1,1030 877.1,1091.4 928.6,1115.9 877.1,1058.6 820,1038.2 745.7,1001.4 668.6,980.9 594.3,964.5 520,952.3 445.7,960.5 382.9,980.9"
      fill={C.green}
      stroke={C.ink}
      strokeWidth={11}
      strokeLinejoin="round"
    />
    <path d="M 365 958 C 486 905 604 900 720 948 C 777 971 826 1013 870 1062" fill="none" stroke={C.cream} strokeWidth={7} strokeLinecap="round" opacity={0.38}/>

    <g fontFamily="Arial, sans-serif" fill={C.ink} fontWeight={900}>
      <text x="392" y="456" fontSize="31" transform="rotate(17 392 456)">FLORIDA</text>
      <text x="566" y="1048" fontSize="40" letterSpacing="4">CUBA</text>
    </g>
  </svg>
);

const AnimatedRoute: React.FC<{frame: number}> = ({frame}) => {
  const p = easeOutCubic(windowProgress(frame, T.route, T.route + 72));
  const dash = 900;
  const warning = windowProgress(frame, T.tariffRig + 24, T.stamp + 24);

  return (
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: "absolute", inset: 0}}>
      <path
        d="M -160 1170 C 110 1010 510 1000 825 1140"
        fill="none"
        stroke="rgba(32,39,42,.20)"
        strokeWidth={22}
        strokeLinecap="round"
      />
      <path
        d="M -160 1170 C 110 1010 510 1000 825 1140"
        fill="none"
        stroke={warning > 0.45 ? C.red : C.mustard}
        strokeWidth={10 + Math.sin(frame / 8) * 0.9}
        strokeLinecap="round"
        strokeDasharray={dash}
        strokeDashoffset={dash * (1 - p)}
      />
      <path
        d="M -160 1170 C 110 1010 510 1000 825 1140"
        fill="none"
        stroke={C.cream}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray="10 20"
        opacity={0.58 * p}
      />
    </svg>
  );
};

const OilBarrelMini: React.FC<{x: number; y: number; rotation: number}> = ({x, y, rotation}) => (
  <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
    <ellipse cx="0" cy="-26" rx="22" ry="9" fill={C.mustard} stroke={C.ink} strokeWidth="5"/>
    <path d="M -22 -26 L -18 28 Q 0 38 18 28 L 22 -26" fill={C.mustard} stroke={C.ink} strokeWidth="5"/>
    <path d="M -18 -4 Q 0 2 18 -4 M -17 15 Q 0 21 17 15" fill="none" stroke={C.ink} strokeWidth="4"/>
    <path d="M 0 -14 C -6 -4 -7 1 -4 7 C -1 13 7 13 10 7 C 12 2 8 -5 2 -14 Z" fill={C.red}/>
  </g>
);

const TankerRig: React.FC<{frame: number}> = ({frame}) => {
  const launch = easeOutCubic(windowProgress(frame, T.ship, T.ship + 165));
  const point = cubicBezierPoint(launch, ROUTE.p0, ROUTE.p1, ROUTE.p2, ROUTE.p3);
  const tangent = cubicBezierTangent(launch, ROUTE.p0, ROUTE.p1, ROUTE.p2, ROUTE.p3);
  const angle = angleFromTangent(tangent) * 0.16;
  const bob = Math.sin(frame / 5.5) * 5;
  const pitch = Math.sin(frame / 12) * 1.1;
  const oilPop = spring({
    frame: Math.max(0, frame - T.oilCue),
    fps: 30,
    config: {damping: 12, stiffness: 170, mass: 0.75},
  });

  return (
    <div
      style={{
        position: "absolute",
        left: point.x,
        top: point.y + bob,
        width: 420,
        height: 210,
        transformOrigin: "38% 58%",
        transform: `translate(-50%,-50%) rotate(${angle + pitch}deg)`,
      }}
    >
      <svg width="420" height="210" viewBox="0 0 420 210">
        <path d="M24 105 H382 L338 161 H70 Z" fill={C.navy} stroke={C.ink} strokeWidth="10" strokeLinejoin="round"/>
        <path d="M60 161 C 145 180 290 179 394 158" fill="none" stroke={C.cream} strokeWidth="9" strokeLinecap="round" opacity={0.8}/>
        <rect x="92" y="70" width="214" height="44" rx="9" fill={C.paper2} stroke={C.ink} strokeWidth="8"/>
        <rect x="310" y="48" width="56" height="68" rx="7" fill={C.cream} stroke={C.ink} strokeWidth="8"/>
        <rect x="326" y="24" width="10" height="27" fill={C.ink}/>
        <g
          style={{
            transformOrigin: "190px 75px",
            transform: `translateY(${(1 - oilPop) * 42}px) scale(${0.55 + oilPop * 0.45}) rotate(${followThrough(frame, T.oilCue + 7, 8, 0.5, 0.12)}deg)`,
            opacity: oilPop,
          }}
        >
          <OilBarrelMini x={145} y={66} rotation={-6 + Math.sin(frame / 11) * 1.5}/>
          <OilBarrelMini x={202} y={66} rotation={4 + Math.sin(frame / 12 + 1) * 1.7}/>
          <OilBarrelMini x={259} y={67} rotation={-2 + Math.sin(frame / 13 + 2) * 1.3}/>
        </g>
      </svg>
      <ParticleField frame={frame} originX={95} originY={170} spreadX={250} spreadY={50} count={18} opacity={0.42}/>
    </div>
  );
};

const ForegroundCurrent: React.FC<{frame: number}> = ({frame}) => {
  const drift = Math.sin(frame / 18) * 18;
  const drift2 = Math.cos(frame / 24) * 22;
  return (
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: "absolute", inset: 0}}>
      <path
        d={`M -160 ${1505 + drift} C 120 ${1410 + drift2}, 430 ${1515 - drift}, 710 ${1455 + drift2} S 1120 ${1400 + drift}, 1240 ${1510 + drift2} L 1240 2020 L -160 2020 Z`}
        fill="rgba(79,133,152,.24)"
      />
      <path
        d={`M -120 ${1570 + drift2} C 180 ${1490 - drift}, 470 ${1590 + drift2}, 760 ${1515 - drift} S 1060 ${1480 + drift2}, 1220 ${1560 + drift} `}
        fill="none"
        stroke="rgba(255,246,230,.32)"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <path
        d={`M -90 ${1640 - drift} C 230 ${1580 + drift2}, 510 ${1680 - drift2}, 860 ${1595 + drift} S 1120 ${1570 - drift2}, 1230 ${1635 + drift}`}
        fill="none"
        stroke="rgba(32,39,42,.10)"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
};

const TariffMechanism: React.FC<{frame: number}> = ({frame}) => {
  const entry = spring({
    frame: Math.max(0, frame - T.tariffRig),
    fps: 30,
    config: {damping: 13, stiffness: 145, mass: 1},
  });
  const strike = spring({
    frame: Math.max(0, frame - T.stamp),
    fps: 30,
    config: {damping: 11, stiffness: 215, mass: 0.65},
  });
  const swing = followThrough(frame, T.tariffRig + 8, 13, 0.42, 0.06);
  const match = easeOutCubic(windowProgress(frame, T.matchCut, PILOT_FRAMES - 1));
  const matchTilt = match * 13;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 738,
          top: 858,
          width: 224,
          height: 286,
          transformOrigin: "112px 8px",
          transformStyle: "preserve-3d",
          transform: `perspective(900px) translate3d(${(1 - entry) * 240}px,${(1 - entry) * -125}px,${match * 180}px) rotateZ(${-16 + entry * 13 + swing}deg) rotateY(${matchTilt}deg) rotateX(${match * 5}deg) scale(${1 + match * 2.25})`,
          opacity: entry,
          zIndex: 6,
        }}
      >
        <svg width="300" height="210" viewBox="0 0 300 210" style={{position: "absolute", left: -38, top: -178, overflow: "visible"}}>
          <path d="M150 205 C 125 135 180 92 142 22" fill="none" stroke={C.ink} strokeWidth="9" strokeLinecap="round"/>
          <path d="M153 204 C 130 140 182 97 146 28" fill="none" stroke="rgba(255,246,230,.24)" strokeWidth="3" strokeLinecap="round"/>
        </svg>

        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath: "polygon(16% 0, 84% 0, 100% 15%, 100% 100%, 0 100%, 0 15%)",
            background: "linear-gradient(165deg, #E26B60 0%, #D95B52 58%, #C94C47 100%)",
            border: `9px solid ${C.ink}`,
            borderRadius: 16,
            boxShadow: "15px 18px 0 rgba(32,39,42,.18)",
          }}
        >
          <div style={{position: "absolute", left: 89, top: 13, width: 46, height: 46, borderRadius: "50%", background: C.paper2, border: `7px solid ${C.ink}`}}/>
          <div style={{position: "absolute", left: 25, top: 65, fontFamily: "Arial", fontSize: 23, fontWeight: 1000, letterSpacing: 3, color: C.cream}}>ARANCEL</div>
          <div style={{position: "absolute", left: 24, top: 108, fontFamily: "Arial", fontSize: 58, fontWeight: 1000, lineHeight: 0.82, color: C.cream}}>29<br/>ENE</div>
          <div style={{position: "absolute", left: 26, bottom: 25, fontFamily: "Arial", fontSize: 16, fontWeight: 900, color: C.ink}}>EO 14380</div>
          <div style={{position: "absolute", right: 18, bottom: 22, width: 44, height: 12, borderRadius: 99, background: "rgba(255,246,230,.30)", transform: "rotate(-18deg)"}}/>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 610,
          top: 1145,
          width: 220,
          height: 72,
          transformOrigin: "center",
          transform: `scale(${0.76 + strike * 0.24}) translateY(${(1 - strike) * -34}px) rotate(-5deg)`,
          opacity: strike,
          border: `7px solid ${C.red}`,
          borderRadius: 999,
          background: "rgba(255,246,230,.90)",
          fontFamily: "Arial",
          fontWeight: 1000,
          fontSize: 19,
          letterSpacing: 2.2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: C.red,
          boxShadow: "9px 10px 0 rgba(32,39,42,.12)",
        }}
      >
        PETRÓLEO
      </div>
      <ImpactAction at={T.stamp + 3} x={720} y={1180} radius={145}/>
    </>
  );
};

const ScreenGraphics: React.FC<{frame: number}> = ({frame}) => {
  const titleIn = spring({
    frame,
    fps: 30,
    config: {damping: 16, stiffness: 130, mass: 0.9},
  });
  const titleOut = 1 - windowProgress(frame, 82, 102);
  const pulse = 1 + Math.sin(frame / 17) * 0.006;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 88,
          transform: `translateY(${(1 - titleIn) * 42}px) scale(${pulse})`,
          transformOrigin: "left top",
          opacity: titleIn * titleOut,
          color: C.cream,
          fontFamily: "Arial",
          fontWeight: 1000,
          fontSize: 90,
          lineHeight: 0.82,
          textShadow: `5px 6px 0 ${C.ink}`,
          zIndex: 20,
        }}
      >
        2026
      </div>
      <div
        style={{
          position: "absolute",
          left: 74,
          top: 190,
          width: 118,
          height: 9,
          borderRadius: 99,
          background: C.mustard,
          transformOrigin: "left center",
          transform: `scaleX(${titleIn * titleOut})`,
          zIndex: 20,
        }}
      />
    </>
  );
};

export const AdvancedOpeningPilot: React.FC = () => {
  const frame = useCurrentFrame();
  const vignette = interpolate(frame, [0, 120, 260, 299], [0.09, 0.03, 0.07, 0.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{overflow: "hidden", background: C.sea, transformStyle: "preserve-3d"}}>
      <PaperOcean frame={frame}/>

      <SceneCamera track={CAMERA}>
        {(camera) => (
          <>
            <DepthLayer camera={camera} depth={0.22}>
              <ParticleField frame={frame} originX={620} originY={520} spreadX={980} spreadY={840} count={22} opacity={0.12}/>
            </DepthLayer>

            <DepthLayer camera={camera} depth={0.72}>
              <LandMasses/>
            </DepthLayer>

            <DepthLayer camera={camera} depth={0.94}>
              <AnimatedRoute frame={frame}/>
              <TankerRig frame={frame}/>
            </DepthLayer>

            <DepthLayer camera={camera} depth={1.18}>
              <ForegroundCurrent frame={frame}/>
            </DepthLayer>

            <DepthLayer camera={camera} depth={1.24}>
              <TariffMechanism frame={frame}/>
            </DepthLayer>
          </>
        )}
      </SceneCamera>

      <ScreenGraphics frame={frame}/>


      <AbsoluteFill
        style={{
          pointerEvents: "none",
          boxShadow: `inset 0 0 170px rgba(32,39,42,${vignette})`,
          zIndex: 30,
        }}
      />
    </AbsoluteFill>
  );
};
