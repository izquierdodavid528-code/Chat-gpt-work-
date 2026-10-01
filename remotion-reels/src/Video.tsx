import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Audio,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};
const map = (f:number,a:number,b:number,x:number,y:number) => interpolate(f,[a,b],[x,y],clamp);
const smooth = (f:number,a:number,b:number,x:number,y:number) =>
  interpolate(f,[a,b],[x,y],{...clamp,easing:Easing.inOut(Easing.quad)});

function wav(duration:number, fn:(t:number,i:number)=>number){
  const sr=11025;
  const n=Math.max(1,Math.floor(duration*sr));
  const bytes=new Uint8Array(44+n*2);
  const v=new DataView(bytes.buffer);
  const put=(o:number,s:string)=>{for(let i=0;i<s.length;i++)bytes[o+i]=s.charCodeAt(i)};
  put(0,"RIFF"); v.setUint32(4,36+n*2,true); put(8,"WAVE"); put(12,"fmt ");
  v.setUint32(16,16,true); v.setUint16(20,1,true); v.setUint16(22,1,true);
  v.setUint32(24,sr,true); v.setUint32(28,sr*2,true); v.setUint16(32,2,true); v.setUint16(34,16,true);
  put(36,"data"); v.setUint32(40,n*2,true);
  for(let i=0;i<n;i++){
    const s=Math.max(-1,Math.min(1,fn(i/sr,i)));
    v.setInt16(44+i*2,s<0?s*32768:s*32767,true);
  }
  let bin="";
  for(let i=0;i<bytes.length;i+=4096){
    for(let j=i;j<Math.min(bytes.length,i+4096);j++)bin+=String.fromCharCode(bytes[j]);
  }
  return "data:audio/wav;base64,"+btoa(bin);
}

const rnd=(i:number)=>{
  const x=Math.sin(i*12.9898+78.233)*43758.5453;
  return (x-Math.floor(x))*2-1;
};

const MUSIC=wav(12,(t,i)=>{
  const beat=t%0.5;
  const half=(t+0.25)%0.5;
  const kick=Math.sin(2*Math.PI*(62+28*Math.exp(-beat*17))*beat)*Math.exp(-beat*15);
  const sn=half<0.075?rnd(i)*Math.exp(-half*31):0;
  const hat=(t%0.25)<0.028?rnd(i*3)*Math.exp(-(t%0.25)*95):0;
  const notes=[110,146.83,164.81,130.81];
  const f=notes[Math.floor(t/0.5)%4];
  const bass=Math.sin(2*Math.PI*f*t)*Math.exp(-(t%0.5)*5);
  const pluck=Math.sin(2*Math.PI*f*2*t)*Math.exp(-(t%0.25)*14);
  return .23*kick+.055*sn+.018*hat+.065*bass+.018*pluck;
});
const POP=wav(.18,t=>Math.exp(-t*24)*.36*Math.sin(2*Math.PI*(820-2400*t)*t));
const WHOOSH=wav(.9,(t,i)=>{
  const e=Math.sin(Math.PI*Math.min(1,t/.9));
  return e*(.12*rnd(i)+.11*Math.sin(2*Math.PI*(150+1100*t*t)*t));
});
const SPLASH=wav(1.0,(t,i)=>{
  const e=Math.exp(-t*4.8);
  return e*(.30*rnd(i)+.08*Math.sin(2*Math.PI*92*t)+.035*Math.sin(2*Math.PI*184*t));
});
const ENGINE=wav(3.5,(t,i)=>{
  const pulse=.5+.5*Math.sin(2*Math.PI*7.4*t);
  return .055*Math.sin(2*Math.PI*78*t)+.018*pulse*rnd(i);
});
const STING=wav(1.55,t=>{
  const e=Math.exp(-t*2.0);
  const f=t<.32?220:110;
  return e*(.24*Math.sin(2*Math.PI*f*t)+.085*Math.sin(2*Math.PI*f*2.01*t));
});
const SCRATCH=wav(.45,(t,i)=>{
  const e=Math.exp(-t*5);
  return e*(.11*rnd(i)+.12*Math.sin(2*Math.PI*(900-1500*t)*t));
});

