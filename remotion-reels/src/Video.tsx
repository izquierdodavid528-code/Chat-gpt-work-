import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Img,
  Audio,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

const BOAT = "https://images.pexels.com/photos/9757012/pexels-photo-9757012.jpeg?cs=srgb&dl=pexels-koolshooters-9757012.jpg&fm=jpg";
const HERO = "https://images.pexels.com/photos/18423131/pexels-photo-18423131.jpeg?cs=srgb&dl=pexels-shotbybabcock-18423131.jpg&fm=jpg";
const WOMAN = "https://images.pexels.com/photos/12857529/pexels-photo-12857529.jpeg?cs=srgb&dl=pexels-marina-abrosimova-3319804-12857529.jpg&fm=jpg";

const clamp={extrapolateLeft:"clamp" as const,extrapolateRight:"clamp" as const};
const lerp=(f:number,a:number,b:number,x:number,y:number)=>interpolate(f,[a,b],[x,y],clamp);
const ease=(f:number,a:number,b:number,x:number,y:number)=>interpolate(f,[a,b],[x,y],{...clamp,easing:Easing.inOut(Easing.cubic)});

function wav(duration:number, fn:(t:number,i:number)=>number){
  const sr=11025;
  const n=Math.max(1,Math.floor(duration*sr));
  const bytes=new Uint8Array(44+n*2);
  const v=new DataView(bytes.buffer);
  const put=(o:number,s:string)=>{for(let i=0;i<s.length;i++)bytes[o+i]=s.charCodeAt(i)};
  put(0,"RIFF");v.setUint32(4,36+n*2,true);put(8,"WAVE");put(12,"fmt ");
  v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);
  v.setUint32(24,sr,true);v.setUint32(28,sr*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);
  put(36,"data");v.setUint32(40,n*2,true);
  for(let i=0;i<n;i++){
    const s=Math.max(-1,Math.min(1,fn(i/sr,i)));
    v.setInt16(44+i*2,s<0?s*32768:s*32767,true);
  }
  let bin="";
  for(let i=0;i<bytes.length;i+=4096){for(let j=i;j<Math.min(bytes.length,i+4096);j++)bin+=String.fromCharCode(bytes[j]);}
  return "data:audio/wav;base64,"+btoa(bin);
}
const noise=(i:number)=>{const x=Math.sin(i*12.9898+78.233)*43758.5453;return (x-Math.floor(x))*2-1};
const MUSIC=wav(14,(t,i)=>{
  const beat=t%0.5,off=(t+0.25)%0.5;
  const kick=Math.sin(2*Math.PI*(60+30*Math.exp(-beat*18))*beat)*Math.exp(-beat*16);
  const sn=off<.07?noise(i)*Math.exp(-off*32):0;
  const hat=(t%.25)<.025?noise(i*5)*Math.exp(-(t%.25)*110):0;
  const notes=[110,146.83,164.81,130.81];
  const f=notes[Math.floor(t/.5)%4];
  const bass=Math.sin(2*Math.PI*f*t)*Math.exp(-(t%.5)*5.5);
  return .23*kick+.052*sn+.017*hat+.065*bass;
});
const POP=wav(.18,t=>Math.exp(-t*25)*.38*Math.sin(2*Math.PI*(900-2500*t)*t));
const WHOOSH=wav(.9,(t,i)=>Math.sin(Math.PI*Math.min(1,t/.9))*(.12*noise(i)+.12*Math.sin(2*Math.PI*(160+1000*t*t)*t)));
const SPLASH=wav(1.0,(t,i)=>Math.exp(-t*5.2)*(.32*noise(i)+.09*Math.sin(2*Math.PI*95*t)));
const ENGINE=wav(3.4,(t,i)=>.05*Math.sin(2*Math.PI*76*t)+.018*(.5+.5*Math.sin(2*Math.PI*7*t))*noise(i));
const STING=wav(1.5,t=>Math.exp(-t*2.1)*(.24*Math.sin(2*Math.PI*(t<.3?220:110)*t)+.08*Math.sin(2*Math.PI*(t<.3?440:220)*t)));
const SCRATCH=wav(.45,(t,i)=>Math.exp(-t*5.5)*(.1*noise(i)+.13*Math.sin(2*Math.PI*(950-1650*t)*t)));

