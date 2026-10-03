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

export const PILOT_FRAMES = 330;

const T = {
  route: 30,
  ship: 58,
  oilCue: 104,
  tariffRig: 166,
  stamp: 216,
  matchCut: 268,
  bridge: 294,
};

const CAMERA = [
  {frame: 0, x: -8, y: 54, scale: 1.04, rotate: -0.65, tilt: 1.1},
  {frame: 52, x: -18, y: 66, scale: 1.10, rotate: 0.18, tilt: 0.55},
  {frame: 108, x: 12, y: 80, scale: 1.18, rotate: -0.42, tilt: 0.22},
  {frame: 176, x: -30, y: 104, scale: 1.28, rotate: -0.95, tilt: 0},
  {frame: 232, x: -80, y: 80, scale: 1.40, rotate: -1.30, tilt: 0},
  {frame: 288, x: -166, y: 16, scale: 1.57, rotate: -1.85, tilt: 0},
  {frame: 329, x: -176, y: 10, scale: 1.60, rotate: -1.95, tilt: 0},
];

const FLORIDA =
  "165.7,224.1 234.3,256.8 297.1,281.4 360,310 405.7,387.7 434.3,473.6 462.9,567.7 494.3,641.4 534.3,698.6 582.9,706.8 594.3,657.7 585.7,584.1 565.7,510.5 537.1,436.8 491.4,367.3 431.4,301.8 348.6,248.6 262.9,228.2";
const CUBA =
  "314.3,964.5 345.7,940 391.4,919.5 442.9,895 500,870.5 557.1,858.2 622.9,870.5 688.6,911.4 757.1,960.5 817.1,1030 877.1,1091.4 928.6,1115.9 877.1,1058.6 820,1038.2 745.7,1001.4 668.6,980.9 594.3,964.5 520,952.3 445.7,960.5 382.9,980.9";

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
        const y = 360 + i * 94;
        const phase = Math.sin(frame / 32 + i * 0.7) * 24;
        return (
          <path
            key={i}
            d={`M -120 ${y} C 120 ${y - 35 + phase}, 280 ${y + 28 - phase}, 520 ${y} S 880 ${y - 30 + phase * 0.4}, 1210 ${y + 8}`}
            fill="none"
            stroke="rgba(255,246,230,.19)"
            strokeWidth={4}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  </AbsoluteFill>
);

const LayeredLandMasses: React.FC = () => (
  <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: "absolute", inset: 0}}>
    <g fill={C.ink} opacity={0.15}>
      <polygon points={FLORIDA} transform="translate(24 30)"/>
      <polygon points={CUBA} transform="translate(25 31)"/>
    </g>
    <g fill={C.seaDark} opacity={0.55}>
      <polygon points={FLORIDA} transform="translate(14 18)"/>
      <polygon points={CUBA} transform="translate(15 19)"/>
    </g>
    <g fill="#698A65" stroke={C.ink} strokeWidth={11} strokeLinejoin="round">
      <polygon points={FLORIDA}/>
      <polygon points={CUBA}/>
    </g>

    <g fill="none" stroke={C.cream} strokeLinecap="round">
      <path d="M 208 266 C 305 289 383 335 426 405 C 456 454 472 522 510 610" strokeWidth={7} opacity={0.42}/>
      <path d="M 242 307 C 320 332 372 370 407 428 C 427 462 446 520 469 565" strokeWidth={4} opacity={0.22}/>
      <path d="M 365 959 C 486 906 604 901 720 949 C 777 972 826 1014 870 1063" strokeWidth={7} opacity={0.42}/>
      <path d="M 421 950 C 510 920 611 920 695 951 C 753 972 792 1001 830 1037" strokeWidth={4} opacity={0.22}/>
    </g>

    <g fill={C.green} stroke={C.ink} strokeWidth={6}>
      <ellipse cx="610" cy="705" rx="18" ry="38" transform="rotate(-18 610 705)"/>
      <ellipse cx="655" cy="765" rx="15" ry="31" transform="rotate(-18 655 765)"/>
      <ellipse cx="696" cy="825" rx="12" ry="25" transform="rotate(-18 696 825)"/>
    </g>
    <g fill="none" stroke="rgba(255,246,230,.35)" strokeWidth={3}>
      <ellipse cx="609" cy="700" rx="10" ry="25" transform="rotate(-18 610 705)"/>
      <ellipse cx="654" cy="761" rx="8" ry="19" transform="rotate(-18 655 765)"/>
    </g>

    <g fontFamily="Arial, sans-serif" fill={C.ink} fontWeight={900}>
      <text x="392" y="456" fontSize="31" transform="rotate(17 392 456)">FLORIDA</text>
      <text x="566" y="1048" fontSize="40" letterSpacing="4">CUBA</text>
    </g>
  </svg>
);

