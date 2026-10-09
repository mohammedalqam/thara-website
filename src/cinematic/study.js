import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { villaPose,smooth } from './timeline.js';

const stage=document.querySelector('[data-cinematic-study]');
const status=document.querySelector('[data-status]');
const slider=document.querySelector('[data-progress]');
const value=document.querySelector('[data-value]');
const shotButtons=[...document.querySelectorAll('[data-shot]')];
let renderer,scene,camera,model,door,environment,frame=0,progress=0,disposed=false;
const events=new AbortController(),textures=new Set();
const clamp=THREE.MathUtils.clamp;
function texture(kind){
  const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');
  const data=ctx.createImageData(512,512);let seed=1735;
  const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  for(let y=0;y<512;y++)for(let x=0;x<512;x++){
    let v=0;
    if(kind==='stone')v=204+10*Math.sin(y*.13+Math.sin(x*.009)*4)+5*Math.sin(y*.58)+rand()*17;
    if(kind==='wood')v=134+22*Math.sin(x*.14+Math.sin(y*.015)*.8)+12*Math.sin(x*.75+Math.sin(y*.01))+rand()*14;
    if(kind==='fabric')v=204+(x%3===0?-12:0)+(y%3===0?-12:0)+rand()*16;
    if(kind==='water')v=134+44*Math.sin(x*.08+Math.cos(y*.11)*2)*Math.sin(y*.075+Math.cos(x*.093)*2);
    const off=(y*512+x)*4;data.data[off]=data.data[off+1]=data.data[off+2]=v;data.data[off+3]=255;
  }
  ctx.putImageData(data,0,0);const tex=new THREE.CanvasTexture(c);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.colorSpace=THREE.NoColorSpace;tex.anisotropy=4;textures.add(tex);return tex;
}
function setProgress(p){progress=clamp(p,0,1);slider.value=String(Math.round(progress*100));value.textContent=`${Math.round(progress*100)}%`;request();}
function request(){if(!frame&&!disposed&&!document.hidden)frame=requestAnimationFrame(draw);}
function draw(){
  frame=0;if(!model)return;
  const rect=stage.getBoundingClientRect(),aspect=rect.width/rect.height;
  const a=villaPose(progress,aspect);camera.position.copy(a.position);camera.lookAt(a.look);
  camera.fov=a.fov;
  camera.aspect=aspect;camera.updateProjectionMatrix();
  door.rotation.y=a.door;
  const w=Math.round(rect.width),h=Math.round(rect.height);
  if(renderer.domElement.clientWidth!==w||renderer.domElement.clientHeight!==h)renderer.setSize(w,h);
  renderer.render(scene,camera);
  const r=renderer.info.render;
  document.querySelector('[data-metrics]').textContent=`WebGL2 · ${r.calls} draws · ${r.triangles.toLocaleString()} triangles · ${w}×${h}`;
  stage.dataset.progress=progress.toFixed(3);
  stage.dataset.door=door.rotation.y.toFixed(3);
}
async function start(){
  try{
    const canvas=document.createElement('canvas'),context=canvas.getContext('webgl2');
    if(!context){stage.dataset.state='fallback';status.textContent='WebGL غير متاح في بيئة الفحص؛ هذه الصورة الثابتة لا تثبت جودة الحركة.';return;}
    renderer=new THREE.WebGLRenderer({canvas,context,antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<600?1.25:1.5));
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
    stage.append(renderer.domElement);scene=new THREE.Scene();scene.background=new THREE.Color(0xe9e4d6);scene.fog=new THREE.Fog(0xe9e4d6,35,85);
    camera=new THREE.PerspectiveCamera(48,1,.055,130);
    const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;scene.environmentIntensity=.48;room.dispose();pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xfff2d8,0x9c9a83,1.65));
    const sun=new THREE.DirectionalLight(0xffdfaa,3.6);sun.position.set(-10,12,9);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-24,right:24,top:23,bottom:-23,near:1,far:55});sun.shadow.bias=-.0002;sun.shadow.normalBias=.025;sun.shadow.radius=3;scene.add(sun);
    const fill=new THREE.PointLight(0xffe6bf,35,11,2);fill.position.set(0,2.95,2);scene.add(fill);
    const bounce=new THREE.PointLight(0xffedce,55,12,2);bounce.position.set(-3.5,3,-2);scene.add(bounce);
    const dining=new THREE.PointLight(0xffdeb0,22,8,2);dining.position.set(4.5,2.55,-2.2);scene.add(dining);
    const gltf=await new GLTFLoader().loadAsync('./assets/cinematic/thara-courtyard.glb');model=gltf.scene;scene.add(model);door=model.getObjectByName('DoorPivot');
    const stone=texture('stone'),wood=texture('wood'),fabric=texture('fabric'),water=texture('water');
    model.traverse(o=>{if(!o.isMesh)return;o.castShadow=o.receiveShadow=true;const m=o.material;
      if(['Limestone','Travertine','Lime_plaster'].includes(m.name)){m.bumpMap=stone;m.bumpScale=.017;}
      if(m.name==='Walnut'){m.bumpMap=wood;m.bumpScale=.013;}
      if(m.name.includes('Linen')||m.name.includes('linen')){m.bumpMap=fabric;m.bumpScale=.009;}
      if(m.name==='Water'){m.bumpMap=water;m.bumpScale=.10;o.castShadow=false;}
      if(m.name==='Glazing'){o.castShadow=false;m.depthWrite=false;}
    });
    const logo=await new THREE.TextureLoader().loadAsync('./assets/logo.jpeg');logo.flipY=false;logo.colorSpace=THREE.SRGBColorSpace;logo.anisotropy=8;textures.add(logo);
    const plaque=model.getObjectByName('OriginalLogo');plaque.material.map=logo;plaque.material.needsUpdate=true;
    stage.dataset.state='ready';status.textContent='دراسة معمارية أولية — قيد ضبط الخامات والإخراج';
    document.querySelectorAll('button,input').forEach(n=>n.disabled=false);
    const q=Number(new URLSearchParams(location.search).get('p'));setProgress(Number.isFinite(q)?q:0);
  }catch(error){stage.dataset.state='fallback';status.textContent='تعذّر تشغيل المشهد في هذه البيئة؛ تبقى الدراسة غير معتمدة.';console.error(error);}
}
slider.addEventListener('input',()=>setProgress(Number(slider.value)/100),{signal:events.signal});
shotButtons.forEach(button=>button.addEventListener('click',()=>setProgress(Number(button.dataset.shot)),{signal:events.signal}));
const resize=new ResizeObserver(request);resize.observe(stage);
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else request();},{signal:events.signal});
addEventListener('pagehide',event=>{cancelAnimationFrame(frame);frame=0;if(event.persisted)return;disposed=true;resize.disconnect();events.abort();model?.traverse(o=>{o.geometry?.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});textures.forEach(t=>t.dispose());environment?.dispose();renderer?.dispose();},{signal:events.signal});
addEventListener('pageshow',request,{signal:events.signal});
start();