const Ocean=({drift=0}:{drift?:number})=>{
  const frame=useCurrentFrame();
  const wave=Math.sin((frame+drift)/10);
  return (
    <AbsoluteFill style={{overflow:"hidden",background:"#3daacb"}}>
      <div style={{position:"absolute",inset:0,height:720,background:"linear-gradient(180deg,#7fd6ee 0%,#c9eef7 66%,#f5ead7 100%)"}}/>
      <div style={{position:"absolute",top:135,left:840,width:118,height:118,borderRadius:"50%",background:"radial-gradient(circle at 38% 36%,#fff4b2 0 22%,#ffd65e 23% 100%)",boxShadow:"0 0 95px rgba(255,212,80,.55)"}}/>
      <div style={{position:"absolute",top:500,left:-80,width:1230,height:110,background:"#ead9b5",borderRadius:"50%",transform:"rotate(-2.5deg)",boxShadow:"inset 0 -24px rgba(111,145,139,.22)"}}/>
      <div style={{position:"absolute",top:565,left:-80,width:1230,height:44,borderRadius:"50%",background:"rgba(83,140,142,.35)",transform:"rotate(-2.5deg)"}}/>
      {[0,1,2,3,4].map(i=><div key={i} style={{position:"absolute",top:475+(i%2)*17,left:115+i*220,width:52,height:16,borderTop:"4px solid rgba(55,86,92,.32)",borderRadius:"50%",transform:`rotate(${i%2?8:-9}deg)`}}/>)}
      {Array.from({length:11}).map((_,i)=>{
        const y=690+i*112+(i%2)*30;
        const x=-230+((i*153+frame*2.15)%390);
        return <div key={i} style={{position:"absolute",left:x,top:y+wave*(i%3===0?12:-6),width:1500,height:16,borderRadius:30,background:i%2?"rgba(255,255,255,.30)":"rgba(19,111,146,.23)",transform:`rotate(${i%2?1.4:-1.8}deg)`}}/>
      })}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(125deg,rgba(255,255,255,.12),transparent 34%,rgba(255,255,255,.05) 63%,transparent)"}}/>
    </AbsoluteFill>
  );
};

type PersonProps={
  x:number;y:number;scale?:number;rot?:number;skin?:string;hair?:string;shirt?:string;
  pants?:string;pose?:number;hero?:boolean;panic?:number;look?:number;flip?:boolean;
};

