# HTML Games

Portable GitHub source collection for the standalone HTML games in this folder. Branch `main` at `https://github.com/GrapeGames3141/HTML-Games` tracks every game as ordinary files, so fresh clones need no submodule setup. On this machine, Appalachian Eagle and Prism Swarm retain old local Git histories inside their folders; those histories are not required by GitHub clones.

Each game’s editable entry point is its `index.html`. Read [CLAUDE.md](CLAUDE.md) and [AGENTS.md](AGENTS.md) before any iteration. They describe ownership, validation, safe commit order, and the optional Drive release mapping.

Use this prompt for Claude Code:

> Work in `E:\html games` on `<game>`. Read `CLAUDE.md`, `AGENTS.md`, and any `<game>\AGENTS.md` first. Inspect root and target Git status, diffs, staged diffs, and `rev-parse --show-toplevel`; preserve unrelated work. Implement only: `<requested change>`. Validate it appropriately, including `git diff --check` and the Appalachian Eagle size-stamp command if applicable. Commit only explicit intended source paths following the documented local-child-then-root flow when a child repository exists; otherwise commit at the root. Do not use Git submodules. Do not push or update the Drive release unless I explicitly ask. Report the files changed, validation, commit hash(es), and remaining dirty files.

Append “Push the root main branch to origin after validation” to authorize a push for a requested iteration.
