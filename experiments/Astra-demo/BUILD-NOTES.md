# Littoral — Astra field atlas

Littoral is an independent, self-contained WebGL2 field walk. The eight stations share a 560.2 m loop from the strand through the waterfall entrance, up the glow cave and back to the beach. Walking the route at its ordinary pace takes about nine minutes before stops. The station bar also lets a reviewer revisit a view immediately. The default island and the comparison plates use seed 412.

## Launch

From PowerShell, serve just this experiment.

```powershell
python -m http.server 8000 --bind 127.0.0.1 --directory 'E:\html games\experiments\Astra-demo'
```

[Enter Littoral](http://127.0.0.1:8000/Astra-demo.html) · [Open the comparison atlas](http://127.0.0.1:8000/evidence/atlas.html)

The game also opens directly from `Astra-demo.html`. It generates its scenery and sound locally and has no runtime downloads. The root Pages packager excludes the entire experiments directory. The arcade has no entry for this project.

## Reading a comparison

Hold **V** during the walk to compare the current station's main effect. Comma and period select any of the twenty techniques or all effects. The Effects panel provides the same selection and a latching split. Both halves render the same camera, sun and simulation state. The left forces the selected effect on and the right uses its stand-in. Other switches retain their settings. **Measure cost** synchronizes readback and compares whole-frame render times in both measurement orders. It measures the current viewpoint and excludes simulation stepping. Small deltas can be dominated by timing noise. Glasshouse offers **Pane study** and **Bottle tree**, Waterfall offers **Moss ledge**, and Overlook offers **Tide shelf**. Each study exposes **Return to station**.

The [comparison atlas](evidence/atlas.html) opens the original PNGs and slides between co-registered frames. Each station has all-on and all-off plates, plus a separate plate for each technique listed at that station. An object outside the field of view can produce little change in a particular plate. For example, the stream view faces inland while the ocean blend is downstream at the mouth. The tide-pool plates include a pebble impact. The glasshouse plates include moving bubbles frozen at one instant.

## Rendering choices

| Technique | Implementation in this version |
| --- | --- |
| T1 · Radiance cascades | Three directional probe grids on the cave floor plan trade spatial density for angular resolution. Far intervals merge into near intervals. A second sweep includes diffuse re-emission at adjacent walls. Local emitters, openings and the movable lantern feed the field. Direct lantern light also uses the 3D surface normal and distance. |
| T2 · Volumetric shafts | A depth-limited view ray takes 7, 12 or 18 shadow-tested scattering samples. Forest, spray, cave aperture and lookout use different density fields. |
| T3 · Splat shadows | Meshes and oriented foliage daubs render into a near depth map and a cached island-wide map. The near pass includes the walker's silhouette. The bottle tree projects tinted footprints using the bottle positions and sun direction. |
| T4 · Distance-field shadows | Short sphere-traced visibility rays use the nearest trunk or stalagmite proxies. The angular near miss softens the shadow. The cave rays follow the portable lantern. |
| T5 · Ripple simulation | A moving finite-difference height field retains overlapping cells as its window shifts. Shoreline and emerged rocks reflect waves. Stream flow advects disturbances. Footfalls, pebbles, splashes and drips inject impulses. |
| T6 · FFT ocean | A directional wind spectrum advances in phase and a separable radix-2 inverse transform produces a periodic height tile and slopes. The water shader combines two rotated scales, adds shallows, glints and crest foam, and fades swell at the stream mouth. |
| T7 · Surface caustics | A tessellated light grid refracts through the live surface. Screen derivatives of the projected triangles estimate concentration. Additive accumulation makes the caustic texture available to the water bed and cave roof. |
| T8 · Weighted transparency | Separate additive colour/weight and multiplicative revealage passes share the opaque depth test. A composition pass combines panes, bottles, crystals, bubbles, pollen and mist. The fallback uses ordinary submission-order alpha blending. |
| T9 · Refraction | Water reads the opaque colour and depth buffers, rejects foreground crossings, and absorbs light by water depth. Glass and crystal use dispersed RGB samples and material-specific optical thickness. |
| T10 · Thin film | A wavelength-dependent interference phase varies with angle and thickness on bubbles, beetles and the forest slick. |
| T11 · Kuwahara paint | Four neighbourhoods compete on colour variance. The filter mixes the selected mean with the original pixel and reaches full strength at the easel. |
| T12 · Particle fluid | A spatial hash finds neighbouring particles for pressure and viscosity. Gravity, pool impacts and drag differentiate the falling water and mud. Velocity-stretched splats accumulate thickness in two material channels. A screen-space filter refracts and shades the result. |

The opaque pass writes colour, depth and normals. Colour and depth are copied before refractive drawing. Quality scales scene resolution, near and far shadows, ripple grids (64–128), FFT grids (32–128), shaft samples and fluid particles (500–1,800). At seed 412 the static scene contains 207,581 splats and 473,417 triangles before view culling.

## Screenshot-guided polish

The [matched before-and-after sheet](evidence/polish-review.jpg) compares crops from the original Astra checkpoint `1829b73` with the polished build. The camera, simulation step, viewport and low-quality setting match within each pair. The [field studies sheet](evidence/field-studies.jpg) records the final pane, bottle tree, moss ledge, and tide shelf views.

- The sheltered tide pools now keep their own ripple surface. A softer caustic response preserves the shell and anemone colours. The stream has a pebbled bed, marginal reeds and clearer shallows.
- Foliage uses four locally generated leaf sprays and denser inner crowns. The light and shadow passes share the leaf silhouettes. Fern leaflets attach to a central stem. Driftwood follows the beach slope, with shell fragments and wrack along the strand.
- The glasshouse panes reflect the sky. Smooth bubble normals let the background show through the centre while the rim retains its thin-film colours. Nearby sign descriptions appear beneath the station caption.
- The falls resolve particle thickness into falling strands, with mossy rock shelves and short foam streaks at impact. The local ripple mesh has a smaller vertical excursion while its slopes still drive refraction and caustics.
- Cave mushrooms have curved stems, scalloped caps and radial gills. The pool samples nearby cave light for reflections. Crystal faces have mineral seams and directional shading.

The extra crown, fern and cave geometry increases the static scene budget. Hardware frame time remains unmeasured.

## High graphics realism pass

The [camera-matched High comparison](evidence/high-realism-comparison.jpg) shows three stations at seed 412 and 960 × 600. Each pair uses the same view and simulation step. The individual High captures show the [tide pools](evidence/high-tide-pools.png), [waterfall](evidence/high-waterfall.png) and [forest](evidence/high-forest.png).

- Near the shoreline, smoothly shaded stones carry mineral grain and an uneven wet band tied to the local water elevation. Short screen-space rays sample nearby visible rocks and banks. The reflection fades back to the sky where the ray leaves the view.
- At the falls, three openings in the rock lip feed streams of different widths and speeds. The translucent sheets and particles follow the same ballistic paths. Foam, mist and expanding ripples use their calculated landing points.
- In the forest, small forks carry separate leaf clusters, with sky visible between them. The ferns have arched spines and tilted pairs of leaflets. On the forest floor, the shadow filter widens with the separation between the blocker and the ground.

Select **High** in the Effects panel or open `Astra-demo.html?q=high` to use these settings. The first selection of High builds the additional geometry and retains it for subsequent quality changes. Run `node verify.mjs --high-realism` to capture the three updated stations and exercise repeated quality changes and the waterfall effect switch.

## High coastal surf and rock weathering

The [matched coastal views](evidence/surf-comparison.jpg) compare the previous High build at `a5bc71e` with this pass. The beach and tide-pool stations use their entry cameras. A third camera sits offshore, facing the arch.

- A directional swell shoals near the strand. Curved wave fronts wrap around the arch feet, and the short waves diminish on their sheltered sides. An animated shallow film runs up the sand and leaves a damp edge for several seconds. The enclosed tide pools and stream mouth are excluded from the beach wash.
- The arch and offshore stacks use denser geometry on High. Their tidal notches change the silhouettes near sea level. Tilted sediment beds, interrupted joints and a damp lower band continue across the rock faces and the arch ceiling.
- Run `node verify.mjs --surf` to capture both station views, the offshore arch, and the same arch 1.9 seconds later. The check cycles through all three graphics presets, toggles the ocean, and exercises the forced no-float path.

## Shorelife techniques

| Effect | Where to try it | Implementation |
| --- | --- | --- |
| T13 · Shape-stacked shell | Jump to Tide pools and use **Inspect shell**. Drag **Shell layers** to separate and reassemble the cross-sections. **Return to walk** restores the camera. | A tapered helix and an oval opening generate 32 horizontal sprite masks and local surface normals. Each slice has a thin side wall for low viewing angles. Jointed legs and stalked eyes move beneath the shell. The crab turns and withdraws as the walker approaches. |
| T14 · Parallax rock relief | Walk sideways along the rock rim of the first tide pool. | A tiled height map contains barnacle rims, pores and fissures. The shader marches along the viewing direction and interpolates the first intersection. The comparison retains the flat texture. |
| T15 · Thickness translucency | Face the sun through tide-pool kelp, or place the cave lantern behind the mushrooms near the entrance. | Per-vertex thickness distinguishes the blade margin, midrib, cap centre and radial gills. Backlighting follows the sun or the current lantern position, with stronger attenuation through thicker tissue. |
| T16 · Persistent sand tracks | Walk along the strand, then cross the wet edge. Follow the smaller paired marks at Tide pools. | Footfalls and crab strides leave oriented impressions on the ground triangles. Swash removes marks within its local reach. A bounded list retains the most recent 320 marks during the session. |

The [visual summary](evidence/shorelife-review.jpg) and [comparison atlas](evidence/atlas.html#2/13) show the new techniques. Run `node verify.mjs --shorelife` to check the shell controls, low viewing angle, avoidance, track persistence, wash and split comparisons.

## Differences and limits

- The cascade solver uses a 2D floor plan with height-aware direct light. Its probes cannot represent several vertically overlapping cave chambers.
- The ripple solver, ocean transform, radiance probes and particle neighbour search run on the CPU. The GPU draws and composites their results. The ripple window covers nearby water bodies and resets beyond its retained area.
- Glass uses estimated thickness. The painted finish uses a four-quadrant Kuwahara filter. Bottle colour footprints and cave soft shadows use geometric proxies.
- The sundial changes the entire island's lighting. The mouse wheel works at the dial, and keyboard and gamepad time controls work anywhere. The easel has a small procedural landscape painted on its canvas.
- The cost tool is a local comparison at one camera position. A result of zero can indicate an inactive technique or a difference below measurement noise. It does not benchmark the CPU simulation.
- Software rendering supplied the validation evidence. Physical phone performance, physical-controller ergonomics and audio mix quality remain unmeasured.

## Repeat the validation

```powershell
Set-Location 'E:\html games\experiments\Astra-demo'
node verify.mjs
node verify.mjs --atlas
```

The verifier uses Node 22 or later, the installed Microsoft Edge by default, a loopback-only server on an ephemeral port and an isolated browser profile in `E:\CodexCache`. Set `CHROME_PATH` or `LITTORAL_SCRATCH` to choose another Chromium executable or scratch directory. It closes its own browser and server and removes that run's profile. The [validation record](evidence/validation.json) contains measured water values, individual waypoint errors and the timing sample.

For a fixed simulation, open `?test&seed=412&q=low`. The test surface includes `state`, `step`, `goto` (1–8), `look`, `lookAt`, `toggle`, `all`, `setSun`, `throwPebble`, `cost`, `tp`, `walk`, `walkTo`, `interact`, `blow`, `split`, `free`, `cam` and `quality` on `window.DEMO`. Additional inspection helpers are `route`, `compare`, `photo` and `inspect`. Angles are radians. `?touch` and `?desktop` force the controls presentation. `?nofloat` exercises the six float-dependent stand-ins. Input devices can be mixed during the walk.


## Recorded checks

Headless Edge on SwiftShader rendered all eight stations at low, medium and high quality, then visited all eight with float effects forced to their stand-ins. The continuous traversal crossed both cave portals, visited all eight stations and finished within 0.18 m of every waypoint. The browser reported no page, shader or WebGL errors.

The verifier exercised keyboard walking, mouse drag-look, emulated touch gestures in both control zones, simulated gamepad buttons, the effects panel, held split, bubbles, lantern pickup and placement, the sundial, free camera and a verified photo-mode PNG download. The final default-seed start card was entered with a browser mouse event. The comparison gallery decoded all 54 PNGs. Pixel differences were checked in the world area of all eight main-effect comparisons.

The timing pass produced the expected synchronous-readback warning. One scripted audio activation also produced a browser autoplay warning. Sound starts or resumes on user interaction. The full raw results are retained alongside the plates.

## Field-material extension

The sixteen-technique Astra High baseline is commit `72da5df`. This four-feature extension was implemented with Terra under the user-supplied desktop workflow and is subject to primary-agent visual review.

| Technique | In-world use | Rendering contribution |
| --- | --- | --- |
| T17 · Wipeable condensation | Use the Glasshouse clearing prompt to study the marked east pane. Drag across its physical surface, then return with the on-screen control or Escape. | A per-pane world-space mask carries wipe trails. Procedural beads refract the rendered scene, then merge and descend as the mask updates. |
| T18 · Layered waterfall moss | Use the Waterfall prompt for the close ledge view. | Three tapered splat shells follow each mapped ellipsoid cap, producing overlapping living tips at grazing angles. |
| T19 · Gust-coupled pendulums | Watch the coloured hanging bottles from the Glasshouse station. | One analytic gust field bends grass and drives length-specific damped pendulums. The same dynamic bottle positions colour the receiver footprints. |
| T20 · Intertidal shelf | Operate the overlook sundial, then use its Tide slider. | A continuous height-meshed rock shelf has a sea-connected hollow and an enclosed retained pool. Tide moves only sea water, while a barnacle band and patchy wet specular respond to recent immersion. |

Run `node verify.mjs --field` after generating the field plates. It checks the pane wipe, moss and gust toggles, pendulum motion, low/high tide, the twenty-effect array and WebGL errors.
