# Claude instructions for `E:\html games`

Start every session by reading this file, the root `AGENTS.md`, and the target game's `AGENTS.md` when it exists. If Claude is opened inside a child folder, explicitly read `..\CLAUDE.md` and `..\AGENTS.md` first.

## Repository layout

The root repository uses branch `main`. `appalachian-eagle` and `prism-swarm` are independent child repositories on `master` and registered as submodules. `ashgrove`, `sitter`, and `splat` are normal root-owned folders. There is no remote or push target configured. Local commits are useful history, not an off-machine backup.

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
   git -C 'E:\html games\<game>' status --short
   git -C 'E:\html games\<game>' diff
   git -C 'E:\html games\<game>' diff --cached
   ```

   For regular root-owned games, the last three commands can be replaced with `git -C 'E:\html games' status --short -- <game>`, `diff -- <game>`, and `diff --cached -- <game>`.

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

4. Stage only the files made for this iteration. Never sweep in another task's staged work. Before committing, inspect `git diff --cached --name-only` and confirm that no existing staged hunks overlap a file you intend to commit. If they do, coordinate with the owner and leave the staged work intact. Use `--only` with explicit paths; never run a bare `git commit` while unrelated staged paths exist.

   For a root-owned game:

   ```powershell
   git -C 'E:\html games' add -- '<game>\index.html'
   git -C 'E:\html games' diff --cached --check
   git -C 'E:\html games' commit --only -m 'Improve <game> <feature>' -- '<game>\index.html'
   ```

   For `appalachian-eagle` or `prism-swarm`, commit the child first, then record only its Git link at the root:

   ```powershell
   git -C 'E:\html games\<game>' add -- 'index.html'
   git -C 'E:\html games\<game>' diff --cached --check
   git -C 'E:\html games\<game>' commit --only -m 'Improve <feature>' -- 'index.html'
   git -C 'E:\html games' add -- '<game>'
   git -C 'E:\html games' diff --cached --check
   git -C 'E:\html games' commit --only -m 'Update <game> revision' -- '<game>'
   ```

   Replace `<game>` and paths with the actual target. Check `git diff --cached --name-only` before every commit so only intended paths are included.

5. Report the changed files, validation performed, child and root commit hashes where applicable, and remaining modified or staged files. Do not push or sync to Drive unless asked.

Do not use `git reset --hard` or `git clean`; do not delete source snapshots, media, or references without explicit user direction.
