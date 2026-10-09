/* Homepage only. The photograph, original text and links paint before Three.js. */
(() => {
  const root=document.querySelector('.thara-home-v4');if(!root)return;
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const events=new AbortController();let loading=false,closed=false,anchorFrame=0;
  const heroObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>root.classList.toggle('hero-in-view',entries[0].isIntersecting)):null;
  heroObserver?.observe(root.querySelector('[data-villa-chapter]'));
  function alignFragment(){
    if(closed||!location.hash)return;
    cancelAnimationFrame(anchorFrame);
    anchorFrame=requestAnimationFrame(()=>{
      anchorFrame=0;if(closed)return;
      let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
      const target=document.getElementById(id);if(!target)return;
      target.scrollIntoView({block:'start',behavior:'instant'});
      root.dataset.anchorTarget=id;root.dataset.anchorTop=String(Math.round(target.getBoundingClientRect().top));
    });
  }
  function restorePage(){
    if(closed)return;
    if(performance.getEntriesByType?.('navigation')[0]?.type==='reload'){
      try{
        const saved=JSON.parse(sessionStorage.getItem('thara-page-resume'));
        if(saved?.path===location.pathname&&saved.hash===location.hash&&saved.width===innerWidth&&Number.isFinite(saved.y)){
          cancelAnimationFrame(anchorFrame);
          anchorFrame=requestAnimationFrame(()=>{anchorFrame=0;if(!closed){scrollTo({top:Math.max(0,saved.y),behavior:'instant'});root.dataset.scrollRestored='true';}});
          return;
        }
      }catch{}
    }
    alignFragment();
  }
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
  root.addEventListener('click',event=>{
    if(event.defaultPrevented||event.button>0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    if(event.target.closest('a[href^="#"]'))alignFragment();
  },{signal:events.signal});
  addEventListener('load',restorePage,{once:true,signal:events.signal});
  addEventListener('pageshow',e=>{if(!e.persisted)restorePage();},{signal:events.signal});
  addEventListener('pagehide',e=>{
    try{sessionStorage.setItem('thara-page-resume',JSON.stringify({path:location.pathname,hash:location.hash,y:scrollY,width:innerWidth}));}catch{}
    cancelAnimationFrame(anchorFrame);anchorFrame=0;
    if(!e.persisted){closed=true;events.abort();heroObserver?.disconnect();}
  },{signal:events.signal});
  requestAnimationFrame(start);
})();
