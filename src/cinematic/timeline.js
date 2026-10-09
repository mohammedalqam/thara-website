import { CatmullRomCurve3, Vector3, MathUtils } from 'three';

export const clamp = (v, a=0, b=1) => MathUtils.clamp(v, a, b);
export const smooth = (a,b,v) => { const t=clamp((v-a)/(b-a)); return t*t*(3-2*t); };
export const shots = [
  {p:0, pos:[10.5,4.8,19.5], look:[0,1.7,4]},
  {p:.12, pos:[7.7,3.4,15.6], look:[0,1.8,4.6]},
  {p:.28, pos:[.9,1.8,9.3], look:[-1.15,2.0,5.12]},
  {p:.36, pos:[.12,1.72,7.3], look:[-1.18,1.97,5.1]},
  {p:.42, pos:[.10,1.72,6.55], look:[0,1.65,1.7]},
  {p:.56, pos:[.12,1.72,3.6], look:[-.15,1.6,-3.5]},
  {p:.68, pos:[-.25,1.72,.65], look:[-3.45,1.2,-3.4]},
  {p:.80, pos:[.1,1.72,.65], look:[-3,1.3,-6.5]},
  {p:.88, pos:[.2,1.72,.2], look:[.3,1.25,-10]},
  {p:1, pos:[.4,1.72,-2.3], look:[3.55,2.35,-5.36]}
];
const path = new CatmullRomCurve3(shots.map(q=>new Vector3(...q.pos)),false,'catmullrom',.30);
const gaze = new CatmullRomCurve3(shots.map(q=>new Vector3(...q.look)),false,'catmullrom',.25);
const intervals=shots.slice(1).map((q,i)=>q.p-shots[i].p);
const rates=intervals.map(h=>1/((shots.length-1)*h));
const tangents=shots.map((q,i)=>{
  if(i===0||i===shots.length-1)return 0;
  const a=intervals[i-1],b=intervals[i],w1=2*b+a,w2=b+2*a;
  return (w1+w2)/(w1/rates[i-1]+w2/rates[i]);
});

function pathParameter(p,i){
  const h=intervals[i],t=clamp((p-shots[i].p)/h),t2=t*t,t3=t2*t;
  const a=i/(shots.length-1),b=(i+1)/(shots.length-1);
  return clamp((2*t3-3*t2+1)*a+(t3-2*t2+t)*h*tangents[i]+(-2*t3+3*t2)*b+(t3-t2)*h*tangents[i+1]);
}

export function villaPose(progress, aspect=1.5) {
  const p=clamp(progress);
  let i=shots.findIndex((q,j)=>j<shots.length-1&&p<=shots[j+1].p);
  if(i<0)i=shots.length-2;
  const u=pathParameter(p,i);
  const position=path.getPoint(u),look=gaze.getPoint(u);
  if(aspect<.8 && p<.28) {
    const weight=1-smooth(.12,.28,p);
    position.lerp(new Vector3(3.4,3.3,19),weight);
    look.lerp(new Vector3(0,.35,5.2),weight);
  }
  const interior=8*smooth(.48,.68,p)*(1-smooth(.94,1,p));
  return {position,look,fov:aspect<.8?64:aspect<1.2?56:48+interior,door:smooth(.30,.425,p)*Math.PI*.54};
}

// Screen-space lanes are layout reservations, not a physics simulation.
// The five A/H/etc nodes keep individual transforms, also on reverse scrolling.
export function letterPose(index,homeX,width,height,progress,entryEnd=.025,assemblyStart=.975) {
  const p=clamp(progress),phone=width<760;
  const stagger=index*.03*entryEnd;
  const split=smooth(stagger,entryEnd,p)*(1-smooth(assemblyStart+index*.012*(1-assemblyStart),1,p));
  const disperse=smooth(entryEnd,entryEnd*1.6,p)*(1-smooth(assemblyStart-(1-assemblyStart)*.6,assemblyStart,p));
  const bandScale=Math.min(width*.072,phone?22:65);
  const travelScale=phone?14:width<1200?20:28;
  const scale=bandScale+(travelScale-bandScale)*split;
  const lane=phone?24:(index%2===0?38:width-38);
  const wave=Math.sin(p*Math.PI*4+index*.9)* (phone?2:6);
  const assembledX=width/2+homeX*bandScale;
  const x=assembledX+(lane+wave-assembledX)*split;
  const offsets=[-.25,-.11,.015,.14,.27];
  const y=height/2+(offsets[index]*height+Math.sin(p*7+index)*12)*disperse;
  return {
    x,y,z:(Math.sin(p*9+index)*20+index*2)*split,scale,
    rx:-.07*(1-split)+Math.sin(p*7+index)*.17*split,
    ry:-.20*(1-split)+(Math.sin(p*8+index*.7)*.32+.18)*split,
    rz:Math.sin(p*6+index*.8)*.11*split,
    split,disperse
  };
}

export function chapterProgress(scroll,top,length,viewport) {
  return clamp((scroll-top)/Math.max(1,length-viewport));
}
