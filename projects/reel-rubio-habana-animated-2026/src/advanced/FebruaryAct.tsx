import React from "react";
import {AbsoluteFill, spring} from "remotion";
import {
  CameraKeyframe,
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
  paperEdge: "#D8C6A2",
  ink: "#20272A",
  sea: "#6FA6B7",
  seaDark: "#4F8598",
  red: "#D95B52",
  mustard: "#D7A64A",
  green: "#7B9B72",
  navy: "#344B57",
  cream: "#FFF6E6",
  skin: "#F1C49D",
  hair: "#E7A83E",
  wood: "#76533B",
};

const START = 318;
const DATE = 338;
const BOAT = 370;
const ACTORS = 382;
const TUG = 428;
const LIFT = 452;
const CROSS = 486;
const END = 540;

const CAMERA: CameraKeyframe[] = [
  {frame: 318, x: -5, y: 20, scale: 1.02, rotate: 0.2, tilt: 0.4},
  {frame: 365, x: -12, y: 2, scale: 1.06, rotate: -0.2, tilt: 0.2},
  {frame: 438, x: 22, y: -34, scale: 1.13, rotate: 0.5, tilt: 0},
  {frame: 500, x: 0, y: 4, scale: 1.08, rotate: 0, tilt: 0},
  {frame: 539, x: 0, y: 0, scale: 1.02, rotate: 0, tilt: 0},
];

const springAt = (frame: number, at: number, stiffness = 165) =>
  spring({
    frame: Math.max(0, frame - at),
    fps: 30,
    config: {damping: 14, stiffness, mass: 0.85},
  });

const TrumpCutout: React.FC<{frame: number; tug: number}> = ({frame, tug}) => {
  const enter = springAt(frame, ACTORS, 145);
  const x = 82 - (1 - enter) * 230;
  const y = 935 + (1 - enter) * 115 + Math.sin(frame / 8) * 2;
  const lean = -3 - tug * 8 + followThrough(frame, LIFT, 4, 0.46, 0.09);
  const tagSwing = followThrough(frame, ACTORS + 12, 6, 0.42, 0.09);

  return (
    <g transform={"translate(" + x + " " + y + ") rotate(" + lean + " 125 245)"}>
      <path
        d="M25 465 L36 174 Q45 127 83 126 L168 128 Q208 135 218 178 L231 466 L210 484 L37 484 Z"
        fill="#D8C6A2"
        stroke={C.ink}
        strokeWidth="9"
        strokeLinejoin="round"
      />
      <path d="M34 463 L59 423 L98 426 L90 487 L37 487 Z" fill={C.navy} stroke={C.ink} strokeWidth="8"/>
      <path d="M137 426 L183 420 L220 465 L211 487 L144 487 Z" fill={C.navy} stroke={C.ink} strokeWidth="8"/>
      <path d="M35 181 Q42 144 82 137 L169 139 Q203 147 216 184 L228 426 Q188 407 132 415 Q76 405 30 429 Z" fill={C.navy} stroke={C.ink} strokeWidth="9" strokeLinejoin="round"/>
      <path d="M99 144 L145 145 L158 203 L122 281 L87 202 Z" fill={C.cream} stroke={C.ink} strokeWidth="5" strokeLinejoin="round"/>
      <path d="M113 184 L139 184 L151 317 L127 351 L101 316 Z" fill={C.red} stroke={C.ink} strokeWidth="5" strokeLinejoin="round"/>
      <path d="M43 193 Q71 225 84 291 L68 302 Q49 263 34 230 Z" fill={C.skin} stroke={C.ink} strokeWidth="7"/>
      <g transform={"rotate(" + (-4 - tug * 14) + " 188 205)"}>
        <path d="M183 175 Q213 196 222 245 L207 257 Q184 226 166 207 Z" fill={C.navy} stroke={C.ink} strokeWidth="8"/>
        <path d="M205 243 Q218 252 230 249" fill="none" stroke={C.skin} strokeWidth="18" strokeLinecap="round"/>
      </g>

      <g transform="translate(37 280) rotate(-13 55 15)">
        <path d="M0 9 L32 9 L39 3 L123 3 L140 -7 L158 -1 L158 18 L140 26 L123 18 L39 18 L32 24 L0 24 Z" fill={C.wood} stroke={C.ink} strokeWidth="7" strokeLinejoin="round"/>
        <path d="M-10 -1 L3 -18 L19 -10 L19 35 L3 43 L-10 27 Z" fill="#9A7656" stroke={C.ink} strokeWidth="7" strokeLinejoin="round"/>
        <path d="M45 8 L106 8 M46 18 L107 18" stroke="#C8A77B" strokeWidth="3"/>
        <path d="M91 20 Q94 41 77 45" fill="none" stroke={C.ink} strokeWidth="6" strokeLinecap="round"/>
      </g>

      <ellipse cx="128" cy="94" rx="58" ry="70" fill={C.skin} stroke={C.ink} strokeWidth="8"/>
      <path d="M72 89 Q52 42 95 25 Q138 1 184 34 Q207 54 185 72 Q161 52 137 58 Q110 67 72 89 Z" fill={C.hair} stroke={C.ink} strokeWidth="8" strokeLinejoin="round"/>
      <path d="M82 52 Q121 29 174 44" fill="none" stroke="#F4C464" strokeWidth="13" strokeLinecap="round"/>
      <path d="M99 94 L117 96 M141 95 L159 93" stroke={C.ink} strokeWidth="7" strokeLinecap="round"/>
      <ellipse cx="108" cy="108" rx="5" ry="8" fill={C.ink}/>
      <ellipse cx="151" cy="108" rx="5" ry="8" fill={C.ink}/>
      <path d="M124 106 L119 128 L132 130 M108 151 Q128 160 151 149" fill="none" stroke={C.ink} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>

      <g transform={"rotate(" + tagSwing + " 193 345)"}>
        <path d="M168 332 L222 332 L230 391 L174 397 Z" fill={C.mustard} stroke={C.ink} strokeWidth="6"/>
        <circle cx="179" cy="342" r="4" fill={C.ink}/>
        <text x="199" y="356" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="900" fill={C.ink}>TRUMP</text>
        <text x="199" y="376" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="9" fontWeight="900" fill={C.ink}>EDICIÓN ECONÓMICA</text>
      </g>
      <path d="M28 170 L43 161 M214 169 L228 177 M28 420 L43 412" stroke={C.paperEdge} strokeWidth="7" strokeLinecap="round"/>
    </g>
  );
};

