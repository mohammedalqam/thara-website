# Cinematic homepage implementation checkpoint — 9 October 2026

The complete homepage composition is now wired to the new architecture and five-letter journey. Production `main` and every protected shared/page file remain untouched.

Implemented: connected custom villa GLB; a real door pivot; original logo plaque with corrected glTF UV orientation; a continuous curved camera path with monotone progress timing; native sticky scroll chapter; independent camera gaze; responsive perspectives; original photographs/data/forms/links; five named beveled letter nodes; dedicated content margins and assembly bands; persistent motion preference; static no-JS/reduced/WebGL/load-failure fallbacks; request-driven rendering, hidden-page suspension and disposal.

The letter X transition occurs entirely in assembly bands. Only after every letter enters its safe lateral lane does vertical spreading start. Reassembly reverses that sequence. Resizing recalculates the measured assembly anchors and preserves villa progress.

Verification so far: 26 Node tests pass. The new contract verifies all original protected files and images by hash, every ID/heading/link/message/form option and gallery count. Camera/door collision tests sample 1,001 points × 5 aspect ratios. Letter geometry bounds are tested over seven viewport/orientation pairs. These tests do not replace visual GPU testing.

Model statistics: GLB 1,978,788 bytes, 46,206 triangles, 58 meshes. One renderer is reused for both scenes. Pixel ratio caps: 1.5 desktop / 1.25 small screens. There is no free-running animation. Shader draw calls, actual GPU memory and 60/30 fps targets are not yet measured.

Preview infrastructure recovered: dedicated Vercel project `thara-cinematic-preview`, design branch only; no custom domain. First verified study deployment was Ready at commit `6c63dd6`. Full homepage browser review and native input checks now run on an isolated Ready deployment; the detailed verification report records the exact source.

**Known acceptance limit:** the cloud browser cannot create a WebGL2 context (GL_VENDOR and GL_RENDERER Disabled). We have actually rendered exterior/entrance/threshold/interior/sign/phone and letter geometry in Blender Cycles on CPU, but these are explicitly labelled offline architectural frames. Actual WebGL lighting, shaders, clipping, resource lifecycle and desktop/phone GPU frame-rate acceptance remain open. Do not merge the draft PR until those gates are closed.

The exact original vector logo (SVG/AI/PDF) is still missing. The original 1024px JPEG is mounted unchanged; no invented emblem replaces it.

Run locally: `npm ci`, `npm run build:cinematic`, `npm run check:cinematic`, `npm run check`, `npm test`, then serve the repository as a static root. `cinematic-review.html` provides the six layout widths, orientation samples and fallback states. For offline frames run the retained Blender scripts with Blender 4.3.2. Do not use those frames as realtime evidence.

Native indexed geometry reduced the GLB from 4,429,576 to 1,978,788 bytes (55.3%). Expanded triangle position/normal/UV comparisons checked 1,108,944 values with maximum error 3.33e-16. Mesh/material counts and all 46,206 triangles remain unchanged. See `geometry-equivalence.json`.
