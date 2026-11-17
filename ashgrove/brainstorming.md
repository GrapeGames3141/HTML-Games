# Ashgrove: Campaign Expansion Notes

**Status:** implemented 2026-11-16 in `ashgrove/ashgrove.html` — chapters II–VIII (chapel interior, crypt, catacombs, caves, haunted wood, Leshy grove, meadow), Heavy/Silver/Incendiary ammo, the new upgrades, credits and the results pane. The notes below are the original plan and remain the design reference.

**Updated:** 2026-11-16

## Current verified baseline

The current tracked source is `ashgrove/index.html`. The playable route currently reaches the Cemetery, Shrine, Mausoleum Court, Dead Wood, and Chapel of Ash, where the Vampire Lord takes three heart hits. Its death starts the win timer and the existing end overlay shows **DAWN**, says level one is cleared, and says the chapel doors stand open because level two waits below.

The expansion should treat that moment as the end of chapter one rather than the campaign's final resolution. The Vampire Lord remains the current climax; the open doors become an actual continuation later. The existing **DAWN** label should be reserved for the true final relief in the meadow, rather than used for the chapel clear.

The existing weapons are a revolver and pump shotgun. Current upgrades include Speed Loader and Long Choke. The displayed **SILVER ROUNDS** upgrade currently means a general revolver-damage increase, not a werewolf-specific rule. A future implementation should display it as **HEAVY ROUNDS** while preserving its current effect, reserving **SILVER ROUNDS** for a later werewolf countermeasure. This note does not rename code or change the current upgrade.

## Desired campaign route

After the Vampire Lord falls, leave a short quiet interval for exploration, loot, and the emotional drop after the boss. The chapel doors open into an interior confrontation with a lich, then a concealed stair or path behind the altar or a tomb descends into the crypt. This avoids immediately placing two climaxes back-to-back.

| Chapter | Place and threats | Purpose |
| --- | --- | --- |
| Chapel interior | Lich, ritual traces, guarded relics | Establish that the chapel victory released or revealed a deeper danger. |
| Crypt | Zombies, skeletons, cramped tomb and corridor ambushes | Return to close-range horror with readable cover and loot pauses. |
| Catacombs | Larger undead fights, ossuaries, loops, and a clear route forward | Raise scale while keeping navigation understandable. |
| Cave | Webs, ceiling spiders, bats, darkness, then the first werewolf | Turn from built stone into a natural tunnel toward the woods. |
| Haunted woods | Werewolves, wider sightlines, flanking paths, roots | Make the player feel exposed before the final grove. |
| Leshy grove | Leshy boss | Resolve the forest's corrupting force. |
| Sunny meadow | No fight | Deliver a genuine ending and credits. |

The recurring lich is the preferred connective thread. Defeating its body in the chapel does not end the problem because an anchor or phylactery remains below. Crypt clues lead toward the catacombs, where the final confrontation and destruction of that anchor can happen. A vampire noble is a viable alternative for the catacomb antagonist if the game later needs one, but it should not become another mandatory boss on top of the lich. Roots and warped wood can foreshadow the Leshy throughout the underground route without requiring elaborate lore.

## Encounter character and pacing

The crypt should be intimate: tomb alcoves, narrow corridors, doors that open into close ambushes, and skeletons with distinct readable roles such as ranged pressure or shielded advance. The catacombs can widen into ossuaries and looping passages, with larger undead groups and an obvious landmark or route out so the player feels hunted rather than lost.

The cave changes the visual language. Ceiling webs, spiders dropping from above, bats crossing the player's view, and dark vertical silhouettes make the space threatening before the first werewolf appears. A collapsed old stone passage becomes the natural transition into the woods. The woods then use broader sightlines and flanking werewolves, with roots and brambles showing that the final grove is nearby. Encounters need tells, quiet gaps, and chances to search for supplies; constant spawning would weaken both tension and aim readability.

