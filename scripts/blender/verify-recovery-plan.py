#!/usr/bin/env python3
import json
import pathlib
import sys

if len(sys.argv) != 4:
    raise SystemExit(
        "Usage: verify-recovery-plan.py <source-plan.json> "
        "<current-plan.json> <report.json>"
    )

source_path = pathlib.Path(sys.argv[1])
current_path = pathlib.Path(sys.argv[2])
report_path = pathlib.Path(sys.argv[3])

source = json.loads(source_path.read_text(encoding="utf-8"))
current = json.loads(current_path.read_text(encoding="utf-8"))
s = source["derived"]
c = current["derived"]
errors = []

if bool(s.get("validation_only", False)):
    errors.append("Recovery source is a validation-only run, not a production frame set.")

if source.get("projectConfig") != current.get("projectConfig"):
    errors.append(
        "Source projectConfig differs from the current projectConfig. "
        "Recovery would risk mixing frames with changed art/configuration."
    )

keys = [
    "project_slug",
    "blend_file",
    "video_file",
    "blender_version",
    "config_frame_start",
    "config_frame_end",
    "config_frame_count",
    "frame_start",
    "frame_end",
    "frame_count",
    "frame_padding",
    "fps",
    "width",
    "height",
    "render_mode",
    "simulation_policy",
    "video_codec",
    "video_preset",
    "video_crf",
    "video_pix_fmt",
    "fidelity_rmse_max",
    "fidelity_changed_fraction_max",
]
mismatches = {}
for key in keys:
    if s.get(key) != c.get(key):
        mismatches[key] = {"source": s.get(key), "current": c.get(key)}
if mismatches:
    errors.append(f"Derived render contract mismatch: {mismatches}")

report = {
    "result": "PASS" if not errors else "FAIL",
    "errors": errors,
    "sourceProject": s.get("project_slug"),
    "sourceRenderMode": s.get("render_mode"),
    "sourceFrameRange": [s.get("frame_start"), s.get("frame_end")],
    "mismatches": mismatches,
}
report_path.parent.mkdir(parents=True, exist_ok=True)
report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
print(json.dumps(report, indent=2))

if errors:
    raise SystemExit(1)
