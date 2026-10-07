# THARA — cinematic homepage V4

Date: 2026-10-07. Base: `3bc1b89634e0c3078d10c60f739fa63ea250853b`.
Branch: `design/thara-cinematic-v4`. Production: GitHub Pages from `main`.

## Scope and release rule

Only the homepage and newly namespaced assets/modules change. Preserve all property details, original photos, contacts, WhatsApp messages, form/section IDs, social and legal links. Never merge or publish before the visual and functional gates pass. No new framework or paid assets are needed for the first architectural proof. No test messages will be sent.

The user story is: visitor opens the Arabic homepage → reads real service information immediately → scrolls a conceptual architectural entrance and a deterministic five-letter story → examines genuine property photographs → completes an inquiry → chooses one of three original WhatsApp contacts. The static website has no inquiry API or database submission; generating a contact link is the end of the tested flow.

## Findings from the actual repository

- Static HTML/CSS/JavaScript; esbuild 0.25.10, Three.js 0.180.0, jsdom 26.1.0 are already pinned.
- V3 hero is a photographic CSS perspective portal, with manual angle/theme/pause. This is not the requested interior camera journey.
- V3 brand chapter renders the complete word as stacked CSS text faces. It does not provide five independent letter trajectories across content.
- `src/villa-scene.js` is an unused older procedural miniature with an orthographic orbit. Its materials/furniture are schematic and its camera cannot satisfy the new entrance requirement as-is.
- `script.js` handles inquiry validation, contact pickers and the gallery; `premium.js` provides shared keyboard/focus and motion behavior. Keep them unchanged unless an integration defect strictly requires a fix. New scenes must not reuse old scene selectors that would double-mount.
- The current CSS cascade loads `style.css`, `owners.css`, `premium.css`, and `home-design.css`. New styles must be scoped by a unique homepage body class, with no global overrides affecting other pages.
- Available logo: `assets/logo.jpeg`, 1024 × 1024, 199,215 bytes; white background with original gold villa/root emblem and serif wordmark. No SVG or vector source is in the repository. Use the exact original as a mounted plaque; do not invent a new emblem. A clean original SVG/AI/PDF would improve fabrication-quality extruded signage and lettering fidelity.
- No GLB/glTF, PBR texture library, HDR environment, or measured architectural model is in the repository. The required villa must be newly authored as a conceptual brand scene, with its source retained and exported to glTF/GLB. It is not a listed property.
- Existing property photographs are mostly portrait 1512 × 2016 or 2142 × 2856. Do not assume the dimensions currently written in some HTML attributes are correct; correct intrinsic dimensions while retaining the originals. Team photographs are 1254 × 1254.

## Content inventory and retention contract

`baseline-content.json` records every current top-level section's complete text, headings, links/attributes, images, IDs, form inputs/options, WhatsApp numbers/messages, gallery targets, original image hashes and protected page/shared-file hashes.

| Area | Preserve |
| --- | --- |
| Header | Original logo; home, villas, owner services, featured, gallery, features, contact navigation; mobile menu IDs |
| Hero `home` | وقتٌ إلك. ومكان يليق فيك.; full description; discover/planning links; Jericho/Palestine location |
| Brand `tharaStory` | خذ وقتك. هذا المكان إلك.; supporting copy and villa link; motion preference |
| `intro` | فلل منتقاة / نختار بعناية; نظافة تامة / تنظيف يومي; تواصل مباشر / بدون تعقيد |
| Experience imagery | Pool, bedroom/hospitality, living room originals and three destination links |
| Featured `featured` | فيلا العاطفه; 3 bedrooms, 10 guests, 5 bathrooms; four original amenities; 4 gallery triggers; villas link and three contacts |
| Owners `ownersSpotlight` | Full owner-services copy; original IMG_4596.webp; owners-form, owners-services and owners-numbers links |
| Brand statement | المكان الجميل لا يملأ الصور فقط، بل يصنع الذكريات التي تبقى بعدها. |
| Gallery `gallery` | Six original gallery items, next/previous, touch navigation, Escape, focus return |
| Why `features` | Curated villas, real photos/details, direct contact and all original explanations |
| Booking steps | اختر الفيلا / تواصل معنا / استمتع with full copy |
| Team `contact` | نعيم — نائب ادارة الشركة — +972 58-400-3302; محمد — ادارة التسويق والاعلان — +972 53-212-1036; مجد — ادارة الحجوزات — +972 58-442-9998; original photos and messages |
| Inquiry | `homeInquiryForm`, Name, Date, Guests, Rooms, Notes, Contacts IDs; rooms unspecified/3/4; only name required; validate optional entries; generate three encoded links without opening/sending |
| Final/footer | Existing CTA, all navigation, privacy, terms, five social options, location, copyright and original contact pickers |

No existing fact is silently corrected, removed or expanded. Existing factual marketing statements are retained as supplied, not newly verified claims.

## Visual direction

