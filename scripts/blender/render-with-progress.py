import bpy
import json
import os
import runpy
import sys
import time
from datetime import datetime, timezone

PROGRESS_FILE = os.environ.get("BLENDER_PROGRESS_FILE", "")
PROJECT_SLUG = os.environ.get("BLENDER_PROJECT_SLUG", "")
started_at = None


def utc_now():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def is_animation_render(scene):
    # Our automated video projects switch to FFMPEG immediately before
    # bpy.ops.render.render(animation=True). This avoids counting poster stills.
    return scene.render.image_settings.file_format == "FFMPEG"


def write_progress(scene, status, error=None):
    if not PROGRESS_FILE:
        return

    start = int(scene.frame_start)
    end = int(scene.frame_end)
    current = int(scene.frame_current)
    total = max(1, end - start + 1)
    done = min(total, max(0, current - start + 1))
    percent = round((done / total) * 100.0, 1)

    elapsed = None
    eta = None
    if started_at is not None:
        elapsed = max(0.0, time.monotonic() - started_at)
        if done > 0 and status == "rendering":
            avg = elapsed / done
            eta = max(0.0, avg * (total - done))

    payload = {
        "project": PROJECT_SLUG or None,
        "status": status,
        "current_frame": current,
        "frame_start": start,
        "frame_end": end,
        "frames_done": done,
        "total_frames": total,
        "percent": percent if status != "completed" else 100.0,
        "elapsed_seconds": round(elapsed, 1) if elapsed is not None else None,
        "eta_seconds": round(eta, 1) if eta is not None else 0.0 if status == "completed" else None,
        "updated_at": utc_now(),
    }
    if error:
        payload["error"] = str(error)

    os.makedirs(os.path.dirname(PROGRESS_FILE), exist_ok=True)
    tmp = PROGRESS_FILE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)
        f.write("\n")
    os.replace(tmp, PROGRESS_FILE)


def on_render_pre(scene, _depsgraph=None):
    global started_at
    if not is_animation_render(scene):
        return
    if started_at is None:
        started_at = time.monotonic()
    write_progress(scene, "rendering")


def on_render_post(scene, _depsgraph=None):
    if not is_animation_render(scene):
        return
    write_progress(scene, "rendering")


def on_render_complete(scene, _depsgraph=None):
    if not is_animation_render(scene):
        return
    if int(scene.frame_current) >= int(scene.frame_end):
        write_progress(scene, "completed")


def on_render_cancel(scene, _depsgraph=None):
    if not is_animation_render(scene):
        return
    write_progress(scene, "cancelled")


for handler_list, handler in (
    (bpy.app.handlers.render_pre, on_render_pre),
    (bpy.app.handlers.render_post, on_render_post),
    (bpy.app.handlers.render_complete, on_render_complete),
    (bpy.app.handlers.render_cancel, on_render_cancel),
):
    if handler not in handler_list:
        handler_list.append(handler)


args = sys.argv
if "--" not in args:
    raise RuntimeError("Expected project scene script after '--'")

project_script = args[args.index("--") + 1]
if not os.path.isfile(project_script):
    raise FileNotFoundError(project_script)

try:
    runpy.run_path(project_script, run_name="__main__")
except Exception as exc:
    try:
        write_progress(bpy.context.scene, "failed", error=exc)
    finally:
        raise
