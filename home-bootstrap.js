/* Homepage only. The photograph, original text and links paint before Three.js. */
(() => {
  const root=document.querySelector('.thara-home-v4');if(!root)return;
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const events=new AbortController();let loading=false,closed=false;
  const heroObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>root.classList.toggle('hero-in-view',entries[0].isIntersecting)):null;
  heroObserver?.observe(root.querySelector('[data-villa-chapter]'));
  function start(){
    const reduced=media.matches||document.documentElement.dataset.motion==='reduced';
    root.classList.toggle('cinematic-reduced',reduced);
    if(reduced||loading)return;loading=true;
    import('./assets/cinematic-home.js?v=4.0').then(module=>closed?null:module.mountHome(root)).catch(()=>{
      if(closed)return;
      root.querySelector('[data-villa-chapter]').dataset.sceneState='fallback';
      root.querySelector('[data-scene-status]').textContent='اكتشف المكان، على مهلك';
    });
  }
  document.addEventListener('thara:motionchange',start,{signal:events.signal});
  media.addEventListener('change',start,{signal:events.signal});
  addEventListener('pagehide',e=>{if(!e.persisted){closed=true;events.abort();heroObserver?.disconnect();}},{signal:events.signal});
  requestAnimationFrame(start);
})();
