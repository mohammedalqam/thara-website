import test from 'node:test';
import assert from 'node:assert/strict';
import { Box3, Vector3, Matrix4, OrthographicCamera, MeshBasicMaterial } from 'three';
import { damp, storyProgress, orthographicFrame } from '../src/scene-math.js';
import { fitVillaCamera, villaAngles } from '../src/scene-camera.js';
import { createBrandWordmark, brandShapes } from '../src/brand-geometry.js';

test('elapsed-time transitions match across 12, 30 and 60 fps', () => {
  const results = [12,30,60].map(fps => {
    let value=0;
    for (let frame=0;frame<fps;frame++) value=damp(value,1,7,1/fps);
    return value;
  });
  for (const value of results) assert.ok(Math.abs(value-results[0])<1e-12);
  assert.equal(damp(.5,1,7,0),.5);
});

test('scroll progress remains bounded at anchors and on short stages', () => {
  assert.equal(storyProgress(500,1300,670,96),0);
  assert.equal(storyProgress(-1000,1300,670,96),1);
  assert.equal(storyProgress(-219,1300,670,96),.5);
  assert.equal(storyProgress(96,300,300,96),0);
  assert.equal(storyProgress(95,300,300,96),1);
});

test('camera contains villa bounds at every supported angle and aspect ratio', () => {
  const bounds = new Box3(new Vector3(-6.1,-.34,-5.1),new Vector3(6.1,5.55,5.1));
  const camera = new OrthographicCamera(-9,9,7,-7,.1,100);
  camera.position.set(13,10,16); camera.lookAt(0,1.8,0);
  for (const aspect of [.65,.9,1,1.249,1.25,1.6,2,3]) {
    fitVillaCamera(camera,bounds,aspect);
    for (const angle of villaAngles) {
      const rotation=new Matrix4().makeRotationY(angle);
      for (const x of [bounds.min.x,bounds.max.x]) for (const y of [bounds.min.y,bounds.max.y]) for (const z of [bounds.min.z,bounds.max.z]) {
        const point=new Vector3(x,y,z).applyMatrix4(rotation).project(camera);
        assert.ok(Math.abs(point.x)<=.9 && Math.abs(point.y)<=.9,`clipped at ${aspect}, ${angle}`);
      }
    }
  }
  fitVillaCamera(camera,bounds,1.249); const before=camera.right-camera.left;
  fitVillaCamera(camera,bounds,1.25); assert.ok(Math.abs(before-(camera.right-camera.left))<.02);
  assert.equal(orthographicFrame(1,12,4).height,12);
});

test('THARA geometry has five letters, shared A outlines and bounded finite geometry', () => {
  const resources=new Set(); const material=new MeshBasicMaterial();
  const {world,letters,width}=createBrandWordmark(material,resources);
  assert.equal(world.children.length,5); assert.equal(letters[2].geometry,letters[4].geometry);
  assert.equal(brandShapes().A.holes.length,1); assert.equal(brandShapes().R.holes.length,1);
  assert.ok(width>8 && width<10);
  let triangles=0;
  for (const geometry of resources) {
    const positions=geometry.getAttribute('position');
    for (const value of positions.array) assert.ok(Number.isFinite(value));
    geometry.computeBoundingBox(); assert.ok(geometry.boundingBox.max.y<1.03);
    triangles+=positions.count/3;
  }
  assert.ok(triangles<1800);
  resources.forEach(resource=>resource.dispose()); material.dispose();
});