Warm Jericho courtyard villa at late-afternoon light: limestone/travertine, walnut, bronze, ivory upholstery, clear glazing and a quiet teal pool. Materials must show actual texture/normal/roughness detail, bevels, joins, shadow contact and human scale. Soft sunlight remains consistent from exterior to interior. No sound, random physics, perpetual water animation or decorative autoplay.

Palette: ivory `#F3EFE6`, deep green `#173B35`, champagne bronze `#B89A63`. Keep Cairo for Arabic UI with its available local fallback stack; evaluate an appropriate serif letter form against the original wordmark rather than using generic sans-serif blocks. Preserve original logo at header/footer and at the entrance plaque.

## Six execution stages and gates

1. **Inventory and isolation**: establish exact base/ref, source audit, protected content snapshot, current desktop/mobile evidence and a written plan before editing the page. Baseline failures are recorded, not blamed on new work.
2. **Storyboard and architectural quality**: author a connected villa model and inspect actual WebGL frames of exterior, entrance/logo and interior/pool. Keep a separate scene study while quality is unresolved. No stage completion based on source alone.
3. **Camera and entrance**: deterministic perspective camera with independent look target, a physically hinged door and cleared passage. Native scroll, immediate reversal, no history/hash hijack. Test enough positions to catch wall/door/ceiling intersections.
4. **Homepage composition**: apply one editorial design system, preserve all original content/behavior and reserve dedicated letter lanes. No content underneath decorative geometry. Keep quick villa/contact access.
5. **Five-letter journey**: five separate beveled meshes, including separate A nodes. Assemble → separate with fixed stagger → travel between section anchors → reassemble at final CTA. Renderer is shared or previous scene fully sleeps. Position depends only on current scroll/layout.
6. **Acceptance and review**: all required viewport widths and orientation samples, actual input flows, refresh mid-scene, back/forward restoration, motion preference, failed model loading, WebGL loss/absence, disabled JS, console/network, idle resource behavior and honest performance evidence. Preview branch only until gates pass.

## Storyboard and camera safety

| Progress | Shot | Camera/action | Safe text area |
| --- | --- | --- | --- |
| 0–12% | Exterior + courtyard | Wide establishing view, pool/plant foreground and warm architecture | Stable HTML title/CTA in dedicated right field; mobile title above scene |
| 12–28% | Entrance approach | Move down path toward human eye height, parallax from plants and stone returns | Title fades by progress; small shot label at edge |
| 28–42% | Sign and threshold | Read original mounted logo/THARA; door opens on real hinge | No text over entrance plaque |
| 42–68% | Entry | Eye-level travel through clear doorway into hallway | Quiet frame, persistent skip/navigation only |
| 68–88% | Living area | Reveal layered furniture, curtain/glass edges, terrace and pool | Small separate caption; no overlay on key architecture |
| 88–100% | Brand transition | Match the interior bronze wordmark framing to the next letter composition | Carry a stable ivory/bronze visual field |

Starting cinematic length: desktop 350svh, mobile 240svh; only enable the long track after WebGL/model readiness. Reduced motion/failure/no-JS use one normal-height static composition. Desktop and mobile camera framing are designed separately. The conceptual-scene caption is continuously available in HTML.

## Letter lanes / page map

Keep `tharaStory` as a concise opening composition, not a second long pinned tunnel. Preserve the original document order from intro through final CTA. Use a pointer-events-none canvas behind foreground content with empty lateral lanes on large screens and dedicated shallow separator lanes on mobile. Interpolate letter paths between measured section anchors rather than total document percentage, so late images/resizing cannot drift them across team faces or the form. During team/inquiry reading they remain in reserved margins or separator bands. All text/buttons keep a higher isolated stacking layer. The terminal assembled word gets its own band above final CTA.

## Technology and assets

Keep Three.js 0.180.0/esbuild already locked. Use the installed version's official source/documentation for GLTFLoader, GLTFExporter, PerspectiveCamera, mesh materials and curve semantics. Native CSS sticky and event-driven requestAnimationFrame are sufficient; no GSAP dependency or smooth-scroll replacement unless a concrete need emerges. One source-of-truth scroll timeline, no independent animation clock.

Author model source under `src/cinematic/`; export assets under `assets/cinematic/`. Record authorship, any external texture licenses, exact original-logo source and SHA hashes. A generated bitmap cannot substitute for model inspection. A poster may be captured from the actual approved scene, with the same framing.

Initial engineering budgets to validate (targets, not measured results): initial scene geometry plus maps ≤ 6 MiB, mobile pixel ratio ≤ 1.25 / desktop ≤ 1.5, ≤ 250k visible triangles and ≤ 180 draw calls after instancing/merging, idle frames 0 after settling. Revisit budgets using measured render quality. Final 60fps desktop / 30fps phone targets require real hardware evidence; software WebGL and desktop viewport emulation must be labelled as such.

## Status

- Repository audit and isolated branch: done.
- Content snapshot: captured before page edits.
- Baseline browser evidence: pending runtime/browser startup.
- Architectural scene, final design, performance and functional acceptance: not complete.
- Production changes: none.