const RubioCutout: React.FC<{frame: number}> = ({frame}) => {
  const enter = springAt(frame, ACTORS + 14, 150);
  const reaction = windowProgress(frame, TUG, LIFT);
  const x = 730 + (1 - enter) * 235;
  const y = 960 + (1 - enter) * 100 + reaction * 5;

  return (
    <g transform={"translate(" + x + " " + y + ") rotate(" + (2 + reaction * 3) + " 105 220)"}>
      <path d="M26 427 L45 156 Q59 127 99 128 L166 133 Q205 142 218 180 L219 447 L184 472 L43 469 Z" fill="#D8C6A2" stroke={C.ink} strokeWidth="9" strokeLinejoin="round"/>
      <path d="M37 435 L75 405 L111 419 L103 476 L42 478 Z" fill="#273C4A" stroke={C.ink} strokeWidth="8"/>
      <path d="M132 419 L175 405 L216 440 L199 477 L142 477 Z" fill="#273C4A" stroke={C.ink} strokeWidth="8"/>
      <path d="M34 177 Q48 140 90 136 L167 141 Q204 150 214 187 L220 421 Q179 400 127 409 Q76 400 30 426 Z" fill="#344B57" stroke={C.ink} strokeWidth="9" strokeLinejoin="round"/>
      <path d="M91 142 L139 145 L151 205 L118 279 L80 202 Z" fill={C.cream} stroke={C.ink} strokeWidth="5" strokeLinejoin="round"/>
      <path d="M105 185 L130 185 L141 307 L118 341 L95 306 Z" fill={C.red} stroke={C.ink} strokeWidth="5"/>
      <path d="M171 200 Q204 217 209 260 L194 270 Q177 245 155 229 Z" fill={C.skin} stroke={C.ink} strokeWidth="7"/>
      <rect x="147" y="246" width="99" height="132" rx="5" fill="#536B78" stroke={C.ink} strokeWidth="8" transform={"rotate(" + (-3 + reaction * 5) + " 194 312)"}/>
      <path d="M161 273 L231 273 M161 289 L222 289" stroke={C.cream} strokeWidth="5" strokeLinecap="round" transform={"rotate(" + (-3 + reaction * 5) + " 194 312)"}/>
      <text x="194" y="329" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="19" fontWeight="1000" fill={C.cream} transform={"rotate(" + (-3 + reaction * 5) + " 194 312)"}>STATE</text>

      <ellipse cx="124" cy="91" rx="55" ry="68" fill="#E9BD9C" stroke={C.ink} strokeWidth="8"/>
      <path d="M69 83 Q72 25 123 22 Q177 19 181 79 L160 66 Q134 55 93 68 Z" fill="#252A2C" stroke={C.ink} strokeWidth="8" strokeLinejoin="round"/>
      <path d="M91 93 L109 94 M137 94 L154 92" stroke={C.ink} strokeWidth="6" strokeLinecap="round"/>
      <ellipse cx="101" cy="106" rx="5" ry="7" fill={C.ink}/>
      <ellipse cx="145" cy="106" rx="5" ry="7" fill={C.ink}/>
      <path d="M124 105 L119 126 L132 128 M106 149 Q126 156 148 147" fill="none" stroke={C.ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>

      <path d="M77 371 L174 371 L174 405 L77 405 Z" fill={C.cream} stroke={C.ink} strokeWidth="5"/>
      <text x="125" y="395" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="17" fontWeight="900" fill={C.ink}>RUBIO</text>
    </g>
  );
};

const PaperHeader: React.FC<{frame: number}> = ({frame}) => {
  const stamp = springAt(frame, DATE, 190);
  const stampY = 478 - stamp * 66;
  const fade = 1 - windowProgress(frame, 488, 510);

  return (
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: "absolute", inset: 0}}>
      <path d="M0 125 L82 104 L165 128 L252 100 L340 125 L432 98 L522 124 L615 96 L707 122 L800 100 L895 126 L986 100 L1080 124 L1080 1920 L0 1920 Z" fill={C.cream} stroke={C.paperEdge} strokeWidth="8"/>
      <rect x="0" y="126" width="1080" height="112" fill={C.red}/>
      <path d="M0 238 H1080" stroke={C.ink} strokeWidth="8" opacity={0.2}/>
      {[125, 540, 955].map((x) => (
        <g key={x}>
          <circle cx={x} cy="183" r="22" fill={C.paperEdge} stroke={C.ink} strokeWidth="6"/>
          <rect x={x - 7} y="142" width="14" height="62" rx="7" fill={C.ink}/>
        </g>
      ))}
      <text x="88" y="355" fontFamily="Arial, sans-serif" fontWeight="1000" fontSize="92" fill={C.ink}>20 FEB</text>
      <path d="M92 379 H442" stroke={C.red} strokeWidth="12" strokeLinecap="round"/>
      <text x="94" y="432" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="25" letterSpacing="4" fill={C.navy}>ORDEN EJECUTIVA 14389</text>

      <g transform={"translate(680 " + stampY + ") rotate(-7 138 40)"} opacity={fade}>
        <rect x="0" y="0" width="276" height="78" rx="8" fill={C.paper} stroke={C.red} strokeWidth="9"/>
        <text x="138" y="50" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="1000" fontSize="28" letterSpacing="3" fill={C.red}>TARIFAS IEEPA</text>
      </g>
      <path d="M84 515 H996" stroke={C.paperEdge} strokeWidth="4"/>
    </svg>
  );
};

