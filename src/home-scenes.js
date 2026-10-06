import { portalScale, portalPose, brandPose, observeMotion } from './home-motion.js';
import { storyProgress } from './scene-math.js';
import { motionPreference } from './motion-preference.js';

export function mountPortalScene(host) {
  if (host.dataset.sceneState === 'ready') return;
  const camera = host.querySelector('[data-portal-camera]');
  const world = host.querySelector('[data-portal-world]');
  const orbit = host.querySelector('[data-portal-orbit]');
  const pause = host.querySelector('[data-scene-pause]');
  const turn = host.querySelector('[data-scene-turn]');
  const themes = [...host.querySelectorAll('button[data-scene-theme]')];
  const preference = motionPreference();
  let angle = 0, pointerX = 0, pointerY = 0, paused = false;
  function draw() {
    const rect = camera.getBoundingClientRect();
    world.style.setProperty('--portal-scale',portalScale(rect.width,rect.height).toFixed(4));
    const pose = portalPose(angle,pointerX,pointerY,preference.matches);
    orbit.style.setProperty('--portal-x',`${pose.x.toFixed(2)}deg`);
    orbit.style.setProperty('--portal-y',`${pose.y.toFixed(2)}deg`);
    pause.disabled = preference.matches;
    pause.setAttribute('aria-pressed',String(paused || preference.matches));
    pause.setAttribute('aria-label',preference.matches ? 'حركة المشهد مخففة' : paused ? 'تشغيل حركة المشهد' : 'إيقاف حركة المشهد');
    pause.textContent = preference.matches ? 'حركة مخففة' : paused ? 'تشغيل الحركة' : 'إيقاف الحركة';
  }
  const lifecycle = observeMotion(host,draw,preference);
  const options = {signal:lifecycle.events.signal};
  pause.addEventListener('click',() => {
    paused = !paused; host.dataset.scenePaused = String(paused); lifecycle.request();
  },options);
  turn.addEventListener('click',() => { angle++; pointerX = pointerY = 0; lifecycle.request(); },options);
  themes.forEach(button => button.addEventListener('click',() => {
    host.dataset.sceneTheme = button.dataset.sceneTheme;
    themes.forEach(theme => theme.setAttribute('aria-pressed',String(theme === button)));
  },options));
  host.addEventListener('pointermove',event => {
    if (preference.matches || paused || event.pointerType !== 'mouse') return;
    const rect = host.getBoundingClientRect();
    pointerX = (event.clientX - rect.left) / rect.width * 2 - 1;
    pointerY = (event.clientY - rect.top) / rect.height * 2 - 1;
    lifecycle.request();
  },{...options,passive:true});
  host.addEventListener('pointerleave',() => { pointerX = pointerY = 0; lifecycle.request(); },options);
  host.dataset.sceneState = 'ready';
  host.dataset.sceneRenderer = 'css3d';
  draw();
}

export function mountScrollSculpture(host) {
  if (host.dataset.sceneState === 'ready') return;
  const story = host.closest('[data-brand-story]');
  const stage = story.querySelector('.brand-story-stage');
  const orbit = host.querySelector('[data-brand-orbit]');
  const letters = host.querySelector('[data-brand-letters]');
  const preference = motionPreference();
  // Closely spaced faces form the actual thickness; the front remains selectable in no-script mode.
  const edgeCount = 22;
  for (let index = edgeCount; index > 0; index--) {
    const edge = document.createElement('span');
    edge.className = 'brand-metal-edge'; edge.textContent = 'THARA';
    edge.style.setProperty('--edge',String(index));
    letters.prepend(edge);
  }
  function draw() {
    const rect = story.getBoundingClientRect();
    const inset = parseFloat(getComputedStyle(stage).top) || 0;
    const progress = storyProgress(rect.top,rect.height,stage.getBoundingClientRect().height,inset);
    const pose = brandPose(progress,preference.matches);
    orbit.style.transform = `translateY(${pose.lift.toFixed(2)}px) rotateX(${pose.x.toFixed(2)}deg) rotateY(${pose.y.toFixed(2)}deg) rotateZ(${pose.z.toFixed(2)}deg) scale(${pose.scale.toFixed(4)})`;
    story.style.setProperty('--story-progress',progress.toFixed(4));
    story.dataset.storyStep = progress < .33 ? 'enter' : progress > .67 ? 'leave' : 'stay';
  }
  const lifecycle = observeMotion(host,draw,preference);
  addEventListener('scroll',() => {
    if (!preference.matches && lifecycle.isVisible()) lifecycle.request();
  },{passive:true,signal:lifecycle.events.signal});
  host.dataset.sceneState = 'ready'; host.dataset.sceneRenderer = 'css3d';
  draw();
}
