# THARA Real Estates

Arabic villa catalog and owner services website, served directly from `main` by GitHub Pages.

## Architectural design

`premium.css` supplies the shared typography, charcoal/brass palette, responsive layout and motion fallbacks. `premium.js` adds keyboard navigation, reading progress, photographic depth and lazy scene loading. All seven existing pages share this layer; original gallery, villa filters, owner form and WhatsApp flows keep their existing scripts.

The home page's **conceptual** villa is generated with local Three.js geometry in `src/villa-scene.js`. It does not depict an available property; real catalog photographs follow the brand story. The scene has day/evening lighting, angle and pause controls, softened stone slabs, glazing and a recessed pool. Bounds-based orthographic framing contains the model at every supported angle without aspect-ratio jumps.

`src/brand-geometry.js` contains original Roman serif THARA outlines with bevelled extrusion. The wordmark follows native scrolling inside a bounded sticky story, turns and gently opens its letters, then releases before the real villa photographs. `src/brand-scene.js` renders only while scroll transitions are settling. The reduce-motion button stores a local preference and shares the system preference's behavior, including removal of extended pinning.

Both scenes use `src/scene-runtime.js`: 30 fps WebGL / 12 fps CPU SVG ceilings, capped pixel ratio, elapsed-time interpolation, no render loop while idle, off screen or hidden, BFCache suspension, and resource disposal on navigation. WebGL uses a locally generated studio reflection environment; no remote models, fonts or textures are needed for either sculpture. CPU villa rendering starts paused and uses explicit ground layers to prevent painter-order pool occlusion. A real villa photograph and a static THARA wordmark remain available when rendering fails.

## Build

Requires Node.js 18 or newer. Dependencies are pinned in `package-lock.json`.

```sh
npm ci
npm run build
npm run check
npm test
```

Commit `assets/villa-scene.js` and its `.LEGAL.txt` alongside source changes. GitHub Pages does not need a build server or external CDN. Three.js's license is in `THIRD_PARTY_NOTICES.txt`.

## Browser checks before publishing

Check home lighting/pause/angle controls, fallback image, reduced motion, mobile navigation, all catalog filters and villa dialogs, gallery opening/closing, FAQs, and both inquiry forms. Form checks should stop at the generated WhatsApp contact links; do not send test messages to the team.

The staged refinement plan and verification record are in `docs/design-development-plan.md`. The browser used for this release disables WebGL, so the visible CPU presentation was reviewed; physical GPU lighting/reflections still need a separate hardware review. Automated tests validate timing, geometry, framing and scheduling, not GPU shader appearance.

## Rollback

The pre-redesign main commit is `3011cbf5653f6f3d21b4a41a3229007730826848`. Revert the design commit normally if needed; do not force-push `main`.
