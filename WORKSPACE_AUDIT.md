# WORKSPACE_AUDIT.md

Last audit: 2026-10-02

## Result

The Blender production path has been consolidated into one canonical workflow:

`.github/workflows/blender-smart-render.yml`

Project-specific Neon Core / Haaland experiment workflows and the legacy Blender Drive Render workflow were removed from the active workflow directory to prevent duplicate or contradictory render paths.

## Audited components

### Configuration and planning
- `scripts/blender/render-plan.py`
  - validates Blender project config;
  - validates scene script existence;
  - validates frame count, FPS, resolution and four-digit frame naming;
  - chooses `sequential` vs `verified_parallel`;
  - refuses forced parallel when the project is not marked safe;
  - validates simulation policy for parallel mode;
  - emits a machine-readable render plan and GitHub Actions outputs.

### Reproducible Blender
- `scripts/blender/install-pinned.sh`
  - installs the exact project Blender version;
  - current baseline: Blender 4.5.14;
  - cached in GitHub Actions.

### Immutable master
- Scene scripts must support `BLENDER_BUILD_ONLY=1`.
- Final workers render from one saved master `.blend`.
- `scripts/blender/master-audit.py`:
  - checks external dependencies;
  - detects common stateful simulation signals;
  - packs compatible resources;
  - records render engine, frame range, FPS, resolution, compositor and color management;
  - fingerprints the saved master.

### Parallel integrity
- Every worker downloads the same master artifact.
- Every worker checks the master SHA-256 before rendering.
- Workers render PNG frame ranges, never partial encoded videos.
- Completeness is checked before delivery.

### Fidelity
- `scripts/blender/verify_fidelity.py` is the canonical verifier.
- Exact equality passes immediately.
- Default EEVEE tolerance:
  - normalized RMSE <= 2e-5;
  - changed fraction <= 1e-4.
- Thresholds are configurable from `project.config.json`.
- Delivery is blocked when a control frame exceeds either threshold.

### Encoding and delivery
- Final videos are assembled from verified PNG frames with FFmpeg.
- ffprobe records codec, dimensions, frame rate, frame count, duration and size.
- Final output and audit reports are uploaded to Google Drive.
- GitHub Actions keeps a temporary artifact backup.

## Regression testing

Canonical infrastructure regression test:

`.github/workflows/blender-workspace-selftest.yml`

It checks:
- Python syntax;
- shell syntax;
- GitHub Actions workflow syntax with actionlint;
- template JSON;
- planner behavior;
- Neon Core and Haaland auto-mode planning;
- exact Blender installation;
- template build-only contract;
- master audit;
- a real Blender PNG render and expected dimensions.

A self-test must be green before infrastructure changes are considered complete.

## Template contract

`projects/_template-blender` is the only starter template for new Blender projects.

New projects default to:
- `render.parallel.safe=false`;
- exact Blender version;
- four-digit frame names;
- strict fidelity defaults;
- automatic mode selection.

Enable parallel mode only after scene review.

## Proven production test: Neon Core

The Neon Core experiment proved the parallel architecture end-to-end.

Verified final:
- H.264;
- 720x1280;
- 24 fps;
- 120 frames;
- 5.0 seconds;
- final verification PASS.

Fidelity controls:
- frame 1: 40 changed pixels / 921600, RMSE 1.49162e-5, PASS;
- frame 60: 40 changed pixels / 921600, RMSE 1.49162e-5, PASS;
- frame 120: exact, PASS.

The parallel frame phase used ten concurrent 12-frame blocks. Individual blocks took roughly 843-1346 seconds, so wall-clock frame computation was bounded by the slowest concurrent block rather than the sum of all ten.

## Known limitations

- GitHub-hosted CPU performance varies between runners.
- EEVEE can show tiny floating-point differences across independent hosts; the strict fidelity gate handles this without accepting visible divergence.
- Stateful simulations must not be distributed before baking.
- Cycles GPU should be selected only after a project-specific benchmark proves a real advantage.
- The workflow does not make a project parallel-safe automatically; that declaration remains an explicit scene audit decision.

## Cross-chat recovery

For a new chat, read in this order:
1. `STUDIO_CONTEXT.md`
2. target `projects/<slug>/project.config.json`
3. `WORKSPACE_AUDIT.md`
4. `WORKSPACE_GUIDE.md` when full architecture detail is needed.

Local planning command:

`npm run blender:plan -- <project-slug> [auto|sequential|parallel]`

Final GitHub render:

**Blender Smart Render**, normally with `mode=auto`.
