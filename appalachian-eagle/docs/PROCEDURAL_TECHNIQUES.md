# Procedural techniques notebook

This is a portable record of useful rendering patterns, not runtime content. The project remains self-contained and makes no network requests.

## Implemented: streamed synthetic terrain and forest

- Generate nested terrain LOD rings from a continuous height function. Put vertical skirts on *both* sides of each LOD interface: a fine-grid skirt hides a coarse surface below it, while a coarse-grid skirt hides it when interpolation is above the fine surface. This avoids crack direction assumptions.
- Build geometry in one inline worker, transfer typed-array buffers, and upload terrain in bounded 1 MiB animation-frame slices. Continue drawing the previous buffers until the complete replacement can swap atomically.
- Place trees on globally indexed cells with coordinate hashes for jitter, size, color, and seed. Overlapping streamed regions then reproduce exactly the same trees. Fade instanced crowns by stable seed-varying camera distance and blend them into matching procedural canopy ground; avoid a uniform circular cutoff.
- Forest LOD is bounded and generated without images. Three startup-built near variants share a compact branch grammar but are deterministically shaped into spreading oak, tall narrow poplar, and tapered conifer silhouettes; stable seed yaw keeps repetitions from lining up. Per-frame CPU culling keeps the detailed draw within 635 m from a stable 256×256 20 m tree grid; its fade overlaps a matching tapered mid-canopy mesh out to about 2,050 m. (Superseded 2026-11-15: the 320×320 far-card window was removed in favour of shader canopy, see the realism pass below.) Both tiers share the scene uniform layout, summer lighting, fog, and mild shader wind. Far cards fade in below the mid edge and out before the streaming-window boundary, avoiding a hard ring or rectangle.
- The F3 diagnostic includes the stamped UTF-8 `index.html` size in KiB. `node tools/update-size.cjs` must run after source edits and `node tools/update-size.cjs --check` verifies it; `.gitattributes` pins the source to LF so a checkout cannot change the measured byte count.
- This project’s terrain is mathematical only, calibrated against retained elevation research rather than loading a DEM at runtime. At checkpoint `3bf3d42` the standalone source was about 32 KB.

Validation and pitfalls:

- Test worker geometry at more than one center and compare overlapping near-tree and far-cluster records. `validation/validate-streaming.cjs` checks terrain count, both payloads, finite values, and exact deterministic 42,025 near-tree / 91,809 far-cluster overlap counts.
- In JavaScript, `Float32Array(buffer, byteOffset, length)` takes an element count, not a byte count.
- WGSL needs one `let` declaration per statement; JavaScript comma declarations are invalid. Work in linear light, including fog, then apply display gamma once.

## Implemented: realism pass (2026-11-15)

- One shared WGSL chunk (`ATM`) is prepended to every scene shader so terrain, trees, eagle and sky agree: sun direction/colour, sky radiance `skyc`, palette `pal`, cloud coverage `cov`/density `den`, lighting `shade`, aerial perspective `atmo`, and ACES tone mapping `tm`.
- Aerial perspective integrates exponential height fog analytically along the view ray (scale height 1.4 km), with slightly stronger extinction in blue; in-scatter uses the near-horizon sky colour, so distant terrain merges into the sky with no seam.
- The forest palette uses an integer hash (`ih`, identical bits in JS `Math.imul` and WGSL `u32`) so worker-assigned tree colours and species match the terrain canopy shading underneath. Sin-based hashes diverge between CPU doubles and GPU f32 at world-scale coordinates.
- Far crossed cards (the lily-pad discs) were removed. The terrain fragment shader draws closed canopy: 8.5 m Voronoi crowns with dome normals and gap AO/self-shadow, which fade by pixel footprint into a darker rough-canopy average, plus three footprint-faded ridged-noise normal octaves for spur/hollow relief. Within the tree range, terrain is shaded as understory under the canopy.
- Near trees have grey bark, more and larger foliage clumps, per-clump AO and colour jitter baked into vertex colours, crown-dome normals, two-octave leaf mottling and back-lit transmission. Mid crowns get vertical AO and dappling.
- Cloud shadows are computed per vertex by projecting along the sun to the cumulus layer and sampling the same coverage function as the sky.
- Eagle: cambered broad wings with a wrist break, scalloped secondaries, seven slotted primaries that curl up under load, a white fan tail that twists with bank, a hooked beak, and an occasional three-beat flap. The camera banks with the bird.
- Validation: `validation/validate-streaming.cjs` now checks the tree payload only (42,025 stable overlaps). Headless software-WebGPU renders were used for visual checks only; frame time on real hardware still needs a fresh F3/F8 benchmark.