const AnimatedRoute: React.FC<{frame: number}> = ({frame}) => {
  const p = easeOutCubic(windowProgress(frame, T.route, T.route + 74));
  const dash = 900;
  const warning = windowProgress(frame, T.tariffRig + 24, T.stamp + 24);
  return (
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: "absolute", inset: 0}}>
      <path d="M -160 1170 C 110 1010 510 1000 825 1140" fill="none" stroke="rgba(32,39,42,.18)" strokeWidth={24} strokeLinecap="round"/>
      <path
        d="M -160 1170 C 110 1010 510 1000 825 1140"
        fill="none"
        stroke={warning > 0.45 ? C.red : C.mustard}
        strokeWidth={10 + Math.sin(frame / 8) * 0.8}
        strokeLinecap="round"
        strokeDasharray={dash}
        strokeDashoffset={dash * (1 - p)}
      />
      <path d="M -160 1170 C 110 1010 510 1000 825 1140" fill="none" stroke={C.cream} strokeWidth={3} strokeLinecap="round" strokeDasharray="10 20" opacity={0.58 * p}/>
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
  const launch = easeOutCubic(windowProgress(frame, T.ship, T.ship + 166));
  const point = cubicBezierPoint(launch, ROUTE.p0, ROUTE.p1, ROUTE.p2, ROUTE.p3);
  const tangent = cubicBezierTangent(launch, ROUTE.p0, ROUTE.p1, ROUTE.p2, ROUTE.p3);
  const angle = angleFromTangent(tangent) * 0.16;
  const bob = Math.sin(frame / 5.5) * 5;
  const pitch = Math.sin(frame / 12) * 1.05;
  const roll = Math.sin(frame / 18) * 0.8;
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
        width: 470,
        height: 240,
        transformOrigin: "38% 60%",
        transform: `translate(-50%,-50%) rotate(${angle + pitch}deg) skewY(${roll * 0.15}deg)`,
        filter: "drop-shadow(12px 16px 0 rgba(32,39,42,.14))",
      }}
    >
      <svg width="470" height="240" viewBox="0 0 470 240">
        <defs>
          <linearGradient id="hullGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#425E6A"/>
            <stop offset="64%" stopColor={C.navy}/>
            <stop offset="100%" stopColor="#293B44"/>
          </linearGradient>
        </defs>

        <path d="M18 121 H425 L381 180 Q220 198 72 181 Z" fill="rgba(32,39,42,.18)" transform="translate(8 10)"/>
        <path d="M18 112 H430 L385 174 Q222 193 68 176 Z" fill="url(#hullGradient)" stroke={C.ink} strokeWidth="10" strokeLinejoin="round"/>
        <path d="M70 176 Q225 190 385 174" fill="none" stroke={C.cream} strokeWidth="8" strokeLinecap="round" opacity={0.76}/>
        <path d="M55 116 L95 83 H330 L356 116" fill={C.paper2} stroke={C.ink} strokeWidth="8" strokeLinejoin="round"/>
        <path d="M99 83 H325" stroke={C.cream} strokeWidth="5" opacity={0.65}/>

        <g style={{
          transformOrigin: "215px 80px",
          transform: `translateY(${(1 - oilPop) * 38}px) scale(${0.58 + oilPop * 0.42}) rotate(${followThrough(frame, T.oilCue + 7, 7, 0.5, 0.12)}deg)`,
          opacity: oilPop,
        }}>
          <OilBarrelMini x={145} y={79} rotation={-6 + Math.sin(frame / 11) * 1.4}/>
          <OilBarrelMini x={207} y={77} rotation={4 + Math.sin(frame / 12 + 1) * 1.5}/>
          <OilBarrelMini x={269} y={79} rotation={-2 + Math.sin(frame / 13 + 2) * 1.3}/>
        </g>

        <rect x="350" y="57" width="60" height="62" rx="7" fill={C.cream} stroke={C.ink} strokeWidth="8"/>
        <path d="M362 72 H398 M362 87 H398" stroke={C.seaDark} strokeWidth="7" strokeLinecap="round"/>
        <rect x="369" y="27" width="11" height="32" fill={C.ink}/>
        <path d="M374 27 C 386 19 398 20 407 29" fill="none" stroke="rgba(255,246,230,.38)" strokeWidth="5" strokeLinecap="round"/>
        <path d="M82 123 H343" stroke="rgba(255,246,230,.26)" strokeWidth="4" strokeDasharray="18 13"/>
      </svg>
      <ParticleField frame={frame} originX={110} originY={194} spreadX={285} spreadY={58} count={22} opacity={0.46}/>
    </div>
  );
};

