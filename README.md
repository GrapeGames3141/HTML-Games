# HTML Games

Portable GitHub source collection for the standalone HTML games in this folder. Branch `main` at `https://github.com/GrapeGames3141/HTML-Games` tracks every game as ordinary files, so fresh clones need no submodule setup. On this machine, Appalachian Eagle and Prism Swarm retain old local Git histories inside their folders; those histories are not required by GitHub clones.

Each game’s editable entry point is named after its folder: `<game>/<game>.html` (for example `splat/splat.html`). With the local server, open `http://127.0.0.1:8000/<game>/<game>.html`. Read [CLAUDE.md](CLAUDE.md) and [AGENTS.md](AGENTS.md) before any iteration. Technique guides such as [SPLAT-GUIDE.md](SPLAT-GUIDE.md) record how the splat games are built and tested. They describe ownership, validation, safe commit order, and the optional Drive release mapping.

| Game | Source | Local URL |
| --- | --- | --- |
| Appalachian Eagle | `appalachian-eagle/appalachian-eagle.html` | `http://127.0.0.1:8000/appalachian-eagle/appalachian-eagle.html` |
| Ashgrove | `ashgrove/ashgrove.html` | `http://127.0.0.1:8000/ashgrove/ashgrove.html` |
| Broadside | `broadside/broadside.html` | `http://127.0.0.1:8000/broadside/broadside.html` |
| Prism Swarm | `prism-swarm/prism-swarm.html` | `http://127.0.0.1:8000/prism-swarm/prism-swarm.html` |
| Sitter | `sitter/sitter.html` | `http://127.0.0.1:8000/sitter/sitter.html` |
| Splat | `splat/splat.html` | `http://127.0.0.1:8000/splat/splat.html` |
| Splatcraft | `splatcraft/splatcraft.html` | `http://127.0.0.1:8000/splatcraft/splatcraft.html` |

`splatcraft/snapshots/splatcraft-early.html` is a historical snapshot, not a playable entry point.

Use this prompt for Claude Code:

> Work in `E:\html games` on `<game>`. Read `CLAUDE.md`, `AGENTS.md`, and any `<game>\AGENTS.md` first. Inspect root and target Git status, diffs, staged diffs, and `rev-parse --show-toplevel`; preserve unrelated work. Implement only: `<requested change>`. Validate it appropriately, including `git diff --check` and the Appalachian Eagle size-stamp command if applicable. Commit only explicit intended source paths following the documented local-child-then-root flow when a child repository exists; otherwise commit at the root. Do not use Git submodules. Commit at each working milestone and push the root main branch to origin after each commit. Do not update the Drive release unless I explicitly ask. Report the files changed, validation, commit hash(es), and remaining dirty files.