const TradeMechanism: React.FC<{frame: number}> = ({frame}) => {
  const draw = easeOutCubic(windowProgress(frame, BOAT, BOAT + 48));
  const approach = windowProgress(frame, BOAT + 4, 420);
  const pass = easeOutCubic(windowProgress(frame, CROSS, CROSS + 32));
  const shipX = 95 + 255 * approach + 600 * pass;
  const shipY = 1438 + Math.sin(frame / 5) * 4;
  const open = easeOutCubic(windowProgress(frame, LIFT, LIFT + 36));
  const tug = windowProgress(frame, TUG, LIFT);
  const armAngle = -86 * open;
  const tagOpacity = 1 - windowProgress(frame, LIFT + 4, CROSS);

  return (
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: "absolute", inset: 0, overflow: "visible"}}>
      <path d="M60 1435 C210 1380 350 1403 481 1421 S790 1485 1030 1418" fill="none" stroke="rgba(32,39,42,.18)" strokeWidth="32" strokeLinecap="round"/>
      <path d="M60 1435 C210 1380 350 1403 481 1421 S790 1485 1030 1418" fill="none" stroke={C.mustard} strokeWidth="11" strokeDasharray="1000" strokeDashoffset={1000 * (1 - draw)} strokeLinecap="round"/>
      <path d="M60 1435 C210 1380 350 1403 481 1421 S790 1485 1030 1418" fill="none" stroke={C.cream} strokeWidth="4" strokeDasharray="10 22" strokeDashoffset={1000 * (1 - draw)} strokeLinecap="round" opacity={0.8 * draw}/>

      <g transform={"translate(" + shipX + " " + shipY + ")"}>
        <ellipse cx="118" cy="38" rx="145" ry="28" fill="rgba(32,39,42,.15)"/>
        <path d="M0 0 H256 L224 52 Q117 69 31 52 Z" fill={C.navy} stroke={C.ink} strokeWidth="8" strokeLinejoin="round"/>
        <path d="M30 -2 L65 -37 H192 L221 -2 Z" fill={C.paperEdge} stroke={C.ink} strokeWidth="7" strokeLinejoin="round"/>
        <rect x="185" y="-62" width="48" height="61" rx="4" fill={C.cream} stroke={C.ink} strokeWidth="7"/>
        <path d="M197 -45 H221 M197 -29 H221" stroke={C.seaDark} strokeWidth="6" strokeLinecap="round"/>
        {[89, 130, 171].map((x) => (
          <g key={x}>
            <rect x={x - 14} y="-29" width="28" height="30" rx="7" fill={C.mustard} stroke={C.ink} strokeWidth="5"/>
            <path d={"M" + (x - 10) + " -15 H" + (x + 10)} stroke={C.red} strokeWidth="4"/>
          </g>
        ))}
        <path d="M12 55 Q95 72 218 55" fill="none" stroke={C.cream} strokeWidth="6" strokeLinecap="round" opacity="0.8"/>
      </g>

      <path d={"M" + (286 + tug * 52) + " " + (1188 - tug * 52) + " Q420 1228 557 1335"} fill="none" stroke={C.ink} strokeWidth="9" strokeLinecap="round"/>
      <path d={"M" + (290 + tug * 52) + " " + (1188 - tug * 52) + " Q426 1229 559 1335"} fill="none" stroke={C.paperEdge} strokeWidth="3" strokeLinecap="round"/>

      <g transform="rotate(-5 560 1350)">
        <rect x="524" y="1318" width="74" height="64" rx="18" fill={C.navy} stroke={C.ink} strokeWidth="8"/>
        <circle cx="561" cy="1350" r="10" fill={C.mustard} stroke={C.ink} strokeWidth="5"/>
      </g>
      <g transform={"rotate(" + armAngle + " 560 1350)"}>
        <rect x="559" y="1328" width="420" height="44" rx="18" fill={C.cream} stroke={C.ink} strokeWidth="8"/>
        {[608, 700, 792, 884].map((x) => (
          <path key={x} d={"M" + x + " 1330 L" + (x + 32) + " 1370 M" + (x + 32) + " 1330 L" + x + " 1370"} stroke={C.red} strokeWidth="13"/>
        ))}
        <g transform={"translate(716 1374) rotate(" + (armAngle * 0.32) + ")"} opacity={tagOpacity}>
          <path d="M0 0 L145 0 L136 87 L9 83 Z" fill={C.red} stroke={C.ink} strokeWidth="7"/>
          <text x="72" y="36" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="1000" fontSize="16" fill={C.cream}>ARANCEL</text>
          <text x="72" y="61" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="1000" fontSize="13" fill={C.cream}>IEEPA</text>
        </g>
      </g>

      <path d={"M0 1624 C190 " + (1560 - pass * 34) + " 400 " + (1660 + pass * 20) + " 610 1615 S920 1577 1080 1650 L1080 1920 L0 1920 Z"} fill="rgba(79,133,152,.22)"/>
      <path d={"M-30 1653 C190 " + (1595 - pass * 24) + " 440 " + (1690 + pass * 15) + " 650 1650 S925 1610 1110 1680"} fill="none" stroke="rgba(255,246,230,.48)" strokeWidth="17" strokeLinecap="round"/>
    </svg>
  );
};

