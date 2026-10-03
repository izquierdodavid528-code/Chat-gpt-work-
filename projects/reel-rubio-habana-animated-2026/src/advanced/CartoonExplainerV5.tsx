import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame} from "remotion";

const W = 1080;
const H = 1920;
export const CARTOON_FILM_FRAMES = 1800;
const C = {
  ink: "#25313A", paper: "#F6EBD4", cream: "#FFF8E9", red: "#D95B52",
  redDark: "#B94640", blue: "#5D91A0", blueDeep: "#365F6E",
  green: "#78966C", greenLight: "#A9BC8E", gold: "#E4B455",
  skin: "#F0C39F", white: "#FFFFFF", wood: "#805A3D", navy: "#344B58",
};
const clamp = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => { const p = clamp(v); return p * p * (3 - 2 * p); };
const prog = (f: number, a: number, b: number) => smooth((f - a) / Math.max(1, b - a));
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
const pulse = (f: number, period = 27, phase = 0) => Math.sin(f / period + phase);
const pop = (f: number, at: number, stiffness = 150) =>
  spring({frame: Math.max(0, f - at), fps: 30, config: {damping: 15, stiffness, mass: 0.82}});
const visibility = (f: number, start: number, end: number, fade = 32) =>
  prog(f, start, start + fade) * (1 - prog(f, end - fade, end));
const txt = (x: number, y: number, size: number, children: React.ReactNode, fill = C.ink, weight = 900, rotate = 0) => (
  <text x={x} y={y} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight={weight}
    fontSize={size} fill={fill} transform={rotate ? "rotate(" + rotate + " " + x + " " + y + ")" : undefined}
    paintOrder="stroke" stroke={C.paper} strokeWidth={size > 35 ? 4 : 2} strokeLinejoin="round">{children}</text>
);
const Label: React.FC<{x:number;y:number;f:number;date:string;sub?:string;angle?:number}> = ({x,y,f,date,sub,angle=0}) => {
  const p=pop(f,0,185);
  return <g transform={"translate("+x+" "+(y+(1-p)*130)+") rotate("+angle+") scale("+(.74+p*.26)+")"} opacity={p}>
    <path d="M-128 -54 Q-120 -73 -98 -67 L112 -64 Q136 -59 132 -37 L123 54 Q119 70 96 66 L-111 63 Q-137 59 -131 37 Z" fill={C.cream} stroke={C.ink} strokeWidth="7"/>
    <path d="M-104 -40 L-88 -47 M92 45 L108 38" stroke={C.red} strokeWidth="7" strokeLinecap="round"/>
    {txt(0,8,48,date,C.red)}
    {sub&&txt(0,42,15,sub,C.ink,800)}
  </g>;
};

