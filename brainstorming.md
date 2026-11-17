# Game Brainstorming

**Status:** planning notes only
**Updated:** 2026-11-17

Nothing in this document authorizes implementation. These are directions to revisit, not promises about technology, schedule, or exact simulation. Gaussian splats are an interesting rendering option for the procedural-world concept; the other games can use whichever visual approach best serves their play.

## Focused game notes

This root note keeps the cross-project overview. When an idea belongs to an existing game, its local note carries the detailed planning: [Ashgrove](ashgrove/brainstorming.md), [Broadside](broadside/brainstorming.md), and [Splatcraft](splatcraft/brainstorming.md). Merlin and the helicopter remain here until they have an assigned project.

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

## 6. Fishing: rod and reel

A peaceful fishing game set around a lake, rivershore, dock, and eventually a small boat. The appeal is patience, exploration, and a short burst of tension when a fish finally commits. The player chooses a spot and tackle, aims a cast with a hold-and-release power gesture, then reads the bobber or lure behavior for a bite. Setting the hook begins the active part: manage rod angle, reel speed, and line tension until the catch comes in.

Fish should pull, run, and occasionally jump with readable resistance rather than behaving as a hidden random roll. Too much tension breaks the line; too much slack can lose a fish, and both failures should be visibly telegraphed. Fish preferences for cover, depth, time, and weather give the player reasons to explore and change tackle. A catch log tracks species and size or weight records, with catch-and-release and optional lodge challenges giving the session a purpose.

Better rods, reels, line, lures, and boat access broaden options without removing the need to cast and fight well. The first scope is one small lake, a few fish types, and one complete cast-to-land loop. Useful results: casts, bites, hooks set, fish landed and lost, species and records, and session time.

## 7. Hunting: woodland stalking

**Started as [First Light](firstlight/firstlight.html)** (2026-11-16): a stand-hunting take on this idea with two spots (tree stand, duck blind), four weapons and a range of game. The stalking, tracking and recovery loop below is not built yet; see `firstlight/AGENTS.md`.

A grounded woodland hunt built around reading sound, tracks, sightlines, cover, and simple wind or noise cues. The loop is to spot an animal with binoculars, follow its tracks, approach without alarming it, choose a clear opportunity, then find and recover it. Animals patrol, feed, notice the player, and flee in readable ways; they are not static targets.

Start with a scoped rifle, with a bow as a later option. Clear sight alignment, movement, and recoil feedback make careful aim rewarding. Misses disturb nearby animals, and tracking plus recovery matter as much as taking the shot. Day, weather, changing locations, and different hunts create variety. The emphasis is patient observation and accurate recovery, without a graphic focus.

A memorable success is earned through small observations: a trail enters a clearing, a distant movement confirms the direction, and the player reaches a clear chance without scattering the whole area.

Progression can add optics, stability, tracking-journal tools, and new regions, never an instant guarantee of success. Begin with one woodland reserve, one animal type with convincing behavior, and a full spotting-to-recovery loop. Results can record shots, hits, misses, accuracy, animals spotted, spooked, and recovered, track completion, and in-game distance and time. If useful, a damaging-hit label can remain separate from the broader accuracy figure.

## 8. Bow fishing from a boat

Bow fishing is its own shallow-water game: a small slow boat crosses a marsh, river, or clear lake while the player scans silhouettes below reflective water. The boat can drift gently, steer slowly, or anchor for a steadier shot. A first-person bow view or a slightly elevated view over the bow are both possible presentations.

The player draws, aims, and releases at a moving target, then reels the attached arrow back and lands the catch. Finite arrow travel, arc, target lead, and slower travel after water entry make the aim distinct from ordinary archery. A tunable, stylized depth offset from refraction can create a learnable challenge without relying on exact real-world formulas. Boat bob and drift should affect alignment modestly, with no cursor snap.

Ripples, splashes, bubbles, taut retrieval line, and schools scattering make misses and hits satisfying to read. Missed arrows should be recoverable, so early play is about retrieval rather than repeatedly exhausting ammunition; snagged lines and reeds can wait for later. Night outings with boat lights are optional. Upgrades to the bow, retrieval reel, boat, and visibility equipment open new fishing spots and improve handling while preserving the need to aim and lead. Start with one shallow route, a few fish types, and the shoot-retrieve-catch loop. Results: arrows released, hits and misses, landed and escaped fish, accuracy, size or weight records, and retrievals.

## 9. Scuba spearfishing

Scuba spearfishing shifts the same outdoor theme underwater, kept deliberately simple. From a moored boat, the player swims freely in first person through one swimmable area that contains both a kelp forest and a coral reef. There is no air tank and no air limit: the player stays down as long as they like and returns to the boat to finish a dive.

The core loop is to spot a fish, move into range, aim a short-range speargun, and fire a finite-speed spear. There is no tether and no retrieval. A hit makes the fish burst apart, the same way the insects explode in Splat Meadow, and the kill counts immediately; there is nothing to reel in or secure. The speargun then reloads for the next shot.

Kelp gives cover and broken sightlines, while the reef gives open water and colour, so the two zones play differently inside the same dive. Silt, moving plants, reactive schools, and disturbed targets create feedback for both motion and missed shots.

The smallest version is one swimmable area with the kelp forest and the coral reef, a fixed boat, a few fish types, and a clear return with results. Record shots, hits, misses, fish killed by species, and dive duration. Later options: better spearguns, fins, a torch, new sites, and wreck exploration.

## 10. Slingshot

A kid plinking bottles, cans and pans in a back lot. Holding the button stretches the bands for more range; hold too long and the band snaps, slaps the hand, and the kid yells "Ouch!". The far targets need a stretch close to the snapping point. It doubles as a rendering experiment: Gaussian-splat terrain, ordinary mesh targets, and textures painted from Gaussians so the meshes fit the painted world. Detailed planning is in [slingshot/brainstorm.md](slingshot/brainstorm.md).
