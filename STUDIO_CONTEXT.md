# STUDIO_CONTEXT.md

> START HERE in any new ChatGPT/Codex chat that works on this repository.

## Purpose

This repository is the control center for a reusable remote multimedia studio.

Architecture:
- ChatGPT / Codex: creative direction, planning, editing, code, automation and maintenance.
- Flow / generative visual tools: visual development, character/background/prop assets and selective short motion plates.
- GitHub: source code, configuration, prompts/manifests, version history and GitHub Actions.
- Codespaces / VS Code Web: interactive remote workspace from Android or desktop.
- Blender: selective 3D / rigged / spatial animation, not the default renderer for the whole reel.
- Remotion: master timeline, 2D/2.5D animation, compositing, subtitles, audio and final video composition.
- Google Drive: large assets, Blender/Flow intermediates, renders and delivery files.

Repository:
- `izquierdodavid528-code/Chat-gpt-work-`
- default branch: `main`

Drive root:
- `Remotion Projects`

## Human-operated Google Flow handoff

There is no Google Flow API, credential or GitHub Actions generation step in this repository. Flow is a manual creative handoff: Codex prepares shot briefs and copy-ready prompts; the user generates and exports approved still images and video clips; the files are uploaded to the configured Drive project folder. Flow video is a first-class production route and can replace selected Blender shots when it meets the visual and continuity needs faster. The automated pipeline resumes after upload: Drive sync, Remotion/Blender processing, QA and delivery workflows remain available. Treat an asset as available only after it has been received and checked. Never describe Flow generation itself as automated.

Start with one style frame and one character reference. Reuse approved references for poses and video clips. Plan Flow video actively for motion-led shots; use focused prompts and controlled revisions to spend credits efficiently, without treating available credits as a reason to avoid useful generations. Blender complements Flow for deterministic 3D geometry, exact camera paths, reusable rigs or simulations Flow cannot reliably deliver. Keep generated text, labels, maps and factual geography out of Flow outputs; build those deterministically in Remotion.

## Current Rubio / Havana project state

The main branch preserves the earlier 60-second rough-cut baseline. The latest cartoon render remains isolated on `memorias-cartoon-v6`; it is a technical validation, has no audio and was not delivered to Drive. The user has not approved its current visual style as the final direction. Preserve the baseline and work only on an 8–12-second opening pilot until the user approves its look and motion.

For that project, read `projects/reel-rubio-habana-animated-2026/PRODUCTION_STATUS.md` and `projects/reel-rubio-habana-animated-2026/FLOW_ASSET_BRIEFS.md` before editing.

## Canonical hybrid animation workflow

Read `HYBRID_ANIMATION_PIPELINE.md` before designing an animated project.

Shot routing rule:
- Remotion first for 2D/2.5D, editorial timing, maps, typography, transitions and compositing.
- Flow for reusable visual assets and selective short generated-motion plates.
- Blender only when real depth, rigging, spatial camera motion, perspective or lighting materially improves the shot.
- Blender defaults to EEVEE Next and short reusable segments; do not render a complete social reel in Blender unless the project is genuinely 3D-first.
- Validate timing with proxies/low-cost previews before generating or rendering expensive final assets.

For new animation sessions, `MASTER_PROMPT_HYBRID_ANIMATION.md` is the canonical startup prompt.

## Canonical Blender workflow

Use **Blender Smart Render**:
- workflow file: `.github/workflows/blender-smart-render.yml`
- input: `project_slug`
- mode: `auto` by default;
- `validation_frame_count=0` for full production; a positive value is an economical integration validation and does not publish to Drive.

Do NOT create a new project-specific render workflow unless there is a real requirement the generic workflow cannot represent.

### Auto mode

`auto` reads `projects/<slug>/project.config.json`.

- If `render.parallel.safe=true` and the animation is large enough, it selects `verified_parallel`.
- Otherwise it uses `sequential`.
- `parallel` can be forced only when the project is explicitly marked safe.
- The planner refuses unsafe or incomplete configurations instead of guessing.

### Common master pipeline

Both sequential and parallel final renders use the same principle:

1. checkout exact repository revision;
2. resolve `project.config.json`;
3. install the exact Blender version declared by the project;
4. pull Drive assets;
5. run the scene script with `BLENDER_BUILD_ONLY=1`;
6. produce one immutable `.blend` master;
7. audit dependencies and simulation signals;
8. pack compatible resources and reject any non-portable external dependency;
9. fingerprint the master with SHA-256;
10. verify the master against `project.config.json` (version, engine, range, FPS and resolution);
11. render PNG frames from that master using the configured frame padding;
12. verify exact frame completeness;
13. assemble the MP4 with FFmpeg;
14. inspect the MP4 with ffprobe and run the delivery verifier;
15. save audit files;
16. for a full production run, upload delivery to Drive and keep a GitHub Actions artifact.

Parallel mode additionally:
- divides frames into blocks;
- sends the exact same master to every worker;
- verifies the master SHA-256 on every worker;
- renders control frames from the master before distribution;
- compares distributed control frames against references;
- refuses delivery when fidelity exceeds the configured tolerance.

## Fidelity policy

