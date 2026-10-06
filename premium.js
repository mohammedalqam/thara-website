/* Progressive enhancement: the villa photos, text and contact links work without 3D. */
(() => {
  document.documentElement.classList.add('js-enhanced');
  const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
  try {
    if (localStorage.getItem('thara-motion') === 'reduced') document.documentElement.dataset.motion = 'reduced';
  } catch { /* Storage is optional, including in restricted embedded previews. */ }
  const reduced = { get matches() { return systemMotion.matches || document.documentElement.dataset.motion === 'reduced'; } };
  const motionToggle = document.querySelector('[data-motion-toggle]');
  const progress = document.querySelector('.reading-progress');
  const deck = document.querySelector('.discovery-deck');
  const header = document.getElementById('siteHeader') || document.querySelector('.site-header');
  const menu = document.getElementById('mainNav');
  const menuButton = document.getElementById('menuButton');
  let frame = 0;

  if (!reduced.matches) document.documentElement.classList.add('motion-ready');
  function updateScroll() {
    frame = 0;
    if (progress) {
      const range = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${range > 0 ? Math.min(scrollY / range, 1) : 0})`;
    }
    if (deck && !reduced.matches && innerWidth > 760) {
      const rect = deck.getBoundingClientRect();
      const shift = Math.max(0, Math.min(28, (rect.top / innerHeight) * 28));
      deck.style.setProperty('--deck-shift', shift.toFixed(2));
    }
    header?.classList.toggle('scrolled', scrollY > 25);
  }
  function scheduleScroll() { if (!frame) frame = requestAnimationFrame(updateScroll); }
  addEventListener('scroll', scheduleScroll, { passive: true });
  addEventListener('resize', scheduleScroll, { passive: true });
  updateScroll();
  function updateMotion() {
    document.documentElement.classList.toggle('motion-ready', !reduced.matches);
    if (reduced.matches) deck?.style.removeProperty('--deck-shift');
    if (motionToggle) {
      motionToggle.setAttribute('aria-pressed', String(reduced.matches));
      motionToggle.disabled = systemMotion.matches;
      motionToggle.textContent = reduced.matches ? 'تفعيل الحركة' : 'تقليل الحركة';
      if (systemMotion.matches) motionToggle.textContent = 'الحركة مخففة';
    }
    scheduleScroll();
  }
  motionToggle?.addEventListener('click', () => {
    const value = reduced.matches ? 'full' : 'reduced';
    document.documentElement.dataset.motion = value;
    try { localStorage.setItem('thara-motion',value); } catch { /* Preference works for this page even without storage. */ }
    document.dispatchEvent(new Event('thara:motionchange'));
  });
  systemMotion.addEventListener('change', updateMotion);
  document.addEventListener('thara:motionchange', updateMotion);
  updateMotion();

  if (menuButton && menu) {
    menuButton.setAttribute('aria-label', 'فتح القائمة الرئيسية');
    menuButton.setAttribute('aria-controls', menu.id);
    menuButton.setAttribute('aria-expanded', String(menu.classList.contains('active')));
    menu.setAttribute('aria-label', 'القائمة الرئيسية');
    menu.querySelectorAll('a').forEach(link => {
      const current = new URL(link.href).pathname;
      const here = location.pathname.endsWith('/') ? `${location.pathname}index.html` : location.pathname;
      if (current === here && !new URL(link.href).hash) link.setAttribute('aria-current', 'page');
    });
    function closeMenu(returnFocus = false) {
      menu.classList.remove('active');
      menuButton.classList.remove('active');
      document.body.classList.remove('menu-open');
      menuButton.setAttribute('aria-expanded', 'false');
      if (returnFocus) menuButton.focus();
    }
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.classList.contains('active')) closeMenu(true);
    });
    document.addEventListener('click', event => {
      if (menu.classList.contains('active') && !header?.contains(event.target)) closeMenu();
    });
    addEventListener('resize', () => { if (innerWidth > 979 && menu.classList.contains('active')) closeMenu(); });
  }

  // Add focus management while keeping the existing viewer's open/close handlers.
  const lightbox = document.getElementById('homeLightbox');
  let galleryTrigger;
  if (lightbox) {
    document.addEventListener('click', event => {
      const trigger = event.target.closest('.gallery-viewer');
      if (trigger) galleryTrigger = trigger;
    }, true);
    new MutationObserver(() => {
      if (lightbox.classList.contains('active')) document.getElementById('homeLightboxClose')?.focus();
      else galleryTrigger?.focus({ preventScroll: true });
    }).observe(lightbox, { attributes: true, attributeFilter: ['class'] });
    lightbox.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const buttons = [...lightbox.querySelectorAll('button')].filter(button => button.getClientRects().length);
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    });
  }

  // The existing inquiry form keeps its original handlers.
  document.querySelectorAll('.faq-question').forEach((button, index) => {
    const answer = button.closest('.faq-item')?.querySelector('.faq-answer');
    if (!answer) return;
    answer.id ||= `faq-answer-${index + 1}`;
    button.setAttribute('aria-controls', answer.id);
    button.setAttribute('aria-expanded', String(button.closest('.faq-item').classList.contains('active')));
    new MutationObserver(() => {
      button.setAttribute('aria-expanded', String(button.closest('.faq-item').classList.contains('active')));
    }).observe(button.closest('.faq-item'), { attributes: true, attributeFilter: ['class'] });
  });

  if (!('IntersectionObserver' in window) || !('ResizeObserver' in window)) return;
  let sceneModule;
  const loadModule = () => sceneModule ||= import('./assets/villa-scene.js?v=20261007');
  document.querySelectorAll('[data-villa-scene], [data-brand-scene]').forEach(host => {
    const sceneObserver = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      sceneObserver.disconnect();
      const start = () => loadModule().then(module => {
        if (host.hasAttribute('data-brand-scene')) module.mountBrandScene(host);
        else module.mountVillaScene(host);
      }).catch(() => { host.dataset.sceneState = 'fallback'; });
      // Let text and real photographs paint before parsing the shared local bundle.
      if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 1200 });
      else setTimeout(start, 120);
    }, { rootMargin: '160px' });
    sceneObserver.observe(host);
  });
})();
