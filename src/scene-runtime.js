import { WebGLRenderer, ACESFilmicToneMapping, SRGBColorSpace, PCFSoftShadowMap, PMREMGenerator } from 'three';
import { SVGRenderer } from 'three/addons/renderers/SVGRenderer.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function createSurface(host) {
  const canvas = host.querySelector('canvas');
  let renderer, kind = 'webgl';
  try {
    // Probe first: a disabled GPU is an expected fallback, not a console error.
    const context = canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
    if (context) renderer = new WebGLRenderer({ canvas, context, alpha: true, antialias: true });
  } catch { /* Try the local CPU renderer below. */ }
  if (!renderer) {
    try {
      renderer = new SVGRenderer();
      kind = 'svg';
      renderer.setQuality('high');
      renderer.overdraw = .15;
      renderer.domElement.classList.add('scene-svg');
      renderer.domElement.setAttribute('aria-hidden', 'true');
      host.appendChild(renderer.domElement);
      canvas.style.display = 'none';
    } catch {
      host.dataset.sceneState = 'fallback';
      return null;
    }
  }
  if (kind === 'webgl') {
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.type = PCFSoftShadowMap;
  }
  host.dataset.sceneRenderer = kind;
  function setSize(width, height) {
    if (kind === 'webgl') renderer.setPixelRatio(Math.min(devicePixelRatio || 1, matchMedia('(pointer: coarse)').matches ? 1.25 : 1.5));
    renderer.setSize(width, height, false);
  }
  return { renderer, kind, canvas, setSize };
}

export function addStudioEnvironment(surface, scene, resources) {
  if (surface.kind !== 'webgl') return;
  const room = new RoomEnvironment();
  const generator = new PMREMGenerator(surface.renderer);
  try {
    const target = generator.fromScene(room, .06, .1, 40, { size: 128 });
    scene.environment = target.texture;
    scene.environmentIntensity = .65;
    resources.add(target);
  } finally {
    room.dispose();
    generator.dispose();
  }
}

// Demand-driven scheduling: no continuous RAF when paused, hidden or off screen.
export function createSceneLoop(host, surface, { render, resize, dispose }) {
  let frame = 0, visible = false, lost = false, disposed = false;
  let lastTime = 0, lastRender = 0;
  const fps = surface.kind === 'svg' ? 12 : 30;
  const events = new AbortController();
  function stop() { cancelAnimationFrame(frame); frame = 0; lastTime = lastRender = 0; }
  function request() {
    if (!disposed && !lost && visible && !document.hidden && !frame) frame = requestAnimationFrame(tick);
  }
  function tick(now) {
    frame = 0;
    if (disposed || lost || !visible || document.hidden) return;
    if (lastRender && now - lastRender < 1000 / fps) { request(); return; }
    const delta = lastTime ? Math.min((now - lastTime) / 1000, .25) : 1 / fps;
    lastTime = lastRender = now;
    try {
      const continuing = render(delta);
      host.dataset.sceneState = 'ready';
      if (continuing) request();
    } catch {
      host.dataset.sceneState = 'fallback';
      destroy();
    }
  }
  function measure() {
    if (disposed || lost) return;
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    surface.setSize(width, height);
    resize(width / height);
    request();
  }
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    stop();
    if (visible) request();
  });
  const observer = new ResizeObserver(measure);
  intersection.observe(host);
  observer.observe(host);
  document.addEventListener('visibilitychange', () => { stop(); request(); }, { signal: events.signal });
  surface.canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault(); lost = true; stop(); host.dataset.sceneState = 'fallback';
  }, { signal: events.signal });
  surface.canvas.addEventListener('webglcontextrestored', () => { lost = false; measure(); }, { signal: events.signal });
  window.addEventListener('pagehide', event => { if (event.persisted) stop(); else destroy(); }, { signal: events.signal });
  window.addEventListener('pageshow', event => { if (event.persisted) measure(); }, { signal: events.signal });
  function destroy() {
    if (disposed) return;
    disposed = true; stop(); events.abort(); intersection.disconnect(); observer.disconnect();
    dispose(); surface.renderer.dispose?.();
  }
  measure();
  return { request, destroy, events, isVisible: () => visible };
}
