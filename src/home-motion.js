import { clamp } from './scene-math.js';

export const portalAngles = [-16, 8, -27];
export function portalScale(width, height) {
  return Math.min(Math.max(1,width) / 650, Math.max(1,height) / 550, 1.15);
}
export function portalPose(angleIndex, pointerX = 0, pointerY = 0, reduced = false) {
  return {
    x: -7 + (reduced ? 0 : clamp(pointerY,-1,1) * 3),
    y: portalAngles[((angleIndex % portalAngles.length) + portalAngles.length) % portalAngles.length] + (reduced ? 0 : clamp(pointerX,-1,1) * 4)
  };
}

// One request at a time; nothing renders while idle, off screen or in a hidden tab.
export function observeMotion(host, draw, preference) {
  const events = new AbortController();
  let visible = false, suspended = false, destroyed = false, frame = 0;
  function stop() { cancelAnimationFrame(frame); frame = 0; }
  function request() {
    if (frame || destroyed || suspended || !visible || document.hidden) return;
    frame = requestAnimationFrame(() => { frame = 0; draw(); });
  }
  function state() {
    const active = visible && !document.hidden && !suspended && !preference.matches;
    host.dataset.motionActive = String(active);
    host.dataset.motionReduced = String(preference.matches);
    if (active || (visible && !document.hidden && !suspended)) request(); else stop();
  }
  const observer = new IntersectionObserver(entries => { visible = entries.some(entry => entry.isIntersecting); state(); });
  observer.observe(host);
  const resize = new ResizeObserver(request); resize.observe(host);
  document.addEventListener('visibilitychange',state,{signal:events.signal});
  preference.addEventListener('change',state,{signal:events.signal});
  window.addEventListener('pagehide',event => {
    suspended = true; state();
    if (!event.persisted) destroy();
  },{signal:events.signal});
  window.addEventListener('pageshow',() => { suspended = false; state(); },{signal:events.signal});
  function destroy() {
    if (destroyed) return;
    destroyed = true; stop(); observer.disconnect(); resize.disconnect(); events.abort();
    host.dataset.motionActive = 'false';
  }
  return {request,events,destroy,isVisible:()=>visible};
}
