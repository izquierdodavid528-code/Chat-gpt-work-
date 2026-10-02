# WORKSPACE_AUDIT.md

Last audit: 2026-10-02

## Result

The Blender production path is consolidated into one canonical production workflow:

`.github/workflows/blender-smart-render.yml`

and one canonical infrastructure regression workflow:

`.github/workflows/blender-workspace-selftest.yml`

Project-specific Neon Core / Haaland experiment workflows and the legacy Blender Drive Render workflow are no longer present in the active workflow directory.

Current validated main commit at the end of this audit:

`ce576de6f2154c6f5240a13b1bbae5a145ca0d4a`

## Canonical workflows

### Blender Smart Render

`.github/workflows/blender-smart-render.yml`

Supported entry modes:
- `workflow_dispatch` for normal manual production use.
- `workflow_call` for regression/integration testing and reuse.

Inputs:
- `project_slug`
- `mode = auto | sequential | parallel`
- optional `drive_project_dir`
- `validation_frame_count=0` for production; positive values render only the first N frames and do not publish to Drive.
- optional `recovery_run_id` for compatible production artifact recovery.

Concurrency:
- production runs for the same project are serialized;
- validation runs may cancel superseded validation work;
- documentation-only changes do not trigger the Blender self-test or a heavy render.

### Blender Workspace Self-Test

`.github/workflows/blender-workspace-selftest.yml`

It validates:
- Python syntax;
- shell syntax;
- workflow syntax with actionlint;
- template JSON;
- planner behavior;
- forced-parallel refusal for an unsafe template;
- Neon Core and Haaland auto planning;
- recovery-plan compatibility rules;
- exact Blender 4.5.14 installation;
- template build-only behavior;
- master audit;
- master/config contract verification;
- real PNG rendering;
- fidelity verifier;
- FFmpeg assembly / ffprobe;
- final delivery verifier;
- a real reusable-workflow integration render of Neon Core with three frames.

## Configuration and planning

Canonical planner:

`scripts/blender/render-plan.py`

It:
- requires a Blender `project.config.json`;
- validates safe project-relative paths;
- validates exact Blender version format;
- validates frame count, FPS, resolution, frame padding and fidelity ranges;
- refuses forced parallel unless `render.parallel.safe=true`;
- requires `simulationPolicy=none|baked` for verified parallel;
- requires `simulationCacheDir` for baked simulations;
- chooses `sequential` vs `verified_parallel` in auto mode;
- emits a machine-readable render plan and GitHub Actions outputs;
- supports an economical validation frame count without changing the real master scene contract.

New projects still start with:

`render.parallel.safe=false`

Parallel safety remains an explicit scene-audit decision.

## Reproducible Blender

Canonical installer:

`scripts/blender/install-pinned.sh`

Current baseline:
- Blender 4.5.14
- rclone 1.75.1
- Ubuntu 24.04 GitHub-hosted runners

The installer now verifies that the installed Blender version exactly matches the requested pinned version.

## Immutable master contract

A production run builds the project scene once with:

`BLENDER_BUILD_ONLY=1`

and then audits that single master with:

`scripts/blender/master-audit.py`

The audit:
- checks missing external resources;
- packs compatible resources;
- rejects a supposedly immutable master that still depends on non-portable external files;
- records render engine, frame range, FPS, resolution, compositor and color management;
- detects common simulation signals including cloth, fluids, soft body, dynamic paint, particles, rigid bodies and Geometry Nodes simulation signals;
- validates a declared baked cache;
- fingerprints the final saved `.blend` with SHA-256.

The master is then checked against `project.config.json` by:

`scripts/blender/verify-master-contract.py`

This blocks delivery when the actual master does not match the declared:
- Blender version;
- render engine;
- full configured frame range;
- FPS;
- resolution;
- simulation policy;
- SHA-256.

Every render worker verifies the same master SHA-256 before rendering.

## Stateful simulations

Verified parallel rendering is allowed only when:
- `render.parallel.safe=true`;
- the simulation policy is explicit;
- unbaked stateful simulation is not distributed.

For `simulationPolicy: "baked"`:
- `simulationCacheDir` is mandatory;
- production Smart Render can retrieve that cache from the project folder in Drive;
- the cache is distributed with the immutable master while preserving its project-relative path.

Baking itself remains a project preparation step; Smart Render does not create a correct simulation bake automatically.

## Frames, fidelity and video delivery

Workers render PNG frame sequences, not partial videos.

The configured `framePadding` is used consistently for:
- Blender output names;
- completeness verification;
- fidelity controls;
- FFmpeg input.

Parallel fidelity uses:

`scripts/blender/verify_fidelity.py`

Default strict EEVEE policy:
- exact equality passes immediately;
- otherwise normalized RMSE <= `2e-5`;
- changed-pixel fraction <= `1e-4` (0.01%).

Final delivery uses FFmpeg and ffprobe, then:

`scripts/blender/verify-delivery.py`

which verifies:
- exact expected PNG numbering;
- no missing or unexpected PNG frames;
- final width / height;
- frame rate;
- frame count when available;
- duration within frame-based tolerance.

A verified delivery records:
- `master-manifest.json`
- `master-blend.sha256`
- `master-contract-report.json`
- `render-environment.txt`
- `fidelity-report.txt`
- `block-timings.txt`
- `video-probe.json`
- `delivery-report.json`
- final MP4

