# Volcanic Island Walk

Open [procedural-demo.html](procedural-demo.html) directly in a current WebGL 2 browser. It is an offline, code-only scene with no downloads or runtime assets.

It opens in Walk mode on the beach. Use WASD to move, Shift to move faster, Arrow keys or drag to look, and the MOVE/LOOK pads on touch devices. Swimming begins automatically in deep enough water. The outer reef permits lagoon and shallow-sea swimming but smoothly blocks travel into the deep ocean. Aerial, Strand, Reef, Falls, and Lava are composed orbit and landmark buttons. Walk or `R` resumes first-person play at the current position. SOUND is gesture-gated and then toggles mute.

The scene generates volcanic terrain, a reef shelf, palms and forked broadleaf trees, shore objects, animated water, waterfall and lava landmarks, moving weather, contact and sun shadows, and synthesized surf, wind, landmark and footstep audio at runtime. Bare footprints and kicked sand follow the terrain. A wetting wave erases a contacted mark in about 0.11 seconds while dry marks persist. `?view=0`, `?view=1`, and `?view=2` open orbit views. `?test=swim`, `?test=falls`, and `?test=lava` provide deterministic test positions. `window.ISLAND.state()` exposes current play state and `window.ISLAND.testSpawn(x,z)` supports local testing.

See the optional [island tour](evidence/island-tour.mp4) and [wave wash](evidence/wave-wash.jpg).

## Grove and lava landmarks

GROVE opens a walk-height grassy lowland, and `?test=forest` opens the same reachable clearing. LAVA frames the sea entry, while VENT opens the source headland; `?test=lava` and `?test=vent` provide those deterministic landmark views.

Clearings use dense, wind-animated folded grass clumps while canopy cover leaves warm litter visible beneath the trees. Broadleaf crowns combine attached folded leaves with small tilted branchlet sprays, and the lava follows a terrain-draped open-melt route from an irregular upslope fissure to the shoreline.

Evidence: [forest](evidence/forest.jpg), [lava](evidence/lava.jpg), and [vent](evidence/vent.jpg).
