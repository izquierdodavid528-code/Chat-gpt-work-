import React from "react";
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame} from "remotion";

export const TOTAL_FRAMES = 60 * 30;

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

const clamp = {extrapolateLeft:"clamp" as const, extrapolateRight:"clamp" as const};

const PaperTexture: React.FC = () => (
  <AbsoluteFill style={{
    background:C.paper,
    backgroundImage:
      "radial-gradient(circle at 15% 20%, rgba(32,39,42,.035) 0 1px, transparent 1.5px), radial-gradient(circle at 70% 75%, rgba(32,39,42,.025) 0 1px, transparent 1.5px)",
    backgroundSize:"18px 18px, 23px 23px",
  }}/>
);

const RoughShadow: React.FC<{children:React.ReactNode; style?:React.CSSProperties}> = ({children,style}) => (
  <div style={{filter:"drop-shadow(8px 10px 0 rgba(32,39,42,.12))",...style}}>{children}</div>
);

const MapIllustration: React.FC<{frame:number}> = ({frame}) => {
  const zoom=interpolate(frame,[0,80],[1.18,1],clamp);
  const drift=Math.sin(frame/18)*4;
  return (
    <svg viewBox="0 0 1080 1920" style={{position:"absolute",inset:0,width:"100%",height:"100%",transform:`scale(${zoom}) translateY(${drift}px)`}}>
      <rect width="1080" height="1920" fill={C.sea}/>
      <g opacity={0.17} stroke={C.cream} strokeWidth={5} fill="none">
        {[430,520,610,700,790,880,970,1060,1150,1240].map((y,i)=>(
          <path key={y} d={`M -80 ${y} C 130 ${y-40+i%2*20}, 310 ${y+35}, 540 ${y} S 900 ${y-35}, 1160 ${y+10}`}/>
        ))}
      </g>

      <path d="M 650 250 C 740 270 822 345 835 430 C 842 485 814 520 827 574 C 844 640 900 686 914 762 C 923 810 896 845 858 820 C 811 789 792 728 767 685 C 728 617 665 571 645 505 C 625 441 665 402 653 350 C 646 317 625 277 650 250 Z"
        fill={C.green} stroke={C.ink} strokeWidth={12} strokeLinejoin="round"/>
      <path d="M 658 255 C 720 278 785 330 805 390" fill="none" stroke={C.cream} strokeWidth={8} strokeLinecap="round" opacity={.45}/>

      <path d="M 190 1110 C 270 1072 360 1058 460 1060 C 566 1062 650 1044 742 1018 C 806 1000 875 1004 930 1028 C 882 1052 834 1077 778 1090 C 685 1110 596 1118 504 1132 C 402 1148 300 1157 210 1142 C 180 1137 166 1124 190 1110 Z"
        fill={C.green} stroke={C.ink} strokeWidth={12} strokeLinejoin="round"/>
      <path d="M 250 1120 C 375 1100 520 1098 650 1078" fill="none" stroke={C.cream} strokeWidth={8} strokeLinecap="round" opacity={.45}/>

      <g fill={C.green} stroke={C.ink} strokeWidth={7}>
        <ellipse cx="840" cy="690" rx="24" ry="50" transform="rotate(-18 840 690)"/>
        <ellipse cx="885" cy="760" rx="18" ry="38" transform="rotate(-18 885 760)"/>
        <ellipse cx="920" cy="830" rx="14" ry="29" transform="rotate(-18 920 830)"/>
      </g>

      <g fontFamily="Arial, sans-serif" fill={C.ink} fontWeight={900}>
        <text x="704" y="470" fontSize="34" transform="rotate(8 704 470)">FLORIDA</text>
        <text x="470" y="1210" fontSize="40" letterSpacing="4">CUBA</text>
      </g>
    </svg>
  );
};

const OilBarrel:React.FC<{x:number;y:number;scale?:number;rotation?:number}> = ({x,y,scale=1,rotation=0}) => (
  <svg width={110*scale} height={140*scale} viewBox="0 0 110 140" style={{position:"absolute",left:x,top:y,transform:`rotate(${rotation}deg)`}}>
    <ellipse cx="55" cy="20" rx="38" ry="14" fill={C.mustard} stroke={C.ink} strokeWidth="8"/>
    <path d="M17 20 L24 118 Q55 135 86 118 L93 20" fill={C.mustard} stroke={C.ink} strokeWidth="8"/>
    <path d="M23 55 Q55 66 87 55 M23 95 Q55 106 87 95" fill="none" stroke={C.ink} strokeWidth="7"/>
    <path d="M52 36 C45 49 42 54 42 62 C42 73 49 80 58 80 C68 80 74 73 74 63 C74 55 69 48 60 35 Z" fill={C.red} stroke={C.ink} strokeWidth="5"/>
  </svg>
);

const DocumentIcon:React.FC<{x:number;y:number;scale?:number;rotation?:number}> = ({x,y,scale=1,rotation=0}) => (
  <svg width={120*scale} height={145*scale} viewBox="0 0 120 145" style={{position:"absolute",left:x,top:y,transform:`rotate(${rotation}deg)`}}>
    <path d="M16 10 H82 L106 34 V132 H16 Z" fill={C.cream} stroke={C.ink} strokeWidth="8" strokeLinejoin="round"/>
    <path d="M82 10 V35 H106" fill={C.paper2} stroke={C.ink} strokeWidth="7"/>
    <path d="M34 58 H86 M34 78 H92 M34 98 H76" stroke={C.navy} strokeWidth="7" strokeLinecap="round"/>
    <circle cx="83" cy="112" r="18" fill={C.red} stroke={C.ink} strokeWidth="6"/>
  </svg>
);

