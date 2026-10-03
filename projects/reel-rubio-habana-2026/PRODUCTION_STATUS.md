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

The first Blender attempt exposed visual safe-area problems:
- typography rendered inside Blender was clipped;
- right-side labels exceeded the vertical safe area;
- lower title treatment invaded the frame;
- the 3D plate and editorial typography were too tightly coupled.

Current solution:
- Blender v4 is a clean 3D plate only;
- no political/editorial typography is baked into Blender;
- Remotion owns all titles, labels and hierarchy;
- Blender keeps Florida/Cuba geometry, Miami-Havana route and pressure rings.

Validation request:
- requestId: `rubio-habana-map-hook-v4-clean-3d-plate-validation`
- GitHub Actions run: `37085181118`
- build-master: PASS
- reference frames: PASS visual inspection
- 6-frame render block: PASS
- delivery verification: running at last status check

Full request has already been issued:
- requestId: `rubio-habana-map-hook-v4-clean-3d-plate-full`
- validationFrameCount: 0
- GitHub Actions run: `37085816242`
- state at last check: waiting for validation concurrency group to release

Next Blender gate:
1. finish the already-running v4 105-frame delivery;
2. inspect final MP4 motion and framing;
3. render the 0–149 Remotion composite before creative approval;
4. compare against the prepared v5 candidate if v4 still reads too synthetic.

V5 candidate is already prepared in `projects/rubio-habana-map-2026/scene.py` but has NOT been requested/rendered yet:
- closed concentric rings replaced with open offset policy contours;
- red emission reduced;
- route glow reduced;
- city markers reduced;
- compositor glow reduced.

Reason:
the v4 control frames are technically clean, but the closed red rings can read like a bullseye/target rather than neutral policy layers.

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

1. Let validation delivery verification finish and release the Blender concurrency group.
2. Complete the already-launched full 105-frame hook render (run 37085816242).
3. Visual QA on Blender control frames 1 / 53 / 105 and the final hook MP4.
4. Trigger a short Remotion validation using the automatically imported Blender plate.
5. Review representative frames from all six chapters of the 60-second animatic.
6. Redesign only scenes that fail the creative gate; do not add Blender where Remotion communicates better.
7. Generate/record the final voice from `NARRATION_V3.md`.
8. Generate captions from the final narration waveform/timing.
9. Run complete creative + factual + audio QA.
10. Render the 60-second production master.