const Person=({
  x,y,scale=1,rot=0,skin="#bd835f",hair="#271d19",shirt="#d85f4e",pants="#263746",
  pose=0,hero=false,panic=0,look=0,flip=false
}:PersonProps)=>{
  const skinHi="#dba17b";
  const armL=-7-pose*25;
  const armR=10+pose*28;
  return (
    <div style={{
      position:"absolute",left:x,top:y,width:176,height:330,
      transform:`scaleX(${flip?-1:1}) scale(${scale}) rotate(${rot}deg)`,
      transformOrigin:"50% 100%",
      filter:"drop-shadow(0 12px 10px rgba(20,35,45,.28))"
    }}>
      <div style={{position:"absolute",left:49,top:24,width:79,height:88,borderRadius:"44% 44% 42% 42%",background:`linear-gradient(125deg,${skinHi} 0%,${skin} 56%,#956347 100%)`,boxShadow:"inset -8px -5px 10px rgba(68,37,25,.12)"}}/>
      <div style={{position:"absolute",left:44,top:8,width:88,height:50,borderRadius:"70% 72% 30% 24%",background:`linear-gradient(140deg,#46312a,${hair} 52%,#120d0b)`,clipPath:"polygon(0 58%,10% 22%,30% 4%,65% 0,92% 18%,100% 52%,82% 36%,67% 47%,54% 27%,36% 45%,17% 36%)"}}/>
      <div style={{position:"absolute",left:38,top:106,width:100,height:130,borderRadius:"30px 30px 24px 24px",background:`linear-gradient(110deg,#ffffff1c,${shirt} 35%,#00000018 100%)`,boxShadow:"inset -11px 0 18px rgba(0,0,0,.10)"}}/>
      <div style={{position:"absolute",left:30,top:115,width:27,height:116,borderRadius:18,background:`linear-gradient(90deg,${skinHi},${skin})`,transform:`rotate(${armL}deg)`,transformOrigin:"50% 8%"}}/>
      <div style={{position:"absolute",left:119,top:114,width:27,height:116,borderRadius:18,background:`linear-gradient(90deg,${skin},#a36e50)`,transform:`rotate(${armR}deg)`,transformOrigin:"50% 8%"}}/>
      <div style={{position:"absolute",left:43,top:229,width:39,height:100,borderRadius:"15px 15px 12px 12px",background:`linear-gradient(90deg,#354a5b,${pants})`,transform:`rotate(${-2-pose*7}deg)`,transformOrigin:"50% 0%"}}/>
      <div style={{position:"absolute",left:91,top:229,width:39,height:100,borderRadius:"15px 15px 12px 12px",background:`linear-gradient(90deg,${pants},#1b2731)`,transform:`rotate(${3+pose*7}deg)`,transformOrigin:"50% 0%"}}/>
      <div style={{position:"absolute",left:38,top:316,width:50,height:15,borderRadius:"14px 18px 8px 8px",background:"#1b1b1b",transform:`rotate(${-2-pose*7}deg)`}}/>
      <div style={{position:"absolute",left:88,top:316,width:50,height:15,borderRadius:"18px 14px 8px 8px",background:"#1b1b1b",transform:`rotate(${3+pose*7}deg)`}}/>
      <div style={{position:"absolute",left:58,top:46,width:16,height:8,borderRadius:"50%",background:"#2b221e",transform:`translateX(${look}px)`}}/>
      <div style={{position:"absolute",left:101,top:46,width:16,height:8,borderRadius:"50%",background:"#2b221e",transform:`translateX(${look}px)`}}/>
      <div style={{position:"absolute",left:84,top:51,width:7,height:25,borderRadius:"40%",background:"rgba(117,74,54,.45)",transform:"rotate(7deg)"}}/>
      <div style={{position:"absolute",left:74,top:82,width:30,height:panic?19:8,borderRadius:panic?"50%":"0 0 50% 50%",background:panic?"#63342d":"#8c5042"}}/>
      {hero && panic<.1 && <div style={{position:"absolute",left:48,top:39,width:82,height:28,borderRadius:8,background:"linear-gradient(#252525,#111)",boxShadow:"0 3px 4px rgba(0,0,0,.28)"}}>
        <div style={{position:"absolute",left:9,top:5,width:27,height:13,borderRadius:5,background:"linear-gradient(135deg,#4d6978,#111)"}}/>
        <div style={{position:"absolute",right:9,top:5,width:27,height:13,borderRadius:5,background:"linear-gradient(135deg,#4d6978,#111)"}}/>
        <div style={{position:"absolute",left:36,top:10,width:10,height:4,background:"#333"}}/>
      </div>}
      {panic>.15 && <>
        <div style={{position:"absolute",left:54,top:34,width:25,height:4,borderRadius:4,background:"#4a3028",transform:"rotate(-13deg)"}}/>
        <div style={{position:"absolute",left:98,top:34,width:25,height:4,borderRadius:4,background:"#4a3028",transform:"rotate(13deg)"}}/>
        <div style={{position:"absolute",left:59,top:44,width:18,height:14,borderRadius:"50%",background:"white"}}/>
        <div style={{position:"absolute",left:102,top:44,width:18,height:14,borderRadius:"50%",background:"white"}}/>
        <div style={{position:"absolute",left:65+look,top:48,width:8,height:8,borderRadius:"50%",background:"#222"}}/>
        <div style={{position:"absolute",left:108+look,top:48,width:8,height:8,borderRadius:"50%",background:"#222"}}/>
      </>}
      {hero && <div style={{position:"absolute",left:54,top:119,width:67,height:8,borderRadius:5,background:"rgba(255,255,255,.22)"}}/>}
    </div>
  );
};

