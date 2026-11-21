# Wool Rampage: build notes

Angry sheep storm a hill for your hay. You stand on top of the haystack with a paintball marker and a garden hose. Every mouthful they eat lowers the stack, and you sink with it.

## Rules

- **Hay** is the stack under your feet (100 at the start). Sheep that reach its base eat it. At 0 the game ends. Each wave held gives +15 hay (up to 100) and 250 x wave points.
- **Footing**: every sheep has a footing meter. Hose water, paint hits and slick ground drain it, and it recovers when left alone. At 0 the sheep slips and rolls downhill as a ball.
- **Repelled**: a sheep that rolls at least 5 m and crosses r = 56 m heading outward is sent home and scores. Rolls that stop short end with the sheep standing up, shaking off and charging again, angrier and faster.
- **Hose**: 230 droplets/s, aimed ballistically at the crosshair point. It soaks sheep (wet sheep shrink, get lighter and slip more easily), pushes them back, and soaks the grass (wet grass drains footing as they climb). Tank 100, drains 13/s, refills 10/s after 0.5 s idle, locks at empty until 25.
- **Paintball**: 30-ball hopper at 7.5 shots/s, 1.5 s reload. Stains the wool where it hits, knocks the sheep back a little and drains a small amount of footing. A head hit blinds the sheep for 2.8 s: it wanders and can't eat. Paint on the grass makes it slightly slick.
- **Bowling**: a rolling sheep moving faster than 2.2 m/s knocks standing sheep into rolls (a STRIKE chain) if it is heavy enough or they are already unsteady.
- **Score** = type points (lamb 50, ewe 100, merino 220, ram 300) x bonuses: SHRUNK +50%, TIE-DYE (3+ colours) +60%, PAINTED +20%, STRIKE +40% per extra sheep in the chain, OFF THE HAY +30%.

## Sheep

| Type | Footing | Mass | Speed | Hay/s | Notes |
| --- | --- | --- | --- | --- | --- |
| Lamb | 45 | 0.55 | 3.3 | 0.4 | fast, high-pitched |
| Ewe | 100 | 1 | 2.7 | 0.7 | white or black faced |
| Merino | 170 | 1.4 | 2.15 | 0.85 | huge fleece that shrinks the most; from wave 2 |
| Ram | 240 | 2.3 | 2.35 | 1.1 | charges, and headbutts the stack to rock you; from wave 3 |

Waves: 6 + 3 x wave sheep in flocks of 2 to 6. At most 9 + 2 x wave are on the field at once (capped at 20).

## World

- Hill: 10 m high, plateau radius 4.6 m, base radius 48 m. The profile is concave (`(1 - t)^1.4`) so the slope falls away from the summit.
- The haystack: radius 3.3 m, 4.3 m tall, flat-topped cone. It squashes in the shader (flag 32) as hay drops. Five bales behind it vanish one by one (flag 64).
- Spawn at r = 64, dry-stone wall at r = 72, sheep fade out at r > 66 when going home.
- The sun is high and behind your left shoulder, so faces coming up the hill are lit.

## Test API (`?test&seed=N`, add `&touch` for the touch layout)

`window.WR`: `start()`, `state()`, `step(seconds)`, `spawn(type, angleDeg, r)` returns an id, `sheep(id)`, `look(yaw, pitch)`, `aimAt(id)`, `weapon(0|1)`, `fire(bool)`, `wet(id, amount)`, `stain(id, n)`, `slip(id)`, `wetGround(x, z, amount, radius)`, `hay(v)`, `freeze(bool)`, `cam(eye, at, fovDeg)` (null to release), `render()`, `clear()`. In `?test` mode the sim only advances through `step()`.

## Build history

- 2026-11-20: first build, made in a cloud session without a shell on the PC; delivered with `commit-woolrampage.cmd` in the repo root. Tested headless (Playwright + SwiftShader): screenshots of every effect, a live menu-to-play run with no page errors, and bot playtests. A bot with human-like aim error (turn-rate limit, aim noise, slow target switching) holds waves 1 to 7 and is overrun in wave 8, about 7.5 minutes in. The hay usually stays full until the flock outnumbers you, then goes fast, so the late waves are the tense part.