const Figure: React.FC<{kind:"trump"|"rubio";x:number;y:number;s?:number;f:number;pose?:number;walk?:number;reaction?:number}> =
({kind,x,y,s=1,f,pose=0,walk=0,reaction=0})=>{
  const isTrump=kind==="trump";
  const bob=Math.sin(f/5.3+pose)*5;
  const step=Math.sin(f/4.8+walk)*12;
  const armA=-18+Math.sin(f/8+pose)*8+reaction*12;
  const armB=18+Math.sin(f/8+pose+1.2)*9-reaction*14;
  const mouth=Math.abs(Math.sin(f/3.5+pose))*(0.18+Math.min(.55,reaction*.3));
  const blink=(f%137>129&&f%137<133)?0.25:1;
  const coat=isTrump?C.navy:"#3C5562";
  const hair=isTrump?"#E6AE46":"#302D2C";
  return <g transform={"translate("+x+" "+(y+bob)+") scale("+s+")"}>
    <ellipse cx="0" cy="518" rx="135" ry="19" fill="#25313A" opacity=".13"/>
    <g transform={"rotate("+(-step)+" -42 414)"}>
      <path d="M-105 399 L-57 400 L-68 507 L-112 507 Z" fill={coat} stroke={C.ink} strokeWidth="9" strokeLinejoin="round"/>
      <path d="M-28 401 L28 399 L63 504 L18 510 Z" fill={coat} stroke={C.ink} strokeWidth="9" strokeLinejoin="round"/>
      <path d="M-127 495 Q-87 484 -57 501 L-60 522 L-139 522 Q-153 517 -145 507 Z" fill={C.wood} stroke={C.ink} strokeWidth="7"/>
      <path d="M5 501 Q47 483 77 500 L91 519 L14 523 Q-1 518 5 501 Z" fill={C.wood} stroke={C.ink} strokeWidth="7"/>
    </g>
    <path d="M-120 200 Q-96 150 -47 148 L50 150 Q105 161 121 215 L106 425 Q22 453 -112 425 Z" fill={coat} stroke={C.ink} strokeWidth="10" strokeLinejoin="round"/>
    <path d="M-55 158 L8 158 L37 221 L-3 282 L-54 219 Z" fill={C.cream} stroke={C.ink} strokeWidth="5"/>
    <path d="M-19 205 L13 207 L29 339 L2 367 L-28 338 Z" fill={isTrump?C.red:C.gold} stroke={C.ink} strokeWidth="6"/>
    <path d="M-95 220 Q-136 259 -116 328 L-92 329 L-71 254 Z" fill={coat} stroke={C.ink} strokeWidth="9"/>
    <g transform={"rotate("+armA+" -110 305)"}>
      <path d="M-119 276 Q-96 311 -105 365" fill="none" stroke={coat} strokeWidth="31" strokeLinecap="round"/>
      <path d="M-106 357 Q-93 367 -78 360" fill="none" stroke={C.skin} strokeWidth="22" strokeLinecap="round"/>
    </g>
    <g transform={"rotate("+armB+" 93 230)"}>
      <path d="M91 216 Q129 252 112 316" fill="none" stroke={coat} strokeWidth="32" strokeLinecap="round"/>
      <path d="M110 306 Q121 320 137 309" fill="none" stroke={C.skin} strokeWidth="22" strokeLinecap="round"/>
    </g>
    {isTrump&&<g transform="translate(-148 329) rotate(-8)">
      <path d="M-12 22 L28 22 L38 10 L133 10 L164 -7 L182 0 L182 35 L163 42 L132 28 L39 28 L28 40 L-12 40 Z" fill={C.wood} stroke={C.ink} strokeWidth="7" strokeLinejoin="round"/>
      <path d="M-23 10 L-4 -7 L15 1 L15 53 L-4 60 L-23 42 Z" fill="#A47A51" stroke={C.ink} strokeWidth="7"/>
      <path d="M-2 5 L-2 47" stroke={C.gold} strokeWidth="4"/>
    </g>}
    <path d="M-78 90 Q-83 12 -21 7 Q52 -5 80 52 L74 116 Q40 145 0 145 Q-60 139 -78 90 Z" fill={C.skin} stroke={C.ink} strokeWidth="9"/>
    {isTrump?
      <path d="M-83 72 Q-105 7 -44 -18 Q6 -39 61 -4 Q92 15 75 44 Q50 25 26 29 Q-5 36 -42 68 Q-63 86 -83 72 Z" fill={hair} stroke={C.ink} strokeWidth="9" strokeLinejoin="round"/>:
      <path d="M-80 75 Q-80 8 -26 -9 Q38 -25 76 30 L71 66 Q30 34 -8 41 Q-43 43 -80 75 Z" fill={hair} stroke={C.ink} strokeWidth="9" strokeLinejoin="round"/>}
    {isTrump&&<path d="M-60 17 Q-12 -10 54 9" fill="none" stroke="#F8D16F" strokeWidth="12" strokeLinecap="round"/>}
    <g opacity={blink}>
      <path d="M-51 83 L-28 86 M16 85 L42 81" stroke={C.ink} strokeWidth="7" strokeLinecap="round"/>
      <ellipse cx="-40" cy="99" rx="5" ry="7" fill={C.ink}/><ellipse cx="30" cy="98" rx="5" ry="7" fill={C.ink}/>
    </g>
    <path d="M-4 95 L-12 122 L4 125" fill="none" stroke={C.ink} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d={mouth>.2?"M-27 137 Q0 "+(133+mouth*20)+" 27 135":"M-26 137 Q0 151 27 135"} fill="none" stroke={C.ink} strokeWidth="6" strokeLinecap="round"/>
    {isTrump&&<g transform="translate(44 299) rotate(7)">
      <path d="M0 0 H70 L79 74 L9 79 Z" fill={C.gold} stroke={C.ink} strokeWidth="6"/>
      {txt(39,32,13,"TRUMP",C.ink)}
      {txt(39,53,8,"EDICIÓN ECONÓMICA",C.ink,800)}
    </g>}
    {!isTrump&&<g transform="translate(37 287) rotate(-5)">
      <rect x="0" y="0" width="83" height="112" rx="5" fill={C.blueDeep} stroke={C.ink} strokeWidth="7"/>
      <path d="M15 20 H68 M15 34 H62" stroke={C.cream} strokeWidth="5" strokeLinecap="round"/>
      {txt(41,72,18,"STATE",C.cream)}
    </g>}
  </g>;
};

