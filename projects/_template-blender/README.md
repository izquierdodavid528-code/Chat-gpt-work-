# Blender project template

This folder defines the contract used by `Blender Smart Render`.

## Required behavior

`scene.py` must:
- build the complete scene deterministically;
- save the file declared by `blendFile`;
- honor `BLENDER_BUILD_ONLY=1` by saving and exiting before final rendering;
- use repository code + Drive assets, not runtime network downloads.

`project.config.json` controls:
- Blender version;
- frame range / FPS / resolution;
- Drive project folder;
- sequential vs verified-parallel eligibility;
- block size / worker count;
- simulation policy;
- FFmpeg output settings;
- fidelity thresholds.

## Parallel safety

New projects start with:

`render.parallel.safe=false`

Only change it to `true` after the scene has been reviewed for frame independence.

For stateful simulations, bake first and declare:

`simulationPolicy: "baked"`

plus `simulationCacheDir`.

## Final render

Use the generic GitHub Actions workflow:

`Blender Smart Render`

with `mode=auto`.

Do not create a project-specific workflow unless the generic pipeline cannot represent a real requirement.
