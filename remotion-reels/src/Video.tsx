import React from "react";
import {AbsoluteFill, Sequence, Audio, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from "remotion";

const clamp={extrapolateLeft:"clamp" as const,extrapolateRight:"clamp" as const};
const lerp=(f:number,a:number,b:number,x:number,y:number)=>interpolate(f,[a,b],[x,y],clamp);

function wavDataUri(durationSec:number, sampleFn:(t:number,i:number)=>number){
  const sr=8000,n=Math.max(1,Math.floor(durationSec*sr)),bytes=new Uint8Array(44+n*2),v=new DataView(bytes.buffer);
  const put=(o:number,s:string)=>{for(let i=0;i<s.length;i++)bytes[o+i]=s.charCodeAt(i)};
  put(0,"RIFF");v.setUint32(4,36+n*2,true);put(8,"WAVE");put(12,"fmt ");
  v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sr,true);v.setUint32(28,sr*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);
  put(36,"data");v.setUint32(40,n*2,true);
  for(let i=0;i<n;i++){const s=Math.max(-1,Math.min(1,sampleFn(i/sr,i)));v.setInt16(44+i*2,s<0?s*32768:s*32767,true);}
  let bin="";for(let i=0;i<bytes.length;i+=4096){for(let j=i;j<Math.min(bytes.length,i+4096);j++)bin+=String.fromCharCode(bytes[j]);}
  return "data:audio/wav;base64,"+btoa(bin);
}
const noise=(i:number)=>{const x=Math.sin(i*12.9898+78.233)*43758.5453;return (x-Math.floor(x))*2-1};
const MUSIC=wavDataUri(11,(t,i)=>{const beat=t%0.5,off=(t+0.25)%0.5,kick=Math.sin(2*Math.PI*(58+24*Math.exp(-beat*18))*beat)*Math.exp(-beat*15),sn=off<.075?noise(i)*Math.exp(-off*30):0,hat=(t%.25)<.035?noise(i*7)*Math.exp(-(t%.25)*75):0,f=[110,146.83,164.81,130.81][Math.floor(t/.5)%4],ph=t%.5,bass=Math.sin(2*Math.PI*f*t)*Math.exp(-ph*4.8);return .26*kick+.07*sn+.025*hat+.08*bass});
const WHOOSH=wavDataUri(.75,(t,i)=>{const env=Math.sin(Math.PI*Math.min(1,t/.75));return env*(.12*Math.sin(2*Math.PI*(180+780*t*t)*t)+.12*noise(i))});
const SPLASH=wavDataUri(.8,(t,i)=>Math.exp(-t*5.5)*(.28*noise(i)+.07*Math.sin(2*Math.PI*95*t)));
const STING=wavDataUri(1.4,t=>Math.exp(-t*2.2)*(.20*Math.sin(2*Math.PI*(t<.35?196:98)*t)+.08*Math.sin(2*Math.PI*(t<.35?392:196)*t)));
const POP=wavDataUri(.18,t=>Math.exp(-t*22)*.32*Math.sin(2*Math.PI*(700-2100*t)*t));

const Ocean=({drift=0}:{drift?:number})=>{const frame=useCurrentFrame(),swell=Math.sin((frame+drift)/11);return <AbsoluteFill style={{overflow:"hidden",background:"#45aecd"}}>
<div style={{position:"absolute",inset:0,height:730,background:"linear-gradient(#7ed5ef 0%,#b9e9f3 66%,#f8efe0 100%)"}}/>
<div style={{position:"absolute",top:160,left:820,width:120,height:120,borderRadius:"50%",background:"#ffd769",boxShadow:"0 0 90px rgba(255,218,110,.7)"}}/>
<div style={{position:"absolute",top:555,left:-130,width:1400,height:88,background:"#e8d9b5",borderRadius:"50%",transform:"rotate(-2.5deg)"}}/>
<div style={{position:"absolute",top:598,left:-80,width:1300,height:38,background:"#7aa9a2",borderRadius:"50%",opacity:.45,transform:"rotate(-2.5deg)"}}/>
{Array.from({length:10}).map((_,i)=>{const y=700+i*122+(i%2)*28,x=-210+((i*149+frame*2.2)%360);return <div key={i} style={{position:"absolute",left:x,top:y+swell*(i%3===0?11:-6),width:1500,height:18,borderRadius:30,background:i%2?"rgba(255,255,255,.28)":"rgba(21,116,150,.22)",transform:`rotate(${i%2?1.3:-1.8}deg)`}}/>})}
</AbsoluteFill>};

