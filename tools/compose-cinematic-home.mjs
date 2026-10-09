import fs from 'node:fs';
import { JSDOM } from 'jsdom';

// Keep the complete existing DOM for property data, links, team and forms.
const dom=new JSDOM(fs.readFileSync('tests/fixtures/home-v3.html','utf8'));
const d=dom.window.document;
d.body.classList.replace('thara-home-v3','thara-home-v4');
d.querySelector('meta[name="theme-color"]').content='#F3EFE6';
d.querySelector('link[href^="home-design.css"]').setAttribute('href','cinematic-home.css?v=4.0');
const layout=d.createElement('link');layout.rel='stylesheet';layout.href='cinematic-layout.css?v=4.0';d.head.append(layout);
d.querySelector('link[rel="preload"]').href='assets/cinematic/poster-desktop.webp';
const hero=d.querySelector('#home');
const content=hero.querySelector('#heroContent').outerHTML.replace('class="hero-content"','class="hero-content" data-hero-copy');
const foot=hero.querySelector('.hero-footnote').outerHTML;
hero.className='cinematic-hero';hero.setAttribute('data-villa-chapter','');hero.setAttribute('data-scene-state','static');
hero.innerHTML=`
  <div class="cinematic-hero-stage">
    <picture class="cinematic-poster" aria-hidden="true"><source media="(max-width:759px)" srcset="assets/cinematic/poster-mobile.webp"><img src="assets/cinematic/poster-desktop.webp" alt="" width="1600" height="1000" fetchpriority="high"></picture>
    <div class="cinematic-vignette" aria-hidden="true"></div>
    ${content}
    <div class="cinematic-toolbar">
      <a class="scene-skip" href="#intro">تجاوز المشهد <span aria-hidden="true">↓</span></a>
      <button type="button" class="motion-toggle" data-motion-toggle aria-pressed="false">تقليل الحركة</button>
    </div>
    <div class="cinematic-caption"><span data-shot-caption>01 / حجر، ضوء، ووقت إلك</span><span data-scene-status role="status">اكتشف المكان، على مهلك</span></div>
    <p class="concept-note">تصوّر معماري لهوية THARA؛ ليس عقارًا متاحًا للحجز.</p>
    ${foot}
  </div>`;
const story=d.querySelector('#tharaStory');story.className='cinematic-story';story.removeAttribute('data-brand-story');
story.innerHTML=`
  <div class="cinematic-story-heading"><p class="eyebrow">ثرى. مساحة إلَك.</p><h2 id="brandStoryTitle">خذ وقتك.<br><span>هذا المكان إلك.</span></h2></div>
  <div class="letter-band letter-band-start" data-letter-start aria-hidden="true"><span class="letter-fallback" dir="ltr">THARA</span><span class="letter-band-rule"></span></div>
  <div class="cinematic-story-footer"><p>من أول تواصل، لآخر لحظة بالعطلة.<br>تفاصيل بنهتم فيها، عشان إنت تروق.</p><a class="text-link" href="villas.html">شوف الفلل <span aria-hidden="true">←</span></a></div>
  <div class="story-contact-sheet" aria-hidden="true"><figure><img src="assets/IMG_6875.webp" alt="" loading="lazy" width="1512" height="2016"><figcaption dir="ltr">ROOM TO BREATHE</figcaption></figure><figure><img src="assets/IMG_4601.webp" alt="" loading="lazy" width="1512" height="2016"><figcaption dir="ltr">TIME FOR YOU</figcaption></figure><figure><img src="assets/IMG_4623.webp" alt="" loading="lazy" width="1512" height="2016"><figcaption>مساحة إلك. التفاصيل الصغيرة.</figcaption></figure></div>
  <p class="cinematic-story-note" dir="ltr">THARA REAL ESTATES · JERICHO, PALESTINE</p>`;
const layer=d.createElement('div');layer.className='cinematic-layer';layer.setAttribute('data-cinematic-layer','');layer.setAttribute('aria-hidden','true');layer.hidden=true;d.querySelector('main').before(layer);
const final=d.querySelector('.final-cta');
const band=d.createElement('div');band.className='letter-band letter-band-end';band.setAttribute('data-letter-end','');band.setAttribute('aria-hidden','true');band.innerHTML='<span class="letter-fallback" dir="ltr">THARA</span><span class="letter-band-rule"></span>';final.before(band);
const bootstrap=d.createElement('script');bootstrap.src='home-bootstrap.js?v=4.0';bootstrap.defer=true;d.body.append(bootstrap);
// Correct actual dimensions without altering any original asset.
const dimensions=JSON.parse(fs.readFileSync('docs/cinematic-v4/image-dimensions.json','utf8'));
d.querySelectorAll('img[src]').forEach(img=>{const size=dimensions[img.getAttribute('src')];if(size){img.width=size[0];img.height=size[1];}});
d.querySelectorAll('.team-info p,.brand-main,.brand-small,.brand-mark,.featured-number,.why-number,.experience-step>span,.featured-specs strong,.footer-wordmark').forEach(n=>n.setAttribute('dir','ltr'));
d.querySelectorAll('button.gallery-viewer').forEach(n=>n.setAttribute('aria-label',`تكبير الصورة: ${n.querySelector('img').alt}`));
fs.writeFileSync('index.html',dom.serialize()+'\n');
