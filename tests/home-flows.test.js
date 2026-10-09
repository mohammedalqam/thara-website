import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM, VirtualConsole } from 'jsdom';
import { mountPortalScene, mountScrollSculpture } from '../src/home-scenes.js';

const root = new URL('../', import.meta.url);
const teamNumbers = ['972532121036', '972584003302', '972584429998'];

// Execute the actual page scripts in an offline DOM. This does not test CSS layout
// or replace the browser checks required before publishing. No resources are loaded
// and window.open is intercepted: these checks never contact the THARA team.
function page(t, { file = 'index.html', observers = true, systemReduced = false, savedReduced = false } = {}) {
  const errors = [], frames = new Map(), timers = new Map(), intersections = [], scrolls = [], opened = [];
  let sequence = 0;
  const console = new VirtualConsole();
  console.on('jsdomError', error => errors.push(error));
  const dom = new JSDOM(readFileSync(new URL(file, root), 'utf8'), {
    url: `https://thara.test/${file}`, runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: console
  });
  const w = dom.window, d = w.document;
  t.after(() => { w.close(); assert.deepEqual(errors, [], 'the real page scripts must not throw'); });
  const media = new w.EventTarget();
  media.matches = systemReduced;
  w.matchMedia = () => media;
  if (savedReduced) w.localStorage.setItem('thara-motion', 'reduced');
  w.requestAnimationFrame = callback => { frames.set(++sequence, callback); return sequence; };
  w.cancelAnimationFrame = id => frames.delete(id);
  w.setTimeout = callback => { timers.set(++sequence, callback); return sequence; };
  w.clearTimeout = id => timers.delete(id);
  w.Element.prototype.scrollIntoView = function (options) { scrolls.push({ element: this, options }); };
  w.open = (...args) => { opened.push(args); return null; };
  w.addEventListener('error', event => errors.push(event.error));
  if (observers) {
    w.IntersectionObserver = class {
      constructor(callback) { this.callback = callback; this.targets = new Set(); intersections.push(this); }
      observe(target) { this.targets.add(target); }
      unobserve(target) { this.targets.delete(target); }
      disconnect() { this.targets.clear(); }
      show(target) { this.callback([{ target, isIntersecting: true }], this); }
    };
    w.ResizeObserver = class { observe() {} disconnect() {} };
  }
  const scripts = file === 'contact.html' ? ['script.js', 'pages.js', 'owners.js', 'premium.js'] : ['script.js', 'premium.js'];
  for (const script of scripts) w.eval(readFileSync(new URL(script, root), 'utf8'));
  return {
    w, d, media, frames, timers, intersections, scrolls, opened,
    input(id, value) {
      const input = d.getElementById(id); input.value = value;
      input.dispatchEvent(new w.Event('input', { bubbles: true }));
    },
    submit(id) { d.getElementById(id).dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true })); },
    key(key) { d.dispatchEvent(new w.KeyboardEvent('keydown', { key, bubbles: true })); },
    flushTimers() { const pending = [...timers.values()]; timers.clear(); pending.forEach(callback => callback()); },
    flushFrames() { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback(w.performance.now() + 16)); }
  };
}

function fillHome(p) {
  p.input('homeInquiryName', 'أبو يوسف & العائلة');
  p.input('homeInquiryDate', '2026-10-20');
  p.input('homeInquiryGuests', '8');
  p.input('homeInquiryRooms', '4 غرف');
  p.input('homeInquiryNotes', 'هل المسبح مُدفأ؟ + موعد الوصول 15:00');
}

function assertContacts(container, attribute, expectedParts) {
  const links = [...container.querySelectorAll('a')];
  assert.equal(links.length, 3);
  links.forEach((link, index) => {
    const url = new URL(link.href);
    assert.equal(url.origin, 'https://wa.me');
    assert.equal(url.pathname, `/${teamNumbers[index]}`);
    assert.equal(link.getAttribute(attribute), teamNumbers[index]);
    const message = url.searchParams.get('text');
    for (const part of expectedParts) assert.ok(message.includes(part), `message must preserve ${part}`);
    assert.equal(link.rel, 'noopener noreferrer');
  });
}

