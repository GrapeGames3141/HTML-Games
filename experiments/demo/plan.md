# Technique demo: a walk from the beach to the cave

**Status:** first version built on 2026-11-17 as `demo.html`. All eight stations and all twelve techniques are in; see "What was built" for where the build differs from this plan and what is still rough.
**Updated:** 2026-11-17
**Folder:** `experiments/demo/` (entry point `experiments/demo/demo.html`, local URL `http://127.0.0.1:8000/experiments/demo/demo.html`)

This is an experiment, not an arcade game. It stays out of the arcade lobby and the Pages build, per `experiments/AGENTS.md`.

## Purpose

One small world you can walk through that shows every technique in [techniques-ideas.md](../../techniques-ideas.md) in a place where it belongs, and shows them working together. There is no combat and no score. The point is to look, poke at things, and switch each effect on and off to see what it adds and what it costs.

IDs such as T5 refer to that file.

## The walk

A single loop of about 600 m, ten to fifteen minutes at a stroll. It climbs from sea level through a forest to a cave, and comes out on a cliff above the starting beach.

```
        [8 Cliff overlook]
          /            \
   [7 Cave]             \  path down
      |                  \
 [6 Waterfall pool]       \
      |                    \
 [5 Glasshouse clearing]    \
      |                      \
 [4 Dappled forest]           \
      |                        \
 [3 Stream] -- [2 Tide pools] -- [1 Beach]  ~~ ocean ~~
```

### 1. The beach

Bright midday sun, pale sand, a long swell rolling in.

- **Ocean (T6):** FFT swell with foam on the crests and a line of foam where waves run up the sand.
- **Shallows (T9):** the water is clear at the edge and turns green, then blue, as it deepens. The sand ripples underneath are bent by the surface.
- **Shadows (T3):** palms and driftwood cast sharp midday shadows. This is the plainest test of the shadow map.
- **Wet sand:** a darker, shinier band where the last wave reached. A small touch that sells the shoreline.
- **To do here:** wade in to knee depth and watch the sand through the water.

### 2. Tide pools

Flat rocks at the end of the beach with still pools left by the tide.

- **Ripples (T5):** each pool is its own small simulation. Throw a pebble or step in and rings spread and bounce off the rock.
- **Caustics (T7):** the light net on the pool floor comes from that same surface, so a pebble's ring of ripples becomes a ring of light.
- **Refraction (T9):** anemones and shells on the bottom wobble as ripples pass over them.
- **To do here:** throw pebbles. This is the first hands-on stop and probably the most satisfying one.

### 3. The stream

A shallow stream crosses the sand to the sea. The path follows it uphill.

- **Ripples (T5) with flow:** the same simulation with a steady push downstream, so rings from a pebble drift and stretch, and water piles up and parts around stones.
- **Caustics (T7):** moving light on the gravel bed.
- **Where it meets the sea:** the calm stream runs into the ocean swell. Blending T5 into T6 across the mouth is a real test of two water systems side by side.
- **To do here:** walk up the stream bed and watch the wake around your feet.

### 4. The dappled forest

Tall trees, a broken canopy, ferns, morning mist that has not burned off under the leaves.

- **Dapple (T3):** every leaf cluster casts its own patch of shade, and the patches move as the canopy sways.
- **Light shafts (T2):** beams come down through gaps in the canopy and are cut by trunks as you walk past.
- **Soft shadows (T4):** trunks and boulders get contact shadows that are sharp at the base and blur outward.
- **Iridescence (T10):** beetles on a log and a slick of oil-like sheen on a still puddle.
- **To do here:** walk through a shaft and see your own shadow break it.

### 5. The glasshouse clearing

An abandoned greenhouse in a sunny clearing, half its panes intact, with a bottle tree beside it: coloured bottles hung from the branches on strings.

- **Layered glass (T8):** look through three or four dusty panes at once, plus drifting pollen and smoke from a small fire, all without sorting errors.
- **Thick glass (T9):** the bottles bend the forest behind them, tint deeper at the base, and throw colour fringes at their edges.
- **Coloured shadows (T3 + T9):** the bottles cast tinted light on the ground.
- **Bubbles (T10):** a bubble wand on a bench. Blow bubbles and watch the colours slide as they drift.
- **Mesh among splats (T11):** the greenhouse frame and bottles are meshes, the clearing is splats. This is where the painterly filter has to prove it can join them, and it feeds straight back into the Slingshot idea.
- **To do here:** blow bubbles, and walk around the bottle tree.

