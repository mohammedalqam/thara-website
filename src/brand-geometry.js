import { Shape, Path, ExtrudeGeometry, Group, Mesh } from 'three';

// Original Roman serif outlines; no remote font or model download.
function polygon(points, hole = false) {
  const path = hole ? new Path() : new Shape();
  path.moveTo(...points[0]);
  for (const point of points.slice(1)) path.lineTo(...point);
  path.closePath();
  return path;
}

export function brandShapes() {
  const T = polygon([[0,2],[1.5,2],[1.5,1.63],[1.4,1.63],[1.31,1.87],[.9,1.87],[.9,.16],[1.12,.09],[1.12,0],[.38,0],[.38,.09],[.6,.16],[.6,1.87],[.19,1.87],[.1,1.63],[0,1.63]]);
  const H = polygon([[0,0],[.76,0],[.76,.09],[.54,.16],[.54,.94],[1.16,.94],[1.16,.16],[.94,.09],[.94,0],[1.7,0],[1.7,.09],[1.48,.16],[1.48,1.84],[1.7,1.91],[1.7,2],[.94,2],[.94,1.91],[1.16,1.84],[1.16,1.1],[.54,1.1],[.54,1.84],[.76,1.91],[.76,2],[0,2],[0,1.91],[.22,1.84],[.22,.16],[0,.09]]);
  const A = polygon([[0,0],[.47,0],[.47,.09],[.26,.16],[.45,.72],[.96,.72],[1.15,.16],[.94,.09],[.94,0],[1.7,0],[1.7,.09],[1.52,.16],[.91,2],[.78,2],[.18,.16],[0,.09]]);
  A.holes.push(polygon([[.51,.9],[.7,1.5],[.91,.9]], true));
  const R = new Shape();
  R.moveTo(0,0); R.lineTo(.76,0); R.lineTo(.76,.09); R.lineTo(.54,.16); R.lineTo(.54,.91); R.lineTo(.78,.91);
  R.lineTo(1.26,0); R.lineTo(1.73,0); R.lineTo(1.73,.09); R.lineTo(1.57,.18); R.lineTo(1.15,.98);
  R.bezierCurveTo(1.57,1.09,1.65,1.45,1.45,1.77); R.bezierCurveTo(1.31,1.98,1.03,2,.74,2);
  R.lineTo(0,2); R.lineTo(0,1.91); R.lineTo(.22,1.84); R.lineTo(.22,.16); R.lineTo(0,.09); R.closePath();
  const counter = new Path();
  counter.moveTo(.54,1.08); counter.lineTo(.73,1.08); counter.bezierCurveTo(1.06,1.08,1.23,1.18,1.23,1.51);
  counter.bezierCurveTo(1.23,1.79,1.05,1.87,.74,1.87); counter.lineTo(.54,1.87); counter.closePath(); R.holes.push(counter);
  return { T, H, A, R };
}

export function createBrandWordmark(materials, resources) {
  const shapes = brandShapes();
  const widths = { T: 1.5, H: 1.7, A: 1.7, R: 1.73 };
  const geometries = new Map();
  const world = new Group(), letters = [];
  const name = 'THARA';
  const gap = .28;
  const width = [...name].reduce((sum, letter) => sum + widths[letter], 0) + gap * 4;
  let cursor = -width / 2;
  for (const letter of name) {
    if (!geometries.has(letter)) {
      const geometry = new ExtrudeGeometry(shapes[letter], { depth: .26, steps: 1, bevelEnabled: true, bevelThickness: .014, bevelSize: .012, bevelSegments: 2, curveSegments: 10 });
      geometry.translate(-widths[letter] / 2, -1, -.13);
      resources.add(geometry); geometries.set(letter, geometry);
    }
    const mesh = new Mesh(geometries.get(letter), materials);
    const homeX = cursor + widths[letter] / 2;
    mesh.position.x = homeX; mesh.userData.homeX = homeX;
    world.add(mesh); letters.push(mesh); cursor += widths[letter] + gap;
  }
  return { world, letters, width };
}
