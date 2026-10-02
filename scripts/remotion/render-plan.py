#!/usr/bin/env python3
import json
import pathlib
import re
import sys

if len(sys.argv) != 5:
    raise SystemExit(
        "Usage: render-plan.py <project-dir> <github-output> <plan-json> <validation-frames>"
    )

cwd = pathlib.Path.cwd().resolve()
projects_root = (cwd / "projects").resolve()
project = pathlib.Path(sys.argv[1]).resolve()
output_file = pathlib.Path(sys.argv[2])
plan_file = pathlib.Path(sys.argv[3])
validation_frames = sys.argv[4].strip()

if project.parent != projects_root:
    raise SystemExit("project-dir must be a direct child of projects/")

cfg_path = project / "project.config.json"
if not cfg_path.exists():
    raise SystemExit(f"Missing config: {cfg_path}")
cfg = json.loads(cfg_path.read_text(encoding="utf-8"))

if cfg.get("type") != "remotion":
    raise SystemExit("project.config.json type must be 'remotion'")

slug = str(cfg.get("slug") or project.name)
expected_slug = project.name[1:] if project.name.startswith("_template-") else project.name
if slug != expected_slug:
    raise SystemExit("project.config.json slug does not match project directory")

composition_id = str(cfg.get("compositionId") or "").strip()
if not re.fullmatch(r"[A-Za-z0-9._-]+", composition_id):
    raise SystemExit("compositionId is missing or contains unsupported characters")

def safe_relative(value, label):
    value = str(value or "").strip().replace("\\", "/")
    path = pathlib.PurePosixPath(value)
    if not value or path.is_absolute() or ".." in path.parts:
        raise SystemExit(f"{label} must be a safe project-relative path")
    resolved = (project / pathlib.Path(*path.parts)).resolve()
    if project not in resolved.parents and resolved != project:
        raise SystemExit(f"{label} escapes the project directory")
    return str(path)

def safe_drive(value):
    value = str(value or "").strip()
    parts = [p for p in value.replace("\\", "/").split("/") if p]
    if not value or value.startswith("/") or ".." in parts or ":" in value:
        raise SystemExit("driveProjectDir must be a safe Drive-relative path")
    if any(ch in value for ch in ("\n", "\r", "\x00")):
        raise SystemExit("driveProjectDir contains control characters")
    return value

output_file_rel = safe_relative(cfg.get("outputFile") or "out/render.mp4", "outputFile")
drive_project = safe_drive(cfg.get("driveProjectDir") or slug)
render = cfg.get("render", {})
concurrency = str(render.get("concurrency", "100%")).strip()
if not re.fullmatch(r"(?:100|[1-9]?[0-9])%|[1-9][0-9]*", concurrency):
    raise SystemExit("render.concurrency must be an integer thread count or percentage from 1%-100%")

validation_only = bool(validation_frames)
if validation_frames and not re.fullmatch(r"[0-9,-]+", validation_frames):
    raise SystemExit("validation-frames contains unsupported characters")

require_audio = bool(render.get("requireAudio", False))
expected_codec = str(render.get("expectedCodec", "h264"))
if not re.fullmatch(r"[A-Za-z0-9_.+-]+", expected_codec):
    raise SystemExit("render.expectedCodec contains unsupported characters")

plan = {
    "schemaVersion": 1,
    "projectConfig": cfg,
    "derived": {
        "project_slug": slug,
        "project_dir": str(project.relative_to(cwd)),
        "composition_id": composition_id,
        "drive_project": drive_project,
        "output_file": output_file_rel,
        "concurrency": concurrency,
        "validation_frames": validation_frames,
        "validation_only": validation_only,
        "require_audio": require_audio,
        "expected_codec": expected_codec,
    },
}
plan_file.parent.mkdir(parents=True, exist_ok=True)
plan_file.write_text(json.dumps(plan, indent=2) + "\n", encoding="utf-8")

outputs = plan["derived"]
output_file.parent.mkdir(parents=True, exist_ok=True)
with output_file.open("a", encoding="utf-8") as f:
    for key, value in outputs.items():
        if isinstance(value, bool):
            value = str(value).lower()
        else:
            value = str(value)
        if "\n" in value or "\r" in value:
            raise SystemExit(f"GitHub output {key} contains newline")
        f.write(f"{key}={value}\n")

print(json.dumps(plan, indent=2))
