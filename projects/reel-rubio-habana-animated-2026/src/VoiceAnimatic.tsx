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
const VOICE_SCRATCH_READY = true;
const VOICE_SCRATCH_FILE = "audio/narration-scratch-v1-master.mp3";
const MUSIC_BED_FILE = "audio/rubio-music-bed-v1.wav";
const SFX_CUES_FILE = "audio/rubio-sfx-cues-v1.wav";

type Shot = {
  id: string; from: number; duration: number; act: string;
  heading: string; caption: string; visual: string;
  kind: "placeholder" | "video" | "image"; asset?: string; startFrom?: number;
};
const shots: Shot[] = [
  {id:"S01",from:0,duration:102,act:"1 · CONTEXTO",heading:"HARBOR PLATE → ROUTE SEED",caption:"Washington amplió la presión\nsobre La Habana.",visual:"Use only as harbor environment; not a verified oil tanker.",kind:"video",asset:"flow/video/habana-harbor-ships-v1.mp4"},
  {id:"S02",from:102,duration:63,act:"2 · ENERO",heading:"PLACEHOLDER · MAP + CONDITIONAL ROUTE",caption:"El 29 de enero se abrió\nla vía",visual:"Build sourced Caribbean geography and a conditional supplier route in Remotion.",kind:"placeholder"},
  {id:"S03",from:165,duration:151,act:"2 · ARANCELES CONDICIONALES",heading:"PLACEHOLDER · CONDITIONAL CUSTOMS GATE",caption:"para posibles aranceles a países\nque suministraran petróleo a Cuba.",visual:"Show a mechanism dependent on findings and a further decision; no universal tariff.",kind:"placeholder"},
  {id:"S04",from:316,duration:214,act:"2 · FEBRERO",heading:"PLACEHOLDER · REMOVE ONE TARIFF MECHANISM",caption:"El 20 de febrero se retiraron esos aranceles;\nla emergencia y otras medidas siguieron vigentes.",visual:"Flip a calendar, lift only this gate, retain the wider emergency marker.",kind:"placeholder"},
  {id:"S05",from:530,duration:154,act:"3 · MAYO",heading:"EXISTING FLOW PLATE · REACTION ONLY",caption:"En mayo, la orden habilitó sanciones\npor vínculos con ciertos sectores o conductas",visual:"Trim before the awkward page lift. Do not imply Rubio signed the order.",kind:"video",asset:"flow/video/rubio-may-document-acting-v1.mp4"},
  {id:"S06",from:684,duration:221,act:"3 · APLICACIÓN",heading:"PLACEHOLDER · STATE + TREASURY",caption:"y encargó su aplicación a Estado y Tesoro.\nRubio, secretario de Estado, no la firmó.",visual:"Two implementation branches from the presidential order; exact labels in Remotion.",kind:"placeholder"},
  {id:"S07",from:905,duration:118,act:"4 · DESIGNACIONES",heading:"PLACEHOLDER · REGISTER SETUP",caption:"En septiembre, OFAC añadió varias\nentidades a su lista,",visual:"Brief blank register and one restrained stamp. No generated names or logos.",kind:"placeholder"},
  {id:"S08",from:1023,duration:87,act:"4 · BANCO EXTERIOR",heading:"EXISTING FLOW PLATE · BANK TRANSFORMATION",caption:"incluido el Banco Exterior de Cuba.",visual:"Add the sourced exact label/date over the blank facade in Remotion.",kind:"video",asset:"flow/video/ofac-ledger-to-bank-v1.mp4",startFrom:72},
  {id:"S09",from:1110,duration:150,act:"5 · TRANSFERENCIAS",heading:"PLACEHOLDER · DEFINED U-TURN ROUTE",caption:"Ese mes cambió la licencia general\npara ciertas transferencias U-turn.",visual:"Show only the transaction scope in OFAC FAQ 1272, not all Cuba-related payments.",kind:"placeholder"},
  {id:"S10",from:1260,duration:101,act:"5 · REUNIONES",heading:"PLACEHOLDER · REMOVE AUTHORIZATION TAB",caption:"También se eliminó la autorización\nde reuniones profesionales,",visual:"Add exact wind-down scope/date in a small sourced caption.",kind:"placeholder"},
  {id:"S11",from:1361,duration:148,act:"5 · VIAJES EDUCATIVOS",heading:"PLACEHOLDER · NARROWED EDUCATION LANES",caption:"y se acotaron viajes educativos,\ncon excepciones transitorias.",visual:"Keep an exception branch visible; details follow OFAC FAQ 1274.",kind:"placeholder"},
  {id:"S12",from:1509,duration:291,act:"6 · CIERRE",heading:"EXISTING MAP STILL · TIMELINE PULLBACK",caption:"Washington invoca seguridad nacional;\nel MINREX denuncia un recrudecimiento del bloqueo.",visual:"Keep the two institutional views separately attributed.",kind:"image",asset:"flow/images/rubio-policy-map-reference-v1.jpg"},
];
const ink="#25282a", ivory="#f2e8d4", coral="#ce6259";
const Paper: React.FC=()=> <AbsoluteFill style={{backgroundColor:ivory,backgroundImage:"radial-gradient(circle at 12% 20%, rgba(37,40,42,.07) 0 1px, transparent 1.4px), radial-gradient(circle at 75% 65%, rgba(37,40,42,.045) 0 1px, transparent 1.4px)",backgroundSize:"19px 19px, 27px 27px"}}/>;
const Caption: React.FC<{children:string}>=({children})=><div style={{position:"absolute",left:84,right:84,bottom:150,minHeight:120,padding:"28px 32px",boxSizing:"border-box",background:"rgba(25,31,38,.91)",color:"#fff9ed",borderLeft:"9px solid "+coral,borderRadius:10,fontFamily:"Arial, sans-serif",fontSize:children.length>70?31:children.length>55?34:38,lineHeight:1.18,fontWeight:700,letterSpacing:"-0.6px",whiteSpace:"pre-line"}}>{children}</div>;
const MotionGraphic: React.FC<{shot:Shot}>=({shot})=>{
 const f=useCurrentFrame();
 const p=interpolate(f,[0,shot.duration],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 const coral="#ce6259", navy="#344556", teal="#4e9aa0", cream="#fffaf0", ink="#25282a";
 const card:React.CSSProperties={position:"absolute",left:"4%",right:"4%",top:"14%",height:"71%",borderRadius:26,background:"rgba(255,250,239,.9)",border:"2px solid rgba(37,40,42,.18)",boxShadow:"0 24px 60px rgba(37,40,42,.16)",overflow:"hidden"};
 const label:React.CSSProperties={font:"800 32px Arial,sans-serif",letterSpacing:2,color:navy};
 const tiny:React.CSSProperties={font:"700 28px Arial,sans-serif",letterSpacing:1.1,color:navy};
 const pill:React.CSSProperties={padding:"16px 22px",borderRadius:14,background:navy,color:cream,font:"800 27px Arial,sans-serif",letterSpacing:1.2,boxShadow:"0 10px 20px rgba(37,40,42,.15)"};
 const move=interpolate(p,[0,1],[70,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 return <AbsoluteFill style={{overflow:"hidden",background:"linear-gradient(145deg,#e8ddc6,#f7f0e3 54%,#d8d1c3)"}}>
  <Paper/>
  <div style={{position:"absolute",left:"8%",right:"8%",top:"12%",height:"74%",transform:"translateY("+move+"px)",opacity:interpolate(p,[0,.07],[0,1],{extrapolateRight:"clamp"})}}>
   {shot.id==="S02"&&<div style={{...card,background:"#b9d9d8"}}>
    <div style={{position:"absolute",left:40,top:34,...label}}>CARIBE · ESQUEMA NO A ESCALA</div>
    <svg viewBox="0 0 900 600" style={{position:"absolute",inset:"70px 15px 15px",width:"calc(100% - 30px)",height:"calc(100% - 85px)"}}>
     <path d="M610 40 C670 60 690 130 680 180 L654 235 640 300 615 350 592 330 600 260 580 200 588 120Z" fill="#dfc9a6" stroke={navy} strokeWidth="5"/>
     <path d="M230 370 C315 330 408 345 503 360 C580 372 663 374 758 404 C686 428 595 435 505 419 C410 402 320 393 230 410Z" fill="#dfc9a6" stroke={navy} strokeWidth="5"/>
     <path d="M548 470 C575 450 600 452 620 464 C605 482 577 487 548 470Z" fill="#dfc9a6" stroke={navy} strokeWidth="4"/>
     <path d="M154 343 C278 308 408 313 572 382" fill="none" stroke={coral} strokeWidth="10" strokeLinecap="round" strokeDasharray="700" strokeDashoffset={700*(1-p)} />
     <circle cx="155" cy="343" r="15" fill={cream} stroke={coral} strokeWidth="8"/>
     <circle cx="572" cy="382" r="17" fill={coral} stroke={cream} strokeWidth="6"/>
     <text x="100" y="300" fill={navy} fontSize="30" fontWeight="700">POSIBLE PROVEEDOR</text>
     <text x="530" y="450" fill={navy} fontSize="32" fontWeight="800">CUBA</text>
    </svg>
    <div style={{position:"absolute",right:26,bottom:24,...pill}}>29 ENE · VÍA CONDICIONAL</div>
   </div>}
   {shot.id==="S03"&&<div style={{...card,background:"#d8e8e4"}}>
    <div style={{position:"absolute",left:42,top:36,...label}}>UNA RUTA, UNA POSIBLE BARRERA</div>
    <div style={{position:"absolute",left:"8%",top:"35%",transform:"translateX("+interpolate(p,[0,1],[-30,145])+"px)",transition:"none"}}>
     <div style={{width:126,height:100,background:"#c89a65",border:"5px solid "+navy,borderRadius:"16px 16px 8px 8px",boxShadow:"0 12px 0 rgba(52,69,86,.15)"}}/>
     <div style={{position:"absolute",left:34,top:20,width:52,height:38,borderTop:"5px solid "+navy,borderBottom:"5px solid "+navy}}/>
    </div>
    <div style={{position:"absolute",left:"48%",top:"21%",width:18,height:300,background:navy,borderRadius:20,transformOrigin:"50% 90%",transform:"rotate("+interpolate(p,[0,.6],[0,-48])+"deg)",boxShadow:"9px 12px 0 rgba(37,40,42,.16)"}}/>
    <div style={{position:"absolute",left:"43%",top:"71%",width:110,height:24,borderRadius:20,background:navy}}/>
    <div style={{position:"absolute",right:"8%",top:"38%",...pill,background:coral,transform:"translateY("+interpolate(p,[0,1],[28,0])+"px)"}}>POSIBLE ARANCEL</div>
    <div style={{position:"absolute",right:"8%",bottom:"12%",...tiny}}>solo si se determina que procede</div>
    <svg viewBox="0 0 900 100" style={{position:"absolute",left:0,bottom:18,width:"100%",height:100}}><path d="M70 50 H820" stroke={teal} strokeWidth="9" strokeDasharray="18 22" strokeLinecap="round"/></svg>
   </div>}
   {shot.id==="S04"&&<div style={{...card}}>
    <div style={{position:"absolute",left:42,top:34,...label}}>CAMBIA EL MECANISMO</div>
    <div style={{position:"absolute",left:"13%",top:"24%",width:"34%",height:"46%",background:"#f6ead4",border:"3px solid "+navy,borderRadius:16,boxShadow:"12px 14px 0 rgba(52,69,86,.13)",transform:"rotate(-3deg)"}}>
     <div style={{...tiny,margin:"22px 18px"}}>29 ENE</div><div style={{font:"800 44px Arial",color:navy,margin:"8px 18px"}}>ARANCELES</div><div style={{height:5,background:coral,margin:"20px 18px",transform:"scaleX("+p+")",transformOrigin:"left"}}/>
    </div>
    <div style={{position:"absolute",left:"48%",top:"36%",width:100,height:8,background:coral,transform:"rotate(-22deg) scaleX("+p+")",transformOrigin:"left"}}/>
    <div style={{position:"absolute",left:"64%",top:"24%",width:"25%",height:"46%",background:"#f6ead4",border:"3px solid "+navy,borderRadius:16,boxShadow:"12px 14px 0 rgba(52,69,86,.13)",transform:"rotate(3deg)"}}>
     <div style={{...tiny,margin:"22px 18px"}}>20 FEB</div><div style={{font:"800 29px Arial",color:navy,margin:"8px 18px"}}>RETIRADOS</div>
    </div>
    <div style={{position:"absolute",left:"21%",right:"21%",bottom:"11%",padding:22,borderRadius:18,background:"rgba(78,154,160,.16)",border:"2px solid "+teal,display:"flex",justifyContent:"space-around",alignItems:"center"}}>
     <span style={tiny}>EMERGENCIA</span><span style={{font:"800 26px Arial",color:teal}}>SIGUE VIGENTE</span>
    </div>
   </div>}
   {shot.id==="S06"&&<div style={{...card}}>
    <div style={{position:"absolute",left:42,top:34,...label}}>APLICACIÓN DE LA ORDEN · 01 MAY</div>
    <div style={{position:"absolute",left:"34%",top:"18%",width:"32%",height:"25%",padding:26,boxSizing:"border-box",background:"#fff5e4",border:"3px solid "+navy,borderRadius:18,boxShadow:"0 16px 24px rgba(37,40,42,.15)",textAlign:"center",font:"800 32px Arial",color:navy,transform:"translateY("+interpolate(p,[0,.3],[80,0])+"px)"}}>ORDEN</div>
    <svg viewBox="0 0 900 220" style={{position:"absolute",left:"14%",right:"14%",top:"43%",width:"72%",height:220}}><path d="M450 0 V80 M450 80 H175 V145 M450 80 H725 V145" fill="none" stroke={coral} strokeWidth="9" strokeDasharray="480" strokeDashoffset={480*(1-p)}/></svg>
    <div style={{position:"absolute",left:"11%",top:"69%",width:"34%",padding:"25px 0",textAlign:"center",...pill,background:"#48616f"}}>ESTADO</div>
    <div style={{position:"absolute",right:"11%",top:"69%",width:"34%",padding:"25px 0",textAlign:"center",...pill,background:"#48616f"}}>TESORO</div>
    <div style={{position:"absolute",left:"19%",right:"19%",bottom:"8%",textAlign:"center",...tiny}}>Marco Rubio era secretario de Estado; no firmó la orden.</div>
   </div>}
   {shot.id==="S07"&&<div style={{...card}}>
    <div style={{position:"absolute",left:42,top:34,...label}}>REGISTRO · SEPTIEMBRE</div>
    <div style={{position:"absolute",left:"12%",top:"18%",width:"58%",height:"65%",background:"#f8f0df",border:"3px solid "+navy,borderRadius:12,boxShadow:"14px 18px 0 rgba(52,69,86,.12)",padding:34,boxSizing:"border-box"}}>
     <div style={{...tiny,marginBottom:26}}>ENTIDADES AÑADIDAS A LA LISTA</div>{[0,1,2].map((v)=><div key={v} style={{height:56,margin:"14px 0",borderBottom:"2px solid rgba(52,69,86,.28)",display:"flex",alignItems:"center",gap:18}}><span style={{width:24,height:24,borderRadius:99,background:"#d8c8a8"}}/><span style={{width:(70+v*30)+"%",height:10,borderRadius:20,background:"rgba(52,69,86,.22)"}}/></div>)}
    </div>
    <div style={{position:"absolute",right:"10%",top:"37%",width:155,height:155,borderRadius:"50%",background:coral,color:cream,display:"grid",placeItems:"center",font:"900 32px Arial",letterSpacing:2,transform:"rotate("+interpolate(p,[0,1],[-25,9])+"deg) scale("+interpolate(p,[0,.32],[1.6,1])+")",boxShadow:"0 12px 24px rgba(37,40,42,.22)"}}>OFAC</div>
    <div style={{position:"absolute",right:"11%",bottom:"12%",...tiny}}>varias entidades</div>
   </div>}
   {shot.id==="S09"&&<div style={{...card,background:"#e7efeb"}}>
    <div style={{position:"absolute",left:42,top:34,...label}}>TRANSFERENCIA U-TURN · ESQUEMA</div>
    <svg viewBox="0 0 900 550" style={{position:"absolute",inset:"70px 25px 20px",width:"calc(100% - 50px)",height:"calc(100% - 90px)"}}>
     <path d="M145 250 H370 Q430 250 430 310 V390 Q430 445 490 445 H755" fill="none" stroke="#bbc9c2" strokeWidth="27" strokeLinecap="round" strokeLinejoin="round"/>
     <path d="M145 250 H370 Q430 250 430 310 V390 Q430 445 490 445 H755" fill="none" stroke={coral} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="900" strokeDashoffset={900*(1-p)}/>
     <circle cx="145" cy="250" r="54" fill={cream} stroke={navy} strokeWidth="8"/><circle cx="430" cy="390" r="54" fill={cream} stroke={navy} strokeWidth="8"/><circle cx="755" cy="445" r="54" fill={cream} stroke={navy} strokeWidth="8"/>
     <text x="70" y="175" fontSize="22" fontWeight="700" fill={navy}>ORIGEN FUERA</text><text x="356" y="300" fontSize="22" fontWeight="700" fill={navy}>BANCO EE.UU.</text><text x="670" y="540" fontSize="22" fontWeight="700" fill={navy}>DESTINO FUERA</text>
    </svg>
    <div style={{position:"absolute",right:32,bottom:25,...pill}}>CIERTAS TRANSFERENCIAS</div>
   </div>}
   {shot.id==="S10"&&<div style={{...card}}>
    <div style={{position:"absolute",left:42,top:34,...label}}>REUNIONES PROFESIONALES</div>
    <div style={{position:"absolute",left:"24%",top:"29%",width:"52%",height:"38%",background:"#f6ead4",border:"4px solid "+navy,borderRadius:24,boxShadow:"0 20px 30px rgba(37,40,42,.14)",display:"grid",placeItems:"center",font:"800 42px Arial",color:navy,textAlign:"center"}}>AUTORIZACIÓN<br/>ANTERIOR</div>
    <div style={{position:"absolute",left:"34%",top:"22%",padding:"18px 26px",...pill,background:coral,transform:"translateY("+interpolate(p,[0,.65],[0,330])+"px) rotate("+interpolate(p,[0,1],[0,12])+"deg)",boxShadow:"0 14px 25px rgba(37,40,42,.24)"}}>REUNIONES</div>
    <div style={{position:"absolute",left:"18%",right:"18%",bottom:"12%",height:10,background:"rgba(52,69,86,.18)",borderRadius:20}}/>
   </div>}
   {shot.id==="S11"&&<div style={{...card,background:"#edf0e5"}}>
    <div style={{position:"absolute",left:42,top:34,...label}}>VIAJES EDUCATIVOS</div>
    <div style={{position:"absolute",left:"15%",top:"28%",width:"28%",height:"48%",background:"#fffaf0",border:"3px solid "+navy,borderRadius:18,display:"grid",placeItems:"center",font:"800 30px Arial",color:navy,textAlign:"center",boxShadow:"0 14px 26px rgba(37,40,42,.12)"}}>RUTA<br/>EDUCATIVA</div>
    <div style={{position:"absolute",left:"43%",top:"42%",width:"23%",height:10,background:teal,transform:"scaleX("+p+")",transformOrigin:"left"}}/>
    <div style={{position:"absolute",left:"63%",top:"20%",width:"23%",height:"62%",border:"3px solid "+navy,borderRadius:18,background:"rgba(255,250,240,.78)",display:"flex",flexDirection:"column",justifyContent:"space-around",alignItems:"center"}}>
     <div style={{width:"72%",height:12,background:coral,borderRadius:20,transform:"scaleX("+interpolate(p,[0,1],[1,.45])+")"}}/>
     <div style={{width:"72%",height:12,background:teal,borderRadius:20}}/>
     <div style={{font:"800 28px Arial",color:navy,textAlign:"center"}}>EXCEPCIONES<br/>TRANSITORIAS</div>
    </div>
   </div>}
  </div>
 </AbsoluteFill>;
};
const ShotLayer: React.FC<{shot:Shot}>=({shot})=>{
 const frame=useCurrentFrame();
 const zoom=interpolate(frame,[0,shot.duration],[1.01,1.045],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
 return <AbsoluteFill>
  {shot.kind==="placeholder"&&<MotionGraphic shot={shot}/>}
  {shot.kind==="video"&&shot.asset&&<OffthreadVideo src={staticFile(shot.asset)} muted startFrom={shot.startFrom??0} style={{width:"100%",height:"100%",objectFit:"cover",transform:"scale("+zoom+")"}}/>}
  {shot.kind==="image"&&shot.asset&&<Img src={staticFile(shot.asset)} style={{width:"100%",height:"100%",objectFit:"cover",transform:"scale("+zoom+")"}}/>}
  <div style={{position:"absolute",left:64,right:64,top:72,display:"flex",justifyContent:"space-between",alignItems:"center",color:"#fff9ef",fontFamily:"Arial, sans-serif",textShadow:"0 2px 8px rgba(0,0,0,.55)"}}>
   <div style={{padding:"14px 18px",background:"rgba(31,39,44,.84)",borderRadius:8,fontSize:25,fontWeight:800,letterSpacing:2}}>{shot.act}</div>
   <div style={{padding:"12px 14px",background:"rgba(31,39,44,.78)",borderRadius:8,fontSize:22,fontWeight:800,letterSpacing:1.5}}>{shot.id} · ANIMATIC</div>
  </div>
  {shot.id==="S08"&&<div style={{position:"absolute",left:66,top:158,padding:"13px 18px",background:"rgba(255,250,239,.93)",borderLeft:"7px solid "+coral,borderRadius:8,color:"#25282a",font:"800 21px Arial,sans-serif",letterSpacing:1.2,boxShadow:"0 5px 18px rgba(37,40,42,.18)"}}>OFAC · BANCO EXTERIOR DE CUBA · 03 SEP 2026</div>}
  <Caption>{shot.caption}</Caption>
 </AbsoluteFill>;
};
export const RubioSixtySecondAnimatic: React.FC=()=> <AbsoluteFill>
 <Paper/>
 {shots.map(shot=><Sequence key={shot.id} from={shot.from} durationInFrames={shot.duration}><ShotLayer shot={shot}/></Sequence>)}
 {VOICE_SCRATCH_READY&&<Audio src={staticFile(VOICE_SCRATCH_FILE)} volume={1}/>}
 {VOICE_SCRATCH_READY&&<Audio src={staticFile(MUSIC_BED_FILE)} volume={1}/>}
 {VOICE_SCRATCH_READY&&<Audio src={staticFile(SFX_CUES_FILE)} volume={1}/>}
 {!VOICE_SCRATCH_READY&&<div style={{position:"absolute",right:42,top:22,padding:"10px 14px",background:"#a74842",color:"white",font:"800 17px Arial, sans-serif",letterSpacing:1}}>VOICE SCRATCH PENDING — DO NOT APPROVE</div>}
</AbsoluteFill>;
