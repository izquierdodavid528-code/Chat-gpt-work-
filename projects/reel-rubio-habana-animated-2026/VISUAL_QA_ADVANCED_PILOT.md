# VISUAL QA — Advanced Opening Pilot

Branch: `advanced-opening-pilot-v1`

## Baseline

- v2 baseline run: `37091037962`
- baseline commit: `95d765098cb6e03ffc9174b731c5fc5c9121421e`
- approved production-state commit on main: `fb8f3f646935f33eab4f7f50fbc16e4bae39a752`
- `src/Video.tsx` was not modified by the pilot branch.

## Pilot iteration 1

Commit: `077cedbd1af57b109cbbd317e211f1c7c4418295`
Run: `37092135835`
Status: SUCCESS

Technical:
- composition validation: PASS
- Remotion render: PASS
- delivery verification: PASS
- Blender: correctly skipped

Visual findings:
1. shared camera and route-driven tanker clearly improved continuity;
2. too much unused vertical space remained;
3. depth existed in code but was not visually legible enough;
4. the red tariff element read too much like a flat information card;
5. the fixed Florida/Cuba label was redundant and too small.

## Pilot iteration 2

Commit: `32f0c4dc45b5d112b7031ed792fa4f25cfef1f5d`
Run: `37092362522`
Status: SUCCESS

Corrections:
- camera framing moved the action lower and kept the map/ship relationship readable;
- Bahamas geometry restored for geographic continuity;
- a near-depth moving water plane was added so parallax is visibly readable;
- redundant fixed location label removed;
- tariff element rebuilt as a hanging shipping tag with string, punched hole, dimensional tilt and follow-through;
- final push uses the tag as a motivated match-cut surface rather than a generic fade;
- route retains continuous spatial behavior while changing visual emphasis.

## Comparison against v2

The final pilot now demonstrates a meaningful directional difference rather than just more simultaneous animation:

- one camera state controls the scene instead of isolated object transforms;
- the tanker derives position and orientation from one Bézier route;
- cargo motion inherits the ship rig and adds secondary oscillation;
- near/mid/far layers react differently to the same camera move;
- route, ship, wake, tag and impact are causally staged;
- the final transition grows out of an object already present in the scene.

## Remaining limitations

This is still an intentionally small 2.5D pilot.
- map art remains simple;
- there is no true 3D geometry or lighting;
- no narration/captions/SFX were added;
- the pilot is not yet merged into the 60-second baseline.

Current conclusion:
The opening no longer needs Three.js or Blender merely to obtain camera hierarchy, depth and physical continuity. Those tools should be reserved for a future shot where real geometry/lighting/simulation materially improves the story.