test('home inquiry validates, builds three encoded contact choices, focuses them and invalidates edited requests', t => {
  const p = page(t), contacts = p.d.getElementById('homeInquiryContacts');
  p.submit('homeInquiryForm'); assert.equal(contacts.hidden, true);
  fillHome(p); p.input('homeInquiryGuests', '0');
  p.submit('homeInquiryForm'); assert.equal(contacts.hidden, true);
  p.input('homeInquiryGuests', '8'); p.submit('homeInquiryForm');
  assert.equal(contacts.hidden, false);
  assertContacts(contacts, 'data-whatsapp-number', ['أبو يوسف & العائلة', '2026-10-20', '8', '4 غرف', 'مُدفأ؟ + موعد الوصول 15:00']);
  assert.equal(p.d.activeElement, contacts.querySelector('a'));
  assert.equal(p.scrolls.at(-1).options.behavior, 'smooth');
  assert.equal(p.opened.length, 0);
  p.input('homeInquiryNotes', 'طلب معدل'); assert.equal(contacts.hidden, true);
});

test('missing intersection/resize APIs do not disable the home form or hide content', t => {
  const p = page(t, { observers: false });
  fillHome(p); p.submit('homeInquiryForm');
  assert.equal(p.d.getElementById('homeInquiryContacts').hidden, false);
  assert.ok([...p.d.querySelectorAll('.reveal')].every(element => element.classList.contains('visible')));
  assert.deepEqual([...p.d.querySelectorAll('.count-up')].map(el => el.textContent.trim()), ['3', '10']);
});

for (const preference of ['system', 'saved', 'toggle']) {
  test(`home inquiry respects ${preference} reduced motion and leaves property counts stable`, t => {
    const p = page(t, { systemReduced: preference === 'system', savedReduced: preference === 'saved' });
    if (preference === 'toggle') p.d.querySelector('[data-motion-toggle]').click();
    fillHome(p); p.submit('homeInquiryForm');
    assert.equal(p.scrolls.at(-1).options.behavior, 'auto');
    p.frames.clear();
    for (const observer of p.intersections) {
      for (const counter of [...observer.targets].filter(el => el.matches('.count-up'))) observer.show(counter);
    }
    assert.equal(p.frames.size, 0, 'reduced motion must not start count-up frames');
    assert.deepEqual([...p.d.querySelectorAll('.count-up')].map(el => el.textContent.trim()), ['3', '10']);
    assert.equal(p.opened.length, 0);
  });
}

test('a system preference change stops an already running property counter', t => {
  const p = page(t), counter = p.d.querySelector('.count-up');
  p.frames.clear();
  p.intersections.find(observer => observer.targets.has(counter)).show(counter);
  assert.equal(p.frames.size, 1);
  p.media.matches = true; p.media.dispatchEvent(new p.w.Event('change'));
  p.flushFrames();
  assert.equal(counter.textContent.trim(), counter.dataset.count);
  assert.equal(p.frames.size, 0);
});

test('mobile navigation closes with Escape, outside clicks and desktop resize', t => {
  const p = page(t), button = p.d.getElementById('menuButton'), nav = p.d.getElementById('mainNav');
  p.w.innerWidth = 390;
  button.click(); assert.equal(button.getAttribute('aria-expanded'), 'true');
  assert.ok(p.d.body.classList.contains('menu-open'));
  p.key('Escape'); assert.equal(button.getAttribute('aria-expanded'), 'false');
  assert.equal(p.d.activeElement, button);
  button.click(); p.d.querySelector('main').click(); assert.ok(!nav.classList.contains('active'));
  button.click(); p.w.innerWidth = 1180; p.w.dispatchEvent(new p.w.Event('resize'));
  assert.ok(!nav.classList.contains('active')); assert.ok(!p.d.body.classList.contains('menu-open'));
});

test('WhatsApp pickers are exclusive, dismissable and preserve the correct person/message', t => {
  const p = page(t), pickers = [...p.d.querySelectorAll('.whatsapp-picker')];
  pickers[0].querySelector('button').click(); assert.ok(pickers[0].classList.contains('active'));
  pickers[1].querySelector('button').click(); assert.ok(!pickers[0].classList.contains('active'));
  assert.ok(pickers[1].classList.contains('active'));
  p.key('Escape'); assert.ok(pickers.every(el => !el.classList.contains('active')));
  pickers[0].querySelector('button').click(); p.d.querySelector('main').click();
  assert.ok(pickers.every(el => !el.classList.contains('active')));
  for (const link of p.d.querySelectorAll('.whatsapp-link')) {
    link.click();
    const [href, target, features] = p.opened.at(-1), url = new URL(href);
    assert.equal(url.pathname, `/${link.dataset.whatsappNumber}`);
    assert.equal(url.searchParams.get('text'), link.dataset.message);
    assert.equal(target, '_blank'); assert.ok(features.split(',').includes('noopener'));
  }
});

