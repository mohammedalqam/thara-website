import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { createBrandWordmark } from '../brand-geometry.js';

// Original THARA courtyard villa study. Metres, Y-up. Front +Z, garden -Z.
// This is conceptual brand architecture, not an available rental property.
export function buildVilla() {
  const root = new THREE.Group(); root.name='THARA_Courtyard_Villa';
  const materials={};
  const mat=(name,color,roughness=.7,metalness=0,options={})=>{
    const m=new THREE.MeshStandardMaterial({color,roughness,metalness,...options});
    m.name=name;materials[name]=m;return m;
  };
  const limestone=mat('Limestone',0xd2c2a3,.85);
  const travertine=mat('Travertine',0xe6ddcb,.62);
  const plaster=mat('Lime_plaster',0xe6e0d2,.94);
  const walnut=mat('Walnut',0x62432c,.64);
  const bronze=mat('Bronze',0xb89a63,.28,.82);
  const frame=mat('Window_frame',0x302f2b,.32,.55);
  const linen=mat('Linen',0xe2d5ba,.95);
  const olive=mat('Olive_linen',0x555e42,.96);
  const glass=mat('Glazing',0xb7c5bf,.08,.15,{transparent:true,opacity:.16,depthWrite:false,side:THREE.DoubleSide});
  const water=mat('Water',0x357c7d,.13,.45);
  const soil=mat('Earth',0x71644c,1);
  const gravel=mat('Garden_gravel',0xbab4a3,1);
  const leaf=mat('Palm_leaf',0x526844,.94,0,{side:THREE.DoubleSide});
  const leafLight=mat('Palm_leaf_light',0x75805a,.96,0,{side:THREE.DoubleSide});
  const warm=mat('Warm_LED',0xffe5b9,.4,0,{emissive:0xffd095,emissiveIntensity:1.5});
  const ceramic=mat('Ceramic',0xbca181,.38);
  const dark=mat('Charcoal',0x333b34,.8);
  const pebble=mat('Pebble',0xab9c81,.95);
  const resources=new Set();
  function mesh(geo,material,name,parent=root){ const m=new THREE.Mesh(geo,material);m.name=name;m.castShadow=m.receiveShadow=true;parent.add(m);return m; }
  function box(name,dim,pos,m,parent=root,bevel=.016){
    const g=bevel?new RoundedBoxGeometry(...dim,1,Math.min(bevel,Math.min(...dim)/3)):new THREE.BoxGeometry(...dim);
    const o=mesh(g,m,name,parent);o.position.set(...pos);return o;
  }
  function cyl(name,r1,r2,h,pos,m,parent=root){const o=mesh(new THREE.CylinderGeometry(r1,r2,h,24),m,name,parent);o.position.set(...pos);return o;}
  function lathe(name,pts,pos,m,scale=1){const o=mesh(new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(...p)),32),m,name);o.position.set(...pos);o.scale.setScalar(scale);return o;}
  // Continuous floor levels and distinct exterior/foyer/living spaces.
  box('Site',[40,.4,48],[0,-.32,0],gravel);
  box('Entry_terrace',[19,.22,10],[0,-.03,9],travertine);
  box('Arrival_step',[19,.13,1.3],[0,-.07,14.55],travertine);
  box('Arrival_lower_step',[19,.08,1.3],[0,-.135,15.85],travertine);
  box('Interior_floor',[16,.22,11],[0,-.03,-.3],travertine);
  box('Pool_front_terrace',[21,.22,2.65],[0,-.03,-6.85],travertine);
  box('Pool_rear_terrace',[21,.22,3.1],[0,-.03,-15.65],travertine);
  for(const x of [-8.3,8.3])box('Pool_side_terrace',[4.4,.22,6.5],[x,-.03,-11.1],travertine);
  // Small grout joints turn the slab into correctly scaled floor stone.
  for(let x=-7;x<=7;x+=1.2) box('Floor_grout',[.007,.004,10.8],[x,.084,-.3],limestone,root,0);
  for(let z=-5;z<=5;z+=1.2) box('Floor_grout',[15.8,.004,.007],[0,.084,z],limestone,root,0);
  // Front elevation: asymmetric stone wings, a recessed 2.4m clear doorway.
  box('Facade_left_sill',[6.6,1.04,.5],[-4.65,.61,5],limestone);
  box('Facade_left_lintel',[6.6,.66,.5],[-4.65,3.55,5],limestone);
  box('Facade_sign_pier',[1.72,2.14,.5],[-2.23,2.18,5],limestone);
  box('Facade_window_pier',[.25,2.14,.5],[-7.83,2.18,5],limestone);
  box('Front_glazing',[4.39,2.05,.018],[-5.46,2.18,5.02],glass,root,0);
  for(const x of [-7.69,-5.47,-3.25])box('Front_window_mullion',[.044,2.11,.075],[x,2.18,5.08],frame);
  for(const y of [1.14,3.22])box('Front_window_rail',[4.49,.044,.075],[-5.46,y,5.08],frame);
  box('Facade_right',[6.6,3.8,.5],[4.65,1.98,5],limestone);
  box('Door_header',[2.7,.62,.65],[0,3.57,5],limestone);
  box('Left_return',[.45,3.8,10.7],[-7.8,1.98,-.35],limestone);
  box('Right_return',[.45,3.8,10.7],[7.8,1.98,-.35],limestone);
  box('Roof',[17.2,.32,12.2],[0,4.04,-.25],travertine);
  box('Roof_shadow_reveal',[17,.06,12],[0,3.86,-.25],frame);
  box('Roof_upper_band',[17.25,.08,12.25],[0,4.24,-.25],limestone);
  // Stone cladding joints, low entry wing and a shaded wooden screen.
  for(let y=.65;y<3.7;y+=.55){
    box('Facade_joint_L',[y<1.1||y>3.23?6.6:1.72,.013,.012],[y<1.1||y>3.23?-4.65:-2.23,y,5.255],travertine,root,0);
    box('Facade_joint_R',[6.6,.013,.012],[4.65,y,5.255],travertine,root,0);
  }
  for(let row=0;row<6;row++)for(let col=0;col<4;col++)box('Stone_vertical_joint',[.007,.53,.008],[1.75+col*1.62+(row%2)*.75,.65+row*.55,5.255],travertine,root,0);
  for(let i=0;i<21;i++) box('Entry_walnut_batten',[.075,3.28,.095],[2.85+i*.13,1.81,5.32],walnut);
  box('Entry_canopy',[5.7,.16,3.3],[.65,3.38,6.35],walnut);
  box('Canopy_light',[4.7,.022,.035],[.65,3.287,7.78],warm,root,0);
  for(const x of [-1.38,1.38])box('Door_jamb',[.08,3.17,.12],[x,1.7,5.30],bronze);
  // Open toward the interior: pivot at left jamb, positive Y rotation.
  const pivot=new THREE.Group();pivot.name='DoorPivot';pivot.position.set(-1.25,.09,5.14);root.add(pivot);
  box('Door_slab',[2.5,3.13,.13],[1.25,1.565,0],walnut,pivot,.028);
  for(let i=0;i<17;i++)box('Door_flute',[.013,3.07,.012],[.08+i*.146,1.565,.07],bronze,pivot,0);
  box('Door_handle',[.032,.84,.05],[2.23,1.47,.12],bronze,pivot,.01);
  for(const y of [.7,2.35])box('Handle_mount',[.05,.025,.09],[2.23,y,.10],bronze,pivot,.006);
  for(const y of [.4,1.55,2.7])cyl('Door_hinge',.032,.032,.16,[0,y,0],bronze,pivot);
  box('Threshold',[2.6,.045,.7],[0,.105,5.2],bronze);
  // Original logo is applied verbatim to this fixed architectural plaque at runtime.
  box('Logo_plaque_back',[1.36,1.36,.07],[-2.29,2.20,5.30],bronze);
  const plaque=mesh(new THREE.PlaneGeometry(1.27,1.27),mat('Original_logo',0xffffff,.55),'OriginalLogo');
  // glTF uses top-left texture coordinates. Both runtime and Blender import agree.
  const logoUV=plaque.geometry.attributes.uv;for(let i=0;i<logoUV.count;i++)logoUV.setY(i,1-logoUV.getY(i));
  plaque.position.set(-2.29,2.20,5.344);
  box('Sign_light',[1.28,.022,.075],[-2.29,2.93,5.37],warm);
  const signage=createBrandWordmark(bronze,resources);signage.world.name='EntryTHARA';signage.world.scale.setScalar(.16);signage.world.position.set(-2.29,1.24,5.29);root.add(signage.world);
  // Clear passage remains x[-1.2,1.2], z[5,0]. Storage and console outside it.
  box('Foyer_partition',[.18,3.45,4.1],[2.30,1.8,2.45],plaster);
  for(let i=0;i<12;i++)box('Hall_screen',[.065,3.1,.1],[2.14,1.68,4.34-i*.19],walnut);
  box('Entry_console',[.48,.11,2.1],[1.82,.88,2.95],walnut);
  box('Console_leg',[.25,.77,.13],[1.82,.48,2.07],walnut);
  box('Console_leg',[.25,.77,.13],[1.82,.48,3.84],walnut);
  // Interior ceiling panels and warm recessed line lights.
  box('Ceiling',[15.4,.06,10.5],[0,3.77,-.3],plaster);
  for(let z=-4.8;z<4.5;z+=.22)box('Ceiling_batten',[4.2,.04,.07],[-4.9,3.72,z],walnut,root,.008);
  for(const x of [-1.5,1.55,6])box('Recess_light',[.025,.015,7.9],[x,3.722,-.3],warm,root,0);
  // Rear glazing frames the pool; open central sliding door gives a true sight line.
  for(const x of [-7.5,-4.8,-2.3,2.3,4.8,7.5])box('Rear_mullion',[.048,3.5,.1],[x,1.84,-5.5],frame);
  for(const x of [-6.14,-3.55,3.55,6.14])box('Rear_glass',[2.45,3.38,.014],[x,1.84,-5.53],glass,root,0);
  for(const y of [.14,3.54])box('Rear_track',[15.4,.045,.16],[0,y,-5.5],frame);
  // Real folded curtain geometry instead of flat planes.
  for(const cx of [-7.15,6.95]){
    const g=new THREE.PlaneGeometry(1.05,3.30,32,12);const a=g.attributes.position;
    for(let i=0;i<a.count;i++)a.setZ(i,Math.sin(a.getX(i)*36)*.085);
    g.computeVertexNormals();const m=mesh(g,linen,'Curtain');m.position.set(cx,1.9,-5.22);m.material=linen.clone();m.material.side=THREE.DoubleSide;
  }
  // Woven rug, sectional sofa with individual cushions, piping and turned legs.
  box('Rug',[5.75,.024,4.1],[-3.65,.112,-1.87],linen,root,.01);
  function sofa(x,z,rotation=0){
    const s=new THREE.Group();s.name='Linen_sofa';s.position.set(x,0,z);s.rotation.y=rotation;root.add(s);
    box('Sofa_base',[3.1,.29,1.04],[0,.41,0],linen,s,.12);
    box('Sofa_back',[3.1,.68,.24],[0,.85,-.43],linen,s,.1);
    for(const sx of [-1.47,1.47])box('Sofa_arm',[.24,.51,1.02],[sx,.66,0],linen,s,.09);
    for(const sx of [-.94,0,.94]){
      box('Seat_cushion',[.88,.17,.80],[sx,.625,.055],linen,s,.06);
      const c=box('Back_cushion',[.87,.5,.17],[sx,.91,-.245],linen,s,.07);c.rotation.x=-.13;
    }
    for(const sx of [-1.16,1.16])for(const sz of [-.35,.34])cyl('Sofa_foot',.027,.036,.16,[sx,.17,sz],walnut,s);
    const pillow=box('Olive_cushion',[.48,.46,.13],[-1.03,.93,-.06],olive,s,.08);pillow.rotation.z=.18;
  }
  sofa(-4.10,-3.22);sofa(-5.63,-.97,Math.PI/2);
  // Sculptural low travertine table, books and vase.
  box('Coffee_table_top',[1.75,.12,1.05],[-3.29,.52,-1.55],travertine,root,.13);
  for(const x of [-3.80,-2.78])box('Coffee_table_pedestal',[.24,.33,.61],[x,.30,-1.55],travertine,root,.05);
  box('Book',[.37,.033,.29],[-3.58,.61,-1.42],dark);
  const book=box('Book',[.34,.027,.27],[-3.56,.64,-1.40],linen);book.rotation.y=.16;
  lathe('Bud_vase',[[0,0],[.09,0],[.12,.1],[.08,.21],[.04,.27],[.04,.32]],[-3.06,.59,-1.68],ceramic);
  // Two lounge chairs: curved shells and linen seats.
  for(const z of [-.6,-2.35]){
    const chair=new THREE.Group();chair.position.set(-.72,0,z);chair.rotation.y=-Math.PI/2;root.add(chair);
    box('Lounge_seat',[.8,.16,.77],[0,.55,0],linen,chair,.10);
    box('Lounge_back',[.82,.48,.18],[0,.88,-.35],linen,chair,.1);
    for(const x of [-.43,.43]){box('Chair_arm',[.07,.07,.85],[x,.76,0],walnut,chair,.03);for(const zz of [-.3,.3])box('Chair_leg',[.05,.62,.05],[x,.37,zz],walnut,chair,.015);}
  }
  // Dining area to the right, avoiding the entry route.
  box('Dining_top',[2.6,.095,1.1],[4.50,.86,-2.2],walnut,root,.1);
  for(const x of [3.72,5.28])box('Dining_pedestal',[.20,.71,.70],[x,.46,-2.2],walnut,root,.04);
  for(const x of [3.6,4.5,5.4])for(const z of [-3.1,-1.3]){
    box('Dining_seat',[.52,.09,.5],[x,.56,z],linen,root,.07);
    box('Dining_back',[.55,.38,.085],[x,.83,z+(z< -2?-.22:.22)],walnut,root,.06);
    for(const dx of [-.19,.19])for(const dz of [-.18,.18])box('Dining_leg',[.027,.42,.027],[x+dx,.31,z+dz],walnut,root,.005);
  }
  cyl('Pendant_stem',.008,.008,1.10,[4.5,3.20,-2.2],bronze);
  const pendant=mesh(new THREE.SphereGeometry(.52,32,16,0,Math.PI*2,0,Math.PI/2),bronze,'Pendant_shade');pendant.position.set(4.5,2.66,-2.2);
  // Pool, recessed water, limestone coping, quiet in-water steps.
  box('Arrival_reflecting_pool',[5.1,.22,2.85],[-5.75,.015,11.8],dark);
  box('Arrival_pool_water',[4.74,.02,2.48],[-5.75,.14,11.8],water,root,0);
  for(const z of [10.45,13.15])box('Arrival_pool_edge',[5.15,.12,.20],[-5.75,.19,z],travertine);
  for(const x of [-8.23,-3.27])box('Arrival_pool_edge',[.20,.12,2.85],[x,.19,11.8],travertine);
  box('Pool_basin_floor',[11.9,.12,6.5],[0,-.50,-11.1],dark);
  for(const z of [-7.94,-14.26])box('Pool_basin_wall',[11.9,.61,.12],[0,-.18,z],dark);
  for(const x of [-5.89,5.89])box('Pool_basin_wall',[.12,.61,6.5],[x,-.18,-11.1],dark);
  box('Pool_water',[11.4,.02,6.05],[0,.10,-11.1],water,root,0);
  for(const z of [-7.96,-14.23])box('Pool_coping',[12.3,.14,.26],[0,.15,z],travertine);
  for(const x of [-6.02,6.02])box('Pool_coping',[.26,.14,6.5],[x,.15,-11.1],travertine);
  for(let i=0;i<3;i++)box('Pool_step',[1.6,.10,.4],[4.48,.06-i*.08,-8.35-i*.4],travertine);
  for(let i=0;i<38;i++)box('Pool_drain',[.10,.01,.24],[-5.7+i*.31,.235,-7.65],frame,root,0);
  // Low garden enclosure and rear pergola makes a coherent outdoor room.
  box('Garden_wall',[25,1.55,.30],[0,.65,-18],limestone);
  for(const x of [-11.8,11.8])box('Side_garden_wall',[.3,1.55,36],[x,.65,0],limestone);
  for(const x of [-8,8])for(const z of [-7,-16])box('Pergola_post',[.12,3.1,.12],[x,1.66,z],walnut);
  for(const x of [-8,8])for(let z=-16;z<-6.7;z+=.35)box('Pergola_slat',[2.45,.12,.09],[x,3.18,z],walnut);
  for(const x of [-8,8])for(const z of [-10,-13]){
    box('Lounger_frame',[.9,.11,1.95],[x,.34,z],walnut);
    box('Lounger_cushion',[.83,.12,1.76],[x,.46,z],linen,root,.055);
    const b=box('Lounger_back',[.83,.12,.58],[x,.65,z-.72],linen,root,.055);b.rotation.x=-.45;
  }
  // Terracotta/bronze lanterns and planting beds in the foreground.
  for(const x of [-4.1,4.1])for(const z of [8.6,11]){
    box('Lantern_base',[.2,.035,.2],[x,.13,z],bronze);
    box('Lantern_glow',[.105,.20,.105],[x,.25,z],warm);
    for(const dx of [-.085,.085])for(const dz of [-.085,.085])box('Lantern_bar',[.012,.3,.012],[x+dx,.29,z+dz],frame,root,0);
  }
  for(const x of [-6.5,6.5]){
    box('Planter',[2.3,.60,3.6],[x,.26,8.2],limestone,root,.03);
    box('Planter_earth',[2.12,.04,3.42],[x,.58,8.2],soil);
  }
  function palm(x,z,height){
    const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(x,.2,z),new THREE.Vector3(x+.05,height*.5,z),new THREE.Vector3(x+.30,height,z-.15)]);
    mesh(new THREE.TubeGeometry(curve,12,.085,7,false),walnut,'Palm_trunk');
    for(let k=0;k<9;k++){
      const angle=k*Math.PI*2/9;const verts=[];
      for(let j=0;j<18;j++){
        const t=j/18;const r=t*2.15;const yy=height+.34*Math.sin(t*Math.PI)-t*.65;
        for(const side of [-1,1]){
          const w=.29*Math.sin((t+.07)*Math.PI)*side;
          const p=(rr,ww,y)=>[x+.3+Math.cos(angle)*rr-Math.sin(angle)*ww,y,z-.15+Math.sin(angle)*rr+Math.cos(angle)*ww];
          verts.push(...p(r,0,yy),...p(r+.10,0,yy-.03),...p(r-.13,w,yy-.14));
        }
      }
      const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.computeVertexNormals();g.setAttribute('uv',new THREE.Float32BufferAttribute(new Float32Array(verts.length/3*2),2));mesh(g,k%2?leaf:leafLight,'Palm_frond');
    }
  }
  for(const [x,z,h] of [[-9.6,4,5.2],[9.6,2,5.8],[-9.2,-16,4.8],[9,-16,5.2],[-6.5,8,3.1],[6.5,8,3.4]])palm(x,z,h);
  // Low ornamental grasses and smooth stones, deterministic placement.
  for(let i=0;i<65;i++){
    const x=(i%2?-1:1)*(5.75+((i*7)%14)*.10),z=6.8+((i*11)%25)*.11;
    const g=new THREE.ConeGeometry(.06,.45+(i%4)*.09,4);const m=mesh(g,i%3?leaf:leafLight,'Grass');m.position.set(x,.84,z);m.rotation.z=Math.sin(i)*.3;
  }
  // Interior sign is a real, separate mesh composition for the match transition.
  const inside=createBrandWordmark(bronze,resources);inside.world.name='InteriorTHARA';inside.world.position.set(3.55,2.35,-5.36);inside.world.scale.setScalar(.22);root.add(inside.world);
  box('Interior_sign_rail',[2.35,.025,.032],[3.55,2.19,-5.43],bronze);
  for(const x of [2.56,4.54])box('Interior_sign_mount',[.04,.10,.10],[x,2.19,-5.45],bronze);
  // Consolidate static objects by material. Door, signs and original logo stay named.
  const buckets=new Map();root.updateMatrixWorld(true);
  const allMeshes=[];root.traverse(o=>{if(o.isMesh)allMeshes.push(o);});
  root.userData.collisionVolumes=allMeshes.filter(o=>/Facade_(left|right|sign|window)|Door_header|Left_return|Right_return|Roof$|Ceiling$|Foyer_partition/.test(o.name)).map(o=>{const b=new THREE.Box3().setFromObject(o);return {name:o.name,min:b.min.toArray(),max:b.max.toArray()};});
  for(const o of allMeshes){
    let moving=false;for(let parent=o.parent;parent&&parent!==root;parent=parent.parent){if(['DoorPivot','EntryTHARA','InteriorTHARA'].includes(parent.name)){moving=true;break;}}
    if(moving||o.name==='OriginalLogo'||o.material.transparent)continue;
    const transformed=o.geometry.clone().applyMatrix4(o.matrixWorld);
    const g=transformed.index?transformed.toNonIndexed():transformed;
    const list=buckets.get(o.material)||[];list.push(g);buckets.set(o.material,list);o.removeFromParent();o.geometry.dispose();
  }
  for(const [material,geometries] of buckets){const merged=mergeGeometries(geometries,false);if(!merged)throw Error('Cannot merge '+material.name);mesh(merged,material,'Static_'+material.name);geometries.forEach(g=>g.dispose());}
  return {root,materials};
}