const Boat: React.FC<{x:number;y:number;f:number;s?:number}> = ({x,y,f,s=1})=>{
  const bob=pulse(f,5)*4;
  return <g transform={"translate("+x+" "+(y+bob)+") scale("+s+")"}>
    <path d="M-158 18 H161 L126 79 Q0 105 -122 77 Z" fill={C.blueDeep} stroke={C.ink} strokeWidth="9" strokeLinejoin="round"/>
    <path d="M-113 14 L-72 -29 L83 -29 L118 16 Z" fill={C.paper} stroke={C.ink} strokeWidth="8" strokeLinejoin="round"/>
    <rect x="74" y="-70" width="43" height="43" rx="5" fill={C.cream} stroke={C.ink} strokeWidth="7"/>
    <path d="M83 -56 H106 M83 -43 H106" stroke={C.blue} strokeWidth="5" strokeLinecap="round"/>
    {[-62,-18,26].map((cx,i)=><g key={i} transform={"translate("+cx+" -30)"}>
      <rect x="-16" y="0" width="32" height="37" rx="7" fill={C.gold} stroke={C.ink} strokeWidth="5"/>
      <path d="M-10 16 H10" stroke={C.red} strokeWidth="4"/>
    </g>)}
    <path d="M-110 93 Q0 108 133 88" fill="none" stroke={C.cream} strokeWidth="7" strokeLinecap="round"/>
    <path d="M-175 112 Q-100 94 -33 112 T105 111 T212 111" fill="none" stroke={C.blue} strokeWidth="7" opacity=".55"/>
  </g>;
};

const SceneBase: React.FC<{f:number;tint?:string}> = ({f,tint=C.paper})=><g>
  <rect width={W} height={H} fill={tint}/>
  <path d="M0 1140 Q160 1090 330 1138 T700 1134 T1080 1120 L1080 1920 L0 1920 Z" fill={C.blue} opacity=".24"/>
  <path d={"M-40 "+(1240+pulse(f,19)*11)+" Q220 "+(1178+pulse(f,17,1)*15)+" 485 "+(1240+pulse(f,20,2)*12)+" T1110 "+(1224+pulse(f,22,3)*14)} fill="none" stroke={C.cream} strokeWidth="17" strokeLinecap="round" opacity=".75"/>
  <path d={"M-40 "+(1328+pulse(f,23,1)*12)+" Q230 "+(1272+pulse(f,20,2)*16)+" 500 "+(1332+pulse(f,19,3)*12)+" T1110 "+(1308+pulse(f,21,4)*12)} fill="none" stroke={C.blueDeep} strokeWidth="8" strokeLinecap="round" opacity=".36"/>
</g>;