### 6. The waterfall pool

The stream's source: a waterfall dropping from a rock ledge into a deep pool, with mist hanging in front of it.

- **Falling water (T12):** particles pour over the lip, break up on the way down, and splash where they land. Mud at the pool edge is the same fluid with more drag.
- **Pool (T5 + T7):** the fall keeps the surface churning, with caustics flickering on the rocks under it.
- **Mist (T2 + T8):** spray lit by a shaft of sun, with the falls and the pool seen through it.
- **To do here:** walk behind the falls. The cave mouth is there.

### 7. The cave

Dark. The sun is gone a few steps in, and the only light is what glows.

- **Bounced glow (T1):** blue-green mushrooms, veins of crystal, and a lantern the player picks up at the entrance. The lantern lights the wall, the wall lights the floor, and each mushroom tints the rock around it. This is the showpiece of the whole walk.
- **Soft shadows (T4):** stalagmites throw long, soft shadows that swing as the lantern moves.
- **Crystals (T9):** clusters that bend and split the lantern light.
- **Underground pool (T5 + T7):** drips from the ceiling make rings, and light reflected off the water ripples across the cave roof.
- **Daylight ahead (T2):** a single shaft falls through a hole in the roof near the exit.
- **To do here:** carry the lantern, set it down, and walk away from it to see the room change.

### 8. The cliff overlook

The cave opens high on a cliff. The whole beach, the stream and the forest canopy are below.

- **Everything at distance:** ocean to the horizon (T6), the forest with its shadows (T3), haze in the air (T2).
- **Easel (T11):** an easel stands at the edge. Standing at it turns the painterly filter to full strength so the view becomes a painting.
- **Time of day:** a sundial here controls the sun. Drag it from noon to sunset and watch every station's light change at once.
- **To do here:** take in the view, then follow the path down to the beach.

## Technique by station

| | Beach | Tide pools | Stream | Forest | Glasshouse | Waterfall | Cave | Overlook |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| T1 Radiance cascades | | | | | | | **main** | |
| T2 Light shafts | | | | **main** | | yes | yes | yes |
| T3 Splat shadow maps | **main** | | | **main** | yes | | | yes |
| T4 Distance-field shadows | | | | yes | | | **main** | |
| T5 Ripple simulation | | **main** | **main** | | | yes | yes | |
| T6 FFT ocean | **main** | | yes | | | | | yes |
| T7 True caustics | | **main** | yes | | | yes | yes | |
| T8 Blended transparency | | | | | **main** | yes | | |
| T9 Refraction | yes | yes | | | **main** | | yes | |
| T10 Thin-film | | | | yes | **main** | | | |
| T11 Painterly filter | | | | | yes | | | **main** |
| T12 Particle fluid | | | | | | **main** | | |

Every technique has one station where it is the main event and at least one more where it works alongside others.

## Seeing what each effect does

- **Signposts.** Each station has a post naming the techniques at work there. Standing by it shows a short caption.
- **Toggles.** A panel (and number keys) switches each technique on and off, anywhere. Off means the cheap stand-in the other games already use, so the difference is the improvement.
- **Split view.** Hold a key to wipe the screen: left half with the effect, right half without.
- **Cost readout.** Frame time and a per-technique estimate, so the price of each effect is visible beside its result.
- **Free camera and photo mode** for screenshots.

## Controls

First person, walking only, with wading in shallow water. No jumping or swimming. Both control sets are always live, so a touch laptop can mix them. The page picks the touch layout when the main pointer is coarse; `?touch` and `?desktop` force one or the other. The start card lists the controls for the device in use, with a link to show the other set.

### Desktop (keyboard and mouse)

| Input | Action |
| --- | --- |
| W A S D or arrow keys | Walk. Hold Shift to walk faster. |
| Mouse | Look. Click the view to capture the mouse, Esc to release it. Dragging with the button held also looks, for when capture is not available. |
| Left click (mouse captured) | Throw a pebble |
| E | Use: pick up or set down the lantern, blow bubbles at the bench, open the sundial slider |
| Tab | Effects panel (releases the mouse so the switches can be clicked) |
| 1 to 9, 0, -, = | Toggle T1 to T12 |
| Hold V | Split view: effects on the left, everything off on the right |
| [ and ] | Time of day, anywhere. The mouse wheel does the same at the sundial. |
| F | Free camera. WASD flies along the view, Space is up, C is down, Shift is fast. |
| P | Photo mode (hides the interface). Enter saves a PNG. |
| Q | Cycle quality: low, medium, high |
| M | Measure cost |
| H | Show the controls card |