const ActionScene: React.FC<{frame: number}> = ({frame}) => {
  const tug = easeOutCubic(windowProgress(frame, TUG, LIFT));
  return (
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: "absolute", inset: 0, overflow: "visible"}}>
      <path d="M100 1250 C230 1158 365 1167 487 1218 C633 1277 764 1280 930 1207 L970 1406 C813 1464 681 1445 538 1390 C395 1335 259 1350 118 1430 Z" fill="#6D8A67" stroke={C.ink} strokeWidth="8" strokeLinejoin="round"/>
      <path d="M157 1287 C299 1229 424 1244 536 1291 C671 1348 783 1350 903 1304" fill="none" stroke={C.cream} strokeWidth="7" opacity="0.45" strokeLinecap="round"/>

      <TrumpCutout frame={frame} tug={tug}/>
      <RubioCutout frame={frame}/>

      <g opacity={windowProgress(frame, BOAT, BOAT + 24)}>
        <path d={"M278 1244 Q388 " + (1217 - tug * 28) + " 504 1320"} fill="none" stroke={C.ink} strokeWidth="5" strokeDasharray="7 13"/>
        <circle cx="286" cy="1241" r="9" fill={C.red} stroke={C.ink} strokeWidth="4"/>
      </g>
    </svg>
  );
};