const Boat=({hero=true}:{hero?:boolean})=>{
  const frame=useCurrentFrame();
  const bob=Math.sin(frame/7)*6;
  const micro=Math.sin(frame/10)*2;
  return (
    <div style={{position:"absolute",left:18,top:718+bob,width:1040,height:650}}>
      <div style={{position:"absolute",left:118,top:350,width:790,height:225,background:"linear-gradient(180deg,#fffdf6,#e8e1cf)",clipPath:"polygon(4% 0,96% 0,83% 100%,17% 100%)",filter:"drop-shadow(0 23px 18px rgba(13,53,72,.28))"}}/>
      <div style={{position:"absolute",left:160,top:359,width:706,height:62,borderRadius:18,background:"linear-gradient(180deg,#2f7798,#1f5873)"}}/>
      <div style={{position:"absolute",left:231,top:423,width:565,height:39,borderRadius:21,background:"linear-gradient(#d8c396,#b49c73)"}}/>
      <div style={{position:"absolute",left:260,top:250,width:520,height:104,background:"linear-gradient(180deg,#fffef9,#eee8d9)",border:"8px solid #344f5e",borderBottom:"none",borderRadius:"37px 37px 0 0"}}/>
      {[0,1,2,3].map(i=><div key={i} style={{position:"absolute",left:284+i*118,top:275,width:87,height:58,borderRadius:12,background:"linear-gradient(135deg,#8ed7ec,#3d93b3)",border:"5px solid #344f5e",boxShadow:"inset 8px 7px 18px rgba(255,255,255,.35)"}}/>)}
      <div style={{position:"absolute",left:382,top:145,width:9,height:107,background:"#41494e"}}/>
      <div style={{position:"absolute",left:386,top:147,width:290,height:9,background:"#41494e"}}/>
      <div style={{position:"absolute",left:668,top:147,width:9,height:106,background:"#41494e"}}/>
      <div style={{position:"absolute",left:508,top:195,width:56,height:55,borderRadius:"7px 7px 0 0",background:"linear-gradient(#e5534e,#b73135)"}}/>
      <div style={{position:"absolute",left:527,top:163,width:11,height:34,background:"#333"}}/>
      <div style={{position:"absolute",left:531,top:158,width:42,height:18,borderRadius:12,background:"#ffd95a",transform:"rotate(-8deg)"}}/>
      <div style={{position:"absolute",left:790,top:315,width:90,height:34,borderRadius:8,background:"#ece6d7",border:"4px solid #354e5c",fontFamily:"Arial",fontSize:18,fontWeight:900,textAlign:"center",lineHeight:"28px"}}>M-07</div>
      <div style={{position:"absolute",transform:`translateY(${micro}px)`}}>
        <Person x={162} y={75} scale={.66} shirt="#e5b64c" rot={-4}/>
        <Person x={310} y={54} scale={.73} shirt="#5f9fc6" rot={2} hair="#5a402d"/>
        <Person x={470} y={63} scale={.71} shirt="#ad6dc2" rot={-2} skin="#895d45"/>
        <Person x={630} y={80} scale={.65} shirt="#57986d" rot={4} skin="#d6a37c"/>
        <Person x={130} y={245} scale={.71} shirt="#c85161" rot={-4}/>
        <Person x={704} y={245} scale={.69} shirt="#d8934a" rot={4} skin="#7b543f"/>
        {hero&&<Person x={438} y={238} scale={.80} shirt="#171717" skin="#b98262" hair="#17110f" hero/>}
      </div>
    </div>
  );
};

