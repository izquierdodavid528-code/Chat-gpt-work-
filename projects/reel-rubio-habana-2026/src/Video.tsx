import React from "react";
import {AbsoluteFill, Audio, Sequence, Video, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";

export const ANIMATIC_FRAMES = 20 * 30;
const BED = staticFile("rubio-habana-animatic-bed.wav");
const HOOK_PLATE = staticFile("rubio-habana-map.mp4");

const BG="#081018";
const INK="#F2F0EA";
const STEEL="#7E97A8";
const RED="#D93636";
const GOLD="#B49A63";

const LayerLabel: React.FC<{text:string; y:number; delay:number}> = ({text,y,delay}) => {
  const f=useCurrentFrame();
  const p=spring({frame:Math.max(0,f-delay),fps:30,config:{damping:180,stiffness:160}});
  return <div style={{
    position:"absolute",left:92,top:y,color:INK,fontFamily:"Arial, sans-serif",fontSize:42,fontWeight:800,
    letterSpacing:1.2,opacity:p,transform:`translateX(${interpolate(p,[0,1],[42,0])}px)`
  }}><span style={{display:"inline-block",width:16,height:16,borderRadius:99,background:RED,marginRight:18}}/>{text}</div>;
};

const MapHook:React.FC=()=>{
  const f=useCurrentFrame();
  const pulse=0.96+0.04*Math.sin(f/7);
  const titleIn=spring({frame:f,fps:30,config:{damping:180,stiffness:150}});
  const plateOpacity=interpolate(f,[0,10,132,149],[0,1,1,.72],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  return <AbsoluteFill style={{background:BG,overflow:"hidden"}}>
    <Video
      src={HOOK_PLATE}
      muted
      playbackRate={0.7}
      style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:plateOpacity}}
    />
    <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(2,7,12,.08) 0%,rgba(4,8,13,.18) 42%,rgba(4,8,13,.76) 72%,rgba(4,8,13,.96) 100%)"}}/>
    <div style={{position:"absolute",inset:0,boxShadow:"inset 0 0 180px rgba(0,0,0,.45)"}}/>
    <div style={{position:"absolute",left:74,right:74,bottom:250,opacity:titleIn,transform:`translateY(${interpolate(titleIn,[0,1],[34,0])}px)`}}>
      <div style={{color:GOLD,fontFamily:"Arial",fontSize:20,fontWeight:900,letterSpacing:3,marginBottom:16}}>2026</div>
      <div style={{color:INK,fontFamily:"Arial",fontSize:72,fontWeight:900,lineHeight:.98,letterSpacing:-2,textShadow:"0 8px 28px rgba(0,0,0,.48)"}}>LA PRESIÓN<br/>SE AMPLÍA</div>
      <div style={{color:INK,fontFamily:"Arial",fontSize:27,fontWeight:700,marginTop:20,textShadow:"0 4px 18px rgba(0,0,0,.55)"}}>No fue una sola medida.</div>
    </div>
    <LayerLabel text="PETRÓLEO" y={790} delay={74}/>
    <LayerLabel text="SANCIONES" y={860} delay={88}/>
    <LayerLabel text="FINANZAS" y={930} delay={102}/>
    <LayerLabel text="MOVILIDAD" y={1000} delay={116}/>
    <div style={{position:"absolute",right:90,top:120,width:12,height:12,borderRadius:99,background:RED,boxShadow:"0 0 18px rgba(217,54,54,.55)",transform:`scale(${pulse})`}}/>
  </AbsoluteFill>
};

const OilLayer:React.FC=()=>{
  const f=useCurrentFrame();
  const shipX=interpolate(f,[0,270],[-120,760],{extrapolateRight:"clamp"});
  const doc=spring({frame:Math.max(0,f-24),fps:30,config:{damping:180,stiffness:160}});
  return <AbsoluteFill style={{background:"linear-gradient(180deg,#081018,#0c1823)",overflow:"hidden"}}>
    <div style={{position:"absolute",top:110,left:70,color:GOLD,fontFamily:"Arial",fontSize:20,fontWeight:900,letterSpacing:3}}>CAPA 1 · PETRÓLEO</div>
    <div style={{position:"absolute",top:166,left:70,right:70,color:INK,fontFamily:"Arial",fontSize:54,fontWeight:900,lineHeight:1.02}}>29 ENE · EO 14380</div>
    <div style={{position:"absolute",top:310,left:70,right:70,height:470,borderRadius:32,background:"linear-gradient(180deg,#0f2b3c,#07111a)",border:"1px solid rgba(126,151,168,.25)",overflow:"hidden"}}>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:150,background:"linear-gradient(180deg,rgba(20,65,90,.2),rgba(5,18,28,.95))"}}/>
      <div style={{position:"absolute",bottom:95,left:shipX,width:260,height:44,background:"#334957",borderRadius:"8px 28px 6px 6px",boxShadow:"0 10px 30px rgba(0,0,0,.4)"}}/>
      <div style={{position:"absolute",bottom:139,left:shipX+65,width:75,height:48,background:"#657b88",borderRadius:6}}/>
      <div style={{position:"absolute",bottom:190,left:shipX+95,width:4,height:80,background:"#879aa5"}}/>
      <div style={{position:"absolute",bottom:128,left:120,right:120,height:2,background:"linear-gradient(90deg,transparent,rgba(217,54,54,.75),transparent)"}}/>
    </div>
    <div style={{position:"absolute",left:90,top:850,width:900,padding:"34px 36px",background:"rgba(245,241,232,.94)",borderRadius:20,boxShadow:"0 28px 80px rgba(0,0,0,.38)",opacity:doc,transform:`translateY(${interpolate(doc,[0,1],[38,0])}px)`}}>
      <div style={{fontFamily:"Georgia",color:"#262626",fontSize:24,fontWeight:700,letterSpacing:.5}}>THE WHITE HOUSE</div>
      <div style={{height:2,background:"#8b6f46",margin:"16px 0 20px"}}/>
      <div style={{fontFamily:"Georgia",color:"#181818",fontSize:34,fontWeight:800,lineHeight:1.1}}>Executive Order 14380</div>
      <div style={{fontFamily:"Arial",color:"#555",fontSize:22,marginTop:10}}>January 29, 2026</div>
      <div style={{marginTop:22,paddingTop:18,borderTop:"1px solid #b8aa92",fontFamily:"Arial",color:"#6f3a3a",fontSize:20,fontWeight:800}}>FEB 20 · EO 14389 → additional IEEPA tariffs ended</div>
    </div>
    <div style={{position:"absolute",left:70,right:70,bottom:300,color:INK,fontFamily:"Arial",fontSize:32,fontWeight:800,lineHeight:1.16}}>29 ENE · se abre una vía arancelaria ligada al suministro de petróleo.</div>
    <div style={{position:"absolute",left:70,right:70,bottom:210,color:STEEL,fontFamily:"Arial",fontSize:25,fontWeight:750,lineHeight:1.18}}>20 FEB · EO 14389 termina esos aranceles IEEPA; la emergencia continúa.</div>
  </AbsoluteFill>
};

