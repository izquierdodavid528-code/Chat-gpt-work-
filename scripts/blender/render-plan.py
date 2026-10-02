#!/usr/bin/env python3
import json
import math
import pathlib
import re
import sys

if len(sys.argv) < 4 or len(sys.argv) > 7:
    raise SystemExit(
        "Usage: render-plan.py <project-dir> <github-output> <plan-json> "
        "[auto|sequential|parallel] [drive-project-override] [validation-frame-count]"
    )

cwd = pathlib.Path.cwd().resolve()
projects_root = (cwd / "projects").resolve()
project = pathlib.Path(sys.argv[1]).resolve()
output_file = pathlib.Path(sys.argv[2])
plan_file = pathlib.Path(sys.argv[3])
requested_mode = (sys.argv[4] if len(sys.argv) >= 5 else "auto").strip().lower()
drive_override = (sys.argv[5] if len(sys.argv) >= 6 else "").strip()
validation_frame_count = int((sys.argv[6] if len(sys.argv) >= 7 else "0").strip() or "0")

if requested_mode not in {"auto", "sequential", "parallel"}:
    raise SystemExit("mode must be auto, sequential, or parallel")
if project.parent != projects_root:
    raise SystemExit("project-dir must be a direct child of projects/")
if validation_frame_count < 0:
    raise SystemExit("validation-frame-count must be >= 0")

config_file = project / "project.config.json"
if not config_file.exists():
    raise SystemExit(f"Missing config: {config_file}")

cfg = json.loads(config_file.read_text(encoding="utf-8"))
if cfg.get("type") != "blender":
    raise SystemExit("project.config.json type must be 'blender'")

slug = str(cfg.get("slug") or project.name)
if slug != project.name:
    raise SystemExit("project.config.json slug must match its projects/<slug> directory")
if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._-]*", slug):
    raise SystemExit("slug contains unsupported characters")

def safe_relative(value, label, required=True):
    value = str(value or "").strip()
    if not value:
        if required:
            raise SystemExit(f"{label} must not be empty")
        return ""
    path = pathlib.PurePosixPath(value.replace("\\", "/"))
    if path.is_absolute() or ".." in path.parts:
        raise SystemExit(f"{label} must be a safe project-relative path")
    resolved = (project / pathlib.Path(*path.parts)).resolve()
    if project not in resolved.parents and resolved != project:
        raise SystemExit(f"{label} escapes the project directory")
    return str(path)

def safe_drive_path(value, label):
    value = str(value or "").strip()
    if not value:
        raise SystemExit(f"{label} must not be empty")
    if any(ch in value for ch in ("\n", "\r", "\x00")):
        raise SystemExit(f"{label} contains control characters")
    parts = [p for p in value.replace("\\", "/").split("/") if p]
    if value.startswith("/") or ".." in parts or ":" in value:
        raise SystemExit(f"{label} must be a safe Drive-relative path")
    return value

scene_script = safe_relative(cfg.get("sceneScript", "scene.py"), "sceneScript")
blend_file = safe_relative(cfg.get("blendFile", "out/scene.blend"), "blendFile")
video_file = safe_relative(cfg.get("videoFile", "out/final.mp4"), "videoFile")
blender_version = str(cfg.get("blenderVersion", "4.5.14")).strip()
if not re.fullmatch(r"\d+\.\d+\.\d+", blender_version):
    raise SystemExit("blenderVersion must be an exact X.Y.Z version")

frame_start = int(cfg.get("frameStart", 1))
config_frame_count = int(cfg.get("frames", 1))
fps = int(cfg.get("fps", 24))
resolution = str(cfg.get("resolution", "1920x1080")).lower().split("x")
frame_padding = int(cfg.get("framePadding", 4))

if config_frame_count < 1:
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

config_frame_end = frame_start + config_frame_count - 1
effective_frame_count = (
    min(config_frame_count, validation_frame_count)
    if validation_frame_count > 0
    else config_frame_count
)
validation_only = validation_frame_count > 0
frame_end = frame_start + effective_frame_count - 1

render = cfg.get("render", {})
parallel = render.get("parallel", {})
video = render.get("video", {})
fidelity = render.get("fidelity", {})

safe = bool(parallel.get("safe", False))
simulation_policy = str(parallel.get("simulationPolicy", "unknown")).strip().lower()
simulation_cache_dir = safe_relative(
    parallel.get("simulationCacheDir", ""),
    "render.parallel.simulationCacheDir",
    required=False,
)
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
    render_mode = (
        "verified_parallel"
        if safe and config_frame_count >= min_parallel_frames
        else "sequential"
    )