const ForegroundCurrent: React.FC<{frame: number}> = ({frame}) => {
  const drift = Math.sin(frame / 18) * 18;
  const drift2 = Math.cos(frame / 24) * 22;
  return (
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: "absolute", inset: 0}}>
      <defs>
        <linearGradient id="nearWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(79,133,152,.12)"/>
          <stop offset="100%" stopColor="rgba(52,75,87,.32)"/>
        </linearGradient>
      </defs>
      <path
        d={`M -160 ${1455 + drift} C 120 ${1375 + drift2}, 430 ${1505 - drift}, 710 ${1435 + drift2} S 1120 ${1360 + drift}, 1240 ${1470 + drift2} L 1240 2020 L -160 2020 Z`}
        fill="url(#nearWater)"
      />
      <path
        d={`M -120 ${1535 + drift2} C 180 ${1450 - drift}, 470 ${1570 + drift2}, 760 ${1490 - drift} S 1060 ${1445 + drift2}, 1220 ${1530 + drift}`}
        fill="none"
        stroke="rgba(255,246,230,.34)"
        strokeWidth="19"
        strokeLinecap="round"
      />
      <path
        d={`M -90 ${1610 - drift} C 230 ${1545 + drift2}, 510 ${1660 - drift2}, 860 ${1565 + drift} S 1120 ${1530 - drift2}, 1230 ${1600 + drift}`}
        fill="none"
        stroke="rgba(32,39,42,.12)"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d={`M -80 ${1710 + drift2} C 280 ${1620 - drift}, 610 ${1750 + drift}, 1180 ${1640 - drift2}`}
        fill="none"
        stroke="rgba(255,246,230,.16)"
        strokeWidth="34"
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
  const match = easeOutCubic(windowProgress(frame, T.matchCut, T.bridge + 8));
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
          transform: `perspective(900px) translate3d(${(1 - entry) * 240}px,${(1 - entry) * -125}px,${match * 250}px) rotateZ(${-16 + entry * 13 + swing}deg) rotateY(${match * 11}deg) rotateX(${match * 4}deg) scale(${1 + match * 3.0})`,
          opacity: entry,
          zIndex: 6,
        }}
      >
        <svg width="300" height="210" viewBox="0 0 300 210" style={{position: "absolute", left: -38, top: -178, overflow: "visible"}}>
          <path d="M150 205 C 125 135 180 92 142 22" fill="none" stroke={C.ink} strokeWidth="9" strokeLinecap="round"/>
          <path d="M153 204 C 130 140 182 97 146 28" fill="none" stroke="rgba(255,246,230,.24)" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        <div style={{
          position: "absolute",
          inset: 0,
          clipPath: "polygon(16% 0, 84% 0, 100% 15%, 100% 100%, 0 100%, 0 15%)",
          background: "linear-gradient(165deg, #E26B60 0%, #D95B52 58%, #C94C47 100%)",
          border: `9px solid ${C.ink}`,
          borderRadius: 16,
          boxShadow: "15px 18px 0 rgba(32,39,42,.18)",
        }}>
          <div style={{position: "absolute", left: 89, top: 13, width: 46, height: 46, borderRadius: "50%", background: C.paper2, border: `7px solid ${C.ink}`}}/>
          <div style={{position: "absolute", left: 25, top: 65, fontFamily: "Arial", fontSize: 23, fontWeight: 1000, letterSpacing: 3, color: C.cream}}>ARANCEL</div>
          <div style={{position: "absolute", left: 24, top: 108, fontFamily: "Arial", fontSize: 58, fontWeight: 1000, lineHeight: 0.82, color: C.cream}}>29<br/>ENE</div>
          <div style={{position: "absolute", left: 26, bottom: 25, fontFamily: "Arial", fontSize: 16, fontWeight: 900, color: C.ink}}>EO 14380</div>
          <path/>
        </div>
      </div>

      <div style={{
        position: "absolute",
        left: 610,
        top: 1145,
        width: 220,
        height: 72,
        transformOrigin: "center",
        transform: `scale(${0.76 + strike * 0.24}) translateY(${(1 - strike) * -34}px) rotate(-5deg)`,
        opacity: strike * (1 - windowProgress(frame, T.matchCut + 3, T.bridge)),
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
      }}>
        PETRÓLEO
      </div>
      <ImpactAction at={T.stamp + 3} x={720} y={1180} radius={145}/>
    </>
  );
};