## Research / planned: space-colonization trees

The [space-colonization paper](https://www.algorithmicbotany.org/papers/colonization.egwnp2007.html) describes growing branches toward competing attraction points in 3D. Its influence and kill radii, step length, and attraction distribution can control crown shape. The linked detailed PDF was not fully read here, so this is a research lead, not a claim that its full method has been implemented. This project instead uses an original compact branch grammar for its current near LOD; a future generator could use space colonization for less regular silhouettes while retaining the same bounded vertex and LOD budgets.

## Current validation status

The forest geometry and worker payload were statically validated after implementation: near variants have 1,836 / 2,124 / 1,836 vertices, the mid mesh has 216, and the far card mesh has 24; all are finite. The worker validation passes at multiple centers with deterministic 42,025 near-record and 91,809 far-record overlaps. Inline JavaScript syntax and the file-size stamp check also pass. Final primary-browser QA at 1920×1080 sustained 65.0 seconds / 3,600 samples at 55.4 FPS mean and 18.10 ms p95, with no error logs after the final 19:16 reload. It meets the 50–60 FPS target. F3 correctly reports the final 44,081 B (43.0 KiB); the old HUD is absent; pause/resume, restart, and nonblank 1920×1080 PNG export were verified. Earlier logs retain the 19:11 shader-compile failure for traceability.

## Implemented: bounded half-resolution summer clouds

- The sky is a separate half-resolution WebGPU render target, bilinearly composited before opaque terrain and trees. Its texture is safely destroyed and rebuilt with the depth target on resize.
- A 28-step, 30 km-capped world-space march intersects a 2.3–3.8 km cloud slab. Broad low-frequency weather coverage is multiplied by a vertical base/top envelope and trilinearly interpolated 3D value-noise erosion, so cloud shapes vary through altitude instead of forming extruded 2D bands. The noise is advected at roughly 3 m/s.
- Each occupied sample uses Beer extinction `1-exp(-density*stepLength*.0015)`. Scattering accumulates front-to-back with transmittance early-out; the cloud result is composited with the sky exactly once. Two density probes toward the shared scene sun darken undersides and brighten sun-facing edges, while distant clouds fade toward atmospheric blue. The sky path works in linear color and applies display gamma at its final output.

Validation note: shader compilation diagnostics are queried during initialization; the final browser QA results are recorded above.

## Research / planned: volumetric clouds

Guerrilla’s [Horizon Zero Dawn cloud discussion](https://www.guerrilla-games.com/read/the-real-time-volumetric-cloudscapes-of-horizon-zero-dawn) is a reference for optimized volumetric modeling, animation, and lighting. Its stated 2 ms target is theirs, not a measurement for this project. [Nubis Cubed](https://www.guerrilla-games.com/read/nubis-cubed) describes voxel clouds with compressed-SDF empty-space skipping, lighting acceleration, and dense-voxel uprezzing. These are AAA inspirations, not a tiny-game architecture to copy wholesale. Any future adaptation should keep a bounded raymarch/noise budget and validate visual quality and frame time together.

## Research / planned: river water

GPU Gems’ [effective water simulation chapter](https://developer.nvidia.com/gpugems/gpugems/part-i-natural-effects/chapter-1-effective-water-simulation-physical-models) separates four geometric waves from finer procedural normal ripples; analytical derivatives provide the normal. Directional waves fit wind, while circular waves fit waterfall-impact pools. A small future adaptation would compute analytic normals in the shader (no downloaded normal map), then add procedural flow/foam and circular-ripple landmarks. A river still needs stable 3D position and depth inputs; this remains unimplemented until benchmarked.

## Discovery queue — unverified leads

These recent links are leads only: code, license, performance, and dates require direct inspection before reuse. Claims are author-reported, never this project’s benchmarks.

- 2026-10-16: Reddit post, [61 KB WebGPU ocean](https://www.reddit.com/r/ClaudeAI/comments/1x7v7gj/this_is_61_kb_html_file/).
- 2026-11-11: Reddit’s [Matrix procedural-cloud discussion](https://www.reddit.com/r/ClaudeAI/comments/1xtdqcr/follow_the_white_rabbit_i_directed_claude_fable/) and its linked [Matrix repository](https://github.com/tornikegomareli/Matrix).
- 2026-11-14: [Abyssal Garden 97 KB lead](https://www.reddit.com/r/ClaudeCoding/comments/1xw8w0y/tldr_i_built_a_swimmable_underwater_world_in_one/), a secondary summary; trace the original before trusting it.
- GitHub README-review leads: [SeedThree](https://github.com/SkyeShark/SeedThree) declares MIT, was created 2026-07-04 and last pushed 2026-11-12 (recently updated, not newly created), and reports a Weber–Penn parametric generator for broadleaf/conifers, L-systems for desert plants, plus geometry-to-branch-card-to-billboard LOD, foliage-card wind/translucency, and species taper/angles/gnarl. It is not space colonization. [webgpu-landscape-rendering](https://github.com/vvanghelue/webgpu-landscape-rendering) was created/pushed 2026-10-17 and reports a ~100 m complementary mesh/card crossfade over 130–230 m with opaque backing (no dither holes), terrain-matched far-forest tint, and terrain geomorph LOD; no SPDX/express code license was found, so it is algorithm inspiration only. [procedural-clouds](https://github.com/jeantimex/procedural-clouds) declares MIT and reports a periodically computed 3D density cache plus raymarching with independent cache-update and lighting-step rates; it was created 2026-02-08 and last pushed 2026-02-09, so it is an older technical reference rather than a recent lead. None is copied or integrated.

- Additional README leads, all inspiration only and not integrated: [AskAlice/threejs-worldgen](https://github.com/AskAlice/threejs-worldgen) is Apache-2.0, created 2026-10-02 and last pushed 2026-11-07; its README reports streamed blue-noise scatter, pooled instancing/impostors, four grass LODs with wind interaction, and space-colonization trees. [Leonxlnx/open-water](https://github.com/Leonxlnx/open-water) has a verified MIT source license, was created 2026-10-20 and last pushed 2026-10-24; its README cautions about cloud-history lag, repeated ray depths causing bands, finite step caps missing distant storms, and gray rather than black rain scattering. Its recorded audio is explicitly excluded from this no-assets project. [takustaqu/atmosphere](https://github.com/takustaqu/atmosphere) is MIT, created 2026-07-29 and pushed 2026-11-15; its README describes physical-unit weather, low cumulus plus high cirrus for summer, and skipping negligible layers to avoid constant cost. Readme claims and dates/licenses were reviewed, but no external code or assets are copied.

- Direct code-reading note (not integrated): `AskAlice/threejs-worldgen`’s space-colonization source keeps each attraction point’s nearest branch, compares only against newly added nodes because older nodes never move, uses neighboring spatial-grid cells, and compacts consumed points. It derives pipe radius from downstream tip counts and smooths unbranched chains once. These are verified observations of that Apache-2.0 source, not copied code or a description of this project’s compact parametric trees.

Code-review notes, still research only: SeedThree’s [leaf cards](https://github.com/SkyeShark/SeedThree/blob/main/src/core/leaf-cards.js) suggest base-anchored leaves on terminal branches, a shared placement grammar across leaf/cluster LODs for silhouette continuity, thickness for backlit transmission, and a canopy dome normal originating at its bottom to avoid black undersides. Its Three.js/texture pipeline is excluded. The cloud shader lead uses bounding-box ray intersection, front-to-back Beer transmittance `exp(-density*step)`, a short sun march, HG phase, opaque early exit, then tone mapping and gamma. If adapted, use an actual WGSL `if` for skipped work: `select` arguments may both evaluate. Benchmark before implementation.
