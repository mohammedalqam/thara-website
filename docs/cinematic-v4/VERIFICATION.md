# THARA homepage — implementation and verification

Review date: 9 October 2026. Runtime reviewed: `c5a2c7fa9ef6e7304e98cb01cb5dfd45eb97ee22`, branch `design/thara-cinematic-v4`.

The homepage is implemented and available on an isolated preview. **Release acceptance remains open:** the available cloud Chrome cannot create WebGL2 (`GL_VENDOR` / `GL_RENDERER Disabled`). Actual realtime architectural quality, shaders, GPU lifecycle and 60/30 fps targets have not been verified. The draft PR must remain unmerged until those gates pass. Production `main` and the live custom domain are unchanged.

Preview reviewed: https://thara-cinematic-preview-1hrrw9w04-tahsil1.vercel.app/

Draft PR: https://github.com/mohammedalqam/thara-website/pull/6

## What is implemented

The existing static HTML/CSS/JavaScript stack remains. Homepage styles are scoped to `.thara-home-v4`; new modules do not change protected shared functions or villa/services/legal pages. The opening chapter uses a connected custom GLB, original entrance-logo plaque, bronze signage, a curved camera path with independent gaze, and a real hinged door. A single request-driven Three.js renderer serves the villa and five independent beveled T/H/A/R/A meshes. Their poses are deterministic functions of native scroll and measured section anchors.

The full homepage retains its original information and photographs: navigation, introductory advantages, stay imagery, featured villa, owner services, complete statement, gallery, reasons, booking steps, team, inquiry, final call to action and footer. Typography, controls, composition and reserved letter margins form one design system. The conceptual villa is labelled as a brand scene, not an available rental property.

## Verified results and limits

| Check | Result | Evidence / practical limit |
| --- | --- | --- |
| Build and syntax | Pass | Bundled homepage; `check:cinematic` and shared `check` passed. |
| Automated checks | 27 passed, 0 failed | `automated-checks.txt`. Includes original content contracts, new fragment/reload behavior, collision and letter-bound checks; older scene-fixture tests are regression checks, not V4 GPU evidence. |
| Content preservation | Pass | Baseline compares 39 IDs, original headings/links/messages/form options, 10 gallery triggers, original asset hashes and 16 protected shared/page files. |
| Camera/door geometry | Pass in calculation | 1,001 path samples × 5 aspects; passage clearance and continuous poses. Actual WebGL clipping/lighting remain open. |
| Letter routes | Pass in calculation | 101 progress samples × 7 viewport/orientation pairs; independent named nodes, safe lanes and LTR reassembly. Actual canvas appearance remains open. |
| Responsive layout | Pass in browser | 12 layout cases; no horizontal overflow, out-of-bounds content or broken loaded images. CSS iframe viewports, not real mobile devices. See `browser-layout-results.json`. |
| Explicit fragments | Pass in browser | Direct `#featured` top 128px; `#contact` top 128px, under the fixed header. |
| Reload/history | Pass in browser | Manual scroll after `#featured`: y=3624 before/after reload. Back restores y=3624; forward restores `#contact` y=7903. `browser-flow-results.json`. |
| Inquiry | Pass in browser | Empty name rejected and focused; invalid guest count rejected in earlier review. Desktop pointer submit and phone keyboard submit generate three correct encoded WhatsApp URLs. No WhatsApp link was opened and no message sent. |
| Gallery | Pass in browser / touch regression | Next/previous update image and counter, Escape closes, focus returns, Tab stays inside. Touch swipes pass the existing-handler synthetic test; real-device finger gestures remain untested. |
| Mobile menu | Pass in browser | Open/close, Escape, focus return and link selection verified. |
| Reduced motion | Pass for manual preference and review state | Static composition, short chapter, saved preference after reload; heavy scene import skipped on reduced initial load. OS media preference handled by code/tests; actual OS setting was not changed. |
| No WebGL | Pass in browser | Poster and HTML content remain available; actual context failure and explicit `?scene=off` reviewed. |
| No JavaScript | Pass in browser | Sandbox blocks scripts; navigation visible, inert inquiry hidden, direct team-contact note/links available. Original images and text remain. |
| Model-load failure / context loss | Not accepted | Implemented recovery, but this browser fails its WebGL probe before reaching `?model=fail`; no valid GPU context can be lost here. |
| Console / resources | Limited pass | No first-party console errors or broken loaded images observed in reviewed fallback/functional flows. Browser-extension metadata errors excluded. GPU shader errors and complete live asset transfer remain untested. |
| Idle drawing / disposal / memory | Implementation reviewed; GPU gate open | No independent animation clock; observers/listeners/resources are released in code. No actual GPU memory or leak measurements available. |

