# HTML Games

Portable GitHub source collection for the standalone HTML games in this folder. Branch `main` at `https://github.com/GrapeGames3141/HTML-Games` tracks every game as ordinary files, so fresh clones need no submodule setup. On this machine, Appalachian Eagle and Prism Swarm retain old local Git histories inside their folders; those histories are not required by GitHub clones.

Each game’s editable entry point is its `index.html`. Read [CLAUDE.md](CLAUDE.md) and [AGENTS.md](AGENTS.md) before any iteration. They describe ownership, validation, safe commit order, and the optional Drive release mapping.

Use this prompt for Claude Code:

> Work in `E:\html games` on `<game>`. Read `CLAUDE.md`, `AGENTS.md`, and any `<game>\AGENTS.md` first. Inspect root and target Git status, diffs, staged diffs, and `rev-parse --show-toplevel`; preserve unrelated work. Implement only: `<requested change>`. Validate it appropriately, including `git diff --check` and the Appalachian Eagle size-stamp command if applicable. Commit only explicit intended source paths following the documented local-child-then-root flow when a child repository exists; otherwise commit at the root. Do not use Git submodules. Do not push or update the Drive release unless I explicitly ask. Report the files changed, validation, commit hash(es), and remaining dirty files.

Append “Push the root main branch to origin after validation” to authorize a push for a requested iteration.

## Arcade website

The root `index.html` is the GrapeGames Arcade: six playable games, search, category
filters, a random-game button and a last-played marker. The lobby uses plain HTML,
CSS and JavaScript; each game opens directly for its own keyboard, pointer and audio
controls. High Country requires a WebGPU-capable browser over HTTPS or localhost.

- Prism Swarm — `prism-swarm/index.html`
- High Country — `appalachian-eagle/index.html`
- Splat Meadow — `splat/index.html`
- Ashgrove — `ashgrove/index.html` (spooky survival)
- Sitter — `sitter/index.html`
- Castle Defense / Bastion of the Four Roads — `castle-defense/index.html`

Castle Defense was copied unchanged from `GrapeGames3141/castle-defense`, commit
`37444662367c43e09db5d56691162bccb66ef9fc`. Its existing Tailwind CDN reference is retained.

### GitHub Pages

The `Publish arcade to GitHub Pages` workflow publishes on pushes to `main` and can
also be run manually. In repository **Settings → Pages**, set **Source** to
**GitHub Actions**. A private repository requires a GitHub plan that supports Pages
for private repositories; the workflow does not change repository visibility.

Expected project URL: <https://grapegames3141.github.io/HTML-Games/>.

Validate and package locally with `node --check arcade.js` and
`python tools/build-pages.py`. The generated `work/pages/` directory contains only
playable site files, excluding source snapshots, research references and local tools.
Serve it with `python -m http.server 8000 --directory work/pages`.