const Intro: React.FC<{f:number}> = ({f})=>{
  const move=prog(f,0,260), route=prog(f,30,270);
  const sx=mix(-240,510,move);
  return <g opacity={visibility(f,0,325,35)}>
    <SceneBase f={f} tint="#E7F0E8"/>
    <path d="M89 505 Q209 375 380 420 L493 496 L453 683 L343 785 L197 731 L103 644 Z" fill={C.greenLight} stroke={C.ink} strokeWidth="10" strokeLinejoin="round"/>
    <path d="M503 897 Q611 820 733 853 Q856 888 970 1014 L919 1090 L791 1039 L673 1007 L544 1002 Z" fill={C.green} stroke={C.ink} strokeWidth="10" strokeLinejoin="round"/>
    <path d="M423 578 C506 644 565 747 640 863" fill="none" stroke={C.cream} strokeWidth="16" strokeLinecap="round"/>
    <path d="M435 581 C515 650 575 752 647 862" fill="none" stroke={C.gold} strokeWidth="5" strokeDasharray="13 18" strokeDashoffset={route*180}/>
    {txt(281,570,34,"FLORIDA",C.ink)}
    {txt(751,969,40,"CUBA",C.ink)}
    <path d="M0 1024 C210 940 378 1016 536 963 S862 1010 1080 929" fill="none" stroke={C.gold} strokeWidth="10" strokeDasharray="1200" strokeDashoffset={1200*(1-route)} strokeLinecap="round"/>
    <Boat x={sx} y={1005+Math.sin(f/7)*4} f={f} s={.82}/>
    <g transform={"translate(540 220) scale("+(.7+pop(f,12)*.3)+")"} opacity={pop(f,12)}>
      {txt(0,0,88,"CUBA",C.red,1000)}
      {txt(0,62,31,"LA PRESIÓN CAMBIA",C.ink,900)}
      <path d="M-194 91 Q0 122 194 91" fill="none" stroke={C.gold} strokeWidth="12" strokeLinecap="round"/>
    </g>
    <Figure kind="trump" x={760} y={707} s={.53} f={f} pose={1} reaction={prog(f,140,220)}/>
    <Label x={230} y={883} f={f-120} date="2026" sub="PRESIÓN SOBRE LA HABANA" angle={-7}/>
  </g>;
};

const January: React.FC<{f:number}> = ({f})=>{
  const gate=prog(f,300,470);
  const stamp=pop(f,352,205);
  const bx=mix(-240,390,prog(f,260,505));
  return <g opacity={visibility(f,245,620,42)}>
    <SceneBase f={f} tint="#EEE5D3"/>
    <path d="M-50 900 Q220 842 463 902 T1110 870 L1110 1102 Q814 1154 554 1108 T-50 1128 Z" fill={C.green} stroke={C.ink} strokeWidth="10"/>
    <path d="M40 1020 H1040" stroke={C.gold} strokeWidth="21" strokeLinecap="round"/>
    <path d="M42 1020 H1038" stroke={C.cream} strokeWidth="6" strokeDasharray="16 28"/>
    <Boat x={bx} y={1003} f={f} s={.9}/>
    <g transform={"translate(726 950) rotate("+(-82*gate)+" 0 0)"}>
      <rect x="-17" y="-310" width="34" height="362" rx="16" fill={C.cream} stroke={C.ink} strokeWidth="8"/>
      {[ -240,-150,-60].map((y,i)=><path key={i} d={"M-9 "+y+" L9 "+(y+18)+" M9 "+y+" L-9 "+(y+18)} stroke={C.red} strokeWidth="8"/>)}
    </g>
    <circle cx="726" cy="950" r="28" fill={C.gold} stroke={C.ink} strokeWidth="9"/>
    <Figure kind="trump" x={818} y={591} s={.68} f={f} pose={2} reaction={prog(f,355,414)}/>
    <Label x={283} y={495} f={f-278} date="29 ENE" sub="ORDEN EJECUTIVA 14380" angle={-5}/>
    <g transform={"translate(606 739) rotate("+(-8+Math.sin(f/9)*9)+" 0 0)"} opacity={stamp}>
      <path d="M-95 -52 L95 -52 L85 53 L-87 55 Z" fill={C.red} stroke={C.ink} strokeWidth="8"/>
      {txt(0,9,33,"ARANCEL",C.cream)}
      {txt(0,39,16,"AL PETRÓLEO",C.cream,900)}
    </g>
    <path d="M828 801 Q858 827 868 863" fill="none" stroke={C.ink} strokeWidth="12" strokeLinecap="round"/>
  </g>;
};

