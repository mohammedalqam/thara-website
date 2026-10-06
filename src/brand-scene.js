import { Scene, OrthographicCamera, MeshStandardMaterial, AmbientLight, DirectionalLight } from 'three';
import { createSurface, createSceneLoop, addStudioEnvironment } from './scene-runtime.js';
import { createBrandWordmark } from './brand-geometry.js';
import { damp, storyProgress, orthographicFrame } from './scene-math.js';
import { motionPreference } from './motion-preference.js';

export function mountBrandScene(host) {
  const surface = createSurface(host);
  if (!surface) return;
  const story = host.closest('[data-brand-story]');
  const stage = story.querySelector('.brand-story-stage');
  const reduced = motionPreference();
  const resources = new Set();
  const face = new MeshStandardMaterial({ color: 0xcdb382, metalness: .72, roughness: .3 });
  const edge = new MeshStandardMaterial({ color: 0x82663f, metalness: .65, roughness: .35 });
  resources.add(face); resources.add(edge);
  const { world, letters, width } = createBrandWordmark([face, edge], resources);
  const scene = new Scene(); scene.add(world);
  const camera = new OrthographicCamera(-6,6,2,-2,.1,40);
  camera.position.set(0,.5,16); camera.lookAt(0,0,0);
  const ambient = new AmbientLight(0xffffff, surface.kind === 'svg' ? .6 : 1.2);
  const key = new DirectionalLight(0xffeed5, surface.kind === 'svg' ? .65 : 3);
  key.position.set(-4,6,8);
  const rim = new DirectionalLight(0xd8e6e3, surface.kind === 'svg' ? .3 : 2);
  rim.position.set(5,2,-2); scene.add(ambient,key,rim);
  addStudioEnvironment(surface,scene,resources);
  let target = 0, current = 0;
  const loop = createSceneLoop(host, surface, {
    resize(aspect) {
      const fit = orthographicFrame(aspect, width + 1.75, 3.2);
      camera.left = -fit.width / 2; camera.right = fit.width / 2;
      camera.top = fit.height / 2; camera.bottom = -fit.height / 2;
      camera.updateProjectionMatrix();
    },
    render(delta) {
      current = reduced.matches ? .5 : damp(current,target,9,delta);
      const opening = reduced.matches ? 0 : Math.sin(current * Math.PI);
      world.rotation.set(.12 - current * .16, -.25 + current * .42, -.025 + current * .04);
      world.position.y = Math.sin(current * Math.PI) * .04;
      letters.forEach((letter,index) => {
        letter.position.x = letter.userData.homeX + (index - 2) * opening * .10;
        letter.position.y = (index % 2 ? -.1 : .1) * opening;
        letter.rotation.y = (index - 2) * opening * .045;
      });
      surface.renderer.render(scene,camera);
      return !reduced.matches && Math.abs(current - target) > .001;
    },
    dispose() { resources.forEach(resource => resource.dispose()); }
  });
  function update() {
    const rect = story.getBoundingClientRect();
    target = storyProgress(rect.top,rect.height,stage.getBoundingClientRect().height,parseFloat(getComputedStyle(stage).top) || 0);
    loop.request();
  }
  addEventListener('scroll',() => { if (loop.isVisible() && !reduced.matches) update(); },{passive:true,signal:loop.events.signal});
  addEventListener('resize',update,{passive:true,signal:loop.events.signal});
  reduced.addEventListener('change',update,{signal:loop.events.signal});
  update();
}