const Caption=({children,top=70,fontSize=52,sub}:{children:React.ReactNode;top?:number;fontSize?:number;sub?:string})=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const p=spring({frame,fps,durationInFrames:18,config:{damping:18,stiffness:220}});
  return (
    <div style={{position:"absolute",top,left:48,right:48,display:"flex",justifyContent:"center",opacity:p,transform:`translateY(${(1-p)*-24}px) scale(${.95+.05*p})`}}>
      <div style={{background:"rgba(255,255,255,.97)",color:"#101010",fontFamily:"Arial,Helvetica,sans-serif",fontWeight:900,fontSize,lineHeight:1.02,textAlign:"center",padding:"22px 30px",borderRadius:24,boxShadow:"0 9px 0 rgba(0,0,0,.14),0 20px 34px rgba(0,0,0,.13)",maxWidth:950,letterSpacing:-1.2}}>
        <div>{children}</div>
        {sub&&<div style={{fontSize:26,fontWeight:700,marginTop:10,color:"#5a6065",letterSpacing:0}}>{sub}</div>}
      </div>
    </div>
  );
};

const Badge=({text,top=292}:{text:string;top?:number})=>{
  const frame=useCurrentFrame(); const {fps}=useVideoConfig();
  const p=spring({frame,fps,delay:18,durationInFrames:16,config:{damping:14,stiffness:200}});
  return <div style={{position:"absolute",top,left:0,right:0,display:"flex",justifyContent:"center",opacity:p,transform:`scale(${.78+.22*p})`}}>
    <div style={{background:"#ffdf5d",color:"#171717",fontFamily:"Arial",fontWeight:900,fontSize:38,padding:"13px 24px",borderRadius:18,border:"4px solid #171717",boxShadow:"6px 7px 0 rgba(0,0,0,.18)"}}>{text}</div>
  </div>
};

const Arrow=({x,y,rot=0,p=1}:{x:number;y:number;rot?:number;p?:number})=><div style={{position:"absolute",left:x,top:y,width:120,height:18,background:"#ef3b3b",borderRadius:20,transform:`rotate(${rot}deg) scaleX(${p})`,transformOrigin:"0 50%",boxShadow:"0 3px 8px rgba(0,0,0,.25)"}}>
  <div style={{position:"absolute",right:-8,top:-18,width:0,height:0,borderTop:"27px solid transparent",borderBottom:"27px solid transparent",borderLeft:"38px solid #ef3b3b"}}/>
</div>;

const Scene1=()=>{
  const f=useCurrentFrame();
  const zoom=smooth(f,0,90,1,1.065);
  const arrow=map(f,34,52,0,1);
  return <AbsoluteFill style={{transform:`scale(${zoom})`,transformOrigin:"50% 55%"}}>
    <Ocean/><Boat/>
    <Caption sub="El capitán lo dice una sola vez…">CAPITÁN: “EL BOTE SOLO AGUANTA 6”</Caption>
    <Badge text="SOMOS 7 😬"/>
    <Arrow x={460} y={938} rot={-17} p={arrow}/>
  </AbsoluteFill>;
};

