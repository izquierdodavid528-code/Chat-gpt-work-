import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

export const RUBIO_ANIMATIC_FRAMES = 60 * 30;
const VOICE_SCRATCH_READY = false;
const VOICE_SCRATCH_FILE = "audio/narration-scratch-v1.mp3";

type Shot = {
  id: string; from: number; duration: number; act: string;
  heading: string; caption: string; visual: string;
  kind: "placeholder" | "video" | "image"; asset?: string;
};
const shots: Shot[] = [
  {id:"S01",from:0,duration:120,act:"ACT 1 · HOOK",heading:"HARBOR PLATE → ROUTE SEED",caption:"Washington amplió la presión sobre La Habana.",visual:"Use only as harbor environment; not a verified oil tanker.",kind:"video",asset:"flow/video/habana-harbor-ships-v1.mp4"},
  {id:"S02",from:120,duration:150,act:"ACT 2 · 29 JAN",heading:"PLACEHOLDER · MAP + CONDITIONAL ROUTE",caption:"El 29 de enero se abrió la vía para posibles aranceles…",visual:"Build sourced Caribbean geography and a conditional supplier route in Remotion.",kind:"placeholder"},
  {id:"S03",from:270,duration:120,act:"ACT 2 · OIL MECHANISM",heading:"PLACEHOLDER · CONDITIONAL CUSTOMS GATE",caption:"…a países que suministraran petróleo a Cuba.",visual:"Show a mechanism dependent on findings and a further decision; no universal tariff.",kind:"placeholder"},
  {id:"S04",from:390,duration:210,act:"ACT 2 · 20 FEB",heading:"PLACEHOLDER · REMOVE ONE TARIFF MECHANISM",caption:"El 20 de febrero se retiraron esos aranceles; la emergencia y otras medidas siguieron vigentes.",visual:"Flip a calendar, lift only this gate, retain the wider emergency marker.",kind:"placeholder"},
  {id:"S05",from:600,duration:180,act:"ACT 3 · 1 MAY",heading:"EXISTING FLOW PLATE · REACTION ONLY",caption:"En mayo, la orden habilitó sanciones por vínculos con ciertos sectores o conductas…",visual:"Trim before the awkward page lift. Do not imply Rubio signed the order.",kind:"video",asset:"flow/video/rubio-may-document-acting-v1.mp4"},
  {id:"S06",from:780,duration:210,act:"ACT 3 · IMPLEMENTATION",heading:"PLACEHOLDER · STATE + TREASURY",caption:"…y encargó su aplicación a Estado y Tesoro. Rubio, secretario de Estado, no la firmó.",visual:"Two implementation branches from the presidential order; exact labels in Remotion.",kind:"placeholder"},
  {id:"S07",from:990,duration:60,act:"ACT 4 · OFAC",heading:"PLACEHOLDER · REGISTER SETUP",caption:"En septiembre, OFAC añadió varias entidades a su lista…",visual:"Brief blank register and one restrained stamp. No generated names or logos.",kind:"placeholder"},
  {id:"S08",from:1050,duration:180,act:"ACT 4 · BANCO EXTERIOR",heading:"EXISTING FLOW PLATE · BANK TRANSFORMATION",caption:"…incluido el Banco Exterior de Cuba.",visual:"Add the sourced exact label/date over the blank facade in Remotion.",kind:"video",asset:"flow/video/ofac-ledger-to-bank-v1.mp4"},
  {id:"S09",from:1230,duration:150,act:"ACT 5 · FINANCE",heading:"PLACEHOLDER · DEFINED U-TURN ROUTE",caption:"Ese mes cambió la licencia general para ciertas transferencias U-turn.",visual:"Show only the transaction scope in OFAC FAQ 1272, not all Cuba-related payments.",kind:"placeholder"},
  {id:"S10",from:1380,duration:90,act:"ACT 5 · PROFESSIONAL MEETINGS",heading:"PLACEHOLDER · REMOVE AUTHORIZATION TAB",caption:"También se eliminó la autorización de reuniones profesionales…",visual:"Add exact wind-down scope/date in a small sourced caption.",kind:"placeholder"},
  {id:"S11",from:1470,duration:120,act:"ACT 5 · EDUCATION",heading:"PLACEHOLDER · NARROWED EDUCATION LANES",caption:"…y se acotaron viajes educativos, con excepciones transitorias.",visual:"Keep an exception branch visible; details follow OFAC FAQ 1274.",kind:"placeholder"},
  {id:"S12",from:1590,duration:210,act:"ACT 6 · ATTRIBUTED CLOSE",heading:"EXISTING MAP STILL · TIMELINE PULLBACK",caption:"Washington invoca seguridad nacional; el MINREX denuncia un recrudecimiento del bloqueo.",visual:"Keep the two institutional views separately attributed.",kind:"image",asset:"flow/images/rubio-policy-map-reference-v1.jpg"},
];
const ink="#25282a", ivory="#f2e8d4", coral="#ce6259";
const Paper: React.FC=()=> <AbsoluteFill style={{backgroundColor:ivory,backgroundImage:"radial-gradient(circle at 12% 20%, rgba(37,40,42,.07) 0 1px, transparent 1.4px), radial-gradient(circle at 75% 65%, rgba(37,40,42,.045) 0 1px, transparent 1.4px)",backgroundSize:"19px 19px, 27px 27px"}}/>;
const Caption: React.FC<{children:string}>=({children})=><div style={{position:"absolute",left:84,right:84,bottom:150,minHeight:120,padding:"28px 32px",boxSizing:"border-box",background:"rgba(25,31,38,.91)",color:"#fff9ed",borderLeft:"9px solid "+coral,borderRadius:10,fontFamily:"Arial, sans-serif",fontSize:43,lineHeight:1.18,fontWeight:700,letterSpacing:"-0.6px"}}>{children}</div>;
const Placeholder: React.FC<{shot:Shot}>=({shot})=>{
 const f=useCurrentFrame();
 const p=interpolate(f,[0,shot.duration],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 const drift=interpolate(p,[0,1],[22,-22]);
 return <AbsoluteFill style={{overflow:"hidden",background:"linear-gradient(145deg, #e8ddc6, #f7f0e3 55%, #d8d1c3)"}}>
  <div style={{position:"absolute",inset:0,transform:"translateY("+drift+"px) scale("+(1.04+p*.025)+")",opacity:.62}}>
   <div style={{position:"absolute",left:"12%",top:"21%",width:"76%",height:2,background:"rgba(52,69,86,.28)"}}/>
   <div style={{position:"absolute",left:"18%",top:"28%",width:"64%",height:"42%",border:"3px dashed rgba(52,69,86,.34)",borderRadius:24}}/>
   <div style={{position:"absolute",left:"27%",top:"38%",width:"46%",height:"24%",background:"rgba(206,98,89,.13)",border:"2px solid rgba(206,98,89,.45)",borderRadius:20}}/>
   <div style={{position:"absolute",left:"23%",top:"76%",width:"54%",height:2,background:"rgba(52,69,86,.25)"}}/>
  </div>
  <AbsoluteFill style={{justifyContent:"center",alignItems:"center",padding:110,boxSizing:"border-box"}}>
   <div style={{color:ink,textAlign:"center",fontFamily:"Arial, sans-serif",maxWidth:860}}>
    <div style={{fontSize:25,fontWeight:800,letterSpacing:5,color:coral}}>BLOCKING PLACEHOLDER · NOT FINAL ART</div>
    <div style={{marginTop:40,fontSize:63,lineHeight:1.08,fontWeight:800}}>{shot.heading}</div>
    <div style={{margin:"34px auto 0",padding:"22px 28px",display:"inline-block",borderRadius:12,background:"rgba(255,250,239,.84)",border:"2px solid rgba(37,40,42,.3)",fontSize:32,lineHeight:1.25,fontWeight:500}}>{shot.visual}</div>
   </div>
  </AbsoluteFill>
 </AbsoluteFill>;
};
const ShotLayer: React.FC<{shot:Shot}>=({shot})=>{
 const frame=useCurrentFrame();
 const zoom=interpolate(frame,[0,shot.duration],[1.01,1.045],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 return <AbsoluteFill>
  {shot.kind==="placeholder"&&<Placeholder shot={shot}/>}
  {shot.kind==="video"&&shot.asset&&<OffthreadVideo src={staticFile(shot.asset)} muted startFrom={0} style={{width:"100%",height:"100%",objectFit:"cover",transform:"scale("+zoom+")"}}/>}
  {shot.kind==="image"&&shot.asset&&<Img src={staticFile(shot.asset)} style={{width:"100%",height:"100%",objectFit:"cover",transform:"scale("+zoom+")"}}/>}
  <div style={{position:"absolute",left:64,right:64,top:72,display:"flex",justifyContent:"space-between",alignItems:"center",color:"#fff9ef",fontFamily:"Arial, sans-serif",textShadow:"0 2px 8px rgba(0,0,0,.55)"}}>
   <div style={{padding:"14px 18px",background:"rgba(31,39,44,.84)",borderRadius:8,fontSize:25,fontWeight:800,letterSpacing:2}}>{shot.act}</div>
   <div style={{fontSize:23,fontWeight:700}}>{shot.id} / ANIMATIC</div>
  </div>
  {shot.kind!=="placeholder"&&<div style={{position:"absolute",left:66,right:66,top:160,color:"#fffaf0",font:"700 22px Arial, sans-serif",letterSpacing:1,textShadow:"0 2px 8px rgba(0,0,0,.7)"}}>EXISTING ASSET · TEMPORARY ROUTING</div>}
  <Caption>{shot.caption}</Caption>
 </AbsoluteFill>;
};
export const RubioSixtySecondAnimatic: React.FC=()=> <AbsoluteFill>
 <Paper/>
 {shots.map(shot=><Sequence key={shot.id} from={shot.from} durationInFrames={shot.duration}><ShotLayer shot={shot}/></Sequence>)}
 {VOICE_SCRATCH_READY&&<Audio src={staticFile(VOICE_SCRATCH_FILE)} volume={1}/>}
 {!VOICE_SCRATCH_READY&&<div style={{position:"absolute",right:42,top:22,padding:"10px 14px",background:"#a74842",color:"white",font:"800 17px Arial, sans-serif",letterSpacing:1}}>VOICE SCRATCH PENDING — DO NOT APPROVE</div>}
</AbsoluteFill>;
