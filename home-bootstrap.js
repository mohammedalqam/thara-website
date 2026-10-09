/* Homepage only. The photograph, original text and links paint before Three.js. */
(() => {
  const root=document.querySelector('.thara-home-v4');if(!root)return;
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const events=new AbortController();let loading=false;
  function start(){
    const reduced=media.matches||document.documentElement.dataset.motion==='reduced';
    root.classList.toggle('cinematic-reduced',reduced);
    if(reduced||loading)return;loading=true;
    import('./assets/cinematic-home.js?v=4.0').then(module=>module.mountHome(root)).catch(()=>{
      root.querySelector('[data-villa-chapter]').dataset.sceneState='fallback';
      root.querySelector('[data-scene-status]').textContent='اكتشف المكان، على مهلك';
    });
  }
  document.addEventListener('thara:motionchange',start,{signal:events.signal});
  media.addEventListener('change',start,{signal:events.signal});
  addEventListener('pagehide',e=>{if(!e.persisted)events.abort();},{signal:events.signal});
  requestAnimationFrame(start);
})();
