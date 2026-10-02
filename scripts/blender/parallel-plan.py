#!/usr/bin/env python3
import json
import math
import os
import pathlib
import sys

if len(sys.argv) != 3:
    raise SystemExit("Usage: parallel-plan.py <project-dir> <github-output>")

project = pathlib.Path(sys.argv[1]).resolve()
output_file = pathlib.Path(sys.argv[2])
config_file = project / "project.config.json"
if not config_file.exists():
    raise SystemExit(f"Missing config: {config_file}")

cfg = json.loads(config_file.read_text(encoding="utf-8"))
render = cfg.get("render", {})
parallel = render.get("parallel", {})

if not parallel.get("safe", False):
    raise SystemExit(
        "Parallel render refused: project.config.json must set render.parallel.safe=true "
        "after the scene has been audited."
    )

simulation_policy = parallel.get("simulationPolicy", "unknown")
if simulation_policy not in {"none", "baked"}:
    raise SystemExit(
        "Parallel render refused: render.parallel.simulationPolicy must be 'none' or 'baked'."
    )

if simulation_policy == "baked":
    cache_dir = parallel.get("simulationCacheDir")
    if not cache_dir:
        raise SystemExit(
            "Parallel render refused: baked simulations require simulationCacheDir."
        )
    cache_path = project / cache_dir
    if not cache_path.exists():
        raise SystemExit(f"Parallel render refused: cache does not exist: {cache_path}")

frame_start = int(cfg.get("frameStart", 1))
frame_count = int(cfg.get("frames", 0))
if frame_count < 1:
    raise SystemExit("project.config.json must define frames > 0")
frame_end = frame_start + frame_count - 1

block_size = max(1, int(parallel.get("blockSize", 12)))
max_parallel = min(20, max(1, int(parallel.get("maxParallel", 10))))

blocks = []
start = frame_start
idx = 1
total_blocks = math.ceil(frame_count / block_size)
width = max(2, len(str(total_blocks)))
while start <= frame_end:
    end = min(frame_end, start + block_size - 1)
    blocks.append({
        "block": str(idx).zfill(width),
        "start": start,
        "end": end,
    })
    start = end + 1
    idx += 1

controls = parallel.get("controlFrames") or [
    frame_start,
    frame_start + (frame_count - 1) // 2,
    frame_end,
]
controls = sorted(set(int(x) for x in controls))
for f in controls:
    if f < frame_start or f > frame_end:
        raise SystemExit(f"Control frame outside range: {f}")

blend_file = cfg.get("blendFile")
scene_script = cfg.get("sceneScript", "scene.py")
video_file = cfg.get("videoFile")
if not blend_file or not video_file:
    raise SystemExit("Parallel video render requires blendFile and videoFile in config.")

video = render.get("video", {})
resolution = str(cfg.get("resolution", "1920x1080")).lower().split("x")
if len(resolution) != 2:
    raise SystemExit("resolution must use WIDTHxHEIGHT")
width_px, height_px = int(resolution[0]), int(resolution[1])

values = {
    "project_slug": cfg.get("slug", project.name),
    "project_dir": str(project.relative_to(pathlib.Path.cwd())),
    "drive_project": cfg.get("driveProjectDir", cfg.get("slug", project.name)),
    "scene_script": scene_script,
    "blend_file": blend_file,
    "video_file": video_file,
    "blender_version": str(cfg.get("blenderVersion", "4.5.14")),
    "frame_start": str(frame_start),
    "frame_end": str(frame_end),
    "frame_count": str(frame_count),
    "fps": str(int(cfg.get("fps", 24))),
    "width": str(width_px),
    "height": str(height_px),
    "block_size": str(block_size),
    "max_parallel": str(max_parallel),
    "control_frames": " ".join(str(x) for x in controls),
    "control_frames_json": json.dumps(controls, separators=(",", ":")),
    "matrix": json.dumps({"include": blocks}, separators=(",", ":")),
    "simulation_policy": simulation_policy,
    "video_codec": str(video.get("codec", "libx264")),
    "video_preset": str(video.get("preset", "medium")),
    "video_crf": str(int(video.get("crf", 16))),
    "video_pix_fmt": str(video.get("pixFmt", "yuv420p")),
}

output_file.parent.mkdir(parents=True, exist_ok=True)
with output_file.open("a", encoding="utf-8") as f:
    for key, value in values.items():
        f.write(f"{key}={value}\n")

print(json.dumps({
    "project": values["project_slug"],
    "frames": [frame_start, frame_end],
    "blocks": blocks,
    "max_parallel": max_parallel,
    "control_frames": controls,
    "simulation_policy": simulation_policy,
}, indent=2))
