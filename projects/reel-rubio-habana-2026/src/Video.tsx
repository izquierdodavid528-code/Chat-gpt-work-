import React from "react";
import {AbsoluteFill, Audio, Img, Sequence, Video, interpolate, spring, staticFile, useCurrentFrame} from "remotion";

export const ANIMATIC_FRAMES = 60 * 30;
const BED = staticFile("rubio-habana-bed.ogg");
const HOOK_PLATE = staticFile("rubio-habana-map.mp4");
const RUBIO_PORTRAIT = staticFile("rubio-official-portrait.jpg");

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

const TransitionPulse:React.FC=()=>{
  const f=useCurrentFrame();
  const shade=interpolate(f,[0,5,11],[0,.78,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const sweep=interpolate(f,[0,11],[-18,118],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  return <AbsoluteFill style={{pointerEvents:"none",background:`rgba(3,7,11,${shade})`}}>
    <div style={{position:"absolute",top:0,bottom:0,left:`${sweep}%`,width:3,background:RED,boxShadow:"0 0 28px rgba(217,54,54,.65)",opacity:interpolate(f,[0,3,8,11],[0,1,1,0])}}/>
  </AbsoluteFill>;
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
    <div style={{position:"absolute",right:74,bottom:82,color:STEEL,fontFamily:"Arial",fontSize:14,fontWeight:900,letterSpacing:2,opacity:.72}}>GRÁFICA EXPLICATIVA</div>
  </AbsoluteFill>;
};

const OilLayer:React.FC=()=>{
  const f=useCurrentFrame();
  const mechanism=spring({frame:Math.max(0,f-18),fps:30,config:{damping:180,stiffness:150}});
  const jan=spring({frame:Math.max(0,f-34),fps:30,config:{damping:180,stiffness:160}});
  const feb=spring({frame:Math.max(0,f-142),fps:30,config:{damping:180,stiffness:160}});
  const rollback=interpolate(f,[150,215],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  return <AbsoluteFill style={{background:"radial-gradient(circle at 74% 28%,rgba(19,68,92,.34),transparent 34%),linear-gradient(180deg,#07111a,#070b10)",overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(126,151,168,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(126,151,168,.05) 1px,transparent 1px)",backgroundSize:"54px 54px",maskImage:"linear-gradient(180deg,black,transparent 80%)"}}/>
    <div style={{position:"absolute",top:108,left:70,color:GOLD,fontFamily:"Arial",fontSize:20,fontWeight:900,letterSpacing:3}}>CAPA 1 · PETRÓLEO</div>
    <div style={{position:"absolute",top:164,left:70,right:70,color:INK,fontFamily:"Arial",fontSize:56,fontWeight:900,lineHeight:1.02}}>ENERO → FEBRERO</div>
    <div style={{position:"absolute",top:270,left:70,right:70,color:STEEL,fontFamily:"Arial",fontSize:24,fontWeight:650,lineHeight:1.25}}>Una vía arancelaria aparece el 29 de enero y es retirada el 20 de febrero.</div>

    <div style={{position:"absolute",left:70,right:70,top:405,height:430,borderRadius:30,border:"1px solid rgba(126,151,168,.24)",background:"rgba(6,15,22,.72)",boxShadow:"0 28px 80px rgba(0,0,0,.22)",overflow:"hidden"}}>
      <div style={{position:"absolute",left:48,top:54,color:STEEL,fontFamily:"Arial",fontSize:17,fontWeight:900,letterSpacing:2}}>MECANISMO · EO 14380</div>
      <div style={{position:"absolute",left:56,top:145,width:225,height:94,borderRadius:18,border:"1px solid rgba(126,151,168,.34)",background:"#10212d",display:"flex",alignItems:"center",justifyContent:"center",color:INK,fontFamily:"Arial",fontSize:20,fontWeight:900,letterSpacing:1.2,opacity:mechanism}}>PAÍS PROVEEDOR</div>
      <div style={{position:"absolute",left:330,top:177,width:180,height:3,background:"rgba(126,151,168,.35)",transformOrigin:"left",transform:`scaleX(${mechanism})`}}>
        <div style={{position:"absolute",right:-8,top:-6,width:14,height:14,borderTop:"3px solid "+STEEL,borderRight:"3px solid "+STEEL,transform:"rotate(45deg)"}}/>
      </div>
      <div style={{position:"absolute",left:345,top:128,color:GOLD,fontFamily:"Arial",fontSize:17,fontWeight:900,letterSpacing:2,opacity:mechanism}}>PETRÓLEO</div>
      <div style={{position:"absolute",right:56,top:145,width:225,height:94,borderRadius:18,border:"1px solid rgba(217,54,54,.42)",background:"rgba(217,54,54,.08)",display:"flex",alignItems:"center",justifyContent:"center",color:INK,fontFamily:"Arial",fontSize:24,fontWeight:900,letterSpacing:1.6,opacity:mechanism}}>CUBA</div>
      <div style={{position:"absolute",left:150,right:150,top:300,height:2,background:"rgba(217,54,54,.38)",opacity:jan}}/>
      <div style={{position:"absolute",left:225,right:225,top:330,padding:"17px 22px",borderRadius:16,border:"1px solid rgba(217,54,54,.44)",background:"rgba(217,54,54,.10)",textAlign:"center",color:INK,fontFamily:"Arial",fontSize:20,fontWeight:900,letterSpacing:.5,opacity:jan,transform:`translateY(${interpolate(jan,[0,1],[16,0])}px)`}}>POSIBLE ARANCEL ADICIONAL<br/><span style={{fontSize:15,color:STEEL,letterSpacing:1.5}}>SOBRE IMPORTACIONES DE ESE PAÍS</span></div>
      <div style={{position:"absolute",left:155,right:155,top:298,height:4,background:RED,transformOrigin:"right",transform:`scaleX(${1-rollback})`,opacity:.9}}/>
    </div>

    <div style={{position:"absolute",left:70,right:70,top:900,height:360}}>
      <div style={{position:"absolute",left:24,top:26,bottom:26,width:2,background:"rgba(126,151,168,.25)"}}/>
      <div style={{position:"absolute",left:13,top:36,width:24,height:24,borderRadius:"50%",background:RED,boxShadow:"0 0 22px rgba(217,54,54,.55)"}}/>
      <div style={{position:"absolute",left:58,top:18,right:0,padding:"24px 28px",borderRadius:20,border:"1px solid rgba(126,151,168,.22)",background:"rgba(242,240,234,.06)",opacity:jan}}>
        <div style={{color:GOLD,fontFamily:"Arial",fontSize:17,fontWeight:900,letterSpacing:2}}>29 ENE · EO 14380</div>
        <div style={{color:INK,fontFamily:"Arial",fontSize:29,fontWeight:900,marginTop:8,lineHeight:1.16}}>Se crea el mecanismo arancelario ligado al suministro de petróleo a Cuba.</div>
        <div style={{color:STEEL,fontFamily:"Arial",fontSize:17,fontWeight:700,marginTop:12}}>Fuente: Casa Blanca · Executive Order 14380</div>
      </div>

      <div style={{position:"absolute",left:13,top:210,width:24,height:24,borderRadius:"50%",background:INK,border:"5px solid "+RED}}/>
      <div style={{position:"absolute",left:58,top:190,right:0,padding:"24px 28px",borderRadius:20,border:"1px solid rgba(217,54,54,.28)",background:"rgba(217,54,54,.07)",opacity:feb,transform:`translateY(${interpolate(feb,[0,1],[18,0])}px)`}}>
        <div style={{color:RED,fontFamily:"Arial",fontSize:17,fontWeight:900,letterSpacing:2}}>20 FEB · EO 14389</div>
        <div style={{color:INK,fontFamily:"Arial",fontSize:29,fontWeight:900,marginTop:8,lineHeight:1.16}}>Terminan los aranceles adicionales bajo IEEPA; la emergencia sigue vigente.</div>
        <div style={{color:STEEL,fontFamily:"Arial",fontSize:17,fontWeight:700,marginTop:12}}>Fuente: Casa Blanca · Executive Order 14389</div>
      </div>
    </div>

    <div style={{position:"absolute",left:70,right:70,bottom:165,color:STEEL,fontFamily:"Arial",fontSize:21,fontWeight:650,lineHeight:1.28}}>La secuencia evita presentar la medida de enero como si hubiera permanecido sin cambios durante todo 2026.</div>
  </AbsoluteFill>;
};

const Framework:React.FC=()=>{
  const f=useCurrentFrame();
  const p=spring({frame:f,fps:30,config:{damping:180,stiffness:150}});
  const delegation=spring({frame:Math.max(0,f-90),fps:30,config:{damping:180,stiffness:150}});
  const sectors=["ENERGÍA","DEFENSA","MINERÍA","FINANZAS","SEGURIDAD"];
  return <AbsoluteFill style={{background:"radial-gradient(circle at 25% 35%,rgba(33,66,85,.28),transparent 34%),#070b10",overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(126,151,168,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(126,151,168,.045) 1px,transparent 1px)",backgroundSize:"56px 56px"}}/>
    <div style={{position:"absolute",left:70,top:108,color:GOLD,fontFamily:"Arial",fontSize:20,fontWeight:900,letterSpacing:3}}>CAPA 2 · AUTORIDADES DE SANCIÓN</div>
    <div style={{position:"absolute",left:70,top:164,right:70,color:INK,fontFamily:"Arial",fontSize:58,fontWeight:900,lineHeight:1}}>1 MAY · EO 14404</div>
    <div style={{position:"absolute",left:70,top:265,right:70,color:STEEL,fontFamily:"Arial",fontSize:24,fontWeight:650,lineHeight:1.25}}>La orden amplía criterios de sanción y distribuye funciones de implementación.</div>

    <div style={{position:"absolute",left:70,right:70,top:420,height:350,borderRadius:30,border:"1px solid rgba(126,151,168,.25)",background:"rgba(8,17,24,.78)",padding:"34px 36px"}}>
      <div style={{color:STEEL,fontFamily:"Arial",fontSize:16,fontWeight:900,letterSpacing:2}}>SECTORES NOMBRADOS EN LA ORDEN</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:14,marginTop:28}}>
        {sectors.map((s,i)=>{
          const sp=spring({frame:Math.max(0,f-18-i*10),fps:30,config:{damping:180,stiffness:160}});
          return <div key={s} style={{padding:"18px 22px",borderRadius:18,border:"1px solid rgba(126,151,168,.34)",background:"rgba(18,35,47,.88)",color:INK,fontFamily:"Arial",fontSize:20,fontWeight:900,letterSpacing:1.1,opacity:sp,transform:`translateY(${interpolate(sp,[0,1],[18,0])}px)`}}>{s}</div>;
        })}
      </div>
      <div style={{position:"absolute",left:36,right:36,bottom:34,height:3,background:"rgba(126,151,168,.12)"}}>
        <div style={{width:`${p*100}%`,height:"100%",background:"linear-gradient(90deg,"+RED+","+GOLD+")"}}/>
      </div>
    </div>

    <div style={{position:"absolute",left:70,right:70,top:830,height:460,borderRadius:30,border:"1px solid rgba(217,54,54,.22)",background:"linear-gradient(135deg,rgba(217,54,54,.07),rgba(15,28,38,.72))",padding:"38px"}}>
      <div style={{color:GOLD,fontFamily:"Arial",fontSize:17,fontWeight:900,letterSpacing:2}}>SEC. 5 · DELEGACIÓN</div>
      <div style={{position:"absolute",left:60,top:135,width:340,height:130,borderRadius:24,border:"1px solid rgba(126,151,168,.35)",background:"#10212d",display:"flex",alignItems:"center",justifyContent:"center",color:INK,fontFamily:"Arial",fontSize:30,fontWeight:900,opacity:delegation,transform:`translateX(${interpolate(delegation,[0,1],[-28,0])}px)`}}>STATE</div>
      <div style={{position:"absolute",right:60,top:135,width:340,height:130,borderRadius:24,border:"1px solid rgba(126,151,168,.35)",background:"#10212d",display:"flex",alignItems:"center",justifyContent:"center",color:INK,fontFamily:"Arial",fontSize:30,fontWeight:900,opacity:delegation,transform:`translateX(${interpolate(delegation,[0,1],[28,0])}px)`}}>TREASURY</div>
      <div style={{position:"absolute",left:405,top:178,width:70,height:3,background:RED,opacity:delegation}}/>
      <div style={{position:"absolute",left:60,right:60,bottom:48,color:STEEL,fontFamily:"Arial",fontSize:22,fontWeight:700,lineHeight:1.28,opacity:delegation}}>Ambos departamentos reciben autoridad para implementar la orden dentro de sus competencias.</div>
    </div>

    <div style={{position:"absolute",left:70,right:70,bottom:235,minHeight:205,padding:"26px 220px 26px 30px",borderLeft:"4px solid "+RED,background:"rgba(217,54,54,.055)",overflow:"hidden"}}>
      <div style={{color:INK,fontFamily:"Arial",fontSize:30,fontWeight:900,lineHeight:1.16}}>Marco Rubio · Secretario de Estado</div>
      <div style={{color:STEEL,fontFamily:"Arial",fontSize:21,fontWeight:700,marginTop:8,lineHeight:1.25}}>Papel documentado: voz pública e implementación desde State; no firmante de la orden presidencial.</div>
      <div style={{position:"absolute",right:24,top:18,width:164,height:164,borderRadius:18,overflow:"hidden",border:"1px solid rgba(242,240,234,.18)",boxShadow:"0 16px 36px rgba(0,0,0,.28)"}}>
        <Img src={RUBIO_PORTRAIT} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"50% 22%"}}/>
      </div>
      <div style={{position:"absolute",right:25,bottom:9,color:STEEL,fontFamily:"Arial",fontSize:10,fontWeight:800,letterSpacing:.8}}>RETRATO OFICIAL · STATE DEPT.</div>
    </div>
    <div style={{position:"absolute",right:70,bottom:120,color:STEEL,fontFamily:"Arial",fontSize:16,fontWeight:800,letterSpacing:1.2}}>FUENTE · CASA BLANCA · EXECUTIVE ORDER 14404</div>
  </AbsoluteFill>;
};

const Designations:React.FC=()=>{
  const f=useCurrentFrame();
  const intro=spring({frame:f,fps:30,config:{damping:180,stiffness:150}});
  const june=spring({frame:Math.max(0,f-40),fps:30,config:{damping:180,stiffness:150}});
  const sept=spring({frame:Math.max(0,f-175),fps:30,config:{damping:180,stiffness:150}});
  const chip=(label:string,accent:boolean=false)=><div style={{padding:"16px 18px",borderRadius:16,border:`1px solid ${accent?"rgba(217,54,54,.42)":"rgba(126,151,168,.3)"}`,background:accent?"rgba(217,54,54,.07)":"rgba(15,31,42,.8)",color:INK,fontFamily:"Arial",fontSize:18,fontWeight:900,letterSpacing:.6}}>{label}</div>;
  return <AbsoluteFill style={{background:"radial-gradient(circle at 80% 28%,rgba(25,63,84,.30),transparent 33%),#070b10",overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(126,151,168,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(126,151,168,.04) 1px,transparent 1px)",backgroundSize:"58px 58px"}}/>
    <div style={{position:"absolute",left:70,top:108,color:GOLD,fontFamily:"Arial",fontSize:20,fontWeight:900,letterSpacing:3}}>CAPA 3 · DESIGNACIONES</div>
    <div style={{position:"absolute",left:70,top:164,right:70,color:INK,fontFamily:"Arial",fontSize:60,fontWeight:900,lineHeight:1}}>JUNIO → SEPTIEMBRE</div>
    <div style={{position:"absolute",left:70,top:270,right:70,color:STEEL,fontFamily:"Arial",fontSize:24,fontWeight:650,lineHeight:1.25}}>La aplicación del nuevo marco continúa mediante acciones de OFAC y State.</div>

    <div style={{position:"absolute",left:70,right:70,top:420,height:500,borderRadius:30,border:"1px solid rgba(126,151,168,.24)",background:"rgba(8,18,25,.78)",padding:"36px",opacity:june,transform:`translateY(${interpolate(june,[0,1],[24,0])}px)`}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{color:RED,fontFamily:"Arial",fontSize:18,fontWeight:900,letterSpacing:2}}>04 JUN · OFAC</div>
          <div style={{color:INK,fontFamily:"Arial",fontSize:36,fontWeight:900,marginTop:8}}>Actualización de la lista SDN</div>
        </div>
        <div style={{width:92,height:92,borderRadius:"50%",border:"3px solid "+RED,display:"flex",alignItems:"center",justifyContent:"center",color:INK,fontFamily:"Arial",fontSize:20,fontWeight:900,letterSpacing:1}}>OFAC</div>
      </div>
      <div style={{display:"flex",gap:14,flexWrap:"wrap",marginTop:44}}>
        {chip("ICAP",true)}
        {chip("MINFAR",true)}
        {chip("PERSONAS")}
        {chip("OTRAS ENTIDADES")}
      </div>
      <div style={{position:"absolute",left:36,right:36,bottom:38,color:STEEL,fontFamily:"Arial",fontSize:20,fontWeight:700,lineHeight:1.3}}>La inclusión en la lista es un hecho verificable; las razones específicas se atribuyen a Treasury/OFAC.</div>
    </div>

    <div style={{position:"absolute",left:70,right:70,top:980,height:465,borderRadius:30,border:"1px solid rgba(217,54,54,.23)",background:"linear-gradient(135deg,rgba(217,54,54,.055),rgba(8,18,25,.84))",padding:"36px",opacity:sept,transform:`translateY(${interpolate(sept,[0,1],[26,0])}px)`}}>
      <div style={{color:GOLD,fontFamily:"Arial",fontSize:18,fontWeight:900,letterSpacing:2}}>03 SEP · OFAC</div>
      <div style={{color:INK,fontFamily:"Arial",fontSize:38,fontWeight:900,marginTop:12,lineHeight:1.08}}>BANCO EXTERIOR DE CUBA</div>
      <div style={{color:STEEL,fontFamily:"Arial",fontSize:22,fontWeight:700,marginTop:16,lineHeight:1.3}}>OFAC lo añade a la SDN List junto con otros objetivos relacionados con Cuba.</div>
      <div style={{position:"absolute",left:36,right:36,bottom:42,height:110,borderRadius:20,border:"1px solid rgba(126,151,168,.25)",background:"rgba(8,14,20,.74)",padding:"22px 24px"}}>
        <div style={{color:STEEL,fontFamily:"Arial",fontSize:15,fontWeight:900,letterSpacing:2}}>FUENTE PRIMARIA</div>
        <div style={{color:INK,fontFamily:"Arial",fontSize:19,fontWeight:800,marginTop:8}}>U.S. Treasury · OFAC Recent Actions · 2026-09-03</div>
      </div>
    </div>

    <div style={{position:"absolute",left:70,right:70,bottom:165,color:INK,fontFamily:"Arial",fontSize:28,fontWeight:900,lineHeight:1.18,opacity:intro}}>La presión deja de ser una sola orden: se convierte en una secuencia de decisiones administrativas.</div>
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
    <div style={{position:"absolute",left:70,top:330,right:70,color:STEEL,fontFamily:"Arial",fontSize:21,fontWeight:800,lineHeight:1.25}}>CRL · CUBA RESTRICTED LIST</div>
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
    <div style={{position:"absolute",right:70,bottom:120,color:STEEL,fontFamily:"Arial",fontSize:16,fontWeight:800,letterSpacing:1.2}}>FUENTE · OFAC · ACTUALIZACIÓN 29 SEP 2026</div>
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
      <div style={{color:INK,fontFamily:"Arial",fontSize:31,fontWeight:850,lineHeight:1.15,marginTop:26}}>La Casa Blanca las vincula a seguridad nacional y política exterior.</div>
    </div>
    <div style={{position:"absolute",right:90,top:520,width:390,height:430,borderRadius:28,border:"1px solid rgba(217,54,54,.24)",background:"rgba(31,13,15,.76)",padding:"34px"}}>
      <div style={{color:RED,fontFamily:"Arial",fontSize:18,fontWeight:900,letterSpacing:2}}>LA HABANA</div>
      <div style={{color:INK,fontFamily:"Arial",fontSize:31,fontWeight:850,lineHeight:1.15,marginTop:26}}>El MINREX las describe como un recrudecimiento del bloqueo económico, financiero y comercial.</div>
    </div>
    <div style={{position:"absolute",left:90,right:90,top:1080,height:3,background:"rgba(126,151,168,.18)"}}>
      <div style={{width:`${line*100}%`,height:"100%",background:RED}}/>
    </div>
    <div style={{position:"absolute",left:70,right:70,bottom:310,color:STEEL,fontFamily:"Arial",fontSize:22,fontWeight:900,letterSpacing:2}}>LO DOCUMENTADO</div>
    <div style={{position:"absolute",left:70,right:70,bottom:180,color:INK,fontFamily:"Arial",fontSize:50,fontWeight:900,lineHeight:1.02}}>LA ARQUITECTURA DE RESTRICCIONES<br/>CAMBIÓ Y SE AMPLIÓ.</div>
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
    {[150,420,720,1110,1500].map((at)=><Sequence key={at} from={at-5} durationInFrames={12}><TransitionPulse/></Sequence>)}
  </AbsoluteFill>;
};
