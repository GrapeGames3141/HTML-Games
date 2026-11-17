# Broadside

A galleon-against-galleon duel rendered with Gaussian splats. The player only aims and fires; both ships sail themselves. Read the root `SPLAT-GUIDE.md` for the renderer, water and headless-test conventions this game uses.

## Map of `broadside.html`

Sections are marked by `/* ===` banners, in this order:

1. **Core**: math, mat4 helpers, the shared wave function (`WAVES` → `waveH` in JS and `WAVE_GLSL`), environment constants (`SUN`, `WIND_TO`), and the splat builder (`SB`, `surf`, `line`, `cyl`, `box`).
2. **WebGL2**: splat, sky, water and line shaders, the dynamic splat buffer (`dput`, `dtpl`), and the polar water mesh.
3. **Galleon geometry**: `HULL` (keel, deck, rail, transom, stem, half-beam `hw`). The same functions drive splat generation and hit tests. Also `GUN_X`, `CHASERS` (two bow and two stern chase guns), `MAST_DEFS`, the compartments (`COMP_X`), paint `STYLES`, and the hull/mast/cannon/rudder/flotsam builders.
4. **Islands**: distant static splats.
5. **Ship**: helm AI (wears ship rather than tacking through the wind), sailing, wave motion, flooding (breaches, carpenters, pumps, lower-port downflooding, list and trim, foundering), mast topple/drag/cut-away, cannon aiming (`aimAt`) and loose cannons, hit `probe`.
6. **Game**: sound, particles, flotsam, cannon fire and ball ballistics, `applyHit` zone effects, enemy gunnery (`solveElev`, `pickZone`), player aiming, camera, render, HUD, game flow, input, and the `window.BS` test API.

## Tuning knobs

- Ballistics: `V0`, `DRAG`, cannon spread in `fireGun`, and gun arcs `GUN_YAW`/`GUN_PMIN`/`GUN_PMAX`.
- Flooding: `FLOOD_K`, `CAP`, `FOUNDER_W`, the pump rate and carpenter plug rate in `Ship.flood`, and the lower-port leak area.
- Enemy difficulty: `spawnEnemy` (aim error, reload, spread, rising with each win) and the `aiGunnery` fire range.
- Sailing: `VMAX`, the wind polar in `Ship.update`, and the no-go angle in `helm`.
- Manoeuvring (only while the rudder is undamaged): in `helm`, the range goal drifts every 22–40 s, there's an occasional ±16° bias to bear up or away, and a gentle ±9° weave on a 28–40 s period.

## Testing

Load `broadside.html?test&seed=7` headless. Useful calls: `BS.step(s)`, `BS.state()`, `BS.aimBallistic([x,y,z])` (enemy-local point, tracks the moving ship), `BS.broadside()`, `BS.topple(i)`, `BS.breach(local, r)`, and `BS.look('enemy', offset, target)` for screenshots. A full scripted fight (about 5 minutes of sim) is a good balance check. A competent waterline-focused player should sink the first enemy in roughly 4 to 6 minutes, and an idle player should survive several minutes.
