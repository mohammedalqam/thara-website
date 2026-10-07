# Checkpoint — 2026-10-07

## Work completed

- Inspected repository base `3bc1b89634e0c3078d10c60f739fa63ea250853b`, its existing CSS scene implementation, old unused Three.js model, source/build setup, shared behaviors and all homepage content.
- Created the isolated remote branch `design/thara-cinematic-v4`.
- Committed the execution plan and immutable original-content snapshot (`eb4b48cfe35582bd191ebcd1c05a104d5bfac5b0`).
- Snapshot contains 13 main sections, 54 links, 24 image elements using 14 unique images, 39 IDs, 5 inquiry fields, 18 WhatsApp targets, 10 gallery triggers and 16 protected HTML/shared source files.
- Inspected the unmodified 1024×1024 logo and recorded the lack of vector logo, existing GLB/glTF and PBR/HDR assets.
- Viewed the live homepage in the cloud browser. It matches the audited V3 CSS portal. Captured `baseline-desktop.jpg` at a 1363×936 browser viewport; content scroll width was 1348, without horizontal overflow at that viewport. Not a mobile or new-3D acceptance result.
- Existing syntax checks and 21 tests passed. These exercise existing functions and lifecycle behavior; they do not establish new scene visual quality.
- Authored a connected original courtyard-villa study, physical entry door with a named hinge, original-logo wall plaque, interior hallway, seating/dining, glass/curtains and pool terrace. Geometry exported to a genuine GLB, source retained.
- Added `cinematic-study.html` and a standalone local bundle for four shot checkpoints plus a progress slider. This is an inspection harness, not the final homepage interaction.
- Study source, bundle, model and baseline screenshot committed remotely at `3065aaa898c33041510896c65d27b9ebf02d6daf`.

## Measured model/build facts

- GLB: 4,145,824 bytes; 101 meshes; 43,194 triangles (authored scene traversal). Actual rendered draw-call and texture-memory numbers remain unmeasured.
- Study JavaScript bundle: 577,315 bytes before HTTP compression.
- No runtime model-texture downloads outside the repository. Existing Google fonts remain part of the unchanged homepage.
- Rendering is request-driven in the study; idle behavior has not yet been browser-verified.

## Concrete preview blocker

- Local Playwright Chromium executable was absent. Official browser installation failed because the downloaded archive was invalid/truncated. No local WebGL evidence exists.
- Cloud browser can inspect the public live site, but cannot reach the workspace's localhost server (`ERR_CONNECTION_REFUSED`). Local file URLs are blocked by the browser URL policy; no workaround is to be used for that blocked action.
- The Vercel connection lists no THARA project. Creating the explicitly separate preview project `thara-cinematic-preview` in the available team `tahsil1` returned `403 forbidden: You don't have permission to create a project`.
- No authenticated Vercel CLI was available as a supported fallback. Existing unrelated projects must not be repurposed.
- Next recovery: user-approved browser fallback for creating the separate Vercel preview, or a pre-created preview project accessible to the connector. Keep production GitHub Pages and its branch/configuration unchanged.

## Honest stage status

| Stage | Status |
| --- | --- |
| 1 — source/content audit, isolation, written plan | Source work done; desktop baseline recorded; mobile baseline still pending |
| 2 — architectural storyboard and scene quality | First real model and inspection harness implemented; visual acceptance blocked |
| 3 — final scroll-linked camera/door journey | Not implemented/accepted; study slider only |
| 4 — redesign homepage sections | Not started; existing homepage unchanged |
| 5 — independent letters across sections | Not implemented; entry/interior signs only |
| 6 — full viewport/flow/performance/fallback acceptance | Not run for new implementation |

Do not mark the architectural stage complete, use the old homepage screenshot as a new-scene proof, or publish to production. Next action after preview recovery: inspect exterior/entrance/interior on WebGL, fix visible model/material/camera defects, capture actual desktop/mobile frames, then continue in order.
