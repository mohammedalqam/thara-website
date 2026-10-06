# THARA Real Estates

Arabic villa catalog and owner services website, served directly from `main` by GitHub Pages.

## Homepage design V3

`home-design.css` scopes the stone, deep green and bronze composition to the homepage. It restyles every existing section while preserving property information, forms, contact choices and real photographs. The full section map, material direction, motion rules and staged acceptance criteria are in `docs/homepage-design-plan-v3.md`.

The new entrance is an architectural photo portal built from separate CSS 3D planes: stone and bronze faces, a recessed real villa photograph, two floating photographic layers and a plinth. `src/home-scenes.js` handles bounded manual angles, day/evening decorative lighting, pause and a subtle pointer response. Lighting changes the frame rather than fabricating a different property photograph.

THARA uses closely spaced letter faces to produce visible bronze relief inside a bounded native-scroll chapter. `src/home-motion.js` supplies framing, bounded poses and lifecycle scheduling. Rendering sleeps while idle, hidden or off screen; CSS drift pauses in the same states. Reduced motion removes automatic movement and extended pinning. The page works without WebGL and loads only the small local `assets/home-scenes.js` module for its scenes.

Existing copy, property numbers, team contacts and form IDs remain unchanged. Image descriptions now match the photographs. Direct team WhatsApp links work without JavaScript; a no-script inquiry message points to the team. The inquiry form still creates three contact choices and does not send automatically.

## Shared styling and previous scenes

`premium.css` supplies the shared typography, charcoal/brass palette, responsive layout and motion fallbacks. `premium.js` adds keyboard navigation, reading progress, photographic depth and lazy scene loading. All seven existing pages share this layer; original gallery, villa filters, owner form and WhatsApp flows keep their existing scripts.

The previous **conceptual** villa source remains in `src/villa-scene.js` for history and recovery. It does not depict an available property and is no longer loaded by the V3 homepage. The previous scene supports lighting, angles, pause and bounds-based orthographic framing.

`src/brand-geometry.js` and `src/brand-scene.js` retain the earlier Three.js wordmark. The shared reduce-motion button stores a local preference and respects the system preference.

Both scenes use `src/scene-runtime.js`: 30 fps WebGL / 12 fps CPU SVG ceilings, capped pixel ratio, elapsed-time interpolation, no render loop while idle, off screen or hidden, BFCache suspension, and resource disposal on navigation. WebGL uses a locally generated studio reflection environment; no remote models, fonts or textures are needed for either sculpture. CPU villa rendering starts paused and uses explicit ground layers to prevent painter-order pool occlusion. A real villa photograph and a static THARA wordmark remain available when rendering fails.

## Build

Requires Node.js 18 or newer. Dependencies are pinned in `package-lock.json`.

```sh
npm ci
npm run build
npm run check
npm test
```

Commit `assets/home-scenes.js` alongside its source changes. The build also retains `assets/villa-scene.js` and its `.LEGAL.txt` for the previous scene. GitHub Pages does not need a build server or external CDN. Three.js's license is in `THIRD_PARTY_NOTICES.txt`.

## Browser checks before publishing

Check home lighting/pause/angle controls, fallback image, reduced motion, mobile navigation, all catalog filters and villa dialogs, gallery opening/closing, FAQs, and both inquiry forms. Form checks should stop at the generated WhatsApp contact links; do not send test messages to the team.

Current verification status is recorded in `docs/homepage-design-plan-v3.md`. Before release, check 320/390/768/1180px, no-script navigation, scene controls and reduced motion, gallery focus return, and generated inquiry links. Delete the temporary `design-preview.html` harness before merging a production release. The earlier deployment record is in `docs/design-development-plan.md`.

`tests/home-flows.test.js` runs the actual home and owner-page scripts against local HTML in an offline jsdom environment. It checks validation, encoded WhatsApp choices, editing requests, reduced motion, missing observer APIs, menu dismissal, gallery focus return, and the portal/THARA control handlers. External resources are disabled and `window.open` is intercepted. Synthetic scene geometry tests event behavior, not CSS layout; these tests do not replace the browser release checks. `owners.js` uses the motion preference helper from `script.js`, which loads first on the owner page.

## Rollback

The pre-redesign main commit is `3011cbf5653f6f3d21b4a41a3229007730826848`. Revert the design commit normally if needed; do not force-push `main`.