const Photo=({src,style}:{src:string;style?:React.CSSProperties})=>(
  <div style={{position:"absolute",overflow:"hidden",borderRadius:32,boxShadow:"0 24px 60px rgba(10,30,45,.35)",border:"5px solid rgba(255,255,255,.92)",...style}}>
    <Img src={src} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
  </div>
);

const Label=({children,top=70,font=54,accent="#ffd85b"}:{children:React.ReactNode;top?:number;font?:number;accent?:string})=>{
  const f=useCurrentFrame(),{fps}=useVideoConfig();
  const p=spring({frame:f,fps,durationInFrames:18,config:{damping:18,stiffness:210}});
  return <div style={{position:"absolute",top,left:46,right:46,display:"flex",justifyContent:"center",opacity:p,transform:`translateY(${(1-p)*-24}px) scale(${.95+.05*p})`}}>
    <div style={{position:"relative",maxWidth:950,background:"rgba(255,255,255,.97)",borderRadius:26,padding:"22px 30px",boxShadow:"0 9px 0 rgba(0,0,0,.14),0 20px 38px rgba(0,0,0,.16)",fontFamily:"Arial,Helvetica,sans-serif",fontSize:font,fontWeight:900,lineHeight:1.03,textAlign:"center",letterSpacing:-1.2,color:"#101214"}}>
      <div style={{position:"absolute",left:26,right:26,bottom:17,height:14,borderRadius:9,background:accent,opacity:.28}}/>
      <span style={{position:"relative"}}>{children}</span>
    </div>
  </div>;
};

const Counter=({n}:{n:number})=>{
  const f=useCurrentFrame(),{fps}=useVideoConfig();
  const p=spring({frame:f,fps,delay:14,durationInFrames:18,config:{damping:13,stiffness:230}});
  return <div style={{position:"absolute",top:292,left:0,right:0,display:"flex",justifyContent:"center",transform:`scale(${.7+.3*p})`,opacity:p}}>
    <div style={{display:"flex",alignItems:"center",gap:14,background:"#15191d",color:"#fff",padding:"14px 22px",borderRadius:20,boxShadow:"0 12px 28px rgba(0,0,0,.25)",fontFamily:"Arial",fontWeight:900,fontSize:36}}>
      <span style={{color:"#ffdf62"}}>{n}</span><span>PERSONAS A BORDO</span>
    </div>
  </div>;
};

const Film=({children}:{children:React.ReactNode})=>(
  <AbsoluteFill style={{overflow:"hidden",background:"#07131b"}}>
    {children}
    <div style={{position:"absolute",inset:0,pointerEvents:"none",background:"linear-gradient(180deg,rgba(0,0,0,.16),transparent 18%,transparent 78%,rgba(0,0,0,.30))"}}/>
  </AbsoluteFill>
);

const Scene1=()=>{
  const f=useCurrentFrame();
  const zoom=ease(f,0,96,1.02,1.16);
  const y=ease(f,0,96,-20,-95);
  return <Film>
    <Img src={BOAT} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transform:`translateY(${y}px) scale(${zoom})`,filter:"saturate(1.05) contrast(1.04)"}}/>
    <Label>CAPITÁN: “EL BOTE SOLO AGUANTA 6”</Label>
    <Counter n={7}/>
    <div style={{position:"absolute",bottom:115,left:80,right:80,textAlign:"center",fontFamily:"Arial",fontSize:34,fontWeight:800,color:"#fff",textShadow:"0 3px 12px rgba(0,0,0,.75)",opacity:lerp(f,38,56,0,1)}}>Todos miran alrededor… 👀</div>
  </Film>
};

