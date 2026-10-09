import fs from 'node:fs';
import { villaPose } from '../src/cinematic/timeline.js';
const out=[];
for(const [name,p,w,h] of [['exterior',0,1600,1000],['entrance',.34,1440,900],['threshold',.54,1440,900],['interior',.8,1440,900],['sign',1,1440,900],['mobile-exterior',0,780,1200],['mobile-interior',.8,780,1200]]){
  const pose=villaPose(p,w/h);
  out.push({name,p,w,h,position:pose.position.toArray(),look:pose.look.toArray(),fov:pose.fov,door:pose.door});
}
fs.writeFileSync('docs/cinematic-v4/shot-poses.json',JSON.stringify(out,null,2)+'\n');