const BankIcon:React.FC<{x:number;y:number;scale?:number;rotation?:number}> = ({x,y,scale=1,rotation=0}) => (
  <svg width={140*scale} height={130*scale} viewBox="0 0 140 130" style={{position:"absolute",left:x,top:y,transform:`rotate(${rotation}deg)`}}>
    <path d="M12 42 L70 12 L128 42 Z" fill={C.cream} stroke={C.ink} strokeWidth="8" strokeLinejoin="round"/>
    {[28,58,88].map(v=><rect key={v} x={v} y="48" width="18" height="50" rx="3" fill={C.paper2} stroke={C.ink} strokeWidth="6"/>)}
    <rect x="12" y="100" width="116" height="18" rx="5" fill={C.mustard} stroke={C.ink} strokeWidth="8"/>
  </svg>
);

const BadgeIcon:React.FC<{x:number;y:number;scale?:number;rotation?:number}> = ({x,y,scale=1,rotation=0}) => (
  <svg width={125*scale} height={145*scale} viewBox="0 0 125 145" style={{position:"absolute",left:x,top:y,transform:`rotate(${rotation}deg)`}}>
    <path d="M40 8 C40 36 85 36 85 8" fill="none" stroke={C.ink} strokeWidth="8" strokeLinecap="round"/>
    <rect x="14" y="38" width="97" height="92" rx="14" fill={C.cream} stroke={C.ink} strokeWidth="8"/>
    <circle cx="42" cy="72" r="14" fill={C.seaDark} stroke={C.ink} strokeWidth="5"/>
    <path d="M67 66 H94 M67 82 H90 M30 108 H95" stroke={C.navy} strokeWidth="7" strokeLinecap="round"/>
  </svg>
);

const PopIcon:React.FC<{kind:"oil"|"doc"|"bank"|"badge";frame:number;delay:number;x:number;y:number;rotation:number}> = ({kind,frame,delay,x,y,rotation}) => {
  const p=spring({frame:Math.max(0,frame-delay),fps:30,config:{damping:12,stiffness:180,mass:.65}});
  const s=interpolate(p,[0,1],[0.15,1]);
  const yy=interpolate(p,[0,1],[y+100,y]);
  const rot=interpolate(p,[0,1],[rotation-18,rotation]);
  const props={x,y:yy,scale:s,rotation:rot};
  return <div style={{opacity:p}}>
    {kind==="oil"&&<OilBarrel {...props}/>}
    {kind==="doc"&&<DocumentIcon {...props}/>}
    {kind==="bank"&&<BankIcon {...props}/>}
    {kind==="badge"&&<BadgeIcon {...props}/>}
  </div>;
};

const Tanker:React.FC<{frame:number}> = ({frame}) => {
  const x=interpolate(frame,[82,165],[-360,520],clamp);
  const y=interpolate(frame,[82,165],[1010,940],clamp);
  const bob=Math.sin(frame/5)*6;
  return (
    <svg width="420" height="190" viewBox="0 0 420 190" style={{position:"absolute",left:x,top:y+bob,transform:"rotate(-4deg)"}}>
      <path d="M28 105 H378 L335 154 H75 Z" fill={C.navy} stroke={C.ink} strokeWidth="10" strokeLinejoin="round"/>
      <rect x="92" y="65" width="205" height="46" rx="8" fill={C.mustard} stroke={C.ink} strokeWidth="8"/>
      {[116,160,204,248].map(v=><circle key={v} cx={v} cy="88" r="15" fill={C.red} stroke={C.ink} strokeWidth="6"/>)}
      <rect x="307" y="45" width="52" height="67" rx="6" fill={C.cream} stroke={C.ink} strokeWidth="8"/>
      <rect x="323" y="25" width="9" height="25" fill={C.ink}/>
      <path d="M8 160 C100 175 280 175 412 158" stroke={C.cream} strokeWidth="10" fill="none" strokeLinecap="round" opacity=".75"/>
    </svg>
  );
};

const CargoBox:React.FC<{frame:number}> = ({frame}) => {
  const p=spring({frame:Math.max(0,frame-156),fps:30,config:{damping:16,stiffness:120}});
  const x=interpolate(frame,[156,220],[420,690],clamp);
  const y=interpolate(frame,[156,220],[910,610],clamp);
  const s=interpolate(p,[0,1],[.2,1]);
  return (
    <svg width="210" height="180" viewBox="0 0 210 180" style={{position:"absolute",left:x,top:y,transform:`scale(${s}) rotate(-3deg)`,transformOrigin:"center",opacity:p}}>
      <rect x="16" y="22" width="178" height="136" rx="12" fill={C.mustard} stroke={C.ink} strokeWidth="9"/>
      <path d="M60 24 V157 M104 24 V157 M148 24 V157" stroke={C.ink} strokeWidth="6" opacity=".65"/>
      <path d="M33 66 H178" stroke={C.cream} strokeWidth="7" opacity=".8"/>
    </svg>
  );
};