The 12 browser layout cases are 320×640, 390×844, 768×1024, 1024×768, 1440×900 and 1920×1080, followed by orientation samples 640×320, 844×390, 1024×768, 1024×768, 1440×900 and 1920×1080. The desktop samples are already landscape; the second pass does not represent a different hardware orientation. RTL scrollbar width is excluded from content bounds.

## Measured asset sizes

| Asset | File bytes | Local gzip estimate |
| --- | ---: | ---: |
| Connected villa GLB | 1,978,788 | 384,853 |
| Exported five-letter GLB | 143,872 | 25,189 |
| Homepage Three.js bundle | 613,915 | 159,212 |
| Progressive bootstrap | 3,154 | 1,335 |
| Desktop poster | 54,936 | 54,690 |
| Phone poster | 22,470 | 22,395 |

Gzip values are local estimates, not measured Vercel transfer. The homepage creates the letters from the same source rather than downloading the exported letter-review GLB.

Native indexed geometry reduced the villa from 4,429,576 to 1,978,788 bytes (55.3%) without a runtime decoder. The model has 58 meshes and 46,206 triangles. Expanded triangle position/normal/UV comparison checked 1,108,944 values with maximum error 3.33e-16; see `geometry-equivalence.json`. This confirms geometry equivalence, not realtime material quality.

One renderer is reused. Device pixel ratio caps are 1.5 desktop and 1.25 phone; shadow maps are 2048/1024. Frame submission counters in `data-render-stats` expose calls, triangles and CPU submission time. **Those counters are not GPU frame-rate measurements.** Desktop ~60 fps, phone ~30 fps, actual GPU memory and idle frame behavior remain unmeasured.

## Visual evidence

`review.html` presents all retained frames with their evidence type. Browser screenshots show the actual homepage/fallback, genuine featured-villa photographs, the inquiry and phone layout. Their source commits are recorded in the captions.

The exterior, entrance, threshold, interior, interior-sign and desktop/phone letter frames in `renders/` were rendered in Blender 4.3.2 Cycles on CPU from the actual exported geometry and supplied camera poses. They are **offline architectural renders, not WebGL screenshots**; lighting and procedural micro-texture differ from the realtime renderer. Indexed geometry equivalence preserves their geometric validity. They do not close architectural acceptance in WebGL.

The approved original 1024px JPEG logo remains unchanged. An original SVG/AI/PDF is still missing and would improve exact extruded-wordmark fidelity. Sources and licensing are recorded in `assets/cinematic/SOURCES.md` and `THIRD_PARTY_NOTICES.txt`.

## Reproduce and close the remaining release gate

1. `npm ci`, `npm run build:cinematic`, `npm run check:cinematic`, `npm run check`, `npm test`.
2. Serve the repository as a static root, or open the isolated preview on WebGL2-capable Chrome/Safari. Use `cinematic-review.html` for section jumps, sizes and fallback cases; `cinematic-study.html` for shot inspection.
3. Inspect all six shots forward/backward, logo orientation/readability, doorway clearance, interior lighting and match cut. Inspect all five letters through content and final reassembly at desktop and phone widths.
4. Confirm scene-ready sticky timing, mid-scene reload with and without a hash, viewport/orientation change, natural keyboard/touch scrolling and BFCache after full GPU loading.
5. Exercise `?model=fail`, context loss, hidden/out-of-screen suspension and repeated navigation. Check live resource errors and actual resource cleanup.
6. Record desktop and medium-phone frame times, transfer, peak GPU resources and idle renders with hardware/browser/version. Adjust quality only against that evidence; do not substitute CPU submission time or software rendering for real-device performance.
7. Close those gates before merging or deploying to the live site. No production publication was performed in this work.
