# WORKSPACE_AUDIT.md

Last audit: 2026-10-02

## Executive conclusion

The workspace now has one reusable production architecture for video work:

- ChatGPT/Codex plans, edits, researches, writes code and can place supplied or downloaded assets directly into the mounted Google Drive workspace.
- GitHub is the source of truth for project code, render requests, configuration and automation.
- Google Drive is the source of truth for heavy assets and final deliveries.
- Remotion Smart Render is the canonical 2D/video assembly renderer.
- Blender Smart Render is the canonical 3D/motion renderer.
- Studio Render Request is the canonical single entrypoint that routes a project to the correct renderer from `projects/<slug>/render.request.json`.
- New project creation also creates the standard Drive structure: `assets`, `renders`, `references`, `notes`.

The old project-specific Remotion workflows have been retired. Active production workflows are intentionally small and generic.

## Proven user-facing flow

For a normal project the intended flow is:

1. user provides media in ChatGPT, Drive or a public source;
2. ChatGPT places chosen assets in `Remotion Projects/<project>/assets`;
3. ChatGPT edits the project source in GitHub and may use the Remotion MCP for rapid frame-driven prototyping/preview;
4. if 3D or complex motion is useful, a Blender project is built and rendered through Blender Smart Render;
5. final assembly is rendered through the canonical renderer;
6. FFmpeg/ffprobe and project-specific QA verify the output;
7. the production result and reports are copied into the project's Drive `renders` folder;
8. GitHub Actions keeps temporary artifacts/checkpoints.

A direct ChatGPT-to-Drive ingest probe was executed successfully during this audit: a file was created in the runtime, uploaded into the mounted `Remotion Projects/_template/assets` folder, confirmed in Drive, and then deleted.

## Canonical active workflows

- `.github/workflows/studio-render-request.yml`
- `.github/workflows/remotion-drive-render.yml` (workflow name: Remotion Smart Render)
- `.github/workflows/remotion-workspace-selftest.yml`
- `.github/workflows/blender-smart-render.yml`
- `.github/workflows/blender-workspace-selftest.yml`
- `.github/workflows/new-project.yml`

Retired as redundant:
- `remotion-render.yml`
- `wow-demo-render.yml`
- `generate-bruno-lock.yml`
- legacy/project-specific Blender production workflows described below

## Unified render entrypoint

`Studio Render Request` watches:

`projects/*/render.request.json`

A request declares the engine and project. The workflow resolves the request and calls the reusable renderer. The tested Remotion route correctly:
- resolved the request;
- selected Remotion;
- skipped Blender;
- planned the render;
- rendered the requested frame range;
- ran technical QA;
- stored a GitHub Actions delivery artifact.

Successful unified-entrypoint validation:

`37067771797` — SUCCESS

## Remotion production path

Canonical workflow:

`.github/workflows/remotion-drive-render.yml`

The workflow now:
- reads `project.config.json` through `scripts/remotion/render-plan.py`;
- uses exact Node/npm/Remotion versions;
- requires a lockfile for reproducible installs;
- pulls shared/project assets from Drive;
- supports Remotion concurrency declared in project config;
- supports economical frame-range validation;
- renders H.264/YUV420p;
- runs ffprobe;
- runs `scripts/remotion/verify-delivery.py`;
- writes `video-probe.json`, `delivery-report.json`, `render-environment.txt`;
- publishes only full production deliveries to Drive;
- keeps a GitHub artifact backup;
- cleans temporary rclone credentials.

Remotion template contract now includes:
- `render.concurrency`
- expected codec/dimensions/FPS
- audio requirement
- minimum duration

Successful Remotion infrastructure validation:

`37067871048` — SUCCESS

This self-test includes syntax/config validation and a real reusable Smart Render integration render.

Historical evidence also remains:
- Remotion Drive Render `36955546882` — SUCCESS
- delivery artifact ~25 MB

## Blender production path

Canonical workflow:

`.github/workflows/blender-smart-render.yml`

The Blender path remains the stricter heavy-render path:
- one immutable master `.blend`;
- exact Blender version;
- dependency/simulation audit;
- master SHA-256;
- master/config contract check;
- sequential or verified parallel mode;
- PNG frame output;
- per-worker master verification;
- fidelity gate for parallel EEVEE renders;
- FFmpeg assembly;
- ffprobe/delivery QA;
- artifacts/checkpoints;
- Drive production delivery;
- optional compatible cross-run recovery.

Successful current generic integration validation:

`37063214685` — SUCCESS

That run used the current generic Smart Render itself on Neon Core and passed planner, master build, block render, fidelity and delivery.

## Parallel rendering conclusion

Parallel rendering was a good architectural decision for Blender scenes whose frames are independent after scene audit.

It is especially useful when:
- the scene is EEVEE/keyframe driven;
- frames do not depend on unbaked temporal simulation state;
- per-frame compute is substantial enough to amortize runner overhead.