const CustomsGate:React.FC<{frame:number}> = ({frame}) => {
  const gateIn=spring({frame:Math.max(0,frame-174),fps:30,config:{damping:15,stiffness:150}});
  const close=spring({frame:Math.max(0,frame-205),fps:30,config:{damping:13,stiffness:170}});
  const armRot=interpolate(close,[0,1],[-72,0]);
  const stamp=spring({frame:Math.max(0,frame-226),fps:30,config:{damping:10,stiffness:220}});
  const gateOut=interpolate(frame,[282,314],[1,0],clamp);
  return (
    <>
      <div style={{position:"absolute",right:70,top:420,width:260,height:260,opacity:gateIn*gateOut,transform:`translateX(${interpolate(gateIn,[0,1],[120,0])}px)`}}>
        <div style={{position:"absolute",right:5,top:60,width:118,height:158,border:"9px solid "+C.ink,borderRadius:18,background:C.cream,boxShadow:"10px 12px 0 rgba(32,39,42,.12)"}}>
          <div style={{height:52,background:C.navy,borderBottom:"8px solid "+C.ink,borderRadius:"8px 8px 0 0",display:"flex",alignItems:"center",justifyContent:"center",color:C.cream,fontFamily:"Arial",fontWeight:900,fontSize:24}}>EE.UU.</div>
          <div style={{padding:18,fontFamily:"Arial",fontWeight:900,color:C.ink,fontSize:19,lineHeight:1.05}}>ADUANA</div>
        </div>
        <div style={{position:"absolute",left:16,top:170,width:22,height:140,background:C.ink,borderRadius:8}}/>
        <div style={{position:"absolute",left:25,top:178,width:210,height:24,transformOrigin:"12px 12px",transform:`rotate(${armRot}deg)`,background:"repeating-linear-gradient(90deg, "+C.red+" 0 34px, "+C.cream+" 34px 68px)",border:"7px solid "+C.ink,borderRadius:10}}/>
      </div>
      <div style={{
        position:"absolute",right:85,top:760,
        transform:`scale(${stamp}) rotate(-5deg)`,
        opacity:stamp*gateOut,
        border:"8px solid "+C.red,borderRadius:18,padding:"14px 20px",
        fontFamily:"Arial",fontSize:34,fontWeight:1000,color:C.red,
        background:"rgba(243,233,210,.88)"
      }}>29 ENE</div>
      <div style={{position:"absolute",right:94,top:845,fontFamily:"Arial",fontSize:22,fontWeight:900,color:C.ink,opacity:stamp*gateOut}}>EO 14380</div>
    </>
  );
};

const CalendarFlip:React.FC<{frame:number}> = ({frame}) => {
  const p=spring({frame:Math.max(0,frame-266),fps:30,config:{damping:12,stiffness:150}});
  const lift=spring({frame:Math.max(0,frame-288),fps:30,config:{damping:14,stiffness:160}});
  const barrierOpacity=interpolate(frame,[298,320],[1,0],clamp);
  return (
    <>
      <div style={{position:"absolute",left:95,top:420,width:280,height:300,transform:`translateY(${interpolate(p,[0,1],[120,0])}px) rotate(${interpolate(p,[0,1],[-8,2])}deg)`,opacity:p}}>
        <div style={{height:62,background:C.red,border:"9px solid "+C.ink,borderBottom:0,borderRadius:"22px 22px 0 0"}}/>
        <div style={{height:210,background:C.cream,border:"9px solid "+C.ink,borderRadius:"0 0 22px 22px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",boxShadow:"12px 14px 0 rgba(32,39,42,.12)"}}>
          <div style={{fontFamily:"Arial",fontSize:80,fontWeight:1000,color:C.ink,lineHeight:.9}}>20</div>
          <div style={{fontFamily:"Arial",fontSize:36,fontWeight:1000,color:C.red,letterSpacing:3}}>FEB</div>
        </div>
      </div>

      <div style={{
        position:"absolute",left:400,top:760,width:390,height:120,
        border:"8px solid "+C.red,borderRadius:18,
        display:"flex",alignItems:"center",justifyContent:"center",
        fontFamily:"Arial",fontSize:35,fontWeight:1000,color:C.red,
        background:C.cream,
        transform:`scale(${interpolate(p,[0,1],[.7,1])}) rotate(-3deg)`,
        opacity:barrierOpacity*p
      }}>+ ARANCEL</div>

      <div style={{
        position:"absolute",left:435,top:770,width:330,height:95,
        borderRadius:50,background:C.green,border:"8px solid "+C.ink,
        transform:`translateX(${interpolate(lift,[0,1],[-520,0])}px) rotate(-4deg)`,
        opacity:lift,
        display:"flex",alignItems:"center",justifyContent:"center",
        fontFamily:"Arial",fontSize:25,fontWeight:1000,color:C.cream,
        boxShadow:"9px 10px 0 rgba(32,39,42,.14)"
      }}>ARANCEL RETIRADO</div>
    </>
  );
};

const EmergencyPaper:React.FC<{frame:number}> = ({frame}) => {
  const p=spring({frame:Math.max(0,frame-300),fps:30,config:{damping:16,stiffness:130}});
  return (
    <div style={{position:"absolute",right:82,bottom:120,width:360,height:220,transform:`translateY(${interpolate(p,[0,1],[100,0])}px) rotate(3deg)`,opacity:p}}>
      <svg width="360" height="220" viewBox="0 0 360 220">
        <path d="M18 14 H338 V202 H18 Z" fill={C.cream} stroke={C.ink} strokeWidth="9"/>
        <circle cx="178" cy="15" r="14" fill={C.red} stroke={C.ink} strokeWidth="6"/>
        <path d="M52 68 H305 M52 100 H286 M52 132 H315" stroke={C.navy} strokeWidth="8" strokeLinecap="round"/>
        <text x="52" y="181" fontFamily="Arial" fontWeight="900" fontSize="24" fill={C.red}>EMERGENCIA</text>
      </svg>
    </div>
  );
};

const OpeningAct:React.FC=()=>{
  const f=useCurrentFrame();
  const iconFade=interpolate(f,[72,94],[1,0],clamp);
  const mapDark=interpolate(f,[150,230],[0,.12],clamp);

  return <AbsoluteFill style={{overflow:"hidden",background:C.sea}}>
    <MapIllustration frame={f}/>

    <div style={{position:"absolute",inset:0,background:`rgba(32,39,42,${mapDark})`,pointerEvents:"none"}}/>

    <div style={{opacity:iconFade}}>
      <PopIcon kind="oil" frame={f} delay={18} x={115} y={1270} rotation={-12}/>
      <PopIcon kind="doc" frame={f} delay={31} x={335} y={1355} rotation={8}/>
      <PopIcon kind="bank" frame={f} delay={44} x={590} y={1315} rotation={-5}/>
      <PopIcon kind="badge" frame={f} delay={57} x={825} y={1370} rotation={9}/>
    </div>

    <div style={{
      position:"absolute",left:78,top:90,
      fontFamily:"Arial",fontWeight:1000,fontSize:86,lineHeight:.88,
      color:C.cream,textShadow:"5px 6px 0 "+C.ink,
      transform:`translateY(${interpolate(f,[0,28],[40,0],clamp)}px)`,
      opacity:interpolate(f,[0,18,94,118],[0,1,1,0],clamp)
    }}>
      2026
    </div>

    <div style={{
      position:"absolute",left:78,top:205,width:700,
      fontFamily:"Arial",fontWeight:950,fontSize:48,lineHeight:1.02,
      color:C.ink,
      opacity:interpolate(f,[14,40,72,94],[0,1,1,0],clamp)
    }}>
      La presión llega por<br/>varios caminos.
    </div>

    <Tanker frame={f}/>
    <CargoBox frame={f}/>
    <CustomsGate frame={f}/>
    <CalendarFlip frame={f}/>
    <EmergencyPaper frame={f}/>

  </AbsoluteFill>;
};


