# HTML games workspace

This repository lives at `E:\html games`. Keep durable source, assets, outputs, and validation evidence on `E:`.

Each game keeps its source entry point as `index.html`. Files such as `aliens.html` and `horror.html` are named release copies; do not rename a source entry point to match a release filename.

Work with one writer at a time. Before changing a game, read this file, `CLAUDE.md`, and any `AGENTS.md` in that game's directory. Preserve unrelated modified and staged files. Never use `git reset --hard`, `git clean`, or bulk formatting against a game unless the user explicitly requests it.

`appalachian-eagle` and `prism-swarm` retain their own Git histories. Their game-specific commits must happen inside those repositories before the root repository records an updated submodule pointer. `ashgrove`, `sitter`, and `splat` are regular folders tracked by the root repository.

For Codex work that requires implementation, the primary Sol agent must inspect and plan first, then delegate the implementation to one Terra implementer. Claude does not have this delegation requirement; it should follow the iteration workflow in `CLAUDE.md`.

`appalachian-eagle/AGENTS.md` adds a required post-edit command: after every `index.html` edit, run `node tools/update-size.cjs`.
