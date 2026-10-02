#!/usr/bin/env python3
import re
import subprocess
import sys
from pathlib import Path

if len(sys.argv) != 5:
    raise SystemExit("Usage: verify_fidelity.py <reference.png> <actual.png> <frame-number> <report-file>")

ref = Path(sys.argv[1])
actual = Path(sys.argv[2])
frame = sys.argv[3]
report = Path(sys.argv[4])

if not ref.is_file() or not actual.is_file():
    raise SystemExit("Reference or actual frame is missing.")

report.parent.mkdir(parents=True, exist_ok=True)

def run_capture(cmd):
    p = subprocess.run(cmd, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return (p.stdout + "\n" + p.stderr).strip(), p.returncode

dims, _ = run_capture(["identify", "-format", "%w %h", str(ref)])
parts = dims.strip().split()
if len(parts) < 2:
    raise SystemExit(f"Could not read image dimensions: {dims!r}")
width, height = int(parts[0]), int(parts[1])
total_pixels = width * height

ae_raw, _ = run_capture(["compare", "-metric", "AE", str(ref), str(actual), "null:"])
rmse_raw, _ = run_capture(["compare", "-metric", "RMSE", str(ref), str(actual), "null:"])

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
passed = exact or (rmse <= 2e-5 and fraction <= 1e-4)
mode = "exact" if exact else "strict-tolerance"

psnr_raw, _ = run_capture([
    "ffmpeg", "-v", "info", "-i", str(ref), "-i", str(actual),
    "-lavfi", "psnr", "-f", "null", "-"
])
ssim_raw, _ = run_capture([
    "ffmpeg", "-v", "info", "-i", str(ref), "-i", str(actual),
    "-lavfi", "ssim", "-f", "null", "-"
])
psnr_line = next((x for x in reversed(psnr_raw.splitlines()) if "average:" in x and "PSNR" in x), "")
ssim_line = next((x for x in reversed(ssim_raw.splitlines()) if "All:" in x and "SSIM" in x), "")

with report.open("a", encoding="utf-8") as f:
    f.write(f"frame={frame}\n")
    f.write(f"dimensions={width}x{height}\n")
    f.write(f"mode={mode}\n")
    f.write(f"changed_pixels={changed_pixels}\n")
    f.write(f"changed_fraction={fraction:.12g}\n")
    f.write(f"rmse_normalized={rmse:.12g}\n")
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
