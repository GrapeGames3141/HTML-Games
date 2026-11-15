# High Country

High Country is a native-WebGPU, no-assets eagle-soaring showcase set in a sunny, original Appalachian-inspired wilderness. Terrain, forest, eagle, and atmosphere are generated in `index.html`; it makes no runtime requests.

Serve `index.html` through localhost or HTTPS in a current WebGPU-capable browser. Use **A/D** or **Left/Right** to steer, **Up/Down** to adjust altitude, **Space** or **Esc** to pause, **H** to hide the HUD, **F3** for renderer statistics, and **R** to reset the flight.

Terrain and the 128×128 nearby forest window are generated in an inline worker and transferred without assets or network requests. Terrain upload is budgeted in ≤1 MiB animation-frame chunks, so the last complete world remains visible until the replacement atomically swaps in. The synthetic terrain is calibrated against the retained research measurements: across 24 km, its height p05/p50/p95 is 576/1051/1510 m, slope p25/p50/p75/p95 is 12/18.8/26.5/37.4°, and eastward 1.5 km RMS height change is 233.6 m (research reference: 235.4 m).

## Reference material used during art research

`references/north-cove-nps.jpg` is a local visual reference from the U.S. National Park Service’s North Cove overlook page. `references/terrain-10-*.png` are local Terrarium-format elevation tiles for the Mt. Mitchell / Black Mountains area, obtained from the AWS elevation-tiles collection. They are retained as research material only and are not loaded by the game. Terrarium’s format and attribution notes are documented by the Tilezen/Joerd project; source terrain attribution includes USGS 3DEP, GMTED2010, and SRTM.