### Mobile (touch)

| Input | Action |
| --- | --- |
| Left 45% of the screen | Walk. A stick appears under the thumb wherever it lands. Past 92% of its travel is the fast walk. |
| Rest of the screen | Drag to look |
| THROW button | Throw a pebble where the view is pointing |
| USE button | Only shown near something usable. Its label says what it will do: LANTERN, SET DOWN, BUBBLES, SUNDIAL. |
| SPLIT button | Hold for split view |
| Menu button (top right) | Effects panel: one switch per technique with its cost, plus Split view (latching), Measure cost, Free camera, Photo mode, Quality and Controls |
| Up and down arrows | Shown in free camera only: rise and sink |
| Sundial slider | Appears on screen when standing at the sundial |
| Photo mode | Save picture and Exit photo mode buttons replace the interface |

Touch details: buttons sit inside the safe-area insets, pinch zoom and the long-press menu are disabled, phones start at low quality with a 1.5x pixel-ratio cap, and a hint asks for landscape when the phone is upright (portrait still works, with a wider field of view).

There is no gamepad support yet.

## How it fits together technically

- **Terrain:** one height function for the whole island, shared by drawing, walking and water depth, as in Spearfish. The cave is a separate enclosed piece joined at the waterfall and the cliff.
- **Scenery:** procedural splats following `SPLAT-GUIDE.md`, with ground as a mesh plus splat litter. Glass, bottles, greenhouse frame and crystals are meshes.
- **Frame order:**
  1. Shadow map from the sun (T3).
  2. Opaque scene into colour, depth and normal buffers.
  3. Water simulation steps (T5, T6) and caustic maps (T7).
  4. Water surfaces and refractive objects, reading the opaque buffers (T9).
  5. Transparent layers (T8), particles and fluid (T12).
  6. Light shafts (T2) and, in the cave, radiance cascades (T1).
  7. Painterly filter (T11), tonemap, output.
- **Only pay for what is near.** Each technique runs only in or within sight of its stations: cascades only in the cave, the ocean transform only when the sea is visible, each pool's simulation only when the player is close. The world is laid out so the expensive ones never overlap: the cave has no ocean and the beach has no cascades.
- **Quality levels.** Low, medium and high settings scale buffer resolution, shadow map size and simulation grid size. Missing float-texture support drops the affected technique to its stand-in with a note on the signpost.
- **Testing.** Headless as usual, with `?test&seed=N` and a `window.DEMO` API: `state()`, `step(seconds)`, `goto(station)`, `look(yaw, pitch)`, `lookAt(x, y, z)`, `toggle(id, on)`, `all(on)`, `setSun(0..1)`, `throwPebble()`, `cost()`, plus `tp(x, z, inCave)`, `walk(mx, mz, seconds, run)`, `walkTo(x, z)`, `interact()`, `blow()`, `split(on)`, `free(on)`, `cam(eye, yaw, pitch)` and `quality(name)`. In `?test` the page only advances through `step()`. Other URL flags: `&q=low|medium|high`, `&touch`, `&desktop`, and `&nofloat` to exercise the fallback for devices without float render targets. One screenshot per station with each technique on and off makes a ready comparison sheet. SwiftShader is slow on the heavy passes, so test at low or medium quality and a small window.

## Build order

Each step is a working, committable milestone, and each adds one or two techniques to a world that already walks.

1. **Walkable island.** Terrain, splat scenery for all eight stations in rough form, walking, signposts, toggle panel, test API. Flat stand-in water and no new techniques.
2. **Shadows and scene buffers.** T3 everywhere, plus the off-screen colour, depth and normal buffers that later steps need.
3. **Tide pools and stream.** T5, then T7, then pebble throwing.
4. **Refraction and glass.** T9 for water and bottles, then T8 for the greenhouse, then T10 for bubbles and beetles.
5. **Forest air.** T2 light shafts, then T4 contact shadows.
6. **Ocean.** T6, and the blend where the stream meets the sea.
7. **Cave.** T1 with the lantern, mushrooms and crystals, then the underground pool.
8. **Waterfall.** T12, with the spray-and-ripples stand-in built first so the station works either way.
9. **Overlook.** T11, the easel, the sundial, split view and the cost readout.