const Scene2=()=>{
  const f=useCurrentFrame(); const {fps}=useVideoConfig();
  const rise=spring({frame:f,fps,durationInFrames:28,config:{damping:13,stiffness:165}});
  const pose=map(f,20,55,0,1);
  const zoom=smooth(f,0,90,1.06,1.22);
  const bubble=spring({frame:f,fps,delay:26,durationInFrames:16,config:{damping:14,stiffness:210}});
  const reactions=map(f,38,58,0,1);
  return <AbsoluteFill style={{transform:`scale(${zoom})`,transformOrigin:"52% 58%"}}>
    <Ocean drift={19}/><Boat hero={false}/>
    <div style={{position:"absolute",left:476,top:958-map(rise,0,1,0,115)}}>
      <Person x={0} y={0} scale={.90} shirt="#171717" skin="#b98262" hair="#17110f" hero pose={pose}/>
    </div>
    <div style={{position:"absolute",left:565,top:635,opacity:bubble,transform:`scale(${.72+.28*bubble}) rotate(-2deg)`}}>
      <div style={{background:"white",border:"5px solid #171717",borderRadius:28,padding:"20px 27px",fontFamily:"Arial",fontWeight:900,fontSize:47,lineHeight:1.02,boxShadow:"8px 9px 0 rgba(0,0,0,.22)"}}>TRANQUI.<br/>YO NADO 😎</div>
      <div style={{position:"absolute",left:38,bottom:-30,width:40,height:40,background:"white",borderLeft:"5px solid #171717",borderBottom:"5px solid #171717",transform:"rotate(-34deg)"}}/>
    </div>
    <div style={{position:"absolute",left:190,top:1040,opacity:reactions,fontFamily:"Arial",fontWeight:900,fontSize:44,color:"#fff",textShadow:"0 4px 10px rgba(0,0,0,.7)"}}>¿QUÉ?</div>
    <div style={{position:"absolute",left:720,top:1000,opacity:reactions,fontFamily:"Arial",fontWeight:900,fontSize:44,color:"#fff",textShadow:"0 4px 10px rgba(0,0,0,.7)"}}>BRO…</div>
    <Caption top={72} fontSize={46}>EL BRO QUERIENDO QUEDAR COMO UN HÉROE</Caption>
  </AbsoluteFill>;
};

const Splash=({p}:{p:number})=><>
  {Array.from({length:28}).map((_,i)=>{
    const a=Math.PI*2*i/28;
    const d=interpolate(p,[0,1],[0,115+(i%6)*23]);
    const s=interpolate(p,[0,.18,1],[0,1,.08],clamp);
    return <div key={i} style={{position:"absolute",left:735+Math.cos(a)*d,top:1335+Math.sin(a)*d*.48,width:12+(i%4)*8,height:26+(i%5)*10,borderRadius:"50%",background:"rgba(255,255,255,.90)",transform:`scale(${s}) rotate(${i*21}deg)`,boxShadow:"0 2px 7px rgba(20,100,135,.15)"}}/>
  })}
  <div style={{position:"absolute",left:585,top:1314,width:310,height:78,border:"14px solid rgba(255,255,255,.8)",borderRadius:"50%",transform:`scale(${interpolate(p,[0,.22,1],[.3,1,1.85],clamp)})`,opacity:interpolate(p,[0,.72,1],[1,.72,0],clamp)}}/>
</>;

const Scene3=()=>{
  const f=useCurrentFrame();
  const anticipate=interpolate(f,[0,13,23],[0,-28,0],clamp);
  const p=interpolate(f,[19,64],[0,1],{...clamp,easing:Easing.in(Easing.quad)});
  const x=interpolate(p,[0,1],[488,765]);
  const y=interpolate(p,[0,.47,1],[835,585,1330])+anticipate;
  const rot=interpolate(p,[0,1],[0,112]);
  const scale=interpolate(p,[0,.8,1],[1,1.04,.77]);
  const splash=interpolate(f,[58,88],[0,1],clamp);
  const shake=f>56&&f<69?Math.sin(f*2.9)*8:0;
  return <AbsoluteFill style={{transform:`translate(${shake}px,${-shake*.4}px)`}}>
    <Ocean drift={37}/><Boat hero={false}/>
    <div style={{position:"absolute",left:x,top:y,transform:`rotate(${rot}deg) scale(${scale})`,transformOrigin:"50% 78%"}}>
      <Person x={0} y={0} scale={.91} shirt="#171717" skin="#b98262" hair="#17110f" hero pose={1}/>
    </div>
    {p>.08&&p<.76&&<div style={{position:"absolute",left:x-130,top:y+132,width:170,height:18,borderRadius:12,background:"rgba(255,255,255,.42)",transform:`rotate(${-20+rot*.18}deg)`}}/>}
    <Splash p={splash}/>
    <Caption top={72} fontSize={52}>“TRANQUI. YO NADO.”</Caption>
  </AbsoluteFill>;
};