const Scene2=()=>{
  const f=useCurrentFrame(),{fps}=useVideoConfig();
  const bg=ease(f,0,90,1.12,1.22);
  const card=spring({frame:f,fps,durationInFrames:24,config:{damping:14,stiffness:170}});
  const reaction=spring({frame:f,fps,delay:36,durationInFrames:18,config:{damping:16,stiffness:210}});
  return <Film>
    <Img src={BOAT} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transform:`scale(${bg})`,filter:"brightness(.62) saturate(.8) blur(1px)"}}/>
    <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,rgba(4,12,18,.72) 0%,rgba(4,12,18,.22) 55%,rgba(4,12,18,.56) 100%)"}}/>
    <Photo src={HERO} style={{left:510,top:390,width:470,height:790,transform:`translateX(${(1-card)*180}px) rotate(${-4+4*card}deg) scale(${.92+.08*card})`,opacity:card}}/>
    <div style={{position:"absolute",left:80,top:470,width:390,fontFamily:"Arial",color:"#fff",fontWeight:900,fontSize:76,lineHeight:.98,textShadow:"0 6px 18px rgba(0,0,0,.45)",opacity:card}}>
      EL BRO<br/><span style={{color:"#ffdf62"}}>SE OFRECE</span>
    </div>
    <div style={{position:"absolute",left:88,top:725,width:365,background:"#fff",borderRadius:26,padding:"22px 24px",fontFamily:"Arial",fontWeight:900,fontSize:47,lineHeight:1.02,color:"#111",boxShadow:"8px 10px 0 rgba(0,0,0,.24)",opacity:card,transform:`scale(${.9+.1*card})`}}>
      “TRANQUI.<br/>YO NADO 😎”
    </div>
    <Photo src={WOMAN} style={{left:70,top:1090,width:250,height:360,transform:`translateY(${(1-reaction)*55}px) rotate(-6deg)`,opacity:reaction}}/>
    <div style={{position:"absolute",left:315,top:1175,background:"#101317",color:"#fff",borderRadius:20,padding:"15px 22px",fontFamily:"Arial",fontWeight:900,fontSize:35,opacity:reaction,boxShadow:"0 12px 28px rgba(0,0,0,.3)"}}>“BRO… ¿SEGURO?”</div>
    <Label top={70} font={44}>EL HÉROE QUE NADIE PIDIÓ</Label>
  </Film>
};

const Ocean=()=>{
  const f=useCurrentFrame();
  const wave=Math.sin(f/9)*8;
  return <AbsoluteFill style={{background:"linear-gradient(#8bd5e8 0 36%,#3aa7c6 36% 100%)",overflow:"hidden"}}>
    <div style={{position:"absolute",top:575,left:-100,width:1300,height:80,borderRadius:"50%",background:"#e8d7b8",transform:"rotate(-2deg)"}}/>
    {Array.from({length:10}).map((_,i)=><div key={i} style={{position:"absolute",left:-180+((i*133+f*2)%300),top:690+i*120+wave*(i%2?-.5:1),width:1450,height:16,borderRadius:20,background:i%2?"rgba(255,255,255,.30)":"rgba(12,100,137,.22)"}}/>)}
  </AbsoluteFill>;
};

const Splash=({p}:{p:number})=><>
  {Array.from({length:28}).map((_,i)=>{
    const a=Math.PI*2*i/28,d=interpolate(p,[0,1],[0,110+(i%6)*24]),s=interpolate(p,[0,.18,1],[0,1,.05],clamp);
    return <div key={i} style={{position:"absolute",left:700+Math.cos(a)*d,top:1300+Math.sin(a)*d*.48,width:12+(i%4)*8,height:25+(i%5)*9,borderRadius:"50%",background:"rgba(255,255,255,.9)",transform:`scale(${s}) rotate(${i*17}deg)`}}/>
  })}
</>;

const Scene3=()=>{
  const f=useCurrentFrame();
  const p=interpolate(f,[10,56],[0,1],{...clamp,easing:Easing.in(Easing.quad)});
  const x=interpolate(p,[0,1],[590,850]);
  const y=interpolate(p,[0,.45,1],[510,380,1260]);
  const r=interpolate(p,[0,1],[-2,27]);
  const s=interpolate(p,[0,.8,1],[1,1,.72]);
  const sp=interpolate(f,[52,80],[0,1],clamp);
  const boat=ease(f,55,86,1.08,.88);
  const boatX=ease(f,55,86,0,-190);
  return <Film>
    <Img src={BOAT} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",transform:`translateX(${boatX}px) scale(${boat})`,filter:"saturate(.95) contrast(1.02)"}}/>
    <Photo src={HERO} style={{left:x,top:y,width:330,height:520,transform:`rotate(${r}deg) scale(${s})`,transformOrigin:"50% 85%"}}/>
    <Splash p={sp}/>
    <Label top={72} font={50}>“YO NADO.”</Label>
  </Film>
};

