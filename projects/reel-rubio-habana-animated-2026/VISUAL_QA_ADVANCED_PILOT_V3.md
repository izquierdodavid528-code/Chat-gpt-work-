# VISUAL QA — Advanced Opening Pilot v3

Run: `37092909668`
Commit: `fd0d97979d5bc641d04aff2650b98170e1fdc212`
Composition: `AdvancedOpeningPilot`
Range: `0-329` (11 seconds)
Status: SUCCESS

## Technical correctness

- composition validation: PASS
- Remotion render: PASS
- delivery verification: PASS
- Blender: correctly skipped
- no voice, SFX, captions or external paid generation added

## Visual review

Representative review:
- 00:00.5 — establishment / layered geography
- 00:02.0 — route build
- 00:04.0 — tanker travel / inherited cargo motion
- 00:05.8 — tariff object enters
- 00:07.2 — route changes emphasis
- 00:08.6 — impact / petroleum marker
- 00:09.4 — tag moves into camera
- 00:09.8 — red surface takeover
- 00:10.0–00:10.8 — physical bridge into calendar/paper surface

### Improvements over pilot v2

1. **Land volume**
   - Florida and Cuba now use stacked shadow/edge layers instead of a single flat polygon.
   - Bahamas retain continuity and receive secondary line detail.

2. **Tanker hierarchy**
   - larger silhouette;
   - layered hull;
   - deck structure;
   - bridge/windows;
   - local shadows and highlights;
   - inherited barrel motion plus wake particles.

3. **Readable parallax**
   - near-water foreground now crosses the lower frame with a stronger depth differential;
   - far texture, land, route/ship, near water and tariff object respond at distinct depth values.

4. **Physical transition**
   - tariff tag preserves rope, punched hole, swing and dimensional tilt;
   - tag fills the camera rather than fading out;
   - its red surface becomes the transition field;
   - a torn-edge calendar/paper sheet rises from the same field;
   - no explicit `20 FEB` is shown before the next narrative beat.

## Remaining limitations

- geography is still stylized illustration, not detailed cartography;
- no true 3D lighting or geometry;
- the next February action itself remains outside this pilot;
- audio/captions remain intentionally deferred.

## Decision

PASS as the current advanced opening reference.

The pilot now demonstrates a reusable editorial animation architecture with camera hierarchy, readable depth, object rigs, secondary motion, route-driven movement and a motivated object-to-scene transition. Further work should extend this grammar into the February beat rather than add more unrelated motion to the opening.
