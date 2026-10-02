#!/usr/bin/env python3
import argparse
import json
import os
import pathlib
import re
import subprocess
import sys
import tempfile

def run(cmd):
    proc = subprocess.run(cmd, text=True, capture_output=True)
    return proc.returncode, proc.stdout, proc.stderr

def parse_loudnorm_json(stderr):
    matches = re.findall(r"\{\s*\"input_i\".*?\}", stderr, re.S)
    if not matches:
        raise RuntimeError("Could not parse FFmpeg loudnorm JSON output.")
    return json.loads(matches[-1])

parser = argparse.ArgumentParser()
parser.add_argument("config")
parser.add_argument("media")
parser.add_argument("report")
args = parser.parse_args()

config_path = pathlib.Path(args.config)
media_path = pathlib.Path(args.media)
report_path = pathlib.Path(args.report)

cfg = json.loads(config_path.read_text(encoding="utf-8"))
render = cfg.get("render", {})
master_cfg = render.get("audioMastering", {})
enabled = bool(master_cfg.get("enabled", False))

report = {
    "schemaVersion": 1,
    "enabled": enabled,
    "result": "NOT_ENABLED",
    "input": str(media_path),
    "requirements": master_cfg,
    "analysis": {},
}

report_path.parent.mkdir(parents=True, exist_ok=True)

if not enabled:
    report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, indent=2))
    raise SystemExit(0)

if not media_path.is_file() or media_path.stat().st_size <= 0:
    raise SystemExit(f"Media file is missing or empty: {media_path}")

target_i = float(master_cfg.get("targetIntegratedLufs", -15.0))
target_tp = float(master_cfg.get("targetTruePeakDbfs", -1.5))
target_lra = float(master_cfg.get("targetLraLu", 7.0))
sample_rate = int(master_cfg.get("sampleRateHz", 48000))
codec = str(master_cfg.get("codec", "aac"))
bitrate_kbps = int(master_cfg.get("bitrateKbps", 320))

if codec != "aac":
    raise SystemExit("audioMastering currently supports codec=aac only.")
if not (-30.0 <= target_i <= -5.0):
    raise SystemExit("audioMastering.targetIntegratedLufs is outside a sensible range.")
if not (-9.0 <= target_tp <= -0.1):
    raise SystemExit("audioMastering.targetTruePeakDbfs is outside a sensible range.")
if not (1.0 <= target_lra <= 20.0):
    raise SystemExit("audioMastering.targetLraLu is outside a sensible range.")
if not (8000 <= sample_rate <= 192000):
    raise SystemExit("audioMastering.sampleRateHz is outside a sensible range.")
if not (64 <= bitrate_kbps <= 512):
    raise SystemExit("audioMastering.bitrateKbps is outside a sensible range.")

first_filter = (
    f"loudnorm=I={target_i}:TP={target_tp}:LRA={target_lra}:"
    "print_format=json"
)
code, _, err = run([
    "ffmpeg", "-hide_banner", "-nostats", "-i", str(media_path),
    "-map", "0:a:0", "-af", first_filter, "-f", "null", "-"
])
if code != 0:
    raise SystemExit("FFmpeg loudnorm analysis pass failed.")

stats = parse_loudnorm_json(err)
report["analysis"] = stats

second_filter = (
    f"loudnorm=I={target_i}:TP={target_tp}:LRA={target_lra}:"
    f"measured_I={stats['input_i']}:"
    f"measured_LRA={stats['input_lra']}:"
    f"measured_TP={stats['input_tp']}:"
    f"measured_thresh={stats['input_thresh']}:"
    f"offset={stats['target_offset']}:"
    "linear=true:print_format=summary"
)

fd, tmp_name = tempfile.mkstemp(
    prefix=media_path.stem + ".mastered.",
    suffix=media_path.suffix,
    dir=str(media_path.parent),
)
os.close(fd)
tmp_path = pathlib.Path(tmp_name)

try:
    code, _, second_err = run([
        "ffmpeg", "-hide_banner", "-nostats", "-y",
        "-i", str(media_path),
        "-map", "0:v:0", "-map", "0:a:0",
        "-map_metadata", "0",
        "-c:v", "copy",
        "-af", second_filter,
        "-ar", str(sample_rate),
        "-c:a", codec,
        "-b:a", f"{bitrate_kbps}k",
        "-movflags", "+faststart",
        str(tmp_path),
    ])
    if code != 0:
        sys.stderr.write(second_err)
        raise SystemExit("FFmpeg loudnorm mastering pass failed.")

    if not tmp_path.is_file() or tmp_path.stat().st_size <= 0:
        raise SystemExit("Mastered media was not created correctly.")

    os.replace(tmp_path, media_path)
finally:
    if tmp_path.exists():
        tmp_path.unlink()

report["result"] = "MASTERED"
report["outputBytes"] = media_path.stat().st_size
report["mastering"] = {
    "targetIntegratedLufs": target_i,
    "targetTruePeakDbfs": target_tp,
    "targetLraLu": target_lra,
    "sampleRateHz": sample_rate,
    "codec": codec,
    "bitrateKbps": bitrate_kbps,
}
report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
print(json.dumps(report, indent=2))
