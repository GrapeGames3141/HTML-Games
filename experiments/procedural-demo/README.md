# Volcanic Island Walk

Open `procedural-demo.html` in a current WebGL 2 browser. This is a standalone, offline procedural scene: terrain, reef shelf, foliage, palms, branch forks, shore objects, water, landmarks, effects, and Web Audio are generated from code at runtime.

It opens in Walk mode on the beach. Use WASD to move, Shift for a faster pace, Arrow keys or drag to look, and the on-screen MOVE/LOOK pads on touch devices. Dry sand leaves persistent paired bare footprints and short-lived kicked grains; wading makes wet marks and splashes; swimming begins automatically once the water is deep enough. The outer reef is an invisible, smooth movement boundary: it permits travel throughout the lagoon and shallow sea, but blocks passage into ocean depths.

Walk returns from an orbit view. Aerial, Strand, and Reef retain the composed orbit cameras; `?view=0`, `?view=1`, or `?view=2` opens one directly. `R` returns to Walk. Falls and Lava place the player at their respective trail starts. SOUND enables the gesture-gated synthesized surf, wind, landmark noise, and footfall effects; it also mutes/unmutes them.

For deterministic validation, `?test=swim` begins at the water test spawn. `window.ISLAND.state()` exposes `mode`, `medium`, `player`, `groundElevation`, and `reefMargin`; `window.ISLAND.testSpawn(x,z)` moves the player for local testing. The reef contour uses `R(theta)=1+.052*sin(3θ+.45)+.025*sin(7θ-1.2)` scaled by `(164m,124m)`.

Sand effects are a bounded local particle approximation: small grains receive a one-time footfall velocity, fall and settle against the same triangulated height field used for walking, then expire. It is intentionally not a whole-beach fluid simulation.
