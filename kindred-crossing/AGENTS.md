# Kindred Crossing (HTML)

HTML rebuild of the Godot prototype at `E:\games\kindred-crossing` (the newest copy, `kindred-crossing-ui-polish-v2`, v19). It keeps the original rules and art and adds a new 22-level campaign with fancier puzzles. Read the root `CLAUDE.md` and `AGENTS.md` first.

## Files

| Path | What it is |
| --- | --- |
| `kindred-crossing.html` | The whole game: styles, `<script id="kc-core">` (rules and levels, no DOM) and the game script (canvas renderer, UI, audio, hints, saves, test API). Edit this file directly. |
| `art/` | Web-sized copies of the Godot runtime art: background, material atlas, lanternling, the antlered kin, lantern ledge, hollow log front and interior, a side-on log for branches, fire, sparks, water, ice-melt, straw-burn and wood-burn sheets, UI plates and buttons, title and icon. `woodland.mp3` is the original 64-second woodland loop from v19. Do not name this folder `assets`: the Pages build skips folders with that name. |
| `tools/verify-levels.js` | Node level checker. It loads the `kc-core` block from the HTML, replays every authored solution and `alt` list, and with `--solve` runs an exhaustive straight-drop search to confirm `par` and the fireflies. |
| `game.json` | Arcade card metadata. |

## Rules (kc-core)

The board is 12 columns by 16 rows. Pieces drop straight down, bond internally, and each drop settles (one step every 0.11 s, at most 72 steps) before the next piece. Ported from `simulation.gd`:

- New stone-iron contacts spark and light dry straw beside either cell. Fire spreads to touching wood, straw, logs, seeds and branches, burns for 7 steps and is removed.
- Fire melts touching ice into 4 units of water. Water falls, spreads and drains off the bottom row and the side edges. Wet cells cannot ignite, and water puts out fire.
- Wet dirt turns to mud and breaks every bond touching it. Loose bonded groups fall one row per step.
- The lanternling walks from the entry ledge (x = -1) to the exit ledge (x = 12, or x = -1 for a left exit). Each step rises or falls at most one block, needs solid footing that is not burning, and a clear cell. Horizontal hollow logs are walkable tunnels; upright logs are walls.

Added for this version:

- **Kin** (`k` on the map) must all be visited before the lantern. Kin beyond the board edge get their own ledge.
- **Fireflies** (`*`) are optional. The route search prefers the path with the most fireflies, then the shortest.
- **Seeds** (`> v < ^`) sprout when wet and grow a bonded branch 4 cells in the direction they point. The direction turns with the piece.
- **Brick**: dry mud touched by fire bakes into brick, which strikes iron like stone does. This lets fire jump a stone gap (see The Kiln and Kiln Relay).
- **Pins** (`pins: [[x, y, x2, y2]]`) bond a loose cell to a rooted neighbour so it hangs. Mud at the joint drops it. Pins are drawn as brass rivets.
- Authored mud never bonds.
- Stars: crossing, every firefly (free when a level has none), and crossing with `par` pieces or fewer. **Send** lets the lanternling go as soon as a safe path shows, so the thrift star is earned by stopping early. Stars are kept as a best-ever bitmask per level.

## Level format

Levels are in `KINDRED_LEVELS` inside `kc-core`. A map is 16 strings of 12 characters: `.` air, `#` rooted stone, lower-case materials are loose (`s i w h c d m b r`, `=` flat log, `|` upright log, `> v < ^` seeds), upper-case are rooted, `~` water, `k` kin, `*` firefly. `entry` is the entry row; `exit` is `[x, y]`. `hand` uses `P(name, rows)`. `solution` lists `[handIndex, column, rotation]` drops. `par` must be the fewest pieces the solver finds, and `alt` holds extra move lists to replay (usually the firefly route).

After any level edit, run `node tools/verify-levels.js --quiet`. For new or changed levels, run `node tools/verify-levels.js <id> --solve --time 300000` and set `par` to "fewest to cross". Levels with 5 pieces can hit the time limit at full depth. That is fine as long as every depth below par completes.

## Test API (`window.KC`)

`levels()`, `load(i | id)`, `state()`, `select(k)`, `aim(x, rot)`, `drop()`, `send()`, `undo()`, `restart()`, `hint()`, `play(moves)` (instant), `instant(on)`, `step(seconds)`, `pause(on)`, `open('levels' | 'guide' | 'toast')`, `close()`, `save()`, `clearSave()`, `sim()` and `core`. Add `?test` to skip the lesson card and the win card; with it, `_eval(src)` reaches internals. `?level=N` opens a level (1-based).

Headless recipe (Playwright, Chromium): serve `E:\html games` (`python -m http.server 8000`), open `kindred-crossing/kindred-crossing.html?test`, wait for `KC.ready`, then for each level `KC.load(i)` and for each move `KC.select(k); KC.aim(x, r); KC.drop()`. Step with `KC.step(0.25)` until `state().phase` is `build`, then `KC.send()` and step until `won`. On 2026-11-20, all 22 authored and alternate solutions won through the real game loop, Hint-then-Drop solved all 22 levels from the start, and the console showed no errors.

## Saves

Progress is saved to `localStorage['kindred-crossing-v1']` (`stars`, `best`, `last`, `sound`). Crossing a level unlocks the next one. One uncleared level may be skipped at a time.
