# 3D Print Arena source

`print-arena.html` is a launcher only. The game itself is the Godot project in [GrapeGames3141/3DPrintBattles](https://github.com/GrapeGames3141/3DPrintBattles). That repository's `Web version` workflow (`.github/workflows/web.yml`) exports it with the `Web` preset on every game push to `main` and publishes it at <https://grapegames3141.github.io/3DPrintBattles/>, which this page shows full screen. The game's files (about 130 MB) are deliberately not copied into this repository; update the game in 3DPrintBattles, not here.

The page passes key presses from the game back to the arcade so the Quick hide keys work. Network play needs the downloaded game; in a browser, Pass & Play is available.
