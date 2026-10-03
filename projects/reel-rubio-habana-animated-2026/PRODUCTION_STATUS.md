# PRODUCTION STATUS — Illustrated Rubio / La Habana 2026

Updated: 2026-10-03 after review of the V6 validation

## Latest state — V6 is not an approved master

- The main branch preserves the earlier 60-second rough-cut baseline. The latest cartoon experiment remains isolated on branch `memorias-cartoon-v6`; it has not replaced main.
- V6 source commit rendered by run [37129519131](https://github.com/izquierdodavid528-code/Chat-gpt-work-/actions/runs/37129519131): `e182964b1c4d6bc502a34a0635eef1d07d9fdaef`. The branch documentation head is `528aad5191441f8065b65a7fcd48700394556bda`.
- Technical result: 60 seconds, 1080×1920, 30 fps, H.264. The render has zero audio streams; the Blender job was skipped; the Drive delivery step was skipped. The successful run produced a validation artifact, not a final delivery.
- Creative review: a frame sample at five-second intervals and source-code review confirm added paper texture, ambient layers, facial details and some movement. The piece still relies on flat SVG scenes and repeated simple character loops; the figures are small in many shots, with limited pose-to-pose acting and spatial interaction. It has no Flow-generated assets or Blender-rendered shot.
- The user's current target is a professional illustrated political explainer with the broad storytelling qualities of Memorias de Pez. No current version has final creative approval. The new task is an isolated 8–12-second opening pilot, not another full-reel render.
- Flow is a manual user handoff for both images and video; it is a first-class shot source and can replace selected Blender work. Use the copy-ready still/video prompts and credit-efficient iteration notes in [FLOW_ASSET_BRIEFS.md](FLOW_ASSET_BRIEFS.md). The repository automates asset sync, rendering and QA after upload, but does not call Google Flow itself.
- Preserve the earlier main-branch baseline. Do not add final narration, captions, sound or full-reel render until the opening pilot's look and motion are approved.

The historical V2 notes below are retained for provenance. Their former “PASS” and “approved” wording records the state at that earlier milestone; it does not override the user's later feedback or imply that V2 or V6 is the final look.

## Historical project state — V2 baseline

Replacement project for the cancelled slide-style reel.

State recorded at that milestone:
- composition: `RubioHabanaAnimated`
- 1080x1920
- 30 fps
- 1800 frames / 60 seconds
- original vector illustration built in Remotion
- no Blender dependency
- no photorealistic synthetic political footage

## Scene timing

- 00:00–00:18 — hook + January oil/tariff mechanism + February rollback
- 00:18–00:29 — May EO 14404 toolbox / sectors / State-Treasury implementation
- 00:29–00:41 — OFAC designations -> bank transformation
- 00:41–00:52 — finance network + U-turn + professional/education authorization changes
- 00:52–01:00 — attributed official framings + documented timeline close

## Completed visual work

### Opening
- hand-drawn Florida/Cuba map
- animated oil/document/bank/badge objects
- tanker
- cargo match-cut
- customs gate
- January date stamp
- February calendar
- tariff removal
- paper wipe into May

### May
- executive-order paper turns into an illustrated toolbox
- five sector tokens jump out
- State / Treasury arms enter
- implementation stamp
- clearly illustrated Rubio figure in State lane

### Designations
- animated SDN list
- multiple OFAC stamp hits
- June / September chronology
- list transforms into illustrated Banco Exterior de Cuba

### Finance / mobility
- camera metaphorically enters the bank
- money token moves through pipes
- U-turn mechanism is crossed out
- route closes
- professional badge loses authorization tag
- education lane narrows

### Close
- pullback to Cuba + accumulated policy objects
- White House and MINREX framings remain explicitly attributed
- timeline Jan -> Feb -> May -> Jun -> Sep
- final documented summary

## Previous visual test

11-second language test:
- GitHub run: `37090283653`
- status: SUCCESS

23-second acts 1-2 test:
- GitHub run: `37090559903`
- status: SUCCESS
- visually reviewed

Findings already fixed:
- customs booth appearing too early
- cargo box visible before cue
- February scene crowding
- abrupt February -> May transition
- unnecessary explanatory copy in May
- rough cut retimed to narration structure

## Historical render request

requestId: `rubio-habana-animated-full-rough-cut-v1`
range: `0-1799`

The next gate is full 60-second visual QA. Do not add final narration or captions until that gate passes.


## Full rough cut v1 visual audit

Run: `37090763729`
Status: SUCCESS
Artifact: full 60-second validation MP4

What worked:
- illustrated explainer language is clearly different from the cancelled slide-style project;
- opening uses acting objects instead of information cards;
- May toolbox / sector pop-outs / State-Treasury arms read as animation;
- OFAC list physically transforms into Banco Exterior;
- finance token, U-turn and authorization objects communicate mechanisms through action;
- attributed speech bubbles work as an illustrated close.

Issues found in v1:
1. Florida/Cuba silhouettes were too abstract.
2. January customs elements lingered too far into the February beat.
3. Finance scene still contained a large inner card that looked too dashboard-like.
4. All finance pipes activated together instead of sequentially.
5. Professional authorization tab did not fully fall away.
6. Designations -> finance needed a stronger physical match-cut.
7. Close opened with a brief nearly blank gray transition.

All seven items are already fixed in current v2 code.

## Rough cut v2 improvements

- more geographically recognizable Florida/Cuba using the prior verified simplified coordinate geometry;
- earlier January fade during February;
- bank zooms into camera before finance scene;
- financial route activates in three sequential pipe segments;
- cream dashboard panel removed from finance scene;
- authorization tab visibly falls away;
- close rebuilt for its actual 8-second duration with no dead zone;
- explanatory on-screen copy reduced further.

Current v2 render:
- run `37091037962`
- requestId `rubio-habana-animated-full-rough-cut-v2`
- next gate: compare v2 representative frames against v1 before narration.


## Rough cut v2 milestone (historical)

Run `37091037962`: SUCCESS.

Visual QA:
- opening geography: PASS after v2 map revision;
- May toolbox / State-Treasury / Rubio: PASS;
- designations -> bank transformation: PASS;
- finance / mobility: PASS after dashboard removal and sequential routing;
- close: PASS after 8-second retiming.

Minor post-v2 cleanup:
- redundant hook sentence removed in commit `0221c3f34eea2042e87e15896c101c8e411292c0`.

Narration:
- `NARRATION_V2.md`
- 145 spoken words
- targeted for a natural ~60 second delivery.

Sound:
- `SOUND_DESIGN_V1.md` prepared.
- Final voice/SFX generation has not been run yet because external generation may consume connected-service credits.

Historical gate after the V2 milestone:
- the V2 rough cut passed the recorded visual review at that time;
- the user's later feedback supersedes that creative approval. V2 and V6 remain reference versions, not final masters.
