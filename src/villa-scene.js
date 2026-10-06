import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Color,
  BoxGeometry, CylinderGeometry, SphereGeometry,
  PlaneGeometry, TorusGeometry, BufferGeometry, Float32BufferAttribute,
  Mesh, MeshStandardMaterial, MeshBasicMaterial, ShaderMaterial, ShadowMaterial,
  AmbientLight, DirectionalLight, HemisphereLight, PointLight,
  ACESFilmicToneMapping, SRGBColorSpace, PCFSoftShadowMap, DoubleSide
} from 'three';
import { SVGRenderer } from 'three/addons/renderers/SVGRenderer.js';

// A small, locally bundled architectural scene. No remote models or textures.
export function mountVillaScene(host) {
  const canvas = host.querySelector('canvas');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointer = matchMedia('(pointer: coarse)');
  const pauseButton = host.querySelector('[data-scene-pause]');
  const themeButtons = [...host.querySelectorAll('[data-scene-theme]')];
  let renderer;
  let rendererKind = 'webgl';
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    // A CPU-projected 3D scene still works when a browser disables its GPU.
    // It starts paused, and uses a lower frame budget if the user enables motion.
    try {
      renderer = new SVGRenderer();
      rendererKind = 'svg';
      renderer.setQuality('high');
      renderer.domElement.classList.add('scene-svg');
      renderer.domElement.setAttribute('aria-hidden', 'true');
      host.appendChild(renderer.domElement);
      canvas.style.display = 'none';
    } catch {
      host.dataset.sceneState = 'fallback';
      return;
    }
  }

  if (rendererKind === 'webgl') {
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarsePointer.matches ? 1.25 : 1.5));
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !coarsePointer.matches;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
  }
  host.dataset.sceneRenderer = rendererKind;

  const scene = new Scene();
  const camera = new PerspectiveCamera(33, 1, 0.1, 90);
  camera.position.set(13, 10, 16);
  camera.lookAt(0, 1, 0);
  const world = new Group();
  scene.add(world);
  const resources = new Set();
  const keep = (resource) => { resources.add(resource); return resource; };
  const material = (color, options = {}) => keep(new MeshStandardMaterial({ color, roughness: .65, metalness: .08, ...options }));
  const stone = material(0xd8cfba);
  const stoneTop = material(0xece5d6, { roughness: .8 });
  const charcoal = material(0x242b2c, { roughness: .45, metalness: .3 });
  const gold = material(0xbfa36a, { roughness: .3, metalness: .6 });
  const timber = material(0x79634b, { roughness: .88 });
  const green = material(0x49604d, { roughness: .9 });
  const glass = material(0x354d51, { roughness: .18, metalness: .6 });
  const glow = material(0xe0b777, { emissive: 0xffb969, emissiveIntensity: .9 });
  const interior = material(0xd4aa70, { emissive: 0xebaf69, emissiveIntensity: .4, roughness: .9 });
  const cushion = material(0xebdfc8, { roughness: .92 });

  function box(w, h, d, x, y, z, mat, parent = world) {
    const mesh = new Mesh(keep(new BoxGeometry(w, h, d)), mat);
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
  box(8.1, .035, 4.72, .4, 2.88, -1.7, gold);
  box(6.0, .13, 3.65, -.10, 3.0, -1.95, stoneTop);
  box(.21, 2.02, 3.4, -3, 4.03, -2, stone);
  box(6.0, 2.02, .22, -.10, 4.03, -3.65, stone);
  box(.21, 2.02, 3.4, 2.80, 4.03, -2, stone);
  box(6.40, .22, 3.92, -.10, 5.16, -2, stoneTop);
  box(6.45, .035, 3.97, -.10, 5.28, -2, gold);

  // Window frames and warm rooms remain visible through the dark glass.
  for (const x of [-2.65, -1.55, -.45, .65, 1.75, 2.5]) {
    box(.045, 2.18, .08, x, 1.50, .52, charcoal);
  }
  for (const x of [-2.4, -.95, .50, 1.95]) {
    box(1.30, 1.69, .07, x, 4.01, -.28, glass);
    box(.035, 1.85, .13, x - .67, 4.01, -.23, gold);
  }
  box(5.8, .065, .12, -.1, 4.93, -.24, gold);
  box(5.8, .07, .12, -.1, 3.05, -.24, gold);
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
  const svgWater = keep(new MeshBasicMaterial({ color: 0x2e6f72, transparent: true, opacity: .96 }));
  const water = new Mesh(keep(new PlaneGeometry(4.6, 2.8)), rendererKind === 'svg' ? svgWater : waterMaterial);
  water.rotation.x = -Math.PI / 2;
  water.position.set(-1.55, .205, 1.96);
  world.add(water);
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
  const ring = new Mesh(keep(new TorusGeometry(8.7, .012, 4, 90)), keep(new MeshBasicMaterial({ color: 0x827251, transparent: true, opacity: .36 })));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -.68;
  scene.add(ring);

  const ambient = new AmbientLight(0xc8dedf, 1.0);
  const sky = new HemisphereLight(0xc4d9e2, 0x5a4930, 1.8);
  const sun = new DirectionalLight(0xffe6be, 3.5);
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

  let themeTarget = 1;
  let themeCurrent = 1;
  let userPaused = reducedMotion.matches || rendererKind === 'svg';
  let pauseAngle = 0;
  let visible = false;
  let lost = false;
  let disposed = false;
  let frame = 0;
  let lastTime = 0;
  let lastRender = 0;
  let movingTime = 0;
  let pointerX = 0, pointerY = 0;
  let turn = 0;
  let scrollTilt = 0;
  const dayGlass = new Color(0x627e80);
  const nightGlass = new Color(0x2a434b);

  function sizeScene() {
    if (disposed || lost) return;
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    camera.aspect = width / height;
    // Keep the whole villa on narrower phones and landscape screens.
    camera.position.set(13, 10, 16).multiplyScalar(camera.aspect < 1.25 ? 1.35 : 1.03);
    camera.lookAt(0, 1.1, 0);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    if (rendererKind === 'webgl') renderer.setPixelRatio(Math.min(devicePixelRatio || 1, coarsePointer.matches ? 1.25 : 1.5));
    requestRender();
  }

  function applyTheme() {
    const n = themeCurrent;
    ambient.intensity = 1.3 - n * .65;
    sky.intensity = 2.4 - n * 1.45;
    sun.intensity = 3.4 - n * 1.5;
    rim.intensity = 1.2 + n * 1.4;
    roomLight.intensity = 2 + n * 16;
    glow.emissiveIntensity = .08 + n * 1.7;
    interior.emissiveIntensity = .05 + n * .70;
    glass.color.copy(dayGlass).lerp(nightGlass, n);
    waterMaterial.uniforms.night.value = n;
    svgWater.color.set(n > .5 ? 0x2e6f72 : 0x42999a);
  }

  function tick(now) {
    frame = 0;
    if (disposed || lost || !visible || document.hidden) return;
    // A maximum of 30 rendered frames per second keeps this decorative scene modest.
    if (now - lastRender < 1000 / (rendererKind === 'svg' ? 12 : 30)) { requestRender(); return; }
    lastRender = now;
    const delta = Math.min((now - lastTime) / 1000 || 0, .05);
    lastTime = now;
    const moving = !userPaused && !reducedMotion.matches;
    if (moving) movingTime += delta;
    themeCurrent += (themeTarget - themeCurrent) * (reducedMotion.matches ? 1 : .09);
    applyTheme();
    const orbit = moving ? Math.sin(movingTime * .18) * .09 : 0;
    const targetRotation = userPaused ? pauseAngle : turn + orbit + (reducedMotion.matches ? 0 : pointerX * .11 + scrollTilt);
    const smoothing = userPaused || reducedMotion.matches ? 1 : .09;
    world.rotation.y += (targetRotation - world.rotation.y) * smoothing;
    world.rotation.x += ((reducedMotion.matches || userPaused ? 0 : pointerY * .025) - world.rotation.x) * smoothing;
    waterMaterial.uniforms.time.value = movingTime;
    renderer.render(scene, camera);
    host.dataset.sceneState = 'ready';
    const settling = Math.abs(themeTarget - themeCurrent) > .002 || Math.abs(targetRotation - world.rotation.y) > .001;
    if (moving || settling) requestRender();
  }

  function requestRender() {
    if (!frame && !disposed && !lost && visible && !document.hidden) frame = requestAnimationFrame(tick);
  }

  function updatePauseButton() {
    pauseButton.setAttribute('aria-pressed', String(userPaused));
    pauseButton.setAttribute('aria-label', userPaused ? 'تشغيل حركة المشهد' : 'إيقاف حركة المشهد');
    pauseButton.textContent = userPaused ? 'تشغيل الحركة' : 'إيقاف الحركة';
  }
  const onPause = () => { pauseAngle = world.rotation.y; userPaused = !userPaused; updatePauseButton(); requestRender(); };
  pauseButton.addEventListener('click', onPause);
  updatePauseButton();
  themeButtons.forEach(button => {
    button.addEventListener('click', () => {
      themeTarget = button.dataset.sceneTheme === 'night' ? 1 : 0;
      host.dataset.sceneTheme = button.dataset.sceneTheme;
      themeButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      requestRender();
    });
  });
  host.querySelector('[data-scene-turn]')?.addEventListener('click', () => {
    turn = turn === 0 ? -.55 : 0;
    if (userPaused) pauseAngle = turn;
    requestRender();
  });

  function onPointer(event) {
    if (event.pointerType !== 'mouse' || coarsePointer.matches || userPaused || reducedMotion.matches) return;
    const rect = host.getBoundingClientRect();
    pointerX = (event.clientX - rect.left) / rect.width - .5;
    pointerY = (event.clientY - rect.top) / rect.height - .5;
    requestRender();
  }
  const resetPointer = () => { pointerX = pointerY = 0; requestRender(); };
  host.addEventListener('pointermove', onPointer, { passive: true });
  host.addEventListener('pointerleave', resetPointer);
  function onScroll() {
    if (!visible || reducedMotion.matches || userPaused) return;
    scrollTilt = Math.min(window.scrollY / Math.max(innerHeight, 1), 1) * -.14;
    requestRender();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  const onVisibility = () => { lastTime = 0; requestRender(); };
  document.addEventListener('visibilitychange', onVisibility);
  const onMotionChange = () => { pauseAngle = world.rotation.y; userPaused = reducedMotion.matches; updatePauseButton(); requestRender(); };
  reducedMotion.addEventListener('change', onMotionChange);
  const onLost = (event) => {
    event.preventDefault();
    lost = true;
    host.dataset.sceneState = 'fallback';
    cancelAnimationFrame(frame);
    frame = 0;
  };
  const onRestored = () => { lost = false; sizeScene(); requestRender(); };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) { lastTime = 0; requestRender(); }
    else { cancelAnimationFrame(frame); frame = 0; }
  }, { threshold: 0 });
  intersection.observe(host);
  const resize = new ResizeObserver(sizeScene);
  resize.observe(host);
  sizeScene();

  function dispose() {
    disposed = true;
    cancelAnimationFrame(frame);
    intersection.disconnect();
    resize.disconnect();
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('visibilitychange', onVisibility);
    host.removeEventListener('pointermove', onPointer);
    host.removeEventListener('pointerleave', resetPointer);
    reducedMotion.removeEventListener('change', onMotionChange);
    canvas.removeEventListener('webglcontextlost', onLost);
    canvas.removeEventListener('webglcontextrestored', onRestored);
    resources.forEach(resource => resource.dispose());
    renderer.dispose?.();
  }
  // BFCache suspends the page and keeps the scene; actual navigation frees GPU memory.
  window.addEventListener('pagehide', event => { if (!event.persisted) dispose(); });
}
