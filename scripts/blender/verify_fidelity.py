#!/usr/bin/env python3
import os
import re
import subprocess
import sys
from pathlib import Path

if len(sys.argv) != 5:
    raise SystemExit(
        "Usage: verify_fidelity.py <reference.png> <actual.png> "
        "<frame-number> <report-file>"
    )

ref = Path(sys.argv[1])
actual = Path(sys.argv[2])
frame = sys.argv[3]
report = Path(sys.argv[4])

if not ref.is_file() or not actual.is_file():
    raise SystemExit("Reference or actual frame is missing.")

report.parent.mkdir(parents=True, exist_ok=True)

rmse_max = float(os.environ.get("FIDELITY_RMSE_MAX", "2e-5"))
changed_fraction_max = float(
    os.environ.get("FIDELITY_CHANGED_FRACTION_MAX", "1e-4")
)
if not 0 <= rmse_max <= 1:
    raise SystemExit("FIDELITY_RMSE_MAX must be between 0 and 1.")
if not 0 <= changed_fraction_max <= 1:
    raise SystemExit(
        "FIDELITY_CHANGED_FRACTION_MAX must be between 0 and 1."
    )

def run_capture(cmd):
    p = subprocess.run(
        cmd,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    return (p.stdout + "\n" + p.stderr).strip(), p.returncode

def dimensions(path):
    raw, rc = run_capture(["identify", "-format", "%w %h", str(path)])
    parts = raw.strip().split()
    if rc != 0 or len(parts) < 2:
        raise SystemExit(f"Could not read image dimensions for {path}: {raw!r}")
    return int(parts[0]), int(parts[1])

ref_width, ref_height = dimensions(ref)
actual_width, actual_height = dimensions(actual)
if (ref_width, ref_height) != (actual_width, actual_height):
    raise SystemExit(
        "Fidelity comparison requires identical dimensions: "
        f"reference={ref_width}x{ref_height}, "
        f"actual={actual_width}x{actual_height}"
    )

width, height = ref_width, ref_height
total_pixels = width * height

ae_raw, ae_rc = run_capture(
    ["compare", "-metric", "AE", str(ref), str(actual), "null:"]
)
rmse_raw, rmse_rc = run_capture(
    ["compare", "-metric", "RMSE", str(ref), str(actual), "null:"]
)
# ImageMagick compare returns 0 for identical images and 1 when pixels differ.
# Values >1 mean the comparison itself failed and must never be treated as QA data.
if ae_rc not in (0, 1):
    raise SystemExit(f"ImageMagick AE comparison failed: {ae_raw!r}")
if rmse_rc not in (0, 1):
    raise SystemExit(f"ImageMagick RMSE comparison failed: {rmse_raw!r}")

m_ae = re.search(r"([0-9]+(?:\.[0-9]+)?)", ae_raw)
if not m_ae:
    raise SystemExit(f"Could not parse AE metric: {ae_raw!r}")
changed_pixels = int(round(float(m_ae.group(1))))

m_rmse = re.search(r"\(([-+0-9.eE]+)\)", rmse_raw)
if m_rmse:
    rmse = float(m_rmse.group(1))
else:
    m_rmse = re.search(r"([-+0-9.eE]+)", rmse_raw)
    if not m_rmse:
        raise SystemExit(f"Could not parse RMSE metric: {rmse_raw!r}")
    rmse = float(m_rmse.group(1))

fraction = changed_pixels / total_pixels
exact = changed_pixels == 0 and rmse == 0.0
passed = exact or (
    rmse <= rmse_max and fraction <= changed_fraction_max
)
mode = "exact" if exact else "strict-tolerance"

psnr_raw, _ = run_capture([
    "ffmpeg", "-v", "info", "-i", str(ref), "-i", str(actual),
    "-lavfi", "psnr", "-f", "null", "-"
])
ssim_raw, _ = run_capture([
    "ffmpeg", "-v", "info", "-i", str(ref), "-i", str(actual),
    "-lavfi", "ssim", "-f", "null", "-"
])
psnr_line = next(
    (x for x in reversed(psnr_raw.splitlines()) if "average:" in x and "PSNR" in x),
    "",
)
ssim_line = next(
    (x for x in reversed(ssim_raw.splitlines()) if "All:" in x and "SSIM" in x),
    "",
)

with report.open("a", encoding="utf-8") as f:
    f.write(f"frame={frame}\n")
    f.write(f"dimensions={width}x{height}\n")
    f.write(f"mode={mode}\n")
    f.write(f"changed_pixels={changed_pixels}\n")
    f.write(f"changed_fraction={fraction:.12g}\n")
    f.write(f"rmse_normalized={rmse:.12g}\n")
    f.write(f"rmse_limit={rmse_max:.12g}\n")
    f.write(f"changed_fraction_limit={changed_fraction_max:.12g}\n")
    f.write(f"psnr={psnr_line}\n")
    f.write(f"ssim={ssim_line}\n")
    f.write(f"result={'PASS' if passed else 'FAIL'}\n\n")

print(
    f"frame {frame}: {'PASS' if passed else 'FAIL'} "
    f"(mode={mode}, changed_pixels={changed_pixels}, "
    f"changed_fraction={fraction:.12g}, rmse={rmse:.12g})"
)

if not passed:
    raise SystemExit(1)
