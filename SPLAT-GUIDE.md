# Gaussian-splat HTML games: build guide

Read this before you build or change a splat game in this repo (`splat`, `ashgrove`, `splatcraft`, `broadside`, `spearfish`, or a new one). It records the techniques these games share, so you don't have to dig through an old game to rediscover them. When you work out something new, add it here.

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

## Underwater scenes (Spearfish)

- **Backdrop without a mesh.** Draw one fullscreen quad first, depth test off, and shade it by view ray: a water colour that runs from dark below to bright above, plus the surface seen from below. Intersect the ray with `y = 0`, perturb a downward normal with a few sines, and `refract(dir, n, 1.33)`: where that returns zero you are outside Snell's window, so show reflected water colour; inside it show bright sky and a sun spot.
- **Fog must match the backdrop.** Splats fog toward the same `waterCol(viewDir)` function the backdrop uses, with the same tonemap, or distant geometry shows as a silhouette. Multiply by `exp(-dist * vec3(.050, .012, .008))` before fogging so reds die first with distance; nearby coral stays colourful and far coral goes blue.
- **Caustics go in the fragment shader.** Per-splat caustics flicker one disc at a time. Pass the corner's world position to the fragment shader and add `albedo * sun * caust(world.xz + world.y * .3, time)`, pre-multiplied in the vertex shader by fog, absorption and an up-facing mask.
- **Sway is a per-splat byte.** Kelp, sea fans and anemones store `(height fraction)^1.5` in a spare byte and the vertex shader offsets x and z by it. A whole stalk bends as one because the phase comes from the splat's rest position, which barely varies along a stalk.
- **Seabed as one height function.** Reef mounds and boulders are Gaussian bumps added to `floorH(x, z)`. The same function places floor splats, plants coral, stops the player and catches spears. Scatter extra floor splats on each bump, since a uniform grid under-samples steep sides. Floor discs need a radius of about 1.0 x the grid spacing (with jitter) or water shows through the cracks.
- **Solid decorations.** Things planted on the bed (coral) are not in the height function, so each builder registers one or more upright ellipsoid colliders (centre, horizontal radius, vertical radius) as it emits splats. Bin them in a 4 m grid, listing a collider in every cell it can reach, so a query reads one cell. Push the diver and fish out along the scaled-sphere normal and remove the inward velocity so they slide; sample a fast projectile at four points per step so it cannot tunnel; reject wander targets inside a collider.
- **Ambient life in the vertex shader.** Hundreds of tiny fish cost nothing on the CPU if they are static splats with a mode byte. Each fish is two splats (body, tail) at a home point; the normal bytes carry two seeds instead of a normal. The shader moves the home by a few summed sines, takes the heading from the derivative, builds `U` along the heading and `V = normalize(cross(heading, toCamera))` so the fish never goes edge-on, and pulls the fish down into the coral as the camera comes within about 4 m. Bubble columns work the same way: `y = base + fract(time * rate + seed) * height`.
- **Translucent leaves.** For kelp blades, sea fans and soft coral, add `albedo * sun * max(dot(-N, L), 0) * warmTint` after flipping the normal toward the viewer. Blades seen from below against the sun glow gold instead of going black.
- **Sun shafts in the backdrop.** In the fullscreen backdrop shader, take the view ray's component perpendicular to the sun direction, turn it into an angle, and run that through two sharpened sines. Shafts fan out from the sun and sit behind all geometry for free.
- **Reef dressing.** A reef reads as alive when little rock shows. Keep the bed colour muted and put the colour in the coral: a finer bed grid (0.5 m) under the reef, about 25 corals per mound from a kit of a dozen shapes, thousands of small encrusting discs and six-disc cushions, and a school of shader fish over every mound.
- **Static chunks.** Sort static splats into 24 m cells after generation and draw each cell with its own `vertexAttribPointer` offsets (WebGL2 has no base instance). Skip cells beyond fog range or wholly behind the camera.
- **First-person viewmodel.** Keep the gun in its own small dynamic buffer and draw it last with `gl.depthRange(0, 0.04)` so it never clips into scenery. Aim the projectile from the muzzle at the point the crosshair is on (nearest fish near the view ray, else the seabed, else a fixed range); a fixed convergence distance misses small close targets.
- **Bursting a creature.** Use one function to compute each splat's world position for both drawing and the burst, then hand every splat to the particle pool with an outward velocity. The chunks start exactly where the fish was. Underwater, heavy drag (`v *= exp(-2.3 dt)`) and slow sinking read better than ballistic arcs; add a few soft expanding cloud splats and ring-shaded bubbles.
- Spearfish test API: `window.SF` has `state()`, `step(seconds)`, `tp(x, y, z, yaw, pitch)`, `lookAt()`, `nearest(key)`, `stalk(i, dist)`, `fire()`, `calm(bool)` to stop fish fleeing, `key(code, down)`, `fishList()` and `endDive()`. In `?test` mode the sim only advances through `step()`. Add `&touch` to force the touch layout.

## Painterly look and animals (First Light)

- **Ragged daubs.** Pass `float(gl_InstanceID % 977)` to the fragment shader as a flat seed, then scale `r²` by `1.14 + 0.2*sin(angle*3 + seed) + 0.12*sin(angle*7 + seed*1.7)` before the alpha falloff. Every splat gets its own lobed edge. Multiply the colour by `0.93 + 0.11*sin(vUV.y*8 + seed*2.3)` for bristle streaks.
- **Canvas weave.** A 256 px noise-and-weave tile on a full-screen `div` with `mix-blend-mode: overlay` at about 0.2 opacity, plus a soft radial vignette, makes the whole frame read as paint on canvas. It costs nothing in WebGL.
- **Blades.** Grass and reeds are one splat each: `U` is a short horizontal half-width, `V` is the vertical half-height, flag 16 anchors the base. In the vertex shader multiply the wind offset by `aCorner.y + 1`, so the tip sways and the root stays put.
- **Backlit leaves.** Translucent splats (flag 2) add `albedo * sunColour * pow(max(dot(-viewDir, sun), 0), 3)`. Autumn crowns glow when the low sun is behind them.
- **Ground as a mesh, not splats.** A warped grid (dense near the player) with vertex colours from JS and brush noise in the fragment shader costs far less than covering the floor in splats. Scatter leaf-litter discs and blades on top. Fake canopy shadow with a low-frequency noise mask on the sun term (`uDapple`).
- **One sky function.** `skyCol(dir)` paints the gradient, sun, brushed clouds and two far ridge silhouettes. The sky pass and the water shader both call it, so still water reflects the tree line and dawn for free.
- **Dawn to morning.** Lerp sun elevation, sun colour, ambient, horizon, fog colour and fog density from one `day` value in 0..1 over the session.
- **Animals** are a handful of templates posed each frame with `dtpl`: torso, neck, head, one leg template drawn four times, tail. Birds are a body plus two wing templates rotated about the shoulder. Keep hit spheres in the same local frame as the templates and transform both with the same matrices.
- **Fast projectiles.** Test the whole frame segment against the hit spheres, and sample terrain and trunks along it every metre or so. When zones overlap (vitals inside the body), look a little past the end of the segment before crediting a zone, or a slow arrow gets scored on whichever sphere it entered first.
- First Light test API: `window.FL` has `start(area, weapon)`, `state()`, `step(seconds)`, `spawn(kind, opt)`, `aimAt(i)` (ballistic lead on target `i`), `fire()`, `call()`, `look(yaw, pitch)`, `aim(bool)`, `setDay(0..1)`, `cam(eye, at, fovDeg)` and `end()`.

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
