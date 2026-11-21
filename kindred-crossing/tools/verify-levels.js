#!/usr/bin/env node
// Kindred Crossing level checker.
// Reads the <script id="kc-core"> block out of kindred-crossing.html and, for every level:
//   * replays the authored solution and any `alt` move lists, and prints the final board;
//   * with --solve, runs an exhaustive straight-drop search for the fewest pieces that cross
//     (should equal `par`) and the fewest that also gather every firefly.
// Usage: node tools/verify-levels.js [level-id or number ...] [--solve] [--time ms] [--depth n] [--quiet]
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const args = process.argv.slice(2);
const flag = n => args.includes(n);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 ? Number(args[i + 1]) : d; };
const valued = new Set(['--time', '--depth']);
const ids = args.filter((a, i) => !a.startsWith('--') && !valued.has(args[i - 1]));

const html = fs.readFileSync(path.join(__dirname, '..', 'kindred-crossing.html'), 'utf8');
const core = html.match(/<script id="kc-core">([\s\S]*?)<\/script>/);
if (!core) throw new Error('kc-core script block not found');
const ctx = { console };
vm.createContext(ctx);
vm.runInContext(core[1] + '\n;globalThis.__K = Kindred; globalThis.__L = KINDRED_LEVELS;', ctx);
const KC = ctx.__K, LEVELS = ctx.__L;
const { W, H, Sim, distinctRotations, pieceExtent, shapeKey } = KC;

const GLYPH = { 0: '.', 1: 's', 2: 'i', 3: 'w', 4: 'h', 5: 'c', 6: 'd', 7: 'm', 8: '=', 9: 'b', 10: 'e', 11: 'r' };
function board(sim, routePath = []) {
  const rows = [];
  for (let y = 0; y < H; y++) {
    let r = sim.entry[1] === y ? 'E' : (sim.exit[0] === -1 && sim.exit[1] === y ? 'X' : ' ');
    let any = false;
    for (let x = 0; x < W; x++) {
      const k = y * W + x;
      let ch = GLYPH[sim.mat[k]];
      if (sim.mat[k] === 1 && sim.fixed[k]) ch = '#'; else if (sim.fixed[k]) ch = ch.toUpperCase();
      if (sim.mat[k] === 8 && sim.rot[k] % 2) ch = '|';
      if (sim.mat[k] === 10) ch = '>v<^'[sim.dir[k]];
      if (sim.fire[k]) ch = '!';
      if (!sim.mat[k] && sim.water[k]) ch = '~';
      if (!sim.mat[k] && sim.kin.some(p => p[0] === x && p[1] === y)) ch = 'k';
      if (!sim.mat[k] && sim.flies.some(p => p[0] === x && p[1] === y)) ch = '*';
      if (!sim.mat[k] && routePath.some(p => p[0] === x && p[1] === y)) ch = 'o';
      if (ch !== '.') any = true;
      r += ch;
    }
    r += sim.exit[0] === W && sim.exit[1] === y ? 'X' : (sim.ledges.some(p => p[0] === W && p[1] === y) ? 'T' : ' ');
    if (any || sim.entry[1] === y || sim.exit[1] === y) rows.push(String(y).padStart(2) + ' ' + r);
  }
  return rows.join('\n');
}