After each step, write what was learned into `SPLAT-GUIDE.md` or a new guide.

## Risks

- **Radiance cascades (T1)** is the hardest piece. The screen-space version misses light from sources off screen, which shows when the lantern is behind you. A dim ambient floor and keeping glowing things spread around the cave should hide most of it.
- **Particle fluid (T12)** may not hold frame rate without compute shaders. The stand-in is planned from the start.
- **Too much at once.** Twelve techniques in one page is a lot of shader code and a lot of buffers. The build order keeps it working at every step, and the per-station switching keeps the frame cost bounded.
- **One look.** A dozen techniques can pull in a dozen visual directions. The shared lighting function and the painterly filter are what hold it to one style, so check the overall picture at every milestone and not only the new effect.
- **Phones.** Float targets and several full-screen passes are heavy on mobile. Treat low quality on a phone as a goal for the end, not a requirement for each step.

## What was built (2026-11-17)

`demo.html` is one self-contained WebGL2 page, about 136 KB, with roughly 122,000 static splats. The walk is a closed loop and was walked end to end by script: beach, tide pools, stream, forest, glasshouse, waterfall, through the cave, out at the overlook, and down the trail to the beach.

Where the build differs from the plan above:

- **T1 works on the cave floor plan, not in screen space.** The cascades run over a top-down 96 m square of the cave (256 or 512 texels), with walls and stalagmites as occluders and the lantern, mushrooms, crystals, daylight at the two mouths and the roof shaft as emitters. Walls re-emit a share of the light that reaches them, so bounce builds up over a few frames. This removes the off-screen-light risk listed under Risks: a lantern behind the player still lights the room. The cost is that light has no height, so a lantern on the floor and one held high light the walls the same.
- **No normal buffer.** The scene renders to colour and depth only, because nothing ended up reading normals.
- **T12 is particles simulated in JavaScript** (1,200 to 5,000 by quality) with pairwise pressure and viscosity, drawn as a smoothed depth surface. It reads as heavy spray breaking on two ledges more than as a sheet of water, and the mud was not built. The sprite stand-in is what T12 off shows.
- **T8 uses two passes** (one for the colour sum, one for how much background survives), so it does not need `OES_draw_buffers_indexed`. With T8 off the panes are blended unsorted and write depth, which is the classic failure it fixes.
- **T3 is two shadow maps**: one 88 m wide that follows the player and one for the whole island that is redrawn only when the sun moves. Bottles cast tinted light through a colour layer on the near map; this is subtle and was not checked closely.
- **T6 is one 56 m tile** plus a rotated detail copy for normals, with no height read-back since nothing floats. The stream-mouth blend is the swell fading out with depth, not a separate blend.
- **Split view** compares everything on with everything off, not one technique at a time.
- **Cost readout** times each pass by forcing the GPU to finish before and after it. T4, T9 and T10 live inside other shaders, so Measure cost gets them by drawing whole frames with each one on and off.
- **Signposts** are blank boards with one dot per station number; the caption is on screen, not on the board.

Not built: sound, ambient life, mud at the pool edge, gamepad input, collision with the greenhouse walls.

Known rough edges: the upper cave mouth shows a thin see-through sliver beside the tunnel; the greenhouse panes read as milky more than dusty; the bubble colours and beetles are small unless you walk right up to them.

Tested only in headless Chrome on SwiftShader (software rendering): every station at low, medium and high quality, the no-float fallback, the touch layout at phone size in both orientations, and the keyboard and mouse path, all with no shader, WebGL or page errors. Frame rate on a real GPU and on a real phone has not been measured.

## Open questions

Decisions taken for the first version, all easy to change:

- The sun stays at late morning until the sundial (or the `[` and `]` keys) moves it.
- The lantern lights the scene anywhere once picked up. T1 itself still runs only in and near the cave.
- No ambient life.
- No sound.

Original questions, kept for reference:

- One sun position by default, or does the walk start at dawn and end at sunset on the cliff?
- Should the lantern be usable outside the cave at dusk, to show T1 in the forest as well?
- Ambient life (crabs, fish in the pools, birds), or keep it empty so the effects are the subject?
- Sound: surf, stream, forest, drips. Wanted in the first version or later?