type P={x:number;y:number;scale?:number;shirt?:string;skin?:string;rot?:number;hair?:string;pose?:number;hero?:boolean;look?:number;panic?:number};
const Person=({x,y,scale=1,shirt="#e76453",skin="#c98b68",rot=0,hair="#2a211d",pose=0,hero=false,look=0,panic=0}:P)=><div style={{position:"absolute",left:x,top:y,width:160,height:300,transform:`scale(${scale}) rotate(${rot}deg)`,transformOrigin:"50% 100%",filter:"drop-shadow(0 9px 7px rgba(0,0,0,.25))"}}>
<div style={{position:"absolute",left:47,top:16,width:70,height:78,borderRadius:"48% 48% 43% 43%",background:skin,border:"4px solid white"}}/>
<div style={{position:"absolute",left:42,top:5,width:80,height:40,borderRadius:"70% 70% 28% 28%",background:hair,border:"3px solid white",borderBottom:"none"}}/>
<div style={{position:"absolute",left:48,top:89,width:70,height:119,borderRadius:"28px 28px 18px 18px",background:shirt,border:"4px solid white"}}/>
<div style={{position:"absolute",left:27,top:103,width:25,height:108,borderRadius:16,background:skin,border:"4px solid white",transform:`rotate(${-12-pose*20}deg)`,transformOrigin:"50% 8%"}}/>
<div style={{position:"absolute",left:111,top:102,width:25,height:108,borderRadius:16,background:skin,border:"4px solid white",transform:`rotate(${13+pose*24}deg)`,transformOrigin:"50% 8%"}}/>
<div style={{position:"absolute",left:53,top:201,width:29,height:96,borderRadius:14,background:"#263541",border:"4px solid white",transform:`rotate(${-4-pose*6}deg)`}}/>
<div style={{position:"absolute",left:84,top:201,width:29,height:96,borderRadius:14,background:"#263541",border:"4px solid white",transform:`rotate(${5+pose*6}deg)`}}/>
{hero&&!panic?<div style={{position:"absolute",left:55,top:37,width:56,height:22,borderRadius:8,background:"#171717",border:"3px solid white"}}>:<><div style={{position:"absolute",left:60+look,top:39,width:panic?11:8,height:panic?11:7,background:"#202020",borderRadius:"50%"}}/><div style={{position:"absolute",left:94+look,top:39,width:panic?11:8,height:panic?11:7,background:"#202020",borderRadius:"50%"}}/></>}
<div style={{position:"absolute",left:76,top:62,width:panic?19:14,height:panic?15:5,borderRadius:panic?"50%":"0 0 50% 50%",background:panic?"#53251f":"#8d4a3d"}}/>
</div>;

const Boat=({heroVisible=true}:{heroVisible?:boolean})=>{const frame=useCurrentFrame();return <div style={{position:"absolute",left:32,top:730+Math.sin(frame/7)*6,width:1020,height:620}}>
<div style={{position:"absolute",left:130,top:340,width:760,height:210,background:"#faf5e8",clipPath:"polygon(5% 0,95% 0,82% 100%,18% 100%)",filter:"drop-shadow(0 22px 14px rgba(0,0,0,.28))"}}/>
<div style={{position:"absolute",left:174,top:349,width:672,height:58,borderRadius:15,background:"#235f80"}}/>
<div style={{position:"absolute",left:248,top:240,width:535,height:105,background:"#f8f5eb",border:"8px solid #304d5d",borderBottom:"none",borderRadius:"38px 38px 0 0"}}/>
<div style={{position:"absolute",left:360,top:150,width:9,height:92,background:"#40484b"}}/><div style={{position:"absolute",left:365,top:151,width:290,height:9,background:"#40484b"}}/><div style={{position:"absolute",left:646,top:151,width:9,height:92,background:"#40484b"}}/>
<Person x={180} y={78} scale={.68} shirt="#efb845" rot={-4}/><Person x={320} y={61} scale={.74} shirt="#64a5ce" rot={2}/><Person x={465} y={66} scale={.73} shirt="#bd70cf" rot={-2} skin="#8b5f45"/><Person x={616} y={83} scale={.67} shirt="#58a66e" rot={4}/><Person x={145} y={236} scale={.73} shirt="#d85b68" rot={-3}/><Person x={680} y={236} scale={.72} shirt="#e69b4e" rot={4} skin="#79503e"/>{heroVisible&&<Person x={436} y={226} scale={.82} shirt="#171717" skin="#b97b59" hair="#161616" hero/>}
</div>};

const Card=({children,top=86,fontSize=54}:{children:React.ReactNode;top?:number;fontSize?:number})=>{const frame=useCurrentFrame(),{fps}=useVideoConfig(),p=spring({frame,fps,durationInFrames:18,config:{damping:18,stiffness:220}});return <div style={{position:"absolute",top,left:54,right:54,display:"flex",justifyContent:"center",opacity:p,transform:`scale(${.94+.06*p})`}}><div style={{background:"white",color:"#111",fontFamily:"Arial,sans-serif",fontWeight:900,fontSize,lineHeight:1.02,textAlign:"center",padding:"22px 30px",borderRadius:22,boxShadow:"0 9px 0 rgba(0,0,0,.14)",maxWidth:940}}>{children}</div></div>};

