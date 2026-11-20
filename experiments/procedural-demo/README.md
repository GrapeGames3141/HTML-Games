# Volcanic Island Walk

Open `procedural-demo.html` in a current WebGL 2 browser. This standalone offline scene generates its volcanic terrain, reef shelf, foliage, palms, forked broadleaf trees, shore objects, water, landmarks, effects, and Web Audio entirely from code at runtime.

It opens in Walk mode on the beach. Use WASD to move, Shift to move faster, Arrow keys or drag to look, and the on-screen MOVE/LOOK pads on touch devices. Dry sand leaves paired bare footprints and short-lived kicked grains; wading makes wet marks and splashes; swimming begins automatically once water is deep enough. The outer reef is a smooth invisible movement boundary: it allows lagoon and shallow-sea travel but keeps the player out of the ocean depths.

Walk returns from an orbit view. Aerial, Strand, and Reef retain their composed orbit cameras; `?view=0`, `?view=1`, or `?view=2` opens one directly. `R` returns to Walk. Falls and Lava use eye-level landmark viewpoints: the falls include a short generated stream, curtain, pool, spray, wet basalt banks, and boulders; the lava route ends at a generated cooled basalt apron with animated fissures and sea-contact steam. SOUND enables the gesture-gated synthesized surf, wind, landmark noise, and footfalls; it then toggles mute.

For deterministic validation, `?test=swim`, `?test=falls`, and `?test=lava` begin at matching test locations. `window.ISLAND.state()` exposes `mode`, `medium`, `player`, `groundElevation`, and `reefMargin`; `window.ISLAND.testSpawn(x,z)` moves the player for local testing. The reef contour uses `R(theta)=1+.052*sin(3θ+.45)+.025*sin(7θ-1.2)` scaled by `(164m,124m)`.

Sand effects are a bounded local particle approximation: small grains receive a one-time footfall velocity, fall and settle against the same triangulated height field used for walking, then expire. It is intentionally not a whole-beach fluid simulation.