const SectorToken:React.FC<{label:string;kind:"bolt"|"metal"|"bank"|"shield"|"crate";frame:number;delay:number;x:number;y:number;rot:number}> = ({label,kind,frame,delay,x,y,rot}) => {
  const p=spring({frame:Math.max(0,frame-delay),fps:30,config:{damping:11,stiffness:185,mass:.7}});
  const yy=interpolate(p,[0,1],[y+95,y]);
  const r=interpolate(p,[0,1],[rot-18,rot]);
  return <div style={{position:"absolute",left:x,top:yy,width:142,height:142,opacity:p,transform:`scale(${interpolate(p,[0,1],[.2,1])}) rotate(${r}deg)`,transformOrigin:"center"}}>
    <svg width="142" height="142" viewBox="0 0 142 142">
      <circle cx="71" cy="66" r="56" fill={C.cream} stroke={C.ink} strokeWidth="8"/>
      {kind==="bolt"&&<path d="M78 24 L47 70 H67 L58 110 L96 58 H74 Z" fill={C.mustard} stroke={C.ink} strokeWidth="6" strokeLinejoin="round"/>}
      {kind==="metal"&&<><rect x="36" y="43" width="70" height="24" rx="7" fill={C.seaDark} stroke={C.ink} strokeWidth="6"/><rect x="46" y="72" width="60" height="24" rx="7" fill={C.mustard} stroke={C.ink} strokeWidth="6"/></>}
      {kind==="bank"&&<><path d="M30 58 L71 35 L112 58 Z" fill={C.paper2} stroke={C.ink} strokeWidth="6"/>{[42,65,88].map(v=><rect key={v} x={v} y="61" width="12" height="34" fill={C.cream} stroke={C.ink} strokeWidth="4"/>)}<path d="M28 101 H114" stroke={C.ink} strokeWidth="7"/></>}
      {kind==="shield"&&<path d="M71 30 L105 43 V67 C105 91 90 106 71 115 C52 106 37 91 37 67 V43 Z" fill={C.green} stroke={C.ink} strokeWidth="7"/>}
      {kind==="crate"&&<><rect x="34" y="39" width="74" height="65" rx="7" fill={C.red} stroke={C.ink} strokeWidth="7"/><path d="M48 39 V104 M71 39 V104 M94 39 V104 M34 60 H108" stroke={C.cream} strokeWidth="5"/></>}
    </svg>
    <div style={{position:"absolute",left:"50%",top:128,transform:"translateX(-50%)",whiteSpace:"nowrap",fontFamily:"Arial",fontWeight:1000,fontSize:15,letterSpacing:1.1,color:C.ink}}>{label}</div>
  </div>;
};

const OfficialArm:React.FC<{side:"left"|"right";frame:number;delay:number;label:string}> = ({side,frame,delay,label}) => {
  const p=spring({frame:Math.max(0,frame-delay),fps:30,config:{damping:15,stiffness:140}});
  const from=side==="left"?-330:330;
  const x=interpolate(p,[0,1],[from,0]);
  const isLeft=side==="left";
  return <div style={{position:"absolute",top:1160,left:isLeft?0:610,width:470,height:210,transform:`translateX(${x}px)`,opacity:p}}>
    <svg width="470" height="210" viewBox="0 0 470 210">
      <path d={isLeft?"M0 92 H310 Q350 92 388 118 L430 147":"M470 92 H160 Q120 92 82 118 L40 147"} fill="none" stroke={C.navy} strokeWidth="68" strokeLinecap="round"/>
      <circle cx={isLeft?410:60} cy="146" r="42" fill={C.paper2} stroke={C.ink} strokeWidth="8"/>
      <path d={isLeft?"M392 126 L448 105":"M78 126 L22 105"} stroke={C.paper2} strokeWidth="22" strokeLinecap="round"/>
    </svg>
    <div style={{position:"absolute",top:30,left:isLeft?36:290,padding:"12px 18px",background:C.cream,border:"7px solid "+C.ink,borderRadius:18,fontFamily:"Arial",fontWeight:1000,fontSize:28,color:C.ink,boxShadow:"8px 9px 0 rgba(32,39,42,.12)"}}>{label}</div>
  </div>;
};

const RubioMini:React.FC<{frame:number}> = ({frame}) => {
  const p=spring({frame:Math.max(0,frame-245),fps:30,config:{damping:12,stiffness:170}});
  return <div style={{position:"absolute",left:90,top:1430,width:320,height:300,opacity:p,transform:`translateY(${interpolate(p,[0,1],[90,0])}px) rotate(-2deg)`}}>
    <svg width="260" height="250" viewBox="0 0 260 250">
      <path d="M52 246 C66 192 92 174 129 174 C171 174 200 194 214 246 Z" fill={C.navy} stroke={C.ink} strokeWidth="9"/>
      <path d="M103 180 L129 222 L158 180" fill={C.cream} stroke={C.ink} strokeWidth="7"/>
      <ellipse cx="131" cy="110" rx="72" ry="82" fill={C.paper2} stroke={C.ink} strokeWidth="9"/>
      <path d="M61 105 C60 48 94 24 135 25 C174 25 204 51 202 91 C177 70 160 66 139 70 C111 74 90 65 61 105 Z" fill={C.ink}/>
      <path d="M93 111 Q107 102 120 111 M144 111 Q158 102 171 111" fill="none" stroke={C.ink} strokeWidth="6" strokeLinecap="round"/>
      <path d="M111 145 Q132 157 153 144" fill="none" stroke={C.ink} strokeWidth="6" strokeLinecap="round"/>
    </svg>
    <div style={{position:"absolute",left:150,top:176,padding:"10px 16px",background:C.red,color:C.cream,border:"6px solid "+C.ink,borderRadius:16,fontFamily:"Arial",fontSize:22,fontWeight:1000,transform:"rotate(3deg)",whiteSpace:"nowrap"}}>RUBIO · STATE</div>
  </div>;
};

