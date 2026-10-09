import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createBrandWordmark } from '../brand-geometry.js';
import { createMaps } from './materials.js';
import { clamp, smooth, villaPose, letterPose, chapterProgress } from './timeline.js';

const mounts=new WeakMap();
export async function mountHome(root) {
  if(mounts.has(root))return mounts.get(root);
  const events=new AbortController(),resources=new Set(),textures=new Set();
  const film=root.querySelector('[data-villa-chapter]');
  const beginning=root.querySelector('[data-letter-start]');
  const ending=root.querySelector('[data-letter-end]');
  const layer=document.querySelector('[data-cinematic-layer]');
  const status=film.querySelector('[data-scene-status]');
  const caption=film.querySelector('[data-shot-caption]');
  const copy=film.querySelector('[data-hero-copy]');
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  let renderer,model,door,environment,maps,frame=0,disposed=false,ready=false;
  let width=0,height=0,viewWidth=0,frames=0,lastRender=0,totalRenderMs=0,p=0,mode='none',lastHeight=innerHeight;
  let villaScene,letterScene,camera,letterCamera,wordmark,sun;
  let pageSuspended=false,visible=true;
  const reduced=()=>media.matches||document.documentElement.dataset.motion==='reduced';
  const controller={request,dispose};mounts.set(root,controller);
  function setState(state,reason='') {
    film.dataset.sceneState=state;film.dataset.sceneReason=reason;
    status.textContent=state==='loading'?'نجهّز لك المشهد':state==='ready'?'اسحب لتدخل المكان':'اكتشف المكان، على مهلك';
  }
  function request(){if(!disposed&&!pageSuspended&&!document.hidden&&visible&&!frame)frame=requestAnimationFrame(draw);}
  function documentY(element){const r=element.getBoundingClientRect();return scrollY+r.top+r.height/2;}
  function measure(){
    if(!renderer)return;
    const nextWidth=Math.round(layer.getBoundingClientRect().width),nextHeight=innerHeight;
    const dpr=Math.min(devicePixelRatio||1,innerWidth<760?1.25:1.5);viewWidth=innerWidth;
    if(nextWidth===width&&nextHeight===height&&renderer.getPixelRatio()===dpr)return;
    width=nextWidth;height=nextHeight;
    renderer.setPixelRatio(dpr);renderer.setSize(width,height,false);
    letterCamera.left=-width/2;letterCamera.right=width/2;letterCamera.top=height/2;letterCamera.bottom=-height/2;letterCamera.updateProjectionMatrix();
  }
  function applyMotion() {
    const rect=film.getBoundingClientRect();
    const anchored=rect.bottom<0;const before=rect.height;
    root.classList.toggle('cinematic-ready',ready&&!reduced());
    root.classList.toggle('cinematic-reduced',reduced());
    if(anchored){const after=film.getBoundingClientRect().height;scrollBy({top:after-before,behavior:'instant'});}
    request();
  }
  function draw(){
    frame=0;if(!ready||disposed)return;
    if(viewWidth!==innerWidth||height!==innerHeight)measure();
    const rect=film.getBoundingClientRect();
    const startY=documentY(beginning),endY=documentY(ending);
    p=chapterProgress(scrollY,scrollY+rect.top,rect.height,height);
    film.dataset.progress=p.toFixed(4);
    const villaVisible=rect.bottom>0&&rect.top<height;
    const letterVisible=scrollY+height>=startY-beginning.offsetHeight/2&&scrollY<=endY+ending.offsetHeight/2;
    const now=performance.now();
    layer.hidden=!villaVisible&&!letterVisible;
    if(villaVisible){
      mode='villa';layer.dataset.chapter=mode;layer.style.opacity=String(1-smooth(.965,1,p));
      const pose=villaPose(reduced()?0:p,width/height);
      camera.position.copy(pose.position);camera.lookAt(pose.look);camera.fov=pose.fov;camera.aspect=width/height;
      if(width>=760)camera.setViewOffset(width,height,width*.14*(1-smooth(.08,.28,p)),0,width,height);else camera.clearViewOffset();
      camera.updateProjectionMatrix();
      door.rotation.y=pose.door;film.dataset.door=pose.door.toFixed(4);
      sun.intensity=3.2-(smooth(.42,.68,p)*.5);
      const opacity=reduced()?1:1-smooth(.09,.22,p);
      copy.style.opacity=String(opacity);copy.style.visibility=opacity<.01?'hidden':'visible';
      caption.textContent=p<.12?'01 / حجر، ضوء، ووقت إلك':p<.28?'02 / على عتبة المكان':p<.42?'03 / أهلًا في THARA':p<.68?'04 / من الخارج إلى الداخل':p<.88?'05 / مساحة لتروق':'06 / ثرى. مساحة إلَك.';
      renderer.setClearColor(0xe9e4d6,1);renderer.render(villaScene,camera);
      film.style.setProperty('--scene-out',String(1-smooth(.965,1,p)));
    }else if(letterVisible&&!reduced()){
      mode='letters';layer.dataset.chapter=mode;layer.style.opacity='1';
      const travel=clamp((scrollY+height/2-startY)/Math.max(1,endY-startY));
      const range=Math.max(1,endY-startY);
      const entryEnd=beginning.offsetHeight*.40/range;
      const assemblyStart=1-ending.offsetHeight*.40/range;
      root.dataset.letterProgress=travel.toFixed(4);
      wordmark.letters.forEach((letter,index)=>{
        const pose=letterPose(index,letter.userData.homeX,width,height,travel,entryEnd,assemblyStart);
        const bandY=travel<.5?startY-scrollY:endY-scrollY;
        const y=bandY+(pose.y-bandY)*pose.disperse;
        letter.position.set(pose.x-width/2,height/2-y,pose.z);
        letter.rotation.set(pose.rx,pose.ry,pose.rz);
        letter.scale.setScalar(pose.scale);
      });
      renderer.setClearColor(0,0);renderer.render(letterScene,letterCamera);
    }else{mode='none';layer.hidden=true;return;}
    lastRender=performance.now()-now;totalRenderMs+=lastRender;frames++;
    const r=renderer.info.render;
    root.dataset.renderStats=JSON.stringify({chapter:mode,frames,calls:r.calls,triangles:r.triangles,lastRenderMs:+lastRender.toFixed(2),meanRenderMs:+(totalRenderMs/frames).toFixed(2),geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,dpr:renderer.getPixelRatio()});
    document.dispatchEvent(new CustomEvent('thara:render',{detail:{p,mode,frames}}));
    // No RAF rescheduling: input, layout and lifecycle events are the only clock.
  }
  function dispose() {
    if(disposed)return;disposed=true;cancelAnimationFrame(frame);frame=0;events.abort();resize.disconnect();intersection.disconnect();
    const materials=new Set();
    model?.traverse(o=>{if(o.geometry)resources.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));});
    wordmark?.world.traverse(o=>{if(o.material)materials.add(o.material);});
    resources.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());maps?.textures.forEach(t=>t.dispose());environment?.dispose();renderer?.dispose();
    layer.replaceChildren();mounts.delete(root);
  }
  const resize=new ResizeObserver(()=>{measure();request();});
  const intersection=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);if(visible)request();else{cancelAnimationFrame(frame);frame=0;}},{rootMargin:'100px'});
  resize.observe(root);intersection.observe(root);
  addEventListener('scroll',request,{passive:true,signal:events.signal});
  addEventListener('resize',()=>{
    const rect=film.getBoundingClientRect();
    if(root.classList.contains('cinematic-ready')&&mode==='villa'&&p>0&&p<1&&lastHeight!==innerHeight){scrollTo({top:scrollY+rect.top+p*Math.max(1,rect.height-innerHeight),behavior:'instant'});}
    lastHeight=innerHeight;measure();request();
  },{passive:true,signal:events.signal});
  document.addEventListener('thara:motionchange',applyMotion,{signal:events.signal});
  media.addEventListener('change',applyMotion,{signal:events.signal});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else request();},{signal:events.signal});
  addEventListener('pagehide',event=>{
    try{sessionStorage.setItem('thara-camera-resume',JSON.stringify({path:location.pathname,chapter:mode,p}));}catch{}
    pageSuspended=true;cancelAnimationFrame(frame);frame=0;if(!event.persisted)dispose();
  },{signal:events.signal});
  addEventListener('pageshow',()=>{pageSuspended=false;request();},{signal:events.signal});
  try{
    const params=new URLSearchParams(location.search);
    const canvas=document.createElement('canvas');
    const context=params.get('scene')==='off'?null:canvas.getContext('webgl2',{alpha:true,antialias:innerWidth>=760,powerPreference:'low-power'});
    if(!context){setState('fallback','webgl-unavailable');dispose();return controller;}
    setState('loading');
    renderer=new THREE.WebGLRenderer({canvas,context,alpha:true,antialias:innerWidth>=760});
    renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.94;
    renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    layer.replaceChildren(canvas);canvas.setAttribute('aria-hidden','true');
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();ready=false;setState('fallback','context-lost');root.classList.remove('cinematic-ready');dispose();},{signal:events.signal});
    villaScene=new THREE.Scene();villaScene.background=new THREE.Color(0xe9e4d6);villaScene.fog=new THREE.Fog(0xe9e4d6,40,90);
    letterScene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(48,1,.07,130);letterCamera=new THREE.OrthographicCamera(-1,1,1,-1,.1,2000);letterCamera.position.z=1000;
    const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment();environment=pmrem.fromScene(room,.04);room.dispose();pmrem.dispose();
    villaScene.environment=letterScene.environment=environment.texture;villaScene.environmentIntensity=.5;letterScene.environmentIntensity=1.4;
    villaScene.add(new THREE.HemisphereLight(0xfff2d8,0x8c9482,1.6));
    sun=new THREE.DirectionalLight(0xffe3b6,3.2);sun.position.set(-10,12,9);sun.castShadow=true;sun.shadow.mapSize.set(innerWidth<760?1024:2048,innerWidth<760?1024:2048);
    Object.assign(sun.shadow.camera,{left:-24,right:24,top:23,bottom:-23,near:1,far:55});sun.shadow.bias=-.0002;sun.shadow.normalBias=.025;sun.shadow.radius=3;villaScene.add(sun);
    for(const [intensity,x,y,z,distance] of [[38,0,2.95,2,11],[55,-3.5,3,-2,12],[25,4.5,2.55,-2.2,8]]){const light=new THREE.PointLight(0xffe6c4,intensity,distance,2);light.position.set(x,y,z);villaScene.add(light);}
    const bronze=new THREE.MeshStandardMaterial({color:0xb89a63,metalness:.86,roughness:.24});resources.add(bronze);
    wordmark=createBrandWordmark(bronze,resources);wordmark.letters.forEach((letter,i)=>letter.name=`THARA_${i}_${'THARA'[i]}`);letterScene.add(wordmark.world);
    const key=new THREE.DirectionalLight(0xffefcd,3.5);key.position.set(-250,400,600);letterScene.add(key);letterScene.add(new THREE.HemisphereLight(0xf3efe6,0x173b35,2));
    if(params.get('model')==='fail')throw new Error('review-simulated-model-failure');
    const gltf=await new GLTFLoader().loadAsync('./assets/cinematic/thara-courtyard.glb');
    if(disposed){gltf.scene.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});return controller;}
    model=gltf.scene;door=model.getObjectByName('DoorPivot');if(!door)throw new Error('missing-door-pivot');villaScene.add(model);
    maps=createMaps(renderer);maps.apply(model);
    const logo=await new THREE.TextureLoader().loadAsync('./assets/logo.jpeg');
    if(disposed){logo.dispose();return controller;}
    logo.flipY=false;logo.colorSpace=THREE.SRGBColorSpace;logo.anisotropy=4;textures.add(logo);
    const plaque=model.getObjectByName('OriginalLogo');plaque.material.map=logo;plaque.material.needsUpdate=true;
    ready=true;setState('ready');measure();applyMotion();
    if(performance.getEntriesByType('navigation')[0]?.type==='reload'&&!location.hash){
      try{const saved=JSON.parse(sessionStorage.getItem('thara-camera-resume'));if(saved?.path===location.pathname&&saved.chapter==='villa'&&!reduced()){const r=film.getBoundingClientRect();scrollTo({top:scrollY+r.top+clamp(saved.p)*(r.height-innerHeight),behavior:'instant'});}}catch{}
    }
    request();
  }catch(error){ready=false;setState('fallback',error.message);root.classList.remove('cinematic-ready');dispose();}
  return controller;
}