const Scene4=()=>{
  const f=useCurrentFrame(),{fps}=useVideoConfig();
  const card=spring({frame:f,fps,durationInFrames:18,config:{damping:18,stiffness:180}});
  const drift=ease(f,0,105,0,120);
  const finX=ease(f,26,78,-220,430);
  const zoom=interpolate(f,[72,112],[1,1.52],{...clamp,easing:Easing.out(Easing.exp)});
  const flash=interpolate(f,[110,114,118],[0,.82,0],clamp);
  return <AbsoluteFill style={{overflow:"hidden",transform:`scale(${zoom})`,transformOrigin:"55% 70%"}}>
    <Ocean/>
    <div style={{position:"absolute",left:95-drift,top:1090,transform:"rotate(-4deg)"}}>
      <Photo src={HERO} style={{position:"relative",left:0,top:0,width:260,height:390,opacity:card,transform:`scale(${.9+.1*card})`}}/>
      <div style={{position:"absolute",left:40,top:338,width:190,height:74,borderRadius:"50%",background:"rgba(255,255,255,.30)",filter:"blur(2px)"}}/>
    </div>
    <div style={{position:"absolute",left:finX,top:1185,width:200,height:150,background:"linear-gradient(145deg,#586773,#28323a)",clipPath:"polygon(0 100%,68% 0,100% 100%)",filter:"drop-shadow(0 12px 10px rgba(0,0,0,.28))"}}/>
    <div style={{position:"absolute",left:finX-110,top:1260,width:330,height:70,borderRadius:"50%",background:"rgba(10,62,82,.22)",filter:"blur(8px)"}}/>
    <Label top={72} font={48}>EL BRO, 3 SEGUNDOS DESPUÉS:</Label>
    <div style={{position:"absolute",left:0,right:0,bottom:150,textAlign:"center",fontFamily:"Arial",fontWeight:900,fontSize:54,color:"#fff",textShadow:"0 5px 15px rgba(0,0,0,.82)",opacity:lerp(f,77,90,0,1)}}>“…ESO NO ESTABA EN EL PLAN.”</div>
    <div style={{position:"absolute",inset:0,background:"#fff",opacity:flash}}/>
  </AbsoluteFill>;
};

const Sound=()=>(
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={420}><Audio src={MUSIC} volume={.30}/></Sequence>
    <Sequence from={28} durationInFrames={12}><Audio src={POP} volume={.58}/></Sequence>
    <Sequence from={105} durationInFrames={12}><Audio src={POP} volume={.55}/></Sequence>
    <Sequence from={193} durationInFrames={27}><Audio src={WHOOSH} volume={.78}/></Sequence>
    <Sequence from={234} durationInFrames={30}><Audio src={SPLASH} volume={.92}/></Sequence>
    <Sequence from={285} durationInFrames={102}><Audio src={ENGINE} volume={.28}/></Sequence>
    <Sequence from={335} durationInFrames={45}><Audio src={STING} volume={.84}/></Sequence>
    <Sequence from={388} durationInFrames={14}><Audio src={SCRATCH} volume={.62}/></Sequence>
  </AbsoluteFill>
);

export default function Video(){
  return <AbsoluteFill style={{background:"#07131b",overflow:"hidden"}}>
    <Sequence from={0} durationInFrames={96}><Scene1/></Sequence>
    <Sequence from={96} durationInFrames={96}><Scene2/></Sequence>
    <Sequence from={192} durationInFrames={93}><Scene3/></Sequence>
    <Sequence from={285} durationInFrames={135}><Scene4/></Sequence>
    <Sound/>
  </AbsoluteFill>;
}
