# Gaussian-splat HTML games: build guide

Read this before you build or change a splat game in this repo (`splat`, `ashgrove`, `splatcraft`, `broadside`, or a new one). It records the techniques these games share, so you don't have to dig through an old game to rediscover them. When you work out something new, add it here.

## What "splat" means here

The scenes are not trained 3D Gaussian Splatting captures. They are procedural: JavaScript samples parametric surfaces (hulls, terrain, sails, rocks) and emits thousands of small oriented discs. Each disc is an instanced quad with a Gaussian or soft-edged alpha falloff. Overlapping discs read as painted brush strokes, which gives the games their look.

Each game is one self-contained `<game>/<game>.html`. It uses WebGL2 and has no build step and no external dependencies.

## Splat record (48 bytes, instanced)

| Offset | Type | Field |
| --- | --- | --- |
| 0 | f32×3 | centre position |
| 12 | f32×3 | `U` half-axis (disc spans `pos ± U ± V`) |
| 24 | f32×3 | `V` half-axis |
| 36 | u8×4 norm | rgb + ambient occlusion |
| 40 | i8×4 norm | normal xyz (+ pad) |
| 44 | u8×4 | game-specific; Broadside: tier, flags, alpha, pad |

The corner buffer `[-1,-1, 1,-1, -1,1, 1,1]` is drawn as a `TRIANGLE_STRIP` with `drawArraysInstanced`. Attribute divisor is 1 for locations 1–6.

Broadside uses these conventions:
- **tier**: 0 is the base, an opaque core with a soft rim (`1 - smoothstep(0.55, 1, r²)`). 1 is a soft painterly detail stroke. 2 is a soft particle such as smoke or foam. 3 is emissive (windows, muzzle flash).
- **flags** (bits): 1 darkens the splat when seen from behind, so shot holes show a dark interior. 2 makes it translucent: lit from both sides, for sails. 4 is foam: the splat is pulled 1.4 m toward the camera so it never z-fights the water.

Splatcraft uses the tier byte for LOD distance fading instead. Pick one convention per game and document it at the top of the file.

## Rendering recipe

- **No sorting.** Base splats write depth and use an opaque core. Create the context with `antialias: true` and enable `SAMPLE_ALPHA_TO_COVERAGE` when `gl.getParameter(gl.SAMPLES) > 0`. Otherwise fall back to hashed-dither discard (`if (a < hash(gl_FragCoord.xy)) discard`). This is order-independent and fast.
- **Lighting** happens in the vertex shader, per splat: two-sided Lambert (flip the normal when it faces away), sky ambient times AO, an ACES tonemap, gamma, then exponential fog to the horizon colour.
- **Rigid objects** get a static buffer per part and a `uM` model-matrix uniform. Transform the position, `U`, `V` and normal by `mat3(uM)`. Ships use one part for the hull, one per mast for spars, and one per mast for the braced sails.
- **Damage holes** go in a `uniform vec4 uHoles[24]` (part-local xyz, radius). In the vertex shader, collapse any splat within the radius (`gl_Position = vec4(2,2,2,1)`). Darken a scorched ring out to about 2.2 × the radius. Put hole positions in the part's local space so they move with the part.
- **Small moving things** (cannons, rudders, flotsam, balls, particles) go in one dynamic buffer that you rebuild every frame. Store each object as a local template (`SB.template()`) and transform it with `dtpl(template, matrix)`. One `bufferSubData` and one draw call per frame. Budget about 70k dynamic splats.
- **Billboard particles** use the camera's right and up vectors as `U`/`V`. Flat foam uses world X/Z.

## Generating splats

Broadside's helpers (copy them):
- `surf(sb, P(u,v), nu, nv, colour(u,v,p,n), opts)` samples a parametric surface. `U`/`V` come from finite differences of `P` times `cover / n`. A `cover` of about 0.95–1.0 makes a closed surface. `opts.strokes` adds elongated tier-1 strokes on top for painterly texture, and `opts.flip` reverses the normal. Return `null` from `P` or the colour function to skip a sample.
- `line(sb, a, b, width, colour)` builds rigging and ropes from two crossed strips, so a line never vanishes edge-on.
- `cyl()` and `box()` build masts, barrels and carriages.
- Colour functions take care of most of the art: plank rows with seams, painted panels, gun ports, stripes, emblems. Use value noise for variation. Keep paint desaturated, because saturated reds and yellows turn garish after lighting.
- Use one geometry function for both splat generation and hit testing (Broadside's `HULL.hw(x,y)`, `keel(x)`, `deck(x)`). That way hits land on what you see.

## Water

- Draw a polar grid mesh centred on the camera, snapped to 4 m so it doesn't swim. Make the rings denser near the centre and run out to about 5 km. Fade wave amplitude with distance.
- Write the wave function once in JS and generate the GLSL from the same constants (`WAVE_GLSL`). Ship buoyancy, floating debris and splash heights then match the rendered surface exactly.
- The water is opaque and writes depth, so submerged hull, sunk ships and listing gunports are hidden by the depth test for free. That's what makes sinking readable.
- Compute per-pixel normals analytically from the wave gradient, plus two scrolling noise layers. Add Fresnel sky reflection, a sun glint, crest foam, and fog to the horizon colour.

## Performance budgets (mid-range GPU, 1080p)

- Up to about 250k static splats on screen is fine. Broadside has about 165k, including about 100k for islands.
- Drop splat density with distance by making spacing coarser at generation time. Islands 1–3 km away use 7 m spacing.
- Keep per-frame JS to transforming templates (thousands of splats), not rebuilding big buffers.

## Gotchas

- `Uint8Array`/`Int8Array` assignment wraps rather than clamping. Clamp before writing (`Math.min(255, v*255)`).
- `getActiveUniform` returns array uniforms as `name[0]`. Strip the `[0]` when you build the location map.
- GLSL ES loops need constant bounds. Loop to `MAXH` and `break` at the live count.
- Keep sim time in seconds since start, as a float. Wave phases stay precise for hours.
- Ship-attached cameras inherit roll and can dip below the water. Build the test camera from yaw only.

## Headless testing (the standard setup)

Test headless with logs and screenshots. Don't drive the user's screen.

- Use Playwright with system Chrome: `chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })`. SwiftShader reports MSAA 4, so alpha-to-coverage works.
- Load `file:///…/<game>.html?test&seed=N`. A `?test` flag skips the menu and seeds the RNG.
- Every game exposes a small test API on `window`. Broadside's `window.BS` has `state()`, `step(seconds)` for a deterministic fixed-step sim with no rendering, `aim(p)`, `aimBallistic(localPoint)`, `broadside()`, `fire()`, `topple(i)`, `breach(local, r)`, `hitZone(zone)`, and `look(ship, offset, target)` to lock the camera for screenshots.
- Write test plans as lists of `{ js, wait, shot }` steps. Collect console output and `pageerror`s, and look at every screenshot. Balance tests can run whole fights in-page (`for (…) { BS.step(1); … }`) and print a summary every 30 s.
- Long runs take longer than two minutes in SwiftShader. Run them in the background and poll the log.

## Repo rules (summary)

- Every new game gets its own folder with a meaningful file name, never `index.html`.
- Commit at each working milestone and push `main` to origin after each commit. See `CLAUDE.md` for the exact commands.