test('real gallery opens, advances, wraps backwards and returns focus after Escape', async t => {
  const p = page(t), triggers = [...p.d.querySelectorAll('.gallery-viewer')];
  const box = p.d.getElementById('homeLightbox'), image = p.d.getElementById('homeLightboxImage');
  triggers[0].click(); await Promise.resolve();
  assert.equal(box.getAttribute('aria-hidden'), 'false');
  assert.ok(p.d.body.classList.contains('lightbox-open'));
  assert.equal(p.d.activeElement.id, 'homeLightboxClose');
  assert.equal(image.getAttribute('src'), triggers[0].dataset.full);
  p.d.getElementById('lightboxNext').click(); p.flushTimers();
  assert.equal(image.getAttribute('src'), triggers[1].dataset.full);
  p.key('ArrowRight'); p.flushTimers(); p.key('ArrowRight'); p.flushTimers();
  assert.equal(image.getAttribute('src'), triggers.at(-1).dataset.full);
  p.key('Escape'); await Promise.resolve();
  assert.equal(box.getAttribute('aria-hidden'), 'true');
  assert.ok(!p.d.body.classList.contains('lightbox-open'));
  assert.equal(p.d.activeElement, triggers[0]);
});

test('gallery swipes advance and reverse while short touches leave the image unchanged', t => {
  const p=page(t),triggers=[...p.d.querySelectorAll('.gallery-viewer')];
  const image=p.d.getElementById('homeLightboxImage');triggers[0].click();
  const touch=(type,x)=>{const event=new p.w.Event(type,{bubbles:true});Object.defineProperty(event,'changedTouches',{value:[{screenX:x}]});image.dispatchEvent(event);};
  touch('touchstart',220);touch('touchend',195);p.flushTimers();
  assert.equal(image.getAttribute('src'),triggers[0].dataset.full);
  touch('touchstart',220);touch('touchend',80);p.flushTimers();
  assert.equal(image.getAttribute('src'),triggers[1].dataset.full);
  touch('touchstart',80);touch('touchend',220);p.flushTimers();
  assert.equal(image.getAttribute('src'),triggers[0].dataset.full);
  assert.equal(p.opened.length,0);
});

for (const reduced of [false, true]) {
  test(`owner inquiry preserves required validation and selected services (${reduced ? 'reduced' : 'full'} motion)`, t => {
    const p = page(t, { file: 'contact.html', savedReduced: reduced }), contacts = p.d.getElementById('ownersContactPicker');
    p.submit('ownersForm'); assert.equal(contacts.hidden, true);
    p.input('ownersName', 'أبو يوسف'); p.input('ownersPhone', '+972 53 000 0000');
    p.input('ownersLocation', 'أريحا'); p.input('ownersDetails', 'فيلا & مسبح + حديقة');
    p.d.querySelector('input[value="تصوير"]').checked = true;
    p.d.querySelector('input[value="إدارة حجوزات"]').checked = true;
    p.submit('ownersForm'); assert.equal(contacts.hidden, false);
    assertContacts(contacts, 'data-owner-number', ['أبو يوسف', '+972 53 000 0000', 'أريحا', 'تصوير، إدارة حجوزات', 'فيلا & مسبح + حديقة']);
    assert.equal(p.scrolls.at(-1).options.behavior, reduced ? 'auto' : 'smooth');
    assert.equal(p.d.activeElement, contacts.querySelector('a')); assert.equal(p.opened.length, 0);
    p.input('ownersDetails', 'معلومات أحدث'); assert.equal(contacts.hidden, true);
  });
}

function withSceneGlobals(p, work) {
  const names = ['window', 'document', 'matchMedia', 'getComputedStyle', 'addEventListener',
    'requestAnimationFrame', 'cancelAnimationFrame', 'IntersectionObserver', 'ResizeObserver', 'AbortController'];
  const originals = names.map(name => Object.getOwnPropertyDescriptor(globalThis, name));
  try {
    for (const name of names) {
      const value = name === 'window' ? p.w : p.w[name];
      Object.defineProperty(globalThis, name, { configurable: true, writable: true,
        value: ['matchMedia', 'getComputedStyle', 'addEventListener', 'requestAnimationFrame', 'cancelAnimationFrame'].includes(name)
          ? value.bind(p.w) : value });
    }
    work();
  } finally {
    p.w.dispatchEvent(new p.w.Event('pagehide'));
    names.forEach((name, index) => {
      if (originals[index]) Object.defineProperty(globalThis, name, originals[index]);
      else delete globalThis[name];
    });
  }
}

