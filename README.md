# High Country

High Country is a native-WebGPU, no-assets eagle-soaring showcase set in a sunny, original Appalachian-inspired wilderness. Terrain, forest, eagle, and atmosphere are generated in `index.html`; it makes no runtime requests.

Serve `index.html` through localhost or HTTPS in a current WebGPU-capable browser. Use **A/D** or **Left/Right** to steer, **Space** or **Esc** to pause, **R** to restart, **H** to hide the HUD, **P** to save a view, **F3** for renderer statistics (including stamped file size), and **F8** to reset the frame-time benchmark.

Terrain and forest are generated in an inline worker and transferred without assets or network requests. The near/mid forest uses a stable 256×256 20 m grid with detailed branches to about 600 m; spreading oak, narrow poplar, and conical pine silhouettes share matching LOD shaping. A 320×320 60 m far-cluster grid maintains continuous coverage. A bounded half-resolution volumetric cloud pass is bilinearly composited before opaque scenery. Terrain upload is budgeted in ≤1 MiB animation-frame chunks, so the last complete world remains visible until the replacement atomically swaps in. The synthetic terrain is calibrated against the retained research measurements: across 24 km, its height p05/p50/p95 is 576/1051/1510 m, slope p25/p50/p75/p95 is 12/18.8/26.5/37.4°, and eastward 1.5 km RMS height change is 233.6 m (research reference: 235.4 m).

See [procedural techniques](docs/PROCEDURAL_TECHNIQUES.md) for implemented streaming patterns and clearly marked research leads for future trees, clouds, and water.

## Reference material used during art research

`references/north-cove-nps.jpg` is a local visual reference from the U.S. National Park Service’s North Cove overlook page. `references/terrain-10-*.png` are local Terrarium-format elevation tiles for the Mt. Mitchell / Black Mountains area, obtained from the AWS elevation-tiles collection. They are retained as research material only and are not loaded by the game. Terrarium’s format and attribution notes are documented by the Tilezen/Joerd project; source terrain attribution includes USGS 3DEP, GMTED2010, and SRTM.
