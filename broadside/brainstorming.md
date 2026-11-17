# Broadside Planning Notes

**Status:** planning notes only; active work is happening elsewhere.

**Updated:** 2026-11-16

This note records the settled galleon-duel direction without directing or expanding the implementation.

## Core duel

Two galleons move around one another in open ocean, with distant islands giving the horizon atmosphere and scale. The player controls cannon fire only. The ships maneuver automatically, changing their range, heading, and firing opportunities; steering, navigation, boarding, and crew management are outside the core interaction.

The confirmed camera sits above and behind the player ship, framing both galleons. The mouse commands a cannon's direction and elevation, and clicking fires an available gun. Cannons visibly traverse and elevate within their firing arcs. Guns that are reloading or cannot reach the command should communicate that state rather than silently bending a shot toward the cursor.

## Ranging and feedback

A cannonball leaves its real muzzle with a consistent, gun-specific starting speed, then gravity pulls it down. The player aims above an enemy at longer range and leads it while it crosses the line of fire. The cursor is a command direction rather than a guaranteed impact: no auto-elevation, hit snapping, homing, or default perfect landing indicator.

Small variation in launch angle and speed gives a broadside character without making careful ranging pointless. The essential rhythm is to fire, read a splash as short or long, adjust elevation and lead, then release a more confident follow-up or broadside. Water plumes, smoke, recoil, and impacts should make that correction legible. Ship roll and pitch can influence the muzzle, but should stay restrained and tunable enough that they add texture rather than randomness.

## Local destruction

Hull sections, mast bases, sails and rigging, gun positions, and the rudder take local, chunky sectional damage. Breakable supports let a mast fall and unsupported timber detach instead of disappearing. Hull breaches can flood simple internal sections, making a ship settle and list until it loses buoyancy or meaningful combat ability. This is a readable destruction model, not a full naval simulation.

Later possibilities—special ammunition, weather, campaign structure, salvage, boarding, or elemental cannonballs—remain optional. The root [game brainstorming overview](../brainstorming.md) keeps the broader context.