if render_mode == "verified_parallel":
    if simulation_policy not in {"none", "baked"}:
        raise SystemExit(
            "Verified parallel render requires simulationPolicy 'none' or 'baked'"
        )
    if simulation_policy == "baked" and not simulation_cache_dir:
        raise SystemExit(
            "Baked simulations require render.parallel.simulationCacheDir"
        )

blocks = []
start = frame_start
index = 1
total_blocks = math.ceil(effective_frame_count / block_size)
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

if validation_only:
    controls = [
        frame_start,
        frame_start + (effective_frame_count - 1) // 2,
        frame_end,
    ]
else:
    controls = parallel.get("controlFrames") or [
        frame_start,
        frame_start + (effective_frame_count - 1) // 2,
        frame_end,
    ]
controls = sorted(set(int(x) for x in controls))
for frame in controls:
    if frame < frame_start or frame > frame_end:
        raise SystemExit(f"Control frame outside effective range: {frame}")

drive_project = safe_drive_path(
    drive_override or str(cfg.get("driveProjectDir") or slug),
    "driveProjectDir",
)
rmse_max = float(fidelity.get("rmseMax", 2e-5))
changed_fraction_max = float(fidelity.get("changedFractionMax", 1e-4))
if not (0 <= rmse_max <= 1):
    raise SystemExit("render.fidelity.rmseMax must be between 0 and 1")
if not (0 <= changed_fraction_max <= 1):
    raise SystemExit("render.fidelity.changedFractionMax must be between 0 and 1")

video_codec = str(video.get("codec", "libx264")).strip()
video_preset = str(video.get("preset", "medium")).strip()
video_pix_fmt = str(video.get("pixFmt", "yuv420p")).strip()
for label, value in (
    ("render.video.codec", video_codec),
    ("render.video.preset", video_preset),
    ("render.video.pixFmt", video_pix_fmt),
):
    if not re.fullmatch(r"[A-Za-z0-9_.+-]+", value):
        raise SystemExit(f"{label} contains unsupported characters")
video_crf = int(video.get("crf", 16))
if video_crf < 0 or video_crf > 63:
    raise SystemExit("render.video.crf must be between 0 and 63")

derived = {
    "project_slug": slug,
    "project_dir": str(project.relative_to(cwd)),
    "drive_project": drive_project,
    "scene_script": scene_script,
    "blend_file": blend_file,
    "video_file": video_file,
    "blender_version": blender_version,
    "config_frame_start": frame_start,
    "config_frame_end": config_frame_end,
    "config_frame_count": config_frame_count,
    "frame_start": frame_start,
    "frame_end": frame_end,
    "frame_count": effective_frame_count,
    "frame_padding": frame_padding,
    "fps": fps,
    "width": width_px,
    "height": height_px,
    "render_mode": render_mode,
    "requested_mode": requested_mode,
    "validation_only": validation_only,
    "validation_frame_count": validation_frame_count,
    "parallel_safe": safe,
    "simulation_policy": simulation_policy,
    "simulation_cache_dir": simulation_cache_dir,
    "pack_resources": pack_resources,
    "block_size": block_size,
    "max_parallel": max_parallel,
    "control_frames": controls,
    "matrix": {"include": blocks},
    "video_codec": video_codec,
    "video_preset": video_preset,
    "video_crf": video_crf,
    "video_pix_fmt": video_pix_fmt,
    "fidelity_rmse_max": rmse_max,
    "fidelity_changed_fraction_max": changed_fraction_max,
}

plan = {
    "schemaVersion": 2,
    "projectConfig": cfg,
    "derived": derived,
}
plan_file.parent.mkdir(parents=True, exist_ok=True)
plan_file.write_text(json.dumps(plan, indent=2) + "\n", encoding="utf-8")

outputs = {
    **{
        k: str(v).lower() if isinstance(v, bool) else str(v)
        for k, v in derived.items()
        if k not in {"control_frames", "matrix"}
    },
    "control_frames": " ".join(str(x) for x in controls),
    "control_frames_json": json.dumps(controls, separators=(",", ":")),
    "matrix": json.dumps(derived["matrix"], separators=(",", ":")),
}

output_file.parent.mkdir(parents=True, exist_ok=True)
with output_file.open("a", encoding="utf-8") as f:
    for key, value in outputs.items():
        if "\n" in value or "\r" in value:
            raise SystemExit(f"GitHub output {key} contains a newline")
        f.write(f"{key}={value}\n")

print(json.dumps(plan, indent=2))
