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
    <svg width="210" height="180" viewBox="0 0 210 180" style={{position:"absolute",left:x,top:y,transform:`scale(${s}) rotate(-3deg)`,transformOrigin:"center"}}>
      <rect x="16" y="22" width="178" height="136" rx="12" fill={C.mustard} stroke={C.ink} strokeWidth="9"/>
      <path d="M60 24 V157 M104 24 V157 M148 24 V157" stroke={C.ink} strokeWidth="6" opacity=".65"/>
      <path d="M33 66 H178" stroke={C.cream} strokeWidth="7" opacity=".8"/>
    </svg>
  );
};

const CustomsGate:React.FC<{frame:number}> = ({frame}) => {
  const close=spring({frame:Math.max(0,frame-205),fps:30,config:{damping:13,stiffness:170}});
  const armRot=interpolate(close,[0,1],[-72,0]);
  const stamp=spring({frame:Math.max(0,frame-226),fps:30,config:{damping:10,stiffness:220}});
  return (
    <>
      <div style={{position:"absolute",right:70,top:420,width:260,height:260}}>
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
        opacity:stamp,
        border:"8px solid "+C.red,borderRadius:18,padding:"14px 20px",
        fontFamily:"Arial",fontSize:34,fontWeight:1000,color:C.red,
        background:"rgba(243,233,210,.88)"
      }}>29 ENE</div>
      <div style={{position:"absolute",right:94,top:845,fontFamily:"Arial",fontSize:22,fontWeight:900,color:C.ink,opacity:stamp}}>EO 14380</div>
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
      opacity:interpolate(f,[0,18],[0,1],clamp)
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

    <div style={{
      position:"absolute",left:70,bottom:82,
      fontFamily:"Arial",fontWeight:900,fontSize:18,letterSpacing:2,
      color:C.ink,opacity:.7
    }}>PROTOTIPO DE LENGUAJE VISUAL · ILUSTRACIÓN ORIGINAL</div>
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
    <Sequence from={330} durationInFrames={TOTAL_FRAMES-330}><FuturePlaceholder/></Sequence>
  </AbsoluteFill>
);
