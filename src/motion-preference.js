export function motionPreference() {
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  return {
    get matches() { return media.matches || document.documentElement.dataset.motion === 'reduced'; },
    addEventListener(type, listener, options) {
      media.addEventListener(type,listener,options);
      document.addEventListener('thara:motionchange',listener,options);
    }
  };
}
