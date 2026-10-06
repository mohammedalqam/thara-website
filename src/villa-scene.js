import {
  Scene, OrthographicCamera, Group, Color, Box3,
  BoxGeometry, CylinderGeometry, SphereGeometry,
  PlaneGeometry, TorusGeometry, BufferGeometry, Float32BufferAttribute,
  Mesh, MeshStandardMaterial, MeshBasicMaterial, ShaderMaterial, ShadowMaterial,
  AmbientLight, DirectionalLight, HemisphereLight, PointLight, DoubleSide,
  LineSegments, LineBasicMaterial
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { createSurface, createSceneLoop, addStudioEnvironment } from './scene-runtime.js';
import { damp, clamp } from './scene-math.js';
import { fitVillaCamera } from './scene-camera.js';
import { motionPreference } from './motion-preference.js';
export { mountBrandScene } from './brand-scene.js';

// A small, locally bundled architectural scene. No remote models or textures.
export function mountVillaScene(host) {
  const surface = createSurface(host);
  if (!surface) return;
  const reducedMotion = motionPreference();
  const coarsePointer = matchMedia('(pointer: coarse)');
  const pauseButton = host.querySelector('[data-scene-pause]');
  const themeButtons = [...host.querySelectorAll('[data-scene-theme]')];
  const renderer = surface.renderer, rendererKind = surface.kind;
  if (rendererKind === 'webgl') renderer.shadowMap.enabled = !coarsePointer.matches;

  const scene = new Scene();
  const camera = new OrthographicCamera(-9,9,7,-7,.1,100);
  camera.position.set(13, 10, 16);
  camera.lookAt(0, 1.8, 0);
  camera.updateMatrixWorld();
  const world = new Group();
  scene.add(world);
  const resources = new Set();
  const keep = (resource) => { resources.add(resource); return resource; };
  const material = (color, options = {}) => keep(new MeshStandardMaterial({ color, roughness: .65, metalness: .08, ...options }));
  const stone = material(0xc5c2b6, { metalness: 0, roughness: .88 });
  const stoneTop = material(0xe0ddd2, { metalness: 0, roughness: .8 });
  const charcoal = material(0x242b2c, { roughness: .45, metalness: .3 });
  const gold = material(0xb09b72, { roughness: .35, metalness: .55 });
  const timber = material(0x81664c, { roughness: .9, metalness: 0 });
  const green = material(0x3e5848, { roughness: .96, metalness: 0 });
  const glass = material(0x354f53, { roughness: .16, metalness: .25 });
  const clearGlass = material(0x698080, { roughness: .15, transparent: true, opacity: rendererKind === 'svg' ? .16 : .25, depthWrite: false });
  const glow = material(0xbda87d, { emissive: 0xffd39a, emissiveIntensity: .5 });
  const interior = material(0xc2b294, { emissive: 0xe5ba7c, emissiveIntensity: .2, roughness: .9 });
  const cushion = material(0xebdfc8, { roughness: .92 });

  function box(w, h, d, x, y, z, mat, parent = world) {
    const softened = (mat === stoneTop && w > 5 && h > .12) || (mat === cushion && w > 1 && h > .3 && d > .5);
    const mesh = new Mesh(keep(softened ? new RoundedBoxGeometry(w,h,d,1,.028) : new BoxGeometry(w, h, d)), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function cylinder(rt, rb, height, x, y, z, mat, segments = 14, parent = world) {
    const mesh = new Mesh(keep(new CylinderGeometry(rt, rb, height, segments)), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  // Floating plinth, garden and terrace.
  box(12, .34, 10, 0, -.15, 0, charcoal);
  box(11.94, .055, 9.94, 0, .05, 0, stone);
  box(12.04, .028, 10.04, 0, -.04, 0, gold);
  box(11.4, .07, 1.4, 0, .10, -4.15, green);
  box(1.25, .07, 6, -5.13, .10, -.1, green);
  for (let i = 0; i < 10; i++) {
    box(.46, .045, .65, -3.3 + i * .70, .15, 3.95, stoneTop);
  }
  for (let i = 0; i < 17; i++) {
    box(.39, .05, 3, 1.35 + i * .23, .12, 1.9, timber);
  }

  // Two storeys with deep glazing, an open living room and a cantilever.
  box(7.8, .20, 4.5, .4, .24, -1.7, stoneTop);
  box(7.6, 2.35, .22, .4, 1.45, -3.85, stone);
  box(.22, 2.35, 4.3, -3.35, 1.45, -1.7, stone);
  box(1.50, 2.35, 4.25, 3.45, 1.45, -1.7, stone);
  box(7.9, .23, 4.62, .4, 2.75, -1.7, charcoal);
  box(8.1, .035, 4.72, .4, 2.88, -1.7, stoneTop);
  box(7.9, .018, .025, .4, 2.78, .625, glow);
  box(6.0, .13, 3.65, -.10, 3.0, -1.95, stoneTop);
  box(.21, 2.02, 3.4, -3, 4.03, -2, stone);
  box(6.0, 2.02, .22, -.10, 4.03, -3.65, stone);
  box(.21, 2.02, 3.4, 2.80, 4.03, -2, stone);
  box(6.40, .22, 3.92, -.10, 5.16, -2, stoneTop);
  box(6.45, .035, 3.97, -.10, 5.28, -2, stoneTop);
  box(6.1, .02, .03, -.1, 5.04, -.045, glow);

  // Window frames and warm rooms remain visible through the dark glass.
  for (const x of [-2.65, -1.55, -.45, .65, 1.75, 2.5]) {
    box(.045, 2.18, .08, x, 1.50, .52, charcoal);
  }
  for (const x of [-2.10,-1.0,.10,1.20,2.13]) {
    box(1.02,2.08,.018,x,1.50,.48,clearGlass);
  }
  box(5.4,.06,.09,-.08,.41,.53,charcoal);
  box(5.4,.06,.09,-.08,2.59,.53,charcoal);
  for (const x of [-2.4, -.95, .50, 1.95]) {
    box(1.30, 1.69, .07, x, 4.01, -.28, glass);
    box(.04, 1.85, .13, x - .67, 4.01, -.23, charcoal);
  }
  box(5.8, .065, .12, -.1, 4.93, -.24, charcoal);
  box(5.8, .07, .12, -.1, 3.05, -.24, charcoal);
  for (let i=0;i<7;i++) box(.08,1.73,.13,-2.69+i*.10,4.02,-.17,timber);
  for (const x of [-2.8, 2.5]) box(.14, 2.35, .14, x, 1.5, .50, charcoal);
  box(1.55, 1.60, .065, 2.70, 1.45, -1.0, glass);
  box(5.2, 1.85, .065, -.25, 1.40, -3.71, interior);
  for (let i = 0; i < 13; i++) {
    box(.10, 2.30, .10, 2.83 + i * .12, 1.49, .58, timber);
  }
  // Interior seating and dining furniture.
  box(2.8, .42, .8, -.60, .56, -1.6, cushion);
  box(2.8, .49, .16, -.60, .97, -1.9, cushion);
  box(.16, .37, .88, -1.96, .83, -1.6, cushion);
  box(.16, .37, .88, .76, .83, -1.6, cushion);
  box(1.4, .09, .65, -.6, .56, -.62, charcoal);
  box(.09, .30, .09, -1.15, .40, -.62, gold);
  box(.09, .30, .09, -.05, .40, -.62, gold);
  cylinder(.51, .51, .09, 1.62, .78, -2.05, timber);
  cylinder(.07, .12, .55, 1.62, .48, -2.05, charcoal);

  // Terrace pergola, narrow beams and brass lighting.
  const pergola = new Group();
  world.add(pergola);
  for (const x of [2.7, 4.7]) {
    for (const z of [.8, 2.8]) box(.075, 2.5, .075, x, 1.40, z, charcoal, pergola);
  }
  for (let i = 0; i < 12; i++) {
    box(.09, .13, 2.4, 2.53 + i * .21, 2.67, 1.80, charcoal, pergola);
  }
  box(2.55, .045, .08, 3.68, 2.60, 2.96, glow);
  box(1.6, .38, .57, 3.75, .40, 1.8, cushion);
  box(1.6, .34, .13, 3.75, .76, 1.55, cushion);
  cylinder(.39, .39, .065, 3.75, .51, 2.55, gold);
  cylinder(.045, .08, .37, 3.75, .30, 2.55, charcoal);

  // Recessed pool with restrained animated caustics.
  box(4.9, .11, 3.1, -1.55, .14, 1.96, charcoal);
  const waterMaterial = keep(new ShaderMaterial({
    transparent: true,
    uniforms: { time: { value: 0 }, night: { value: 1 } },
    vertexShader: `varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
    fragmentShader: `varying vec2 vUv; uniform float time; uniform float night;
      void main(){
        float a=sin(vUv.x*65.0+sin(vUv.y*42.0+time*.5)*1.6+time*.3);
        float b=sin(vUv.y*78.0+sin(vUv.x*37.0-time*.4)*1.4);
        float light=pow(max(a*b,0.0),5.0);
        vec3 base=mix(vec3(.10,.34,.36),vec3(.025,.16,.19),night);
        gl_FragColor=vec4(base+vec3(.12,.29,.27)*light,.96);
      }`,
    side: DoubleSide
  }));
  const svgWater = keep(new MeshBasicMaterial({ color: 0x245d64 }));
  const water = new Mesh(keep(new PlaneGeometry(4.6, 2.8)), rendererKind === 'svg' ? svgWater : waterMaterial);
  water.rotation.x = -Math.PI / 2;
  water.position.set(-1.55, .205, 1.96);
  world.add(water);
  if (rendererKind === 'svg') {
    const positions = [];
    for (let i=0;i<9;i++) {
      const x=-3.65+i*.51;
      positions.push(x,.211,.66,x+.15,.211,1.37,x+.15,.211,1.37,x-.06,.211,2.1,x-.06,.211,2.1,x+.12,.211,3.22);
    }
    const geometry = keep(new BufferGeometry());
    geometry.setAttribute('position',new Float32BufferAttribute(positions,3));
    world.add(new LineSegments(geometry,keep(new LineBasicMaterial({color:0x70a7a7,transparent:true,opacity:.12}))));
  }
  box(4.95, .12, .16, -1.55, .19, .39, stoneTop);
  box(4.95, .12, .16, -1.55, .19, 3.53, stoneTop);
  box(.16, .12, 3.0, -4.06, .19, 1.96, stoneTop);
  box(.16, .12, 3.0, .96, .19, 1.96, stoneTop);
  box(4.60, .025, .025, -1.55, .23, .52, glow);

  // Steps and sun loungers.
  for (let i = 0; i < 3; i++) box(1.7, .09, .35, .30, .19 + i * .085, .51 - i * .25, stoneTop);
  for (const x of [-3.1, -1.9]) {
    const lounger = box(.70, .09, 1.40, x, .36, 4.1, cushion);
    lounger.rotation.y = -.15;
    const back = box(.70, .085, .49, x, .54, 3.7, cushion);
    back.rotation.x = -.5;
    box(.08, .22, 1.10, x - .25, .23, 4.1, timber);
    box(.08, .22, 1.10, x + .25, .23, 4.1, timber);
  }

  // Stylised palms made from curved leaf meshes instead of image sprites.
  function palm(x, z, height, lean) {
    const plant = new Group();
    plant.position.set(x, .16, z);
    plant.rotation.z = lean;
    world.add(plant);
    cylinder(.07, .14, height, 0, height / 2, 0, timber, 10, plant);
    for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 4;
      const vertices = [];
      for (let j = 0; j < 8; j++) {
        const t1 = j / 8, t2 = (j + 1) / 8;
        const edge = (t, side) => {
          const r = t * 1.40;
          const w = Math.sin(t * Math.PI) * .19 * side;
          return [Math.cos(angle) * r + Math.sin(angle) * w,
            height + Math.sin(t * Math.PI) * .38 - t * .50,
            Math.sin(angle) * r - Math.cos(angle) * w];
        };
        const a = edge(t1, -1), b = edge(t1, 1), c = edge(t2, -1), d = edge(t2, 1);
        vertices.push(...a, ...c, ...b, ...b, ...c, ...d);
      }
      const geometry = keep(new BufferGeometry());
      geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
      geometry.computeVertexNormals();
      const leafMat = material(i % 2 ? 0x56775e : 0x355c47, { side: DoubleSide });
      const leaf = new Mesh(geometry, leafMat);
      leaf.castShadow = true;
      plant.add(leaf);
    }
  }
  palm(-4.8, -3.5, 3.3, -.08);
  palm(4.9, -3.9, 3.9, .09);
  for (const [x, z] of [[-4.9,-1.7], [-4.9,.4], [5,3.7]]) {
    cylinder(.35, .27, .44, x, .37, z, charcoal);
    const shrub = new Mesh(keep(new SphereGeometry(.44, 10, 8)), green);
    shrub.position.set(x, .81, z);
    shrub.scale.y = .9;
    world.add(shrub);
  }

  // Shadow catcher and subtle architectural orbit line.
  const floor = new Mesh(keep(new PlaneGeometry(80, 80)), keep(new ShadowMaterial({ opacity: .30 })));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -.7;
  floor.receiveShadow = true;
  if (rendererKind === 'webgl') scene.add(floor);
  const ring = new Mesh(keep(new TorusGeometry(7.6, .009, 3, 64)), keep(new MeshBasicMaterial({ color: 0x827251, transparent: true, opacity: .20 })));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -.68;
  scene.add(ring);

  const ambient = new AmbientLight(0xc8dedf, 1.0);
  const sky = new HemisphereLight(0xc4d9e2, 0x5a4930, 1.8);
  const sun = new DirectionalLight(0xfff3dd, 3.5);
  sun.position.set(-4, 10, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -10;
  sun.shadow.camera.right = 10;
  sun.shadow.camera.top = 10;
  sun.shadow.camera.bottom = -10;
  sun.shadow.normalBias = .035;
  const rim = new DirectionalLight(0xb2d9e3, 2.5);
  rim.position.set(6, 4, -5);
  const roomLight = new PointLight(0xffbc73, 18, 8, 2);
  roomLight.position.set(0, 1.8, -.8);
  scene.add(ambient, sky, sun, rim, roomLight);

  addStudioEnvironment(surface,scene,resources);
  const bounds = new Box3().setFromObject(world);
  let themeTarget = host.dataset.sceneTheme === 'day' ? 0 : 1;
  let themeCurrent = themeTarget;
  let userPaused = reducedMotion.matches || rendererKind === 'svg';
  let pauseAngle = 0;
  let movingTime = 0;
  let pointerX = 0, pointerY = 0;
  let turn = 0;
  let scrollTilt = 0;
  const dayGlass = new Color(0x5c7b80), nightGlass = new Color(0x273d43);
  const dayWater = new Color(0x397b82), nightWater = new Color(0x245d64);

  function applyTheme() {
    const n = themeCurrent;
    ambient.intensity = .85 - n * .3;
    sky.intensity = 1.5 - n * .7;
    sun.intensity = 2.8 - n * 1.4;
    rim.intensity = 1.0 + n * .3;
    roomLight.intensity = 1 + n * 7;
    // SVG uses a simpler lighting model without physical light attenuation.
    if (rendererKind === 'svg') {
      ambient.intensity = .48 - n * .12;
      sun.intensity = .66 - n * .18;
      rim.intensity = .17 + n * .06;
      roomLight.intensity = .025 + n * .075;
    }
    glow.emissiveIntensity = .04 + n * (rendererKind === 'svg' ? .4 : 1.1);
    interior.emissiveIntensity = .02 + n * .22;
    glass.color.copy(dayGlass).lerp(nightGlass, n);
    waterMaterial.uniforms.night.value = n;
    svgWater.color.copy(dayWater).lerp(nightWater,n);
  }
  const loop = createSceneLoop(host,surface,{
    resize(aspect) { fitVillaCamera(camera,bounds,aspect); },
    render(delta) {
      const moving = !userPaused && !reducedMotion.matches;
      if (moving) movingTime += delta;
      themeCurrent = reducedMotion.matches ? themeTarget : damp(themeCurrent,themeTarget,7,delta);
      if (Math.abs(themeTarget-themeCurrent)<.001) themeCurrent=themeTarget;
      applyTheme();
      const orbit = moving ? Math.sin(movingTime*.18)*.07 : 0;
      const targetY = userPaused ? pauseAngle : turn + (reducedMotion.matches ? 0 : orbit + pointerX*.1 + scrollTilt);
      const targetX = moving ? pointerY*.025 : 0;
      world.rotation.y = reducedMotion.matches ? targetY : damp(world.rotation.y,targetY,9,delta);
      world.rotation.x = reducedMotion.matches ? 0 : damp(world.rotation.x,targetX,9,delta);
      waterMaterial.uniforms.time.value = movingTime;
      renderer.render(scene,camera);
      return moving || Math.abs(themeTarget-themeCurrent)>.001 || Math.abs(targetY-world.rotation.y)>.0005 || Math.abs(targetX-world.rotation.x)>.0005;
    },
    dispose() { resources.forEach(resource=>resource.dispose()); }
  });
  const events = { signal: loop.events.signal };

  function updatePauseButton() {
    const paused = userPaused || reducedMotion.matches;
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.setAttribute('aria-label', paused ? 'تشغيل حركة المشهد' : 'إيقاف حركة المشهد');
    pauseButton.textContent = paused ? 'تشغيل الحركة' : 'إيقاف الحركة';
    pauseButton.disabled = reducedMotion.matches;
  }
  const onPause = () => { pauseAngle = world.rotation.y; userPaused = !userPaused; updatePauseButton(); loop.request(); };
  pauseButton.addEventListener('click', onPause,events);
  updatePauseButton();
  themeButtons.forEach(button => {
    button.addEventListener('click', () => {
      themeTarget = button.dataset.sceneTheme === 'night' ? 1 : 0;
      host.dataset.sceneTheme = button.dataset.sceneTheme;
      themeButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      loop.request();
    },events);
  });
  host.querySelector('[data-scene-turn]')?.addEventListener('click', () => {
    turn = turn === 0 ? -.55 : 0;
    if (userPaused) pauseAngle = turn;
    loop.request();
  },events);

  function onPointer(event) {
    if (event.pointerType !== 'mouse' || coarsePointer.matches || userPaused || reducedMotion.matches) return;
    const rect = host.getBoundingClientRect();
    pointerX = clamp((event.clientX - rect.left) / rect.width) - .5;
    pointerY = clamp((event.clientY - rect.top) / rect.height) - .5;
    loop.request();
  }
  const resetPointer = () => { pointerX = pointerY = 0; loop.request(); };
  host.addEventListener('pointermove', onPointer, { passive: true,...events });
  host.addEventListener('pointerleave', resetPointer,events);
  function onScroll() {
    if (!loop.isVisible() || reducedMotion.matches || userPaused) return;
    scrollTilt = clamp(-host.getBoundingClientRect().top / Math.max(innerHeight,1)) * -.09;
    loop.request();
  }
  window.addEventListener('scroll', onScroll, { passive: true,...events });
  reducedMotion.addEventListener('change',() => { pauseAngle = world.rotation.y; resetPointer(); updatePauseButton(); },events);
}
