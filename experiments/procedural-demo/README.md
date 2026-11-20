# Volcanic Island Walk

Open [candidate.html](candidate.html) directly in a current WebGL 2 browser. It is an offline, code-only scene with no downloads or runtime assets.

It opens in Walk mode on the beach. Use WASD to move, Shift to move faster, Arrow keys or drag to look, and the MOVE/LOOK pads on touch devices. Swimming begins automatically in deep enough water. The outer reef permits lagoon and shallow-sea swimming but smoothly blocks travel into the deep ocean. Aerial, Strand, Reef, Falls, and Lava are composed orbit and landmark buttons. Walk or `R` resumes first-person play at the current position. SOUND is gesture-gated and then toggles mute.

The scene generates volcanic terrain, a reef shelf, palms and forked broadleaf trees, shore objects, animated water, waterfall and lava landmarks, moving weather, contact and sun shadows, and synthesized surf, wind, landmark and footstep audio at runtime. Bare footprints and kicked sand follow the terrain. A wetting wave erases a contacted mark in about 0.11 seconds while dry marks persist. `?view=0`, `?view=1`, and `?view=2` open orbit views. `?test=swim`, `?test=falls`, and `?test=lava` provide deterministic test positions. `?test=forest` and GROVE open the canopy review. `window.ISLAND.state()` exposes current play state and `window.ISLAND.testSpawn(x,z)` supports local testing.

See the optional [island tour](evidence/island-tour.mp4) and [wave wash](evidence/wave-wash.jpg).

## Grove and lava landmarks

GROVE opens a walk-height grassy lowland, and `?test=forest` opens the same reachable clearing. LAVA frames the sea entry, while VENT opens the source headland. `?test=lava` and `?test=vent` provide those deterministic landmark views. The lava follows the sampled terrain continuously from its fissure to the shoreline.

Clearings use dense, wind-animated folded grass clumps while canopy cover leaves warm litter visible beneath the trees. Broadleaf crowns use two deterministic, physically rooted tropical architectures. One is a tiered sea-almond-inspired scaffold with distal leaf rosettes. The other is an irregular rounded crown with a retained leader and true opposite leaf pairs. Each curved limb has three connected woody internodes. At fork nodes, the incoming radius uses `1.06 * sqrt(sum(childRadius^2))` with unequal side and retained-tip radii. This is a modelling approximation of area-preserving branch support.

Individual cambered, petioled blades have raised midribs, varied pitch and roll, common-shoot flutter, and diffuse backlighting. Deterministic whole-tree, shoot, and leaf-scale variation adds mature olive and deep greens alongside a restrained young yellow- and copper-green flush.

Eight local shared meshes cover two habits, two seeded variants, and near and mid density. They are instanced around all rooted trees as the camera moves. Crossed distant crowns retain coverage, while shared grounded trunks and branch sticks prevent floating canopies. `ISLAND.state().canopy` reports actual generated models plus active near, mid, and far LOD counts.

Evidence: [forest](evidence/forest.jpg), [lava](evidence/lava.jpg), [vent](evidence/vent.jpg), [tree comparison](evidence/tree-comparison.jpg), and [leaf closeup](evidence/leaves.jpg).

Canopy references: [Runions, Lane & Prusinkiewicz (2007)](https://www.algorithmicbotany.org/papers/colonization.egwnp2007.pdf), [Bentley et al. (2013)](https://pubmed.ncbi.nlm.nih.gov/23800188/), [NParks ketapang](https://biodiversitysg.nparks.gov.sg/our-biodiversity/flowering-plants/trees/ketapang-/), [NParks Calophyllum](https://www.nparks.gov.sg/florafaunaweb/flora/2/7/2774), and [UF/IFAS tropical almond](https://ask.ifas.ufl.edu/publication/ST626).