const MayAct:React.FC=()=>{
  const f=useCurrentFrame();
  const paperIn=spring({frame:f,fps:30,config:{damping:16,stiffness:120}});
  const lid=spring({frame:Math.max(0,f-48),fps:30,config:{damping:13,stiffness:155}});
  const date=spring({frame:Math.max(0,f-22),fps:30,config:{damping:11,stiffness:180}});
  const stamp=spring({frame:Math.max(0,f-188),fps:30,config:{damping:10,stiffness:190}});

  return <AbsoluteFill style={{background:C.paper,overflow:"hidden"}}>
    <PaperTexture/>
    <div style={{position:"absolute",left:70,top:70,fontFamily:"Arial",fontWeight:1000,fontSize:70,color:C.ink,opacity:interpolate(f,[0,24,260,300],[0,1,1,0],clamp)}}>MAYO</div>

    <div style={{position:"absolute",left:235,top:220,width:610,height:510,opacity:paperIn,transform:`translateY(${interpolate(paperIn,[0,1],[120,0])}px)`}}>
      <div style={{position:"absolute",left:90,top:45,width:430,height:250,background:C.cream,border:"10px solid "+C.ink,borderRadius:18,boxShadow:"14px 16px 0 rgba(32,39,42,.12)",transform:`rotate(${interpolate(lid,[0,1],[0,-14])}deg) translateY(${interpolate(lid,[0,1],[0,-55])}px)`,transformOrigin:"bottom left"}}>
        <div style={{position:"absolute",left:44,right:44,top:56,height:9,background:C.navy,borderRadius:9}}/>
        <div style={{position:"absolute",left:44,right:84,top:92,height:9,background:C.navy,borderRadius:9}}/>
        <div style={{position:"absolute",left:44,right:64,top:128,height:9,background:C.navy,borderRadius:9}}/>
        <div style={{position:"absolute",right:44,bottom:34,width:78,height:78,borderRadius:"50%",background:C.red,border:"7px solid "+C.ink}}/>
      </div>
      <div style={{position:"absolute",left:0,top:280,width:610,height:185,background:C.mustard,border:"10px solid "+C.ink,borderRadius:26,boxShadow:"14px 16px 0 rgba(32,39,42,.12)"}}>
        <div style={{position:"absolute",left:205,top:-18,width:200,height:52,border:"9px solid "+C.ink,borderBottom:0,borderRadius:"24px 24px 0 0",background:C.paper2}}/>
        <div style={{position:"absolute",left:275,top:52,width:62,height:52,borderRadius:12,background:C.red,border:"7px solid "+C.ink}}/>
      </div>
    </div>

    <div style={{position:"absolute",right:72,top:88,transform:`scale(${date}) rotate(4deg)`,opacity:date,padding:"16px 20px",background:C.cream,border:"7px solid "+C.ink,borderRadius:18,fontFamily:"Arial",fontWeight:1000,fontSize:26,color:C.red,boxShadow:"8px 9px 0 rgba(32,39,42,.12)"}}>1 MAY · EO 14404</div>

    <SectorToken label="ENERGÍA" kind="bolt" frame={f} delay={72} x={86} y={750} rot={-8}/>
    <SectorToken label="METALES" kind="metal" frame={f} delay={88} x={282} y={690} rot={5}/>
    <SectorToken label="FINANZAS" kind="bank" frame={f} delay={104} x={470} y={760} rot={-3}/>
    <SectorToken label="SEGURIDAD" kind="shield" frame={f} delay={120} x={660} y={700} rot={7}/>
    <SectorToken label="DEFENSA" kind="crate" frame={f} delay={136} x={842} y={770} rot={-6}/>

    <div style={{position:"absolute",left:142,top:1030,width:800,height:4,background:C.ink,opacity:interpolate(f,[155,185],[0,.16],clamp)}}/>

    <OfficialArm side="left" frame={f} delay={166} label="STATE"/>
    <OfficialArm side="right" frame={f} delay={178} label="TREASURY"/>

    <div style={{position:"absolute",left:465,top:1260,width:150,height:120,transform:`scale(${stamp}) rotate(-5deg)`,opacity:stamp}}>
      <div style={{width:130,height:78,background:C.red,border:"8px solid "+C.ink,borderRadius:16,boxShadow:"8px 9px 0 rgba(32,39,42,.12)"}}/>
      <div style={{position:"absolute",left:36,top:-58,width:58,height:70,border:"8px solid "+C.ink,borderBottom:0,borderRadius:"25px 25px 0 0",background:C.paper2}}/>
    </div>

    <RubioMini frame={f}/>

    <div style={{position:"absolute",right:90,bottom:150,width:470,fontFamily:"Arial",fontSize:30,fontWeight:1000,lineHeight:1.05,color:C.ink,opacity:interpolate(f,[230,260],[0,1],clamp)}}>
      La orden presidencial<br/>se convierte en herramientas<br/>de implementación.
    </div>
  </AbsoluteFill>;
};


