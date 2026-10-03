import React from "react";
import {AbsoluteFill, Audio, Sequence, Video, interpolate, spring, staticFile, useCurrentFrame} from "remotion";

export const ANIMATIC_FRAMES = 60 * 30;
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
    letterSpacing:1.2,opacity:p,transform:`translateX(${interpolate(p,[0,1],[42,0])}px)`,
    textShadow:"0 4px 18px rgba(0,0,0,.5)"
  }}><span style={{display:"inline-block",width:16,height:16,borderRadius:99,background:RED,marginRight:18,boxShadow:"0 0 16px rgba(217,54,54,.5)"}}/>{text}</div>;
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
    <div style={{position:"absolute",left:74,right:74,top:118,opacity:titleIn,transform:`translateY(${interpolate(titleIn,[0,1],[28,0])}px)`}}>
      <div style={{color:GOLD,fontFamily:"Arial",fontSize:20,fontWeight:900,letterSpacing:3,marginBottom:14}}>2026</div>
      <div style={{color:INK,fontFamily:"Arial",fontSize:70,fontWeight:900,lineHeight:.98,letterSpacing:-2,textShadow:"0 8px 28px rgba(0,0,0,.58)"}}>LA PRESIÓN<br/>SE AMPLÍA</div>
      <div style={{color:INK,fontFamily:"Arial",fontSize:27,fontWeight:700,marginTop:18,textShadow:"0 4px 18px rgba(0,0,0,.65)"}}>No fue una sola medida.</div>
    </div>
    <LayerLabel text="PETRÓLEO" y={1260} delay={74}/>
    <LayerLabel text="SANCIONES" y={1330} delay={88}/>
    <LayerLabel text="FINANZAS" y={1400} delay={102}/>
    <LayerLabel text="MOVILIDAD" y={1470} delay={116}/>
    <div style={{position:"absolute",right:90,top:120,width:12,height:12,borderRadius:99,background:RED,boxShadow:"0 0 18px rgba(217,54,54,.55)",transform:`scale(${pulse})`}}/>
  </AbsoluteFill>;
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
      <div style={{marginTop:22,paddingTop:18,borderTop:"1px solid #b8aa92",fontFamily:"Arial",color:"#6f3a3a",fontSize:20,fontWeight:800}}>20 FEB · EO 14389 → additional IEEPA tariffs ended</div>
    </div>
    <div style={{position:"absolute",left:70,right:70,bottom:300,color:INK,fontFamily:"Arial",fontSize:32,fontWeight:800,lineHeight:1.16}}>29 ENE · se abre una vía arancelaria ligada al suministro de petróleo.</div>
    <div style={{position:"absolute",left:70,right:70,bottom:210,color:STEEL,fontFamily:"Arial",fontSize:25,fontWeight:750,lineHeight:1.18}}>20 FEB · termina esa vía arancelaria IEEPA; la emergencia continúa.</div>
  </AbsoluteFill>;
};