const February: React.FC<{f:number}> = ({f})=>{
  const lift=prog(f,615,735);
  const page=prog(f,560,695);
  return <g opacity={visibility(f,560,940,42)}>
    <SceneBase f={f} tint="#F4E8CD"/>
    <path d="M0 1140 Q185 1060 359 1113 T728 1090 T1080 1082" fill="none" stroke={C.green} strokeWidth="40" strokeLinecap="round"/>
    <Boat x={mix(145,795,prog(f,600,864))} y={1070+Math.sin(f/5)*4} f={f} s={.78}/>
    <g transform="translate(722 954)">
      <circle r="32" fill={C.gold} stroke={C.ink} strokeWidth="9"/>
      <g transform={"rotate("+(-87*lift)+")"}>
        <rect x="10" y="-19" width="330" height="38" rx="18" fill={C.cream} stroke={C.ink} strokeWidth="8"/>
        {[80,150,220,290].map((x,i)=><path key={i} d={"M"+x+" -13 L"+(x+24)+" 13 M"+(x+24)+" -13 L"+x+" 13"} stroke={C.red} strokeWidth="8"/>)}
      </g>
    </g>
    <g transform={"translate(290 469) rotate("+(-8+page*8)+" 0 0)"} opacity={1-page*.35}>
      <path d="M-131 -102 Q-121 -124 -100 -119 L103 -119 Q128 -116 130 -92 L117 93 Q115 113 90 114 L-108 109 Q-132 102 -131 82 Z" fill={C.cream} stroke={C.ink} strokeWidth="9"/>
      {txt(0,7,54,"20 FEB",C.red,1000)}
      {txt(0,53,17,"ORDEN EJECUTIVA 14389",C.ink)}
      <path d="M-91 -92 L-64 -104 M69 99 L96 88" stroke={C.gold} strokeWidth="9" strokeLinecap="round"/>
    </g>
    <path d="M746 833 Q689 808 647 782" fill="none" stroke={C.red} strokeWidth="9" strokeDasharray="12 14"/>
    <g opacity={prog(f,707,780)}>
      {txt(846,711,32,"SE RETIRAN",C.red,1000)}
      {txt(846,750,22,"LOS ARANCELES IEEPA",C.ink,900)}
    </g>
    <Figure kind="trump" x={125} y={742} s={.53} f={f} pose={1} reaction={prog(f,700,740)}/>
    <Figure kind="rubio" x={896} y={777} s={.47} f={f} pose={.5} reaction={prog(f,722,785)}/>
    <g transform={"translate(151 1085) rotate(-8)"} opacity=".8">
      {txt(0,0,19,"SE MUESTRA LA VÍA ARANCELARIA",C.red,900)}
      {txt(0,28,14,"NO DESAPARECEN TODAS LAS AUTORIDADES SOBRE CUBA",C.ink,800)}
    </g>
  </g>;
};

const MayOrder: React.FC<{f:number}> = ({f})=>{
  const unfold=prog(f,870,1050);
  const tool=pop(f,948,160);
  const cardX=mix(-540,528,unfold);
  const icons=[["ENERGÍA",0],["FINANZAS",1],["METALES",2],["SEGURIDAD",3]];
  return <g opacity={visibility(f,855,1240,42)}>
    <SceneBase f={f} tint="#E8E9D9"/>
    <path d="M70 963 C215 857 350 914 457 970 S777 1061 1015 934" fill="none" stroke={C.gold} strokeWidth="12" strokeDasharray="9 18" strokeLinecap="round"/>
    <g transform={"translate("+cardX+" 730) rotate("+(-5+Math.sin(f/29)*1.5)+" 0 0)"}>
      <path d="M-310 -246 Q-295 -269 -270 -265 L277 -256 Q304 -250 302 -224 L287 221 Q283 248 255 246 L-280 230 Q-309 225 -307 198 Z" fill={C.cream} stroke={C.ink} strokeWidth="10"/>
      <path d="M-290 -194 Q0 -214 271 -192" fill="none" stroke={C.red} strokeWidth="14" strokeLinecap="round"/>
      {txt(0,-112,52,"1 DE MAYO",C.red,1000)}
      {txt(0,-56,22,"ORDEN EJECUTIVA 14404",C.ink)}
      {txt(0,4,17,"CASA BLANCA",C.blueDeep,900)}
      {txt(0,168,17,"FUNCIONES DELEGADAS A ESTADO Y TESORO",C.ink,900)}
      {icons.map(([label,i])=>{
        const ix=Number(i);
        const xx=-198+ix*132;
        const p=pop(f,960+ix*13);
        return <g key={label} transform={"translate("+xx+" "+(85+(1-p)*90)+") scale("+(.5+p*.5)+")"} opacity={p}>
          <circle r="39" fill={[C.gold,C.blue,C.red,C.green][ix]} stroke={C.ink} strokeWidth="7"/>
          {ix===0&&<path d="M-6 18 C-19 -1 -4 -20 3 -29 C19 -9 19 8 6 18 C3 25 -8 25 -6 18 Z" fill={C.cream}/>}
          {ix===1&&<path d="M-23 -5 H23 V20 H-23 Z M-15 -12 V-22 H15 V-12 M-12 3 H-2 M5 3 H15" fill="none" stroke={C.cream} strokeWidth="5"/>}
          {ix===2&&<path d="M-17 -20 L4 -27 L22 0 L8 22 L-19 17 Z" fill={C.cream}/>}
          {ix===3&&<path d="M0 -24 L23 -12 L17 15 L0 26 L-17 15 L-23 -12 Z" fill="none" stroke={C.cream} strokeWidth="6"/>}
          {txt(0,67,12,label,C.ink,900)}
        </g>;
      })}
    </g>
    <Figure kind="rubio" x={822} y={802} s={.52} f={f} pose={2} reaction={prog(f,960,1010)}/>
    <g transform={"translate(797 1090) rotate(-7)"} opacity={tool}>
      <path d="M-86 -30 H86 L95 41 L-92 42 Z" fill={C.blueDeep} stroke={C.ink} strokeWidth="7"/>
      {txt(0,9,25,"STATE",C.cream)}
      {txt(0,33,12,"RECIBE HERRAMIENTAS",C.cream,800)}
    </g>
    <g transform={"translate(279 1080)"} opacity={tool}>
      <path d="M-83 -42 H83 L96 41 L-92 41 Z" fill={C.gold} stroke={C.ink} strokeWidth="7"/>
      {txt(0,7,23,"TESORO",C.ink)}
      {txt(0,31,12,"RECIBE HERRAMIENTAS",C.ink,800)}
    </g>
  </g>;
};

