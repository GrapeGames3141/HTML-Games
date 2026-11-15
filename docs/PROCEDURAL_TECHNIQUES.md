# Procedural techniques notebook

This is a portable record of useful rendering patterns, not runtime content. The project remains self-contained and makes no network requests.

## Implemented: streamed synthetic terrain and forest

- Generate nested terrain LOD rings from a continuous height function. Put vertical skirts on *both* sides of each LOD interface: a fine-grid skirt hides a coarse surface below it, while a coarse-grid skirt hides it when interpolation is above the fine surface. This avoids crack direction assumptions.
- Build geometry in one inline worker, transfer typed-array buffers, and upload terrain in bounded 1 MiB animation-frame slices. Continue drawing the previous buffers until the complete replacement can swap atomically.
- Place trees on globally indexed cells with coordinate hashes for jitter, size, color, and seed. Overlapping streamed regions then reproduce exactly the same trees. Fade instanced crowns by stable seed-varying camera distance and blend them into matching procedural canopy ground; avoid a uniform circular cutoff.
- This project’s terrain is mathematical only, calibrated against retained elevation research rather than loading a DEM at runtime. At checkpoint `3bf3d42` the standalone source was about 32 KB. GPU review on a GTX 1070 at 1080p observed roughly 60 FPS with smoothing; sustained raw-frame benchmarking remains pending.

Validation and pitfalls:

- Test worker geometry at more than one center and compare overlapping tree records.
- In JavaScript, `Float32Array(buffer, byteOffset, length)` takes an element count, not a byte count.
- WGSL needs one `let` declaration per statement; JavaScript comma declarations are invalid. Work in linear light, including fog, then apply display gamma once.

## Research / planned: space-colonization trees

The [space-colonization paper](https://www.algorithmicbotany.org/papers/colonization.egwnp2007.html) describes growing branches toward competing attraction points in 3D. Its influence and kill radii, step length, and attraction distribution can control crown shape. The linked detailed PDF was not fully read here, so this is a research lead, not a claim that its full method has been implemented. A future geometry pass can use it for real trunks, branches, and leaves instead of crown-only instances; budget branch depth and leaf density against draw/vertex cost.

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

Code-review notes, still research only: SeedThree’s [leaf cards](https://github.com/SkyeShark/SeedThree/blob/main/src/core/leaf-cards.js) suggest base-anchored leaves on terminal branches, a shared placement grammar across leaf/cluster LODs for silhouette continuity, thickness for backlit transmission, and a canopy dome normal originating at its bottom to avoid black undersides. Its Three.js/texture pipeline is excluded. The cloud shader lead uses bounding-box ray intersection, front-to-back Beer transmittance `exp(-density*step)`, a short sun march, HG phase, opaque early exit, then tone mapping and gamma. If adapted, use an actual WGSL `if` for skipped work: `select` arguments may both evaluate. Benchmark before implementation.
