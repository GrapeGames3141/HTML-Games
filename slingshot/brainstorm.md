# Slingshot: Brainstorm

**Status:** planning notes only. Nothing here authorizes implementation.
**Updated:** 2026-11-17
**Folder:** `slingshot/` (future source file `slingshot/slingshot.html`)
**Working title:** Slingshot. Candidates: *Snapback*, *Ouch!*, *Plink*.

## The idea in one paragraph

A kid with a slingshot in an overgrown back lot, plinking bottles, cans, pans and wind chimes. Holding the button stretches the bands, and a longer hold throws the pebble farther. Hold too long and the band snaps, slaps your hand, and you yell "Ouch!". The far targets can only be reached by stretching close to the snapping point, so every long shot is a small dare.

It is also a rendering experiment. The terrain is Gaussian splats like the other games, the targets are ordinary triangle meshes, and the meshes wear textures painted from Gaussians so they belong in the same picture.

## The draw: hold for range

Aim with the mouse or by dragging a finger. Press and hold to draw, release to shoot. Launch speed depends only on how far the bands are stretched at release, and gravity does the rest. As in Broadside, the cursor is a direction and never a promise: no landing marker, no aim snap, no auto-elevation. You shoot, watch where the pebble lands, and correct.

The draw has three zones.

| Zone | Hold time (starting values) | What it gives | What you see and hear |
| --- | --- | --- | --- |
| Draw | 0 to 1.1 s | Launch speed rises from about 30% to 100% | Bands stretch and thin, pouch comes back toward the camera |
| Overstretch | 1.1 to about 2.0 s | Up to about 15% more speed, which is the only way to reach the farthest targets | Bands pale toward white, rubber creaks faster and higher, the hand starts to shake and the aim wobbles |
| Snap | at the snap point | Nothing. The shot is lost | Band breaks, whips the hand, "Ouch!" |

Speed should rise quickly at first and flatten near full draw, so the middle of the range is easy to repeat and the top end takes nerve. All times and percentages are tuning values, not decisions.

### The snap

- The snap point is not a fixed time. It sits somewhere in a small window (say 1.8 to 2.2 s) chosen fresh for each band, so counting in your head is not enough. The creak and the whitening rubber are the real warning, and they speed up in the last few tenths of a second.
- When it snaps: a sharp crack, the band lashes back across the hand, the view flinches, the hand shakes itself out, and the kid yells "Ouch!". Use several yelps so it stays funny on the twentieth snap.
- Cost: the pebble drops at your feet, the streak ends, and re-tying a new band takes a couple of seconds. On a timed round that is punishment enough.
- Optional sting: for the next shot or two the sore hand wobbles a little more. Worth trying, easy to remove if it feels mean.
- Optional wear: each trip into the overstretch zone ages the band a little and pulls its snap point earlier, so a band you have abused all round is less trustworthy than a fresh one. Leave this out of the first version.

A plain rule for fairness: a player who releases at the first creak never snaps. The snap is always the player's own gamble.

## Targets

Meshes with simple physics, each with its own sound and reaction.

- **Bottles** on a fence rail: shatter into shards.
- **Tin cans** on stumps and posts: jump, spin, tumble, and can knock their neighbours over.
- **Hanging pans and pot lids:** ring like a gong and swing, which makes a moving target of them for the follow-up shot.
- **Wind chimes:** each tube sounds its own note.
- **Clay flowerpots:** break and spill dirt.
- **Hubcaps** nailed to a shed: loud clang, spin on the nail.
- **A swinging tyre:** thread a pebble through the middle for a bonus.
- **The weather vane and the barn bell:** the distant showpieces that need overstretch.

Chain reactions are worth designing for: a can falls onto a pan, a bottle row goes down like dominoes.

## The lot

One place to start: a back lot behind a barn in late afternoon. Grass and weeds, dirt mounds, a rusted car hulk, a board fence, a shed, a few trees, hills in the distance. All of it is splats, in the painterly style from First Light.

Targets are set out in three bands of distance.

| Band | Distance | Draw needed |
| --- | --- | --- |
| Near | 8 to 15 m | Half draw. Teaches the arc |
| Middle | 20 to 30 m | Near full draw |
| Far | 40 m and beyond | Overstretch only |

The player stands still, or moves between two or three fixed spots. No free walking in the first version.

## Rounds and scoring

- A round is one arrangement of targets and a pocketful of pebbles (say 15), or a short timer. Try both and keep the one that feels better.
- Points rise with distance. Streaks multiply. Chain reactions and trick shots (tyre, vane) pay extra.
- A snap ends the streak and costs time, but takes no points away.
- Results: shots, hits, misses, accuracy, snaps, longest hit, best streak, chain reactions, time.

## Rendering experiment: splat terrain, mesh targets, Gaussian textures

### Why mix