const Bank: React.FC<{f:number;x:number;y:number}> = ({f,x,y})=>{
  const door=10+Math.sin(f/9)*2;
  return <g transform={"translate("+x+" "+y+")"}>
    <path d="M-210 -80 L0 -192 L210 -80 Z" fill={C.red} stroke={C.ink} strokeWidth="10" strokeLinejoin="round"/>
    <path d="M-190 -76 H190 V150 H-190 Z" fill="#E9D5B5" stroke={C.ink} strokeWidth="10"/>
    {[-128,-43,43,128].map((xx,i)=><g key={i}>
      <rect x={xx-25} y="-48" width="50" height="140" rx="23" fill={C.cream} stroke={C.ink} strokeWidth="7"/>
      <path d={"M"+xx+" -29 V78"} stroke={C.gold} strokeWidth="7"/>
    </g>)}
    <path d={"M-"+door+" 63 Q0 21 "+door+" 63 V150 H-"+door+" Z"} fill={C.blueDeep} stroke={C.ink} strokeWidth="7"/>
    <path d="M-206 159 H206" stroke={C.ink} strokeWidth="17" strokeLinecap="round"/>
  </g>;
};

const OfacScene: React.FC<{f:number}> = ({f})=>{
  const mark=pop(f,1284,230);
  const bounce=prog(f,1260,1320);
  return <g opacity={visibility(f,1200,1567,40)}>
    <SceneBase f={f} tint="#E8EEE5"/>
    <path d="M0 1043 Q228 1020 418 1050 T780 1026 T1080 1050 L1080 1153 Q805 1127 576 1155 T0 1140 Z" fill={C.green} stroke={C.ink} strokeWidth="8"/>
    <Bank f={f} x={540} y={963}/>
    {txt(540,1193,33,"BANCO EXTERIOR DE CUBA",C.ink,1000)}
    <g transform={"translate(562 "+(695+bounce*140)+") rotate("+(8-bounce*15)+" 0 0) scale("+(.8+mark*.2)+")"} opacity={mark}>
      <path d="M-171 -70 L170 -68 L161 66 L-163 71 Z" fill={C.red} stroke={C.ink} strokeWidth="10"/>
      {txt(0,10,52,"OFAC",C.cream,1000)}
      {txt(0,47,15,"DESIGNACIÓN · 3 SEP",C.cream,900)}
    </g>
    <g transform={"translate(145 701) rotate(-5)"} opacity={prog(f,1260,1330)}>
      <path d="M-103 -45 L104 -40 L96 44 L-97 40 Z" fill={C.gold} stroke={C.ink} strokeWidth="7"/>
      {txt(0,9,19,"LISTA SDN",C.ink)}
      {txt(0,32,12,"NUEVAS DESIGNACIONES",C.ink,800)}
    </g>
    <g transform={"translate(913 729) rotate(6)"} opacity={prog(f,1320,1390)}>
      <path d="M-91 -42 L88 -46 L97 42 L-91 45 Z" fill={C.blue} stroke={C.ink} strokeWidth="7"/>
      {txt(0,8,17,"OTRAS",C.cream)}
      {txt(0,31,15,"ENTIDADES",C.cream)}
    </g>
    <Figure kind="rubio" x={171} y={833} s={.48} f={f} pose={2} reaction={mark*.5}/>
    <Figure kind="trump" x={910} y={838} s={.44} f={f} pose={1} reaction={mark*.4}/>
  </g>;
};

