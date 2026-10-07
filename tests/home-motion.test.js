import test from 'node:test';
import assert from 'node:assert/strict';
import { portalScale, portalPose, brandPose, observeMotion } from '../src/home-motion.js';

test('architectural planes fit small phones and wide screens; manual angles stay bounded', () => {
  for (const [width,height] of [[273,238],[331,280],[700,490],[1400,700]]) {
    const scale = portalScale(width,height);
    assert.ok(650 * scale <= width + 1e-6);
    assert.ok(550 * scale <= height + 1e-6);
    assert.ok(scale > 0 && scale <= 1.15);
  }
  for (let angle = -5; angle < 10; angle++) for (const pointer of [-100,0,100]) {
    const pose = portalPose(angle,pointer,pointer);
    assert.ok(pose.x >= -10 && pose.x <= -4);
    assert.ok(pose.y >= -31 && pose.y <= 12);
    assert.deepEqual(portalPose(angle,pointer,pointer,true),portalPose(angle,0,0));
  }
});

test('brand movement has bounded entry/exit poses and a stable reduced-motion composition', () => {
  assert.deepEqual(brandPose(-100),brandPose(0));
  assert.deepEqual(brandPose(100),brandPose(1));
  for (const progress of [-1,0,.3,.5,.7,1,2]) {
    const pose = brandPose(progress);
    assert.ok(pose.y >= -21 && pose.y <= 15);
    assert.ok(pose.lift >= -16 && pose.lift <= 16);
    assert.ok(pose.scale >= .94 && pose.scale <= 1.000001);
    assert.deepEqual(brandPose(progress,true),brandPose(.5));
  }
});

test('CSS motion stops offscreen/hidden, resumes after BFCache, and releases observers on navigation', () => {
  const names = ['window','document','requestAnimationFrame','cancelAnimationFrame','IntersectionObserver','ResizeObserver'];
  const originals = names.map(name => Object.getOwnPropertyDescriptor(globalThis,name));
  const queue = new Map(); let id = 0, observer, resize, draws = 0;
  const preference = new EventTarget(); preference.matches = false;
  const host = {dataset:{}};
  try {
    globalThis.window = new EventTarget(); globalThis.document = new EventTarget(); document.hidden = false;
    globalThis.requestAnimationFrame = callback => { queue.set(++id,callback); return id; };
    globalThis.cancelAnimationFrame = index => queue.delete(index);
    globalThis.IntersectionObserver = class { constructor(callback){this.callback = callback; observer = this;} observe(){} disconnect(){this.disconnected = true;} };
    globalThis.ResizeObserver = class { constructor(callback){this.callback = callback; resize = this;} observe(){} disconnect(){this.disconnected = true;} };
    const lifecycle = observeMotion(host,()=>draws++,preference);
    assert.equal(queue.size,0);
    observer.callback([{isIntersecting:true}]); lifecycle.request(); lifecycle.request();
    assert.equal(queue.size,1); assert.equal(host.dataset.motionActive,'true');
    const [key,callback] = [...queue][0]; queue.delete(key); callback();
    assert.equal(draws,1); assert.equal(queue.size,0);
    observer.callback([{isIntersecting:false}]); lifecycle.request(); assert.equal(queue.size,0);
    assert.equal(host.dataset.motionActive,'false');
    observer.callback([{isIntersecting:true}]); document.hidden = true; document.dispatchEvent(new Event('visibilitychange'));
    assert.equal(queue.size,0); assert.equal(host.dataset.motionActive,'false');
    document.hidden = false; document.dispatchEvent(new Event('visibilitychange')); assert.equal(queue.size,1);
    preference.matches = true; preference.dispatchEvent(new Event('change'));
    assert.equal(host.dataset.motionActive,'false'); assert.equal(host.dataset.motionReduced,'true');
    const suspend = new Event('pagehide'); suspend.persisted = true; window.dispatchEvent(suspend);
    assert.equal(queue.size,0); assert.ok(!observer.disconnected);
    window.dispatchEvent(new Event('pageshow')); assert.equal(queue.size,1);
    window.dispatchEvent(new Event('pagehide')); assert.equal(queue.size,0);
    assert.ok(observer.disconnected && resize.disconnected); assert.ok(lifecycle.events.signal.aborted);
    lifecycle.request(); assert.equal(queue.size,0);
  } finally {
    names.forEach((name,index) => { if(originals[index])Object.defineProperty(globalThis,name,originals[index]); else delete globalThis[name]; });
  }
});