Splats are good at soft, organic things: grass, dirt, bark, foliage. They are poor at small hard objects that have to spin, ring and shatter. A bottle built from splats has a fuzzy outline and no clean way to break into pieces. A mesh gives a crisp silhouette, exact collision, cheap rigid motion and shards that are real geometry. The risk is that meshes look pasted onto a painted world. The Gaussian texture is the attempt to solve that.

### What a "Gaussian texture" means here

The target is a normal low-poly mesh. Its texture is painted out of Gaussian daubs, the same soft, ragged strokes the terrain is made of, laid down in the mesh's UV space. Up close the bottle's surface is brush strokes, and its outline stays sharp. It is a pseudo asset: generated from a seed when the page loads, with no image files and no modelling tool.

Three ways to make it, in order of preference.

1. **Bake at load (recommended first try).** For each target type, draw a few hundred Gaussian daubs into an offscreen texture: base colour, then label, rust, dents and highlights as layers of strokes. Use the same lobed-edge falloff as the First Light splat shader so the strokes match. Pack everything into one atlas. Cost at run time is one texture lookup. Different seeds give every can its own rust.
2. **Evaluate in the fragment shader.** Store a few dozen Gaussians per target in a small data texture and sum them per pixel. Stays sharp at any distance and can animate (a dent appearing where the pebble hit), but costs more per pixel and is harder to art-direct.
3. **Splats pinned to the mesh.** Real splats that ride the mesh surface. Closest match to the terrain, but it gives back the fuzzy outline the mesh was meant to fix. Useful only for trim, as below.

### Making the two worlds agree

- One lighting path. The mesh shader calls the same sun, ambient, tonemap and fog functions as the splat shader. A mismatch here would show more than any texture difference.
- Soften the outline slightly. A thin alpha fringe at the mesh edge with alpha-to-coverage, or a handful of real rim splats per target, keeps the silhouette from looking cut out.
- Paint the shading in. Baked strokes can carry a little fake light and shadow, as a painter would, so the low polygon count does not show.
- Ground the targets. A soft dark contact splat under each can and bottle does more than real shadows would.
- When things break, mix again. Shards are mesh pieces that keep their UVs, so the paint stays on the glass. The puff of dust and glitter around them is splat particles.

### What the experiment should answer

- Do mesh targets read as part of the painting at 10 m and at 40 m?
- Is the baked atlas enough, or does the shader version earn its cost?
- Does this give a cheaper and better route for small props in the other games?

Whatever is learned goes into `SPLAT-GUIDE.md`.

## Sound

Sound carries the draw as much as the picture does: the rubber creak that rises in pitch through overstretch, the thwack of release, the hiss of the pebble, then glass, tin, a gong, a chime or a bell. The snap is a crack followed by the yelp. Everything can be synthesized in Web Audio. Whether the "Ouch!" is synthesized, comes from the code-sings voice work, or is a recording is an open choice.

## Technical notes

These lean on `SPLAT-GUIDE.md` and need no new invention except the mesh pass.

- Ground as a warped mesh with splat litter and blades on top, as in First Light.
- Slingshot and hand as a first-person viewmodel drawn last with a narrow depth range, as in Spearfish. The bands are two stretched strips whose length, width and colour follow the draw.
- Pebble as a fast projectile: test the whole frame segment against the targets, as in First Light.
- Targets collide as simple shapes: cylinder for cans and bottles, disc for pans and hubcaps, torus for the tyre.
- Bottles and pots break into pre-cut shards (8 to 12 pieces designed with the mesh), not into pieces computed at run time.
- Rigid-body motion can be very simple: position, velocity, spin, bounce off the ground height function, come to rest.
- Headless test hooks from the start: `?test&seed=N` and a small `window` API with `state()`, `step(seconds)`, `aim(yaw, pitch)`, `draw(seconds)`, `release()`, and a way to list targets.

## Smallest version worth building

One lot, one standing spot, the three-zone draw with the snap and the yelp, three target types (can, bottle, hanging pan) at three distances, one round of 15 pebbles, a results screen. Targets are meshes with baked Gaussian textures. That is enough to judge both the dare of the overstretch and the mixed rendering.

## Later options

More lots (creek, rooftop, fairground stall), moving targets (a toy train, a spinning windmill), different ammunition (marbles, acorns, a water balloon), wind, band upgrades that trade top speed for a wider safe zone, a two-player turn-taking mode, and a trick-shot challenge list.

## Open questions

- Pebble count or timer for a round?
- Does the sore-hand wobble after a snap add fun or only annoyance?
- Touch control: hold anywhere and drag to aim, or pull back from the fork like a real slingshot?
- How much of the trajectory should be visible: just the pebble, or a faint trail?
- Fixed standing spot, or a few spots to move between?

The root [game brainstorming overview](../brainstorming.md) lists this idea alongside the others.