const FebruaryBridge: React.FC<{frame: number}> = ({frame}) => {
  const takeover = easeOutCubic(windowProgress(frame, T.bridge - 10, T.bridge + 10));
  const page = easeOutCubic(windowProgress(frame, T.bridge + 4, PILOT_FRAMES - 1));
  const curl = 10 * (1 - page) + Math.sin((frame - T.bridge) / 6) * 2 * (1 - page);

  if (takeover <= 0) return null;

  return (
    <AbsoluteFill style={{zIndex: 26, pointerEvents: "none"}}>
      <AbsoluteFill style={{background: C.red, opacity: takeover}}/>
      <div
        style={{
          position: "absolute",
          left: -70,
          right: -70,
          top: 1920 - page * 1570,
          height: 1770,
          transformOrigin: "50% 0%",
          transform: `perspective(1000px) rotateX(${curl}deg) rotateZ(${(1 - page) * 1.4}deg)`,
          filter: "drop-shadow(0 -22px 0 rgba(32,39,42,.16))",
        }}
      >
        <svg width="1220" height="1770" viewBox="0 0 1220 1770" style={{position: "absolute", inset: 0}}>
          <path
            d="M0 86 L90 66 L170 91 L260 58 L352 84 L444 61 L548 88 L646 55 L754 84 L852 62 L948 92 L1044 60 L1138 84 L1220 65 L1220 1770 L0 1770 Z"
            fill={C.cream}
          />
          <rect x="0" y="86" width="1220" height="118" fill={C.red}/>
          <path d="M0 204 H1220" stroke={C.ink} strokeWidth="9" opacity={0.18}/>
          {[235, 610, 985].map((x) => (
            <g key={x}>
              <circle cx={x} cy="150" r="30" fill={C.paper2} stroke={C.ink} strokeWidth="8"/>
              <rect x={x - 10} y="95" width="20" height="82" rx="10" fill={C.ink}/>
            </g>
          ))}
          <path d="M150 330 H1070 M150 390 H980 M150 450 H1030" stroke={C.paper2} strokeWidth="18" strokeLinecap="round"/>
        </svg>
      </div>
    </AbsoluteFill>
  );
};

const ScreenGraphics: React.FC<{frame: number}> = ({frame}) => {
  const titleIn = spring({frame, fps: 30, config: {damping: 16, stiffness: 130, mass: 0.9}});
  const titleOut = 1 - windowProgress(frame, 82, 102);
  const pulse = 1 + Math.sin(frame / 17) * 0.006;
  return (
    <>
      <div style={{
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
      }}>2026</div>
      <div style={{
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
      }}/>
    </>
  );
};

export const AdvancedOpeningPilot: React.FC = () => {
  const frame = useCurrentFrame();
  const vignette = interpolate(frame, [0, 120, 260, 329], [0.09, 0.03, 0.07, 0.14], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{overflow: "hidden", background: C.sea, transformStyle: "preserve-3d"}}>
      <PaperOcean frame={frame}/>

      <SceneCamera track={CAMERA}>
        {(camera) => (
          <>
            <DepthLayer camera={camera} depth={0.18}>
              <ParticleField frame={frame} originX={620} originY={520} spreadX={980} spreadY={840} count={20} opacity={0.10}/>
            </DepthLayer>

            <DepthLayer camera={camera} depth={0.70}>
              <LayeredLandMasses/>
            </DepthLayer>

            <DepthLayer camera={camera} depth={0.94}>
              <AnimatedRoute frame={frame}/>
              <TankerRig frame={frame}/>
            </DepthLayer>

            <DepthLayer camera={camera} depth={1.19}>
              <ForegroundCurrent frame={frame}/>
            </DepthLayer>

            <DepthLayer camera={camera} depth={1.25}>
              <TariffMechanism frame={frame}/>
            </DepthLayer>
          </>
        )}
      </SceneCamera>

      <ScreenGraphics frame={frame}/>
      <FebruaryBridge frame={frame}/>

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
