# HTML Games

Local source collection for the standalone HTML games in this folder. The root repository owns Ashgrove, Sitter, and Splat. Appalachian Eagle and Prism Swarm keep their prior histories as registered child submodules.

Each game’s editable entry point is its `index.html`. Read [CLAUDE.md](CLAUDE.md) and [AGENTS.md](AGENTS.md) before any iteration. They describe ownership, validation, safe commit order, and the optional Drive release mapping.

Use this prompt for Claude Code:

> Work in `E:\html games` on `<game>`. Read `CLAUDE.md`, `AGENTS.md`, and any `<game>\AGENTS.md` first. Inspect root and target Git status, diffs, and staged diffs; preserve unrelated work. Implement only: `<requested change>`. Validate it appropriately, including `git diff --check` and the Appalachian Eagle size-stamp command if applicable. Commit only the intended files following the documented root/submodule commit order. Do not push or update the Drive release unless I explicitly ask. Report the files changed, validation, commit hash(es), and remaining dirty files.
