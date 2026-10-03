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
Run 37138611848 completed with technical PASS. Actual artifact inspected: H.264 1080×1920, 30 fps, 9.3 seconds, no audio stream; audio QA is NOT_ENABLED. Visual review of the actual frames shows the harbor opening cutting directly to Rubio with the document; there is no map in this render. The later document/bridge transformation makes the paper motif recur and does not yet create a complete narrative arc. No complete story, narration, mix, captions or final QA. This is not an approved film.

## Assets
Drive source: 02 - Reel Rubio Habana 2026/assets/flow. Three stills and six Flow clips are inventoried in FLOW_ASSET_BRIEFS.md. All six supplied source clips are 720×1280, 24 fps, about 6.016 sec, with AAC; previous docs incorrectly said 30 fps. New files:
- rubio-may-document-acting-v1.mp4 — identity/style stable, point unclear, paper motion awkward; reaction insert only for now.
- ofac-ledger-to-bank-v1.mp4 — readable page-to-bank morph, blank facade; recommended for OFAC transition.
Mute all clip audio by default. Check upscaling and 24-to-30 cadence.

## Voice and animatic status

NARRATION_V3 remains the unchanged, source-checked 120-word draft. Edge TTS 7.2.8 was installed and the live voice list checked. Three identical neural voice samples were generated; es-US-AlonsoNeural is the provisional scratch choice because its 12.624-second sample left the most room for breaths among the three tested. Full narration is measured at 56.640 seconds (master WAV); the Remotion MP3 is 56.664 seconds. No acceleration or script edits. Word timings now drive 12 animatic cuts and phrase captions. The original MP3, conservative WAV/MP3 masters, SRT and samples are in Drive under project assets/audio.

The first full render reached technical PASS at 60.032 s, H.264 1080×1920 / 30 fps, with 48 kHz stereo AAC. Extracted voice measured -18.4 LUFS integrated, -5.2 dBFS true peak and 2.4 LU LRA, with no clipping. The workflow's dedicated audio-QA report is NOT_ENABLED, so these are direct media measurements rather than a configured QA pass. A contact sheet revealed that the bank clip was cut before its transformation; the branch now starts that source at 3.0 s and keeps it at 1x for its 2.9 s phrase window, then requests another full render. The visual placeholders are still marked as blockouts. Creative approval, pronunciation listen-through, final voice, factual final-pass, SFX/music and final QA are not yet passed. The earlier 9.3-second pilot remains unapproved.

## Next

1. Run the full 60-second render on this isolated branch with Drive assets enabled; check build, audio QA and artifact.
2. Inspect motion, phone framing, visual holds, Flow timing, captions and speech onsets; update the matrix from findings.
3. Request Flow generation only for gaps where a physical action or acting shot is better in Flow than Remotion; exact text, map geography and labels stay in Remotion.
4. After animatic review, lock voice performance and timing, then add action-linked SFX, restrained music and finalized captions.
5. Continue factual, visual and audio QA separately; the 9.3-second pilot is not approved.