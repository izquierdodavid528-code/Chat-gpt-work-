#!/usr/bin/env python3
import json
import math
import pathlib
import sys

if len(sys.argv) not in {4, 5}:
    raise SystemExit("Usage: verify-delivery.py <project.config.json> <video-probe.json> <report.json> [--validation]")

config_path = pathlib.Path(sys.argv[1])
probe_path = pathlib.Path(sys.argv[2])
report_path = pathlib.Path(sys.argv[3])
validation_mode = len(sys.argv) == 5 and sys.argv[4] == "--validation"

cfg = json.loads(config_path.read_text(encoding="utf-8"))
probe = json.loads(probe_path.read_text(encoding="utf-8"))
render_cfg = cfg.get("render", {})

errors = []
streams = probe.get("streams", [])
video_streams = [s for s in streams if s.get("codec_type") == "video"]
audio_streams = [s for s in streams if s.get("codec_type") == "audio"]
fmt = probe.get("format", {})

if not video_streams:
    errors.append("Final output has no video stream.")
video = video_streams[0] if video_streams else {}

codec = str(video.get("codec_name") or "")
expected_codec = str(render_cfg.get("expectedCodec") or "h264")
if expected_codec and codec != expected_codec:
    errors.append(f"Video codec mismatch: expected {expected_codec}, got {codec or 'none'}")

width = int(video.get("width") or 0)
height = int(video.get("height") or 0)
if width <= 0 or height <= 0:
    errors.append(f"Invalid video dimensions: {width}x{height}")

expected_width = render_cfg.get("expectedWidth")
expected_height = render_cfg.get("expectedHeight")
if expected_width is not None and width != int(expected_width):
    errors.append(f"Width mismatch: expected {expected_width}, got {width}")
if expected_height is not None and height != int(expected_height):
    errors.append(f"Height mismatch: expected {expected_height}, got {height}")

fps_raw = str(video.get("r_frame_rate") or "0/1")
try:
    num, den = fps_raw.split("/", 1)
    fps = float(num) / float(den)
except Exception:
    fps = 0.0
if fps <= 0:
    errors.append(f"Invalid frame rate: {fps_raw}")

expected_fps = render_cfg.get("expectedFps")
if expected_fps is not None and not math.isclose(fps, float(expected_fps), rel_tol=0, abs_tol=1e-6):
    errors.append(f"FPS mismatch: expected {expected_fps}, got {fps}")

duration_raw = fmt.get("duration")
try:
    duration = float(duration_raw)
except Exception:
    duration = 0.0
min_duration = float(render_cfg.get("minDurationSeconds", 0.03))
if validation_mode:
    if duration <= 0:
        errors.append("Validation output duration is invalid or empty.")
else:
    if duration < min_duration:
        errors.append(f"Output duration too short: {duration}s < {min_duration}s")

require_audio = bool(render_cfg.get("requireAudio", False))
if require_audio and not audio_streams:
    errors.append("Audio stream required by project.config.json but missing.")

size_raw = fmt.get("size")
try:
    size_bytes = int(size_raw)
except Exception:
    size_bytes = 0
if size_bytes <= 0:
    errors.append("Output file size is invalid or empty.")

report = {
    "result": "PASS" if not errors else "FAIL",
    "errors": errors,
    "video": {
        "codec": codec,
        "width": width,
        "height": height,
        "fps": fps,
        "durationSeconds": duration,
        "sizeBytes": size_bytes,
    },
    "audioStreams": len(audio_streams),
    "validationMode": validation_mode,
    "requirements": {
        "expectedCodec": expected_codec,
        "expectedWidth": expected_width,
        "expectedHeight": expected_height,
        "expectedFps": expected_fps,
        "requireAudio": require_audio,
        "minDurationSeconds": min_duration,
    },
}

report_path.parent.mkdir(parents=True, exist_ok=True)
report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
print(json.dumps(report, indent=2))

if errors:
    raise SystemExit(1)
