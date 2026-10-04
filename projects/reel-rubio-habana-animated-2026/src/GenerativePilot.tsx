import React from "react";
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from "remotion";

export const GENERATIVE_PILOT_FRAMES = 426;
const SOURCE_OFFSET = 684; // Exact 22.8 s voice/music window in the 30 fps master.
const captions = [
 {from:0,to:85,text:"y encargó su aplicación\na Estado y Tesoro."},
 {from:100,to:203,text:"Rubio, secretario de Estado,\nno la firmó."},
 {from:221,to:336,text:"En septiembre, OFAC añadió\nvarias entidades a su lista,"},
 {from:339,to:426,text:"incluido el Banco Exterior de Cuba."},
];

const FactualOverlay:React.FC=()=>{
 const f=useCurrentFrame();
 let eyebrow="",body="";
 if(f<85){eyebrow="APLICACIÓN DE LA ORDEN PRESIDENCIAL";body="Estado · Tesoro";}
 else if(f>=100&&f<203){eyebrow="RUBIO · SECRETARIO DE ESTADO";body="No firmó la orden";}
 else if(f>=221&&f<339){eyebrow="SEPTIEMBRE · OFAC";body="Varias entidades incorporadas";}
 else if(f>=339){eyebrow="03 SEP 2026 · OFAC";body="Banco Exterior de Cuba";}
 const cap=captions.find(c=>f>=c.from&&f<c.to);
 return <AbsoluteFill style={{pointerEvents:"none",fontFamily:"Arial,sans-serif",color:"#253641"}}>
  {body&&<div style={{position:"absolute",inset:"0 0 auto",height:330,background:"linear-gradient(rgba(244,234,213,.94),rgba(244,234,213,.76) 63%,rgba(244,234,213,0))"}}>
   <div style={{position:"absolute",left:72,right:72,top:84,fontSize:25,lineHeight:1.25,fontWeight:700,letterSpacing:1.3}}>{eyebrow}</div>
   <div style={{position:"absolute",left:72,right:72,top:128,fontSize:body.length>25?38:43,lineHeight:1.15,fontWeight:800,letterSpacing:-.6}}>{body}</div>
  </div>}
  {cap&&<div style={{position:"absolute",left:72,right:72,bottom:166,padding:"24px 28px",boxSizing:"border-box",borderRadius:8,background:"rgba(28,37,45,.94)",color:"#fff9ed",fontSize:40,lineHeight:1.18,fontWeight:700,whiteSpace:"pre-line",letterSpacing:-.4}}>{cap.text}</div>}
 </AbsoluteFill>;
};

export const RubioGenerativeS06S08Pilot:React.FC=()=>{
 const f=useCurrentFrame();
 const musicVolume=interpolate(f,[0,9,412,425],[0,.75,.75,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 return <AbsoluteFill style={{backgroundColor:"#eee3d0"}}>
  {/* A trims its initial idle handle; B stays one uninterrupted take across S07/S08.
      The source geometry failures remain visible for review, with no decorative wipe. */}
  <Sequence from={0} durationInFrames={221}>
   <OffthreadVideo src={staticFile("flow/video/pilot-s06-delegation-organic-v1.mp4")} trimBefore={19} muted style={{width:"100%",height:"100%",objectFit:"cover"}}/>
  </Sequence>
  <Sequence from={221} durationInFrames={205}>
   <OffthreadVideo src={staticFile("flow/video/pilot-s07-s08-registry-bank-v1.mp4")} muted style={{width:"100%",height:"100%",objectFit:"cover"}}/>
  </Sequence>
  <FactualOverlay/>
  <Audio src={staticFile("audio/narration-scratch-v1-master.mp3")} trimBefore={SOURCE_OFFSET} volume={1}/>
  <Audio src={staticFile("audio/rubio-music-bed-v1.wav")} trimBefore={SOURCE_OFFSET} volume={musicVolume}/>
  <Audio src={staticFile("audio/pilot-s06-s08-sfx-v1.wav")} volume={1}/>
 </AbsoluteFill>;
};
