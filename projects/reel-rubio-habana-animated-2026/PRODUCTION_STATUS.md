# PRODUCTION STATUS — Rubio / La Habana 2026

Updated 2026-10-03 after remote repo, Drive and render audit.

## Objective
Professional 60-second Spanish-language vertical illustrated explainer, 1080×1920 / 30 fps, with natural narration, original editorial animation, motivated transitions, SFX, music and phrase captions. Use broad educational visual grammar without copying a channel's signature style. Flow makes both images and video; Remotion directs/composites; Blender solves specific gaps.

## GitHub truth
- main at audit: ec8732b68b1dd1f46ca83c78db826b313c476827; untouched 60-second RubioHabanaAnimated baseline.
- PR #4 remains open on pilot/rubio-flow-opening. Do not merge as-is; it selects the 9.3-second pilot.
- PR #5 remains open, docs-only, based on main.
- Current isolated work branch animatic/rubio-60s-source-checked derives from the docs branch based on main. Neither main nor pilot branch has been changed.
- The old main illustration remains a baseline, not the new final direction.

## Prior pilot render audit
Run 37138611848 completed with technical PASS. Actual artifact inspected: H.264 1080×1920, 30 fps, 9.3 seconds, no audio stream; audio QA is NOT_ENABLED. Visual review of the actual frames shows the harbor opening cutting directly to Rubio with the document; there is no map in this render. The later document/bridge transformation makes the paper motif recur and does not yet create a complete narrative arc. No complete story, narration, mix, captions or final QA. This is not an approved film.

## Assets
Drive source: 02 - Reel Rubio Habana 2026/assets/flow. Three stills and six Flow clips are inventoried in FLOW_ASSET_BRIEFS.md. All six supplied source clips are 720×1280, 24 fps, about 6.016 sec, with AAC; previous docs incorrectly said 30 fps. New files:
- rubio-may-document-acting-v1.mp4 — identity/style stable, point unclear, paper motion awkward; reaction insert only for now.
- ofac-ledger-to-bank-v1.mp4 — readable page-to-bank morph, blank facade; recommended for OFAC transition.
Mute all clip audio by default. Check upscaling and 24-to-30 cadence.

## Latest full animatic render and review

Run 37155793209 completed successfully after the bank-source retime. Downloaded and inspected artifact: H.264, 1080×1920, 30 fps, 60.032 s container duration (1800-frame composition), one 48 kHz stereo AAC track. Delivery report is TECHNICAL PASS. FFmpeg analysis of the embedded voice measured -18.4 LUFS integrated, 2.4 LU LRA, -5.2 dBFS true peak and -5.3 dBFS sample peak; no clipping. The repository audio-QA report says NOT_ENABLED, so these are direct media measurements, not an automated audio-QA pass.

A contact sheet across all 12 shot windows and a six-frame sequence of S08 were inspected. The second render now reveals the bank facade by the spoken bank name. Caption lines remain within two lines at phone preview size. Eight scenes intentionally remain marked BLOCKING PLACEHOLDER · NOT FINAL ART: they need original sourced Remotion maps, routes, calendar/state-change diagrams and category graphics. This is a VOICE-LED ANIMATIC, not a creative or final pass; it still lacks final scene animation, SFX, music, final voice approval and full visual/factual/audio QA.

## Voice and animatic status

NARRATION_V3 remains the unchanged, source-checked 120-word draft. Edge TTS 7.2.8 was installed and the live voice list checked. Three identical neural voice samples were generated; es-US-AlonsoNeural is the provisional scratch choice because its 12.624-second sample left the most room for breaths among the three tested. Full narration is measured at 56.640 seconds (master WAV); the Remotion MP3 is 56.664 seconds. No acceleration or script edits. Word timings now drive 12 animatic cuts and phrase captions. The original MP3, conservative WAV/MP3 masters, SRT and samples are in Drive under project assets/audio.

The first full render reached technical PASS at 60.032 s, H.264 1080×1920 / 30 fps, with 48 kHz stereo AAC. Extracted voice measured -18.4 LUFS integrated, -5.2 dBFS true peak and 2.4 LU LRA, with no clipping. The workflow's dedicated audio-QA report is NOT_ENABLED, so these are direct media measurements rather than a configured QA pass. A contact sheet revealed that the bank clip was cut before its transformation; the branch now starts that source at 3.0 s and keeps it at 1x for its 2.9 s phrase window, then requests another full render. The visual placeholders are still marked as blockouts. Creative approval, pronunciation listen-through, final voice, factual final-pass, SFX/music and final QA are not yet passed. The earlier 9.3-second pilot remains unapproved.

## Motion pass in progress

The next isolated render replaces the eight instructional placeholder cards with first-pass animated Remotion diagrams for the map route, conditional gate, February change, agency roles, OFAC register, U-turn path, meeting authorization and education exceptions. Exact labels remain in Remotion. Existing Flow plates remain selective. Render and review are pending.

## Next

1. Replace the eight blockouts with the sourced Remotion map, route, gate/calendar, delegation, register and travel-category motion; add exact bank/date labels.
2. Keep the existing Flow harbor, Rubio reaction, bank transformation and map still. No new Flow generation is justified by the reviewed gaps at this stage; prompt only if a later shot needs a specific organic action or acting take that Remotion cannot hold.
3. Add restrained music and action-linked SFX after motion timing is stable; verify OFAC, U-turn and MINREX aloud.
4. Recheck phrase captions, safe areas and mobile readability on the next render.
5. Complete separate factual, creative, audio and final passes. Neither this animatic nor the older 9.3-second pilot is creatively approved.