const Framework:React.FC=()=>{
  const f=useCurrentFrame();
  const p=spring({frame:f,fps:30,config:{damping:180,stiffness:150}});
  return <AbsoluteFill style={{background:"#080c11"}}>
    <div style={{position:"absolute",left:70,top:120,color:GOLD,fontFamily:"Arial",fontSize:20,fontWeight:900,letterSpacing:3}}>CAPA 2 · MARCO LEGAL</div>
    <div style={{position:"absolute",left:70,top:175,right:70,color:INK,fontFamily:"Arial",fontSize:54,fontWeight:900,lineHeight:1}}>1 MAY · EO 14404</div>
    <div style={{position:"absolute",left:95,top:360,width:890,height:540,borderRadius:28,border:"1px solid rgba(126,151,168,.26)",background:"radial-gradient(circle at 50% 50%,rgba(126,151,168,.14),rgba(6,10,14,.95))"}}>
      {["STATE","TREASURY","BANKS","ENTITIES"].map((t,i)=>{
        const ang=[-110,-20,70,160][i]*Math.PI/180;
        const x=445+Math.cos(ang)*280;
        const y=270+Math.sin(ang)*180;
        return <React.Fragment key={t}>
          <div style={{position:"absolute",left:445,top:270,width:Math.abs(x-445),height:2,background:"rgba(217,54,54,.34)",transformOrigin:"left",transform:`rotate(${Math.atan2(y-270,x-445)}rad)`}}/>
          <div style={{position:"absolute",left:x-80,top:y-30,width:160,height:60,borderRadius:30,background:"#132331",border:"1px solid rgba(126,151,168,.35)",display:"flex",alignItems:"center",justifyContent:"center",color:INK,fontFamily:"Arial",fontSize:16,fontWeight:900,letterSpacing:1.2}}>{t}</div>
        </React.Fragment>
      })}
      <div style={{position:"absolute",left:355,top:185,width:180,height:180,borderRadius:"50%",border:"4px solid "+RED,display:"flex",alignItems:"center",justifyContent:"center",color:INK,fontFamily:"Arial",fontSize:28,fontWeight:900,transform:`scale(${.85+.15*p})`}}>EO 14404</div>
    </div>
    <div style={{position:"absolute",left:70,right:70,bottom:310,color:INK,fontFamily:"Arial",fontSize:38,fontWeight:900,lineHeight:1.14}}>El marco de sanciones se amplía.</div>
    <div style={{position:"absolute",left:70,right:70,bottom:220,color:STEEL,fontFamily:"Arial",fontSize:25,fontWeight:650,lineHeight:1.25}}>La implementación involucra al Departamento de Estado y al Tesoro.</div>
    <div style={{position:"absolute",right:70,bottom:110,color:RED,fontFamily:"Arial",fontSize:18,fontWeight:900,letterSpacing:2}}>MARCO RUBIO · SECRETARIO DE ESTADO</div>
  </AbsoluteFill>
};

export const RubioHabanaAnimatic:React.FC=()=>{
  const f=useCurrentFrame();
  const vol=interpolate(f,[0,30,120,480,590],[0.04,0.10,0.075,0.07,0.02],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  return <AbsoluteFill style={{background:BG}}>
    <Audio src={BED} volume={vol}/>
    <Sequence from={0} durationInFrames={150}><MapHook/></Sequence>
    <Sequence from={150} durationInFrames={270}><OilLayer/></Sequence>
    <Sequence from={420} durationInFrames={180}><Framework/></Sequence>
  </AbsoluteFill>;
};
