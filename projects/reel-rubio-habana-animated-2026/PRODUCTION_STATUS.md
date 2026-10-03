# PRODUCTION STATUS — Illustrated Rubio / La Habana 2026

Updated: 2026-10-03

## Project state

Replacement project for the cancelled slide-style reel.

Current rough cut:
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

## Current render request

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

## Current v2 improvements

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


## Rough cut v2 milestone

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

Current gate:
- illustrated animation language is approved for rough-cut continuation;
- next production phase is narration + SFX + captions + final mix.