const Framework:React.FC=()=>{
  const f=useCurrentFrame();
  const p=spring({frame:f,fps:30,config:{damping:180,stiffness:150}});
  return <AbsoluteFill style={{background:"#080c11"}}>
    <div style={{position:"absolute",left:70,top:120,color:GOLD,fontFamily:"Arial",fontSize:20,fontWeight:900,letterSpacing:3}}>CAPA 2 · MARCO LEGAL</div>
    <div style={{position:"absolute",left:70,top:175,right:70,color:INK,fontFamily:"Arial",fontSize:54,fontWeight:900,lineHeight:1}}>1 MAY · EO 14404</div>
    <div style={{position:"absolute",left:95,top:360,width:890,height:540,borderRadius:28,border:"1px solid rgba(126,151,168,.26)",background:"radial-gradient(circle at 50% 50%,rgba(126,151,168,.14),rgba(6,10,14,.95))"}}>
      {["STATE","TREASURY","BANCOS","ENTIDADES"].map((t,i)=>{
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
    <div style={{position:"absolute",left:70,right:70,bottom:330,color:INK,fontFamily:"Arial",fontSize:38,fontWeight:900,lineHeight:1.14}}>El marco de sanciones se amplía.</div>
    <div style={{position:"absolute",left:70,right:70,bottom:235,color:STEEL,fontFamily:"Arial",fontSize:25,fontWeight:650,lineHeight:1.25}}>La orden delega funciones de implementación a State y Treasury.</div>
    <div style={{position:"absolute",right:70,bottom:120,color:RED,fontFamily:"Arial",fontSize:18,fontWeight:900,letterSpacing:2}}>RUBIO · SECRETARIO DE ESTADO</div>
  </AbsoluteFill>;
};

const Designations:React.FC=()=>{
  const f=useCurrentFrame();
  const intro=spring({frame:f,fps:30,config:{damping:180,stiffness:150}});
  const node=(delay:number)=>spring({frame:Math.max(0,f-delay),fps:30,config:{damping:18,stiffness:90,mass:.7}});
  const cards=[
    {label:"PERSONAS",x:110,y:555,d:35},
    {label:"ENTIDADES",x:560,y:520,d:62},
    {label:"BANCO",x:300,y:810,d:95},
    {label:"LISTA SDN",x:590,y:930,d:125}
  ];
  return <AbsoluteFill style={{background:"radial-gradient(circle at 55% 38%,#132432,#070b10 62%)",overflow:"hidden"}}>
    <div style={{position:"absolute",left:70,top:120,color:GOLD,fontFamily:"Arial",fontSize:20,fontWeight:900,letterSpacing:3}}>JUNIO → SEPTIEMBRE</div>
    <div style={{position:"absolute",left:70,top:174,right:70,color:INK,fontFamily:"Arial",fontSize:58,fontWeight:900,lineHeight:1}}>NUEVAS<br/>DESIGNACIONES</div>
    <div style={{position:"absolute",left:70,top:330,right:70,color:STEEL,fontFamily:"Arial",fontSize:24,fontWeight:650,lineHeight:1.25}}>OFAC añade personas y entidades; el 3 de septiembre incluye al Banco Exterior de Cuba.</div>
    <div style={{position:"absolute",left:110,top:480,width:860,height:650}}>
      <div style={{position:"absolute",left:415,top:250,width:150,height:150,borderRadius:"50%",border:"3px solid rgba(217,54,54,.9)",background:"rgba(217,54,54,.08)",display:"flex",alignItems:"center",justifyContent:"center",color:INK,fontFamily:"Arial",fontSize:26,fontWeight:900,letterSpacing:2,transform:`scale(${.88+.12*intro})`}}>OFAC</div>
      {cards.map((c,i)=>{
        const p=node(c.d);
        const cx=490,cy=325;
        const tx=c.x+115,ty=c.y-480+42;
        const dx=tx-cx,dy=ty-cy;
        const len=Math.sqrt(dx*dx+dy*dy);
        return <React.Fragment key={c.label}>
          <div style={{position:"absolute",left:cx,top:cy,width:len,height:2,background:"linear-gradient(90deg,rgba(217,54,54,.75),rgba(126,151,168,.15))",transformOrigin:"left center",transform:`rotate(${Math.atan2(dy,dx)}rad) scaleX(${p})`}}/>
          <div style={{position:"absolute",left:c.x-110,top:c.y-480,width:230,height:84,borderRadius:18,border:"1px solid rgba(126,151,168,.35)",background:"rgba(10,20,28,.92)",display:"flex",alignItems:"center",justifyContent:"center",color:INK,fontFamily:"Arial",fontSize:18,fontWeight:900,letterSpacing:1.4,opacity:p,transform:`scale(${.82+.18*p})`}}>{c.label}</div>
        </React.Fragment>;
      })}
    </div>
    <div style={{position:"absolute",left:70,right:70,bottom:230,padding:"28px 30px",borderTop:"1px solid rgba(126,151,168,.24)",color:INK,fontFamily:"Arial",fontSize:29,fontWeight:850,lineHeight:1.2}}>Las razones específicas permanecen atribuidas al gobierno de EE.UU.</div>
  </AbsoluteFill>;
};

const FinanceLayer:React.FC=()=>{
  const f=useCurrentFrame();
  const progress=interpolate(f,[20,155],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const block=spring({frame:Math.max(0,f-150),fps:30,config:{damping:18,stiffness:95,mass:.65}});
  const uturn=spring({frame:Math.max(0,f-225),fps:30,config:{damping:180,stiffness:160}});
  return <AbsoluteFill style={{background:"linear-gradient(180deg,#071019,#05080c)",overflow:"hidden"}}>
    <div style={{position:"absolute",left:70,top:120,color:GOLD,fontFamily:"Arial",fontSize:20,fontWeight:900,letterSpacing:3}}>29–30 SEPTIEMBRE</div>
    <div style={{position:"absolute",left:70,top:176,right:70,color:INK,fontFamily:"Arial",fontSize:58,fontWeight:900,lineHeight:1.02}}>LA RED<br/>FINANCIERA</div>
    <div style={{position:"absolute",left:80,right:80,top:465,height:600,borderRadius:32,border:"1px solid rgba(126,151,168,.25)",background:"radial-gradient(circle at 50% 50%,rgba(20,48,65,.35),rgba(5,10,15,.96))"}}>
      {[
        {label:"A",x:145,y:250},
        {label:"B",x:425,y:130},
        {label:"C",x:700,y:300}
      ].map(n=><div key={n.label} style={{position:"absolute",left:n.x,top:n.y,width:110,height:110,borderRadius:"50%",border:"2px solid rgba(126,151,168,.75)",background:"#10202c",display:"flex",alignItems:"center",justifyContent:"center",color:INK,fontFamily:"Arial",fontSize:32,fontWeight:900}}>{n.label}</div>)}
      <div style={{position:"absolute",left:245,top:292,width:255,height:4,background:"rgba(126,151,168,.5)",transformOrigin:"left",transform:`rotate(-23deg) scaleX(${progress})`}}/>
      <div style={{position:"absolute",left:525,top:195,width:248,height:4,background:"rgba(126,151,168,.5)",transformOrigin:"left",transform:`rotate(26deg) scaleX(${progress})`}}/>
      <div style={{position:"absolute",left:515,top:315,width:18,height:220,background:RED,opacity:block,transform:`scaleY(${block})`,transformOrigin:"center"}}/>
      <div style={{position:"absolute",left:568,top:510,color:RED,fontFamily:"Arial",fontSize:18,fontWeight:900,letterSpacing:2,opacity:block}}>RUTA BLOQUEADA</div>
    </div>
    <div style={{position:"absolute",left:70,right:70,bottom:360,color:INK,fontFamily:"Arial",fontSize:34,fontWeight:900,lineHeight:1.16}}>OFAC extiende la prohibición a transacciones financieras indirectas con entidades de la CRL.</div>
    <div style={{position:"absolute",left:70,right:70,bottom:220,padding:"24px 28px",borderRadius:18,border:"1px solid rgba(217,54,54,.28)",background:"rgba(217,54,54,.07)",opacity:uturn,transform:`translateY(${interpolate(uturn,[0,1],[25,0])}px)`}}>
      <div style={{color:GOLD,fontFamily:"Arial",fontSize:17,fontWeight:900,letterSpacing:2}}>CAMBIO REGULATORIO</div>
      <div style={{color:INK,fontFamily:"Arial",fontSize:31,fontWeight:900,marginTop:8}}>U-turn · autorización retirada</div>
    </div>
  </AbsoluteFill>;
};

const Close:React.FC=()=>{
  const f=useCurrentFrame();
  const p=spring({frame:f,fps:30,config:{damping:180,stiffness:145}});
  const line=interpolate(f,[40,190],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  return <AbsoluteFill style={{background:"#070b10",overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(26,43,57,.72) 0%,rgba(7,11,16,.92) 48%,rgba(42,17,18,.55) 100%)"}}/>
    <div style={{position:"absolute",left:70,top:120,color:GOLD,fontFamily:"Arial",fontSize:20,fontWeight:900,letterSpacing:3}}>CIERRE</div>
    <div style={{position:"absolute",left:70,top:178,right:70,color:INK,fontFamily:"Arial",fontSize:60,fontWeight:900,lineHeight:1.02,opacity:p,transform:`translateY(${interpolate(p,[0,1],[30,0])}px)`}}>DOS LECTURAS<br/>OFICIALES</div>
    <div style={{position:"absolute",left:90,top:520,width:390,height:430,borderRadius:28,border:"1px solid rgba(126,151,168,.28)",background:"rgba(12,25,34,.82)",padding:"34px"}}>
      <div style={{color:STEEL,fontFamily:"Arial",fontSize:18,fontWeight:900,letterSpacing:2}}>WASHINGTON</div>
      <div style={{color:INK,fontFamily:"Arial",fontSize:31,fontWeight:850,lineHeight:1.15,marginTop:26}}>Órdenes, sanciones y restricciones como instrumentos de política.</div>
    </div>
    <div style={{position:"absolute",right:90,top:520,width:390,height:430,borderRadius:28,border:"1px solid rgba(217,54,54,.24)",background:"rgba(31,13,15,.76)",padding:"34px"}}>
      <div style={{color:RED,fontFamily:"Arial",fontSize:18,fontWeight:900,letterSpacing:2}}>LA HABANA</div>
      <div style={{color:INK,fontFamily:"Arial",fontSize:31,fontWeight:850,lineHeight:1.15,marginTop:26}}>Una respuesta oficial opuesta sobre el impacto y la legitimidad de esas medidas.</div>
    </div>
    <div style={{position:"absolute",left:90,right:90,top:1080,height:3,background:"rgba(126,151,168,.18)"}}>
      <div style={{width:`${line*100}%`,height:"100%",background:RED}}/>
    </div>
    <div style={{position:"absolute",left:70,right:70,bottom:310,color:STEEL,fontFamily:"Arial",fontSize:22,fontWeight:900,letterSpacing:2}}>LO DOCUMENTADO</div>
    <div style={{position:"absolute",left:70,right:70,bottom:180,color:INK,fontFamily:"Arial",fontSize:54,fontWeight:900,lineHeight:1.02}}>LAS RESTRICCIONES<br/>SE HICIERON MÁS AMPLIAS.</div>
  </AbsoluteFill>;
};

export const RubioHabanaAnimatic:React.FC=()=>{
  const f=useCurrentFrame();
  const vol=interpolate(f,[0,30,180,1500,1740,1799],[0.04,0.10,0.075,0.07,0.055,0.015],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  return <AbsoluteFill style={{background:BG}}>
    <Audio src={BED} volume={vol} loop/>
    <Sequence from={0} durationInFrames={150}><MapHook/></Sequence>
    <Sequence from={150} durationInFrames={270}><OilLayer/></Sequence>
    <Sequence from={420} durationInFrames={300}><Framework/></Sequence>
    <Sequence from={720} durationInFrames={390}><Designations/></Sequence>
    <Sequence from={1110} durationInFrames={390}><FinanceLayer/></Sequence>
    <Sequence from={1500} durationInFrames={300}><Close/></Sequence>
  </AbsoluteFill>;
};
