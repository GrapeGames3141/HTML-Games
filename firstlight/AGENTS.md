# First Light

A painterly Gaussian-splat hunting game played from a fixed seat: a tree stand over an oak clearing (Hardwood Ridge) or a duck blind on a marsh (Mallard Slough). Read the root `SPLAT-GUIDE.md` first; its "Painterly look and animals" section covers the techniques used here.

## Map of `firstlight.html`

Sections are marked by `/* ===` banners, in this order:

1. **Core and splat builder**: math, mat4 helpers, `SB`, `surf`, `line`, `cyl`, `ell`, `box`, `blade`. The splat record and the tier and flag conventions are documented at the top of the script.
2. **WebGL2**: splat, sky, ground and water shaders. `SKY_GLSL` holds `skyCol()`, shared by the sky pass and the water. Dynamic buffer helpers `dput` and `dtpl`.
3. **Areas**: `AREAS`, the two height functions (`H_STAND`, `H_BLIND`; the live one is `H`), `buildGround`, `tree`, `bush`, `rock`, `buildStand`, `buildBlind` and the ground colour functions. `trunks` collects tree trunks for shot blocking.
4. **Wildlife models**: `SPECIES`, hit `ZONES`, `quadTpl` (deer, boar, coyote, rabbit, bear), `turkeyTpl`, `birdTpl` (mallard, hen, teal, goose, heron), `WEAPONS` and `weaponTpl`.
5. **Game state**: `G`, `setEnv(day)` for the dawn-to-morning light, synthesised sound, particles.
6. **Ground game**: `spawnBeast`, `beastUpdate` (walk, feed, alert, flee, woundrun, down), `beastPose`, `beastDraw`.
7. **Waterfowl**: `spawnFlock`, `landPath`, `takeoff`, `flare`, `flockUpdate`, `birdDraw`.
8. **Shooting**: `shoot`, `makeNoise`, `useCall`, `projUpdate` (hit spheres, terrain, water, trunks), `award`.
9. **Hunt flow, render, menu, input and the `window.FL` test API.**

## Design rules

- The hunter never moves. Variety comes from the spot, the weapon and what walks or flies in.
- Non-graphic: an animal that is hit drops or runs off, then fades. No blood.
- A gunshot clears the clearing and delays the next arrivals; the bow does not. Calling helps once and spooks game when overused (twice inside 16 s).
- Shot placement matters: heart-lung, head and neck drop the animal and score more; a weak hit loses the animal and costs points. The great blue heron is protected and costs 150.
- Any weapon can be taken to either spot. `AREAS[..].best` only sets the menu default.

## Tuning knobs

- Hunt length `HUNT_LEN` (360 s). Spawn pacing in `update` (`G.spawnT`), species mixes `FOREST_MIX` and `MARSH_MIX`.
- Per species in `SPECIES`: `pts`, `tough`, speeds, flock size, flight altitude `alt`, hit radius `hitR` (birds) or `hitK` (ground game).
- Per weapon in `WEAPONS`: muzzle speed `v`, `pellets`, `spread`, `dmg`, `mag`, `cycle`, `reload`, `noise`, `aimFov`. Pellet damage falls off with range in `projUpdate`.
- Scene density: tree grid spacing and leaf count in `buildStand`, `buildBlind` and `tree`; `LOW` (phones, or `?low`) trims counts. The stand is about 220k static splats and the blind about 195k on desktop.

## Testing

Load `firstlight.html?test&area=stand&weapon=rifle` (or `area=blind`, `weapon=bow|pump|double`) headless. In test mode nothing spawns by itself and the sim only advances through `FL.step(seconds)`; set `FL.G.spawnT = 1` to turn the spawner on. Useful calls: `FL.spawn('buck', { at: [x, z], heading })` for a feeding animal, `FL.spawn('goose', { angle, land: false, pass: [x, y, z], n })`, `FL.spawn('mallard', { swimAt: [x, z] })`, `FL.aimAt(i)` then `FL.fire()`, `FL.state()`, `FL.setDay(t)`, `FL.cam(eye, at, fov)` for close-up screenshots. `?touch` forces the phone layout.

A full scripted session (350 one-second steps with the spawner on, shooting whenever something is feeding) should finish in `results` with no page errors.

## Not built yet

Stalking on foot, tracks and recovery, wind and scent, more spots, progression and unlocks.