test('archived V3 portal controls remain covered independently of V4', t => {
  const p = page(t, {file:'tests/fixtures/home-v3.html'});
  withSceneGlobals(p, () => {
    const host = p.d.querySelector('[data-portal-scene]'), camera = host.querySelector('[data-portal-camera]');
    const orbit = host.querySelector('[data-portal-orbit]'), pause = host.querySelector('[data-scene-pause]');
    // Synthetic geometry is only for event/pose testing; it makes no layout claim.
    host.getBoundingClientRect = camera.getBoundingClientRect = () => ({ width: 400, height: 340, left: 0, top: 0 });
    mountPortalScene(host);
    const observerCount = p.intersections.length;
    mountPortalScene(host); assert.equal(p.intersections.length, observerCount);
    assert.equal(host.dataset.sceneState, 'ready');
    p.intersections.filter(observer => observer.targets.has(host)).at(-1).show(host); p.flushFrames();
    const move = new p.w.MouseEvent('pointermove', { clientX: 400, clientY: 340 });
    Object.defineProperty(move, 'pointerType', { value: 'mouse' }); host.dispatchEvent(move); p.flushFrames();
    pause.click(); p.flushFrames();
    const frozen = orbit.style.getPropertyValue('--portal-y');
    host.dispatchEvent(new p.w.Event('pointerleave')); p.flushFrames();
    assert.equal(orbit.style.getPropertyValue('--portal-y'), frozen);
    assert.equal(host.dataset.scenePaused, 'true'); assert.equal(pause.getAttribute('aria-pressed'), 'true');
    host.querySelector('[data-scene-turn]').click(); p.flushFrames();
    assert.notEqual(orbit.style.getPropertyValue('--portal-y'), frozen);
    host.querySelector('[data-scene-theme="night"]').click();
    assert.equal(host.dataset.sceneTheme, 'night');
    assert.equal(host.querySelector('[data-scene-theme="night"]').getAttribute('aria-pressed'), 'true');
    assert.equal(host.querySelector('[data-scene-theme="day"]').getAttribute('aria-pressed'), 'false');
    p.d.querySelector('[data-motion-toggle]').click(); p.flushFrames();
    assert.equal(pause.disabled, true); assert.equal(host.dataset.motionActive, 'false');
    assert.equal(orbit.style.getPropertyValue('--portal-y'), '8.00deg');
    host.dispatchEvent(move); p.flushFrames(); assert.equal(orbit.style.getPropertyValue('--portal-y'), '8.00deg');
  });
});

test('archived V3 layers mount once and respect motion preferences', t => {
  const p = page(t, {file:'tests/fixtures/home-v3.html'});
  withSceneGlobals(p, () => {
    const host = p.d.querySelector('[data-scroll-sculpture]'), story = host.closest('[data-brand-story]');
    const stage = story.querySelector('.brand-story-stage'), orbit = host.querySelector('[data-brand-orbit]');
    let top = 500;
    story.getBoundingClientRect = () => ({ top, height: 1800 });
    stage.getBoundingClientRect = () => ({ height: 700 }); stage.style.top = '96px';
    mountScrollSculpture(host); mountScrollSculpture(host);
    assert.equal(host.querySelectorAll('.brand-metal-edge').length, 22);
    assert.equal(host.querySelector('.brand-metal-face').textContent, 'THARA');
    p.intersections.filter(observer => observer.targets.has(host)).at(-1).show(host); p.flushFrames();
    const entry = orbit.style.transform;
    top = -400; p.w.dispatchEvent(new p.w.Event('scroll')); p.flushFrames();
    assert.notEqual(orbit.style.transform, entry); assert.equal(story.dataset.storyStep, 'stay');
    p.d.querySelector('[data-motion-toggle]').click(); p.flushFrames();
    const reducedPose = orbit.style.transform;
    top = -1000; p.w.dispatchEvent(new p.w.Event('scroll')); p.flushFrames();
    assert.equal(orbit.style.transform, reducedPose); assert.equal(host.dataset.motionActive, 'false');
  });
});