const FebruaryPaper: React.FC<{frame: number}> = ({frame}) => {
  const rise = springAt(frame, START, 150);
  const drift = (1 - rise) * 230;
  const tilt = (1 - rise) * 3 + followThrough(frame, START + 8, 1.8, 0.42, 0.08);

  return (
    <AbsoluteFill style={{
      background: C.red,
      overflow: "hidden",
      transformOrigin: "50% 100%",
      transform: "translateY(" + drift + "px) rotateX(" + tilt + "deg)",
      filter: "drop-shadow(0 -18px 0 rgba(32,39,42,.16))",
    }}>
      <AbsoluteFill style={{background: C.paper, opacity: 0.96}}/>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: "absolute", inset: 0}}>
        <path d="M0 128 L79 108 L164 132 L248 106 L338 130 L430 103 L520 129 L614 103 L706 131 L800 106 L892 132 L982 106 L1080 128" fill="none" stroke={C.paperEdge} strokeWidth="20" strokeLinejoin="round"/>
        <path d="M0 1840 L79 1820 L164 1844 L248 1818 L338 1842 L430 1815 L520 1841 L614 1815 L706 1843 L800 1818 L892 1844 L982 1818 L1080 1840" fill="none" stroke={C.paperEdge} strokeWidth="20" strokeLinejoin="round"/>
      </svg>
    </AbsoluteFill>
  );
};

export const FebruaryAct: React.FC<{frame: number}> = ({frame}) => {
  if (frame < START) return null;

  const burst = windowProgress(frame, LIFT, LIFT + 12) * (1 - windowProgress(frame, LIFT + 12, CROSS));

  return (
    <AbsoluteFill style={{zIndex: 27, overflow: "hidden", pointerEvents: "none"}}>
      <FebruaryPaper frame={frame}/>
      <SceneCamera track={CAMERA}>
        {(camera) => (
          <>
            <DepthLayer camera={camera} depth={0.24}>
              <PaperHeader frame={frame}/>
            </DepthLayer>
            <DepthLayer camera={camera} depth={0.72}>
              <ActionScene frame={frame}/>
              <TradeMechanism frame={frame}/>
            </DepthLayer>
            <DepthLayer camera={camera} depth={1.13} style={{opacity: burst * 0.65}}>
              <ParticleField frame={frame} originX={560} originY={1360} spreadX={220} spreadY={90} count={14} opacity={0.45}/>
            </DepthLayer>
          </>
        )}
      </SceneCamera>
      <ImpactAction at={LIFT} x={560} y={1350} radius={120}/>
    </AbsoluteFill>
  );
};
