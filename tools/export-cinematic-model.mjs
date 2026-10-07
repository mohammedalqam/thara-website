import fs from 'node:fs';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { buildVilla } from '../src/cinematic/villa-model.js';

// GLTFExporter uses FileReader for binary buffers; no DOM or texture rasterization.
globalThis.FileReader=class {
  readAsArrayBuffer(blob){blob.arrayBuffer().then(b=>{this.result=b;this.onloadend?.();});}
  readAsDataURL(blob){blob.arrayBuffer().then(b=>{this.result='data:'+blob.type+';base64,'+Buffer.from(b).toString('base64');this.onloadend?.();});}
};
const {root}=buildVilla();
const glb=await new GLTFExporter().parseAsync(root,{binary:true,onlyVisible:true});
fs.mkdirSync('assets/cinematic',{recursive:true});
fs.writeFileSync('assets/cinematic/thara-courtyard.glb',Buffer.from(glb));
let triangles=0,meshes=0;root.traverse(o=>{if(o.isMesh){meshes++;triangles+=(o.geometry.index?.count||o.geometry.attributes.position.count)/3;}});
console.log(JSON.stringify({bytes:glb.byteLength,meshes,triangles}));
