# THARA Real Estates

Arabic villa catalog and owner services website, served directly from `main` by GitHub Pages.

## Architectural design

`premium.css` supplies the shared typography, charcoal/brass palette, responsive layout and motion fallbacks. `premium.js` adds keyboard navigation, reading progress, photographic depth and lazy scene loading. All seven existing pages share this layer; original gallery, villa filters, owner form and WhatsApp flows keep their existing scripts.

The home page's **conceptual** villa is generated with local Three.js geometry in `src/villa-scene.js`. It does not depict an available property; real catalog photographs are shown immediately below it. The scene has day/evening lighting, angle and pause controls, a 30 fps cap, bounded device pixel ratio, and no render loop while off screen or in a hidden tab. Reduced motion starts it paused. When WebGL is disabled, a CPU-projected SVG version of the same 3D scene starts paused and is capped at 12 fps if motion is enabled. A real villa photograph remains visible when both renderers or the bundle are unavailable.

## Build

Requires Node.js 18 or newer. Dependencies are pinned in `package-lock.json`.

```sh
npm ci
npm run build
npm run check
```

Commit `assets/villa-scene.js` and its `.LEGAL.txt` alongside source changes. GitHub Pages does not need a build server or external CDN. Three.js's license is in `THIRD_PARTY_NOTICES.txt`.

## Browser checks before publishing

Check home lighting/pause/angle controls, fallback image, reduced motion, mobile navigation, all catalog filters and villa dialogs, gallery opening/closing, FAQs, and both inquiry forms. Form checks should stop at the generated WhatsApp contact links; do not send test messages to the team.

## Rollback

The pre-redesign main commit is `3011cbf5653f6f3d21b4a41a3229007730826848`. Revert the design commit normally if needed; do not force-push `main`.
