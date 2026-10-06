import { Box3, Matrix4, Vector3 } from 'three';
import { orthographicFrame } from './scene-math.js';

export const villaAngles = [-.82,-.55,-.28,0,.22];

export function fitVillaCamera(camera, bounds, aspect) {
  const projected = new Box3();
  camera.updateMatrixWorld();
  for (const angle of villaAngles) {
    const rotation = new Matrix4().makeRotationY(angle);
    for (const x of [bounds.min.x,bounds.max.x]) {
      for (const y of [bounds.min.y,bounds.max.y]) {
        for (const z of [bounds.min.z,bounds.max.z]) {
          projected.expandByPoint(new Vector3(x,y,z).applyMatrix4(rotation).applyMatrix4(camera.matrixWorldInverse));
        }
      }
    }
  }
  const fit = orthographicFrame(aspect,(projected.max.x-projected.min.x)*1.12,(projected.max.y-projected.min.y)*1.16);
  const center = projected.getCenter(new Vector3());
  camera.left = center.x - fit.width/2; camera.right = center.x + fit.width/2;
  camera.top = center.y + fit.height/2; camera.bottom = center.y - fit.height/2;
  camera.updateProjectionMatrix();
}
