# STUDIO_CONTEXT.md

> START HERE in any new ChatGPT/Codex chat that works on this repository.

## Purpose

This repository is the control center for a reusable remote multimedia studio.

Architecture:
- ChatGPT / Codex: planning, editing, automation and maintenance.
- GitHub: source code, configuration, version history and GitHub Actions.
- Codespaces / VS Code Web: interactive remote workspace from Android or desktop.
- Blender: 3D / motion / compositing.
- Remotion: assembly, subtitles, text, motion graphics and final video composition.
- Google Drive: large assets, renders and delivery files.

Repository:
- `izquierdodavid528-code/Chat-gpt-work-`
- default branch: `main`

Drive root:
- `Remotion Projects`

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
- `.github/workflows/blender-smart-render.yml`: canonical Blender final render.
- `.github/workflows/blender-workspace-selftest.yml`: regression test for the Blender infrastructure.
- `scripts/blender/render-plan.py`: config validation and automatic mode selection.
- `scripts/blender/master-audit.py`: master dependency/simulation audit and manifest.
- `scripts/blender/verify-master-contract.py`: proves the audited master matches project config.
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
2. read the target project's `project.config.json`;
3. read `WORKSPACE_AUDIT.md` for the validated production contract;
4. read `WORKSPACE_GUIDE.md` only when broader architecture is needed;
5. use the generic workflows instead of inventing duplicate automation;
6. keep Drive for heavy assets/renders and GitHub for source/config;
7. never expose `RCLONE_CONFIG_B64` or other secrets;
8. do not call a render "final" until its verification/delivery job succeeds.

## Recovery and known boundaries

- Frame block artifacts are checkpoints inside a run and are retained temporarily (currently 14 days).
- Before rerendering, inspect current/recent Actions artifacts and the master SHA-256.
- Cross-run automatic resume from arbitrary old frame-block artifacts is **not** implemented yet; do not claim that it is.
- `render.parallel.safe=true` remains an explicit audit decision. Automation refuses unsafe projects but does not decide artistic/simulation safety on its own.
- Baking a stateful simulation is still a project preparation step; Smart Render distributes and verifies a declared baked cache, it does not invent the bake.
- Automated QA verifies technical fidelity and delivery properties; subjective artistic review remains separate.

## Current cleanup policy

Old project-specific Blender experiment workflows and the legacy Blender Drive Render workflow have been removed from the active workflow directory. Blender Smart Render plus the self-test are now the canonical Blender production infrastructure.
