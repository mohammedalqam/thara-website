import fs from 'node:fs';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { JSDOM } from 'jsdom';

// Capture once before redesign. Preserve this snapshot as the acceptance baseline.
const target = 'docs/cinematic-v4/baseline-content.json';
if (fs.existsSync(target)) throw new Error('Baseline exists; do not overwrite the original content contract.');
const document = new JSDOM(fs.readFileSync('index.html', 'utf8')).window.document;
const text = node => node.textContent.replace(/\s+/g, ' ').trim();
const attrs = node => Object.fromEntries([...node.attributes].map(a => [a.name, a.value]));
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const protectedFiles = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).trim().split('\n')
  .filter(p => /^(about|contact|faq|privacy|terms|villas)\.html$|^(owners|pages|premium|villas|script)\.js$|^(style|stylevillas|owners|pages|premium)\.css$/.test(p));
const baseline = {
  sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  capturedAt: new Date().toISOString(),
  sections: [...document.querySelectorAll('main > section')].map(s => ({ id:s.id, class:s.className, text:text(s) })),
  headings: [...document.querySelectorAll('h1,h2,h3')].map(s => ({tag:s.tagName,text:text(s)})),
  links: [...document.querySelectorAll('a')].map(a => ({ text:text(a), ...attrs(a) })),
  images: [...document.querySelectorAll('img')].filter(a=>a.getAttribute('src')).map(attrs),
  ids: [...document.querySelectorAll('[id]')].map(n=>n.id),
  form: [...document.querySelectorAll('form input,form select,form textarea')].map(n=>({...attrs(n),options:[...n.querySelectorAll('option')].map(o=>({value:o.value,text:text(o)}))})),
  whatsapp: [...document.querySelectorAll('[data-whatsapp-number]')].map(n=>({number:n.dataset.whatsappNumber,message:n.dataset.message||null,href:n.getAttribute('href')})),
  gallery: [...document.querySelectorAll('.gallery-viewer')].map(n=>({src:n.dataset.full,alt:n.querySelector('img')?.alt})),
  protectedFiles: Object.fromEntries(protectedFiles.map(p=>[p,hash(p)])),
  originalAssets: Object.fromEntries(execFileSync('git',['ls-files','assets'],{encoding:'utf8'}).trim().split('\n').filter(p=>/\.(webp|jpe?g|png)$/i.test(p)).map(p=>[p,{bytes:fs.statSync(p).size,sha256:hash(p)}]))
};
fs.mkdirSync('docs/cinematic-v4',{recursive:true});
fs.writeFileSync(target,JSON.stringify(baseline,null,2)+'\n');
console.log(JSON.stringify({sections:baseline.sections.length,links:baseline.links.length,images:baseline.images.length,uniqueImages:new Set(baseline.images.map(x=>x.src)).size,ids:baseline.ids.length,formFields:baseline.form.length,whatsapp:baseline.whatsapp.length,gallery:baseline.gallery.length,protectedFiles:protectedFiles.length}));