The Leshy has bark armor, grasping roots, and bramble barriers, with a clearly readable inner core as its vulnerable phase. A proposed interaction is that incendiary damage burns armor, opens protection, or slows regeneration; ordinary ammunition still works through exposed weak points so the player is never soft-locked by ammunition. Its death releases the roots holding the path, and the forest atmosphere visibly loses its oppressive character.

## Upgrades and ammunition

Upgrades should arrive often enough to change decisions, without turning every zone into a mandatory damage increase. Keep the current Speed Loader, Long Choke, and general-damage upgrade, with the display rename from SILVER ROUNDS to HEAVY ROUNDS proposed for a later source change. The crypt or catacombs can offer a reserve-capacity, handling, or pump-improvement upgrade instead of another generic multiplier.

Unlock true Silver Rounds visibly before the first meaningful werewolf encounter—at the catacomb exit or cave entry—and reinforce their purpose through supplies in the woods. Unlock incendiary rounds before the Leshy at a woods refuge or hunter cache, where the player can preview their use on a bramble obstacle or lesser foe. Both are proposals, not implemented mechanics.

The recommended early policy is selectable special ammo unlocked permanently with appropriate checkpoint resupply, rather than a dense compulsory ammo-economy system. Normal ammo must remain viable and special rounds must not be spendable in a way that makes progress impossible. Whether special ammunition later becomes fully consumable is an open choice, along with the exact pacing of upgrades.

## Ending

After the Leshy's defeat, give the player a short period of control. They walk through woods opening into a sunny meadow: daylight warms gradually, birds and wind replace the oppressive soundscape, flowers and grass return, the weapon lowers, and the HUD fades. There is no surprise final ambush or fake ending. Entering the meadow or reaching a clear lookout starts credits.

Credits should be skippable and replayable, with a light summary after the emotional beat and a detailed results pane available on demand. Keeping the meadow as the credit background preserves the calm release before a menu or replay choice. This is the intended campaign ending, not an existing feature.

## Campaign metrics and fair definitions

The desired end-of-run results include shots fired, shots hitting, missed shots, accuracy, damage dealt and taken, kills by type and boss, headshots or weak points or heart breaks, deaths and retries, active completion time, score, and upgrades collected. Per-weapon detail is useful as an optional breakdown.

The current baseline tracks shots, target hits, kills, vampire kills, pickups, score, and time. It does not accumulate damage dealt, damage taken, or deaths. Its target-hit accounting can count multiple distinct shotgun targets from one blast, so displayed hits divided by shots can exceed 100%. Future results need a separate definition.

| Metric | Proposed definition |
| --- | --- |
| Shot fired | One accepted revolver round or shotgun blast, counted once per trigger action. |
| Shot hit | A fired shot with any valid enemy contact, including vampire body or heart interactions, counted once even if it reaches multiple targets. |
| Missed shot / accuracy | `fired - hit`; `hit / fired`, always at or below 100%. With zero shots, display N/A. |
| Contacts | Optional separate pellet or target-contact count; never use it as accuracy. |
| Damage dealt | Actual accepted player-attributed health damage after reductions, excluding overkill. Burn ticks count once in damage totals and retain their original weapon attribution; they add no new shots or shot hits. |
| Damage taken | Actual player HP lost after reductions, excluding overkill. If healing is shown, track it separately rather than subtracting it from damage taken. |
| Vampire progress | Keep discrete heart or phase breaks separate until vampires use the shared damage model; never invent a health total. |
| Kills | Only player-attributed enemy kills. Scripted cleanup does not count. |
| Time and retries | Campaign totals include failed checkpoint attempts and persist through chapters and retries; deaths are explicit, and results state that policy. Active time excludes pause, menus, and credits. A new run resets the campaign totals. |

For a clean ending snapshot, freeze combat metrics when the final boss is cleared, and record final active campaign time when the player enters the meadow ending trigger. Label those points clearly in results so a walk during credits cannot distort combat numbers or completion time. The exact results-screen layout and whether retries receive an additional attempt-by-attempt view remain open.

The root [game brainstorming overview](../brainstorming.md) keeps the unrelated game ideas and links back here for Ashgrove-specific planning.
