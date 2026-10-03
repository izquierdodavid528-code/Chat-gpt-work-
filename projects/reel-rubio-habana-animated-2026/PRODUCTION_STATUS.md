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

## Latest render audit
Run 37138611848 completed with technical PASS. Actual artifact inspected: H.264 1080×1920, 30 fps, 9.3 seconds, no audio stream; audio QA is NOT_ENABLED. Visual review confirms repeated harbor/paper motif and abrupt map-to-character jump; it covers only a small opening test. No complete story, narration, mix, captions or final QA. This is not an approved film.

## Assets
Drive source: 02 - Reel Rubio Habana 2026/assets/flow. Three stills and six Flow clips are inventoried in FLOW_ASSET_BRIEFS.md. All six supplied source clips are 720×1280, 24 fps, about 6.016 sec, with AAC; previous docs incorrectly said 30 fps. New files:
- rubio-may-document-acting-v1.mp4 — identity/style stable, point unclear, paper motion awkward; reaction insert only for now.
- ofac-ledger-to-bank-v1.mp4 — readable page-to-bank morph, blank facade; recommended for OFAC transition.
Mute all clip audio by default. Check upscaling and 24-to-30 cadence.

## Current blockers and gates
NARRATION_V3 is source-checked and revised to 120 words; 130 wpm estimates 55.4 sec but is not a measured take. Runway voice endpoint returned 401 (token revoked); no suitable natural Spanish TTS is installed locally. Therefore no voice-led animatic is rendered or claimed. SOUND_DESIGN_V1 is a plan, not a mix. Technical, creative, factual, audio and final passes remain separate.

## Next
1. Restore voice access or supply scratch audio; save under assets/audio.
2. Measure actual duration and phrase breaks; retime the six-act matrix.
3. Render/review complete 60-sec voice animatic using selected Flow clips and explicit placeholders.
4. Inspect full moving video at phone size; then issue only prompts for assets proven missing by review.
5. After approval, complete visual assets, Remotion compositing, voice, SFX, music, captions and final independent QA.