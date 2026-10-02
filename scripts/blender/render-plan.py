#!/usr/bin/env python3
import json
import math
import pathlib
import sys

if len(sys.argv) < 4 or len(sys.argv) > 6:
    raise SystemExit(
        "Usage: render-plan.py <project-dir> <github-output> <plan-json> "
        "[auto|sequential|parallel] [drive-project-override]"
    )

project = pathlib.Path(sys.argv[1]).resolve()
output_file = pathlib.Path(sys.argv[2])
plan_file = pathlib.Path(sys.argv[3])
requested_mode = (sys.argv[4] if len(sys.argv) >= 5 else "auto").strip().lower()
drive_override = (sys.argv[5] if len(sys.argv) >= 6 else "").strip()

if requested_mode not in {"auto", "sequential", "parallel"}:
    raise SystemExit("mode must be auto, sequential, or parallel")

config_file = project / "project.config.json"
if not config_file.exists():
    raise SystemExit(f"Missing config: {config_file}")

cfg = json.loads(config_file.read_text(encoding="utf-8"))
if cfg.get("type") != "blender":
    raise SystemExit("project.config.json type must be 'blender'")

slug = str(cfg.get("slug") or project.name)
scene_script = str(cfg.get("sceneScript", "scene.py"))
blend_file = str(cfg.get("blendFile", "out/scene.blend"))
video_file = str(cfg.get("videoFile", "out/final.mp4"))
blender_version = str(cfg.get("blenderVersion", "4.5.14"))
frame_start = int(cfg.get("frameStart", 1))
frame_count = int(cfg.get("frames", 1))
fps = int(cfg.get("fps", 24))
resolution = str(cfg.get("resolution", "1920x1080")).lower().split("x")
frame_padding = int(cfg.get("framePadding", 4))

if frame_count < 1:
    raise SystemExit("frames must be >= 1")
if fps < 1:
    raise SystemExit("fps must be >= 1")
if len(resolution) != 2:
    raise SystemExit("resolution must use WIDTHxHEIGHT")
width_px, height_px = int(resolution[0]), int(resolution[1])
if width_px < 1 or height_px < 1:
    raise SystemExit("resolution must be positive")
if frame_padding < 1 or frame_padding > 8:
    raise SystemExit("framePadding must be between 1 and 8")
if not (project / scene_script).exists():
    raise SystemExit(f"Missing scene script: {project / scene_script}")

frame_end = frame_start + frame_count - 1
render = cfg.get("render", {})
parallel = render.get("parallel", {})
video = render.get("video", {})
fidelity = render.get("fidelity", {})

safe = bool(parallel.get("safe", False))
simulation_policy = str(parallel.get("simulationPolicy", "unknown"))
simulation_cache_dir = str(parallel.get("simulationCacheDir", ""))
block_size = max(1, int(parallel.get("blockSize", 12)))
max_parallel = min(20, max(1, int(parallel.get("maxParallel", 10))))
min_parallel_frames = max(1, int(parallel.get("minFrames", 24)))
pack_resources = bool(parallel.get("packResources", True))

if requested_mode == "parallel":
    if not safe:
        raise SystemExit("Parallel render refused: render.parallel.safe must be true")
    render_mode = "verified_parallel"
elif requested_mode == "sequential":
    render_mode = "sequential"
else:
    render_mode = "verified_parallel" if safe and frame_count >= min_parallel_frames else "sequential"

if render_mode == "verified_parallel":
    if simulation_policy not in {"none", "baked"}:
        raise SystemExit(
            "Verified parallel render requires simulationPolicy 'none' or 'baked'"
        )
    if simulation_policy == "baked" and not simulation_cache_dir:
        raise SystemExit(
            "Baked simulations require render.parallel.simulationCacheDir"
        )
    if not blend_file or not video_file:
        raise SystemExit("Verified parallel render requires blendFile and videoFile")

blocks = []
start = frame_start
index = 1
total_blocks = math.ceil(frame_count / block_size)
digits = max(2, len(str(total_blocks)))
while start <= frame_end:
    end = min(frame_end, start + block_size - 1)
    blocks.append({
        "block": str(index).zfill(digits),
        "start": start,
        "end": end,
    })
    start = end + 1
    index += 1

controls = parallel.get("controlFrames") or [
    frame_start,
    frame_start + (frame_count - 1) // 2,
    frame_end,
]
controls = sorted(set(int(x) for x in controls))
for frame in controls:
    if frame < frame_start or frame > frame_end:
        raise SystemExit(f"Control frame outside range: {frame}")

drive_project = drive_override or str(cfg.get("driveProjectDir") or slug)
rmse_max = float(fidelity.get("rmseMax", 2e-5))
changed_fraction_max = float(fidelity.get("changedFractionMax", 1e-4))

derived = {
    "project_slug": slug,
    "project_dir": str(project.relative_to(pathlib.Path.cwd())),
    "drive_project": drive_project,
    "scene_script": scene_script,
    "blend_file": blend_file,
    "video_file": video_file,
    "blender_version": blender_version,
    "frame_start": frame_start,
    "frame_end": frame_end,
    "frame_count": frame_count,
    "frame_padding": frame_padding,
    "fps": fps,
    "width": width_px,
    "height": height_px,
    "render_mode": render_mode,
    "requested_mode": requested_mode,
    "parallel_safe": safe,
    "simulation_policy": simulation_policy,
    "simulation_cache_dir": simulation_cache_dir,
    "pack_resources": pack_resources,
    "block_size": block_size,
    "max_parallel": max_parallel,
    "control_frames": controls,
    "matrix": {"include": blocks},
    "video_codec": str(video.get("codec", "libx264")),
    "video_preset": str(video.get("preset", "medium")),
    "video_crf": int(video.get("crf", 16)),
    "video_pix_fmt": str(video.get("pixFmt", "yuv420p")),
    "fidelity_rmse_max": rmse_max,
    "fidelity_changed_fraction_max": changed_fraction_max,
}

plan = {
    "schemaVersion": 1,
    "projectConfig": cfg,
    "derived": derived,
}
plan_file.parent.mkdir(parents=True, exist_ok=True)
plan_file.write_text(json.dumps(plan, indent=2), encoding="utf-8")

outputs = {
    **{k: str(v).lower() if isinstance(v, bool) else str(v)
       for k, v in derived.items()
       if k not in {"control_frames", "matrix"}},
    "control_frames": " ".join(str(x) for x in controls),
    "control_frames_json": json.dumps(controls, separators=(",", ":")),
    "matrix": json.dumps(derived["matrix"], separators=(",", ":")),
}

output_file.parent.mkdir(parents=True, exist_ok=True)
with output_file.open("a", encoding="utf-8") as f:
    for key, value in outputs.items():
        f.write(f"{key}={value}\n")

print(json.dumps(plan, indent=2))