const FinanceTravel: React.FC<{f:number}> = ({f})=>{
  const u=prog(f,1535,1630);
  const narrow=prog(f,1620,1705);
  return <g opacity={visibility(f,1500,1800,36)}>
    <SceneBase f={f} tint="#F1E4D5"/>
    <path d="M0 931 Q272 900 495 932 T1080 913 L1080 1108 Q807 1097 546 1123 T0 1110 Z" fill="#D3BA90" stroke={C.ink} strokeWidth="8"/>
    <path d="M-30 1005 H1099" stroke={C.cream} strokeWidth="16" strokeDasharray="19 24"/>
    <g transform="translate(229 887)">
      <path d="M-50 -56 H51 V55 H-50 Z" fill={C.blue} stroke={C.ink} strokeWidth="8"/>
      {txt(0,10,20,"BANCO",C.cream)}
      {txt(0,37,12,"TRANSACCIÓN",C.cream,800)}
    </g>
    <path d="M282 887 C435 823 543 831 621 896 C699 960 791 945 846 874" fill="none" stroke={C.red} strokeWidth="13" strokeDasharray="1050" strokeDashoffset={1050*(1-prog(f,1500,1700))} strokeLinecap="round"/>
    <g transform={"translate(846 874) rotate("+(-90*u)+" 0 0)"} opacity={1-u}>
      <path d="M-61 -51 Q0 -108 63 -51 L44 -33 Q0 -74 -42 -32 Z" fill={C.red} stroke={C.ink} strokeWidth="7"/>
      <path d="M-58 -40 V44 H43" fill="none" stroke={C.ink} strokeWidth="8" strokeLinecap="round"/>
    </g>
    <g transform={"translate(837 882) scale("+(.3+u*.7)+")"} opacity={u}>
      <circle r="45" fill={C.red} stroke={C.ink} strokeWidth="8"/>
      <path d="M-25 -25 L25 25 M25 -25 L-25 25" stroke={C.cream} strokeWidth="11" strokeLinecap="round"/>
    </g>
    <g transform="translate(388 648)">
      <path d="M-88 -63 H88 L99 66 L-97 64 Z" fill={C.gold} stroke={C.ink} strokeWidth="8"/>
      {txt(0,-10,19,"REUNIÓN",C.ink)}
      {txt(0,18,17,"PROFESIONAL",C.ink)}
      <path d="M-42 42 L42 42" stroke={C.red} strokeWidth="8"/>
    </g>
    <path d={"M520 800 C660 800 680 800 "+(728+82*narrow)+" 800"} fill="none" stroke={C.blueDeep} strokeWidth="16" strokeLinecap="round"/>
    <path d={"M520 843 C650 843 685 843 "+(728+82*narrow)+" 843"} fill="none" stroke={C.green} strokeWidth="16" strokeLinecap="round"/>
    <g transform={"translate(877 794) scale("+(.8+narrow*.18)+")"}>
      <path d="M-74 0 H72" stroke={C.ink} strokeWidth="10" strokeLinecap="round"/>
      <path d="M49 -24 L74 0 L49 24" fill="none" stroke={C.ink} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    {txt(538,570,35,"29–30 SEP",C.red,1000)}
    {txt(538,620,21,"REGLAS FINANCIERAS Y DE VIAJE",C.ink,900)}
    <g transform={"translate(540 1224)"} opacity={prog(f,1640,1710)}>
      <path d="M-397 -73 Q-388 -96 -360 -94 L351 -88 Q385 -84 386 -56 L372 66 Q367 90 341 88 L-361 82 Q-393 78 -393 51 Z" fill={C.cream} stroke={C.ink} strokeWidth="8"/>
      {txt(0,-4,28,"REGLAS MÁS ESTRECHAS EN CATEGORÍAS CONCRETAS",C.red,1000)}
      {txt(0,37,17,"NO ES UNA PROHIBICIÓN TOTAL DE VIAJAR O TRANSACCIONAR",C.ink,800)}
    </g>
  </g>;
};