const OfacStamp:React.FC<{frame:number;delay:number;x:number;y:number;rotation?:number}> = ({frame,delay,x,y,rotation=-6}) => {
  const p=spring({frame:Math.max(0,frame-delay),fps:30,config:{damping:8,stiffness:230,mass:.55}});
  const hit=interpolate(p,[0,.72,1],[0,1,.92]);
  return <div style={{position:"absolute",left:x,top:y,width:170,height:110,transform:`scale(${interpolate(p,[0,1],[1.8,1])}) rotate(${rotation}deg)`,opacity:p}}>
    <div style={{position:"absolute",left:52,top:-70,width:68,height:80,border:"8px solid "+C.ink,borderBottom:0,borderRadius:"28px 28px 0 0",background:C.paper2}}/>
    <div style={{width:170,height:105,borderRadius:20,background:C.red,border:"9px solid "+C.ink,boxShadow:`0 ${12*hit}px 0 rgba(32,39,42,.14)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Arial",fontWeight:1000,fontSize:27,color:C.cream,letterSpacing:1.5}}>OFAC</div>
  </div>;
};

const ListRow:React.FC<{label:string;frame:number;delay:number;accent?:boolean;sub?:string}> = ({label,frame,delay,accent=false,sub}) => {
  const p=spring({frame:Math.max(0,frame-delay),fps:30,config:{damping:16,stiffness:150}});
  return <div style={{height:118,borderBottom:"5px solid rgba(32,39,42,.18)",display:"flex",alignItems:"center",padding:"0 34px",opacity:p,transform:`translateX(${interpolate(p,[0,1],[-90,0])}px)`}}>
    <div style={{width:26,height:26,borderRadius:"50%",background:accent?C.red:C.seaDark,border:"5px solid "+C.ink,marginRight:24}}/>
    <div>
      <div style={{fontFamily:"Arial",fontWeight:1000,fontSize:30,color:C.ink}}>{label}</div>
      {sub&&<div style={{fontFamily:"Arial",fontWeight:800,fontSize:16,color:C.navy,letterSpacing:1,marginTop:5}}>{sub}</div>}
    </div>
  </div>;
};

const BankTransform:React.FC<{frame:number}> = ({frame}) => {
  const p=spring({frame:Math.max(0,frame-235),fps:30,config:{damping:14,stiffness:135}});
  const roof=interpolate(p,[0,1],[0,1]);
  const col=(d:number)=>spring({frame:Math.max(0,frame-(250+d)),fps:30,config:{damping:11,stiffness:180}});
  return <div style={{position:"absolute",left:160,top:720,width:760,height:680,opacity:p,transform:`translateY(${interpolate(p,[0,1],[180,0])}px)`}}>
    <svg width="760" height="680" viewBox="0 0 760 680">
      <rect x="88" y="300" width="584" height="220" rx="18" fill={C.cream} stroke={C.ink} strokeWidth="12"/>
      <path d={`M70 300 L380 ${300-160*roof} L690 300 Z`} fill={C.paper2} stroke={C.ink} strokeWidth="12" strokeLinejoin="round"/>
      {[0,1,2,3].map((i)=>{
        const cp=col(i*12);
        const x=145+i*145;
        return <g key={i} opacity={cp} transform={`translate(0 ${interpolate(cp,[0,1],[90,0])})`}>
          <rect x={x} y="325" width="72" height="160" rx="8" fill={i%2?C.paper2:C.cream} stroke={C.ink} strokeWidth="9"/>
        </g>;
      })}
      <rect x="66" y="510" width="628" height="82" rx="18" fill={C.mustard} stroke={C.ink} strokeWidth="12"/>
      <text x="380" y="562" textAnchor="middle" fontFamily="Arial" fontWeight="1000" fontSize="32" fill={C.ink}>BANCO EXTERIOR DE CUBA</text>
    </svg>
  </div>;
};

const DesignationsAct:React.FC=()=>{
  const f=useCurrentFrame();
  const roll=spring({frame:f,fps:30,config:{damping:15,stiffness:120}});
  const shift=interpolate(f,[0,230],[0,-170],clamp);
  const jun=spring({frame:Math.max(0,f-18),fps:30,config:{damping:11,stiffness:170}});
  const sep=spring({frame:Math.max(0,f-185),fps:30,config:{damping:11,stiffness:170}});
  const listFade=interpolate(f,[215,275],[1,0],clamp);

  return <AbsoluteFill style={{background:C.paper,overflow:"hidden"}}>
    <PaperTexture/>

    <div style={{position:"absolute",left:70,top:70,fontFamily:"Arial",fontWeight:1000,fontSize:68,color:C.ink}}>DESIGNACIONES</div>

    <div style={{position:"absolute",right:78,top:84,display:"flex",gap:16}}>
      <div style={{padding:"13px 18px",background:C.cream,border:"7px solid "+C.ink,borderRadius:16,fontFamily:"Arial",fontWeight:1000,fontSize:24,color:C.red,opacity:jun,transform:`rotate(${interpolate(jun,[0,1],[-12,-3])}deg)`}}>04 JUN</div>
      <div style={{padding:"13px 18px",background:C.cream,border:"7px solid "+C.ink,borderRadius:16,fontFamily:"Arial",fontWeight:1000,fontSize:24,color:C.red,opacity:sep,transform:`rotate(${interpolate(sep,[0,1],[12,3])}deg)`}}>03 SEP</div>
    </div>

    <div style={{position:"absolute",left:122,top:250,width:836,height:1110,opacity:listFade,transform:`translateY(${shift}px) scaleY(${interpolate(roll,[0,1],[.45,1])})`,transformOrigin:"top center"}}>
      <div style={{position:"absolute",left:0,top:0,width:836,minHeight:1180,background:C.cream,border:"10px solid "+C.ink,borderRadius:28,boxShadow:"18px 20px 0 rgba(32,39,42,.12)",overflow:"hidden"}}>
        <div style={{height:130,background:C.navy,borderBottom:"10px solid "+C.ink,display:"flex",alignItems:"center",padding:"0 36px"}}>
          <div style={{fontFamily:"Arial",fontWeight:1000,fontSize:42,color:C.cream,letterSpacing:2}}>LISTA SDN</div>
        </div>
        <ListRow label="ICAP" frame={f} delay={38} accent sub="ejemplo de junio"/>
        <ListRow label="MINFAR" frame={f} delay={62} accent sub="ejemplo de junio"/>
        <ListRow label="PERSONAS" frame={f} delay={90} sub="otras entradas"/>
        <ListRow label="OTRAS ENTIDADES" frame={f} delay={118} sub="otras entradas"/>
        <ListRow label="BANCO EXTERIOR DE CUBA" frame={f} delay={190} accent sub="3 de septiembre"/>
      </div>
      <OfacStamp frame={f} delay={72} x={590} y={240}/>
      <OfacStamp frame={f} delay={118} x={560} y={470} rotation={5}/>
      <OfacStamp frame={f} delay={208} x={535} y={760} rotation={-4}/>
    </div>

    <BankTransform frame={f}/>

    <div style={{position:"absolute",left:86,right:86,bottom:120,fontFamily:"Arial",fontWeight:1000,fontSize:29,lineHeight:1.05,color:C.ink,opacity:interpolate(f,[275,305],[0,1],clamp)}}>
      La lista deja de ser papel:<br/>el siguiente objetivo se convierte en la escena.
    </div>
  </AbsoluteFill>;
};


const MoneyToken:React.FC<{x:number;y:number;rotation?:number;scale?:number}> = ({x,y,rotation=0,scale=1}) => (
  <svg width={92*scale} height={92*scale} viewBox="0 0 92 92" style={{position:"absolute",left:x,top:y,transform:`rotate(${rotation}deg)`}}>
    <circle cx="46" cy="46" r="37" fill={C.mustard} stroke={C.ink} strokeWidth="8"/>
    <path d="M52 23 C35 20 27 29 29 39 C31 48 42 49 51 51 C62 53 67 59 64 68 C60 79 42 79 30 70" fill="none" stroke={C.ink} strokeWidth="7" strokeLinecap="round"/>
    <path d="M46 18 V75" stroke={C.ink} strokeWidth="5" opacity=".75"/>
  </svg>
);

const FinancePipe:React.FC<{x:number;y:number;w:number;h:number;rot?:number;active?:number}> = ({x,y,w,h,rot=0,active=1}) => (
  <div style={{position:"absolute",left:x,top:y,width:w,height:h,transform:`rotate(${rot}deg)`,transformOrigin:"left center",borderRadius:999,background:C.paper2,border:"8px solid "+C.ink,overflow:"hidden"}}>
    <div style={{width:`${Math.max(0,Math.min(1,active))*100}%`,height:"100%",background:C.seaDark}}/>
  </div>
);

const UTurnSign:React.FC<{frame:number}> = ({frame}) => {
  const enter=spring({frame:Math.max(0,frame-34),fps:30,config:{damping:13,stiffness:160}});
  const cancel=spring({frame:Math.max(0,frame-150),fps:30,config:{damping:10,stiffness:210}});
  return <div style={{position:"absolute",left:420,top:600,width:240,height:240,opacity:enter,transform:`scale(${interpolate(enter,[0,1],[.5,1])}) rotate(-3deg)`}}>
    <div style={{position:"absolute",inset:0,borderRadius:"50%",background:C.cream,border:"10px solid "+C.ink,boxShadow:"12px 14px 0 rgba(32,39,42,.12)"}}/>
    <svg width="240" height="240" viewBox="0 0 240 240" style={{position:"absolute",inset:0}}>
      <path d="M164 164 C154 105 114 90 74 111 C47 125 45 158 62 180" fill="none" stroke={C.green} strokeWidth="22" strokeLinecap="round"/>
      <path d="M58 174 L45 129 L91 144 Z" fill={C.green} stroke={C.ink} strokeWidth="6" strokeLinejoin="round"/>
      <path d="M52 52 L188 188" stroke={C.red} strokeWidth={22*cancel} strokeLinecap="round"/>
    </svg>
    <div style={{position:"absolute",left:0,right:0,bottom:-50,textAlign:"center",fontFamily:"Arial",fontWeight:1000,fontSize:25,color:C.ink}}>U-TURN</div>
  </div>;
};

const TravelBadge:React.FC<{frame:number}> = ({frame}) => {
  const enter=spring({frame:Math.max(0,frame-185),fps:30,config:{damping:14,stiffness:150}});
  const tab=spring({frame:Math.max(0,frame-232),fps:30,config:{damping:9,stiffness:200}});
  const tabY=interpolate(tab,[0,1],[0,125]);
  const tabRot=interpolate(tab,[0,1],[0,18]);
  return <div style={{position:"absolute",left:115,top:1130,width:350,height:350,opacity:enter,transform:`translateX(${interpolate(enter,[0,1],[-180,0])}px)`}}>
    <svg width="300" height="330" viewBox="0 0 300 330">
      <path d="M95 10 C95 70 205 70 205 10" fill="none" stroke={C.ink} strokeWidth="15" strokeLinecap="round"/>
      <rect x="36" y="74" width="228" height="214" rx="28" fill={C.cream} stroke={C.ink} strokeWidth="12"/>
      <circle cx="103" cy="145" r="32" fill={C.seaDark} stroke={C.ink} strokeWidth="8"/>
      <path d="M154 129 H225 M154 158 H214 M78 214 H225" stroke={C.navy} strokeWidth="11" strokeLinecap="round"/>
    </svg>
    <div style={{position:"absolute",right:10,top:210,width:155,height:74,borderRadius:18,background:C.green,border:"8px solid "+C.ink,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Arial",fontWeight:1000,fontSize:22,color:C.cream,transform:`translateY(${tabY}px) rotate(${tabRot}deg)`,opacity:1-interpolate(tab,[.8,1],[0,.15],clamp)}}>AUTORIZADO</div>
    <div style={{position:"absolute",left:35,top:300,fontFamily:"Arial",fontWeight:1000,fontSize:24,color:C.ink}}>REUNIONES</div>
  </div>;
};

const EducationLane:React.FC<{frame:number}> = ({frame}) => {
  const enter=spring({frame:Math.max(0,frame-210),fps:30,config:{damping:14,stiffness:150}});
  const narrow=spring({frame:Math.max(0,frame-265),fps:30,config:{damping:13,stiffness:155}});
  const laneW=interpolate(narrow,[0,1],[360,150]);
  return <div style={{position:"absolute",right:85,top:1160,width:450,height:330,opacity:enter,transform:`translateX(${interpolate(enter,[0,1],[180,0])}px)`}}>
    <svg width="180" height="130" viewBox="0 0 180 130" style={{position:"absolute",right:80,top:0}}>
      <path d="M20 48 L90 14 L160 48 L90 82 Z" fill={C.navy} stroke={C.ink} strokeWidth="8" strokeLinejoin="round"/>
      <path d="M52 66 V95 C72 111 108 111 128 95 V66" fill={C.paper2} stroke={C.ink} strokeWidth="7"/>
      <path d="M160 48 V98" stroke={C.ink} strokeWidth="7"/>
    </svg>
    <div style={{position:"absolute",right:30,top:150,width:360,height:86,border:"8px solid "+C.ink,borderRadius:44,background:C.cream,overflow:"hidden"}}>
      <div style={{width:laneW,height:"100%",background:C.seaDark,borderRight:"8px solid "+C.ink,transition:"none"}}/>
    </div>
    <div style={{position:"absolute",right:65,top:260,fontFamily:"Arial",fontWeight:1000,fontSize:24,color:C.ink}}>EDUCACIÓN</div>
  </div>;
};

const FinanceMobilityAct:React.FC=()=>{
  const f=useCurrentFrame();
  const door=spring({frame:f,fps:30,config:{damping:17,stiffness:120}});
  const route=interpolate(f,[36,132],[0,1],clamp);
  const tokenX=interpolate(f,[50,146],[120,720],clamp);
  const tokenY=interpolate(f,[50,95,146],[600,450,650],clamp);
  const reject=spring({frame:Math.max(0,f-155),fps:30,config:{damping:11,stiffness:185}});

  return <AbsoluteFill style={{background:C.navy,overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 35%, rgba(111,166,183,.38), transparent 48%)"}}/>
    <div style={{position:"absolute",left:50,right:50,top:50,bottom:50,border:"12px solid "+C.ink,borderRadius:40,boxShadow:"inset 0 0 0 8px rgba(255,246,230,.08)"}}/>

    <div style={{position:"absolute",left:78,top:72,fontFamily:"Arial",fontWeight:1000,fontSize:62,color:C.cream,opacity:interpolate(f,[0,24],[0,1],clamp)}}>DENTRO DEL SISTEMA</div>
    <div style={{position:"absolute",right:85,top:92,padding:"12px 18px",background:C.cream,border:"7px solid "+C.ink,borderRadius:16,fontFamily:"Arial",fontWeight:1000,fontSize:23,color:C.red,transform:"rotate(3deg)"}}>29 SEP</div>

    <div style={{position:"absolute",left:80,top:280,width:920,height:680,borderRadius:40,background:C.paper,border:"10px solid "+C.ink,boxShadow:"16px 18px 0 rgba(0,0,0,.16)",transform:`scale(${interpolate(door,[0,1],[1.15,1])})`}}>
      <FinancePipe x={85} y={365} w={310} h={80} active={route}/>
      <FinancePipe x={370} y={365} w={270} h={80} rot={-17} active={route}/>
      <FinancePipe x={605} y={290} w={220} h={80} rot={25} active={route}/>
      <MoneyToken x={tokenX} y={tokenY} rotation={f*3}/>
      <UTurnSign frame={f}/>
      <div style={{position:"absolute",right:80,bottom:90,width:210,height:140,borderRadius:20,background:C.red,border:"9px solid "+C.ink,transform:`scale(${reject})`,opacity:reject,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Arial",fontWeight:1000,fontSize:30,color:C.cream,textAlign:"center",lineHeight:1}}>RUTA<br/>CERRADA</div>
    </div>

    <div style={{position:"absolute",left:70,right:70,top:1025,height:4,background:"rgba(255,246,230,.22)"}}/>

    <TravelBadge frame={f}/>
    <EducationLane frame={f}/>

    <div style={{position:"absolute",left:82,right:82,bottom:115,fontFamily:"Arial",fontWeight:1000,fontSize:27,lineHeight:1.05,color:C.cream,opacity:interpolate(f,[285,320],[0,1],clamp)}}>
      Finanzas, reuniones y educación<br/>cambian mediante mecanismos distintos.
    </div>
  </AbsoluteFill>;
};

const FuturePlaceholder:React.FC=()=>(
  <AbsoluteFill style={{background:C.paper,justifyContent:"center",alignItems:"center"}}>
    <PaperTexture/>
    <div style={{fontFamily:"Arial",fontWeight:900,fontSize:44,color:C.ink,opacity:.24}}>SIGUIENTE ACTO EN PRODUCCIÓN</div>
  </AbsoluteFill>
);

export const RubioHabanaAnimated:React.FC=()=>(
  <AbsoluteFill>
    <PaperTexture/>
    <Sequence from={0} durationInFrames={330}><OpeningAct/></Sequence>
    <Sequence from={330} durationInFrames={360}><MayAct/></Sequence>
    <Sequence from={690} durationInFrames={360}><DesignationsAct/></Sequence>
    <Sequence from={1050} durationInFrames={360}><FinanceMobilityAct/></Sequence>
    <Sequence from={1410} durationInFrames={TOTAL_FRAMES-1410}><FuturePlaceholder/></Sequence>
  </AbsoluteFill>
);
