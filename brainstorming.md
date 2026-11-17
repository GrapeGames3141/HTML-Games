# Game Brainstorming

**Status:** planning notes only
**Updated:** 2026-11-16

Nothing in this document authorizes implementation. These are directions to revisit, not promises about technology, schedule, or exact simulation. Gaussian splats are an interesting rendering option for the procedural-world concept; the other games can use whichever visual approach best serves their play.

## 1. Procedural splat world

A Minecraft-like world without visible blocks: explore, gather materials, excavate caves, and build shelters in smooth, natural-looking terrain. The visual language could be painterly and tactile—rounded cliffs, layered soil, dense moss, rough rock, and caves with uneven openings—rather than assuming splats automatically make procedural content photorealistic.

The important split is between the **authoritative world** and its appearance. A continuous terrain-and-material field answers whether a point is solid, what it is made from, and how much material it contains. The game derives both visible surface splats and collision surfaces from that same data. That avoids using appearance alone to decide whether the player can stand somewhere or what was removed by a tool.

World chunks would be generated from a seed and streamed around the player. Exposed surfaces get dense local detail; distant terrain gets a simpler representation or lower detail level. Buried terrain stays compact until digging exposes it. An edit updates the material field, creates surfaces where the excavation reveals them, then rebuilds only the affected visual and collision regions, including neighboring chunk edges. Resource amounts follow removed material volume rather than the number of visible splats.

Saved worlds would retain the seed, generator version, and changed chunk data. Splats can be rebuildable cached presentation data. A small proof would be enough to test the idea: one hillside, a cave, a tunnel the player can dig, and a shelter made from collected material.

Useful research starting points are [3D Gaussian Splatting](https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/), [2D Gaussian Splatting](https://surfsplatting.github.io/), and [hierarchical Gaussian rendering](https://repo-sam.inria.fr/fungraph/hierarchical-3d-gaussians/). They inform rendering and surface representation questions, but the editable procedural-world problems still need their own tests.

## 2. Galleon duel (already started elsewhere)

This game is already being worked on elsewhere. This section records the settled concept only; it does not direct or expand that implementation.

Two galleons move around one another in open ocean, with islands in the distance providing atmosphere and scale. The player controls cannon fire only. Ship movement changes the range, relative heading, and firing opportunities; steering, navigation, boarding, and crew management are not part of the core interaction.

The confirmed camera sits above and behind the player ship, framing both galleons. The mouse commands the cannon's direction and elevation, and clicking fires an available gun. Cannons should visibly turn and elevate inside their available arcs, with reloading or unavailable guns clearly shown.

The point of aiming is to judge a ballistic shot rather than point directly at a target. Each ball leaves its real muzzle with a consistent gun-specific speed, then gravity pulls it down. At longer distances the player aims above the enemy; against a moving ship the player aims ahead as well. The cursor is a commanded direction, never a promise that the ball will land there. There is no auto-elevation, hit snapping, homing, or default perfect landing marker.

Small launch-angle and speed variation makes a broadside imperfect, but not so random that careful ranging stops working. The player should fire, see a splash land short or long, adjust elevation and lead, and then take a more confident follow-up or broadside. Smoke, recoil, tall water plumes, and impacts give that loop readable feedback. Ship motion can affect the muzzle, but roll and pitch should remain restrained and tunable so they add texture without overwhelming judgment.

Damage is local and sectional, with a chunky voxel-like sense of broken wood. Hull sections, mast bases, sails and rigging, gun positions, and the rudder can be hit. Breakable supports let a mast fall and unsupported wood detach rather than disappear. Hull breaches can flood simple internal sections, causing the ship to settle and list until it loses buoyancy or combat ability. This is meant to read as credible destruction and sinking, not a full naval simulation.

Possible later additions—special ammunition, weather, campaign structure, salvage, boarding, or elemental cannonballs—remain optional ideas rather than current requirements.

## 3. Merlin's Tower Defense

Merlin stands on a tower rampart overlooking the approaches to a besieged castle. He directly aims and casts spells to hold the walls, gate, and defenders against infantry carrying ladders, battering rams, wooden siege towers, ranged engines, and incendiary weapons. The tone is grounded medieval fantasy: weighty destruction and dramatic reversals rather than slapstick. Elemental manipulation changes the battlefield itself, not merely enemy health bars.

Water is both a defensive response and terrain control. It can saturate suitable soil into mud, slowing infantry and bogging or stopping heavy wheeled siege equipment. It can also extinguish enemy burning ammunition and fire weapons, or put out flames threatening the gate and defenses. Puddles, deepening ruts, and wheels visibly struggling make the effect readable; soil retains saturation so sustained water use creates a decision that lasts beyond a single cast.

Fire ignites exposed wooden ladders, ropes, wheels, siege towers, and other combustible equipment. Burning supports fail and can collapse a section of an assault, while wet timber is harder to ignite. This makes the order of spells matter: turn an approach to mud, stall a tower, then burn its dry upper supports; or divert water to save a burning gate instead of preparing the next attack.

Lightning delivers a dramatic direct strike to interrupt a crew or damage selected equipment. As a fantasy game rule, it could chain through nearby soaked attackers and machinery, rewarding a prepared wet area without claiming realistic physics. Mud, wetness, fire, and damaged supports should remain visible long enough to shape the next choice. Spell costs or recovery can create pressure to prioritize threats, but exact controls and resource rules remain open. Ice can be considered later; water, fire, and lightning are the current elemental priorities.

## 4. Desert attack-helicopter sandbox

An Apache-style helicopter flies low through dunes and canyons against tank columns, radar vehicles, fortified outposts, bridges, fuel stores, and hangars. The flight model would be forgiving but weighty: banking, dust, recoil, and low passes should sell the machine without requiring a full simulator.

The player can switch between rockets and a .50-cal machine gun as alternate fire modes: rockets deliver explosive hits and area damage, while the .50-cal provides rapid, sustained fire.

Targets should have parts that matter. A player can immobilize a vehicle, disable its weapon, collapse a route, or trigger a fuel explosion, rather than only reducing an abstract health bar. Missions might ask the player to stop a convoy before it reaches a tunnel, defend a rescue crew, first disable defenses and then escort a transport, or get close enough to extract someone.

The playful hook is a winch. It could lift cargo, recover wreckage, rescue vehicles, or let a badly swung load hit something unintended. It gives the game a physical sandbox role alongside combat.

## 5. Other directions to keep

- **Salvage tugboat:** tow damaged ships through storms, patch leaks, and keep cargo balanced.
- **Wizard demolition contractor:** dismantle a castle while protecting one fragile object inside.
- **Tiny tank in a workshop:** fight across benches, knock over paint cans, break wooden projects, and shove enemies into drawers.
- **Storm spirit versus a village:** redirect wind, freeze rivers, and strike machinery while villagers improvise increasingly foolish defenses.
- **Elemental pirate ammunition:** a possible crossover—freeze a rudder, burn rigging, or electrify a flooded gun deck—only after the core cannon duel proves itself.