const Closing: React.FC<{f:number}> = ({f})=>{
  const p=prog(f,1705,1795);
  return <g opacity={p}>
    <rect x="0" y="1450" width={W} height="470" fill={C.paper} opacity=".96"/>
    <path d="M0 1450 Q200 1388 386 1450 T778 1440 T1080 1420" fill="none" stroke={C.red} strokeWidth="14"/>
    <g transform={"translate(275 1603) scale("+(.85+p*.15)+")"}>
      <path d="M-218 -77 Q-211 -93 -190 -92 H195 Q216 -89 216 -69 V53 Q213 74 190 74 H-194 Q-217 71 -217 49 Z" fill={C.blueDeep} stroke={C.ink} strokeWidth="8"/>
      {txt(0,-21,18,"CASA BLANCA",C.cream)}
      {txt(0,15,15,"SEGURIDAD Y POLÍTICA EXTERIOR",C.cream,800)}
    </g>
    <g transform={"translate(806 1603) scale("+(.85+p*.15)+")"}>
      <path d="M-218 -77 Q-211 -93 -190 -92 H195 Q216 -89 216 -69 V53 Q213 74 190 74 H-194 Q-217 71 -217 49 Z" fill={C.gold} stroke={C.ink} strokeWidth="8"/>
      {txt(0,-21,18,"MINREX",C.ink)}
      {txt(0,15,15,"DENUNCIA EL RECRUD. DEL BLOQUEO",C.ink,800)}
    </g>
    <path d="M541 1540 L541 1665" stroke={C.red} strokeWidth="8" strokeDasharray="9 13"/>
    {txt(540,1771,34,"EN 2026 LAS RESTRICCIONES CAMBIARON Y SE AMPLIARON",C.red,1000)}
  </g>;
};

const PAPER_EDGE: React.FC<{f:number}> = ({f})=>{
  const sway=pulse(f,43)*7;
  return <g pointerEvents="none">
    <path d={"M0 0 Q220 "+(18+sway)+" 435 1 T870 2 T1080 0 V45 Q850 56 650 44 T260 48 T0 40 Z"} fill="#E0CFAD"/>
    <path d={"M0 0 Q220 "+(18+sway)+" 435 1 T870 2 T1080 0"} fill="none" stroke={C.ink} strokeWidth="5" opacity=".25"/>
    <path d="M0 1874 Q200 1852 420 1873 T830 1873 T1080 1868 V1920 H0 Z" fill="#E0CFAD"/>
  </g>;
};

export const CartoonExplainerV5: React.FC = ()=>{
  const f=useCurrentFrame();
  const travel=prog(f,0,1800);
  const camY=mix(10,-12,travel)+pulse(f,71)*3;
  const camX=pulse(f,82,1)*4;
  const camR=pulse(f,100)*.16;
  const vignette=0.06+Math.abs(pulse(f,89))*.012;
  return <AbsoluteFill style={{overflow:"hidden",background:C.paper}}>
    <svg width={W} height={H} viewBox={"0 0 "+W+" "+H} style={{position:"absolute",inset:0}}>
      <g transform={"translate("+camX+" "+camY+") rotate("+camR+" 540 960)"}>
        <Intro f={f}/>
        <January f={f}/>
        <February f={f}/>
        <MayOrder f={f}/>
        <OfacScene f={f}/>
        <FinanceTravel f={f}/>
        <Closing f={f}/>
      </g>
      <PAPER_EDGE f={f}/>
    </svg>
    <AbsoluteFill style={{pointerEvents:"none",boxShadow:"inset 0 0 130px rgba(37,49,58,"+vignette+")"}}/>
  </AbsoluteFill>;
};