It should NOT be forced for:
- short jobs where startup/upload overhead dominates;
- unsafe/unbaked simulations;
- workloads where a benchmark shows no wall-clock benefit.

The design deliberately parallelizes frame calculation while preserving one artistic master.

Remotion uses its own internal concurrency on a runner rather than the Blender block-matrix strategy. That is the simpler and normally faster default for React/Chromium rendering.

## Asset ingestion contract

Assets should live in:

`Remotion Projects/<driveProjectDir>/assets`

ChatGPT can ingest:
- current conversation uploads;
- Library files;
- mounted Google Drive files;
- runtime/generated files;
- public assets downloaded after source/licensing review.

This removes the previous manual requirement to download a ChatGPT attachment and re-upload it to GitHub.

Large binaries should not be committed to GitHub unless there is a compelling repository reason.

## New project contract

`Create Workspace Project` creates code from the appropriate template and now creates the Drive subfolders:

- `assets`
- `renders`
- `references`
- `notes`

New Remotion projects inherit the audited render contract and lockfile.
New Blender projects inherit `render.parallel.safe=false` until audited.

## What "autonomous" means here

The infrastructure is autonomous for deterministic production operations:
- project setup;
- asset placement when ChatGPT has access to the source file;
- code/config editing;
- renderer selection;
- render execution;
- technical QA;
- Drive delivery;
- artifact/checkpoint retention;
- cleanup.

Human/artistic judgment is intentionally not automated away. ChatGPT still decides editorial choices from the brief/materials, and a user may choose to review previews/finals.

## Hybrid Blender + Remotion work

Both engines are available in the same workspace and can be used in one production.

Current canonical pattern:
1. Blender renders the 3D/motion element into Drive;
2. that result becomes an asset for the Remotion final project;
3. Remotion performs final edit, text/subtitles/audio/graphics/assembly;
4. final QA publishes the Remotion output to Drive.

This handoff is operable without user file shuffling because ChatGPT/Drive access can move the intermediate render into the final project's assets. It is not yet represented as one single `engine: hybrid` Actions job; ChatGPT orchestrates the two generic render requests when a production actually needs both engines. This avoids adding untested complexity to every project.

## Remaining real limitations

1. Remotion MCP is a rapid creation/preview surface, not the repository itself. Code used there must also be committed to the GitHub project for reproducible production. ChatGPT can do both in the same workflow.
2. A public asset found on the web still needs source/licensing judgment before reuse.
3. Subjective visual QA remains separate from technical ffprobe/fidelity QA.
4. GitHub-hosted runner performance varies.
5. Blender generic recovery is contract-tested but a future full generic production source run is still the ideal fixture for an end-to-end recovery test.
6. Hybrid Blender→Remotion is automated from the assistant/operator perspective but is not yet a single monolithic GitHub Actions job.
7. GitHub Actions artifacts are temporary checkpoints, not long-term storage; Drive remains the archive/delivery store.

## Final status

The workspace is now suitable as the default production system for future video projects.

For most jobs, the user-facing interaction can be reduced to:
- provide the brief/materials;
- optionally review a preview;
- receive the verified final in Drive.

The user should not need to manually move media into GitHub, create Drive project folders, choose render workers, assemble Blender frame blocks, or upload final renders.

The preferred operating rule is: use generic infrastructure and configuration; do not introduce project-specific workflows unless a project proves the generic contract is insufficient.


## Audio system closure

The audiovisual pipeline now includes a shared professional Audio Quality Gate:

`scripts/media/audio-qa.py`

Integrated into Remotion Smart Render after ffprobe and before production publication.

The gate can enforce:
- required audio presence;
- AAC or another configured codec;
- expected sample rate (48 kHz baseline);
- channel-count range;
- audio/video duration synchronization;
- EBU R128 integrated loudness;
- true peak;
- optional loudness-range limit;
- anomalous leading/trailing/continuous silence.

Default social/web profile in the Remotion template:
- AAC;
- 48 kHz;
- 1-2 channels;
- target -14 LUFS;
- +/- 2 LU tolerance;
- true peak <= -1 dBFS;
- max audio/video duration delta 0.12 s.

Silence analysis is enabled but advisory by default and becomes blocking only when a project explicitly sets `silence.enforce=true`.

Intentional silent videos remain supported: the project decides whether audio is mandatory.

The system deliberately does not apply hidden automatic loudness normalization to every final mix. Mixing decisions stay in Remotion; the gate measures the delivered master and fails the workflow when the configured technical contract is violated.

Successful validation:

`37069243373` — SUCCESS

Evidence in that run:
- workflow/action lint PASS;
- Python/config validation PASS;
- synthetic media fixture with required AAC audio at 48 kHz PASS;
- EBU R128 loudness/true-peak analysis PASS;
- Remotion planner PASS;
- real reusable Remotion Smart Render PASS;
- delivery artifact contains `audio-qa-report.json`.

With this gate, the deterministic technical path covers visual render integrity and final-master audio integrity. Remaining human review is artistic/editorial rather than a missing infrastructure component.
