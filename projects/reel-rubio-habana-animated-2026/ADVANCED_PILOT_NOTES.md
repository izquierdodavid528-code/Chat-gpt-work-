# ADVANCED OPENING PILOT — v1

Branch: `advanced-opening-pilot-v1`

Baseline protection:
- `main` is untouched.
- `src/Video.tsx` remains the approved 60-second v2 baseline.
- The pilot is a separate composition: `AdvancedOpeningPilot`.

## What this pilot tests

1. A shared scene camera track rather than per-object pseudo-camera interpolation.
2. Depth-aware parallax layers using a single camera state.
3. A reusable physical entrance primitive with follow-through.
4. A route-driven tanker rig that derives position and orientation from a Bézier path.
5. Secondary motion on cargo/oil props tied to the parent rig.
6. Deterministic particle fields for wake/atmosphere.
7. A motivated object transition: the tariff tag grows toward camera to provide a future match-cut surface.
8. Data-driven timing constants instead of scattered cue numbers.

## Deliberate exclusions

- No Three.js or Blender yet.
- No new external assets.
- No narration, captions, SFX, or paid generation.
- No changes to the later four acts.

The purpose of this pilot is to prove whether 2.5D camera + object-rig architecture materially improves direction before adopting it across the reel.
