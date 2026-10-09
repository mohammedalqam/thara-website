import * as THREE from 'three';

// Authored, deterministic textures. No third-party map downloads or moving water.
export function createMaps(renderer) {
  const textures=new Set();
  function map(kind) {
    const canvas=document.createElement('canvas');canvas.width=canvas.height=512;
    const ctx=canvas.getContext('2d'),data=ctx.createImageData(512,512);let seed=1735;
    const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
    for(let y=0;y<512;y++) for(let x=0;x<512;x++) {
      let v;
      if(kind==='stone')v=209+9*Math.sin(y*.13+Math.sin(x*.009)*4)+5*Math.sin(y*.58)+random()*16-(random()>.994?44:0);
      if(kind==='wood')v=128+22*Math.sin(x*.14+Math.sin(y*.015)*.8)+12*Math.sin(x*.75+Math.sin(y*.01))+random()*14;
      if(kind==='fabric')v=204+(x%3===0?-12:0)+(y%3===0?-12:0)+random()*16;
      if(kind==='water')v=134+44*Math.sin(x*.08+Math.cos(y*.11)*2)*Math.sin(y*.075+Math.cos(x*.093)*2);
      const off=(y*512+x)*4;data.data[off]=data.data[off+1]=data.data[off+2]=v;data.data[off+3]=255;
    }
    ctx.putImageData(data,0,0);const texture=new THREE.CanvasTexture(canvas);
    texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
    texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());textures.add(texture);return texture;
  }
  const stone=map('stone'),wood=map('wood'),fabric=map('fabric'),water=map('water');
  return {textures,apply(model) {
    model.traverse(o=>{
      if(!o.isMesh)return;
      o.castShadow=o.receiveShadow=true;
      const m=o.material;
      if(['Limestone','Travertine','Lime_plaster'].includes(m.name)){m.bumpMap=stone;m.bumpScale=.017;}
      if(m.name==='Walnut'){m.bumpMap=wood;m.bumpScale=.013;}
      if(/linen/i.test(m.name)){m.bumpMap=fabric;m.bumpScale=.009;}
      if(m.name==='Water'){m.bumpMap=water;m.bumpScale=.085;o.castShadow=false;}
      if(m.name==='Glazing'){o.castShadow=false;m.depthWrite=false;}
    });
  }};
}