const Fin=({frame}:{frame:number})=>{
  const x=smooth(frame,18,78,-240,360);
  const bob=Math.sin(frame/5)*7;
  return <>
    <div style={{position:"absolute",left:x-120,top:1226+bob,width:330,height:80,borderRadius:"50%",background:"rgba(12,61,78,.22)",filter:"blur(8px)"}}/>
    <div style={{position:"absolute",left:x,top:1152+bob,width:190,height:148,background:"linear-gradient(145deg,#53616b,#253039)",clipPath:"polygon(0 100%,68% 0,100% 100%)",filter:"drop-shadow(0 12px 9px rgba(0,0,0,.28))"}}/>
  </>;
};

const Scene4=()=>{
  const f=useCurrentFrame();
  const boatX=smooth(f,0,63,0,845);
  const boatS=smooth(f,0,63,.90,.66);
  const turn=map(f,44,74,0,-24);
  const panic=map(f,61,77,0,1);
  const zoom=interpolate(f,[74,104],[1,1.58],{...clamp,easing:Easing.out(Easing.exp)});
  const caption=map(f,0,14,0,1);
  const flash=interpolate(f,[100,104,108],[0,.82,0],clamp);
  return <AbsoluteFill style={{transform:`scale(${zoom})`,transformOrigin:"53% 69%"}}>
    <Ocean drift={61}/>
    <div style={{transform:`translateX(${boatX}px) scale(${boatS})`,transformOrigin:"50% 50%"}}><Boat hero={false}/></div>
    <div style={{position:"absolute",left:462,top:1190,transform:`rotate(${turn}deg)`,transformOrigin:"50% 89%"}}>
      <Person x={0} y={0} scale={.74} shirt="#171717" skin="#b98262" hair="#17110f" panic={panic} look={panic*4}/>
    </div>
    <Fin frame={f}/>
    <div style={{opacity:caption}}><Caption top={72} fontSize={48}>EL BRO, 3 SEGUNDOS DESPUÉS:</Caption></div>
    <div style={{position:"absolute",left:0,right:0,bottom:150,textAlign:"center",fontFamily:"Arial",fontWeight:900,fontSize:51,color:"white",opacity:map(f,75,86,0,1),textShadow:"0 5px 14px rgba(0,0,0,.88)"}}>“…eso no estaba en el plan.”</div>
    <div style={{position:"absolute",inset:0,background:"white",opacity:flash}}/>
  </AbsoluteFill>;
};

const Sound=()=>(
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={360}><Audio src={MUSIC} volume={.30}/></Sequence>
    <Sequence from={28} durationInFrames={12}><Audio src={POP} volume={.58}/></Sequence>
    <Sequence from={106} durationInFrames={12}><Audio src={POP} volume={.54}/></Sequence>
    <Sequence from={185} durationInFrames={27}><Audio src={WHOOSH} volume={.76}/></Sequence>
    <Sequence from={223} durationInFrames={30}><Audio src={SPLASH} volume={.92}/></Sequence>
    <Sequence from={255} durationInFrames={105}><Audio src={ENGINE} volume={.34}/></Sequence>
    <Sequence from={300} durationInFrames={46}><Audio src={STING} volume={.84}/></Sequence>
    <Sequence from={344} durationInFrames={14}><Audio src={SCRATCH} volume={.62}/></Sequence>
  </AbsoluteFill>
);

export default function Video(){
  return (
    <AbsoluteFill style={{background:"#3daacb",overflow:"hidden"}}>
      <Sequence from={0} durationInFrames={90}><Scene1/></Sequence>
      <Sequence from={90} durationInFrames={90}><Scene2/></Sequence>
      <Sequence from={180} durationInFrames={75}><Scene3/></Sequence>
      <Sequence from={255} durationInFrames={105}><Scene4/></Sequence>
      <Sound/>
    </AbsoluteFill>
  );
}