Default strict EEVEE tolerance:
- normalized RMSE <= `2e-5`;
- changed-pixel fraction <= `1e-4` (0.01%).

Exact equality passes immediately.

This threshold was established from the Neon Core forensic validation:
- frames 1 and 60: 40 changed pixels out of 921,600, RMSE ~1.49162e-5, SSIM 1.000000;
- frame 120: exact match.

Do not loosen these limits casually. If a future scene fails, investigate first.

## Simulation policy

Parallel render is allowed only after scene review.

Use:
- `simulationPolicy: "none"` for independent/keyframed frames;
- `simulationPolicy: "baked"` when stateful simulations are baked and `simulationCacheDir` is declared. Production Smart Render retrieves that cache from the project folder in Drive and preserves its project-relative path for every worker.

Examples requiring special care:
- smoke / fire / fluids;
- cloth / soft body;
- dynamic paint;
- stateful particle systems;
- Geometry Nodes simulation zones.

Never split an unbaked stateful simulation across independent workers.

## Blender project contract

Each Blender project lives at:

`projects/<slug>/`

Required:
- `project.config.json`
- scene script, normally `scene.py`

The scene script MUST:
- build the entire scene deterministically;
- save the path declared in `blendFile`;
- honor `BLENDER_BUILD_ONLY=1` by saving the master and exiting before final rendering;
- avoid downloading network resources during render;
- keep large source assets in Drive, not GitHub.

New Blender projects should start from:
- `projects/_template-blender`
- `npm run blender:new -- <slug> ["Drive folder"]`

New projects default to `render.parallel.safe=false` until audited.

Local planning check:
- `npm run blender:plan -- <slug> [auto|sequential|parallel]`

## Important files

- `WORKSPACE_GUIDE.md`: complete workspace guide.
- `STUDIO_CONTEXT.md`: this cross-chat operational summary.
- `projects/reel-rubio-habana-animated-2026/FLOW_ASSET_BRIEFS.md`: user-operated Flow prompts and the opening-pilot handoff.
- `projects/reel-rubio-habana-animated-2026/PRODUCTION_STATUS.md`: dated production record and current Rubio/Havana status.
- `.github/workflows/blender-smart-render.yml`: canonical Blender final render.
- `.github/workflows/blender-workspace-selftest.yml`: regression test for the Blender infrastructure.
- `scripts/blender/render-plan.py`: config validation and automatic mode selection.
- `scripts/blender/master-audit.py`: master dependency/simulation audit and manifest.
- `scripts/blender/verify-master-contract.py`: proves the audited master matches project config.
- `scripts/blender/verify-recovery-plan.py`: prevents recovery across changed art/configuration or from validation-only runs.
- `scripts/blender/verify_fidelity.py`: strict image fidelity gate.
- `scripts/blender/verify-delivery.py`: proves PNG numbering and final video properties.
- `scripts/blender/install-pinned.sh`: exact Blender installer.
- `projects/_template-blender`: contract-compliant starter project.

## Proven reference

Neon Core validated the architecture end-to-end.

Verified output:
- 720x1280
- 24 fps
- 120 frames
- 5 seconds
- H.264
- final fidelity gate: PASS

Drive project:
- `Remotion Projects/03 - Blender Neon Core Demo`

The experiment showed that parallel EEVEE rendering reduced wall-clock frame computation compared with the ~53-minute sequential reference, while preserving visual fidelity under the strict gate. Individual 12-frame blocks ranged roughly 14-22 minutes and ran concurrently.

## Operating rule for future chats

When asked to continue studio work:
1. read this file;
2. for animation work, read `HYBRID_ANIMATION_PIPELINE.md`;
3. read the target project's `project.config.json`;
4. read `WORKSPACE_AUDIT.md` for the validated production contract;
5. read `WORKSPACE_GUIDE.md` only when broader architecture is needed;
6. use the generic workflows instead of inventing duplicate automation;
7. keep Drive for heavy assets/renders and GitHub for source/config/prompts;
8. route each shot to the cheapest tool that preserves intended quality;
9. never expose `RCLONE_CONFIG_B64` or other secrets;
10. do not call a render "final" until its verification/delivery job succeeds.

## Recovery and known boundaries

- Frame block artifacts are checkpoints and are retained temporarily (currently 14 days).
- Before rerendering, inspect current/recent Actions artifacts and the master SHA-256.
- If a compatible generic run already contains the full master + frame blocks, call `Blender Smart Render` with `recovery_run_id=<run id>`. Recovery verifies the source/current plan contract, master SHA, frame completeness, fidelity and final video before delivery, without rerendering the frames.
- The workflow does not automatically discover which historical run should be recovered; the source run ID must be selected explicitly.
- `render.parallel.safe=true` remains an explicit audit decision. Automation refuses unsafe projects but does not decide artistic/simulation safety on its own.
- Baking a stateful simulation is still a project preparation step; Smart Render distributes and verifies a declared baked cache, it does not invent the bake.
- Automated QA verifies technical fidelity and delivery properties; subjective artistic review remains separate.

## Current cleanup policy

Old project-specific Blender experiment workflows and the legacy Blender Drive Render workflow have been removed from the active workflow directory. Blender Smart Render plus the self-test are now the canonical Blender production infrastructure.
