# PRODUCTION STATUS — Reel Rubio / La Habana 2026

Updated: 2026-10-03

## Current objective

Produce a 60-second vertical (1080x1920, 30 fps) neutral documentary-style animated reel explaining the documented expansion and change of U.S. Cuba-policy instruments during 2026, without presenting recreations as real footage and without attributing presidential executive orders personally to Marco Rubio.

## Current master architecture

- Remotion project: `projects/reel-rubio-habana-2026`
- Blender hook project: `projects/rubio-habana-map-2026`
- Drive project directory: `Remotion Projects/02 - Reel Rubio Habana 2026`
- GitHub Actions entrypoint: `.github/workflows/studio-render-request.yml`
- Remotion renderer: `.github/workflows/remotion-drive-render.yml`
- Blender renderer: `.github/workflows/blender-smart-render.yml`

## Automation state

Cross-engine dependency import is automated.

Blender production deliveries are written to:

`Remotion Projects/02 - Reel Rubio Habana 2026/renders/`

The Remotion project now declares:

`renders/rubio-habana-map.mp4 -> public/rubio-habana-map.mp4`

via `driveAssetImports` in `project.config.json`.

The generic import implementation is:

`scripts/remotion/pull-drive-imports.py`

No manual Drive-to-GitHub asset copy should be needed for the Blender hook.

## Hook state

The project has moved from v4 to **v5 open contours**.

Why v5 replaced v4:
- closed red pressure rings read too much like a bullseye / literal physical targeting;
- v5 uses open, offset policy-layer contours instead;
- marker sizes and glow were reduced;
- land and route materials are more restrained;
- the result reads as an explanatory documentary map rather than a target graphic.

V5 validation:
- requestId: `rubio-habana-map-hook-v5-open-contours-validation`
- run: `37087157661`
- build-master: PASS
- inspected control frames: 1 / 23 / 45
- visual result: PASS for framing, route readability and non-bullseye policy contours

Superseded/cancelled full runs:
- v4 full run `37085816242` — cancelled after v5 replaced the scene
- first v5 full run `37087440277` — cancelled during concurrency cleanup

Concurrency release:
- run `37087663265`
- 1-frame validation used only to release the previous validation concurrency group

**Current authoritative full Blender run**
- requestId: `rubio-habana-map-hook-v5-open-contours-full-final-retry`
- run: `37088519777`
- validationFrameCount: 0
- status at last check: build-master PASS through contract verification; rendering reference control frames
- earlier v4/v5 full attempts are superseded and should not be used for delivery.

Concurrency policy:
- latest request wins per Blender project;
- do not create another `render.request.json` change while run `37088519777` is active;
- unrelated workspace self-tests use different project concurrency groups and do not replace this delivery.

Next Blender gate:
1. let run `37088519777` render all 105 frames;
2. inspect control frames 1 / 53 / 105;
3. inspect final MP4 motion and framing;
4. accept the Drive delivery only if creative QA passes;
5. then trigger Remotion validation using the imported plate.

## Remotion state

The animatic has been expanded from 20 seconds to the full 60-second chapter structure.

Creative upgrades completed after reviewing the previous 20-second render:
- hook typography rebalanced into the upper safe area; pressure-layer labels moved below the map;
- old schematic tanker removed;
- oil scene rebuilt as the actual EO 14380 mechanism plus EO 14389 rollback;
- EO 14404 scene now distinguishes the presidential order from State/Treasury implementation roles;
- designations scene now uses dated OFAC examples (4 Jun and 3 Sep) instead of generic network-only graphics;
- September finance scene explicitly defines CRL and preserves the exact indirect-transaction/U-turn scope;
- restrained chapter transition pulses added.

- 0–5 s: hook / map
- 5–14 s: oil / EO 14380 and EO 14389 rollback
- 14–24 s: EO 14404 framework
- 24–37 s: designations
- 37–50 s: indirect transactions / U-turn change
- 50–60 s: neutral close

The hook already references the Blender plate and stretches the 3.5-second plate across the 5-second hook using playbackRate 0.7.

The project delivery QA now requires at least 59 seconds so an obsolete 20-second render cannot pass as a production delivery.

Audio pipeline correction:
- the previous animatic contained an AAC stream that was effectively inaudible (~-70 dB mean);
- validation QA now has an optional signal-floor gate and this project enables it at -45 dBFS peak minimum;
- the workspace self-test includes a negative silent-AAC fixture and passes;
- the music bed is now `Impact Moderato` by Kevin MacLeod, imported from the immutable Wikimedia Commons original and credited in `CREDITS.md`;
- final narration remains intentionally ungenerated until voice choice / credit usage is authorized and the visual animatic passes.

## Factual / editorial guardrails

Use `fact-matrix.json`, `RESEARCH_BRIEF.md`, `NARRATION_V3.md`, and `CREATIVE_QA.md` as mandatory gates.

Key rules:
- presidential EOs are signed by the President, not Rubio;
- Rubio is shown as Secretary of State / public and implementing official where documented;
- U.S. government rationales remain attributed;
- no synthetic documentary-looking footage of political figures;
- do not imply the January IEEPA tariff mechanism persisted unchanged after the February rollback;
- do not claim U.S. measures alone explain Cuba's economic conditions;
- final close describes competing official interpretations without choosing one.

## Next production steps

1. Complete authoritative full v5 Blender run `37088519777` without issuing another same-project request.
2. Confirm verified MP4 delivery and Drive upload.
3. Visual QA on Blender control frames 1 / 53 / 105 and the final hook MP4.
4. Trigger a short Remotion validation using the automatically imported Blender plate.
5. Review representative frames from all six chapters of the 60-second animatic.
6. Redesign only scenes that fail the creative gate; do not add Blender where Remotion communicates better.
7. Generate/record the final voice from `NARRATION_V3.md`.
8. Generate captions from the final narration waveform/timing.
9. Run complete creative + factual + audio QA.
10. Render the 60-second production master.
