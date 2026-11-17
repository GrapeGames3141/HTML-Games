# Merlin's Tower Defense

Merlin stands still on his tower. The player only turns the camera and casts water, fire and lightning at a siege. The tone is comic: soldiers slip in mud, run about with their trousers on fire, and complain in speech bubbles. Self-contained WebGL2, no dependencies.

## Map of `merlin.html`

Sections are marked by `/* ===` banners, in this order:

1. **Core**: RNG (`rnd`, seeded by `?seed=`), `ss` smoothstep, mat4 helpers.
2. **WebGL2**: shaders (`pMesh`, `pTerrain`, `pSky`, particles, ribbons, bloom chain, final tonemap), HDR + MSAA targets (`resize`), the sun shadow map (`SVP`), and `ENV` lighting colours.
3. **Mesh batches**: a transform stack (`tPush`, `tMove`, `tRotX/Y/Z`, `tScale`) and the `box` / `cyl` primitives that write into the current batch `B`. Vertex alpha is emissive when positive; `-1` tags flat stone and `-2` round stone for the brick pattern.
4. **Terrain**: `hgt(x,z)`, the road, and the per-vertex grids `wet`, `scorch`, `rut`. `gridAdd` paints into them. The terrain shader turns `wet` into dark soil, mud and reflective puddles, and `uZap` into the electrified-puddle effect.
5. **Static world**: castle, towers, keep, trees, enemy camp. `AABBS` are the wall and gatehouse boxes used for aiming.
6. **Particles, ribbons, lights, debris**: `part` (type 0 alpha, 1 additive, 2 additive fire), `ribbon` and `jag` for lightning, `light` / `flashLight` (the eight strongest reach the shaders), `chunk` debris, and the `fx*` helpers.
7. **Sound**: everything is synthesized in `SFX`.
8. **Game state**: quips (`Q` for soldiers, `MQ` for Merlin), `WAVES`, soldiers (`updSoldier`, states `march`, `crew`, `climb`, `slip`, `panic`, `fly`, `zap`, `ash`, `corpse`, `flee`), machines (`MDEF`, `updMachine`: ladder, ram, tower, cat), spells (`pour`, `fireball` → `explode`, `strike`), waves and morale (`updWave`), and `update`.
9. **Drawing**: `drawSoldier`, `drawMerlin` (also sets `G.tip`, the staff tip), `drawMachine`, `drawGate`, `collectLights`.
10. **Camera, aiming, input**: the camera orbits Merlin's shoulder; `rayCast` finds the aim point; pointer lock with a free-cursor fallback (`noLock`).
11. **HUD**, **Frame** (`render`), and the **test API**.

## How the elements interact

- Water raises `wet`. Above about 0.3 it is mud: infantry slow and slip, wheels sink (`stuck`), and a crew stuck for 24 s abandons its machine. Water also soaks machines and soldiers, puts out fires, and turns lit catapult pots into duds.
- Fire ignites dry wood only; `ignite` on a wet machine just dries it. Crews beat out a small fire (`fire` below 0.55) and bail from a big one. Burning soldiers panic, spread fire, and are saved if they reach a puddle.
- Lightning hits what is near the strike, then flood-fills the connected wet cells and hits everything standing in them, then hops between soaked soldiers.

## Tuning knobs

- Difficulty: `WAVES`, mana regen in `updCast`, spell costs and cooldowns there too, `RANGE`, soldier speed in `updSoldier`, `MDEF` speeds and hit points, morale `breakAt` in `startWave`.
- Mud: thresholds in `mudAt`, drying rate at the end of `update`, wheel slowdown `k` in `updMachine`.
- Look: `ENV`, bloom threshold and `uBloomK` in `render`, particle recipes in the `fx*` helpers.

## Testing

Load `merlin.html?test&seed=7`. This skips the title, disables pointer lock and exposes `window.MT`: `state()`, `hold(true)` to stop the real-time loop, `step(seconds)`, `cast(spell, x, z, seconds, y)`, `spawn(type, x, z, goalX, goalZ)` with type `g`, `ladder`, `ram`, `tower` or `cat`, `wave(n)`, `quiet()`, `mana(v)`, `wet(x, z, r, amount)`, `look(yaw, pitch)` and `lookAt(x, y, z)`. A hidden browser pane throttles `requestAnimationFrame`, so call `updCamera(); render(); hud(0)` before a screenshot.

Balance was checked with a scripted player that only throws fireballs, lightning and douses fires (no water-then-lightning combos). Acting once a second with a 2.5 unit aim error it reaches wave 6 and finishes close to losing; an idle player loses in wave 2. A full run is about eight minutes.
