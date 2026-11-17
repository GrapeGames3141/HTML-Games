# Dust Devil

An on-rails attack-helicopter shooter in the spirit of early-90s polygon rail shooters, built from the desert-helicopter entry in the root `brainstorming.md`. The helicopter moves forward along a fixed rail. The player steers inside a corridor around it (lateral offset `ox`, height `oy`), boosts or brakes, and aims a chin gun and rockets with the mouse. Every mission runs from an ingress pad, through a mission goal, to an egress pad. The game is self-contained flat-shaded WebGL2 with no dependencies.

## Map of `dustdevil.html`

Sections are marked with `/* ===` banners, in this order:

1. **Core**: vector and `M4` matrix helpers, seeded RNG (`RNG` for gameplay, `MR` for mesh jitter), value noise (`fbm`).
2. **WebGL**: the mesh shader (flat lighting, hemisphere ambient, distance fog), sky, point particles, and ribbons for tracers, rope and blob shadows. `MB` is the mesh builder (`box`, `tz` tapered block, `cyl`, `rock`).
3. **Meshes**: the player helicopter (`HS` scale), enemy gunship, tank, trucks, AA, SAM, radar, depot, hangar, compound, survivor and resupply ring.
4. **Rail & terrain**: `buildRail` (Catmull-Rom curve resampled every 4 m), `railPos(s)`, `railY(s)` (smoothed ground maximum plus `clear`), a terrain heightfield from each level's `height(x,z,d,s,lat)`, `groundY` (matches the triangle split exactly), and static scenery (pads, rocks, poles, tunnel, roads).
5. **Entities**: `KINDS` table. Each kind has `parts` (local boxes with hp and `gunMul` armor), `update`, `draw`, and `onPart` for part-death effects (tracks immobilize, turret disarms, a fuel cargo hit chain-explodes, a bridge pier collapses the span). `followRoute` drives convoys and the bridge column, which escape at the end of their route.
6. **Levels**: `LEVELS[]` holds the palette, rail control points, height function, `setup(API)` placement (`API.add(kind, s, lat, opts)`, `API.route`, `API.span`), `events` keyed on rail distance `s` (radio, `act` to start moving tagged units, `gunships`), `objectives`, and optionally `hover` (a winch LZ that holds the rail until the rescue objective completes).
7. **Player**: corridor flight, speed control, terrain and solid-entity collision, `orientHeli`, weapons (gun heat, rockets, flares), and the winch pendulum.
8. **Projectiles & FX**, **Mission logic** (objectives fail on `deadlineS`, `failEscape`, or `pass`, meaning a tagged target is left behind), **Sim**, **Camera & render**, **HUD**, **Audio** (WebAudio synth), **Screens** (menu, briefing with map, pause, debrief with medals saved under `localStorage['dustdevil.save']`).

## Tuning knobs

- Flight: `L.speed`, `L.corridor`, `L.clear`; boost ×1.75 and brake ×0.22 in `updatePlayer`.
- Player weapons: gun 11 rounds/s, 7 damage, heat +0.032 per shot; rockets 55 direct plus a 9 m, 40-damage blast; 38 rockets and 8 flares.
- Enemy pressure: tank shell damage, error and cooldown, AA burst size and spread, gunship burst, SAM lock time and missile damage. Ground units stop firing once the player is more than 50 m past their `railS`.

## Testing

Load `dustdevil.html?test&level=N&seed=S&manual`. The `?test` flag skips the menu and mutes audio; `manual` stops the real-time loop so tests drive it. `window.DD` provides `start(i)`, `step(sec)`, `warp(s)` (skips events before `s`, including `act` triggers), `god()`, `aimAt([x,y,z])`, `kill(tag)`, `draw()` (renders one frame and returns its time in ms), `state()` (includes `src`, damage taken by projectile kind), plus `keys`, `mouse`, `G` and `P`. Hold inputs by setting `DD.keys.KeyK = true` and so on. Balance reference: a weaving player that never shoots finishes Long Rope at about 25% armor and loses about 10 armor in Dry Wadi.
