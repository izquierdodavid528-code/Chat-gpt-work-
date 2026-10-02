#!/usr/bin/env python3
import json
import math
import pathlib
import sys

if len(sys.argv) != 5:
    raise SystemExit(
        "Usage: verify-master-contract.py <render-plan.json> "
        "<master-manifest.json> <master-blend.sha256> <report.json>"
    )

plan_path = pathlib.Path(sys.argv[1])
manifest_path = pathlib.Path(sys.argv[2])
sha_path = pathlib.Path(sys.argv[3])
report_path = pathlib.Path(sys.argv[4])

plan = json.loads(plan_path.read_text(encoding="utf-8"))
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
derived = plan["derived"]
cfg = plan["projectConfig"]
errors = []

expected_version = str(derived["blender_version"])
actual_version = str(manifest.get("blenderVersion", ""))
if not actual_version.startswith(expected_version):
    errors.append(f"Blender version mismatch: expected {expected_version}, got {actual_version}")

expected_engine = str(cfg.get("renderEngine", "")).strip()
if expected_engine and manifest.get("renderEngine") != expected_engine:
    errors.append(f"Render engine mismatch: expected {expected_engine}, got {manifest.get('renderEngine')}")

for key, manifest_key in (("config_frame_start", "frameStart"), ("config_frame_end", "frameEnd")):
    if int(derived[key]) != int(manifest.get(manifest_key, -1)):
        errors.append(f"{manifest_key} mismatch: expected {derived[key]}, got {manifest.get(manifest_key)}")

expected_fps = float(derived["fps"])
actual_fps = float(manifest.get("fps", 0.0))
if not math.isclose(expected_fps, actual_fps, rel_tol=0, abs_tol=1e-6):
    errors.append(f"FPS mismatch: expected {expected_fps}, got {actual_fps}")

resolution = manifest.get("resolution", {})
pct = int(resolution.get("percentage", 0))
actual_width = round(int(resolution.get("x", 0)) * pct / 100)
actual_height = round(int(resolution.get("y", 0)) * pct / 100)
if (actual_width, actual_height) != (int(derived["width"]), int(derived["height"])):
    errors.append(
        f"Resolution mismatch: expected {derived['width']}x{derived['height']}, "
        f"got {actual_width}x{actual_height}"
    )

expected_sha = sha_path.read_text(encoding="utf-8").split()[0].strip()
actual_sha = str(manifest.get("blendSha256", "")).strip()
if not expected_sha or expected_sha != actual_sha:
    errors.append(f"Master SHA mismatch: sha256 file={expected_sha!r}, manifest={actual_sha!r}")

if str(manifest.get("simulationPolicy", "")) != str(derived["simulation_policy"]):
    errors.append("Simulation policy mismatch between plan and audited master.")

if manifest.get("externalDependenciesRemaining"):
    errors.append("Audited master still has external dependencies.")

report = {
    "result": "PASS" if not errors else "FAIL",
    "errors": errors,
    "expected": {
        "blenderVersion": expected_version,
        "renderEngine": expected_engine or None,
        "frameStart": int(derived["config_frame_start"]),
        "frameEnd": int(derived["config_frame_end"]),
        "fps": expected_fps,
        "width": int(derived["width"]),
        "height": int(derived["height"]),
        "simulationPolicy": derived["simulation_policy"],
        "blendSha256": expected_sha,
    },
    "actual": {
        "blenderVersion": actual_version,
        "renderEngine": manifest.get("renderEngine"),
        "frameStart": manifest.get("frameStart"),
        "frameEnd": manifest.get("frameEnd"),
        "fps": actual_fps,
        "width": actual_width,
        "height": actual_height,
        "simulationPolicy": manifest.get("simulationPolicy"),
        "blendSha256": actual_sha,
    },
}
report_path.parent.mkdir(parents=True, exist_ok=True)
report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
print(json.dumps(report, indent=2))
if errors:
    raise SystemExit(1)
