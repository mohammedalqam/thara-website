import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { JSDOM } from 'jsdom';
import * as THREE from 'three';
import { buildVilla } from '../src/cinematic/villa-model.js';
import { createBrandWordmark } from '../src/brand-geometry.js';
import { villaPose,letterPose,chapterProgress } from '../src/cinematic/timeline.js';

const baseline=JSON.parse(fs.readFileSync('docs/cinematic-v4/baseline-content.json'));
const doc=new JSDOM(fs.readFileSync('index.html','utf8')).window.document;
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const text=n=>n.textContent.replace(/\s+/g,' ').trim();
test('V4 retains protected pages, every original photograph and original contact messages',()=>{
  for(const [p,sha] of Object.entries(baseline.protectedFiles))assert.equal(hash(p),sha,p);
  for(const [p,data] of Object.entries(baseline.originalAssets))assert.equal(hash(p),data.sha256,p);
  for(const id of baseline.ids)assert.ok(doc.getElementById(id),`id ${id}`);
  for(const heading of baseline.headings)assert.ok([...doc.querySelectorAll(heading.tag)].some(n=>text(n)===heading.text),heading.text);
  for(const s of baseline.sections.filter(s=>!['home','tharaStory'].includes(s.id))){
    const current=s.id?doc.getElementById(s.id):[...doc.querySelectorAll('main>section')].find(n=>n.className===s.class);
    assert.equal(text(current),s.text,s.id||s.class);
  }
  for(const link of baseline.links)assert.ok([...doc.querySelectorAll('a')].some(n=>n.getAttribute('href')===link.href&&text(n)===link.text),link.href);
  for(const image of baseline.images)assert.ok(doc.querySelector(`img[src="${image.src}"]`),image.src);
  for(const item of baseline.whatsapp){assert.ok([...doc.querySelectorAll('[data-whatsapp-number]')].some(n=>n.dataset.whatsappNumber===item.number&&(n.dataset.message||null)===item.message&&n.getAttribute('href')===item.href));}
  for(const field of baseline.form){const n=doc.getElementById(field.id);for(const attr of ['type','min','required','autocomplete','placeholder'])if(attr in field)assert.equal(n.getAttribute(attr),field[attr]);assert.deepEqual([...n.querySelectorAll('option')].map(o=>({value:o.value,text:text(o)})),field.options);}
  assert.equal(doc.querySelectorAll('.gallery-viewer').length,baseline.gallery.length);
  assert.equal(doc.querySelectorAll('[data-portal-scene],[data-scroll-sculpture]').length,0,'legacy scenes cannot double mount');
});

test('the camera path clears architectural collision volumes and the hinged door in both directions',()=>{
  const {root}=buildVilla(),door=root.getObjectByName('DoorPivot'),slab=root.getObjectByName('Door_slab');
  const colliders=root.userData.collisionVolumes.map(v=>({name:v.name,box:new THREE.Box3(new THREE.Vector3(...v.min),new THREE.Vector3(...v.max))}));
  slab.geometry.computeBoundingBox();
  for(const aspect of [.53,.8,1.3,1.6,2.8])for(let i=0;i<=1000;i++){
    const p=i/1000,pose=villaPose(p,aspect);assert.deepEqual(villaPose(p,aspect),villaPose(p,aspect),'no time/random state');
    for(const c of colliders)assert.ok(c.box.distanceToPoint(pose.position)>.10,`${c.name} p=${p} aspect=${aspect}`);
    door.rotation.y=pose.door;root.updateMatrixWorld(true);
    const local=pose.position.clone().applyMatrix4(slab.matrixWorld.clone().invert());
    assert.ok(slab.geometry.boundingBox.distanceToPoint(local)>.10,`door p=${p}`);
    if(pose.position.z<5.6&&pose.position.z>4.5)assert.ok(Math.abs(pose.position.x)<1.05,'clear entry corridor');
  }
  assert.equal(villaPose(0).door,0);assert.ok(villaPose(.43).door>Math.PI/2);
  assert.equal(chapterProgress(500,0,1400,900),1);assert.equal(chapterProgress(-5,0,1400,900),0);
});

test('five independent letters fit every reserved lane and assemble as readable LTR THARA',()=>{
  const {letters}=createBrandWordmark(new THREE.MeshBasicMaterial(),new Set());
  assert.equal(letters.length,5);assert.notEqual(letters[2],letters[4]);
  const viewports=[[320,640],[390,844],[768,1024],[1024,768],[1440,900],[1920,1080],[844,390]];
  for(const [w,h] of viewports)for(let j=0;j<=100;j++){
    const p=j/100;
    letters.forEach((letter,i)=>{
      const pose=letterPose(i,letter.userData.homeX,w,h,p);
      assert.deepEqual(pose,letterPose(i,letter.userData.homeX,w,h,p));
      const matrix=new THREE.Matrix4().compose(new THREE.Vector3(pose.x,pose.y,pose.z),new THREE.Quaternion().setFromEuler(new THREE.Euler(pose.rx,pose.ry,pose.rz)),new THREE.Vector3(pose.scale,pose.scale,pose.scale));
      letter.geometry.computeBoundingBox();const box=letter.geometry.boundingBox.clone().applyMatrix4(matrix);
      assert.ok(box.min.x>=0&&box.max.x<=w,`horizontal bounds ${w} p${p} letter${i}`);
      assert.ok(box.min.y>=0&&box.max.y<=h,`vertical bounds ${w} p${p} letter${i}`);
      if(p>=.04&&p<=.96){
        if(w<760)assert.ok(box.max.x<48,`mobile reserved lane ${w} ${i}`);
        else assert.ok(box.max.x<75||box.min.x>w-75,`desktop safe margin ${w} ${i}`);
      }
    });
    if(p===0||p===1)assert.ok(letters.every((l,i)=>i===0||letterPose(i,l.userData.homeX,w,h,p).x>letterPose(i-1,letters[i-1].userData.homeX,w,h,p).x));
  }
});
