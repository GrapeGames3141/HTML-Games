# Splatcraft Planning Notes

**Status:** design notes only; this document does not claim which features are already implemented.

**Updated:** 2026-11-16

## Procedural world direction

The starting idea is a Minecraft-like world without visible blocks: exploration, gathering, excavation, and construction in smooth, natural terrain. Its visual identity could be tactile and painterly—rounded cliffs, layered soil, rough stone, moss, and irregular cave mouths—without assuming that Gaussian splats automatically make generated content photorealistic.

The authoritative world should be a continuous terrain-and-material field. It determines whether a point is solid, what material it contains, and how much can be removed. Visible surface splats and collision surfaces are derived from that same information, so appearance alone never decides collision or resource yields.

Chunks generate from a world seed and stream around the player. Nearby exposed surfaces can carry dense detail while distant terrain uses a simpler level of detail. Buried terrain stays compact until digging reveals it. An edit changes the material field, exposes new surfaces as needed, and refreshes the affected visual and collision regions, including chunk boundaries. Resource accounting follows removed material volume rather than the number of rendered splats.

Saves could retain the seed, generator version, and changed chunk data, treating splats as rebuildable presentation caches. A useful future proof is a single hillside with a cave, a diggable tunnel, and a shelter made from collected material.

Research references for representation questions: [3D Gaussian Splatting](https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/), [2D Gaussian Splatting](https://surfsplatting.github.io/), and [hierarchical Gaussian rendering](https://repo-sam.inria.fr/fungraph/hierarchical-3d-gaussians/). They do not by themselves solve the gameplay or editable-world problems. The root [game brainstorming overview](../brainstorming.md) retains the broader comparison of ideas.