function moveList(level, sim, remaining) {
  const seen = new Set(), out = [];
  for (const pi of remaining) {
    const pc = level.hand[pi];
    const key = shapeKey(pc, 0) + pc.name;
    if (seen.has(key)) continue; // identical pieces are interchangeable
    seen.add(key);
    for (const rot of distinctRotations(pc)) {
      const [ew] = pieceExtent(pc, rot);
      for (let x = 0; x <= W - ew; x++) if (sim.landingY(pc, x, rot) >= 0) out.push([pi, x, rot]);
    }
  }
  return out;
}
function solve(level, maxDepth, timeMs) {
  const deadline = Date.now() + timeMs;
  const root = new Sim(); root.loadLevel(level);
  const nFlies = root.flies.length;
  const res = { nodes: 0, timedOut: false, minCross: null, minFlies: null, cross: null, flies: null, byDepth: {} };
  for (let depth = 0; depth <= maxDepth && !res.timedOut; depth++) {
    const visited = new Set();
    let crossCount = 0, fliesCount = 0;
    const dfs = (sim, remaining, moves) => {
      if (Date.now() > deadline) { res.timedOut = true; return; }
      res.nodes++;
      if (moves.length === depth) {
        const r = sim.routeReport();
        if (r.ok) {
          crossCount++; if (!res.cross || res.minCross === null) res.cross = res.cross || moves.slice();
          if (r.fliesCount === nFlies) { fliesCount++; if (res.minFlies === null && !res.flies) res.flies = moves.slice(); }
        }
        return;
      }
      const key = sim.signature() + '#' + remaining.join(',');
      if (visited.has(key)) return;
      visited.add(key);
      for (const mv of moveList(level, sim, remaining)) {
        const s = sim.clone();
        if (!s.placePiece(level.hand[mv[0]], mv[1], mv[2])) continue;
        s.settle();
        if (s.timedOut) continue;
        dfs(s, remaining.filter(i => i !== mv[0]), moves.concat([mv]));
        if (res.timedOut) return;
      }
    };
    dfs(root, level.hand.map((_, i) => i), []);
    res.byDepth[depth] = { cross: crossCount, flies: fliesCount, complete: !res.timedOut };
    if (crossCount && res.minCross === null) res.minCross = depth;
    if (fliesCount && res.minFlies === null) res.minFlies = depth;
    if (res.minCross === null) res.cross = null;
    if (res.minFlies === null) res.flies = null;
  }
  return res;
}

let failures = 0;
LEVELS.forEach((lv, n) => {
  if (ids.length && !ids.includes(lv.id) && !ids.includes(String(n + 1))) return;
  const r = KC.playMoves(lv, lv.solution);
  const nF = r.sim.flies.length;
  const lines = [`${String(n + 1).padStart(2)}. ${lv.name} (${lv.id})  hand ${lv.hand.length}  par ${lv.par}`];
  lines.push(`   authored: ${r.ok ? 'crosses' : 'FAILS: ' + (r.error || r.route.reason)}  flies ${r.route.fliesCount ?? 0}/${nF}  pieces ${lv.solution.length}`);
  if (!r.ok) failures++;
  if (lv.solution.length < lv.par) { lines.push('   !! authored solution uses fewer pieces than par'); failures++; }
  for (const [label, moves] of Object.entries(lv.alt || {})) {
    const a = KC.playMoves(lv, moves);
    lines.push(`   alt ${label}: ${a.ok ? 'crosses' : 'FAILS: ' + (a.error || a.route.reason)}  flies ${a.route.fliesCount ?? 0}/${nF}  pieces ${moves.length}`);
    if (!a.ok) failures++;
  }
  if (!flag('--quiet')) lines.push(board(r.sim, r.route.path || []));
  if (flag('--solve')) {
    const t = Date.now();
    const s = solve(lv, opt('--depth', lv.hand.length), opt('--time', 60000));
    lines.push(`   solver ${Date.now() - t}ms nodes ${s.nodes}${s.timedOut ? ' (time limit)' : ''}: fewest to cross ${s.minCross}, fewest with every firefly ${s.minFlies}`);
    if (s.cross) lines.push(`   e.g. ${JSON.stringify(s.cross)}`);
    const parProven = s.minCross !== null && Object.entries(s.byDepth).every(([d, v]) => +d >= s.minCross || v.complete);
    if (s.minCross !== null && s.minCross !== lv.par && parProven) { lines.push(`   !! par should be ${s.minCross}`); failures++; }
    if (nF && s.minFlies === null && !s.timedOut) { lines.push('   !! fireflies cannot all be gathered'); failures++; }
  }
  console.log(lines.join('\n') + '\n');
});
console.log(failures ? `${failures} problem(s) found` : 'All checks passed');
process.exitCode = failures ? 1 : 0;
