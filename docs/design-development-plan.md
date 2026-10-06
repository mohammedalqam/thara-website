# THARA — staged design development

Baseline: `efd495b840cc130d7e6164b4ceb738b0dff6cc85`. Reference: the scroll-following brand sculpture at https://sgo.co.il/. Scope: the existing seven-page Arabic villa website.

## 1. Audit and direction

The existing wordmark is static. The villa has harsh slab edges, excessive yellow roof accents and a visibly simplified SVG appearance. Camera framing jumps at one aspect-ratio threshold. Animation interpolation depends on frame rate, and the SVG timestep is capped below its frame interval. Scene controls are smaller than 44 px and the caption is too small. Inquiry styling targets a class that does not exist.

Direction: charcoal, limestone and restrained brass; legible Arabic typography; a deliberate architectural presentation followed by genuine villa photographs. THARA remains the brand name. Decorative scenes must not cover navigation, copy or booking controls.

## 2. Scroll-following THARA

Create an original bevelled, extruded THARA wordmark. Pin it within a bounded brand story so it follows scrolling, gently turns and opens before returning to its final arrangement. Keep normal page scrolling and anchor navigation. Keep a readable static wordmark if 3D is unavailable. Reduced motion displays one stable composition and removes the extended pin duration.

## 3. Villa and rendering quality

Refine the villa's proportions, glazing, terraces, planting and finish palette. Add soft edges where useful without excessive geometry. Fit the complete model continuously to the available aspect ratio. Use consistent elapsed-time motion, explicit pause behavior and renderer-specific lighting. Keep a CPU renderer and real-photo fallback.

## 4. Responsive integration

Check 320, 390, 768 and desktop widths. Reserve space for controls and captions. Use at least 44 px scene controls, clear focus states and readable captions. Correct inquiry selectors. Prevent decorative transforms from causing horizontal scrolling or covering useful content.

## 5. Reliability and verification

Render only while visible and when movement or state changes require it. Release resources on navigation and preserve BFCache behavior. Validate camera/motion math, all HTML links and IDs, and build output. Review home interactions, catalog filters and dialogs, gallery, menus, FAQs and both inquiry flows without sending test messages.

## 6. Release

Review a branch preview before merging. Confirm that the published GitHub Pages build matches the reviewed tree. Save a screenshot of the live result. Record checks and any actual verification limits here; a successful browser check is not a guarantee that every device is bug free.

## Progress

- [x] Stage 1: audit and development plan.
- [x] Stage 2: scroll-following THARA; reviewed the original extruded serif wordmark in the branch browser preview.
- [x] Stage 3: refined stone slabs, glazing, timber facade and pool; shared demand-driven renderer, elapsed-time motion and continuous bounds-based camera fitting.
- [x] Stage 4: responsive integration; reviewed 320, 390, 768 and 1180 px layouts, phone menu and scene controls.
- [x] Stage 5: reliability and browser verification; five automated tests, build/syntax checks, seven-page asset/anchor/ID validation and browser flow checks pass.
- [x] Stage 6: published result verified. PR #4 merged as `f931968de1d2075ce818ad9c7133fe5bd1b78267`; GitHub Pages run `37539818717` completed successfully. The live site serves the new assets, both scenes initialize, THARA geometry changes with scrolling and the brand stage stays pinned at 96 px before releasing.

Automated geometry and motion checks pass: 12/30/60 fps transition equivalence, bounded scroll progress, full camera containment over eight aspect ratios and five angles, finite original THARA geometry with shared A outlines. Scene controls are at least 44 px; a persistent reduce-motion button uses the same scene behavior as the system preference.

Browser checks: sticky name at phone and desktop widths; manual reduce-motion and preference persistence; villa day/night, angle, motion and exact geometry freeze on pause; 3-room/4-room filters; six-image villa details; gallery next/Escape; FAQ expansion; valid three-member WhatsApp links from both inquiry forms. Test messages were not sent. Static navigation, visible text and real-photo fallback were checked with scripting disabled. Legal text remains identical to the baseline.

Known verification limit: this cloud browser disables WebGL. The actual CPU-projected 3D presentation was visually reviewed. Physical WebGL lighting, reflections, shadows and shader appearance cannot be certified from this session; they require a separate browser/device with an enabled GPU. Do not describe this release as proven bug-free on every device.
