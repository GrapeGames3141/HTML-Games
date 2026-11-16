# Claude instructions for `E:\html games`

Start every session by reading this file, the root `AGENTS.md`, and the target game's `AGENTS.md` when it exists. If Claude is opened inside a child folder, explicitly read `..\CLAUDE.md` and `..\AGENTS.md` first.

## Repository layout

The root repository uses branch `main` and has origin `https://github.com/GrapeGames3141/HTML-Games`. It tracks every game as ordinary files, so GitHub `main` holds all source and a fresh clone works as a plain monorepo. On this machine only, `appalachian-eagle` and `prism-swarm` retain their old nested repositories on `master`; they are not submodules. `ashgrove`, `sitter`, and `splat` are root-owned folders. Local commits are useful history, not an off-machine backup.

| Source game | Source file | Drive release copy |
| --- | --- | --- |
| Prism Swarm | `prism-swarm\index.html` | `aliens.html` |
| Sitter | `sitter\index.html` | `human.html` |
| Appalachian Eagle | `appalachian-eagle\index.html` | `eagle.html` |
| Splat | `splat\index.html` | `bughunt.html` |
| Ashgrove | `ashgrove\index.html` | `horror.html` |

Drive releases belong in `H:\My Drive\AI Projects\Prism Swarm`. Do not publish or update Drive copies unless the user asks. When asked, copy the source `index.html` to the mapped release name, then verify both byte length and SHA-256. Preserve the source name `index.html` in every game directory.

## Iteration workflow

1. Read the instructions and inspect all relevant work before editing. For a target, run:

   ```powershell
   git -C 'E:\html games' status --short
   git -C 'E:\html games' diff --check
   git -C 'E:\html games\<game>' rev-parse --show-toplevel
   git -C 'E:\html games\<game>' status --short
   git -C 'E:\html games\<game>' diff
   git -C 'E:\html games\<game>' diff --cached
   ```

   On this machine, a result of `E:/html games/<game>` means a retained local child repository exists. A result of `E:/html games` means the root owns the target, which is always true in a fresh clone. For a root-owned target, inspect the exact paths with `git -C 'E:\html games' status --short -- <game>`, `diff -- <game>`, and `diff --cached -- <game>`.

2. Make only the requested focused edit. Preserve unrelated edits and staged work. The games are self-contained HTML unless their local instructions say otherwise. Do not add a build system or external dependencies without a user request.

3. Validate in proportion to the change. Run `git diff --check` for the repository that owns the change. Test through localhost when it helps validate behavior; report what was actually tested. A simple local server and example URL are:

   ```powershell
   python -m http.server 8000 --bind 127.0.0.1 --directory 'E:\html games'
   # Then open http://127.0.0.1:8000/splat/ for E:\html games\splat\index.html.
   ```

   For every Appalachian Eagle `index.html` edit, also run:

   ```powershell
   node 'E:\html games\appalachian-eagle\tools\update-size.cjs'
   ```

4. Stage only the files made for this iteration. Never sweep in another task's staged work. Before committing, inspect `git diff --cached --name-only` and confirm that no existing staged or unstaged hunks overlap a file you intend to commit. `git add` and `git commit --only` commit the whole named file, so coordinate with the owner and leave the file untouched if another task has changes in it. Use `--only` with explicit paths; never run a bare `git commit` while unrelated staged paths exist.

   For a root-owned game:

   ```powershell
   git -C 'E:\html games' add -- '<game>\index.html'
   git -C 'E:\html games' diff --cached --check
   git -C 'E:\html games' commit --only -m 'Improve <game> <feature>' -- '<game>\index.html'
   ```

   On this machine, if `appalachian-eagle` or `prism-swarm` has a retained child repository (confirmed by step 1), commit it first, then capture the actual source file in the root repository:

   ```powershell
   git -C 'E:\html games\<game>' add -- 'index.html'
   git -C 'E:\html games\<game>' diff --cached --check
   git -C 'E:\html games\<game>' commit --only -m 'Improve <feature>' -- 'index.html'
   git -C 'E:\html games' add -- '<game>\index.html'
   git -C 'E:\html games' diff --cached --check
   git -C 'E:\html games' commit --only -m 'Update <game> source' -- '<game>\index.html'
   ```

   Replace `<game>` and paths with the actual target. Never use `git submodule` commands or stage a Git link. In a fresh clone, skip the child-commit block and use the root-owned command block for every game. Check `git diff --cached --name-only` before every commit so only intended paths are included.

5. Report the changed files, validation performed, local child and root commit hashes where applicable, and remaining modified or staged files. Do not push or sync to Drive unless asked. When the user explicitly requests a push, push only the validated root branch:

   ```powershell
   git -C 'E:\html games' push origin main
   ```

   Never push from a retained child repository and never force-push. If the push is rejected, fetch, inspect, and reconcile the divergence without discarding work.

Do not use `git reset --hard` or `git clean`; do not delete source snapshots, media, or references without explicit user direction.
