# PRODUCTION STATUS — Rubio / La Habana 2026

Updated: 2026-10-03 after review of Flow pilot v2.

## Objective

Produce a professional 60-second Spanish-language illustrated explainer with a coherent voice track, original editorial-cartoon art direction, story-led actions, accurate policy details, music and sound design. Use the broad visual grammar the user likes in Memorias de Pez—clear explanation through maps, acting objects, visual metaphors, brisk rhythm and visual callbacks—without copying that channel's drawings, layouts, branding or signature style.

The 60-second film is the goal. The current 9.3-second render is only a Flow integration and transition test.

## Current source of truth

- Main branch is unchanged: composition RubioHabanaAnimated, 60 seconds, 1080×1920 at 30 fps.
- Open pilot PR: https://github.com/izquierdodavid528-code/Chat-gpt-work-/pull/4
- Pilot branch: pilot/rubio-flow-opening.
- Latest validation run: https://github.com/izquierdodavid528-code/Chat-gpt-work-/actions/runs/37138611848
- Run result: PASS for technical delivery checks. Output is H.264, 1080×1920, 30 fps, 9.3 seconds. It has no audio stream.
- Creative review: the wipe transitions remove the double-exposure fault in v1, but the pilot is not approved as a final look. The shift from map to character feels abrupt, the paper motif dominates, and the sequence has no narration-led dramatic arc.
- The latest pilot plays four Flow clips: harbor, Rubio with a document, document animation, document-to-harbor-gate. It does not cover the six-act 60-second story.
- The pilot configuration on its branch selects RubioFlowOpeningPilot and validation output. Do not merge PR #4 as-is: preserve the main composition and restore production configuration before any eventual merge.
- The validation workflow skipped Drive delivery. The MP4 exists as a GitHub Actions artifact, not as a final Drive master.

## Flow assets received and used

The following references and clips were provided and saved in the project Drive asset folder under 02 - Reel Rubio Habana 2026/assets/flow:

Still images:
- rubio-document-harbor-reference-v1.jpg
- rubio-character-master-v1.jpg
- rubio-policy-map-reference-v1.jpg

Video clips:
- habana-harbor-ships-v1.mp4
- rubio-document-acting-v1.mp4
- rubio-document-harbor-animation-v1.mp4
- rubio-paper-to-harbor-gate-v1.mp4

The source clips are 720×1280, 30 fps and 6.016 seconds each. The pilot scales them to 1080×1920; check sharpness on a phone before using them in the final master. These are real Flow-generated video assets, not placeholders. Flow is a manual user-operated stage; GitHub does not call Flow or spend Flow credits.

## Audio and story status

- NARRATION_V2 is retained as history. It has 145 words and is too dense to assume it will fit naturally in 60 seconds with breathing room.
- NARRATION_V3 is a shorter draft for a scratch voice/timing test; it is not a locked final script.
- SOUND_DESIGN_V1 is a prepared cue guide, not an executed mix.
- No approved narration recording, final SFX/music mix, synced captions or final audio QA currently exists.
- The six-act story is captured in STORYBOARD_V2. Map geometry, dates, labels, policy names and exact text belong in Remotion or verified sourced material, not generated pixels.

## Next production gates

1. Read and source-check the NARRATION_V3 draft. Record or synthesize a scratch voice and time it; revise words to leave natural pauses inside 60 seconds.
2. Build a full 60-second silent/voice animatic in Remotion using the six-act timing, existing Flow clips and simple placeholders. It should tell the complete story before generating many more assets.
3. Review the animatic for phone-size readability, pacing, character continuity and factual scope. Rework story timing before polishing.
4. Generate the two planned Flow tests in FLOW_PROMPTS_V1: Rubio's May acting beat and the textless ledger-to-bank transformation. Use still images as image references when creating a new shot. In the user's Flow experience, attaching a source video edits that clip instead of creating a separate scene.
5. Import only approved Flow outputs. Remotion owns timeline, accurate maps/data/labels, composites, captions and voice/SFX sync.
6. Add Blender only for a specific shot where deterministic depth, perspective, lighting or reusable camera/rig motion materially improves the result. Do not route the entire reel through Blender.
7. Complete final voice, SFX, music, captions and fact/visual/audio QA; render the final 60-second master and verify the delivered Drive file.

## Acceptance criteria for the 60-second master

- Complete 60-second story, not a montage of generated clips.
- Spanish narration is clear, natural, timed to scene actions, and leaves breathing room.
- Visible story action changes every roughly 0.7–1.5 seconds without frantic clutter.
- Rubio remains recognizably the same illustrated character, with meaningful pose and prop interaction.
- Flow clips share a clear art direction and join through motivated action/match cuts; no identity drift or paper-only repetition.
- Accurate dates, borders, labels and policy details are composited in Remotion.
- U-turn, conference and educational restrictions remain category-specific; no claim of a blanket travel ban.
- Music and SFX support, never bury, the narration.
- Caption, safe-area, phone-size, visual and audio checks pass.
- Production render lands in the project Drive renders folder and is verified there.
