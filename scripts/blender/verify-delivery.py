#!/usr/bin/env python3
import json
import math
import pathlib
import sys

if len(sys.argv) != 10:
    raise SystemExit(
        "Usage: verify-delivery.py <frames-dir> <frame-start> <frame-end> "
        "<frame-padding> <probe.json> <width> <height> <fps> <report.json>"
    )

frames_dir = pathlib.Path(sys.argv[1])
frame_start = int(sys.argv[2])
frame_end = int(sys.argv[3])
padding = int(sys.argv[4])
probe_path = pathlib.Path(sys.argv[5])
expected_width = int(sys.argv[6])
expected_height = int(sys.argv[7])
expected_fps = float(sys.argv[8])
report_path = pathlib.Path(sys.argv[9])

errors = []
expected_names = {
    f"{frame:0{padding}d}.png"
    for frame in range(frame_start, frame_end + 1)
}
actual_names = {p.name for p in frames_dir.glob("*.png") if p.is_file()}
missing = sorted(expected_names - actual_names)
extra = sorted(actual_names - expected_names)
if missing:
    errors.append(f"Missing PNG frames: {missing[:10]}")
if extra:
    errors.append(f"Unexpected PNG frames: {extra[:10]}")

probe = json.loads(probe_path.read_text(encoding="utf-8"))
streams = [
    s for s in probe.get("streams", [])
    if s.get("codec_type") in (None, "video")
]
stream = streams[0] if streams else {}
fmt = probe.get("format", {})

actual_width = int(stream.get("width", 0) or 0)
actual_height = int(stream.get("height", 0) or 0)
if (actual_width, actual_height) != (expected_width, expected_height):
    errors.append(
        f"Video dimensions mismatch: expected {expected_width}x{expected_height}, "
        f"got {actual_width}x{actual_height}"
    )

rate = str(stream.get("r_frame_rate", "0/1"))
try:
    num, den = rate.split("/", 1)
    actual_fps = float(num) / float(den)
except Exception:
    actual_fps = 0.0
if not math.isclose(actual_fps, expected_fps, rel_tol=0, abs_tol=1e-6):
    errors.append(f"Video FPS mismatch: expected {expected_fps}, got {actual_fps}")

expected_count = frame_end - frame_start + 1
nb_frames_raw = stream.get("nb_frames")
if nb_frames_raw not in (None, "N/A", ""):
    try:
        nb_frames = int(nb_frames_raw)
        if nb_frames != expected_count:
            errors.append(
                f"Video frame count mismatch: expected {expected_count}, got {nb_frames}"
            )
    except ValueError:
        errors.append(f"Could not parse ffprobe nb_frames={nb_frames_raw!r}")

duration_raw = fmt.get("duration")
actual_duration = None
if duration_raw not in (None, "N/A", ""):
    try:
        actual_duration = float(duration_raw)
        expected_duration = expected_count / expected_fps
        if abs(actual_duration - expected_duration) > (1.0 / expected_fps + 0.02):
            errors.append(
                f"Video duration mismatch: expected about {expected_duration:.6f}s, "
                f"got {actual_duration:.6f}s"
            )
    except ValueError:
        errors.append(f"Could not parse ffprobe duration={duration_raw!r}")

report = {
    "result": "PASS" if not errors else "FAIL",
    "errors": errors,
    "frames": {
        "start": frame_start,
        "end": frame_end,
        "count": expected_count,
        "padding": padding,
        "missing": missing,
        "extra": extra,
    },
    "video": {
        "codec": stream.get("codec_name"),
        "width": actual_width,
        "height": actual_height,
        "fps": actual_fps,
        "nbFrames": stream.get("nb_frames"),
        "duration": actual_duration,
        "size": fmt.get("size"),
    },
}
report_path.parent.mkdir(parents=True, exist_ok=True)
report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
print(json.dumps(report, indent=2))

if errors:
    raise SystemExit(1)