const Intro=()=>{const f=useCurrentFrame();return <AbsoluteFill style={{transform:`scale(${lerp(f,0,82,1,1.07)})`}}><Ocean/><Boat/><Card>EL BOTE AGUANTA 6…<br/>Y SOMOS 7</Card><div style={{position:"absolute",top:270,left:90,right:90}}><Card top={0} fontSize={42}>EL BRO QUERIENDO QUEDAR COMO UN HÉROE:</Card></div></AbsoluteFill>};
const Hero=()=>{const f=useCurrentFrame(),{fps}=useVideoConfig(),rise=spring({frame:f,fps,durationInFrames:27,config:{damping:13,stiffness:165}}),pose=lerp(f,20,48,0,1),b=spring({frame:f,fps,delay:24,durationInFrames:16,config:{damping:14,stiffness:210}});return <AbsoluteFill style={{transform:`scale(${lerp(f,0,76,1.07,1.24)})`}}><Ocean drift={21}/><Boat heroVisible={false}/><div style={{position:"absolute",left:476,top:953-lerp(rise,0,1,0,105)}}><Person x={0} y={0} scale={.91} shirt="#171717" skin="#b97b59" hero pose={pose}/></div><div style={{position:"absolute",left:590,top:650,opacity:b,transform:`scale(${.7+.3*b}) rotate(-3deg)`,background:"white",border:"5px solid #171717",borderRadius:26,padding:"20px 26px",fontFamily:"Arial",fontWeight:900,fontSize:46}}>TRANQUI,<br/>YO NADO 😎</div></AbsoluteFill>};
const Jump=()=>{const f=useCurrentFrame(),p=interpolate(f,[18,60],[0,1],{...clamp,easing:Easing.in(Easing.quad)}),x=interpolate(p,[0,1],[490,735]),y=interpolate(p,[0,.46,1],[825,602,1330]),rot=interpolate(p,[0,1],[0,102]),sp=interpolate(f,[55,84],[0,1],clamp);return <AbsoluteFill><Ocean drift={39}/><Boat heroVisible={false}/><div style={{position:"absolute",left:x,top:y,transform:`rotate(${rot}deg)`}}><Person x={0} y={0} scale={.92} shirt="#171717" skin="#b97b59" hero pose={1}/></div>{Array.from({length:24}).map((_,i)=>{const a=Math.PI*2*i/24,d=interpolate(sp,[0,1],[0,120+(i%5)*24]),s=interpolate(sp,[0,.2,1],[0,1,.08],clamp);return <div key={i} style={{position:"absolute",left:708+Math.cos(a)*d,top:1340+Math.sin(a)*d*.48,width:14+(i%4)*7,height:26+(i%5)*9,borderRadius:"50%",background:"rgba(255,255,255,.88)",transform:`scale(${s})`}}/>})}<Card top={88} fontSize={48}>“YO NADO”</Card></AbsoluteFill>};
const Punch=()=>{const f=useCurrentFrame(),bx=interpolate(f,[0,58],[0,810],{...clamp,easing:Easing.inOut(Easing.quad)}),turn=lerp(f,48,72,0,-23),zoom=interpolate(f,[72,103],[1,1.54],{...clamp,easing:Easing.out(Easing.exp)}),panic=lerp(f,65,78,0,1),sx=interpolate(f,[20,72],[-230,360],clamp);return <AbsoluteFill style={{transform:`scale(${zoom})`,transformOrigin:"53% 69%"}}><Ocean drift={58}/><div style={{transform:`translateX(${bx}px) scale(.8)`}}><Boat heroVisible={false}/></div><div style={{position:"absolute",left:465,top:1195,transform:`rotate(${turn}deg)`}}><Person x={0} y={0} scale={.73} shirt="#171717" skin="#b97b59" look={panic*5} panic={panic}/></div><div style={{position:"absolute",left:sx,top:1166,width:185,height:138,background:"#34424b",clipPath:"polygon(0 100%,68% 0,100% 100%)"}}/><Card>EL BRO, 3 SEGUNDOS DESPUÉS:</Card><div style={{position:"absolute",left:0,right:0,bottom:150,textAlign:"center",fontFamily:"Arial",fontWeight:900,fontSize:48,color:"white",opacity:lerp(f,74,84,0,1),textShadow:"0 5px 14px rgba(0,0,0,.85)"}}>“eh… ¿eso venía incluido?”</div></AbsoluteFill>};

const AudioLayer=()=> <AbsoluteFill><Sequence from={0} durationInFrames={330}><Audio src={MUSIC} volume={.34}/></Sequence><Sequence from={28} durationInFrames={12}><Audio src={POP} volume={.55}/></Sequence><Sequence from={169} durationInFrames={23}><Audio src={WHOOSH} volume={.7}/></Sequence><Sequence from={207} durationInFrames={24}><Audio src={SPLASH} volume={.9}/></Sequence><Sequence from={270} durationInFrames={42}><Audio src={STING} volume={.78}/></Sequence></AbsoluteFill>;

export default function Video(){return <AbsoluteFill style={{background:"#46b0cf",overflow:"hidden"}}><Sequence from={0} durationInFrames={82}><Intro/></Sequence><Sequence from={82} durationInFrames={78}><Hero/></Sequence><Sequence from={160} durationInFrames={72}><Jump/></Sequence><Sequence from={232} durationInFrames={98}><Punch/></Sequence><AudioLayer/></AbsoluteFill>}