## Real generic workflow validation

Successful GitHub Actions run:

`37063214685`

Result:

`SUCCESS`

This run is important because it did not execute the retired Neon-specific workflow. The self-test invoked the current reusable `Blender Smart Render` itself with:
- project: `blender-neon-core-demo`
- mode: `auto`
- validation frame count: 3

Successful jobs:
- validate
- integration-neon / plan
- integration-neon / build-master
- integration-neon / render-blocks (frames 1-3)
- integration-neon / deliver-parallel

The resulting delivery artifact was inspected after the run.

Observed technical result:
- frame range: 1-3
- frame count: 3/3
- padding: 4
- missing frames: 0
- unexpected frames: 0
- codec: H.264
- resolution: 720x1280
- frame rate: 24 fps
- duration: 0.125 s
- master contract: PASS
- delivery report: PASS

Fidelity:
- frame 1: 40 changed pixels, RMSE 1.49162e-5, PASS
- frame 2: 61 changed pixels, RMSE 1.84201e-5, PASS
- frame 3: 46 changed pixels, RMSE 1.59958e-5, PASS
- final fidelity status: PASS

This is a real integration validation of the current generic production pipeline while avoiding an unnecessary second 120-frame render.

## Proven full Neon Core reference

The earlier full production experiment remains the end-to-end reference for the complete 120-frame workload.

Verified production characteristics:
- H.264
- 720x1280
- 24 fps
- 120 frames
- 5.0 seconds
- final fidelity PASS

Historical successful recovery run:

`37046777826`

Historical successful full parallel run:

`37057341934`

Those runs proved the full-frame architecture and strict EEVEE tolerance, while the newer run `37063214685` proves that the current generic Smart Render implementation still executes the same master / block / fidelity / delivery architecture.

## Recovery and resume

Generic recovery is implemented in Smart Render through:

`recovery_run_id=<source run id>`

Compatibility is checked by:

`scripts/blender/verify-recovery-plan.py`

The verifier rejects:
- validation-only sources;
- changed `projectConfig`;
- changed render contract;
- changed frame range / dimensions / FPS / codec / fidelity settings.

The recovery path is designed to:
- reuse a compatible generic Smart Render master and frame artifacts;
- verify the master fingerprint;
- rerun fidelity and delivery QA;
- reassemble and deliver without rerendering the frames.

Current evidence level:
- recovery contract logic is covered by the self-test;
- the current generic normal render path is integration-tested end-to-end;
- the current generic cross-run recovery path has not yet been exercised end-to-end with a full prior generic production run.

This is intentional: the available new generic source run is validation-only and is correctly rejected as a production recovery source. Running another full 120-frame generic render only to create a recovery fixture would waste substantial compute.

## Active Blender workflow cleanup

Active Blender workflows:
- `blender-smart-render.yml`
- `blender-workspace-selftest.yml`

Retired/removed project-specific or legacy Blender production workflows include the previous Neon-specific parallel, recovery, forensic and auto workflows, the Haaland-specific auto workflow, and the legacy Blender Drive Render workflow.

Other active workflows in the repository are Remotion/project-management workflows and are not duplicate Blender production paths.

## Source of truth for any new chat

Read in this order:
1. `STUDIO_CONTEXT.md`
2. target `projects/<slug>/project.config.json`
3. `WORKSPACE_AUDIT.md`
4. `WORKSPACE_GUIDE.md`

Operating rules:
- inspect the real current `main` branch and Actions state before changing anything;
- use `Blender Smart Render`, normally with `mode=auto`;
- do not create project-specific Blender render workflows unless the generic contract genuinely cannot represent the requirement;
- inspect recent artifacts before rerendering expensive frames;
- never mix frames from different master SHA-256 values;
- use Drive for heavy assets and final production deliveries;
- do not expose `RCLONE_CONFIG_B64`;
- do not call a render final until QA and delivery have succeeded.

## Remaining limitations

- GitHub-hosted CPU performance varies between runners.
- EEVEE can show tiny host-to-host floating-point differences; the strict fidelity gate addresses this within the measured threshold.
- `render.parallel.safe=true` is not inferred automatically; it remains an explicit scene-review decision.
- Baking a stateful simulation remains a preparation step.
- Validation mode skips Drive publication and is intended for infrastructure verification, not final delivery.
- Generic recovery requires an explicit compatible `recovery_run_id`; automatic historical-run discovery is not implemented.
- Generic recovery is contract-tested but not yet end-to-end integration-tested against a full generic production source run.
- Automated technical QA does not replace subjective visual/artistic review.
- GitHub Actions artifacts are temporary checkpoints (currently retained 14 days), not archival storage.

## Final audit conclusion

The generic Blender production architecture is operational and reusable.

The current Smart Render workflow has real evidence for:
- planning;
- immutable master creation;
- master/config contract verification;
- parallel block rendering;
- SHA-256 integrity;
- PNG numbering;
- strict EEVEE fidelity;
- FFmpeg assembly;
- ffprobe;
- final delivery QA;
- artifacts/checkpoints;
- cleanup;
- concurrency;
- reusable workflow invocation.

The remaining uncertainty is narrow and documented: generic cross-run recovery still needs a future full generic production source run before that branch can be called end-to-end integration-tested.
